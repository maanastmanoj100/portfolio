import type { IntelItem, IntelGeo, IntelSourceMeta, SourceHealth } from "./types";
import type { SourceDef } from "./sources";
import { lookupCountry } from "./countries";
import { classify } from "./classify";
import {
  extractIdentifiers,
  parseDate,
  parseFeed,
  stableId,
  stripHtml,
  truncate,
} from "./parse";

/**
 * Per-source ingestion.
 *
 * Rules this file enforces:
 *
 *  - Every item carries the canonical URL of the original publisher, and the
 *    original publication timestamp if the source provides one.
 *  - Nothing is geocoded unless the source reported a country in a structured
 *    field. RSS text is never scanned for place names.
 *  - Dates are only set from values the source actually emits; a missing date
 *    stays `null` instead of being back-filled with "now".
 *  - Fetch failures are reported per source and never abort the whole run.
 */

const USER_AGENT = "Mozilla/5.0 (compatible; CyberNexusCyberIntel/1.0)";
const MAX_SUMMARY = 280;

async function fetchText(source: SourceDef, url = source.url): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(source.timeoutMs),
    headers: {
      "user-agent": USER_AGENT,
      accept: "application/rss+xml, application/xml, application/json, text/html;q=0.8, */*;q=0.5",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
  }

  return response.text();
}

/** Drops tracking parameters and fragments so syndicated copies dedupe together. */
function canonicalUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|mc_cid|mc_eid|ref$)/i.test(key)) {
        url.searchParams.delete(key);
      }
    }
    return url.toString();
  } catch {
    return null;
  }
}

interface BuildInput {
  title: string;
  summary?: string | null;
  url: string;
  publishedAt?: string | null;
  publishedAtKind?: IntelItem["publishedAtKind"];
  incidentAt?: string | null;
  advisoryAt?: string | null;
  updatedAt?: string | null;
  geo?: IntelGeo | null;
  tags?: string[];
  attribution?: string | null;
  identifiers?: string[];
  /** Overrides keyword classification (used by strictly typed sources). */
  category?: IntelItem["category"];
  categoryBasis?: IntelItem["categoryBasis"];
}

function buildItem(source: SourceDef, input: BuildInput): IntelItem | null {
  const title = stripHtml(input.title).trim();
  const url = canonicalUrl(input.url);
  if (!title || !url) return null;

  const summary = truncate(stripHtml(input.summary ?? ""), MAX_SUMMARY);
  const classification =
    input.category !== undefined
      ? { category: input.category, basis: input.categoryBasis ?? "source" }
      : classify(source, { title, summary, tags: input.tags });

  const identifiers = [
    ...new Set([...(input.identifiers ?? []), ...extractIdentifiers(`${title} ${summary}`)]),
  ].slice(0, 8);

  return {
    id: stableId(url),
    title,
    summary,
    url,
    sourceId: source.id,
    sourceName: source.name,
    sourceKind: source.kind,
    category: classification.category,
    categoryBasis: classification.basis,
    publishedAt: input.publishedAt ?? null,
    publishedAtKind: input.publishedAtKind ?? "article",
    incidentAt: input.incidentAt ?? null,
    advisoryAt: input.advisoryAt ?? null,
    updatedAt: input.updatedAt ?? null,
    geo: input.geo ?? null,
    identifiers,
    tags: [...new Set((input.tags ?? []).filter(Boolean))].slice(0, 6),
    attribution: input.attribution ?? null,
    firstSeenAt: new Date().toISOString(),
  };
}

function geoFromCountry(
  code: string | null | undefined,
  reportedBy: string,
): IntelGeo | null {
  const ref = lookupCountry(code);
  if (!ref) return null;
  return {
    scope: "country",
    countryCode: ref.code,
    countryName: ref.name,
    lat: ref.lat,
    lon: ref.lon,
    basis: "victim-country",
    reportedBy,
  };
}

/* ------------------------------------------------------------------ */
/* RSS / Atom                                                          */
/* ------------------------------------------------------------------ */

async function fetchFeed(source: SourceDef): Promise<IntelItem[]> {
  const xml = await fetchText(source);
  const entries = parseFeed(xml);

  const items: IntelItem[] = [];
  for (const entry of entries) {
    if (items.length >= source.maxItems) break;
    if (!entry.link) continue;
    const item = buildItem(source, {
      title: entry.title,
      summary: entry.summary,
      url: entry.link,
      publishedAt: entry.published,
      updatedAt: entry.updated,
      tags: entry.categories,
    });
    if (item) items.push(item);
  }
  return items;
}

