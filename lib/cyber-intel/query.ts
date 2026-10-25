import path from "node:path";
import type {
  GeoCluster,
  IntelCategory,
  IntelItem,
  IntelSnapshot,
  SourceHealth,
} from "./types";
import { CATEGORIES, CATEGORY_ORDER } from "./types";
import { SOURCES, publicSourceMeta } from "./sources";
import { loadArchive, ensureFresh } from "./store";

/**
 * Filtering, faceting and pagination for the feed, plus the country clusters
 * the globe renders.
 *
 * Everything here is derived from archived records. A country cluster only
 * exists when at least one record carries a source-reported country, so the
 * globe can never show an empty part of the map "to look populated".
 */

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export interface IntelQuery {
  q: string;
  categories: IntelCategory[];
  sources: string[];
  from: string | null;
  to: string | null;
  located: "yes" | "no" | null;
  country: string | null;
  sort: "newest" | "oldest";
  page: number;
  pageSize: number;
}

const CATEGORY_IDS = new Set<string>(CATEGORY_ORDER);
const SOURCE_IDS = new Set<string>(SOURCES.map((source) => source.id));

function cleanText(value: string | null, max = 120): string {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function isoBoundary(value: string | null, edge: "start" | "end"): string | null {
  const raw = cleanText(value, 40);
  if (!raw) return null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (dateOnly) {
    return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T${edge === "start" ? "00:00:00.000" : "23:59:59.999"}Z`;
  }
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

function splitList(value: string | null): string[] {
  return (value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseQuery(searchParams: URLSearchParams): IntelQuery {
  const categories = splitList(searchParams.get("category")).filter((id): id is IntelCategory =>
    CATEGORY_IDS.has(id),
  );
  const sources = splitList(searchParams.get("source")).filter((id) => SOURCE_IDS.has(id));
  const locatedParam = searchParams.get("located");
  const sortParam = searchParams.get("sort");
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = Number.parseInt(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10);

  return {
    q: cleanText(searchParams.get("q")),
    categories: [...new Set(categories)],
    sources: [...new Set(sources)],
    from: isoBoundary(searchParams.get("from"), "start"),
    to: isoBoundary(searchParams.get("to"), "end"),
    located: locatedParam === "yes" || locatedParam === "no" ? locatedParam : null,
    country: cleanText(searchParams.get("country"), 2).toUpperCase() || null,
    sort: sortParam === "oldest" ? "oldest" : "newest",
    page: Number.isFinite(page) ? Math.min(Math.max(page, 1), 500) : 1,
    pageSize: Number.isFinite(pageSize)
      ? Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE,
  };
}

export function queryToSearchParams(query: IntelQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.categories.length) params.set("category", query.categories.join(","));
  if (query.sources.length) params.set("source", query.sources.join(","));
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.located) params.set("located", query.located);
  if (query.country) params.set("country", query.country);
  if (query.sort !== "newest") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  if (query.pageSize !== DEFAULT_PAGE_SIZE) params.set("pageSize", String(query.pageSize));
  return params;
}

/** The date used for ordering and date-range filtering. */
function primaryDate(item: IntelItem): string {
  return item.publishedAt ?? item.advisoryAt ?? item.incidentAt ?? item.firstSeenAt;
}

function matchesText(item: IntelItem, needle: string): boolean {
  const haystack = [
    item.title,
    item.summary,
    item.sourceName,
    item.geo?.countryName ?? "",
    item.identifiers.join(" "),
    item.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return needle
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

function inRange(item: IntelItem, from: string | null, to: string | null): boolean {
  if (!from && !to) return true;
  const value = primaryDate(item);
  if (!value) return false;
  if (from && value < from) return false;
  if (to && value > to) return false;
  return true;
}

function sortItems(items: IntelItem[], sort: IntelQuery["sort"]): IntelItem[] {
  const direction = sort === "oldest" ? 1 : -1;
  return [...items].sort((a, b) => {
    const diff = primaryDate(a).localeCompare(primaryDate(b));
    if (diff !== 0) return diff * direction;
    return a.id.localeCompare(b.id);
  });
}

function buildGeoClusters(items: IntelItem[]): GeoCluster[] {
  const clusters = new Map<string, GeoCluster>();

  for (const item of sortItems(items, "newest")) {
    if (!item.geo) continue;
    const { countryCode, countryName, lat, lon } = item.geo;
    const cluster =
      clusters.get(countryCode) ??
      ({
        countryCode,
        countryName,
        lat,
        lon,
        count: 0,
        categories: {},
        latestAt: null,
        itemIds: [],
      } satisfies GeoCluster);

    cluster.count += 1;
    cluster.categories[item.category] = (cluster.categories[item.category] ?? 0) + 1;
    if (!cluster.latestAt || primaryDate(item) > cluster.latestAt) {
      cluster.latestAt = primaryDate(item);
    }
    if (cluster.itemIds.length < 12) cluster.itemIds.push(item.id);
    clusters.set(countryCode, cluster);
  }

  return [...clusters.values()].sort((a, b) => b.count - a.count || a.countryName.localeCompare(b.countryName));
}

function safeArchiveLabel(absolute: string): string {
  const relative = path.relative(process.cwd(), absolute);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    return "configured archive directory";
  }
  return relative.split(path.sep).join("/");
}

function mergeSourceHealth(health: SourceHealth[]): SourceHealth[] {
  const byId = new Map(health.map((entry) => [entry.id, entry]));
  return SOURCES.map((source) => {
    const entry = byId.get(source.id);
    if (entry) return entry;
    return {
      id: source.id,
      name: source.name,
      kind: source.kind,
      status: "skipped",
      itemCount: 0,
      fetchedAt: null,
    } satisfies SourceHealth;
  });
}

export interface SnapshotOptions {
  /** How long a render is willing to wait for a refresh. */
  maxWaitMs?: number;
}

export async function getSnapshot(
  query: IntelQuery,
  options: SnapshotOptions = {},
): Promise<IntelSnapshot> {
  await ensureFresh(options.maxWaitMs ?? 8000);
  const archive = await loadArchive();

  const matchesLocation = (item: IntelItem) =>
    query.located === null || (query.located === "yes" ? item.geo !== null : item.geo === null);

  // The year facet deliberately ignores the date range: once a year is
  // selected, the list must still offer every other year.
  const textBase = archive.items.filter(
    (item) => (!query.q || matchesText(item, query.q)) && matchesLocation(item),
  );

  const base = textBase.filter((item) => inRange(item, query.from, query.to));

  const filtered = base.filter(
    (item) =>
      (query.categories.length === 0 || query.categories.includes(item.category)) &&
      (query.sources.length === 0 || query.sources.includes(item.sourceId)) &&
      (!query.country || item.geo?.countryCode === query.country),
  );

  const sorted = sortItems(filtered, query.sort);
  const start = (query.page - 1) * query.pageSize;
  const pageItems = sorted.slice(start, start + query.pageSize);

  const categoryCounts = new Map<IntelCategory, number>();
  const sourceCounts = new Map<string, { name: string; count: number }>();
  const countryCounts = new Map<string, { name: string; count: number }>();
  const yearCounts = new Map<number, number>();

  for (const item of base) {
    categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1);
    const source = sourceCounts.get(item.sourceId) ?? { name: item.sourceName, count: 0 };
    source.count += 1;
    sourceCounts.set(item.sourceId, source);
    if (item.geo) {
      const country = countryCounts.get(item.geo.countryCode) ?? {
        name: item.geo.countryName,
        count: 0,
      };
      country.count += 1;
      countryCounts.set(item.geo.countryCode, country);
    }
  }

  for (const item of textBase) {
    const year = Number.parseInt(primaryDate(item).slice(0, 4), 10);
    if (Number.isFinite(year)) yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
  }

  const health = mergeSourceHealth(archive.health);
  const failed = health.filter((entry) => entry.status === "error");
  const disabled = SOURCES.filter((source) => source.status === "disabled");

  const notes: string[] = [
    "All timestamps are UTC. 'Published' is the article or advisory date given by the source; 'incident' is only shown when the source states when an event happened.",
    "Country markers use the victim country reported in a structured field by ransomware.live. Advisory and research items have no location and stay in the feed only.",
  ];

  if (disabled.length) {
    notes.push(
      `${disabled.map((source) => source.name).join(", ")} could not be ingested automatically: ${disabled
        .map((source) => source.statusNote ?? "")
        .filter(Boolean)
        .join(" ")}`,
    );
  }
  if (!archive.persistent) {
    notes.push(
      "The archive directory is not writable in this environment, so records are kept in memory only and history resets when the server restarts.",
    );
  }
  if (failed.length) {
    notes.push(
      `Some sources could not be refreshed on the last attempt (${failed
        .map((entry) => entry.name)
        .join(", ")}). Their previously archived records are still shown.`,
    );
  }
  if (archive.ingesting) {
    notes.push("A refresh is currently running; newer items may appear on the next load.");
  }

  const dates = archive.items.map(primaryDate).filter(Boolean).sort();

  return {
    items: pageItems,
    total: filtered.length,
    page: query.page,
    pageSize: query.pageSize,
    hasMore: start + pageItems.length < filtered.length,
    geo: buildGeoClusters(filtered),
    facets: {
      categories: CATEGORY_ORDER.filter((id) => (categoryCounts.get(id) ?? 0) > 0).map((id) => ({
        id,
        count: categoryCounts.get(id) ?? 0,
      })),
      sources: [...sourceCounts.entries()]
        .map(([id, value]) => ({ id, name: value.name, count: value.count }))
        .sort((a, b) => b.count - a.count),
      countries: [...countryCounts.entries()]
        .map(([code, value]) => ({ code, name: value.name, count: value.count }))
        .sort((a, b) => b.count - a.count),
      years: [...yearCounts.entries()]
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => b.year - a.year),
    },
    meta: {
      generatedAt: new Date().toISOString(),
      lastIngestAt: archive.lastIngestAt,
      coverage: {
        oldest: dates[0] ?? null,
        newest: dates[dates.length - 1] ?? null,
      },
      archive: {
        persistent: archive.persistent,
        count: archive.items.length,
        path: safeArchiveLabel(archive.path),
      },
      sources: health,
      degraded: failed.length > 0 || !archive.persistent || (archive.ingesting && archive.items.length === 0),
      notes,
    },
  };
}

/** Default snapshot for the server-rendered first paint. */
export async function getInitialSnapshot(): Promise<IntelSnapshot> {
  const query = parseQuery(new URLSearchParams());
  try {
    // A cold archive needs a refresh, but the page should not hang on it.
    // The budget is short because the page is not streamed: the whole document
    // waits for this. A warm archive returns in well under a second, and an
    // unfinished refresh is picked up by the next request.
    return await getSnapshot(query, { maxWaitMs: 2500 });
  } catch {
    const health = publicSourceMeta().map((source) => ({
      id: source.id,
      name: source.name,
      kind: source.kind,
      status: "error" as const,
      itemCount: 0,
      fetchedAt: null,
      error: "unavailable",
    }));
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      hasMore: false,
      geo: [],
      facets: {
        categories: CATEGORY_ORDER.map((id) => ({ id, count: 0 })),
        sources: [],
        countries: [],
        years: [],
      },
      meta: {
        generatedAt: new Date().toISOString(),
        lastIngestAt: null,
        coverage: { oldest: null, newest: null },
        archive: { persistent: false, count: 0, path: null },
        sources: health,
        degraded: true,
        notes: ["The intelligence archive could not be read. Reload to try again."],
      },
    };
  }
}

export function categoryLabel(id: IntelCategory): string {
  return CATEGORIES[id].label;
}
