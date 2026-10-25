"use client";

import { useEffect, useState } from "react";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconGitFork,
  IconStar,
} from "@tabler/icons-react";
import {
  normalizeGitHubOverview,
  relativeTime,
  type GitHubOverview,
} from "@/lib/portfolio/github";

/**
 * Recent public repositories from the GitHub REST API.
 *
 * The request goes through `/api/github`, which caches the upstream response
 * for 15 minutes, and is deferred until after hydration so it never competes
 * with the first paint. It deliberately does not depend on an
 * IntersectionObserver callback: some embedded and headless browsers never
 * deliver those, which would leave the widget stuck on its skeleton forever.
 *
 * Only repository metadata is shown — no commit counts, contribution graphs or
 * streaks, because the public endpoints used here do not provide them.
 */

type WidgetState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "ready"; data: GitHubOverview }
  | { phase: "error" };

/** Long enough to stay off the critical path, short enough to feel immediate. */
const START_DELAY_MS = 400;

export function GitHubActivity({ profileUrl }: { profileUrl: string }) {
  const [state, setState] = useState<WidgetState>({ phase: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    async function load() {
      setState({ phase: "loading" });
      try {
        const response = await fetch("/api/github", {
          signal: controller.signal,
          headers: { accept: "application/json" },
        });
        if (!response.ok) throw new Error("github_unavailable");
        const payload: unknown = await response.json();
        const data = normalizeGitHubOverview(payload);
        if (!data) throw new Error("invalid_github_payload");
        if (!disposed) setState({ phase: "ready", data });
      } catch {
        if (!disposed && !controller.signal.aborted) setState({ phase: "error" });
      }
    }

    const timer = window.setTimeout(() => {
      if (!disposed) void load();
    }, START_DELAY_MS);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  const loading = state.phase === "idle" || state.phase === "loading";

  return (
    <div
      className="rounded-xl border border-border bg-white/[0.02] p-5"
      aria-busy={loading}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconBrandGithub size={16} className="text-foreground-secondary" aria-hidden="true" />
          <h3 className="text-sm font-medium text-foreground">Recent public repositories</h3>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-foreground-secondary transition-colors hover:text-foreground"
        >
          View GitHub profile
          <IconArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>

      <div className="mt-3 min-h-[13rem]">
        {loading && (
          <div className="space-y-3" aria-live="polite">
            <p className="sr-only">Loading public repositories from GitHub.</p>
            {[0, 1, 2].map((row) => (
              <div key={row} className="space-y-1.5">
                <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-2.5 w-3/4 animate-pulse rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        )}

        {state.phase === "error" && (
          <div className="text-sm leading-relaxed text-foreground-secondary">
            <p>GitHub data is temporarily unavailable.</p>
            <p className="mt-1 text-xs text-foreground-tertiary">
              The profile and repositories are still available directly on GitHub. Nothing else on
              this page depends on this request.
            </p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
            >
              Open the GitHub profile
              <IconArrowUpRight size={12} aria-hidden="true" />
            </a>
          </div>
        )}

        {state.phase === "ready" && state.data.repos.length === 0 && (
          <div className="text-sm leading-relaxed text-foreground-secondary">
            <p>GitHub returned no public repositories for this account.</p>
            <a
              href={state.data.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
            >
              Open the GitHub profile
              <IconArrowUpRight size={12} aria-hidden="true" />
            </a>
          </div>
        )}

        {state.phase === "ready" && state.data.repos.length > 0 && (
          <>
            <ul className="divide-y divide-border/60">
              {state.data.repos.map((repo) => (
                <li key={repo.url} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {repo.name}
                    </a>
                    <span className="text-[11px] text-foreground-tertiary">
                      Updated {relativeTime(repo.pushedAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-foreground-secondary">
                    {repo.description ?? (
                      <span className="text-foreground-tertiary">No description provided.</span>
                    )}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-foreground-tertiary">
                    {repo.language && (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                        {repo.language}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <IconStar size={12} aria-hidden="true" />
                      {repo.stars} <span className="sr-only">stars</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IconGitFork size={12} aria-hidden="true" />
                      {repo.forks} <span className="sr-only">forks</span>
                    </span>
                    {repo.isFork && <span>Fork</span>}
                    {repo.archived && <span>Archived</span>}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-border/60 pt-2 text-[11px] leading-relaxed text-foreground-tertiary">
              Public repository data from the GitHub API, cached for up to 15 minutes. Counts are as
              returned by GitHub.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
