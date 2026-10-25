"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  IconAlertTriangle,
  IconArrowUpRight,
  IconCalendar,
  IconChevronDown,
  IconClock,
  IconDatabase,
  IconFilter,
  IconGlobe,
  IconInfoCircle,
  IconMapPin,
  IconRefresh,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  type GeoCluster,
  type IntelCategory,
  type IntelDetail,
  type IntelItem,
  type IntelSnapshot,
  type SourceHealth,
} from "@/lib/cyber-intel/types";
import {
  EMPTY_ARCHIVE_FILTERS,
  dayBefore,
  filtersFromSearchParams,
  filtersToApiQuery,
  filtersToSearchParams,
  hasNarrowingFilters,
  isDateRangeInverted,
  type ArchiveFilters as Filters,
} from "@/lib/cyber-intel/filters";

/**
 * Client shell for /cyber-intel.
 *
 * The first render is server-provided (`initial`), so the feed is readable
 * without JavaScript. Filtering then talks to `/api/cyber-intel`, which serves
 * from the server-side archive; publishers are never contacted from the
 * browser. The globe is a separate chunk and only mounts on this route.
 */
const IntelGlobe = dynamic(() => import("./intel-globe").then((module) => module.IntelGlobe), {
  ssr: false,
  loading: () => <GlobeLoading />,
});

const PAGE_SIZE = 20;
const CLIENT_CACHE_MS = 60_000;

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

function formatDate(iso: string | null, withTime = false): string {
  if (!iso) return "not stated";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "not stated";
  return `${(withTime ? DATE_TIME_FORMAT : DATE_FORMAT).format(date)} UTC`;
}

function formatDay(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

const PUBLISHED_LABEL: Record<IntelItem["publishedAtKind"], string> = {
  article: "Published",
  advisory: "Advisory issued",
  catalog: "Added to catalogue",
  aggregator: "Claim recorded",
};

/** Compact label used in the feed, where space is tight but the meaning matters. */
const PUBLISHED_SHORT: Record<IntelItem["publishedAtKind"], string> = {
  article: "Published",
  advisory: "Advisory",
  catalog: "Catalogue date",
  aggregator: "Claim recorded",
};

const PUBLISHED_NOTE: Partial<Record<IntelItem["publishedAtKind"], string>> = {
  catalog: "This is the date the catalogue added the entry, not the vulnerability's disclosure date.",
  aggregator:
    "This is when the aggregator recorded the claim. The claimed attack date is shown separately where the source provides one.",
};

const MONTHS = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(2026, index, 1)),
  ),
);

function categoryMeta(category: IntelCategory) {
  return CATEGORIES[category];
}

function CategoryBadge({ category, count }: { category: IntelCategory; count?: number }) {
  const meta = categoryMeta(category);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{
        color: meta.color,
        backgroundColor: `${meta.color}14`,
        borderColor: `${meta.color}33`,
      }}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
      {typeof count === "number" && <span className="opacity-70">{count}</span>}
    </span>
  );
}

