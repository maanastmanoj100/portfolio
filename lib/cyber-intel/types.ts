/**
 * Domain model for the Cyber Intelligence section.
 *
 * Design rules that the rest of this feature depends on:
 *
 *  - Nothing here is invented. Every field is either taken from a source's own
 *    payload or derived from it by a rule that is recorded alongside the value
 *    (`categoryBasis`, `geo.basis`).
 *  - A record may legitimately have no location. `geo` is `null` unless a
 *    source reported a country in a structured field.
 *  - Publication, incident and advisory dates are separate fields. Most
 *    sources only provide one of them, and the UI must not conflate them.
 */

export type IntelCategory =
  | "vulnerability"
  | "ransomware"
  | "breach"
  | "incident"
  | "threat-actor"
  | "exploit"
  | "research"
  | "advisory"
  | "india"
  | "general";

export const CATEGORY_ORDER: IntelCategory[] = [
  "vulnerability",
  "exploit",
  "ransomware",
  "breach",
  "incident",
  "threat-actor",
  "research",
  "advisory",
  "india",
  "general",
];

export interface CategoryMeta {
  id: IntelCategory;
  label: string;
  /** Short explanation shown in the filter UI and the legend. */
  description: string;
  /** Marker colour on the globe. Muted, one hue per family. */
  color: string;
}

export const CATEGORIES: Record<IntelCategory, CategoryMeta> = {
  vulnerability: {
    id: "vulnerability",
    label: "Vulnerabilities",
    description: "CVE records and vendor security advisories.",
    color: "#3b82f6",
  },
  exploit: {
    id: "exploit",
    label: "Exploits & zero-days",
    description: "Exploited-in-the-wild and zero-day disclosures.",
    color: "#ef4444",
  },
  ransomware: {
    id: "ransomware",
    label: "Ransomware & malware",
    description: "Ransomware operations, malware families and loaders.",
    color: "#f59e0b",
  },
  breach: {
    id: "breach",
    label: "Breaches & exposed data",
    description: "Data breaches, leaks and exposed records.",
    color: "#8b5cf6",
  },
  incident: {
    id: "incident",
    label: "Attacks & incidents",
    description: "Reported intrusions, outages and disruptive attacks.",
    color: "#e879a6",
  },
  "threat-actor": {
    id: "threat-actor",
    label: "Threat actors",
    description: "Named groups, campaigns and attribution reporting.",
    color: "#fb7185",
  },
  research: {
    id: "research",
    label: "Research & guidance",
    description: "Defensive research, analysis and hardening guidance.",
    color: "#10b981",
  },
  advisory: {
    id: "advisory",
    label: "Advisories",
    description: "Government and CERT advisories.",
    color: "#00b4d8",
  },
  india: {
    id: "india",
    label: "Indian advisories",
    description: "Published by CERT-In / Cyber Swachhta Kendra (India).",
    color: "#22d3ee",
  },
  general: {
    id: "general",
    label: "General",
    description: "Security news that does not match a specific category.",
    color: "#8e92a0",
  },
};

/**
 * How much we actually know about a location.
 *
 * Only `country` scope exists today because that is the finest granularity any
 * ingested source reports in a structured field. City-level precision is
 * deliberately not modelled: guessing it would be fabrication.
 */
export interface IntelGeo {
  scope: "country";
  countryCode: string;
  countryName: string;
  /** Representative point of the country, from `countries.ts`. */
  lat: number;
  lon: number;
  /**
   * - `victim-country`: the country of the affected organisation (ransomware
   *   victim records). This is where the victim is, not where the attacker is.
   */
  basis: "victim-country";
  /** Provenance sentence shown in the UI, e.g. "Reported by ransomware.live". */
  reportedBy: string;
}

export interface IntelSourceMeta {
  id: string;
  name: string;
  kind: "government" | "vendor" | "publisher" | "aggregator";
  homepage: string;
  /** Whether we currently ingest it, and why not if we don't. */
  status: "ok" | "unavailable" | "disabled";
  statusNote?: string;
  licenceNote: string;
}