/* ------------------------------------------------------------------ */
/* CISA Known Exploited Vulnerabilities                                */
/* ------------------------------------------------------------------ */

interface KevRecord {
  cveID?: string;
  vendorProject?: string;
  product?: string;
  vulnerabilityName?: string;
  dateAdded?: string;
  shortDescription?: string;
  requiredAction?: string;
  dueDate?: string;
  knownRansomwareCampaignUse?: string;
}

async function fetchKev(source: SourceDef): Promise<IntelItem[]> {
  const payload = JSON.parse(await fetchText(source)) as { vulnerabilities?: KevRecord[] };
  const records = payload.vulnerabilities ?? [];

  return records
    .filter((record) => record.cveID && record.dateAdded)
    .sort((a, b) => (b.dateAdded ?? "").localeCompare(a.dateAdded ?? ""))
    .slice(0, source.maxItems)
    .flatMap((record) => {
      const dateAdded = parseDate(record.dateAdded);
      const parts = [
        record.vulnerabilityName,
        record.vendorProject && record.product
          ? `${record.vendorProject} ${record.product}`
          : record.vendorProject ?? record.product,
        record.shortDescription,
        record.requiredAction ? `Required action: ${record.requiredAction}` : null,
      ].filter(Boolean);

      const item = buildItem(source, {
        title: `${record.cveID} — ${record.vulnerabilityName ?? "known exploited vulnerability"}`,
        summary: parts.join(" · "),
        // CVE.org is the canonical record; NVD is used so KEV and NVD entries
        // for the same CVE collapse into one archive record.
        url: `https://nvd.nist.gov/vuln/detail/${record.cveID}`,
        publishedAt: dateAdded,
        publishedAtKind: "catalog",
        advisoryAt: dateAdded,
        identifiers: record.cveID ? [record.cveID] : [],
        tags: [
          "KEV",
          record.knownRansomwareCampaignUse === "Known" ? "known-ransomware-use" : "",
          record.vendorProject ?? "",
        ],
        category: "exploit",
        categoryBasis: "source",
      });
      return item ? [item] : [];
    });
}

/* ------------------------------------------------------------------ */
/* NVD                                                                 */
/* ------------------------------------------------------------------ */

interface NvdCve {
  id?: string;
  published?: string;
  lastModified?: string;
  vulnStatus?: string;
  descriptions?: { lang?: string; value?: string }[];
  weaknesses?: { description?: { lang?: string; value?: string }[] }[];
  metrics?: Record<string, { cvssData?: { baseScore?: number; baseSeverity?: string } }[]>;
}

async function fetchNvd(source: SourceDef): Promise<IntelItem[]> {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 3600_000);
  const params = new URLSearchParams({
    pubStartDate: start.toISOString(),
    pubEndDate: end.toISOString(),
    resultsPerPage: String(source.maxItems),
  });

  const payload = JSON.parse(
    await fetchText(source, `${source.url}?${params.toString()}`),
  ) as { vulnerabilities?: { cve?: NvdCve }[] };

  const items: IntelItem[] = [];
  for (const entry of payload.vulnerabilities ?? []) {
    const cve = entry.cve;
    if (!cve?.id) continue;

    const description =
      cve.descriptions?.find((d) => d.lang === "en")?.value ??
      cve.descriptions?.[0]?.value ??
      "";
    if (!description) continue;

    const cvss = cve.metrics
      ? Object.values(cve.metrics)
          .flat()
          .find((metric) => metric.cvssData?.baseScore !== undefined)?.cvssData
      : undefined;

    const tags = [
      ...(cve.weaknesses ?? []).flatMap((weakness) =>
        (weakness.description ?? []).map((d) => d.value ?? ""),
      ),
      cve.vulnStatus ?? "",
      cvss?.baseSeverity ? `CVSS ${cvss.baseScore} ${cvss.baseSeverity}` : "",
    ];

    const item = buildItem(source, {
      title: `${cve.id} — ${truncate(description, 96)}`,
      summary: description,
      url: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
      publishedAt: parseDate(cve.published),
      publishedAtKind: "article",
      updatedAt: parseDate(cve.lastModified),
      identifiers: [cve.id],
      tags,
      category: "vulnerability",
      categoryBasis: "source",
    });
    if (item) items.push(item);
  }

  return items
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, source.maxItems);
}

