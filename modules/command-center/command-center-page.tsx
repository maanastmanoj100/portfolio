"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useKeyboardShortcuts } from "@/lib/keyboard";
import {
  IconShieldExclamation, IconAlertTriangle, IconAlertCircle, IconInfoCircle,
  IconCheck, IconClock, IconServer, IconDatabase, IconNetwork, IconChartBar,
  IconHistory, IconFlag, IconTrophy, IconBrain, IconRobot, IconTerminal2,
  IconSearch, IconBrandGithub, IconGlobe, IconShield, IconLock, IconUsers,
  IconBug, IconFileText, IconArrowRight, IconX, IconMenu2, IconSettings,
  IconCpu, IconGauge, IconRadar, IconStar, IconBook, IconCode,
  IconUserShield, IconRefresh, IconEye, IconEyeOff, IconFilterSearch,
  IconTrendingUp, IconTrendingDown, IconMinus, IconPlus, IconChevronRight,
  IconMail, IconCertificate, IconHome, IconMessage2,
} from "@tabler/icons-react";
import {
  SOC_ALERTS, NOC_METRICS, CVE_SUMMARIES, THREAT_ACTOR_SUMMARIES,
  OSINT_FEEDS, INFRASTRUCTURE_NODES, INFRASTRUCTURE_CONNECTIONS,
  INCIDENTS, TIMELINE_EVENTS, GLOBAL_STATS, PALETTE_COMMANDS,
  getTerminalResponse, AI_SUGGESTIONS,
  SEVERITY_COLORS, STATUS_COLORS, SOURCE_BADGES,
  type Severity, type IncidentStatus, type ServiceStatus, type DataSource,
} from "./command-center-data";
import { useCommandCenterStore, type ActivePanel, type TerminalLine } from "./command-center-store";

// ─── PANEL NAVIGATION ───────────────────────────────────────────────────

const PANELS: { id: ActivePanel; label: string; icon: any; color: string }[] = [
  { id: "soc", label: "SOC", icon: IconShieldExclamation, color: "text-red-400" },
  { id: "noc", label: "NOC", icon: IconServer, color: "text-cyan-400" },
  { id: "threat", label: "Threat Intel", icon: IconRadar, color: "text-amber-400" },
  { id: "osint", label: "OSINT", icon: IconGlobe, color: "text-blue-400" },
  { id: "infra", label: "Infrastructure", icon: IconNetwork, color: "text-green-400" },
  { id: "analyst", label: "AI Analyst", icon: IconBrain, color: "text-purple-400" },
  { id: "incidents", label: "Incidents", icon: IconAlertTriangle, color: "text-red-400" },
  { id: "timeline", label: "Mission", icon: IconHistory, color: "text-blue-400" },
  { id: "wall", label: "Command Wall", icon: IconGauge, color: "text-cyan-400" },
  { id: "executive", label: "Executive", icon: IconUserShield, color: "text-emerald-400" },
];

// ─── SOURCE BADGE ───────────────────────────────────────────────────────

function SourceBadge({ source }: { source: DataSource }) {
  const b = SOURCE_BADGES[source];
  return (
    <span className={cn("text-xs font-mono px-1 py-0.5 rounded border tracking-wider", b.color)}>
      {b.label}
    </span>
  );
}

// ─── SEVERITY BADGE ─────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className="text-xs font-mono px-1.5 py-0.5 rounded font-medium"
      style={{ backgroundColor: SEVERITY_COLORS[severity] + "20", color: SEVERITY_COLORS[severity], border: `1px solid ${SEVERITY_COLORS[severity]}40` }}
    >
      {severity.toUpperCase()}
    </span>
  );
}

// ─── STATUS BADGE ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <span
      className="text-xs font-mono px-1.5 py-0.5 rounded capitalize"
      style={{ backgroundColor: STATUS_COLORS[status] + "20", color: STATUS_COLORS[status], border: `1px solid ${STATUS_COLORS[status]}40` }}
    >
      {status}
    </span>
  );
}

// ─── ANIMATED VALUE ─────────────────────────────────────────────────────

function AnimatedValue({ value, suffix = "", className = "" }: { value: string | number; suffix?: string; className?: string }) {
  return (
    <motion.span
      key={String(value)}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("tabular-nums", className)}
    >
      {value}{suffix}
    </motion.span>
  );
}

// ─── SECTION HEADER ─────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label, badge, action }: { icon: any; label: string; badge?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-[var(--color-accent)]" />
        <h2 className="text-sm font-semibold text-[var(--color-foreground)]">{label}</h2>
        {badge && (
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            {badge}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── GLOBAL STATUS BAR ──────────────────────────────────────────────────

function GlobalStatusBar() {
  const store = useCommandCenterStore();
  const ui = useUIStore();
  const [time, setTime] = useState(new Date());
  const [openIncidents, setOpenIncidents] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      store.updateUiClock();
    }, 1000);
    const m = setInterval(() => store.simulateMetrics(), 5000);
    return () => { clearInterval(t); clearInterval(m); };
  }, [store]);

  useEffect(() => {
    setOpenIncidents(INCIDENTS.filter(i => i.status !== "closed").length);
  }, []);

  const statusItems = [
    { icon: IconClock, label: "Local", value: time.toLocaleTimeString(), color: "text-cyan-400" },
    { icon: IconGlobe, label: "UTC", value: time.toUTCString().slice(17, 26), color: "text-blue-400" },
    { icon: IconShield, label: "Threat Level", value: openIncidents > 3 ? "ELEVATED" : "NORMAL", color: openIncidents > 3 ? "text-amber-400" : "text-green-400" },
    { icon: IconAlertTriangle, label: "Incidents", value: String(openIncidents), color: openIncidents > 0 ? "text-red-400" : "text-green-400" },
    { icon: IconServer, label: "Network", value: store.networkStatus.toUpperCase(), color: store.networkStatus === "online" ? "text-green-400" : "text-amber-400" },
    { icon: IconCpu, label: "CPU", value: `${store.cpuUsage}%`, color: "text-cyan-400" },
    { icon: IconDatabase, label: "Memory", value: `${store.memUsage}%`, color: "text-purple-400" },
    { icon: IconRobot, label: "AI", value: store.aiStatus === "online" ? "ONLINE" : "PROCESSING", color: store.aiStatus === "online" ? "text-green-400" : "text-amber-400" },
    { icon: IconBrandGithub, label: "GitHub", value: "14 repos", color: "text-white" },
    { icon: IconEye, label: "Visitors", value: String(store.visitorCount), color: "text-blue-400" },
    { icon: IconCode, label: "Version", value: GLOBAL_STATS.version, color: "text-gray-400" },
  ];

  return (
    <div className="sticky top-0 z-40 -mx-4 px-4 py-1.5
      bg-gradient-to-r from-[rgba(8,9,12,0.95)] via-[rgba(16,17,20,0.92)] to-[rgba(8,9,12,0.95)]
      backdrop-blur-2xl border-b border-[rgba(255,255,255,0.06)]
      shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-1 flex-shrink-0">
              <Icon size={10} className={item.color} />
              <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">{item.label}:</span>
              <AnimatedValue value={item.value} className={cn("text-[11px] font-mono font-semibold", item.color)} />
            </div>
          );
        })}
        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => ui.setHackerTerminalOpen(true)}
            className="p-2 rounded text-[var(--color-foreground-tertiary)] hover:text-[var(--color-accent)]"
            aria-label="Open terminal"
          >
            <IconTerminal2 size={14} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => store.setPaletteOpen(true)}
            className="p-2 rounded text-[var(--color-foreground-tertiary)] hover:text-[var(--color-accent)]"
            aria-label="Command palette"
          >
            <IconSearch size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ─── GLOBAL METRICS ─────────────────────────────────────────────────────

