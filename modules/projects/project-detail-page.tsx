import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft, IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";
import {
  featuredProjects,
  otherProjects,
  type PortfolioProject,
} from "@/data/portfolio";

const allProjects: PortfolioProject[] = [...featuredProjects, ...otherProjects];

export function getProject(slug: string): PortfolioProject | undefined {
  return allProjects.find((project) => project.slug === slug);
}

function formatMonth(iso: string) {
  const [year, month] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Project detail — server-rendered from real repository facts. Unknown slugs
 * render the app's not-found page instead of a fabricated "workspace".
 */
export async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
      >
        <IconArrowLeft size={14} />
        All projects
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {project.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-foreground-secondary">
          {project.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-tertiary">
          <span>{formatMonth(project.created)}</span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            {project.status === "live" ? "Deployed" : "Source only"}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent/90"
            >
              Open live site
              <IconArrowUpRight size={15} />
            </a>
          )}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-border-hover hover:bg-white/5"
          >
            <IconBrandGithub size={15} />
            View source
          </a>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
          Overview
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
          {project.summary}
        </p>
      </section>

      {project.highlights.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
            What it does
          </h2>
          <ul className="mt-3 space-y-2">
            {project.highlights.map((item) => (
              <li
                key={item}
                className="flex gap-2.5 text-sm leading-relaxed text-foreground-secondary"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
          Tech stack
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground-secondary"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
