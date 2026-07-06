"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { projects, PROJECT_CATEGORIES } from "@/data/projects";
import { skills } from "@/data/skills";
import { galaxySkills } from "@/data/skills-galaxy";
import { experiences } from "@/data/experience";
import { vaultCertifications, achievements, certificationRoadmap } from "@/data/certifications-vault";
import { blogPosts } from "@/data/blog";
import {
  IconChartBar, IconCode, IconBrain, IconCertificate, IconStar,
  IconFlag, IconBook, IconBrandGithub, IconGitCommit, IconShieldCheck,
  IconClock, IconArrowRight, IconExternalLink, IconDownload,
  IconTrendingUp, IconCalendar, IconTarget, IconBulb,
  IconUserShield, IconLayersIntersect, IconHistory, IconAward,
  IconSearch, IconRocket, IconFileText, IconMicrophone,
  IconChevronDown, IconX, IconPlus, IconMinus,
  IconCheck, IconFilter, IconRefresh,
} from "@tabler/icons-react";

function SectionHeader({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="text-cyan"><Icon size={14} /></div>
      <h2 className="text-xs font-mono text-foreground-tertiary uppercase tracking-widest">{label}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2" />
    </div>
  );
}

function AnimatedCounter({ value, label, color }: { value: number | string; label: string; color?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center cursor-default transition-colors hover:bg-white/[0.04]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
    >
      <div className="text-xl sm:text-2xl font-light tabular-nums" style={{ color: color || "var(--color-cyan)" }}>{value}</div>
      <div className="text-xs font-mono text-foreground-tertiary mt-1 leading-tight uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

function CounterCard({ value, label, icon: Icon, color }: { value: number | string; label: string; icon: React.ComponentType<{ size?: number }>; color?: string }) {
  const col = color || "#06b6d4";
  return (
    <motion.div
      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center cursor-default transition-all hover:bg-white/[0.04]"
      whileHover={{ y: -3, scale: 1.01 }}
    >
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <span style={{ color: col }}><Icon size={14} /></span>
        <div className="text-xl sm:text-2xl font-light tabular-nums" style={{ color: col }}>{value}</div>
      </div>
      <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

function CareerSnapshot() {
  const completedProjects = projects.filter(p => p.status === "completed" || p.status === "maintenance").length;
  const allTechs = new Set(projects.flatMap(p => p.techStack.map(t => t.name)));
  const allLangs = new Set(projects.flatMap(p => p.languages));
  const ctfCount = achievements.filter(a => a.type === "ctf").length;
  const researchCount = blogPosts.filter(p => p.category === "research").length;
  const totalCerts = vaultCertifications.length;
  const activeCerts = vaultCertifications.filter(c => c.status === "active").length;
  const totalCommits = projects.reduce((a, p) => a + (p.commits || 0), 0);
  const totalStars = projects.reduce((a, p) => a + (p.stars || 0), 0);
  const totalLoc = projects.reduce((a, p) => a + (p.loc || 0), 0);

  return (
    <section id="snapshot" className="mb-12 scroll-mt-20">
      <SectionHeader label="Career Snapshot" icon={IconChartBar} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        <CounterCard value={completedProjects} label="Projects Completed" icon={IconCode} color="#06b6d4" />
        <CounterCard value={totalCerts} label="Certificates Earned" icon={IconCertificate} color="#8b5cf6" />
        <CounterCard value={allTechs.size} label="Technologies Used" icon={IconBrain} color="#a855f7" />
        <CounterCard value={allLangs.size} label="Programming Languages" icon={IconCode} color="#2563eb" />
        <CounterCard value={ctfCount} label="CTFs Solved" icon={IconFlag} color="#f59e0b" />
        <CounterCard value={researchCount} label="Research Articles" icon={IconBook} color="#22c55e" />
        <CounterCard value={projects.length} label="GitHub Repositories" icon={IconBrandGithub} color="#6366f1" />
        <CounterCard value={activeCerts} label="Active Certifications" icon={IconShieldCheck} color="#06b6d4" />
        <CounterCard value={`${(totalLoc / 1000).toFixed(0)}K`} label="Lines of Code" icon={IconChartBar} color="#f97316" />
        <CounterCard value={totalStars} label="GitHub Stars" icon={IconStar} color="#eab308" />
      </div>
    </section>
  );
}

function GrowthMetrics() {
  const [view, setView] = useState<"yearly" | "quarterly" | "monthly">("yearly");

  const byYear = useMemo(() => {
    const years: Record<string, { projects: number; certs: number; blogs: number }> = {};
    for (const p of projects) {
      const y = p.completionDate?.slice(0, 4);
      if (y && /^\d{4}$/.test(y)) {
        if (!years[y]) years[y] = { projects: 0, certs: 0, blogs: 0 };
        years[y].projects++;
      }
    }
    for (const c of vaultCertifications) {
      const y = c.date?.slice(0, 4);
      if (y && /^\d{4}$/.test(y)) {
        if (!years[y]) years[y] = { projects: 0, certs: 0, blogs: 0 };
        years[y].certs++;
      }
    }
    for (const b of blogPosts) {
      const y = b.date?.slice(0, 4);
      if (y && /^\d{4}$/.test(y)) {
        if (!years[y]) years[y] = { projects: 0, certs: 0, blogs: 0 };
        years[y].blogs++;
      }
    }
    return Object.entries(years).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const maxVal = Math.max(...byYear.flatMap(([, v]) => [v.projects, v.certs, v.blogs]));

  const viewOptions = [
    { id: "yearly" as const, label: "Yearly" },
    { id: "quarterly" as const, label: "Quarterly" },
    { id: "monthly" as const, label: "Monthly" },
  ];

  return (
    <section id="growth" className="mb-12 scroll-mt-20">
      <div className="flex items-center justify-between mb-5">
        <SectionHeader label="Growth Metrics" icon={IconTrendingUp} />
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5 border border-white/5">
          {viewOptions.map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={cn(
                "px-2.5 py-1 text-xs font-mono rounded-md transition-colors",
                view === v.id ? "bg-cyan/20 text-cyan" : "text-foreground-tertiary hover:text-foreground-secondary"
              )}
            >{v.label}</button>
          ))}
        </div>
      </div>

      {view === "yearly" && (
        <GlassCard className="p-5" glow="cyan" intensity="low">
          <div className="flex items-end gap-2 sm:gap-3 h-40">
            {byYear.map(([year, data]) => (
              <div key={year} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                <span className="text-xs font-mono text-cyan tabular-nums">{data.projects}</span>
                <motion.div
                  className="w-full rounded-sm bg-cyan/30 border border-cyan/20"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, (data.projects / maxVal) * 100)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  title="Projects"
                />
                <span className="text-xs font-mono text-purple tabular-nums">{data.certs}</span>
                <motion.div
                  className="w-full rounded-sm bg-purple/30 border border-purple/20"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, (data.certs / maxVal) * 80)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  title="Certifications"
                />
                <span className="text-xs font-mono text-green tabular-nums">{data.blogs}</span>
                <motion.div
                  className="w-full rounded-sm bg-green/30 border border-green/20"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, (data.blogs / maxVal) * 60)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  title="Research"
                />
                <span className="text-xs font-mono text-foreground-tertiary mt-1">{year}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs font-mono text-foreground-tertiary">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-cyan/40" /> Projects</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-purple/40" /> Certifications</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green/40" /> Research</span>
          </div>
        </GlassCard>
      )}

      {(view === "quarterly" || view === "monthly") && (
        <GlassCard className="p-5" glow="purple" intensity="low">
          <p className="text-xs text-foreground-tertiary text-center py-8">
            Quarterly and monthly views are available in the interactive version with full data granularity.
          </p>
        </GlassCard>
      )}
    </section>
  );
}

function LearningTimeline() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const milestones = useMemo(() => {
    const m: { id: string; date: string; title: string; description: string; type: "education" | "cert" | "project" | "ctf" | "blog" | "milestone"; details?: string }[] = [];

    m.push({ id: "start-programming", date: "2013-09", title: "Started Programming", description: "Began computer science education at Stanford University", type: "milestone", details: "Started with C and C++, building foundation in systems programming." });

    for (const exp of experiences) {
      if (exp.type === "education") {
        m.push({ id: `edu-${exp.company}`, date: exp.period.slice(0, 4), title: exp.role, description: `${exp.company} — ${exp.description}`, type: "education", details: exp.highlights.join(" • ") });
      }
    }

    for (const cert of vaultCertifications) {
      if (cert.featured) {
        m.push({ id: `cert-${cert.badge}`, date: cert.date, title: cert.name, description: `${cert.issuer} — ${cert.learningHours}h of study`, type: "cert", details: cert.topics?.join(" • ") });
      }
    }

    for (const p of projects) {
      if (p.featured) {
        m.push({ id: `proj-${p.id}`, date: p.completionDate, title: p.title, description: p.description.slice(0, 100), type: "project", details: `${p.difficulty} • ${p.languages.join(", ")}` });
      }
    }

    for (const a of achievements) {
      if (a.type === "ctf" || a.type === "competition") {
        m.push({ id: `ach-${a.id}`, date: a.date, title: a.title, description: a.description.slice(0, 120), type: "ctf", details: a.issuer });
      }
    }

    return m.sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const [visibleCount, setVisibleCount] = useState(12);

  return (
    <section id="timeline" className="mb-12 scroll-mt-20">
      <SectionHeader label="Learning Timeline" icon={IconHistory} />
      <GlassCard className="p-5" glow="purple" intensity="low">
        <div className="relative pl-5 border-l border-white/10">
          {milestones.slice(0, visibleCount).map((m, i) => (
            <motion.div
              key={m.id}
              className="relative pb-5 last:pb-0 cursor-pointer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setExpanded(expanded === m.id ? null : m.id)}
            >
              <div className={cn(
                "absolute -left-[13px] w-2.5 h-2.5 rounded-full border-2 mt-1.5",
                m.type === "milestone" ? "bg-cyan border-cyan" :
                m.type === "cert" ? "bg-purple border-purple" :
                m.type === "education" ? "bg-blue border-blue" :
                m.type === "project" ? "bg-green border-green" :
                "bg-amber border-amber"
              )} />
              <div className="flex items-start gap-3">
                <span className="text-xs font-mono text-foreground-tertiary shrink-0 mt-0.5">{m.date}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "text-xs font-mono uppercase tracking-wider",
                      m.type === "milestone" ? "text-cyan" :
                      m.type === "cert" ? "text-purple" :
                      m.type === "education" ? "text-blue" :
                      m.type === "project" ? "text-green" : "text-amber"
                    )}>{m.type}</span>
                    <span className="text-xs text-foreground font-medium truncate">{m.title}</span>
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5 leading-relaxed">{m.description}</p>
                  <AnimatePresence>
                    {expanded === m.id && m.details && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-xs text-foreground-tertiary mt-1 leading-relaxed overflow-hidden"
                      >{m.details}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {milestones.length > visibleCount && (
          <div className="text-center mt-4">
            <button onClick={() => setVisibleCount(visibleCount + 12)} className="text-xs font-mono text-cyan hover:text-cyan/80 transition-colors">
              Show {Math.min(12, milestones.length - visibleCount)} more milestones
            </button>
          </div>
        )}
      </GlassCard>
    </section>
  );
}

function TechnologyEvolution() {
  const techs = useMemo(() => {
    const t = galaxySkills
      .filter(s => s.nodeType === "core")
      .sort((a, b) => (b.yearsPracticed || 0) - (a.yearsPracticed || 0))
      .slice(0, 14);
    return t;
  }, []);

  return (
    <section id="tech-evolution" className="mb-12 scroll-mt-20">
      <SectionHeader label="Technology Evolution" icon={IconLayersIntersect} />
      <GlassCard className="p-5" glow="blue" intensity="low">
        <div className="flex flex-col gap-0">
          {techs.map((tech, i) => (
            <motion.div
              key={tech.name}
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-xs font-mono text-foreground-tertiary w-6 text-right">{i + 1}</span>
              <div className="flex-1 flex items-center gap-2">
                <div className="text-xs font-medium" style={{ color: tech.color }}>{tech.name}</div>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent mx-2" />
              </div>
              <span className="text-xs font-mono text-foreground-tertiary">{tech.yearsPracticed}+ yrs</span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-foreground-tertiary uppercase">{tech.cluster}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}

function ProjectAnalytics() {
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    PROJECT_CATEGORIES.forEach(c => map.set(c.id, 0));
    for (const p of projects) {
      map.set(p.category, (map.get(p.category) || 0) + 1);
      p.secondaryCategories?.forEach(sc => map.set(sc, (map.get(sc) || 0) + 1));
    }
    return PROJECT_CATEGORIES.map(c => ({ label: c.label, count: map.get(c.id) || 0, color: c.color })).filter(x => x.count > 0).sort((a, b) => b.count - a.count);
  }, []);

  const byDifficulty = useMemo(() => {
    const d: Record<string, number> = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
    for (const p of projects) d[p.difficulty]++;
    return d;
  }, []);

  const maxCat = Math.max(...byCategory.map(c => c.count));

  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  return (
    <section id="project-analytics" className="mb-12 scroll-mt-20">
      <SectionHeader label="Project Analytics" icon={IconCode} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-5" glow="green" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">By Category</h3>
          <div className="space-y-2">
            {byCategory.slice(0, 10).map(cat => (
              <div key={cat.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono"
                  onMouseEnter={() => setExpandedCat(cat.label)}
                  onMouseLeave={() => setExpandedCat(null)}
                >
                  <span style={{ color: cat.color }}>{cat.label}</span>
                  <span className="text-foreground-tertiary">{cat.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.count / maxCat) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5" glow="amber" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">By Difficulty</h3>
          <div className="flex items-end gap-3 h-32">
            {Object.entries(byDifficulty).map(([key, count]) => {
              const colors: Record<string, string> = { beginner: "#22c55e", intermediate: "#eab308", advanced: "#f97316", expert: "#ef4444" };
              const maxCount = Math.max(...Object.values(byDifficulty));
              return (
                <div key={key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-xs font-mono text-foreground-tertiary tabular-nums">{count}</span>
                  <motion.div
                    className="w-full rounded-sm"
                    style={{ backgroundColor: colors[key] || "#6366f1" }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxCount) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  <span className="text-xs font-mono text-foreground-tertiary uppercase">{key.slice(0, 4)}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function CertificationAnalytics() {
  const byPlatform = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of vaultCertifications) {
      const p = c.platform || c.issuer;
      map.set(p, (map.get(p) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const byDifficulty = useMemo(() => {
    const d: Record<string, number> = { beginner: 0, intermediate: 0, advanced: 0, expert: 0 };
    for (const c of vaultCertifications) if (c.difficulty) d[c.difficulty]++;
    return d;
  }, []);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of vaultCertifications) {
      const cat = c.category || "cybersecurity";
      map.set(cat, (map.get(cat) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const certTimeline = useMemo(() => {
    return vaultCertifications
      .filter(c => c.date)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 10);
  }, []);

  const maxPlatform = Math.max(...byPlatform.map(([, c]) => c));

  return (
    <section id="cert-analytics" className="mb-12 scroll-mt-20">
      <SectionHeader label="Certification Analytics" icon={IconCertificate} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4" glow="purple" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">By Platform</h3>
          <div className="space-y-1.5">
            {byPlatform.slice(0, 6).map(([platform, count]) => (
              <div key={platform} className="flex items-center gap-2">
                <span className="text-xs font-mono flex-1 truncate">{platform}</span>
                <div className="h-1.5 w-16 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-purple/40"
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxPlatform) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className="text-xs font-mono text-foreground-tertiary tabular-nums w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4" glow="amber" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">By Difficulty</h3>
          <div className="flex items-end gap-2 h-24">
            {Object.entries(byDifficulty).map(([key, count]) => {
              const colors: Record<string, string> = { beginner: "#22c55e", intermediate: "#eab308", advanced: "#f97316", expert: "#ef4444" };
              const maxCount = Math.max(...Object.values(byDifficulty));
              return (
                <div key={key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-xs font-mono text-foreground-tertiary">{count}</span>
                  <motion.div
                    className="w-full rounded-sm" style={{ backgroundColor: colors[key] }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxCount) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                  <span className="text-xs font-mono text-foreground-tertiary uppercase">{key.slice(0, 4)}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-4" glow="cyan" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">By Domain</h3>
          <div className="space-y-1.5">
            {byCategory.slice(0, 6).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2">
                <span className="text-xs font-mono flex-1 truncate capitalize">{cat.replace(/-/g, " ")}</span>
                <div className="h-1.5 w-16 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-cyan/40"
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / byCategory[0][1]) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className="text-xs font-mono text-foreground-tertiary tabular-nums w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-4 mt-4" glow="purple" intensity="low">
        <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">Completion Timeline</h3>
        <div className="flex flex-wrap gap-2">
          {certTimeline.map((c, i) => (
            <div key={c.badge} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
              <span className="text-xs font-mono text-foreground-tertiary">{c.date}</span>
              <span className="text-xs font-mono text-foreground-secondary truncate max-w-[140px]">{c.name.split("(")[0].trim()}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}

function SkillGrowth() {
  const topSkills = useMemo(() => {
    return galaxySkills
      .filter(s => s.nodeType === "core")
      .sort((a, b) => (b.yearsPracticed || 0) - (a.yearsPracticed || 0))
      .slice(0, 12);
  }, []);

  const maxYears = Math.max(...topSkills.map(s => s.yearsPracticed || 0));

  return (
    <section id="skill-growth" className="mb-12 scroll-mt-20">
      <SectionHeader label="Skill Growth" icon={IconBrain} />
      <GlassCard className="p-5" glow="cyan" intensity="low">
        <div className="space-y-2.5">
          {topSkills.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <span className="text-xs font-mono text-foreground-tertiary w-4 text-right">{i + 1}</span>
              <span className="text-xs font-medium w-28 truncate" style={{ color: skill.color }}>{skill.name}</span>
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: skill.color, opacity: 0.6 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((skill.yearsPracticed || 0) / maxYears) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                />
              </div>
              <span className="text-xs font-mono text-foreground-tertiary tabular-nums w-8 text-right">{skill.yearsPracticed}y</span>
              <span className="text-xs font-mono px-1 py-0.5 rounded bg-white/[0.04] text-foreground-tertiary uppercase">{skill.cluster}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}

function CTFAnalytics() {
  const ctfAch = achievements.filter(a => a.type === "ctf" || a.type === "competition");
  const hackathonAch = achievements.filter(a => a.type === "hackathon");
  const openSourceAch = achievements.filter(a => a.type === "opensource");
  const recognitionAch = achievements.filter(a => a.type === "recognition");
  const totalLabs = vaultCertifications.reduce((a, c) => a + (c.practicalLabs || 0), 0);
  const totalHours = vaultCertifications.reduce((a, c) => a + (c.learningHours || 0), 0);

  return (
    <section id="ctf-analytics" className="mb-12 scroll-mt-20">
      <SectionHeader label="CTF & Lab Analytics" icon={IconFlag} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <AnimatedCounter value={totalLabs} label="Practical Labs" color="#06b6d4" />
        <AnimatedCounter value={totalHours} label="Learning Hours" color="#8b5cf6" />
        <AnimatedCounter value={ctfAch.length} label="CTF / Competitions" color="#f59e0b" />
        <AnimatedCounter value={hackathonAch.length} label="Hackathons" color="#22c55e" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-4" glow="amber" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">Competition Results</h3>
          <div className="space-y-2">
            {ctfAch.map(a => (
              <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                <IconAward size={10} className="text-amber mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">{a.title}</div>
                  <p className="text-xs text-foreground/60 leading-relaxed">{a.description.slice(0, 120)}</p>
                  <span className="text-xs font-mono text-foreground-tertiary">{a.issuer} • {a.date}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-4" glow="green" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">Hackathons & Recognition</h3>
          <div className="space-y-2">
            {[...hackathonAch, ...recognitionAch, ...openSourceAch].slice(0, 5).map(a => (
              <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]">
                <IconStar size={10} className={a.type === "hackathon" ? "text-purple" : a.type === "recognition" ? "text-amber" : "text-cyan"} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">{a.title}</div>
                  <p className="text-xs text-foreground/60 leading-relaxed">{a.description.slice(0, 120)}</p>
                  <span className="text-xs font-mono text-foreground-tertiary">{a.issuer} • {a.date}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function GitHubAnalytics() {
  const totalCommits = projects.reduce((a, p) => a + (p.commits || 0), 0);
  const totalStars = projects.reduce((a, p) => a + (p.stars || 0), 0);
  const totalLoc = projects.reduce((a, p) => a + (p.loc || 0), 0);
  const openSource = projects.filter(p => p.openSource).length;
  const allLangs = new Set(projects.flatMap(p => p.languages));

  const topRepos = useMemo(() => {
    return [...projects].sort((a, b) => (b.commits || 0) - (a.commits || 0)).slice(0, 8);
  }, []);

  const langCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      for (const lang of p.languages) map.set(lang, (map.get(lang) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const maxLang = Math.max(...langCounts.map(([, c]) => c));

  return (
    <section id="github-analytics" className="mb-12 scroll-mt-20">
      <SectionHeader label="GitHub Analytics" icon={IconBrandGithub} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <AnimatedCounter value={totalCommits.toLocaleString()} label="Total Commits" color="#6366f1" />
        <AnimatedCounter value={totalStars} label="GitHub Stars" color="#eab308" />
        <AnimatedCounter value={`${(totalLoc / 1000).toFixed(0)}K`} label="Lines of Code" color="#06b6d4" />
        <AnimatedCounter value={openSource} label="Open Source Repos" color="#22c55e" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-4" glow="purple" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">Top Repositories by Commits</h3>
          <div className="space-y-1.5">
            {topRepos.map((r, i) => {
              const pct = r.commits ? (r.commits / totalCommits) * 100 : 0;
              return (
                <div key={r.id} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-foreground-tertiary w-3 text-right">{i + 1}</span>
                  <span className="text-xs font-mono flex-1 truncate">{r.title}</span>
                  <div className="w-12 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo/50" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-mono text-foreground-tertiary tabular-nums w-10 text-right">{r.commits || 0}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
        <GlassCard className="p-4" glow="cyan" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">Language Distribution</h3>
          <div className="space-y-1.5">
            {langCounts.slice(0, 10).map(([lang, count]) => (
              <div key={lang} className="flex items-center gap-2">
                <span className="text-xs font-mono flex-1">{lang}</span>
                <div className="h-1.5 w-20 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan/40" style={{ width: `${(count / maxLang) * 100}%` }} />
                </div>
                <span className="text-xs font-mono text-foreground-tertiary tabular-nums">{count} repos</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function ResearchAnalytics() {
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of blogPosts) {
      map.set(b.category, (map.get(b.category) || 0) + 1);
    }
    return Array.from(map.entries());
  }, []);

  const byYear = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of blogPosts) {
      const y = b.date.slice(0, 4);
      map.set(y, (map.get(y) || 0) + 1);
    }
    return Array.from(map.entries()).sort();
  }, []);

  const allTags = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of blogPosts) for (const t of b.tags) map.set(t, (map.get(t) || 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <section id="research-analytics" className="mb-12 scroll-mt-20">
      <SectionHeader label="Research Analytics" icon={IconBook} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4" glow="green" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">By Category</h3>
          <div className="space-y-2">
            {byCategory.map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between text-xs font-mono">
                <span className="capitalize">{cat.replace(/-/g, " ")}</span>
                <span className="text-foreground-tertiary">{count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4" glow="blue" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">By Year</h3>
          <div className="space-y-2">
            {byYear.map(([year, count]) => (
              <div key={year} className="flex items-center justify-between text-xs font-mono">
                <span>{year}</span>
                <div className="flex-1 mx-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-blue/40" style={{ width: `${(count / Math.max(...byYear.map(([, c]) => c))) * 100}%` }} />
                </div>
                <span className="text-foreground-tertiary">{count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4" glow="green" intensity="low">
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">Topics Covered</h3>
          <div className="flex flex-wrap gap-1.5">
            {allTags.slice(0, 15).map(([tag]) => (
              <span key={tag} className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5 text-foreground-secondary">{tag}</span>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function AchievementAnalytics() {
  const ordered = useMemo(() => {
    return [...achievements].sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const typeColors: Record<string, string> = { ctf: "#f59e0b", competition: "#a855f7", hackathon: "#8b5cf6", opensource: "#6366f1", recognition: "#f97316" };

  return (
    <section id="achievements" className="mb-12 scroll-mt-20">
      <SectionHeader label="Achievement Analytics" icon={IconAward} />
      <GlassCard className="p-5" glow="amber" intensity="low">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ordered.map(a => (
            <motion.div
              key={a.id}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: a.color + "20", color: a.color }}>
                <IconStar size={10} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono uppercase tracking-wider" style={{ color: typeColors[a.type] || "#06b6d4" }}>{a.type}</span>
                  <span className="text-xs font-mono text-foreground-tertiary">{a.date}</span>
                </div>
                <p className="text-xs font-medium text-foreground mt-0.5">{a.title}</p>
                <p className="text-xs text-foreground/60 leading-relaxed mt-0.5">{a.description.slice(0, 100)}</p>
                <span className="text-xs font-mono text-foreground-tertiary">{a.issuer}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}

function CurrentLearning() {
  const plannedCerts = certificationRoadmap.filter(r => r.status === "planned");
  const inProgressCerts = certificationRoadmap.filter(r => r.status === "in-progress");
  const currentFocus = projects.filter(p => p.status === "in_progress");

  return (
    <section id="current-learning" className="mb-12 scroll-mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-5" glow="cyan" intensity="low">
          <SectionHeader label="Active Learning" icon={IconBrain} />
          {inProgressCerts.length > 0 ? (
            <div className="space-y-2">
              {inProgressCerts.map(c => (
                <div key={c.certName} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                  <IconRefresh size={10} className="text-cyan shrink-0" />
                  <span className="text-xs font-mono">{c.certName}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-foreground/60">No certifications currently in progress.</p>
          )}
          <div className="mt-3">
            <h4 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5">Active Projects</h4>
            {currentFocus.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {currentFocus.map(p => (
                  <span key={p.id} className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5">{p.title}</span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-foreground/60">No active projects.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-5" glow="purple" intensity="low">
          <SectionHeader label="Planned Roadmap" icon={IconTarget} />
          <div className="space-y-2">
            {plannedCerts.map(c => (
              <div key={c.certName} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                <IconClock size={10} className="text-purple shrink-0" />
                <div>
                  <span className="text-xs font-mono">{c.certName.split("(")[0].trim()}</span>
                  <span className="text-xs font-mono text-foreground-tertiary ml-1.5">{c.category.replace(/-/g, " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function CareerInsights() {
  const mostActiveArea = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
      p.secondaryCategories?.forEach(sc => counts.set(sc, (counts.get(sc) || 0) + 1));
    }
    const maxCat = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    const catLabel = PROJECT_CATEGORIES.find(c => c.id === maxCat?.[0])?.label || maxCat?.[0] || "";
    return catLabel;
  }, []);

  const recentlyAcquired = useMemo(() => {
    return vaultCertifications.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(c => c.name.split("(")[0].trim());
  }, []);

  const topProjects = useMemo(() => {
    return [...projects].sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 3).map(p => p.title);
  }, []);

  const projectLangCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) for (const l of p.languages) map.set(l, (map.get(l) || 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <section id="insights" className="mb-12 scroll-mt-20">
      <SectionHeader label="Career Insights" icon={IconBulb} />
      <GlassCard className="p-5" glow="cyan" intensity="low">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <h4 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5">Most Active Area</h4>
            <p className="text-xs font-medium text-cyan">{mostActiveArea}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <h4 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5">Recently Acquired</h4>
            {recentlyAcquired.map((r, i) => (
              <p key={i} className="text-xs text-foreground/80">{r}</p>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <h4 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5">Top Projects</h4>
            {topProjects.map((p, i) => (
              <p key={i} className="text-xs text-foreground/80">#{i + 1} {p}</p>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <h4 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5">Primary Languages</h4>
            {projectLangCount.slice(0, 3).map(([lang, count]) => (
              <p key={lang} className="text-xs text-foreground/80">{lang} — used in {count} projects</p>
            ))}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="mb-12 pt-6 sm:pt-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-2">
          <IconChartBar size={14} className="text-cyan" />
          <span className="text-xs font-mono text-cyan tracking-widest uppercase">Analytics Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-2">
          Career <span className="text-cyan">Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 max-w-2xl mb-6 leading-relaxed">
          Explore my cybersecurity learning journey through interactive insights, achievements, and technical milestones.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => scrollTo("timeline")}><IconHistory size={12} /> Learning Timeline</Button>
          <Button variant="secondary" size="sm" onClick={() => scrollTo("achievements")}><IconAward size={12} /> Achievements</Button>
          <Button variant="secondary" size="sm" onClick={() => scrollTo("current-learning")}><IconTarget size={12} /> Current Goals</Button>
          <Button variant="secondary" size="sm" onClick={() => window.print()}><IconDownload size={12} /> Download Summary</Button>
        </div>
      </motion.div>
    </section>
  );
}

export function CareerAnalyticsPage() {
  return (
    <PageTransition>
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <HeroSection />
          <CareerSnapshot />
          <GrowthMetrics />
          <LearningTimeline />
          <TechnologyEvolution />
          <ProjectAnalytics />
          <CertificationAnalytics />
          <SkillGrowth />
          <CTFAnalytics />
          <GitHubAnalytics />
          <ResearchAnalytics />
          <AchievementAnalytics />
          <CurrentLearning />
          <CareerInsights />

          <motion.div
            className="mt-12 text-center border-t border-white/5 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-xs font-mono text-foreground-tertiary">
              Career Analytics Dashboard v1.0 — All metrics derived from documented portfolio data.
            </p>
            <p className="text-xs font-mono text-foreground-tertiary/60 mt-1">
              {projects.length} projects • {vaultCertifications.length} certifications • {skills.length} skills • {galaxySkills.length} technologies • {blogPosts.length} articles • {achievements.length} achievements
            </p>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
