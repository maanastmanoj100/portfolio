import assert from "node:assert/strict";
import test from "node:test";
import { buildItem } from "../../lib/cyber-intel/normalize";
import { SOURCE_BY_ID } from "../../lib/cyber-intel/sources";
import type { IntelRepository } from "../../lib/cyber-intel/storage/repository";
import {
  createPgliteRepository,
  createSqliteRepository,
} from "./helpers/drivers";

const news = SOURCE_BY_ID.get("thehackernews");
const other = SOURCE_BY_ID.get("bleepingcomputer");
const nvd = SOURCE_BY_ID.get("nvd-cve");
const kev = SOURCE_BY_ID.get("cisa-kev");

if (!news || !other || !nvd || !kev) throw new Error("test sources missing");

const DAY = 86_400_000;
const base = new Date("2026-10-01T12:00:00.000Z");

const drivers: [string, () => Promise<IntelRepository>][] = [
  ["sqlite", createSqliteRepository],
  ["pglite", createPgliteRepository],
];

for (const [driverName, factory] of drivers) {
  test(`deduplication (${driverName})`, async () => {
    const repository = await factory();
    try {
      // 1. Running the same record twice is a no-op.
      const once = buildItem(news, {
        title: "CISA adds one known exploited vulnerability",
        url: "https://example.com/idempotent",
        publishedAt: "2026-10-01T09:00:00.000Z",
        now: base,
      });
      assert.ok(once);

      const first = await repository.upsertItems([once]);
      const second = await repository.upsertItems([once]);
      assert.equal(first.inserted, 1);
      assert.equal(second.inserted, 0);
      assert.equal(second.updated, 0);
      assert.equal((await repository.coverage()).count, 1);

      // 2. Tracking parameters collapse into the same canonical URL.
      const withTracking = buildItem(news, {
        title: "A different headline about a patch",
        url: "https://example.com/tracking?utm_source=newsletter",
        publishedAt: "2026-10-01T09:00:00.000Z",
        now: base,
      });
      const withoutTracking = buildItem(news, {
        title: "A different headline about a patch",
        url: "https://example.com/tracking",
        publishedAt: "2026-10-01T09:00:00.000Z",
        now: base,
      });
      assert.ok(withTracking && withoutTracking);
      assert.equal(withTracking.id, withoutTracking.id);

      await repository.upsertItems([withTracking]);
      await repository.upsertItems([withoutTracking]);
      assert.equal((await repository.coverage()).count, 2);

      // 3. Same source, same normalised headline, different URL within 7 days:
      //    treated as one story and the newer URL is adopted.
      const movedA = buildItem(news, {
        title: "Publisher moved this story",
        url: "https://example.com/moved-a",
        publishedAt: "2026-10-02T09:00:00.000Z",
        now: new Date(base.getTime() + DAY),
      });
      const movedB = buildItem(news, {
        title: "Publisher moved this story!",
        url: "https://example.com/moved-b",
        publishedAt: "2026-10-02T09:00:00.000Z",
        now: new Date(base.getTime() + 2 * DAY),
      });
      assert.ok(movedA && movedB);

      await repository.upsertItems([movedA]);
      const movedResult = await repository.upsertItems([movedB]);
      assert.equal(movedResult.inserted, 0);
      assert.equal((await repository.coverage()).count, 3);

      const moved = await repository.getItem(movedA.id);
      assert.equal(moved?.url, "https://example.com/moved-b");

      // 4. Cross-source near-duplicates are kept: attribution matters.
      const fromNews = buildItem(news, {
        title: "Same story, two publishers",
        url: "https://news.example.com/story",
        publishedAt: "2026-10-03T09:00:00.000Z",
        now: base,
      });
      const fromOther = buildItem(other, {
        title: "Same story, two publishers",
        url: "https://other.example.com/story",
        publishedAt: "2026-10-03T09:00:00.000Z",
        now: base,
      });
      assert.ok(fromNews && fromOther);

      await repository.upsertItems([fromNews]);
      await repository.upsertItems([fromOther]);
      assert.equal((await repository.coverage()).count, 5);

      // 5. A CVE seen through NVD and then through KEV is upgraded, not doubled.
      const vuln = buildItem(nvd, {
        title: "CVE-2026-12345 — a critical flaw",
        url: "https://nvd.nist.gov/vuln/detail/CVE-2026-12345",
        category: "vulnerability",
        categoryBasis: "source",
        publishedAt: "2026-10-04T09:00:00.000Z",
        now: base,
      });
      const exploited = buildItem(kev, {
        title: "CVE-2026-12345 — known exploited vulnerability",
        url: "https://nvd.nist.gov/vuln/detail/CVE-2026-12345",
        category: "exploit",
        categoryBasis: "source",
        externalId: "CVE-2026-12345",
        publishedAt: "2026-10-05T09:00:00.000Z",
        now: base,
      });
      assert.ok(vuln && exploited);

      await repository.upsertItems([vuln]);
      await repository.upsertItems([exploited]);

      const upgraded = await repository.getItem(vuln.id);
      assert.equal(upgraded?.category, "exploit");
      assert.equal(upgraded?.categoryBasis, "source");

      // 6. firstSeenAt is preserved and lastSeenAt advances.
      const early = buildItem(news, {
        title: "A story that gets updated",
        url: "https://example.com/updated",
        summary: "Short.",
        publishedAt: "2026-10-06T09:00:00.000Z",
        now: new Date("2026-10-06T10:00:00.000Z"),
      });
      const later = buildItem(news, {
        title: "A story that gets updated",
        url: "https://example.com/updated",
        summary: "A much longer summary added later by the publisher.",
        publishedAt: "2026-10-06T09:00:00.000Z",
        now: new Date("2026-10-07T10:00:00.000Z"),
      });
      assert.ok(early && later);

      await repository.upsertItems([early]);
      await repository.upsertItems([later]);

      const updated = await repository.getItem(early.id);
      assert.equal(updated?.firstSeenAt, "2026-10-06T10:00:00.000Z");
      assert.equal(updated?.lastSeenAt, "2026-10-07T10:00:00.000Z");
      assert.equal(updated?.summary, "A much longer summary added later by the publisher.");

      // 7. A stable publisher id dedupes even when the URL changes.
      const byGuidA = buildItem(news, {
        title: "Guid stable story",
        url: "https://example.com/guid-a",
        externalId: "stable-guid-1",
        publishedAt: "2026-10-08T09:00:00.000Z",
        now: base,
      });
      const byGuidB = buildItem(news, {
        title: "Guid stable story (revised)",
        url: "https://example.com/guid-b",
        externalId: "stable-guid-1",
        publishedAt: "2026-10-08T09:00:00.000Z",
        now: base,
      });
      assert.ok(byGuidA && byGuidB);

      await repository.upsertItems([byGuidA]);
      const guidResult = await repository.upsertItems([byGuidB]);
      assert.equal(guidResult.inserted, 0);

      const before = (await repository.coverage()).count;
      await repository.upsertItems([byGuidB]);
      assert.equal((await repository.coverage()).count, before);
    } finally {
      await repository.close();
    }
  });
}
