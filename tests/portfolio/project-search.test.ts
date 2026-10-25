import assert from "node:assert/strict";
import test from "node:test";
import {
  collectCategories,
  collectTechnologies,
  describeResultCount,
  emptyProjectFilters,
  hasActiveFilters,
  normalizeSearchText,
  searchProjects,
  toggleFilterValue,
  type SearchableProject,
} from "../../lib/portfolio/project-search";

/**
 * Projects explorer filtering.
 *
 * The explorer filters in memory, so these rules are the only thing standing
 * between a search box and a wrong result set. Each test pins one rule from the
 * module's header comment.
 */

const PROJECTS: SearchableProject[] = [
  {
    name: "Cyber Range SOC Lite",
    tagline: "Alert triage practice range",
    summary: "A FastAPI service with alerts, attacks and dashboard routers.",
    stack: ["Python", "FastAPI"],
    categories: ["Cybersecurity", "Tools"],
  },
  {
    name: "Save Maveli",
    tagline: "Narrative escape game",
    summary: "A cinematic browser game built with Next.js.",
    stack: ["TypeScript", "Next.js"],
    categories: ["Games", "Web development"],
  },
  {
    name: "Caesar Cipher",
    tagline: "Classical cipher playground",
    summary: "A small Python tool for shift ciphers.",
    stack: ["Python"],
    categories: ["Tools"],
  },
];

test("search: an empty query returns everything", () => {
  assert.deepEqual(searchProjects(PROJECTS, emptyProjectFilters), PROJECTS);
});

test("search: every term must match, across any indexed field", () => {
  const both = searchProjects(PROJECTS, { ...emptyProjectFilters, query: "python cipher" });
  assert.deepEqual(
    both.map((project) => project.name),
    ["Caesar Cipher"],
  );

  const none = searchProjects(PROJECTS, { ...emptyProjectFilters, query: "python rust" });
  assert.equal(none.length, 0);
});

test("search: matching is case-insensitive and diacritic-insensitive", () => {
  assert.equal(normalizeSearchText("Café  Range"), "cafe range");
  const results = searchProjects(PROJECTS, { ...emptyProjectFilters, query: "CYBER range" });
  assert.deepEqual(
    results.map((project) => project.name),
    ["Cyber Range SOC Lite"],
  );
});

test("search: categories are OR-ed", () => {
  const results = searchProjects(PROJECTS, {
    ...emptyProjectFilters,
    categories: ["Games", "Cybersecurity"],
  });
  assert.deepEqual(
    results.map((project) => project.name).sort(),
    ["Cyber Range SOC Lite", "Save Maveli"],
  );
});

test("search: technologies are OR-ed and AND-ed with categories", () => {
  const pythonTools = searchProjects(PROJECTS, {
    ...emptyProjectFilters,
    categories: ["Tools"],
    technologies: ["Python"],
  });
  assert.deepEqual(
    pythonTools.map((project) => project.name).sort(),
    ["Caesar Cipher", "Cyber Range SOC Lite"],
  );

  const impossible = searchProjects(PROJECTS, {
    ...emptyProjectFilters,
    categories: ["Games"],
    technologies: ["Python"],
  });
  assert.equal(impossible.length, 0);
});

test("search: a query still applies when filters are selected", () => {
  const results = searchProjects(PROJECTS, {
    query: "fastapi",
    categories: ["Tools"],
    technologies: ["Python"],
  });
  assert.deepEqual(
    results.map((project) => project.name),
    ["Cyber Range SOC Lite"],
  );
});

test("facets: technologies are counted and sorted by frequency", () => {
  const technologies = collectTechnologies(PROJECTS);
  assert.deepEqual(technologies[0], { value: "Python", count: 2 });
  assert.equal(technologies.length, 4);
  const counts = technologies.map((entry) => entry.count);
  assert.deepEqual(counts, [...counts].sort((a, b) => b - a));
});

test("facets: categories keep the caller's order and append unknown values", () => {
  const facets = collectCategories(PROJECTS, ["Cybersecurity", "Games", "Not present"]);
  assert.deepEqual(
    facets.map((facet) => facet.value),
    ["Cybersecurity", "Games", "Tools", "Web development"],
  );
  assert.equal(facets[0].count, 1);
});

test("filters: toggling adds, then removes the same value", () => {
  const once = toggleFilterValue([], "Python");
  assert.deepEqual(once, ["Python"]);
  assert.deepEqual(toggleFilterValue(once, "Python"), []);
});

test("filters: whitespace-only queries do not count as active", () => {
  assert.equal(hasActiveFilters({ ...emptyProjectFilters, query: "   " }), false);
  assert.equal(hasActiveFilters({ ...emptyProjectFilters, query: "a" }), true);
  assert.equal(
    hasActiveFilters({ ...emptyProjectFilters, categories: ["Tools"] }),
    true,
  );
});

test("counts: singular, plural and filtered forms", () => {
  assert.equal(describeResultCount(1, 1), "1 project");
  assert.equal(describeResultCount(3, 3), "3 projects");
  assert.equal(describeResultCount(2, 5), "2 of 5 projects");
});
