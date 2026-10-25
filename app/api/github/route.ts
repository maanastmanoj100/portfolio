import { NextResponse } from "next/server";
import { profile } from "@/data/portfolio";
import {
  githubLoginFromProfileUrl,
  normalizeGitHubRepos,
  safeGitHubProfileUrl,
  type GitHubRepo,
} from "@/lib/portfolio/github";
import { clientKey, rateLimit } from "@/lib/api/rate-limit";

/**
 * Public GitHub repository summary.
 *
 * Unauthenticated requests are used by default (60 requests/hour per IP), so
 * the response is cached for 15 minutes. `GITHUB_TOKEN` is optional and, when
 * set, is only ever read on the server.
 *
 * Only public repository metadata is requested: no private repos, no commit
 * history and no contribution graph.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REPO_COUNT = 6;
const CACHE_TTL_MS = 15 * 60 * 1000;
const UPSTREAM_TIMEOUT_MS = 8_000;

interface CacheEntry {
  payload: GitHubPayload;
  expiresAt: number;
}

interface GitHubPayload {
  login: string;
  profileUrl: string;
  repos: GitHubRepo[];
  fetchedAt: string;
}

let cache: CacheEntry | null = null;

const OK_HEADERS = {
  "cache-control": "public, max-age=300, s-maxage=900, stale-while-revalidate=86400",
};

const ERROR_HEADERS = {
  "cache-control": "no-store, max-age=0",
};

function errorResponse(code: string, status: number, retryAfter?: number) {
  const headers: Record<string, string> = { ...ERROR_HEADERS };
  if (retryAfter) headers["retry-after"] = String(retryAfter);
  return NextResponse.json({ error: code }, { status, headers });
}

export async function GET(request: Request) {
  const limit = rateLimit(`github:${clientKey(request)}`, 30, 60_000);
  if (!limit.ok) {
    return errorResponse("rate_limited", 429, limit.retryAfter);
  }

  const login = githubLoginFromProfileUrl(profile.github);
  if (!login) {
    return errorResponse("not_configured", 503);
  }

  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return NextResponse.json(cache.payload, { headers: OK_HEADERS });
  }

  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "cyber-nexus-portfolio",
    "x-github-api-version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const endpoint =
    `https://api.github.com/users/${encodeURIComponent(login)}/repos` +
    `?per_page=${REPO_COUNT}&sort=pushed&direction=desc&type=owner`;

  try {
    const response = await fetch(endpoint, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (response.status === 403 || response.status === 429) {
      const retry = Number.parseInt(response.headers.get("retry-after") ?? "", 10);
      const exhausted = response.headers.get("x-ratelimit-remaining") === "0";
      return errorResponse(
        exhausted || response.status === 429 ? "upstream_rate_limited" : "upstream_unavailable",
        429,
        Number.isFinite(retry) && retry > 0 ? retry : 60,
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

    const repos = normalizeGitHubRepos(payload, REPO_COUNT);
    const profileUrl = safeGitHubProfileUrl(`https://github.com/${login}`) ?? profile.github;

    const body: GitHubPayload = {
      login,
      profileUrl,
      repos,
      fetchedAt: new Date(now).toISOString(),
    };

    cache = { payload: body, expiresAt: now + CACHE_TTL_MS };
    return NextResponse.json(body, { headers: OK_HEADERS });
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return errorResponse(timedOut ? "upstream_timeout" : "upstream_unavailable", timedOut ? 504 : 502);
  }
}
