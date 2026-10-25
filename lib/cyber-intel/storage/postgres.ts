import { Pool } from "pg";
import type { PoolClient } from "pg";
import { bindSql } from "./client";
import type { SqlClient } from "./client";

/**
 * Postgres driver.
 *
 * This is the durable archive. The connection string is read from a server-only
 * environment variable and never leaves the process; the repository reports a
 * credential-free label for the UI.
 */
export async function createPostgresClient(connectionString: string): Promise<SqlClient> {
  const pool = new Pool({
    connectionString,
    max: Number(process.env.CYBER_INTEL_PG_POOL_MAX ?? 5),
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
    // `sslmode` in the connection string is honoured when this is undefined.
    ssl: process.env.CYBER_INTEL_PG_SSL === "disable" ? false : undefined,
  });

  // Fail fast: a misconfigured URL should surface at startup, not on the first
  // user request.
  const probe = await pool.connect();
  probe.release();

  const wrap = (runner: Pool | PoolClient): SqlClient => ({
    dialect: "postgres",
    async query<T = Record<string, unknown>>(sql: string, params: readonly unknown[] = []) {
      const result = await runner.query(bindSql(sql, "postgres"), params as unknown[]);
      return result.rows as T[];
    },
    async execute(sql: string, params: readonly unknown[] = []) {
      const result = await runner.query(bindSql(sql, "postgres"), params as unknown[]);
      return result.rowCount ?? 0;
    },
    async exec(sql: string) {
      await runner.query(sql);
    },
    async transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T> {
      if ("release" in runner) {
        throw new Error("Nested Postgres transactions are not supported");
      }
      const client = await pool.connect();
      try {
        await client.query("begin");
        const result = await fn(wrap(client));
        await client.query("commit");
        return result;
      } catch (error) {
        try {
          await client.query("rollback");
        } catch {
          // The connection may already be broken; the original error matters more.
        }
        throw error;
      } finally {
        client.release();
      }
    },
    async close() {
      // Pool shutdown is handled by the outer client below.
    },
  });

  const outer = wrap(pool);
  return {
    ...outer,
    async close() {
      await pool.end();
    },
  };
}
