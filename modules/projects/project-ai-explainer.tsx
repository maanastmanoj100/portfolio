"use client";

import { useState } from "react";
import type { Project } from "@/types";

const explainerKeys = ["quick", "technical", "recruiter", "architecture", "lessons"] as const;

type ExplainerKey = (typeof explainerKeys)[number];

const explainerLabels: Record<ExplainerKey, string> = {
  quick: "Quick Summary (30 sec)",
  technical: "Technical Deep Dive",
  recruiter: "For Recruiters",
  architecture: "Architecture Explained",
  lessons: "What I Learned",
};

export function AIProjectExplainer({ project }: { project: Project }) {
  const [activeExp, setActiveExp] = useState<ExplainerKey>("quick");
  const explainers = project.aiExplainers;
  if (!explainers) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase">AI Project Explainer</span>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-glow" />
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {explainerKeys.map((key) => {
          if (!explainers[key]) return null;
          return (
            <button
              key={key}
              onClick={() => setActiveExp(key)}
              className={`text-xs font-mono px-2 py-1 rounded-lg border transition-colors ${
                activeExp === key ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-white/5 border-border/40 text-foreground-tertiary hover:text-foreground"
              }`}
            >
              {explainerLabels[key]}
            </button>
          );
        })}
      </div>
      <div className="p-3 rounded-lg bg-purple-500/[0.03] border border-purple-500/10">
        <p className="text-xs text-foreground-secondary leading-relaxed">{explainers[activeExp]}</p>
      </div>
    </div>
  );
}
