import Link from "next/link";
import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";
import type { PortfolioProject } from "@/data/portfolio";

type ProjectCardData = Pick<
  PortfolioProject,
  "slug" | "name" | "tagline" | "stack" | "status" | "repoUrl" | "liveUrl"
>;

/**
 * Presentational project card for the primary (Home / Projects) surfaces.
 * Plain markup with no client JavaScript of its own; the Projects explorer
 * passes only the fields this card needs.
 */
export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-white/[0.02] p-5 transition-colors hover:border-border-hover">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-medium text-foreground">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors group-hover:text-accent"
          >
            {project.name}
          </Link>
        </h3>
        {project.status === "live" && (
          <span className="mt-0.5 shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-foreground-tertiary">
            Live
          </span>
        )}
      </div>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary">
        {project.tagline}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((tech) => (
          <li
            key={tech}
            className="rounded-md border border-border px-2 py-0.5 text-xs text-foreground-tertiary"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <Link href={`/projects/${project.slug}`} className="text-accent hover:underline">
          Details
        </Link>
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
    </article>
  );
}
