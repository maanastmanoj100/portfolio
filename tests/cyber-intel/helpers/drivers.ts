import { PGlite } from "@electric-sql/pglite";
import type { IntelItem } from "../../../lib/cyber-intel/types";
import { bindSql } from "../../../lib/cyber-intel/storage/client";
import type { SqlClient } from "../../../lib/cyber-intel/storage/client";
import type { IntelRepository } from "../../../lib/cyber-intel/storage/repository";
import { createSqlRepository } from "../../../lib/cyber-intel/storage/sql-repository";
import { createSqliteClient } from "../../../lib/cyber-intel/storage/sqlite";

/**
 * Test drivers.
 *
 * SQLite is the real local driver. PGlite is a real Postgres engine compiled to
 * WASM, so the production SQL statements are executed by Postgres itself rather
 * than merely type-checked.
 */

export async function createSqliteRepository(): Promise<IntelRepository> {
  const client = await createSqliteClient({ path: ":memory:" });
  const repository = createSqlRepository(client, {
    info: { driver: "sqlite", durable: false, location: ":memory:" },
  });
  await repository.init();
  return repository;
}

export async function createPgliteClient(): Promise<SqlClient> {
  const db = new PGlite();

  const raw: SqlClient = {
    dialect: "postgres",
    async query<T = Record<string, unknown>>(sql: string, params: readonly unknown[] = []) {
      const result = await db.query<T>(bindSql(sql, "postgres"), params as unknown[]);
      return result.rows;
    },
    async execute(sql: string, params: readonly unknown[] = []) {
      const result = await db.query(bindSql(sql, "postgres"), params as unknown[]);
      return result.affectedRows ?? 0;
    },
    async exec(sql: string) {
      await db.exec(sql);
    },
    async transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T> {
      await db.exec("begin");
      try {
        const result = await fn(raw);
        await db.exec("commit");
        return result;
      } catch (error) {
        try {
          await db.exec("rollback");
        } catch {
          // Ignore rollback failures; the original error is what matters.
        }
        throw error;
      }
    },
    async close() {
      await db.close();
    },
  };

  return raw;
}

export async function createPgliteRepository(): Promise<IntelRepository> {
  const client = await createPgliteClient();
  const repository = createSqlRepository(client, {
    info: { driver: "postgres", durable: true, location: "pglite" },
  });
  await repository.init();
  return repository;
}

export function makeItem(overrides: Partial<IntelItem> = {}): IntelItem {
  const firstSeenAt = overrides.firstSeenAt ?? "2026-10-20T10:00:00.000Z";
  const base: IntelItem = {
    id: "ci-test0001",
    title: "Test advisory headline",
    summary: "A short summary of the advisory.",
    url: "https://example.com/advisory/1",
    sourceId: "thehackernews",
    sourceName: "The Hacker News",
    sourceKind: "publisher",
    externalId: null,
    category: "advisory",
    categoryBasis: "keyword",
    publishedAt: "2026-10-20T09:00:00.000Z",
    publishedAtKind: "article",
    incidentAt: null,
    advisoryAt: null,
    updatedAt: null,
    geo: null,
    identifiers: [],
    tags: [],
    attribution: null,
    firstSeenAt,
    lastSeenAt: firstSeenAt,
  };
  return { ...base, ...overrides };
}
