/**
 * CVE lookup helpers.
 *
 * The data comes from the NIST National Vulnerability Database (NVD) 2.0 API,
 * proxied by `app/api/cve/[id]`. Everything in this module is pure so the
 * normalisation of that (untrusted) JSON can be tested without the network.
 *
 * Nothing here claims a CVE is exploited, patched or still vulnerable. It only
 * restates fields the NVD returned, and renders "Not provided" / "Unknown"
 * where the source has no value.
 */

export type CveSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE" | "UNKNOWN";

export interface CveMetric {
  /** CVSS version, e.g. "3.1" or "2.0". */
  version: string;
  /** "Primary" or "Secondary", as reported by the NVD. */
  type: string;
  source: string | null;
  score: number | null;
  severity: CveSeverity;
  vector: string | null;
}

export interface CveAffectedProduct {
  vendor: string | null;
  product: string;
  /** Exact version when the CPE names one. */
  version: string | null;
  /** Version range expression when the CPE names one. */
  range: string | null;
}

export interface CveReference {
  url: string;
  source: string | null;
  tags: string[];
}

export interface CveRecord {
  id: string;
  status: string | null;
  published: string | null;
  lastModified: string | null;
  description: string | null;
  metrics: CveMetric[];
  weaknesses: string[];
  affected: CveAffectedProduct[];
  references: CveReference[];
  /** Canonical NVD detail page for this CVE. */
  sourceUrl: string;
}

export const CVE_ID_PATTERN = /^CVE-\d{4}-\d{4,7}$/;

const SEVERITIES = new Set<CveSeverity>([
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "NONE",
  "UNKNOWN",
]);

const MAX_DESCRIPTION = 4000;
const MAX_REFERENCES = 20;
const MAX_AFFECTED = 12;
const MAX_WEAKNESSES = 12;

/** Trim, uppercase and validate a user-supplied CVE identifier. */
export function normalizeCveId(input: string): string | null {
  const value = input.trim().toUpperCase();
  if (!CVE_ID_PATTERN.test(value)) return null;
  const year = Number(value.split("-")[1]);
  if (!Number.isInteger(year) || year < 1999) return null;
  return value;
}

export function cveDetailUrl(id: string): string {
  const normalized = normalizeCveId(id);
  return normalized
    ? `https://nvd.nist.gov/vuln/detail/${normalized}`
    : "https://nvd.nist.gov/vuln/search";
}

export function severityFromScore(score: number | null): CveSeverity {
  if (score === null || !Number.isFinite(score)) return "UNKNOWN";
  if (score === 0) return "NONE";
  if (score < 4) return "LOW";
  if (score < 7) return "MEDIUM";
  if (score < 9) return "HIGH";
  return "CRITICAL";
}

/** A base score of 0.0 is a real score, not missing data. */
export function formatCvssScore(score: number | null): string {
  return score === null || !Number.isFinite(score) ? "Not scored" : score.toFixed(1);
}

