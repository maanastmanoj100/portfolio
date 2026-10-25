"use client";

import { useState } from "react";
import type { Project } from "@/types";

const layerColors = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#f97316", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"];
const typeIcons: Record<string, string> = {
  service: "⚙", database: "🗄", client: "🖥", gateway: "🚪",
  cache: "⚡", queue: "📨", storage: "💾", external: "🌐",
};

export function ArchitectureViewer({ project }: { project: Project }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const arch = project.architecture;
  if (!arch) return null;

  const groups: Record<number, typeof arch.nodes> = {};
  arch.nodes.forEach((node) => {
    (groups[node.layer] ??= []).push(node);
  });
  const layerNodes = Object.entries(groups).sort(([a], [b]) => parseInt(a) - parseInt(b));

  const content = (
    <div className={`p-4 ${fullscreen ? "fixed inset-0 z-50 bg-[#0a0b0e]/95 backdrop-blur-xl flex flex-col" : ""}`}>
      {fullscreen && (
        <div className="flex items-center justify-between mb-4 px-4">
          <span className="text-xs text-foreground font-mono uppercase tracking-wider">Architecture — {project.title}</span>
          <button onClick={() => setFullscreen(false)} className="text-foreground-tertiary hover:text-foreground text-xs font-mono px-2 py-1 border border-border/40 rounded-lg">Close</button>
        </div>
      )}
      <div className={`overflow-x-auto custom-scrollbar ${fullscreen ? "flex-1 flex items-center justify-center" : ""}`}>
        <div className="relative min-w-[700px]">
          {layerNodes.map(([layer, nodes]) => (
            <div key={layer} className="flex items-start gap-2 mb-4">
              <div className="flex flex-col items-center w-12 shrink-0 pt-2">
                <div className="text-xs font-mono text-foreground-tertiary">L{layer}</div>
                <div className="w-px h-full min-h-[40px] bg-border/40 mt-1" />
              </div>
              <div className="flex-1 flex gap-3 flex-wrap">
                {nodes.map((node) => {
                  const isSelected = selectedNode === node.id;
                  const color = layerColors[node.layer % layerColors.length];
                  return (
                    <div key={node.id} className="relative">
                      <div
                        onMouseEnter={() => setSelectedNode(node.id)}
                        onMouseLeave={() => setSelectedNode(null)}
                        className={`px-3 py-2 rounded-lg border cursor-default transition-all ${
                          isSelected ? "border-current shadow-lg scale-105" : "border-border/30 hover:border-border/60"
                        }`}
                        style={{
                          background: isSelected ? `${color}10` : "rgba(255,255,255,0.02)",
                          borderColor: isSelected ? color : undefined,
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{typeIcons[node.type] || "□"}</span>
                          <span className="text-xs font-mono text-foreground font-medium">{node.label}</span>
                        </div>
                        {node.protocols && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {node.protocols.map((p) => (
                              <span key={p} className="text-xs font-mono text-foreground-tertiary bg-white/5 px-1 rounded">{p}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute left-0 top-full mt-2 w-56 p-2 rounded-lg bg-[#0a0b0e] border border-border/60 z-10 shadow-xl">
                          <div className="text-xs text-cyan font-mono mb-1">{node.label}</div>
                          <div className="text-xs text-foreground-secondary">{node.description}</div>
                          {node.protocols && node.protocols.length > 0 && (
                            <div className="mt-1 text-xs text-foreground-tertiary font-mono">Protocols: {node.protocols.join(", ")}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {arch.edges.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/30">
              <div className="text-xs text-foreground-tertiary font-mono uppercase tracking-wider mb-2">Data Flow</div>
              <div className="flex flex-wrap gap-2">
                {arch.edges.map((edge, i) => {
                  const from = arch.nodes.find((n) => n.id === edge.from);
                  const to = arch.nodes.find((n) => n.id === edge.to);
                  return (
                    <div key={i} className="flex items-center gap-1 text-xs text-foreground-tertiary font-mono">
                      <span className="text-foreground-secondary">{from?.label || edge.from}</span>
                      <span className="text-foreground-tertiary/50">→</span>
                      <span className="text-foreground-secondary">{to?.label || edge.to}</span>
                      {edge.encrypted && <span className="text-green-400/60">🔒</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
        <p className="text-xs text-foreground-tertiary leading-relaxed">{arch.description}</p>
        <button onClick={() => setFullscreen(!fullscreen)} className="shrink-0 text-xs font-mono text-cyan hover:text-cyan/80 ml-3">
          {fullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 pt-4 pb-0">
        <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase">Architecture</span>
      </div>
      {content}
    </div>
  );
}
