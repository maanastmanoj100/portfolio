"use client";

import { motion } from "framer-motion";
import { COUNTRIES, ATTACK_EVENTS, ATTACK_TYPES, ATTACK_TREND } from "./attack-map-data";

export function ThreatDistributionChart() {
  const total = ATTACK_TYPES.reduce((s, t) => s + t.count, 0);
  const maxCount = Math.max(...ATTACK_TYPES.map((t) => t.count));
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Attack Type Distribution</span>
      <div className="space-y-1.5">
        {ATTACK_TYPES.map((t) => (
          <div key={t.type} className="flex items-center gap-2">
            <span className="text-xs text-foreground w-20 shrink-0">{t.type}</span>
            <div className="flex-1 h-3 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(t.count / maxCount) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-sm"
                style={{ background: `linear-gradient(90deg, ${t.color}60, ${t.color})` }}
              />
            </div>
            <span className="text-xs font-mono text-foreground-tertiary w-10 text-right">{t.count}</span>
            <span className="text-xs font-mono text-foreground-tertiary w-8 text-right">{Math.round((t.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopThreatCountries() {
  const sorted = [...COUNTRIES].sort((a, b) => b.recentAttacks - a.recentAttacks).slice(0, 8);
  const maxAttacks = sorted[0]?.recentAttacks ?? 1;
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Top Countries by Recent Attacks</span>
      <div className="space-y-2">
        {sorted.map((c, i) => (
          <div key={c.code} className="flex items-center gap-2">
            <span className="text-xs w-4 text-center">{c.flag}</span>
            <span className="text-xs text-foreground w-20 truncate">{c.name}</span>
            <div className="flex-1 h-3 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(c.recentAttacks / maxAttacks) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-sm"
                style={{
                  background: `linear-gradient(90deg, ${
                    c.threatScore > 70 ? "rgba(239,68,68,0.6)" : c.threatScore > 50 ? "rgba(249,115,22,0.6)" : "rgba(59,130,246,0.6)"
                  }, ${
                    c.threatScore > 70 ? "#ef4444" : c.threatScore > 50 ? "#f97316" : "#3b82f6"
                  })`,
                }}
              />
            </div>
            <span className="text-xs font-mono text-foreground-tertiary w-14 text-right">{c.recentAttacks.toLocaleString()}</span>
            <span className="text-xs font-mono text-foreground-tertiary w-6 text-right">{Math.round((c.recentAttacks / maxAttacks) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AttackTrendChart() {
  const maxCount = Math.max(...ATTACK_TREND.map((d) => d.count));
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Attack Trend — 7 Days</span>
      <div className="flex items-end gap-2 h-24">
        {ATTACK_TREND.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.count / maxCount) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-sm"
              style={{
                background: `linear-gradient(to top, rgba(239,68,68,0.3), rgba(239,68,68,0.6))`,
              }}
            />
            <span className="text-xs font-mono text-foreground-tertiary">{d.day.slice(0, 3)}</span>
            <span className="text-xs font-mono text-foreground-tertiary">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickStats() {
  const totalAttacks = ATTACK_EVENTS.length;
  const totalCountries = COUNTRIES.length;
  const totalActive = COUNTRIES.reduce((s, c) => s + c.activeAttacks, 0);
  const totalRecent = COUNTRIES.reduce((s, c) => s + c.recentAttacks, 0);
  const avgThreat = Math.round(COUNTRIES.reduce((s, c) => s + c.threatScore, 0) / COUNTRIES.length);

  const metrics = [
    { label: "Total Events", value: totalAttacks.toString(), accent: "#06b6d4" },
    { label: "Countries", value: totalCountries.toString(), accent: "#8b5cf6" },
    { label: "Active Attacks", value: totalActive.toString(), accent: "#ef4444" },
    { label: "Recent 24h", value: totalRecent.toLocaleString(), accent: "#f97316" },
    { label: "Avg Threat Score", value: `${avgThreat}%`, accent: "#eab308" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="glass-card p-3 text-center">
          <div className="text-lg sm:text-xl font-mono font-medium" style={{ color: m.accent }}>
            {m.value}
          </div>
          <div className="text-xs text-foreground-tertiary font-mono mt-1">{m.label}</div>
        </div>
      ))}
    </div>
  );
}
