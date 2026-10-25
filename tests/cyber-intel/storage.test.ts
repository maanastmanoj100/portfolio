import assert from "node:assert/strict";
import test from "node:test";
import { geoFromCountry } from "../../lib/cyber-intel/normalize";
import type { IngestRun, IntelItem, SourceState } from "../../lib/cyber-intel/types";
import type {
  IntelFilter,
  IntelRepository,
} from "../../lib/cyber-intel/storage/repository";
import {
  createPgliteRepository,
  createSqliteRepository,
  makeItem,
} from "./helpers/drivers";

/**
 * Storage contract tests.
 *
 * Every case runs against both drivers: SQLite (the local development store)
 * and PGlite (a real Postgres engine in WASM, so the production statements are
 * executed by Postgres rather than only parsed).
 */

const drivers: [string, () => Promise<IntelRepository>][] = [
  ["sqlite", createSqliteRepository],
  ["pglite", createPgliteRepository],
];

const india = geoFromCountry("IN", "ransomware.live");
const usa = geoFromCountry("US", "ransomware.live");
if (!india || !usa) throw new Error("country reference data missing");

function fixture(): IntelItem[] {
  return [
    makeItem({
      id: "ci-00000000000000000000000a",
      title: "Ransomware gang hits hospital",
      summary: "A hospital group was disrupted by a ransomware operation.",
      url: "https://news.example.com/hospital",
      sourceId: "thehackernews",
      sourceName: "The Hacker News",
      sourceKind: "publisher",
      externalId: "story-a",
      category: "ransomware",
      categoryBasis: "source",
      publishedAt: "2026-10-10T09:00:00.000Z",
      publishedAtKind: "aggregator",
      geo: india,
      identifiers: ["CVE-2026-1111"],
      tags: ["healthcare"],
      firstSeenAt: "2026-10-10T10:00:00.000Z",
      lastSeenAt: "2026-10-10T10:00:00.000Z",
    }),
    makeItem({
      id: "ci-00000000000000000000000b",
      title: "Critical vulnerability patched in a widely used library",
      summary: "The maintainers released a patch for a remote code execution flaw.",
      url: "https://other.example.com/library-patch",
      sourceId: "bleepingcomputer",
      sourceName: "BleepingComputer",
      sourceKind: "publisher",
      externalId: "story-b",
      category: "vulnerability",
      categoryBasis: "keyword",
      publishedAt: "2026-10-12T09:00:00.000Z",
      geo: null,
      identifiers: ["CVE-2026-1111"],
      tags: ["patch"],
      firstSeenAt: "2026-10-12T10:00:00.000Z",
      lastSeenAt: "2026-10-12T10:00:00.000Z",
    }),
    makeItem({
      id: "ci-00000000000000000000000c",
      title: "Advisory on phishing infrastructure",
      summary: "An advisory describing a phishing campaign.",
      url: "https://advisory.example.com/phishing",
      sourceId: "thehackernews",
      sourceName: "The Hacker News",
      sourceKind: "publisher",
      externalId: "story-c",
      category: "advisory",
      categoryBasis: "keyword",
      publishedAt: "2026-09-01T09:00:00.000Z",
      publishedAtKind: "advisory",
      geo: usa,
      identifiers: [],
      tags: [],
      firstSeenAt: "2026-09-01T10:00:00.000Z",
      lastSeenAt: "2026-09-01T10:00:00.000Z",
    }),
    makeItem({
      id: "ci-00000000000000000000000d",
      title: "Indian CERT advisory on router flaws",
      summary: "CERT-In published an advisory about router vulnerabilities.",
      url: "https://cert.example.com/router",
      sourceId: "krebs",
      sourceName: "Krebs on Security",
      sourceKind: "publisher",
      externalId: "story-d",
      category: "india",
      categoryBasis: "source",
      publishedAt: "2025-12-31T09:00:00.000Z",
      publishedAtKind: "advisory",
      geo: india,
      identifiers: [],
      tags: [],
      firstSeenAt: "2025-12-31T10:00:00.000Z",
      lastSeenAt: "2025-12-31T10:00:00.000Z",
    }),
  ];
}

