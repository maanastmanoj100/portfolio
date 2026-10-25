import { randomUUID } from "node:crypto";
import type { IngestRun, SourceHealth, SourceState } from "../types";
import type { FetcherKind, SourceDef } from "../sources";
import { activeSources, SOURCES } from "../sources";
import { describeFetchError, FetchError, safeFetch } from "../security";
import { getRepository } from "../storage";
import type { IntelRepository } from "../storage/repository";
import { fetchCsk } from "./fetchers/csk";
import { fetchKev } from "./fetchers/kev";
import { fetchNvd } from "./fetchers/nvd";
import { fetchRansomware } from "./fetchers/ransomware";
import { fetchRss } from "./fetchers/rss";
import type { FetchContext, FetchOutcome } from "./types";

/**
 * Ingestion runner.
 *
 * Guarantees:
 *
 *  - Idempotent: the repository dedupes on canonical URL, publisher id and
 *    same-source headline, so running twice never creates a second record.
 *  - Bounded: at most four concurrent sources, two retries per source, a hard
 *    timeout per request and a byte cap per response.
 *  - Scheduled: each source carries `nextAttemptAt`, so a second worker (or a
 *    second cron invocation) sees that nothing is due and exits immediately.
 *  - Exclusive: a database lock prevents two processes from ingesting at once.
 *  - Observable: every attempt updates durable source state and every run is
 *    recorded with counts and a sanitised note.
 */

export const MAX_AGE_DAYS = 3650;
export const MAX_RETAINED = 3000;

const LOCK_NAME = "cyber-intel-ingest";
const LOCK_TTL_SECONDS = 300;
const CONCURRENCY = 4;
const MAX_RETRIES = 2;
const USER_AGENT =
  "CyberNexusCyberIntel/1.0 (+https://github.com/maanastmanoj100/portfolio)";

const FETCHERS: Record<FetcherKind, (source: SourceDef, ctx: FetchContext) => Promise<FetchOutcome>> = {
  rss: fetchRss,
  kev: fetchKev,
  nvd: fetchNvd,
  csk: fetchCsk,
  ransomware: fetchRansomware,
};

export interface IngestOptions {
  trigger: IngestRun["trigger"];
  /** Restrict the run to these source ids. Unknown ids are ignored. */
  sources?: string[];
  /** Ignore the schedule and attempt every selected source. */
  force?: boolean;
  now?: Date;
}

export interface IngestSummary {
  run: IngestRun;
  health: SourceHealth[];
  skipped: boolean;
  reason: "lock_held" | "not_due" | null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Bounded-concurrency map that preserves input order. */
async function runPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function retryDelay(error: unknown, attempt: number): number {
  const base =
    error instanceof FetchError && error.retryAfterMs
      ? error.retryAfterMs
      : 500 * 2 ** attempt;
  const jitter = 0.5 + Math.random() / 2;
  return Math.min(base * jitter, 10_000);
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const retryable = error instanceof FetchError ? error.retryable : false;
      if (!retryable || attempt === MAX_RETRIES) throw error;
      await sleep(retryDelay(error, attempt));
    }
  }
  throw lastError;
}

function nextAttemptAt(now: Date, source: SourceDef, failures: number): string {
  if (failures <= 0) {
    return new Date(now.getTime() + source.revalidateSeconds * 1000).toISOString();
  }
  const seconds = Math.min(
    source.revalidateSeconds * 2 ** Math.min(failures, 6),
    6 * 3600,
  );
  return new Date(now.getTime() + seconds * 1000).toISOString();
}

function buildContext(source: SourceDef, state: SourceState | null, now: Date): FetchContext {
  return {
    state,
    now,
    fetch: (url, options) =>
      safeFetch(url, {
        allowedHosts: source.hosts,
        timeoutMs: options?.timeoutMs ?? source.timeoutMs,
        maxBytes: options?.maxBytes ?? source.maxBytes,
        etag: options?.etag ?? null,
        lastModified: options?.lastModified ?? null,
        userAgent: USER_AGENT,
      }),
  };
}

interface SourceResult {
  source: SourceDef;
  state: SourceState;
  fetched: number;
  inserted: number;
  updated: number;
}

