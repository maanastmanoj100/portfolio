"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  IconShieldExclamation, IconGlobe, IconFlag, IconServer, IconShieldCheck,
  IconCode, IconUsers, IconCpu, IconStar,
  IconFileText, IconBrain, IconCertificate, IconChartBar, IconHistory, IconUserSearch,
  IconNetwork, IconBooks, IconNews, IconMessage, IconTrophy,
  IconLayoutGrid,
  IconDeviceGamepad2,
  IconMail, IconUserSearch as IconRecruiter, IconInfoCircle,
  IconSearch,
  IconX,
} from "@tabler/icons-react";

interface AppItem {
  id: string;
  label: string;
  href: string;
  icon: typeof IconCode;
  desc: string;
}

interface Category {
  id: string;
  label: string;
  icon: typeof IconShieldExclamation;
  color: string;
  apps: AppItem[];
}

const CATEGORIES: Category[] = [
  {
    id: "security",
    label: "Security & Defense",
    icon: IconShieldExclamation,
    color: "from-cyan-500/20 to-blue-500/10",
    apps: [
      { id: "command-center", label: "Command Center", href: "/command-center", icon: IconShieldExclamation, desc: "SOC + NOC + OSINT fusion" },
      { id: "threat-map", label: "Threat Map", href: "/attack-map", icon: IconGlobe, desc: "Global attack visualization" },
      { id: "ctf-range", label: "CTF Range", href: "/ctf-command-center", icon: IconFlag, desc: "CTF & cyber range" },
      { id: "cyber-lab", label: "Cyber Lab", href: "/cyber-lab", icon: IconServer, desc: "Lab infrastructure" },
      { id: "security-architect", label: "Security Architect", href: "/security-architect", icon: IconShieldCheck, desc: "Architecture & threat modeling" },
    ],
  },
  {
    id: "development",
    label: "Development & Engineering",
    icon: IconCode,
    color: "from-purple-500/20 to-pink-500/10",
    apps: [
      { id: "engineering", label: "Engineering", href: "/engineering", icon: IconCode, desc: "Platform engineering & quality" },
      { id: "collaboration", label: "Collaboration", href: "/collaboration", icon: IconUsers, desc: "OSS ecosystem & community" },
      { id: "project-architect", label: "Project Architect", href: "/project-architect", icon: IconCpu, desc: "AI project generator" },
      { id: "competency", label: "Competency Matrix", href: "/competency-matrix", icon: IconStar, desc: "Skill progression engine" },
    ],
  },
  {
    id: "career",
    label: "Career & Growth",
    icon: IconChartBar,
    color: "from-emerald-500/20 to-teal-500/10",
    apps: [
      { id: "resume", label: "Resume", href: "/resume", icon: IconFileText, desc: "Experience & education" },
      { id: "skills", label: "Skills", href: "/skills", icon: IconBrain, desc: "Technical expertise" },
      { id: "certs", label: "Certifications", href: "/certifications", icon: IconCertificate, desc: "Industry credentials" },
      { id: "analytics", label: "Career Analytics", href: "/career-analytics", icon: IconChartBar, desc: "Career analytics" },
      { id: "timeline", label: "Career Timeline", href: "/career-timeline", icon: IconHistory, desc: "Learning journey" },
      { id: "career-intel", label: "Career Intel", href: "/career-intelligence", icon: IconChartBar, desc: "Role intelligence & skill gaps" },
      { id: "interview", label: "Interview Simulator", href: "/interview-simulator", icon: IconBrain, desc: "AI interview practice" },
    ],
  },
  {
    id: "knowledge",
    label: "Knowledge & Research",
    icon: IconNetwork,
    color: "from-blue-500/20 to-indigo-500/10",
    apps: [
      { id: "knowledge-graph", label: "Knowledge Graph", href: "/knowledge-graph", icon: IconNetwork, desc: "Knowledge graph" },
      { id: "wiki", label: "Wiki", href: "/wiki", icon: IconBooks, desc: "Learning encyclopedia" },
      { id: "blog", label: "Blog", href: "/blog", icon: IconNews, desc: "Security research" },
      { id: "cyber-persona", label: "Cyber Persona", href: "/cyber-persona", icon: IconMessage, desc: "AI digital twin" },
      { id: "achievements", label: "Achievements", href: "/achievements", icon: IconTrophy, desc: "Badges & missions" },
    ],
  },
  {
    id: "systems",
    label: "Systems & Tools",
    icon: IconLayoutGrid,
    color: "from-amber-500/20 to-orange-500/10",
    apps: [
      { id: "cyber-os", label: "Cyber OS", href: "/cyber-os", icon: IconLayoutGrid, desc: "Desktop OS environment" },
    ],
  },
  {
    id: "games",
    label: "Games & Arcade",
    icon: IconDeviceGamepad2,
    color: "from-rose-500/20 to-pink-500/10",
    apps: [
      { id: "arcade", label: "Arcade", href: "/arcade", icon: IconDeviceGamepad2, desc: "Logic, puzzle, cyber & mini games" },
    ],
  },
  {
    id: "connect",
    label: "Connect",
    icon: IconMail,
    color: "from-cyan-500/20 to-teal-500/10",
    apps: [
      { id: "contact", label: "Contact", href: "/contact", icon: IconMail, desc: "Get in touch" },
      { id: "recruiter", label: "Recruiter Hub", href: "/recruiter", icon: IconRecruiter, desc: "Recruiter experience platform" },
      { id: "about", label: "About", href: "/about", icon: IconInfoCircle, desc: "About Cyber Nexus" },
    ],
  },
];

