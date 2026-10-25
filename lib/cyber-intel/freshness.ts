/**
 * Archive freshness.
 *
 * The warning has to be present in the server-rendered HTML, so it is computed
 * here rather than with a browser clock. A non-durable storage driver is *not*
 * a freshness problem: it is reported separately by `meta.archive.storage`.
 */

/** Six hours without a successful source refresh is treated as stale. */
export const STALE_AFTER_MS = 6 * 3_600_000;

export interface Freshness {
  lastSuccessAt: string | null;
  stale: boolean;
  staleAfterHours: number;
}

export function computeFreshness(
  lastSuccessAt: string | null,
  archiveCount: number,
  now: number = Date.now(),
): Freshness {
  const lastSuccessMs = lastSuccessAt ? Date.parse(lastSuccessAt) : Number.NaN;
  // A migrated archive with no successful refresh since is stale by
  // definition: its newest record is older than the last ingestion attempt.
  const stale = Number.isFinite(lastSuccessMs)
    ? now - lastSuccessMs > STALE_AFTER_MS
    : archiveCount > 0;

  return {
    lastSuccessAt,
    stale,
    staleAfterHours: STALE_AFTER_MS / 3_600_000,
  };
}
