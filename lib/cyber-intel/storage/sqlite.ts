import type { SqlClient } from "./client";

/**
 * SQLite driver backed by Node's built-in `node:sqlite` module.
 *
 * This driver exists for local development and for the test suite. It is not a
 * production archive: a container filesystem is lost on redeploy, so the
 * repository reports `durable: false` for this driver and the UI says so.
 *
 * All statements go through a promise queue. SQLite has one writer and a single
 * connection here, so serialising access prevents a transaction from being
 * interleaved with another caller's statement.
 */
export interface SqliteOptions {
  path: string;
}

export async function createSqliteClient(options: SqliteOptions): Promise<SqlClient> {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(options.path);

  db.exec("pragma busy_timeout = 5000");
  db.exec("pragma journal_mode = wal");

  let tail: Promise<unknown> = Promise.resolve();

  function exclusive<T>(fn: () => T | Promise<T>): Promise<T> {
    const run = () => Promise.resolve(fn());
    const result = tail.then(run, run);
    tail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  const raw: SqlClient = {
    dialect: "sqlite",
    async query<T = Record<string, unknown>>(sql: string, params: readonly unknown[] = []) {
      const statement = db.prepare(sql);
      return statement.all(...params) as T[];
    },
    async execute(sql: string, params: readonly unknown[] = []) {
      const statement = db.prepare(sql);
      const result = statement.run(...params);
      return Number(result.changes);
    },
    async exec(sql: string) {
      db.exec(sql);
    },
    transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T> {
      return exclusive(async () => {
        db.exec("begin immediate");
        try {
          const result = await fn(raw);
          db.exec("commit");
          return result;
        } catch (error) {
          try {
            db.exec("rollback");
          } catch {
            // The transaction may already have been rolled back by SQLite.
          }
          throw error;
        }
      });
    },
    async close() {
      db.close();
    },
  };

  // Serialise plain statements as well, so they cannot run in the middle of a
  // transaction started by another caller.
  return {
    dialect: "sqlite",
    query: <T = Record<string, unknown>>(sql: string, params: readonly unknown[] = []) =>
      exclusive(() => raw.query<T>(sql, params)),
    execute: (sql: string, params: readonly unknown[] = []) =>
      exclusive(() => raw.execute(sql, params)),
    exec: (sql: string) => exclusive(() => raw.exec(sql)),
    transaction: raw.transaction,
    close: () => raw.close(),
  };
}
