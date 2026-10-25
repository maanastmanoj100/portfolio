import Link from "next/link";
import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";
import { ProjectCard } from "@/components/portfolio/project-card";
import { featuredProjects, otherProjects, profile } from "@/data/portfolio";

/**
 * Projects index — server-rendered from real repository data. No filters, sort
 * controls or animated counters: the content itself is the point.
 */
export function ProjectsPage() {
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
          working.
        </p>
      </header>

      <section aria-labelledby="featured-heading">
        <h2
          id="featured-heading"
          className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary"
        >
          Featured
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section aria-labelledby="more-heading" className="mt-14">
        <h2
          id="more-heading"
          className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary"
        >
          More work
        </h2>
        <ul className="mt-4 divide-y divide-border/60 border-y border-border/60">
          {otherProjects.map((project) => (
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
                  <p className="mt-1 text-sm text-foreground-secondary">
                    {project.tagline}
                  </p>
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
                      <IconArrowUpRight size={13} />
                    </a>
                  )}
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-foreground-secondary transition-colors hover:text-foreground"
                  >
                    <IconBrandGithub size={14} />
                    Code
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

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
