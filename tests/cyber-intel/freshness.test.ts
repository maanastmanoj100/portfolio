import assert from "node:assert/strict";
import test from "node:test";
import { computeFreshness, STALE_AFTER_MS } from "../../lib/cyber-intel/freshness";

/**
 * Staleness is shown in the first HTML response, so the rule is pinned here
 * rather than being inferred from a browser clock.
 */

const NOW = Date.parse("2026-10-25T12:00:00.000Z");

function iso(hoursAgo: number): string {
  return new Date(NOW - hoursAgo * 3_600_000).toISOString();
}

test("freshness: a recent success is not stale", () => {
  const result = computeFreshness(iso(1), 500, NOW);
  assert.equal(result.stale, false);
  assert.equal(result.staleAfterHours, 6);
  assert.equal(result.lastSuccessAt, iso(1));
});

test("freshness: exactly at the threshold is still fresh, past it is stale", () => {
  assert.equal(computeFreshness(iso(STALE_AFTER_MS / 3_600_000), 500, NOW).stale, false);
  assert.equal(computeFreshness(iso(STALE_AFTER_MS / 3_600_000 + 0.01), 500, NOW).stale, true);
});

test("freshness: an archive with records but no successful refresh is stale", () => {
  assert.equal(computeFreshness(null, 354, NOW).stale, true);
});

test("freshness: an empty archive with no refresh is not stale, just empty", () => {
  assert.equal(computeFreshness(null, 0, NOW).stale, false);
});

test("freshness: an unparsable timestamp falls back to the archive size", () => {
  assert.equal(computeFreshness("not-a-date", 1, NOW).stale, true);
  assert.equal(computeFreshness("not-a-date", 0, NOW).stale, false);
});