const ALL_APPS = CATEGORIES.flatMap((c) => c.apps);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export function Launchpad() {
  const { launchpadOpen, setLaunchpadOpen } = useUIStore();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (launchpadOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [launchpadOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && launchpadOpen) setLaunchpadOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [launchpadOpen, setLaunchpadOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return CATEGORIES;
    const q = query.toLowerCase();
    return CATEGORIES.map((cat) => ({
      ...cat,
      apps: cat.apps.filter(
        (app) =>
          app.label.toLowerCase().includes(q) ||
          app.desc.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.apps.length > 0);
  }, [query]);

  return (
    <AnimatePresence>
      {launchpadOpen && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[rgba(8,9,12,0.85)] backdrop-blur-2xl"
            onClick={() => setLaunchpadOpen(false)}
          />

          {/* Close button */}
          <button
            onClick={() => setLaunchpadOpen(false)}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,0.1)] transition-all"
            aria-label="Close launchpad"
          >
            <IconX size={20} />
          </button>

          {/* Search */}
          <div className="relative z-10 flex justify-center pt-16 pb-6 px-4">
            <div className="relative w-full max-w-md">
              <IconSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search apps..."
                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[var(--color-foreground)] placeholder-[rgba(255,255,255,0.3)] text-sm outline-none focus:border-[rgba(0,180,216,0.3)] focus:bg-[rgba(255,255,255,0.07)] transition-all"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto px-6 pb-12">
            <div className="mx-auto max-w-5xl">
              {filtered.map((category) => {
                const CatIcon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    className="mb-8"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br border border-[rgba(255,255,255,0.06)]",
                        category.color,
                      )}>
                        <CatIcon size={16} className="text-[rgba(255,255,255,0.7)]" />
                      </div>
                      <h2 className="text-sm font-semibold text-[var(--color-foreground)] tracking-wide">
                        {category.label}
                      </h2>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                      {category.apps.map((app) => {
                        const AppIcon = app.icon;
                        const active = pathname === app.href || (app.href !== "/" && pathname.startsWith(app.href));
                        return (
                          <Link
                            key={app.id}
                            href={app.href}
                            onClick={() => setLaunchpadOpen(false)}
                            className={cn(
                              "flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all duration-200 group",
                              active
                                ? "bg-[rgba(0,180,216,0.08)] border border-[rgba(0,180,216,0.15)]"
                                : "hover:bg-[rgba(255,255,255,0.04)] border border-transparent",
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br border border-[rgba(255,255,255,0.06)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
                              active
                                ? "from-cyan-500/20 to-purple-500/10 border-[rgba(0,180,216,0.2)] text-[var(--color-accent)]"
                                : "from-[rgba(255,255,255,0.04)] to-[rgba(255,255,255,0.02)] text-[rgba(255,255,255,0.5)] group-hover:text-[rgba(255,255,255,0.8)]",
                            )}>
                              <AppIcon size={22} />
                            </div>
                            <span className={cn(
                              "text-xs font-medium text-center leading-tight transition-colors",
                              active ? "text-[var(--color-accent)]" : "text-[rgba(255,255,255,0.5)] group-hover:text-[rgba(255,255,255,0.8)]",
                            )}>
                              {app.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <IconSearch size={40} className="text-[rgba(255,255,255,0.15)] mb-4" />
                  <p className="text-sm text-[rgba(255,255,255,0.3)]">No apps found for &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
