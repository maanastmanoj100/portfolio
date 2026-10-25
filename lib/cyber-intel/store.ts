import { promises as fs } from "node:fs";
import path from "node:path";
import type { IntelItem, SourceHealth } from "./types";
import { activeSources } from "./sources";
import { ingestSources } from "./ingest";

/**
 * Append-only archive.
 *
 * News feeds only expose the last few dozen entries, so "history" is whatever
 * we have observed. Records are stored as NDJSON on disk and deduplicated by
 * their canonical URL hash, which means repeated ingestion is cheap and the
 * archive keeps growing across restarts instead of resetting to the current
 * feed window.
 *
 * If the filesystem is not writable (read-only container, serverless), the
 * store degrades to memory-only and reports `persistent: false` rather than
 * failing the page.
 */

/**
 * Retention is bounded by record count, not by age, so the archive actually
 * accumulates history instead of silently dropping older years. The age cutoff
 * only exists to discard absurd future/past dates from a malformed feed.
 */
const MAX_AGE_DAYS = 3650;
const MAX_RETAINED = 3000;

interface StoreState {
  items: Map<string, IntelItem>;
  loaded: boolean;
  loading: Promise<void> | null;
  inflight: Promise<void> | null;
  lastIngestAt: string | null;
  sourceFetchedAt: Map<string, string>;
  health: SourceHealth[];
  persistent: boolean;
  lastError: string | null;
  version: number;
  cache: { version: number; items: IntelItem[] } | null;
}

const globalForStore = globalThis as unknown as { __cyberIntelStore?: StoreState };

const store: StoreState =
  globalForStore.__cyberIntelStore ??
  (globalForStore.__cyberIntelStore = {
    items: new Map(),
    loaded: false,
    loading: null,
    inflight: null,
    lastIngestAt: null,
    sourceFetchedAt: new Map(),
    health: [],
    persistent: true,
    lastError: null,
    version: 0,
    cache: null,
  });

export function dataDirectory(): string {
  return process.env.CYBER_INTEL_DATA_DIR ?? path.join(process.cwd(), ".data", "cyber-intel");
}

function itemsFile(): string {
  return path.join(dataDirectory(), "items.ndjson");
}

function stateFile(): string {
  return path.join(dataDirectory(), "state.json");
}

function primaryDate(item: IntelItem): string {
  return item.publishedAt ?? item.advisoryAt ?? item.incidentAt ?? item.firstSeenAt;
}

function mergeItem(existing: IntelItem, incoming: IntelItem): IntelItem {
  const newer = (a: string | null, b: string | null) => {
    if (!a) return b;
    if (!b) return a;
    return a >= b ? a : b;
  };

  // A CVE first seen through NVD may later arrive through the KEV catalog,
  // which is the stronger statement ("known exploited"). Upgrade rather than
  // keep two records.
  const upgradedToExploit =
    existing.category === "vulnerability" && incoming.category === "exploit";

  return {
    ...existing,
    summary: existing.summary.length >= incoming.summary.length ? existing.summary : incoming.summary,
    category: upgradedToExploit ? "exploit" : existing.category,
    categoryBasis: upgradedToExploit ? incoming.categoryBasis : existing.categoryBasis,
    publishedAt: existing.publishedAt ?? incoming.publishedAt,
    incidentAt: existing.incidentAt ?? incoming.incidentAt,
    advisoryAt: existing.advisoryAt ?? incoming.advisoryAt,
    updatedAt: newer(existing.updatedAt, incoming.updatedAt),
    geo: existing.geo ?? incoming.geo,
    attribution: existing.attribution ?? incoming.attribution,
    identifiers: [...new Set([...existing.identifiers, ...incoming.identifiers])].slice(0, 8),
    tags: [...new Set([...existing.tags, ...incoming.tags])].slice(0, 8),
  };
}

function parseLines(raw: string): IntelItem[] {
  const items: IntelItem[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed) as IntelItem;
      if (parsed && typeof parsed.id === "string" && typeof parsed.url === "string") {
        items.push(parsed);
      }
    } catch {
      // A partially written line (crash during append) is skipped, not fatal.
    }
  }
  return items;
}

function prune(items: IntelItem[]): IntelItem[] {
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 3600_000;
  const fresh = items.filter((item) => {
    const time = Date.parse(primaryDate(item));
    return Number.isNaN(time) || time >= cutoff;
  });
  const sorted = fresh.sort((a, b) => primaryDate(b).localeCompare(primaryDate(a)));
  return sorted.slice(0, MAX_RETAINED);
}

async function rewrite(items: IntelItem[]): Promise<void> {
  const target = itemsFile();
  const temp = `${target}.tmp`;
  const body = items.map((item) => JSON.stringify(item)).join("\n");
  await fs.writeFile(temp, body ? `${body}\n` : "", "utf8");
  await fs.rename(temp, target);
}

