import { buildItem } from "../../normalize";
import { parseFeed } from "../../parse";
import { FetchError } from "../../security";
import type { SourceDef } from "../../sources";
import type { IntelItem } from "../../types";
import type { FetchContext, FetchOutcome } from "../types";

/**
 * RSS 2.0, Atom and RDF (Debian DSA) feeds.
 *
 * A 200 response that contains an HTML error page is treated as a failure, not
 * as an empty feed: otherwise a broken publisher would look healthy forever.
 */
export async function fetchRss(source: SourceDef, ctx: FetchContext): Promise<FetchOutcome> {
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

  const body = response.body;
  const entries = parseFeed(body);

  if (entries.length === 0) {
    const head = body.slice(0, 2_000).toLowerCase();
    if (head.includes("<html") || head.includes("<!doctype html")) {
      throw new FetchError("decode_failed", "Source returned an HTML page instead of a feed");
    }
    return {
      items: [],
      etag: response.etag,
      lastModified: response.lastModified,
      note: "feed contained no items",
    };
  }

  const items: IntelItem[] = [];
  for (const entry of entries) {
    if (items.length >= source.maxItems) break;
    if (!entry.link) continue;

    const item = buildItem(source, {
      title: entry.title,
      summary: entry.summary,
      url: entry.link,
      externalId: entry.guid ?? entry.link,
      publishedAt: entry.published,
      updatedAt: entry.updated,
      tags: entry.categories,
      now: ctx.now,
    });
    if (item) items.push(item);
  }

  return {
    items,
    etag: response.etag,
    lastModified: response.lastModified,
    note: items.length === 0 ? "no usable items after validation" : null,
  };
}
