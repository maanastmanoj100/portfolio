/**
 * System status model.
 *
 * Three independent facts, never collapsed into one green light:
 *   1. this website answered a health request;
 *   2. the Cyber Intelligence archive has a recent successful refresh;
 *   3. the upstream sources refreshed successfully on their last attempt.
 *
 * "unknown" is a first-class state. It is used whenever the server has no
 * recorded evidence, instead of assuming everything is fine.
 */

export type StatusLevel = "operational" | "degraded" | "unavailable" | "unknown";

export interface StatusComponent {
  level: StatusLevel;
  detail: string;
}

export interface ArchiveStatus extends StatusComponent {
  lastSuccessAt: string | null;
  stale: boolean;
  staleAfterHours: number;
}

export interface SourcesStatus extends StatusComponent {
  ok: number;
  failed: number;
  skipped: number;
  total: number;
}

export interface StatusReport {
  checkedAt: string;
  site: StatusComponent;
  archive: ArchiveStatus;
  sources: SourcesStatus;
}

export interface StatusInputs {
  checkedAt: string;
  archive: {
    lastSuccessAt: string | null;
    stale: boolean;
    staleAfterHours: number;
    count: number;
  } | null;
  sources: { status: "ok" | "error" | "skipped" }[] | null;
}

export const STATUS_LABELS: Record<StatusLevel, string> = {
  operational: "Operational",
  degraded: "Degraded",
  unavailable: "Unavailable",
  unknown: "Unknown",
};

export function statusLabel(level: StatusLevel): string {
  return STATUS_LABELS[level];
}

/**
 * The site itself is the only component that is known to be up: the report was
 * produced by a request it answered. Everything else must have evidence.
 */
export function overallLevel(report: StatusReport): StatusLevel {
  if (report.site.level === "unavailable") return "unavailable";
  const levels = [report.archive.level, report.sources.level];
  if (levels.includes("degraded") || levels.includes("unavailable")) return "degraded";
  if (levels.includes("unknown")) return "unknown";
  return "operational";
}

export function buildStatusReport(inputs: StatusInputs): StatusReport {
  const site: StatusComponent = {
    level: "operational",
    detail: "This website answered the status request.",
  };

  let archive: ArchiveStatus;
  if (!inputs.archive) {
    archive = {
      level: "unknown",
      detail: "The news archive status could not be read.",
      lastSuccessAt: null,
      stale: false,
      staleAfterHours: 6,
    };
  } else if (!inputs.archive.lastSuccessAt && inputs.archive.count === 0) {
    archive = {
      level: "unknown",
      detail: "No news ingestion has been recorded yet.",
      lastSuccessAt: null,
      stale: false,
      staleAfterHours: inputs.archive.staleAfterHours,
    };
  } else {
    archive = {
      level: inputs.archive.stale ? "degraded" : "operational",
      detail: inputs.archive.stale
        ? `No successful refresh in the last ${inputs.archive.staleAfterHours} hours.`
        : "The archive was refreshed recently.",
      lastSuccessAt: inputs.archive.lastSuccessAt,
      stale: inputs.archive.stale,
      staleAfterHours: inputs.archive.staleAfterHours,
    };
  }

  let sources: SourcesStatus;
  if (!inputs.sources || inputs.sources.length === 0) {
    sources = {
      level: "unknown",
      detail: "No source refresh has been recorded yet.",
      ok: 0,
      failed: 0,
      skipped: 0,
      total: 0,
    };
  } else {
    const ok = inputs.sources.filter((source) => source.status === "ok").length;
    const failed = inputs.sources.filter((source) => source.status === "error").length;
    const skipped = inputs.sources.filter((source) => source.status === "skipped").length;
    const total = inputs.sources.length;

    let level: StatusLevel;
    let detail: string;
    if (ok === 0 && failed === 0) {
      level = "unknown";
      detail = "Sources were skipped on the last run; their availability is unknown.";
    } else if (ok === 0) {
      level = "unavailable";
      detail = `All ${failed} attempted ${failed === 1 ? "source" : "sources"} failed on the last run.`;
    } else if (failed > 0) {
      level = "degraded";
      detail = `${ok} of ${total} sources refreshed; ${failed} failed.`;
    } else {
      level = "operational";
      detail = `${ok} of ${total} sources refreshed successfully.`;
    }

    sources = { level, detail, ok, failed, skipped, total };
  }

  return { checkedAt: inputs.checkedAt, site, archive, sources };
}

const LEVELS = new Set<StatusLevel>(["operational", "degraded", "unavailable", "unknown"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLevel(value: unknown): value is StatusLevel {
  return typeof value === "string" && LEVELS.has(value as StatusLevel);
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

/**
 * Validate a response before rendering it. The payload crosses a trust
 * boundary even though it comes from our own route, so every field is checked.
 */
export function isStatusReport(value: unknown): value is StatusReport {
  if (!isRecord(value)) return false;
  if (typeof value.checkedAt !== "string" || !Number.isFinite(Date.parse(value.checkedAt))) {
    return false;
  }

  const { site, archive, sources } = value;

  if (!isRecord(site) || !isLevel(site.level) || typeof site.detail !== "string") return false;

  if (
    !isRecord(archive) ||
    !isLevel(archive.level) ||
    typeof archive.detail !== "string" ||
    !(archive.lastSuccessAt === null || typeof archive.lastSuccessAt === "string") ||
    typeof archive.stale !== "boolean" ||
    typeof archive.staleAfterHours !== "number" ||
    !Number.isFinite(archive.staleAfterHours)
  ) {
    return false;
  }

  if (
    !isRecord(sources) ||
    !isLevel(sources.level) ||
    typeof sources.detail !== "string" ||
    !isCount(sources.ok) ||
    !isCount(sources.failed) ||
    !isCount(sources.skipped) ||
    !isCount(sources.total)
  ) {
    return false;
  }

  return true;
}

/** Short, non-technical timestamp for the indicator. */
export function formatCheckedAt(iso: string | null): string {
  if (!iso) return "not checked";
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return "not checked";
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
