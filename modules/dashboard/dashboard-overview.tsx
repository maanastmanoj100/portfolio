"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/stores/dashboard-store";
import { severityColors, severityBg, healthConfig } from "./dashboard-data";
import type { SOCAlert, SOCIncident, EndpointInfo } from "@/types";
import { ENDPOINTS } from "./dashboard-data";
import { IconAlertTriangle, IconShieldExclamation, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";

const iconMap = {
  critical: IconShieldExclamation,
  high: IconAlertTriangle,
  medium: IconAlertCircle,
  low: IconInfoCircle,
  info: IconInfoCircle,
};

function AnimatedCounter({ value, label, sub, color, change }: { value: string; label: string; sub?: string; color?: string; change?: number }) {
  return (
    <div className="glass-card p-4 hover:border-accent-border/30 transition-all">
      <div className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-0.5">{label}</div>
      <div className="text-2xl font-semibold text-foreground" style={color ? { color } : undefined}>{value}</div>
      {sub && <div className="text-xs text-foreground-tertiary mt-0.5">{sub}</div>}
      {change !== undefined && (
        <div className={`text-xs mt-0.5 font-mono ${change >= 0 ? "text-red-400" : "text-emerald-400"}`}>
          {change > 0 ? "↑" : "↓"} {Math.abs(change)}% vs yesterday
        </div>
      )}
    </div>
  );
}

function AlertRow({ alert }: { alert: SOCAlert }) {
  const Icon = iconMap[alert.severity];
  const color = severityColors[alert.severity];
  const statusColors: Record<string, string> = { new: "text-blue-400", investigating: "text-yellow-400", contained: "text-emerald-400", resolved: "text-gray-500" };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors border-b border-border/30 group">
      <div className="flex items-center gap-1.5 w-[72px] shrink-0">
        <Icon size={11} style={{ color }} />
        <span className="text-xs uppercase font-mono tracking-wider" style={{ color }}>{alert.severity}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground truncate">{alert.title}</div>
        <div className="flex items-center gap-3 text-xs text-foreground-tertiary mt-0.5">
          <span>{alert.mitreId}</span>
          <span>{alert.sourceIp} → {alert.destIp}</span>
          <span className={statusColors[alert.status]}>{alert.status}</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3 text-xs text-foreground-tertiary shrink-0">
        <span className="font-mono">{alert.analyst}</span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${alert.confidence > 90 ? "text-emerald-400 bg-emerald-500/10" : "text-yellow-400 bg-yellow-500/10"}`}>
          {alert.confidence}%
        </span>
        <span className="text-xs">{alert.timestamp}</span>
      </div>
    </div>
  );
}

function IncidentCard({ incident, onSelect }: { incident: SOCIncident; onSelect: (i: SOCIncident) => void }) {
  const color = severityColors[incident.severity];
  return (
    <motion.button
      onClick={() => onSelect(incident)}
      className="glass-card p-4 text-left w-full hover:border-accent-border/30 transition-all cursor-pointer"
      whileHover={{ y: -1 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs uppercase font-mono px-1.5 py-0.5 rounded ${severityBg[incident.severity]}`} style={{ color }}>{incident.severity}</span>
        <span className="text-xs font-mono text-foreground-tertiary">{incident.id}</span>
        <span className="ml-auto text-xs font-mono text-foreground-tertiary">{incident.status}</span>
      </div>
      <h4 className="text-sm font-medium text-foreground mb-1">{incident.title}</h4>
      <p className="text-[11px] text-foreground-secondary line-clamp-2 mb-2">{incident.description}</p>
      <div className="flex items-center gap-2 text-xs text-foreground-tertiary">
        <span>{incident.mitreTactic}</span>
        <span>·</span>
        <span>{incident.assignedAnalyst}</span>
        <span>·</span>
        <span>{incident.affectedAssets.length} assets</span>
      </div>
    </motion.button>
  );
}

function EndpointRow({ ep }: { ep: EndpointInfo }) {
  const hc = healthConfig[ep.health];
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.02] border-b border-border/20 text-sm">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${hc.dot}`} />
      <span className="w-28 font-mono text-xs text-foreground truncate">{ep.hostname}</span>
      <span className="w-36 text-xs text-foreground-secondary truncate">{ep.os}</span>
      <span className={`text-xs ${hc.color}`}>{ep.health}</span>
      <span className="ml-auto text-xs text-foreground-tertiary">{ep.lastSeen}</span>
    </div>
  );
}

