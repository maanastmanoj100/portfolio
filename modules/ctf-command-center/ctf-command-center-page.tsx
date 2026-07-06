"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  challenges, platforms, achievements, roadmap,
  CATEGORIES, DIFFICULTY_COLORS,
  type CTFChallenge, type Difficulty, type Category,
  TOTAL_CHALLENGES, TOTAL_COMPLETED, TOTAL_PLATFORMS, TOTAL_CATEGORIES_COVERED,
  getCompletedChallenges,
} from "./ctf-data";
import {
  IconFlag, IconTerminal2, IconGlobe, IconSearch, IconFilter, IconX,
  IconClock, IconCalendar, IconStar, IconTools, IconBrain, IconBook,
  IconChartBar, IconTrophy, IconChevronDown, IconChevronUp,
  IconArrowRight, IconCheck, IconShield, IconBug, IconCode,
  IconServer, IconCloud, IconExternalLink,
} from "@tabler/icons-react";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  tryhackme: <IconTerminal2 size={24} />,
  hackthebox: <IconFlag size={24} />,
  portswigger: <IconBug size={24} />,
  picoctf: <IconCode size={24} />,
  overthewire: <IconTerminal2 size={24} />,
  homelab: <IconServer size={24} />,
  other: <IconGlobe size={24} />,
};

const SECTION_IDS = {
  hero: "ctf-hero",
  platforms: "ctf-platforms",
  challenges: "ctf-challenges",
  timeline: "ctf-timeline",
  writeups: "ctf-writeups",
  methodology: "ctf-methodology",
  analytics: "ctf-analytics",
  achievements: "ctf-achievements",
  roadmap: "ctf-roadmap",
  assistant: "ctf-assistant",
};

