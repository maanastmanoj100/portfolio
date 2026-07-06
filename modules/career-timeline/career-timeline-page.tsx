"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import {
  buildMilestones, buildConnections, getMilestonesByChapter,
  CHAPTERS, CATEGORY_DEFS,
  type TimelineMilestone, type TimelineChapter, type MilestoneCategory,
} from "./timeline-data";
import {
  IconCalendar, IconCode, IconBook, IconStar, IconFlag, IconShieldCheck,
  IconBrain, IconSearch, IconX, IconFilter, IconArrowRight,
  IconChevronDown, IconExternalLink, IconClock, IconAward,
  IconHistory, IconTarget, IconUserShield, IconBulb,
  IconCertificate, IconSchool, IconNetwork, IconDeviceLaptop,
  IconBrandGithub, IconArticle, IconBriefcase,
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

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  education: IconSchool,
  programming: IconCode,
  networking: IconNetwork,
  linux: IconDeviceLaptop,
  projects: IconCode,
  cybersecurity: IconShieldCheck,
  research: IconBook,
  certifications: IconCertificate,
  ctfs: IconFlag,
  competitions: IconAward,
  "open-source": IconBrandGithub,
  portfolio: IconHistory,
  "career-goals": IconTarget,
};

function HeroSection({ onStart, onPresent, onGoals }: { onStart: () => void; onPresent: () => void; onGoals: () => void }) {
  return (
    <section className="mb-12 pt-6 sm:pt-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-2">
          <IconHistory size={14} className="text-cyan" />
          <span className="text-xs font-mono text-cyan tracking-widest uppercase">Interactive Timeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-2">
          My Cybersecurity <span className="text-cyan">Journey</span>
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 max-w-2xl mb-6 leading-relaxed">
          Explore the milestones, projects, certifications, and experiences that shaped my journey into cybersecurity.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={onStart}><IconHistory size={12} /> Start Journey</Button>
          <Button variant="secondary" size="sm" onClick={onPresent}><IconClock size={12} /> Jump to Present</Button>
          <Button variant="secondary" size="sm" onClick={onGoals}><IconTarget size={12} /> Future Goals</Button>
        </div>
      </motion.div>
    </section>
  );
}

