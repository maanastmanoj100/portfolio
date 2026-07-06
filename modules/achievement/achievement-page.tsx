"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  achievements, missions, trophies, passportStamps,
  ACHIEVEMENT_CATEGORIES, getUnlockedAchievements,
  TOTAL_ACHIEVEMENTS, TOTAL_UNLOCKED, learningChallenges,
  type Achievement, type AchievementCategory, type Rarity,
} from "./achievement-data";
import {
  IconTrophy, IconAward, IconCrown, IconTarget, IconCheck,
  IconFlag, IconTicket, IconShield,
  IconSearch, IconX, IconBrain, IconBook,
  IconChevronDown, IconChevronUp,
  IconRocket, IconMap, IconEye, IconLock,
} from "@tabler/icons-react";

const RARITY_COLORS: Record<Rarity, string> = {
  common: "text-slate-400",
  uncommon: "text-green-400",
  rare: "text-purple-400",
  legendary: "text-amber-400",
};
const RARITY_BG: Record<Rarity, string> = {
  common: "border-slate-500/20 bg-slate-500/5",
  uncommon: "border-green-500/20 bg-green-500/5",
  rare: "border-purple-500/20 bg-purple-500/5",
  legendary: "border-amber-500/20 bg-amber-500/10",
};

const CATEGORY_ICONS: Record<AchievementCategory, typeof IconTrophy> = {
  explorer: IconEye,
  projects: IconRocket,
  labs: IconShield,
  ctf: IconFlag,
  research: IconBook,
  github: IconAward,
  skills: IconBrain,
  learning: IconBook,
  milestones: IconCrown,
};

const SECTION_IDS = {
  hero: "ach-hero",
  badges: "ach-badges",
  progress: "ach-progress",
  missions: "ach-missions",
  trophies: "ach-trophies",
  passport: "ach-passport",
  challenges: "ach-challenges",
  guide: "ach-guide",
};

function HeroSection() {
  const unlocked = getUnlockedAchievements();
  const completedMissions = missions.filter((m) => m.completed).length;
  const legendaryCount = unlocked.filter((a) => a.rarity === "legendary").length;

  return (
    <section id={SECTION_IDS.hero} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-purple-500/5" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
            <IconTrophy size={14} />Chapter 25 — Gamification Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-amber-300 to-purple-400 bg-clip-text text-transparent">
            Achievements
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Track exploration progress, discover milestones, complete missions,
            and unlock every badge across Cyber Nexus.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => document.getElementById(SECTION_IDS.badges)?.scrollIntoView({ behavior: "smooth" })}>
              View Badges
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById(SECTION_IDS.missions)?.scrollIntoView({ behavior: "smooth" })}>
              Start Missions
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-12"
        >
          <GlassCard glow="cyan" variant="small" className="text-center">
            <div className="text-2xl font-bold text-white">{TOTAL_UNLOCKED}/{TOTAL_ACHIEVEMENTS}</div>
            <div className="text-xs text-muted-foreground">Badges Unlocked</div>
          </GlassCard>
          <GlassCard glow="purple" variant="small" className="text-center">
            <div className="text-2xl font-bold text-white">{legendaryCount}</div>
            <div className="text-xs text-muted-foreground">Legendary</div>
          </GlassCard>
          <GlassCard glow="green" variant="small" className="text-center">
            <div className="text-2xl font-bold text-white">{completedMissions}/{missions.length}</div>
            <div className="text-xs text-muted-foreground">Missions</div>
          </GlassCard>
          <GlassCard glow="blue" variant="small" className="text-center">
            <div className="text-2xl font-bold text-white">{trophies.length}</div>
            <div className="text-xs text-muted-foreground">Trophies</div>
          </GlassCard>
          <GlassCard glow="amber" variant="small" className="text-center">
            <div className="text-2xl font-bold text-white">{passportStamps.length}</div>
            <div className="text-xs text-muted-foreground">Passport Stamps</div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

