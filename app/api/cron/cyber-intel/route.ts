import { NextResponse } from "next/server";
import { bearerToken, tokenMatches } from "@/lib/cyber-intel/auth";
import { runIngest } from "@/lib/cyber-intel/ingest";

/**
 * Scheduled ingestion endpoint.
 *
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. The endpoint is also
 * usable by any external scheduler with the same header. It is disabled unless
 * `CRON_SECRET` (or `CYBER_INTEL_INGEST_TOKEN`) is configured, and it respects
 * each source's `nextAttemptAt`, so overlapping invocations are cheap no-ops.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = {
  "cache-control": "no-store, max-age=0",
};

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET ?? process.env.CYBER_INTEL_INGEST_TOKEN ?? null;
  if (!expected) {
    return NextResponse.json(
      { error: "cron_disabled", detail: "CRON_SECRET is not configured." },
      { status: 503, headers: NO_STORE },
    );
  }

  const provided =
    bearerToken(request) ?? request.headers.get("x-cron-secret")?.trim() ?? null;
  if (!tokenMatches(provided, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_STORE });
  }

  try {
    const summary = await runIngest({ trigger: "cron" });
    return NextResponse.json(
      {
        ok: summary.run.status !== "error",
        skipped: summary.skipped,
        reason: summary.reason,
        run: summary.run,
        sources: summary.health.map((source) => ({
          id: source.id,
          status: source.status,
          itemCount: source.itemCount,
          lastSuccessAt: source.lastSuccessAt ?? null,
          consecutiveFailures: source.consecutiveFailures ?? 0,
          nextAttemptAt: source.nextAttemptAt ?? null,
          error: source.error ?? null,
        })),
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ ok: false, error: "ingest_failed" }, { status: 500, headers: NO_STORE });
  }
}
