import assert from "node:assert/strict";
import test from "node:test";
import { fetchCsk } from "../../lib/cyber-intel/ingest/fetchers/csk";
import { fetchKev } from "../../lib/cyber-intel/ingest/fetchers/kev";
import { fetchNvd } from "../../lib/cyber-intel/ingest/fetchers/nvd";
import { fetchRansomware } from "../../lib/cyber-intel/ingest/fetchers/ransomware";
import { fetchRss } from "../../lib/cyber-intel/ingest/fetchers/rss";
import type { FetchContext } from "../../lib/cyber-intel/ingest/types";
import { FetchError } from "../../lib/cyber-intel/security";
import type { SafeFetchResult } from "../../lib/cyber-intel/security";
import { SOURCE_BY_ID } from "../../lib/cyber-intel/sources";
import type { SourceDef } from "../../lib/cyber-intel/sources";

/**
 * Fetcher tests.
 *
 * Each fetcher receives a stubbed `FetchContext`, so these cases describe the
 * exact payload shapes we observed in the real feeds without touching the
 * network. Anything that would make a source look healthy when it is broken
 * (an HTML error page, an unexpected JSON shape, a 304) is asserted explicitly.
 */

const now = new Date("2026-10-25T12:00:00.000Z");

function source(id: string): SourceDef {
  const found = SOURCE_BY_ID.get(id);
  if (!found) throw new Error(`missing source ${id}`);
  return found;
}

function response(body: string, overrides: Partial<SafeFetchResult> = {}): SafeFetchResult {
  return {
    status: 200,
    notModified: false,
    body,
    etag: "\"etag-1\"",
    lastModified: "Sat, 25 Oct 2026 10:00:00 GMT",
    contentType: "application/xml",
    bytes: body.length,
    finalUrl: "https://example.com/feed",
    ...overrides,
  };
}

function context(
  handler: (url: string) => SafeFetchResult,
): FetchContext & { calls: string[] } {
  const calls: string[] = [];
  return {
    state: null,
    now,
    calls,
    fetch: async (url) => {
      calls.push(url);
      return handler(url);
    },
  };
}

/* ------------------------------------------------------------------ */
/* RSS                                                                 */
/* ------------------------------------------------------------------ */

const RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Example</title>
    <item>
      <title>Critical flaw exploited in the wild</title>
      <link>https://example.com/story-1?utm_source=rss</link>
      <pubDate>Fri, 23 Oct 26 12:00:00 +0000</pubDate>
      <description><![CDATA[<p>A short <b>summary</b>.</p>]]></description>
      <category>Vulnerabilities</category>
      <guid>/node/1</guid>
    </item>
    <item>
      <title>Ransomware gang claims a new victim</title>
      <link>https://example.com/story-2</link>
      <pubDate>Thu, 22 Oct 26 08:30:00 +0000</pubDate>
      <description>Second summary.</description>
      <guid>/node/2</guid>
    </item>
    <item>
      <title>Unsafe link must be dropped</title>
      <link>javascript:alert(1)</link>
      <pubDate>Wed, 21 Oct 26 08:30:00 +0000</pubDate>
      <guid>/node/3</guid>
    </item>
  </channel>
