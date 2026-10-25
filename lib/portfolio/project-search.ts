/**
 * Project search and filtering.
 *
 * Pure functions only: the Projects page passes plain project summaries in and
 * gets a filtered array back, so filtering never triggers a request and can be
 * unit tested without a DOM.
 *
 * Matching rules:
 *   - every whitespace-separated query term must appear in the project's name,
 *     tagline, summary, stack or categories;
 *   - categories are OR-ed (a project needs at least one selected category);
 *   - technologies are OR-ed within the group and AND-ed with categories.
 */

import type { PortfolioProject } from "@/data/portfolio";

/** The subset of a project the Projects page needs on the client. */
export interface ProjectSummary {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  stack: string[];
  categories: string[];
  status: "live" | "source";
  repoUrl: string;
  liveUrl?: string;
  featured: boolean;
  hasArchitecture: boolean;
}

/** Strip fields the explorer does not need before crossing to the client. */
export function toProjectSummary(
  project: PortfolioProject,
  featured: boolean,
): ProjectSummary {
  return {
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    summary: project.summary,
    stack: project.stack,
    categories: project.categories,
    status: project.status,
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
    featured,
    hasArchitecture: Boolean(project.architecture),
  };
}

export interface SearchableProject {
  name: string;
  tagline: string;
  summary: string;
  stack: string[];
  categories: string[];
}

export interface ProjectFilters {
  query: string;
  categories: string[];
  technologies: string[];
}

export const emptyProjectFilters: ProjectFilters = {
  query: "",
  categories: [],
  technologies: [],
};

/** Lowercase and strip diacritics so "cafe" matches "café". */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function haystack(project: SearchableProject): string {
  return normalizeSearchText(
    [
      project.name,
      project.tagline,
      project.summary,
      ...project.stack,
      ...project.categories,
    ].join(" "),
  );
}

export function hasActiveFilters(filters: ProjectFilters): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.categories.length > 0 ||
    filters.technologies.length > 0
  );
}

export function searchProjects<T extends SearchableProject>(
  projects: T[],
  filters: ProjectFilters,
): T[] {
  const terms = normalizeSearchText(filters.query).split(" ").filter(Boolean);
  const selectedCategories = new Set(
    filters.categories.map((category) => normalizeSearchText(category)),
  );
  const selectedTech = new Set(
    filters.technologies.map((technology) => normalizeSearchText(technology)),
  );

  return projects.filter((project) => {
    if (
      selectedCategories.size > 0 &&
      !project.categories.some((category) =>
        selectedCategories.has(normalizeSearchText(category)),
      )
    ) {
      return false;
    }

    if (
      selectedTech.size > 0 &&
      !project.stack.some((technology) =>
        selectedTech.has(normalizeSearchText(technology)),
      )
    ) {
      return false;
    }

    if (terms.length === 0) return true;
    const text = haystack(project);
    return terms.every((term) => text.includes(term));
  });
}

export interface FacetCount {
  value: string;
  count: number;
}

/** Technologies present in the data, most common first, then alphabetical. */
export function collectTechnologies(projects: SearchableProject[]): FacetCount[] {
  const counts = new Map<string, { value: string; count: number }>();
  for (const project of projects) {
    for (const technology of project.stack) {
      const key = normalizeSearchText(technology);
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { value: technology, count: 1 });
    }
  }
  return [...counts.values()].sort(
    (a, b) => b.count - a.count || a.value.localeCompare(b.value),
  );
}

/** Categories present in the data, in the order the caller supplied them. */
export function collectCategories(
  projects: SearchableProject[],
  order: readonly string[],
): FacetCount[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const category of project.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  const known = order
    .filter((category) => counts.has(category))
    .map((category) => ({ value: category, count: counts.get(category) ?? 0 }));
  const unknown = [...counts.entries()]
    .filter(([category]) => !order.includes(category))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value, count]) => ({ value, count }));
  return [...known, ...unknown];
}

export function toggleFilterValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

/** Human-readable count used in the live region and the filter bar. */
export function describeResultCount(shown: number, total: number): string {
  if (shown === total) {
    return `${total} ${total === 1 ? "project" : "projects"}`;
  }
  return `${shown} of ${total} projects`;
}
