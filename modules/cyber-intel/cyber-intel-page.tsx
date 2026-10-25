"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  IconAlertTriangle,
  IconArrowUpRight,
  IconCalendar,
  IconChevronDown,
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
  type IntelItem,
  type IntelSnapshot,
  type SourceHealth,
} from "@/lib/cyber-intel/types";

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

const PUBLISHED_NOTE: Partial<Record<IntelItem["publishedAtKind"], string>> = {
  catalog: "This is the date the catalogue added the entry, not the vulnerability's disclosure date.",
  aggregator:
    "This is when the aggregator recorded the claim. The claimed attack date is shown separately where the source provides one.",
};

interface Filters {
  q: string;
  categories: IntelCategory[];
  source: string;
  country: string;
  from: string;
  to: string;
  located: "" | "yes" | "no";
  sort: "newest" | "oldest";
}

const INITIAL_FILTERS: Filters = {
  q: "",
  categories: [],
  source: "",
  country: "",
  from: "",
  to: "",
  located: "",
  sort: "newest",
};

function toQueryString(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.source) params.set("source", filters.source);
  if (filters.country) params.set("country", filters.country);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.located) params.set("located", filters.located);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  params.set("pageSize", String(PAGE_SIZE));
  return params.toString();
}

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

function ArticleDetail({ item, onClose }: { item: IntelItem; onClose: () => void }) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-3">
        <CategoryBadge category={item.category} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close report details"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--color-foreground-tertiary)] transition-colors hover:bg-white/5 hover:text-[var(--color-foreground)]"
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
          <span className="text-[var(--color-foreground)]">Dates are separate.</span> Publication, incident and
          advisory dates are shown only when the source states them, all in UTC.
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
          title={PUBLISHED_LABEL[item.publishedAtKind]}
          className="font-mono text-[11px] text-[var(--color-foreground-tertiary)]"
        >
          {formatDate(item.publishedAt)}
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
        {item.incidentAt && item.incidentAt !== item.publishedAt && (
          <span className="font-mono text-[10px] text-[var(--color-foreground-tertiary)]">
            incident {formatDate(item.incidentAt)}
          </span>
        )}
      </div>

      <button type="button" onClick={onSelect} className="mt-1.5 block w-full text-left">
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
          className="text-[11px] text-[var(--color-foreground-tertiary)] transition-colors hover:text-[var(--color-accent)]"
        >
          Details
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
        <div key={index} className="animate-pulse px-4 py-4">
          <div className="h-2.5 w-40 rounded bg-white/[0.06]" />
          <div className="mt-3 h-3 w-4/5 rounded bg-white/[0.07]" />
          <div className="mt-2 h-2.5 w-full rounded bg-white/[0.05]" />
          <div className="mt-1.5 h-2.5 w-2/3 rounded bg-white/[0.05]" />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function CyberIntelPage({ initial }: { initial: IntelSnapshot }) {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [snapshot, setSnapshot] = useState<IntelSnapshot>(initial);
  const [items, setItems] = useState<IntelItem[]>(initial.items);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const queryString = useMemo(() => toQueryString(filters), [filters]);
  const cache = useRef(new Map<string, { at: number; snapshot: IntelSnapshot }>());
  const requestId = useRef(0);
  const skipInitial = useRef(initial.items.length > 0);

  useEffect(() => {
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }

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
    setFilters(INITIAL_FILTERS);
    setSelectedId(null);
  }, []);

  const applyRange = useCallback((days: number | null) => {
    if (days === null) {
      setFilters((current) => ({ ...current, from: "", to: "" }));
      return;
    }
    const from = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
    setFilters((current) => ({ ...current, from, to: "" }));
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !snapshot.hasMore) return;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams(queryString);
      params.set("page", String(page + 1));
      const response = await fetch(`/api/cyber-intel?${params.toString()}`);
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const next = (await response.json()) as IntelSnapshot;
      setItems((current) => {
        const seen = new Set(current.map((item) => item.id));
        return [...current, ...next.items.filter((item) => !seen.has(item.id))];
      });
      setSnapshot((current) => ({ ...next, items: current.items }));
      setPage((current) => current + 1);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Request failed");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, snapshot.hasMore, queryString, page]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );
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

  const applyYear = (year: string) => {
    if (!year) {
      setFilters((current) => ({ ...current, from: "", to: "" }));
      return;
    }
    setFilters((current) => ({ ...current, from: `${year}-01-01`, to: `${year}-12-31` }));
  };

  const applyMonth = (month: string) => {
    if (!yearValue || !month) {
      applyYear(yearValue || "");
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
                  placeholder="Search headlines, identifiers, countries, CVE ids…"
                  className="h-10 w-full rounded-md border border-[var(--color-border)] bg-black/20 pl-9 pr-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-tertiary)] focus:border-[var(--color-accent-border)] focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <label htmlFor="intel-source" className="sr-only">
                    Filter by source
                  </label>
                  <select
                    id="intel-source"
                    value={filters.source}
                    onChange={(event) => update({ source: event.target.value })}
                    className="h-10 w-full appearance-none rounded-md border border-[var(--color-border)] bg-black/20 pl-3 pr-8 text-xs text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none sm:w-48"
                  >
                    <option value="">All sources</option>
                    {snapshot.facets.sources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name} ({source.count})
                      </option>
                    ))}
                  </select>
                  <IconChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-foreground-tertiary)]"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="intel-country" className="sr-only">
                    Filter by country
                  </label>
                  <select
                    id="intel-country"
                    value={filters.country}
                    onChange={(event) => setCountry(event.target.value || null)}
                    className="h-10 w-full appearance-none rounded-md border border-[var(--color-border)] bg-black/20 pl-3 pr-8 text-xs text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none sm:w-44"
                  >
                    <option value="">All countries</option>
                    {snapshot.facets.countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.count})
                      </option>
                    ))}
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
              <div className="flex items-center gap-1.5">
                <IconCalendar size={12} className="text-[var(--color-foreground-tertiary)]" />
                <label htmlFor="intel-from" className="text-[10px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
                  From
                </label>
                <input
                  id="intel-from"
                  type="date"
                  value={formatDay(filters.from)}
                  onChange={(event) => update({ from: event.target.value, to: filters.to })}
                  className="h-8 rounded border border-[var(--color-border)] bg-black/20 px-2 text-[11px] text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none"
                />
                <label htmlFor="intel-to" className="text-[10px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
                  To
                </label>
                <input
                  id="intel-to"
                  type="date"
                  value={formatDay(filters.to)}
                  onChange={(event) => update({ to: event.target.value })}
                  className="h-8 rounded border border-[var(--color-border)] bg-black/20 px-2 text-[11px] text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1" role="group" aria-label="Quick date ranges">
                {[
                  { label: "24h", days: 1 },
                  { label: "7d", days: 7 },
                  { label: "30d", days: 30 },
                  { label: "90d", days: 90 },
                  { label: "All", days: null },
                ].map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => applyRange(range.days)}
                    className="rounded border border-[var(--color-border)] px-2 py-1 text-[10px] text-[var(--color-foreground-secondary)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-foreground)]"
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <label htmlFor="intel-year" className="text-[10px] uppercase tracking-wide text-[var(--color-foreground-tertiary)]">
                  Archive
                </label>
                <select
                  id="intel-year"
                  value={yearValue}
                  onChange={(event) => applyYear(event.target.value)}
                  className="h-8 rounded border border-[var(--color-border)] bg-black/20 px-2 text-[11px] text-[var(--color-foreground-secondary)] focus:border-[var(--color-accent-border)] focus:outline-none"
                >
                  <option value="">All years</option>
                  {snapshot.facets.years.map((year) => (
                    <option key={year.year} value={String(year.year)}>
                      {year.year} ({year.count})
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filter by month"
                  value={monthValue}
                  disabled={!yearValue}
                  onChange={(event) => applyMonth(event.target.value)}
                  className="h-8 rounded border border-[var(--color-border)] bg-black/20 px-2 text-[11px] text-[var(--color-foreground-secondary)] disabled:opacity-40 focus:border-[var(--color-accent-border)] focus:outline-none"
                >
                  <option value="">All months</option>
                  {Array.from({ length: 12 }).map((_, index) => {
                    const month = String(index + 1).padStart(2, "0");
                    return (
                      <option key={month} value={month}>
                        {DATE_FORMAT.format(new Date(Date.UTC(2026, index, 1))).slice(3, 6)}
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
                  <IconRefresh size={12} className={status === "loading" ? "animate-spin" : undefined} />
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
          </div>
        </section>

        {status === "error" && (
          <div
            role="alert"
            className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-glass-sm)] border border-rose-500/30 bg-rose-500/[0.07] px-3 py-2 text-xs text-rose-200"
          >
            <span className="inline-flex items-center gap-1.5">
              <IconAlertTriangle size={13} />
              {errorMessage || "The feed could not be refreshed."} Previously loaded results are still shown.
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
            className="glass-card flex min-h-[320px] flex-col lg:max-h-[600px]"
            aria-label="Selected report or country"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-foreground-secondary)]">
                {selectedItem ? "Report" : activeCluster ? "Country" : "Reference"}
              </span>
              {selectedItem && (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="text-[10px] text-[var(--color-foreground-tertiary)] hover:text-[var(--color-foreground)]"
                >
                  back
                </button>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {selectedItem ? (
                <ArticleDetail item={selectedItem} onClose={() => setSelectedId(null)} />
              ) : activeCluster ? (
                <CountryDetail
                  cluster={activeCluster}
                  items={items}
                  onSelectItem={setSelectedId}
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
              {snapshot.meta.lastIngestAt
                ? `last source refresh ${formatDate(snapshot.meta.lastIngestAt, true)}`
                : "no source refresh yet"}
            </span>
          </div>

          <div aria-live="polite" className="sr-only">
            {status === "loading"
              ? "Loading intelligence feed"
              : `${snapshot.total} results match the current filters`}
          </div>

          {status === "loading" && items.length === 0 ? (
            <FeedSkeleton />
          ) : items.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-[var(--color-foreground-secondary)]">
                No archived reports match these filters.
              </p>
              <p className="mx-auto mt-1 max-w-md text-xs text-[var(--color-foreground-tertiary)]">
                History only contains what this site has ingested so far. Widen the date range, clear the search,
                or reset the filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <FeedItem
                  key={item.id}
                  item={item}
                  selected={item.id === selectedId}
                  onSelect={() => setSelectedId(item.id)}
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
                  Archive: {snapshot.meta.archive.count} records,{" "}
                  {snapshot.meta.archive.persistent ? "persisted to disk" : "memory only"} at{" "}
                  <code className="rounded bg-white/[0.04] px-1 py-0.5 text-[10px]">
                    {snapshot.meta.archive.path ?? "unavailable"}
                  </code>
                  .
                </span>
              </li>
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