export function formatCveDate(value: string | null): string {
  if (!value) return "Not provided";
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) return "Not provided";
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  // Strip control characters before the text can reach the DOM.
  const cleaned = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, max);
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asIsoDate(value: unknown): string | null {
  const raw = asString(value, 40);
  if (!raw) return null;
  // NVD timestamps carry no zone designator but are UTC. Without this, the
  // value would be parsed in the server's local time and shifted.
  const normalized = /([zZ]|[+-]\d{2}:?\d{2})$/.test(raw) ? raw : `${raw}Z`;
  const ms = Date.parse(normalized);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

function asSeverity(value: unknown, score: number | null): CveSeverity {
  const raw = asString(value, 20)?.toUpperCase() as CveSeverity | undefined;
  if (raw && SEVERITIES.has(raw)) return raw;
  return severityFromScore(score);
}

function versionRank(version: string): number {
  if (version.startsWith("4")) return 4;
  if (version.startsWith("3.1")) return 3;
  if (version.startsWith("3")) return 2;
  if (version.startsWith("2")) return 1;
  return 0;
}

function parseMetric(raw: unknown, fallbackVersion: string): CveMetric | null {
  const metric = asRecord(raw);
  if (!metric) return null;
  const cvssData = asRecord(metric.cvssData);
  if (!cvssData) return null;

  const version = asString(cvssData.version, 10) ?? fallbackVersion;
  const score = asNumber(cvssData.baseScore);
  const vector = asString(cvssData.vectorString, 200);
  // CVSS v2 carries severity on the metric, v3+ inside cvssData.
  const severity = asSeverity(cvssData.baseSeverity ?? metric.baseSeverity, score);

  return {
    version,
    type: asString(metric.type, 20) ?? "Unknown",
    source: asString(metric.source, 120),
    score,
    severity,
    vector,
  };
}

const METRIC_KEYS: { key: string; version: string }[] = [
  { key: "cvssMetricV40", version: "4.0" },
  { key: "cvssMetricV31", version: "3.1" },
  { key: "cvssMetricV30", version: "3.0" },
  { key: "cvssMetricV2", version: "2.0" },
];

function parseMetrics(value: unknown): CveMetric[] {
  const metrics = asRecord(value);
  if (!metrics) return [];

  const parsed: CveMetric[] = [];
  for (const { key, version } of METRIC_KEYS) {
    const list = metrics[key];
    if (!Array.isArray(list)) continue;
    for (const entry of list) {
      const metric = parseMetric(entry, version);
      if (metric) parsed.push(metric);
    }
  }

  return parsed.sort((a, b) => {
    const primaryA = a.type.toLowerCase() === "primary" ? 1 : 0;
    const primaryB = b.type.toLowerCase() === "primary" ? 1 : 0;
    return primaryB - primaryA || versionRank(b.version) - versionRank(a.version);
  });
}

/** Best available metric: NVD primary first, then the newest CVSS version. */
export function primaryMetric(record: CveRecord): CveMetric | null {
  return record.metrics[0] ?? null;
}

function humanizeCpePart(value: string): string | null {
  const cleaned = value.replace(/\\/g, "").replace(/_/g, " ").trim();
  if (!cleaned || cleaned === "*" || cleaned === "-") return null;
  return cleaned;
}

function versionRange(match: Record<string, unknown>): string | null {
  const parts: string[] = [];
  const endExcluding = asString(match.versionEndExcluding, 60);
  const endIncluding = asString(match.versionEndIncluding, 60);
  const startIncluding = asString(match.versionStartIncluding, 60);
  const startExcluding = asString(match.versionStartExcluding, 60);
  if (endExcluding) parts.push(`< ${endExcluding}`);
  if (endIncluding) parts.push(`<= ${endIncluding}`);
  if (startIncluding) parts.push(`>= ${startIncluding}`);
  if (startExcluding) parts.push(`> ${startExcluding}`);
  return parts.length ? parts.join(", ") : null;
}

function collectCpeMatches(node: unknown, out: unknown[], depth = 0): void {
  if (depth > 8) return;
  const record = asRecord(node);
  if (!record) return;
  if (Array.isArray(record.cpeMatch)) out.push(...record.cpeMatch);
  if (Array.isArray(record.children)) {
    for (const child of record.children) collectCpeMatches(child, out, depth + 1);
  }
}

function parseAffected(value: unknown): CveAffectedProduct[] {
  if (!Array.isArray(value)) return [];

  const matches: unknown[] = [];
  for (const configuration of value) {
    const record = asRecord(configuration);
    if (!record) continue;
    if (Array.isArray(record.nodes)) {
      for (const node of record.nodes) collectCpeMatches(node, matches);
    }
  }

  const seen = new Set<string>();
  const affected: CveAffectedProduct[] = [];

  for (const entry of matches) {
    const match = asRecord(entry);
    if (!match || match.vulnerable !== true) continue;
    const criteria = asString(match.criteria, 400);
    if (!criteria) continue;

    const cpe = /^cpe:2\.3:([^:]+):([^:]+):([^:]+):([^:]+):([^:]+):/.exec(criteria);
    if (!cpe) continue;

    const product = humanizeCpePart(cpe[3]);
    if (!product) continue;

    const vendor = humanizeCpePart(cpe[2]);
    const baseVersion = humanizeCpePart(cpe[4]);
    // CPE splits a version into `version` and `update` (e.g. 2.0 + beta9).
    // Showing only the version would misstate which build is affected.
    const update = humanizeCpePart(cpe[5]);
    const version = baseVersion && update ? `${baseVersion} ${update}` : baseVersion;
    const range = versionRange(match);
    const key = `${vendor ?? ""}|${product}|${version ?? ""}|${range ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    affected.push({ vendor, product, version, range });
    if (affected.length >= MAX_AFFECTED) break;
  }

  return affected;
}

function parseWeaknesses(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const found = new Set<string>();

  for (const weakness of value) {
    const record = asRecord(weakness);
    if (!record || !Array.isArray(record.description)) continue;
    for (const description of record.description) {
      const item = asRecord(description);
      if (!item) continue;
      const lang = asString(item.lang, 10);
      if (lang && lang !== "en") continue;
      const text = asString(item.value, 40);
      if (text && /^CWE-\d+$/i.test(text)) found.add(text.toUpperCase());
    }
  }

  return [...found].slice(0, MAX_WEAKNESSES);
}

function safeHttpUrl(value: unknown): string | null {
  const raw = asString(value, 2000);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function parseReferences(value: unknown): CveReference[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const references: CveReference[] = [];

  for (const entry of value) {
    const record = asRecord(entry);
    if (!record) continue;
    const url = safeHttpUrl(record.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);

    const tags = Array.isArray(record.tags)
      ? record.tags
          .map((tag) => asString(tag, 60))
          .filter((tag): tag is string => Boolean(tag))
          .slice(0, 6)
      : [];

    references.push({
      url,
      source: asString(record.source, 120),
      tags,
    });
    if (references.length >= MAX_REFERENCES) break;
  }

  return references;
}

function pickDescription(value: unknown): string | null {
  if (!Array.isArray(value)) return null;
  let fallback: string | null = null;

  for (const entry of value) {
    const record = asRecord(entry);
    if (!record) continue;
    const text = asString(record.value, MAX_DESCRIPTION);
    if (!text) continue;
    if (asString(record.lang, 10) === "en") return text;
    fallback ??= text;
  }

  return fallback;
}

/**
 * Convert an NVD 2.0 response into the compact record the UI renders.
 * Returns null when the response has no vulnerability (an unknown CVE).
 */
export function normalizeNvdResponse(payload: unknown, requestedId: string): CveRecord | null {
  const root = asRecord(payload);
  if (!root || !Array.isArray(root.vulnerabilities) || root.vulnerabilities.length === 0) {
    return null;
  }

  const entries: Record<string, unknown>[] = [];
  for (const vulnerability of root.vulnerabilities) {
    const wrapper = asRecord(vulnerability);
    const cve = wrapper ? asRecord(wrapper.cve) : null;
    if (cve) entries.push(cve);
  }
  if (entries.length === 0) return null;

  const wanted = normalizeCveId(requestedId);
  const entry =
    (wanted
      ? entries.find((candidate) => asString(candidate.id, 30)?.toUpperCase() === wanted)
      : null) ?? entries[0];

  const id = normalizeCveId(asString(entry.id, 30) ?? "");
  if (!id) return null;

  return {
    id,
    status: asString(entry.vulnStatus, 40),
    published: asIsoDate(entry.published),
    lastModified: asIsoDate(entry.lastModified),
    description: pickDescription(entry.descriptions),
    metrics: parseMetrics(entry.metrics),
    weaknesses: parseWeaknesses(entry.weaknesses),
    affected: parseAffected(entry.configurations),
    references: parseReferences(entry.references),
    sourceUrl: cveDetailUrl(id),
  };
}

/** Short labels for the metric rows, e.g. "CVSS 3.1". */
export function metricLabel(metric: CveMetric): string {
  return `CVSS ${metric.version}`;
}

/* ------------------------------------------------------------------------- *
 * Validation of the compact record returned by `/api/cve/[id]`.
 *
 * The browser never sees the raw NVD payload, so the dialog has to validate
 * the shape this site produced rather than the upstream one. It is re-checked
 * rather than trusted: the response still crosses a network boundary.
 * ------------------------------------------------------------------------- */

function isSeverity(value: unknown): value is CveSeverity {
  return typeof value === "string" && SEVERITIES.has(value as CveSeverity);
}

function parseMetricList(value: unknown): CveMetric[] {
  if (!Array.isArray(value)) return [];
  const metrics: CveMetric[] = [];

  for (const entry of value) {
    const record = asRecord(entry);
    if (!record) continue;
    const version = asString(record.version, 10);
    const type = asString(record.type, 20);
    if (!version || !type) continue;

    const score = asNumber(record.score);
    metrics.push({
      version,
      type,
      source: asString(record.source, 120),
      score,
      severity: isSeverity(record.severity) ? record.severity : severityFromScore(score),
      vector: asString(record.vector, 200),
    });
    if (metrics.length >= 8) break;
  }

  return metrics;
}

function parseAffectedList(value: unknown): CveAffectedProduct[] {
  if (!Array.isArray(value)) return [];
  const affected: CveAffectedProduct[] = [];

  for (const entry of value) {
    const record = asRecord(entry);
    if (!record) continue;
    const product = asString(record.product, 200);
    if (!product) continue;
    affected.push({
      vendor: asString(record.vendor, 200),
      product,
      version: asString(record.version, 120),
      range: asString(record.range, 200),
    });
    if (affected.length >= MAX_AFFECTED) break;
  }

  return affected;
}

function parseReferenceList(value: unknown): CveReference[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const references: CveReference[] = [];

  for (const entry of value) {
    const record = asRecord(entry);
    if (!record) continue;
    const url = safeHttpUrl(record.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);

    const tags = Array.isArray(record.tags)
      ? record.tags
          .map((tag) => asString(tag, 60))
          .filter((tag): tag is string => Boolean(tag))
          .slice(0, 6)
      : [];

    references.push({ url, source: asString(record.source, 120), tags });
    if (references.length >= MAX_REFERENCES) break;
  }

  return references;
}

function parseWeaknessList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const found = new Set<string>();
  for (const entry of value) {
    const text = asString(entry, 40);
    if (text && /^CWE-\d+$/i.test(text)) found.add(text.toUpperCase());
    if (found.size >= MAX_WEAKNESSES) break;
  }
  return [...found];
}

/**
 * Validate a compact CVE record. Returns null when the payload is not a record
 * for the requested identifier, so a mismatched response is never rendered.
 */
export function parseCveRecord(payload: unknown, requestedId: string): CveRecord | null {
  const root = asRecord(payload);
  if (!root) return null;

  const id = normalizeCveId(asString(root.id, 30) ?? "");
  if (!id) return null;

  const wanted = normalizeCveId(requestedId);
  if (wanted && wanted !== id) return null;

  return {
    id,
    status: asString(root.status, 40),
    published: asIsoDate(root.published),
    lastModified: asIsoDate(root.lastModified),
    description: asString(root.description, MAX_DESCRIPTION),
    metrics: parseMetricList(root.metrics),
    weaknesses: parseWeaknessList(root.weaknesses),
    affected: parseAffectedList(root.affected),
    references: parseReferenceList(root.references),
    sourceUrl: cveDetailUrl(id),
  };
}