async function processSource(
  repository: IntelRepository,
  source: SourceDef,
  previous: SourceState | null,
  now: Date,
): Promise<SourceResult> {
  const startedAt = Date.now();

  try {
    const outcome = await withRetry(() =>
      FETCHERS[source.fetcher](source, buildContext(source, previous, now)),
    );
    const upsert = await repository.upsertItems(outcome.items);
    const durationMs = Date.now() - startedAt;

    const state: SourceState = {
      id: source.id,
      status: "ok",
      itemCount: outcome.items.length,
      fetchedAt: now.toISOString(),
      lastSuccessAt: now.toISOString(),
      error: null,
      consecutiveFailures: 0,
      nextAttemptAt: nextAttemptAt(now, source, 0),
      durationMs,
      etag: outcome.etag ?? previous?.etag ?? null,
      lastModified: outcome.lastModified ?? previous?.lastModified ?? null,
    };
    await repository.saveSourceStates([state]);

    return {
      source,
      state,
      fetched: outcome.items.length,
      inserted: upsert.inserted,
      updated: upsert.updated,
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const failures = (previous?.consecutiveFailures ?? 0) + 1;

    const state: SourceState = {
      id: source.id,
      status: "error",
      itemCount: previous?.itemCount ?? 0,
      fetchedAt: now.toISOString(),
      lastSuccessAt: previous?.lastSuccessAt ?? null,
      error: describeFetchError(error),
      consecutiveFailures: failures,
      nextAttemptAt: nextAttemptAt(now, source, failures),
      durationMs,
      etag: previous?.etag ?? null,
      lastModified: previous?.lastModified ?? null,
    };
    await repository.saveSourceStates([state]);

    return { source, state, fetched: 0, inserted: 0, updated: 0 };
  }
}

function isDue(state: SourceState | undefined, now: Date): boolean {
  if (!state?.nextAttemptAt) return true;
  const next = Date.parse(state.nextAttemptAt);
  return Number.isNaN(next) || next <= now.getTime();
}

export async function healthFromRepository(repository: IntelRepository): Promise<SourceHealth[]> {
  const states = new Map((await repository.sourceStates()).map((state) => [state.id, state]));

  return SOURCES.map((source) => {
    const state = states.get(source.id);
    if (source.status !== "ok" || !state) {
      return {
        id: source.id,
        name: source.name,
        kind: source.kind,
        status: "skipped",
        itemCount: 0,
        fetchedAt: null,
      } satisfies SourceHealth;
    }

    return {
      id: source.id,
      name: source.name,
      kind: source.kind,
      status: state.status,
      itemCount: state.itemCount,
      fetchedAt: state.fetchedAt,
      lastSuccessAt: state.lastSuccessAt,
      consecutiveFailures: state.consecutiveFailures,
      nextAttemptAt: state.nextAttemptAt,
      durationMs: state.durationMs,
      ...(state.error ? { error: state.error } : {}),
    } satisfies SourceHealth;
  });
}

function emptyRun(trigger: IngestRun["trigger"], now: Date, note: string): IngestRun {
  return {
    id: `run-${randomUUID()}`,
    trigger,
    startedAt: now.toISOString(),
    finishedAt: now.toISOString(),
    status: "skipped",
    sourcesAttempted: 0,
    sourcesOk: 0,
    sourcesFailed: 0,
    itemsFetched: 0,
    itemsNew: 0,
    itemsUpdated: 0,
    note,
  };
}

export async function runIngest(options: IngestOptions): Promise<IngestSummary> {
  const now = options.now ?? new Date();
  const repository = await getRepository();

  const requested = options.sources?.length ? new Set(options.sources) : null;
  const candidates = activeSources().filter((source) => !requested || requested.has(source.id));

  if (requested && candidates.length === 0) {
    throw new Error("No matching active sources");
  }

  const locked = await repository.acquireLock(LOCK_NAME, LOCK_TTL_SECONDS);
  if (!locked) {
    const previous = await repository.lastRun();
    return {
      run:
        previous ??
        emptyRun(options.trigger, now, "Another ingestion run is already in progress."),
      health: await healthFromRepository(repository),
      skipped: true,
      reason: "lock_held",
    };
  }

  const run: IngestRun = {
    id: `run-${randomUUID()}`,
    trigger: options.trigger,
    startedAt: now.toISOString(),
    finishedAt: null,
    status: "running",
    sourcesAttempted: 0,
    sourcesOk: 0,
    sourcesFailed: 0,
    itemsFetched: 0,
    itemsNew: 0,
    itemsUpdated: 0,
    note: null,
  };

  try {
    await repository.recordRun(run);

    const states = new Map((await repository.sourceStates()).map((state) => [state.id, state]));
    const due = candidates.filter((source) => options.force || isDue(states.get(source.id), now));

    if (due.length === 0) {
      run.status = "skipped";
      run.finishedAt = new Date().toISOString();
      run.note = "No sources were due for a refresh.";
      await repository.updateRun(run);
      return {
        run,
        health: await healthFromRepository(repository),
        skipped: true,
        reason: "not_due",
      };
    }

    run.sourcesAttempted = due.length;

    const results = await runPool(due, CONCURRENCY, (source) =>
      processSource(repository, source, states.get(source.id) ?? null, now),
    );

    const failed = results.filter((result) => result.state.status === "error");

    run.sourcesOk = results.length - failed.length;
    run.sourcesFailed = failed.length;
    run.itemsFetched = results.reduce((total, result) => total + result.fetched, 0);
    run.itemsNew = results.reduce((total, result) => total + result.inserted, 0);
    run.itemsUpdated = results.reduce((total, result) => total + result.updated, 0);
    run.status = failed.length === 0 ? "ok" : run.sourcesOk === 0 ? "error" : "partial";
    run.finishedAt = new Date().toISOString();
    run.note =
      failed.length > 0
        ? `${failed.length} source(s) failed: ${failed.map((result) => result.source.name).join(", ")}. Previously archived records were kept.`
        : null;

    await repository.updateRun(run);
    await repository.prune(MAX_AGE_DAYS, MAX_RETAINED);

    return {
      run,
      health: await healthFromRepository(repository),
      skipped: false,
      reason: null,
    };
  } catch (error) {
    run.status = "error";
    run.finishedAt = new Date().toISOString();
    run.note = "Ingestion run failed before completing.";
    await repository.updateRun(run).catch(() => undefined);
    throw error;
  } finally {
    await repository.releaseLock(LOCK_NAME).catch(() => undefined);
  }
}

/* ------------------------------------------------------------------ */
/* Request-triggered refresh                                           */
/* ------------------------------------------------------------------ */

let inflight: Promise<unknown> | null = null;
let lastScheduleCheck = 0;
let lastCheckFoundWork = false;

export function isIngesting(): boolean {
  return inflight !== null;
}

/**
 * Refreshes due sources, waiting at most `maxWaitMs`.
 *
 * A render should never hang on the network: when the budget is exhausted the
 * run keeps going and the next request sees the result. When nothing is due,
 * this returns without touching the network.
 */
export async function ensureFresh(maxWaitMs = 2500): Promise<void> {
  if (process.env.CYBER_INTEL_INGEST_ON_REQUEST === "0") return;

  const now = Date.now();
  // Avoid a database round-trip on every search keystroke.
  if (now - lastScheduleCheck < 10_000 && !lastCheckFoundWork) return;
  lastScheduleCheck = now;

  let repository: IntelRepository;
  try {
    repository = await getRepository();
  } catch {
    return;
  }

  const states = new Map((await repository.sourceStates()).map((state) => [state.id, state]));
  const due = activeSources().filter((source) => isDue(states.get(source.id), new Date(now)));
  lastCheckFoundWork = due.length > 0;
  if (!lastCheckFoundWork) return;

  if (!inflight) {
    inflight = runIngest({ trigger: "request" })
      .catch(() => undefined)
      .finally(() => {
        inflight = null;
      });
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([
    inflight,
    new Promise<void>((resolve) => {
      timer = setTimeout(resolve, maxWaitMs);
    }),
  ]);
  if (timer) clearTimeout(timer);
}
