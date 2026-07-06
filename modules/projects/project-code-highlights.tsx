"use client";

import { useState } from "react";
import type { Project } from "@/types";

export function CodeHighlights({ project }: { project: Project }) {
  const highlights = project.codeHighlights;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Code Highlights</span>
      <div className="space-y-3">
        {highlights.map((h, i) => (
          <div key={i} className="rounded-lg border border-border/30 overflow-hidden">
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              className="w-full flex items-center justify-between p-2.5 bg-white/[0.015] hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground font-medium">{h.title}</span>
                <span className="text-xs font-mono text-cyan bg-cyan/10 px-1 py-0.5 rounded">{h.language}</span>
              </div>
              <span className="text-xs text-foreground-tertiary">{expandedIdx === i ? "−" : "+"}</span>
            </button>
            {expandedIdx === i && (
              <div className="p-2.5 border-t border-border/20">
                <p className="text-xs text-foreground-secondary leading-relaxed mb-2">{h.description}</p>
                <pre className="text-xs font-mono leading-relaxed text-foreground-secondary bg-[#0a0b0e] p-3 rounded-lg overflow-x-auto custom-scrollbar border border-border/20">
                  <code>{h.code}</code>
                </pre>
                {h.securityRelevance && (
                  <div className="mt-2 p-2 rounded-lg bg-cyan/5 border border-cyan/10">
                    <span className="text-xs text-cyan font-mono">Security Relevance:</span>
                    <p className="text-xs text-foreground-secondary mt-0.5">{h.securityRelevance}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
