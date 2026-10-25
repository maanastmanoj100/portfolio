import Link from "next/link";
import { IconArrowUpRight, IconBrandGithub, IconMail } from "@tabler/icons-react";
import { certifications, profile, skillGroups, timeline } from "@/data/portfolio";

function formatMonth(date: string) {
  const [year, month] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * About page — server-rendered with verified facts only. No "years of
 * experience", project counts, CVE counts or clearance claims: none of those
 * could be substantiated, so they are not shown.
 */
export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          About
        </h1>
        <p className="mt-4 text-base leading-relaxed text-foreground-secondary">
          I&apos;m {profile.name}, a {profile.role.toLowerCase()}. I build
          security-focused software end to end — APIs and data models on the
          backend, interfaces on the front, and the details in between that make
          a topic click.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
          What I work on
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
          Recent projects include a SOC dashboard simulator (FastAPI, React,
          SQLite and Docker), two browser escape rooms, and a CTF murder-mystery
          event with a mock backend for flag validation. Alongside those I keep
          smaller tools public — a password-strength analyser, a Caesar cipher, a
          cryptography playground.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
          The through-line is making security concepts concrete: why a password
          is weak, how a phishing email gives itself away, what an analyst
          actually does with an alert. If a concept is hard to explain, turning
          it into a calculator, a puzzle or a game is usually the fastest way to
          make it stick.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
          Skills
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm font-medium text-foreground">{group.label}</h3>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="text-sm text-foreground-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Rendered only once real certifications are added to data/portfolio.ts. */}
      {certifications.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
            Certifications
          </h2>
          <ul className="mt-3 space-y-2">
            {certifications.map((cert) => (
              <li key={cert.name} className="text-sm text-foreground-secondary">
                <span className="text-foreground">{cert.name}</span> — {cert.issuer},{" "}
                {cert.date}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
          Timeline
        </h2>
        <ol className="mt-4 space-y-5 border-l border-border pl-5">
          {timeline.map((entry, index) => (
            <li key={`${entry.date}-${entry.title}-${index}`} className="relative">
              <span
                className="absolute -left-[1.4rem] top-1.5 h-1.5 w-1.5 rounded-full bg-accent"
                aria-hidden="true"
              />
              <div className="text-xs text-foreground-tertiary">
                {formatMonth(entry.date)}
              </div>
              <div className="mt-0.5 text-sm font-medium text-foreground">
                {entry.title}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
                {entry.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
          Get in touch
        </h2>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-1.5 text-accent hover:underline"
          >
            <IconMail size={15} />
            {profile.email}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground-secondary transition-colors hover:text-foreground"
          >
            <IconBrandGithub size={15} />
            GitHub
          </a>
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-foreground-secondary transition-colors hover:text-foreground"
            >
              Resume
              <IconArrowUpRight size={13} />
            </a>
          )}
        </div>
        <p className="mt-6 text-sm">
          <Link href="/projects" className="text-accent hover:underline">
            See the projects
          </Link>
        </p>
      </section>
    </div>
  );
}
