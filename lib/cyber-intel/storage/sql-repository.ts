import { lookupCountry } from "../countries";
import { SIMILARITY_WINDOW_DAYS, dedupeKeys } from "../normalize";
import { titleKey } from "../parse";
import type {
  GeoCluster,
  IngestRun,
  IntelCategory,
  IntelItem,
  IntelSourceMeta,
  SourceState,
  StorageInfo,
} from "../types";
import { CATEGORY_ORDER } from "../types";
import { bindSql, placeholders } from "./client";
import type { SqlClient } from "./client";
import type {
  ArchiveCoverage,
  FacetSets,
  IntelFilter,
  IntelRepository,
  MigrationInfo,
  UpsertResult,
} from "./repository";
import { SCHEMA_SQL } from "./schema";

/**
 * SQL-backed repository.
 *
 * The same statements run on Postgres (production durability) and SQLite
 * (local development and tests). Anything dialect-specific is confined to the
 * client adapters; this file only uses portable SQL.
 */

const CATEGORY_SET = new Set<string>(CATEGORY_ORDER);
const SOURCE_KINDS = new Set<string>(["government", "vendor", "publisher", "aggregator"]);
const CATEGORY_BASES = new Set<string>(["source", "keyword", "type"]);
const DATE_KINDS = new Set<string>(["article", "advisory", "catalog", "aggregator"]);
const RUN_STATUSES = new Set<string>(["running", "ok", "partial", "error", "skipped"]);
const RUN_TRIGGERS = new Set<string>(["cron", "manual", "request"]);

const COLUMNS = [
  "id",
  "canonical_url",
  "external_id",
  "title",
  "title_key",
  "summary",
  "url",
  "source_id",
  "source_name",
  "source_kind",
  "category",
  "category_basis",
  "published_at",
  "published_at_kind",
  "incident_at",
  "advisory_at",
  "updated_at",
  "geo_country_code",
  "geo_country_name",
  "geo_lat",
  "geo_lon",
  "geo_basis",
  "geo_reported_by",
  "identifiers",
  "tags",
  "attribution",
  "first_seen_at",
  "last_seen_at",
  "sort_at",
  "search_text",
  "ingested_at",
] as const;

