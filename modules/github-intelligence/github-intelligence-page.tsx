"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { projects, PROJECT_CATEGORIES } from "@/data/projects";
import { skills } from "@/data/skills";
import { vaultCertifications } from "@/data/certifications-vault";
import type { Project } from "@/types";
import {
  IconBrandGithub, IconStar, IconGitFork, IconCode, IconExternalLink,
  IconSearch, IconX, IconCalendar, IconChartBar, IconLayersIntersect,
  IconFileText, IconArrowRight, IconGitCommit, IconUsers, IconBox,
  IconChevronDown,
} from "@tabler/icons-react";

const githubProfile = {
  username: "maanastmanoj",
  name: "Maanas T Manoj",
  bio: "Cybersecurity Engineer building secure systems through offensive security, AI-driven defense, and open-source tooling.",
  avatar: null,
  publicRepos: projects.length,
  followers: 47,
  following: 32,
  totalStars: projects.reduce((a, p) => a + (p.stars || 0), 0),
  totalForks: projects.reduce((a, p) => a + (p.contributors || 0), 0),
  organizations: ["CyberSec Corp"],
  createdAt: "2019",
  portfolioUrl: "https://cybernexus.io",
};

function AnimatedCounter({ value, label, color, format }: { value: number; label: string; color: string; format?: (n: number) => string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
      <div className="text-lg sm:text-xl font-light tabular-nums" style={{ color }}>{format ? format(value) : value}</div>
      <div className="text-[10px] font-mono text-foreground-tertiary mt-0.5 leading-tight uppercase tracking-wider">{label}</div>
    </div>
  );
}

function SectionHeader({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="text-cyan"><Icon size={14} /></div>
      <h2 className="text-xs font-mono text-foreground-tertiary uppercase tracking-widest">{label}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2" />
    </div>
  );
}

function starFormat(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n); }

function ProfileOverview() {
  return (
    <GlassCard className="p-5 sm:p-6" glow="cyan" intensity="low">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan/20 to-purple/20 border border-white/10 flex items-center justify-center shrink-0">
          <IconBrandGithub size={28} className="text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-base sm:text-lg font-medium text-foreground">{githubProfile.name}</h2>
            <span className="text-xs font-mono text-foreground-tertiary">@{githubProfile.username}</span>
          </div>
          <p className="text-xs text-foreground/70 leading-relaxed">{githubProfile.bio}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-foreground-tertiary">
            <span className="flex items-center gap-1"><IconStar size={10} className="text-yellow-500" />{starFormat(githubProfile.totalStars)} stars</span>
            <span className="flex items-center gap-1"><IconGitFork size={10} />{githubProfile.totalForks} forks</span>
            <span className="flex items-center gap-1"><IconBox size={10} />{githubProfile.publicRepos} repos</span>
            <span className="flex items-center gap-1"><IconUsers size={10} />{githubProfile.followers} followers</span>
            <span className="flex items-center gap-1"><IconCalendar size={10} />Since {githubProfile.createdAt}</span>
          </div>
        </div>
        <div className="shrink-0">
          <a href={`https://github.com/${githubProfile.username}`} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm"><IconExternalLink size={12} /> GitHub</Button>
          </a>
        </div>
      </div>
    </GlassCard>
  );
}

function QuickStats() {
  const stats = useMemo(() => {
    const allLangs = new Set(projects.flatMap((p) => p.languages || []));
    const totalCommits = projects.reduce((a, p) => a + (p.commits || 0), 0);
    const totalLOC = projects.reduce((a, p) => a + (p.loc || 0), 0);
    const openSource = projects.filter((p) => p.openSource).length;
    const featured = projects.filter((p) => p.featured).length;
    return { totalCommits, totalLOC, allLangs: allLangs.size, openSource, featured };
  }, []);

  const items = [
    { value: githubProfile.publicRepos, label: "Repositories", color: "#06b6d4" },
    { value: stats.allLangs, label: "Languages", color: "#8b5cf6" },
    { value: stats.totalCommits, label: "Commits", color: "#22c55e", format: (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) },
    { value: stats.totalLOC, label: "Lines of Code", color: "#f97316", format: (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) },
    { value: stats.openSource, label: "Open Source", color: "#3b82f6" },
    { value: githubProfile.totalStars, label: "Stars Received", color: "#eab308", format: starFormat },
    { value: stats.featured, label: "Featured", color: "#ec4899" },
    { value: githubProfile.followers, label: "Followers", color: "#06b6d4" },
  ];

  return (
    <div>
      <SectionHeader label="Quick Statistics" icon={IconChartBar} />
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {items.map((item) => (
          <AnimatedCounter key={item.label} value={item.value} label={item.label} color={item.color} format={item.format as any} />
        ))}
      </div>
    </div>
  );
}

