"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useThemeStore } from "@/stores/theme-store";
import { useKeyboardShortcuts } from "@/lib/keyboard";
import {
  IconHome,
  IconCode,
  IconBrain,
  IconCertificate,
  IconDashboard,
  IconFileText,
  IconNews,
  IconMail,
  IconSearch,
  IconTerminal2,
  IconRobot,
  IconUserShield,
  IconSettings,
  IconBell,
  IconPalette,
  IconMoon,
  IconEyeOff,
  IconGauge,
  IconDotsVertical,
  IconGlobe,
  IconMessage,
  IconBrandGithub,
  IconChartBar,
  IconHistory,
  IconFlag,
  IconServer,
  IconNetwork,
  IconTrophy,
  IconBooks,
  IconStar,
  IconCpu,
  IconShieldCheck,
  IconLayoutGrid,
  IconShieldExclamation,
  IconUsers,
  IconUserSearch,
  IconDeviceGamepad2,
} from "@tabler/icons-react";

interface DockItem {
  label: string;
  href: string;
  icon: typeof IconHome;
  desc: string;
  shortcut?: string;
  badge?: string;
}

const primaryItems: DockItem[] = [
  { label: "Home", href: "/", icon: IconHome, desc: "Return to command center" },
  { label: "Projects", href: "/projects", icon: IconCode, desc: "Security tools & write-ups", shortcut: "P" },
  { label: "Skills", href: "/skills", icon: IconBrain, desc: "Technical expertise", shortcut: "S" },
  { label: "Certs", href: "/certifications", icon: IconCertificate, desc: "Industry credentials" },
  { label: "Dashboard", href: "/dashboard", icon: IconDashboard, desc: "Live SOC metrics" },
  { label: "Command Center", href: "/command-center", icon: IconShieldExclamation, desc: "SOC + NOC + OSINT fusion", shortcut: "G C" },
  { label: "Threat Map", href: "/attack-map", icon: IconGlobe, desc: "Global attack visualization" },
  { label: "Resume", href: "/resume", icon: IconFileText, desc: "Experience & education", shortcut: "R" },
  { label: "Blog", href: "/blog", icon: IconNews, desc: "Security research", shortcut: "B" },
  { label: "AI Twin", href: "/cyber-persona", icon: IconMessage, desc: "AI digital twin" },
  { label: "Interview", href: "/interview-simulator", icon: IconBrain, desc: "AI interview practice" },
  { label: "GitHub", href: "/github-intelligence", icon: IconBrandGithub, desc: "GitHub analytics" },
  { label: "Analytics", href: "/career-analytics", icon: IconChartBar, desc: "Career analytics" },
  { label: "Timeline", href: "/career-timeline", icon: IconHistory, desc: "Learning journey" },
  { label: "CTF Range", href: "/ctf-command-center", icon: IconFlag, desc: "CTF & cyber range" },
  { label: "Cyber Lab", href: "/cyber-lab", icon: IconServer, desc: "Lab infrastructure" },
  { label: "Knowledge", href: "/knowledge-graph", icon: IconNetwork, desc: "Knowledge graph" },
  { label: "Wiki", href: "/wiki", icon: IconBooks, desc: "Learning encyclopedia" },
  { label: "Achievements", href: "/achievements", icon: IconTrophy, desc: "Badges & missions" },
  { label: "Competency", href: "/competency-matrix", icon: IconStar, desc: "Skill progression engine" },
  { label: "Career Intel", href: "/career-intelligence", icon: IconChartBar, desc: "Role intelligence & skill gaps" },
  { label: "Architect", href: "/project-architect", icon: IconCpu, desc: "AI project generator & architect" },
  { label: "Arch. Studio", href: "/security-architect", icon: IconShieldCheck, desc: "Architecture & threat modeling" },
  { label: "Engineering", href: "/engineering", icon: IconCode, desc: "Platform engineering & quality" },
  { label: "Collaboration", href: "/collaboration", icon: IconUsers, desc: "OSS ecosystem & community" },
  { label: "Recruiter", href: "/recruiter", icon: IconUserSearch, desc: "Recruiter experience platform" },
  { label: "Arcade", href: "/arcade", icon: IconDeviceGamepad2, desc: "Logic, puzzle, cyber & mini games" },
  { label: "Cyber OS", href: "/cyber-os", icon: IconLayoutGrid, desc: "Desktop OS environment" },
  { label: "Contact", href: "/contact", icon: IconMail, desc: "Get in touch" },
];

