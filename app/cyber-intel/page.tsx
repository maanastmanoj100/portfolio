import type { Metadata } from "next";
import { CyberIntelPage } from "@/modules/cyber-intel/cyber-intel-page";
import { getInitialSnapshot } from "@/lib/cyber-intel/query";

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

export default async function CyberIntel() {
  const initial = await getInitialSnapshot();
  return <CyberIntelPage initial={initial} />;
}
