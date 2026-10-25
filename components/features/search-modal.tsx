"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  IconSearch,
  IconCode,
  IconUser,
  IconMail,
  IconHome,
} from "@tabler/icons-react";
import { featuredProjects, otherProjects } from "@/data/portfolio";

/**
 * Site search.
 *
 * The previous version searched a hardcoded list of projects and credentials
 * that did not exist ("Sentinel AI", "ChainGuard", "OSCP Certification"). It
 * now indexes the real pages and the real repositories in `data/portfolio.ts`,
 * so a result can always be opened and verified.
 */
const searchData = [
  { label: "Home", href: "/", type: "Page", icon: IconHome },
  { label: "Projects", href: "/projects", type: "Page", icon: IconCode },
  { label: "About", href: "/about", type: "Page", icon: IconUser },
  { label: "Contact", href: "/contact", type: "Page", icon: IconMail },
  ...[...featuredProjects, ...otherProjects].map((project) => ({
    label: project.name,
    href: `/projects/${project.slug}`,
    type: "Project",
    icon: IconCode,
  })),
];

type SearchItem = (typeof searchData)[number];

export function SearchModal() {
  const app = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo(
    () =>
      query
        ? searchData.filter(
            (item) =>
              item.label.toLowerCase().includes(query.toLowerCase()) ||
              item.type.toLowerCase().includes(query.toLowerCase()),
          )
        : [],
    [query],
  );

  const handleSelect = useCallback(
    (item: SearchItem) => {
      app.setSearchOpen(false);
      setQuery("");
      router.push(item.href);
    },
    [app, router],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!app.searchOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[selectedIndex]) handleSelect(results[selectedIndex]);
      if (e.key === "Escape") app.setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [app.searchOpen, results, selectedIndex, handleSelect, app]);

  return (
    <AnimatePresence>
      {app.searchOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => app.setSearchOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 border-b border-border/60 p-4">
              <IconSearch size={16} className="shrink-0 text-foreground-tertiary" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search projects and pages…"
                aria-label="Search projects and pages"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-tertiary"
              />
              <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-foreground-tertiary">
                ESC
              </kbd>
            </div>
            {query && (
              <div className="max-h-64 overflow-y-auto p-2">
                {results.map((item, i) => (
                  <button
                    key={item.href}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      i === selectedIndex
                        ? "bg-accent-soft text-accent"
                        : "text-foreground-secondary hover:bg-white/5"
                    }`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <item.icon size={16} className="shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <span className="font-mono text-xs text-foreground-tertiary">
                      {item.type}
                    </span>
                  </button>
                ))}
                {results.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-foreground-tertiary">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
