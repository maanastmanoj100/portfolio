import { NextResponse } from "next/server";
import { bearerToken, tokenMatches } from "@/lib/cyber-intel/auth";
import { runIngest } from "@/lib/cyber-intel/ingest";
import { activeSources } from "@/lib/cyber-intel/sources";

/**
 * Manual ingestion endpoint.
 *
 * Disabled unless `CYBER_INTEL_INGEST_TOKEN` is configured. Callers must send
 * `Authorization: Bearer <token>`. The response never contains upstream URLs,
 * credentials or stack traces — only the run summary and sanitised source
 * health.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = {
  "cache-control": "no-store, max-age=0",
};

const MIN_INTERVAL_MS = 30_000;
let lastAcceptedAt = 0;

const ACTIVE_IDS = new Set(activeSources().map((source) => source.id));

type SourceSelection = string[] | undefined | "invalid";

function readSources(body: unknown): SourceSelection {
  if (!body || typeof body !== "object") return undefined;
  const value = (body as { sources?: unknown }).sources;
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return "invalid";

  const ids: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string" || !ACTIVE_IDS.has(entry)) return "invalid";
    ids.push(entry);
  }
  return [...new Set(ids)];
}

export async function POST(request: Request) {
  const expected = process.env.CYBER_INTEL_INGEST_TOKEN ?? null;
  if (!expected) {
    return NextResponse.json(
      { error: "ingest_disabled", detail: "CYBER_INTEL_INGEST_TOKEN is not configured." },
      { status: 503, headers: NO_STORE },
    );
  }

  const provided =
    bearerToken(request) ?? request.headers.get("x-ingest-token")?.trim() ?? null;
  if (!tokenMatches(provided, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: NO_STORE });
  }

  const now = Date.now();
  if (now - lastAcceptedAt < MIN_INTERVAL_MS) {
    return NextResponse.json(
      {
        error: "rate_limited",
        retryAfterMs: MIN_INTERVAL_MS - (now - lastAcceptedAt),
      },
      { status: 429, headers: { ...NO_STORE, "retry-after": "30" } },
    );
  }
  lastAcceptedAt = now;

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const sources = readSources(body);
  if (sources === "invalid") {
    return NextResponse.json({ error: "invalid_sources" }, { status: 400, headers: NO_STORE });
  }

  try {
    const summary = await runIngest({
      trigger: "manual",
      sources,
      force: true,
    });

    return NextResponse.json(
      {
        run: summary.run,
        skipped: summary.skipped,
        reason: summary.reason,
        sources: summary.health,
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "ingest_failed" }, { status: 500, headers: NO_STORE });
  }
}
