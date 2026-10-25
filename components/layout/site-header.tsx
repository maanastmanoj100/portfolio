"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useKeyboardShortcuts } from "@/lib/keyboard";
import { profile } from "@/data/portfolio";
import {
  IconBrandGithub,
  IconCommand,
  IconFileText,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Cyber Intel", href: "/cyber-intel" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);

  // Global power-user shortcuts. The old floating dock registered these; the
  // header keeps them so keyboard access survives the navigation rewrite.
  const shortcuts = useMemo(
    () => [
      {
        key: "k",
        meta: true,
        handler: () => setCommandPaletteOpen(true),
        description: "Open command palette",
      },
      {
        key: "k",
        ctrl: true,
        handler: () => setCommandPaletteOpen(true),
        description: "Open command palette",
      },
      {
        key: "/",
        ctrl: true,
        handler: () => setSearchOpen(true),
        description: "Open search",
      },
    ],
    [setCommandPaletteOpen, setSearchOpen],
  );

  useKeyboardShortcuts(shortcuts);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-baseline gap-2 rounded-md transition-colors hover:text-accent"
        >
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {profile.name}
          </span>
          <span className="hidden text-xs text-foreground-tertiary sm:inline">
            {profile.role}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                isActive(pathname, item.href)
                  ? "text-foreground"
                  : "text-foreground-secondary hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-secondary transition-colors hover:text-foreground"
          >
            <IconBrandGithub size={18} />
          </a>

          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm text-foreground-secondary transition-colors hover:text-foreground sm:flex"
            >
              <IconFileText size={16} />
              Resume
            </a>
          )}

          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Open command palette"
            className="hidden h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-foreground-tertiary transition-colors hover:border-border-hover hover:text-foreground-secondary sm:flex"
          >
            <IconCommand size={13} />
            <span>K</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-secondary transition-colors hover:text-foreground md:hidden"
          >
            {menuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-border bg-background/95 px-4 pb-3 pt-1 md:hidden"
          aria-label="Primary mobile"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "block rounded-md px-3 py-2.5 text-sm transition-colors",
                isActive(pathname, item.href)
                  ? "text-foreground"
                  : "text-foreground-secondary hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
