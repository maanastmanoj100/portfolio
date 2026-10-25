/**
 * Schema for the intelligence archive.
 *
 * Timestamps are stored as ISO 8601 UTC text in both dialects. That keeps
 * ordering and range comparisons lexicographic and identical between Postgres
 * and SQLite, and avoids timezone conversion differences between drivers.
 *
 * `sort_at` is the pre-computed date used for ordering and date filtering
 * (`publishedAt ?? advisoryAt ?? incidentAt ?? firstSeenAt`). `search_text` is
 * a pre-lowercased haystack, so case-insensitive search behaves the same on both
 * engines without relying on `lower()` unicode behaviour.
 */
export const SCHEMA_STATEMENTS: string[] = [
  `create table if not exists intel_items (
    id text primary key,
    canonical_url text not null unique,
    external_id text,
    title text not null,
    title_key text not null,
    summary text not null,
    url text not null,
    source_id text not null,
    source_name text not null,
    source_kind text not null,
    category text not null,
    category_basis text not null,
    published_at text,
    published_at_kind text not null,
    incident_at text,
    advisory_at text,
    updated_at text,
    geo_country_code text,
    geo_country_name text,
    geo_lat double precision,
    geo_lon double precision,
    geo_basis text,
    geo_reported_by text,
    identifiers text not null,
    tags text not null,
    attribution text,
    first_seen_at text not null,
    last_seen_at text not null,
    sort_at text not null,
    search_text text not null,
    ingested_at text not null
  )`,
  `create index if not exists intel_items_sort_idx on intel_items (sort_at desc)`,
  `create index if not exists intel_items_source_idx on intel_items (source_id)`,
  `create index if not exists intel_items_category_idx on intel_items (category)`,
  `create index if not exists intel_items_country_idx on intel_items (geo_country_code)`,
  `create index if not exists intel_items_title_idx on intel_items (source_id, title_key, sort_at desc)`,
  `create unique index if not exists intel_items_external_idx
    on intel_items (source_id, external_id) where external_id is not null`,
  `create table if not exists intel_sources (
    id text primary key,
    status text not null,
    item_count integer not null default 0,
    fetched_at text,
    last_success_at text,
    last_error text,
    consecutive_failures integer not null default 0,
    next_attempt_at text,
    duration_ms integer,
    etag text,
    last_modified text,
    updated_at text not null
  )`,
  `create table if not exists intel_runs (
    id text primary key,
    trigger_kind text not null,
    started_at text not null,
    finished_at text,
    status text not null,
    sources_attempted integer not null default 0,
    sources_ok integer not null default 0,
    sources_failed integer not null default 0,
    items_fetched integer not null default 0,
    items_new integer not null default 0,
    items_updated integer not null default 0,
    note text
  )`,
  `create index if not exists intel_runs_started_idx on intel_runs (started_at desc)`,
  `create table if not exists intel_locks (
    name text primary key,
    acquired_at text not null,
    expires_at text not null
  )`,
];

export const SCHEMA_SQL = SCHEMA_STATEMENTS.map((statement) => `${statement};`).join("\n");
