"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PageTransition } from "@/components/layout/page-transition";
import { useUIStore } from "@/stores/ui-store";
import { projects, PROJECT_CATEGORIES } from "@/data/projects";
import type { Project, ProjectCategoryId } from "@/types";
import {
  IconSearch, IconFilter, IconArrowUpRight, IconBrandGithub,
  IconExternalLink, IconFileText, IconClock, IconStar, IconEye,
  IconCode, IconFlask, IconShield, IconX, IconList, IconLayoutGrid,
  IconSortAscending, IconGlobe, IconBook, IconBrain, IconServer,
  IconTerminal2, IconLock, IconFlame, IconRadar, IconCloud,
  IconBolt, IconFlag, IconCpu, IconDeviceMobile, IconLink, IconCheck,
  IconAlertTriangle, IconArrowRight,
} from "@tabler/icons-react";

const iconMap: Record<string, typeof IconShield> = {
  globe: IconGlobe, shield: IconShield, radar: IconRadar, cloud: IconCloud,
  brain: IconBrain, search: IconEye, code: IconCode, eye: IconEye,
  flag: IconFlag,   zap: IconBolt, cpu: IconCpu, book: IconBook,
  server: IconServer, terminal: IconTerminal2, lock: IconLock,
  flame: IconFlame, check: IconCheck, link: IconLink, smartphone: IconDeviceMobile,
  network: IconFlask,
};

const sortOptions = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "popular", label: "Most Popular" },
  { id: "complex", label: "Most Complex" },
  { id: "alpha", label: "A-Z" },
  { id: "recruiter", label: "Recruiter Pick" },
] as const;

type SortId = (typeof sortOptions)[number]["id"];

