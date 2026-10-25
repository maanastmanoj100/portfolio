import type { IntelCategory, IntelItem, IntelSourceMeta } from "./types";

/**
 * Source registry.
 *
 * Every entry is a public, keyless endpoint that was probed from a server-side
 * client before being added. Nothing here requires a credential, so the whole
 * pipeline runs without secrets; if a source ever needs a key, the runner would
 * read it from a server-only env var and never send it to the browser.
 *
 * Licensing: we store the headline, a short excerpt, the publisher, the
 * timestamp and the canonical link, and always link out. Article bodies are not
 * mirrored. Each entry records its own licence note.
 *
 * `hosts` is the SSRF allowlist for that source: the fetcher may only contact
 * those hostnames, including across redirects.
 */

export type SourceFormat = "rss" | "json" | "html";
export type FetcherKind = "rss" | "kev" | "nvd" | "csk" | "ransomware";

export interface SourceDef extends IntelSourceMeta {
  format: SourceFormat;
  url: string;
  /** Wall-clock budget for a single request before it is abandoned. */
  timeoutMs: number;
  /** Minimum seconds between two upstream requests for this source. */
  revalidateSeconds: number;
  /** Hard cap so a single source can never dominate the archive. */
  maxItems: number;
  /** Maximum response body size accepted from this source. */
  maxBytes: number;
  /** Hostnames the ingestion runner is allowed to contact for this source. */
  hosts: string[];
  /** What the source's date means, used to label it correctly in the UI. */
  publishedAtKind?: IntelItem["publishedAtKind"];
  /** Applied when the source itself carries the category. */
  defaultCategory?: IntelCategory;
  /** Which parsing strategy the runner should use. */
  fetcher: FetcherKind;
}

