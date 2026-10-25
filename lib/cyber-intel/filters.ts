import { CATEGORY_ORDER, type IntelCategory } from "./types";

/**
 * Archive filter state shared by the page, the URL and the test suite.
 *
 * The API's own parser (`lib/cyber-intel/query.ts`) is server-only because it
 * imports the repository and the ingestion runner, so the browser needs a small
 * dependency-free counterpart. Keeping serialisation here means the visible
 * URL, the request sent to `/api/cyber-intel` and the tests cannot drift apart.
 *
 * Dates stay as `YYYY-MM-DD` in this model. The API expands a date-only bound
 * to the whole UTC day, which is what a date picker should mean.
 */

export interface ArchiveFilters {
  q: string;
  categories: IntelCategory[];
  source: string;
  country: string;
  from: string;
  to: string;
  located: "" | "yes" | "no";
  sort: "newest" | "oldest";
}

export const EMPTY_ARCHIVE_FILTERS: ArchiveFilters = Object.freeze({
  q: "",
  categories: [],
  source: "",
  country: "",
  from: "",
  to: "",
  located: "",
  sort: "newest",
} as ArchiveFilters);

const CATEGORY_SET = new Set<string>(CATEGORY_ORDER);
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const COUNTRY_PATTERN = /^[A-Za-z]{2}$/;

function cleanText(value: string | null, max = 120): string {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

/**
 * Accepts a date picker value or an ISO timestamp and returns the UTC day.
 * Impossible calendar dates (`2026-02-30`) are rejected rather than rolled
 * forward, matching the API parser.
 */
export function normalizeDay(value: string | null): string {
  const day = (value ?? "").trim().slice(0, 10);
  if (!DAY_PATTERN.test(day)) return "";
  const parsed = Date.parse(`${day}T00:00:00.000Z`);
  if (Number.isNaN(parsed)) return "";
  return new Date(parsed).toISOString().slice(0, 10) === day ? day : "";
}

export function filtersFromSearchParams(params: URLSearchParams): ArchiveFilters {
  const categories = (params.get("category") ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((id): id is IntelCategory => CATEGORY_SET.has(id));
  const located = params.get("located");
  const country = (params.get("country") ?? "").trim().toUpperCase();

  return {
    q: cleanText(params.get("q")),
    categories: [...new Set(categories)],
    source: cleanText(params.get("source"), 64),
    country: COUNTRY_PATTERN.test(country) ? country : "",
    from: normalizeDay(params.get("from")),
    to: normalizeDay(params.get("to")),
    located: located === "yes" || located === "no" ? located : "",
    sort: params.get("sort") === "oldest" ? "oldest" : "newest",
  };
}

/** Filters as URL parameters. Defaults are omitted so shared links stay short. */
export function filtersToSearchParams(filters: ArchiveFilters): URLSearchParams {
  const params = new URLSearchParams();
  const q = cleanText(filters.q);
  if (q) params.set("q", q);
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.source) params.set("source", filters.source);
  if (filters.country) params.set("country", filters.country);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.located) params.set("located", filters.located);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params;
}

/** Filters as an `/api/cyber-intel` query string. */
export function filtersToApiQuery(filters: ArchiveFilters, pageSize: number): string {
  const params = filtersToSearchParams(filters);
  params.set("pageSize", String(pageSize));
  return params.toString();
}

/** True when at least one control narrows the result set. */
export function hasNarrowingFilters(filters: ArchiveFilters): boolean {
  return Boolean(
    cleanText(filters.q) ||
      filters.categories.length ||
      filters.source ||
      filters.country ||
      filters.from ||
      filters.to ||
      filters.located,
  );
}

/** True when the custom range cannot contain any record. */
export function isDateRangeInverted(filters: ArchiveFilters): boolean {
  return Boolean(filters.from && filters.to && filters.from > filters.to);
}

/** True when two filter sets serialise to the same URL. */
export function sameFilters(a: ArchiveFilters, b: ArchiveFilters): boolean {
  return filtersToSearchParams(a).toString() === filtersToSearchParams(b).toString();
}

/**
 * The UTC day `days` before `reference`. Used to highlight the active quick
 * range without reading the clock during render, which would make the
 * server-rendered markup disagree with the client.
 */
export function dayBefore(referenceIso: string, days: number): string {
  const parsed = Date.parse(referenceIso);
  if (Number.isNaN(parsed)) return "";
  return new Date(parsed - days * 86_400_000).toISOString().slice(0, 10);
}
