import { NextResponse } from "next/server";
import { getSourceHealth } from "@/lib/cyber-intel/query";
import { publicSourceMeta, UNAVAILABLE_SOURCES } from "@/lib/cyber-intel/sources";
import { getRepository } from "@/lib/cyber-intel/storage";

/**
 * Source health, storage mode and the last ingestion run.
 *
 * This is the endpoint an operator (or an uptime check) uses to answer "is the
 * archive still being refreshed, and where is it stored?". It never returns a
 * connection string, a credential or a stack trace.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = {
  "cache-control": "no-store, max-age=0",
};

export async function GET() {
  try {
    const repository = await getRepository();
    const [health, lastRun] = await Promise.all([
      getSourceHealth(),
      repository.lastRun(),
    ]);

    return NextResponse.json(
      {
        storage: repository.info,
        migration: repository.migration,
        lastRun,
        sources: health,
        registry: [...publicSourceMeta(), ...UNAVAILABLE_SOURCES],
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { error: "archive_unavailable" },
      { status: 503, headers: NO_STORE },
    );
  }
}
