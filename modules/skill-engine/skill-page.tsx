"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  IconBrain, IconCode, IconSearch, IconX, IconChevronDown, IconChevronUp,
  IconStar, IconCheck, IconClock, IconArrowRight, IconExternalLink,
  IconFolder, IconBook, IconFlag, IconServer, IconNews, IconBrandGithub,
  IconChartBar, IconShield, IconNetwork, IconCloud, IconLock,
  IconTerminal2, IconDatabase, IconDeviceDesktop, IconCategory, IconRocket,
  IconCpu, IconTools, IconAward, IconFileText, IconCrown,
} from "@tabler/icons-react";
import {
  skills, roles, techStacks,
  CATEGORY_LABELS, SkillCategory, getTotalEvidenceCount, getActiveSkillCount,
  getSkillsByCategory, getSkillById, type SkillEntry, type LearningStatus,
} from "./skill-data";

const SECTION_IDS = {
  hero: "competency-hero",
  overview: "competency-overview",
  matrix: "competency-matrix-section",
  explorer: "competency-explorer",
  roles: "competency-roles",
  stacks: "competency-stacks",
  timeline: "competency-timeline",
  advisor: "competency-advisor",
};

const STATUS_CONFIG: Record<LearningStatus, { label: string; color: string; icon: typeof IconStar; desc: string }> = {
  mastered: { label: "Mastered", color: "text-green-400 bg-green-400/10", icon: IconCrown, desc: "Deep expertise with extensive cross-referenced evidence" },
  active: { label: "Active", color: "text-cyan-400 bg-cyan-400/10", icon: IconRocket, desc: "Currently developing with growing evidence base" },
  maintaining: { label: "Maintaining", color: "text-amber-400 bg-amber-400/10", icon: IconStar, desc: "Solid foundation with periodic practice" },
  planning: { label: "Planning", color: "text-purple-400 bg-purple-400/10", icon: IconClock, desc: "On the roadmap for upcoming development" },
};
function HeroSection() {
  const stats = useMemo(() => [
    { icon: <IconBrain size={20} />, label: "Skills", value: skills.length },
    { icon: <IconCategory size={20} />, label: "Categories", value: Object.keys(CATEGORY_LABELS).length },
    { icon: <IconChartBar size={20} />, label: "Evidence Items", value: getTotalEvidenceCount() },
    { icon: <IconCrown size={20} />, label: "Mastered", value: skills.filter((s) => s.learningStatus === "mastered").length },
    { icon: <IconRocket size={20} />, label: "Active", value: getActiveSkillCount() },
    { icon: <IconClock size={20} />, label: "Planning", value: skills.filter((s) => s.learningStatus === "planning").length },
  ], []);

  return (
    <section id={SECTION_IDS.hero} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <IconChartBar size={14} />Chapter 27 — Skill Progression Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Competency Matrix
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Evidence-based skill mapping across 12 domains — every proficiency links to verifiable projects, certifications, labs, CTFs, and publications. Replaces arbitrary percentages with auditable competency markers.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => document.getElementById(SECTION_IDS.matrix)?.scrollIntoView({ behavior: "smooth" })}>
              View Matrix
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById(SECTION_IDS.roles)?.scrollIntoView({ behavior: "smooth" })}>
              Role Compatibility
            </Button>
            <Button variant="ghost" size="lg" onClick={() => document.getElementById(SECTION_IDS.advisor)?.scrollIntoView({ behavior: "smooth" })}>
              AI Advisor
            </Button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-12">
          {stats.map((stat) => (
            <GlassCard key={stat.label} glow="cyan" intensity="low" variant="small" className="text-center">
              <div className="flex justify-center mb-1 text-cyan-400">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
function OverviewSection() {
  const statuses: LearningStatus[] = ["mastered", "active", "maintaining", "planning"];

  return (
    <section id={SECTION_IDS.overview} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Competency Overview</h2>
        <p className="text-muted-foreground mb-8">Skill distribution across learning statuses — each level backed by cross-referenced evidence from projects, certifications, labs, and publications.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statuses.map((status) => {
            const config = STATUS_CONFIG[status];
            const Icon = config.icon;
            const count = skills.filter((s) => s.learningStatus === status).length;
            const totalEvidence = skills.filter((s) => s.learningStatus === status).reduce((sum, s) => sum + s.evidenceCount, 0);
            return (
              <GlassCard key={status}
                glow={status === "mastered" ? "green" : status === "active" ? "cyan" : status === "maintaining" ? "amber" : "purple"}
                intensity="low" className="text-center">
                <div className="flex justify-center mb-2">{Icon && <Icon size={28} className={cn(config.color.split(" ")[0])} />}</div>
                <div className="text-3xl font-bold text-white mb-1">{count}</div>
                <div className="text-sm text-muted-foreground mb-1">{config.label}</div>
                <div className="text-xs text-muted-foreground">{totalEvidence} evidence items</div>
                <div className="mt-2 flex justify-center">
                  <div className="h-1.5 w-full max-w-[120px] rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full",
                        status === "mastered" ? "bg-green-500" : status === "active" ? "bg-cyan-500" : status === "maintaining" ? "bg-amber-500" : "bg-purple-500")}
                      initial={{ width: 0 }} animate={{ width: `${(count / skills.length) * 100}%` }} transition={{ duration: 0.8 }} />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function SkillRow({ skill, index }: { skill: SkillEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[skill.learningStatus];
  const StatusIcon = config.icon;
  const categoryLabel = CATEGORY_LABELS[skill.category];
  const totalEvidence = skill.evidenceCount;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}>
      <GlassCard glow={expanded ? "cyan" : "none"} intensity="low" className="mb-2">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <IconCode size={16} className="text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{skill.name}</span>
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full", config.color)}>
                <StatusIcon size={10} className="inline mr-0.5" />
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{categoryLabel}</span>
              <span>·</span>
              <span>Since {skill.firstLearned}</span>
              <span>·</span>
              <span>{totalEvidence} evidence items</span>
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 shrink-0">
            {expanded ? "Less" : "Details"} {expanded ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}
          </button>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-3 border-t border-white/5 mt-3 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{skill.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {skill.evidence.projects.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-cyan-400 mb-1">
                        <IconFolder size={10} />Projects ({skill.evidence.projects.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skill.evidence.projects.map((p) => (
                          <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skill.evidence.certifications.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-purple-400 mb-1">
                        <IconAward size={10} />Certs ({skill.evidence.certifications.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skill.evidence.certifications.map((c) => (
                          <span key={c} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skill.evidence.labs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-green-400 mb-1">
                        <IconServer size={10} />Labs ({skill.evidence.labs.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skill.evidence.labs.map((l) => (
                          <span key={l} className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">{l}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skill.evidence.ctfs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-amber-400 mb-1">
                        <IconFlag size={10} />CTFs ({skill.evidence.ctfs.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skill.evidence.ctfs.map((c) => (
                          <span key={c} className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skill.evidence.blogPosts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-blue-400 mb-1">
                        <IconNews size={10} />Blog Posts ({skill.evidence.blogPosts.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skill.evidence.blogPosts.map((b) => (
                          <span key={b} className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{b}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skill.evidence.articles.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-purple-400 mb-1">
                        <IconBook size={10} />Articles ({skill.evidence.articles.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skill.evidence.articles.map((a) => (
                          <span key={a} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {skill.evidence.githubRepos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                        <IconBrandGithub size={10} />GitHub ({skill.evidence.githubRepos.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skill.evidence.githubRepos.map((r) => (
                          <span key={r.name} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{r.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {skill.relatedSkills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <IconNetwork size={10} />Related Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skill.relatedSkills.map((rs) => (
                        <span key={rs} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">{rs}</span>
                      ))}
                    </div>
                  </div>
                )}
                {skill.futureGoals.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <IconRocket size={10} />Future Goals
                    </div>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                      {skill.futureGoals.map((g) => <li key={g}>{g}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
function MatrixSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LearningStatus | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | "All">("All");

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "All" && s.learningStatus !== statusFilter) return false;
      if (categoryFilter !== "All" && s.category !== categoryFilter) return false;
      return true;
    });
  }, [search, statusFilter, categoryFilter]);

  const statuses: Array<LearningStatus | "All"> = ["All", "mastered", "active", "maintaining", "planning"];

  return (
    <section id={SECTION_IDS.matrix} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Skill Mastery Matrix</h2>
        <p className="text-muted-foreground mb-8">Interactive skill matrix with evidence-backed competency markers. Each skill links to verifiable work products — no arbitrary percentages.</p>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                <IconX size={14} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {statuses.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("text-xs px-2.5 py-1.5 rounded-lg border transition-colors",
                  statusFilter === s
                    ? s === "All"
                      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                      : cn("border-current", STATUS_CONFIG[s as LearningStatus].color)
                    : "border-white/10 text-muted-foreground hover:text-white")}>
                {s === "All" ? "All" : STATUS_CONFIG[s as LearningStatus].label}
              </button>
            ))}
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as SkillCategory | "All")}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs">
            <option value="All">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard glow="none" className="text-center py-8">
                  <IconSearch size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No skills match your filters. Try adjusting your search criteria.</p>
                </GlassCard>
              </motion.div>
            ) : (
              filtered.map((skill, i) => <SkillRow key={skill.id} skill={skill} index={i} />)
            )}
          </AnimatePresence>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Showing {filtered.length} of {skills.length} skills
        </div>
      </div>
    </section>
  );
}
function EvidenceExplorerSection() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | "All">("All");

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "All" && s.category !== categoryFilter) return false;
      return true;
    });
  }, [search, categoryFilter]);

  return (
    <section id={SECTION_IDS.explorer} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Evidence Explorer</h2>
        <p className="text-muted-foreground mb-8">Browse skills by evidence domain — explore which projects, certifications, labs, CTFs, blog posts, and articles support each competency.</p>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                <IconX size={14} />
              </button>
            )}
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as SkillCategory | "All")}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs">
            <option value="All">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full">
                <GlassCard glow="none" className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No skills match your filters.</p>
                </GlassCard>
              </motion.div>
            ) : (
              filtered.map((skill, i) => (
                <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}>
                  <GlassCard glow="none" intensity="low" className="h-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconCode size={14} className="text-cyan-400" />
                        <span className="text-sm font-medium text-white">{skill.name}</span>
                      </div>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded-full", STATUS_CONFIG[skill.learningStatus].color)}>
                        {STATUS_CONFIG[skill.learningStatus].label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{skill.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.evidence.projects.length > 0 && (
                        <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                          <IconFolder size={9} />{skill.evidence.projects.length}
                        </span>
                      )}
                      {skill.evidence.certifications.length > 0 && (
                        <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">
                          <IconAward size={9} />{skill.evidence.certifications.length}
                        </span>
                      )}
                      {skill.evidence.labs.length > 0 && (
                        <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">
                          <IconServer size={9} />{skill.evidence.labs.length}
                        </span>
                      )}
                      {skill.evidence.ctfs.length > 0 && (
                        <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                          <IconFlag size={9} />{skill.evidence.ctfs.length}
                        </span>
                      )}
                      {skill.evidence.blogPosts.length > 0 && (
                        <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                          <IconNews size={9} />{skill.evidence.blogPosts.length}
                        </span>
                      )}
                      {skill.evidence.articles.length > 0 && (
                        <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">
                          <IconBook size={9} />{skill.evidence.articles.length}
                        </span>
                      )}
                      {skill.evidence.githubRepos.length > 0 && (
                        <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded bg-white/10 text-gray-400">
                          <IconBrandGithub size={9} />{skill.evidence.githubRepos.length}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {skill.evidenceCount} total evidence items
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
function RolesSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id={SECTION_IDS.roles} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Role Compatibility</h2>
        <p className="text-muted-foreground mb-8">Security role alignment based on skill coverage, supporting projects, certifications, and lab experience.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => {
            const isExpanded = expanded === role.id;
            const roleSkills = role.relevantSkillIds.map((id) => getSkillById(id)).filter(Boolean) as SkillEntry[];
            const matchedCount = roleSkills.filter((s) => s.learningStatus === "mastered" || s.learningStatus === "active").length;

            return (
              <GlassCard key={role.id} glow={isExpanded ? "cyan" : "none"} intensity="low" className="h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10">
                      <IconShield size={16} className="text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{role.role}</h3>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">{role.relevantSkillIds.length} skills</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-green-400">{matchedCount} proficient</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setExpanded(isExpanded ? null : role.id)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 shrink-0 flex items-center gap-0.5">
                    Details {isExpanded ? <IconChevronUp size={10} /> : <IconChevronDown size={10} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{role.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {roleSkills.slice(0, 6).map((s) => (
                    <span key={s.id} className={cn("text-xs px-1.5 py-0.5 rounded-full",
                      s.learningStatus === "mastered" ? "bg-green-500/10 text-green-400"
                        : s.learningStatus === "active" ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-white/5 text-muted-foreground")}>
                      {s.name}
                    </span>
                  ))}
                  {roleSkills.length > 6 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                      +{roleSkills.length - 6} more
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-3 border-t border-white/5 mt-2 space-y-2">
                        <div>
                          <div className="text-xs text-cyan-400 mb-1">All Skills ({roleSkills.length})</div>
                          <div className="flex flex-wrap gap-1">
                            {roleSkills.map((s) => (
                              <span key={s.id} className={cn("text-xs px-1.5 py-0.5 rounded-full",
                                s.learningStatus === "mastered" ? "bg-green-500/10 text-green-400"
                                  : s.learningStatus === "active" ? "bg-cyan-500/10 text-cyan-400"
                                  : s.learningStatus === "maintaining" ? "bg-amber-500/10 text-amber-400"
                                  : "bg-purple-500/10 text-purple-400")}>
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        {role.certificates.length > 0 && (
                          <div>
                            <div className="text-xs text-purple-400 mb-1">Supporting Certifications</div>
                            <div className="flex flex-wrap gap-1">
                              {role.certificates.map((c) => (
                                <span key={c} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{c}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {role.supportingProjects.length > 0 && (
                          <div>
                            <div className="text-xs text-cyan-400 mb-1">Supporting Projects</div>
                            <div className="flex flex-wrap gap-1">
                              {role.supportingProjects.map((p) => (
                                <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{p}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {role.labs.length > 0 && (
                          <div>
                            <div className="text-xs text-green-400 mb-1">Lab Experience</div>
                            <div className="flex flex-wrap gap-1">
                              {role.labs.map((l) => (
                                <span key={l} className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">{l}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function StacksSection() {
  const [activeStack, setActiveStack] = useState<string>(techStacks[0].id);

  const currentStack = techStacks.find((s) => s.id === activeStack);

  return (
    <section id={SECTION_IDS.stacks} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Technology Stacks</h2>
        <p className="text-muted-foreground mb-8">Curated technology stacks combining skills, tools, and platforms across security domains.</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {techStacks.map((stack) => (
            <button key={stack.id} onClick={() => setActiveStack(stack.id)}
              className={cn("text-xs px-3 py-1.5 rounded-lg border transition-colors",
                activeStack === stack.id
                  ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                  : "border-white/10 text-muted-foreground hover:text-white")}>
              {stack.name}
            </button>
          ))}
        </div>
        {currentStack && (() => {
          const stackSkills = currentStack.skillIds.map((id) => getSkillById(id)).filter(Boolean) as SkillEntry[];
          return (
            <motion.div key={currentStack.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard glow="cyan" intensity="low">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-white">{currentStack.name}</h3>
                  <p className="text-xs text-muted-foreground">{currentStack.description}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {stackSkills.map((skill) => (
                    <div key={skill.id} className="p-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <IconCode size={12} className="text-cyan-400" />
                        <span className="text-xs font-medium text-white">{skill.name}</span>
                      </div>
                      <span className={cn("text-xs px-1 py-0.5 rounded-full", STATUS_CONFIG[skill.learningStatus].color)}>
                        {STATUS_CONFIG[skill.learningStatus].label}
                      </span>
                      <div className="text-xs text-muted-foreground mt-1">{skill.evidenceCount} evidence items</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          );
        })()}
      </div>
    </section>
  );
}
function TimelineSection() {
  const years = useMemo(() => {
    const map = new Map<string, SkillEntry[]>();
    skills.forEach((s) => {
      const year = s.firstLearned;
      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(s);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  return (
    <section id={SECTION_IDS.timeline} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Learning Timeline</h2>
        <p className="text-muted-foreground mb-8">Chronological progression of skill acquisition from foundational to advanced domains.</p>
        <div className="space-y-6">
          {years.map(([year, yearSkills], yi) => (
            <motion.div key={year} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: yi * 0.1 }}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
                    {year}
                  </div>
                  {yi < years.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-cyan-500/20 to-transparent" />}
                </div>
                <div className="flex-1 pb-6">
                  <div className="text-xs text-muted-foreground mb-2">{yearSkills.length} skill{yearSkills.length > 1 ? "s" : ""} acquired</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {yearSkills.map((skill) => (
                      <GlassCard key={skill.id} glow="none" intensity="low" variant="small">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white">{skill.name}</span>
                          <span className={cn("text-xs px-1.5 py-0.5 rounded-full", STATUS_CONFIG[skill.learningStatus].color)}>
                            {STATUS_CONFIG[skill.learningStatus].label}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{CATEGORY_LABELS[skill.category]}</div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
function AIAdvisorSection() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "What skills should I prioritize for SOC roles?",
    "Which certifications complement my current skills?",
    "What is my strongest evidence-backed skill domain?",
    "How do my skills align with cloud security roles?",
  ];

  const handleAsk = (q: string) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = question.toLowerCase();
      let answer = "";
      if (lower.includes("soc") || lower.includes("analyst")) {
        answer = "For SOC roles, your strongest matches are SOC Operations, SIEM (Splunk/ELK), Detection Engineering, Threat Intelligence, and Incident Response. These are backed by the Sentinel AI project, SOC Automation Framework, Splunk/Wazuh lab VMs, and certifications including Security+, CySA+, and GCIH. Consider adding SOAR automation practice to round out the Tier 3 capability.";
      } else if (lower.includes("certif") || lower.includes("cert")) {
        answer = "Based on your current skill matrix, the certifications that best complement your existing evidence base are: GWAPT (for web security — you already have strong Burp Suite and OWASP skills with OSCP foundation), CISSP (for breadth across all domains — you have 8 of 8 domains covered), and CCSP (for cloud security — aligns with your AWS certs and active cloud lab work).";
      } else if (lower.includes("strongest") || lower.includes("best") || lower.includes("top")) {
        answer = "Your strongest skill domain based on evidence count is Penetration Testing with 12 evidence items per skill across web security, Burp Suite, and exploit development — backed by OSCP/OSCE certs, Kali lab VMs, multiple CTFs, and three projects. Programming (Python/TypeScript) and Linux Administration also show deep evidence pools with 12 items each.";
      } else if (lower.includes("cloud") || lower.includes("role")) {
        answer = "Your cloud security skill coverage is strong: Cloud Security (AWS), Terraform/IaC, Docker, Kubernetes Security, and DevSecOps Pipeline are all Active or Mastered. These are supported by the Cloud Security Lab project, AWS-SA/AWS-Security/CCSP/CKS certs, cloud bastion/K8s master lab VMs, and 4 relevant blog posts. You are well-positioned for Cloud Security Engineer roles.";
      } else {
        const mastered = skills.filter((s) => s.learningStatus === "mastered").length;
        const active = getActiveSkillCount();
        const ev = getTotalEvidenceCount();
        answer = `You have ${skills.length} skills across ${Object.keys(CATEGORY_LABELS).length} categories: ${mastered} mastered, ${active} actively developing, and ${skills.filter((s) => s.learningStatus === "maintaining").length} maintained. Combined evidence totals ${ev} cross-referenced items. Focus areas with highest evidence density are programming, network security, Linux administration, and web application security.`;
      }
      setResponse(answer);
      setLoading(false);
    }, 800);
  };

  return (
    <section id={SECTION_IDS.advisor} className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <GlassCard glow="purple" intensity="medium" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <IconBrain size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Skill Advisor</h2>
              <p className="text-xs text-muted-foreground">Get personalized guidance on skill development, role alignment, and certification pathways based on your evidence-backed competency matrix.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => { setQuery(s); handleAsk(s); }}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-cyan-500/30 transition-colors">
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
              placeholder="Ask about skill development paths..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
            <Button variant="primary" size="md" onClick={() => handleAsk(query)} loading={loading}>Ask</Button>
          </div>
          <AnimatePresence>
            {response && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-start gap-2">
                  <IconBrain size={16} className="text-purple-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{response}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}
function CompetencyMatrixPage() {
  const { recruiterMode } = useUIStore();
  const [activeSection, setActiveSection] = useState(SECTION_IDS.hero);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    Object.values(SECTION_IDS).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  if (recruiterMode) {
    const mastered = skills.filter((s) => s.learningStatus === "mastered").length;
    const totalEv = getTotalEvidenceCount();
    return (
      <div className="min-h-screen">
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs mb-4">
              <IconChartBar size={12} />Competency Matrix — Recruiter View
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Skills & Competency</h1>
            <p className="text-muted-foreground mb-8">{skills.length} skills across {Object.keys(CATEGORY_LABELS).length} domains with {totalEv} evidence-backed competency markers. {mastered} skills mastered.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <GlassCard glow="green" intensity="low" variant="small" className="text-center">
                <div className="text-2xl font-bold text-green-400">{mastered}</div>
                <div className="text-xs text-muted-foreground">Mastered</div>
              </GlassCard>
              <GlassCard glow="cyan" intensity="low" variant="small" className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{getActiveSkillCount()}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </GlassCard>
              <GlassCard glow="amber" intensity="low" variant="small" className="text-center">
                <div className="text-2xl font-bold text-amber-400">{skills.filter((s) => s.learningStatus === "maintaining").length}</div>
                <div className="text-xs text-muted-foreground">Maintaining</div>
              </GlassCard>
              <GlassCard glow="purple" intensity="low" variant="small" className="text-center">
                <div className="text-2xl font-bold text-purple-400">{totalEv}</div>
                <div className="text-xs text-muted-foreground">Evidence Items</div>
              </GlassCard>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-white mb-2">Role Alignment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {roles.map((role) => (
                  <GlassCard key={role.id} glow="none" intensity="low" variant="small">
                    <div className="text-xs text-white">{role.role}</div>
                    <div className="text-xs text-muted-foreground">{role.relevantSkillIds.length} skills · {role.certificates.length} certs</div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-1">
        {Object.entries(SECTION_IDS).map(([label, id]) => (
          <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className={cn("w-2 h-2 rounded-full transition-all duration-300",
              activeSection === id ? "bg-cyan-400 scale-125" : "bg-white/20 hover:bg-white/40")}
            title={label.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          />
        ))}
      </div>
      <HeroSection />
      <OverviewSection />
      <MatrixSection />
      <EvidenceExplorerSection />
      <RolesSection />
      <StacksSection />
      <TimelineSection />
      <AIAdvisorSection />
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Competency Matrix — {skills.length} skills, {Object.keys(CATEGORY_LABELS).length} categories, {getTotalEvidenceCount()} evidence items · Every skill links to verifiable projects, certifications, labs, CTFs, and publications
          </p>
        </div>
      </footer>
    </div>
  );
}

export default CompetencyMatrixPage;