</rss>`;

test("rss: normalises valid entries and drops unsafe links", async () => {
  const ctx = context(() => response(RSS));
  const outcome = await fetchRss(source("thehackernews"), ctx);

  assert.equal(outcome.notModified, undefined);
  assert.equal(outcome.items.length, 2);
  assert.equal(outcome.etag, "\"etag-1\"");
  assert.equal(outcome.note, null);

  const [first, second] = outcome.items;
  assert.equal(first.title, "Critical flaw exploited in the wild");
  assert.equal(first.url, "https://example.com/story-1");
  assert.equal(first.summary, "A short summary.");
  assert.equal(first.externalId, "/node/1");
  assert.equal(first.publishedAt, "2026-10-23T12:00:00.000Z");
  assert.equal(first.category, "exploit");
  assert.equal(first.categoryBasis, "keyword");
  assert.equal(first.sourceId, "thehackernews");

  assert.equal(second.url, "https://example.com/story-2");
  assert.equal(second.category, "ransomware");
});

test("rss: a 304 keeps the stored validators and returns no items", async () => {
  const ctx = context(() =>
    response("", { status: 304, notModified: true, etag: "\"cached\"", bytes: 0 }),
  );
  const outcome = await fetchRss(source("thehackernews"), ctx);

  assert.equal(outcome.notModified, true);
  assert.deepEqual(outcome.items, []);
  assert.equal(outcome.etag, "\"cached\"");
});

test("rss: an HTML error page served with 200 is a failure, not an empty feed", async () => {
  const ctx = context(() => response("<!DOCTYPE html><html><body>Maintenance</body></html>"));
  await assert.rejects(
    () => fetchRss(source("thehackernews"), ctx),
    (error: unknown) => error instanceof FetchError && error.code === "decode_failed",
  );
});

test("rss: a valid feed with no items is reported, not treated as an error", async () => {
  const ctx = context(() =>
    response(`<?xml version="1.0"?><rss version="2.0"><channel><title>Empty</title></channel></rss>`),
  );
  const outcome = await fetchRss(source("thehackernews"), ctx);

  assert.deepEqual(outcome.items, []);
  assert.equal(outcome.note, "feed contained no items");
});

test("rss: respects the per-source item cap", async () => {
  const items = Array.from(
    { length: 60 },
    (_, index) => `
    <item>
      <title>Story number ${index}</title>
      <link>https://example.com/cap-${index}</link>
      <pubDate>Fri, 23 Oct 26 12:00:00 +0000</pubDate>
    </item>`,
  ).join("");

  const ctx = context(() =>
    response(`<?xml version="1.0"?><rss version="2.0"><channel>${items}</channel></rss>`),
  );

  const capped = source("thehackernews");
  assert.equal(capped.maxItems, 50);
  const outcome = await fetchRss(capped, ctx);
  assert.equal(outcome.items.length, 50);
});

/* ------------------------------------------------------------------ */
/* KEV                                                                 */
/* ------------------------------------------------------------------ */

const KEV = JSON.stringify({
  title: "CISA Catalog of Known Exploited Vulnerabilities",
  vulnerabilities: [
    {
      cveID: "CVE-2026-0002",
      vendorProject: "Acme",
      product: "Router",
      vulnerabilityName: "Acme Router Command Injection",
      dateAdded: "2026-10-20",
      shortDescription: "A command injection flaw in Acme Router.",
      requiredAction: "Apply updates.",
      dueDate: "2026-11-10",
      knownRansomwareCampaignUse: "Known",
    },
    {
      cveID: "CVE-2026-0003",
      vendorProject: "Beta",
      product: "Server",
      vulnerabilityName: "Beta Server Authentication Bypass",
      dateAdded: "2026-10-22",
      shortDescription: "An authentication bypass in Beta Server.",
      requiredAction: "Apply mitigations.",
      dueDate: "2026-11-12",
      knownRansomwareCampaignUse: "Unknown",
    },
    {
      // Missing dateAdded: dropped.
      cveID: "CVE-2026-0004",
      vulnerabilityName: "Incomplete record",
    },
  ],
});

test("kev: keeps the newest additions, maps CVEs and flags ransomware use", async () => {
  const ctx = context(() => response(KEV, { contentType: "application/json" }));
  const outcome = await fetchKev(source("cisa-kev"), ctx);

  assert.equal(outcome.items.length, 2);
  assert.deepEqual(
    outcome.items.map((item) => item.externalId),
    ["CVE-2026-0003", "CVE-2026-0002"],
  );

  const newest = outcome.items[0];
  assert.equal(newest.title, "CVE-2026-0003 — Beta Server Authentication Bypass");
  assert.equal(newest.url, "https://nvd.nist.gov/vuln/detail/CVE-2026-0003");
  assert.equal(newest.category, "exploit");
  assert.equal(newest.categoryBasis, "source");
  assert.equal(newest.publishedAt, "2026-10-22T00:00:00.000Z");
  assert.equal(newest.advisoryAt, "2026-10-22T00:00:00.000Z");
  assert.equal(newest.publishedAtKind, "catalog");
  assert.ok(newest.summary.includes("Required action: Apply mitigations."));
  assert.ok(newest.summary.includes("Remediation due: 2026-11-12"));

  const ransomware = outcome.items[1];
  assert.ok(ransomware.tags.includes("KEV"));
  assert.ok(ransomware.tags.includes("known-ransomware-use"));
  assert.deepEqual(ransomware.identifiers, ["CVE-2026-0002"]);
});

test("kev: malformed JSON and an unexpected shape are failures", async () => {
  await assert.rejects(
    () => fetchKev(source("cisa-kev"), context(() => response("{not json"))),
    (error: unknown) => error instanceof FetchError && error.code === "decode_failed",
  );

  await assert.rejects(
    () =>
      fetchKev(
        source("cisa-kev"),
        context(() => response(JSON.stringify({ vulnerabilities: "nope" }))),
      ),
    (error: unknown) => error instanceof FetchError && error.code === "decode_failed",
  );
});

test("kev: a 304 returns no items and keeps the validator", async () => {
  const ctx = context(() =>
    response("", { status: 304, notModified: true, etag: "\"kev-etag\"" }),
  );
  const outcome = await fetchKev(source("cisa-kev"), ctx);
  assert.equal(outcome.notModified, true);
  assert.deepEqual(outcome.items, []);
  assert.equal(outcome.etag, "\"kev-etag\"");
});

/* ------------------------------------------------------------------ */
/* NVD                                                                 */
/* ------------------------------------------------------------------ */

test("nvd: maps CVE fields, CVSS severity and the description", async () => {
  const payload = JSON.stringify({
    totalResults: 1,
    vulnerabilities: [
      {
        cve: {
          id: "CVE-2026-9999",
          published: "2026-10-21T10:00:00.000",
          lastModified: "2026-10-22T10:00:00.000",
          vulnStatus: "Analyzed",
          descriptions: [{ lang: "en", value: "A stack overflow in Example Parser allows remote code execution." }],
          weaknesses: [{ description: [{ lang: "en", value: "CWE-121" }] }],
          metrics: {
            cvssMetricV31: [
              { cvssData: { baseScore: 9.8, baseSeverity: "CRITICAL" } },
            ],
          },
        },
      },
    ],
  });

  const ctx = context(() => response(payload, { contentType: "application/json" }));
  const outcome = await fetchNvd(source("nvd-cve"), ctx);

  assert.equal(outcome.items.length, 1);
  const [item] = outcome.items;
  assert.equal(item.title, "CVE-2026-9999 — A stack overflow in Example Parser allows remote code execution.");
  assert.equal(item.url, "https://nvd.nist.gov/vuln/detail/CVE-2026-9999");
  assert.equal(item.category, "vulnerability");
  assert.equal(item.publishedAt, "2026-10-21T10:00:00.000Z");
  assert.equal(item.updatedAt, "2026-10-22T10:00:00.000Z");
  assert.ok(item.tags.includes("CWE-121"));
  assert.ok(item.tags.includes("CVSS 9.8 CRITICAL"));
  assert.ok(ctx.calls[0].includes("pubStartDate="));
  assert.ok(ctx.calls[0].includes("pubEndDate="));
});

test("nvd: rejects a response without a vulnerabilities array", async () => {
  await assert.rejects(
    () => fetchNvd(source("nvd-cve"), context(() => response("{}"))),
    (error: unknown) => error instanceof FetchError && error.code === "decode_failed",
  );
});

/* ------------------------------------------------------------------ */
/* CERT-In / Cyber Swachhta Kendra                                     */
/* ------------------------------------------------------------------ */

const CSK_INDEX = `<!DOCTYPE html>
<html><body>
  <table>
    <tr>
      <td><a href="alerts/router-flaw.html">Multiple Vulnerabilities in Routers</a></td>
    </tr>
    <tr>
      <td><a href="alerts/phishing-campaign.html">Phishing Campaign Targeting Banks</a></td>
    </tr>
    <tr>
      <td><a href="/alerts/router-flaw.html">Duplicate link</a></td>
    </tr>
    <tr>
      <td><a href="notices/other.html">Not an alert</a></td>
    </tr>
  </table>