/* ------------------------------------------------------------------ */
/* Cyber Swachhta Kendra (CERT-In, India)                              */
/* ------------------------------------------------------------------ */

/** Runs `fn` over `items` with bounded concurrency, preserving order. */
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function extractCskSummary(text: string): string {
  const sectionHeading =
    /(?:Target Audience|Infection Mechanism|Indicators of Compromise|IOCs?|Solution|Mitigation|Remediation|References|Affected Software|Technical Details|Best Practices|Description|Impact|Severity)\s*:?/i;

  // Some alerts have an explicit "Overview" heading; others start straight
  // into the description after the header fields.
  const overview = /\bOverview\b\s*:?-?\s*/i.exec(text);
  if (overview) {
    const body = text.slice(overview.index + overview[0].length);
    const cut = sectionHeading.exec(body);
    return truncate(cut && cut.index > 40 ? body.slice(0, cut.index) : body, MAX_SUMMARY);
  }

  const headerField =
    /(?:Severity\s*:?-?\s*(?:Critical|High|Medium|Low|Informational)|Original Issue Date\s*:?-?\s*[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})/gi;
  let headerEnd = -1;
  for (const match of text.matchAll(headerField)) {
    headerEnd = (match.index ?? 0) + match[0].length;
  }
  if (headerEnd < 0) return "";

  const body = text.slice(headerEnd).trim().replace(/^(?:Overview|Description)\s*:?-?\s*/i, "");
  const cut = sectionHeading.exec(body);
  return truncate(cut && cut.index > 40 ? body.slice(0, cut.index) : body, MAX_SUMMARY);
}

async function fetchCskAlertPage(
  source: SourceDef,
  url: string,
): Promise<{ issueDate: string | null; severity: string | null; overview: string } | null> {
  try {
    const html = await fetchText(source, url);
    const text = stripHtml(html);

    const issueMatch = /Original Issue Date\s*:?-?\s*([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})/i.exec(text);
    const severityMatch = /Severity\s*:?-?\s*(Critical|High|Medium|Low|Informational)/i.exec(text);

    return {
      issueDate: issueMatch ? parseDate(issueMatch[1]) : null,
      severity: severityMatch ? severityMatch[1] : null,
      overview: extractCskSummary(text),
    };
  } catch {
    return null;
  }
}

async function fetchCskAlerts(source: SourceDef): Promise<IntelItem[]> {
  const html = await fetchText(source);
  const anchors = [...html.matchAll(/<a[^>]+href="(alerts\/[^"]+\.html)"[^>]*>([\s\S]*?)<\/a>/gi)];

  const seen = new Set<string>();
  const alerts: { title: string; url: string }[] = [];

  for (const anchor of anchors) {
    if (alerts.length >= source.maxItems) break;
    const href = anchor[1];
    if (seen.has(href)) continue;
    seen.add(href);

    let url: string;
    try {
      url = new URL(href, source.url).toString();
    } catch {
      continue;
    }

    const title = stripHtml(anchor[2]).trim();
    if (!title) continue;

    alerts.push({ title, url });
  }

  const details = await mapLimit(alerts, 6, (alert) => fetchCskAlertPage(source, alert.url));

  return alerts.flatMap((alert, index) => {
    const detail = details[index];
    const item = buildItem(source, {
      title: alert.title,
      summary: detail?.overview ?? "",
      url: alert.url,
      // An advisory's "Original Issue Date" is its publication date; the alert
      // describes a vulnerability, not an incident at a location.
      publishedAt: detail?.issueDate ?? null,
      publishedAtKind: "advisory",
      advisoryAt: detail?.issueDate ?? null,
      tags: [detail?.severity ? `Severity: ${detail.severity}` : "", "CERT-In"],
      category: "india",
      categoryBasis: "source",
    });
    return item ? [item] : [];
  });
}

/* ------------------------------------------------------------------ */
/* ransomware.live                                                     */
/* ------------------------------------------------------------------ */

