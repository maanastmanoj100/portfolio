"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import ForceGraph from "./force-graph";
import {
  nodes, edges, getNode, getEdgesForNode, getConnectedNodes,
  getNodeTypeCounts, knowledgeClusters, learningPaths,
  labelByType, type NodeType, type GraphNode,
} from "./graph-data";
import {
  IconSearch, IconX, IconFilter, IconBrain, IconBook,
  IconChevronDown, IconChevronUp, IconArrowRight,
  IconStar, IconShare, IconGraph, IconRoute,
  IconBulb, IconShield, IconCode, IconServer,
  IconCloud, IconFlag, IconTarget, IconNetwork,
  IconCpu, IconDatabase, IconCheck, IconGlobe,
} from "@tabler/icons-react";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  project: <IconCode size={14} />,
  skill: <IconBrain size={14} />,
  certification: <IconShield size={14} />,
  technology: <IconCpu size={14} />,
  tool: <IconTarget size={14} />,
  blog: <IconBook size={14} />,
  ctf: <IconFlag size={14} />,
  lab_vm: <IconServer size={14} />,
  research: <IconBulb size={14} />,
  learning_path: <IconRoute size={14} />,
  future_goal: <IconStar size={14} />,
  os: <IconGlobe size={14} />,
  framework: <IconNetwork size={14} />,
};

const SECTION_IDS = {
  hero: "kg-hero",
  stats: "kg-stats",
  graph: "kg-graph",
  clusters: "kg-clusters",
  paths: "kg-paths",
  guide: "kg-guide",
};

