import assert from "node:assert/strict";
import test from "node:test";
import { bearerToken, tokenMatches } from "../../lib/cyber-intel/auth";
import { hostAllowed, isPrivateAddress, isSafePublicUrl } from "../../lib/cyber-intel/net-guard";
import {
  describeFetchError,
  FetchError,
  guardedLookup,
  safeFetch,
} from "../../lib/cyber-intel/security";

/**
 * Network-safety tests.
 *
 * These cover the two layers that stop a feed from turning into an SSRF: the
 * synchronous URL/address checks used during normalisation, and the DNS guard
 * the HTTPS client uses at connect time.
 */

test("isPrivateAddress: rejects loopback, private, link-local and metadata ranges", () => {
  const blocked = [
    "0.0.0.0",
    "10.0.0.1",
    "10.255.255.255",
    "127.0.0.1",
    "127.1.2.3",
    "169.254.169.254",
    "172.16.0.1",
    "172.31.255.255",
    "192.0.0.1",
    "192.0.2.10",
    "192.168.1.1",
    "198.18.0.1",
    "198.51.100.7",
    "203.0.113.7",
    "100.64.0.1",
    "224.0.0.1",
    "239.255.255.250",
    "255.255.255.255",
    "::",
    "::1",
    "fc00::1",
    "fd12:3456::1",
    "fe80::1",
    "ff02::1",
    "::ffff:10.0.0.1",
    "::ffff:127.0.0.1",
    "2001:db8::1",
    "2001:0:1::1",
    "not-an-ip",
    "999.1.1.1",
    "",
  ];

  for (const address of blocked) {
    assert.equal(isPrivateAddress(address), true, `${address} should be blocked`);
  }
});

test("isPrivateAddress: allows public addresses", () => {
  for (const address of ["8.8.8.8", "1.1.1.1", "93.184.216.34", "2606:4700:4700::1111"]) {
    assert.equal(isPrivateAddress(address), false, `${address} should be allowed`);
  }
});

test("isSafePublicUrl: accepts ordinary public HTTP(S) links", () => {
  assert.equal(isSafePublicUrl("https://www.cisa.gov/news-events/cybersecurity-advisories"), true);
  assert.equal(isSafePublicUrl("http://example.com/a"), true);
  assert.equal(isSafePublicUrl("https://8.8.8.8/"), true);
  assert.equal(isSafePublicUrl("https://[2606:4700:4700::1111]/"), true);
});

test("isSafePublicUrl: rejects non-HTTP schemes and embedded credentials", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "file:///etc/passwd",
    "ftp://example.com/file",
    "https://user:pass@example.com/",
    "https://user@example.com/",
  ]) {
    assert.equal(isSafePublicUrl(url), false, url);
  }
});

test("isSafePublicUrl: rejects internal hostnames and private IP literals", () => {
  for (const url of [
    "https://localhost/",
    "https://localhost:8080/admin",
    "https://app.localhost/",
    "https://service.local/",
    "https://metadata.internal/",
    "https://printer.home.arpa/",
    "https://intranet/",
    "https://127.0.0.1/",
    "https://[::1]/",
    "https://169.254.169.254/latest/meta-data/",
    "https://10.0.0.5/",
    "https://[fd00::1]/",
    "not a url",
  ]) {
    assert.equal(isSafePublicUrl(url), false, url);
  }
});

test("hostAllowed: exact, case-insensitive and never a suffix match", () => {
  const allowed = ["www.cisa.gov", "cert.europa.eu"];
  assert.equal(hostAllowed("www.cisa.gov", allowed), true);
  assert.equal(hostAllowed("WWW.CISA.GOV", allowed), true);
  assert.equal(hostAllowed("cisa.gov", allowed), false);
  assert.equal(hostAllowed("evil-www.cisa.gov", allowed), false);
  assert.equal(hostAllowed("www.cisa.gov.attacker.test", allowed), false);
  assert.equal(hostAllowed("", allowed), false);
});

test("guardedLookup: refuses a hostname that resolves to loopback", async () => {
  const error = await new Promise<unknown>((resolve) => {
    guardedLookup("localhost", {}, (lookupError) => resolve(lookupError));
  });

  assert.ok(error instanceof FetchError);
  assert.equal(error.code, "blocked_address");
  assert.equal(error.message.includes("localhost"), true);
});

