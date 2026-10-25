# Cyber Intelligence pipeline

The `/cyber-intel` section is backed by a scheduled ingestion pipeline rather
than by live calls from the browser. Public feeds are fetched on a schedule,
validated, deduplicated and written to a durable archive; the page and the JSON
API then read only from that archive.

```
public sources ──► per-source fetcher ──► buildItem() ──► repository ──► /cyber-intel
   (HTTPS)           (bounded, retried)     (validate)     (Postgres)      /api/cyber-intel
```

Nothing is invented. Every field is either taken from the source payload or
derived from it by a rule recorded next to the value (`categoryBasis`,
`geo.basis`, `publishedAtKind`). A record may legitimately have no location and
no date.

---

## 1. What is stored

One row per story in `intel_items`:

| Field | Meaning |
| --- | --- |
| `id` | Stable internal id derived from the canonical URL (`ci-…`). |
| `canonical_url` | Primary dedupe key. Fragments, default ports, credentials and campaign parameters removed. |
| `external_id` | The publisher's own id (`guid`, Atom `id`, CVE id). Second dedupe key. |
| `title`, `summary` | Headline and a plain-text excerpt (≤ 280 characters). Article bodies are never mirrored. |
| `url` | Working link to the original publisher. |
| `source_id`, `source_name`, `source_kind` | Attribution. |
| `category`, `category_basis` | `source` when the feed is category-specific, `keyword` when classified from the headline. |
| `published_at`, `published_at_kind` | Publication, advisory or catalogue date. `kind` says which, so the UI never presents a catalogue date as an article date. |
| `incident_at` | Only when the source states when an event happened. |
| `advisory_at` | Original issue date of an advisory. |
| `updated_at` | Source-reported modification time. |
| `geo_*` | Country code/name and a representative point. Only present when a source reported a country in a structured field. |
| `identifiers`, `tags` | CVEs, CISA advisory ids, feed categories, severity labels. |
| `attribution` | Explicit provenance sentence (used for leak-site claims). |
| `first_seen_at`, `last_seen_at` | When our archive first stored the record and when the source last returned it. |
| `sort_at` | `published_at ?? advisory_at ?? incident_at ?? first_seen_at`, precomputed for ordering and date filters. |
| `search_text` | Pre-lowercased haystack so search behaves identically on Postgres and SQLite. |
| `ingested_at` | When the row was last written. |

Locations are country-level only. The single source of structured country data
is `ransomware.live` victim records, and those are marked
`basis: "victim-country"` plus `reportedBy: "ransomware.live (leak-site claim)"`
because they are unverified criminal claims, not confirmed incidents.

---

## 2. Sources

Every endpoint below was probed from a server-side client in October 2026 before
being added. All are public and keyless. The registry lives in
`lib/cyber-intel/sources.ts`; `hosts` is that source's SSRF allowlist.

### Active (22)

| id | Publisher | Kind | Parser | Cadence | Cap |
| --- | --- | --- | --- | --- | --- |
| `cisa-advisories` | CISA Cybersecurity Advisories | government | RSS | 30 min | 20 |
| `cisa-news` | CISA News | government | RSS | 30 min | 40 |
| `cisa-kev` | CISA Known Exploited Vulnerabilities | government | KEV JSON | 60 min | 150 |
| `nvd-cve` | NIST National Vulnerability Database | government | NVD 2.0 JSON | 60 min | 80 |
| `csk-alerts` | Cyber Swachhta Kendra (CERT-In, India) | government | HTML index + alert pages | 60 min | 24 |
| `cert-eu` | CERT-EU Threat Intelligence | government | RSS | 60 min | 20 |
| `ncsc-uk` | NCSC UK Reports | government | RSS | 60 min | 20 |
| `sans-isc` | SANS Internet Storm Center | publisher | RSS | 30 min | 10 |
| `unit42` | Palo Alto Unit 42 | vendor | RSS | 60 min | 15 |
| `msrc-blog` | Microsoft Security Blog | vendor | RSS | 60 min | 10 |
| `securelist` | Kaspersky Securelist | vendor | RSS | 60 min | 15 |
| `welivesecurity` | ESET WeLiveSecurity | vendor | RSS | 60 min | 20 |
| `crowdstrike` | CrowdStrike Blog | vendor | RSS | 60 min | 10 |
| `schneier` | Schneier on Security | publisher | Atom | 60 min | 10 |
| `ubuntu-usn` | Ubuntu Security Notices | vendor | RSS | 60 min | 15 |
| `debian-dsa` | Debian Security Advisories | vendor | RDF/RSS | 60 min | 30 |
| `thehackernews` | The Hacker News | publisher | RSS | 15 min | 50 |
| `bleepingcomputer` | BleepingComputer | publisher | RSS | 15 min | 40 |
| `krebs` | Krebs on Security | publisher | RSS | 30 min | 25 |
| `therecord` | The Record | publisher | RSS | 15 min | 25 |
| `cyberscoop` | CyberScoop | publisher | RSS | 15 min | 25 |
| `ransomware-live` | ransomware.live | aggregator | JSON | 60 min | 100 |

