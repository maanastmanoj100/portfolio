/**
 * GitHub public-data helpers.
 *
 * Only public repository metadata is handled here: name, description,
 * language, star/fork counts, pushed date and the canonical URL. There are no
 * commit counts, contribution graphs or streaks — those are not available from
 * the unauthenticated endpoints used by this site, so they are not shown.
 */

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  pushedAt: string | null;
  isFork: boolean;
  archived: boolean;
  topics: string[];
}

export interface GitHubOverview {
  login: string;
  profileUrl: string;
  repos: GitHubRepo[];
  fetchedAt: string;
}

const LOGIN_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const REPO_NAME_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;
  return cleaned.slice(0, max);
}

/** Accept only canonical https://github.com/<owner>/<repo> URLs. */
export function safeGitHubRepoUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length !== 2) return null;
    const [owner, repo] = parts;
    if (!LOGIN_PATTERN.test(owner) || !REPO_NAME_PATTERN.test(repo)) return null;
    return `https://github.com/${owner}/${repo}`;
  } catch {
    return null;
  }
}

/** Accept only https://github.com/<login> profile URLs. */
export function safeGitHubProfileUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length !== 1 || !LOGIN_PATTERN.test(parts[0])) return null;
    return `https://github.com/${parts[0]}`;
  } catch {
    return null;
  }
}

export function githubLoginFromProfileUrl(value: string): string | null {
  const safe = safeGitHubProfileUrl(value);
  return safe ? safe.slice("https://github.com/".length) : null;
}

function asCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

function asIsoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

export function normalizeGitHubRepo(value: unknown): GitHubRepo | null {
  const repo = asRecord(value);
  if (!repo) return null;

  const name = cleanText(repo.name, 100);
  if (!name || !REPO_NAME_PATTERN.test(name)) return null;

  const url = safeGitHubRepoUrl(repo.html_url);
  if (!url) return null;

  const topics = Array.isArray(repo.topics)
    ? repo.topics
        .map((topic) => cleanText(topic, 40))
        .filter((topic): topic is string => Boolean(topic))
        .slice(0, 5)
    : [];

  return {
    name,
    description: cleanText(repo.description, 240),
    language: cleanText(repo.language, 40),
    stars: asCount(repo.stargazers_count),
    forks: asCount(repo.forks_count),
    url,
    pushedAt: asIsoDate(repo.pushed_at),
    isFork: repo.fork === true,
    archived: repo.archived === true,
    topics,
  };
}

export function normalizeGitHubRepos(value: unknown, limit = 6): GitHubRepo[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const repos: GitHubRepo[] = [];

  for (const entry of value) {
    const repo = normalizeGitHubRepo(entry);
    if (!repo || seen.has(repo.url)) continue;
    seen.add(repo.url);
    repos.push(repo);
    if (repos.length >= limit) break;
  }

  return repos;
}

export function normalizeGitHubOverview(
  payload: unknown,
  now: number = Date.now(),
): GitHubOverview | null {
  const root = asRecord(payload);
  if (!root) return null;

  const login = cleanText(root.login, 39);
  if (!login || !LOGIN_PATTERN.test(login)) return null;

  const profileUrl = safeGitHubProfileUrl(root.profileUrl) ?? `https://github.com/${login}`;
  const repos = normalizeGitHubRepos(root.repos, 6);
  const fetchedAt = asIsoDate(root.fetchedAt) ?? new Date(now).toISOString();

  return {
    login,
    profileUrl,
    repos,
    fetchedAt,
  };
}

/** Coarse, honest relative time. No "coding streak" inference. */
export function relativeTime(iso: string | null, now: number = Date.now()): string {
  if (!iso) return "date unknown";
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return "date unknown";

  const diff = Math.max(0, now - then);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < month) return `${Math.floor(diff / day)}d ago`;
  if (diff < year) return `${Math.floor(diff / month)}mo ago`;
  return `${Math.floor(diff / year)}y ago`;
}
