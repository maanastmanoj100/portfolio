"use client";

import type { Project } from "@/types";

const riskColors: Record<string, string> = {
  critical: "text-red-400 bg-red-500/10 border-red-500/20",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

const controlCategoryColors: Record<string, string> = {
  preventive: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  detective: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  corrective: "text-green-400 bg-green-500/10 border-green-500/20",
  deterrent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

export function SecurityAnalysis({ project }: { project: Project }) {
  const sa = project.securityAnalysis;
  if (!sa) return null;

  return (
    <div className="glass-card p-4 space-y-5">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase">Security Analysis</span>

      {sa.threatModel.length > 0 && (
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider mb-2 block">Threat Model</span>
          <div className="space-y-2">
            {sa.threatModel.map((t, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-border/30 bg-white/[0.015]">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono px-1 py-0.5 rounded border ${riskColors[t.risk]}`}>{t.risk}</span>
                  <span className="text-xs text-foreground font-medium">{t.threat}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground-tertiary mt-1.5">
                  <div><span className="text-foreground-secondary">Vector:</span> {t.attackVector}</div>
                  <div><span className="text-foreground-secondary">Impact:</span> {t.impact}</div>
                  <div className="sm:col-span-2"><span className="text-foreground-secondary">Mitigation:</span> {t.mitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sa.attackSurface.length > 0 && (
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider mb-2 block">Attack Surface</span>
          <div className="flex flex-wrap gap-1.5">
            {sa.attackSurface.map((s) => (
              <span key={s} className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider mb-1 block">Risk Analysis</span>
        <p className="text-xs text-foreground-secondary leading-relaxed">{sa.riskAnalysis}</p>
      </div>

      {sa.securityControls.length > 0 && (
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider mb-2 block">Security Controls</span>
          <div className="space-y-1.5">
            {sa.securityControls.map((sc, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.015] border border-border/20">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-foreground font-medium">{sc.name}</span>
                    <span className={`text-xs font-mono px-1 py-0.5 rounded border ${controlCategoryColors[sc.category]}`}>{sc.category}</span>
                  </div>
                  <p className="text-xs text-foreground-tertiary mt-0.5">{sc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sa.mitreMapping.length > 0 && (
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider mb-2 block">MITRE ATT&CK Mapping</span>
          <div className="flex flex-wrap gap-1">
            {sa.mitreMapping.map((m) => (
              <span key={m} className="text-xs font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">{m}</span>
            ))}
          </div>
        </div>
      )}

      {sa.bestPractices.length > 0 && (
        <div>
          <span className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider mb-2 block">Best Practices</span>
          <ul className="space-y-1">
            {sa.bestPractices.map((bp, i) => (
              <li key={i} className="text-xs text-foreground-secondary flex items-start gap-1.5">
                <span className="text-cyan shrink-0 mt-0.5">→</span>
                {bp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
