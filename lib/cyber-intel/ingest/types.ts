import type { IntelItem, SourceState } from "../types";
import type { SafeFetchResult } from "../security";

export interface FetchRequestOptions {
  etag?: string | null;
  lastModified?: string | null;
  maxBytes?: number;
  timeoutMs?: number;
}

export interface FetchContext {
  /** Durable state from the previous run, used for conditional requests. */
  state: SourceState | null;
  now: Date;
  /** Bound to the source's host allowlist and timeout defaults. */
  fetch: (url: string, options?: FetchRequestOptions) => Promise<SafeFetchResult>;
}

export interface FetchOutcome {
  items: IntelItem[];
  /** True when the publisher answered 304 and nothing changed. */
  notModified?: boolean;
  etag?: string | null;
  lastModified?: string | null;
  /** Short, non-sensitive note shown in source health (e.g. "no items"). */
  note?: string | null;
}
