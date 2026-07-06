"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconShield, IconBrain, IconNetwork, IconBook, IconBrandGithub,
  IconChartBar, IconCertificate, IconSearch, IconSettings,
  IconBug, IconServer, IconTerminal, IconFolder, IconGlobe,
  IconMessage, IconHistory, IconDashboard, IconMap, IconFlag,
  IconTrophy, IconCode, IconDatabase, IconLock, IconApi,
  IconUsers, IconFileText, IconStar, IconRobot,
  IconCheck, IconX, IconAlertTriangle, IconInfoCircle,
  IconArrowRight, IconCalendar, IconTarget, IconTimeline,
  IconRefresh, IconActivity, IconCpu, IconHeart,
} from "@tabler/icons-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { useCnxStore } from "./cnx-store";
import {
  APP_REGISTRY, EVENT_HISTORY, PORTFOLIO_HEALTH,
  GOALS, CHANGELOG, ROADMAP, ANALYTICS_SNAPSHOT,
  ANALYTICS_HISTORY, AI_DIGESTS, KNOWLEDGE_INDEX,
  PUBLIC_API_ENDPOINTS, AUTOMATION_TASKS, DIGITAL_TWIN_MILESTONES,
  type AppRegistration, type ChangelogEntry, type Goal,
  type RoadmapItem, type AnalyticsSnapshot,
} from "./cnx-data";

const STATUS_COLORS: Record<string, string> = {
  operational: "text-green-400 bg-green-500/10 border-green-500/30",
  degraded: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  experimental: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  planned: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  good: "text-green-400 bg-green-500/10 border-green-500/30",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
  completed: "text-green-400 bg-green-500/10 border-green-500/30",
  "in-progress": "text-amber-400 bg-amber-500/10 border-amber-500/30",
  future: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  current: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  feature: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  enhancement: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  fix: "text-green-400 bg-green-500/10 border-green-500/30",
  architecture: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  content: "text-amber-400 bg-amber-500/10 border-amber-500/30",
};

const GLOW_MAP: Record<string, "cyan" | "purple" | "blue" | "green" | "amber"> = {
  good: "green", warning: "amber", critical: "amber",
  operational: "green", degraded: "amber", experimental: "purple", planned: "blue",
  security: "cyan", intelligence: "purple", tool: "blue", knowledge: "green",
  ai: "purple", engagement: "amber", infrastructure: "green", shell: "cyan",
  career: "blue", platform: "cyan",
};

type TabView = "mission" | "search" | "registry" | "health" | "goals" | "roadmap" | "changelog" | "twin" | "analytics" | "digests" | "api" | "automation";

