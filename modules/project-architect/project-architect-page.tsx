"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  IconSearch, IconX, IconBrain, IconCheck, IconRocket, IconTarget,
  IconShield, IconBook, IconServer, IconChartBar, IconNetwork,
  IconFolder, IconAward, IconFileText, IconCode, IconDownload,
  IconPlus, IconEdit, IconTrash, IconArrowsShuffle, IconCpu,
  IconDatabase, IconApi, IconLock, IconBug, IconTestPipe,
  IconSettings, IconCloud, IconUsers, IconClock, IconMap,
  IconCopy, IconExternalLink, IconRobot,
  IconSlash, IconArrowRight, IconCards, IconStar, IconAlertTriangle,
} from "@tabler/icons-react";
import {
  CATEGORIES, CATEGORY_LIST, PHASES_DEFINITION, TECH_STACKS,
  DOC_TEMPLATES, TESTING_LAYERS, TESTING_CHECKLIST, DEVOPS_RECOMMENDATIONS,
  SECURITY_ARCH_DOMAINS, STRIDE_THREATS, SKILL_MAPPING_CATEGORIES,
  FOLDER_STRUCTURE_MICROSERVICES, FOLDER_STRUCTURE_MONOLITH,
  FOLDER_STRUCTURE_SECURITY_TOOL, SAMPLE_CONCEPTS,
  generateProjectId, estimateDuration,
  type ProjectCategory, type GeneratedProject, type ImplPhase, type ProjectBlueprint,
} from "./project-data";

const SECTION_IDS = {
  hero: "arch-hero",
  generator: "arch-generator",
  architecture: "arch-architecture",
  technology: "arch-technology",
  roadmap: "arch-roadmap",
  folder: "arch-folder",
  database: "arch-database",
  api: "arch-api",
  security: "arch-security",
  threat: "arch-threat",
  testing: "arch-testing",
  docs: "arch-docs",
  devops: "arch-devops",
  estimator: "arch-estimator",
  skills: "arch-skills",
  advisor: "arch-advisor",
  comparison: "arch-comparison",
};

