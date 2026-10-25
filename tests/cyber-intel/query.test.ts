import assert from "node:assert/strict";
import test from "node:test";
import { parseQuery, queryToSearchParams } from "../../lib/cyber-intel/query";

/**
 * API parameter validation.
 *
 * `parseQuery` is the only place request input becomes a database filter, so
 * these cases pin down the clamps, the allowlists and the date boundaries.
 */

function parse(search: string) {
  return parseQuery(new URLSearchParams(search));
}

test("parseQuery: defaults are safe and bounded", () => {
  assert.deepEqual(parse(""), {
    q: "",
    categories: [],
    sources: [],
    from: null,
    to: null,
    located: null,
    country: null,
    sort: "newest",
    page: 1,
    pageSize: 20,
  });
});

test("parseQuery: page and pageSize are clamped", () => {
  assert.equal(parse("pageSize=999").pageSize, 50);
  assert.equal(parse("pageSize=0").pageSize, 1);
  assert.equal(parse("pageSize=-3").pageSize, 1);
  assert.equal(parse("pageSize=abc").pageSize, 20);
  assert.equal(parse("pageSize=25").pageSize, 25);

  assert.equal(parse("page=-5").page, 1);
  assert.equal(parse("page=0").page, 1);
  assert.equal(parse("page=9999").page, 500);
  assert.equal(parse("page=abc").page, 1);
});

test("parseQuery: unknown categories and sources are dropped, duplicates removed", () => {
  const query = parse("category=vulnerability,exploit,unknown,exploit&source=cisa-kev,nope,cisa-kev");
  assert.deepEqual(query.categories, ["vulnerability", "exploit"]);
  assert.deepEqual(query.sources, ["cisa-kev"]);
});

test("parseQuery: date-only boundaries cover the whole UTC day", () => {
  assert.equal(parse("from=2026-10-01").from, "2026-10-01T00:00:00.000Z");
  assert.equal(parse("to=2026-10-01").to, "2026-10-01T23:59:59.999Z");
  assert.equal(parse("from=2026-10-01T12:30:00Z").from, "2026-10-01T12:30:00.000Z");
  assert.equal(parse("from=garbage").from, null);
  assert.equal(parse("to=2026-13-45").to, null);
});

test("parseQuery: located and country accept only valid values", () => {
  assert.equal(parse("located=yes").located, "yes");
  assert.equal(parse("located=no").located, "no");
  assert.equal(parse("located=maybe").located, null);

  assert.equal(parse("country=in").country, "IN");
  assert.equal(parse("country=IN").country, "IN");
  assert.equal(parse("country=i").country, null);
  assert.equal(parse("country=zzz").country, null);
  assert.equal(parse("country=1n").country, null);
});

test("parseQuery: sort accepts only the two documented orders", () => {
  assert.equal(parse("sort=oldest").sort, "oldest");
  assert.equal(parse("sort=newest").sort, "newest");
  assert.equal(parse("sort=random").sort, "newest");
});

test("parseQuery: free text is collapsed and capped", () => {
  const long = `  ${"a".repeat(200)}  `;
  const query = parse(`q=${encodeURIComponent(long)}`);
  assert.equal(query.q.length, 120);
  assert.equal(parse(`q=${encodeURIComponent("  two   words  ")}`).q, "two words");
});

test("queryToSearchParams: round-trips a filter", () => {
  const original = parse(
    "q=ransomware&category=vulnerability,exploit&source=cisa-kev&from=2026-01-01&to=2026-12-31&located=yes&country=IN&sort=oldest&page=3&pageSize=25",
  );
  const roundTripped = parseQuery(queryToSearchParams(original));
  assert.deepEqual(roundTripped, original);
});

test("queryToSearchParams: omits defaults", () => {
  const params = queryToSearchParams(parse(""));
  assert.equal(params.toString(), "");
});
