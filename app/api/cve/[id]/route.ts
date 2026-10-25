import { NextResponse } from "next/server";
import { normalizeCveId, normalizeNvdResponse, type CveRecord } from "@/lib/portfolio/cve";
import { clientKey, rateLimit } from "@/lib/api/rate-limit";

/**
 * CVE proxy for the NIST National Vulnerability Database.
 *
 * Why a proxy:
 *   - NVD's public API is rate limited per IP; a single server cache keeps the
 *     site well inside that budget.
 *   - The optional `NVD_API_KEY` is read here and never reaches the browser.
 *   - Upstream errors are translated into a small set of stable codes instead
 *     of being forwarded verbatim.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NVD_ENDPOINT = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_MAX_ENTRIES = 300;
const UPSTREAM_TIMEOUT_MS = 9_000;

interface CacheEntry {
  record: CveRecord;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

const OK_HEADERS = {
  "cache-control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400",
};

const ERROR_HEADERS = {
  "cache-control": "no-store, max-age=0",
};

function errorResponse(code: string, status: number, retryAfter?: number) {
  const headers: Record<string, string> = { ...ERROR_HEADERS };
  if (retryAfter) headers["retry-after"] = String(retryAfter);
  return NextResponse.json({ error: code }, { status, headers });
}

function readCache(id: string, now: number): CveRecord | null {
  const entry = cache.get(id);
  if (!entry) return null;
  if (entry.expiresAt <= now) {
    cache.delete(id);
    return null;
  }
  return entry.record;
}

function writeCache(id: string, record: CveRecord, now: number): void {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    for (const [key, entry] of cache) {
      if (entry.expiresAt <= now) cache.delete(key);
    }
    if (cache.size >= CACHE_MAX_ENTRIES) {
      const oldest = [...cache.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt);
      for (let index = 0; index < Math.ceil(oldest.length / 4); index += 1) {
        cache.delete(oldest[index][0]);
      }
    }
  }
  cache.set(id, { record, expiresAt: now + CACHE_TTL_MS });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const normalized = normalizeCveId(id);
  if (!normalized) {
    return errorResponse("invalid_cve_id", 400);
  }

  const limit = rateLimit(`cve:${clientKey(request)}`, 20, 60_000);
  if (!limit.ok) {
    return errorResponse("rate_limited", 429, limit.retryAfter);
  }

  const now = Date.now();
  const cached = readCache(normalized, now);
  if (cached) {
    return NextResponse.json(cached, { headers: OK_HEADERS });
  }

  const headers: Record<string, string> = {
    accept: "application/json",
    "user-agent": "cyber-nexus-portfolio-cve-lookup",
  };
  if (process.env.NVD_API_KEY) {
    headers.apiKey = process.env.NVD_API_KEY;
  }

  try {
    const response = await fetch(`${NVD_ENDPOINT}?cveId=${encodeURIComponent(normalized)}`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (response.status === 403 || response.status === 429) {
      const retry = Number.parseInt(response.headers.get("retry-after") ?? "", 10);
      return errorResponse(
        "upstream_rate_limited",
        429,
        Number.isFinite(retry) && retry > 0 ? retry : 30,
      );
    }

    if (!response.ok) {
      return errorResponse("upstream_unavailable", 502);
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return errorResponse("upstream_invalid_response", 502);
    }

    const record = normalizeNvdResponse(payload, normalized);
    if (!record) {
      return errorResponse("not_found", 404);
    }

    writeCache(normalized, record, now);
    return NextResponse.json(record, { headers: OK_HEADERS });
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return errorResponse(timedOut ? "upstream_timeout" : "upstream_unavailable", timedOut ? 504 : 502);
  }
}
