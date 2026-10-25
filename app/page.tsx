import Link from "next/link";
import {
  IconArrowRight,
  IconBrandGithub,
  IconMail,
} from "@tabler/icons-react";
import { ProjectCard } from "@/components/portfolio/project-card";
import { CopyButton } from "@/components/portfolio/copy-button";
import { GitHubActivity } from "@/components/features/github-activity";
import { featuredProjects, profile, skillGroups } from "@/data/portfolio";

/**
 * Home page — intentionally a server component with no client JavaScript of its
 * own. Content is real (see `data/portfolio.ts`) and renders in the initial
 * HTML, so it is visible before any bundle loads.
 */

const buttonPrimary =
  "inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent/90";
const buttonSecondary =
  "inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-border-hover hover:bg-white/5";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
        <p className="text-sm text-foreground-tertiary">{profile.role}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground-secondary sm:text-lg">
          {profile.intro}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {profile.focus.map((item) => (
            <li
              key={item}
              className="rounded-full border border-border px-3 py-1 text-xs text-foreground-tertiary"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects" className={buttonPrimary}>
            View projects
            <IconArrowRight size={16} />
          </Link>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonSecondary}
          >
            <IconBrandGithub size={16} />
            GitHub
          </a>
          <a href={`mailto:${profile.email}`} className={buttonSecondary}>
            <IconMail size={16} />
            Email
          </a>
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonSecondary}
            >
              Resume
            </a>
          )}
        </div>
      </section>

      {/* Featured projects */}
      <section id="projects" className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Featured projects
              </h2>
              <p className="mt-1 text-sm text-foreground-secondary">
                Four builds that show the range of what I work on.
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden shrink-0 text-sm text-accent hover:underline sm:inline"
            >
              All projects
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>

          <Link
            href="/projects"
            className="mt-6 inline-block text-sm text-accent hover:underline sm:hidden"
          >
            All projects
          </Link>
        </div>
      </section>

      {/* GitHub activity */}
      <section id="github" className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              On GitHub
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-foreground-secondary">
              Public repositories and their descriptions, read from the GitHub API
              after the page becomes interactive. No contribution counts or
              streaks are shown because the public API does not provide them.
            </p>
          </div>
          <GitHubActivity profileUrl={profile.github} />
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Skills
          </h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            Drawn from the languages and stacks used in the projects above.
          </p>

          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
                  {group.label}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-foreground-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + contact */}
      <section className="border-t border-border/60">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 sm:py-20">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              About
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
              I build security-focused software end to end: backend APIs and
              data models, interfaces, and the interactions that make a topic
              click. The interesting problems for me are making security
              concepts concrete and playable.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              More about me
              <IconArrowRight size={14} />
            </Link>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Contact
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
              Open to security engineering, full-stack and developer-tooling
              work. The fastest way to reach me is email.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 text-accent hover:underline"
              >
                <IconMail size={15} />
                {profile.email}
              </a>
              <CopyButton value={profile.email} label="Copy email address" className="h-7 w-7" />
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-foreground-secondary transition-colors hover:text-foreground"
              >
                <IconBrandGithub size={15} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