export interface IntelItem {
  id: string;
  title: string;
  /** Plain-text excerpt built from the source's own summary. Never a full copy. */
  summary: string;
  url: string;
  sourceId: string;
  sourceName: string;
  sourceKind: IntelSourceMeta["kind"];
  /**
   * The identifier the publisher itself uses (Atom `<id>`, RSS `<guid>`, CVE
   * id, advisory slug). Used as a second dedupe key so a publisher renaming a
   * URL does not create a second record.
   */
  externalId: string | null;
  category: IntelCategory;
  /** `source` = the feed told us, `keyword` = our rule matched, `type` = feed type. */
  categoryBasis: "source" | "keyword" | "type";
  /** Publication time of the article/advisory (ISO 8601, UTC). */
  publishedAt: string | null;
  /**
   * What `publishedAt` actually means for this record. Feeds publish articles,
   * advisory indexes publish issue dates, catalogues publish "date added", and
   * aggregators record leak-site claims. The UI labels the date accordingly so
   * it is never presented as an article publication date when it is not.
   */
  publishedAtKind: "article" | "advisory" | "catalog" | "aggregator";
  /** When the described incident happened, only if the source states it. */
  incidentAt: string | null;
  /** Original issue/revision date of an advisory, if the source provides one. */
  advisoryAt: string | null;
  updatedAt: string | null;
  geo: IntelGeo | null;
  /** CVE, CISA KEV, advisory identifiers found in the record. */
  identifiers: string[];
  /** Free-form labels from the source (feed categories, victim sector, ...). */
  tags: string[];
  /** Explicit attribution sentence when the source reports one. */
  attribution: string | null;
  /** When our archive first stored this record. */
  firstSeenAt: string;
  /** Last time the source still returned this record. */
  lastSeenAt: string;
}

/** Aggregated marker for the globe: one per country, never per article. */
export interface GeoCluster {
  countryCode: string;
  countryName: string;
  lat: number;
  lon: number;
  count: number;
  categories: Partial<Record<IntelCategory, number>>;
  latestAt: string | null;
  /** Ids of the items behind this marker, newest first (bounded). */
  itemIds: string[];
}

export interface SourceHealth {
  id: string;
  name: string;
  kind: IntelSourceMeta["kind"];
  status: "ok" | "error" | "skipped";
  itemCount: number;
  fetchedAt: string | null;
  error?: string;
  /** Last successful refresh (null if never). */
  lastSuccessAt?: string | null;
  /** Consecutive failed attempts, used to explain backoff in the UI. */
  consecutiveFailures?: number;
  /** Earliest time the scheduler will try this source again. */
  nextAttemptAt?: string | null;
  /** Wall-clock duration of the last attempt. */
  durationMs?: number | null;
}

/**
 * Durable per-source ingestion state.
 *
 * `nextAttemptAt` is what makes scheduling idempotent across processes: every
 * worker reads the same row, so a second runner can see that a source is not
 * due yet instead of hammering the publisher.
 */
export interface SourceState {
  id: string;
  status: "ok" | "error" | "skipped";
  itemCount: number;
  fetchedAt: string | null;
  lastSuccessAt: string | null;
  error: string | null;
  consecutiveFailures: number;
  nextAttemptAt: string | null;
  durationMs: number | null;
  etag: string | null;
  lastModified: string | null;
}

/** One execution of the ingestion runner, recorded for observability. */
export interface IngestRun {
  id: string;
  trigger: "cron" | "manual" | "request";
  startedAt: string;
  finishedAt: string | null;
  status: "running" | "ok" | "partial" | "error" | "skipped";
  sourcesAttempted: number;
  sourcesOk: number;
  sourcesFailed: number;
  itemsFetched: number;
  itemsNew: number;
  itemsUpdated: number;
  /** Sanitised, non-secret summary. Never a stack trace. */
  note: string | null;
}

export type StorageDriver = "postgres" | "sqlite" | "memory";

export interface StorageInfo {
  driver: StorageDriver;
  /** False when the archive lives on an ephemeral filesystem. */
  durable: boolean;
  /** Human-readable location, e.g. "postgres" or ".data/cyber-intel.sqlite". */
  location: string | null;
}

/** One record plus the small set of related records the detail panel shows. */
export interface IntelDetail {
  item: IntelItem;
  related: IntelItem[];
}

export interface IntelSnapshot {
  items: IntelItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  geo: GeoCluster[];
  facets: {
    categories: { id: IntelCategory; count: number }[];
    sources: { id: string; name: string; count: number }[];
    countries: { code: string; name: string; count: number }[];
    years: { year: number; count: number }[];
  };
  meta: {
    generatedAt: string;
    lastIngestAt: string | null;
    /** Earliest/latest publication dates actually held in the archive. */
    coverage: { oldest: string | null; newest: string | null };
    archive: { count: number; storage: StorageInfo; migratedFrom?: string };
    sources: SourceHealth[];
    /**
     * Whether the archive itself is old. `stale` is computed on the server so
     * the warning is present in the first HTML response, not only after
     * hydration, and it never treats a non-durable driver as stale by itself.
     */
    freshness: {
      lastSuccessAt: string | null;
      stale: boolean;
      staleAfterHours: number;
    };
    /** True when at least one source could not be refreshed on this run. */
    degraded: boolean;
    notes: string[];
    /** Most recent ingestion run, when one has been recorded. */
    lastRun?: IngestRun | null;
  };
}
