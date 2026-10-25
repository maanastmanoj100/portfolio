import { buildItem, geoFromCountry } from "../../normalize";
import { parseDate } from "../../parse";
import { FetchError } from "../../security";
import type { SourceDef } from "../../sources";
import type { IntelItem } from "../../types";
import type { FetchContext, FetchOutcome } from "../types";

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

/**
 * ransomware.live leak-site claims.
 *
 * These are unverified assertions by criminal groups, not confirmed incidents.
 * The record is labelled as a claim in its attribution and tags, and a country
 * marker is only placed when the aggregator reported a country code.
 */
export async function fetchRansomware(
  source: SourceDef,
  ctx: FetchContext,
): Promise<FetchOutcome> {
  const response = await ctx.fetch(source.url, {
    etag: ctx.state?.etag,
    lastModified: ctx.state?.lastModified,
    maxBytes: source.maxBytes,
    timeoutMs: source.timeoutMs,
  });

  if (response.notModified) {
    return {
      items: [],
      notModified: true,
      etag: response.etag,
      lastModified: response.lastModified,
    };
  }

  let payload: RansomwareRecord[] | { message?: string };
  try {
    payload = JSON.parse(response.body) as RansomwareRecord[] | { message?: string };
  } catch {
    throw new FetchError("decode_failed", "ransomware.live response was not valid JSON");
  }

  if (!Array.isArray(payload)) {
    throw new FetchError(
      "decode_failed",
      payload && typeof payload === "object" && payload.message
        ? "ransomware.live returned an error payload"
        : "ransomware.live returned an unexpected shape",
    );
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
    // regulator document. We link to the record the claim actually comes from.
    const link = record.link ?? record.url;
    if (!victim || !group || !link) continue;

    const country = geoFromCountry(record.country, "ransomware.live (leak-site claim)");
    const description =
      record.description && record.description !== "N/A" ? record.description : null;
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
      externalId: link,
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
      now: ctx.now,
    });
    if (item) items.push(item);
  }

  return {
    items,
    etag: response.etag,
    lastModified: response.lastModified,
    note: items.length === 0 ? "no recent claims" : null,
  };
}