interface RansomwareRecord {
  victim?: string;
  group?: string;
  claim_gang?: string | boolean | null;
  country?: string | null;
  activity?: string | null;
  description?: string | null;
  summary?: string | null;
  domain?: string | null;
  date?: string | null;
  attackdate?: string | null;
  added?: string | null;
  discovered?: string | null;
  url?: string | null;
  link?: string | null;
}

async function fetchRansomwareLive(source: SourceDef): Promise<IntelItem[]> {
  const payload = JSON.parse(await fetchText(source)) as RansomwareRecord[] | { message?: string };
  if (!Array.isArray(payload)) {
    throw new Error(payload.message ?? "unexpected payload");
  }

  const items: IntelItem[] = [];
  for (const record of payload) {
    if (items.length >= source.maxItems) break;
    const group =
      typeof record.claim_gang === "string"
        ? record.claim_gang
        : typeof record.group === "string"
          ? record.group
          : null;
    const victim = record.victim?.trim();
    // `link` is the aggregator's own record for this claim; `url` is a press or
    // regulator document. We link to the record that the claim actually comes
    // from, and keep the aggregator's summary when it has one.
    const link = record.link ?? record.url;
    if (!victim || !group || !link) continue;

    const country = geoFromCountry(record.country, "ransomware.live (leak-site claim)");
    const description = record.description && record.description !== "N/A" ? record.description : null;
    const summary =
      record.summary?.trim() ||
      [
        `Victim: ${victim}`,
        record.activity ? `Sector: ${record.activity}` : null,
        country ? `Country: ${country.countryName}` : null,
        record.domain ? `Domain: ${record.domain}` : null,
        description,
      ]
        .filter(Boolean)
        .join(" · ");

    const item = buildItem(source, {
      title: `${victim} — claimed by ${group}`,
      summary,
      url: link,
      // `date` is the claimed attack date; `discovered`/`added` are when the
      // aggregator recorded the claim, which is not an article publication date.
      incidentAt: parseDate(record.date ?? record.attackdate),
      publishedAt: parseDate(record.discovered) ?? parseDate(record.added),
      publishedAtKind: "aggregator",
      geo: country,
      attribution: `Leak-site claim by ${group}`,
      tags: [record.activity ?? "", group, "leak-site claim"],
      category: "ransomware",
      categoryBasis: "source",
    });
    if (item) items.push(item);
  }

  return items;
}

/* ------------------------------------------------------------------ */
/* Dispatch                                                            */
/* ------------------------------------------------------------------ */

const FETCHERS: Record<string, (source: SourceDef) => Promise<IntelItem[]>> = {
  "cisa-advisories": fetchFeed,
  "cisa-news": fetchFeed,
  "thehackernews": fetchFeed,
  "bleepingcomputer": fetchFeed,
  "krebs": fetchFeed,
  "cisa-kev": fetchKev,
  "nvd-cve": fetchNvd,
  "csk-alerts": fetchCskAlerts,
  "ransomware-live": fetchRansomwareLive,
};

export interface IngestResult {
  items: IntelItem[];
  health: SourceHealth[];
}

export async function ingestSources(sources: SourceDef[]): Promise<IngestResult> {
  const settled = await Promise.allSettled(
    sources.map(async (source) => {
      const fetcher = FETCHERS[source.id];
      if (!fetcher) return { source, items: [] as IntelItem[], error: "no fetcher" };
      try {
        const items = await fetcher(source);
        return { source, items, error: null as string | null };
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown error";
        return { source, items: [] as IntelItem[], error: message };
      }
    }),
  );

  const items: IntelItem[] = [];
  const health: SourceHealth[] = [];

  for (const result of settled) {
    if (result.status === "rejected") continue;
    const { source, items: fetched, error } = result.value;
    items.push(...fetched);
    health.push({
      id: source.id,
      name: source.name,
      kind: source.kind,
      status: error ? "error" : "ok",
      itemCount: fetched.length,
      fetchedAt: new Date().toISOString(),
      ...(error ? { error } : {}),
    });
  }

  return { items, health };
}

export function disabledSourceHealth(
  sources: { id: string; name: string; kind: IntelSourceMeta["kind"] }[],
): SourceHealth[] {
  return sources.map((source) => ({
    id: source.id,
    name: source.name,
    kind: source.kind,
    status: "skipped",
    itemCount: 0,
    fetchedAt: null,
  }));
}