function LanguageDistribution() {
  const langData = useMemo(() => {
    const map = new Map<string, { count: number; totalLOC: number; projects: string[]; color: string }>();
    projects.forEach((p) => {
      (p.languages || []).forEach((lang) => {
        if (!map.has(lang)) map.set(lang, { count: 0, totalLOC: 0, projects: [], color: "#06b6d4" });
        const entry = map.get(lang)!;
        entry.count++;
        entry.totalLOC += Math.round((p.loc || 0) / (p.languages?.length || 1));
        entry.projects.push(p.title);
      });
    });
    const langColors: Record<string, string> = {
      Python: "#3572A5", TypeScript: "#3178C6", Go: "#00ADD8", Rust: "#DEA584",
      C: "#555555", JavaScript: "#F7DF1E", Java: "#B07219", "C++": "#F34B7D",
      Solidity: "#CCCCCC", Shell: "#89E051", "C#": "#178600",
    };
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data, color: langColors[name] || "#06b6d4" }))
      .sort((a, b) => b.totalLOC - a.totalLOC);
  }, []);

  const maxLOC = Math.max(...langData.map((l) => l.totalLOC));

  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader label="Language Distribution" icon={IconCode} />
      <div className="space-y-2">
        {langData.map((lang) => {
          const projectsInLang = projects.filter((p) => p.languages?.includes(lang.name));
          return (
            <div key={lang.name}>
              <button onClick={() => setSelectedLang(selectedLang === lang.name ? null : lang.name)} className="w-full p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all text-left">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: lang.color }} />
                    <span className="text-[11px] font-medium text-foreground">{lang.name}</span>
                    <span className="text-xs font-mono text-foreground-tertiary">{lang.count} repos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-foreground-tertiary">{starFormat(lang.totalLOC)} lines</span>
                    <IconChevronDown size={10} className={cn("text-foreground-tertiary transition-transform", selectedLang === lang.name && "rotate-180")} />
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${(lang.totalLOC / maxLOC) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ background: lang.color }} />
                </div>
              </button>
              <AnimatePresence>
                {selectedLang === lang.name && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="flex flex-wrap gap-1 p-2">
                      {projectsInLang.map((p) => (
                        <a key={p.id} href={`/projects/${p.id}`} className="flex items-center gap-1 text-xs font-mono px-1.5 py-1 rounded-lg bg-white/5 text-foreground-tertiary hover:text-foreground hover:bg-white/10 border border-white/10 transition-all">
                          {p.title}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TechnologyAnalytics() {
  const techData = useMemo(() => {
    const map = new Map<string, { count: number; categories: Set<string>; projects: string[] }>();
    projects.forEach((p) => {
      (p.techStack || []).forEach((t) => {
        if (!map.has(t.name)) map.set(t.name, { count: 0, categories: new Set(), projects: [] });
        const entry = map.get(t.name)!;
        entry.count++;
        entry.categories.add(p.category);
        entry.projects.push(p.title);
      });
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, count: data.count, categories: Array.from(data.categories), projects: data.projects }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, []);

  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader label="Technology Stack" icon={IconLayersIntersect} />
      <div className="flex flex-wrap gap-1.5">
        {techData.map((tech) => (
          <button key={tech.name} onClick={() => setSelectedTech(selectedTech === tech.name ? null : tech.name)} className={cn("text-xs font-mono px-2 py-1 rounded-lg border transition-all", selectedTech === tech.name ? "bg-cyan/10 border-cyan/30 text-cyan" : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground hover:bg-white/10")}>
            {tech.name}
            <span className="ml-1 text-[10px] opacity-60">x{tech.count}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selectedTech && (() => {
          const tech = techData.find((t) => t.name === selectedTech);
          if (!tech) return null;
          return (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mt-2">
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {tech.categories.map((c) => <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-foreground-tertiary font-mono">{c}</span>)}
                </div>
                <div className="flex flex-wrap gap-1">
                  {tech.projects.map((p) => {
                    const project = projects.find((pr) => pr.title === p);
                    return project ? (
                      <a key={p} href={`/projects/${project.id}`} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan/5 text-cyan border border-cyan/10 hover:bg-cyan/10 transition-colors">
                        {p}
                      </a>
                    ) : <span key={p} className="text-[10px] font-mono text-foreground-tertiary">{p}</span>;
                  })}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

function RepositoryExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"stars" | "commits" | "updated" | "name">("stars");
  const [selectedRepo, setSelectedRepo] = useState<Project | null>(null);

  const categories = useMemo(() => PROJECT_CATEGORIES.map((c) => c.id), []);

  const filtered = useMemo(() => {
    let result = [...projects];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)) || p.languages?.some((l) => l.toLowerCase().includes(q)));
    }
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (activeDifficulty) result = result.filter((p) => p.difficulty === activeDifficulty);
    result.sort((a, b) => {
      if (sortBy === "stars") return (b.stars || 0) - (a.stars || 0);
      if (sortBy === "commits") return (b.commits || 0) - (a.commits || 0);
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });
    return result;
  }, [searchQuery, activeCategory, activeDifficulty, sortBy]);

  const difficultyFilter = ["beginner", "intermediate", "advanced", "expert"];

  const formatNumber = (n: number | undefined) => {
    if (!n) return "0";
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  };

  return (
    <div>
      <SectionHeader label="Repository Explorer" icon={IconSearch} />
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3">
        <div className="relative flex-1 max-w-xs w-full">
          <IconSearch size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search repos..." className="w-full h-8 pl-7 pr-7 text-xs bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-foreground-tertiary/40 outline-none focus:border-cyan/30 focus:bg-white/10 transition-all" />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-foreground-tertiary"><IconX size={10} /></button>}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "stars" | "commits" | "name")} className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-foreground font-mono outline-none focus:border-cyan/30">
          <option value="stars">Stars</option>
          <option value="commits">Commits</option>
          <option value="name">Name</option>
        </select>
        <div className="flex flex-wrap gap-1">
          {difficultyFilter.map((d) => (
            <button key={d} onClick={() => setActiveDifficulty(activeDifficulty === d ? null : d)} className={cn("text-[10px] font-mono px-1.5 py-1 rounded-lg border transition-all", activeDifficulty === d ? "bg-cyan/10 border-cyan/30 text-cyan" : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground")}>{d}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        <button onClick={() => setActiveCategory(null)} className={cn("text-[10px] font-mono px-1.5 py-1 rounded-lg border transition-all", !activeCategory ? "bg-cyan/10 border-cyan/30 text-cyan" : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground")}>All</button>
        {categories.slice(0, 10).map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} className={cn("text-[10px] font-mono px-1.5 py-1 rounded-lg border transition-all", activeCategory === cat ? "bg-cyan/10 border-cyan/30 text-cyan" : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground")}>{cat.replace("-", " ")}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map((repo, i) => (
          <motion.button
            key={repo.id}
            layout
            onClick={() => setSelectedRepo(selectedRepo?.id === repo.id ? null : repo)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            className={cn("text-left p-3 rounded-xl border transition-all", selectedRepo?.id === repo.id ? "bg-cyan/[0.03] border-cyan/30" : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20")}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <IconBrandGithub size={10} className="text-foreground-tertiary shrink-0" />
                  <span className="text-[11px] font-medium text-foreground truncate">{repo.title}</span>
                  {repo.openSource && <span className="text-[10px] px-1 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 font-mono shrink-0">OS</span>}
                </div>
                <p className="text-xs text-foreground-tertiary mt-0.5 line-clamp-1">{repo.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs font-mono text-foreground-tertiary">
              {repo.languages && repo.languages.length > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: repo.languages[0] === "Python" ? "#3572A5" : repo.languages[0] === "Go" ? "#00ADD8" : repo.languages[0] === "TypeScript" ? "#3178C6" : repo.languages[0] === "Rust" ? "#DEA584" : "#06b6d4" }} />
                  {repo.languages[0]}
                </span>
              )}
              <span className="flex items-center gap-0.5"><IconStar size={8} className="text-yellow-500" />{formatNumber(repo.stars)}</span>
              <span className="flex items-center gap-0.5"><IconGitFork size={8} />{formatNumber(repo.contributors)}</span>
              <span className="flex items-center gap-0.5"><IconGitCommit size={8} />{formatNumber(repo.commits)}</span>
              <span className={cn("ml-auto", repo.difficulty === "expert" ? "text-red-400" : repo.difficulty === "advanced" ? "text-orange-400" : repo.difficulty === "intermediate" ? "text-yellow-400" : "text-green-400")}>{repo.difficulty}</span>
            </div>
            {repo.tags && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {repo.tags.slice(0, 4).map((t) => <span key={t} className="text-[10px] px-1 py-0.5 rounded bg-white/5 text-foreground-tertiary font-mono">{t}</span>)}
              </div>
            )}
          </motion.button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-8">
          <IconSearch size={24} className="mx-auto text-foreground-tertiary/30 mb-2" />
          <p className="text-xs text-foreground-tertiary">No repositories match your search.</p>
        </div>
      )}

      <AnimatePresence>
        {selectedRepo && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-3">
            <GlassCard className="p-4 sm:p-5" glow="cyan" intensity="medium">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <IconBrandGithub size={14} className="text-foreground" />
                    <h3 className="text-base font-medium text-foreground">{selectedRepo.title}</h3>
                    {selectedRepo.openSource && <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 font-mono">Open Source</span>}
                  </div>
                  <p className="text-xs text-foreground-tertiary">{selectedRepo.description}</p>
                </div>
                <button onClick={() => setSelectedRepo(null)} className="p-1 rounded-lg hover:bg-white/5 text-foreground-tertiary">
                  <IconX size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {selectedRepo.languages && <div className="p-2 rounded-lg bg-white/5"><div className="text-[10px] font-mono text-foreground-tertiary uppercase">Languages</div><div className="text-xs text-foreground mt-0.5">{selectedRepo.languages.join(", ")}</div></div>}
                {selectedRepo.stars ? <div className="p-2 rounded-lg bg-white/5"><div className="text-[10px] font-mono text-foreground-tertiary uppercase">Stars</div><div className="text-xs text-foreground mt-0.5 flex items-center gap-1"><IconStar size={10} className="text-yellow-500" />{formatNumber(selectedRepo.stars)}</div></div> : null}
                {selectedRepo.commits ? <div className="p-2 rounded-lg bg-white/5"><div className="text-[10px] font-mono text-foreground-tertiary uppercase">Commits</div><div className="text-xs text-foreground mt-0.5">{formatNumber(selectedRepo.commits)}</div></div> : null}
                {selectedRepo.loc ? <div className="p-2 rounded-lg bg-white/5"><div className="text-[10px] font-mono text-foreground-tertiary uppercase">Lines of Code</div><div className="text-xs text-foreground mt-0.5">{formatNumber(selectedRepo.loc)}</div></div> : null}
                {selectedRepo.platforms && <div className="p-2 rounded-lg bg-white/5"><div className="text-[10px] font-mono text-foreground-tertiary uppercase">Platforms</div><div className="text-xs text-foreground mt-0.5">{selectedRepo.platforms.join(", ")}</div></div>}
                {selectedRepo.complexity && <div className="p-2 rounded-lg bg-white/5"><div className="text-[10px] font-mono text-foreground-tertiary uppercase">Complexity</div><div className="text-xs text-foreground mt-0.5 capitalize">{selectedRepo.complexity}</div></div>}
                {selectedRepo.difficulty && <div className="p-2 rounded-lg bg-white/5"><div className="text-[10px] font-mono text-foreground-tertiary uppercase">Difficulty</div><div className="text-xs text-foreground mt-0.5 capitalize">{selectedRepo.difficulty}</div></div>}
                {selectedRepo.status && <div className="p-2 rounded-lg bg-white/5"><div className="text-[10px] font-mono text-foreground-tertiary uppercase">Status</div><div className="text-xs text-foreground mt-0.5 capitalize">{selectedRepo.status}</div></div>}
              </div>

              {selectedRepo.techStack && selectedRepo.techStack.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRepo.techStack.map((t) => (
                      <span key={t.name} className="text-[10px] px-1.5 py-1 rounded bg-white/5 text-foreground-tertiary border border-white/10 font-mono">{t.name} <span className="text-[10px] opacity-60">({t.experience})</span></span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                {selectedRepo.links?.github && <a href={selectedRepo.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-lg bg-cyan/10 text-cyan border border-cyan/20 hover:bg-cyan/15 transition-colors"><IconBrandGithub size={10} /> Repository</a>}
                {selectedRepo.links?.live && <a href={selectedRepo.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white/5 text-foreground-tertiary border border-white/10 hover:text-foreground hover:bg-white/10 transition-colors"><IconExternalLink size={10} /> Live Demo</a>}
                {selectedRepo.links?.documentation && <a href={selectedRepo.links.documentation} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white/5 text-foreground-tertiary border border-white/10 hover:text-foreground hover:bg-white/10 transition-colors"><IconFileText size={10} /> Docs</a>}
                <a href={`/projects/${selectedRepo.id}`} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-lg bg-white/5 text-foreground-tertiary border border-white/10 hover:text-foreground hover:bg-white/10 transition-colors"><IconArrowRight size={10} /> Project Details</a>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectConnections() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  return (
    <div>
      <SectionHeader label="Project Connections" icon={IconLayersIntersect} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {projects.filter((p) => p.relatedCertifications || p.relatedSkills || p.relatedBlogs).slice(0, 9).map((repo) => {
          const relatedSkillsList = (repo.relatedSkills || []).map((s) => skills.find((sk) => sk.name.toLowerCase().includes(s.toLowerCase()))).filter(Boolean);
          const relatedCertsList = repo.relatedCertifications || [];
          return (
            <div key={repo.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <div className="flex items-center gap-1.5 mb-1.5">
                <IconBrandGithub size={10} className="text-foreground-tertiary" />
                <a href={`/projects/${repo.id}`} className="text-xs font-medium text-foreground hover:text-cyan transition-colors">{repo.title}</a>
              </div>
              {relatedCertsList.length > 0 && (
                <div className="mb-1">
                  <span className="text-[10px] font-mono text-foreground-tertiary uppercase tracking-wider">Certifications</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {relatedCertsList.map((c) => <span key={c} className="text-[10px] px-1 py-0.5 rounded bg-purple/5 text-purple border border-purple/10 font-mono">{c}</span>)}
                  </div>
                </div>
              )}
              {relatedSkillsList.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-foreground-tertiary uppercase tracking-wider">Skills</span>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {relatedSkillsList.map((s) => s ? <span key={s.name} className="text-[10px] px-1 py-0.5 rounded bg-cyan/5 text-cyan border border-cyan/10 font-mono">{s.name}</span> : null)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GitHubIntelligencePage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
            <span className="text-xs text-purple font-mono tracking-wider uppercase">.github</span>
            <h1 className="text-3xl sm:text-4xl font-light text-foreground mt-1">
              GitHub <span className="text-gradient font-medium">Intelligence</span>
            </h1>
            <p className="text-foreground-tertiary text-xs mt-1.5 max-w-xl">
              Explore repositories, development activity, technologies, and engineering analytics across all portfolio projects.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="mb-6">
            <ProfileOverview />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="mb-8">
            <QuickStats />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="space-y-6">
              <LanguageDistribution />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }} className="space-y-6">
              <TechnologyAnalytics />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="mb-8">
            <RepositoryExplorer />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
            <ProjectConnections />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
