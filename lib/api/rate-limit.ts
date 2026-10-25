/**
 * Small in-memory rate limiter for the new public API routes.
 *
 * It is intentionally per-instance: this site does not have a shared cache or
 * KV store, and the goal is to stop casual loops and accidental retry storms,
 * not to provide a distributed quota. Upstream services also enforce their own
 * limits, which the routes surface as `rate_limited`.
 */

interface WindowState {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, WindowState>();
const MAX_BUCKETS = 5_000;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets; 0 when the request is allowed. */
  retryAfter: number;
}

function prune(now: number): void {
  if (buckets.size <= MAX_BUCKETS) return;

  for (const [key, state] of buckets) {
    if (state.resetAt <= now) buckets.delete(key);
  }
  if (buckets.size <= MAX_BUCKETS) return;

  // Still too large: drop the entries that reset soonest.
  const oldest = [...buckets.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
  for (let index = 0; index < Math.ceil(oldest.length / 2); index += 1) {
    buckets.delete(oldest[index][0]);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  prune(now);

  const state = buckets.get(key);
  if (!state || state.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: Math.max(0, limit - 1), retryAfter: 0 };
  }

  if (state.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((state.resetAt - now) / 1000)),
    };
  }

  state.count += 1;
  return { ok: true, remaining: Math.max(0, limit - state.count), retryAfter: 0 };
}

/**
 * Best-effort client identifier. Vercel and most reverse proxies set
 * `x-forwarded-for`; when nothing is available all callers share one bucket,
 * which is still safer than no limit at all.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || "unknown";
}

/** Exposed for tests only; keeps state from leaking between cases. */
export function resetRateLimits(): void {
  buckets.clear();
}