async function load(): Promise<void> {
  try {
    await fs.mkdir(dataDirectory(), { recursive: true });
  } catch {
    store.persistent = false;
  }

  try {
    const raw = await fs.readFile(itemsFile(), "utf8");
    const parsed = parseLines(raw);
    const retained = prune(parsed);
    for (const item of retained) {
      if (!store.items.has(item.id)) store.items.set(item.id, item);
    }
    if (retained.length !== parsed.length) {
      await rewrite(retained).catch(() => {
        store.persistent = false;
      });
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      store.persistent = false;
      store.lastError = error instanceof Error ? error.message : "archive read failed";
    }
  }

  try {
    const raw = await fs.readFile(stateFile(), "utf8");
    const parsed = JSON.parse(raw) as {
      lastIngestAt?: string | null;
      health?: SourceHealth[];
      sourceFetchedAt?: Record<string, string>;
    };
    store.lastIngestAt = parsed.lastIngestAt ?? null;
    store.health = Array.isArray(parsed.health) ? parsed.health : [];
    store.sourceFetchedAt = new Map(Object.entries(parsed.sourceFetchedAt ?? {}));
  } catch {
    // Missing or corrupt state file only costs us a refresh.
  }

  store.version += 1;
  store.cache = null;
}

async function persistState(): Promise<void> {
  try {
    await fs.mkdir(dataDirectory(), { recursive: true });
    await fs.writeFile(
      stateFile(),
      JSON.stringify(
        {
          lastIngestAt: store.lastIngestAt,
          health: store.health,
          sourceFetchedAt: Object.fromEntries(store.sourceFetchedAt),
        },
        null,
        2,
      ),
      "utf8",
    );
  } catch {
    store.persistent = false;
  }
}

async function appendItems(items: IntelItem[]): Promise<void> {
  if (items.length === 0) return;
  try {
    await fs.mkdir(dataDirectory(), { recursive: true });
    await fs.appendFile(
      itemsFile(),
      `${items.map((item) => JSON.stringify(item)).join("\n")}\n`,
      "utf8",
    );
  } catch (error) {
    store.persistent = false;
    store.lastError = error instanceof Error ? error.message : "archive write failed";
  }
}

export async function ensureLoaded(): Promise<void> {
  if (store.loaded) return;
  if (!store.loading) {
    store.loading = load()
      .catch(() => {
        store.lastError = "archive load failed";
      })
      .finally(() => {
        store.loaded = true;
        store.loading = null;
      });
  }
  await store.loading;
}

function dueSources(now = Date.now()) {
  return activeSources().filter((source) => {
    const last = store.sourceFetchedAt.get(source.id);
    if (!last) return true;
    const age = now - Date.parse(last);
    return Number.isNaN(age) || age >= source.revalidateSeconds * 1000;
  });
}

async function runIngest(): Promise<void> {
  const due = dueSources();
  if (due.length === 0) return;

  const { items, health } = await ingestSources(due);
  const now = new Date().toISOString();

  const appended: IntelItem[] = [];
  for (const incoming of items) {
    const existing = store.items.get(incoming.id);
    if (!existing) {
      store.items.set(incoming.id, incoming);
      appended.push(incoming);
      continue;
    }
    const merged = mergeItem(existing, incoming);
    if (JSON.stringify(merged) !== JSON.stringify(existing)) {
      store.items.set(incoming.id, merged);
      appended.push(merged);
    }
  }

  // Keep the previous health entry for sources that were not due this round,
  // and replace the ones we just attempted.
  const attempted = new Set(health.map((entry) => entry.id));
  store.health = [
    ...store.health.filter((entry) => !attempted.has(entry.id)),
    ...health,
  ].sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of health) {
    if (entry.fetchedAt) store.sourceFetchedAt.set(entry.id, entry.fetchedAt);
  }

  store.lastIngestAt = now;
  store.version += 1;
  store.cache = null;

  await appendItems(appended);
  await persistState();

  if (store.items.size > MAX_RETAINED * 1.5) {
    const retained = prune([...store.items.values()]);
    store.items = new Map(retained.map((item) => [item.id, item]));
    store.version += 1;
    store.cache = null;
    await rewrite(retained).catch(() => {
      store.persistent = false;
    });
  }
}

/**
 * Refreshes sources whose `revalidateSeconds` window has elapsed.
 *
 * `maxWaitMs` bounds how long a render waits: a cold archive on a slow network
 * should not hold the page for fifteen seconds. When the budget is exceeded the
 * ingest keeps running and the next request picks up the result.
 */
export async function ensureFresh(maxWaitMs = 8000): Promise<void> {
  await ensureLoaded();
  if (dueSources().length === 0) return;

  if (!store.inflight) {
    store.inflight = runIngest()
      .catch((error) => {
        store.lastError = error instanceof Error ? error.message : "ingest failed";
      })
      .finally(() => {
        store.inflight = null;
      });
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([
    store.inflight,
    new Promise<void>((resolve) => {
      timer = setTimeout(resolve, maxWaitMs);
    }),
  ]);
  if (timer) clearTimeout(timer);
}

export interface LoadedArchive {
  items: IntelItem[];
  persistent: boolean;
  path: string;
  lastIngestAt: string | null;
  health: SourceHealth[];
  version: number;
  lastError: string | null;
  ingesting: boolean;
}

export async function loadArchive(): Promise<LoadedArchive> {
  await ensureLoaded();

  if (!store.cache || store.cache.version !== store.version) {
    store.cache = { version: store.version, items: [...store.items.values()] };
  }

  return {
    items: store.cache.items,
    persistent: store.persistent,
    path: itemsFile(),
    lastIngestAt: store.lastIngestAt,
    health: store.health,
    version: store.version,
    lastError: store.lastError,
    ingesting: store.inflight !== null,
  };
}