export default function CnxPage() {
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const { bookmarks, digestsRead, goalsCompleted, healthDismissed, toggleBookmark, markDigestRead, toggleGoalComplete, addSearchQuery } = useCnxStore();
  const [tab, setTab] = useState<TabView>("mission");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof KNOWLEDGE_INDEX>([]);
  const [showAi, setShowAi] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [expandedChangelog, setExpandedChangelog] = useState<string | null>(null);
  const [expandedHealth, setExpandedHealth] = useState<string | null>(null);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    addSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const ql = q.toLowerCase();
    setSearchResults(KNOWLEDGE_INDEX.filter((e) =>
      e.title.toLowerCase().includes(ql) ||
      e.summary.toLowerCase().includes(ql) ||
      e.tags.some((t) => t.toLowerCase().includes(ql)) ||
      e.type.toLowerCase().includes(ql)
    ));
  };

  const handleAi = async (q: string) => {
    setAiQuery(q); setAiLoading(true); setAiResponse("");
    await new Promise((r) => setTimeout(r, 700));
    const ql = q.toLowerCase();
    if (ql.includes("health") || ql.includes("status")) {
      const good = PORTFOLIO_HEALTH.filter((h) => h.status === "good").length;
      setAiResponse(`Portfolio health: ${good}/${PORTFOLIO_HEALTH.length} metrics in good standing. Areas needing attention: ${PORTFOLIO_HEALTH.filter((h) => h.status !== "good").map((h) => h.label).join(", ") || "none"}. Recommendation: ${PORTFOLIO_HEALTH.find((h) => h.status !== "good")?.recommendation || "All systems operational."}`);
    } else if (ql.includes("goal") || ql.includes("plan")) {
      const active = GOALS.filter((g) => g.status === "in-progress");
      setAiResponse(`Current goals (${active.length} active): ${active.map((g) => `• ${g.title} (${g.priority} priority, target: ${g.targetDate || "no deadline"})`).join("\n")}\n\nPlanned: ${GOALS.filter((g) => g.status === "planned").length} upcoming goals.`);
    } else if (ql.includes("changelog") || ql.includes("version") || ql.includes("update")) {
      const latest = CHANGELOG[CHANGELOG.length - 1];
      setAiResponse(`Latest version: ${latest.version} (${latest.date}) — ${latest.title}. Total of ${CHANGELOG.length} recorded releases spanning from initial launch to the current ${latest.version} release.`);
    } else if (ql.includes("roadmap")) {
      const current = ROADMAP.filter((r) => r.status === "current" || r.status === "planned");
      setAiResponse(`Roadmap: ${current.length} upcoming items. Current focus: ${ROADMAP.filter((r) => r.status === "current").map((r) => r.title).join(", ")}. Planned: ${ROADMAP.filter((r) => r.status === "planned").map((r) => r.title).join(", ")}. Future vision includes ${ROADMAP.filter((r) => r.status === "future").length} longer-term initiatives.`);
    } else if (ql.includes("apps") || ql.includes("application") || ql.includes("registry")) {
      const ops = APP_REGISTRY.filter((a) => a.health === "operational").length;
      setAiResponse(`Application Registry: ${ops}/${APP_REGISTRY.length} applications operational. Categories include security (${APP_REGISTRY.filter((a) => a.category === "security").length}), intelligence (${APP_REGISTRY.filter((a) => a.category === "intelligence").length}), and tools (${APP_REGISTRY.filter((a) => a.category === "tool").length}).`);
    } else if (ql.includes("twin") || ql.includes("journey") || ql.includes("timeline")) {
      const milestones = DIGITAL_TWIN_MILESTONES;
      const past = milestones.filter((m) => !m.category.includes("goal")).length;
      const future = milestones.filter((m) => m.category.includes("goal")).length;
      setAiResponse(`Digital Twin: ${past} past milestones completed, ${future} future goals planned. Journey spans from ${milestones[0].date} to ${milestones[milestones.length - 1].date}. Current focus: ${milestones.filter((m) => m.date.includes("2026-Q3")).map((m) => m.label).join(", ")}.`);
    } else if (ql.includes("digest") || ql.includes("weekly")) {
      const digests = AI_DIGESTS;
      setAiResponse(`Weekly AI Digests: ${digests.length} generated. Latest: ${digests[0]?.week} — ${digests[0]?.summary.slice(0, 150)}...`);
    } else {
      setAiResponse("I can answer questions about portfolio health, goals, roadmap, changelog, application registry, digital twin timeline, and weekly digests. Try asking: 'What is the portfolio health?', 'Show current goals', 'What changed in the latest version?', or 'Tell me about the roadmap'.");
    }
    setAiLoading(false);
  };

  const aiSuggestions = [
    "What is the portfolio health?",
    "Show current goals and plans",
    "What changed in the latest version?",
    "Tell me about the roadmap",
    "How many applications are registered?",
    "Show my digital twin journey",
  ];

  const visibleHealth = PORTFOLIO_HEALTH.filter((h) => !healthDismissed.includes(h.id));

  // ─── Mission Control ──────────────────────────────────────────────────

  const MissionView = () => (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mission Control</h2>
          <p className="text-sm text-gray-400 mt-1">Central command centre for the Cyber Nexus platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="glass" size="sm" onClick={() => setShowAi(!showAi)}>
            <IconBrain size={14} /> AI Concierge
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Pages", value: ANALYTICS_SNAPSHOT.totalPages, icon: IconFileText, color: "text-cyan-400" },
          { label: "Projects", value: ANALYTICS_SNAPSHOT.totalProjects, icon: IconCode, color: "text-blue-400" },
          { label: "Skills", value: ANALYTICS_SNAPSHOT.totalSkills, icon: IconBrain, color: "text-purple-400" },
          { label: "Certs", value: ANALYTICS_SNAPSHOT.totalCertifications, icon: IconCertificate, color: "text-amber-400" },
          { label: "Blog", value: ANALYTICS_SNAPSHOT.totalBlogPosts, icon: IconFileText, color: "text-green-400" },
          { label: "CTF", value: ANALYTICS_SNAPSHOT.totalCTFChallenges, icon: IconFlag, color: "text-cyan-400" },
          { label: "Achievements", value: ANALYTICS_SNAPSHOT.totalAchievements, icon: IconTrophy, color: "text-amber-400" },
          { label: "Architectures", value: ANALYTICS_SNAPSHOT.totalArchitectures, icon: IconLock, color: "text-purple-400" },
        ].map((s) => (
          <GlassCard key={s.label} glow="none" variant="small">
            <div className="p-3 text-center">
              <s.icon size={18} className={`${s.color} mx-auto mb-1`} />
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* AI Concierge */}
      <AnimatePresence>
        {showAi && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <GlassCard glow="purple">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <IconBrain size={20} className="text-purple-400" />
                  <h3 className="text-white font-semibold text-sm">AI Concierge</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiSuggestions.map((s) => (
                    <button key={s} onClick={() => handleAi(s)} className="px-2 py-1 rounded text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20">{s}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && aiQuery && handleAi(aiQuery)}
                    placeholder="Ask the AI concierge..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50"
                  />
                  <Button variant="primary" size="sm" onClick={() => handleAi(aiQuery)} disabled={aiLoading || !aiQuery}><IconBrain size={14} /> Ask</Button>
                </div>
                {(aiLoading || aiResponse) && (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm whitespace-pre-line">
                    {aiLoading ? <div className="flex items-center gap-2 text-gray-400"><div className="w-3 h-3 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />Thinking...</div> : <p className="text-gray-200">{aiResponse}</p>}
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Events */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Recent Platform Events</h3>
        <div className="space-y-2">
          {EVENT_HISTORY.slice(0, 6).map((evt) => (
            <div key={evt.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className={`w-2 h-2 rounded-full ${evt.severity === "achievement" ? "bg-amber-400" : evt.severity === "warning" ? "bg-amber-500" : "bg-cyan-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{evt.type.replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                <p className="text-xs text-gray-500">From: {evt.source} · {new Date(evt.timestamp).toLocaleDateString()}</p>
              </div>
              <IconArrowRight size={14} className="text-gray-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Digital Twin Snapshot */}
      <GlassCard glow="cyan">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <IconHeart size={20} className="text-cyan-400" />
            <h3 className="text-white font-semibold">Digital Twin Timeline</h3>
          </div>
          <div className="relative pl-6 space-y-0">
            {DIGITAL_TWIN_MILESTONES.slice(-5).map((m, i) => (
              <div key={m.date + m.label} className="relative pb-3 border-l border-white/10 pl-4 last:border-0">
                <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full ${m.category.includes("goal") ? "bg-blue-500" : "bg-cyan-500"}`} />
                <p className="text-xs text-gray-500">{m.date}</p>
                <p className="text-sm text-white">{m.label}</p>
                <p className="text-xs text-gray-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Documentation Coverage */}
      <GlassCard glow="none">
        <div className="p-4 space-y-3">
          <h3 className="text-white font-semibold text-sm">Portfolio Growth</h3>
          <div className="flex items-end gap-1 h-20">
            {ANALYTICS_HISTORY.map ((snap, i) => {
              const h = Math.round((snap.totalPages / ANALYTICS_SNAPSHOT.totalPages) * 64);
              return (
                <div key={snap.date} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div initial={{ height: 0 }} animate={{ height: h }} className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
                    style={{ height: Math.max(8, h) }} transition={{ delay: i * 0.1 }}
                  />
                  <p className="text-xs text-gray-500">{snap.date.slice(0, 7)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Application Registry", icon: IconDashboard, tab: "registry" as TabView },
          { label: "Portfolio Health", icon: IconActivity, tab: "health" as TabView },
          { label: "Goals & Plans", icon: IconTarget, tab: "goals" as TabView },
          { label: "Roadmap", icon: IconMap, tab: "roadmap" as TabView },
          { label: "Changelog", icon: IconHistory, tab: "changelog" as TabView },
          { label: "Digital Twin", icon: IconHeart, tab: "twin" as TabView },
          { label: "Weekly Digests", icon: IconCalendar, tab: "digests" as TabView },
          { label: "API & Automation", icon: IconSettings, tab: "api" as TabView },
        ].map((action) => (
          <button key={action.label} onClick={() => setTab(action.tab)}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-center"
          >
            <action.icon size={20} className="text-cyan-400 mx-auto mb-1" />
            <p className="text-xs text-gray-300">{action.label}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Registry View ───────────────────────────────────────────────────

  const RegistryView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Application Registry</h2>
      <p className="text-sm text-gray-400 mb-6">{APP_REGISTRY.length} registered applications</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {APP_REGISTRY.map((app) => (
          <GlassCard key={app.id} glow={GLOW_MAP[app.category] || "none"} variant="small">
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-1.5 py-0.5 rounded text-xs border ${STATUS_COLORS[app.health]}`}>{app.health}</span>
                <button onClick={() => toggleBookmark(app.id)}>
                  <IconStar size={14} className={bookmarks.includes(app.id) ? "text-amber-400 fill-amber-400" : "text-gray-600"} />
                </button>
              </div>
              <h3 className="text-white text-sm font-semibold">{app.name}</h3>
              <p className="text-xs text-gray-400">{app.desc}</p>
              <div className="flex flex-wrap gap-1">
                {app.routes.map((r) => <span key={r} className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-gray-400 border border-white/10">{r}</span>)}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>v{app.version}</span>
                <span>{app.dependencies.length > 0 ? `Dep: ${app.dependencies.join(", ")}` : "No deps"}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  // ─── Health View ──────────────────────────────────────────────────────

  const HealthView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Portfolio Health</h2>
      <p className="text-sm text-gray-400 mb-6">Monitoring {PORTFOLIO_HEALTH.length} metrics</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Good", count: PORTFOLIO_HEALTH.filter((h) => h.status === "good").length, color: "text-green-400" },
          { label: "Warning", count: PORTFOLIO_HEALTH.filter((h) => h.status === "warning").length, color: "text-amber-400" },
          { label: "Critical", count: PORTFOLIO_HEALTH.filter((h) => h.status === "critical").length, color: "text-red-400" },
          { label: "Coverage", value: `${ANALYTICS_SNAPSHOT.documentationCoverage}%`, color: "text-cyan-400" },
        ].map((s) => (
          <GlassCard key={s.label} glow="none" variant="small">
            <div className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count ?? s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>
      <div className="space-y-2">
        {visibleHealth.map((metric) => (
          <div key={metric.id} className="border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => setExpandedHealth(expandedHealth === metric.id ? null : metric.id)}
              className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`px-1.5 py-0.5 rounded text-xs border ${STATUS_COLORS[metric.status]}`}>{metric.status}</span>
                <span className="text-sm text-white">{metric.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${metric.status === "good" ? "bg-green-500" : metric.status === "warning" ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${(metric.value / metric.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{metric.value}/{metric.max}</span>
                </div>
              </div>
            </button>
            {expandedHealth === metric.id && (
              <div className="px-3 pb-3 border-t border-white/10 pt-2">
                <p className="text-xs text-gray-400">{metric.recommendation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Goals View ───────────────────────────────────────────────────────

  const GoalsView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Goals Engine</h2>
      <p className="text-sm text-gray-400 mb-6">{GOALS.filter((g) => g.status === "in-progress").length} active · {GOALS.filter((g) => g.status === "planned").length} planned · {GOALS.filter((g) => g.status === "future").length} future</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {GOALS.map((goal) => {
          const done = goalsCompleted.includes(goal.id);
          return (
            <GlassCard key={goal.id} glow={GLOW_MAP[goal.status] || "none"} variant="small">
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-1.5 py-0.5 rounded text-xs border ${STATUS_COLORS[goal.status]}`}>{goal.status}</span>
                  <button onClick={() => toggleGoalComplete(goal.id)}>
                    <IconCheck size={14} className={done ? "text-green-400" : "text-gray-600"} />
                  </button>
                </div>
                <h3 className={`text-sm font-semibold ${done ? "text-gray-500 line-through" : "text-white"}`}>{goal.title}</h3>
                <p className="text-xs text-gray-400">{goal.desc}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{goal.category}</span>
                  <span className={`capitalize font-medium ${goal.priority === "high" ? "text-amber-400" : goal.priority === "medium" ? "text-cyan-400" : "text-gray-400"}`}>{goal.priority} priority</span>
                </div>
                {goal.targetDate && <span className="text-xs text-gray-500">Target: {goal.targetDate}</span>}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );

  // ─── Roadmap View ─────────────────────────────────────────────────────

  const RoadmapView = () => {
    const sections = [
      { label: "Completed", items: ROADMAP.filter((r) => r.status === "completed"), color: "text-green-400", border: "border-green-500/30" },
      { label: "Current", items: ROADMAP.filter((r) => r.status === "current"), color: "text-cyan-400", border: "border-cyan-500/30" },
      { label: "Planned", items: ROADMAP.filter((r) => r.status === "planned"), color: "text-amber-400", border: "border-amber-500/30" },
      { label: "Future", items: ROADMAP.filter((r) => r.status === "future"), color: "text-blue-400", border: "border-blue-500/30" },
    ];
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Roadmap</h2>
        <p className="text-sm text-gray-400 mb-6">{ROADMAP.length} milestones across the platform lifecycle</p>
        <div className="space-y-6">
          {sections.filter((s) => s.items.length > 0).map((section) => (
            <div key={section.label}>
              <h3 className={`text-sm font-semibold ${section.color} mb-3 uppercase tracking-wider`}>{section.label} ({section.items.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.items.map((item) => (
                  <GlassCard key={item.id} glow="none" variant="small">
                    <div className="p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`px-1.5 py-0.5 rounded text-xs border ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                        <span className="text-xs text-gray-500">{item.quarter}</span>
                      </div>
                      <h4 className="text-sm text-white font-medium">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                      <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── Changelog View ───────────────────────────────────────────────────

  const ChangelogView = () => {
    const versions = CHANGELOG.reduce((acc, entry) => {
      if (!acc[entry.version]) acc[entry.version] = [];
      acc[entry.version].push(entry);
      return acc;
    }, {} as Record<string, ChangelogEntry[]>);

    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Changelog Engine</h2>
        <p className="text-sm text-gray-400 mb-6">{CHANGELOG.length} releases across the platform lifecycle</p>
        <div className="space-y-4">
          {Object.entries(versions).reverse().map(([version, entries]) => (
            <GlassCard key={version} glow="none" variant="small">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold">v{version}</h3>
                  <span className="text-xs text-gray-500">{entries[0].date}</span>
                </div>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div key={entry.id} className="border border-white/10 rounded-lg overflow-hidden">
                      <button onClick={() => setExpandedChangelog(expandedChangelog === entry.id ? null : entry.id)}
                        className="w-full flex items-center justify-between p-2 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-xs border ${STATUS_COLORS[entry.type]}`}>{entry.type}</span>
                          <span className="text-sm text-white">{entry.title}</span>
                        </div>
                        <IconArrowRight size={12} className="text-gray-600" />
                      </button>
                      {expandedChangelog === entry.id && (
                        <div className="px-3 pb-3 border-t border-white/10 pt-2">
                          <p className="text-xs text-gray-400">{entry.desc}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  };

  // ─── Digital Twin View ────────────────────────────────────────────────

  const TwinView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Digital Twin</h2>
      <p className="text-sm text-gray-400 mb-6">A living representation of the portfolio journey — past, present, and future</p>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-blue-500" />
        <div className="space-y-6 pl-10">
          {DIGITAL_TWIN_MILESTONES.map((m, i) => (
            <motion.div key={m.date + m.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="relative"
            >
              <div className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 ${m.category.includes("goal") ? "border-blue-500 bg-blue-500/20" : "border-cyan-500 bg-cyan-500/20"}`} />
              <GlassCard glow="none" variant="small">
                <div className="p-3">
                  <p className="text-xs text-gray-500 font-mono">{m.date}</p>
                  <h3 className="text-white font-medium">{m.label}</h3>
                  <p className="text-sm text-gray-400">{m.desc}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-xs bg-white/5 text-gray-400 border border-white/10 capitalize">{m.category}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Analytics View ───────────────────────────────────────────────────

  const AnalyticsView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Analytics Engine</h2>
      <p className="text-sm text-gray-400 mb-6">Portfolio growth metrics over time</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Pages", data: ANALYTICS_HISTORY.map((s) => s.totalPages), color: "stroke-cyan-400" },
          { label: "Projects", data: ANALYTICS_HISTORY.map((s) => s.totalProjects), color: "stroke-blue-400" },
          { label: "Skills", data: ANALYTICS_HISTORY.map((s) => s.totalSkills), color: "stroke-purple-400" },
          { label: "Certs", data: ANALYTICS_HISTORY.map((s) => s.totalCertifications), color: "stroke-amber-400" },
        ].map((series) => {
          const max = Math.max(...series.data, 1);
          const w = 80; const h = 30;
          const pts = series.data.map((v, i) => `${(i / (series.data.length - 1 || 1)) * w},${h - (v / max) * h}`).join(" ");
          return (
            <GlassCard key={series.label} glow="none" variant="small">
              <div className="p-3">
                <p className="text-lg font-bold text-white">{series.data[series.data.length - 1]}</p>
                <p className="text-xs text-gray-500">{series.label}</p>
                <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8 mt-1">
                  <polyline fill="none" className={series.color} strokeWidth="1.5" points={pts} />
                </svg>
              </div>
            </GlassCard>
          );
        })}
      </div>
      <GlassCard glow="none">
        <div className="p-4 space-y-3">
          <h3 className="text-white font-semibold text-sm">Growth Overview</h3>
          {ANALYTICS_HISTORY.map((snap) => (
            <div key={snap.date} className="flex items-center gap-3 text-xs">
              <span className="text-gray-500 w-20">{snap.date}</span>
              <div className="flex-1 flex gap-2">
                <div className="h-2 rounded bg-cyan-500/30" style={{ width: `${(snap.totalPages / ANALYTICS_SNAPSHOT.totalPages) * 100}%` }} title="Pages" />
                <div className="h-2 rounded bg-purple-500/30" style={{ width: `${(snap.totalProjects / ANALYTICS_SNAPSHOT.totalProjects) * 100}%` }} title="Projects" />
                <div className="h-2 rounded bg-amber-500/30" style={{ width: `${(snap.totalCertifications / ANALYTICS_SNAPSHOT.totalCertifications) * 100}%` }} title="Certs" />
              </div>
              <span className="text-gray-500 w-16 text-right">{snap.totalPages}p</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  // ─── Digests View ─────────────────────────────────────────────────────

  const DigestsView = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Weekly AI Digests</h2>
      <p className="text-sm text-gray-400 mb-6">Automated weekly summaries of portfolio activity</p>
      <div className="space-y-4">
        {AI_DIGESTS.map((digest) => {
          const read = digestsRead.includes(digest.id);
          return (
            <GlassCard key={digest.id} glow="none" variant="small">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconCalendar size={16} className="text-cyan-400" />
                    <h3 className="text-white font-semibold text-sm">{digest.week}</h3>
                  </div>
                  <button onClick={() => markDigestRead(digest.id)} className={`px-2 py-0.5 rounded text-xs ${read ? "text-green-400 bg-green-500/10" : "text-gray-500 hover:text-gray-300"}`}>
                    {read ? "Read" : "Mark read"}
                  </button>
                </div>
                {digest.updates.map((update) => (
                  <div key={update.category}>
                    <p className="text-xs text-cyan-400 font-medium mb-1">{update.category}</p>
                    <ul className="space-y-0.5 ml-3">
                      {update.items.map((item, i) => <li key={i} className="text-xs text-gray-300 list-disc">{item}</li>)}
                    </ul>
                  </div>
                ))}
                <p className="text-xs text-gray-500 italic border-t border-white/10 pt-2">{digest.summary}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );

  // ─── API / Automation View ────────────────────────────────────────────

  const ApiView = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Public Read-Only API</h2>
        <p className="text-sm text-gray-400 mb-6">Programmatic access to portfolio data</p>
        <GlassCard glow="none">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-white/10"><th className="text-left py-3 px-4 text-gray-400 font-medium">Endpoint</th><th className="text-left py-3 px-4 text-gray-400 font-medium">Method</th><th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th><th className="text-left py-3 px-4 text-gray-400 font-medium">Response</th></tr></thead>
              <tbody>
                {PUBLIC_API_ENDPOINTS.map((ep) => (
                  <tr key={ep.path} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-cyan-300 font-mono text-[11px]">{ep.path}</td>
                    <td className="py-3 px-4"><span className="px-1.5 py-0.5 rounded text-xs bg-green-500/10 text-green-300 border border-green-500/20">{ep.method}</span></td>
                    <td className="py-3 px-4 text-gray-300">{ep.desc}</td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{ep.responseType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Automation Center</h2>
        <p className="text-sm text-gray-400 mb-6">Automated processes keeping the portfolio healthy</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AUTOMATION_TASKS.map((task) => (
            <GlassCard key={task.id} glow="none" variant="small">
              <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm text-white font-medium">{task.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-xs border ${STATUS_COLORS[task.status]}`}>{task.status}</span>
                </div>
                <p className="text-xs text-gray-400">{task.desc}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{task.frequency}</span>
                  <span>Last: {new Date(task.lastRun).toLocaleDateString()}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Search Results ───────────────────────────────────────────────────

  const SearchView = () => (
    <div className="space-y-4">
      <div className="relative w-full max-w-lg">
        <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Semantic search across all indexed content..." autoFocus
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500/50"
        />
      </div>
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {searchResults.map((entry) => (
            <GlassCard key={entry.id} glow="none" variant="small">
              <div className="p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 capitalize">{entry.type}</span>
                  <span className="text-xs text-gray-500">{entry.source}</span>
                </div>
                <h3 className="text-sm text-white font-medium">{entry.title}</h3>
                <p className="text-xs text-gray-400">{entry.summary}</p>
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((t) => <span key={t} className="text-xs text-gray-500">#{t}</span>)}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
      {searchQuery && searchResults.length === 0 && <p className="text-sm text-gray-500">No results for &ldquo;{searchQuery}&rdquo;</p>}
      {!searchQuery && (
        <div className="text-center py-12 text-gray-500">
          <IconSearch size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Search across {KNOWLEDGE_INDEX.length} indexed entries</p>
          <p className="text-xs text-gray-600 mt-1">Projects, skills, certifications, articles, architecture, CTFs</p>
        </div>
      )}
    </div>
  );

  // ─── Recruiter View ───────────────────────────────────────────────────

  if (recruiterMode) {
    return (
      <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <IconShield size={28} className="text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Cyber Nexus X</h1>
            <p className="text-sm text-gray-400">Mission Control — Recruiter View</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{ label: "Pages", value: ANALYTICS_SNAPSHOT.totalPages }, { label: "Projects", value: ANALYTICS_SNAPSHOT.totalProjects }, { label: "Skills", value: ANALYTICS_SNAPSHOT.totalSkills }, { label: "Certs", value: ANALYTICS_SNAPSHOT.totalCertifications }].map((s) => (
            <GlassCard key={s.label} glow="none" variant="small">
              <div className="p-4 text-center"><p className="text-2xl font-bold text-cyan-400">{s.value}</p><p className="text-xs text-gray-400">{s.label}</p></div>
            </GlassCard>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Registered Applications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {APP_REGISTRY.filter((a) => a.health === "operational").map((app) => (
              <div key={app.id} className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <span className="text-xs text-gray-300">{app.name}</span>
                <span className="text-xs text-gray-600 ml-auto">v{app.version}</span>
              </div>
            ))}
          </div>
        </div>
        <GlassCard glow="cyan">
          <div className="p-4 text-sm text-gray-300 leading-relaxed">
            Cyber Nexus X is the shared intelligence platform connecting {APP_REGISTRY.length} applications across {ANALYTICS_SNAPSHOT.totalPages} pages. It provides semantic search, AI context, event-driven communication, portfolio health monitoring, and long-term extensibility — all powered by the Liquid Glass design system.
          </div>
        </GlassCard>
      </div>
    );
  }

  // ─── Main Layout ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
              <IconShield size={14} /> Chapter 32
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                Cyber Nexus X
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              The living digital twin — shared intelligence, semantic search, event-driven communication, and portfolio health monitoring for every module.
            </p>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 justify-center">
          {[
            { id: "mission" as TabView, label: "Mission Control", icon: IconDashboard },
            { id: "search" as TabView, label: "Semantic Search", icon: IconSearch },
            { id: "registry" as TabView, label: "App Registry", icon: IconDashboard },
            { id: "health" as TabView, label: "Health", icon: IconActivity },
            { id: "goals" as TabView, label: "Goals", icon: IconTarget },
            { id: "roadmap" as TabView, label: "Roadmap", icon: IconMap },
            { id: "changelog" as TabView, label: "Changelog", icon: IconHistory },
            { id: "twin" as TabView, label: "Digital Twin", icon: IconHeart },
            { id: "analytics" as TabView, label: "Analytics", icon: IconChartBar },
            { id: "digests" as TabView, label: "Digests", icon: IconCalendar },
            { id: "api" as TabView, label: "API & Automation", icon: IconSettings },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                tab === t.id ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-gray-400 hover:text-white border border-transparent"
              }`}
            ><t.icon size={14} /> {t.label}</button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
            {tab === "mission" && <MissionView />}
            {tab === "search" && <SearchView />}
            {tab === "registry" && <RegistryView />}
            {tab === "health" && <HealthView />}
            {tab === "goals" && <GoalsView />}
            {tab === "roadmap" && <RoadmapView />}
            {tab === "changelog" && <ChangelogView />}
            {tab === "twin" && <TwinView />}
            {tab === "analytics" && <AnalyticsView />}
            {tab === "digests" && <DigestsView />}
            {tab === "api" && <ApiView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