### Disabled (2)

| id | Reason |
| --- | --- |
| `cert-in` | The official CERT-In advisory list is served behind a browser session and returns an empty shell to server-side clients. CERT-In's own Cyber Swachhta Kendra alerts (`csk-alerts`) are ingested instead. |
| `cisa-ics` | The ICS feed is a 5.8 MB duplicate-heavy superset of the cybersecurity advisory feed, so it is not ingested to keep each run bounded. |

### Probed and unavailable (11)

These are listed in `UNAVAILABLE_SOURCES` and shown in the UI with the reason.
They are deliberately not presented as integrated.

| Source | Observed result |
| --- | --- |
| Rapid7 Blog | feed endpoint returns HTTP 404 |
| NVD legacy RSS | HTTP 404; the NVD 2.0 JSON API is used instead |
| Australian Cyber Security Centre | timed out from the server-side client |
| Canadian Centre for Cyber Security | HTTP 404 |
| JPCERT/CC | HTTP 404 |
| ENISA | HTTP 404 |
| KrCERT/CC | HTTP 404 |
| HKCERT | HTTP 500 |
| GitHub Security Advisories | Atom endpoint returns HTTP 406; REST needs a token |
| Google Threat Intelligence | advertised feed URL returns HTML, not a feed |
| Google Project Zero | ~11 MB per request, too large for a bounded run |

### Licensing

For every source we store the headline, a short excerpt, the publisher, the
timestamp and the canonical link, and we always link out. Full article text is
not copied. Each registry entry carries its own `licenceNote`.

---

## 3. Storage

One repository interface, two drivers:

| Driver | When | Durable across redeploys? |
| --- | --- | --- |
| **Postgres** (`pg`) | `CYBER_INTEL_DATABASE_URL` (or `DATABASE_URL`) starts with `postgres://` / `postgresql://` | **Yes.** Shared by every instance. This is the production mode. |
| **SQLite** (`node:sqlite`) | No Postgres URL. Defaults to `.data/cyber-intel.sqlite`; on Vercel, `os.tmpdir()`. | **No.** Survives restarts but not a redeploy or an ephemeral container. |
| **Memory** | SQLite could not be opened at all. | **No.** Reset on every process start. |

The active driver is reported in every snapshot as `meta.archive.storage` and by
`GET /api/cyber-intel/sources`. The UI states explicitly when the archive is not
durable, and `meta.degraded` is `true`.

SQL is written once with `?` placeholders and rewritten to `$1…$n` for
Postgres. Timestamps are ISO-8601 UTC text so ordering and range comparisons are
lexicographic and identical on both engines.

Tables: `intel_items`, `intel_sources` (durable per-source state, validators and
backoff), `intel_runs` (one row per ingestion run), `intel_locks` (advisory lock
with TTL).

### Migration from the previous implementation

The old archive was NDJSON on local disk (`items.ndjson`) plus `state.json`. When
the new store is empty, both are imported once: items go through the same
validation/dedupe path, source health is carried over. `meta.archive.migratedFrom`
and a note in the UI record that this happened. The legacy files are never
deleted, so a rollback remains possible.

---

## 4. Environment variables

See `.env.example`. All are server-only.