function TimelineNavigator({
  chapters, activeChapter, onChapterClick, totalMilestones, completedCount, plannedCount,
}: {
  chapters: typeof CHAPTERS;
  activeChapter: TimelineChapter | null;
  onChapterClick: (id: TimelineChapter) => void;
  totalMilestones: number;
  completedCount: number;
  plannedCount: number;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      className={cn(
        "sticky top-0 z-30 transition-all duration-300 -mx-4 sm:-mx-6 px-4 sm:px-6",
        scrolled ? "py-2 bg-[rgba(10,11,14,0.85)] backdrop-blur-xl border-b border-white/5" : "py-4"
      )}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <IconHistory size={12} className="text-cyan" />
            <span className="text-xs font-mono text-foreground-tertiary whitespace-nowrap">{completedCount} done</span>
            {plannedCount > 0 && <span className="text-xs font-mono text-foreground-tertiary whitespace-nowrap">· {plannedCount} planned</span>}
          </div>
          <div className="h-3 w-px bg-white/10" />
          {chapters.map(ch => (
            <button
              key={ch.id}
              onClick={() => onChapterClick(ch.id)}
              className={cn(
                "text-xs font-mono whitespace-nowrap px-2 py-1 rounded-md transition-colors",
                activeChapter === ch.id
                  ? "bg-cyan/20 text-cyan border border-cyan/30"
                  : "text-foreground-tertiary hover:text-foreground border border-transparent"
              )}
              style={activeChapter === ch.id ? { borderColor: ch.color + "40", backgroundColor: ch.color + "15", color: ch.color } : {}}
            >{ch.label}</button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MilestoneCard({
  milestone, index, isExpanded, onToggle,
}: {
  milestone: TimelineMilestone;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const catDef = CATEGORY_DEFS[milestone.category];
  const CatIcon = CATEGORY_ICONS[milestone.category] || IconStar;

  const statusColors: Record<string, string> = {
    completed: "bg-green/20 text-green border-green/30",
    "in-progress": "bg-cyan/20 text-cyan border-cyan/30",
    planned: "bg-white/10 text-foreground-tertiary border-white/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.02 }}
      className="relative pl-8 sm:pl-10"
    >
      {/* Timeline connector line */}
      <div className="absolute left-3.5 sm:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 to-white/5" />

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-2.5 sm:left-3 top-2 w-3 h-3 rounded-full border-2 z-10",
          milestone.status === "completed" ? "bg-cyan border-cyan" :
          milestone.status === "in-progress" ? "bg-amber border-amber" :
          "bg-white/20 border-white/30"
        )}
      />

      <div className="pb-8 last:pb-0">
        <div className="flex items-start gap-2 mb-1">
          <span className="text-xs font-mono text-foreground-tertiary mt-0.5 shrink-0">{milestone.date}</span>
          <span className={cn("text-xs font-mono px-1.5 py-0.5 rounded-full border", statusColors[milestone.status] || "")}>
            {milestone.status}
          </span>
          {catDef && (
            <span className="text-xs font-mono px-1.5 py-0.5 rounded-full" style={{ backgroundColor: catDef.color + "20", color: catDef.color }}>
              {catDef.label}
            </span>
          )}
        </div>

        <button onClick={onToggle} className="text-left w-full">
          <h3 className={cn(
            "text-sm font-medium mb-0.5 transition-colors",
            milestone.status === "planned" ? "text-foreground/50" : "text-foreground"
          )}>{milestone.title}</h3>
          <p className="text-xs text-foreground/60 leading-relaxed">{milestone.summary}</p>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-3"
            >
              <GlassCard className="p-4" glow={milestone.status === "planned" ? "none" : "cyan"} intensity="low">
                <p className="text-xs text-foreground/70 leading-relaxed mb-3">{milestone.details}</p>

                {milestone.reflection && (
                  <div className="flex items-start gap-1.5 mb-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <IconBulb size={10} className="text-amber mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground/60 leading-relaxed italic">{milestone.reflection}</p>
                  </div>
                )}

                {milestone.skills.length > 0 && (
                  <div className="mb-2.5">
                    <span className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider block mb-1">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {milestone.skills.slice(0, 8).map(s => (
                        <span key={s} className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-foreground-secondary">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {milestone.technologies.length > 0 && (
                  <div className="mb-2.5">
                    <span className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider block mb-1">Technologies</span>
                    <div className="flex flex-wrap gap-1">
                      {milestone.technologies.slice(0, 6).map(t => (
                        <span key={t} className="text-xs font-mono px-1.5 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/20">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {milestone.evidenceLinks.length > 0 && (
                  <div>
                    <span className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider block mb-1">Evidence</span>
                    <div className="flex flex-wrap gap-1.5">
                      {milestone.evidenceLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-xs font-mono px-2 py-1 rounded bg-purple/10 text-purple border border-purple/20 hover:bg-purple/20 transition-colors inline-flex items-center gap-1"
                        >
                          {link.label} <IconExternalLink size={7} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function CareerTimelinePage() {
  const milestones = useMemo(() => buildMilestones(), []);
  const connections = useMemo(() => buildConnections(milestones), [milestones]);
  const byChapter = useMemo(() => getMilestonesByChapter(milestones), [milestones]);

  const [activeChapter, setActiveChapter] = useState<TimelineChapter | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<MilestoneCategory | "all">("all");
  const [showFutureOnly, setShowFutureOnly] = useState(false);
  const ui = useUIStore();

  const chapterRefs = useRef<Map<TimelineChapter, HTMLDivElement>>(new Map());

  const setChapterRef = useCallback((chapter: TimelineChapter, el: HTMLDivElement | null) => {
    if (el) chapterRefs.current.set(chapter, el);
    else chapterRefs.current.delete(chapter);
  }, []);

  const scrollToChapter = useCallback((chapter: TimelineChapter) => {
    const el = chapterRefs.current.get(chapter);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveChapter(chapter);
    }
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredMilestones = useMemo(() => {
    let result = milestones;
    if (showFutureOnly) result = result.filter(m => m.chapter === "future-roadmap");
    if (filterCategory !== "all") result = result.filter(m => m.category === filterCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.skills.some(s => s.toLowerCase().includes(q)) ||
        m.technologies.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [milestones, showFutureOnly, filterCategory, searchQuery]);

  const completedCount = milestones.filter(m => m.status === "completed").length;
  const plannedCount = milestones.filter(m => m.status === "planned").length;
  const categories = Object.entries(CATEGORY_DEFS) as [MilestoneCategory, typeof CATEGORY_DEFS[MilestoneCategory]][];

  return (
    <PageTransition>
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <HeroSection
            onStart={() => scrollToChapter(CHAPTERS[0].id)}
            onPresent={() => scrollToChapter("current-focus")}
            onGoals={() => scrollToChapter("future-roadmap")}
          />

          {/* Search & Filters */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <IconSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search milestones by title, skill, or technology..."
                  className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-lg bg-white/[0.03] border border-white/10 outline-none focus:border-cyan/30 transition-colors placeholder:text-foreground-tertiary"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-tertiary hover:text-foreground">
                    <IconX size={10} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFutureOnly(!showFutureOnly)}
                className={cn(
                  "px-2.5 py-2 text-xs font-mono rounded-lg border transition-colors",
                  showFutureOnly ? "bg-purple/20 border-purple/30 text-purple" : "bg-white/[0.02] border-white/10 text-foreground-tertiary"
                )}
              ><IconTarget size={10} className="inline mr-1" />Planned</button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterCategory("all")}
                className={cn(
                  "px-2 py-1 text-xs font-mono rounded-md border transition-colors",
                  filterCategory === "all" ? "bg-cyan/20 border-cyan/30 text-cyan" : "bg-white/[0.02] border-white/10 text-foreground-tertiary hover:text-foreground"
                )}
              >All</button>
              {categories.map(([key, def]) => (
                <button
                  key={key}
                  onClick={() => setFilterCategory(key)}
                  className={cn(
                    "px-2 py-1 text-xs font-mono rounded-md border transition-colors",
                    filterCategory === key ? "bg-white/10 border-white/20 text-foreground" : "bg-white/[0.02] border-white/10 text-foreground-tertiary hover:text-foreground"
                  )}
                  style={filterCategory === key ? { backgroundColor: def.color + "20", borderColor: def.color + "40", color: def.color } : {}}
                >{def.label}</button>
              ))}
            </div>
          </section>

          {/* Timeline Navigator */}
          <TimelineNavigator
            chapters={CHAPTERS}
            activeChapter={activeChapter}
            onChapterClick={scrollToChapter}
            totalMilestones={milestones.length}
            completedCount={completedCount}
            plannedCount={plannedCount}
          />

          {/* Interactive Timeline */}
          <section className="mt-6 mb-12">
            <SectionHeader label="Interactive Timeline" icon={IconHistory} />

            {filteredMilestones.length === 0 && (
              <GlassCard className="p-8 text-center" glow="none">
                <p className="text-xs text-foreground-tertiary">No milestones match your filters.</p>
              </GlassCard>
            )}

            <div className="relative">
              {CHAPTERS.map(chapter => {
                const chapterMs = filteredMilestones.filter(m => m.chapter === chapter.id);
                if (chapterMs.length === 0) return null;

                return (
                  <div
                    key={chapter.id}
                    ref={el => setChapterRef(chapter.id, el)}
                    className="mb-10 scroll-mt-24"
                  >
                    <motion.div
                      className="flex items-center gap-3 mb-5"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: chapter.color + "20" }}>
                        <IconBook size={12} style={{ color: chapter.color }} />
                      </div>
                      <div>
                        <h2 className="text-sm font-medium" style={{ color: chapter.color }}>{chapter.label}</h2>
                        <p className="text-xs font-mono text-foreground-tertiary">{chapter.description} · {chapter.period}</p>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-white/5 to-transparent ml-2" />
                      <span className="text-xs font-mono text-foreground-tertiary">{chapterMs.length} milestones</span>
                    </motion.div>

                    <div className="relative">
                      {chapterMs.map((m, i) => (
                        <MilestoneCard
                          key={m.id}
                          milestone={m}
                          index={i}
                          isExpanded={expandedIds.has(m.id)}
                          onToggle={() => toggleExpanded(m.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Summary Stats */}
          <section className="mb-12">
            <GlassCard className="p-5" glow="purple" intensity="low">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-light text-cyan tabular-nums">{milestones.length}</div>
                  <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">Total Milestones</div>
                </div>
                <div>
                  <div className="text-xl font-light text-green tabular-nums">{completedCount}</div>
                  <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">Completed</div>
                </div>
                <div>
                  <div className="text-xl font-light text-amber tabular-nums">{plannedCount}</div>
                  <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">Planned</div>
                </div>
                <div>
                  <div className="text-xl font-light text-purple tabular-nums">{CHAPTERS.length}</div>
                  <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">Chapters</div>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Recruiter Summary */}
          {ui.recruiterMode && (
            <section className="mb-12">
              <GlassCard className="p-5" glow="cyan" intensity="low">
                <SectionHeader label="Recruiter Summary" icon={IconUserShield} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-mono text-cyan uppercase tracking-wider mb-1">Education</h4>
                    <p className="text-xs text-foreground/80">B.S. Stanford · M.S. MIT · Cybersecurity focus</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-mono text-purple uppercase tracking-wider mb-1">Top Projects</h4>
                    <p className="text-xs text-foreground/80">Sentinel AI · NetDefend · ChainGuard · RedOps · Threat Hunter</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-mono text-amber uppercase tracking-wider mb-1">Key Certs</h4>
                    <p className="text-xs text-foreground/80">OSCP · CISSP · GCFA · GWAPT · CCSP · CKS</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-mono text-green uppercase tracking-wider mb-1">Major Skills</h4>
                    <p className="text-xs text-foreground/80">Python, Rust, Go, Kubernetes, AWS, SIEM, Threat Detection</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-mono text-blue uppercase tracking-wider mb-1">Career Objective</h4>
                    <p className="text-xs text-foreground/80">Seeking cybersecurity role applying pentesting, incident response, and security architecture expertise.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-mono text-amber uppercase tracking-wider mb-1">Professional Summary</h4>
                    <p className="text-xs text-foreground/80">6+ years across offensive security, defensive engineering, and AI-driven automation.</p>
                  </div>
                </div>
              </GlassCard>
            </section>
          )}

          {/* Footer */}
          <motion.div className="text-center border-t border-white/5 pt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <p className="text-xs font-mono text-foreground-tertiary">
              Interactive Career Timeline — {milestones.length} milestones across {CHAPTERS.length} chapters.
            </p>
            <p className="text-xs font-mono text-foreground-tertiary/60 mt-1">
              All milestones link to documented portfolio evidence.
            </p>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}
