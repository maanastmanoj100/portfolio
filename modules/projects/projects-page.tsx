import { ProjectsExplorer } from "@/components/portfolio/projects-explorer";
import {
  PROJECT_CATEGORIES,
  featuredProjects,
  otherProjects,
  profile,
} from "@/data/portfolio";
import { toProjectSummary } from "@/lib/portfolio/project-search";

/**
 * Projects index — server-rendered from real repository data.
 *
 * Only the fields the explorer needs are passed to the client; the full project
 * records (including architecture text) stay on the server and are loaded by
 * the detail route.
 */
export function ProjectsPage() {
  const projects = [
    ...featuredProjects.map((project) => toProjectSummary(project, true)),
    ...otherProjects.map((project) => toProjectSummary(project, false)),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-secondary sm:text-base">
          Security tooling, escape rooms and full-stack web apps. Every card links
          to the source repository, and the sites marked{" "}
          <span className="text-foreground-secondary">Live</span> are deployed and
          working. Search by name, description or technology, or filter by
          category.
        </p>
      </header>

      <ProjectsExplorer projects={projects} categories={PROJECT_CATEGORIES} />

      <p className="mt-14 text-xs text-foreground-tertiary">
        Full source for every project lives at{" "}
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
        >
          github.com/maanastmanoj100
        </a>
        .
      </p>
    </div>
  );
}
