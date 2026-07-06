"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconSearch, IconX, IconCheck, IconShield, IconShieldCheck,
  IconServer, IconBrain, IconNetwork, IconLock, IconBug,
  IconAlertTriangle, IconArrowRight, IconDownload, IconBook,
  IconFileText, IconCode, IconUsers, IconDatabase, IconApi,
  IconZoomIn, IconZoomOut, IconMaximize, IconMinimize,
  IconHierarchy, IconConnection, IconRoute, IconMap,
  IconSitemap, IconBorderAll, IconLayersIntersect,
  IconChartBar, IconChartPie, IconPlus, IconMinus,
  IconSettings, IconCopy, IconExternalLink, IconStar,
  IconCertificate, IconReport, IconClipboardCheck,
  IconTimeline, IconRefresh, IconFilter, IconLayoutGrid,
  IconList, IconColumns, IconCpu,
} from "@tabler/icons-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import {
  ARCHITECTURES, STRIDE_FINDINGS, ATTACK_TREES, SECURITY_CONTROLS,
  RISKS, SECURITY_REQUIREMENTS, ADR_RECORDS, COMPLIANCE_MAPPINGS,
  SIMULATION_STEPS, ARCHITECTURE_COMPARISONS,
  getArchitectureById, getControlsForArchitecture, getRisksForArchitecture,
  getFindingsForArchitecture, getADRsForProject,
  type Architecture, type ThreatFinding, type AttackTree,
  type SecurityControl, type Risk, type ADR,
  type ComplianceMapping, type SimulationStep, type ArchitectureComparison,
} from "./architecture-data";
import { useUIStore } from "@/stores/ui-store";

const SECTION_IDS = {
  hero: "architect-hero",
  gallery: "architect-gallery",
  viewer: "architect-viewer",
  boundaries: "trust-boundaries",
  dataflows: "data-flow-diagrams",
  stride: "stride-workspace",
  attackTrees: "attack-tree-explorer",
  controls: "security-controls",
  risks: "risk-dashboard",
  requirements: "requirements-matrix",
  comparison: "architecture-comparison",
  aiArchitect: "ai-architect",
  adrs: "adr-records",
  compliance: "compliance-mapping",
  docs: "documentation-center",
  simulation: "simulation-mode",
} as const;

const STRIDE_COLORS: Record<string, string> = {
  spoofing: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  tampering: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  repudiation: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  information_disclosure: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  denial_of_service: "text-red-400 border-red-500/30 bg-red-500/10",
  elevation_of_privilege: "text-orange-400 border-orange-500/30 bg-orange-500/10",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "text-green-400 bg-green-500/10 border-green-500/30",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
};

const STATUS_COLORS: Record<string, string> = {
  mitigated: "text-green-400 bg-green-500/10 border-green-500/30",
  partial: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  open: "text-red-400 bg-red-500/10 border-red-500/30",
  accepted: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  improving: "text-green-400 bg-green-500/10 border-green-500/30",
  stable: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  worsening: "text-red-400 bg-red-500/10 border-red-500/30",
};

const TYPE_GLOW: Record<string, "cyan" | "purple" | "blue" | "green" | "amber"> = {
  web: "cyan",
  cloud: "blue",
  network: "green",
  ai: "purple",
  monolith: "amber",
  microservices: "cyan",
  hybrid: "purple",
  edge: "green",
};

const ARCH_TYPE_COLORS: Record<string, string> = {
  operational: "text-green-400 bg-green-500/10 border-green-500/30",
  concept: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  experimental: "text-purple-400 bg-purple-500/10 border-purple-500/30",
};

const FRAMEWORK_COLORS: Record<string, string> = {
  "OWASP ASVS": "text-blue-400 bg-blue-500/10 border-blue-500/30",
  "OWASP Top 10": "text-red-400 bg-red-500/10 border-red-500/30",
  "MITRE ATT&CK": "text-purple-400 bg-purple-500/10 border-purple-500/30",
  "CIS Controls": "text-green-400 bg-green-500/10 border-green-500/30",
  "NIST CSF": "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
};

const STRIDE_LABELS: Record<string, string> = {
  spoofing: "Spoofing",
  tampering: "Tampering",
  repudiation: "Repudiation",
  information_disclosure: "Information Disclosure",
  denial_of_service: "Denial of Service",
  elevation_of_privilege: "Elevation of Privilege",
};

type ViewMode = "gallery" | "viewer" | "stride" | "attack" | "controls" | "risks" | "adr" | "comparison";

// ─── Sub-Components ──────────────────────────────────────────────────────

