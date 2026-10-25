import type { IntelGeo, IntelItem } from "./types";
import type { SourceDef } from "./sources";
import { classify } from "./classify";
import { lookupCountry } from "./countries";
import { isSafePublicUrl } from "./net-guard";
import {
  canonicalUrl,
  extractIdentifiers,
  sanitizeText,
  stableId,
  titleKey,
} from "./parse";

/**
 * Turns a raw source record into an archive item.
 *
 * This is the validation boundary: everything that came from the network is
 * re-checked here, and an item that fails a check is dropped rather than
 * repaired with invented values. In particular:
 *
 *  - a title shorter than four characters (or a generic "404" page) is junk,
 *  - a URL that is not public HTTP(S) is dropped,
 *  - a date that is unparseable, before 1990, or more than a day in the future
 *    becomes `null` instead of being replaced with "now",
 *  - a location is only attached when the source reported a country that maps
 *    to a real ISO code.
 */

export const MAX_SUMMARY = 280;
const MAX_TITLE = 300;
const MAX_TAGS = 6;
const MAX_IDENTIFIERS = 8;
const JUNK_TITLES = /^(?:404|403|401|not found|untitled|home|index|rss|atom|feed)$/i;

export interface BuildInput {
  title: string;
  summary?: string | null;
  url: string;
  externalId?: string | null;
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
  now?: Date;
}

function safeIso(value: string | null | undefined, now: Date): string | null {
  if (!value) return null;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return null;
  const date = new Date(time);
  if (date.getUTCFullYear() < 1990) return null;
  // A feed with a skewed clock can be a few minutes ahead; more than a day is
  // a broken value and must not sort above real reporting.
  if (time > now.getTime() + 86_400_000) return null;
  return date.toISOString();
}

function cleanIdentifiers(values: readonly string[], text: string): string[] {
  const found = new Set<string>();
  for (const value of [...values, ...extractIdentifiers(text)]) {
    const id = sanitizeText(value, 40).toUpperCase();
    if (/^[A-Z0-9][A-Z0-9.:-]{2,39}$/.test(id)) found.add(id);
  }
  return [...found].slice(0, MAX_IDENTIFIERS);
}

function cleanTags(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const value of values) {
    const tag = sanitizeText(value, 60);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length >= MAX_TAGS) break;
  }
  return tags;
}

export function geoFromCountry(
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
    reportedBy: sanitizeText(reportedBy, 80) || "reported by the source",
  };
}

export function buildItem(source: SourceDef, input: BuildInput): IntelItem | null {
  const now = input.now ?? new Date();

  const title = sanitizeText(input.title, MAX_TITLE);
  if (title.length < 4 || JUNK_TITLES.test(title)) return null;

  const url = canonicalUrl(input.url);
  if (!url || !isSafePublicUrl(url)) return null;

  const summary = sanitizeText(input.summary ?? "", MAX_SUMMARY);
  const classification =
    input.category !== undefined
      ? { category: input.category, basis: input.categoryBasis ?? "source" }
      : classify(source, { title, summary, tags: input.tags });

  const publishedAt = safeIso(input.publishedAt, now);
  const updatedAt = safeIso(input.updatedAt, now);
  const incidentAt = safeIso(input.incidentAt, now);
  const advisoryAt = safeIso(input.advisoryAt, now);

  const publishedAtKind = input.publishedAtKind ?? source.publishedAtKind ?? "article";

  return {
    id: stableId(url),
    title,
    summary,
    url,
    sourceId: source.id,
    sourceName: source.name,
    sourceKind: source.kind,
    externalId: input.externalId ? sanitizeText(input.externalId, 200) || null : null,
    category: classification.category,
    categoryBasis: classification.basis,
    publishedAt,
    publishedAtKind,
    incidentAt,
    advisoryAt,
    updatedAt,
    geo: input.geo ?? null,
    identifiers: cleanIdentifiers(input.identifiers ?? [], `${title} ${summary}`),
    tags: cleanTags(input.tags ?? []),
    attribution: input.attribution ? sanitizeText(input.attribution, 160) || null : null,
    firstSeenAt: now.toISOString(),
    lastSeenAt: now.toISOString(),
  };
}

/** Stable keys used by the repository for deduplication. */
export interface DedupeKeys {
  canonicalUrl: string;
  titleKey: string;
  externalId: string | null;
}

export function dedupeKeys(item: IntelItem): DedupeKeys {
  return {
    canonicalUrl: item.url,
    titleKey: titleKey(item.title),
    externalId: item.externalId,
  };
}

/**
 * Cautious similarity rule: the same source re-using the same normalised
 * headline within a week is the same story even if the URL changed. Different
 * sources are never merged by similarity — that would silently drop the second
 * publisher's attribution.
 */
export const SIMILARITY_WINDOW_DAYS = 7;

export function withinSimilarityWindow(a: string, b: string): boolean {
  const left = Date.parse(a);
  const right = Date.parse(b);
  if (Number.isNaN(left) || Number.isNaN(right)) return false;
  return Math.abs(left - right) <= SIMILARITY_WINDOW_DAYS * 86_400_000;
}