const themes = [
  { id: "dark", label: "Liquid Glass", icon: IconMoon, desc: "Default dark theme" },
  { id: "cyber", label: "SOC Blue", icon: IconGauge, desc: "Blue-tinted SOC mode" },
  { id: "matrix", label: "Matrix", icon: IconEyeOff, desc: "Legacy green terminal" },
] as const;

const notifications = [
  { id: "n1", title: "New Project", desc: "Threat Hunter v2 published", time: "2h ago", read: false },
  { id: "n2", title: "Certification", desc: "OSCP verified", time: "1d ago", read: false },
  { id: "n3", title: "Blog Updated", desc: "Zero-Day Analysis live", time: "3d ago", read: true },
];

function useDockKeyboard(focusIndex: number, setFocusIndex: (i: number) => void, total: number, onActivate: () => void) {
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
    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50
      bg-gradient-to-br from-[rgba(16,17,20,0.92)] to-[rgba(21,22,26,0.75)]
      backdrop-blur-2xl border border-[rgba(255,255,255,0.06)]
      shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-[var(--color-foreground)]">{label}</span>
        {shortcut && (
          <kbd className="px-1 py-0.5 text-xs font-mono rounded bg-[rgba(255,255,255,0.06)] text-[var(--color-foreground-tertiary)] border border-[rgba(255,255,255,0.04)]">
            {shortcut}
          </kbd>
        )}
      </div>
      {desc && <div className="text-xs text-[var(--color-foreground-tertiary)] mt-0.5">{desc}</div>}
    </div>
  );
}

