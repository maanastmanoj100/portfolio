import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalUrl,
  extractIdentifiers,
  parseDate,
  parseFeed,
  sanitizeText,
  titleKey,
  truncate,
} from "../../lib/cyber-intel/parse";

test("parseDate: RFC 822 with a two-digit year and numeric offset", () => {
  assert.equal(parseDate("Fri, 23 Oct 26 12:00:00 +0000"), "2026-10-23T12:00:00.000Z");
});

test("parseDate: US Eastern abbreviation is applied, not ignored", () => {
  assert.equal(parseDate("Mon, 19 Oct 2026 15:18:07 EDT"), "2026-10-19T19:18:07.000Z");
});

test("parseDate: Central European summer time is applied", () => {
  assert.equal(parseDate("Fri, 02 Oct 2026 17:00:00 CEST"), "2026-10-02T15:00:00.000Z");
});

test("parseDate: date-only values stay on the stated UTC day", () => {
  assert.equal(parseDate("2026-10-24"), "2026-10-24T00:00:00.000Z");
});

test("parseDate: named months parse without a local-time shift", () => {
  assert.equal(parseDate("October 23, 2026"), "2026-10-23T00:00:00.000Z");
  assert.equal(parseDate("23 October 2026"), "2026-10-23T00:00:00.000Z");
});

test("parseDate: impossible calendar dates are rejected instead of rolling over", () => {
  assert.equal(parseDate("2026-13-45"), null);
  assert.equal(parseDate("Fri, 31 Feb 2026 10:00:00 +0000"), null);
  assert.equal(parseDate("2026-02-30"), null);
});

test("parseDate: junk and bare years are rejected", () => {
  assert.equal(parseDate("not a date"), null);
  assert.equal(parseDate("2026"), null);
  assert.equal(parseDate(""), null);
  assert.equal(parseDate(null), null);
});

test("canonicalUrl: strips fragments, default ports and tracking parameters", () => {
  assert.equal(
    canonicalUrl("https://Example.COM:443/a/b?utm_source=newsletter&id=7#section"),
    "https://example.com/a/b?id=7",
  );
});

test("canonicalUrl: rejects unsafe or credential-bearing URLs", () => {
  assert.equal(canonicalUrl("javascript:alert(1)"), null);
  assert.equal(canonicalUrl("https://user:pass@example.com/"), null);
  assert.equal(canonicalUrl("ftp://example.com/file"), null);
  assert.equal(canonicalUrl("not a url"), null);
});

test("titleKey: normalises punctuation and case for similarity matching", () => {
  assert.equal(titleKey("CISA Adds One KEV!"), "cisa adds one kev");
  assert.equal(titleKey("CISA adds one KEV"), "cisa adds one kev");
});

test("sanitizeText: strips markup and control characters", () => {
  assert.equal(sanitizeText("<script>alert(1)</script>Hello\u0000 world"), "Hello world");
  assert.equal(sanitizeText("<b>Bold</b> text"), "Bold text");
});

test("truncate: cuts at a word boundary and marks the cut", () => {
  const result = truncate("one two three four five", 12);
  assert.ok(result.endsWith("…"));
  assert.ok(result.length <= 13);
});

test("extractIdentifiers: finds CVEs and CISA advisory ids", () => {
  const ids = extractIdentifiers("CVE-2026-12345 and aa26-293a and CVE-2026-12345");
  assert.deepEqual(ids.sort(), ["AA26-293A", "CVE-2026-12345"]);
});

test("parseFeed: RSS items keep title, link, date, categories and guid", () => {
  const xml = `<?xml version="1.0"?>
    <rss version="2.0">
      <channel>
        <item>
          <title>CISA &#x3f; advisory</title>
          <link>https://example.com/advisory?a=1&amp;b=2</link>
          <pubDate>Fri, 23 Oct 26 12:00:00 +0000</pubDate>
          <description><![CDATA[<p>Hello &amp; world</p>]]></description>
          <category>Advisory</category>
          <guid>/node/25710</guid>
        </item>
      </channel>
    </rss>`;

  const [entry] = parseFeed(xml);
  assert.equal(entry.title, "CISA? advisory");
  assert.equal(entry.link, "https://example.com/advisory?a=1&b=2");
  assert.equal(entry.published, "2026-10-23T12:00:00.000Z");
  assert.equal(entry.summary, "Hello & world");
  assert.deepEqual(entry.categories, ["Advisory"]);
  assert.equal(entry.guid, "/node/25710");
});

test("parseFeed: Atom entries use link href, published and id", () => {
  const xml = `<?xml version="1.0"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <entry>
        <title>Atom entry</title>
        <link href="https://example.com/atom-entry" />
        <published>2026-10-01T00:00:00Z</published>
        <updated>2026-10-02T00:00:00Z</updated>
        <id>tag:example.com,2026:1</id>
        <summary>Short summary</summary>
      </entry>
    </feed>`;

  const [entry] = parseFeed(xml);
  assert.equal(entry.link, "https://example.com/atom-entry");
  assert.equal(entry.published, "2026-10-01T00:00:00.000Z");
  assert.equal(entry.updated, "2026-10-02T00:00:00.000Z");
  assert.equal(entry.guid, "tag:example.com,2026:1");
});

test("parseFeed: RDF (Debian DSA) uses dc:date as the publication date", () => {
  const xml = `<?xml version="1.0"?>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns="http://purl.org/rss/1.0/"
             xmlns:dc="http://purl.org/dc/elements/1.1/">
      <item rdf:about="https://www.debian.org/security/2026/dsa-1">
        <title>DSA-1 test</title>
        <link>https://www.debian.org/security/2026/dsa-1</link>
        <dc:date>2026-10-24</dc:date>
        <description>Description</description>
      </item>
    </rdf:RDF>`;

  const [entry] = parseFeed(xml);
  assert.equal(entry.published, "2026-10-24T00:00:00.000Z");
  assert.equal(entry.updated, null);
});