function HeroSection() {
  const { recruiterMode } = useUIStore();

  const stats = [
    { label: "Challenges", value: TOTAL_COMPLETED, total: TOTAL_CHALLENGES, icon: <IconFlag size={20} /> },
    { label: "Platforms", value: TOTAL_PLATFORMS, icon: <IconGlobe size={20} /> },
    { label: "Categories", value: TOTAL_CATEGORIES_COVERED, icon: <IconGlobe size={20} /> },
    { label: "Achievements", value: achievements.filter((a) => a.unlocked).length, total: achievements.length, icon: <IconTrophy size={20} /> },
  ];

  return (
    <section id={SECTION_IDS.hero} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <IconFlag size={14} />
            Chapter 22 — Hands-On Security Practice
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            CTF & Cyber Range<br />Command Center
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore practical cybersecurity exercises, ethical hacking labs, capture-the-flag challenges,
            and documented learning experiences across multiple platforms.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => document.getElementById(SECTION_IDS.challenges)?.scrollIntoView({ behavior: "smooth" })}>
              Browse Challenges
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById(SECTION_IDS.writeups)?.scrollIntoView({ behavior: "smooth" })}>
              View Write-ups
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById(SECTION_IDS.timeline)?.scrollIntoView({ behavior: "smooth" })}>
              Learning Timeline
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          {stats.map((stat) => (
            <GlassCard key={stat.label} glow="cyan" intensity="low" variant="small" className="text-center">
              <div className="flex justify-center mb-1 text-cyan-400">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">
                {stat.value}{stat.total ? <span className="text-muted-foreground text-lg">/{stat.total}</span> : null}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PlatformOverview() {
  return (
    <section id={SECTION_IDS.platforms} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Platform Overview</h2>
        <p className="text-muted-foreground mb-8">Training platforms and environments used for hands-on practice</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            >
              <GlassCard glow="blue" intensity="low" className="h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    {PLATFORM_ICONS[platform.id] || <IconGlobe size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{platform.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{platform.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-cyan-400 font-medium">{platform.challengesCompleted} challenges</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{platform.learningProgress}% complete</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    initial={{ width: 0 }} animate={{ width: `${platform.learningProgress}%` }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {platform.focusAreas.slice(0, 4).map((area) => (
                    <span key={area} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">{area}</span>
                  ))}
                  {platform.focusAreas.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">+{platform.focusAreas.length - 4}</span>
                  )}
                </div>
                <div className="mt-3 text-xs text-muted-foreground italic">{platform.recentActivity}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChallengeCard({ challenge }: { challenge: CTFChallenge }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard
      glow={challenge.favorite ? "amber" : "cyan"}
      intensity="low"
      className="h-full"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold text-white truncate">{challenge.name}</h3>
          {challenge.favorite && <IconStar size={14} className="text-amber-400 shrink-0" />}
        </div>
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
            challenge.difficulty === "easy" && "text-green-400 bg-green-400/10",
            challenge.difficulty === "medium" && "text-yellow-400 bg-yellow-400/10",
            challenge.difficulty === "hard" && "text-red-400 bg-red-400/10",
            challenge.difficulty === "insane" && "text-purple-400 bg-purple-400/10",
          )}
        >
          {challenge.difficulty}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{challenge.platform}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{challenge.category}</span>
        {challenge.status === "in-progress" && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">In Progress</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{challenge.writeupSummary}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {challenge.completionDate && (
          <span className="flex items-center gap-1"><IconCalendar size={10} />{challenge.completionDate}</span>
        )}
        {challenge.timeInvested && (
          <span className="flex items-center gap-1"><IconClock size={10} />{challenge.timeInvested}</span>
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        {expanded ? "Less" : "Details"} {expanded ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
          >
            <div className="pt-2 border-t border-white/5 mt-2 space-y-2">
              {challenge.skillsPracticed.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {challenge.skillsPracticed.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {challenge.toolsUsed.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">Tools</div>
                  <div className="flex flex-wrap gap-1">
                    {challenge.toolsUsed.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {challenge.lessonsLearned.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">Lessons Learned</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {challenge.lessonsLearned.map((l, i) => (
                      <li key={i} className="text-xs text-muted-foreground">{l}</li>
                    ))}
                  </ul>
                </div>
              )}
              {challenge.defensiveTakeaways.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">Defensive Takeaways</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {challenge.defensiveTakeaways.map((d, i) => (
                      <li key={i} className="text-xs text-muted-foreground">{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function ChallengeDashboard() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");
  const [selectedPlatform, setSelectedPlatform] = useState<string | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<string | "All">("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.skillsPracticed.some((s) => s.toLowerCase().includes(search.toLowerCase())) && !c.toolsUsed.some((t) => t.toLowerCase().includes(search.toLowerCase())))
        return false;
      if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
      if (selectedDifficulty !== "All" && c.difficulty !== selectedDifficulty) return false;
      if (selectedPlatform !== "All" && c.platform !== selectedPlatform) return false;
      if (selectedStatus !== "All" && c.status !== selectedStatus) return false;
      if (favoritesOnly && !c.favorite) return false;
      return true;
    });
  }, [search, selectedCategory, selectedDifficulty, selectedPlatform, selectedStatus, favoritesOnly]);

  const platformOptions = useMemo(() => ["All", ...new Set(challenges.map((c) => c.platform))], []);

  return (
    <section id={SECTION_IDS.challenges} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-3xl font-bold text-white">Challenge Dashboard</h2>
            <p className="text-muted-foreground">{filtered.length} of {challenges.length} challenges</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="glass" size="sm"
              leftIcon={<IconFilter size={14} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <Button
              variant={favoritesOnly ? "primary" : "ghost"} size="sm"
              leftIcon={<IconStar size={14} />}
              onClick={() => setFavoritesOnly(!favoritesOnly)}
            >
              Favorites
            </Button>
          </div>
        </div>

        <div className="relative mb-4">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search challenges, skills, tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
              <IconX size={14} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4"
            >
              <GlassCard glow="none" variant="small" className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Category</label>
                    <select
                      value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as Category | "All")}
                      className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs"
                    >
                      <option value="All">All Categories</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Difficulty</label>
                    <select
                      value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | "All")}
                      className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs"
                    >
                      <option value="All">All Difficulties</option>
                      {(["easy", "medium", "hard", "insane"] as const).map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Platform</label>
                    <select
                      value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs"
                    >
                      {platformOptions.map((p) => <option key={p} value={p}>{p === "All" ? "All Platforms" : p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Status</label>
                    <select
                      value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs"
                    >
                      <option value="All">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost" size="sm"
                    onClick={() => {
                      setSelectedCategory("All"); setSelectedDifficulty("All"); setSelectedPlatform("All");
                      setSelectedStatus("All"); setSearch(""); setFavoritesOnly(false);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((challenge, i) => (
              <motion.div
                key={challenge.id}
                layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.02 }}
              >
                <ChallengeCard challenge={challenge} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <IconSearch size={32} className="mx-auto mb-2 opacity-50" />
            <p>No challenges match your filters</p>
          </div>
        )}
      </div>
    </section>
  );
}

function LearningTimeline() {
  const sorted = useMemo(() => {
    return [...challenges]
      .filter((c) => c.completionDate)
      .sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime());
  }, []);

  const months = useMemo(() => {
    const map = new Map<string, CTFChallenge[]>();
    sorted.forEach((c) => {
      const key = c.completionDate.slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    });
    return Array.from(map.entries());
  }, [sorted]);

  return (
    <section id={SECTION_IDS.timeline} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Learning Timeline</h2>
        <p className="text-muted-foreground mb-8">Chronological journey through challenges and labs completed</p>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent" />
          {months.map(([month, monthChallenges]) => (
            <div key={month} className="ml-12 mb-6 relative">
              <div className="absolute -left-10 top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-background" />
              <div className="text-xs text-muted-foreground font-medium mb-2">{month}</div>
              <div className="space-y-2">
                {monthChallenges.map((c) => (
                  <GlassCard key={c.id} glow="none" variant="small" className="!p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm text-white truncate">{c.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="text-cyan-400">{c.platform}</span>
                          <span>•</span>
                          <span>{c.category}</span>
                          <span>•</span>
                          <span style={{ color: DIFFICULTY_COLORS[c.difficulty] }}>{c.difficulty}</span>
                        </div>
                      </div>
                      {c.favorite && <IconStar size={12} className="text-amber-400 shrink-0" />}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WriteupLibrary() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CTFChallenge | null>(null);

  const withWriteups = useMemo(() => {
    let filtered = challenges.filter((c) => c.status === "completed");
    if (search) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.writeupSummary.toLowerCase().includes(search.toLowerCase()) ||
        c.skillsPracticed.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return filtered;
  }, [search]);

  return (
    <section id={SECTION_IDS.writeups} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Write-up Library</h2>
        <p className="text-muted-foreground mb-4">Documented challenge solutions with methodologies and defensive insights</p>
        <div className="relative mb-6">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" placeholder="Search write-ups by name, technique, or skill..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {withWriteups.map((c) => (
            <button key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)} className="text-left">
              <GlassCard glow={selected?.id === c.id ? "cyan" : "none"} intensity="low" className="h-full">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm truncate">{c.name}</h3>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground shrink-0">{c.platform}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{c.writeupSummary}</p>
                <div className="flex flex-wrap gap-1">
                  {c.methodology.slice(0, 4).map((m) => (
                    <span key={m} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{m}</span>
                  ))}
                </div>
              </GlassCard>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              <GlassCard glow="purple" intensity="medium" variant="elevated">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{selected.platform}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{selected.category}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${DIFFICULTY_COLORS[selected.difficulty]}15`, color: DIFFICULTY_COLORS[selected.difficulty] }}>{selected.difficulty}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-white"><IconX size={18} /></button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Section label="Objectives">
                      <ul className="list-disc list-inside space-y-0.5">{selected.objectives.map((o, i) => <li key={i} className="text-sm text-muted-foreground">{o}</li>)}</ul>
                    </Section>
                    <Section label="Methodology">
                      <div className="flex flex-wrap gap-1.5">{selected.methodology.map((m) => <span key={m} className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{m}</span>)}</div>
                    </Section>
                    <Section label="Tools Used">
                      <div className="flex flex-wrap gap-1.5">{selected.toolsUsed.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400">{t}</span>)}</div>
                    </Section>
                    <Section label="Skills Practiced">
                      <div className="flex flex-wrap gap-1.5">{selected.skillsPracticed.map((s) => <span key={s} className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">{s}</span>)}</div>
                    </Section>
                  </div>
                  <div className="space-y-4">
                    <Section label="Lessons Learned">
                      <ul className="list-disc list-inside space-y-0.5">{selected.lessonsLearned.map((l, i) => <li key={i} className="text-sm text-muted-foreground">{l}</li>)}</ul>
                    </Section>
                    <Section label="Defensive Takeaways">
                      <ul className="list-disc list-inside space-y-0.5">{selected.defensiveTakeaways.map((d, i) => <li key={i} className="text-sm text-muted-foreground">{d}</li>)}</ul>
                    </Section>
                    {selected.mitreTechniques && selected.mitreTechniques.length > 0 && (
                      <Section label="MITRE ATT&CK Techniques">
                        <div className="flex flex-wrap gap-1">{selected.mitreTechniques.map((mt) => <span key={mt} className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400">{mt}</span>)}</div>
                      </Section>
                    )}
                    {selected.owaspConcepts && selected.owaspConcepts.length > 0 && (
                      <Section label="OWASP Concepts">
                        <div className="flex flex-wrap gap-1">{selected.owaspConcepts.map((ow) => <span key={ow} className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">{ow}</span>)}</div>
                      </Section>
                    )}
                    {selected.relatedProjects.length > 0 && (
                      <Section label="Related Portfolio Projects">
                        <div className="flex flex-wrap gap-1">{selected.relatedProjects.map((rp) => <span key={rp} className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">{rp}</span>)}</div>
                      </Section>
                    )}
                    {selected.relatedCertifications.length > 0 && (
                      <Section label="Related Certifications">
                        <div className="flex flex-wrap gap-1">{selected.relatedCertifications.map((rc) => <span key={rc} className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">{rc}</span>)}</div>
                      </Section>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</h4>
      {children}
    </div>
  );
}

function AttackChainVisualizer() {
  const phases = [
    { id: "recon", label: "Reconnaissance", icon: <IconSearch size={16} />, color: "cyan" },
    { id: "enum", label: "Enumeration", icon: <IconSearch size={16} />, color: "blue" },
    { id: "vuln-id", label: "Vulnerability Identification", icon: <IconBug size={16} />, color: "amber" },
    { id: "exploit", label: "Exploitation", icon: <IconFlag size={16} />, color: "red" },
    { id: "privesc", label: "Privilege Escalation", icon: <IconArrowRight size={16} />, color: "purple" },
    { id: "post-exploit", label: "Post Exploitation", icon: <IconTerminal2 size={16} />, color: "green" },
    { id: "cleanup", label: "Cleanup", icon: <IconShield size={16} />, color: "cyan" },
    { id: "lessons", label: "Lessons Learned", icon: <IconBrain size={16} />, color: "amber" },
  ];

  const colorMap: Record<string, string> = {
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    red: "border-red-500/30 bg-red-500/10 text-red-400",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    green: "border-green-500/30 bg-green-500/10 text-green-400",
  };

  return (
    <section id={SECTION_IDS.methodology} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Attack Chain Methodology</h2>
        <p className="text-muted-foreground mb-8">Structured workflow applied across penetration testing and CTF challenges</p>
        <div className="flex flex-col items-center">
          {phases.map((phase, i) => (
            <div key={phase.id} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-sm w-full max-w-sm",
                  colorMap[phase.color]
                )}
              >
                {phase.icon}
                <span className="font-medium text-sm">{phase.label}</span>
              </motion.div>
              {i < phases.length - 1 && (
                <div className="h-8 w-px bg-gradient-to-b from-current to-transparent opacity-30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgressAnalytics() {
  const platformData = useMemo(() => {
    const counts: Record<string, { completed: number; total: number }> = {};
    challenges.forEach((c) => {
      if (!counts[c.platform]) counts[c.platform] = { completed: 0, total: 0 };
      counts[c.platform].total++;
      if (c.status === "completed") counts[c.platform].completed++;
    });
    return Object.entries(counts).sort((a, b) => b[1].total - a[1].total);
  }, []);

  const difficultyData = useMemo(() => {
    const counts: Record<string, number> = {};
    challenges.forEach((c) => {
      if (!counts[c.difficulty]) counts[c.difficulty] = 0;
      counts[c.difficulty]++;
    });
    return Object.entries(counts);
  }, []);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    challenges.forEach((c) => {
      if (!counts[c.category]) counts[c.category] = 0;
      counts[c.category]++;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    challenges.forEach((c) => c.toolsUsed.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, []);

  return (
    <section id={SECTION_IDS.analytics} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Progress Analytics</h2>
        <p className="text-muted-foreground mb-8">Visual breakdown of challenge activity across platforms, categories, and difficulty</p>
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard glow="cyan" intensity="low">
            <h3 className="text-sm font-semibold text-white mb-4">Challenges by Platform</h3>
            <div className="space-y-2.5">
              {platformData.map(([platform, counts]) => {
                const pct = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;
                return (
                  <div key={platform}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white capitalize">{platform}</span>
                      <span className="text-muted-foreground">{counts.completed}/{counts.total}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                        initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard glow="purple" intensity="low">
            <h3 className="text-sm font-semibold text-white mb-4">Difficulty Distribution</h3>
            <div className="space-y-2.5">
              {difficultyData.map(([diff, count]) => {
                const pct = Math.round((count / challenges.length) * 100);
                return (
                  <div key={diff}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white capitalize">{diff}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: DIFFICULTY_COLORS[diff as Difficulty], opacity: 0.7 }}
                        initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard glow="blue" intensity="low">
            <h3 className="text-sm font-semibold text-white mb-4">Categories Explored</h3>
            <div className="flex flex-wrap gap-1.5">
              {categoryData.map(([cat, count]) => {
                const maxCount = categoryData[0]?.[1] || 1;
                const size = Math.max(10, Math.min(20, 10 + (count / maxCount) * 10));
                return (
                  <span
                    key={cat}
                    className="px-2 py-1 rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
                    style={{ fontSize: `${size}px` }}
                  >
                    {cat} ({count})
                  </span>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard glow="green" intensity="low">
            <h3 className="text-sm font-semibold text-white mb-4">Most Used Tools</h3>
            <div className="space-y-2">
              {toolCounts.map(([tool, count], i) => (
                <div key={tool} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
                  <span className="text-xs text-white flex-1">{tool}</span>
                  <span className="text-xs text-muted-foreground">{count}x</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function AchievementSystem() {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <section id={SECTION_IDS.achievements} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-white">Achievements</h2>
          <span className="text-sm text-muted-foreground">{unlocked}/{achievements.length} unlocked</span>
        </div>
        <p className="text-muted-foreground mb-8">Milestones earned through documented challenge completions</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <GlassCard
                glow={ach.unlocked ? "amber" : "none"}
                intensity={ach.unlocked ? "medium" : "low"}
                variant="small"
                className={cn("text-center", !ach.unlocked && "opacity-40")}
              >
                <div className="text-2xl mb-1">{ach.icon}</div>
                <div className="text-xs font-semibold text-white mb-0.5">{ach.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{ach.description}</div>
                {ach.unlocked && ach.unlockedDate && (
                  <div className="mt-1 text-xs text-cyan-400">{ach.unlockedDate}</div>
                )}
                {!ach.unlocked && (
                  <div className="mt-1 text-xs text-muted-foreground">Locked</div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningRoadmap() {
  return (
    <section id={SECTION_IDS.roadmap} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Learning Roadmap</h2>
        <p className="text-muted-foreground mb-8">Guided progression path through cybersecurity domains</p>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-amber-500/50" />
          {roadmap.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="ml-16 mb-6 relative"
            >
              <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/20">
                {step.step}
              </div>
              <GlassCard glow="none" className="!p-4">
                <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {step.categories.map((cat) => (
                    <span key={cat} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{cat}</span>
                  ))}
                </div>
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Skills: </span>
                  <span className="text-xs text-muted-foreground">{step.skillsGained.join(", ")}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CyberAIAssistant() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "What is SQL injection?",
    "Explain privilege escalation on Linux",
    "How does AS-REP roasting work?",
    "Recommend next challenges after web security",
  ];

  const handleAsk = (q: string) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = question.toLowerCase();
      let answer = "";
      if (lower.includes("sql injection")) {
        answer = "SQL injection is a web security vulnerability where an attacker manipulates database queries by injecting malicious SQL statements through user input fields. Defensive measures include parameterized queries, input validation, and WAF rules.";
      } else if (lower.includes("privilege escalation") && lower.includes("linux")) {
        answer = "Linux privilege escalation techniques include: SUID binary exploitation, kernel vulnerability exploits, cron job manipulation, sudo misconfiguration abuse, and PATH hijacking. Always audit with tools like LinEnum or LinPEAS.";
      } else if (lower.includes("as-rep") || lower.includes("asrep") || lower.includes("kerberos")) {
        answer = "AS-REP roasting targets user accounts with Kerberos pre-authentication disabled. Attackers request TGTs for these accounts and crack the returned encrypted timestamp offline. Defensive measure: enforce Kerberos pre-authentication on all accounts.";
      } else if (lower.includes("next") || lower.includes("recommend")) {
        answer = "Based on your web security foundation, recommended next steps: 1) Dive into Linux privilege escalation challenges, 2) Explore Windows/AD attack paths, 3) Practice binary exploitation with buffer overflows, 4) Build SOC detection rule-writing skills.";
      } else {
        answer = "I can help explain CTF concepts, methodologies, and defensive techniques. Try asking about specific vulnerabilities, attack techniques, or learning recommendations based on your experience level.";
      }
      setResponse(answer);
      setLoading(false);
    }, 800);
  };

  return (
    <section id={SECTION_IDS.assistant} className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <GlassCard glow="purple" intensity="medium" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <IconBrain size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cyber AI Lab Assistant</h2>
              <p className="text-xs text-muted-foreground">Ask about CTF concepts, techniques, or learning recommendations</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s} onClick={() => { setQuery(s); handleAsk(s); }}
                  className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-cyan-500/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
              <Button variant="primary" size="md" onClick={() => handleAsk(query)} loading={loading}>
                Ask
              </Button>
            </div>
          </div>
          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20"
              >
                <div className="flex items-start gap-2">
                  <IconBrain size={16} className="text-purple-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{response}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  This assistant provides educational explanations based on portfolio data. For active challenges, avoid requesting protected solutions or flags.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}

function DefensiveInsights() {
  const insights = useMemo(() => {
    const map = new Map<string, { count: number; items: string[] }>();
    challenges.filter((c) => c.status === "completed").forEach((c) => {
      c.defensiveTakeaways.forEach((d) => {
        const key = d.slice(0, 40);
        if (!map.has(key)) map.set(key, { count: 0, items: [] });
        const entry = map.get(key)!;
        entry.count++;
        if (!entry.items.includes(c.name)) entry.items.push(c.name);
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count).slice(0, 12);
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Defensive Insights</h2>
        <p className="text-muted-foreground mb-8">Security recommendations derived from practical challenge experience</p>
        <div className="grid md:grid-cols-2 gap-3">
          {insights.map(([takeaway, data]) => (
            <GlassCard key={takeaway} glow="green" intensity="low" variant="small">
              <div className="flex items-start gap-2">
                <IconShield size={14} className="text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-white">{takeaway}</p>
                  <p className="text-xs text-muted-foreground mt-1">Observed in {data.items.length} challenge{data.items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTFCommandCenterPage() {
  const { recruiterMode } = useUIStore();
  const [activeSection, setActiveSection] = useState(SECTION_IDS.hero);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.values(SECTION_IDS).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  if (recruiterMode) {
    const completed = getCompletedChallenges();
    const allTools = [...new Set(completed.flatMap((c) => c.toolsUsed))].sort();
    const allSkills = [...new Set(completed.flatMap((c) => c.skillsPracticed))].sort();
    const platformLabels: Record<string, string> = {
      tryhackme: "TryHackMe", hackthebox: "Hack The Box", portswigger: "PortSwigger Academy",
      picoctf: "PicoCTF", overthewire: "OverTheWire", homelab: "Home Lab", other: "Other",
    };

    return (
      <div className="min-h-screen">
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs mb-4">
              <IconFlag size={12} />CTF & Cyber Range — Recruiter View
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">CTF & Cyber Range Overview</h1>
            <p className="text-muted-foreground mb-8">Demonstrated hands-on cybersecurity practice across {platforms.length} platforms with {completed.length} completed challenges.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <GlassCard glow="cyan" variant="small" className="text-center">
                <div className="text-2xl font-bold text-white">{completed.length}</div>
                <div className="text-xs text-muted-foreground">Challenges Completed</div>
              </GlassCard>
              <GlassCard glow="purple" variant="small" className="text-center">
                <div className="text-2xl font-bold text-white">{TOTAL_PLATFORMS}</div>
                <div className="text-xs text-muted-foreground">Platforms</div>
              </GlassCard>
              <GlassCard glow="blue" variant="small" className="text-center">
                <div className="text-2xl font-bold text-white">{TOTAL_CATEGORIES_COVERED}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </GlassCard>
              <GlassCard glow="amber" variant="small" className="text-center">
                <div className="text-2xl font-bold text-white">{allTools.length}</div>
                <div className="text-xs text-muted-foreground">Tools Used</div>
              </GlassCard>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <GlassCard glow="green" intensity="low">
                <h3 className="text-sm font-semibold text-white mb-3">Platforms & Progress</h3>
                {platforms.map((p) => (
                  <div key={p.id} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white">{platformLabels[p.id] || p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.challengesCompleted} challenges</span>
                  </div>
                ))}
              </GlassCard>
              <GlassCard glow="purple" intensity="low">
                <h3 className="text-sm font-semibold text-white mb-3">Core Skills Demonstrated</h3>
                <div className="flex flex-wrap gap-1.5">
                  {allSkills.map((s) => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{s}</span>)}
                </div>
              </GlassCard>
            </div>

            <GlassCard glow="cyan" intensity="low">
              <h3 className="text-sm font-semibold text-white mb-3">Key Tools & Technologies</h3>
              <div className="flex flex-wrap gap-1.5">
                {allTools.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{t}</span>)}
              </div>
            </GlassCard>

            <p className="text-xs text-muted-foreground mt-6">All challenges documented with methodology, defensive takeaways, and lessons learned. Active flags and restricted content are never exposed.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-1">
        {Object.entries(SECTION_IDS).map(([label, id]) => (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              activeSection === id ? "bg-cyan-400 scale-125" : "bg-white/20 hover:bg-white/40"
            )}
            title={label}
          />
        ))}
      </div>

      <HeroSection />
      <PlatformOverview />
      <ChallengeDashboard />
      <LearningTimeline />
      <WriteupLibrary />
      <AttackChainVisualizer />
      <ProgressAnalytics />
      <AchievementSystem />
      <LearningRoadmap />
      <CyberAIAssistant />
      <DefensiveInsights />

      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            CTF Command Center — All challenges completed in accordance with platform rules.
            Active flags, credentials, and restricted content are never exposed.
            Challenges are documented for educational purposes to demonstrate hands-on cybersecurity experience.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default CTFCommandCenterPage;