function SourceStatusBadge({ status }: { status: SourceHealth["status"] }) {
  const style =
    status === "ok"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : status === "error"
        ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
        : "border-white/10 bg-white/5 text-[var(--color-foreground-tertiary)]";
  return (
    <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${style}`}>
      {status === "ok" ? "ok" : status === "error" ? "failed" : "not ingested"}
    </span>
  );
}

function GlobeLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="relative h-32 w-32 sm:h-40 sm:w-40">
        <span className="absolute inset-0 rounded-full border border-[var(--color-border)]" />
        <span className="absolute inset-5 rounded-full border border-[var(--color-border)]" />
        <span className="absolute inset-10 rounded-full border border-[var(--color-border)]" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail drawer                                                       */
/* ------------------------------------------------------------------ */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <dt className="shrink-0 text-[11px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
        {label}
      </dt>
      <dd className="text-right text-xs text-[var(--color-foreground-secondary)]">{value}</dd>
    </div>
  );
}

function ArticleDetail({
  item,
  related,
  onClose,
  onSelectRelated,
}: {
  item: IntelItem;
  related: IntelItem[];
  onClose: () => void;
  onSelectRelated: (id: string) => void;
}) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <CategoryBadge category={item.category} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close report details"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--color-foreground-tertiary)] transition-colors hover:bg-white/5 hover:text-[var(--color-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <IconX size={15} />
        </button>
      </div>

      <h3 className="mt-3 text-sm font-medium leading-snug text-[var(--color-foreground)]">{item.title}</h3>

      {item.summary && (
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-foreground-secondary)]">{item.summary}</p>
      )}

      <p className="mt-2 text-[11px] text-[var(--color-foreground-tertiary)]">
        {item.sourceName} ·{" "}
        {item.categoryBasis === "keyword"
          ? "category inferred from the headline by this site"
          : item.categoryBasis === "source"
            ? "category supplied by the source"
            : "category assigned by feed type"}
      </p>

      <dl className="mt-4 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        <DetailRow label={PUBLISHED_LABEL[item.publishedAtKind]} value={formatDate(item.publishedAt, true)} />
        {item.incidentAt && <DetailRow label="Incident date" value={formatDate(item.incidentAt, true)} />}
        {item.advisoryAt && item.advisoryAt !== item.publishedAt && (
          <DetailRow label="Advisory issued" value={formatDate(item.advisoryAt, true)} />
        )}
        {item.updatedAt && <DetailRow label="Updated" value={formatDate(item.updatedAt, true)} />}
        <DetailRow label="Archived here" value={formatDate(item.firstSeenAt, true)} />
      </dl>

      {PUBLISHED_NOTE[item.publishedAtKind] && (
        <p className="mt-1.5 text-[10px] leading-relaxed text-[var(--color-foreground-tertiary)]">
          {PUBLISHED_NOTE[item.publishedAtKind]}
        </p>
      )}

      <div className="mt-4 rounded-md border border-[var(--color-border)] bg-white/[0.02] p-3">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
          <IconMapPin size={12} />
          Location
        </div>
        {item.geo ? (
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-foreground-secondary)]">
            <span className="text-[var(--color-foreground)]">{item.geo.countryName}</span> — victim country reported
            by {item.geo.reportedBy}. This is a country-level marker for the affected organisation, not the
            attacker&apos;s location and not a street address.
          </p>
        ) : (
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-foreground-secondary)]">
            No verified location. This item is not plotted on the globe; it stays in the feed.
          </p>
        )}
      </div>

      {item.attribution && (
        <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/[0.06] p-3">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-amber-300/80">
            <IconAlertTriangle size={12} />
            Attribution
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-foreground-secondary)]">
            {item.attribution}. Leak-site claims are unverified assertions by the group that published them.
          </p>
        </div>
      )}

      {item.identifiers.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
            Identifiers
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {item.identifiers.map((identifier) => (
              <span
                key={identifier}
                className="rounded border border-[var(--color-border)] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-foreground-secondary)]"
              >
                {identifier}
              </span>
            ))}
          </div>
        </div>
      )}

      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-foreground-tertiary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
            Related in the archive
          </div>
          <ul className="mt-1.5 space-y-1">
            {related.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onSelectRelated(entry.id)}
                  className="w-full rounded-md px-2 py-1.5 text-left text-xs text-[var(--color-foreground-secondary)] transition-colors hover:bg-white/[0.04] hover:text-[var(--color-foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  <span className="line-clamp-2">{entry.title}</span>
                  <span className="mt-0.5 block font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
                    {entry.sourceName} · {formatDate(entry.publishedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] px-3 py-2 text-xs text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/20"
      >
        Read the original at {item.sourceName}
        <IconArrowUpRight size={13} />
      </a>
      <p className="mt-2 text-[10px] leading-relaxed text-[var(--color-foreground-tertiary)]">
        This site stores the headline, a short excerpt and metadata. The full article remains with the publisher.
      </p>
    </div>
  );
}

function CountryDetail({
  cluster,
  items,
  onSelectItem,
  onClear,
}: {
  cluster: GeoCluster;
  items: IntelItem[];
  onSelectItem: (id: string) => void;
  onClear: () => void;
}) {
  const breakdown = (Object.entries(cluster.categories) as [IntelCategory, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const max = Math.max(1, ...breakdown.map(([, count]) => count));
  const matching = items.filter((item) => item.geo?.countryCode === cluster.countryCode).slice(0, 6);

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
            <IconGlobe size={12} />
            Victim country
          </div>
          <h3 className="mt-1 text-sm font-medium text-[var(--color-foreground)]">{cluster.countryName}</h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="flex h-8 items-center gap-1 rounded-md border border-[var(--color-border)] px-2 text-[11px] text-[var(--color-foreground-tertiary)] transition-colors hover:text-[var(--color-foreground)]"
        >
          <IconX size={12} />
          Clear
        </button>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-[var(--color-foreground-secondary)]">
        {cluster.count} report{cluster.count === 1 ? "" : "s"} in the current filter, latest{" "}
        {formatDate(cluster.latestAt)}. Markers show the country reported for the affected organisation, not the
        attacker&apos;s origin.
      </p>

      <div className="mt-4 space-y-1.5">
        {breakdown.map(([category, count]) => (
          <div key={category} className="flex items-center gap-2">
            <span className="w-24 shrink-0 truncate text-[10px] text-[var(--color-foreground-tertiary)]">
              {categoryMeta(category).label}
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
              <span
                className="block h-full rounded-full"
                style={{ width: `${(count / max) * 100}%`, backgroundColor: categoryMeta(category).color }}
              />
            </span>
            <span className="w-6 text-right font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
              {count}
            </span>
          </div>
        ))}
      </div>

      {matching.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
            Latest reports on this page
          </div>
          <ul className="mt-1.5 space-y-1">
            {matching.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelectItem(item.id)}
                  className="w-full rounded-md px-2 py-1.5 text-left text-xs text-[var(--color-foreground-secondary)] transition-colors hover:bg-white/[0.04] hover:text-[var(--color-foreground)]"
                >
                  <span className="line-clamp-2">{item.title}</span>
                  <span className="mt-0.5 block font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
                    {formatDate(item.publishedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MethodPanel() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
        <IconInfoCircle size={12} />
        How to read this
      </div>
      <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-[var(--color-foreground-secondary)]">
        <li>
          <span className="text-[var(--color-foreground)]">One marker per country.</span> Marker size follows the
          number of reports in the current filter; colour is the most common category. A marker only exists when
          a source reported a country in a structured field.
        </li>
        <li>
          <span className="text-[var(--color-foreground)]">No inferred coordinates.</span> Advisories, research
          and most news describe no location, so they stay in the feed and are never placed on the map.
        </li>
        <li>
          <span className="text-[var(--color-foreground)]">Victim, not attacker.</span> Leak-site records are the
          affected organisation&apos;s country, not the group&apos;s.
        </li>
        <li>
          <span className="text-[var(--color-foreground)]">Country, not region.</span> Sources report countries only,
          so there is no region or city filter and no location is inferred from a headline. Records without a
          reported country are marked unlocated.
        </li>
        <li>
          <span className="text-[var(--color-foreground)]">Dates are separate.</span> Publication, incident and
          advisory dates are shown only when the source states them, all in UTC. A record with no date says so.
        </li>
        <li>
          <span className="text-[var(--color-foreground)]">Keyboard.</span> Focus the map and use the arrow keys
          to rotate, <kbd className="rounded border border-[var(--color-border)] px-1">+</kbd>/
          <kbd className="rounded border border-[var(--color-border)] px-1">−</kbd> to zoom, and{" "}
          <kbd className="rounded border border-[var(--color-border)] px-1">0</kbd> to reset.
        </li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {CATEGORY_ORDER.filter((category) => category !== "general").map((category) => (
          <CategoryBadge key={category} category={category} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feed                                                                */
/* ------------------------------------------------------------------ */

function FeedItem({
  item,
  selected,
  onSelect,
}: {
  item: IntelItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`border-b border-[var(--color-border)] px-4 py-3.5 transition-colors ${
        selected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <CategoryBadge category={item.category} />
        <span className="text-[11px] text-[var(--color-foreground-tertiary)]">{item.sourceName}</span>
        <span aria-hidden="true" className="text-[var(--color-foreground-tertiary)]">
          ·
        </span>
        <time
          dateTime={item.publishedAt ?? undefined}
          title={`${PUBLISHED_LABEL[item.publishedAtKind]}${item.publishedAt ? "" : " (the source states no date)"}`}
          className="font-mono text-[11px] text-[var(--color-foreground-tertiary)]"
        >
          {PUBLISHED_SHORT[item.publishedAtKind]} {formatDate(item.publishedAt)}
        </time>
        {item.geo && (
          <span className="inline-flex items-center gap-1 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-foreground-secondary)]">
            <IconMapPin size={10} />
            {item.geo.countryName}
          </span>
        )}
        {item.attribution && (
          <span className="rounded border border-amber-500/20 bg-amber-500/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-amber-300/80">
            claim
          </span>
        )}
        {item.advisoryAt && item.advisoryAt !== item.publishedAt && (
          <span className="font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
            advisory {formatDate(item.advisoryAt)}
          </span>
        )}
        {item.incidentAt && item.incidentAt !== item.publishedAt && (
          <span className="font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
            incident {formatDate(item.incidentAt)}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onSelect}
        aria-expanded={selected}
        aria-controls="intel-detail"
        className="mt-1.5 block w-full text-left"
      >
        <h3 className="text-sm font-medium leading-snug text-[var(--color-foreground)]">{item.title}</h3>
        {item.summary && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-foreground-secondary)]">
            {item.summary}
          </p>
        )}
      </button>

      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onSelect}
          aria-expanded={selected}
          aria-controls="intel-detail"
          className="text-[11px] text-[var(--color-foreground-tertiary)] transition-colors hover:text-[var(--color-accent)]"
        >
          {selected ? "Hide details" : "Details"}
        </button>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 text-[11px] text-[var(--color-foreground-tertiary)] transition-colors hover:text-[var(--color-accent)]"
        >
          Open original
          <IconArrowUpRight size={12} />
        </a>
      </div>
    </article>
  );
}