function HeroSection() {
  const typeCounts = getNodeTypeCounts();

  return (
    <section id={SECTION_IDS.hero} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <IconGraph size={14} />Chapter 24 — Central Knowledge Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Knowledge Graph
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore the interconnected ecosystem of projects, skills, certifications, research,
            and cybersecurity knowledge that powers Cyber Nexus.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => document.getElementById(SECTION_IDS.graph)?.scrollIntoView({ behavior: "smooth" })}>
              Explore Graph
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById(SECTION_IDS.paths)?.scrollIntoView({ behavior: "smooth" })}>
              Learning Paths
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-12"
        >
          {Object.entries(typeCounts).map(([type, count]) => (
            <GlassCard key={type} glow="none" variant="small" className="text-center">
              <div className="flex justify-center mb-1 opacity-70">{TYPE_ICONS[type] || <IconGraph size={14} />}</div>
              <div className="text-lg font-bold text-white">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">{labelByType[type as NodeType] || type}</div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function NodeDetailPanel({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
  const node = getNode(nodeId);
  const connectedEdges = getEdgesForNode(nodeId);
  const connectedNodes = getConnectedNodes(nodeId);

  if (!node) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
      <GlassCard glow={node.type as "cyan" | "purple" | "blue" | "green" | "amber"} intensity="medium" variant="elevated">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${node.color}20` }}>
              {TYPE_ICONS[node.type] || <IconGraph size={16} />}
            </div>
            <div>
              <h3 className="font-semibold text-white">{node.label}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground capitalize">{labelByType[node.type]}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{node.category}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-white"><IconX size={16} /></button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{node.description}</p>
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Connections ({connectedEdges.length})</h4>
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
            {connectedEdges.slice(0, 10).map((edge) => {
              const otherId = edge.source === nodeId ? edge.target : edge.source;
              const other = getNode(otherId);
              if (!other) return null;
              return (
                <div key={edge.id} className="flex items-center gap-2 text-[11px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: other.color }} />
                  <span className="text-white truncate">{other.label}</span>
                  <span className="text-muted-foreground shrink-0">— {edge.label}</span>
                </div>
              );
            })}
          </div>
          {connectedEdges.length > 10 && (
            <p className="text-xs text-muted-foreground mt-1">+{connectedEdges.length - 10} more</p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function KnowledgeGraphSection() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTypes, setFilterTypes] = useState<string[]>([]);

  const allTypes: NodeType[] = [
    "project", "skill", "certification", "technology", "tool",
    "blog", "ctf", "lab_vm", "research", "learning_path", "future_goal",
  ];

  const toggleType = (type: string) => {
    setFilterTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
  };

  const selectedNodeData = selectedNode ? getNode(selectedNode) : null;

  return (
    <section id={SECTION_IDS.graph} className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Interactive Knowledge Graph</h2>
        <p className="text-muted-foreground mb-6">Navigate the portfolio by exploring relationships between every entity</p>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search nodes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 touch-action-manipulation" style={{ minHeight: 44 }} />
          </div>
          <div className="flex flex-wrap gap-1">
            {allTypes.map((type) => (
              <button key={type} onClick={() => toggleType(type)}
                className={cn(
                  "flex items-center gap-1 text-xs px-2.5 py-2 rounded-lg border transition-colors touch-action-manipulation",
                  filterTypes.includes(type) ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" : "border-white/10 text-muted-foreground hover:text-white"
                )}
                style={{ minHeight: 44 }}
              >
                {TYPE_ICONS[type]}
                <span className="hidden sm:inline">{labelByType[type]}</span>
              </button>
            ))}
            {filterTypes.length > 0 && (
              <button onClick={() => setFilterTypes([])} className="text-xs px-2.5 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 touch-action-manipulation" style={{ minHeight: 44 }}>
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className={cn("lg:col-span-2", selectedNodeData ? "lg:col-span-2" : "lg:col-span-3")}>
            <ForceGraph
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              filterTypes={filterTypes}
              searchQuery={searchQuery}
            />
          </div>
          <AnimatePresence mode="wait">
            {selectedNodeData ? (
              <NodeDetailPanel key={selectedNode} nodeId={selectedNode!} onClose={() => setSelectedNode(null)} />
            ) : (
              <motion.div key="tip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard glow="none" variant="small">
                  <div className="text-center py-8">
                    <IconGraph size={32} className="mx-auto text-muted-foreground mb-2 opacity-50" />
                    <p className="text-xs text-muted-foreground">Click any node to explore its relationships</p>
                    <p className="text-xs text-muted-foreground mt-1">Filter by type or search by name</p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function KnowledgeClusters() {
  const clusterIcons: Record<string, React.ReactNode> = {
    soc: <IconShield size={18} />,
    ad: <IconServer size={18} />,
    web: <IconCode size={18} />,
    cloud: <IconCloud size={18} />,
    pentest: <IconTarget size={18} />,
    learning: <IconRoute size={18} />,
  };

  return (
    <section id={SECTION_IDS.clusters} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Knowledge Clusters</h2>
        <p className="text-muted-foreground mb-8">Related entities grouped by domain — explore connections within each cluster</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeClusters.map((cluster, i) => {
            const clusterNodes = cluster.nodes.map((id) => getNode(id)).filter(Boolean) as GraphNode[];
            return (
              <motion.div key={cluster.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard glow="none" className="h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${cluster.color}20`, color: cluster.color }}>
                      {clusterIcons[cluster.id] || <IconGraph size={18} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{cluster.label}</h3>
                      <p className="text-xs text-muted-foreground">{clusterNodes.length} entities</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {clusterNodes.slice(0, 8).map((n) => (
                      <span key={n.id} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${n.color}15`, color: n.color }}>
                        {n.label}
                      </span>
                    ))}
                    {clusterNodes.length > 8 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">+{clusterNodes.length - 8}</span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LearningPathSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id={SECTION_IDS.paths} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Learning Recommendations</h2>
        <p className="text-muted-foreground mb-8">Suggested progression paths through the portfolio's knowledge ecosystem</p>
        <div className="space-y-4">
          {learningPaths.map((path, i) => (
            <motion.div key={path.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard glow={expanded === path.id ? "cyan" : "none"} intensity="low">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{path.title}</h3>
                    <p className="text-xs text-muted-foreground">{path.description}</p>
                  </div>
                  <button onClick={() => setExpanded(expanded === path.id ? null : path.id)} className="text-muted-foreground hover:text-white">
                    {expanded === path.id ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {path.steps.map((stepId, idx) => {
                    const step = getNode(stepId);
                    return (
                      <span key={stepId} className="flex items-center gap-1">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={step ? { backgroundColor: `${step.color}15`, color: step.color } : {}}>
                          {step?.label || stepId}
                        </span>
                        {idx < path.steps.length - 1 && <IconArrowRight size={10} className="text-muted-foreground" />}
                      </span>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIKnowledgeGuide() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Explain the graph structure",
    "Show everything related to Python",
    "How are projects and certifications connected?",
    "Recommend a learning path",
  ];

  const handleAsk = (q: string) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = question.toLowerCase();
      let answer = "";
      if (lower.includes("graph") || lower.includes("structure")) {
        answer = `The Knowledge Graph contains ${nodes.length} nodes across 13 types and ${edges.length} relationships. Projects connect to skills through 'demonstrates' edges, certifications validate skills via 'validates' edges, and CTFs train skills through 'trains' edges. Every edge represents a real relationship derived from portfolio data.`;
      } else if (lower.includes("python")) {
        const pythonNodes = nodes.filter((n) => n.label.toLowerCase().includes("python")).map((n) => n.label).join(", ");
        const pythonEdges = edges.filter((e) => { const s = getNode(e.source); const t = getNode(e.target); return s?.label.toLowerCase().includes("python") || t?.label.toLowerCase().includes("python"); });
        answer = `Python appears as both a skill and technology node. It connects to ${edges.filter((e) => { const s = getNode(e.source); return s?.label.toLowerCase().includes("python"); }).length} projects including Sentinel AI, Offensive Security Lab, and Cloud Security Lab. It's the most-used language across the portfolio.`;
      } else if (lower.includes("project") && lower.includes("certification")) {
        answer = "Projects and certifications are connected through 'related_to' edges where project work validates certification skills. For example, Sentinel AI relates to CySA+ and Security+, while the Offensive Security Lab and Active Directory Lab both relate to OSCP. The Cloud Security Lab connects to the AWS Certified Security certification.";
      } else if (lower.includes("learning") || lower.includes("path")) {
        answer = `Three curated learning paths exist: 1) SOC Analyst Progression (${learningPaths[0].steps.length} steps from Network+ to Sentinel AI), 2) Penetration Testing Progression (${learningPaths[1].steps.length} steps from Network+ to OSCP), 3) Cloud Security Progression (${learningPaths[2].steps.length} steps from cloud fundamentals to advanced assessment). Each step has verifiable portfolio evidence.`;
      } else {
        answer = `The Knowledge Graph includes ${nodes.length} nodes and ${edges.length} edges. You can ask about specific nodes (projects, skills, certifications), relationships between entities, or learning path recommendations. Try clicking a node in the graph to see its connections.`;
      }
      setResponse(answer);
      setLoading(false);
    }, 800);
  };

  return (
    <section id={SECTION_IDS.guide} className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <GlassCard glow="purple" intensity="medium" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><IconBrain size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Knowledge Guide</h2>
              <p className="text-xs text-muted-foreground">Navigate the graph using natural language</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => { setQuery(s); handleAsk(s); }}
                className="text-[11px] px-3 py-2 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-cyan-500/30 transition-colors touch-action-manipulation"
                style={{ minHeight: 44 }}
              >{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
              placeholder="Ask about the knowledge graph..." className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 touch-action-manipulation" style={{ minHeight: 44 }} />
            <Button variant="primary" size="md" className="touch-action-manipulation" onClick={() => handleAsk(query)} loading={loading}>Ask</Button>
          </div>
          <AnimatePresence>
            {response && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20"
              >
                <div className="flex items-start gap-2">
                  <IconBrain size={16} className="text-purple-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground break-words">{response}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}

function KnowledgeGraphPage() {
  const { recruiterMode } = useUIStore();
  const [activeSection, setActiveSection] = useState(SECTION_IDS.hero);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    Object.values(SECTION_IDS).forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  if (recruiterMode) {
    const projectCount = nodes.filter((n) => n.type === "project").length;
    const skillCount = nodes.filter((n) => n.type === "skill").length;
    const certCount = nodes.filter((n) => n.type === "certification").length;
    const techCount = nodes.filter((n) => n.type === "technology" || n.type === "tool").length;

    return (
      <div className="min-h-screen overflow-x-hidden">
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs mb-4">
              <IconGraph size={12} />Knowledge Graph — Recruiter View
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Knowledge Ecosystem Overview</h1>
            <p className="text-muted-foreground mb-8">Interconnected portfolio with {nodes.length} entities and {edges.length} documented relationships across all domains.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <GlassCard glow="cyan" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{projectCount}</div><div className="text-xs text-muted-foreground">Projects</div></GlassCard>
              <GlassCard glow="purple" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{skillCount}</div><div className="text-xs text-muted-foreground">Skills</div></GlassCard>
              <GlassCard glow="amber" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{certCount}</div><div className="text-xs text-muted-foreground">Certifications</div></GlassCard>
              <GlassCard glow="blue" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{techCount}</div><div className="text-xs text-muted-foreground">Technologies</div></GlassCard>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <GlassCard glow="green" intensity="low">
                <h3 className="text-sm font-semibold text-white mb-3">Knowledge Clusters</h3>
                <div className="space-y-1.5">{knowledgeClusters.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-white">{c.label}</span><span className="text-muted-foreground">({nodes.filter((n) => c.nodes.includes(n.id)).length} entities)</span></div>
                ))}</div>
              </GlassCard>
              <GlassCard glow="purple" intensity="low">
                <h3 className="text-sm font-semibold text-white mb-3">Learning Paths</h3>
                <div className="space-y-2">{learningPaths.map((p) => (
                  <div key={p.id}><div className="text-xs text-white">{p.title}</div><div className="text-xs text-muted-foreground">{p.steps.length} steps · {p.description}</div></div>
                ))}</div>
              </GlassCard>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-1">
        {Object.entries(SECTION_IDS).map(([label, id]) => (
          <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className={cn("w-2 h-2 rounded-full transition-all duration-300", activeSection === id ? "bg-cyan-400 scale-125" : "bg-white/20 hover:bg-white/40")}
            title={label}
          />
        ))}
      </div>
      <HeroSection />
      <KnowledgeGraphSection />
      <KnowledgeClusters />
      <LearningPathSection />
      <AIKnowledgeGuide />
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Knowledge Graph — {nodes.length} entities · {edges.length} relationships · All connections represent real relationships derived from documented portfolio data.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default KnowledgeGraphPage;