</body></html>`;

const CSK_DETAIL = `<!DOCTYPE html>
<html><body>
  <h1>Multiple Vulnerabilities in Routers</h1>
  <p>Severity: High</p>
  <p>Original Issue Date: October 20, 2026</p>
  <p>Overview: A critical flaw affects several router models. An attacker could execute code.</p>
  <p>Solution: Apply the vendor patch.</p>
</body></html>`;

test("csk: reads titles from the index and dates/severity from each alert", async () => {
  const ctx = context((url) =>
    url.endsWith("alerts.html")
      ? response(CSK_INDEX, { contentType: "text/html" })
      : response(CSK_DETAIL, { contentType: "text/html" }),
  );

  const outcome = await fetchCsk(source("csk-alerts"), ctx);

  assert.equal(outcome.items.length, 2);
  assert.equal(ctx.calls.length, 3);

  const [router, phishing] = outcome.items;
  assert.equal(router.title, "Multiple Vulnerabilities in Routers");
  assert.equal(router.url, "https://www.csk.gov.in/alerts/router-flaw.html");
  assert.equal(router.category, "india");
  assert.equal(router.categoryBasis, "source");
  assert.equal(router.publishedAt, "2026-10-20T00:00:00.000Z");
  assert.equal(router.publishedAtKind, "advisory");
  assert.equal(router.advisoryAt, "2026-10-20T00:00:00.000Z");
  assert.ok(router.summary.startsWith("A critical flaw affects several router models."));
  assert.ok(!router.summary.includes("Apply the vendor patch"));
  assert.ok(router.tags.includes("Severity: High"));
  assert.ok(router.tags.includes("CERT-In"));

  assert.equal(phishing.url, "https://www.csk.gov.in/alerts/phishing-campaign.html");
});

test("csk: an unreadable detail page leaves the index entry intact", async () => {
  const ctx = context((url) => {
    if (url.endsWith("alerts.html")) return response(CSK_INDEX, { contentType: "text/html" });
    if (url.includes("router-flaw")) throw new FetchError("timeout", "timed out");
    return response("<html><body>No fields here</body></html>", { contentType: "text/html" });
  });

  const outcome = await fetchCsk(source("csk-alerts"), ctx);
  assert.equal(outcome.items.length, 2);
  assert.equal(outcome.items[0].publishedAt, null);
  assert.equal(outcome.items[1].publishedAt, null);
});

test("csk: an unrecognised index structure is a failure", async () => {
  const ctx = context(() => response("<html><body>Nothing here</body></html>", { contentType: "text/html" }));
  await assert.rejects(
    () => fetchCsk(source("csk-alerts"), ctx),
    (error: unknown) => error instanceof FetchError && error.code === "decode_failed",
  );
});

/* ------------------------------------------------------------------ */
/* ransomware.live                                                     */
/* ------------------------------------------------------------------ */

test("ransomware: labels leak-site claims and only places a country when reported", async () => {
  const payload = JSON.stringify([
    {
      victim: "Example Hospital",
      claim_gang: "lockbitsupp",
      country: "IN",
      activity: "Healthcare",
      description: "Patient records allegedly stolen.",
      domain: "example-hospital.test",
      date: "2026-10-01",
      discovered: "2026-10-05",
      link: "https://www.ransomware.live/id/example-hospital",
    },
    {
      victim: "Example Manufacturer",
      group: "acme-gang",
      country: "ZZ",
      activity: "Manufacturing",
      date: "2026-10-02",
      discovered: "2026-10-06",
      link: "https://www.ransomware.live/id/example-manufacturer",
    },
    {
      // No group: dropped.
      victim: "Incomplete",
      link: "https://www.ransomware.live/id/incomplete",
    },
  ]);

  const ctx = context(() => response(payload, { contentType: "application/json" }));
  const outcome = await fetchRansomware(source("ransomware-live"), ctx);

  assert.equal(outcome.items.length, 2);

  const [hospital, manufacturer] = outcome.items;
  assert.equal(hospital.title, "Example Hospital — claimed by lockbitsupp");
  assert.equal(hospital.category, "ransomware");
  assert.equal(hospital.categoryBasis, "source");
  assert.equal(hospital.attribution, "Leak-site claim by lockbitsupp");
  assert.equal(hospital.publishedAt, "2026-10-05T00:00:00.000Z");
  assert.equal(hospital.publishedAtKind, "aggregator");
  assert.equal(hospital.incidentAt, "2026-10-01T00:00:00.000Z");
  assert.equal(hospital.geo?.countryCode, "IN");
  assert.equal(hospital.geo?.reportedBy, "ransomware.live (leak-site claim)");
  assert.ok(hospital.tags.includes("leak-site claim"));
  assert.ok(hospital.summary.includes("Victim: Example Hospital"));
  assert.ok(hospital.summary.includes("Sector: Healthcare"));

  assert.equal(manufacturer.geo, null);
  assert.equal(manufacturer.summary.includes("Country:"), false);
});

test("ransomware: an error payload or malformed JSON is a failure", async () => {
  await assert.rejects(
    () =>
      fetchRansomware(
        source("ransomware-live"),
        context(() => response(JSON.stringify({ message: "Rate limit" }))),
      ),
    (error: unknown) => error instanceof FetchError && error.code === "decode_failed",
  );

  await assert.rejects(
    () => fetchRansomware(source("ransomware-live"), context(() => response("<html>"))),
    (error: unknown) => error instanceof FetchError && error.code === "decode_failed",
  );
});

test("ransomware: a 304 returns no items", async () => {
  const ctx = context(() =>
    response("", { status: 304, notModified: true, etag: "\"rw-etag\"" }),
  );
  const outcome = await fetchRansomware(source("ransomware-live"), ctx);
  assert.equal(outcome.notModified, true);
  assert.deepEqual(outcome.items, []);
});