function GlobalMetrics() {
  const metrics = [
    { icon: IconCode, label: "Projects", value: GLOBAL_STATS.totalProjects, color: "text-cyan-400" },
    { icon: IconCertificate, label: "Certs", value: GLOBAL_STATS.totalCertifications, color: "text-amber-400" },
    { icon: IconBrain, label: "Skills", value: GLOBAL_STATS.totalSkills, color: "text-purple-400" },
    { icon: IconFlag, label: "CTF", value: GLOBAL_STATS.totalCTFChallenges, color: "text-green-400" },
    { icon: IconServer, label: "Lab VMs", value: GLOBAL_STATS.totalLabVMs, color: "text-blue-400" },
    { icon: IconBook, label: "Wiki Articles", value: GLOBAL_STATS.totalWikiArticles, color: "text-emerald-400" },
    { icon: IconTrophy, label: "Achievements", value: GLOBAL_STATS.totalAchievements, color: "text-amber-400" },
    { icon: IconBrandGithub, label: "Repos", value: GLOBAL_STATS.totalGithubRepos, color: "text-white" },
  ];

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <GlassCard key={m.label} glow="none" variant="small" className="text-center">
            <Icon size={16} className={cn("mx-auto mb-0.5", m.color)} />
            <div className={cn("text-sm font-bold font-mono", m.color)}>{m.value}</div>
            <div className="text-xs text-[var(--color-foreground-tertiary)] font-mono">{m.label}</div>
          </GlassCard>
        );
      })}
    </div>
  );
}

// ─── PANEL NAV ──────────────────────────────────────────────────────────

