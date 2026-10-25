import type { IntelCategory, IntelSourceMeta } from "./types";

/**
 * Source registry.
 *
 * Every entry is a public, keyless endpoint. No API credentials are involved,
 * which is why the whole feature can run without secrets — if a source ever
 * needs a key, `ingest.ts` reads it from a server-only env var and never sends
 * it to the browser.
 *
 * Licensing: we store headline, short excerpt, publisher, timestamp and the
 * canonical link, and always link out. We do not mirror article bodies.
 */

export type SourceFormat = "rss" | "json" | "html";

export interface SourceDef extends IntelSourceMeta {
  format: SourceFormat;
  url: string;
  /** Wall-clock budget for this source before it is marked unavailable. */
  timeoutMs: number;
  /** Seconds between upstream refreshes. */
  revalidateSeconds: number;
  /** Hard cap so a single source can never dominate the archive. */
  maxItems: number;
  /** Applied when the source itself carries the category. */
  defaultCategory?: IntelCategory;
}

export const SOURCES: SourceDef[] = [
  {
    id: "cisa-advisories",
    name: "CISA Cybersecurity Advisories",
    kind: "government",
    format: "rss",
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
    homepage: "https://www.cisa.gov/news-events/cybersecurity-advisories",
    timeoutMs: 12_000,
    revalidateSeconds: 900,
    maxItems: 60,
    status: "ok",
    licenceNote:
      "US Government work, public domain. Headline and excerpt reproduced with a link to the advisory.",
    defaultCategory: "advisory",
  },
  {
    id: "cisa-news",
    name: "CISA News",
    kind: "government",
    format: "rss",
    url: "https://www.cisa.gov/news.xml",
    homepage: "https://www.cisa.gov/news-events/news",
    timeoutMs: 10_000,
    revalidateSeconds: 900,
    maxItems: 40,
    status: "ok",
    licenceNote: "US Government work, public domain.",
    defaultCategory: "advisory",
  },
  {
    id: "cisa-kev",
    name: "CISA Known Exploited Vulnerabilities",
    kind: "government",
    format: "json",
    url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
    homepage: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    timeoutMs: 15_000,
    revalidateSeconds: 3600,
    maxItems: 120,
    status: "ok",
    licenceNote:
      "US Government work, public domain. Only recent additions are ingested; each record links to its CVE page.",
    defaultCategory: "exploit",
  },
  {
    id: "nvd-cve",
    name: "NIST National Vulnerability Database",
    kind: "government",
    format: "json",
    url: "https://services.nvd.nist.gov/rest/json/cves/2.0",
    homepage: "https://nvd.nist.gov/",
    timeoutMs: 15_000,
    revalidateSeconds: 1800,
    maxItems: 80,
    status: "ok",
    licenceNote:
      "Public domain CVE data. Keyless access is rate limited by NIST, so we request a small rolling window.",
    defaultCategory: "vulnerability",
  },
  {
    id: "csk-alerts",
    name: "Cyber Swachhta Kendra (CERT-In)",
    kind: "government",
    format: "html",
    url: "https://www.csk.gov.in/alerts.html",
    homepage: "https://www.csk.gov.in/alerts.html",
    timeoutMs: 15_000,
    revalidateSeconds: 1800,
    maxItems: 24,
    status: "ok",
    licenceNote:
      "Government of India alert index. We ingest the alert title, its published 'Original Issue Date' and the link.",
    defaultCategory: "india",
  },
  {
    id: "thehackernews",
    name: "The Hacker News",
    kind: "publisher",
    format: "rss",
    url: "https://feeds.feedburner.com/TheHackersNews",
    homepage: "https://thehackernews.com/",
    timeoutMs: 12_000,
    revalidateSeconds: 900,
    maxItems: 50,
    status: "ok",
    licenceNote:
      "Publisher feed used for headlines and short excerpts with full attribution and a link. No article text is stored.",
  },
  {
    id: "bleepingcomputer",
    name: "BleepingComputer",
    kind: "publisher",
    format: "rss",
    url: "https://www.bleepingcomputer.com/feed/",
    homepage: "https://www.bleepingcomputer.com/",
    timeoutMs: 12_000,
    revalidateSeconds: 900,
    maxItems: 40,
    status: "ok",
    licenceNote:
      "Publisher feed used for headlines and short excerpts with attribution and a link.",
  },
  {
    id: "krebs",
    name: "Krebs on Security",
    kind: "publisher",
    format: "rss",
    url: "https://krebsonsecurity.com/feed/",
    homepage: "https://krebsonsecurity.com/",
    timeoutMs: 12_000,
    revalidateSeconds: 1800,
    maxItems: 25,
    status: "ok",
    licenceNote:
      "Publisher feed used for headlines and short excerpts with attribution and a link.",
  },
  {
    id: "ransomware-live",
    name: "ransomware.live",
    kind: "aggregator",
    format: "json",
    url: "https://api.ransomware.live/v2/recentcyberattacks",
    homepage: "https://www.ransomware.live/",
    timeoutMs: 15_000,
    revalidateSeconds: 1800,
    maxItems: 100,
    status: "ok",
    licenceNote:
      "Aggregator of leak-site claims and reported victims. Records are claims unless a press source is attached; the UI labels them as such. Rate limited to one request per minute upstream, so responses are cached.",
    defaultCategory: "ransomware",
  },
  {
    id: "cert-in",
    name: "CERT-In Advisories",
    kind: "government",
    format: "html",
    url: "https://www.cert-in.org.in/s2cMainServlet?pageid=PUBADVLIST",
    homepage: "https://www.cert-in.org.in/",
    timeoutMs: 8_000,
    revalidateSeconds: 1800,
    maxItems: 0,
    status: "disabled",
    statusNote:
      "The official advisory list is served behind a browser session and returns an empty shell to server-side clients, so it cannot be ingested reliably. CERT-In's own Cyber Swachhta Kendra alerts are ingested instead.",
    licenceNote: "Government of India advisories (not currently machine-readable).",
    defaultCategory: "india",
  },
];

export const SOURCE_BY_ID = new Map(SOURCES.map((s) => [s.id, s]));

export function activeSources(): SourceDef[] {
  return SOURCES.filter((s) => s.status === "ok");
}

/** Metadata safe to send to the browser (no URLs-with-secrets exist here, but keep it explicit). */
export function publicSourceMeta(): IntelSourceMeta[] {
  return SOURCES.map(({ id, name, kind, homepage, status, statusNote, licenceNote }) => ({
    id,
    name,
    kind,
    homepage,
    status,
    statusNote,
    licenceNote,
  }));
}
