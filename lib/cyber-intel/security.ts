import { lookup as dnsLookup } from "node:dns";
import type { LookupAddress } from "node:dns";
import { request as httpsRequest } from "node:https";
import type { IncomingHttpHeaders } from "node:http";
import type { LookupFunction } from "node:net";
import * as zlib from "node:zlib";
import { hostAllowed, isPrivateAddress } from "./net-guard";

/**
 * Server-side HTTP client used by ingestion.
 *
 * `fetch()` is deliberately not used here: it follows redirects automatically,
 * does not let us validate the resolved address, and offers no byte cap. This
 * client:
 *
 *  - only speaks HTTPS,
 *  - only contacts hosts on the calling source's allowlist,
 *  - resolves DNS itself and rejects private / loopback / link-local answers
 *    (including on every redirect hop),
 *  - follows at most three redirects, re-validating each one,
 *  - caps both compressed and decompressed response size,
 *  - supports ETag / If-Modified-Since conditional requests,
 *  - decompresses gzip, deflate and brotli,
 *  - enforces a hard wall-clock timeout.
 */

const MAX_REDIRECTS = 3;
const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_MAX_BYTES = 2_000_000;

export type FetchErrorCode =
  | "blocked_host"
  | "blocked_address"
  | "invalid_url"
  | "insecure_protocol"
  | "too_many_redirects"
  | "redirect_without_location"
  | "timeout"
  | "too_large"
  | "decode_failed"
  | "http_error"
  | "network_error";

export class FetchError extends Error {
  readonly code: FetchErrorCode;
  readonly status: number | null;
  readonly retryAfterMs: number | null;
  readonly retryable: boolean;

  constructor(
    code: FetchErrorCode,
    message: string,
    options: { status?: number | null; retryAfterMs?: number | null; retryable?: boolean } = {},
  ) {
    super(message);
    this.name = "FetchError";
    this.code = code;
    this.status = options.status ?? null;
    this.retryAfterMs = options.retryAfterMs ?? null;
    this.retryable = options.retryable ?? false;
  }
}

export interface SafeFetchOptions {
  /** Hostnames this caller is permitted to contact. */
  allowedHosts: readonly string[];
  timeoutMs?: number;
  maxBytes?: number;
  etag?: string | null;
  lastModified?: string | null;
  headers?: Record<string, string>;
  userAgent?: string;
}

export interface SafeFetchResult {
  status: number;
  notModified: boolean;
  body: string;
  etag: string | null;
  lastModified: string | null;
  contentType: string | null;
  bytes: number;
  finalUrl: string;
}

type LookupCallback = (
  error: NodeJS.ErrnoException | null,
  address?: string | LookupAddress[],
  family?: number,
) => void;

/**
 * DNS resolver that refuses to hand a private address back to the socket
 * layer. This is the check that actually prevents DNS-rebinding SSRF: the
 * address validated here is the address the socket connects to.
 *
 * Exported so the test suite can assert the block directly without relying on
 * external DNS.
 */
export const guardedLookup = (
  hostname: string,
  options: { all?: boolean; family?: number },
  callback: LookupCallback,
): void => {
  dnsLookup(hostname, { all: true, family: options?.family }, (error, addresses) => {
    if (error) {
      callback(error);
      return;
    }
    const safe = addresses.filter((entry) => !isPrivateAddress(entry.address));
    if (safe.length === 0) {
      callback(
        new FetchError("blocked_address", `${hostname} resolves to a non-public address`),
      );
      return;
    }
    if (options?.all) {
      callback(null, safe);
      return;
    }
    callback(null, safe[0].address, safe[0].family);
  });
};

function headerValue(headers: IncomingHttpHeaders, name: string): string | null {
  const value = headers[name];
  if (Array.isArray(value)) return value[0] ?? null;
  return typeof value === "string" ? value : null;
}

function parseRetryAfter(value: string | null): number | null {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 60_000);
  const date = Date.parse(value);
  if (Number.isNaN(date)) return null;
  return Math.min(Math.max(date - Date.now(), 0), 60_000);
}

function decodeBody(raw: Buffer, encoding: string | null, maxBytes: number): Promise<string> {
  const value = (encoding ?? "").trim().toLowerCase();
  if (!value || value === "identity") return Promise.resolve(raw.toString("utf8"));

  const options = { maxOutputLength: maxBytes };
  return new Promise<string>((resolve, reject) => {
    const done = (error: Error | null, result?: Buffer) => {
      if (error) {
        reject(new FetchError("decode_failed", "Response body could not be decoded"));
        return;
      }
      resolve((result ?? Buffer.alloc(0)).toString("utf8"));
    };

    if (value === "gzip" || value === "x-gzip") {
      zlib.gunzip(raw, options, done);
    } else if (value === "deflate") {
      zlib.inflate(raw, options, done);
    } else if (value === "br") {
      zlib.brotliDecompress(raw, options, done);
    } else {
      reject(new FetchError("decode_failed", `Unsupported content encoding: ${value}`));
    }
  });
}

interface RawResponse {
  status: number;
  headers: IncomingHttpHeaders;
  body: Buffer;
  finalUrl: string;
}

