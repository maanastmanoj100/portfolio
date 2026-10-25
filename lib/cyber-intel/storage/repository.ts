import type {
  GeoCluster,
  IngestRun,
  IntelCategory,
  IntelItem,
  SourceState,
  StorageInfo,
} from "../types";

export interface IntelFilter {
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

export interface FacetSets {
  categories: { id: IntelCategory; count: number }[];
  sources: { id: string; name: string; count: number }[];
  countries: { code: string; name: string; count: number }[];
  years: { year: number; count: number }[];
}

export interface UpsertResult {
  inserted: number;
  updated: number;
  unchanged: number;
}

export interface ArchiveCoverage {
  oldest: string | null;
  newest: string | null;
  count: number;
}

export interface MigrationInfo {
  from: string;
  count: number;
}

/**
 * Storage contract.
 *
 * The query layer only talks to this interface, so swapping Postgres for the
 * local SQLite development driver does not change any caller. Nothing here
 * returns credentials or connection strings.
 */
export interface IntelRepository {
  readonly info: StorageInfo;
  readonly migration: MigrationInfo | null;
  init(): Promise<void>;
  upsertItems(items: IntelItem[]): Promise<UpsertResult>;
  query(filter: IntelFilter): Promise<{ items: IntelItem[]; total: number }>;
  getItem(id: string): Promise<IntelItem | null>;
  relatedItems(item: IntelItem, limit: number): Promise<IntelItem[]>;
  facets(filter: IntelFilter): Promise<FacetSets>;
  geo(filter: IntelFilter): Promise<GeoCluster[]>;
  coverage(): Promise<ArchiveCoverage>;
  sourceStates(): Promise<SourceState[]>;
  saveSourceStates(states: SourceState[]): Promise<void>;
  recordRun(run: IngestRun): Promise<void>;
  updateRun(run: IngestRun): Promise<void>;
  lastRun(): Promise<IngestRun | null>;
  acquireLock(name: string, ttlSeconds: number): Promise<boolean>;
  releaseLock(name: string): Promise<void>;
  prune(maxAgeDays: number, maxRecords: number): Promise<number>;
  close(): Promise<void>;
}