function PanelNav({ active, onSelect }: { active: ActivePanel; onSelect: (p: ActivePanel) => void }) {
  return (
    <div className="flex flex-nowrap lg:flex-wrap gap-1 mb-4 p-1 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] overflow-x-auto no-scrollbar">
      {PANELS.map((p) => {
        const Icon = p.icon;
        return (
          <motion.button
            key={p.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(p.id)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 min-h-[44px]",
              active === p.id
                ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20"
                : "text-[var(--color-foreground-tertiary)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.04)]",
            )}
          >
            <Icon size={12} className={p.color} />
            {p.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── SOC PANEL ──────────────────────────────────────────────────────────

function SocPanel() {
  const store = useCommandCenterStore();
  const { alertFilter } = store;

  const filteredAlerts = useMemo(() => {
    let a = SOC_ALERTS;
    if (alertFilter.severity.length > 0) a = a.filter(al => alertFilter.severity.includes(al.severity));
    if (alertFilter.status.length > 0) a = a.filter(al => alertFilter.status.includes(al.status));
    if (alertFilter.search) {
      const q = alertFilter.search.toLowerCase();
      a = a.filter(al => al.title.toLowerCase().includes(q) || al.description.toLowerCase().includes(q) || al.tags.some(t => t.includes(q)));
    }
    return a;
  }, [alertFilter]);

  const severityCounts = SOC_ALERTS.reduce((acc, a) => {
    acc[a.severity] = (acc[a.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = SOC_ALERTS.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={IconShieldExclamation}
        label="Security Operations Center"
        badge={`${SOC_ALERTS.length} alerts`}
      />

      {/* Severity Distribution */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {(Object.entries(severityCounts) as [Severity, number][]).map(([sev, count]) => (
          <GlassCard key={sev} glow="none" variant="small" className="text-center">
            <div className="text-lg font-bold font-mono" style={{ color: SEVERITY_COLORS[sev] }}>{count}</div>
            <div className="text-xs font-mono uppercase tracking-wider" style={{ color: SEVERITY_COLORS[sev] }}>{sev}</div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          {(["critical", "high", "medium", "low", "info"] as Severity[]).map((s) => (
            <button
              key={s}
              onClick={() => store.setAlertFilter({
                severity: alertFilter.severity.includes(s) ? alertFilter.severity.filter(x => x !== s) : [...alertFilter.severity, s]
              })}
              className={cn(
                "px-2 py-2 rounded text-xs font-mono border transition-all min-h-[44px]",
                alertFilter.severity.includes(s)
                  ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-tertiary)] hover:border-[rgba(255,255,255,0.1)]"
              )}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["open", "investigating", "contained", "resolved"] as const).map((st) => (
            <button
              key={st}
              onClick={() => store.setAlertFilter({
                status: alertFilter.status.includes(st) ? alertFilter.status.filter(x => x !== st) : [...alertFilter.status, st]
              })}
              className={cn(
                "px-2 py-2 rounded text-xs font-mono border transition-all min-h-[44px] capitalize",
                alertFilter.status.includes(st)
                  ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-tertiary)] hover:border-[rgba(255,255,255,0.1)]"
              )}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[120px]">
          <IconSearch size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-foreground-tertiary)]" />
          <input
            value={alertFilter.search}
            onChange={(e) => store.setAlertFilter({ search: e.target.value })}
            placeholder="Search alerts..."
            className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[11px] font-mono text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-tertiary)] outline-none focus:border-[var(--color-accent)]/30"
          />
        </div>
        {(alertFilter.search || alertFilter.severity.length > 0 || alertFilter.status.length > 0) && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => store.setAlertFilter({ severity: [], status: [], search: "" })}
            className="text-xs text-[var(--color-foreground-tertiary)] hover:text-[var(--color-accent)] font-mono"
          >
            Clear
          </motion.button>
        )}
      </div>

      {/* Alert List */}
      <div className="space-y-2 max-h-[50vh] sm:max-h-[480px] overflow-y-auto pr-1">
        {filteredAlerts.map((alert) => {
          const expanded = store.expandedAlerts.includes(alert.id);
          return (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] overflow-hidden"
            >
              <button
                onClick={() => store.toggleAlertExpand(alert.id)}
                className="w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-[rgba(255,255,255,0.02)]"
              >
                <div className="w-1.5 h-full min-h-[40px] rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: SEVERITY_COLORS[alert.severity] }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <SeverityBadge severity={alert.severity} />
                    <SourceBadge source={alert.source} />
                    <StatusBadge status={alert.status} />
                    <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">{alert.timestamp}</span>
                  </div>
                  <div className="text-xs font-medium text-[var(--color-foreground)]">{alert.title}</div>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-2 space-y-2"
                    >
                      <p className="text-xs text-[var(--color-foreground-secondary)] leading-relaxed">{alert.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {alert.mitreTechniques.map((m) => (
                          <span key={m} className="text-xs font-mono px-1.5 py-0.5 rounded bg-purple-400/10 text-purple-400 border border-purple-400/20">{m}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {alert.iocMatches.map((ioc) => (
                          <span key={ioc} className="text-xs font-mono px-1.5 py-0.5 rounded bg-red-400/10 text-red-400 border border-red-400/20">{ioc}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {alert.relatedProjects.map((pr) => (
                          <span key={pr} className="text-xs font-mono px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">{pr}</span>
                        ))}
                      </div>
                      {alert.assignedAnalyst && (
                        <div className="text-xs text-[var(--color-foreground-tertiary)] font-mono">
                          Assigned: {alert.assignedAnalyst} — Sigma: {alert.sigmaRule}
                        </div>
                      )}
                      {alert.evidence.length > 0 && (
                        <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-xs font-mono text-[var(--color-foreground-tertiary)] mb-1">EVIDENCE</div>
                          {alert.evidence.map((ev, i) => (
                            <div key={i} className="text-xs font-mono text-[var(--color-foreground-secondary)]">• {ev}</div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
                <div className="flex-shrink-0 mt-1">
                  {expanded ? <IconMinus size={14} className="text-[var(--color-foreground-tertiary)]" /> : <IconPlus size={14} className="text-[var(--color-foreground-tertiary)]" />}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NOC PANEL ──────────────────────────────────────────────────────────

function NocPanel() {
  const operational = NOC_METRICS.filter(m => m.status === "operational").length;
  const degraded = NOC_METRICS.filter(m => m.status !== "operational").length;

  const statusIcon = (status: ServiceStatus) => {
    switch (status) {
      case "operational": return <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />;
      case "degraded": return <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />;
      case "down": return <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />;
      case "maintenance": return <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />;
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={IconServer}
        label="Network Operations Center"
        badge={`${operational} op · ${degraded} degraded`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {NOC_METRICS.map((metric) => {
          const TrendIcon = metric.trend === "up" ? IconTrendingUp : metric.trend === "down" ? IconTrendingDown : undefined;
          return (
            <GlassCard key={metric.id} glow="none" variant="small">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {statusIcon(metric.status)}
                  <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">{metric.name}</span>
                </div>
                <SourceBadge source={metric.source} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold font-mono text-[var(--color-foreground)]">{metric.value}</span>
                <span className="text-xs text-[var(--color-foreground-tertiary)]">{metric.unit}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                {TrendIcon && <TrendIcon size={10} className={metric.trend === "up" ? "text-green-400" : metric.trend === "down" ? "text-red-400" : "text-gray-400"} />}
                <span className={cn(
                  "text-xs font-mono",
                  metric.percentChange > 0 && metric.trend === "up" ? "text-green-400" :
                  metric.percentChange > 0 ? "text-red-400" : "text-[var(--color-foreground-tertiary)]"
                )}>
                  {metric.percentChange > 0 ? "+" : ""}{metric.percentChange}%
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ─── THREAT INTELLIGENCE PANEL ──────────────────────────────────────────

function ThreatIntelPanel() {
  return (
    <div className="space-y-4">
      <SectionHeader icon={IconRadar} label="Threat Intelligence" badge={`${CVE_SUMMARIES.length} CVEs · ${THREAT_ACTOR_SUMMARIES.length} actors`} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CVEs */}
        <GlassCard glow="none" variant="default">
          <SectionHeader icon={IconAlertTriangle} label="Critical CVEs" />
          <div className="space-y-2 max-h-[40vh] sm:max-h-[320px] overflow-y-auto">
            {CVE_SUMMARIES.map((cve) => (
              <div key={cve.id} className="flex items-start gap-2 p-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                <div className="w-1 h-full min-h-[32px] rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: SEVERITY_COLORS[cve.severity] }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold" style={{ color: SEVERITY_COLORS[cve.severity] }}>{cve.cveId}</span>
                    <span className="text-xs text-[var(--color-foreground-tertiary)]">CVSS {cve.cvss}</span>
                    <SourceBadge source={cve.source} />
                  </div>
                  <div className="text-xs text-[var(--color-foreground)] mt-0.5">{cve.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--color-foreground-tertiary)]">{cve.published}</span>
                    <span className={cn(
                      "text-xs font-mono px-1 rounded",
                      cve.exploitStatus === "confirmed" ? "bg-red-400/10 text-red-400" : "bg-amber-400/10 text-amber-400"
                    )}>
                      {cve.exploitStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Threat Actors */}
        <GlassCard glow="none" variant="default">
          <SectionHeader icon={IconUsers} label="Active Threat Actors" />
          <div className="space-y-2 max-h-[40vh] sm:max-h-[320px] overflow-y-auto">
            {THREAT_ACTOR_SUMMARIES.map((actor) => (
              <div key={actor.id} className="flex items-start gap-2 p-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                <IconBug size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[var(--color-foreground)]">{actor.name}</span>
                    <span className="text-xs font-mono px-1 rounded bg-purple-400/10 text-purple-400">{actor.type}</span>
                    <SourceBadge source={actor.source} />
                  </div>
                  <div className="text-xs text-[var(--color-foreground-secondary)]">{actor.recentActivity}</div>
                  <div className="text-xs text-[var(--color-foreground-tertiary)]">Motivation: {actor.motivation}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── OSINT PANEL ────────────────────────────────────────────────────────

function OsintPanel() {
  const categories = ["advisory", "breach", "research", "update", "industry", "conference"] as const;
  const catColors: Record<string, string> = {
    advisory: "text-red-400 bg-red-400/10 border-red-400/20",
    breach: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    research: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    update: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    industry: "text-green-400 bg-green-400/10 border-green-400/20",
    conference: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  };
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = activeCat === "all" ? OSINT_FEEDS : OSINT_FEEDS.filter(f => f.category === activeCat);

  return (
    <div className="space-y-4">
      <SectionHeader icon={IconGlobe} label="OSINT Dashboard" badge={`${OSINT_FEEDS.length} sources`} />

      <div className="flex flex-wrap gap-1">
        <button onClick={() => setActiveCat("all")} className={cn("px-2 py-2 rounded text-xs font-mono border transition-all min-h-[44px]", activeCat === "all" ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]" : "border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-tertiary)]")}>ALL</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCat(cat)} className={cn("px-2 py-2 rounded text-xs font-mono border transition-all min-h-[44px] capitalize", activeCat === cat ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]" : "border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-tertiary)]")}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-[50vh] sm:max-h-[400px] overflow-y-auto">
        {filtered.map((feed) => (
          <motion.div
            key={feed.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-xs font-mono px-1.5 py-0.5 rounded border", catColors[feed.category])}>{feed.category}</span>
                <span className="text-xs text-[var(--color-foreground-tertiary)]">{feed.date}</span>
                <span className="text-xs text-[var(--color-foreground-tertiary)]">via {feed.source}</span>
              </div>
              <div className="text-xs font-medium text-[var(--color-foreground)]">{feed.headline}</div>
              <p className="text-xs text-[var(--color-foreground-secondary)] mt-0.5">{feed.summary}</p>
              <div className="flex gap-1 mt-1">
                {feed.tags.map((t) => (
                  <span key={t} className="text-xs font-mono text-[var(--color-foreground-tertiary)]">#{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── INFRASTRUCTURE MAP ─────────────────────────────────────────────────

function InfrastructureMap() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const store = useCommandCenterStore();
  const search = store.infraFilter;

  const filtered = search === "all"
    ? INFRASTRUCTURE_NODES
    : INFRASTRUCTURE_NODES.filter(n => n.type === search);

  const typeColors: Record<string, string> = {
    cloud: "#3b82f6", firewall: "#ef4444", router: "#f97316", vm: "#10b981",
    container: "#8b5cf6", project: "#06b6d4", monitoring: "#eab308", storage: "#6366f1", logging: "#ec4899",
  };

  const statusDots: Record<ServiceStatus, string> = {
    operational: "#10b981", degraded: "#f59e0b", down: "#ef4444", maintenance: "#3b82f6",
  };

  const nodeTypes = ["all", "cloud", "firewall", "router", "vm", "container", "project", "monitoring", "storage", "logging"];

  return (
    <div className="space-y-4">
      <SectionHeader icon={IconNetwork} label="Infrastructure Map" badge={`${INFRASTRUCTURE_NODES.length} nodes`} />

      <div className="flex flex-wrap gap-1">
        {nodeTypes.map((t) => (
          <button
            key={t}
            onClick={() => store.setInfraFilter(t)}
            className={cn(
              "px-2 py-2 rounded text-xs font-mono border transition-all min-h-[44px] capitalize",
              search === t
                ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-tertiary)]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Map */}
        <div className="lg:col-span-2 relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,12,0.5)] overflow-hidden max-h-[50vh] h-[300px] sm:h-[400px] lg:h-[520px]">
          <svg viewBox="0 0 100 135" className="w-full h-full">
            {/* Connections */}
            {INFRASTRUCTURE_CONNECTIONS.map((conn) => {
              const from = INFRASTRUCTURE_NODES.find(n => n.id === conn.from);
              const to = INFRASTRUCTURE_NODES.find(n => n.id === conn.to);
              if (!from || !to) return null;
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={0.3}
                  />
                  <text
                    x={(from.x + to.x) / 2} y={(from.y + to.y) / 2}
                    fill="rgba(255,255,255,0.15)"
                    fontSize={1.5}
                    textAnchor="middle"
                    dy={-1}
                  >
                    {conn.label}
                  </text>
                </g>
              );
            })}
            {/* Nodes */}
            {filtered.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <g key={node.id} onClick={() => setSelectedNode(isSelected ? null : node.id)} className="cursor-pointer">
                  <circle
                    cx={node.x} cy={node.y} r={isSelected ? 3.5 : 2.5}
                    fill={typeColors[node.type] || "#6366f1"}
                    opacity={isSelected ? 1 : 0.7}
                    stroke={isSelected ? "rgba(255,255,255,0.5)" : "none"}
                    strokeWidth={0.5}
                  />
                  <circle
                    cx={node.x} cy={node.y} r={isSelected ? 5 : 3.5}
                    fill="none"
                    stroke={statusDots[node.status]}
                    strokeWidth={0.3}
                    opacity={0.5}
                  />
                  <text
                    x={node.x} y={node.y + 3.5}
                    fill="rgba(255,255,255,0.6)"
                    fontSize={1.8}
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
          {selectedNode && (() => {
            const node = INFRASTRUCTURE_NODES.find(n => n.id === selectedNode);
            if (!node) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[rgba(8,9,12,0.95)] border border-[rgba(255,255,255,0.1)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[node.type] }} />
                    <span className="text-xs font-semibold text-[var(--color-foreground)]">{node.name}</span>
                    <span className="text-xs font-mono capitalize text-[var(--color-foreground-tertiary)]">{node.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusDots[node.status] }} />
                    <span className="text-xs font-mono capitalize" style={{ color: statusDots[node.status] }}>{node.status}</span>
                  </div>
                </div>
                <div className="text-xs text-[var(--color-foreground-secondary)]">{node.description}</div>
              </motion.div>
            );
          })()}
        </div>

        {/* Node List */}
        <GlassCard glow="none" variant="default" className="max-h-[40vh] sm:max-h-[520px] overflow-y-auto">
          <div className="text-xs font-mono text-[var(--color-foreground-tertiary)] mb-2 uppercase tracking-wider">Node Inventory</div>
          <div className="space-y-1">
            {filtered.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all text-xs font-mono",
                  selectedNode === node.id
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "text-[var(--color-foreground-secondary)] hover:bg-[rgba(255,255,255,0.03)]"
                )}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusDots[node.status] }} />
                <span>{node.name}</span>
                <span className="ml-auto text-xs capitalize text-[var(--color-foreground-tertiary)]">{node.type}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ─── AI SECURITY ANALYST ────────────────────────────────────────────────

function AiAnalyst() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; isAi: boolean }[]>([
    { text: "I'm your Cyber AI Security Analyst. Ask me about alerts, threats, infrastructure, career, or anything in the portfolio.", isAi: true },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleAsk = useCallback((question: string) => {
    setMessages(prev => [...prev, { text: question, isAi: false }]);
    setIsThinking(true);
    const suggestion = AI_SUGGESTIONS.find(s => s.question === question);
    const answer = suggestion?.answer || "I can help with security alerts, threat intelligence, infrastructure status, career progress, and learning recommendations. Try one of the suggested questions below.";
    setTimeout(() => {
      setMessages(prev => [...prev, { text: answer, isAi: true }]);
      setIsThinking(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="space-y-4">
      <SectionHeader icon={IconBrain} label="AI Security Analyst" badge="Online" />

      <div className="flex flex-wrap gap-1 mb-2">
        {AI_SUGGESTIONS.map((s) => (
          <button
            key={s.question}
            onClick={() => handleAsk(s.question)}
            className="px-2 py-2 rounded-lg text-xs font-mono bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-secondary)] hover:bg-[rgba(139,92,246,0.1)] hover:text-purple-400 hover:border-purple-400/20 transition-all min-h-[44px]"
          >
            {s.question}
          </button>
        ))}
      </div>

      <div ref={chatRef} className="h-[40vh] sm:h-[320px] overflow-y-auto space-y-3 pr-1">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-2", msg.isAi ? "" : "flex-row-reverse")}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
              msg.isAi ? "bg-purple-500/20" : "bg-cyan-500/20"
            )}>
              {msg.isAi ? <IconBrain size={12} className="text-purple-400" /> : <IconUserShield size={12} className="text-cyan-400" />}
            </div>
            <div className={cn(
              "max-w-[90%] sm:max-w-[80%] p-2.5 rounded-xl text-xs leading-relaxed",
              msg.isAi
                ? "bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.12)] text-[var(--color-foreground)]"
                : "bg-[rgba(0,180,216,0.06)] border border-[rgba(0,180,216,0.12)] text-[var(--color-foreground)]"
            )}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-foreground-tertiary)]">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Analyzing...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              handleAsk(input.trim());
              setInput("");
            }
          }}
          placeholder="Ask the AI Analyst..."
          className="flex-1 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[11px] font-mono text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-tertiary)] outline-none focus:border-purple-400/30"
        />
        <Button variant="glass" size="sm" onClick={() => { if (input.trim()) { handleAsk(input.trim()); setInput(""); } }}>
          Ask
        </Button>
      </div>
    </div>
  );
}

// ─── INCIDENTS QUEUE ────────────────────────────────────────────────────

function IncidentsQueue() {
  const store = useCommandCenterStore();
  const { incidentFilter } = store;

  const filtered = incidentFilter
    ? INCIDENTS.filter(i => i.title.toLowerCase().includes(incidentFilter.toLowerCase()) || i.id.toLowerCase().includes(incidentFilter.toLowerCase()))
    : INCIDENTS;

  const openCount = INCIDENTS.filter(i => i.status !== "closed").length;

  return (
    <div className="space-y-4">
      <SectionHeader icon={IconAlertTriangle} label="Incident Queue" badge={`${openCount} active`} />

      <input
        value={incidentFilter}
        onChange={(e) => store.setIncidentFilter(e.target.value)}
        placeholder="Search incidents..."
        className="w-full px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[11px] font-mono text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-tertiary)] outline-none focus:border-[var(--color-accent)]/30"
      />

      <div className="space-y-2 max-h-[50vh] sm:max-h-[500px] overflow-y-auto">
        {filtered.map((incident) => {
          const expanded = store.expandedIncidents.includes(incident.id);
          return (
            <motion.div
              key={incident.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] overflow-hidden"
            >
              <button
                onClick={() => store.toggleIncidentExpand(incident.id)}
                className="w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-[rgba(255,255,255,0.02)]"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[incident.status] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <StatusBadge status={incident.status} />
                    <SeverityBadge severity={incident.severity} />
                    <SourceBadge source={incident.source} />
                    <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">{incident.openedAt}</span>
                  </div>
                  <div className="text-xs font-medium text-[var(--color-foreground)]">{incident.title}</div>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-2 space-y-2"
                    >
                      <p className="text-xs text-[var(--color-foreground-secondary)]">{incident.description}</p>
                      <div className="flex gap-1 text-xs font-mono text-[var(--color-foreground-tertiary)]">
                        <span>Team: {incident.assignedTeam}</span>
                        <span>·</span>
                        <span>{incident.category}</span>
                        <span>·</span>
                        <span>{incident.affectedAssets.length} assets</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {incident.mitreMapping.map((m) => (
                          <span key={m} className="text-xs font-mono px-1 py-0.5 rounded bg-purple-400/10 text-purple-400 border border-purple-400/20">{m}</span>
                        ))}
                      </div>
                      {/* Timeline */}
                      <div className="space-y-1">
                        <div className="text-xs font-mono text-[var(--color-foreground-tertiary)]">TIMELINE</div>
                        {incident.timeline.map((entry, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="flex flex-col items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                              {i < incident.timeline.length - 1 && <div className="w-px h-3 bg-[rgba(255,255,255,0.06)]" />}
                            </div>
                            <div className="flex-1">
                              <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">{entry.time}</span>
                              <span className="text-xs text-[var(--color-foreground-secondary)] ml-1">{entry.event}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {incident.evidence.length > 0 && (
                        <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-xs font-mono text-[var(--color-foreground-tertiary)] mb-1">EVIDENCE</div>
                          {incident.evidence.map((ev, i) => (
                            <div key={i} className="text-xs text-[var(--color-foreground-secondary)]">• {ev}</div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
                <div className="flex-shrink-0 mt-1">
                  {expanded ? <IconMinus size={14} className="text-[var(--color-foreground-tertiary)]" /> : <IconPlus size={14} className="text-[var(--color-foreground-tertiary)]" />}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MISSION TIMELINE ───────────────────────────────────────────────────

function MissionTimeline() {
  const store = useCommandCenterStore();
  const categories = ["all", "project", "certification", "ctf", "research", "architecture", "milestone", "learning"];

  const filtered = store.timelineFilter === "all"
    ? TIMELINE_EVENTS
    : TIMELINE_EVENTS.filter(e => e.category === store.timelineFilter);

  const catIcons: Record<string, any> = {
    project: IconCode, certification: IconCertificate, ctf: IconFlag,
    research: IconBook, architecture: IconShield, milestone: IconStar, learning: IconBrain,
  };

  return (
    <div className="space-y-4">
      <SectionHeader icon={IconHistory} label="Mission Timeline" badge={`${TIMELINE_EVENTS.length} events`} />

      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => store.setTimelineFilter(cat)}
            className={cn(
              "px-2 py-2 rounded text-xs font-mono border transition-all min-h-[44px] capitalize",
              store.timelineFilter === cat
                ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-tertiary)]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative max-h-[50vh] sm:max-h-[500px] overflow-y-auto">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[rgba(255,255,255,0.06)]" />
        <div className="space-y-3">
          {filtered.map((event) => {
            const Icon = catIcons[event.category] || IconStar;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 pl-0"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center z-10">
                  <Icon size={10} className="text-[var(--color-accent)]" />
                </div>
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[var(--color-foreground)]">{event.title}</span>
                    <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">{event.date}</span>
                    <SourceBadge source={event.source} />
                  </div>
                  <div className="text-xs text-[var(--color-foreground-secondary)] mt-0.5">{event.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── COMMAND WALL ───────────────────────────────────────────────────────

function CommandWall() {
  const [activeViz, setActiveViz] = useState<"knowledge" | "infrastructure" | "career" | "threat">("knowledge");

  const vizData = {
    knowledge: { nodes: 79, edges: 128, types: 13, color: "#8b5cf6", label: "Knowledge Graph" },
    infrastructure: { nodes: INFRASTRUCTURE_NODES.length, edges: INFRASTRUCTURE_CONNECTIONS.length, types: 9, color: "#06b6d4", label: "Infrastructure" },
    career: { projects: GLOBAL_STATS.totalProjects, certs: GLOBAL_STATS.totalCertifications, skills: GLOBAL_STATS.totalSkills, color: "#10b981", label: "Career" },
    threat: { cvEs: CVE_SUMMARIES.length, actors: THREAT_ACTOR_SUMMARIES.length, alerts: SOC_ALERTS.length, color: "#ef4444", label: "Threat Landscape" },
  };

  return (
    <div className="space-y-4">
      <SectionHeader icon={IconGauge} label="Command Wall" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {(Object.entries(vizData) as [string, any][]).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setActiveViz(key as any)}
            className={cn(
              "p-3 rounded-xl border text-center transition-all",
              activeViz === key
                ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10"
                : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]"
            )}
          >
            <div className="text-lg font-bold font-mono" style={{ color: data.color }}>{Object.values(data).filter(v => typeof v === "number")[0]}</div>
            <div className="text-xs font-mono text-[var(--color-foreground-tertiary)]">{data.label}</div>
          </button>
        ))}
      </div>

      {/* Knowledge Graph Visualization */}
      {activeViz === "knowledge" && (
        <div className="relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,12,0.5)] overflow-hidden max-h-[40vh] h-[200px] sm:h-[320px]">
          <svg viewBox="0 0 100 80" className="w-full h-full">
            {/* Generate force-directed-like layout */}
            {[
              { id: "projects", x: 20, y: 20, r: 3, color: "#06b6d4" },
              { id: "skills", x: 40, y: 15, r: 2.5, color: "#8b5cf6" },
              { id: "certs", x: 60, y: 18, r: 2, color: "#f59e0b" },
              { id: "tools", x: 80, y: 22, r: 2.5, color: "#10b981" },
              { id: "CTFs", x: 25, y: 40, r: 2, color: "#ef4444" },
              { id: "lab", x: 45, y: 45, r: 2.5, color: "#3b82f6" },
              { id: "blog", x: 65, y: 42, r: 1.8, color: "#ec4899" },
              { id: "research", x: 35, y: 60, r: 2, color: "#f97316" },
              { id: "goals", x: 55, y: 62, r: 1.8, color: "#6366f1" },
              { id: "learning", x: 75, y: 58, r: 2, color: "#14b8a6" },
            ].map((node, i) => (
              <g key={node.id}>
                {/* Edges to center */}
                <line x1={node.x} y1={node.y} x2={45} y2={35} stroke="rgba(255,255,255,0.06)" strokeWidth={0.3} />
                <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} opacity={0.8} />
                <text x={node.x} y={node.y + node.r + 2.5} fill="rgba(255,255,255,0.4)" fontSize={1.5} textAnchor="middle">{node.id}</text>
              </g>
            ))}
            {/* Center node */}
            <circle cx={45} cy={35} r={5} fill="var(--color-accent)" opacity={0.6} />
            <text x={45} y={36} fill="rgba(255,255,255,0.7)" fontSize={2} textAnchor="middle" fontWeight="bold">CYBER NEXUS</text>
          </svg>
        </div>
      )}

      {/* Infrastructure Visualization */}
      {activeViz === "infrastructure" && (
        <div className="relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,12,0.5)] overflow-hidden max-h-[40vh] h-[200px] sm:h-[320px]">
          <svg viewBox="0 0 100 80" className="w-full h-full">
            {INFRASTRUCTURE_NODES.slice(0, 15).map((node, i) => {
              const angle = (i / 15) * Math.PI * 2;
              const x = 50 + Math.cos(angle) * 35;
              const y = 40 + Math.sin(angle) * 28;
              return (
                <g key={node.id}>
                  <line x1={50} y1={40} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={0.3} />
                  <circle cx={x} cy={y} r={2} fill="#06b6d4" opacity={0.7} />
                  <text x={x} y={y + 3} fill="rgba(255,255,255,0.3)" fontSize={1.2} textAnchor="middle">{node.name}</text>
                </g>
              );
            })}
            <circle cx={50} cy={40} r={4} fill="#06b6d4" opacity={0.5} />
            <text x={50} y={41} fill="rgba(255,255,255,0.6)" fontSize={1.8} textAnchor="middle">INFRASTRUCTURE</text>
          </svg>
        </div>
      )}

      {/* Career Visualization */}
      {activeViz === "career" && (
        <div className="relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,12,0.5)] overflow-hidden max-h-[40vh] h-[200px] sm:h-[320px]">
          <svg viewBox="0 0 100 80" className="w-full h-full">
            {/* Bar chart */}
            {[
              { label: "Projects", value: GLOBAL_STATS.totalProjects, color: "#06b6d4" },
              { label: "Certs", value: GLOBAL_STATS.totalCertifications, color: "#f59e0b" },
              { label: "Skills", value: GLOBAL_STATS.totalSkills, color: "#8b5cf6" },
              { label: "CTF", value: GLOBAL_STATS.totalCTFChallenges, color: "#10b981" },
              { label: "Articles", value: GLOBAL_STATS.totalWikiArticles, color: "#3b82f6" },
              { label: "Achievements", value: GLOBAL_STATS.totalAchievements, color: "#f59e0b" },
            ].map((item, i) => {
              const x = 10 + i * 14;
              const maxVal = Math.max(GLOBAL_STATS.totalWikiArticles, GLOBAL_STATS.totalAchievements, GLOBAL_STATS.totalCTFChallenges);
              const barH = (item.value / maxVal) * 50;
              return (
                <g key={item.label}>
                  <rect x={x} y={65 - barH} width={8} height={barH} rx={1} fill={item.color} opacity={0.8} />
                  <text x={x + 4} y={68} fill="rgba(255,255,255,0.4)" fontSize={2.5} textAnchor="middle">{item.label.slice(0, 4)}</text>
                  <text x={x + 4} y={63 - barH} fill="rgba(255,255,255,0.6)" fontSize={3} textAnchor="middle" fontWeight="bold">{item.value}</text>
                </g>
              );
            })}
            <text x={50} y={10} fill="rgba(255,255,255,0.4)" fontSize={3} textAnchor="middle">CAREER GROWTH</text>
          </svg>
        </div>
      )}

      {/* Threat Visualization */}
      {activeViz === "threat" && (
        <div className="relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,12,0.5)] overflow-hidden max-h-[40vh] h-[200px] sm:h-[320px]">
          <svg viewBox="0 0 100 80" className="w-full h-full">
            {/* Radial threat chart */}
            {[
              { label: "Critical", value: CVE_SUMMARIES.filter(c => c.severity === "critical").length, color: "#ef4444" },
              { label: "High", value: CVE_SUMMARIES.filter(c => c.severity === "high").length, color: "#f97316" },
              { label: "Medium", value: CVE_SUMMARIES.filter(c => c.severity === "medium").length, color: "#eab308" },
              { label: "APT", value: THREAT_ACTOR_SUMMARIES.filter(a => a.type === "APT").length, color: "#8b5cf6" },
              { label: "Malware", value: 6, color: "#ec4899" },
              { label: "Campaigns", value: 3, color: "#3b82f6" },
            ].map((item, i) => {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const radius = 15 + (item.value / 5) * 15;
              const x = 50 + Math.cos(angle) * radius;
              const y = 40 + Math.sin(angle) * radius;
              return (
                <g key={item.label}>
                  <line x1={50} y1={40} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={0.3} />
                  <circle cx={x} cy={y} r={2 + item.value * 0.3} fill={item.color} opacity={0.6} />
                  <text x={x} y={y + 4} fill="rgba(255,255,255,0.4)" fontSize={2} textAnchor="middle">{item.label}: {item.value}</text>
                </g>
              );
            })}
            <circle cx={50} cy={40} r={4} fill="none" stroke="#ef4444" strokeWidth={0.5} opacity={0.4} />
            <text x={50} y={41} fill="rgba(255,255,255,0.5)" fontSize={2.5} textAnchor="middle">THREAT INTEL</text>
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── LIVE TERMINAL ──────────────────────────────────────────────────────

function LiveTerminal() {
  const store = useCommandCenterStore();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [store.terminalLines]);

  const handleCommand = useCallback((cmd: string) => {
    if (!cmd.trim()) return;
    store.addTerminalLine({ text: `$ ${cmd}`, className: "text-green-400" });
    const response = getTerminalResponse(cmd.trim());
    if (cmd.trim().toLowerCase() === "clear") {
      store.clearTerminal();
    } else {
      response.forEach(line => store.addTerminalLine(line));
    }
    setHistory(prev => [cmd, ...prev].slice(0, 50));
    setHistIdx(-1);
  }, [store]);

  return (
    <div className="fixed inset-0 z-50 flex items-end pointer-events-none">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="relative w-full h-[50vh] bg-[rgba(8,9,12,0.97)] border-t border-[rgba(255,255,255,0.08)] backdrop-blur-2xl pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <IconTerminal2 size={14} className="text-green-400" />
            <span className="text-xs font-mono text-[var(--color-foreground)]">Command Center Terminal</span>
            <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">v1.0</span>
          </div>
          <button onClick={() => store.setTerminalOpen(false)} className="p-2 rounded text-[var(--color-foreground-tertiary)] hover:text-[var(--color-foreground)]">
            <IconX size={14} />
          </button>
        </div>

        {/* Output */}
        <div ref={termRef} className="h-[calc(100%-80px)] overflow-y-auto p-3 font-mono text-xs space-y-0.5">
          {store.terminalLines.map((line, i) => (
            <div key={i} className={line.className || "text-gray-400"}>{line.text || "\u00A0"}</div>
          ))}
        </div>

        {/* Input */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-2 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,12,0.95)]">
          <span className="text-green-400 font-mono text-xs">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { handleCommand(input); setInput(""); }
              if (e.key === "ArrowUp") { e.preventDefault(); if (history.length > 0) { const idx = Math.min(histIdx + 1, history.length - 1); setHistIdx(idx); setInput(history[idx]); } }
              if (e.key === "ArrowDown") { e.preventDefault(); if (histIdx > 0) { const idx = histIdx - 1; setHistIdx(idx); setInput(history[idx]); } else { setHistIdx(-1); setInput(""); } }
            }}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-green-400 placeholder:text-[var(--color-foreground-tertiary)]"
            placeholder="Type 'help' for commands..."
          />
        </div>
      </motion.div>
    </div>
  );
}

// ─── COMMAND PALETTE ────────────────────────────────────────────────────

function CommandPalette() {
  const store = useCommandCenterStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filtered = useMemo(() => {
    if (!query.trim()) return PALETTE_COMMANDS;
    const q = query.toLowerCase();
    return PALETTE_COMMANDS.filter(c => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.shortcut?.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (store.paletteOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setSelectedIdx(0);
    }
  }, [store.paletteOpen]);

  const executeCommand = useCallback((cmd: typeof PALETTE_COMMANDS[0]) => {
    store.setPaletteOpen(false);
    if (cmd.href) { window.location.href = cmd.href; return; }
    if (cmd.action === "theme") { document.dispatchEvent(new CustomEvent("toggle-theme")); return; }
    if (cmd.action === "focus") { document.dispatchEvent(new CustomEvent("toggle-focus")); return; }
    if (cmd.action === "ai") { document.dispatchEvent(new CustomEvent("open-ai")); return; }
    if (cmd.action === "recruiter") { document.dispatchEvent(new CustomEvent("toggle-recruiter")); return; }
    if (cmd.action === "infra-map") { store.setActivePanel("infra"); return; }
    if (cmd.action === "alerts") { store.setActivePanel("soc"); return; }
    if (cmd.action === "noc") { store.setActivePanel("noc"); return; }
    if (cmd.action === "threat-intel") { store.setActivePanel("threat"); return; }
  }, [store]);

  return (
    <AnimatePresence>
      {store.paletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-[rgba(8,9,12,0.8)] backdrop-blur-sm"
          onClick={() => store.setPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(16,17,20,0.98)] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
              <IconSearch size={14} className="text-[var(--color-foreground-tertiary)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") store.setPaletteOpen(false);
                  if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
                  if (e.key === "Enter" && filtered[selectedIdx]) executeCommand(filtered[selectedIdx]);
                }}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-tertiary)]"
              />
              <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">ESC</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="text-center py-6 text-xs text-[var(--color-foreground-tertiary)]">No results found</div>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all",
                      i === selectedIdx ? "bg-[rgba(0,180,216,0.08)] text-[var(--color-accent)]" : "text-[var(--color-foreground-secondary)] hover:bg-[rgba(255,255,255,0.03)]"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center",
                      i === selectedIdx ? "bg-[var(--color-accent)]/20" : "bg-[rgba(255,255,255,0.04)]"
                    )}>
                      <IconArrowRight size={10} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium">{cmd.label}</div>
                      <div className="text-xs text-[var(--color-foreground-tertiary)]">{cmd.category}</div>
                    </div>
                    {cmd.shortcut && (
                      <kbd className="text-xs font-mono px-1 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[var(--color-foreground-tertiary)]">{cmd.shortcut}</kbd>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── EXECUTIVE DASHBOARD ────────────────────────────────────────────────

function ExecutiveDashboard() {
  const ui = useUIStore();

  return (
    <div className="space-y-4" data-recruiter-section>
      <SectionHeader icon={IconUserShield} label="Executive Dashboard" badge="Recruiter Mode" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Professional Summary */}
        <GlassCard glow="cyan" variant="feature" className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              CN
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">Cyber Nexus Professional</h3>
              <p className="text-xs text-[var(--color-foreground-secondary)] mt-1">
                Security Engineer & SOC Analyst with expertise in SIEM, threat hunting, incident response,
                penetration testing, and security architecture. Building enterprise-grade security operations platforms.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["SIEM", "Threat Hunting", "Incident Response", "Penetration Testing", "Cloud Security", "Security Architecture"].map((s) => (
                  <span key={s} className="text-xs font-mono px-2 py-1 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard glow="none" variant="default">
          <div className="text-xs font-semibold text-[var(--color-foreground)] mb-2">Quick Actions</div>
          <div className="space-y-2">
            <Button variant="glass" size="sm" leftIcon={<IconFileText size={12} />} className="w-full justify-start text-xs" onClick={() => window.location.href = "/resume"}>
              View Resume
            </Button>
            <Button variant="glass" size="sm" leftIcon={<IconCode size={12} />} className="w-full justify-start text-xs" onClick={() => window.location.href = "/projects"}>
              Top Projects
            </Button>
            <Button variant="glass" size="sm" leftIcon={<IconBrandGithub size={12} />} className="w-full justify-start text-xs" onClick={() => window.location.href = "/github-intelligence"}>
              GitHub Profile
            </Button>
            <Button variant="glass" size="sm" leftIcon={<IconMail size={12} />} className="w-full justify-start text-xs" onClick={() => window.location.href = "/contact"}>
              Contact Me
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "Years Experience", value: "5+", color: "text-cyan-400" },
          { label: "Certifications", value: String(GLOBAL_STATS.totalCertifications), color: "text-amber-400" },
          { label: "Projects Delivered", value: String(GLOBAL_STATS.totalProjects), color: "text-purple-400" },
          { label: "CTF Challenges", value: String(GLOBAL_STATS.totalCTFChallenges), color: "text-green-400" },
        ].map((stat) => (
          <GlassCard key={stat.label} glow="none" variant="small" className="text-center">
            <div className={cn("text-lg font-bold font-mono", stat.color)}>{stat.value}</div>
            <div className="text-xs text-[var(--color-foreground-tertiary)] font-mono">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Career Goals */}
      <GlassCard glow="none" variant="default">
        <SectionHeader icon={IconStar} label="Career Goals" />
        <div className="space-y-2">
          {[
            "Lead SOC engineering for a global enterprise",
            "Obtain OSCP / CISSP / AWS Security Specialty",
            "Build open-source SIEM correlation engine",
            "Speak at Black Hat / DEF CON / BSides",
            "Contribute to MITRE ATT&CK framework",
          ].map((goal, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[var(--color-foreground-secondary)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
              {goal}
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="text-xs font-mono text-[var(--color-foreground-tertiary)] text-center border-t border-[rgba(255,255,255,0.06)] pt-3 mt-2">
        Executive Dashboard — Data sourced from portfolio projects, certifications, and skills. Updated in real-time.
      </div>
    </div>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────

function CommandFooter() {
  return (
    <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--color-foreground-tertiary)]">
        <div className="flex items-center gap-3">
          <span>Cyber Nexus Command Center v{GLOBAL_STATS.version}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-foreground-tertiary)]" />
          <span>Data sources: {SOC_ALERTS.filter(a => a.source === "live").length} live / {SOC_ALERTS.filter(a => a.source === "demo").length} demo / {SOC_ALERTS.filter(a => a.source === "historical").length} historical / {SOC_ALERTS.filter(a => a.source === "simulated").length} simulated</span>
        </div>
        <div className="flex items-center gap-3">
          <span>All demo incidents are educational scenarios</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-foreground-tertiary)]" />
          <span>Threat Level: {INCIDENTS.filter(i => i.status !== "closed").length > 3 ? "ELEVATED" : "NORMAL"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────

export default function CommandCenterPage() {
  const store = useCommandCenterStore();
  const [activePanel, setActivePanel] = useState<ActivePanel>("soc");

  const renderPanel = () => {
    switch (activePanel) {
      case "soc": return <SocPanel />;
      case "noc": return <NocPanel />;
      case "threat": return <ThreatIntelPanel />;
      case "osint": return <OsintPanel />;
      case "infra": return <InfrastructureMap />;
      case "analyst": return <AiAnalyst />;
      case "incidents": return <IncidentsQueue />;
      case "timeline": return <MissionTimeline />;
      case "wall": return <CommandWall />;
      case "executive": return <ExecutiveDashboard />;
      default: return <SocPanel />;
    }
  };

  useKeyboardShortcuts([
    { key: "k", meta: true, handler: () => store.setPaletteOpen(true), description: "Open command palette" },
    { key: "t", meta: true, handler: () => store.setTerminalOpen(true), description: "Open terminal" },
    { key: "1", meta: true, handler: () => setActivePanel("soc"), description: "Open SOC panel" },
    { key: "2", meta: true, handler: () => setActivePanel("noc"), description: "Open NOC panel" },
    { key: "3", meta: true, handler: () => setActivePanel("threat"), description: "Open Threat Intel panel" },
    { key: "4", meta: true, handler: () => setActivePanel("osint"), description: "Open OSINT panel" },
    { key: "5", meta: true, handler: () => setActivePanel("infra"), description: "Open Infrastructure panel" },
    { key: "6", meta: true, handler: () => setActivePanel("analyst"), description: "Open AI Analyst panel" },
    { key: "7", meta: true, handler: () => setActivePanel("incidents"), description: "Open Incidents panel" },
    { key: "8", meta: true, handler: () => setActivePanel("timeline"), description: "Open Mission Timeline panel" },
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Global Status Bar */}
      <GlobalStatusBar />

      <div className="max-w-[1600px] mx-auto px-4 pt-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center">
              <IconShieldExclamation size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-foreground)]">Global Command Center</h1>
              <p className="text-xs font-mono text-[var(--color-foreground-tertiary)]">
                SOC · NOC · Threat Intelligence · OSINT · Infrastructure Monitoring · AI Analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/30">LIVE</span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">DEMO</span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-blue-400/10 text-blue-400 border border-blue-400/30">HIST</span>
            <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">— Data source indicators</span>
          </div>
        </motion.div>

        {/* Global Metrics */}
        <GlobalMetrics />

        {/* Panel Navigation */}
        <PanelNav active={activePanel} onSelect={setActivePanel} />

        {/* Active Panel */}
        <motion.div
          key={activePanel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderPanel()}
        </motion.div>

        {/* Footer */}
        <CommandFooter />
      </div>

      {/* Command Palette */}
      <CommandPalette />

      {/* Live Terminal */}
      <AnimatePresence>
        {store.terminalOpen && <LiveTerminal />}
      </AnimatePresence>
    </div>
  );
}
