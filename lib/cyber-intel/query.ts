import type {
  GeoCluster,
  IngestRun,
  IntelCategory,
  IntelItem,
  IntelSnapshot,
  SourceHealth,
  StorageInfo,
} from "./types";
import { CATEGORIES, CATEGORY_ORDER } from "./types";
import { SOURCES, UNAVAILABLE_SOURCES } from "./sources";
import { ensureFresh, healthFromRepository, isIngesting } from "./ingest";
import { computeFreshness, STALE_AFTER_MS } from "./freshness";
import { getRepository } from "./storage";
import type { IntelFilter } from "./storage/repository";

/**
 * Query layer for the feed, facets and globe clusters.
 *
 * Everything here is derived from archived records. A country cluster only
 * exists when at least one record carries a source-reported country, so the
 * globe can never show an empty part of the map "to look populated".
 */

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export type IntelQuery = IntelFilter;

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
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]) - 1;
    const day = Number(dateOnly[3]);
    // `Date.UTC` rolls impossible dates forward, so round-trip the components
    // and reject anything that moved.
    const probe = new Date(Date.UTC(year, month, day));
    if (
      probe.getUTCFullYear() !== year ||
      probe.getUTCMonth() !== month ||
      probe.getUTCDate() !== day
    ) {
      return null;
    }
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
  const countryParam = (searchParams.get("country") ?? "").trim().toUpperCase();
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = Number.parseInt(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10);

  return {
    q: cleanText(searchParams.get("q")),
    categories: [...new Set(categories)],
    sources: [...new Set(sources)],
    from: isoBoundary(searchParams.get("from"), "start"),
    to: isoBoundary(searchParams.get("to"), "end"),
    located: locatedParam === "yes" || locatedParam === "no" ? locatedParam : null,
    // Only a well-formed ISO 3166-1 alpha-2 code can match a stored country, so
    // anything else is dropped rather than passed into the query.
    country: /^[A-Z]{2}$/.test(countryParam) ? countryParam : null,
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

function latestSuccess(health: SourceHealth[]): string | null {
  let latest: string | null = null;
  for (const entry of health) {
    if (!entry.lastSuccessAt) continue;
    if (!latest || entry.lastSuccessAt > latest) latest = entry.lastSuccessAt;
  }
  return latest;
}

function storageNote(storage: StorageInfo): string {
  if (storage.driver === "postgres") {
    return "The archive is stored in Postgres, so it survives redeploys and is shared by every instance.";
  }
  if (storage.driver === "sqlite") {
    return `The archive is stored in a local SQLite file (${storage.location ?? "configured path"}). It survives restarts but not a redeploy; set CYBER_INTEL_DATABASE_URL to a Postgres database for a durable archive.`;
  }
  return "No writable storage was available, so records are kept in memory only and reset when the process restarts. Set CYBER_INTEL_DATABASE_URL for a durable archive.";
}

function buildNotes(input: {
  health: SourceHealth[];
  storage: StorageInfo;
  lastSuccessAt: string | null;
  lastRun: IngestRun | null;
  ingesting: boolean;
  migratedFrom?: string;
}): string[] {
  const notes: string[] = [
    "All timestamps are UTC. 'Published' is the article, advisory or catalogue date given by the source; 'incident' is only shown when the source states when an event happened.",
    "Country markers use the victim country reported in a structured field by ransomware.live. Advisory and research items have no location and stay in the feed only.",
    storageNote(input.storage),
  ];

  const disabled = SOURCES.filter((source) => source.status === "disabled");
  if (disabled.length) {
    notes.push(
      `${disabled.map((source) => source.name).join(", ")} could not be ingested automatically: ${disabled
        .map((source) => source.statusNote ?? "")
        .filter(Boolean)
        .join(" ")}`,
    );
  }

  if (UNAVAILABLE_SOURCES.length) {
    notes.push(
      `${UNAVAILABLE_SOURCES.length} further sources were probed and are not integrated because they were unreachable or unusable from the server; they are listed with the reason in the source documentation.`,
    );
  }

  const failed = input.health.filter((entry) => entry.status === "error");
  if (failed.length) {
    notes.push(
      `Some sources could not be refreshed on the last attempt (${failed
        .map((entry) => entry.name)
        .join(", ")}). Their previously archived records are still shown.`,
    );
  }

  if (input.migratedFrom) {
    notes.push(
      `Existing records were imported from the previous archive (${input.migratedFrom}) when the new store was created.`,
    );
  }

  if (input.lastSuccessAt && Date.now() - Date.parse(input.lastSuccessAt) > STALE_AFTER_MS) {
    notes.push(
      "No source has refreshed successfully in the last six hours, so the newest items may be missing. The archive is still serving the last records it stored.",
    );
  } else if (!input.lastSuccessAt && input.lastRun?.status === "error") {
    notes.push(
      "No source has completed a successful refresh yet. The archive is empty until one does.",
    );
  }

  if (input.ingesting) {
    notes.push("A refresh is currently running; newer items may appear on the next load.");
  }

  return notes;
}

export interface SnapshotOptions {
  /** How long a render is willing to wait for a refresh. */
  maxWaitMs?: number;
}

export async function getSnapshot(
  query: IntelQuery,
  options: SnapshotOptions = {},
): Promise<IntelSnapshot> {
  await ensureFresh(options.maxWaitMs ?? 2500);
  const repository = await getRepository();

  const [page, facets, geo, coverage, health, lastRun] = await Promise.all([
    repository.query(query),
    repository.facets(query),
    repository.geo(query),
    repository.coverage(),
    healthFromRepository(repository),
    repository.lastRun(),
  ]);

  const failed = health.filter((entry) => entry.status === "error");
  const lastSuccessAt = latestSuccess(health);
  const storage = repository.info;
  const ingesting = isIngesting();
  const freshness = computeFreshness(lastSuccessAt, coverage.count);

  return {
    items: page.items,
    total: page.total,
    page: query.page,
    pageSize: query.pageSize,
    hasMore: (query.page - 1) * query.pageSize + page.items.length < page.total,
    geo,
    facets,
    meta: {
      generatedAt: new Date().toISOString(),
      lastIngestAt: lastRun?.finishedAt ?? lastRun?.startedAt ?? null,
      coverage: { oldest: coverage.oldest, newest: coverage.newest },
      archive: {
        count: coverage.count,
        storage,
        ...(repository.migration ? { migratedFrom: repository.migration.from } : {}),
      },
      sources: health,
      freshness,
      degraded: failed.length > 0 || !storage.durable,
      notes: buildNotes({
        health,
        storage,
        lastSuccessAt,
        lastRun,
        ingesting,
        migratedFrom: repository.migration?.from,
      }),
      lastRun,
    },
  };
}

/** Default snapshot for the server-rendered first paint. */
export async function getInitialSnapshot(searchParams?: URLSearchParams): Promise<IntelSnapshot> {
  const query = parseQuery(searchParams ?? new URLSearchParams());
  try {
    // A cold archive needs a refresh, but the page should not hang on it.
    // The budget is short because the page is not streamed: the whole document
    // waits for this. A warm archive returns in well under a second, and an
    // unfinished refresh is picked up by the next request.
    return await getSnapshot(query, { maxWaitMs: 2500 });
  } catch {
    const health: SourceHealth[] = SOURCES.map((source) => ({
      id: source.id,
      name: source.name,
      kind: source.kind,
      status: source.status === "ok" ? "error" : "skipped",
      itemCount: 0,
      fetchedAt: null,
      error: source.status === "ok" ? "unavailable" : undefined,
    }));

    return {
      items: [],
      total: 0,
      page: query.page,
      pageSize: query.pageSize,
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
        archive: {
          count: 0,
          storage: { driver: "memory", durable: false, location: null },
        },
        sources: health,
        freshness: { lastSuccessAt: null, stale: false, staleAfterHours: 6 },
        degraded: true,
        notes: ["The intelligence archive could not be read. Reload to try again."],
        lastRun: null,
      },
    };
  }
}

export function categoryLabel(id: IntelCategory): string {
  return CATEGORIES[id].label;
}

/** Exported for the sources endpoint. */
export async function getSourceHealth(): Promise<SourceHealth[]> {
  const repository = await getRepository();
  return healthFromRepository(repository);
}

export type { GeoCluster, IntelItem };
