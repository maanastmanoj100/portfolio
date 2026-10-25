import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IntelItem, SourceState } from "../types";
import type { IntelRepository } from "./repository";
import { createSqlRepository } from "./sql-repository";

/**
 * Driver selection.
 *
 *  - `CYBER_INTEL_DATABASE_URL` (or `DATABASE_URL`) pointing at Postgres is the
 *    durable archive. It survives redeploys and is the only mode suitable for a
 *    serverless deployment.
 *  - Otherwise a local SQLite file is used. It is fine for development and for
 *    a single long-lived machine, but it is explicitly reported as
 *    non-durable: a redeploy or an ephemeral container loses it.
 *  - If SQLite cannot be opened at all, the process falls back to an in-memory
 *    database so the page still renders with a clear warning instead of 500ing.
 *
 * The chosen driver is surfaced in every snapshot as `meta.archive.storage`.
 */

const globalForRepository = globalThis as unknown as {
  __cyberIntelRepository?: Promise<IntelRepository>;
};

export function getRepository(): Promise<IntelRepository> {
  if (!globalForRepository.__cyberIntelRepository) {
    globalForRepository.__cyberIntelRepository = createRepository().catch((error: unknown) => {
      globalForRepository.__cyberIntelRepository = undefined;
      throw error;
    });
  }
  return globalForRepository.__cyberIntelRepository;
}

/** Test hook: drops the cached repository so a new driver can be selected. */
export function resetRepositoryForTests(): void {
  globalForRepository.__cyberIntelRepository = undefined;
}

async function createRepository(): Promise<IntelRepository> {
  const postgresUrl = process.env.CYBER_INTEL_DATABASE_URL ?? process.env.DATABASE_URL ?? "";

  if (postgresUrl.startsWith("postgres://") || postgresUrl.startsWith("postgresql://")) {
    const { createPostgresClient } = await import("./postgres");
    const client = await createPostgresClient(postgresUrl);
    const repository = createSqlRepository(client, {
      info: { driver: "postgres", durable: true, location: databaseLabel(postgresUrl) },
      legacyImport: readLegacyArchive,
      legacyLabel: ".data/cyber-intel/items.ndjson",
    });
    await repository.init();
    await importLegacySourceState(repository);
    return repository;
  }

  const sqlitePath = resolveSqlitePath();

  try {
    if (sqlitePath !== ":memory:") {
      await fs.mkdir(path.dirname(sqlitePath), { recursive: true });
    }
    const { createSqliteClient } = await import("./sqlite");
    const client = await createSqliteClient({ path: sqlitePath });
    const repository = createSqlRepository(client, {
      info: {
        driver: "sqlite",
        durable: false,
        location: displayPath(sqlitePath),
      },
      legacyImport: readLegacyArchive,
      legacyLabel: ".data/cyber-intel/items.ndjson",
    });
    await repository.init();
    await importLegacySourceState(repository);
    return repository;
  } catch {
    const { createSqliteClient } = await import("./sqlite");
    const client = await createSqliteClient({ path: ":memory:" });
    const repository = createSqlRepository(client, {
      info: { driver: "memory", durable: false, location: null },
    });
    await repository.init();
    return repository;
  }
}

function resolveSqlitePath(): string {
  const configured = process.env.CYBER_INTEL_SQLITE_PATH;
  if (configured) return configured;
  // Serverless filesystems are read-only except for the temp directory, and
  // anything written there disappears with the instance.
  if (process.env.VERCEL) return path.join(os.tmpdir(), "cyber-intel.sqlite");
  return path.join(process.cwd(), ".data", "cyber-intel.sqlite");
}

/** Credential-free label for the UI. */
function databaseLabel(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    const port = url.port ? `:${url.port}` : "";
    const database = url.pathname.replace(/^\//, "");
    return `postgres ${url.hostname}${port}${database ? `/${database}` : ""}`;
  } catch {
    return "postgres";
  }
}

function displayPath(absolute: string): string {
  if (absolute === ":memory:") return ":memory:";
  const relative = path.relative(process.cwd(), absolute);
  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
    return relative.split(path.sep).join("/");
  }
  return path.basename(absolute);
}

function dataDirectory(): string {
  return process.env.CYBER_INTEL_DATA_DIR ?? path.join(process.cwd(), ".data", "cyber-intel");
}

/**
 * Imports the NDJSON archive written by the previous implementation. It runs
 * only when the new store is empty, so it can never duplicate live records.
 */
async function readLegacyArchive(): Promise<IntelItem[] | null> {
  let raw: string;
  try {
    raw = await fs.readFile(path.join(dataDirectory(), "items.ndjson"), "utf8");
  } catch {
    return null;
  }

  const items: IntelItem[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = normalizeLegacyItem(JSON.parse(trimmed));
      if (parsed) items.push(parsed);
    } catch {
      // A partially written line is skipped, not fatal.
    }
  }

  return items.length > 0 ? items.slice(0, 5_000) : null;
}

function normalizeLegacyItem(value: unknown): IntelItem | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<IntelItem>;
  if (!item.id || !item.url || !item.title || !item.sourceId) return null;

  const firstSeenAt = item.firstSeenAt ?? new Date().toISOString();
  return {
    id: item.id,
    title: item.title,
    summary: item.summary ?? "",
    url: item.url,
    sourceId: item.sourceId,
    sourceName: item.sourceName ?? item.sourceId,
    sourceKind: item.sourceKind ?? "publisher",
    externalId: item.externalId ?? null,
    category: item.category ?? "general",
    categoryBasis: item.categoryBasis ?? "source",
    publishedAt: item.publishedAt ?? null,
    publishedAtKind: item.publishedAtKind ?? "article",
    incidentAt: item.incidentAt ?? null,
    advisoryAt: item.advisoryAt ?? null,
    updatedAt: item.updatedAt ?? null,
    geo: item.geo ?? null,
    identifiers: Array.isArray(item.identifiers) ? item.identifiers : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    attribution: item.attribution ?? null,
    firstSeenAt,
    lastSeenAt: item.lastSeenAt ?? firstSeenAt,
  };
}

/** Carries over the previous source-health file when the new table is empty. */
async function importLegacySourceState(repository: IntelRepository): Promise<void> {
  try {
    const existing = await repository.sourceStates();
    if (existing.length > 0) return;

    const raw = await fs.readFile(path.join(dataDirectory(), "state.json"), "utf8");
    const parsed = JSON.parse(raw) as {
      health?: {
        id?: string;
        status?: string;
        itemCount?: number;
        fetchedAt?: string | null;
        error?: string;
      }[];
    };
    if (!Array.isArray(parsed.health)) return;

    const states: SourceState[] = [];
    for (const entry of parsed.health) {
      if (!entry.id) continue;
      const status = entry.status === "ok" || entry.status === "error" ? entry.status : "skipped";
      const fetchedAt = entry.fetchedAt ?? null;
      states.push({
        id: entry.id,
        status,
        itemCount: Number.isFinite(entry.itemCount) ? Number(entry.itemCount) : 0,
        fetchedAt,
        lastSuccessAt: status === "ok" ? fetchedAt : null,
        error: entry.error ?? null,
        consecutiveFailures: status === "error" ? 1 : 0,
        nextAttemptAt: null,
        durationMs: null,
        etag: null,
        lastModified: null,
      });
    }

    if (states.length > 0) await repository.saveSourceStates(states);
  } catch {
    // Legacy state is a convenience; losing it only costs one refresh.
  }
}
