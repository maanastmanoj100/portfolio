"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  IconHome,
  IconCode,
  IconUser,
  IconMail,
  IconSearch,
} from "@tabler/icons-react";

/**
 * Command palette (⌘K / Ctrl+K).
 *
 * Only real destinations are listed. The previous version also linked to
 * /skills, /certifications, /resume and /blog — pages whose content is not
 * verified — and offered a "Download Resume" action with no resume behind it.
 */
const commands = [
  { id: "home", label: "Go to Home", icon: IconHome, action: "/" },
  { id: "projects", label: "View Projects", icon: IconCode, action: "/projects" },
  { id: "about", label: "About", icon: IconUser, action: "/about" },
  { id: "contact", label: "Get in Touch", icon: IconMail, action: "/contact" },
  { id: "search", label: "Search Site", icon: IconSearch, action: "search" },
];

export function CommandPalette() {
  const app = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const executeCommand = useCallback(
    (cmd: (typeof commands)[number]) => {
      app.setCommandPaletteOpen(false);
      setQuery("");
      if (cmd.action === "search") {
        app.setSearchOpen(true);
        return;
      }
      router.push(cmd.action);
    },
    [app, router],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!app.commandPaletteOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        executeCommand(filtered[selectedIndex]);
      }
      if (e.key === "Escape") {
        app.setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [app.commandPaletteOpen, filtered, selectedIndex, executeCommand, app]);

  return (
    <AnimatePresence>
      {app.commandPaletteOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => app.setCommandPaletteOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
                placeholder="Go to…"
                aria-label="Go to a page"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-tertiary"
              />
              <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-foreground-tertiary">
                ESC
              </kbd>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    i === selectedIndex
                      ? "bg-accent-soft text-accent"
                      : "text-foreground-secondary hover:bg-white/5"
                  }`}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <cmd.icon size={16} />
                  <span>{cmd.label}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-foreground-tertiary">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
