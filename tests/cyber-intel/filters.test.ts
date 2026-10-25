import assert from "node:assert/strict";
import test from "node:test";
import {
  EMPTY_ARCHIVE_FILTERS,
  dayBefore,
  filtersFromSearchParams,
  filtersToApiQuery,
  filtersToSearchParams,
  hasNarrowingFilters,
  isDateRangeInverted,
  normalizeDay,
  sameFilters,
} from "../../lib/cyber-intel/filters";

/**
 * Archive filter serialisation.
 *
 * The URL, the API request and the visible controls all derive from this
 * module, so a mistake here would silently show one filter set while querying
 * another.
 */

function parse(search: string) {
  return filtersFromSearchParams(new URLSearchParams(search));
}

test("filters: defaults are empty and newest-first", () => {
  assert.deepEqual(parse(""), EMPTY_ARCHIVE_FILTERS);
  assert.equal(filtersToSearchParams(EMPTY_ARCHIVE_FILTERS).toString(), "");
});

test("filters: unknown categories are dropped and duplicates removed", () => {
  const filters = parse("category=vulnerability,exploit,nope,exploit");
  assert.deepEqual(filters.categories, ["vulnerability", "exploit"]);
});

test("filters: dates normalise to a UTC day and reject impossible values", () => {
  assert.equal(normalizeDay("2026-10-01"), "2026-10-01");
  assert.equal(normalizeDay("2026-10-01T23:30:00.000Z"), "2026-10-01");
  assert.equal(normalizeDay("2026-02-30"), "");
  assert.equal(normalizeDay("2026-13-01"), "");
  assert.equal(normalizeDay("01/10/2026"), "");
  assert.equal(normalizeDay(null), "");
});

test("filters: country, located and sort accept only documented values", () => {
  assert.equal(parse("country=in").country, "IN");
  assert.equal(parse("country=ZZZ").country, "");
  assert.equal(parse("country=1N").country, "");
  assert.equal(parse("located=yes").located, "yes");
  assert.equal(parse("located=maybe").located, "");
  assert.equal(parse("sort=oldest").sort, "oldest");
  assert.equal(parse("sort=random").sort, "newest");
});

test("filters: free text is collapsed and capped", () => {
  assert.equal(parse(`q=${encodeURIComponent("  two   words  ")}`).q, "two words");
  assert.equal(parse(`q=${encodeURIComponent("a".repeat(200))}`).q.length, 120);
});

test("filters: URL round-trip preserves a complete filter set", () => {
  const original = parse(
    "q=ransomware&category=vulnerability,exploit&source=cisa-kev&country=IN&from=2026-01-01&to=2026-12-31&located=yes&sort=oldest",
  );
  const roundTripped = filtersFromSearchParams(filtersToSearchParams(original));
  assert.deepEqual(roundTripped, original);
  assert.equal(sameFilters(original, roundTripped), true);
});

test("filters: URL omits defaults but the API query always includes a page size", () => {
  const defaults = filtersToSearchParams(EMPTY_ARCHIVE_FILTERS);
  assert.equal(defaults.toString(), "");

  const api = filtersToApiQuery(parse("q=uefi&category=exploit"), 20);
  assert.equal(api, "q=uefi&category=exploit&pageSize=20");
});

test("filters: item links are not treated as filters", () => {
  const filters = parse("q=uefi&item=ci-abc123");
  assert.deepEqual(filtersToSearchParams(filters).toString(), "q=uefi");
});

test("filters: narrowing and inverted ranges are detected", () => {
  assert.equal(hasNarrowingFilters(EMPTY_ARCHIVE_FILTERS), false);
  assert.equal(hasNarrowingFilters(parse("sort=oldest")), false);
  assert.equal(hasNarrowingFilters(parse("q=uefi")), true);
  assert.equal(hasNarrowingFilters(parse("from=2026-01-01")), true);

  assert.equal(isDateRangeInverted(parse("from=2026-10-10&to=2026-10-01")), true);
  assert.equal(isDateRangeInverted(parse("from=2026-10-01&to=2026-10-10")), false);
  assert.equal(isDateRangeInverted(parse("from=2026-10-01")), false);
});

test("filters: quick ranges are computed from the snapshot clock", () => {
  assert.equal(dayBefore("2026-10-25T08:00:00.000Z", 7), "2026-10-18");
  assert.equal(dayBefore("2026-01-02T00:00:00.000Z", 1), "2026-01-01");
  assert.equal(dayBefore("not-a-date", 1), "");
});
