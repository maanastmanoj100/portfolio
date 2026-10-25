import assert from "node:assert/strict";
import test from "node:test";
import {
  buildStatusReport,
  formatCheckedAt,
  isStatusReport,
  overallLevel,
  statusLabel,
  type StatusInputs,
} from "../../lib/portfolio/status";

/**
 * Status model.
 *
 * "unknown" must never be silently upgraded to "operational": the footer
 * indicator is the only place on the site that makes a claim about service
 * health, so the rule is pinned here.
 */

const CHECKED_AT = "2026-10-25T12:00:00.000Z";

function inputs(overrides: Partial<StatusInputs> = {}): StatusInputs {
  return {
    checkedAt: CHECKED_AT,
    archive: {
      lastSuccessAt: "2026-10-25T11:30:00.000Z",
      stale: false,
      staleAfterHours: 6,
      count: 400,
    },
    sources: [{ status: "ok" }, { status: "ok" }],
    ...overrides,
  };
}

test("status: a fresh archive and healthy sources are operational", () => {
  const report = buildStatusReport(inputs());
  assert.equal(report.site.level, "operational");
  assert.equal(report.archive.level, "operational");
  assert.equal(report.sources.level, "operational");
  assert.equal(overallLevel(report), "operational");
  assert.equal(report.sources.ok, 2);
  assert.equal(report.sources.total, 2);
});

test("status: a stale archive degrades the overall level", () => {
  const report = buildStatusReport(
    inputs({
      archive: {
        lastSuccessAt: "2026-10-20T00:00:00.000Z",
        stale: true,
        staleAfterHours: 6,
        count: 400,
      },
    }),
  );
  assert.equal(report.archive.level, "degraded");
  assert.match(report.archive.detail, /6 hours/);
  assert.equal(overallLevel(report), "degraded");
});

test("status: a partially failed source run is degraded", () => {
  const report = buildStatusReport(
    inputs({ sources: [{ status: "ok" }, { status: "error" }, { status: "skipped" }] }),
  );
  assert.equal(report.sources.level, "degraded");
  assert.equal(report.sources.ok, 1);
  assert.equal(report.sources.failed, 1);
  assert.equal(report.sources.skipped, 1);
  assert.equal(report.sources.total, 3);
  assert.match(report.sources.detail, /1 of 3 sources refreshed; 1 failed/);
  assert.equal(overallLevel(report), "degraded");
});

test("status: every attempted source failing is unavailable", () => {
  const report = buildStatusReport(inputs({ sources: [{ status: "error" }, { status: "error" }] }));
  assert.equal(report.sources.level, "unavailable");
  assert.equal(overallLevel(report), "degraded");
});

test("status: all-skipped sources are unknown, not healthy", () => {
  const report = buildStatusReport(inputs({ sources: [{ status: "skipped" }] }));
  assert.equal(report.sources.level, "unknown");
  assert.match(report.sources.detail, /unknown/);
  assert.equal(overallLevel(report), "unknown");
});

test("status: an unreadable archive is unknown", () => {
  const report = buildStatusReport(inputs({ archive: null }));
  assert.equal(report.archive.level, "unknown");
  assert.equal(report.archive.lastSuccessAt, null);
  assert.equal(overallLevel(report), "unknown");
});

test("status: an empty archive with no refresh is unknown", () => {
  const report = buildStatusReport(
    inputs({
      archive: { lastSuccessAt: null, stale: false, staleAfterHours: 6, count: 0 },
    }),
  );
  assert.equal(report.archive.level, "unknown");
  assert.match(report.archive.detail, /No news ingestion/);
});

test("status: an empty archive that is stale is still degraded", () => {
  const report = buildStatusReport(
    inputs({
      archive: { lastSuccessAt: null, stale: true, staleAfterHours: 6, count: 12 },
    }),
  );
  assert.equal(report.archive.level, "degraded");
});

test("status: missing source data is unknown", () => {
  const report = buildStatusReport(inputs({ sources: null }));
  assert.equal(report.sources.level, "unknown");
  assert.equal(report.sources.total, 0);
});

test("status: labels are human-readable", () => {
  assert.equal(statusLabel("operational"), "Operational");
  assert.equal(statusLabel("degraded"), "Degraded");
  assert.equal(statusLabel("unavailable"), "Unavailable");
  assert.equal(statusLabel("unknown"), "Unknown");
});

test("status: a built report passes its own validator", () => {
  assert.equal(isStatusReport(buildStatusReport(inputs())), true);
});

test("status: malformed payloads fail validation", () => {
  const valid = buildStatusReport(inputs());
  const cases: unknown[] = [
    null,
    undefined,
    42,
    "status",
    [],
    {},
    { ...valid, checkedAt: "not a date" },
    { ...valid, site: { level: "green", detail: "ok" } },
    { ...valid, archive: { ...valid.archive, stale: "no" } },
    { ...valid, sources: { ...valid.sources, ok: -1 } },
    { ...valid, sources: { ...valid.sources, total: 1.5 } },
  ];
  for (const value of cases) {
    assert.equal(isStatusReport(value), false, `expected invalid: ${JSON.stringify(value)}`);
  }
});

test("status: a timestamp is formatted or reported as unchecked", () => {
  assert.equal(formatCheckedAt(null), "not checked");
  assert.equal(formatCheckedAt("not a date"), "not checked");
  assert.notEqual(formatCheckedAt(CHECKED_AT), "not checked");
});
