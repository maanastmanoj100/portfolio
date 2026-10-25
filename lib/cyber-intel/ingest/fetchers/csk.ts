import { buildItem } from "../../normalize";
import { parseDate, stripHtml, truncate } from "../../parse";
import { FetchError } from "../../security";
import type { SourceDef } from "../../sources";
import type { IntelItem } from "../../types";
import type { FetchContext, FetchOutcome } from "../types";

const MAX_SUMMARY = 280;

/** Bounded-concurrency map that preserves input order. */
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function extractOverview(text: string): string {
  const sectionHeading =
    /(?:Target Audience|Infection Mechanism|Indicators of Compromise|IOCs?|Solution|Mitigation|Remediation|References|Affected Software|Technical Details|Best Practices|Description|Impact|Severity)\s*:?/i;

  // Some alerts have an explicit "Overview" heading; others start straight
  // into the description after the header fields.
  const overview = /\bOverview\b\s*:?-?\s*/i.exec(text);
  if (overview) {
    const body = text.slice(overview.index + overview[0].length);
    const cut = sectionHeading.exec(body);
    return truncate(cut && cut.index > 40 ? body.slice(0, cut.index) : body, MAX_SUMMARY);
  }

  const headerField =
    /(?:Severity\s*:?-?\s*(?:Critical|High|Medium|Low|Informational)|Original Issue Date\s*:?-?\s*[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})/gi;
  let headerEnd = -1;
  for (const match of text.matchAll(headerField)) {
    headerEnd = (match.index ?? 0) + match[0].length;
  }
  if (headerEnd < 0) return "";

  const body = text.slice(headerEnd).trim().replace(/^(?:Overview|Description)\s*:?-?\s*/i, "");
  const cut = sectionHeading.exec(body);
  return truncate(cut && cut.index > 40 ? body.slice(0, cut.index) : body, MAX_SUMMARY);
}

interface AlertDetail {
  issueDate: string | null;
  severity: string | null;
  overview: string;
}

async function fetchAlertDetail(
  url: string,
  ctx: FetchContext,
): Promise<AlertDetail | null> {
  try {
    const response = await ctx.fetch(url, { timeoutMs: 15_000, maxBytes: 800_000 });
    const text = stripHtml(response.body);
    const issueMatch = /Original Issue Date\s*:?-?\s*([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})/i.exec(text);
    const severityMatch = /Severity\s*:?-?\s*(Critical|High|Medium|Low|Informational)/i.exec(text);
    return {
      issueDate: issueMatch ? parseDate(issueMatch[1]) : null,
      severity: severityMatch ? severityMatch[1] : null,
      overview: extractOverview(text),
    };
  } catch {
    // A single unreadable alert page must not fail the whole source; the index
    // entry is still useful without its detail fields.
    return null;
  }
}

/**
 * Cyber Swachhta Kendra (CERT-In, India).
 *
 * The index is HTML. Titles and links come from the index; the advisory date
 * and severity are read from each alert page, and a page that cannot be read
 * simply leaves those fields empty.
 */
export async function fetchCsk(source: SourceDef, ctx: FetchContext): Promise<FetchOutcome> {
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

  const anchors = [
    ...response.body.matchAll(/<a[^>]+href="([^"]*alerts\/[^"]+\.html)"[^>]*>([\s\S]*?)<\/a>/gi),
  ];

  if (anchors.length === 0) {
    throw new FetchError("decode_failed", "Alert index structure was not recognised");
  }

  const seen = new Set<string>();
  const alerts: { title: string; url: string }[] = [];

  for (const anchor of anchors) {
    if (alerts.length >= source.maxItems) break;
    let url: string;
    try {
      url = new URL(anchor[1], source.url).toString();
    } catch {
      continue;
    }
    if (seen.has(url)) continue;
    seen.add(url);

    const title = stripHtml(anchor[2]).trim();
    if (!title) continue;
    alerts.push({ title, url });
  }

  const details = await mapLimit(alerts, 6, (alert) => fetchAlertDetail(alert.url, ctx));

  const items: IntelItem[] = [];
  alerts.forEach((alert, index) => {
    const detail = details[index];
    const item = buildItem(source, {
      title: alert.title,
      summary: detail?.overview ?? "",
      url: alert.url,
      externalId: alert.url,
      // An advisory's "Original Issue Date" is its publication date; the alert
      // describes a vulnerability, not an incident at a location.
      publishedAt: detail?.issueDate ?? null,
      publishedAtKind: "advisory",
      advisoryAt: detail?.issueDate ?? null,
      tags: [detail?.severity ? `Severity: ${detail.severity}` : "", "CERT-In"],
      category: "india",
      categoryBasis: "source",
      now: ctx.now,
    });
    if (item) items.push(item);
  });

  return {
    items,
    etag: response.etag,
    lastModified: response.lastModified,
    note: items.length === 0 ? "alert index had no usable entries" : null,
  };
}
