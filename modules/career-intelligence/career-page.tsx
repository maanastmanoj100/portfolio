"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  IconSearch, IconX, IconChevronDown, IconChevronUp, IconArrowRight,
  IconBrain, IconStar, IconCheck, IconClock, IconRocket, IconTarget,
  IconShield, IconBook, IconFlag, IconServer, IconNews, IconBrandGithub,
  IconChartBar, IconNetwork, IconFolder, IconAward, IconFileText,
  IconCode, IconTerminal2, IconCpu, IconTools, IconCrown,
  IconArrowLeft, IconList, IconMap, IconDownload, IconPrinter,
  IconSettings, IconPlus, IconEdit, IconTrash,
} from "@tabler/icons-react";
import {
  ROLES, ROLE_CATEGORIES, getRoleById, getTotalEvidenceCount, getSkillGapSummary,
  type CareerRoleDefinition, type RoleCategory, type CareerLevel,
} from "./career-data";

const SECTION_IDS = {
  hero: "ci-hero",
  explorer: "ci-explorer",
  dashboard: "ci-dashboard",
  gaps: "ci-gaps",
  roadmap: "ci-roadmap",
  certification: "ci-certification",
  projects: "ci-projects",
  comparison: "ci-comparison",
  timeline: "ci-timeline",
  marketview: "ci-marketview",
  devplan: "ci-devplan",
  export: "ci-export",
  advisor: "ci-advisor",
};

const CATEGORY_ORDER: RoleCategory[] = ["defensive", "offensive", "engineering", "cloud", "forensics", "research", "governance"];

const ALL_SECTION_IDS = Object.values(SECTION_IDS);

function HeroSection() {
  const totalEv = ROLES.reduce((sum, r) => sum + getTotalEvidenceCount(r), 0);
  const totalProjects = new Set(ROLES.flatMap((r) => r.evidence.projects)).size;
  const totalCerts = new Set(ROLES.flatMap((r) => r.evidence.certifications)).size;
  const totalSkills = new Set(ROLES.flatMap((r) => r.evidence.skills)).size;

  const stats = [
    { icon: <IconShield size={20} />, label: "Career Roles", value: ROLES.length },
    { icon: <IconFolder size={20} />, label: "Projects Referenced", value: totalProjects },
    { icon: <IconAward size={20} />, label: "Certifications", value: totalCerts },
    { icon: <IconBrain size={20} />, label: "Skills Mapped", value: totalSkills },
    { icon: <IconChartBar size={20} />, label: "Evidence Links", value: totalEv },
    { icon: <IconCrown size={20} />, label: "Role Categories", value: Object.keys(ROLE_CATEGORIES).length },
  ];

  return (
    <section id={SECTION_IDS.hero} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <IconChartBar size={14} />Chapter 28  Career Role Intelligence & Skill Gap Analyzer
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Career Role Intelligence
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Evidence-based role alignment across {ROLES.length} cybersecurity career paths. Explore how projects, certifications, labs, and documented learning align with different roles.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => document.getElementById(SECTION_IDS.explorer)?.scrollIntoView({ behavior: "smooth" })}>
              Explore Roles
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById(SECTION_IDS.comparison)?.scrollIntoView({ behavior: "smooth" })}>
              Role Comparison
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