function BadgeCollection() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | "all">("all");
  const [rarityFilter, setRarityFilter] = useState<Rarity | "all">("all");
  const [showUnlocked, setShowUnlocked] = useState<boolean | null>(null);

  const filtered = useMemo(() => {
    return achievements.filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
      if (rarityFilter !== "all" && a.rarity !== rarityFilter) return false;
      if (showUnlocked === true && !a.unlocked) return false;
      if (showUnlocked === false && a.unlocked) return false;
      return true;
    });
  }, [search, categoryFilter, rarityFilter, showUnlocked]);

  return (
    <section id={SECTION_IDS.badges} className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Badge Collection</h2>
        <p className="text-muted-foreground mb-6">Every achievement earned across projects, labs, CTFs, and exploration</p>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search badges..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50" />
          </div>
          <div className="flex flex-wrap gap-1">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as AchievementCategory | "all")}
              className="text-xs px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50">
              <option value="all">All Categories</option>
              {ACHIEVEMENT_CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
            </select>
            <select value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value as Rarity | "all")}
              className="text-xs px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50">
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="legendary">Legendary</option>
            </select>
            <button onClick={() => setShowUnlocked(showUnlocked === true ? null : true)}
              className={cn("text-xs px-2 py-1.5 rounded-lg border transition-colors", showUnlocked === true ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-white/10 text-muted-foreground hover:text-white")}>
              Unlocked
            </button>
            <button onClick={() => setShowUnlocked(showUnlocked === false ? null : false)}
              className={cn("text-xs px-2 py-1.5 rounded-lg border transition-colors", showUnlocked === false ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-white/10 text-muted-foreground hover:text-white")}>
              Locked
            </button>
            {(search || categoryFilter !== "all" || rarityFilter !== "all" || showUnlocked !== null) && (
              <button onClick={() => { setSearch(""); setCategoryFilter("all"); setRarityFilter("all"); setShowUnlocked(null); }}
                className="text-xs px-2 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                <IconX size={12} className="inline" /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((achievement, i) => (
            <motion.div key={achievement.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <GlassCard glow="none" className={cn("h-full", achievement.unlocked ? "opacity-100" : "opacity-60")}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "text-2xl w-10 h-10 flex items-center justify-center rounded-lg shrink-0 border",
                    achievement.unlocked ? RARITY_BG[achievement.rarity] : "border-white/5 bg-white/5"
                  )}>
                    {achievement.unlocked ? achievement.icon : <IconLock size={16} className="text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className={cn("text-sm font-semibold truncate", achievement.unlocked ? "text-white" : "text-muted-foreground")}>
                        {achievement.name}
                      </h3>
                      <span className={cn("text-xs font-medium shrink-0", RARITY_COLORS[achievement.rarity])}>
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-muted-foreground capitalize">{achievement.category}</span>
                      {achievement.unlockedDate && (
                        <span className="text-xs text-green-400/60">{achievement.unlockedDate}</span>
                      )}
                    </div>
                    {achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <IconSearch size={32} className="mx-auto text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No badges match your filters</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ExplorerProgress() {
  const exploreAchievements = achievements.filter((a) => a.type === "exploration" && a.progress !== undefined && a.maxProgress);

  return (
    <section id={SECTION_IDS.progress} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Explorer Progress</h2>
        <p className="text-muted-foreground mb-8">Track your journey through Cyber Nexus — revisit pages and interact with features to level up</p>
        {exploreAchievements.length === 0 ? (
          <GlassCard glow="none">
            <div className="text-center py-6">
              <IconMap size={28} className="mx-auto text-muted-foreground mb-2 opacity-50" />
              <p className="text-xs text-muted-foreground">No tracked exploration progress yet. Start by exploring the portfolio.</p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {exploreAchievements.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard glow="none">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "text-xl w-9 h-9 flex items-center justify-center rounded-lg shrink-0 border",
                      a.unlocked ? "border-green-500/20 bg-green-500/10" : "border-white/10 bg-white/5"
                    )}>
                      {a.unlocked ? a.icon : <IconTarget size={14} className="text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={cn("text-sm font-medium", a.unlocked ? "text-white" : "text-muted-foreground")}>{a.name}</span>
                        {a.unlocked && <IconCheck size={12} className="text-green-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{a.criteria}</p>
                      <div className="mt-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                          <span>{a.progress}/{a.maxProgress}</span>
                          <span>{Math.round(((a.progress ?? 0) / (a.maxProgress ?? 1)) * 100)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-700"
                            style={{ width: `${Math.min(100, ((a.progress ?? 0) / (a.maxProgress ?? 1)) * 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MissionsBoard() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id={SECTION_IDS.missions} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Side Missions</h2>
        <p className="text-muted-foreground mb-8">Optional challenges that guide you through the full Cyber Nexus experience</p>
        <div className="space-y-3">
          {missions.map((mission, i) => (
            <motion.div key={mission.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard glow={expanded === mission.id ? "amber" : "none"} intensity="low">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <IconTarget size={14} className={mission.completed ? "text-green-400" : "text-amber-400"} />
                      <h3 className={cn("text-sm font-semibold", mission.completed ? "text-green-400" : "text-white")}>
                        {mission.name}
                      </h3>
                      {mission.completed && <IconCheck size={12} className="text-green-400" />}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{mission.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{mission.progress}/{mission.total} tasks</span>
                      <span>·</span>
                      <span>Reward: {mission.reward}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-700",
                        mission.completed ? "bg-green-500" : "bg-gradient-to-r from-amber-500 to-purple-500")}
                        style={{ width: `${(mission.progress / mission.total) * 100}%` }} />
                    </div>
                  </div>
                  <button onClick={() => setExpanded(expanded === mission.id ? null : mission.id)} className="text-muted-foreground hover:text-white">
                    {expanded === mission.id ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </button>
                </div>
                <AnimatePresence>
                  {expanded === mission.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
                        {mission.tasks.map((task, ti) => (
                          <div key={ti} className="flex items-center gap-2 text-xs">
                            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", ti < mission.progress ? "bg-green-400" : "bg-white/10")} />
                            <span className={cn(ti < mission.progress ? "text-muted-foreground line-through" : "text-muted-foreground")}>{task}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrophyGallery() {
  const [expandedTrophy, setExpandedTrophy] = useState<string | null>(null);

  return (
    <section id={SECTION_IDS.trophies} className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Trophy Gallery</h2>
        <p className="text-muted-foreground mb-8">Major milestones documented with evidence and real dates</p>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-purple-500/20 to-transparent" />
          <div className="space-y-6">
            {trophies.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((trophy, i) => (
              <motion.div key={trophy.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="relative pl-14">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-purple-500 border-2 border-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <GlassCard glow="none" onClick={() => setExpandedTrophy(expandedTrophy === trophy.id ? null : trophy.id)} className="cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{trophy.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-white">{trophy.title}</h3>
                        <span className="text-xs text-amber-400/60">{trophy.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{trophy.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {trophy.category}
                        </span>
                        {expandedTrophy === trophy.id && (
                          <span className="text-xs text-cyan-400 underline">View evidence</span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioPassport() {
  return (
    <section id={SECTION_IDS.passport} className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <IconTicket size={24} className="text-amber-400" />
          <h2 className="text-3xl font-bold text-white">Portfolio Passport</h2>
        </div>
        <p className="text-muted-foreground mb-8">Every stamp represents a section discovered in Cyber Nexus. Collect them all.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {passportStamps.map((stamp, i) => (
            <motion.div key={stamp.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
              <a href={stamp.page} className="block">
                <GlassCard glow="none" variant="small" className="text-center hover:border-amber-500/30 transition-colors cursor-pointer">
                  <div className="text-xl mb-1">{stamp.icon}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{stamp.label}</div>
                </GlassCard>
              </a>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {passportStamps.length} destinations · Click any stamp to travel there
          </p>
        </div>
      </div>
    </section>
  );
}

function LearningChallenges() {
  const [revealed, setRevealed] = useState<string | null>(null);

  return (
    <section id={SECTION_IDS.challenges} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Portfolio Knowledge Quiz</h2>
        <p className="text-muted-foreground mb-8">Test how well you know the portfolio content — can you answer these?</p>
        <div className="grid md:grid-cols-2 gap-4">
          {learningChallenges.map((challenge, i) => (
            <motion.div key={challenge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard glow={revealed === challenge.id ? "cyan" : "none"} intensity="low">
                <div className="flex items-start gap-2 mb-2">
                  <IconBrain size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{challenge.name}</h3>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setRevealed(revealed === challenge.id ? null : challenge.id)}>
                  {revealed === challenge.id ? "Hide Hint" : "Show Hint"}
                </Button>
                <AnimatePresence>
                  {revealed === challenge.id && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                      className="mt-2 p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <p className="text-xs text-cyan-300/80"><span className="font-semibold">Hint:</span> {challenge.hint}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIAchievementGuide() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "How do I unlock more badges?",
    "What are the rarest achievements?",
    "Which missions should I start?",
    "Explain the passport stamps",
  ];

  const handleAsk = (q: string) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = question.toLowerCase();
      const unlocked = getUnlockedAchievements();
      const locked = achievements.filter((a) => !a.unlocked);
      let answer = "";
      if (lower.includes("unlock") || lower.includes("earn") || lower.includes("more")) {
        answer = `You can unlock badges by exploring portfolio sections, completing missions, and visiting pages. Currently ${unlocked.length}/${TOTAL_ACHIEVEMENTS} badges are unlocked. Try the ${locked.filter((a) => a.type === "exploration").slice(0, 3).map((a) => a.name).join(", ")} badges by exploring those sections.`;
      } else if (lower.includes("rarest") || lower.includes("legendary") || lower.includes("rare")) {
        const legendaries = unlocked.filter((a) => a.rarity === "legendary");
        const rares = unlocked.filter((a) => a.rarity === "rare");
        answer = `You have ${legendaries.length} legendary and ${rares.length} rare badges. Legendary badges include: ${legendaries.map((a) => a.name).join(", ")}. Legendary badges not yet earned: ${locked.filter((a) => a.rarity === "legendary").map((a) => a.name).join(", ")}.`;
      } else if (lower.includes("mission")) {
        const completed = missions.filter((m) => m.completed);
        const active = missions.filter((m) => !m.completed);
        answer = `${completed.length}/${missions.length} missions completed. ${active.length > 0 ? `Active missions: ${active.slice(0, 3).map((m) => m.name).join(", ")}.` : "All missions complete!"} Each mission rewards an achievement badge upon completion.`;
      } else if (lower.includes("passport") || lower.includes("stamp")) {
        answer = `The Portfolio Passport has ${passportStamps.length} stamps representing every major section. Click any stamp to navigate directly. Collecting all stamps contributes to the "Full Disclosure" legendary badge.`;
      } else {
        answer = `Cyber Nexus tracks ${TOTAL_ACHIEVEMENTS} badges across 9 categories. ${TOTAL_UNLOCKED} badges are unlocked, ${missions.length} missions are available, and ${trophies.length} major trophies are documented. Ask about unlocking badges, rarest achievements, missions, or the passport.`;
      }
      setResponse(answer);
      setLoading(false);
    }, 800);
  };

  return (
    <section id={SECTION_IDS.guide} className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <GlassCard glow="amber" intensity="medium" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><IconBrain size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Achievement Guide</h2>
              <p className="text-xs text-muted-foreground">Ask about badges, missions, and how to unlock everything</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => { setQuery(s); handleAsk(s); }}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-amber-500/30 transition-colors"
              >{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
              placeholder="Ask about achievements..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50" />
            <Button variant="primary" size="md" onClick={() => handleAsk(query)} loading={loading}>Ask</Button>
          </div>
          <AnimatePresence>
            {response && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20"
              >
                <div className="flex items-start gap-2">
                  <IconBrain size={16} className="text-amber-400 mt-0.5 shrink-0" />
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

function AchievementPage() {
  const { recruiterMode } = useUIStore();
  const [activeSection, setActiveSection] = useState(SECTION_IDS.hero);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.values(SECTION_IDS).forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  if (recruiterMode) {
    const unlocked = getUnlockedAchievements();
    const unlockedMilestones = unlocked.filter((a) => a.type === "milestone");
    const unlockedLegendary = unlocked.filter((a) => a.rarity === "legendary");

    return (
      <div className="min-h-screen">
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-4">
              <IconTrophy size={12} />Achievements — Recruiter View
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Professional Milestones</h1>
            <p className="text-muted-foreground mb-8">{unlocked.length} documented achievements across cybersecurity domains.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <GlassCard glow="cyan" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{unlockedMilestones.length}</div><div className="text-xs text-muted-foreground">Milestones</div></GlassCard>
              <GlassCard glow="amber" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{unlockedLegendary.length}</div><div className="text-xs text-muted-foreground">Legendary</div></GlassCard>
              <GlassCard glow="purple" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{trophies.length}</div><div className="text-xs text-muted-foreground">Trophies</div></GlassCard>
              <GlassCard glow="green" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{missions.length}</div><div className="text-xs text-muted-foreground">Learning Paths</div></GlassCard>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <GlassCard glow="cyan" intensity="low">
                <h3 className="text-sm font-semibold text-white mb-3">Key Milestones</h3>
                <div className="space-y-1.5">
                  {unlockedMilestones.slice(0, 6).map((a) => (
                    <div key={a.id} className="flex items-center gap-2 text-xs">
                      <span>{a.icon}</span>
                      <span className="text-white">{a.name}</span>
                      {a.unlockedDate && <span className="text-muted-foreground">({a.unlockedDate})</span>}
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard glow="amber" intensity="low">
                <h3 className="text-sm font-semibold text-white mb-3">Trophy Highlights</h3>
                <div className="space-y-1.5">
                  {trophies.slice(0, 5).map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-xs">
                      <span>{t.icon}</span>
                      <span className="text-white">{t.title}</span>
                      <span className="text-muted-foreground">({t.date})</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="flex flex-wrap gap-2">
              {ACHIEVEMENT_CATEGORIES.map((cat) => {
                const count = unlocked.filter((a) => a.category === cat.id).length;
                return (
                  <div key={cat.id} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                    {cat.label}: {count}
                  </div>
                );
              })}
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
            className={cn("w-2 h-2 rounded-full transition-all duration-300", activeSection === id ? "bg-amber-400 scale-125" : "bg-white/20 hover:bg-white/40")}
            title={label}
          />
        ))}
      </div>
      <HeroSection />
      <BadgeCollection />
      <ExplorerProgress />
      <MissionsBoard />
      <TrophyGallery />
      <PortfolioPassport />
      <LearningChallenges />
      <AIAchievementGuide />
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Achievement System — {TOTAL_UNLOCKED}/{TOTAL_ACHIEVEMENTS} badges · {missions.length} missions · {trophies.length} trophies · All milestones documented with evidence
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AchievementPage;
