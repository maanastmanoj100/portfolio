import { buildItem } from "../../normalize";
import { parseDate, truncate } from "../../parse";
import { FetchError } from "../../security";
import type { SourceDef } from "../../sources";
import type { IntelItem } from "../../types";
import type { FetchContext, FetchOutcome } from "../types";

interface NvdCve {
  id?: string;
  published?: string;
  lastModified?: string;
  vulnStatus?: string;
  descriptions?: { lang?: string; value?: string }[];
  weaknesses?: { description?: { lang?: string; value?: string }[] }[];
  metrics?: Record<string, { cvssData?: { baseScore?: number; baseSeverity?: string } }[]>;
}

interface NvdPayload {
  totalResults?: number;
  vulnerabilities?: { cve?: NvdCve }[];
}

/**
 * NVD CVE API 2.0.
 *
 * NIST rate-limits keyless callers, so a single small rolling window is
 * requested per run and the result is cached by the source schedule. The
 * archive keeps everything it has already seen, so the window only decides what
 * is *new*.
 */
export async function fetchNvd(source: SourceDef, ctx: FetchContext): Promise<FetchOutcome> {
  const end = ctx.now;
  const start = new Date(end.getTime() - 7 * 86_400_000);
  const params = new URLSearchParams({
    pubStartDate: start.toISOString(),
    pubEndDate: end.toISOString(),
    resultsPerPage: String(Math.min(source.maxItems, 2_000)),
  });

  const response = await ctx.fetch(`${source.url}?${params.toString()}`, {
    maxBytes: source.maxBytes,
    timeoutMs: source.timeoutMs,
  });

  let payload: NvdPayload;
  try {
    payload = JSON.parse(response.body) as NvdPayload;
  } catch {
    throw new FetchError("decode_failed", "NVD response was not valid JSON");
  }

  if (!Array.isArray(payload.vulnerabilities)) {
    throw new FetchError("decode_failed", "NVD response had an unexpected shape");
  }

  const items: IntelItem[] = [];
  for (const entry of payload.vulnerabilities) {
    if (items.length >= source.maxItems) break;
    const cve = entry.cve;
    if (!cve?.id) continue;

    const description =
      cve.descriptions?.find((d) => d.lang === "en")?.value ??
      cve.descriptions?.[0]?.value ??
      "";
    if (!description) continue;

    const cvss = cve.metrics
      ? Object.values(cve.metrics)
          .flat()
          .find((metric) => metric.cvssData?.baseScore !== undefined)?.cvssData
      : undefined;

    const tags = [
      ...(cve.weaknesses ?? []).flatMap((weakness) =>
        (weakness.description ?? []).map((d) => d.value ?? ""),
      ),
      cve.vulnStatus ?? "",
      cvss?.baseSeverity ? `CVSS ${cvss.baseScore} ${cvss.baseSeverity}` : "",
    ];

    const item = buildItem(source, {
      title: `${cve.id} — ${truncate(description, 96)}`,
      summary: description,
      url: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
      externalId: cve.id,
      publishedAt: parseDate(cve.published),
      publishedAtKind: "article",
      updatedAt: parseDate(cve.lastModified),
      identifiers: [cve.id],
      tags,
      category: "vulnerability",
      categoryBasis: "source",
      now: ctx.now,
    });
    if (item) items.push(item);
  }

  items.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  return {
    items,
    note: items.length === 0 ? "no CVEs in the requested window" : null,
  };
}
