import { NextResponse } from "next/server";
import { getSnapshot, parseQuery } from "@/lib/cyber-intel/query";

/**
 * Feed endpoint.
 *
 * Serves from the server-side archive only: no publisher is contacted per
 * request, so browsing does not hit upstream rate limits or leak the client's
 * IP to every source. Upstream refreshes are governed by each source's
 * `revalidateSeconds` and are normally driven by the cron endpoint.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = {
  "cache-control": "no-store, max-age=0",
};

export async function GET(request: Request) {
  const query = parseQuery(new URL(request.url).searchParams);

  try {
    // A short budget keeps the endpoint responsive; a longer refresh continues
    // in the background and is picked up by the next request or the cron job.
    const snapshot = await getSnapshot(query, { maxWaitMs: 2500 });
    return NextResponse.json(snapshot, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: "archive_unavailable" },
      { status: 503, headers: NO_STORE },
    );
  }
}