function ThemeDropdown({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useThemeStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 min-w-[160px] p-1.5 rounded-xl z-50
            bg-gradient-to-br from-[rgba(16,17,20,0.92)] to-[rgba(21,22,26,0.75)]
            backdrop-blur-2xl border border-[rgba(255,255,255,0.06)]
            shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          {themes.map((t) => {
            const Icon = t.icon;
            const active = theme.mode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { theme.setMode(t.id as "dark" | "cyber" | "matrix"); onClose(); }}
                className={cn(
                  "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left transition-all duration-200",
                  active
                    ? "bg-[rgba(0,180,216,0.1)] text-[var(--color-accent)]"
                    : "text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.04)]",
                )}
              >
                <Icon size={14} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{t.label}</div>
                  <div className="text-xs text-[var(--color-foreground-tertiary)]">{t.desc}</div>
                </div>
                {active && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                )}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 min-w-[220px] p-1.5 rounded-xl z-50
            bg-gradient-to-br from-[rgba(16,17,20,0.92)] to-[rgba(21,22,26,0.75)]
            backdrop-blur-2xl border border-[rgba(255,255,255,0.06)]
            shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="text-xs font-mono text-[var(--color-foreground-tertiary)] tracking-wider uppercase px-2 py-1.5">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div className="px-2 py-4 text-center text-xs text-[var(--color-foreground-tertiary)]">All clear</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-2 px-2.5 py-2 rounded-lg transition-colors",
                  !n.read && "bg-[rgba(0,180,216,0.04)]",
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[var(--color-foreground)]">{n.title}</span>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />}
                  </div>
                  <div className="text-xs text-[var(--color-foreground-tertiary)]">{n.desc}</div>
                </div>
                <span className="text-xs text-[var(--color-foreground-tertiary)] whitespace-nowrap">{n.time}</span>
              </div>
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NavigationDock() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [themeOpen, setThemeOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const ui = useUIStore();

  const homeItem = primaryItems[0];
  const navItems = primaryItems.slice(1);
  const mid = Math.ceil(navItems.length / 2);
  const leftItems = navItems.slice(0, mid);
  const rightItems = navItems.slice(mid);

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

  const allDockItems = [homeItem, ...navItems];
  const handleDockActivate = useCallback(() => {
    if (focusIndex >= 0 && focusIndex < allDockItems.length) {
      window.location.href = allDockItems[focusIndex].href;
    }
  }, [focusIndex, allDockItems]);

  useDockKeyboard(focusIndex, setFocusIndex, allDockItems.length, handleDockActivate);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getDockScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const diff = Math.abs(index - hoveredIndex);
    if (diff === 0) return 1.35;
    if (diff === 1) return 1.12;
    return 1;
  };

  return (
    <>
      <motion.nav
        ref={dockRef}
        role="navigation"
        aria-label="Main navigation"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.2 }}
        className={cn(
          "fixed bottom-5 left-1/2 -translate-x-1/2 z-50",
          "hidden md:flex items-end gap-1 px-3 py-2",
          "rounded-[var(--radius-glass-xl)]",
          "bg-gradient-to-br from-[rgba(16,17,20,0.75)] to-[rgba(21,22,26,0.55)]",
          "backdrop-blur-2xl saturate-[1.2]",
          "border border-[rgba(255,255,255,0.06)]",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]",
          scrolled && "shadow-[0_12px_48px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] bg-gradient-to-br from-[rgba(16,17,20,0.85)] to-[rgba(21,22,26,0.65)]",
        )}
        style={{ transformOrigin: "bottom center" }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.02)] via-transparent to-transparent opacity-50" />
        </div>

        {[leftItems, homeItem, rightItems].map((group, gi) => {
          if (gi === 1) {
            const item = group as DockItem;
            const Icon = item.icon;
            const active = isActive(item.href);
            const isHovered = hoveredIndex === 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-0.5 group outline-none"
                onMouseEnter={() => { setHoveredIndex(0); setFocusIndex(-1); }}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setFocusIndex(0)}
                onBlur={() => setFocusIndex(-1)}
                aria-label={`${item.label} — ${item.desc}`}
                tabIndex={0}
              >
                <motion.div
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-colors duration-300",
                    active
                      ? "text-[var(--color-accent)] bg-gradient-to-b from-[rgba(0,180,216,0.14)] to-[rgba(139,92,246,0.1)] border border-[rgba(0,180,216,0.25)]"
                      : "text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,0.06)]",
                  )}
                  animate={{
                    scale: getDockScale(0),
                    y: active ? -2 : isHovered ? -1 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon size={22} />
                  {active && (
                    <motion.div
                      layoutId="dock-active"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[rgba(0,180,216,0.08)] to-transparent"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>

                <span className={cn(
                  "text-xs font-mono whitespace-nowrap tracking-wider transition-colors duration-300",
                  active ? "text-[var(--color-accent)]" : "text-[rgba(255,255,255,0.35)]",
                )}>
                  {item.label}
                </span>

                <AnimatePresence>
                  {(isHovered || focusIndex === 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <DockTooltip label={item.label} desc={item.desc} shortcut={item.shortcut} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            );
          }

          return (group as DockItem[]).map((item, i) => {
            const idx = gi === 0 ? i + 1 : mid + i + 1;
            const Icon = item.icon;
            const active = isActive(item.href);
            const focused = focusIndex === idx;
            const isHovered = hoveredIndex === idx;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-0.5 group outline-none"
                onMouseEnter={() => { setHoveredIndex(idx); setFocusIndex(-1); }}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setFocusIndex(idx)}
                onBlur={() => setFocusIndex(-1)}
                aria-label={`${item.label} — ${item.desc}`}
                tabIndex={0}
              >
                <motion.div
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-colors duration-300",
                    active
                      ? "text-[var(--color-accent)] bg-gradient-to-b from-[rgba(0,180,216,0.12)] to-[rgba(139,92,246,0.08)] border border-[rgba(0,180,216,0.2)]"
                      : "text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.04)]",
                    focused && "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-transparent",
                  )}
                  animate={{
                    scale: getDockScale(idx),
                    y: active ? -2 : isHovered ? -1 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon size={20} />
                  {active && (
                    <motion.div
                      layoutId="dock-active"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[rgba(0,180,216,0.08)] to-transparent"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>

                <span className={cn(
                  "text-xs font-mono whitespace-nowrap tracking-wider transition-colors duration-300",
                  active ? "text-[var(--color-accent)]" : "text-[rgba(255,255,255,0.25)]",
                )}>
                  {item.label}
                </span>

                <AnimatePresence>
                  {(isHovered || focused) && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <DockTooltip label={item.label} desc={item.desc} shortcut={item.shortcut} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            );
          });
        })}

        <div className="w-px h-10 mx-1 bg-[rgba(255,255,255,0.06)]" />

        <div className="flex items-center gap-1">
          <DockIconButton
            icon={IconSearch}
            label="Search"
            desc="Search across the portfolio"
            shortcut="Ctrl+/"
            onClick={() => ui.setSearchOpen(true)}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            index={99}
          />

          <DockIconButton
            icon={IconRobot}
            label="AI Assistant"
            desc="Ask questions about my work"
            shortcut="⌘A"
            onClick={() => ui.setAiAssistantOpen(true)}
            hoverColor="rgba(139,92,246,0.6)"
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            index={100}
          />

          <DockIconButton
            icon={IconTerminal2}
            label="Terminal"
            desc="Interactive command interface"
            shortcut="⌘T"
            onClick={() => ui.setHackerTerminalOpen(true)}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            index={101}
          />

          <div className="relative">
            <DockIconButton
              icon={IconPalette}
              label="Theme"
              desc="Change visual theme"
              onClick={() => { setThemeOpen(!themeOpen); setNotifOpen(false); }}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              index={102}
            />
            <ThemeDropdown open={themeOpen} onClose={() => setThemeOpen(false)} />
          </div>

          <div className="relative">
            <DockIconButton
              icon={IconBell}
              label="Notifications"
              desc="Recent activity alerts"
              onClick={() => { setNotifOpen(!notifOpen); setThemeOpen(false); }}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              index={103}
              badge={notifications.filter((n) => !n.read).length.toString()}
            />
            <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          <DockIconButton
            icon={IconUserShield}
            label="Hire Me"
            desc="Toggle recruiter-friendly mode"
            onClick={() => ui.toggleRecruiterMode()}
            active={ui.recruiterMode}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            index={104}
          />

          <Link
            href="/settings"
            className="relative flex flex-col items-center gap-0.5 group"
            onMouseEnter={() => setHoveredIndex(105)}
            onMouseLeave={() => setHoveredIndex(null)}
            aria-label="Settings"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
              <IconSettings size={20} />
            </div>
            <span className="text-xs text-[rgba(255,255,255,0.25)] font-mono tracking-wider">Settings</span>
          </Link>
        </div>
      </motion.nav>

      <MobileNav pathname={pathname} />
    </>
  );
}

function DockIconButton({
  icon: Icon,
  label,
  desc,
  shortcut,
  onClick,
  active,
  hoverColor,
  hoveredIndex,
  setHoveredIndex,
  index,
  badge,
}: {
  icon: typeof IconHome;
  label: string;
  desc?: string;
  shortcut?: string;
  onClick: () => void;
  active?: boolean;
  hoverColor?: string;
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
  index: number;
  badge?: string;
}) {
  const isHovered = hoveredIndex === index;
  return (
    <div className="relative flex flex-col items-center gap-0.5 group">
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        whileTap={{ scale: 0.92 }}
        aria-label={`${label}${desc ? ` — ${desc}` : ""}`}
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-2xl transition-colors duration-300 relative",
          active
            ? "bg-[rgba(0,180,216,0.08)] border border-[rgba(0,180,216,0.15)] text-[var(--color-accent)]"
            : "text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.04)]",
        )}
        animate={{
          scale: hoveredIndex === null ? 1 : isHovered ? 1.35 : Math.abs(index - (hoveredIndex ?? index)) === 1 ? 1.12 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={hoverColor && isHovered ? { color: hoverColor } : undefined}
      >
        <Icon size={20} />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-mono text-white font-bold">
            {badge}
          </span>
        )}
      </motion.button>
      <span className={cn(
        "text-xs font-mono tracking-wider transition-colors duration-300",
        active ? "text-[var(--color-accent)]" : "text-[rgba(255,255,255,0.25)]",
      )}>
        {label === "Hire Me" ? (active ? "Hiring" : "Hire Me") : label === "Theme" ? "Theme" : label === "Notifications" ? "Alerts" : label}
      </span>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <DockTooltip label={label} desc={desc} shortcut={shortcut} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

  const mobileItems = primaryItems.slice(0, 5);

  return (
    <motion.div
      animate={{ y: visible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="flex items-center justify-around px-2 py-2 rounded-t-2xl
        bg-gradient-to-br from-[rgba(16,17,20,0.88)] to-[rgba(21,22,26,0.7)]
        backdrop-blur-2xl border-t border-[rgba(255,255,255,0.06)]
        shadow-[0_-4px_24px_rgba(0,0,0,0.3)]"
      >
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
"flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl transition-all duration-200",
                 active
                  ? "text-[var(--color-accent)] bg-[rgba(0,180,216,0.06)]"
                  : "text-[rgba(255,255,255,0.3)] active:text-[rgba(255,255,255,0.5)]",
              )}
            >
              <Icon size={20} />
              <span className="text-xs font-mono tracking-wider">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => ui.setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl text-[rgba(255,255,255,0.3)] active:text-[rgba(255,255,255,0.5)]"
          aria-label="More options"
        >
          <IconDotsVertical size={20} />
          <span className="text-xs font-mono tracking-wider">More</span>
        </button>
      </div>

      <AnimatePresence>
        {ui.mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[rgba(8,9,12,0.95)] backdrop-blur-xl flex flex-col"
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6">
              <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {[...primaryItems].map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => ui.setMobileMenuOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all",
                        active
                          ? "text-[var(--color-accent)] bg-[rgba(0,180,216,0.08)] border border-[rgba(0,180,216,0.15)]"
                          : "text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)]",
                      )}
                    >
                      <Icon size={22} />
                      <span className="text-xs font-mono text-center leading-tight">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="w-full max-w-xs flex gap-2">
                <button
                  onClick={() => { ui.setMobileMenuOpen(false); ui.setSearchOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  <IconSearch size={14} />
                  Search
                </button>
                <button
                  onClick={() => { ui.setMobileMenuOpen(false); ui.setHackerTerminalOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  <IconTerminal2 size={14} />
                  Terminal
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { ui.toggleRecruiterMode(); ui.setMobileMenuOpen(false); }}
                  className={cn(
                    "flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-mono transition-colors",
                    ui.recruiterMode
                      ? "bg-[rgba(0,180,216,0.1)] border border-[rgba(0,180,216,0.2)] text-[var(--color-accent)]"
                      : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-secondary)]",
                  )}
                >
                  <IconUserShield size={14} />
                  {ui.recruiterMode ? "Recruiter Mode On" : "Recruiter Mode"}
                </button>
                <Link
                  href="/settings"
                  onClick={() => ui.setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  <IconSettings size={14} />
                  Settings
                </Link>
              </div>
            </div>

            <button
              onClick={() => ui.setMobileMenuOpen(false)}
              className="py-4 text-xs text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.5)] transition-colors text-center"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
