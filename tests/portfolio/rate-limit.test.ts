import assert from "node:assert/strict";
import test from "node:test";
import { clientKey, rateLimit, resetRateLimits } from "../../lib/api/rate-limit";

/**
 * Per-instance rate limiter.
 *
 * This is a coarse abuse guard, not a quota system, but the window behaviour
 * still has to be exact: a broken window would either block real visitors or
 * let a retry loop through.
 */

test("rate limit: requests within the limit are allowed", () => {
  resetRateLimits();
  const now = 1_000;
  for (let index = 0; index < 3; index += 1) {
    const result = rateLimit("ip-a", 3, 60_000, now);
    assert.equal(result.ok, true);
    assert.equal(result.remaining, 2 - index);
  }
});

test("rate limit: the next request is rejected with a retry hint", () => {
  resetRateLimits();
  const now = 1_000;
  rateLimit("ip-b", 1, 60_000, now);
  const blocked = rateLimit("ip-b", 1, 60_000, now + 1_000);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.remaining, 0);
  assert.equal(blocked.retryAfter, 59);
});

test("rate limit: the window resets after it elapses", () => {
  resetRateLimits();
  const now = 1_000;
  rateLimit("ip-c", 1, 60_000, now);
  assert.equal(rateLimit("ip-c", 1, 60_000, now + 60_000).ok, true);
});

test("rate limit: buckets are independent per key", () => {
  resetRateLimits();
  const now = 1_000;
  rateLimit("ip-d", 1, 60_000, now);
  assert.equal(rateLimit("ip-e", 1, 60_000, now).ok, true);
});

test("rate limit: retryAfter is at least one second", () => {
  resetRateLimits();
  const now = 1_000;
  rateLimit("ip-f", 1, 1_000, now);
  const blocked = rateLimit("ip-f", 1, 1_000, now + 999);
  assert.equal(blocked.ok, false);
  assert.ok(blocked.retryAfter >= 1);
});

test("rate limit: the client key prefers x-forwarded-for", () => {
  const request = new Request("https://example.com", {
    headers: {
      "x-forwarded-for": "203.0.113.9, 70.41.3.18",
      "x-real-ip": "198.51.100.4",
    },
  });
  assert.equal(clientKey(request), "203.0.113.9");
});

test("rate limit: the client key falls back to x-real-ip, then a shared bucket", () => {
  const realIp = new Request("https://example.com", {
    headers: { "x-real-ip": "198.51.100.4" },
  });
  assert.equal(clientKey(realIp), "198.51.100.4");

  const none = new Request("https://example.com");
  assert.equal(clientKey(none), "unknown");
});
