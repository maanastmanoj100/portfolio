/**
 * Minimal feed/HTML parsing helpers.
 *
 * The project already avoids heavy dependencies, and every feed we consume is
 * RSS 2.0 or Atom with a predictable shape, so a small hand-written parser is
 * both smaller and easier to audit than pulling in a full XML stack.
 */

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
};

export function decodeEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      safeCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) => safeCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (match, name: string) => ENTITIES[name.toLowerCase()] ?? match);
}

function safeCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

export function stripHtml(input: string): string {
  return decodeEntities(
    input
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/** Cuts at a word boundary without leaving a dangling comma or half word. */
export function truncate(input: string, max = 280): string {
  const text = input.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const cut = slice.lastIndexOf(" ");
  return `${(cut > 60 ? slice.slice(0, cut) : slice).replace(/[,.;:\-–—]$/, "")}…`;
}

function unwrapCdata(value: string): string {
  const trimmed = value.trim();
  const match = /^<!\[CDATA\[([\s\S]*?)\]\]>$/.exec(trimmed);
  return match ? match[1] : trimmed;
}

function firstTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i");
  const match = re.exec(block);
  return match ? unwrapCdata(match[1]) : null;
}

function allTags(block: string, tag: string): string[] {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "gi");
  return [...block.matchAll(re)].map((m) => unwrapCdata(m[1]));
}

function attr(tag: string, name: string): string | null {
  const re = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i");
  const match = re.exec(tag);
  return match ? match[1] : null;
}

export interface RawFeedEntry {
  title: string;
  link: string | null;
  summary: string;
  published: string | null;
  updated: string | null;
  categories: string[];
  guid: string | null;
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * Parses the date formats our sources actually emit:
 * RFC 822 (`Fri, 23 Oct 26 12:00:00 +0000`), full RFC 2822, ISO 8601, and
 * date-only strings. Anything else returns `null` rather than a guessed value.
 */
export function parseDate(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = stripHtml(input).trim();
  if (!value) return null;

  // RFC 822 / 2822, with either a two- or four-digit year.
  const rfc = /^(?:[A-Za-z]{3},\s*)?(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{2,4})\s+(\d{2}):(\d{2})(?::(\d{2}))?\s*([+-]\d{4}|[A-Z]{1,4})?/.exec(
    value,
  );
  if (rfc) {
    const day = Number(rfc[1]);
    const month = MONTHS[rfc[2].toLowerCase()];
    let year = Number(rfc[3]);
    if (year < 100) year += year < 70 ? 2000 : 1900;
    if (month === undefined) return null;
    const offset = parseOffset(rfc[7]);
    const date = new Date(
      Date.UTC(year, month, day, Number(rfc[4]), Number(rfc[5]), Number(rfc[6] ?? 0)),
    );
    if (Number.isNaN(date.getTime())) return null;
    if (offset !== null) date.setTime(date.getTime() - offset);
    return date.toISOString();
  }

  // ISO 8601 or a bare date.
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?/.exec(
    value,
  );
  if (iso) {
    const [, y, mo, d, h, mi, s, tz] = iso;
    const offset = tz && tz !== "Z" ? parseOffset(tz) : 0;
    const date = new Date(
      Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h ?? 0), Number(mi ?? 0), Number(s ?? 0)),
    );
    if (Number.isNaN(date.getTime())) return null;
    if (offset) date.setTime(date.getTime() - offset);
    return date.toISOString();
  }

  // "October 23, 2026" / "23 October 2026", with an optional time.
  // Date-only values are UTC midnight: parsing them with `Date.parse` would
  // apply the server's local offset and silently shift the calendar day.
  const monthFirst = /^([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})(?:[ T,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(
    value,
  );
  const dayFirst = /^(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})(?:[ T,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(
    value,
  );

  const named = monthFirst
    ? {
        month: MONTHS[monthFirst[1].slice(0, 3).toLowerCase()],
        day: Number(monthFirst[2]),
        year: Number(monthFirst[3]),
        hour: Number(monthFirst[4] ?? 0),
        minute: Number(monthFirst[5] ?? 0),
        second: Number(monthFirst[6] ?? 0),
      }
    : dayFirst
      ? {
          month: MONTHS[dayFirst[2].slice(0, 3).toLowerCase()],
          day: Number(dayFirst[1]),
          year: Number(dayFirst[3]),
          hour: Number(dayFirst[4] ?? 0),
          minute: Number(dayFirst[5] ?? 0),
          second: Number(dayFirst[6] ?? 0),
        }
      : null;

  if (named && named.month !== undefined) {
    const date = new Date(
      Date.UTC(named.year, named.month, named.day, named.hour, named.minute, named.second),
    );
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const fallback = Date.parse(value);
  if (Number.isNaN(fallback)) return null;
  const date = new Date(fallback);
  // Reject obviously bogus parses (e.g. "2026" alone resolving to Jan 1).
  if (date.getUTCFullYear() < 1990) return null;
  return date.toISOString();
}

function parseOffset(raw: string | undefined): number | null {
  if (!raw) return null;
  if (/^[A-Z]{1,4}$/i.test(raw)) {
    const map: Record<string, number> = { GMT: 0, UTC: 0, UT: 0, EST: -5, EDT: -4, CST: -6, CDT: -5, MST: -7, MDT: -6, PST: -8, PDT: -7 };
    const hours = map[raw.toUpperCase()];
    return hours === undefined ? 0 : hours * 3_600_000;
  }
  const match = /^([+-])(\d{2}):?(\d{2})$/.exec(raw);
  if (!match) return null;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3])) * 60_000;
}

/** Parses RSS 2.0 items or Atom entries into a uniform shape. */
export function parseFeed(xml: string): RawFeedEntry[] {
  const blocks = [
    ...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi),
    ...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi),
  ];

  return blocks
    .map((match) => {
      const block = match[1];
      const rawTitle = firstTag(block, "title") ?? "";
      const atomLinkTag = /<link\b[^>]*>/i.exec(block)?.[0] ?? "";
      const link =
        firstTag(block, "link")?.trim() ||
        (atomLinkTag ? attr(atomLinkTag, "href") : null) ||
        firstTag(block, "guid")?.trim() ||
        null;

      const summaryHtml =
        firstTag(block, "description") ||
        firstTag(block, "summary") ||
        firstTag(block, "content:encoded") ||
        firstTag(block, "content") ||
        "";

      return {
        title: stripHtml(rawTitle),
        link: link ? stripHtml(link) : null,
        summary: stripHtml(summaryHtml),
        published: parseDate(firstTag(block, "pubDate") ?? firstTag(block, "published")),
        updated: parseDate(firstTag(block, "updated") ?? firstTag(block, "dc:date")),
        categories: allTags(block, "category").map(stripHtml).filter(Boolean),
        guid: firstTag(block, "guid") ? stripHtml(firstTag(block, "guid") as string) : null,
      };
    })
    .filter((entry) => entry.title.length > 0);
}

/** Extracts CVE / CISA advisory identifiers that appear in the text. */
export function extractIdentifiers(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(/\bCVE-\d{4}-\d{4,7}\b/gi)) {
    found.add(match[0].toUpperCase());
  }
  for (const match of text.matchAll(/\b(?:AA|AR|MAR)\d{2}-\d{3}[A-Z]?\b/g)) {
    found.add(match[0].toUpperCase());
  }
  return [...found].slice(0, 8);
}

/** Stable, readable id derived from the canonical URL. */
export function stableId(url: string): string {
  let hash = 2166136261;
  for (let i = 0; i < url.length; i++) {
    hash ^= url.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `ci-${(hash >>> 0).toString(36)}`;
}
