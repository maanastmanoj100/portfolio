"use client";

import { useEffect, useState } from "react";
import {
  formatCheckedAt,
  isStatusReport,
  overallLevel,
  statusLabel,
  type StatusLevel,
  type StatusReport,
} from "@/lib/portfolio/status";
import { cn } from "@/lib/utils";

/**
 * Footer status indicator.
 *
 * It reports only what the server can verify: that the site answered, when the
 * news archive last refreshed, and how the upstream sources behaved. It starts
 * as "unknown" and stays there if the status request fails — it never shows a
 * hardcoded green dot.
 */

const POLL_INTERVAL_MS = 5 * 60 * 1000;

type IndicatorState =
  | { phase: "loading" }
  | { phase: "ready"; report: StatusReport }
  | { phase: "error" };

const DOT_CLASSES: Record<StatusLevel, string> = {
  operational: "bg-emerald",
  degraded: "bg-amber",
  unavailable: "bg-rose",
  unknown: "bg-foreground-tertiary",
};

const TEXT_CLASSES: Record<StatusLevel, string> = {
  operational: "text-emerald",
  degraded: "text-amber",
  unavailable: "text-rose",
  unknown: "text-foreground-tertiary",
};

function StatusRow({
  title,
  level,
  detail,
  extra,
}: {
  title: string;
  level: StatusLevel;
  detail: string;
  extra?: string;
}) {
  return (
    <div className="border-t border-border/60 py-2 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-foreground">{title}</span>
        <span className={cn("flex items-center gap-1.5 text-xs", TEXT_CLASSES[level])}>
          <span className={cn("h-1.5 w-1.5 rounded-full", DOT_CLASSES[level])} aria-hidden="true" />
          {statusLabel(level)}
        </span>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-foreground-secondary">{detail}</p>
      {extra && <p className="mt-0.5 text-[11px] text-foreground-tertiary">{extra}</p>}
    </div>
  );
}

export function SystemStatus() {
  const [state, setState] = useState<IndicatorState>({ phase: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;
    let inFlight = false;

    async function load() {
      if (inFlight) return;
      inFlight = true;
      try {
        const response = await fetch("/api/status", {
          signal: controller.signal,
          cache: "no-store",
          headers: { accept: "application/json" },
        });
        if (!response.ok) throw new Error("status_unavailable");
        const payload: unknown = await response.json();
        if (!isStatusReport(payload)) throw new Error("invalid_status_payload");
        if (!disposed) setState({ phase: "ready", report: payload });
      } catch {
        if (!disposed && !controller.signal.aborted) setState({ phase: "error" });
      } finally {
        inFlight = false;
      }
    }

    void load();

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, POLL_INTERVAL_MS);

    return () => {
      disposed = true;
      controller.abort();
      window.clearInterval(timer);
    };
  }, [attempt]);

  const level: StatusLevel =
    state.phase === "ready" ? overallLevel(state.report) : "unknown";

  const summary =
    state.phase === "loading"
      ? "Checking status…"
      : state.phase === "error"
        ? "Status unavailable"
        : `Systems ${statusLabel(level).toLowerCase()}`;

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded px-1 py-0.5 text-xs text-foreground-tertiary transition-colors hover:text-foreground-secondary [&::-webkit-details-marker]:hidden">
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT_CLASSES[level])}
          aria-hidden="true"
        />
        <span aria-live="polite">{summary}</span>
      </summary>

      <div className="absolute bottom-full right-0 z-30 mb-2 w-72 rounded-lg border border-border bg-background p-3 shadow-xl">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-foreground">Service status</span>
          <button
            type="button"
            onClick={() => {
              setState({ phase: "loading" });
              setAttempt((value) => value + 1);
            }}
            className="rounded border border-border px-1.5 py-0.5 text-[10px] text-foreground-tertiary transition-colors hover:border-border-hover hover:text-foreground"
          >
            Check again
          </button>
        </div>

        {state.phase === "loading" && (
          <p className="text-[11px] leading-relaxed text-foreground-secondary">
            Reading the status endpoint…
          </p>
        )}

        {state.phase === "error" && (
          <p className="text-[11px] leading-relaxed text-foreground-secondary">
            The status endpoint could not be reached. That does not by itself mean the site is
            down; this page may still be working from a cached copy.
          </p>
        )}

        {state.phase === "ready" && (
          <>
            <StatusRow
              title="Website"
              level={state.report.site.level}
              detail={state.report.site.detail}
            />
            <StatusRow
              title="News archive"
              level={state.report.archive.level}
              detail={state.report.archive.detail}
              extra={
                state.report.archive.lastSuccessAt
                  ? `Last successful refresh: ${formatCheckedAt(state.report.archive.lastSuccessAt)}`
                  : undefined
              }
            />
            <StatusRow
              title="Upstream sources"
              level={state.report.sources.level}
              detail={state.report.sources.detail}
            />
            <p className="mt-2 border-t border-border/60 pt-2 text-[10px] leading-relaxed text-foreground-tertiary">
              Last checked {formatCheckedAt(state.report.checkedAt)}. Checks run at most every five
              minutes while the page is visible.
            </p>
          </>
        )}
      </div>
    </details>
  );
}