function filter(overrides: Partial<IntelFilter> = {}): IntelFilter {
  return {
    q: "",
    categories: [],
    sources: [],
    from: null,
    to: null,
    located: null,
    country: null,
    sort: "newest",
    page: 1,
    pageSize: 20,
    ...overrides,
  };
}

function ids(items: IntelItem[]): string[] {
  return items.map((item) => item.id.slice(-1));
}

function state(overrides: Partial<SourceState> = {}): SourceState {
  return {
    id: "thehackernews",
    status: "ok",
    itemCount: 10,
    fetchedAt: "2026-10-20T10:00:00.000Z",
    lastSuccessAt: "2026-10-20T10:00:00.000Z",
    error: null,
    consecutiveFailures: 0,
    nextAttemptAt: "2026-10-20T11:00:00.000Z",
    durationMs: 1200,
    etag: "\"abc\"",
    lastModified: "Mon, 20 Oct 2026 09:59:00 GMT",
    ...overrides,
  };
}

function run(overrides: Partial<IngestRun> = {}): IngestRun {
  return {
    id: "run-1",
    trigger: "cron",
    startedAt: "2026-10-20T10:00:00.000Z",
    finishedAt: null,
    status: "running",
    sourcesAttempted: 0,
    sourcesOk: 0,
    sourcesFailed: 0,
    itemsFetched: 0,
    itemsNew: 0,
    itemsUpdated: 0,
    note: null,
    ...overrides,
  };
}

