import assert from "node:assert/strict";
import test from "node:test";
import { buildItem, geoFromCountry } from "../../lib/cyber-intel/normalize";
import { SOURCE_BY_ID } from "../../lib/cyber-intel/sources";

const news = SOURCE_BY_ID.get("thehackernews");
const nvd = SOURCE_BY_ID.get("nvd-cve");

if (!news || !nvd) throw new Error("test sources missing from the registry");

const now = new Date("2026-10-20T12:00:00.000Z");

test("buildItem: normalises a valid record", () => {
  const item = buildItem(news, {
    title: "  Critical flaw exploited in the wild  ",
    summary: "<p>A short <b>summary</b>.</p>",
    url: "https://example.com/story?utm_source=x",
    externalId: "story-1",
    publishedAt: "2026-10-19T08:00:00.000Z",
    now,
  });

  assert.ok(item);
  assert.equal(item.title, "Critical flaw exploited in the wild");
  assert.equal(item.summary, "A short summary.");
  assert.equal(item.url, "https://example.com/story");
  assert.equal(item.externalId, "story-1");
  assert.equal(item.category, "exploit");
  assert.equal(item.categoryBasis, "keyword");
  assert.equal(item.firstSeenAt, now.toISOString());
  assert.equal(item.lastSeenAt, now.toISOString());
});

test("buildItem: rejects junk titles", () => {
  assert.equal(
    buildItem(news, { title: "404", url: "https://example.com/a", now }),
    null,
  );
  assert.equal(
    buildItem(news, { title: "Hi", url: "https://example.com/a", now }),
    null,
  );
});

test("buildItem: rejects unsafe, internal or malformed URLs", () => {
  for (const url of [
    "javascript:alert(1)",
    "http://127.0.0.1/internal",
    "http://localhost/admin",
    "https://user:pass@example.com/",
    "not a url",
  ]) {
    assert.equal(buildItem(news, { title: "A valid headline", url, now }), null, url);
  }
});

test("buildItem: rejects dates in the future or before 1990", () => {
  const future = buildItem(news, {
    title: "A valid headline",
    url: "https://example.com/a",
    publishedAt: "2026-10-25T12:00:00.000Z",
    now,
  });
  assert.equal(future?.publishedAt, null);

  const ancient = buildItem(news, {
    title: "A valid headline",
    url: "https://example.com/b",
    publishedAt: "1985-01-01T00:00:00.000Z",
    now,
  });
  assert.equal(ancient?.publishedAt, null);

  const invalid = buildItem(news, {
    title: "A valid headline",
    url: "https://example.com/c",
    publishedAt: "2026-13-45",
    now,
  });
  assert.equal(invalid?.publishedAt, null);
});

test("buildItem: keeps a date within the one-day clock-skew tolerance", () => {
  const item = buildItem(news, {
    title: "A valid headline",
    url: "https://example.com/a",
    publishedAt: "2026-10-21T06:00:00.000Z",
    now,
  });
  assert.equal(item?.publishedAt, "2026-10-21T06:00:00.000Z");
});

test("buildItem: attaches a country only when the code is known", () => {
  const india = geoFromCountry("in", "ransomware.live");
  assert.equal(india?.countryCode, "IN");
  assert.equal(india?.countryName, "India");
  assert.equal(india?.lat, 20.6);

  assert.equal(geoFromCountry("ZZ", "ransomware.live"), null);
  assert.equal(geoFromCountry(null, "ransomware.live"), null);
});

test("buildItem: caps summaries and strips control characters", () => {
  const item = buildItem(news, {
    title: "A valid headline",
    url: "https://example.com/a",
    summary: `${"word ".repeat(120)}\u0000`,
    now,
  });
  assert.ok(item);
  assert.ok(item.summary.length <= 281);
  assert.ok(!item.summary.includes("\u0000"));
});

test("buildItem: strict sources keep their own category", () => {
  const item = buildItem(nvd, {
    title: "CVE-2026-12345 — critical flaw",
    url: "https://nvd.nist.gov/vuln/detail/CVE-2026-12345",
    category: "vulnerability",
    categoryBasis: "source",
    now,
  });
  assert.equal(item?.category, "vulnerability");
  assert.equal(item?.categoryBasis, "source");
  assert.deepEqual(item?.identifiers, ["CVE-2026-12345"]);
});

test("buildItem: derives identifiers from the headline and summary", () => {
  const item = buildItem(news, {
    title: "CVE-2026-12345 exploited",
    summary: "The advisory AA26-293A covers it.",
    url: "https://example.com/a",
    now,
  });
  assert.deepEqual(item?.identifiers.sort(), ["AA26-293A", "CVE-2026-12345"]);
});

test("buildItem: deduplicates tags and caps them", () => {
  const item = buildItem(news, {
    title: "A valid headline",
    url: "https://example.com/a",
    tags: ["one", "one", "two", "three", "four", "five", "six", "seven"],
    now,
  });
  assert.deepEqual(item?.tags, ["one", "two", "three", "four", "five", "six"]);
});
