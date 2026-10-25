import { NextResponse } from "next/server";
import { getRepository } from "@/lib/cyber-intel/storage";
import { getSourceHealth } from "@/lib/cyber-intel/query";
import { computeFreshness } from "@/lib/cyber-intel/freshness";
import { buildStatusReport, type StatusInputs } from "@/lib/portfolio/status";
import { clientKey, rateLimit } from "@/lib/api/rate-limit";

/**
 * Status for the three things this site can actually observe:
 *   - the website itself (this response);
 *   - the Cyber Intelligence archive's last successful refresh;
 *   - the upstream sources' last attempt.
 *
 * A failure to read the archive returns `unknown`, never a fabricated green
 * state, and the endpoint never exposes storage locations or error details.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = {
  "cache-control": "no-store, max-age=0",
};

const READ_TIMEOUT_MS = 4_000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error("status_timeout")), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function GET(request: Request) {
  const limit = rateLimit(`status:${clientKey(request)}`, 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { ...NO_STORE, "retry-after": String(limit.retryAfter) } },
    );
  }

  const now = Date.now();
  let inputs: StatusInputs = {
    checkedAt: new Date(now).toISOString(),
    archive: null,
    sources: null,
  };

  try {
    const repository = await withTimeout(getRepository(), READ_TIMEOUT_MS);
    const [coverage, health] = await withTimeout(
      Promise.all([repository.coverage(), getSourceHealth()]),
      READ_TIMEOUT_MS,
    );

    const lastSuccessAt =
      health
        .map((source) => source.lastSuccessAt)
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1) ?? null;

    const freshness = computeFreshness(lastSuccessAt, coverage.count, now);

    inputs = {
      checkedAt: new Date(now).toISOString(),
      archive: {
        lastSuccessAt: freshness.lastSuccessAt,
        stale: freshness.stale,
        staleAfterHours: freshness.staleAfterHours,
        count: coverage.count,
      },
      sources: health.map((source) => ({ status: source.status })),
    };
  } catch {
    // Archive unreadable: report it as unknown rather than failing the request.
  }

  return NextResponse.json(buildStatusReport(inputs), { headers: NO_STORE });
}
