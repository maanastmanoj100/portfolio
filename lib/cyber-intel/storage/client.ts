/**
 * Thin SQL abstraction shared by the Postgres and SQLite drivers.
 *
 * Statements are written once with `?` placeholders and rewritten to `$1…$n`
 * for Postgres. Every statement used by the repository is exercised against
 * both dialects in the test suite.
 */

export type SqlDialect = "postgres" | "sqlite";

export interface SqlClient {
  readonly dialect: SqlDialect;
  /** Runs a statement that returns rows. */
  query<T = Record<string, unknown>>(sql: string, params?: readonly unknown[]): Promise<T[]>;
  /** Runs a statement and returns the number of affected rows. */
  execute(sql: string, params?: readonly unknown[]): Promise<number>;
  /** Runs one or more statements without parameters (schema setup). */
  exec(sql: string): Promise<void>;
  /** Runs `fn` inside a transaction, rolling back on any error. */
  transaction<T>(fn: (tx: SqlClient) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

/** Rewrites `?` placeholders for the target dialect. */
export function bindSql(sql: string, dialect: SqlDialect): string {
  if (dialect === "sqlite") return sql;
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

/** Renders `?, ?, ?` for an IN clause with a known number of values. */
export function placeholders(count: number): string {
  return Array.from({ length: count }, () => "?").join(", ");
}
