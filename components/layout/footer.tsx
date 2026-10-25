import Link from "next/link";
import { IconBrandGithub, IconMail } from "@tabler/icons-react";
import { SystemStatus } from "@/components/features/system-status";
import { profile } from "@/data/portfolio";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="text-sm font-medium text-foreground">{profile.name}</div>
          <div className="mt-1 text-xs text-foreground-tertiary">{profile.role}</div>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Footer">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground-secondary transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            <IconBrandGithub size={18} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="text-foreground-secondary transition-colors hover:text-foreground"
          >
            <IconMail size={18} />
          </a>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-foreground-tertiary sm:px-6">
          <span>
            &copy; {year} {profile.name}. Project links verified {profile.lastVerified}.
          </span>
          <SystemStatus />
        </div>
      </div>
    </footer>
  );
}