function ArchitectureCard({ arch, onSelect, compact }: {
  arch: Architecture; onSelect: (id: string) => void; compact?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
      onClick={() => onSelect(arch.id)}
    >
      <GlassCard glow={TYPE_GLOW[arch.type]} variant={compact ? "small" : "default"}>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className={`font-semibold text-white ${compact ? "text-sm" : "text-lg"}`}>{arch.name}</h3>
              <p className={`text-gray-400 ${compact ? "text-xs" : "text-sm"} mt-0.5`}>{arch.tagline}</p>
            </div>
            <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium border ${ARCH_TYPE_COLORS[arch.status]}`}>
              {arch.status}
            </span>
          </div>
          {!compact && (
            <>
              <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{arch.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {arch.techStack.slice(0, compact ? 2 : 5).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-xs bg-white/5 text-gray-300 border border-white/10">{t}</span>
                ))}
                {arch.techStack.length > (compact ? 2 : 5) && (
                  <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-gray-500">+{arch.techStack.length - (compact ? 2 : 5)}</span>
                )}
              </div>
              <p className="text-xs text-cyan-400/80">{arch.securitySummary}</p>
            </>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function TrustBoundaryDiagram({ arch }: { arch: Architecture }) {
  const maxX = arch.layers.length > 4 ? 900 : 700;
  const layerW = Math.max(140, Math.min(220, Math.floor(maxX / arch.layers.length) - 20));
  const totalW = arch.layers.length * (layerW + 20);
  const startX = Math.max(0, (maxX - totalW) / 2);

  return (
    <div className="relative overflow-x-auto">
      <svg viewBox={`0 0 ${maxX} 350`} className="w-full max-w-4xl mx-auto" style={{ minHeight: 300 }}>
        <defs>
          <pattern id="trust-hatch" patternUnits="userSpaceOnUse" width="6" height="6">
            <path d="M0 6L6 0" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </pattern>
        </defs>
        {arch.trustBoundaries.map((tb, i) => {
          const x = 30 + (i * (maxX - 60)) / arch.trustBoundaries.length;
          const w = (maxX - 60) / arch.trustBoundaries.length - 4;
          return (
            <g key={tb.name}>
              <rect x={x} y={10} width={w} height={280} fill="url(#trust-hatch)" rx={8} stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4,4" />
              <text x={x + w / 2} y={305} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={10}>{tb.name}</text>
            </g>
          );
        })}
        {arch.layers.map((layer, li) => {
          const lx = startX + li * (layerW + 20);
          const ly = 30;
          const lh = 240;
          return (
            <g key={layer.name}>
              <rect x={lx} y={ly} width={layerW} height={lh} fill="rgba(6,182,212,0.05)" stroke="rgba(6,182,212,0.3)" strokeWidth={1} rx={6} />
              <text x={lx + layerW / 2} y={ly + 18} textAnchor="middle" fill="#22d3ee" fontSize={11} fontWeight={600}>{layer.name}</text>
              {layer.components.map((comp, ci) => {
                const cy = ly + 30 + ci * 38;
                return (
                  <g key={comp.name}>
                    <rect x={lx + 6} y={cy} width={layerW - 12} height={30} fill="rgba(255,255,255,0.04)" rx={4} />
                    <text x={lx + layerW / 2} y={cy + 12} textAnchor="middle" fill="#e2e8f0" fontSize={9} fontWeight={500}>{comp.name}</text>
                    {comp.trustBoundary && (
                      <text x={lx + layerW / 2} y={cy + 24} textAnchor="middle" fill="#f59e0b" fontSize={7}>⚠ {comp.trustBoundary}</text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DataFlowDiagram({ arch }: { arch: Architecture }) {
  const nodeSpacing = 160;
  const nodeR = 70;
  const nodes = arch.dataFlows.length > 0
    ? Array.from(new Set(arch.dataFlows.flatMap((f) => [f.from, f.to])))
    : ["Client", "Server", "Database"];
  const w = Math.max(600, nodes.length * nodeSpacing + 80);

  return (
    <div className="relative overflow-x-auto">
      <svg viewBox={`0 0 ${w} 280`} className="w-full max-w-4xl mx-auto" style={{ minHeight: 250 }}>
        {nodes.map((n, i) => {
          const cx = 40 + i * (w - 80) / (nodes.length - 1 || 1);
          return (
            <g key={n}>
              <rect x={cx - nodeR / 2} y={90} width={nodeR} height={40} rx={8} fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.4)" strokeWidth={1} />
              <text x={cx} y={115} textAnchor="middle" fill="#e2e8f0" fontSize={11} fontWeight={600}>{n}</text>
            </g>
          );
        })}
        {arch.dataFlows.map((df) => {
          const fromI = nodes.indexOf(df.from);
          const toI = nodes.indexOf(df.to);
          if (fromI === -1 || toI === -1) return null;
          const x1 = 40 + fromI * (w - 80) / (nodes.length - 1 || 1) + nodeR / 2;
          const y1 = 110;
          const x2 = 40 + toI * (w - 80) / (nodes.length - 1 || 1) - nodeR / 2;
          const y2 = 110;
          const mx = (x1 + x2) / 2;
          const my = y1 - 30;
          return (
            <g key={df.id}>
              <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke="rgba(6,182,212,0.5)" strokeWidth={2} markerEnd="url(#arrowhead)" />
              <rect x={mx - 60} y={my - 20} width={120} height={18} rx={4} fill="rgba(0,0,0,0.6)" />
              <text x={mx} y={my - 7} textAnchor="middle" fill="#22d3ee" fontSize={8}>{df.data}</text>
              <text x={mx} y={y1 + 30} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={7}>
                {df.classification} · {df.encryption === "none" ? "no enc" : df.encryption} · {df.authMethod}
              </text>
            </g>
          );
        })}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0,0 8,3 0,6" fill="rgba(6,182,212,0.5)" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

function AttackTreeGraph({ tree }: { tree: AttackTree }) {
  const w = 800;
  const pathH = 100;

  return (
    <div className="relative overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${tree.paths.length * pathH + 80}`} className="w-full max-w-4xl mx-auto" style={{ minHeight: 200 }}>
        <text x={w / 2} y={25} textAnchor="middle" fill="#f87171" fontSize={14} fontWeight={700}>{tree.goal}</text>
        <line x1={w / 2} y1={35} x2={w / 2} y2={55} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        {tree.paths.map((p, i) => {
          const py = 60 + i * pathH;
          const px = 40;
          return (
            <g key={p.id}>
              <line x1={w / 2} y1={50} x2={px + 10} y2={py + 15} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
              <rect x={px} y={py} width={w - 80} height={pathH - 15} rx={6} fill="rgba(251,191,36,0.05)" stroke="rgba(251,191,36,0.3)" strokeWidth={1} />
              <text x={px + 10} y={py + 16} fill="#fbbf24" fontSize={10} fontWeight={600}>{p.description}</text>
              <text x={px + 10} y={py + 32} fill="rgba(255,255,255,0.5)" fontSize={8}>
                Conditions: {p.conditions.join(", ")}
              </text>
              <text x={px + 10} y={py + 48} fill="rgba(6,182,212,0.6)" fontSize={8}>
                Controls: {p.controls.join(", ")}
              </text>
              <text x={px + 10} y={py + 64} fill="rgba(74,222,128,0.6)" fontSize={8}>
                Detection: {p.detection.join(", ")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function SimulationViewer({ steps }: { steps: SimulationStep[] }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <motion.div
          key={step.stage}
          className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
            activeStep === i
              ? "border-cyan-500/50 bg-cyan-500/10"
              : "border-white/10 bg-white/5 hover:border-white/20"
          }`}
          onClick={() => setActiveStep(activeStep === i ? null : i)}
          layout
        >
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${
              activeStep === i ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "bg-white/10 border-white/20 text-gray-400"
            }`}>{i + 1}</div>
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm">{step.stage}</h4>
              <p className="text-gray-400 text-xs">{step.description}</p>
            </div>
            {activeStep === i && <IconMinus size={16} className="text-cyan-400" />}
            {activeStep !== i && <IconPlus size={16} className="text-gray-500" />}
          </div>
          <AnimatePresence>
            {activeStep === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3 border-t border-white/10 mt-3">
                  <div>
                    <p className="text-xs text-cyan-400 font-medium mb-1.5">Security Controls</p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.securityControls.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-green-400 font-medium mb-1.5">Threats Mitigated</p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.threatsMitigated.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-300 border border-green-500/20">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────

export default function SecurityArchitectPage() {
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArch, setSelectedArch] = useState<string>(ARCHITECTURES[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [activeSimStep, setActiveSimStep] = useState<number | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [showDemoMarkers, setShowDemoMarkers] = useState(true);
  const [adrSearch, setAdrSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedCtrl, setSelectedCtrl] = useState<string | null>(null);
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);

  const arch = getArchitectureById(selectedArch);
  const archRisks = arch ? getRisksForArchitecture(arch.id) : [];
  const archControls = arch ? getControlsForArchitecture(arch.id) : [];
  const archFindings = arch ? getFindingsForArchitecture(arch.id) : [];
  const archADRs = arch ? getADRsForProject(arch.id) : [];

  const filteredArchs = useMemo(() => {
    if (!searchQuery) return ARCHITECTURES;
    const q = searchQuery.toLowerCase();
    return ARCHITECTURES.filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.tagline.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.techStack.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredADRs = useMemo(() => {
    if (!adrSearch) return ADR_RECORDS;
    const q = adrSearch.toLowerCase();
    return ADR_RECORDS.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.context.toLowerCase().includes(q) ||
      a.decision.toLowerCase().includes(q) ||
      a.problem.toLowerCase().includes(q)
    );
  }, [adrSearch]);

  const filteredControls = useMemo(() => {
    let ctrl = SECURITY_CONTROLS;
    if (arch) ctrl = ctrl.filter((c) => c.applicableArchitectures.includes(arch.id));
    if (filterStatus !== "all") ctrl = ctrl.filter((c) => c.applicableArchitectures.includes(filterStatus));
    return ctrl;
  }, [filterStatus, arch]);

  const filteredRisks = useMemo(() => {
    let r = RISKS;
    if (arch) r = r.filter((risk) => risk.architecture === arch.id);
    if (filterSeverity !== "all") r = r.filter((risk) => risk.severity === filterSeverity);
    return r;
  }, [filterSeverity, arch]);

  const handleAiQuery = useCallback(async (q: string) => {
    setAiQuery(q);
    setAiLoading(true);
    setAiResponse("");
    const queryLower = q.toLowerCase();
    let response = "";
    await new Promise((r) => setTimeout(r, 800));
    if (queryLower.includes("explain") || queryLower.includes("architecture")) {
      response = arch
        ? `The **${arch.name}** is a ${arch.type} architecture (${arch.status} status). It uses ${arch.techStack.join(", ")}. ${arch.description.slice(0, 200)}...`
        : "Select an architecture from the gallery to explore its design, components, and security posture.";
    } else if (queryLower.includes("trust") || queryLower.includes("boundary")) {
      const boundaries = arch?.trustBoundaries.map((b) => `**${b.name}**: ${b.description} (between ${b.between.join(", ")})`).join("\n");
      response = boundaries
        ? `Trust boundaries for **${arch?.name}**:\n${boundaries}`
        : "Trust boundaries define where security trust levels change. Select an architecture to visualise its boundaries.";
    } else if (queryLower.includes("threat")) {
      const findings = archFindings.map((f) => `- **${STRIDE_LABELS[f.category]}** in ${f.component}: ${f.description} (${f.status})`).join("\n");
      response = findings
        ? `Threat model for **${arch?.name}**:\n${findings}`
        : "Select an architecture to view its STRIDE threat model findings.";
    } else if (queryLower.includes("control") || queryLower.includes("mitigation")) {
      const controls = archControls.map((c) => `- **${c.name}** (${c.category}): ${c.purpose}`).join("\n");
      response = controls
        ? `Security controls for **${arch?.name}**:\n${controls}`
        : "Security controls are defence mechanisms. Select an architecture to see applicable controls.";
    } else if (queryLower.includes("defence") || queryLower.includes("defense") || queryLower.includes("depth")) {
      response = "Defence in depth layers: Perimeter (WAF, DDoS protection) → Network (segmentation, IDS) → Application (input validation, RBAC) → Data (encryption at rest, access controls) → Monitoring (SIEM, anomaly detection). Each layer provides redundancy if another fails.";
    } else if (queryLower.includes("trade")) {
      const comparisons = ARCHITECTURE_COMPARISONS.filter((c) => c.leftId === selectedArch || c.rightId === selectedArch);
      response = comparisons.length > 0
        ? comparisons.map((c) => {
            const other = c.leftId === selectedArch ? c.rightId : c.leftId;
            return c.dimensions.map((d) => `- **${d.label}**: ${d.left} vs ${d.right}${d.notes ? ` (${d.notes})` : ""}`).join("\n");
          }).join("\n")
        : "Trade-offs involve balancing security, availability, cost, and complexity. See the Architecture Comparison section for detailed trade-off analysis.";
    } else {
      response = "I can explain architectures, identify trust boundaries, summarise threat models, suggest controls, explain defence in depth, or describe architectural trade-offs. Try asking about a specific architecture!";
    }
    setAiResponse(response);
    setAiLoading(false);
  }, [arch, archFindings, archControls, selectedArch]);

  const aiSuggestions = [
    `Explain the ${arch?.name || "selected"} architecture`,
    "Identify trust boundaries",
    "Summarise the threat model",
    "Suggest additional security controls",
    "Explain defence in depth",
    "Describe architectural trade-offs",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ─── Hero ──────────────────────────────────────── */}
      <section id={SECTION_IDS.hero} className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
              <IconShield size={14} /> Chapter 30
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                Security Architecture Explorer
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Explore secure system designs, analyse trust boundaries, model threats, and understand how security controls mitigate risks across every architecture.
            </p>
            {!recruiterMode && (
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="primary" size="md" onClick={() => setViewMode("gallery")}>
                  <IconLayoutGrid size={16} /> Explore Architectures
                </Button>
                <Button variant="glass" size="md" onClick={() => setViewMode("stride")}>
                  <IconBug size={16} /> Threat Modeling
                </Button>
                <Button variant="glass" size="md" onClick={() => setViewMode("controls")}>
                  <IconShieldCheck size={16} /> Security Controls
                </Button>
                <Button variant="glass" size="md" onClick={() => setViewMode("risks")}>
                  <IconAlertTriangle size={16} /> Risk Dashboard
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── Recruiter Mode ────────────────────────────── */}
      {recruiterMode && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard glow="cyan">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <IconShieldCheck size={28} className="text-cyan-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">Security Architecture Summary</h2>
                    <p className="text-sm text-gray-400">Curated architectural decisions, controls, and security posture</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {ARCHITECTURES.filter((a) => a.status === "operational").map((arch) => (
                    <GlassCard key={arch.id} glow={TYPE_GLOW[arch.type]} variant="small">
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-white">{arch.name}</h3>
                        <p className="text-xs text-gray-400">{arch.tagline}</p>
                        <div className="flex flex-wrap gap-1">
                          {arch.techStack.slice(0, 3).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-gray-300 border border-white/10">{t}</span>
                          ))}
                        </div>
                        <p className="text-xs text-cyan-400/80">{arch.securitySummary}</p>
                      </div>
                    </GlassCard>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Key Engineering Decisions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ADR_RECORDS.filter((a) => a.status === "approved").slice(0, 4).map((adr) => (
                      <div key={adr.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <IconBook size={14} className="text-cyan-400" />
                          <span className="text-xs text-cyan-400 font-mono">{adr.id}</span>
                        </div>
                        <h4 className="text-sm text-white font-medium">{adr.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{adr.decision.slice(0, 120)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      )}

      {!recruiterMode && (
        <div className="max-w-6xl mx-auto px-4 pb-24 space-y-20">
          {/* ─── Architecture Gallery ─────────────────────── */}
          <section id={SECTION_IDS.gallery}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Architecture Gallery</h2>
                <p className="text-sm text-gray-400 mt-1">Select an architecture to explore its design, components, and security posture</p>
              </div>
              <div className="relative w-64">
                <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text" placeholder="Search architectures..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <IconX size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredArchs.map((a) => (
                <ArchitectureCard key={a.id} arch={a} onSelect={(id) => { setSelectedArch(id); setViewMode("viewer"); }} />
              ))}
            </div>
            {filteredArchs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <IconSearch size={40} className="mx-auto mb-3 opacity-30" />
                <p>No architectures found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </section>

          {/* ─── Architecture Viewer ─────────────────────── */}
          {arch && (
            <section id={SECTION_IDS.viewer}>
              <GlassCard glow={TYPE_GLOW[arch.type]}>
                <div className="p-6 space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{arch.name}</h2>
                        <p className="text-gray-400">{arch.tagline}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${ARCH_TYPE_COLORS[arch.status]}`}>{arch.status}</span>
                    </div>
                    <div className="flex gap-2">
                      {["overview", "layers", "boundaries", "dataflows"].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            activeTab === tab ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-gray-400 hover:text-white border border-transparent"
                          }`}
                        >{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                      ))}
                    </div>
                  </div>

                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">{arch.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {arch.techStack.map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded text-xs bg-white/5 text-gray-300 border border-white/10">{t}</span>
                        ))}
                      </div>
                      <p className="text-sm text-cyan-400/80"><IconShield size={14} className="inline mr-1" />{arch.securitySummary}</p>
                      <div className="flex flex-wrap gap-2">
                        {arch.relatedProjects.map((p) => (
                          <span key={p} className="px-2.5 py-1 rounded text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "layers" && (
                    <div className="space-y-4">
                      {arch.layers.map((layer) => (
                        <div key={layer.name} className="border border-white/10 rounded-lg overflow-hidden">
                          <button onClick={() => setSelectedLayer(selectedLayer === layer.name ? null : layer.name)}
                            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <span className="text-cyan-400 font-medium text-sm">{layer.name}</span>
                            {selectedLayer === layer.name ? <IconMinus size={16} className="text-cyan-400" /> : <IconPlus size={16} className="text-gray-500" />}
                          </button>
                          <AnimatePresence>
                            {selectedLayer === layer.name && (
                              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                <div className="p-3 space-y-2">
                                  {layer.components.map((comp) => (
                                    <div key={comp.name} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                      <p className="text-white text-sm font-medium">{comp.name}</p>
                                      <p className="text-gray-400 text-xs mt-0.5">{comp.description}</p>
                                      {comp.trustBoundary && (
                                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                          ⚠ {comp.trustBoundary}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "boundaries" && (
                    <div className="space-y-4">
                      <TrustBoundaryDiagram arch={arch} />
                      <div className="space-y-3">
                        {arch.trustBoundaries.map((tb) => (
                          <div key={tb.name} className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <h4 className="text-cyan-400 text-sm font-medium">{tb.name}</h4>
                            <p className="text-gray-400 text-xs mt-0.5">{tb.description}</p>
                            <p className="text-gray-500 text-xs mt-1">Between: {tb.between.join(", ")}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "dataflows" && (
                    <div className="space-y-4">
                      <DataFlowDiagram arch={arch} />
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-2 px-3 text-gray-400 font-medium">Data Flow</th>
                              <th className="text-left py-2 px-3 text-gray-400 font-medium">From → To</th>
                              <th className="text-left py-2 px-3 text-gray-400 font-medium">Classification</th>
                              <th className="text-left py-2 px-3 text-gray-400 font-medium">Encryption</th>
                              <th className="text-left py-2 px-3 text-gray-400 font-medium">Auth</th>
                              <th className="text-left py-2 px-3 text-gray-400 font-medium">Logging</th>
                            </tr>
                          </thead>
                          <tbody>
                            {arch.dataFlows.map((df) => (
                              <tr key={df.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-2 px-3 text-gray-300">{df.data}</td>
                                <td className="py-2 px-3 text-gray-300">{df.from} → {df.to}</td>
                                <td className="py-2 px-3"><span className={`px-1.5 py-0.5 rounded text-xs border ${SEVERITY_COLORS[df.classification === "restricted" ? "critical" : df.classification === "confidential" ? "high" : df.classification === "internal" ? "medium" : "low"]}`}>{df.classification}</span></td>
                                <td className="py-2 px-3 text-gray-300">{df.encryption}</td>
                                <td className="py-2 px-3 text-gray-300">{df.authMethod}</td>
                                <td className="py-2 px-3"><span className={`px-1.5 py-0.5 rounded text-xs border ${df.logging === "siem" ? "text-green-400 border-green-500/30 bg-green-500/10" : df.logging === "audit" ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" : df.logging === "basic" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" : "text-gray-500 border-gray-500/30 bg-gray-500/10"}`}>{df.logging}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </section>
          )}

          {/* ─── STRIDE Workspace ────────────────────────── */}
          <section id={SECTION_IDS.stride}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Threat Modeling Studio</h2>
              <p className="text-sm text-gray-400 mt-1">STRIDE analysis across architecture components — evaluating spoofing, tampering, repudiation, information disclosure, DoS, and privilege escalation</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {(["spoofing", "tampering", "repudiation", "information_disclosure", "denial_of_service", "elevation_of_privilege"] as const).map((cat) => {
                const count = STRIDE_FINDINGS.filter((f) => f.category === cat).length;
                return (
                  <GlassCard key={cat} glow="none" variant="small">
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${STRIDE_COLORS[cat]}`}>
                          <IconBug size={16} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{STRIDE_LABELS[cat]}</p>
                          <p className="text-gray-500 text-xs">{count} findings</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
            {arch && (
              <div className="space-y-3">
                {archFindings.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">No STRIDE findings mapped to this architecture yet.</div>
                )}
                {archFindings.map((f) => (
                  <motion.div key={f.id} layout
                    className={`border rounded-lg overflow-hidden ${expandedFinding === f.id ? "border-cyan-500/30" : "border-white/10"}`}
                  >
                    <button onClick={() => setExpandedFinding(expandedFinding === f.id ? null : f.id)}
                      className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${STRIDE_COLORS[f.category]}`}>{STRIDE_LABELS[f.category]}</span>
                        <span className="text-white text-sm">{f.component}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${SEVERITY_COLORS[f.likelihood]}`}>{f.likelihood}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[f.status]}`}>{f.status}</span>
                        {expandedFinding === f.id ? <IconMinus size={14} className="text-gray-400" /> : <IconPlus size={14} className="text-gray-400" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedFinding === f.id && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-4 space-y-3 border-t border-white/10">
                            <p className="text-gray-300 text-sm">{f.description}</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Mitigation</p>
                                <p className="text-sm text-green-300">{f.mitigation}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Evidence</p>
                                <p className="text-sm text-cyan-300">{f.evidence}</p>
                              </div>
                            </div>
                            {f.controlIds.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Related Controls</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {f.controlIds.map((cId) => {
                                    const ctrl = SECURITY_CONTROLS.find((c) => c.id === cId);
                                    return (
                                      <span key={cId} className="px-2 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{ctrl?.name || cId}</span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* ─── Attack Tree Explorer ────────────────────── */}
          <section id={SECTION_IDS.attackTrees}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Attack Tree Explorer</h2>
              <p className="text-sm text-gray-400 mt-1">Interactive visualisation of attack paths, required conditions, and defensive controls</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {ATTACK_TREES.map((tree) => (
                <GlassCard key={tree.id} glow="amber">
                  <div className="p-6 space-y-4">
                    <AttackTreeGraph tree={tree} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tree.paths.map((p) => (
                        <div key={p.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-amber-400 text-xs font-medium mb-1">Path</p>
                          <p className="text-white text-sm mb-2">{p.description}</p>
                          <p className="text-xs text-gray-500 mb-1">Conditions</p>
                          <ul className="text-xs text-gray-400 space-y-0.5 mb-2 ml-3 list-disc">
                            {p.conditions.map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                          <p className="text-xs text-cyan-400 mb-1">Controls</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {p.controls.map((c, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{c}</span>
                            ))}
                          </div>
                          <p className="text-xs text-green-400 mb-1">Detection</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {p.detection.map((d, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-green-500/10 text-green-300 border border-green-500/20">{d}</span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mb-1">Mitigation</p>
                          <p className="text-xs text-gray-300">{p.mitigation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* ─── Security Control Library ────────────────── */}
          <section id={SECTION_IDS.controls}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Security Control Library</h2>
                <p className="text-sm text-gray-400 mt-1">Catalog of security controls mapped to architectures with implementation guidance</p>
              </div>
              <div className="flex gap-2">
                {["all", ...Array.from(new Set(SECURITY_CONTROLS.map((c) => c.category)))].map((cat) => (
                  <button key={cat} onClick={() => setFilterStatus(cat === "all" ? "all" : cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      filterStatus === cat || (cat !== "all" && filterStatus === cat)
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "text-gray-400 hover:text-white border border-transparent"
                    }`}
                  >{cat}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredControls.map((ctrl) => (
                <motion.div key={ctrl.id} layout>
                  <GlassCard glow="none" variant="small">
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-cyan-400 font-mono">{ctrl.id}</span>
                        <span className="px-1.5 py-0.5 rounded text-xs bg-white/10 text-gray-300 border border-white/20">{ctrl.category}</span>
                      </div>
                      <h3 className="text-white text-sm font-semibold">{ctrl.name}</h3>
                      <p className="text-gray-400 text-xs">{ctrl.purpose}</p>
                      <div className="flex flex-wrap gap-1">
                        {ctrl.applicableArchitectures.slice(0, 3).map((aId) => {
                          const a = getArchitectureById(aId);
                          return a ? (
                            <span key={aId} className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-gray-400 border border-white/10">{a.name}</span>
                          ) : null;
                        })}
                      </div>
                      <button onClick={() => setSelectedCtrl(selectedCtrl === ctrl.id ? null : ctrl.id)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        {selectedCtrl === ctrl.id ? "Hide notes" : "Show implementation notes"}
                      </button>
                      <AnimatePresence>
                        {selectedCtrl === ctrl.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <p className="text-xs text-gray-300 mt-1 p-2 rounded bg-white/5 border border-white/10">{ctrl.implementationNotes}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ─── Risk Dashboard ──────────────────────────── */}
          <section id={SECTION_IDS.risks}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Risk Dashboard</h2>
              <p className="text-sm text-gray-400 mt-1">Open, mitigated, and accepted risks across architectures</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <GlassCard glow="amber" variant="small">
                <div className="p-4 text-center">
                  <p className="text-3xl font-bold text-red-400">{RISKS.filter((r) => r.status === "open").length}</p>
                  <p className="text-xs text-gray-400 mt-1">Open Risks</p>
                </div>
              </GlassCard>
              <GlassCard glow="green" variant="small">
                <div className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-400">{RISKS.filter((r) => r.status === "mitigated").length}</p>
                  <p className="text-xs text-gray-400 mt-1">Mitigated</p>
                </div>
              </GlassCard>
              <GlassCard glow="blue" variant="small">
                <div className="p-4 text-center">
                  <p className="text-3xl font-bold text-blue-400">{RISKS.filter((r) => r.status === "accepted").length}</p>
                  <p className="text-xs text-gray-400 mt-1">Accepted</p>
                </div>
              </GlassCard>
              <GlassCard glow="cyan" variant="small">
                <div className="p-4 text-center">
                  <p className="text-3xl font-bold text-cyan-400">{RISKS.filter((r) => r.trend === "improving").length}</p>
                  <p className="text-xs text-gray-400 mt-1">Improving</p>
                </div>
              </GlassCard>
            </div>
            {filterStatus !== "all" && (
              <div className="flex gap-2 mb-4">
                {["all", "low", "medium", "high", "critical"].map((s) => (
                  <button key={s} onClick={() => setFilterSeverity(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filterSeverity === s ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-gray-400 hover:text-white border border-transparent"
                    }`}
                  >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                ))}
              </div>
            )}
            <div className="space-y-3">
              {filteredRisks.map((risk) => (
                <motion.div key={risk.id} layout
                  className={`border rounded-lg overflow-hidden ${expandedRisk === risk.id ? "border-cyan-500/30" : "border-white/10"}`}
                >
                  <button onClick={() => setExpandedRisk(expandedRisk === risk.id ? null : risk.id)}
                    className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${SEVERITY_COLORS[risk.severity]}`}>{risk.severity}</span>
                      <span className="text-white text-sm">{risk.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-1.5 py-0.5 rounded text-xs border ${STATUS_COLORS[risk.status]}`}>{risk.status}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs border ${STATUS_COLORS[risk.trend]}`}>{risk.trend}</span>
                      {expandedRisk === risk.id ? <IconMinus size={14} className="text-gray-400" /> : <IconPlus size={14} className="text-gray-400" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedRisk === risk.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-4 space-y-3 border-t border-white/10">
                          <p className="text-gray-300 text-sm">{risk.description}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">Architecture</p>
                              <p className="text-sm text-white">{getArchitectureById(risk.architecture)?.name || risk.architecture}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Category</p>
                              <p className="text-sm text-white">{risk.category}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Owner</p>
                              <p className="text-sm text-white">{risk.owner}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Mitigation</p>
                              <p className="text-sm text-green-300">{risk.mitigation}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ─── Security Requirements Matrix ────────────── */}
          <section id={SECTION_IDS.requirements}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Security Requirements Matrix</h2>
              <p className="text-sm text-gray-400 mt-1">Traceability from security requirements through components, controls, and threats</p>
            </div>
            <GlassCard glow="none">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Requirement</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Component</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Control</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Threat</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Evidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECURITY_REQUIREMENTS.map((sr) => (
                      <tr key={sr.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-gray-200 max-w-xs">{sr.requirement}</td>
                        <td className="py-3 px-4 text-gray-300">{sr.component}</td>
                        <td className="py-3 px-4"><span className="px-1.5 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{sr.control}</span></td>
                        <td className="py-3 px-4 text-gray-300">{sr.threat}</td>
                        <td className="py-3 px-4 text-gray-400 font-mono text-xs">{sr.evidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </section>

          {/* ─── Architecture Comparison ─────────────────── */}
          <section id={SECTION_IDS.comparison}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Architecture Comparison</h2>
              <p className="text-sm text-gray-400 mt-1">Comparative analysis of architectural trade-offs across dimensions</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {ARCHITECTURE_COMPARISONS.map((comp) => {
                const left = getArchitectureById(comp.leftId);
                const right = getArchitectureById(comp.rightId);
                if (!left || !right) return null;
                return (
                  <GlassCard key={`${comp.leftId}-${comp.rightId}`} glow="cyan">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-center gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-white">{left.name}</p>
                          <p className="text-xs text-gray-400">{left.type} · {left.status}</p>
                        </div>
                        <div className="text-gray-500 text-2xl font-bold">VS</div>
                        <div>
                          <p className="text-lg font-bold text-white">{right.name}</p>
                          <p className="text-xs text-gray-400">{right.type} · {right.status}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {comp.dimensions.map((d) => (
                          <div key={d.label} className="border border-white/10 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-cyan-400 font-medium">{d.label}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-2 rounded bg-cyan-500/5 border border-cyan-500/10">
                                <p className="text-xs text-gray-200">{d.left}</p>
                              </div>
                              <div className="p-2 rounded bg-purple-500/5 border border-purple-500/10">
                                <p className="text-xs text-gray-200">{d.right}</p>
                              </div>
                            </div>
                            {d.notes && (
                              <p className="text-xs text-gray-500 mt-1 italic">{d.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>

          {/* ─── AI Security Architect ───────────────────── */}
          <section id={SECTION_IDS.aiArchitect}>
            <GlassCard glow="purple">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <IconBrain size={24} className="text-purple-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Security Architect</h2>
                    <p className="text-sm text-gray-400">Ask questions about the architecture, trust boundaries, threat model, or security controls</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((s) => (
                    <button key={s} onClick={() => handleAiQuery(s)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                    >{s}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && aiQuery && handleAiQuery(aiQuery)}
                    placeholder="Ask about security architecture..."
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  />
                  <Button variant="primary" size="md" onClick={() => aiQuery && handleAiQuery(aiQuery)} disabled={aiLoading || !aiQuery}>
                    <IconBrain size={16} /> Ask
                  </Button>
                </div>
                <AnimatePresence>
                  {(aiLoading || aiResponse) && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 min-h-[80px]"
                    >
                      {aiLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                          <span className="text-sm text-gray-400">Analysing architecture...</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{aiResponse}</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </section>

          {/* ─── ADR Records ─────────────────────────────── */}
          <section id={SECTION_IDS.adrs}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Architecture Decision Records</h2>
                <p className="text-sm text-gray-400 mt-1">Documented architectural decisions with context, alternatives, and consequences</p>
              </div>
              <div className="relative w-64">
                <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search ADRs..." value={adrSearch} onChange={(e) => setAdrSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredADRs.map((adr) => (
                <GlassCard key={adr.id} glow="none" variant="small">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconBook size={16} className="text-cyan-400" />
                        <span className="text-xs text-cyan-400 font-mono">{adr.id}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs border ${
                          adr.status === "approved" ? "text-green-400 border-green-500/30 bg-green-500/10" :
                          adr.status === "proposed" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
                          "text-gray-400 border-gray-500/30 bg-gray-500/10"
                        }`}>{adr.status}</span>
                      </div>
                      <span className="text-xs text-gray-500">v{adr.version} · {adr.date}</span>
                    </div>
                    <h3 className="text-white font-medium">{adr.title}</h3>
                    <p className="text-xs text-gray-500"><span className="text-gray-400">Context:</span> {adr.context}</p>
                    <p className="text-xs text-gray-500"><span className="text-gray-400">Problem:</span> {adr.problem}</p>
                    <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                      <p className="text-xs text-cyan-400 font-medium mb-1">Decision</p>
                      <p className="text-sm text-gray-200">{adr.decision}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Alternatives considered</p>
                      <ul className="text-xs text-gray-400 space-y-0.5 ml-3 list-disc">
                        {adr.alternatives.map((alt, i) => <li key={i}>{alt}</li>)}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {adr.relatedProjects.map((p) => (
                          <span key={p} className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-gray-400 border border-white/10">{p}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 italic">{adr.consequences}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* ─── Compliance Mapping ──────────────────────── */}
          <section id={SECTION_IDS.compliance}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Compliance Mapping</h2>
              <p className="text-sm text-gray-400 mt-1">Security controls mapped to industry frameworks — OWASP ASVS, MITRE ATT&CK, CIS Controls, NIST CSF</p>
              <p className="text-xs text-amber-400/70 mt-1">⚠ These mappings are educational references unless formally assessed.</p>
            </div>
            <GlassCard glow="none">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Framework</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Control</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Description</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Architecture</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPLIANCE_MAPPINGS.map((cm, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <span className={`px-1.5 py-0.5 rounded text-xs border ${FRAMEWORK_COLORS[cm.framework] || "text-gray-400 border-gray-500/30 bg-gray-500/10"}`}>{cm.framework}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-200 font-medium">{cm.control}</td>
                        <td className="py-3 px-4 text-gray-300">{cm.description}</td>
                        <td className="py-3 px-4 text-gray-400">{getArchitectureById(cm.architecture)?.name || cm.architecture}</td>
                        <td className="py-3 px-4">
                          <span className={`px-1.5 py-0.5 rounded text-xs border ${
                            cm.status === "mapped" ? "text-green-400 border-green-500/30 bg-green-500/10" :
                            cm.status === "partial" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
                            "text-blue-400 border-blue-500/30 bg-blue-500/10"
                          }`}>{cm.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </section>

          {/* ─── Documentation Center ────────────────────── */}
          <section id={SECTION_IDS.docs}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Documentation Center</h2>
              <p className="text-sm text-gray-400 mt-1">Architecture documents, threat model reports, and operational runbooks</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: IconSitemap, title: "Architecture Overview", desc: "High-level system design with component interaction and trust boundaries", color: "text-cyan-400" },
                { icon: IconBug, title: "Threat Model Report", desc: "STRIDE analysis with mitigation status and residual risks", color: "text-amber-400" },
                { icon: IconAlertTriangle, title: "Risk Register", desc: "Consolidated risk inventory with severity, status, and ownership", color: "text-red-400" },
                { icon: IconClipboardCheck, title: "Security Requirements", desc: "Traceability matrix linking requirements to controls and evidence", color: "text-green-400" },
                { icon: IconServer, title: "Deployment Guide", desc: "Environment-specific deployment instructions with security baselines", color: "text-blue-400" },
                { icon: IconFileText, title: "Operational Runbook", desc: "Day-to-day operations, monitoring, and incident response procedures", color: "text-purple-400" },
                { icon: IconBook, title: "Architecture Decision Records", desc: "ADR repository with context, decisions, and consequences", color: "text-cyan-400" },
                { icon: IconCertificate, title: "Compliance Report", desc: "Framework mapping summary with evidence references", color: "text-green-400" },
                { icon: IconTimeline, title: "Incident Response Plan", desc: "Structured response procedures with escalation paths", color: "text-orange-400" },
              ].map((doc) => (
                <GlassCard key={doc.title} glow="none" variant="small">
                  <div className="p-4 space-y-2">
                    <doc.icon size={24} className={doc.color} />
                    <h3 className="text-white font-medium text-sm">{doc.title}</h3>
                    <p className="text-gray-400 text-xs">{doc.desc}</p>
                    <Button variant="ghost" size="sm">
                      <IconDownload size={14} /> Generate
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* ─── Simulation Mode ─────────────────────────── */}
          <section id={SECTION_IDS.simulation}>
            <GlassCard glow="cyan">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Simulation Mode</h2>
                    <p className="text-sm text-gray-400">Educational walkthrough of a request lifecycle — click each step to inspect security controls</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20">Educational Simulation</span>
                </div>
                <SimulationViewer steps={SIMULATION_STEPS} />
              </div>
            </GlassCard>
          </section>
        </div>
      )}

      {/* ─── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-8 px-4 text-center">
        <p className="text-sm text-gray-500">Security Architecture Explorer · Chapter 30 · Cyber Nexus</p>
        <p className="text-xs text-gray-600 mt-1">All architectures and threat models are documented for educational purposes.</p>
      </footer>
    </div>
  );
}
