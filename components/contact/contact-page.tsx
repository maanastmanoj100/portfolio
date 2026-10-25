import { IconArrowUpRight, IconBrandGithub, IconMail } from "@tabler/icons-react";
import { CopyButton } from "@/components/portfolio/copy-button";
import { profile } from "@/data/portfolio";

/**
 * Contact — server-rendered. The previous version had a form that only toggled
 * a local "sent" state and never delivered anything; it has been replaced with
 * the real, working channels so nothing on the page is decorative.
 */
export function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Contact
        </h1>
        <p className="mt-4 text-base leading-relaxed text-foreground-secondary">
          Open to security engineering, full-stack and developer-tooling work.
          Email is the fastest way to reach me — I aim to reply within a couple
          of days.
        </p>
      </header>

      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.02] p-4 transition-colors hover:border-border-hover">
          <a href={`mailto:${profile.email}`} className="flex min-w-0 flex-1 items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-accent">
              <IconMail size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-foreground-tertiary">Email</span>
              <span className="block truncate text-sm text-foreground">
                {profile.email}
              </span>
            </span>
            <IconArrowUpRight
              size={15}
              className="ml-auto shrink-0 text-foreground-tertiary"
            />
          </a>
          <CopyButton value={profile.email} label="Copy email address" />
        </div>

        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-xl border border-border bg-white/[0.02] p-4 transition-colors hover:border-border-hover"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground-secondary">
            <IconBrandGithub size={18} />
          </span>
          <span className="min-w-0">
            <span className="block text-xs text-foreground-tertiary">GitHub</span>
            <span className="block truncate text-sm text-foreground">
              @maanastmanoj100
            </span>
          </span>
          <IconArrowUpRight
            size={15}
            className="ml-auto shrink-0 text-foreground-tertiary"
          />
        </a>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-foreground-tertiary">
        Please don&apos;t send secrets, credentials or anything confidential in a
        first message.
      </p>
    </div>
  );
}