type Row = Record<string, unknown>;

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNullableText(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asInteger(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
}

function asNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseJsonArray(value: unknown): string[] {
  if (typeof value !== "string" || value.length === 0) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

function primaryDate(item: IntelItem): string {
  return item.publishedAt ?? item.advisoryAt ?? item.incidentAt ?? item.firstSeenAt;
}

function searchText(item: IntelItem): string {
  return [
    item.title,
    item.summary,
    item.sourceName,
    item.geo?.countryName ?? "",
    item.identifiers.join(" "),
    item.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function rowToItem(row: Row): IntelItem {
  const rawCategory = asText(row.category);
  const rawSourceKind = asText(row.source_kind);
  const rawCategoryBasis = asText(row.category_basis);
  const rawDateKind = asText(row.published_at_kind);

  const countryCode = asNullableText(row.geo_country_code);
  const reference = countryCode ? lookupCountry(countryCode) : null;
  const lat = asNullableNumber(row.geo_lat) ?? reference?.lat ?? null;
  const lon = asNullableNumber(row.geo_lon) ?? reference?.lon ?? null;

  return {
    id: asText(row.id),
    title: asText(row.title),
    summary: asText(row.summary),
    url: asText(row.url),
    sourceId: asText(row.source_id),
    sourceName: asText(row.source_name),
    sourceKind: (SOURCE_KINDS.has(rawSourceKind)
      ? rawSourceKind
      : "publisher") as IntelSourceMeta["kind"],
    externalId: asNullableText(row.external_id),
    category: (CATEGORY_SET.has(rawCategory) ? rawCategory : "general") as IntelCategory,
    categoryBasis: (CATEGORY_BASES.has(rawCategoryBasis) ? rawCategoryBasis : "source") as
      | "source"
      | "keyword"
      | "type",
    publishedAt: asNullableText(row.published_at),
    publishedAtKind: (DATE_KINDS.has(rawDateKind) ? rawDateKind : "article") as
      | "article"
      | "advisory"
      | "catalog"
      | "aggregator",
    incidentAt: asNullableText(row.incident_at),
    advisoryAt: asNullableText(row.advisory_at),
    updatedAt: asNullableText(row.updated_at),
    geo:
      countryCode && lat !== null && lon !== null
        ? {
            scope: "country",
            countryCode,
            countryName: asNullableText(row.geo_country_name) ?? reference?.name ?? countryCode,
            lat,
            lon,
            basis: "victim-country",
            reportedBy: asNullableText(row.geo_reported_by) ?? "reported by the source",
          }
        : null,
    identifiers: parseJsonArray(row.identifiers).slice(0, 8),
    tags: parseJsonArray(row.tags).slice(0, 8),
    attribution: asNullableText(row.attribution),
    firstSeenAt: asText(row.first_seen_at),
    lastSeenAt: asText(row.last_seen_at),
  };
}

function itemValues(item: IntelItem, ingestedAt: string): unknown[] {
  return [
    item.id,
    item.url,
    item.externalId,
    item.title,
    titleKey(item.title),
    item.summary,
    item.url,
    item.sourceId,
    item.sourceName,
    item.sourceKind,
    item.category,
    item.categoryBasis,
    item.publishedAt,
    item.publishedAtKind,
    item.incidentAt,
    item.advisoryAt,
    item.updatedAt,
    item.geo?.countryCode ?? null,
    item.geo?.countryName ?? null,
    item.geo?.lat ?? null,
    item.geo?.lon ?? null,
    item.geo?.basis ?? null,
    item.geo?.reportedBy ?? null,
    JSON.stringify(item.identifiers),
    JSON.stringify(item.tags),
    item.attribution,
    item.firstSeenAt,
    item.lastSeenAt,
    primaryDate(item),
    searchText(item),
    ingestedAt,
  ];
}

const INSERT_SQL = `insert into intel_items (${COLUMNS.join(", ")}) values (${placeholders(
  COLUMNS.length,
)})`;

const UPDATE_SQL = `update intel_items set ${COLUMNS.slice(1)
  .map((column) => `${column} = ?`)
  .join(", ")} where id = ?`;

function newer(left: string | null, right: string | null): string | null {
  if (!left) return right;
  if (!right) return left;
  return left >= right ? left : right;
}

function older(left: string | null, right: string | null): string | null {
  if (!left) return right;
  if (!right) return left;
  return left <= right ? left : right;
}

function mergeItem(existing: IntelItem, incoming: IntelItem, adoptUrl: boolean): IntelItem {
  // A CVE first seen through NVD may later arrive through the KEV catalog,
  // which is the stronger statement ("known exploited"). Upgrade rather than
  // keep two records.
  const upgraded = existing.category === "vulnerability" && incoming.category === "exploit";

  return {
    ...existing,
    url: adoptUrl ? incoming.url : existing.url,
    externalId: existing.externalId ?? incoming.externalId,
    summary: existing.summary.length >= incoming.summary.length ? existing.summary : incoming.summary,
    category: upgraded ? incoming.category : existing.category,
    categoryBasis: upgraded ? incoming.categoryBasis : existing.categoryBasis,
    publishedAt: existing.publishedAt ?? incoming.publishedAt,
    publishedAtKind: existing.publishedAtKind,
    incidentAt: existing.incidentAt ?? incoming.incidentAt,
    advisoryAt: existing.advisoryAt ?? incoming.advisoryAt,
    updatedAt: newer(existing.updatedAt, incoming.updatedAt),
    geo: existing.geo ?? incoming.geo,
    identifiers: [...new Set([...existing.identifiers, ...incoming.identifiers])].slice(0, 8),
    tags: [...new Set([...existing.tags, ...incoming.tags])].slice(0, 8),
    attribution: existing.attribution ?? incoming.attribution,
    firstSeenAt: older(existing.firstSeenAt, incoming.firstSeenAt) ?? incoming.firstSeenAt,
    lastSeenAt: newer(existing.lastSeenAt, incoming.lastSeenAt) ?? incoming.lastSeenAt,
  };
}

function contentFingerprint(item: IntelItem): string {
  return JSON.stringify({ ...item, lastSeenAt: "" });
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

interface Clause {
  sql: string[];
  params: unknown[];
}

function emptyClause(): Clause {
  return { sql: [], params: [] };
}

function whereSql(clause: Clause): string {
  return clause.sql.length ? `where ${clause.sql.join(" and ")}` : "";
}

function textBaseClause(filter: IntelFilter): Clause {
  const clause = emptyClause();
  const tokens = filter.q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6);

  for (const token of tokens) {
    clause.sql.push("search_text like ? escape '\\'");
    clause.params.push(`%${escapeLike(token)}%`);
  }

  if (filter.located === "yes") clause.sql.push("geo_country_code is not null");
  if (filter.located === "no") clause.sql.push("geo_country_code is null");

  return clause;
}

function baseClause(filter: IntelFilter): Clause {
  const clause = textBaseClause(filter);
  if (filter.from) {
    clause.sql.push("sort_at >= ?");
    clause.params.push(filter.from);
  }
  if (filter.to) {
    clause.sql.push("sort_at <= ?");
    clause.params.push(filter.to);
  }
  return clause;
}

function itemsClause(filter: IntelFilter): Clause {
  const clause = baseClause(filter);

  if (filter.categories.length > 0) {
    clause.sql.push(`category in (${placeholders(filter.categories.length)})`);
    clause.params.push(...filter.categories);
  }
  if (filter.sources.length > 0) {
    clause.sql.push(`source_id in (${placeholders(filter.sources.length)})`);
    clause.params.push(...filter.sources);
  }
  if (filter.country) {
    clause.sql.push("geo_country_code = ?");
    clause.params.push(filter.country);
  }

  return clause;
}

function clampPageSize(value: number): number {
  if (!Number.isFinite(value)) return 20;
  return Math.min(Math.max(Math.trunc(value), 1), 100);
}

function clampPage(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(Math.trunc(value), 1), 500);
}

export interface SqlRepositoryOptions {
  info: StorageInfo;
  /** Called once on an empty archive to import a previous on-disk archive. */
  legacyImport?: () => Promise<IntelItem[] | null>;
  legacyLabel?: string;
}

class SqlRepository implements IntelRepository {
  readonly info: StorageInfo;

  private readonly client: SqlClient;
  private readonly options: SqlRepositoryOptions;
  private initPromise: Promise<void> | null = null;
  private migrationInfo: MigrationInfo | null = null;

  constructor(client: SqlClient, options: SqlRepositoryOptions) {
    this.client = client;
    this.options = options;
    this.info = options.info;
  }

  get migration(): MigrationInfo | null {
    return this.migrationInfo;
  }

  async init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = (async () => {
        await this.client.exec(SCHEMA_SQL);
        await this.importLegacy();
      })().catch((error: unknown) => {
        this.initPromise = null;
        throw error;
      });
    }
    await this.initPromise;
  }

  private async importLegacy(): Promise<void> {
    if (!this.options.legacyImport) return;

    const rows = await this.client.query<Row>("select count(*) as count from intel_items");
    if (asInteger(rows[0]?.count) > 0) return;

    const items = await this.options.legacyImport();
    if (!items || items.length === 0) return;

    const result = await this.upsertItems(items);
    this.migrationInfo = {
      from: this.options.legacyLabel ?? "previous archive",
      count: result.inserted,
    };
  }

  async upsertItems(items: IntelItem[]): Promise<UpsertResult> {
    if (items.length === 0) return { inserted: 0, updated: 0, unchanged: 0 };

    return this.client.transaction(async (tx) => {
      let inserted = 0;
      let updated = 0;
      let unchanged = 0;
      const ingestedAt = new Date().toISOString();

      for (const item of items) {
        const keys = dedupeKeys(item);
        let existingRow = await tx.query<Row>(
          "select * from intel_items where canonical_url = ? limit 1",
          [keys.canonicalUrl],
        );
        let adoptUrl = false;

        if (existingRow.length === 0 && keys.externalId) {
          existingRow = await tx.query<Row>(
            "select * from intel_items where source_id = ? and external_id = ? limit 1",
            [item.sourceId, keys.externalId],
          );
        }

        if (existingRow.length === 0 && keys.titleKey) {
          const since = new Date(
            Date.parse(item.lastSeenAt) - SIMILARITY_WINDOW_DAYS * 86_400_000,
          ).toISOString();
          existingRow = await tx.query<Row>(
            `select * from intel_items
             where source_id = ? and title_key = ? and sort_at >= ?
             order by sort_at desc limit 1`,
            [item.sourceId, keys.titleKey, since],
          );
          adoptUrl = existingRow.length > 0;
        }

        const existing = existingRow[0];
        if (!existing) {
          await tx.execute(INSERT_SQL, itemValues(item, ingestedAt));
          inserted += 1;
          continue;
        }

        const previous = rowToItem(existing);
        const merged = mergeItem(previous, item, adoptUrl);
        await tx.execute(UPDATE_SQL, [...itemValues(merged, ingestedAt).slice(1), merged.id]);

        if (contentFingerprint(previous) === contentFingerprint(merged)) {
          unchanged += 1;
        } else {
          updated += 1;
        }
      }

      return { inserted, updated, unchanged };
    });
  }

  async query(filter: IntelFilter): Promise<{ items: IntelItem[]; total: number }> {
    const page = clampPage(filter.page);
    const pageSize = clampPageSize(filter.pageSize);
    const clause = itemsClause(filter);
    const sql = whereSql(clause);
    const direction = filter.sort === "oldest" ? "asc" : "desc";

    const rows = await this.client.query<Row>(
      `select * from intel_items ${sql} order by sort_at ${direction}, id ${direction} limit ? offset ?`,
      [...clause.params, pageSize, (page - 1) * pageSize],
    );
    const totals = await this.client.query<Row>(
      `select count(*) as count from intel_items ${sql}`,
      clause.params,
    );

    return {
      items: rows.map(rowToItem),
      total: asInteger(totals[0]?.count),
    };
  }

  async getItem(id: string): Promise<IntelItem | null> {
    const rows = await this.client.query<Row>("select * from intel_items where id = ? limit 1", [id]);
    return rows[0] ? rowToItem(rows[0]) : null;
  }

  async relatedItems(item: IntelItem, limit: number): Promise<IntelItem[]> {
    const clauses: string[] = [];
    const params: unknown[] = [item.id];

    if (item.geo) {
      clauses.push("geo_country_code = ?");
      params.push(item.geo.countryCode);
    }
    for (const identifier of item.identifiers.slice(0, 2)) {
      clauses.push("search_text like ? escape '\\'");
      params.push(`%${escapeLike(identifier.toLowerCase())}%`);
    }
    if (clauses.length === 0) return [];

    const rows = await this.client.query<Row>(
      `select * from intel_items where id != ? and (${clauses.join(" or ")})
       order by sort_at desc limit ?`,
      [...params, Math.min(Math.max(limit, 1), 20)],
    );
    return rows.map(rowToItem);
  }

  async facets(filter: IntelFilter): Promise<FacetSets> {
    const base = baseClause(filter);
    const baseSql = whereSql(base);
    const textBase = textBaseClause(filter);
    const textSql = whereSql(textBase);

    const categoryRows = await this.client.query<Row>(
      `select category as id, count(*) as count from intel_items ${baseSql} group by category`,
      base.params,
    );
    const sourceRows = await this.client.query<Row>(
      `select source_id as id, source_name as name, count(*) as count
       from intel_items ${baseSql} group by source_id, source_name`,
      base.params,
    );
    const countryRows = await this.client.query<Row>(
      `select geo_country_code as code, geo_country_name as name, count(*) as count
       from intel_items ${baseSql ? `${baseSql} and` : "where"} geo_country_code is not null
       group by geo_country_code, geo_country_name`,
      base.params,
    );
    const yearRows = await this.client.query<Row>(
      `select substr(sort_at, 1, 4) as year, count(*) as count
       from intel_items ${textSql} group by substr(sort_at, 1, 4)`,
      textBase.params,
    );

    const categories = categoryRows
      .map((row) => ({
        id: asText(row.id) as IntelCategory,
        count: asInteger(row.count),
      }))
      .filter((entry) => CATEGORY_SET.has(entry.id))
      .sort(
        (a, b) =>
          CATEGORY_ORDER.indexOf(a.id) - CATEGORY_ORDER.indexOf(b.id),
      );

    const sources = sourceRows
      .map((row) => ({
        id: asText(row.id),
        name: asText(row.name),
        count: asInteger(row.count),
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const countries = countryRows
      .map((row) => ({
        code: asText(row.code),
        name: asText(row.name) || asText(row.code),
        count: asInteger(row.count),
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const years = yearRows
      .map((row) => ({ year: asInteger(row.year), count: asInteger(row.count) }))
      .filter((entry) => entry.year >= 1990)
      .sort((a, b) => b.year - a.year);

    return { categories, sources, countries, years };
  }

  async geo(filter: IntelFilter): Promise<GeoCluster[]> {
    const clause = itemsClause(filter);
    const sql = whereSql(clause);
    const rows = await this.client.query<Row>(
      `select id, geo_country_code, geo_country_name, geo_lat, geo_lon, category, sort_at
       from intel_items ${sql ? `${sql} and` : "where"} geo_country_code is not null
       order by sort_at desc limit 5000`,
      clause.params,
    );

    const clusters = new Map<string, GeoCluster>();
    for (const row of rows) {
      const code = asText(row.geo_country_code);
      if (!code) continue;
      const reference = lookupCountry(code);
      const category = asText(row.category) as IntelCategory;
      const at = asText(row.sort_at);

      const cluster =
        clusters.get(code) ??
        ({
          countryCode: code,
          countryName: asText(row.geo_country_name) || reference?.name || code,
          lat: asNullableNumber(row.geo_lat) ?? reference?.lat ?? 0,
          lon: asNullableNumber(row.geo_lon) ?? reference?.lon ?? 0,
          count: 0,
          categories: {},
          latestAt: null,
          itemIds: [],
        } satisfies GeoCluster);

      cluster.count += 1;
      if (CATEGORY_SET.has(category)) {
        cluster.categories[category] = (cluster.categories[category] ?? 0) + 1;
      }
      if (!cluster.latestAt || at > cluster.latestAt) cluster.latestAt = at;
      if (cluster.itemIds.length < 12) cluster.itemIds.push(asText(row.id));
      clusters.set(code, cluster);
    }

    return [...clusters.values()].sort(
      (a, b) => b.count - a.count || a.countryName.localeCompare(b.countryName),
    );
  }

  async coverage(): Promise<ArchiveCoverage> {
    const rows = await this.client.query<Row>(
      "select min(sort_at) as oldest, max(sort_at) as newest, count(*) as count from intel_items",
    );
    return {
      oldest: asNullableText(rows[0]?.oldest),
      newest: asNullableText(rows[0]?.newest),
      count: asInteger(rows[0]?.count),
    };
  }

  async sourceStates(): Promise<SourceState[]> {
    const rows = await this.client.query<Row>("select * from intel_sources");
    return rows.map((row) => {
      const status = asText(row.status);
      return {
        id: asText(row.id),
        status: status === "ok" || status === "error" ? status : "skipped",
        itemCount: asInteger(row.item_count),
        fetchedAt: asNullableText(row.fetched_at),
        lastSuccessAt: asNullableText(row.last_success_at),
        error: asNullableText(row.last_error),
        consecutiveFailures: asInteger(row.consecutive_failures),
        nextAttemptAt: asNullableText(row.next_attempt_at),
        durationMs: asNullableNumber(row.duration_ms),
        etag: asNullableText(row.etag),
        lastModified: asNullableText(row.last_modified),
      };
    });
  }

  async saveSourceStates(states: SourceState[]): Promise<void> {
    if (states.length === 0) return;
    const updatedAt = new Date().toISOString();

    await this.client.transaction(async (tx) => {
      for (const state of states) {
        await tx.execute(
          `insert into intel_sources
             (id, status, item_count, fetched_at, last_success_at, last_error,
              consecutive_failures, next_attempt_at, duration_ms, etag, last_modified, updated_at)
           values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           on conflict (id) do update set
             status = excluded.status,
             item_count = excluded.item_count,
             fetched_at = excluded.fetched_at,
             last_success_at = excluded.last_success_at,
             last_error = excluded.last_error,
             consecutive_failures = excluded.consecutive_failures,
             next_attempt_at = excluded.next_attempt_at,
             duration_ms = excluded.duration_ms,
             etag = excluded.etag,
             last_modified = excluded.last_modified,
             updated_at = excluded.updated_at`,
          [
            state.id,
            state.status,
            state.itemCount,
            state.fetchedAt,
            state.lastSuccessAt,
            state.error,
            state.consecutiveFailures,
            state.nextAttemptAt,
            state.durationMs,
            state.etag,
            state.lastModified,
            updatedAt,
          ],
        );
      }
    });
  }

  async recordRun(run: IngestRun): Promise<void> {
    await this.client.execute(
      `insert into intel_runs
         (id, trigger_kind, started_at, finished_at, status, sources_attempted, sources_ok,
          sources_failed, items_fetched, items_new, items_updated, note)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        run.id,
        run.trigger,
        run.startedAt,
        run.finishedAt,
        run.status,
        run.sourcesAttempted,
        run.sourcesOk,
        run.sourcesFailed,
        run.itemsFetched,
        run.itemsNew,
        run.itemsUpdated,
        run.note,
      ],
    );
  }

  async updateRun(run: IngestRun): Promise<void> {
    await this.client.execute(
      `update intel_runs set
         finished_at = ?, status = ?, sources_attempted = ?, sources_ok = ?,
         sources_failed = ?, items_fetched = ?, items_new = ?, items_updated = ?, note = ?
       where id = ?`,
      [
        run.finishedAt,
        run.status,
        run.sourcesAttempted,
        run.sourcesOk,
        run.sourcesFailed,
        run.itemsFetched,
        run.itemsNew,
        run.itemsUpdated,
        run.note,
        run.id,
      ],
    );
  }

  async lastRun(): Promise<IngestRun | null> {
    const rows = await this.client.query<Row>(
      "select * from intel_runs order by started_at desc limit 1",
    );
    const row = rows[0];
    if (!row) return null;

    const status = asText(row.status);
    const trigger = asText(row.trigger_kind);

    return {
      id: asText(row.id),
      trigger: (RUN_TRIGGERS.has(trigger) ? trigger : "cron") as IngestRun["trigger"],
      startedAt: asText(row.started_at),
      finishedAt: asNullableText(row.finished_at),
      status: (RUN_STATUSES.has(status) ? status : "error") as IngestRun["status"],
      sourcesAttempted: asInteger(row.sources_attempted),
      sourcesOk: asInteger(row.sources_ok),
      sourcesFailed: asInteger(row.sources_failed),
      itemsFetched: asInteger(row.items_fetched),
      itemsNew: asInteger(row.items_new),
      itemsUpdated: asInteger(row.items_updated),
      note: asNullableText(row.note),
    };
  }

  async acquireLock(name: string, ttlSeconds: number): Promise<boolean> {
    const now = new Date();
    const expires = new Date(now.getTime() + ttlSeconds * 1000).toISOString();

    await this.client.execute("delete from intel_locks where expires_at < ?", [now.toISOString()]);
    const rows = await this.client.query<Row>(
      `insert into intel_locks (name, acquired_at, expires_at) values (?, ?, ?)
       on conflict (name) do nothing returning name`,
      [name, now.toISOString(), expires],
    );
    return rows.length > 0;
  }

  async releaseLock(name: string): Promise<void> {
    await this.client.execute("delete from intel_locks where name = ?", [name]);
  }

  async prune(maxAgeDays: number, maxRecords: number): Promise<number> {
    const cutoff = new Date(Date.now() - maxAgeDays * 86_400_000).toISOString();
    const byAge = await this.client.execute("delete from intel_items where sort_at < ?", [cutoff]);
    const byCount = await this.client.execute(
      `delete from intel_items where id not in (
         select id from intel_items order by sort_at desc, id desc limit ?
       )`,
      [Math.max(maxRecords, 1)],
    );
    return byAge + byCount;
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}

export function createSqlRepository(
  client: SqlClient,
  options: SqlRepositoryOptions,
): IntelRepository {
  return new SqlRepository(client, options);
}

/** Re-exported for tests that assert placeholder rewriting. */
export { bindSql };