function FeedSkeleton() {
  return (
    <div className="divide-y divide-[var(--color-border)]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="animate-pulse px-4 py-4 motion-reduce:animate-none">
          <div className="h-2.5 w-40 rounded bg-white/[0.06]" />
          <div className="mt-3 h-3 w-4/5 rounded bg-white/[0.07]" />
          <div className="mt-2 h-2.5 w-full rounded bg-white/[0.05]" />
          <div className="mt-1.5 h-2.5 w-2/3 rounded bg-white/[0.05]" />
        </div>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="p-4" aria-hidden="true">
      <div className="h-4 w-24 animate-pulse rounded bg-white/[0.07] motion-reduce:animate-none" />
      <div className="mt-4 h-3 w-4/5 animate-pulse rounded bg-white/[0.07] motion-reduce:animate-none" />
      <div className="mt-2 h-2.5 w-full animate-pulse rounded bg-white/[0.05] motion-reduce:animate-none" />
      <div className="mt-1.5 h-2.5 w-3/4 animate-pulse rounded bg-white/[0.05] motion-reduce:animate-none" />
      <div className="mt-4 h-2.5 w-1/2 animate-pulse rounded bg-white/[0.05] motion-reduce:animate-none" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function mergeItems(current: IntelItem[], incoming: IntelItem[]): IntelItem[] {
  const seen = new Set(current.map((item) => item.id));
  return [...current, ...incoming.filter((item) => !seen.has(item.id))];
}

const ITEM_PATTERN = /^ci-[a-z0-9]{1,24}$/;

export function CyberIntelPage({
  initial,
  initialFilters,
  initialItemId,
  initialDetail,
}: {
  initial: IntelSnapshot;
  initialFilters: string;
  initialItemId: string | null;
  initialDetail: IntelDetail | null;
}) {
  const [filters, setFilters] = useState<Filters>(() =>
    filtersFromSearchParams(new URLSearchParams(initialFilters)),
  );
  const [snapshot, setSnapshot] = useState<IntelSnapshot>(initial);
  const [items, setItems] = useState<IntelItem[]>(initial.items);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(initialItemId);
  const [detail, setDetail] = useState<IntelItem | null>(initialDetail?.item ?? null);
  const [related, setRelated] = useState<IntelItem[]>(initialDetail?.related ?? []);
  const [detailStatus, setDetailStatus] = useState<"idle" | "loading" | "error">("idle");
  const [detailError, setDetailError] = useState("");
  const [detailRetryToken, setDetailRetryToken] = useState(0);
  const [refreshToken, setRefreshToken] = useState(0);

  const queryString = useMemo(() => filtersToApiQuery(filters, PAGE_SIZE), [filters]);
  const cache = useRef(new Map<string, { at: number; snapshot: IntelSnapshot }>());
  const [detailCache] = useState(() => {
    const map = new Map<string, IntelDetail>();
    if (initialDetail) map.set(initialDetail.item.id, initialDetail);
    return map;
  });
  const requestId = useRef(0);
  const skipInitial = useRef(initial.items.length > 0);
  const loadMoreController = useRef<AbortController | null>(null);
  const detailController = useRef<AbortController | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const shouldFocusPanel = useRef(false);

  useEffect(() => {
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }

    // A new filter invalidates any in-flight "load more" page.
    loadMoreController.current?.abort();
    setLoadingMore(false);

    const cached = cache.current.get(queryString);
    if (cached && Date.now() - cached.at < CLIENT_CACHE_MS) {
      setSnapshot(cached.snapshot);
      setItems(cached.snapshot.items);
      setPage(1);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    const id = ++requestId.current;
    setStatus("loading");
    setErrorMessage("");

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/cyber-intel?${queryString}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const next = (await response.json()) as IntelSnapshot;
        if (id !== requestId.current) return;
        cache.current.set(queryString, { at: Date.now(), snapshot: next });
        setSnapshot(next);
        setItems(next.items);
        setPage(1);
        setStatus("idle");
      } catch (error) {
        if (controller.signal.aborted) return;
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Request failed");
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [queryString, refreshToken]);

  useEffect(
    () => () => {
      loadMoreController.current?.abort();
      detailController.current?.abort();
    },
    [],
  );

  /**
   * The detail panel is resolved separately from the feed page. A deep link can
   * name a record that is not in the current 20-item window, so the panel asks
   * `/api/cyber-intel/{id}` instead of requiring the whole archive in memory.
   *
   * State is only written from the async callback (and from the event handlers
   * that open or close the panel). The cached record is read during render, so
   * switching between already-opened reports does not cascade renders.
   */
  useEffect(() => {
    if (!selectedId) return;
    if (items.some((item) => item.id === selectedId)) return;
    if (detailCache.has(selectedId)) return;

    detailController.current?.abort();
    const controller = new AbortController();
    detailController.current = controller;

    void (async () => {
      try {
        const response = await fetch(`/api/cyber-intel/${encodeURIComponent(selectedId)}`, {
          signal: controller.signal,
        });
        if (response.status === 404) {
          throw new Error("This report is no longer in the archive. It may have been pruned.");
        }
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const payload = (await response.json()) as IntelDetail;
        if (controller.signal.aborted) return;
        detailCache.set(selectedId, payload);
        setDetail(payload.item);
        setRelated(payload.related);
        setDetailStatus("idle");
      } catch (error) {
        if (controller.signal.aborted) return;
        setDetailStatus("error");
        setDetailError(error instanceof Error ? error.message : "Request failed");
      }
    })();

    return () => controller.abort();
  }, [selectedId, items, detailRetryToken, detailCache]);

  // Keep filters and the open report in the address bar without a server
  // round-trip for every keystroke. Reloads and shared links still restore the
  // same view, because the page renders the snapshot from the same parameters.
  useEffect(() => {
    const params = filtersToSearchParams(filters);
    if (selectedId) params.set("item", selectedId);
    const search = params.toString();
    const next = `${window.location.pathname}${search ? `?${search}` : ""}`;
    if (`${window.location.pathname}${window.location.search}` !== next) {
      window.history.replaceState(null, "", next);
    }
  }, [filters, selectedId]);

  // Back/forward (including bfcache restores) re-reads the URL rather than
  // trusting component state that may predate the navigation.
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setFilters(filtersFromSearchParams(params));
      const item = params.get("item");
      setDetailStatus("idle");
      setDetailError("");
      setSelectedId(item && ITEM_PATTERN.test(item) ? item : null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedId(null);
    setDetailStatus("idle");
    setDetailError("");
    const trigger = lastTrigger.current;
    lastTrigger.current = null;
    // Returning focus to the control that opened the panel keeps keyboard
    // navigation in place instead of dropping the user at the top of the page.
    window.requestAnimationFrame(() => trigger?.focus());
  }, []);

  const openDetail = useCallback(
    (id: string) => {
      if (selectedId === id) {
        closeDetail();
        return;
      }
      shouldFocusPanel.current = true;
      lastTrigger.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setDetailStatus("idle");
      setDetailError("");
      setSelectedId(id);
    },
    [selectedId, closeDetail],
  );

  useEffect(() => {
    if (selectedId && shouldFocusPanel.current) {
      shouldFocusPanel.current = false;
      panelRef.current?.focus();
    }
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeDetail();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedId, closeDetail]);

  const update = useCallback((patch: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setSelectedId(null);
  }, []);

  const toggleCategory = useCallback((category: IntelCategory) => {
    setFilters((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((id) => id !== category)
        : [...current.categories, category],
    }));
    setSelectedId(null);
  }, []);

  const setCountry = useCallback((code: string | null) => {
    setFilters((current) => ({ ...current, country: code ?? "" }));
    setSelectedId(null);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_ARCHIVE_FILTERS);
    setSelectedId(null);
  }, []);

  const applyRange = useCallback((days: number | null) => {
    setSelectedId(null);
    if (days === null) {
      setFilters((current) => ({ ...current, from: "", to: "" }));
      return;
    }
    const from = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
    setFilters((current) => ({ ...current, from, to: "" }));
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !snapshot.hasMore) return;
    const nextPage = page + 1;
    const cacheKey = `${queryString}#${nextPage}`;
    setLoadingMore(true);

    const cached = cache.current.get(cacheKey);
    if (cached && Date.now() - cached.at < CLIENT_CACHE_MS) {
      setItems((current) => mergeItems(current, cached.snapshot.items));
      setSnapshot((current) => ({ ...cached.snapshot, items: current.items }));
      setPage(nextPage);
      setLoadingMore(false);
      return;
    }

    loadMoreController.current?.abort();
    const controller = new AbortController();
    loadMoreController.current = controller;

    try {
      const params = new URLSearchParams(queryString);
      params.set("page", String(nextPage));
      const response = await fetch(`/api/cyber-intel?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const next = (await response.json()) as IntelSnapshot;
      if (controller.signal.aborted) return;
      cache.current.set(cacheKey, { at: Date.now(), snapshot: next });
      setItems((current) => mergeItems(current, next.items));
      setSnapshot((current) => ({ ...next, items: current.items }));
      setPage(nextPage);
    } catch (error) {
      if (controller.signal.aborted) return;
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Request failed");
    } finally {
      if (loadMoreController.current === controller) {
        loadMoreController.current = null;
        setLoadingMore(false);
      }
    }
  }, [loadingMore, snapshot.hasMore, page, queryString]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    const inList = items.find((item) => item.id === selectedId);
    if (inList) return inList;
    if (detail?.id === selectedId) return detail;
    return detailCache.get(selectedId)?.item ?? null;
  }, [items, detail, detailCache, selectedId]);
  const selectedRelated =
    detail?.id === selectedId
      ? related
      : selectedId
        ? (detailCache.get(selectedId)?.related ?? [])
        : [];
  const activeCluster = useMemo(
    () => snapshot.geo.find((cluster) => cluster.countryCode === filters.country) ?? null,
    [snapshot.geo, filters.country],
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<IntelCategory, number>();
    for (const entry of snapshot.facets.categories) counts.set(entry.id, entry.count);
    return counts;
  }, [snapshot.facets.categories]);

  const locatedCount = useMemo(
    () => snapshot.facets.countries.reduce((total, country) => total + country.count, 0),
    [snapshot.facets.countries],
  );

  const activeSources = snapshot.meta.sources.filter((source) => source.status === "ok").length;
  const yearValue =
    filters.from && filters.to && filters.from.slice(0, 4) === filters.to.slice(0, 4)
      ? filters.from.slice(0, 4)
      : "";
  const monthValue =
    yearValue && filters.from.slice(5, 7) === filters.to.slice(5, 7) ? filters.from.slice(5, 7) : "";
  const dateRangeInverted = isDateRangeInverted(filters);
  const hasFilters = hasNarrowingFilters(filters);
  const archiveEmpty = snapshot.meta.archive.count === 0 && snapshot.total === 0;

  const quickRanges = [
    { label: "24h", days: 1 },
    { label: "7d", days: 7 },
    { label: "30d", days: 30 },
    { label: "90d", days: 90 },
  ];
  const activeQuickRange =
    !filters.from && !filters.to
      ? "All"
      : !filters.to
        ? (quickRanges.find(
            (range) => filters.from === dayBefore(snapshot.meta.generatedAt, range.days),
          )?.label ?? null)
        : null;

  const yearOptions = snapshot.facets.years;
  const selectedSourceName =
    snapshot.meta.sources.find((source) => source.id === filters.source)?.name ?? filters.source;
  const selectedCountryName =
    snapshot.facets.countries.find((country) => country.code === filters.country)?.name ??
    filters.country;

  const applyYear = (year: string) => {
    setSelectedId(null);
    if (!year) {
      setFilters((current) => ({ ...current, from: "", to: "" }));
      return;
    }
    setFilters((current) => ({ ...current, from: `${year}-01-01`, to: `${year}-12-31` }));
  };

  const applyMonth = (month: string) => {
    setSelectedId(null);
    if (!yearValue) return;
    if (!month) {
      setFilters((current) => ({ ...current, from: `${yearValue}-01-01`, to: `${yearValue}-12-31` }));
      return;
    }
    const lastDay = new Date(Date.UTC(Number(yearValue), Number(month), 0)).getUTCDate();
    setFilters((current) => ({
      ...current,
      from: `${yearValue}-${month}-01`,
      to: `${yearValue}-${month}-${String(lastDay).padStart(2, "0")}`,
    }));
  };

  return (
    <main className="min-h-screen pb-20 pt-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="pb-5 pt-8">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
            <IconGlobe size={13} />
            cyber-intel
            <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] tracking-normal text-[var(--color-foreground-tertiary)]">
              cached sources · refreshed at most every 15–60 min
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-light tracking-tight text-[var(--color-foreground)] sm:text-3xl">
            Cyber intelligence, mapped only where it is verified
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--color-foreground-secondary)]">
            Government advisories, vulnerability catalogues, ransomware leak-site claims and security reporting,
            collected server-side and kept in an append-only archive. Country markers appear only when a source
            states a country; everything else stays in the feed with no coordinates.
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Archived reports", value: String(snapshot.meta.archive.count) },
              { label: "Located reports", value: String(locatedCount) },
              { label: "Sources responding", value: `${activeSources}/${snapshot.meta.sources.length}` },
              {
                label: "Coverage",
                value:
                  snapshot.meta.coverage.oldest && snapshot.meta.coverage.newest
                    ? `${formatDate(snapshot.meta.coverage.oldest)} → ${formatDate(snapshot.meta.coverage.newest)}`
                    : "no dated records yet",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius-glass-sm)] border border-[var(--color-border)] bg-white/[0.02] px-3 py-2"
              >
                <dt className="text-[10px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 text-sm text-[var(--color-foreground)]">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {/* Filters */}
        <section className="glass-card p-3 sm:p-4" aria-label="Filters">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <IconSearch
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-tertiary)]"
                />
                <label htmlFor="intel-search" className="sr-only">
                  Search the archive
                </label>
                <input
                  id="intel-search"
                  type="search"
                  value={filters.q}
                  onChange={(event) => update({ q: event.target.value })}
                  placeholder="Search headlines, summaries, publishers, CVE ids…"
                  maxLength={120}
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="intel-search-hint"
                  className="h-10 w-full rounded-md border border-[var(--color-border)] bg-black/20 pl-9 pr-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-tertiary)] focus:border-[var(--color-accent-border)] focus:outline-none"
                />
                <span id="intel-search-hint" className="sr-only">
                  Searches headlines, summaries, publishers, countries and vulnerability identifiers in the stored
                  archive. Results update after a short pause.
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <label htmlFor="intel-source" className="sr-only">
                    Filter by publisher
                  </label>
                  <select
                    id="intel-source"
                    value={filters.source}
                    onChange={(event) => update({ source: event.target.value })}
                    title="Publisher or feed that supplied the record"
                    className="h-10 w-full appearance-none rounded-md border border-[var(--color-border)] bg-black/20 pl-3 pr-8 text-xs text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none sm:w-48"
                  >
                    <option value="">All publishers</option>
                    {snapshot.facets.sources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name} ({source.count})
                      </option>
                    ))}
                    {filters.source && !snapshot.facets.sources.some((source) => source.id === filters.source) && (
                      <option value={filters.source}>{selectedSourceName} (0)</option>
                    )}
                  </select>
                  <IconChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-foreground-tertiary)]"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="intel-country" className="sr-only">
                    Filter by reported victim country
                  </label>
                  <select
                    id="intel-country"
                    value={filters.country}
                    onChange={(event) => setCountry(event.target.value || null)}
                    title="Only countries reported in a structured field are listed. Regions are not inferred."
                    className="h-10 w-full appearance-none rounded-md border border-[var(--color-border)] bg-black/20 pl-3 pr-8 text-xs text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none sm:w-44"
                  >
                    <option value="">All countries</option>
                    {snapshot.facets.countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.count})
                      </option>
                    ))}
                    {filters.country &&
                      !snapshot.facets.countries.some((country) => country.code === filters.country) && (
                        <option value={filters.country}>{selectedCountryName} (0)</option>
                      )}
                  </select>
                  <IconChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-foreground-tertiary)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by category">
              <span className="mr-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
                <IconFilter size={11} />
                Category
              </span>
              {CATEGORY_ORDER.map((category) => {
                const count = categoryCounts.get(category) ?? 0;
                const selected = filters.categories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    aria-pressed={selected}
                    disabled={count === 0 && !selected}
                    title={categoryMeta(category).description}
                    className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
                      selected
                        ? "border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : "border-[var(--color-border)] text-[var(--color-foreground-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    {categoryMeta(category).label}
                    <span className="ml-1 font-mono text-[10px] opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--color-border)] pt-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <IconCalendar size={12} className="text-[var(--color-foreground-tertiary)]" />
                <label htmlFor="intel-from" className="text-[10px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
                  From
                </label>
                <input
                  id="intel-from"
                  type="date"
                  value={formatDay(filters.from)}
                  aria-invalid={dateRangeInverted || undefined}
                  onChange={(event) => update({ from: event.target.value })}
                  className="h-8 rounded border border-[var(--color-border)] bg-black/20 px-2 text-[11px] text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none"
                />
                <label htmlFor="intel-to" className="text-[10px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
                  To
                </label>
                <input
                  id="intel-to"
                  type="date"
                  value={formatDay(filters.to)}
                  aria-invalid={dateRangeInverted || undefined}
                  onChange={(event) => update({ to: event.target.value })}
                  className="h-8 rounded border border-[var(--color-border)] bg-black/20 px-2 text-[11px] text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1" role="group" aria-label="Quick date ranges">
                {quickRanges.map((range) => {
                  const active = activeQuickRange === range.label;
                  return (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => applyRange(range.days)}
                      aria-pressed={active}
                      className={`rounded border px-2 py-1 text-[10px] transition-colors ${
                        active
                          ? "border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                          : "border-[var(--color-border)] text-[var(--color-foreground-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-foreground)]"
                      }`}
                    >
                      {range.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => applyRange(null)}
                  aria-pressed={activeQuickRange === "All"}
                  className={`rounded border px-2 py-1 text-[10px] transition-colors ${
                    activeQuickRange === "All"
                      ? "border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      : "border-[var(--color-border)] text-[var(--color-foreground-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  All
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <label htmlFor="intel-year" className="text-[10px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
                  Year
                </label>
                <select
                  id="intel-year"
                  value={yearValue}
                  onChange={(event) => applyYear(event.target.value)}
                  className="h-8 rounded border border-[var(--color-border)] bg-black/20 px-2 text-[11px] text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none"
                >
                  <option value="">All years</option>
                  {yearOptions.map((year) => (
                    <option key={year.year} value={String(year.year)}>
                      {year.year} ({year.count})
                    </option>
                  ))}
                  {yearValue && !yearOptions.some((year) => String(year.year) === yearValue) && (
                    <option value={yearValue}>{yearValue} (0)</option>
                  )}
                </select>
                <label htmlFor="intel-month" className="sr-only">
                  Filter by month
                </label>
                <select
                  id="intel-month"
                  value={monthValue}
                  disabled={!yearValue}
                  onChange={(event) => applyMonth(event.target.value)}
                  className="h-8 rounded border border-[var(--color-border)] bg-black/20 px-2 text-[11px] text-[var(--color-foreground-secondary)] disabled:opacity-40 focus:border-[var(--color-accent-border)] focus:outline-none"
                >
                  <option value="">All months</option>
                  {MONTHS.map((label, index) => {
                    const month = String(index + 1).padStart(2, "0");
                    return (
                      <option key={month} value={month}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center gap-1" role="group" aria-label="Filter by location">
                {[
                  { label: "Any location", value: "" as const },
                  { label: "Located", value: "yes" as const },
                  { label: "Unlocated", value: "no" as const },
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => update({ located: option.value })}
                    aria-pressed={filters.located === option.value}
                    className={`rounded border px-2 py-1 text-[10px] transition-colors ${
                      filters.located === option.value
                        ? "border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : "border-[var(--color-border)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <label htmlFor="intel-sort" className="sr-only">
                  Sort order
                </label>
                <select
                  id="intel-sort"
                  value={filters.sort}
                  onChange={(event) => update({ sort: event.target.value === "oldest" ? "oldest" : "newest" })}
                  className="h-8 rounded border border-[var(--color-border)] bg-black/20 px-2 text-[11px] text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    cache.current.delete(queryString);
                    setRefreshToken((token) => token + 1);
                  }}
                  className="inline-flex h-8 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-[11px] text-[var(--color-foreground-secondary)] transition-colors hover:text-[var(--color-foreground)]"
                >
                  <IconRefresh
                    size={12}
                    className={status === "loading" ? "animate-spin motion-reduce:animate-none" : undefined}
                  />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-8 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-[11px] text-[var(--color-foreground-secondary)] transition-colors hover:text-[var(--color-foreground)]"
                >
                  <IconX size={12} />
                  Reset
                </button>
              </div>
            </div>

            {dateRangeInverted && (
              <p role="status" className="text-[11px] text-amber-300/90">
                The start date is after the end date, so no archived record can match. Adjust either date.
              </p>
            )}
            <p className="text-[10px] leading-relaxed text-[var(--color-foreground-tertiary)]">
              Dates filter on the date shown for each record: publication, advisory or catalogue date as reported by
              the source. Incident dates are shown separately and are never used as a fallback.
            </p>
          </div>
        </section>

        {status === "loading" && (
          <div className="mt-2 h-0.5 overflow-hidden rounded bg-white/[0.04]" aria-hidden="true">
            <div className="h-full w-full animate-pulse rounded bg-[var(--color-accent)] motion-reduce:animate-none" />
          </div>
        )}

        {snapshot.meta.freshness.stale && (
          <div
            role="status"
            className="mt-3 flex flex-wrap items-center gap-2 rounded-[var(--radius-glass-sm)] border border-amber-500/30 bg-amber-500/[0.07] px-3 py-2 text-xs text-amber-200"
          >
            <IconClock size={13} className="shrink-0" />
            <span>
              No source has refreshed successfully in the last {snapshot.meta.freshness.staleAfterHours} hours.
              Showing the records already stored; the newest items may be missing.
              {snapshot.meta.freshness.lastSuccessAt
                ? ` Last successful refresh: ${formatDate(snapshot.meta.freshness.lastSuccessAt, true)}.`
                : ""}
            </span>
          </div>
        )}

        {status === "error" && (
          <div
            role="alert"
            className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-glass-sm)] border border-rose-500/30 bg-rose-500/[0.07] px-3 py-2 text-xs text-rose-200"
          >
            <span className="inline-flex items-center gap-1.5">
              <IconAlertTriangle size={13} />
              {errorMessage || "The feed could not be refreshed."}{" "}
              {items.length > 0
                ? "Previously loaded results are still shown."
                : "The archive could not be reached. Try again."}
            </span>
            <button
              type="button"
              onClick={() => setRefreshToken((token) => token + 1)}
              className="rounded border border-rose-400/40 px-2 py-1 text-[11px] hover:bg-rose-500/10"
            >
              Try again
            </button>
          </div>
        )}

        {/* Globe + drawer */}
        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="glass-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-2.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--color-foreground-secondary)]">
                <IconGlobe size={13} className="text-[var(--color-accent)]" />
                Country map
              </span>
              <span className="font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
                {snapshot.geo.length} countries · {locatedCount} located reports
              </span>
            </div>
            <div className="h-[320px] sm:h-[420px] lg:h-[480px]">
              <IntelGlobe
                clusters={snapshot.geo}
                selectedCountry={filters.country || null}
                onSelectCountry={setCountry}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--color-border)] px-4 py-2">
              {CATEGORY_ORDER.filter((category) => category !== "general").map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 text-[10px] text-[var(--color-foreground-tertiary)]"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: categoryMeta(category).color }}
                  />
                  {categoryMeta(category).label}
                </span>
              ))}
            </div>
          </div>

          <aside
            id="intel-detail"
            ref={panelRef}
            tabIndex={-1}
            aria-label="Selected report or country"
            aria-busy={Boolean(selectedId && !selectedItem && detailStatus !== "error")}
            className="glass-card flex min-h-[320px] flex-col outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] lg:max-h-[600px]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-foreground-secondary)]">
                {selectedId ? "Report" : activeCluster ? "Country" : "Reference"}
              </span>
              {selectedId && (
                <button
                  type="button"
                  onClick={closeDetail}
                  aria-label="Close report details"
                  className="inline-flex items-center gap-1 text-[10px] text-[var(--color-foreground-tertiary)] transition-colors hover:text-[var(--color-foreground)]"
                >
                  <IconX size={12} />
                  Close
                </button>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {selectedId ? (
                selectedItem ? (
                  <ArticleDetail
                    item={selectedItem}
                    related={selectedRelated}
                    onClose={closeDetail}
                    onSelectRelated={openDetail}
                  />
                ) : detailStatus === "error" ? (
                  <div className="p-4" role="alert">
                    <p className="text-sm text-[var(--color-foreground-secondary)]">
                      This report could not be opened.
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-foreground-tertiary)]">
                      {detailError}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          detailCache.delete(selectedId);
                          setDetailStatus("idle");
                          setDetailError("");
                          setDetailRetryToken((token) => token + 1);
                        }}
                        className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]"
                      >
                        Try again
                      </button>
                      <button
                        type="button"
                        onClick={closeDetail}
                        className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <DetailSkeleton />
                )
              ) : activeCluster ? (
                <CountryDetail
                  cluster={activeCluster}
                  items={items}
                  onSelectItem={openDetail}
                  onClear={() => setCountry(null)}
                />
              ) : (
                <MethodPanel />
              )}
            </div>
          </aside>
        </section>

        {/* Feed */}
        <section className="glass-card mt-4 overflow-hidden" aria-label="News feed" aria-busy={status === "loading"}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <IconDatabase size={13} className="text-[var(--color-accent)]" />
              <h2 className="text-[11px] uppercase tracking-wider text-[var(--color-foreground-secondary)]">
                Feed
              </h2>
              <span className="font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
                {snapshot.total} match{snapshot.total === 1 ? "" : "es"} · {items.length} shown
              </span>
            </div>
            <span className="font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
              {status === "loading" ? "updating… · " : ""}
              {snapshot.meta.lastIngestAt
                ? `last source refresh ${formatDate(snapshot.meta.lastIngestAt, true)}`
                : "no source refresh yet"}
            </span>
          </div>

          <div aria-live="polite" className="sr-only">
            {status === "loading"
              ? "Loading intelligence feed"
              : status === "error"
                ? "The archive request failed"
                : `${snapshot.total} results match the current filters`}
          </div>

          {status === "loading" && items.length === 0 ? (
            <FeedSkeleton />
          ) : status === "error" && items.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-[var(--color-foreground-secondary)]">
                The archive could not be reached.
              </p>
              <p className="mx-auto mt-1 max-w-md text-xs text-[var(--color-foreground-tertiary)]">
                {errorMessage || "The request failed."} No cached results are available for this view.
              </p>
              <button
                type="button"
                onClick={() => setRefreshToken((token) => token + 1)}
                className="mt-3 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-[var(--color-foreground-secondary)]">
                {archiveEmpty
                  ? "The archive has no records yet."
                  : hasFilters
                    ? "No archived reports match these filters."
                    : "No records are available for this view."}
              </p>
              <p className="mx-auto mt-1 max-w-md text-xs text-[var(--color-foreground-tertiary)]">
                {archiveEmpty
                  ? "Ingestion runs on a schedule; this page never contacts publishers directly. Check the source list below for the first refresh."
                  : "History only contains what this site has ingested so far. Widen the date range, clear the search, or reset the filters."}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]"
                >
                  Reset filters
                </button>
              )}
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <FeedItem
                  key={item.id}
                  item={item}
                  selected={item.id === selectedId}
                  onSelect={() => openDetail(item.id)}
                />
              ))}
            </div>
          )}

          {snapshot.hasMore && items.length > 0 && (
            <div className="border-t border-[var(--color-border)] px-4 py-3 text-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded-md border border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-foreground-secondary)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-foreground)] disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : `Load ${Math.min(PAGE_SIZE, snapshot.total - items.length)} more`}
              </button>
            </div>
          )}
        </section>

        {/* Sources + method */}
        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="glass-card p-4">
            <h2 className="text-[11px] uppercase tracking-wider text-[var(--color-foreground-secondary)]">
              Sources
            </h2>
            <ul className="mt-3 space-y-2">
              {snapshot.meta.sources.map((source) => (
                <li key={source.id} className="rounded-md border border-[var(--color-border)] p-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <SourceStatusBadge status={source.status} />
                    <span className="text-xs text-[var(--color-foreground)]">{source.name}</span>
                    <span className="ml-auto font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
                      {source.itemCount} items
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-[var(--color-foreground-tertiary)]">
                    {source.kind === "government"
                      ? "Official advisory source."
                      : source.kind === "aggregator"
                        ? "Aggregates leak-site claims; records are unverified assertions."
                        : "Publisher feed, excerpted with attribution and a link."}
                    {source.error ? ` Last error: ${source.error}.` : ""}
                    {source.status === "skipped" ? " Not ingested in this deployment." : ""}
                  </p>
                  {source.status !== "skipped" && (
                    <p className="mt-1 font-mono text-[10px] leading-relaxed text-[var(--color-foreground-tertiary)]">
                      {source.lastSuccessAt
                        ? `last success ${formatDate(source.lastSuccessAt, true)}`
                        : "no successful refresh yet"}
                      {(source.consecutiveFailures ?? 0) > 0
                        ? ` · ${source.consecutiveFailures} consecutive failure${source.consecutiveFailures === 1 ? "" : "s"}`
                        : ""}
                      {source.nextAttemptAt
                        ? ` · next attempt ${formatDate(source.nextAttemptAt, true)}`
                        : ""}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-4">
            <h2 className="text-[11px] uppercase tracking-wider text-[var(--color-foreground-secondary)]">
              Method &amp; limitations
            </h2>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-[var(--color-foreground-secondary)]">
              {snapshot.meta.notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <IconInfoCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-foreground-tertiary)]" />
                  <span>{note}</span>
                </li>
              ))}
              <li className="flex gap-2">
                <IconInfoCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-foreground-tertiary)]" />
                <span>
                  Archive: {snapshot.meta.archive.count} records in{" "}
                  {snapshot.meta.archive.storage.driver}
                  {snapshot.meta.archive.storage.durable
                    ? " (durable across redeploys)"
                    : " (not durable across redeploys)"}
                  {snapshot.meta.archive.storage.location ? (
                    <>
                      {" "}
                      at{" "}
                      <code className="rounded bg-white/[0.04] px-1 py-0.5 text-[10px]">
                        {snapshot.meta.archive.storage.location}
                      </code>
                    </>
                  ) : null}
                  .
                </span>
              </li>
              {snapshot.meta.lastRun ? (
                <li className="flex gap-2">
                  <IconInfoCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-foreground-tertiary)]" />
                  <span>
                    Last ingestion run: {snapshot.meta.lastRun.status}
                    {snapshot.meta.lastRun.finishedAt
                      ? ` at ${formatDate(snapshot.meta.lastRun.finishedAt, true)}`
                      : ""}
                    {" · "}
                    {snapshot.meta.lastRun.sourcesOk}/{snapshot.meta.lastRun.sourcesAttempted} sources ok
                    {" · "}
                    {snapshot.meta.lastRun.itemsNew} new, {snapshot.meta.lastRun.itemsUpdated} updated
                    {snapshot.meta.lastRun.note ? `. ${snapshot.meta.lastRun.note}` : "."}
                  </span>
                </li>
              ) : null}
              <li className="flex gap-2">
                <IconInfoCircle size={12} className="mt-0.5 shrink-0 text-[var(--color-foreground-tertiary)]" />
                <span>
                  This is a news and advisory index, not live telemetry. Nothing here is a real-time attack feed,
                  and no source is queried while you browse.
                </span>
              </li>
            </ul>
            <p className="mt-3 border-t border-[var(--color-border)] pt-3 text-[10px] leading-relaxed text-[var(--color-foreground-tertiary)]">
              Headlines and short excerpts are shown with attribution and a link to the original. Full articles are
              never stored. CVE records link to NVD; government advisories link to the issuing agency.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
