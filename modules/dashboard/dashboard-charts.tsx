"use client";

import { motion } from "framer-motion";
import { useDashboardStore } from "@/stores/dashboard-store";
import { ALERT_TREND_DATA, ATTACK_CATEGORIES, DETECTION_SOURCES, TOP_COUNTRIES, ANALYST_ACTIVITY, NETWORK_FLOWS, TIMELINE_EVENTS, MITRE_TECHNIQUES, THREAT_INTEL, severityColors } from "./dashboard-data";

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.max(3, (value / max) * 100);
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="w-full h-16 sm:h-20 rounded-sm relative overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 rounded-sm"
          style={{ background: `linear-gradient(to top, ${color}, ${color}40)` }}
        />
      </div>
    </div>
  );
}

export function AlertTrendChart() {
  const maxVal = Math.max(...ALERT_TREND_DATA.flatMap((d) => [d.critical, d.high, d.medium, d.low]));
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase">Alert Trend — 7 Days</span>
      </div>
      <div className="flex items-end gap-1 sm:gap-2 h-24 sm:h-28">
        {ALERT_TREND_DATA.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="flex gap-px w-full h-full items-end">
              <MiniBar value={d.critical} max={maxVal} color={severityColors.critical} />
              <MiniBar value={d.high} max={maxVal} color={severityColors.high} />
              <MiniBar value={d.medium} max={maxVal} color={severityColors.medium} />
              <MiniBar value={d.low} max={maxVal} color={severityColors.low} />
            </div>
            <span className="text-xs text-foreground-tertiary font-mono mt-1">{d.day.slice(0, 3)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-foreground-tertiary">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: severityColors.critical }} /> Critical</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: severityColors.high }} /> High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: severityColors.medium }} /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm" style={{ background: severityColors.low }} /> Low</span>
      </div>
    </div>
  );
}

function DonutSegment({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const segs = data.map((d) => {
    const start = cumulative;
    cumulative += d.value;
    return { ...d, startAngle: (start / total) * 360, endAngle: (cumulative / total) * 360 };
  });
  const radius = 36;
  const cx = 50;
  const cy = 50;
  const paths = segs.map((s) => {
    const sr = ((s.startAngle - 90) * Math.PI) / 180;
    const er = ((s.endAngle - 90) * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(sr);
    const y1 = cy + radius * Math.sin(sr);
    const x2 = cx + radius * Math.cos(er);
    const y2 = cy + radius * Math.sin(er);
    const large = s.endAngle - s.startAngle > 180 ? 1 : 0;
    return { d: `M${cx} ${cy} L${x1} ${y1} A${radius} ${radius} 0 ${large} 1 ${x2} ${y2}Z`, color: s.color, label: s.label, value: s.value, pct: Math.round((s.value / total) * 100) };
  });
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">{title}</span>
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 100 100" className="w-[72px] h-[72px] shrink-0">
          {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} opacity={0.85} />)}
          <circle cx={50} cy={50} r={18} fill="#0a0b0e" />
        </svg>
        <div className="flex-1 space-y-1">
          {data.map((d) => (
            <div key={d.label} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-foreground-secondary">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
                {d.label}
              </span>
              <span className="font-mono text-foreground-tertiary">{Math.round((d.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DonutCharts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <DonutSegment data={ATTACK_CATEGORIES} title="Attack Categories" />
      <DonutSegment data={DETECTION_SOURCES} title="Detection Sources" />
    </div>
  );
}

export function TopCountriesChart() {
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Top Attack Sources</span>
      <div className="space-y-2">
        {TOP_COUNTRIES.map((c) => (
          <div key={c.country} className="flex items-center gap-2">
            <span className="text-sm w-5">{c.flag}</span>
            <span className="text-xs text-foreground w-24 truncate">{c.country}</span>
            <div className="flex-1 h-3 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.percent}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-sm"
                style={{ background: "linear-gradient(90deg, rgba(0,180,216,0.3), rgba(0,180,216,0.6))" }}
              />
            </div>
            <span className="text-xs font-mono text-foreground-tertiary w-14 text-right">{c.attacks.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalystActivityChart() {
  const maxAssigned = Math.max(...ANALYST_ACTIVITY.map((a) => a.assigned));
  const maxResolved = Math.max(...ANALYST_ACTIVITY.map((a) => a.resolved));
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Analyst Activity</span>
      <div className="space-y-3">
        {ANALYST_ACTIVITY.map((a) => (
          <div key={a.name} className="flex items-center gap-3">
            <span className="text-xs text-foreground font-mono w-20 truncate">{a.name}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="flex-1 h-2 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(a.assigned / maxAssigned) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-sm" style={{ background: "rgba(0,180,216,0.5)" }}
                  />
                </div>
                <span className="text-xs font-mono text-cyan">{a.assigned}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(a.resolved / maxResolved) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-sm" style={{ background: "rgba(16,185,129,0.5)" }}
                  />
                </div>
                <span className="text-xs font-mono text-emerald-400">{a.resolved}</span>
              </div>
            </div>
            <span className="text-xs font-mono text-foreground-tertiary">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThreatTimeline() {
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-4 block">Threat Timeline — Active Investigation</span>
      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/60" />
        <div className="space-y-3">
          {TIMELINE_EVENTS.map((ev, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-[15px] h-[15px] rounded-full border-2 shrink-0 mt-0.5 relative z-10 flex items-center justify-center ${
                ev.status === "completed" ? "bg-emerald-500/20 border-emerald-400" :
                ev.status === "in_progress" ? "bg-yellow-500/20 border-yellow-400 animate-pulse-glow" :
                "bg-gray-500/10 border-gray-500"
              }`}>
                {ev.status === "completed" && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                {ev.status === "in_progress" && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{ev.phase}</span>
                  <span className="text-xs font-mono text-foreground-tertiary">{ev.timestamp}</span>
                  {ev.mitreId && <span className="text-xs font-mono text-cyan bg-cyan/10 px-1 py-0.5 rounded">{ev.mitreId}</span>}
                </div>
                <p className="text-xs text-foreground-secondary mt-0.5">{ev.description}</p>
                <p className="text-xs text-foreground-tertiary mt-0.5">{ev.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MitreMatrix() {
  const tactics = [...new Set(MITRE_TECHNIQUES.map((t) => t.tactic))];
  const coverageColors: Record<string, string> = { none: "bg-gray-500/20 text-gray-400", partial: "bg-yellow-500/20 text-yellow-400", extensive: "bg-blue-500/20 text-blue-400", comprehensive: "bg-emerald-500/20 text-emerald-400" };
  return (
    <div className="glass-card p-4 overflow-x-auto">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">MITRE ATT&CK Coverage</span>
      <div className="flex gap-2 min-w-[600px]">
        {tactics.map((tactic) => (
          <div key={tactic} className="flex-1 min-w-[100px]">
            <div className="text-xs font-mono text-foreground-tertiary uppercase mb-2 text-center px-1 leading-tight">{tactic}</div>
            {MITRE_TECHNIQUES.filter((t) => t.tactic === tactic).map((t) => (
              <div key={t.techniqueId} className="mb-1.5 p-1.5 rounded-lg border border-border/30 hover:border-cyan/20 transition-colors cursor-default" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="text-xs font-mono text-cyan mb-0.5">{t.techniqueId}</div>
                <div className="text-xs text-foreground leading-tight mb-1">{t.techniqueName}</div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${coverageColors[t.coverage]}`}>{t.coverage}</span>
                  {t.relatedIncidents > 0 && <span className="text-xs text-foreground-tertiary">{t.relatedIncidents}</span>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThreatIntelPanel() {
  const sevStyles: Record<string, string> = { critical: "text-red-400 bg-red-500/10 border-red-500/20", high: "text-orange-400 bg-orange-500/10 border-orange-500/20", medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", low: "text-blue-400 bg-blue-500/10 border-blue-500/20", info: "text-gray-400 bg-gray-500/10 border-gray-500/20" };
  const typeLabels: Record<string, string> = { cve: "CVE", actor: "Actor", malware: "Malware", ioc: "IOC" };
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Threat Intelligence</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {THREAT_INTEL.map((item) => (
          <div key={item.id} className="p-3 rounded-lg border border-border/30 hover:border-border/60 transition-colors" style={{ background: "rgba(255,255,255,0.015)" }}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono px-1 py-0.5 rounded border ${sevStyles[item.severity]}`}>{item.severity}</span>
              <span className="text-xs font-mono text-foreground-tertiary px-1 py-0.5 rounded bg-white/5">{typeLabels[item.type]}</span>
              <span className="text-xs font-mono text-cyan ml-auto">{item.id}</span>
            </div>
            <div className="text-xs text-foreground font-medium mb-0.5">{item.title}</div>
            <div className="text-xs text-foreground-secondary leading-tight mb-1">{item.description}</div>
            <div className="text-xs text-foreground-tertiary">{item.date} · {item.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NetworkTrafficPanel() {
  const colors = ["#06b6d4", "#8b5cf6", "#10b981"];
  const grandTotal = NETWORK_FLOWS.reduce((s, f) => s + f.total, 0);
  const segments = NETWORK_FLOWS.map((f) => ({
    ...f,
    pct: Math.round((f.total / grandTotal) * 100),
  }));
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Network Traffic</span>
      <div className="flex items-end gap-1 h-20 mb-3">
        {NETWORK_FLOWS.map((nf) => {
          const idx = NETWORK_FLOWS.indexOf(nf);
          const maxTotal = Math.max(...NETWORK_FLOWS.map((x) => x.total));
          return (
            <div key={nf.direction} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-sm relative" style={{ background: "rgba(255,255,255,0.03)", height: "100%" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(nf.total / maxTotal) * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className="absolute bottom-0 left-0 right-0 rounded-sm"
                  style={{ background: `linear-gradient(to top, ${colors[idx]}40, ${colors[idx]}80)` }}
                />
              </div>
              <span className="text-xs text-foreground-tertiary font-mono">{nf.direction.slice(0, 3)}</span>
            </div>
          );
        })}
      </div>
      <div className="space-y-1.5">
        {segments.map((s, i) => (
          <div key={s.direction} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-foreground-secondary">
              <span className="w-2 h-2 rounded-sm" style={{ background: colors[i] }} />
              {s.direction.charAt(0).toUpperCase() + s.direction.slice(1)}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-foreground-tertiary">{s.pct}%</span>
              <span className="font-mono text-foreground-tertiary w-20 text-right">{s.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between text-xs">
        <span className="text-foreground-secondary">Blocked</span>
        <span className="font-mono text-red-400">{(NETWORK_FLOWS[0].blocked + NETWORK_FLOWS[1].blocked + NETWORK_FLOWS[2].blocked).toLocaleString()}</span>
      </div>
    </div>
  );
}

export function AiThreatAssistant() {
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-2 block">AI Threat Assistant</span>
      <div className="p-3 rounded-lg bg-accent-soft border border-accent-border mb-3">
        <p className="text-xs text-foreground-secondary leading-relaxed">
          <span className="text-cyan font-medium">Analysis:</span> The active LockBit 3.0 incident (INC-001) shows a sophisticated multi-stage attack.
          Initial access via compromised VPN, followed by credential dumping and lateral movement using PsExec.
        </p>
      </div>
      <div className="space-y-1.5 text-xs text-foreground-secondary">
        <div className="flex items-start gap-2"><span className="text-cyan shrink-0">→</span><span><strong className="text-foreground">Containment:</strong> Isolate FS-01, DC-02, APP-05. Block outbound SMB.</span></div>
        <div className="flex items-start gap-2"><span className="text-cyan shrink-0">→</span><span><strong className="text-foreground">MITRE:</strong> T1486, T1021, T1078</span></div>
        <div className="flex items-start gap-2"><span className="text-cyan shrink-0">→</span><span><strong className="text-foreground">Related:</strong> Sentinel AI project, NetDefend zero-trust</span></div>
      </div>
    </div>
  );
}