function HeroSection({ onGenerate }: { onGenerate: () => void }) {
  return (
    <section id={SECTION_IDS.hero} className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-cyan-500/5" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
            <IconBrain size={14} /> Chapter 29 - AI Project Architect & Cyber Project Generator
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            AI Project Architect
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Generate, design, and plan cybersecurity projects using AI-assisted architecture, documentation, and implementation guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={onGenerate}>
              <IconPlus size={16} className="mr-1" /> Generate Project
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById(SECTION_IDS.architecture)?.scrollIntoView({ behavior: "smooth" })}>
              <IconCpu size={16} className="mr-1" /> Architecture Studio
            </Button>
            <Button variant="ghost" size="lg" onClick={() => document.getElementById(SECTION_IDS.advisor)?.scrollIntoView({ behavior: "smooth" })}>
              <IconRobot size={16} className="mr-1" /> AI Review
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function IdeaGenerator() {
  const [selectedCats, setSelectedCats] = useState<ProjectCategory[]>([]);
  const [generated, setGenerated] = useState<GeneratedProject[]>(SAMPLE_CONCEPTS);
  const [title, setTitle] = useState("");

  const toggleCat = (cat: ProjectCategory) => {
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const handleGenerate = () => {
    const cats = selectedCats.length > 0 ? selectedCats : [CATEGORY_LIST[Math.floor(Math.random() * CATEGORY_LIST.length)]];
    const catLabels = cats.map((c) => CATEGORIES[c].label);
    const newProject: GeneratedProject = {
      id: generateProjectId(),
      title: title || `${catLabels[0]} ${["Platform", "Framework", "Automation Engine", "Analysis Suite", "Detection System"][Math.floor(Math.random() * 5)]}`,
      purpose: `A comprehensive ${catLabels.join("/")} solution designed to address modern cybersecurity challenges through automation and intelligent analysis.`,
      problemStatement: `Organizations face growing challenges in ${catLabels.join(" and ")} — manual processes are slow, inconsistent, and fail to scale with threat velocity.`,
      targetUsers: catLabels.map((l) => `${l} practitioners`),
      learningObjectives: [`Master ${catLabels.join(" and ")} concepts`, "Build production-ready security tools", "Implement security best practices"],
      coreFeatures: ["Automated detection and response", "Real-time monitoring dashboard", "Integration with existing security stack", "Comprehensive reporting and analytics"],
      technicalChallenges: ["Scalability under high load", "Data normalization across sources", "False positive reduction"],
      expectedOutcomes: ["Improved security posture", "Reduced manual effort", "Faster incident response"],
      relatedSkills: ["Python", "TypeScript", "Docker", "SIEM", "Cloud Security"],
      relatedPortfolioProjects: ["sentinel-ai", "soc-automation"],
      categories: cats,
      status: "concept-proposal",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setGenerated((prev) => [newProject, ...prev]);
    setTitle("");
  };

  const removeConcept = (id: string) => {
    setGenerated((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section id={SECTION_IDS.generator} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Project Idea Generator</h2>
        <p className="text-muted-foreground mb-6">Combine categories to generate structured cybersecurity project concepts.</p>
        <GlassCard glow="purple" intensity="low" className="mb-8">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {CATEGORY_LIST.map((cat) => {
              const selected = selectedCats.includes(cat);
              return (
                <button key={cat} onClick={() => toggleCat(cat)}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] border transition-all",
                    selected
                      ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                      : "border-white/10 text-muted-foreground hover:text-white hover:border-white/20")}>
                  {CATEGORIES[cat].label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Custom project title (optional)" className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" />
            <Button variant="primary" size="md" onClick={handleGenerate}><IconPlus size={14} className="mr-1" /> Generate</Button>
          </div>
        </GlassCard>
        <div className="space-y-3">
          {generated.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
              <GlassCard glow="none" intensity="low" className="hover:border-purple-500/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-xs px-1.5 py-0.5 rounded-full",
                        project.status === "concept-proposal" ? "text-amber-400 bg-amber-500/10"
                          : project.status === "in-progress" ? "text-cyan-400 bg-cyan-500/10" : "text-green-400 bg-green-500/10")}>
                        {project.status === "concept-proposal" ? "Concept Proposal" : project.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{project.createdAt}</span>
                    </div>
                    <h3 className="text-base font-medium text-white">{project.title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{project.purpose}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.categories.map((c) => (
                        <span key={c} className={cn("text-xs px-1.5 py-0.5 rounded-full", CATEGORIES[c].color)}>{CATEGORIES[c].label}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.relatedSkills.slice(0, 4).map((s) => (
                        <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{s}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => removeConcept(project.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
                    <IconX size={14} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  const [activeView, setActiveView] = useState<"system" | "components" | "dataflow" | "deployment">("system");

  const components = [
    { name: "API Gateway", desc: "Central entry point with auth, rate limiting, and routing", deps: ["Authentication Service"] },
    { name: "Authentication Service", desc: "OAuth2/OIDC provider with MFA support", deps: ["User Database"] },
    { name: "Core Engine", desc: "Business logic processing and rule evaluation", deps: ["API Gateway", "Database"] },
    { name: "Database Layer", desc: "PostgreSQL with read replicas and Redis cache", deps: [] },
    { name: "Message Queue", desc: "Async task processing with RabbitMQ", deps: ["Core Engine"] },
    { name: "Worker Pool", desc: "Background job processors for scalable computation", deps: ["Message Queue"] },
    { name: "Monitoring Stack", desc: "Prometheus + Grafana for metrics and alerting", deps: ["Core Engine", "API Gateway"] },
    { name: "Log Aggregator", desc: "ELK stack for centralized structured logging", deps: ["Core Engine", "API Gateway"] },
  ];

  const dataFlows = [
    { source: "Client", target: "API Gateway", data: "HTTP/HTTPS requests", protocol: "HTTPS (TLS 1.3)" },
    { source: "API Gateway", target: "Auth Service", data: "Authentication tokens", protocol: "gRPC (mTLS)" },
    { source: "API Gateway", target: "Core Engine", data: "API requests", protocol: "gRPC (mTLS)" },
    { source: "Core Engine", target: "Database", data: "Queries and mutations", protocol: "PostgreSQL (TLS)" },
    { source: "Core Engine", target: "Message Queue", data: "Async tasks", protocol: "AMQP (TLS)" },
    { source: "Worker Pool", target: "Database", data: "Bulk processing results", protocol: "PostgreSQL (TLS)" },
  ];

  return (
    <section id={SECTION_IDS.architecture} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Architecture Studio</h2>
        <p className="text-muted-foreground mb-6">System architecture, component relationships, and data flow design.</p>
        <div className="flex gap-1 mb-6">
          {(["system", "components", "dataflow", "deployment"] as const).map((v) => (
            <button key={v} onClick={() => setActiveView(v)}
              className={cn("text-[11px] px-3 py-1.5 rounded-lg border transition-colors",
                activeView === v ? "border-purple-500/50 bg-purple-500/10 text-purple-400" : "border-white/10 text-muted-foreground hover:text-white")}>
              {v === "system" ? "System View" : v === "components" ? "Components" : v === "dataflow" ? "Data Flow" : "Deployment"}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {activeView === "components" && (
            <motion.div key="components" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {components.map((comp) => (
                <GlassCard key={comp.name} glow="none" intensity="low">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <IconCpu size={12} />
                    </div>
                    <span className="text-xs font-medium text-white">{comp.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{comp.desc}</p>
                  {comp.deps.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {comp.deps.map((d) => <span key={d} className="text-xs px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{d}</span>)}
                    </div>
                  )}
                </GlassCard>
              ))}
            </motion.div>
          )}
          {activeView === "dataflow" && (
            <motion.div key="dataflow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {dataFlows.map((flow, i) => (
                <GlassCard key={i} glow="none" intensity="low" variant="small">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-white font-medium w-24 truncate">{flow.source}</span>
                    <IconArrowRight size={12} className="text-purple-400 shrink-0" />
                    <span className="text-white font-medium w-24 truncate">{flow.target}</span>
                    <span className="text-muted-foreground flex-1 truncate">{flow.data}</span>
                    <span className="text-cyan-400 text-xs">{flow.protocol}</span>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}
          {(activeView === "system" || activeView === "deployment") && (
            <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GlassCard glow="none" className="text-center py-12">
                <IconCpu size={40} className="mx-auto mb-3 text-purple-400/50" />
                <p className="text-sm text-muted-foreground">
                  {activeView === "system"
                    ? "Interactive system architecture diagram with component relationships and trust boundaries."
                    : "Deployment model showing infrastructure layout, network segments, and environment separation."}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Mermaid and SVG diagram export coming soon.</p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function TechnologySection() {
  return (
    <section id={SECTION_IDS.technology} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Technology Stack Advisor</h2>
        <p className="text-muted-foreground mb-8">Recommended technologies with rationale, alternatives, and trade-offs for each architectural layer.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TECH_STACKS.map((stack) => (
            <GlassCard key={stack.category} glow="none" intensity="low">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono uppercase tracking-wider">{stack.category}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {stack.recommended.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{t}</span>)}
              </div>
              <p className="text-xs text-muted-foreground mb-1"><span className="text-white">Why: </span>{stack.rationale}</p>
              <p className="text-xs text-muted-foreground"><span className="text-amber-400">Trade-off: </span>{stack.tradeoffs}</p>
              <div className="mt-2 pt-2 border-t border-white/5">
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground">Alternatives:</span>
                  {stack.alternatives.map((a) => <span key={a} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">{a}</span>)}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoadmapSection() {
  const [expanded, setExpanded] = useState(true);
  return (
    <section id={SECTION_IDS.roadmap} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-white">Implementation Planner</h2>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>{expanded ? "Collapse" : "Expand"}</Button>
        </div>
        <p className="text-muted-foreground mb-8">10-phase implementation roadmap from planning through maintenance with objectives, deliverables, and estimated effort.</p>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0">
              {PHASES_DEFINITION.map((phase, i) => (
                <motion.div key={phase.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
                        i === 0 ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : i === PHASES_DEFINITION.length - 1 ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                          : "bg-white/5 text-muted-foreground border-white/10")}>{i + 1}</div>
                      {i < PHASES_DEFINITION.length - 1 && <div className="w-px h-8 bg-gradient-to-b from-purple-500/20 to-transparent" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <GlassCard glow="none" intensity="low" variant="small">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-white">{phase.name}</span>
                          <span className="text-xs text-muted-foreground">{phase.estimatedEffort}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">Objectives: {phase.objectives.join(", ")}</div>
                        <div className="flex flex-wrap gap-1">
                          {phase.deliverables.map((d) => <span key={d} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{d}</span>)}
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FolderStructureSection() {
  const [archStyle, setArchStyle] = useState<"microservices" | "monolith" | "security-tool">("microservices");
  const folders = archStyle === "microservices" ? FOLDER_STRUCTURE_MICROSERVICES
    : archStyle === "monolith" ? FOLDER_STRUCTURE_MONOLITH
    : FOLDER_STRUCTURE_SECURITY_TOOL;

  return (
    <section id={SECTION_IDS.folder} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Folder Structure Generator</h2>
        <p className="text-muted-foreground mb-6">Generated project layouts based on architecture style.</p>
        <div className="flex gap-1 mb-6">
          {(["microservices", "monolith", "security-tool"] as const).map((s) => (
            <button key={s} onClick={() => setArchStyle(s)}
              className={cn("text-[11px] px-3 py-1.5 rounded-lg border transition-colors",
                archStyle === s ? "border-purple-500/50 bg-purple-500/10 text-purple-400" : "border-white/10 text-muted-foreground hover:text-white")}>
              {s === "microservices" ? "Microservices" : s === "monolith" ? "Monolith" : "Security Tool"}
            </button>
          ))}
        </div>
        <GlassCard glow="none" intensity="low">
          <div className="font-mono text-[11px] leading-relaxed">
            {folders.map((f, i) => (
              <div key={i} className={cn("hover:text-white transition-colors", f.endsWith("/") ? "text-cyan-400" : "text-muted-foreground")}>
                {f.endsWith("/") ? "  " : "  "}{f}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function SecurityArchSection() {
  return (
    <section id={SECTION_IDS.security} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Security Architecture</h2>
        <p className="text-muted-foreground mb-8">Comprehensive security recommendations across 10 domains with implementation rationale.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SECURITY_ARCH_DOMAINS.map((domain) => (
            <GlassCard key={domain.domain} glow="none" intensity="low">
              <div className="flex items-center gap-2 mb-2">
                <IconLock size={14} className="text-cyan-400" />
                <span className="text-xs font-medium text-white">{domain.domain}</span>
              </div>
              <ul className="space-y-1 mb-2">
                {domain.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <IconCheck size={10} className="text-green-400 mt-0.5 shrink-0" />{r}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground border-t border-white/5 pt-1"><span className="text-cyan-400">Rationale: </span>{domain.rationale}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThreatModelSection() {
  return (
    <section id={SECTION_IDS.threat} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Threat Modeling</h2>
        <p className="text-muted-foreground mb-8">STRIDE-based threat enumeration with mitigations, trust boundaries, and residual risk assessment.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {STRIDE_THREATS.map((threat) => (
            <GlassCard key={threat.threat} glow="none" intensity="low">
              <div className="flex items-center gap-2 mb-2">
                <IconBug size={14} className="text-red-400" />
                <span className="text-xs font-medium text-white">{threat.threat}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{threat.description}</p>
              <div className="text-xs text-cyan-400 mb-1">Mitigations</div>
              <ul className="space-y-0.5">
                {threat.mitigations.map((m, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                    <IconShield size={8} className="text-green-400 mt-0.5 shrink-0" />{m}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestingSection() {
  return (
    <section id={SECTION_IDS.testing} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Testing Strategy</h2>
        <p className="text-muted-foreground mb-8">Multi-layer testing approach with tools and a comprehensive pre-deployment checklist.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {TESTING_LAYERS.map((layer) => (
            <GlassCard key={layer.layer} glow="none" intensity="low">
              <div className="flex items-center gap-2 mb-2">
                <IconTestPipe size={14} className="text-cyan-400" />
                <span className="text-xs font-medium text-white">{layer.layer}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{layer.description}</p>
              <div className="flex flex-wrap gap-1">
                {layer.tools.map((t) => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{t}</span>)}
              </div>
            </GlassCard>
          ))}
        </div>
        <GlassCard glow="none">
          <h3 className="text-sm font-medium text-white mb-3">Pre-Deployment Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {TESTING_CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                <IconCheck size={12} className="text-green-400 mt-0.5 shrink-0" />{item}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function DocsSection() {
  return (
    <section id={SECTION_IDS.docs} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Documentation Generator</h2>
        <p className="text-muted-foreground mb-8">Editable templates for project documentation — each template includes standard sections for comprehensive coverage.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {DOC_TEMPLATES.map((doc) => (
            <GlassCard key={doc.id} glow="none" intensity="low" className="hover:border-purple-500/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <IconFileText size={14} className="text-purple-400" />
                <span className="text-[11px] font-medium text-white truncate">{doc.label}</span>
              </div>
              <ul className="space-y-0.5">
                {doc.sections.map((s) => <li key={s} className="text-xs text-muted-foreground truncate">{s}</li>)}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function DevOpsSection() {
  return (
    <section id={SECTION_IDS.devops} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">DevOps Planner</h2>
        <p className="text-muted-foreground mb-8">Recommended DevOps tooling with configuration guidance for each layer of the delivery pipeline.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEVOPS_RECOMMENDATIONS.map((rec) => (
            <GlassCard key={rec.tool} glow="none" intensity="low">
              <div className="flex items-center gap-2 mb-2">
                <IconSettings size={14} className="text-cyan-400" />
                <span className="text-xs font-medium text-white">{rec.tool}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{rec.purpose}</p>
              <p className="text-xs text-cyan-400">Config: <span className="text-muted-foreground">{rec.config}</span></p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function EstimatorSection() {
  const [complexity, setComplexity] = useState<"low" | "medium" | "high" | "very-high">("medium");
  const [size, setSize] = useState<"small" | "medium" | "large" | "xlarge">("medium");

  const duration = estimateDuration(complexity);
  const effort = size === "small" ? "1-2 developers"
    : size === "medium" ? "2-4 developers"
    : size === "large" ? "4-8 developers" : "8+ developers";

  return (
    <section id={SECTION_IDS.estimator} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Project Estimator</h2>
        <p className="text-muted-foreground mb-6">Estimate project scope, effort, and timeline. All estimates are approximate and should be refined during planning.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard glow="none">
            <div className="text-xs font-medium text-white mb-3">Complexity</div>
            <div className="flex flex-wrap gap-1">
              {(["low", "medium", "high", "very-high"] as const).map((c) => (
                <button key={c} onClick={() => setComplexity(c)}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] border transition-colors",
                    complexity === c ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-white/10 text-muted-foreground hover:text-white")}>
                  {c === "very-high" ? "Very High" : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard glow="none">
            <div className="text-xs font-medium text-white mb-3">Project Size</div>
            <div className="flex flex-wrap gap-1">
              {(["small", "medium", "large", "xlarge"] as const).map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className={cn("px-2.5 py-1 rounded-lg text-[11px] border transition-colors",
                    size === s ? "border-purple-500/50 bg-purple-500/10 text-purple-400" : "border-white/10 text-muted-foreground hover:text-white")}>
                  {s === "xlarge" ? "Extra Large" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard glow="purple" intensity="low">
            <div className="text-xs font-medium text-white mb-3">Estimate Summary</div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-white">{duration}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Team</span><span className="text-white">{effort}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Complexity</span><span className="text-amber-400">{complexity}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="text-purple-400">{size}</span></div>
            </div>
          </GlassCard>
        </div>
        <GlassCard glow="none" className="mt-4">
          <p className="text-xs text-muted-foreground">
            <IconAlertTriangle size={12} className="inline mr-1 text-amber-400" />
            These are conceptual estimates only. Actual effort varies based on team experience, requirements, and technical complexity. Refine during the planning phase.
          </p>
        </GlassCard>
      </div>
    </section>
  );
}

function SkillMappingSection() {
  return (
    <section id={SECTION_IDS.skills} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Skill Mapping</h2>
        <p className="text-muted-foreground mb-8">Connect generated projects to existing skills, certifications, and learning paths in the Knowledge Graph.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_MAPPING_CATEGORIES.map((cat) => (
            <GlassCard key={cat.category} glow="none" intensity="low">
              <div className="flex items-center gap-2 mb-2">
                <IconStar size={14} className="text-purple-400" />
                <span className="text-xs font-medium text-white">{cat.category}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {cat.skills.map((s) => <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{s}</span>)}
              </div>
            </GlassCard>
          ))}
        </div>
        <GlassCard glow="none" className="mt-4">
          <p className="text-xs text-muted-foreground text-center">
            Skills map to the Knowledge Graph, Career Role Intelligence, and Skill Progression Engine for personalized learning recommendations.
          </p>
        </GlassCard>
      </div>
    </section>
  );
}

function AIReviewSection() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Explain this architecture.",
    "What are the key risks?",
    "Recommend technologies for SOC automation.",
    "Generate milestones for a cloud security project.",
  ];

  const handleAsk = (q: string) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = question.toLowerCase();
      let answer = "";
      if (lower.includes("architecture")) {
        answer = "A layered microservices architecture with API Gateway, authentication service, core engine, worker pool, and monitoring stack. Key security controls include mTLS between services, OAuth2/OIDC for auth, and centralized logging. The API Gateway handles rate limiting, request validation, and routing. The worker pool processes async tasks for scalability.";
      } else if (lower.includes("risk") || lower.includes("threat")) {
        answer = "Primary risks: (1) Authentication bypass — mitigated by OAuth2/OIDC with PKCE and MFA. (2) Data exposure — mitigated by TLS 1.3 and AES-256 encryption. (3) DoS — mitigated by rate limiting and auto-scaling. (4) Supply chain — mitigated by SBOM and dependency scanning. Consider STRIDE threat modeling for systematic analysis.";
      } else if (lower.includes("soc") || lower.includes("automation")) {
        answer = "For a SOC automation project: use Python (FastAPI) for backend services, TypeScript (Next.js) for dashboards, PostgreSQL for case data, Elasticsearch for log search, and Redis for alert queues. Deploy with Docker Compose for dev, Kubernetes for production. Integrate with TheHive for case management and MISP for threat intel.";
      } else if (lower.includes("milestone") || lower.includes("cloud")) {
        answer = "Cloud Security Project Milestones: (1) Week 1-2: Requirements and architecture design. (2) Week 3-6: Core scanner implementation (AWS, Azure, GCP APIs). (3) Week 7-8: Policy engine with CIS benchmark rules. (4) Week 9-10: Dashboard and reporting. (5) Week 11-12: CI/CD integration and auto-remediation. (6) Week 13-14: Testing, documentation, and deployment.";
      } else {
        answer = "The AI Project Architect can help with architecture review, risk identification, technology recommendations, milestone generation, security considerations, and alternative comparisons. Ask specific questions about your project concept for detailed guidance.";
      }
      setResponse(answer);
      setLoading(false);
    }, 800);
  };

  return (
    <section id={SECTION_IDS.advisor} className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <GlassCard glow="purple" intensity="medium" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><IconRobot size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Project Reviewer</h2>
              <p className="text-xs text-muted-foreground">Ask about architecture, risks, technologies, milestones, and security considerations.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => { setQuery(s); handleAsk(s); }}
                className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-purple-500/30 transition-colors">
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
              placeholder="Ask about architecture, risks, or recommendations..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" />
            <Button variant="primary" size="md" onClick={() => handleAsk(query)} loading={loading}>Ask</Button>
          </div>
          <AnimatePresence>
            {response && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-start gap-2">
                  <IconRobot size={16} className="text-purple-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{response}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}

function ProjectComparison() {
  const [compare, setCompare] = useState<string[]>(["sample-threat-hunter", "sample-cloud-sec"]);
  const compareProjects = SAMPLE_CONCEPTS.filter((p) => compare.includes(p.id));

  return (
    <section id={SECTION_IDS.comparison} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Project Comparison</h2>
        <p className="text-muted-foreground mb-6">Compare generated architectures across technology, complexity, scalability, and learning value dimensions.</p>
        <div className="flex flex-wrap gap-1 mb-6">
          {SAMPLE_CONCEPTS.map((p) => (
            <button key={p.id} onClick={() => setCompare((prev) => prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev.slice(0, 1), p.id])}
              className={cn("text-xs px-2 py-1 rounded-lg border transition-colors",
                compare.includes(p.id) ? "border-purple-500/50 bg-purple-500/10 text-purple-400" : "border-white/10 text-muted-foreground hover:text-white")}>
              {p.title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {compareProjects.map((p) => (
            <GlassCard key={p.id} glow="none" intensity="low">
              <div className="text-xs font-medium text-white mb-3">{p.title}</div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Categories</span><span>{p.categories.map((c) => CATEGORIES[c].label).join(", ")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Skills Required</span><span>{p.relatedSkills.length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Features</span><span>{p.coreFeatures.length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Challenges</span><span>{p.technicalChallenges.length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-amber-400">{p.status.replace("-", " ")}</span></div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/5">
                <div className="flex flex-wrap gap-1">
                  {p.relatedSkills.slice(0, 4).map((s) => <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{s}</span>)}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecruiterModeView() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
          <IconBrain size={14} /> Recruiter Mode - Project Architect
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Completed Projects</h2>
        <p className="text-muted-foreground mb-8">Architected and delivered cybersecurity solutions with documented engineering methodology.</p>
        <GlassCard glow="none" className="text-center py-12">
          <IconCpu size={40} className="mx-auto mb-3 text-purple-400/50" />
          <p className="text-sm text-muted-foreground">
            Completed projects and documented architectures are displayed here in recruiter mode.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Concept generation and experimental tools are hidden in this view.
          </p>
        </GlassCard>
      </div>
    </section>
  );
}

export default function ProjectArchitectPage() {
  const recruiterMode = useUIStore((s) => s.recruiterMode);

  if (recruiterMode) return <RecruiterModeView />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <HeroSection onGenerate={() => document.getElementById(SECTION_IDS.generator)?.scrollIntoView({ behavior: "smooth" })} />
      <IdeaGenerator />
      <ArchitectureSection />
      <TechnologySection />
      <RoadmapSection />
      <FolderStructureSection />
      <SecurityArchSection />
      <ThreatModelSection />
      <TestingSection />
      <DocsSection />
      <DevOpsSection />
      <EstimatorSection />
      <SkillMappingSection />
      <ProjectComparison />
      <AIReviewSection />
    </div>
  );
}
