"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { ProjectCard } from "@/components/portfolio/project-card";
import {
  collectCategories,
  collectTechnologies,
  describeResultCount,
  emptyProjectFilters,
  hasActiveFilters,
  searchProjects,
  toggleFilterValue,
  type ProjectFilters,
  type ProjectSummary,
} from "@/lib/portfolio/project-search";
import { cn } from "@/lib/utils";

interface ProjectsExplorerProps {
  projects: ProjectSummary[];
  /** Category order from the data module, so the UI does not invent labels. */
  categories: string[];
}

/**
 * Client-side search and filters for the Projects index.
 *
 * All filtering happens in memory over the summaries passed from the server
 * component: no request is made while typing, and the result count is announced
 * through a polite live region.
 */
export function ProjectsExplorer({ projects, categories }: ProjectsExplorerProps) {
  const [filters, setFilters] = useState<ProjectFilters>(emptyProjectFilters);

  const technologies = useMemo(() => collectTechnologies(projects), [projects]);
  const categoryFacets = useMemo(
    () => collectCategories(projects, categories),
    [projects, categories],
  );

  const filtered = useMemo(() => searchProjects(projects, filters), [projects, filters]);
  const featured = filtered.filter((project) => project.featured);
  const others = filtered.filter((project) => !project.featured);
  const active = hasActiveFilters(filters);

  function toggleCategory(category: string) {
    setFilters((current) => ({
      ...current,
      categories: toggleFilterValue(current.categories, category),
    }));
  }

  function toggleTechnology(technology: string) {
    setFilters((current) => ({
      ...current,
      technologies: toggleFilterValue(current.technologies, technology),
    }));
  }

  function clearFilters() {
    setFilters(emptyProjectFilters);
  }

  return (
    <div>
      <div className="rounded-xl border border-border bg-white/[0.02] p-4">
        <label htmlFor="project-search" className="sr-only">
          Search projects by name, description or technology
        </label>
        <div className="relative">
          <IconSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-tertiary"
            aria-hidden="true"
          />
          <input
            id="project-search"
            type="search"
            value={filters.query}
            onChange={(event) =>
              setFilters((current) => ({ ...current, query: event.target.value }))
            }
            placeholder="Search by name, description or technology"
            autoComplete="off"
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-foreground-tertiary hover:border-border-hover"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => setFilters((current) => ({ ...current, query: "" }))}
              aria-label="Clear the search text"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-foreground-tertiary transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              <IconX size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <fieldset className="mt-4">
          <legend className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
            Category
          </legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {categoryFacets.map(({ value, count }) => {
              const selected = filters.categories.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleCategory(value)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors",
                    selected
                      ? "border-accent-border bg-accent-soft text-accent"
                      : "border-border text-foreground-secondary hover:border-border-hover hover:text-foreground",
                  )}
                >
                  {value}
                  <span
                    className={cn(
                      "ml-1.5",
                      selected ? "text-accent/80" : "text-foreground-tertiary",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <details className="mt-4">
          <summary className="cursor-pointer text-xs font-medium uppercase tracking-wider text-foreground-tertiary transition-colors hover:text-foreground-secondary">
            Technologies
            {filters.technologies.length > 0 && (
              <span className="ml-1.5 normal-case text-accent">
                ({filters.technologies.length} selected)
              </span>
            )}
          </summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {technologies.map(({ value, count }) => {
              const selected = filters.technologies.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleTechnology(value)}
                  className={cn(
                    "rounded border px-2 py-0.5 text-xs transition-colors",
                    selected
                      ? "border-accent-border bg-accent-soft text-accent"
                      : "border-border text-foreground-secondary hover:border-border-hover hover:text-foreground",
                  )}
                >
                  {value}
                  <span
                    className={cn(
                      "ml-1.5",
                      selected ? "text-accent/80" : "text-foreground-tertiary",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </details>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
          <p role="status" aria-live="polite" className="text-xs text-foreground-secondary">
            {describeResultCount(filtered.length, projects.length)}
          </p>
          {active && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-foreground-secondary transition-colors hover:border-border-hover hover:text-foreground"
            >
              <IconX size={12} aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-border bg-white/[0.02] px-6 py-12 text-center">
          <p className="text-sm text-foreground">No projects match these filters.</p>
          <p className="mt-1 text-sm text-foreground-secondary">
            Try a shorter search, or clear the category and technology filters.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-border-hover hover:bg-white/5"
          >
            Clear all filters
          </button>
        </div>
      )}

      {featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="mt-10">
          <h2
            id="featured-heading"
            className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary"
          >
            Featured
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="more-heading" className="mt-14">
          <h2
            id="more-heading"
            className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary"
          >
            More work
          </h2>
          <ul className="mt-4 divide-y divide-border/60 border-y border-border/60">
            {others.map((project) => (
              <li key={project.slug} className="py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-foreground">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="transition-colors hover:text-accent"
                      >
                        {project.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-foreground-secondary">{project.tagline}</p>
                    <p className="mt-2 text-xs text-foreground-tertiary">
                      {project.stack.join(" · ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-sm">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-foreground-secondary transition-colors hover:text-foreground"
                      >
                        Live
                        <IconArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    )}
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-foreground-secondary transition-colors hover:text-foreground"
                    >
                      <IconBrandGithub size={14} aria-hidden="true" />
                      Code
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
