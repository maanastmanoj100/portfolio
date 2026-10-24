"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useKeyboardShortcuts } from "@/lib/keyboard";
import {
  IconHome,
  IconTerminal2,
  IconCode,
  IconDashboard,
  IconRobot,
  IconBrandGithub,
  IconLayoutGrid,
  IconSettings,
  IconSearch,
  IconUserShield,
} from "@tabler/icons-react";

interface DockItem {
  label: string;
  href?: string;
  icon: typeof IconHome;
  desc: string;
  shortcut?: string;
  modal?: boolean;
}

const CORE_ITEMS: DockItem[] = [
  { label: "Home", href: "/", icon: IconHome, desc: "Command center", shortcut: "⌃H" },
  { label: "Terminal", href: "/terminal", icon: IconTerminal2, desc: "Command line interface", shortcut: "⌘T" },
  { label: "Projects", href: "/projects", icon: IconCode, desc: "Security tools & write-ups", shortcut: "P" },
  { label: "Dashboard", href: "/dashboard", icon: IconDashboard, desc: "Live SOC metrics", shortcut: "D" },
  { label: "AI Assistant", icon: IconRobot, desc: "Ask about my work", shortcut: "⌘A", modal: true },
  { label: "GitHub", href: "/github-intelligence", icon: IconBrandGithub, desc: "GitHub analytics", shortcut: "G" },
  { label: "Launchpad", icon: IconLayoutGrid, desc: "All applications", shortcut: "⌃L", modal: true },
  { label: "Settings", href: "/settings", icon: IconSettings, desc: "Preferences", shortcut: "S" },
];

function useDockKeyboard(
  focusIndex: number,
  setFocusIndex: (i: number) => void,
  total: number,
  onActivate: () => void,
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocusIndex((focusIndex + 1) % total);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocusIndex((focusIndex - 1 + total) % total);
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusIndex, setFocusIndex, total, onActivate]);
}

function DockTooltip({ label, desc, shortcut }: { label: string; desc?: string; shortcut?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.95 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl whitespace-nowrap z-50
        bg-gradient-to-br from-[rgba(16,17,20,0.95)] to-[rgba(21,22,26,0.8)]
        backdrop-blur-2xl border border-[rgba(255,255,255,0.08)]
        shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-[var(--color-foreground)]">{label}</span>
        {shortcut && (
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-[rgba(255,255,255,0.07)] text-[var(--color-foreground-tertiary)] border border-[rgba(255,255,255,0.05)]">
            {shortcut}
          </kbd>
        )}
      </div>
      {desc && <div className="text-[11px] text-[var(--color-foreground-tertiary)] mt-0.5">{desc}</div>}
    </motion.div>
  );
}

