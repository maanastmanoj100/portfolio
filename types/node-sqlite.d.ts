/**
 * Minimal ambient types for Node's built-in SQLite driver.
 *
 * `@types/node` for the Node 20 line does not ship these yet, while the runtime
 * (Node 22) provides `node:sqlite`. Only the surface used by the driver below is
 * declared.
 */
declare module "node:sqlite" {
  export interface StatementResultingChanges {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export class StatementSync {
    all(...params: unknown[]): Record<string, unknown>[];
    get(...params: unknown[]): Record<string, unknown> | undefined;
    run(...params: unknown[]): StatementResultingChanges;
  }

  export class DatabaseSync {
    constructor(
      path: string,
      options?: { open?: boolean; readOnly?: boolean; enableForeignKeyConstraints?: boolean },
    );
    prepare(sql: string): StatementSync;
    exec(sql: string): void;
    close(): void;
  }
}