export function OverviewMetrics() {
  const metrics = useDashboardStore((s) => s.metrics);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {metrics.map((m, i) => (
        <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
          <AnimatedCounter
            label={m.label}
            value={m.value}
            sub={m.details}
            change={m.status === "stable" ? undefined : m.change}
            color={m.label.includes("Critical") ? severityColors.critical : m.label.includes("High") ? severityColors.high : undefined}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function LiveAlertFeed() {
  const alerts = useDashboardStore((s) => s.alerts);
  const severityFilter = useDashboardStore((s) => s.severityFilter);
  const filtered = severityFilter ? alerts.filter((a) => a.severity === severityFilter) : alerts;

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <IconAlertTriangle size={14} className="text-red-400" />
          <span className="text-sm font-medium text-foreground">Live Alert Feed</span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">LIVE</span>
        </div>
        <span className="text-xs text-foreground-tertiary font-mono">{filtered.length} alerts</span>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        <AnimatePresence>
          {filtered.map((alert) => (
            <motion.div key={alert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <AlertRow alert={alert} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function IncidentsPanel() {
  const incidents = useDashboardStore((s) => s.incidents);
  const setSelected = useDashboardStore((s) => s.setSelectedIncident);
  const selected = useDashboardStore((s) => s.selectedIncident);

  if (selected) {
    const color = severityColors[selected.severity];
    return (
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="text-xs text-cyan hover:text-cyan/80 transition-colors">← Back</button>
            <span className={`text-xs uppercase font-mono px-1.5 py-0.5 rounded ${severityBg[selected.severity]}`} style={{ color }}>{selected.severity}</span>
            <span className="text-xs font-mono text-foreground-tertiary">{selected.id}</span>
          </div>
          <span className="text-xs font-mono text-foreground-tertiary">{selected.status}</span>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">{selected.title}</h3>
        <p className="text-sm text-foreground-secondary mb-4">{selected.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div><span className="text-xs text-foreground-tertiary uppercase font-mono">MITRE</span><div className="text-xs text-foreground mt-0.5">{selected.mitreTechnique} ({selected.mitreTactic})</div></div>
          <div><span className="text-xs text-foreground-tertiary uppercase font-mono">Rule</span><div className="text-xs text-foreground mt-0.5">{selected.detectionRule}</div></div>
          <div><span className="text-xs text-foreground-tertiary uppercase font-mono">Analyst</span><div className="text-xs text-foreground mt-0.5">{selected.assignedAnalyst}</div></div>
          <div><span className="text-xs text-foreground-tertiary uppercase font-mono">Assets</span><div className="text-xs text-foreground mt-0.5">{selected.affectedAssets.length}</div></div>
        </div>
        <div className="mb-4">
          <span className="text-xs text-foreground-tertiary uppercase font-mono mb-2 block">Timeline</span>
          <div className="space-y-1.5">
            {selected.timeline.map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="text-xs font-mono text-cyan w-12 shrink-0">{t.time}</span>
                <div className="w-px h-4 bg-border shrink-0" />
                <span className="text-foreground-secondary">{t.event}</span>
              </div>
            ))}
          </div>
        </div>
        {selected.evidence.length > 0 && (
          <div className="mb-4">
            <span className="text-xs text-foreground-tertiary uppercase font-mono mb-2 block">Evidence</span>
            <div className="flex flex-wrap gap-1.5">
              {selected.evidence.map((e, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-white/5 border border-border rounded text-foreground-secondary">{e}</span>
              ))}
            </div>
          </div>
        )}
        <div>
          <span className="text-xs text-foreground-tertiary uppercase font-mono mb-2 block">Recommended Actions</span>
          <div className="space-y-1">
            {selected.recommendedActions.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-foreground-secondary">
                <span className="text-cyan mt-0.5">→</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {incidents.map((inc) => (
        <IncidentCard key={inc.id} incident={inc} onSelect={setSelected} />
      ))}
    </div>
  );
}

export function EndpointsPanel() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border/40">
        <span className="text-sm font-medium text-foreground">Endpoint Status</span>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {ENDPOINTS.map((ep: EndpointInfo) => (
          <EndpointRow key={ep.hostname} ep={ep} />
        ))}
      </div>
    </div>
  );
}
