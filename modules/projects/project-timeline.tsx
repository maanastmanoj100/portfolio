"use client";

import type { Project } from "@/types";

export function ImplementationTimeline({ project }: { project: Project }) {
  const timeline = project.implementationTimeline;
  if (!timeline) return null;

  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-4 block">Implementation Timeline</span>
      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/60" />
        <div className="space-y-4">
          {timeline.map((phase, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-[15px] h-[15px] rounded-full border-2 shrink-0 mt-0.5 relative z-10 flex items-center justify-center ${
                phase.status === "completed" ? "bg-emerald-500/20 border-emerald-400" :
                phase.status === "in_progress" ? "bg-yellow-500/20 border-yellow-400 animate-pulse-glow" :
                "bg-gray-500/10 border-gray-500"
              }`}>
                {phase.status === "completed" && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                {phase.status === "in_progress" && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground font-medium">{phase.phase}</span>
                  <span className="text-xs font-mono text-foreground-tertiary">{phase.duration}</span>
                </div>
                <p className="text-xs text-foreground-secondary mt-0.5">{phase.description}</p>
                {phase.deliverables.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {phase.deliverables.map((d) => (
                      <span key={d} className="text-xs font-mono text-foreground-tertiary bg-white/5 px-1 py-0.5 rounded border border-border/20">{d}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
