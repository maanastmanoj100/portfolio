"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  OSS_PROJECTS, CONTRIBUTION_STATS, COLLAB_EVENTS,
  MENTORSHIP_RESOURCES, COMMUNITY_ACTIVITIES, DISCUSSIONS,
  GOVERNANCE_DOCS, RECOGNITIONS, COLLAB_PROMPTS,
  type OssProject, type CollabEvent, type MentorshipResource,
  type DiscussionEntry, type RecognitionItem,
} from "./collaboration-data";
import {
  IconCode, IconUsers, IconGitPullRequest, IconGitCommit,
  IconStar, IconBook, IconMessage2, IconCertificate,
  IconTrophy, IconAward, IconSearch, IconX, IconFilter,
  IconBrain, IconCalendar, IconArrowRight, IconCheck,
  IconChevronDown, IconChevronUp, IconExternalLink,
  IconBrandGithub, IconBrandX, IconWorld, IconShield,
  IconBulb, IconTarget, IconServer, IconDeviceGamepad,
  IconSparkles, IconPackage, IconLicense, IconRoute,
  IconFileText, IconHeart, IconUserPlus, IconEdit,
  IconList, IconChartBar, IconClock, IconNetwork,
  IconStack,
} from "@tabler/icons-react";

const CATEGORY_COLORS: Record<string, string> = {
  project: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  pr: "text-green-400 bg-green-500/10 border-green-500/20",
  release: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  hackathon: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  talk: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  event: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  knowledge: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  recognition: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

const ROLE_COLORS: Record<string, string> = {
  Creator: "text-purple-400",
  Maintainer: "text-cyan-400",
  "Core Contributor": "text-blue-400",
  Contributor: "text-green-400",
};

const PROJECT_STATUS_COLORS: Record<string, string> = {
  active: "text-green-400",
  maintenance: "text-amber-400",
  archived: "text-red-400",
};

function HeroSection({ stats }: { stats: typeof CONTRIBUTION_STATS }) {
  const heroStats = [
    { label: "Projects", value: stats.repositoriesContributed, icon: <IconCode size={20} />, color: "cyan" as const },
    { label: "PRs Merged", value: stats.totalPullRequests, icon: <IconGitPullRequest size={20} />, color: "green" as const },
    { label: "Commits", value: Math.floor(stats.totalCommits / 100) + "k+", icon: <IconGitCommit size={20} />, color: "purple" as const },
    { label: "Stars", value: "2.1k+", icon: <IconStar size={20} />, color: "amber" as const },
  ];

  return (
    <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <IconUsers size={14} />Chapter 36 — Collaboration Hub & Open Source Ecosystem
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Collaboration Hub
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Open-source cybersecurity tools, community engagement, mentorship resources, and the collaborative ecosystem built across projects, events, and knowledge sharing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Projects
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}>
              View Timeline
            </Button>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {heroStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <GlassCard glow={s.color} className="p-4 text-center">
                <div className="flex justify-center mb-2 text-muted-foreground">{s.icon}</div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardSection({ stats }: { stats: typeof CONTRIBUTION_STATS }) {
  const items = [
    { label: "Pull Requests", value: stats.totalPullRequests, icon: <IconGitPullRequest size={18} />, color: "text-green-400" },
    { label: "Issues Opened", value: stats.issuesOpened, icon: <IconBulb size={18} />, color: "text-amber-400" },
    { label: "Issues Resolved", value: stats.issuesResolved, icon: <IconCheck size={18} />, color: "text-cyan-400" },
    { label: "Doc Contributions", value: stats.documentationContributions, icon: <IconFileText size={18} />, color: "text-blue-400" },
    { label: "Code Reviews", value: stats.codeReviews, icon: <IconEdit size={18} />, color: "text-purple-400" },
    { label: "Projects Maintained", value: stats.projectsMaintained, icon: <IconPackage size={18} />, color: "text-pink-400" },
    { label: "Discussions", value: stats.communityDiscussions, icon: <IconMessage2 size={18} />, color: "text-sky-400" },
    { label: "Day Streak", value: stats.streak + "d", icon: <IconCalendar size={18} />, color: "text-orange-400" },
  ];

  return (
    <section id="dashboard" className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05 }}>
            <GlassCard className="p-3 flex items-center gap-3">
              <div className={cn(item.color)}>{item.icon}</div>
              <div>
                <div className="text-lg font-bold">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: OssProject }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout>
      <GlassCard glow={project.status === "active" ? "cyan" : project.status === "maintenance" ? "amber" : "none"}
        className={cn("p-4 cursor-pointer transition-all hover:border-white/20", expanded && "border-cyan-500/30")}
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-xs font-mono", ROLE_COLORS[project.role])}>{project.role}</span>
              <span className={cn("text-xs", PROJECT_STATUS_COLORS[project.status])}>· {project.status}</span>
            </div>
            <h3 className="font-semibold text-base truncate">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">{project.commits} commits</span>
            {project.url && <IconExternalLink size={14} className="text-muted-foreground" />}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
              <IconChevronDown size={16} className="text-muted-foreground" />
            </motion.div>
          </div>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="border-t border-white/5 mt-3 pt-3 space-y-3">
                <p className="text-sm text-muted-foreground">{project.purpose}</p>
                <div>
                  <span className="text-xs text-muted-foreground">Technologies: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {project.technologies.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Contributions:</span>
                  <ul className="mt-1 space-y-0.5">
                    {project.contributions.map(c => (
                      <li key={c} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <IconCheck size={10} className="text-green-400 shrink-0" />{c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><IconGitPullRequest size={12} />{project.prs} PRs</span>
                  <span className="flex items-center gap-1"><IconBulb size={12} />{project.issues} Issues</span>
                  <span className="flex items-center gap-1"><IconLicense size={12} />{project.license}</span>
                </div>
                {project.roadmap.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">Roadmap:</span>
                    <ul className="mt-1 space-y-0.5">
                      {project.roadmap.map(r => (
                        <li key={r} className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <IconArrowRight size={10} className="text-cyan-400 shrink-0" />{r}
                        </li>
                      ))}
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

function ProjectsSection() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = OSS_PROJECTS;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.technologies.some(t => t.toLowerCase().includes(q)));
    }
    if (roleFilter) r = r.filter(p => p.role === roleFilter);
    return r;
  }, [search, roleFilter]);

  const roles = Array.from(new Set(OSS_PROJECTS.map(p => p.role)));

  return (
    <section id="projects" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Open Source Projects</h2>
        <p className="text-muted-foreground mb-8">Cybersecurity tools built and maintained for the community</p>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search projects..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50 touch-action-manipulation" style={{ minHeight: 44 }} />
          </div>
          {roles.map(role => (
            <Button key={role} variant={roleFilter === role ? "primary" : "ghost"} size="sm" onClick={() => setRoleFilter(roleFilter === role ? null : role)}>
              {role}
            </Button>
          ))}
          {roleFilter && <Button variant="ghost" size="sm" onClick={() => setRoleFilter(null)}><IconX size={14} /></Button>}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No projects match your filters.</p>}
      </motion.div>
    </section>
  );
}

function TimelineSection() {
  const [filter, setFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(COLLAB_EVENTS.map(e => e.category)));

  const filtered = filter ? COLLAB_EVENTS.filter(e => e.category === filter) : COLLAB_EVENTS;

  return (
    <section id="timeline" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Collaboration Timeline</h2>
        <p className="text-muted-foreground mb-8">Key milestones in open-source and community engagement</p>
        <div className="flex flex-wrap gap-2 mb-8">
          <Button variant={filter === null ? "primary" : "ghost"} size="sm" onClick={() => setFilter(null)}>All</Button>
          {categories.map(cat => (
            <Button key={cat} variant={filter === cat ? "primary" : "ghost"} size="sm" onClick={() => setFilter(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/40 to-purple-500/40" />
          <div className="space-y-6">
            {filtered.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="relative pl-10">
                <div className={cn("absolute left-[9px] top-1.5 w-3 h-3 rounded-full border-2", CATEGORY_COLORS[event.category]?.split(" ")[0].replace("text-", "border-") || "border-cyan-400")} />
                <GlassCard className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full border", CATEGORY_COLORS[event.category] || "text-cyan-400 border-cyan-500/20 bg-cyan-500/10")}>
                          {event.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                      </div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs text-muted-foreground">{event.impact}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function MentorshipSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="mentorship" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Mentorship Resources</h2>
        <p className="text-muted-foreground mb-8">Guides, tutorials, and learning materials for the security community</p>
        <div className="grid md:grid-cols-2 gap-4">
          {MENTORSHIP_RESOURCES.map((mr, i) => (
            <motion.div key={mr.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <GlassCard glow={mr.type === "workshop" ? "purple" : mr.type === "guide" ? "cyan" : mr.type === "tutorial" ? "blue" : "none"}
                className={cn("p-4 cursor-pointer transition-all hover:border-white/20", expanded === mr.id && "border-cyan-500/30")}
                onClick={() => setExpanded(expanded === mr.id ? null : mr.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">{mr.type.replace("-", " ")}</span>
                    </div>
                    <h3 className="font-semibold text-sm">{mr.title}</h3>
                  </div>
                  <motion.div animate={{ rotate: expanded === mr.id ? 180 : 0 }}>
                    <IconChevronDown size={14} className="text-muted-foreground" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {expanded === mr.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="border-t border-white/5 mt-3 pt-3 space-y-2">
                        <p className="text-sm text-muted-foreground">{mr.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {mr.topics.map(t => (
                            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">{t}</span>
                          ))}
                        </div>
                        {mr.url && (
                          <Button variant="ghost" size="sm" className="mt-2">
                            <IconExternalLink size={12} className="mr-1" />View Resource
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function CommunitySection() {
  const [filter, setFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(COMMUNITY_ACTIVITIES.map(a => a.category)));
  const filtered = filter ? COMMUNITY_ACTIVITIES.filter(a => a.category === filter) : COMMUNITY_ACTIVITIES;

  return (
    <section id="community" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Community Engagement</h2>
        <p className="text-muted-foreground mb-8">Conferences, articles, meetups, and volunteer activities</p>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant={filter === null ? "primary" : "ghost"} size="sm" onClick={() => setFilter(null)}>All</Button>
          {categories.map(cat => (
            <Button key={cat} variant={filter === cat ? "primary" : "ghost"} size="sm" onClick={() => setFilter(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(a => (
            <GlassCard key={a.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn("shrink-0 p-2 rounded-lg", CATEGORY_COLORS[a.category]?.split(" ").slice(1).join(" ") || "bg-white/5")}>
                  {a.category === "conference" ? <IconWorld size={16} /> :
                   a.category === "article" ? <IconFileText size={16} /> :
                   a.category === "meetup" ? <IconUsers size={16} /> :
                   a.category === "forum" ? <IconMessage2 size={16} /> :
                   a.category === "discussion" ? <IconMessage2 size={16} /> :
                   <IconHeart size={16} />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className={cn("px-2 py-0.5 rounded-full border", CATEGORY_COLORS[a.category] || "text-cyan-400 border-cyan-500/20 bg-cyan-500/10")}>
                      {a.category}
                    </span>
                    <span>{a.platform}</span>
                    <span>{a.date}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function DiscussionsSection() {
  const [filter, setFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(DISCUSSIONS.map(d => d.category)));
  const filtered = filter ? DISCUSSIONS.filter(d => d.category === filter) : DISCUSSIONS;

  return (
    <section id="discussions" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Discussion Archive</h2>
        <p className="text-muted-foreground mb-8">Architecture decisions, engineering notes, and community discussions</p>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant={filter === null ? "primary" : "ghost"} size="sm" onClick={() => setFilter(null)}>All</Button>
          {categories.map(cat => (
            <Button key={cat} variant={filter === cat ? "primary" : "ghost"} size="sm" onClick={() => setFilter(cat)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(d => (
            <GlassCard key={d.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn("shrink-0 p-2 rounded-lg",
                  d.category === "architecture" ? "bg-purple-500/10 text-purple-400" :
                  d.category === "lessons" ? "bg-amber-500/10 text-amber-400" :
                  d.category === "rfc" ? "bg-cyan-500/10 text-cyan-400" :
                  d.category === "design" ? "bg-blue-500/10 text-blue-400" :
                  d.category === "engineering" ? "bg-green-500/10 text-green-400" :
                  "bg-pink-500/10 text-pink-400")}>
                  {d.category === "architecture" ? <IconRoute size={16} /> :
                   d.category === "lessons" ? <IconBulb size={16} /> :
                   d.category === "rfc" ? <IconFileText size={16} /> :
                   d.category === "design" ? <IconEdit size={16} /> :
                   d.category === "engineering" ? <IconCode size={16} /> :
                   <IconBook size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{d.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{d.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border",
                      d.category === "architecture" ? "text-purple-400 border-purple-500/20 bg-purple-500/10" :
                      d.category === "lessons" ? "text-amber-400 border-amber-500/20 bg-amber-500/10" :
                      d.category === "rfc" ? "text-cyan-400 border-cyan-500/20 bg-cyan-500/10" :
                      d.category === "design" ? "text-blue-400 border-blue-500/20 bg-blue-500/10" :
                      d.category === "engineering" ? "text-green-400 border-green-500/20 bg-green-500/10" :
                      "text-pink-400 border-pink-500/20 bg-pink-500/10")}>{d.category}</span>
                    <span className="text-xs text-muted-foreground">{d.date}</span>
                    {d.tags.map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">{t}</span>)}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function GovernanceSection() {
  return (
    <section id="governance" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Project Governance</h2>
        <p className="text-muted-foreground mb-8">Standards, workflows, and policies guiding open-source projects</p>
        <div className="grid md:grid-cols-3 gap-4">
          {GOVERNANCE_DOCS.map(g => (
            <GlassCard key={g.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {g.category === "roadmap" ? <IconRoute size={16} className="text-cyan-400" /> :
                 g.category === "workflow" ? <IconGitPullRequest size={16} className="text-green-400" /> :
                 g.category === "release" ? <IconPackage size={16} className="text-purple-400" /> :
                 g.category === "labels" ? <IconList size={16} className="text-amber-400" /> :
                 g.category === "standards" ? <IconCheck size={16} className="text-blue-400" /> :
                 g.category === "decisions" ? <IconRoute size={16} className="text-pink-400" /> :
                 <IconShield size={16} className="text-red-400" />}
                <span className="text-xs text-muted-foreground">{g.category}</span>
                <span className={cn("text-xs ml-auto", g.status === "active" ? "text-green-400" : "text-amber-400")}>{g.status}</span>
              </div>
              <h3 className="font-semibold text-sm">{g.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{g.description}</p>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function RecognitionSection() {
  return (
    <section id="recognition" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Recognition Wall</h2>
        <p className="text-muted-foreground mb-8">Certifications, awards, badges, and community recognition</p>
        <div className="grid md:grid-cols-5 gap-3">
          {RECOGNITIONS.map(r => (
            <GlassCard key={r.id} glow={
              r.category === "certification" ? "cyan" :
              r.category === "award" ? "amber" :
              r.category === "badge" ? "purple" :
              r.category === "featured" ? "green" : "none"
            } className="p-4 text-center">
              <div className="flex justify-center mb-2">
                {r.category === "certification" ? <IconCertificate size={24} className="text-cyan-400" /> :
                 r.category === "award" ? <IconTrophy size={24} className="text-amber-400" /> :
                 r.category === "badge" ? <IconAward size={24} className="text-purple-400" /> :
                 r.category === "featured" ? <IconStar size={24} className="text-green-400" /> :
                 r.category === "mention" ? <IconSparkles size={24} className="text-blue-400" /> :
                 <IconHeart size={24} className="text-pink-400" />}
              </div>
              <h3 className="font-semibold text-xs leading-tight">{r.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{r.issuer}</p>
              <span className="text-xs text-muted-foreground">{r.date}</span>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function AIAssistantSection() {
  const [active, setActive] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ q: string; a: string }[]>([]);

  const handlePrompt = (idx: number) => {
    const p = COLLAB_PROMPTS[idx];
    setChatHistory(h => [...h, { q: p.question, a: p.answer }]);
    setActive(idx);
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    setChatInput("");
    const match = COLLAB_PROMPTS.find(p => p.question.toLowerCase().includes(q.toLowerCase()));
    setChatHistory(h => [...h, { q, a: match ? match.answer : "I can answer questions about my open-source projects, mentorship resources, community activities, governance, recognition, and collaboration history. Try asking about a specific project or area of interest." }]);
  };

  return (
    <section id="assistant" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">AI Collaboration Guide</h2>
        <p className="text-muted-foreground mb-8">Ask questions about open-source projects, mentorship, and community involvement</p>
        <GlassCard glow="cyan" className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-6">
              {COLLAB_PROMPTS.map((p, i) => (
                <Button key={i} variant={active === i ? "primary" : "glass"} size="sm" onClick={() => handlePrompt(i)}>
                  {p.question}
                </Button>
              ))}
            </div>
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {chatHistory.map((h, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <IconBrain size={12} className="text-cyan-400" />
                    </div>
                    <div className="text-sm text-white/90">{h.q}</div>
                  </div>
                  <div className="flex items-start gap-3 ml-9">
                    <div className="text-sm text-muted-foreground leading-relaxed">{h.a}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Ask about projects, contributions, governance..." value={chatInput}
                onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleChat()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50 touch-action-manipulation" style={{ minHeight: 44 }} />
              <Button variant="primary" size="md" className="touch-action-manipulation" style={{ minHeight: 44 }} onClick={handleChat}>Ask</Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}

function RecruiterSection() {
  const { recruiterMode } = useUIStore();
  if (!recruiterMode) return null;

  const activeProjects = OSS_PROJECTS.filter(p => p.status === "active");
  const totalStars = 2100;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <GlassCard glow="green" className="p-6">
        <h2 className="text-xl font-bold mb-4">Open Source Impact Summary</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">Project Portfolio</h3>
            <ul className="space-y-1.5">
              {activeProjects.map(p => (
                <li key={p.id} className="text-sm text-muted-foreground flex items-center gap-2">
                  <IconCheck size={12} className="text-green-400" />
                  {p.name} — {p.role} ({p.technologies.slice(0, 3).join(", ")})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-2">Key Metrics</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{CONTRIBUTION_STATS.repositoriesContributed} repositories contributed</p>
              <p>{CONTRIBUTION_STATS.totalPullRequests} pull requests merged</p>
              <p>{totalStars}+ GitHub stars across projects</p>
              <p>{CONTRIBUTION_STATS.communityDiscussions} community discussions</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">Community Presence</h3>
            <ul className="space-y-1.5">
              <li className="text-sm text-muted-foreground flex items-center gap-2"><IconCheck size={12} className="text-green-400" />BSides Austin Speaker 2026</li>
              <li className="text-sm text-muted-foreground flex items-center gap-2"><IconCheck size={12} className="text-green-400" />MITRE ATT&CK Contributor</li>
              <li className="text-sm text-muted-foreground flex items-center gap-2"><IconCheck size={12} className="text-green-400" />CNCF Sandbox Project</li>
              <li className="text-sm text-muted-foreground flex items-center gap-2"><IconCheck size={12} className="text-green-400" />TryHackMe Top 1%</li>
            </ul>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

export default function CollaborationPage() {
  const { recruiterMode } = useUIStore();

  return (
    <div className={cn("min-h-screen pb-20 overflow-x-hidden", recruiterMode && "recruiter-mode")}>
      <HeroSection stats={CONTRIBUTION_STATS} />
      <DashboardSection stats={CONTRIBUTION_STATS} />
      <ProjectsSection />
      <TimelineSection />
      <MentorshipSection />
      <CommunitySection />
      <DiscussionsSection />
      <GovernanceSection />
      <RecognitionSection />
      <AIAssistantSection />
      <RecruiterSection />
    </div>
  );
}
