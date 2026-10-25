import type { Metadata } from "next";
import { CyberIntelPage } from "@/modules/cyber-intel/cyber-intel-page";
import { getInitialSnapshot, parseQuery, queryToSearchParams } from "@/lib/cyber-intel/query";
import { getRepository } from "@/lib/cyber-intel/storage";
import type { IntelDetail } from "@/lib/cyber-intel/types";

/**
 * Rendered per request: the archive lives on disk and is refreshed from public
 * feeds, so the page must not be prerendered at build time.
 *
 * There is deliberately no `loading.tsx` here. A route-level loading file makes
 * Next stream the page into a hidden boundary that client JavaScript has to
 * reveal, which means the feed is invisible without JS and hydration waits on a
 * `requestAnimationFrame` tick. Waiting for the snapshot instead keeps the feed
 * in the initial HTML and lets the page hydrate in the first pass.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cyber Intelligence",
  description:
    "A country-level map of public cybersecurity advisories, exploited vulnerabilities and reported incidents, with a searchable archive. Markers appear only where a source states a location.",
};

const ITEM_PATTERN = /^ci-[a-z0-9]{1,24}$/;

function toSearchParams(
  input: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      for (const entry of value) params.append(key, entry);
    } else if (typeof value === "string") {
      params.set(key, value);
    }
  }
  return params;
}

/**
 * Deep links can point at a record that is not on the first page of the
 * filtered feed, so the server resolves `?item=` directly. Failures are not
 * fatal: the client retries the same endpoint after hydration.
 */
async function loadInitialDetail(id: string | null): Promise<IntelDetail | null> {
  if (!id || !ITEM_PATTERN.test(id)) return null;
  try {
    const repository = await getRepository();
    const item = await repository.getItem(id);
    if (!item) return null;
    const related = await repository.relatedItems(item, 5);
    return { item, related };
  } catch {
    return null;
  }
}

export default async function CyberIntel({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = toSearchParams(params);

  // Pagination is incremental in this UI, so a stray `page`/`pageSize` in a
  // shared link must not make the server render a different slice than the
  // client's first request.
  search.delete("page");
  search.delete("pageSize");

  const query = parseQuery(search);
  const initialFilters = queryToSearchParams(query).toString();
  const itemParam = search.get("item");
  const initialItemId = itemParam && ITEM_PATTERN.test(itemParam) ? itemParam : null;

  const [initial, initialDetail] = await Promise.all([
    getInitialSnapshot(search),
    loadInitialDetail(initialItemId),
  ]);

  return (
    <CyberIntelPage
      initial={initial}
      initialFilters={initialFilters}
      initialItemId={initialItemId}
      initialDetail={initialDetail}
    />
  );
}