| Variable | Required | Purpose |
| --- | --- | --- |
| `CYBER_INTEL_DATABASE_URL` | production | Durable Postgres archive. |
| `DATABASE_URL` | – | Fallback for the above. |
| `CYBER_INTEL_SQLITE_PATH` | – | Local SQLite path (dev only). |
| `CYBER_INTEL_DATA_DIR` | – | Where the legacy NDJSON/state files are read from. |
| `CYBER_INTEL_INGEST_TOKEN` | – | Bearer token for `POST /api/cyber-intel/ingest`. Unset ⇒ endpoint disabled. |
| `CRON_SECRET` | production | Bearer token for `GET /api/cron/cyber-intel`. Falls back to the ingest token. |
| `CYBER_INTEL_INGEST_ON_REQUEST` | – | `0` disables request-triggered refreshes (cron only). |
| `CYBER_INTEL_PG_SSL` | – | `disable` forces `ssl: false`; otherwise the URL's `sslmode` applies. |
| `CYBER_INTEL_PG_POOL_MAX` | – | Pool size (default 5). |

No credential is ever returned by an API route. The storage label is a
credential-free string such as `postgres db.example.net:5432/intel`.

---

## 5. Scheduling and idempotency

`vercel.json` registers an hourly cron:

```json
{ "crons": [{ "path": "/api/cron/cyber-intel", "schedule": "0 * * * *" }] }
```

Any external scheduler can call the same endpoint with
`Authorization: Bearer $CRON_SECRET`. On Vercel's Hobby plan crons are limited to
once a day; the per-source cadence below still applies, so a daily run simply
refreshes everything that is due.

What makes repeated runs safe:

* **Per-source `nextAttemptAt`** is stored in `intel_sources`. A run only
  processes sources whose time has come, so overlapping invocations are cheap
  no-ops (`status: "skipped"`, `reason: "not_due"`).
* **A database lock** (`intel_locks`, 300 s TTL) prevents two processes from
  ingesting at once. The second returns `reason: "lock_held"` without touching
  the network.
* **Upserts are idempotent** — canonical URL, `(source_id, external_id)` and a
  same-source headline within 7 days all collapse into one row.
* **Retries are bounded**: two retries per source with exponential backoff and
  jitter, honouring `Retry-After`; failure backs the source off exponentially up
  to 6 hours.
* **Concurrency is bounded** to four sources at a time.
* **Conditional requests** use the stored `ETag` / `Last-Modified`; a `304`
  keeps the archive and resets the schedule.
* **Request-triggered refresh** (`ensureFresh`) runs at most one ingestion in
  the process and waits at most 2.5 s, so a page render never hangs on the
  network. The refresh continues in the background and the next request sees
  the result.

---

## 6. API

All endpoints are `force-dynamic`, `runtime = "nodejs"` and send
`cache-control: no-store`. They read only from the archive; no publisher is
contacted per request.

### `GET /api/cyber-intel`

Returns an `IntelSnapshot`.

| Param | Values | Default |
| --- | --- | --- |
| `q` | free text, ≤ 120 chars, max 6 tokens | – |
| `category` | comma-separated category ids | all |
| `source` | comma-separated source ids | all |
| `from`, `to` | ISO date or date-time | – |
| `located` | `yes` \| `no` | – |
| `country` | ISO 3166-1 alpha-2 | – |
| `sort` | `newest` \| `oldest` | `newest` |
| `page` | 1–500 | 1 |
| `pageSize` | 1–50 | 20 |

Unknown categories/sources are ignored; an invalid date is treated as absent.
Search is case-insensitive and treats `%`/`_` literally.

### `GET /api/cyber-intel/{id}`

Returns `{ item, related }`, where `related` holds up to five records sharing the
country or an identifier. `400 invalid_id` for a malformed id, `404 not_found`.

### `GET /api/cyber-intel/sources`

Returns `{ storage, migration, lastRun, sources, registry }`: the active driver
and its durability, per-source health (last success, consecutive failures, next
attempt, duration), and the full registry including unavailable sources and
reasons.

### `POST /api/cyber-intel/ingest`

Manual refresh. Requires `Authorization: Bearer $CYBER_INTEL_INGEST_TOKEN`
(or `x-ingest-token`). Disabled with `503 ingest_disabled` when the token is not
configured. Rate limited to one accepted call per 30 s per instance (`429`).
Optional body:

```json
{ "sources": ["cisa-kev", "csk-alerts"] }
```