test("safeFetch: refuses plain HTTP before opening a socket", async () => {
  await assert.rejects(
    () => safeFetch("http://www.cisa.gov/feed.xml", { allowedHosts: ["www.cisa.gov"] }),
    (error: unknown) => error instanceof FetchError && error.code === "insecure_protocol",
  );
});

test("safeFetch: refuses a host outside the source allowlist", async () => {
  await assert.rejects(
    () => safeFetch("https://evil.example/feed.xml", { allowedHosts: ["www.cisa.gov"] }),
    (error: unknown) => error instanceof FetchError && error.code === "blocked_host",
  );
});

test("safeFetch: refuses URLs with credentials or no URL at all", async () => {
  await assert.rejects(
    () => safeFetch("https://user:pass@www.cisa.gov/feed.xml", { allowedHosts: ["www.cisa.gov"] }),
    (error: unknown) => error instanceof FetchError && error.code === "invalid_url",
  );
  await assert.rejects(
    () => safeFetch("not a url", { allowedHosts: ["www.cisa.gov"] }),
    (error: unknown) => error instanceof FetchError && error.code === "invalid_url",
  );
});

test("safeFetch: a hostname resolving to loopback is blocked at connect time", async () => {
  await assert.rejects(
    () => safeFetch("https://localhost/feed.xml", { allowedHosts: ["localhost"], timeoutMs: 3000 }),
    (error: unknown) =>
      error instanceof FetchError &&
      (error.code === "blocked_address" || error.code === "network_error"),
  );
});

test("describeFetchError: returns short messages and never leaks the upstream host", () => {
  const cases: [FetchError, string][] = [
    [new FetchError("http_error", "Source returned HTTP 503", { status: 503 }), "HTTP 503"],
    [new FetchError("blocked_host", "Host secret.internal is not on this source's allowlist"), "host not allowed"],
    [new FetchError("blocked_address", "secret.internal resolves to a non-public address"), "resolved to a non-public address"],
    [new FetchError("timeout", "Request timed out"), "timeout"],
    [new FetchError("too_large", "Response exceeded the size limit"), "response too large"],
    [new FetchError("decode_failed", "Invalid gzip"), "invalid compressed response"],
    [new FetchError("insecure_protocol", "Only HTTPS"), "non-HTTPS source"],
    [new FetchError("too_many_redirects", "Too many"), "too many redirects"],
    [new FetchError("network_error", "boom"), "network error"],
    [new FetchError("redirect_without_location", "no location"), "redirect without location"],
  ];

  for (const [error, expected] of cases) {
    const message = describeFetchError(error);
    assert.equal(message, expected);
    assert.equal(message.includes("secret.internal"), false);
  }

  assert.equal(describeFetchError(new Error("connect ECONNREFUSED 10.0.0.1:443")), "unexpected error");
  assert.equal(describeFetchError("nope"), "unexpected error");
});

test("tokenMatches: only accepts an exact match", () => {
  assert.equal(tokenMatches("secret-value", "secret-value"), true);
  assert.equal(tokenMatches("secret-value", "secret-value "), false);
  assert.equal(tokenMatches("SECRET-VALUE", "secret-value"), false);
  assert.equal(tokenMatches("", "secret-value"), false);
  assert.equal(tokenMatches("secret-value", ""), false);
  assert.equal(tokenMatches(null, "secret-value"), false);
  assert.equal(tokenMatches("secret-value", null), false);
});

test("bearerToken: reads a Bearer header case-insensitively", () => {
  const make = (value: string | null) =>
    new Request("https://example.com/", value ? { headers: { authorization: value } } : undefined);

  assert.equal(bearerToken(make("Bearer abc123")), "abc123");
  assert.equal(bearerToken(make("bearer abc123")), "abc123");
  assert.equal(bearerToken(make("BEARER   abc123  ")), "abc123");
  assert.equal(bearerToken(make("Basic abc123")), null);
  assert.equal(bearerToken(make("Bearer")), null);
  assert.equal(bearerToken(make(null)), null);
});
