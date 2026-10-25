import { buildItem } from "../../normalize";
import { parseDate } from "../../parse";
import { FetchError } from "../../security";
import type { SourceDef } from "../../sources";
import type { IntelItem } from "../../types";
import type { FetchContext, FetchOutcome } from "../types";

interface KevRecord {
  cveID?: string;
  vendorProject?: string;
  product?: string;
  vulnerabilityName?: string;
  dateAdded?: string;
  shortDescription?: string;
  requiredAction?: string;
  dueDate?: string;
  knownRansomwareCampaignUse?: string;
}

interface KevPayload {
  vulnerabilities?: KevRecord[];
}

/**
 * CISA Known Exploited Vulnerabilities.
 *
 * The catalogue is a full snapshot, so only the most recent additions are
 * archived. Each item links to NVD, which means the same CVE arriving through
 * the NVD feed collapses into one record instead of two.
 */
export async function fetchKev(source: SourceDef, ctx: FetchContext): Promise<FetchOutcome> {
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

  let payload: KevPayload;
  try {
    payload = JSON.parse(response.body) as KevPayload;
  } catch {
    throw new FetchError("decode_failed", "KEV catalogue was not valid JSON");
  }

  if (!Array.isArray(payload.vulnerabilities)) {
    throw new FetchError("decode_failed", "KEV catalogue had an unexpected shape");
  }

  const records = payload.vulnerabilities
    .filter((record) => Boolean(record.cveID) && Boolean(record.dateAdded))
    .sort((a, b) => (b.dateAdded ?? "").localeCompare(a.dateAdded ?? ""))
    .slice(0, source.maxItems);

  const items: IntelItem[] = [];
  for (const record of records) {
    const cve = record.cveID as string;
    const dateAdded = parseDate(record.dateAdded);
    if (!dateAdded) continue;

    const parts = [
      record.vulnerabilityName,
      record.vendorProject && record.product
        ? `${record.vendorProject} ${record.product}`
        : record.vendorProject ?? record.product,
      record.shortDescription,
      record.requiredAction ? `Required action: ${record.requiredAction}` : null,
      record.dueDate ? `Remediation due: ${record.dueDate}` : null,
    ].filter(Boolean);

    const item = buildItem(source, {
      title: `${cve} — ${record.vulnerabilityName ?? "known exploited vulnerability"}`,
      summary: parts.join(" · "),
      url: `https://nvd.nist.gov/vuln/detail/${cve}`,
      externalId: cve,
      publishedAt: dateAdded,
      publishedAtKind: "catalog",
      advisoryAt: dateAdded,
      identifiers: [cve],
      tags: [
        "KEV",
        record.knownRansomwareCampaignUse === "Known" ? "known-ransomware-use" : "",
        record.vendorProject ?? "",
      ],
      category: "exploit",
      categoryBasis: "source",
      now: ctx.now,
    });
    if (item) items.push(item);
  }

  return {
    items,
    etag: response.etag,
    lastModified: response.lastModified,
    note: items.length === 0 ? "no recent additions" : null,
  };
}