Forces those sources regardless of `nextAttemptAt`. Unknown ids ⇒
`400 invalid_sources`.

### `GET /api/cron/cyber-intel`

Scheduled refresh. Requires `Authorization: Bearer $CRON_SECRET` (or the ingest
token). Returns the run summary and sanitised per-source health. `503
cron_disabled` when no secret is configured.

### Errors

`503 archive_unavailable` when the repository cannot be read, `500 ingest_failed`
when a run throws. Responses never contain upstream URLs, credentials, SQL or
stack traces.

---

## 7. Security

* **SSRF**: `lib/cyber-intel/security.ts` speaks HTTPS only, contacts only the
  calling source's host allowlist, resolves DNS itself and rejects private,
  loopback, link-local, multicast, documentation and IPv4-mapped addresses. The
  validated address is the one the socket connects to, so DNS rebinding cannot
  redirect it. Redirects are followed manually (max 3) and every hop is
  re-validated.
* **Resource bounds**: per-source timeout, response byte cap, decompression cap,
  and a hard item cap.
* **Untrusted input**: `buildItem()` re-validates everything from the network.
  Markup and control characters are stripped, titles shorter than four
  characters or generic error pages are dropped, unsafe URLs are rejected, and
  impossible dates are dropped rather than rolled over.
* **Secrets**: server-side only. Token comparison is constant-time over SHA-256
  digests. The ingest endpoint is disabled by default and rate limited.
* **Rendering**: the UI renders text as text (no `dangerouslySetInnerHTML`) and
  links out with `rel="noopener noreferrer"`.
* **Leak-site claims** are labelled in the record, the detail panel and the
  source list. They are never presented as confirmed incidents.

---

## 8. Retention and failure handling

* `MAX_AGE_DAYS = 3650` and `MAX_RETAINED = 3000`. Pruning runs after every
  successful run; the archive is bounded by count, not silently by age.
* A failing source never aborts the run and never deletes its records. The run
  is marked `partial`, the source keeps its `lastSuccessAt`, and the UI keeps
  showing the last stored records.
* A source that returns an HTML error page with HTTP 200 is treated as failed,
  not as an empty feed.
* A `304` is a success with zero items.
* If no source has refreshed for six hours, a note explains that the newest
  items may be missing. If the archive is empty, the empty state says so.

---

## 9. Tests

```bash
npm test
```

`tests/cyber-intel/` covers:

* `parse.test.ts` — RFC 822/2822, ISO, named months, timezone abbreviations,
  impossible calendar dates, canonical URLs, identifiers, RSS/Atom/RDF feeds.
* `normalize.test.ts` — validation boundary, junk titles, unsafe URLs, date
  bounds, country mapping, caps, tag/identifier dedupe.
* `dedupe.test.ts` — idempotent upserts, tracking parameters, same-source
  similarity, cross-source duplicates kept, CVE → KEV upgrade, `firstSeenAt`
  preservation, stable publisher ids.
* `storage.test.ts` — filters, LIKE escaping, pagination, facets, geo clusters,
  related items, source state, runs, locks, pruning. Runs against **both**
  SQLite and PGlite, so the production Postgres statements are executed by a
  real Postgres engine.
* `security.test.ts` — private/public address ranges, URL validation, host
  allowlist, blocked DNS, fetch refusal paths, error-message sanitisation,
  constant-time token comparison.
* `ingest.test.ts` — RSS, KEV, NVD, CERT-In HTML and ransomware.live payloads,
  304 handling, HTML-error detection, caps and malformed payloads.

---

## 10. Operations

* Is the archive healthy? `GET /api/cyber-intel/sources` → `storage.durable`,
  `lastRun.status`, each source's `lastSuccessAt` / `consecutiveFailures`.
* Force a refresh now:
  ```bash
  curl -X POST https://<host>/api/cyber-intel/ingest \
    -H "Authorization: Bearer $CYBER_INTEL_INGEST_TOKEN" \
    -H "content-type: application/json" \
    -d '{"sources":["cisa-kev"]}'
  ```
* Run the scheduler manually:
  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/cyber-intel
  ```
* To move from SQLite to Postgres: set `CYBER_INTEL_DATABASE_URL`, deploy, and
  trigger one run. Existing NDJSON/state files are imported automatically on the
  first boot when the new tables are empty.