function AnimatedCounter({ value, suffix = "", prefix = "", duration = 1.5 }: { value: string; suffix?: string; prefix?: string; duration?: number }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parseInt(value.replace(/[^0-9]/g, ""));
  const isNumeric = !isNaN(parsed);

  useEffect(() => {
    if (!isNumeric) { setDisplay(value); return; }
    let start = 0;
    const end = parsed;
    const stepTime = Math.max(16, (duration * 1000) / end);
    const timer = setInterval(() => {
      start += Math.ceil(end / 60);
      if (start >= end) { start = end; clearInterval(timer); }
      setDisplay(start.toLocaleString());
    }, stepTime);
    return () => clearInterval(timer);
  }, [value, parsed, isNumeric, duration]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function RecruiterSimplifiedView() {
  return (
    <div className="glass-card p-6 recruiter-highlight">
      <div className="max-w-2xl mx-auto text-center">
        <IconShield size={24} className="text-cyan mx-auto mb-3" />
        <h2 className="text-lg font-medium text-foreground mb-2">Project Command Center</h2>
        <p className="text-sm text-foreground-secondary mb-4 leading-relaxed">
          This section showcases production-ready cybersecurity projects spanning AI/ML security,
          SOC engineering, network defense, vulnerability research, penetration testing, and full-stack
          security development. Each project demonstrates real technical capability and problem-solving.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {[
            { label: "Projects", value: `${projects.length}+` },
            { label: "Languages", value: [...new Set(projects.flatMap((p) => p.languages))].length.toString() },
            { label: "Technologies", value: [...new Set(projects.flatMap((p) => p.techStack.map((t) => t.name)))].length.toString() },
            { label: "CVEs", value: "12+" },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-white/5 border border-border/40">
              <div className="text-xs text-cyan font-mono uppercase tracking-wider mb-1">{item.label}</div>
              <div className="text-xs text-foreground-secondary">{item.value}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-foreground-tertiary mt-4 italic">
          Switch to Expert mode in the command bar for full technical detail, architecture views, and security analysis.
        </p>
      </div>
    </div>
  );
}

function HeroSection() {
  const featured = projects.find((p) => p.featured && p.featuredRank === 1)!;

  const stats = useMemo(() => [
    { label: "Total Projects", value: projects.length.toString(), icon: IconCode, color: "#06b6d4" },
    { label: "CVEs Discovered", value: "12", suffix: "+", icon: IconFlask, color: "#ef4444" },
    { label: "Technologies", value: [...new Set(projects.flatMap((p) => p.techStack.map((t) => t.name)))].length.toString(), icon: IconStar, color: "#f59e0b" },
    { label: "GitHub Stars", value: projects.reduce((s, p) => s + (p.stars || 0), 0).toLocaleString(), icon: IconEye, color: "#10b981" },
    { label: "Open Source", value: projects.filter((p) => p.openSource).length.toString(), suffix: " repos", icon: IconBook, color: "#8b5cf6" },
    { label: "Research Papers", value: "8", suffix: "+", icon: IconFileText, color: "#f97316" },
  ], []);

  return (
    <div className="mb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="text-xs text-cyan font-mono tracking-wider uppercase">.projects</span>
        <h1 className="text-3xl sm:text-5xl font-light text-foreground mt-2">
          Project <span className="text-gradient font-medium">Command Center</span>
        </h1>
        <p className="text-sm text-foreground-secondary mt-2 max-w-2xl leading-relaxed">
          Explore production-ready cybersecurity projects — penetration testing labs, AI security research,
          SOC engineering, vulnerability research, and full-stack development work.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="glass-card p-3 text-center"
            >
              <Icon size={16} className="mx-auto mb-1" style={{ color: stat.color }} />
              <div className="text-base sm:text-lg font-mono font-medium" style={{ color: stat.color }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix || ""} />
              </div>
              <div className="text-xs text-foreground-tertiary font-mono mt-0.5">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6"
      >
        <Link href={`/projects/${featured.id}`}>
          <div className="relative group cursor-pointer overflow-hidden rounded-xl border border-cyan/20 bg-gradient-to-br from-cyan/5 via-blue/5 to-purple/5 hover:border-cyan/40 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-cyan bg-cyan/10 px-1.5 py-0.5 rounded border border-cyan/20">FLAGSHIP PROJECT</span>
                  <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">EXPERT</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-foreground">{featured.title}</h2>
                <p className="text-xs text-foreground-secondary mt-1 line-clamp-2">{featured.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {featured.tags.slice(0, 5).map((t) => (
                    <span key={t} className="text-xs font-mono text-foreground-tertiary bg-white/5 px-1.5 py-0.5 rounded border border-border/30">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-lg font-mono font-medium text-cyan"><AnimatedCounter value={featured.metrics[0].value} suffix={featured.metrics[0].suffix || ""} /></div>
                  <div className="text-xs text-foreground-tertiary font-mono">{featured.metrics[0].label}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-cyan border border-cyan/30 rounded-lg px-3 py-2 group-hover:bg-cyan/10 transition-colors">
                  <span>Launch</span>
                  <IconArrowUpRight size={12} />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const catColor = PROJECT_CATEGORIES.find((c) => c.id === project.category)?.color || "#06b6d4";
  const difficultyColor = project.difficulty === "expert" ? "#ef4444" : project.difficulty === "advanced" ? "#f97316" : project.difficulty === "intermediate" ? "#eab308" : "#3b82f6";
  const statusColor = project.status === "completed" ? "#10b981" : project.status === "in_progress" ? "#f59e0b" : project.status === "maintenance" ? "#3b82f6" : "#6b7280";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/projects/${project.id}`}>
        <div className="group relative h-full rounded-xl border border-border/30 bg-white/[0.015] hover:border-cyan/20 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-cyan/[0.02] group-hover:via-transparent group-hover:to-purple/[0.02] transition-all duration-500" />
          <div className="relative p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {(() => {
                  const CatIcon = iconMap[PROJECT_CATEGORIES.find((c) => c.id === project.category)?.icon || "shield"] || IconShield;
                  return <CatIcon size={12} style={{ color: catColor }} className="shrink-0" />;
                })()}
                <span className="text-xs font-mono truncate" style={{ color: catColor }}>{PROJECT_CATEGORIES.find((c) => c.id === project.category)?.label || project.category}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                <span className="text-xs font-mono text-foreground-tertiary capitalize">{project.status}</span>
              </div>
            </div>

            <h3 className="text-sm font-medium text-foreground group-hover:text-cyan transition-colors mb-1">{project.title}</h3>
            <p className="text-xs text-foreground-secondary leading-relaxed mb-3 line-clamp-2 flex-1">{project.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags.slice(0, 4).map((t) => (
                <span key={t} className="text-xs font-mono text-foreground-tertiary bg-white/5 px-1 py-0.5 rounded border border-border/20">{t}</span>
              ))}
              {project.tags.length > 4 && <span className="text-xs font-mono text-foreground-tertiary">+{project.tags.length - 4}</span>}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-1 py-0.5 rounded" style={{ background: `${difficultyColor}15`, color: difficultyColor, border: `1px solid ${difficultyColor}30` }}>{project.difficulty}</span>
                {project.openSource && <IconBrandGithub size={10} className="text-foreground-tertiary" />}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-foreground-tertiary font-mono">
                {project.metrics[0] && <span>{project.metrics[0].value}{project.metrics[0].suffix || ""}</span>}
                <IconArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ProjectCategoryId[]>([]);
  const [sortBy, setSortBy] = useState<SortId>("newest");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const recruiterMode = useUIStore((s) => s.recruiterMode);

  const toggleCategory = useCallback((id: ProjectCategoryId) => {
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }, []);

  const filtered = useMemo(() => {
    let result = [...projects];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.languages.some((l) => l.toLowerCase().includes(q)) ||
        p.techStack.some((t) => t.name.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category) || p.secondaryCategories?.some((sc) => selectedCategories.includes(sc)));
    }

    if (difficultyFilter !== "all") {
      result = result.filter((p) => p.difficulty === difficultyFilter);
    }

    switch (sortBy) {
      case "newest": result.sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()); break;
      case "oldest": result.sort((a, b) => new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime()); break;
      case "popular": result.sort((a, b) => (b.stars || 0) - (a.stars || 0)); break;
      case "complex": result.sort((a, b) => { const order = { high: 3, medium: 2, low: 1 }; return (order[b.complexity || "medium"] || 0) - (order[a.complexity || "medium"] || 0); }); break;
      case "alpha": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "recruiter": result.sort((a, b) => (a.stars || 0) - (b.stars || 0)); break;
    }

    return result;
  }, [searchQuery, selectedCategories, difficultyFilter, sortBy]);

  if (recruiterMode) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <RecruiterSimplifiedView />
            <div className="mt-6 space-y-3">
              {projects.map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`}>
                  <div className="glass-card p-4 hover:border-cyan/20 transition-all group">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-medium text-foreground group-hover:text-cyan transition-colors">{p.title}</div>
                        <div className="text-xs text-foreground-secondary mt-0.5 line-clamp-1">{p.description}</div>
                      </div>
                      <IconArrowUpRight size={14} className="text-foreground-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-foreground-tertiary font-mono">
                      <span>{p.difficulty}</span>
                      <span>{p.completionDate}</span>
                      <span>{p.duration}</span>
                      {p.stars && <span>{p.stars} ★</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <HeroSection />

          <div className="glass-card p-3 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 border border-border/40 flex-1 min-w-[160px] max-w-[280px]">
                <IconSearch size={12} className="text-foreground-tertiary shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, technologies, tools..."
                  className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-foreground-tertiary/50"
                />
              </div>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="text-xs bg-white/5 border border-border/40 rounded-lg px-2 py-1.5 text-foreground-tertiary outline-none font-mono"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>

              <div className="flex items-center gap-0.5 border border-border/40 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-cyan/10 text-cyan" : "text-foreground-tertiary hover:text-foreground"}`}>
                  <IconLayoutGrid size={14} />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-cyan/10 text-cyan" : "text-foreground-tertiary hover:text-foreground"}`}>
                  <IconList size={14} />
                </button>
              </div>

              <div className="flex items-center gap-1 border border-border/40 rounded-lg px-2 py-1">
                <IconSortAscending size={11} className="text-foreground-tertiary" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortId)} className="text-xs bg-transparent text-foreground-tertiary outline-none font-mono">
                  {sortOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
              </div>

              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1 text-xs font-mono px-2 py-1.5 rounded-lg border transition-colors ${showFilters ? "bg-cyan/10 border-cyan/20 text-cyan" : "bg-white/5 border-border/40 text-foreground-tertiary hover:text-foreground"}`}>
                <IconFilter size={11} />
                Categories
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-border/30">
                    {PROJECT_CATEGORIES.map((cat) => {
                      const active = selectedCategories.includes(cat.id as ProjectCategoryId);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id as ProjectCategoryId)}
                          className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-lg border transition-all ${
                            active
                              ? "border-current bg-current/10 text-current"
                              : "border-border/30 text-foreground-tertiary hover:text-foreground hover:border-border/60"
                          }`}
                          style={active ? { color: cat.color, borderColor: cat.color } : undefined}
                        >
                          {(() => {
                            const CatIcon = iconMap[cat.icon] || IconShield;
                            return <CatIcon size={10} />;
                          })()}
                          {cat.label}
                        </button>
                      );
                    })}
                    {selectedCategories.length > 0 && (
                      <button onClick={() => setSelectedCategories([])} className="text-xs font-mono text-foreground-tertiary hover:text-foreground px-2 py-1">
                        Clear all
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-foreground-tertiary">
              {filtered.length} of {projects.length} projects
            </span>
            {filtered.length !== projects.length && (
              <button onClick={() => { setSearchQuery(""); setSelectedCategories([]); setDifficultyFilter("all"); }} className="text-xs font-mono text-cyan hover:text-cyan/80 transition-colors">
                Reset filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <IconSearch size={24} className="mx-auto mb-3 text-foreground-tertiary/50" />
              <p className="text-sm text-foreground-tertiary">No projects match your criteria</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCategories([]); setDifficultyFilter("all"); }} className="text-xs text-cyan hover:text-cyan/80 mt-2">
                Reset all filters
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              : "space-y-2"
            }>
              {filtered.map((project, i) => (
                viewMode === "grid"
                  ? <ProjectCard key={project.id} project={project} index={i} />
                  : (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="group flex items-center gap-3 p-3 rounded-lg border border-border/20 hover:border-cyan/20 transition-all bg-white/[0.01]"
                      >
                        <div className="w-1 h-8 rounded-full shrink-0" style={{ background: PROJECT_CATEGORIES.find((c) => c.id === project.category)?.color || "#06b6d4" }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground font-medium group-hover:text-cyan transition-colors">{project.title}</span>
                            <span className={`text-xs font-mono px-1 py-0.5 rounded ${
                              project.difficulty === "expert" ? "text-red-400 bg-red-500/10" :
                              project.difficulty === "advanced" ? "text-orange-400 bg-orange-500/10" :
                              "text-yellow-400 bg-yellow-500/10"
                            }`}>{project.difficulty}</span>
                          </div>
                          <p className="text-xs text-foreground-tertiary truncate">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-foreground-tertiary font-mono shrink-0">
                          {project.stars && <span>★ {project.stars}</span>}
                          <span>{project.completionDate}</span>
                        </div>
                        <IconArrowUpRight size={12} className="text-foreground-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </motion.div>
                    </Link>
                  )
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