export function NavigationDock() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(-1);
  const dockRef = useRef<HTMLDivElement>(null);
  const ui = useUIStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useKeyboardShortcuts([
    { key: "k", meta: true, handler: () => ui.setCommandPaletteOpen(true), description: "Open command palette" },
    { key: "/", ctrl: true, handler: () => ui.setSearchOpen(true), description: "Open search" },
    { key: "t", meta: true, handler: () => ui.setHackerTerminalOpen(true), description: "Open terminal" },
    { key: "a", meta: true, shift: true, handler: () => ui.setAiAssistantOpen(true), description: "Open AI assistant" },
    { key: "r", ctrl: true, shift: true, handler: () => ui.toggleRecruiterMode(), description: "Toggle recruiter mode" },
  ]);

  const handleItemClick = (item: DockItem) => {
    if (item.modal && item.label === "AI Assistant") {
      ui.setAiAssistantOpen(true);
    } else if (item.modal && item.label === "Launchpad") {
      ui.setLaunchpadOpen(true);
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  const handleActivate = useCallback(() => {
    if (focusIndex >= 0 && focusIndex < CORE_ITEMS.length) {
      handleItemClick(CORE_ITEMS[focusIndex]);
    }
  }, [focusIndex]);

  useDockKeyboard(focusIndex, setFocusIndex, CORE_ITEMS.length, handleActivate);

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getDockScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const diff = Math.abs(index - hoveredIndex);
    if (diff === 0) return 1.4;
    if (diff === 1) return 1.15;
    return 1;
  };

  return (
    <>
      {/* Desktop Dock */}
      <motion.nav
        ref={dockRef}
        role="navigation"
        aria-label="Main navigation"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 22, delay: 0.2 }}
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "hidden md:flex items-center gap-3 px-5 py-2.5",
          "rounded-[20px]",
          "bg-gradient-to-br from-[rgba(16,17,20,0.7)] to-[rgba(21,22,26,0.5)]",
          "backdrop-blur-2xl saturate-[1.3]",
          "border border-[rgba(255,255,255,0.06)]",
          "shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]",
          scrolled && "shadow-[0_12px_56px_rgba(0,0,0,0.6)]",
        )}
        style={{ transformOrigin: "bottom center" }}
      >
        {/* Glass reflection */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.03)] via-transparent to-transparent opacity-60" />
        </div>

        {/* Utility: Search */}
        <button
          onClick={() => ui.setSearchOpen(true)}
          onMouseEnter={() => setHoveredIndex(98)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative flex items-center justify-center w-11 h-11 rounded-xl text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.05)] transition-all outline-none"
          aria-label="Search — Ctrl+/"
        >
          <IconSearch size={18} />
          <AnimatePresence>
            {hoveredIndex === 98 && <DockTooltip label="Search" shortcut="Ctrl+/" />}
          </AnimatePresence>
        </button>

        <div className="w-px h-8 bg-[rgba(255,255,255,0.06)]" />

        {/* Core navigation items */}
        {CORE_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const focused = focusIndex === i;
          const isHovered = hoveredIndex === i;

          const content = (
            <motion.div
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-colors duration-300 cursor-pointer outline-none",
                active
                  ? "text-[var(--color-accent)]"
                  : "text-[rgba(255,255,255,0.35)]",
                (isHovered || focused) && !active && "text-[rgba(255,255,255,0.7)]",
                focused && "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-transparent",
              )}
              animate={{
                scale: getDockScale(i),
                y: isHovered ? -4 : active ? -1 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.8 }}
              whileTap={{ scale: 0.92 }}
            >
              {/* Glow on hover */}
              {(isHovered || focused) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[rgba(0,180,216,0.1)] to-transparent"
                />
              )}

              <Icon size={22} />

              {/* Active indicator dot */}
              {active && (
                <motion.div
                  layoutId="dock-active-dot"
                  className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[var(--color-accent)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.div>
          );

          return (
            <div
              key={item.label}
              className="relative flex flex-col items-center"
              onMouseEnter={() => { setHoveredIndex(i); setFocusIndex(-1); }}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setFocusIndex(i)}
              onBlur={() => setFocusIndex(-1)}
            >
              {item.href && !item.modal ? (
                <Link
                  href={item.href}
                  prefetch={true}
                  aria-label={`${item.label} — ${item.desc}`}
                  tabIndex={0}
                >
                  {content}
                </Link>
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  aria-label={`${item.label} — ${item.desc}`}
                  tabIndex={0}
                >
                  {content}
                </button>
              )}

              <AnimatePresence>
                {(isHovered || focused) && (
                  <DockTooltip label={item.label} desc={item.desc} shortcut={item.shortcut} />
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="w-px h-8 bg-[rgba(255,255,255,0.06)]" />

        {/* Utility: Theme + Notifications + Hire Me */}
        <button
          onClick={() => ui.toggleRecruiterMode()}
          onMouseEnter={() => setHoveredIndex(99)}
          onMouseLeave={() => setHoveredIndex(null)}
          className={cn(
            "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all outline-none",
            ui.recruiterMode
              ? "text-[var(--color-accent)] bg-[rgba(0,180,216,0.08)]"
              : "text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.05)]",
          )}
          aria-label="Toggle recruiter mode"
        >
          <IconUserShield size={18} />
          <AnimatePresence>
            {hoveredIndex === 99 && <DockTooltip label={ui.recruiterMode ? "Hiring Mode" : "Hire Me"} desc="Toggle recruiter-friendly mode" />}
          </AnimatePresence>
        </button>
      </motion.nav>

      {/* Mobile Nav */}
      <MobileNav pathname={pathname} />
    </>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const ui = useUIStore();
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setVisible(current < lastScroll.current || current < 50);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileItems = CORE_ITEMS.slice(0, 4);

  return (
    <motion.div
      animate={{ y: visible ? 0 : 120 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom"
    >
      <div className="flex items-center justify-around px-2 py-2 rounded-t-2xl
        bg-gradient-to-br from-[rgba(16,17,20,0.88)] to-[rgba(21,22,26,0.7)]
        backdrop-blur-2xl border-t border-[rgba(255,255,255,0.06)]
        shadow-[0_-4px_24px_rgba(0,0,0,0.3)]"
      >
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = item.href ? (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) : false;
          return (
            <Link
              key={item.label}
              href={item.href || "/"}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl transition-all duration-200 min-w-[56px]",
                active
                  ? "text-[var(--color-accent)] bg-[rgba(0,180,216,0.06)]"
                  : "text-[rgba(255,255,255,0.3)] active:text-[rgba(255,255,255,0.5)]",
              )}
            >
              <Icon size={20} />
            </Link>
          );
        })}
        <button
          onClick={() => ui.setSearchOpen(true)}
          className="flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl text-[rgba(255,255,255,0.3)] active:text-[rgba(255,255,255,0.5)] min-w-[56px]"
          aria-label="Search"
        >
          <IconSearch size={20} />
        </button>
        <button
          onClick={() => ui.setLaunchpadOpen(true)}
          className={cn(
            "flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl transition-all min-w-[56px]",
            ui.launchpadOpen
              ? "text-[var(--color-accent)] bg-[rgba(0,180,216,0.06)]"
              : "text-[rgba(255,255,255,0.3)] active:text-[rgba(255,255,255,0.5)]",
          )}
          aria-label="Launchpad"
        >
          <IconLayoutGrid size={20} />
        </button>
      </div>
    </motion.div>
  );
}