for (const [driverName, factory] of drivers) {
  test(`query: newest/oldest ordering and date windows (${driverName})`, async () => {
    const repository = await factory();
    try {
      const result = await repository.upsertItems(fixture());
      assert.deepEqual(result, { inserted: 4, updated: 0, unchanged: 0 });

      const newest = await repository.query(filter());
      assert.equal(newest.total, 4);
      assert.deepEqual(ids(newest.items), ["b", "a", "c", "d"]);

      const oldest = await repository.query(filter({ sort: "oldest" }));
      assert.deepEqual(ids(oldest.items), ["d", "c", "a", "b"]);

      const from = await repository.query(filter({ from: "2026-10-01T00:00:00.000Z" }));
      assert.deepEqual(ids(from.items), ["b", "a"]);

      const to = await repository.query(filter({ to: "2026-10-01T00:00:00.000Z" }));
      assert.deepEqual(ids(to.items), ["c", "d"]);
    } finally {
      await repository.close();
    }
  });

  test(`query: search, category, source, location and country filters (${driverName})`, async () => {
    const repository = await factory();
    try {
      await repository.upsertItems(fixture());

      const search = await repository.query(filter({ q: "hospital" }));
      assert.deepEqual(ids(search.items), ["a"]);

      const multiToken = await repository.query(filter({ q: "ransomware hospital" }));
      assert.deepEqual(ids(multiToken.items), ["a"]);

      const noMatch = await repository.query(filter({ q: "hospital library" }));
      assert.equal(noMatch.total, 0);

      const category = await repository.query(filter({ categories: ["ransomware"] }));
      assert.deepEqual(ids(category.items), ["a"]);

      const categories = await repository.query(
        filter({ categories: ["ransomware", "vulnerability"] }),
      );
      assert.deepEqual(ids(categories.items), ["b", "a"]);

      const source = await repository.query(filter({ sources: ["bleepingcomputer"] }));
      assert.deepEqual(ids(source.items), ["b"]);

      const located = await repository.query(filter({ located: "yes" }));
      assert.deepEqual(ids(located.items), ["a", "c", "d"]);

      const unlocated = await repository.query(filter({ located: "no" }));
      assert.deepEqual(ids(unlocated.items), ["b"]);

      const country = await repository.query(filter({ country: "IN" }));
      assert.deepEqual(ids(country.items), ["a", "d"]);
    } finally {
      await repository.close();
    }
  });

  test(`query: LIKE wildcards in the search term are treated literally (${driverName})`, async () => {
    const repository = await factory();
    try {
      await repository.upsertItems(fixture());

      const percent = await repository.query(filter({ q: "%" }));
      assert.equal(percent.total, 0);

      const underscore = await repository.query(filter({ q: "_" }));
      assert.equal(underscore.total, 0);
    } finally {
      await repository.close();
    }
  });

  test(`query: pagination reports the full total (${driverName})`, async () => {
    const repository = await factory();
    try {
      await repository.upsertItems(fixture());

      const first = await repository.query(filter({ pageSize: 2, page: 1 }));
      assert.deepEqual(ids(first.items), ["b", "a"]);
      assert.equal(first.total, 4);

      const second = await repository.query(filter({ pageSize: 2, page: 2 }));
      assert.deepEqual(ids(second.items), ["c", "d"]);
      assert.equal(second.total, 4);

      const beyond = await repository.query(filter({ pageSize: 2, page: 5 }));
      assert.deepEqual(beyond.items, []);
      assert.equal(beyond.total, 4);
    } finally {
      await repository.close();
    }
  });

  test(`facets: counts respect the date window but not the selected facets (${driverName})`, async () => {
    const repository = await factory();
    try {
      await repository.upsertItems(fixture());

      const all = await repository.facets(filter());
      assert.deepEqual(
        all.categories.map((entry) => [entry.id, entry.count]),
        [
          ["vulnerability", 1],
          ["ransomware", 1],
          ["advisory", 1],
          ["india", 1],
        ],
      );
      assert.deepEqual(
        all.sources.map((entry) => [entry.id, entry.count]),
        [
          ["thehackernews", 2],
          ["bleepingcomputer", 1],
          ["krebs", 1],
        ],
      );
      assert.deepEqual(
        all.countries.map((entry) => [entry.code, entry.count]),
        [
          ["IN", 2],
          ["US", 1],
        ],
      );
      assert.deepEqual(
        all.years.map((entry) => [entry.year, entry.count]),
        [
          [2026, 3],
          [2025, 1],
        ],
      );

      // Selecting a category must not collapse the category facet to itself.
      const narrowed = await repository.facets(
        filter({ categories: ["ransomware"], sources: ["krebs"] }),
      );
      assert.equal(narrowed.categories.length, 4);

      // A date window does narrow the facet counts.
      const windowed = await repository.facets(
        filter({ from: "2026-10-01T00:00:00.000Z" }),
      );
      assert.deepEqual(
        windowed.categories.map((entry) => [entry.id, entry.count]),
        [
          ["vulnerability", 1],
          ["ransomware", 1],
        ],
      );
      assert.deepEqual(
        windowed.years.map((entry) => [entry.year, entry.count]),
        [
          [2026, 3],
          [2025, 1],
        ],
      );
    } finally {
      await repository.close();
    }
  });

  test(`geo: clusters only located records and never invents coordinates (${driverName})`, async () => {
    const repository = await factory();
    try {
      await repository.upsertItems(fixture());

      const clusters = await repository.geo(filter());
      assert.equal(clusters.length, 2);

      const indian = clusters.find((cluster) => cluster.countryCode === "IN");
      assert.ok(indian);
      assert.equal(indian.count, 2);
      assert.equal(indian.countryName, "India");
      assert.equal(indian.lat, 20.6);
      assert.equal(indian.lon, 79.0);
      assert.equal(indian.latestAt, "2026-10-10T09:00:00.000Z");
      assert.equal(indian.categories.ransomware, 1);
      assert.equal(indian.categories.india, 1);
      assert.equal(indian.itemIds.length, 2);

      const american = clusters.find((cluster) => cluster.countryCode === "US");
      assert.ok(american);
      assert.equal(american.count, 1);
      assert.equal(american.lat, 39.5);

      // The same filters apply to the globe.
      const unlocated = await repository.geo(filter({ located: "no" }));
      assert.deepEqual(unlocated, []);
    } finally {
      await repository.close();
    }
  });

  test(`relatedItems: matches country and shared identifiers, excluding itself (${driverName})`, async () => {
    const repository = await factory();
    try {
      const items = fixture();
      await repository.upsertItems(items);

      const hospital = await repository.getItem(items[0].id);
      assert.ok(hospital);

      const related = await repository.relatedItems(hospital, 5);
      assert.deepEqual(ids(related), ["b", "d"]);

      const isolated = await repository.getItem(items[2].id);
      assert.ok(isolated);
      // Item c has no identifiers and is the only US record, so nothing is
      // related to it.
      const relatedToIsolated = await repository.relatedItems(isolated, 5);
      assert.deepEqual(relatedToIsolated, []);
    } finally {
      await repository.close();
    }
  });

  test(`getItem: returns null for an unknown id (${driverName})`, async () => {
    const repository = await factory();
    try {
      assert.equal(await repository.getItem("ci-unknown"), null);
    } finally {
      await repository.close();
    }
  });

  test(`coverage: reports the oldest, newest and count (${driverName})`, async () => {
    const repository = await factory();
    try {
      assert.deepEqual(await repository.coverage(), {
        oldest: null,
        newest: null,
        count: 0,
      });

      await repository.upsertItems(fixture());
      assert.deepEqual(await repository.coverage(), {
        oldest: "2025-12-31T09:00:00.000Z",
        newest: "2026-10-12T09:00:00.000Z",
        count: 4,
      });
    } finally {
      await repository.close();
    }
  });

  test(`source state: round-trips every field and upserts by id (${driverName})`, async () => {
    const repository = await factory();
    try {
      await repository.saveSourceStates([
        state(),
        state({ id: "bleepingcomputer", status: "error", error: "HTTP 503", consecutiveFailures: 3 }),
      ]);

      const states = await repository.sourceStates();
      assert.equal(states.length, 2);

      const news = states.find((entry) => entry.id === "thehackernews");
      assert.deepEqual(news, state());

      const failed = states.find((entry) => entry.id === "bleepingcomputer");
      assert.equal(failed?.status, "error");
      assert.equal(failed?.error, "HTTP 503");
      assert.equal(failed?.consecutiveFailures, 3);

      await repository.saveSourceStates([
        state({ status: "ok", error: null, consecutiveFailures: 0, itemCount: 12 }),
      ]);

      const updated = (await repository.sourceStates()).find(
        (entry) => entry.id === "thehackernews",
      );
      assert.equal(updated?.itemCount, 12);
      assert.equal(updated?.error, null);
      assert.equal((await repository.sourceStates()).length, 2);
    } finally {
      await repository.close();
    }
  });

  test(`runs: records a running run, updates it and returns the newest (${driverName})`, async () => {
    const repository = await factory();
    try {
      assert.equal(await repository.lastRun(), null);

      const running = run();
      await repository.recordRun(running);

      const current = await repository.lastRun();
      assert.equal(current?.id, "run-1");
      assert.equal(current?.status, "running");
      assert.equal(current?.finishedAt, null);

      await repository.updateRun({
        ...running,
        finishedAt: "2026-10-20T10:01:00.000Z",
        status: "partial",
        sourcesAttempted: 9,
        sourcesOk: 8,
        sourcesFailed: 1,
        itemsFetched: 120,
        itemsNew: 7,
        itemsUpdated: 3,
        note: "1 source(s) failed: Example.",
      });

      const finished = await repository.lastRun();
      assert.equal(finished?.status, "partial");
      assert.equal(finished?.sourcesFailed, 1);
      assert.equal(finished?.itemsNew, 7);
      assert.equal(finished?.note, "1 source(s) failed: Example.");

      await repository.recordRun(
        run({ id: "run-0", startedAt: "2026-10-19T10:00:00.000Z", status: "ok" }),
      );
      assert.equal((await repository.lastRun())?.id, "run-1");
    } finally {
      await repository.close();
    }
  });

  test(`locks: exclusive, released and reclaimable after expiry (${driverName})`, async () => {
    const repository = await factory();
    try {
      assert.equal(await repository.acquireLock("ingest", 60), true);
      assert.equal(await repository.acquireLock("ingest", 60), false);

      await repository.releaseLock("ingest");
      assert.equal(await repository.acquireLock("ingest", 60), true);
      await repository.releaseLock("ingest");

      // An expired lock must not block a later run.
      assert.equal(await repository.acquireLock("stale", -5), true);
      assert.equal(await repository.acquireLock("stale", 60), true);
      await repository.releaseLock("stale");
    } finally {
      await repository.close();
    }
  });

  test(`prune: drops records older than the age cutoff (${driverName})`, async () => {
    const repository = await factory();
    try {
      await repository.upsertItems([
        makeItem({
          id: "ci-0000000000000000000000a1",
          title: "Ancient story",
          url: "https://example.com/ancient",
          publishedAt: "2010-01-01T00:00:00.000Z",
          firstSeenAt: "2010-01-01T00:00:00.000Z",
          lastSeenAt: "2010-01-01T00:00:00.000Z",
        }),
        makeItem({
          id: "ci-0000000000000000000000a2",
          title: "Recent story",
          url: "https://example.com/recent",
          publishedAt: "2026-01-01T00:00:00.000Z",
          firstSeenAt: "2026-01-01T00:00:00.000Z",
          lastSeenAt: "2026-01-01T00:00:00.000Z",
        }),
      ]);

      const removed = await repository.prune(3650, 3000);
      assert.equal(removed, 1);
      assert.deepEqual(await repository.coverage(), {
        oldest: "2026-01-01T00:00:00.000Z",
        newest: "2026-01-01T00:00:00.000Z",
        count: 1,
      });
    } finally {
      await repository.close();
    }
  });

  test(`prune: enforces a hard record cap, keeping the newest (${driverName})`, async () => {
    const repository = await factory();
    try {
      const items = Array.from({ length: 5 }, (_, index) =>
        makeItem({
          id: `ci-0000000000000000000000b${index}`,
          title: `Capped story number ${index}`,
          url: `https://example.com/cap-${index}`,
          publishedAt: `2026-01-0${index + 1}T00:00:00.000Z`,
          firstSeenAt: `2026-01-0${index + 1}T00:00:00.000Z`,
          lastSeenAt: `2026-01-0${index + 1}T00:00:00.000Z`,
        }),
      );
      await repository.upsertItems(items);

      const removed = await repository.prune(3650, 2);
      assert.equal(removed, 3);

      const remaining = await repository.query(filter({ sort: "newest" }));
      assert.deepEqual(
        remaining.items.map((item) => item.publishedAt),
        ["2026-01-05T00:00:00.000Z", "2026-01-04T00:00:00.000Z"],
      );
    } finally {
      await repository.close();
    }
  });

  test(`upsert: a mixed batch reports inserted, updated and unchanged (${driverName})`, async () => {
    const repository = await factory();
    try {
      const [first, second] = fixture();
      await repository.upsertItems([first]);

      const changed = { ...second, summary: "A revised summary with more detail." };
      const unchanged = { ...first };

      const result = await repository.upsertItems([unchanged, changed]);
      assert.equal(result.inserted, 1);
      assert.equal(result.unchanged, 1);
      assert.equal(result.updated, 0);
      assert.equal((await repository.coverage()).count, 2);
    } finally {
      await repository.close();
    }
  });
}
