import assert from "node:assert/strict";
import test from "node:test";
import {
  githubLoginFromProfileUrl,
  normalizeGitHubOverview,
  normalizeGitHubRepo,
  normalizeGitHubRepos,
  relativeTime,
  safeGitHubProfileUrl,
  safeGitHubRepoUrl,
} from "../../lib/portfolio/github";

/**
 * GitHub widget data.
 *
 * The API response is third-party data, so URLs are rebuilt from validated
 * parts rather than echoed back. These tests cover that rebuilding and the
 * absence of any derived statistics the public API does not return.
 */

const REPO = {
  name: "portfolio",
  description: "  A personal site.\n",
  language: "TypeScript",
  stargazers_count: 3,
  forks_count: 1,
  html_url: "https://github.com/maanastmanoj100/portfolio",
  pushed_at: "2026-10-01T10:00:00Z",
  fork: false,
  archived: false,
  topics: ["nextjs", "portfolio"],
};

test("github: repository URLs are rebuilt from validated parts", () => {
  assert.equal(
    safeGitHubRepoUrl("https://github.com/owner/repo"),
    "https://github.com/owner/repo",
  );
  assert.equal(
    safeGitHubRepoUrl("https://www.github.com/owner/repo/"),
    "https://github.com/owner/repo",
  );
  assert.equal(
    safeGitHubRepoUrl("https://github.com/owner/repo?tab=readme"),
    "https://github.com/owner/repo",
  );
});

test("github: non-canonical repository URLs are rejected", () => {
  for (const value of [
    "http://github.com/owner/repo",
    "https://github.com.evil.example/owner/repo",
    "https://gitlab.com/owner/repo",
    "https://github.com/owner",
    "https://github.com/owner/repo/extra",
    "javascript:alert(1)",
    "not a url",
    42,
    null,
  ]) {
    assert.equal(safeGitHubRepoUrl(value), null, `expected null for ${String(value)}`);
  }
});

test("github: profile URLs and logins are validated", () => {
  assert.equal(safeGitHubProfileUrl("https://github.com/testuser"), "https://github.com/testuser");
  assert.equal(githubLoginFromProfileUrl("https://github.com/testuser"), "testuser");
  assert.equal(githubLoginFromProfileUrl("https://github.com/testuser/repo"), null);
  assert.equal(githubLoginFromProfileUrl("https://example.com/testuser"), null);
  assert.equal(githubLoginFromProfileUrl("https://github.com/-bad"), null);
});

test("github: a repository record is normalised", () => {
  const repo = normalizeGitHubRepo(REPO);
  assert.ok(repo);
  assert.equal(repo.name, "portfolio");
  assert.equal(repo.description, "A personal site.");
  assert.equal(repo.language, "TypeScript");
  assert.equal(repo.stars, 3);
  assert.equal(repo.forks, 1);
  assert.equal(repo.url, "https://github.com/maanastmanoj100/portfolio");
  assert.equal(repo.pushedAt, "2026-10-01T10:00:00.000Z");
  assert.deepEqual(repo.topics, ["nextjs", "portfolio"]);
});

test("github: invalid repositories are dropped, not repaired", () => {
  assert.equal(normalizeGitHubRepo(null), null);
  assert.equal(normalizeGitHubRepo({ ...REPO, name: "" }), null);
  assert.equal(normalizeGitHubRepo({ ...REPO, name: "../etc" }), null);
  assert.equal(normalizeGitHubRepo({ ...REPO, html_url: "javascript:alert(1)" }), null);
});

test("github: negative and non-numeric counts become zero", () => {
  const repo = normalizeGitHubRepo({
    ...REPO,
    stargazers_count: -5,
    forks_count: "many",
  });
  assert.equal(repo?.stars, 0);
  assert.equal(repo?.forks, 0);
});

test("github: the repository list is de-duplicated and capped", () => {
  const many = Array.from({ length: 10 }, (_, index) => ({
    ...REPO,
    name: `repo-${index}`,
    html_url: `https://github.com/owner/repo-${index}`,
  }));
  many.push({ ...REPO, name: "portfolio" });

  const repos = normalizeGitHubRepos(many, 6);
  assert.equal(repos.length, 6);
  assert.equal(new Set(repos.map((repo) => repo.url)).size, 6);
});

test("github: an overview requires a valid login", () => {
  assert.equal(normalizeGitHubOverview(null), null);
  assert.equal(normalizeGitHubOverview({ login: "<script>", repos: [] }), null);
  assert.equal(normalizeGitHubOverview({ repos: [] }), null);
});

test("github: an overview falls back to the canonical profile URL", () => {
  const overview = normalizeGitHubOverview({
    login: "testuser",
    profileUrl: "javascript:alert(1)",
    repos: [REPO],
    fetchedAt: "2026-10-25T12:00:00Z",
  });
  assert.ok(overview);
  assert.equal(overview.profileUrl, "https://github.com/testuser");
  assert.equal(overview.repos.length, 1);
  assert.equal(overview.fetchedAt, "2026-10-25T12:00:00.000Z");
});

test("github: relative time is coarse and never negative", () => {
  const now = Date.parse("2026-10-25T12:00:00Z");
  assert.equal(relativeTime(null, now), "date unknown");
  assert.equal(relativeTime("not a date", now), "date unknown");
  assert.equal(relativeTime("2026-10-25T11:59:30Z", now), "just now");
  assert.equal(relativeTime("2026-10-25T11:30:00Z", now), "30m ago");
  assert.equal(relativeTime("2026-10-25T06:00:00Z", now), "6h ago");
  assert.equal(relativeTime("2026-10-20T12:00:00Z", now), "5d ago");
  assert.equal(relativeTime("2026-08-25T12:00:00Z", now), "2mo ago");
  assert.equal(relativeTime("2024-10-25T12:00:00Z", now), "2y ago");
  assert.equal(relativeTime("2026-10-26T12:00:00Z", now), "just now");
});