export const SOURCES: SourceDef[] = [
  {
    id: "cisa-advisories",
    name: "CISA Cybersecurity Advisories",
    kind: "government",
    format: "rss",
    fetcher: "rss",
    url: "https://www.cisa.gov/cybersecurity-advisories/cybersecurity-advisories.xml",
    hosts: ["www.cisa.gov"],
    homepage: "https://www.cisa.gov/news-events/cybersecurity-advisories",
    timeoutMs: 15_000,
    revalidateSeconds: 1800,
    maxItems: 20,
    maxBytes: 3_000_000,
    status: "ok",
    licenceNote:
      "US Government work, public domain. Headline and excerpt reproduced with a link to the advisory.",
    defaultCategory: "advisory",
    publishedAtKind: "advisory",
  },
  {
    id: "cisa-news",
    name: "CISA News",
    kind: "government",
    format: "rss",
    fetcher: "rss",
    url: "https://www.cisa.gov/news.xml",
    hosts: ["www.cisa.gov"],
    homepage: "https://www.cisa.gov/news-events/news",
    timeoutMs: 12_000,
    revalidateSeconds: 1800,
    maxItems: 40,
    maxBytes: 1_000_000,
    status: "ok",
    licenceNote: "US Government work, public domain.",
    defaultCategory: "advisory",
    publishedAtKind: "advisory",
  },
  {
    id: "cisa-kev",
    name: "CISA Known Exploited Vulnerabilities",
    kind: "government",
    format: "json",
    fetcher: "kev",
    url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
    hosts: ["www.cisa.gov"],
    homepage: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    timeoutMs: 20_000,
    revalidateSeconds: 3600,
    maxItems: 150,
    maxBytes: 8_000_000,
    status: "ok",
    licenceNote:
      "US Government work, public domain. Only recent additions are ingested; each record links to its NVD entry.",
    defaultCategory: "exploit",
    publishedAtKind: "catalog",
  },
  {
    id: "nvd-cve",
    name: "NIST National Vulnerability Database",
    kind: "government",
    format: "json",
    fetcher: "nvd",
    url: "https://services.nvd.nist.gov/rest/json/cves/2.0",
    hosts: ["services.nvd.nist.gov"],
    homepage: "https://nvd.nist.gov/",
    timeoutMs: 20_000,
    revalidateSeconds: 3600,
    maxItems: 80,
    maxBytes: 8_000_000,
    status: "ok",
    licenceNote:
      "Public domain CVE data. Keyless access is rate limited by NIST, so a single small rolling window is requested per run.",
    defaultCategory: "vulnerability",
    publishedAtKind: "article",
  },
  {
    id: "csk-alerts",
    name: "Cyber Swachhta Kendra (CERT-In)",
    kind: "government",
    format: "html",
    fetcher: "csk",
    url: "https://www.csk.gov.in/alerts.html",
    hosts: ["www.csk.gov.in"],
    homepage: "https://www.csk.gov.in/alerts.html",
    timeoutMs: 20_000,
    revalidateSeconds: 3600,
    maxItems: 24,
    maxBytes: 2_000_000,
    status: "ok",
    licenceNote:
      "Government of India alert index. We ingest the alert title, its published 'Original Issue Date' and the link.",
    defaultCategory: "india",
    publishedAtKind: "advisory",
  },
  {
    id: "cert-eu",
    name: "CERT-EU Threat Intelligence",
    kind: "government",
    format: "rss",
    fetcher: "rss",
    url: "https://cert.europa.eu/publications/threat-intelligence-rss",
    hosts: ["cert.europa.eu"],
    homepage: "https://cert.europa.eu/publications/threat-intelligence",
    timeoutMs: 15_000,
    revalidateSeconds: 3600,
    maxItems: 20,
    maxBytes: 500_000,
    status: "ok",
    licenceNote:
      "EU institutional publication. Headline and excerpt with attribution and a link; no full text is stored.",
    defaultCategory: "advisory",
    publishedAtKind: "advisory",
  },
  {
    id: "ncsc-uk",
    name: "NCSC UK Reports",
    kind: "government",
    format: "rss",
    fetcher: "rss",
    url: "https://www.ncsc.gov.uk/api/1/services/v1/report-rss-feed.xml",
    hosts: ["www.ncsc.gov.uk"],
    homepage: "https://www.ncsc.gov.uk/",
    timeoutMs: 15_000,
    revalidateSeconds: 3600,
    maxItems: 20,
    maxBytes: 500_000,
    status: "ok",
    licenceNote:
      "UK public sector information. Headline and short excerpt with attribution and a link.",
    defaultCategory: "advisory",
    publishedAtKind: "advisory",
  },
  {
    id: "sans-isc",
    name: "SANS Internet Storm Center",
    kind: "publisher",
    format: "rss",
    fetcher: "rss",
    url: "https://isc.sans.edu/rssfeed.xml",
    hosts: ["isc.sans.edu"],
    homepage: "https://isc.sans.edu/",
    timeoutMs: 15_000,
    revalidateSeconds: 1800,
    maxItems: 10,
    maxBytes: 500_000,
    status: "ok",
    licenceNote:
      "SANS ISC diary feed. Headline and excerpt with attribution and a link to the diary.",
    defaultCategory: "research",
  },
  {
    id: "unit42",
    name: "Palo Alto Unit 42",
    kind: "vendor",
    format: "rss",
    fetcher: "rss",
    url: "https://unit42.paloaltonetworks.com/feed/",
    hosts: ["unit42.paloaltonetworks.com"],
    homepage: "https://unit42.paloaltonetworks.com/",
    timeoutMs: 15_000,
    revalidateSeconds: 3600,
    maxItems: 15,
    maxBytes: 500_000,
    status: "ok",
    licenceNote:
      "Vendor research feed. Headline and excerpt with attribution and a link; no full article is stored.",
    defaultCategory: "research",
  },
  {
    id: "msrc-blog",
    name: "Microsoft Security Blog",
    kind: "vendor",
    format: "rss",
    fetcher: "rss",
    url: "https://www.microsoft.com/en-us/security/blog/feed/",
    hosts: ["www.microsoft.com"],
    homepage: "https://www.microsoft.com/en-us/security/blog/",
    timeoutMs: 20_000,
    revalidateSeconds: 3600,
    maxItems: 10,
    maxBytes: 1_000_000,
    status: "ok",
    licenceNote:
      "Vendor blog feed. Headline and short excerpt with attribution and a link.",
    defaultCategory: "research",
  },
  {
    id: "securelist",
    name: "Kaspersky Securelist",
    kind: "vendor",
    format: "rss",
    fetcher: "rss",
    url: "https://securelist.com/feed/",
    hosts: ["securelist.com"],
    homepage: "https://securelist.com/",
    timeoutMs: 15_000,
    revalidateSeconds: 3600,
    maxItems: 15,
    maxBytes: 1_000_000,
    status: "ok",
    licenceNote:
      "Vendor research feed. Headline and short excerpt with attribution and a link.",
    defaultCategory: "research",
  },
  {
    id: "welivesecurity",
    name: "ESET WeLiveSecurity",
    kind: "vendor",
    format: "rss",
    fetcher: "rss",
    url: "https://www.welivesecurity.com/en/rss/feed/",
    hosts: ["www.welivesecurity.com"],
    homepage: "https://www.welivesecurity.com/",
    timeoutMs: 15_000,
    revalidateSeconds: 3600,
    maxItems: 20,
    maxBytes: 500_000,
    status: "ok",
    licenceNote:
      "Vendor research feed. Headline and short excerpt with attribution and a link.",
    defaultCategory: "research",
  },
  {
    id: "crowdstrike",
    name: "CrowdStrike Blog",
    kind: "vendor",
    format: "rss",
    fetcher: "rss",
    url: "https://www.crowdstrike.com/en-us/blog/feed",
    hosts: ["www.crowdstrike.com"],
    homepage: "https://www.crowdstrike.com/en-us/blog/",
    timeoutMs: 20_000,
    revalidateSeconds: 3600,
    maxItems: 10,
    maxBytes: 500_000,
    status: "ok",
    licenceNote:
      "Vendor blog feed. Headline and short excerpt with attribution and a link.",
    defaultCategory: "research",
  },
  {
    id: "schneier",
    name: "Schneier on Security",
    kind: "publisher",
    format: "rss",
    fetcher: "rss",
    url: "https://www.schneier.com/feed/atom/",
    hosts: ["www.schneier.com"],
    homepage: "https://www.schneier.com/",
    timeoutMs: 15_000,
    revalidateSeconds: 3600,
    maxItems: 10,
    maxBytes: 500_000,
    status: "ok",
    licenceNote:
      "Publisher feed. Headline and short excerpt with attribution and a link.",
    defaultCategory: "research",
  },
  {
    id: "ubuntu-usn",
    name: "Ubuntu Security Notices",
    kind: "vendor",
    format: "rss",
    fetcher: "rss",
    url: "https://ubuntu.com/security/notices/rss.xml",
    hosts: ["ubuntu.com"],
    homepage: "https://ubuntu.com/security/notices",
    timeoutMs: 15_000,
    revalidateSeconds: 3600,
    maxItems: 15,
    maxBytes: 500_000,
    status: "ok",
    licenceNote:
      "Ubuntu security notice feed. Headline, advisory date and link; the advisory text is not mirrored.",
    defaultCategory: "vulnerability",
    publishedAtKind: "advisory",
  },
  {
    id: "debian-dsa",
    name: "Debian Security Advisories",
    kind: "vendor",
    format: "rss",
    fetcher: "rss",
    url: "https://www.debian.org/security/dsa.rdf",
    hosts: ["www.debian.org"],
    homepage: "https://www.debian.org/security/",
    timeoutMs: 15_000,
    revalidateSeconds: 3600,
    maxItems: 30,
    maxBytes: 500_000,
    status: "ok",
    licenceNote:
      "Debian security advisory RDF feed. Headline, advisory date and link.",
    defaultCategory: "vulnerability",
    publishedAtKind: "advisory",
  },
  {
    id: "thehackernews",
    name: "The Hacker News",
    kind: "publisher",
    format: "rss",
    fetcher: "rss",
    url: "https://feeds.feedburner.com/TheHackersNews",
    hosts: ["feeds.feedburner.com"],
    homepage: "https://thehackernews.com/",
    timeoutMs: 15_000,
    revalidateSeconds: 900,
    maxItems: 50,
    maxBytes: 1_500_000,
    status: "ok",
    licenceNote:
      "Publisher feed used for headlines and short excerpts with full attribution and a link. No article text is stored.",
  },
  {
    id: "bleepingcomputer",
    name: "BleepingComputer",
    kind: "publisher",
    format: "rss",
    fetcher: "rss",
    url: "https://www.bleepingcomputer.com/feed/",
    hosts: ["www.bleepingcomputer.com"],
    homepage: "https://www.bleepingcomputer.com/",
    timeoutMs: 15_000,
    revalidateSeconds: 900,
    maxItems: 40,
    maxBytes: 1_500_000,
    status: "ok",
    licenceNote:
      "Publisher feed used for headlines and short excerpts with attribution and a link.",
  },
  {
    id: "krebs",
    name: "Krebs on Security",
    kind: "publisher",
    format: "rss",
    fetcher: "rss",
    url: "https://krebsonsecurity.com/feed/",
    hosts: ["krebsonsecurity.com"],
    homepage: "https://krebsonsecurity.com/",
    timeoutMs: 15_000,
    revalidateSeconds: 1800,
    maxItems: 25,
    maxBytes: 1_000_000,
    status: "ok",
    licenceNote:
      "Publisher feed used for headlines and short excerpts with attribution and a link.",
  },
  {
    id: "therecord",
    name: "The Record",
    kind: "publisher",
    format: "rss",
    fetcher: "rss",
    url: "https://therecord.media/feed",
    hosts: ["therecord.media"],
    homepage: "https://therecord.media/",
    timeoutMs: 15_000,
    revalidateSeconds: 900,
    maxItems: 25,
    maxBytes: 1_000_000,
    status: "ok",
    licenceNote:
      "Publisher feed used for headlines and short excerpts with attribution and a link.",
  },
  {
    id: "cyberscoop",
    name: "CyberScoop",
    kind: "publisher",
    format: "rss",
    fetcher: "rss",
    url: "https://cyberscoop.com/feed/",
    hosts: ["cyberscoop.com"],
    homepage: "https://cyberscoop.com/",
    timeoutMs: 15_000,
    revalidateSeconds: 900,
    maxItems: 25,
    maxBytes: 1_000_000,
    status: "ok",
    licenceNote:
      "Publisher feed used for headlines and short excerpts with attribution and a link.",
  },
  {
    id: "ransomware-live",
    name: "ransomware.live",
    kind: "aggregator",
    format: "json",
    fetcher: "ransomware",
    url: "https://api.ransomware.live/v2/recentcyberattacks",
    hosts: ["api.ransomware.live"],
    homepage: "https://www.ransomware.live/",
    timeoutMs: 20_000,
    revalidateSeconds: 3600,
    maxItems: 100,
    maxBytes: 4_000_000,
    status: "ok",
    licenceNote:
      "Aggregator of leak-site claims and reported victims. Records are claims unless a press source is attached; the UI labels them as such. Upstream is rate limited, so responses are cached per source interval.",
    defaultCategory: "ransomware",
    publishedAtKind: "aggregator",
  },
  {
    id: "cert-in",
    name: "CERT-In Advisories",
    kind: "government",
    format: "html",
    fetcher: "csk",
    url: "https://www.cert-in.org.in/s2cMainServlet?pageid=PUBADVLIST",
    hosts: ["www.cert-in.org.in"],
    homepage: "https://www.cert-in.org.in/",
    timeoutMs: 8_000,
    revalidateSeconds: 1800,
    maxItems: 0,
    maxBytes: 500_000,
    status: "disabled",
    statusNote:
      "The official advisory list is served behind a browser session and returns an empty shell to server-side clients, so it cannot be ingested reliably. CERT-In's own Cyber Swachhta Kendra alerts are ingested instead.",
    licenceNote: "Government of India advisories (not currently machine-readable).",
    defaultCategory: "india",
  },
  {
    id: "cisa-ics",
    name: "CISA ICS Advisories",
    kind: "government",
    format: "rss",
    fetcher: "rss",
    url: "https://www.cisa.gov/cybersecurity-advisories/ics-advisories.xml",
    hosts: ["www.cisa.gov"],
    homepage: "https://www.cisa.gov/news-events/cybersecurity-advisories",
    timeoutMs: 25_000,
    revalidateSeconds: 3600,
    maxItems: 0,
    maxBytes: 6_000_000,
    status: "disabled",
    statusNote:
      "The ICS feed is a 5.8 MB duplicate-heavy superset of the cybersecurity advisory feed, so it is not ingested to keep each run bounded.",
    licenceNote: "US Government work, public domain.",
    defaultCategory: "advisory",
  },
];