function ExplorerSection({ selectedRoleId, onSelect }: { selectedRoleId: string; onSelect: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<RoleCategory | "All">("All");

  const filtered = useMemo(() => {
    return ROLES.filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "All" && r.category !== categoryFilter) return false;
      return true;
    });
  }, [search, categoryFilter]);

  return (
    <section id={SECTION_IDS.explorer} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Career Role Explorer</h2>
        <p className="text-muted-foreground mb-8">Browse {ROLES.length} cybersecurity career paths. Select a role to view detailed alignment analysis below.</p>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search roles..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"><IconX size={14} /></button>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            <button onClick={() => setCategoryFilter("All")}
              className={cn("text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors",
                categoryFilter === "All" ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" : "border-white/10 text-muted-foreground hover:text-white")}>All</button>
            {CATEGORY_ORDER.map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={cn("text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors",
                  categoryFilter === cat ? cn("border-current", ROLE_CATEGORIES[cat].color) : "border-white/10 text-muted-foreground hover:text-white")}>
                {ROLE_CATEGORIES[cat].label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full">
                <GlassCard glow="none" className="text-center py-8">
                  <IconSearch size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No roles match your filters.</p>
                </GlassCard>
              </motion.div>
            ) : (
              filtered.map((role, i) => {
                const cat = ROLE_CATEGORIES[role.category];
                const totalEv = getTotalEvidenceCount(role);
                const isSelected = selectedRoleId === role.id;
                return (
                  <motion.div key={role.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    layout className={cn("cursor-pointer transition-all duration-200", isSelected && "scale-[1.02]")}>
                    <GlassCard glow={isSelected ? "cyan" : "none"} intensity="low" className={cn("h-full", isSelected ? "border-cyan-500/50" : "hover:border-cyan-500/30")}
                      onClick={() => onSelect(role.id)}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={cn("text-xs px-1.5 py-0.5 rounded-full", cat.color)}>{cat.label}</span>
                        <span className="text-xs text-muted-foreground">{totalEv} links</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white">{role.title}</h3>
                        {isSelected && <IconCheck size={14} className="text-cyan-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-2">{role.description}</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{role.evidence.projects.length}p</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{role.evidence.certifications.length}c</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">{role.evidence.labs.length}l</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">{role.evidence.skills.length}s</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">Showing {filtered.length} of {ROLES.length} roles</div>
      </div>
    </section>
  );
}

function AlignmentDashboard({ role }: { role: CareerRoleDefinition }) {
  const totalEv = getTotalEvidenceCount(role);
  const gaps = getSkillGapSummary(role);

  return (
    <section id={SECTION_IDS.dashboard} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Role Alignment Dashboard</h2>
        <p className="text-muted-foreground mb-8">Evidence matrix showing how your portfolio aligns with <span className="text-cyan-400">{role.title}</span> requirements.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <GlassCard glow="green" intensity="low" variant="small" className="text-center">
            <div className="text-2xl font-bold text-green-400">{gaps.demonstrated}</div>
            <div className="text-xs text-muted-foreground">Demonstrated</div>
          </GlassCard>
          <GlassCard glow="cyan" intensity="low" variant="small" className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{gaps.inProgress}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </GlassCard>
          <GlassCard glow="amber" intensity="low" variant="small" className="text-center">
            <div className="text-2xl font-bold text-amber-400">{gaps.planned}</div>
            <div className="text-xs text-muted-foreground">Planned</div>
          </GlassCard>
          <GlassCard glow="purple" intensity="low" variant="small" className="text-center">
            <div className="text-2xl font-bold text-purple-400">{totalEv}</div>
            <div className="text-xs text-muted-foreground">Total Evidence</div>
          </GlassCard>
        </div>

        <GlassCard glow="cyan" intensity="low" className="mb-6">
          <h3 className="text-sm font-medium text-white mb-4">Evidence Matrix</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { icon: <IconFolder size={18} className="text-cyan-400" />, label: "Projects", count: role.evidence.projects.length, items: role.evidence.projects },
              { icon: <IconBrain size={18} className="text-green-400" />, label: "Skills", count: role.evidence.skills.length, items: role.evidence.skills },
              { icon: <IconAward size={18} className="text-purple-400" />, label: "Certifications", count: role.evidence.certifications.length, items: role.evidence.certifications },
              { icon: <IconServer size={18} className="text-amber-400" />, label: "Labs", count: role.evidence.labs.length, items: role.evidence.labs },
              { icon: <IconNews size={18} className="text-blue-400" />, label: "Blog Posts", count: role.evidence.blogPosts.length, items: role.evidence.blogPosts },
              { icon: <IconBrandGithub size={18} className="text-gray-400" />, label: "GitHub", count: role.evidence.githubRepos.length, items: role.evidence.githubRepos.map((r) => r.name) },
              { icon: <IconBook size={18} className="text-pink-400" />, label: "Knowledge Areas", count: role.knowledgeAreas.length, items: role.knowledgeAreas },
            ].map((col) => (
              <div key={col.label} className="text-center p-2 rounded-lg bg-white/5">
                <div className="flex justify-center mb-1">{col.icon}</div>
                <div className="text-lg font-bold text-white">{col.count}</div>
                <div className="text-xs text-muted-foreground mb-1">{col.label}</div>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {col.items.slice(0, 2).map((item) => (
                    <span key={item} className="text-xs px-1 py-0.5 rounded bg-white/5 text-muted-foreground truncate max-w-[60px]">{item}</span>
                  ))}
                  {col.items.length > 2 && <span className="text-xs text-muted-foreground">+{col.items.length - 2}</span>}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GlassCard glow="none">
            <h3 className="text-sm font-medium text-white mb-3">Typical Responsibilities</h3>
            <ul className="space-y-1.5">
              {role.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <IconArrowRight size={10} className="text-cyan-400 mt-0.5 shrink-0" />{r}
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard glow="none">
            <h3 className="text-sm font-medium text-white mb-3">Core Technologies & Tools</h3>
            <div className="mb-3">
              <div className="text-xs text-cyan-400 mb-1">Core Technologies</div>
              <div className="flex flex-wrap gap-1">
                {role.coreTechnologies.map((t) => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{t}</span>)}
              </div>
            </div>
            <div>
              <div className="text-xs text-purple-400 mb-1">Common Tools</div>
              <div className="flex flex-wrap gap-1">
                {role.commonTools.map((t) => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{t}</span>)}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-blue-400 mb-1">Knowledge Areas</div>
              <div className="flex flex-wrap gap-1">
                {role.knowledgeAreas.map((k) => <span key={k} className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{k}</span>)}
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard glow="none">
          <h3 className="text-sm font-medium text-white mb-3">Portfolio Evidence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-cyan-400 mb-1">Supporting Projects</div>
              <div className="flex flex-wrap gap-1">
                {role.evidence.projects.map((p) => <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{p}</span>)}
                {role.evidence.projects.length === 0 && <span className="text-xs text-muted-foreground">No projects listed</span>}
              </div>
            </div>
            <div>
              <div className="text-xs text-purple-400 mb-1">Related Certifications</div>
              <div className="flex flex-wrap gap-1">
                {role.evidence.certifications.map((c) => <span key={c} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{c}</span>)}
                {role.evidence.certifications.length === 0 && <span className="text-xs text-muted-foreground">No certifications</span>}
              </div>
            </div>
            <div>
              <div className="text-xs text-green-400 mb-1">Lab Experience</div>
              <div className="flex flex-wrap gap-1">
                {role.evidence.labs.map((l) => <span key={l} className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">{l}</span>)}
                {role.evidence.labs.length === 0 && <span className="text-xs text-muted-foreground">No labs</span>}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function SkillGapSection({ role }: { role: CareerRoleDefinition }) {
  return (
    <section id={SECTION_IDS.gaps} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Skill Gap Analysis</h2>
        <p className="text-muted-foreground mb-8">Transparent assessment of documented competencies versus areas under development for <span className="text-cyan-400">{role.title}</span>.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard glow="green" intensity="low">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-green-500/20 text-green-400"><IconCheck size={16} /></div>
              <span className="text-sm font-medium text-white">Documented Competencies</span>
              <span className="text-xs text-green-400 ml-auto">{role.documentedCompetencies.length}</span>
            </div>
            <ul className="space-y-1.5">
              {role.documentedCompetencies.map((c, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 shrink-0" />{c}
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard glow="cyan" intensity="low">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400"><IconRocket size={16} /></div>
              <span className="text-sm font-medium text-white">Currently Learning</span>
              <span className="text-xs text-cyan-400 ml-auto">{role.currentlyLearning.length}</span>
            </div>
            <ul className="space-y-1.5">
              {role.currentlyLearning.map((c, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0" />{c}
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard glow="amber" intensity="low">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400"><IconTarget size={16} /></div>
              <span className="text-sm font-medium text-white">Future Learning Goals</span>
              <span className="text-xs text-amber-400 ml-auto">{role.futureGoals.length}</span>
            </div>
            <ul className="space-y-1.5 mb-3">
              {role.futureGoals.map((g, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />{g}
                </li>
              ))}
            </ul>
            <div className="text-xs text-amber-400 mb-1">Recommended Certifications</div>
            <div className="flex flex-wrap gap-1">
              {role.recommendedCerts.map((cert) => (
                <span key={cert.badge} className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">{cert.name}</span>
              ))}
            </div>
          </GlassCard>
          <GlassCard glow="purple" intensity="low">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400"><IconBook size={16} /></div>
              <span className="text-sm font-medium text-white">Suggested Resources</span>
            </div>
            <div className="text-xs text-purple-400 mb-1">Reading</div>
            <ul className="space-y-1 mb-3">
              {role.suggestedReading.map((b, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-2">
                  <IconBook size={10} className="text-purple-400 mt-0.5 shrink-0" />{b}
                </li>
              ))}
            </ul>
            <div className="text-xs text-cyan-400 mb-1">Suggested Labs</div>
            <div className="flex flex-wrap gap-1 mb-3">
              {role.suggestedLabs.map((l) => <span key={l} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{l}</span>)}
            </div>
            <div className="text-xs text-green-400 mb-1">Suggested Projects</div>
            <div className="flex flex-wrap gap-1">
              {role.suggestedProjects.map((p) => <span key={p.id} className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">{p.title}</span>)}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function RoadmapSection({ role }: { role: CareerRoleDefinition }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section id={SECTION_IDS.roadmap} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-white">Learning Roadmap</h2>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Collapse" : "Expand"}
          </Button>
        </div>
        <p className="text-muted-foreground mb-8">{role.roadmap.length} stages from foundation to advanced for <span className="text-cyan-400">{role.title}</span>. Each stage links to portfolio evidence.</p>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-0">
              {role.roadmap.map((stage, i) => (
                <motion.div key={stage.stage} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
                        i === 0 ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                          : i === role.roadmap.length - 1 ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : "bg-white/5 text-muted-foreground border-white/10")}>
                        {i + 1}
                      </div>
                      {i < role.roadmap.length - 1 && <div className="w-px h-8 bg-gradient-to-b from-cyan-500/20 to-transparent" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <GlassCard glow="none" intensity="low" variant="small">
                        <div className="text-xs font-medium text-white mb-1">{stage.stage}</div>
                        <p className="text-xs text-muted-foreground mb-2">{stage.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {stage.skills.map((sk) => <span key={sk} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{sk}</span>)}
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function CertPlannerSection({ role }: { role: CareerRoleDefinition }) {
  const levels: CareerLevel[] = ["entry", "intermediate", "advanced", "expert"];
  const levelColors: Record<CareerLevel, string> = { entry: "green", intermediate: "cyan", advanced: "amber", expert: "purple" };

  return (
    <section id={SECTION_IDS.certification} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Certification Planner</h2>
        <p className="text-muted-foreground mb-8">Recommended certifications for <span className="text-cyan-400">{role.title}</span> based on current portfolio evidence and career trajectory.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {levels.map((level) => {
            const levelCerts = role.recommendedCerts.filter((c) => c.level === level);
            return (
              <GlassCard key={level} glow={levelColors[level] as "green" | "cyan" | "amber" | "purple"} intensity="low">
                <div className={cn("text-xs px-2 py-0.5 rounded-full inline-block mb-3",
                  level === "entry" ? "text-green-400 bg-green-500/10"
                    : level === "intermediate" ? "text-cyan-400 bg-cyan-500/10"
                    : level === "advanced" ? "text-amber-400 bg-amber-500/10"
                    : "text-purple-400 bg-purple-500/10")}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </div>
                {levelCerts.length === 0 ? (
                  <div className="text-[11px] text-muted-foreground">No recommendations at this level</div>
                ) : (
                  <div className="space-y-2">
                    {levelCerts.map((cert) => (
                      <div key={cert.badge} className="p-2 rounded-lg bg-white/5">
                        <div className="text-xs text-white">{cert.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Badge: {cert.badge}</div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectRecommenderSection({ role }: { role: CareerRoleDefinition }) {
  if (role.suggestedProjects.length === 0) return null;
  return (
    <section id={SECTION_IDS.projects} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Project Recommendations</h2>
        <p className="text-muted-foreground mb-8">Suggested portfolio projects to strengthen alignment with <span className="text-cyan-400">{role.title}</span>.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {role.suggestedProjects.map((proj) => (
            <GlassCard key={proj.id} glow="none" intensity="low">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{proj.title}</span>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full",
                  proj.difficulty === "beginner" ? "text-green-400 bg-green-500/10"
                    : proj.difficulty === "intermediate" ? "text-cyan-400 bg-cyan-500/10"
                    : proj.difficulty === "advanced" ? "text-amber-400 bg-amber-500/10"
                    : "text-red-400 bg-red-500/10")}>
                  {proj.difficulty}
                </span>
              </div>
              <ul className="space-y-1">
                {proj.objectives.map((o, oi) => (
                  <li key={oi} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                    <IconTarget size={10} className="text-cyan-400 mt-0.5 shrink-0" />{o}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoleComparisonSection() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["pentest", "soc-analyst", "cloud-security-engineer"]);

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) => {
      if (prev.includes(id)) return prev.filter((r) => r !== id);
      if (prev.length >= 3) return [id, ...prev.slice(0, 2)];
      return [...prev, id];
    });
  };

  const compRoles = selectedRoles.map((id) => getRoleById(id)).filter(Boolean) as CareerRoleDefinition[];

  return (
    <section id={SECTION_IDS.comparison} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Role Comparison</h2>
        <p className="text-muted-foreground mb-6">Compare up to 3 career paths side by side across evidence dimensions, skills, and portfolio alignment.</p>
        <div className="flex flex-wrap gap-1 mb-6">
          {ROLES.map((role) => (
            <button key={role.id} onClick={() => toggleRole(role.id)}
              className={cn("text-xs px-2 py-1 rounded-lg border transition-colors",
                selectedRoles.includes(role.id) ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" : "border-white/10 text-muted-foreground hover:text-white")}>
              {role.title}
            </button>
          ))}
        </div>
        <div className={cn("grid gap-4", compRoles.length === 1 ? "grid-cols-1" : compRoles.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3")}>
          {compRoles.map((role) => {
            const totalEv = getTotalEvidenceCount(role);
            return (
              <GlassCard key={role.id} glow="none" intensity="low">
                <div className="text-xs font-medium text-white mb-2">{role.title}</div>
                <div className="space-y-2 text-[11px] text-muted-foreground">
                  <div className="flex justify-between"><span>Evidence Links</span><span className="text-white font-medium">{totalEv}</span></div>
                  <div className="flex justify-between"><span>Projects</span><span className="text-cyan-400">{role.evidence.projects.length}</span></div>
                  <div className="flex justify-between"><span>Certifications</span><span className="text-purple-400">{role.evidence.certifications.length}</span></div>
                  <div className="flex justify-between"><span>Labs</span><span className="text-green-400">{role.evidence.labs.length}</span></div>
                  <div className="flex justify-between"><span>Skills</span><span className="text-amber-400">{role.evidence.skills.length}</span></div>
                  <div className="flex justify-between"><span>Blog Posts</span><span className="text-blue-400">{role.evidence.blogPosts.length}</span></div>
                  <div className="flex justify-between"><span>Roadmap Stages</span><span className="text-white">{role.roadmap.length}</span></div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/5">
                  <div className="text-xs text-cyan-400 mb-1">Core Skills</div>
                  <div className="flex flex-wrap gap-0.5">
                    {role.evidence.skills.slice(0, 5).map((s) => <span key={s} className="text-xs px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{s}</span>)}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
        {compRoles.length === 0 && (
          <GlassCard glow="none" className="text-center py-8">
            <p className="text-sm text-muted-foreground">Select roles above to compare them side by side.</p>
          </GlassCard>
        )}
      </div>
    </section>
  );
}

function CareerTimelineSection() {
  const milestones = useMemo(() => {
    const items: { year: string; title: string; desc: string; type: "cert" | "project" | "education" | "milestone" }[] = [];
    items.push({ year: "2017", title: "B.S. Computer Science", desc: "Stanford University - Foundations in CS, networking, cryptography", type: "education" });
    items.push({ year: "2019", title: "M.S. Cybersecurity", desc: "MIT - Advanced security research, ML for security", type: "education" });
    items.push({ year: "2019", title: "Security Researcher", desc: "StartupSecure - Vulnerability research, smart contract security", type: "milestone" });
    items.push({ year: "2021", title: "Penetration Testing Lead", desc: "SecureTech Solutions - Offensive security, AD exploitation", type: "milestone" });
    items.push({ year: "2023", title: "Senior Security Engineer", desc: "CyberSec Corp - SOC platform, cloud security architecture", type: "milestone" });
    items.push({ year: "2024", title: "OSCP Certification", desc: "Offensive Security Certified Professional", type: "cert" });
    items.push({ year: "2024", title: "CISSP", desc: "ISC2 - Certified Information Systems Security Professional", type: "cert" });
    items.push({ year: "2024", title: "Sentinel AI", desc: "AI-powered SOC platform - flagship portfolio project", type: "project" });
    items.push({ year: "2025", title: "Cloud Security Lab", desc: "Enterprise cloud security infrastructure project", type: "project" });
    items.push({ year: "2026", title: "CKS & CCSP", desc: "Planned: Kubernetes Security + Cloud Security Professional", type: "cert" });
    return items;
  }, []);

  const [focusArea, setFocusArea] = useState<string>("All");

  return (
    <section id={SECTION_IDS.timeline} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Career Timeline</h2>
        <p className="text-muted-foreground mb-6">Completed milestones, current focus areas, and planned certifications across the learning journey.</p>
        <div className="flex gap-1 mb-6">
          {["All", "education", "milestone", "cert", "project"].map((t) => (
            <button key={t} onClick={() => setFocusArea(t)}
              className={cn("text-[11px] px-2.5 py-1 rounded-lg border transition-colors",
                focusArea === t ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" : "border-white/10 text-muted-foreground hover:text-white")}>
              {t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
            </button>
          ))}
        </div>
        <div className="space-y-0">
          {milestones.filter((m) => focusArea === "All" || m.type === focusArea).map((m, i) => (
            <motion.div key={`${m.year}-${m.title}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border shrink-0",
                    m.type === "education" ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : m.type === "milestone" ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                      : m.type === "cert" ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                      : "bg-green-500/20 text-green-400 border-green-500/30")}>
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && <div className="w-px h-8 bg-gradient-to-b from-cyan-500/20 to-transparent" />}
                </div>
                <div className={cn("flex-1 pb-4",
                  m.type === "cert" ? "border-l-2 border-purple-500/20 pl-3" : "pl-3")}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{m.title}</span>
                    <span className={cn("text-xs px-1.5 py-0.5 rounded-full",
                      m.type === "education" ? "text-blue-400 bg-blue-500/10"
                        : m.type === "milestone" ? "text-cyan-400 bg-cyan-500/10"
                        : m.type === "cert" ? "text-purple-400 bg-purple-500/10"
                        : "text-green-400 bg-green-500/10")}>{m.type}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{m.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketSkillView() {
  const domains = [
    { name: "Networking", color: "text-cyan-400 bg-cyan-500/10", skills: ["TCP/IP", "DNS", "HTTP/HTTPS", "Firewalls", "VPN", "Network Security"] },
    { name: "Programming", color: "text-blue-400 bg-blue-500/10", skills: ["Python", "TypeScript", "Bash/Shell", "PowerShell", "SQL", "Rust"] },
    { name: "Cloud", color: "text-amber-400 bg-amber-500/10", skills: ["AWS", "Cloud Security", "Terraform", "IAM", "CloudTrail", "GuardDuty"] },
    { name: "Containers", color: "text-teal-400 bg-teal-500/10", skills: ["Docker", "Kubernetes", "Container Security", "Image Hardening", "RBAC"] },
    { name: "Threat Detection", color: "text-red-400 bg-red-500/10", skills: ["SIEM", "Detection Engineering", "YARA", "Sigma", "Threat Hunting", "MITRE ATT&CK"] },
    { name: "Identity", color: "text-purple-400 bg-purple-500/10", skills: ["Active Directory", "Kerberos", "OAuth", "SAML", "PAM", "Azure AD"] },
    { name: "Security Operations", color: "text-green-400 bg-green-500/10", skills: ["SOC Operations", "Incident Response", "Forensics", "Playbooks", "Escalation"] },
    { name: "Automation", color: "text-orange-400 bg-orange-500/10", skills: ["CI/CD", "Terraform", "Ansible", "Security Automation", "SOAR"] },
    { name: "Operating Systems", color: "text-gray-400 bg-gray-500/10", skills: ["Linux Administration", "Windows Administration", "Kali Linux", "Server Hardening"] },
  ];

  return (
    <section id={SECTION_IDS.marketview} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Market Skill View</h2>
        <p className="text-muted-foreground mb-8">Technologies organized by domain - showing relationships across the security landscape rather than ranking individual tools.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((domain) => (
            <GlassCard key={domain.name} glow="none" intensity="low">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold", domain.color)}>
                  {domain.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white">{domain.name}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {domain.skills.map((sk) => <span key={sk} className="text-xs px-2 py-1 rounded-full bg-white/5 text-muted-foreground">{sk}</span>)}
              </div>
              <div className="mt-3 pt-2 border-t border-white/5">
                <div className="flex flex-wrap gap-1">
                  {domain.skills.slice(0, 3).map((sk, i) => (
                    <span key={sk} className="text-xs text-muted-foreground">
                      {sk}{i < Math.min(domain.skills.length, 3) - 1 ? "  " : ""}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Shows tool relationships, not rankings</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function DevPlanSection() {
  const [goals, setGoals] = useState({
    shortTerm: ["Complete CRTO certification", "Build cloud detection lab", "Publish research on AD attack paths"],
    mediumTerm: ["Earn CISSP certification", "Develop automated IR platform", "Contribute to open-source Sigma rules"],
    longTerm: ["Achieve SANS GIAC expert track", "Lead security architecture team", "Published security research book"],
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (key: string, value: string) => {
    setEditing(key);
    setEditValue(value);
  };

  const saveEdit = (key: "shortTerm" | "mediumTerm" | "longTerm", index: number) => {
    if (editValue.trim()) {
      setGoals((prev) => {
        const updated = [...prev[key]];
        updated[index] = editValue.trim();
        return { ...prev, [key]: updated };
      });
    }
    setEditing(null);
  };

  return (
    <section id={SECTION_IDS.devplan} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Personal Development Plan</h2>
        <p className="text-muted-foreground mb-8">Editable learning roadmap - customize short, medium, and long-term goals to guide your career progression.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["shortTerm", "mediumTerm", "longTerm"] as const).map((period) => (
            <GlassCard key={period} glow={period === "shortTerm" ? "green" : period === "mediumTerm" ? "cyan" : "purple"} intensity="low">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">
                  {period === "shortTerm" ? "Short-Term" : period === "mediumTerm" ? "Medium-Term" : "Long-Term"}
                </span>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full",
                  period === "shortTerm" ? "text-green-400" : period === "mediumTerm" ? "text-cyan-400" : "text-purple-400")}>
                  {period === "shortTerm" ? "3-6 months" : period === "mediumTerm" ? "6-18 months" : "18+ months"}
                </span>
              </div>
              <div className="space-y-2">
                {goals[period].map((goal, gi) => (
                  <div key={gi} className="group">
                    {editing === `${period}-${gi}` ? (
                      <div className="flex gap-1">
                        <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit(period, gi)}
                          className="flex-1 px-2 py-1 text-[11px] rounded bg-white/5 border border-cyan-500/50 text-white focus:outline-none" autoFocus />
                        <button onClick={() => saveEdit(period, gi)} className="text-xs text-cyan-400 hover:text-cyan-300"><IconCheck size={12} /></button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-[11px] text-muted-foreground group-hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-current" />
                        <span className="flex-1">{goal}</span>
                        <button onClick={() => startEdit(`${period}-${gi}`, goal)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-cyan-400 hover:text-cyan-300 transition-opacity shrink-0">
                          <IconEdit size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExportSection() {
  const handleExport = (type: string) => {
    const roleCount = ROLES.length;
    const totalEv = ROLES.reduce((sum, r) => sum + getTotalEvidenceCount(r), 0);
    const content = {
      "role-summary": `Career Role Summary\n${ROLES.map((r) => `- ${r.title}: ${getTotalEvidenceCount(r)} evidence links`).join("\n")}\n\nTotal: ${roleCount} roles, ${totalEv} evidence links`,
      "recruiter-brief": `Recruiter Brief\n${ROLES.slice(0, 5).map((r) => `${r.title}: ${r.evidence.projects.length} projects, ${r.evidence.certifications.length} certs, ${r.evidence.skills.length} skills`).join("\n")}`,
    }[type] || "Career Intelligence Report";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id={SECTION_IDS.export} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Export Options</h2>
        <p className="text-muted-foreground mb-8">Generate role summaries, alignment reports, and recruiter briefs while maintaining portfolio branding.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: "role-summary", label: "Role Summary", desc: "Overview of all career roles and evidence counts", icon: IconFileText },
            { id: "alignment-report", label: "Alignment Report", desc: "Detailed role alignment analysis for selected roles", icon: IconChartBar },
            { id: "recruiter-brief", label: "Recruiter Brief", desc: "Compact role alignment summary for hiring managers", icon: IconShield },
            { id: "evidence-report", label: "Evidence Report", desc: "Comprehensive portfolio evidence breakdown by role", icon: IconList },
          ].map((opt) => {
            const Icon = opt.icon;
            return (
              <GlassCard key={opt.id} glow="none" intensity="low" className="cursor-pointer hover:border-cyan-500/30 transition-colors"
                onClick={() => handleExport(opt.id)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400"><Icon size={16} /></div>
                  <span className="text-sm font-medium text-white">{opt.label}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mb-3">{opt.desc}</p>
                <div className="flex items-center gap-1 text-xs text-cyan-400">
                  <IconDownload size={10} /> Download .txt
                </div>
              </GlassCard>
            );
          })}
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
    "Which role fits my portfolio best?",
    "What skills should I develop for cloud security?",
    "How does my experience align with SOC roles?",
    "What certifications should I pursue next?",
  ];

  const handleAsk = (q: string) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = question.toLowerCase();
      let answer = "";
      if (lower.includes("best fit") || lower.includes("which role") || lower.includes("recommend")) {
        answer = "Based on portfolio evidence, your strongest role alignments are Penetration Tester (OSCP, OSCE, multiple offensive projects), SOC Analyst (Sentinel AI, SIEM lab, GCIH), and Security Engineer (cloud lab, K8s hardening, AWS certs). The deepest evidence density is in offensive security with 5+ projects and 4 certifications.";
      } else if (lower.includes("cloud") || lower.includes("aws")) {
        answer = "For Cloud Security Engineer: your portfolio shows AWS Solutions Architect, Security-Specialty certs, Cloud Security Lab, Terraform/IaC, container security (CKS), and K8s hardening. Current learning includes service mesh and multi-cloud posture management. Consider CCSP certification and a multi-cloud project.";
      } else if (lower.includes("soc") || lower.includes("analyst")) {
        answer = "Your SOC Analyst alignment is supported by Sentinel AI (AI-powered SOC), SOC Automation Framework, SIEM lab experience (Splunk, Wazuh, ELK), and GCIH certification. Documented competencies include incident triage, detection rule development, and threat intelligence integration.";
      } else if (lower.includes("certif") || lower.includes("cert")) {
        answer = "Recommended next certifications: (1) GWAPT - complements web security and Burp Suite skills, (2) CRTO - advances red team beyond OSCP, (3) CISSP - validates breadth across all domains (you have 7 of 8 covered). Consider OSEP for advanced pentesting specialization.";
      } else {
        const totalEv = ROLES.reduce((sum, r) => sum + getTotalEvidenceCount(r), 0);
        answer = `The Career Intelligence system analyzes portfolio evidence across ${ROLES.length} cybersecurity roles with ${totalEv} total evidence links. Top-aligned roles: Penetration Tester (strongest evidence), Security Engineer (broadest coverage), SOC Analyst (deepest operational experience). All alignments based on verifiable work.`;
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
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><IconBrain size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Career Advisor</h2>
              <p className="text-xs text-muted-foreground">Get evidence-based career guidance - role alignment, skill development, certification pathways, and project recommendations.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => { setQuery(s); handleAsk(s); }}
                className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-cyan-500/30 transition-colors">
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
              placeholder="Ask about career roles, skills, or certifications..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
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

function RecruiterModeView() {
  const topRoles = useMemo(() => {
    return [...ROLES].sort((a, b) => getTotalEvidenceCount(b) - getTotalEvidenceCount(a)).slice(0, 3);
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
          <IconShield size={14} /> Recruiter Mode - Compact Career Intelligence
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Career Role Intelligence</h2>
        <p className="text-muted-foreground mb-8">Evidence-based alignment across {ROLES.length} cybersecurity career paths.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <GlassCard glow="cyan" intensity="low" variant="small" className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{ROLES.length}</div>
            <div className="text-xs text-muted-foreground">Career Roles</div>
          </GlassCard>
          <GlassCard glow="green" intensity="low" variant="small" className="text-center">
            <div className="text-2xl font-bold text-green-400">{ROLES.reduce((sum, r) => sum + getTotalEvidenceCount(r), 0)}</div>
            <div className="text-xs text-muted-foreground">Evidence Links</div>
          </GlassCard>
          <GlassCard glow="purple" intensity="low" variant="small" className="text-center">
            <div className="text-2xl font-bold text-purple-400">{new Set(ROLES.flatMap((r) => r.evidence.certifications)).size}</div>
            <div className="text-xs text-muted-foreground">Certifications</div>
          </GlassCard>
          <GlassCard glow="amber" intensity="low" variant="small" className="text-center">
            <div className="text-2xl font-bold text-amber-400">{Object.keys(ROLE_CATEGORIES).length}</div>
            <div className="text-xs text-muted-foreground">Role Categories</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {topRoles.map((role) => (
            <GlassCard key={role.id} glow="none" className="hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full", ROLE_CATEGORIES[role.category].color)}>
                  {ROLE_CATEGORIES[role.category].label}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">{getTotalEvidenceCount(role)} ev</span>
              </div>
              <div className="text-sm font-medium text-white">{role.title}</div>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{role.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{role.evidence.projects.length}p</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{role.evidence.certifications.length}c</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">{role.evidence.labs.length}l</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">{role.evidence.skills.length}s</span>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard glow="none">
          <h3 className="text-sm font-medium text-white mb-3">Role Alignment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ROLES.slice(0, 10).map((role) => {
              const totalEv = getTotalEvidenceCount(role);
              return (
                <div key={role.id} className="flex items-center justify-between text-[11px] py-1 px-2 rounded bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full", ROLE_CATEGORIES[role.category].color.replace("text-", "bg-"))} />
                    <span className="text-white">{role.title}</span>
                  </div>
                  <div className="flex gap-3 text-muted-foreground">
                    <span className="text-cyan-400">{role.evidence.projects.length}p</span>
                    <span className="text-purple-400">{role.evidence.certifications.length}c</span>
                    <span className="text-amber-400">{role.evidence.skills.length}s</span>
                    <span className="text-white">{totalEv} total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export default function CareerIntelligencePage() {
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const [selectedRoleId, setSelectedRoleId] = useState("pentest");
  const selectedRole = useMemo(() => getRoleById(selectedRoleId), [selectedRoleId]);

  if (recruiterMode) return <RecruiterModeView />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <HeroSection />
      <ExplorerSection selectedRoleId={selectedRoleId} onSelect={setSelectedRoleId} />
      {selectedRole && <AlignmentDashboard role={selectedRole} />}
      {selectedRole && <SkillGapSection role={selectedRole} />}
      {selectedRole && <RoadmapSection role={selectedRole} />}
      {selectedRole && <CertPlannerSection role={selectedRole} />}
      {selectedRole && <ProjectRecommenderSection role={selectedRole} />}
      <RoleComparisonSection />
      <CareerTimelineSection />
      <MarketSkillView />
      <DevPlanSection />
      <ExportSection />
      <AIAdvisorSection />
    </div>
  );
}