function requestOnce(url: URL, options: Required<Pick<SafeFetchOptions, "timeoutMs" | "maxBytes">> & SafeFetchOptions): Promise<RawResponse> {
  return new Promise<RawResponse>((resolve, reject) => {
    const headers: Record<string, string> = {
      "user-agent": options.userAgent ?? "CyberNexusCyberIntel/1.0",
      accept: "application/rss+xml, application/atom+xml, application/xml, application/json, text/html;q=0.8, */*;q=0.5",
      "accept-encoding": "gzip, deflate, br",
      ...(options.headers ?? {}),
    };
    if (options.etag) headers["if-none-match"] = options.etag;
    if (options.lastModified) headers["if-modified-since"] = options.lastModified;

    let settled = false;
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    };
    const succeed = (value: RawResponse) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };

    const request = httpsRequest(
      url,
      {
        method: "GET",
        headers,
        agent: false,
        lookup: guardedLookup as unknown as LookupFunction,
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const chunks: Buffer[] = [];
        let total = 0;

        response.on("data", (chunk: Buffer) => {
          total += chunk.length;
          if (total > options.maxBytes) {
            request.destroy(new FetchError("too_large", "Response exceeded the size limit"));
            return;
          }
          chunks.push(chunk);
        });

        response.on("error", (error) => fail(error));

        response.on("end", () => {
          succeed({
            status,
            headers: response.headers,
            body: Buffer.concat(chunks),
            finalUrl: url.toString(),
          });
        });
      },
    );

    const timer = setTimeout(() => {
      request.destroy(new FetchError("timeout", "Request timed out", { retryable: true }));
    }, options.timeoutMs);

    request.on("error", (error) => {
      if (error instanceof FetchError) {
        fail(error);
        return;
      }
      fail(new FetchError("network_error", "Network request failed", { retryable: true }));
    });

    request.end();
  });
}

export async function safeFetch(rawUrl: string, options: SafeFetchOptions): Promise<SafeFetchResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new FetchError("invalid_url", "Invalid source URL");
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    if (url.protocol !== "https:") {
      throw new FetchError("insecure_protocol", "Only HTTPS sources are permitted");
    }
    if (url.username || url.password) {
      throw new FetchError("invalid_url", "Source URL must not contain credentials");
    }
    if (!hostAllowed(url.hostname, options.allowedHosts)) {
      throw new FetchError("blocked_host", `Host ${url.hostname} is not on this source's allowlist`);
    }

    const response = await requestOnce(url, { ...options, timeoutMs, maxBytes });

    if (response.status === 304) {
      return {
        status: 304,
        notModified: true,
        body: "",
        etag: headerValue(response.headers, "etag") ?? options.etag ?? null,
        lastModified: headerValue(response.headers, "last-modified") ?? options.lastModified ?? null,
        contentType: headerValue(response.headers, "content-type"),
        bytes: 0,
        finalUrl: response.finalUrl,
      };
    }

    if (response.status >= 300 && response.status < 400) {
      const location = headerValue(response.headers, "location");
      if (!location) {
        throw new FetchError("redirect_without_location", "Redirect response had no Location header");
      }
      try {
        url = new URL(location, url);
      } catch {
        throw new FetchError("invalid_url", "Redirect pointed at an invalid URL");
      }
      continue;
    }

    if (response.status === 429) {
      throw new FetchError("http_error", "Source rate limit reached", {
        status: 429,
        retryAfterMs: parseRetryAfter(headerValue(response.headers, "retry-after")),
        retryable: true,
      });
    }

    if (response.status >= 500) {
      throw new FetchError("http_error", `Source returned HTTP ${response.status}`, {
        status: response.status,
        retryAfterMs: parseRetryAfter(headerValue(response.headers, "retry-after")),
        retryable: true,
      });
    }

    if (response.status < 200 || response.status >= 300) {
      throw new FetchError("http_error", `Source returned HTTP ${response.status}`, {
        status: response.status,
        retryable: false,
      });
    }

    const body = await decodeBody(
      response.body,
      headerValue(response.headers, "content-encoding"),
      maxBytes,
    );

    return {
      status: response.status,
      notModified: false,
      body,
      etag: headerValue(response.headers, "etag"),
      lastModified: headerValue(response.headers, "last-modified"),
      contentType: headerValue(response.headers, "content-type"),
      bytes: response.body.length,
      finalUrl: response.finalUrl,
    };
  }

  throw new FetchError("too_many_redirects", "Source redirected too many times");
}

/** Maps any thrown value to a short, non-sensitive message safe for the UI. */
export function describeFetchError(error: unknown): string {
  if (error instanceof FetchError) {
    if (error.code === "http_error" && error.status) return `HTTP ${error.status}`;
    if (error.code === "blocked_host") return "host not allowed";
    if (error.code === "blocked_address") return "resolved to a non-public address";
    if (error.code === "timeout") return "timeout";
    if (error.code === "too_large") return "response too large";
    if (error.code === "decode_failed") return "invalid compressed response";
    if (error.code === "insecure_protocol") return "non-HTTPS source";
    if (error.code === "too_many_redirects") return "too many redirects";
    if (error.code === "network_error") return "network error";
    return error.code.replace(/_/g, " ");
  }
  return "unexpected error";
}