/**
 * Sources that were probed and found unusable from a server-side client.
 *
 * They are kept separate from `SOURCES` so the UI never presents them as
 * integrated, and so nobody "fixes" a missing fetcher by assuming they work.
 * Each note records what was actually observed.
 */
export const UNAVAILABLE_SOURCES: IntelSourceMeta[] = [
  {
    id: "rapid7",
    name: "Rapid7 Blog",
    kind: "vendor",
    homepage: "https://www.rapid7.com/blog/",
    status: "unavailable",
    statusNote: "Feed endpoint returns HTTP 404.",
    licenceNote: "Not ingested.",
  },
  {
    id: "nvd-rss",
    name: "NVD Legacy RSS",
    kind: "government",
    homepage: "https://nvd.nist.gov/",
    status: "unavailable",
    statusNote: "The legacy NVD RSS endpoint returns HTTP 404; the NVD 2.0 JSON API is used instead.",
    licenceNote: "Public domain.",
  },
  {
    id: "acsc",
    name: "Australian Cyber Security Centre",
    kind: "government",
    homepage: "https://www.cyber.gov.au/",
    status: "unavailable",
    statusNote: "Feed endpoint timed out from the server-side client.",
    licenceNote: "Not ingested.",
  },
  {
    id: "cccs",
    name: "Canadian Centre for Cyber Security",
    kind: "government",
    homepage: "https://www.cyber.gc.ca/",
    status: "unavailable",
    statusNote: "Feed endpoint returns HTTP 404.",
    licenceNote: "Not ingested.",
  },
  {
    id: "jpcert",
    name: "JPCERT/CC",
    kind: "government",
    homepage: "https://www.jpcert.or.jp/english/",
    status: "unavailable",
    statusNote: "RSS endpoint returns HTTP 404.",
    licenceNote: "Not ingested.",
  },
  {
    id: "enisa",
    name: "ENISA",
    kind: "government",
    homepage: "https://www.enisa.europa.eu/",
    status: "unavailable",
    statusNote: "RSS endpoint returns HTTP 404.",
    licenceNote: "Not ingested.",
  },
  {
    id: "krcert",
    name: "KrCERT/CC",
    kind: "government",
    homepage: "https://www.krcert.or.kr/",
    status: "unavailable",
    statusNote: "RSS endpoint returns HTTP 404.",
    licenceNote: "Not ingested.",
  },
  {
    id: "hkcert",
    name: "HKCERT",
    kind: "government",
    homepage: "https://www.hkcert.org/",
    status: "unavailable",
    statusNote: "RSS endpoint returns HTTP 500.",
    licenceNote: "Not ingested.",
  },
  {
    id: "github-advisories",
    name: "GitHub Security Advisories",
    kind: "aggregator",
    homepage: "https://github.com/advisories",
    status: "unavailable",
    statusNote: "Atom endpoint returns HTTP 406 to a non-browser client; the REST API requires a token.",
    licenceNote: "Not ingested.",
  },
  {
    id: "google-threat-intelligence",
    name: "Google Threat Intelligence",
    kind: "vendor",
    homepage: "https://cloud.google.com/blog/topics/threat-intelligence",
    status: "unavailable",
    statusNote: "The advertised feed URL returns an HTML page, not a feed.",
    licenceNote: "Not ingested.",
  },
  {
    id: "project-zero",
    name: "Google Project Zero",
    kind: "vendor",
    homepage: "https://projectzero.google/",
    status: "unavailable",
    statusNote: "Feed is ~11 MB per request, too large for a bounded scheduled run.",
    licenceNote: "Not ingested.",
  },
];

export const SOURCE_BY_ID = new Map(SOURCES.map((source) => [source.id, source]));

export const ACTIVE_SOURCES = SOURCES.filter((source) => source.status === "ok");

export function activeSources(): SourceDef[] {
  return ACTIVE_SOURCES;
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
