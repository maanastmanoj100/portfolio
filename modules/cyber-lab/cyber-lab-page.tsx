"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  virtualMachines, containers, networkNodes, networkConnections,
  securityStack, loggingPipeline, monitoringMetrics, cloudResources,
  automationWorkflows, architectureDocuments, activeDirectory,
  labStats, labVersion, lastUpdated,
  type VirtualMachine, type Container, type NetworkNode, type VMStatus, type LabTag,
} from "./lab-data";
import {
  IconServer, IconBox, IconNetwork, IconCloud, IconShield,
  IconSearch, IconX, IconFilter, IconCpu, IconDeviceDesktop,
  IconTerminal2, IconBrain, IconBook, IconChevronDown,
  IconChevronUp, IconArrowRight, IconCheck, IconBug, IconCode,
  IconDatabase, IconChartBar, IconSettings, IconGlobe, IconFlag,
  IconStar, IconClock, IconFolder, IconRefresh,
} from "@tabler/icons-react";

const ZONE_COLORS: Record<string, string> = {
  dmz: "text-orange-400 border-orange-500/30 bg-orange-500/10",
  internal: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  management: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  monitoring: "text-green-400 border-green-500/30 bg-green-500/10",
  development: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  user: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  cloud: "text-sky-400 border-sky-500/30 bg-sky-500/10",
};

const STATUS_COLORS: Record<string, string> = {
  running: "text-green-400",
  stopped: "text-red-400",
  planned: "text-amber-400",
  active: "text-green-400",
  maintenance: "text-amber-400",
};

const TAG_LABELS: Record<LabTag, string> = {
  operational: "Operational",
  experimental: "Experimental",
  planned: "Planned",
  conceptual: "Conceptual",
};

const TAG_COLORS: Record<LabTag, string> = {
  operational: "text-green-400 bg-green-400/10",
  experimental: "text-amber-400 bg-amber-400/10",
  planned: "text-blue-400 bg-blue-400/10",
  conceptual: "text-purple-400 bg-purple-400/10",
};

const SECTION_IDS = {
  hero: "lab-hero",
  overview: "lab-overview",
  topology: "lab-topology",
  vms: "lab-vms",
  containers: "lab-containers",
  ad: "lab-ad",
  cloud: "lab-cloud",
  security: "lab-security",
  pipeline: "lab-pipeline",
  monitoring: "lab-monitoring",
  automation: "lab-automation",
  docs: "lab-docs",
  assistant: "lab-assistant",
};

function HeroSection() {
  const stats = [
    { label: "Virtual Machines", value: labStats.virtualMachines, icon: <IconServer size={20} />, color: "cyan" },
    { label: "Containers", value: labStats.containers, icon: <IconBox size={20} />, color: "purple" },
    { label: "Security Tools", value: labStats.securityTools, icon: <IconShield size={20} />, color: "green" },
    { label: "Networks", value: labStats.networks, icon: <IconNetwork size={20} />, color: "blue" },
  ] as const;

  return (
    <section id={SECTION_IDS.hero} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <IconServer size={14} />Chapter 23 — Lab Infrastructure & Engineering
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Cyber Lab &<br />Home Infrastructure
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore the cybersecurity laboratory, virtual environments, monitoring systems,
            security stack, and engineering architecture powering Cyber Nexus.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => document.getElementById(SECTION_IDS.topology)?.scrollIntoView({ behavior: "smooth" })}>
              Explore Lab
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById(SECTION_IDS.vms)?.scrollIntoView({ behavior: "smooth" })}>
              Virtual Machines
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById(SECTION_IDS.docs)?.scrollIntoView({ behavior: "smooth" })}>
              Documentation
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          {stats.map((s) => (
            <GlassCard key={s.label} glow={s.color as "cyan" | "purple" | "green" | "blue"} intensity="low" variant="small" className="text-center">
              <div className="flex justify-center mb-1 text-cyan-400">{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LabOverview() {
  const allItems = [
    { label: "Virtual Machines", value: labStats.virtualMachines, icon: IconServer },
    { label: "Containers", value: labStats.containers, icon: IconBox },
    { label: "Operating Systems", value: labStats.operatingSystems, icon: IconTerminal2 },
    { label: "Networks", value: labStats.networks, icon: IconNetwork },
    { label: "Projects Hosted", value: labStats.projectsHosted, icon: IconFlag },
    { label: "Monitoring Stack", value: labStats.monitoringStack, icon: IconChartBar },
    { label: "Security Tools", value: labStats.securityTools, icon: IconShield },
    { label: "Cloud Services", value: labStats.cloudServices, icon: IconCloud },
  ];

  return (
    <section id={SECTION_IDS.overview} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Lab Overview</h2>
        <p className="text-muted-foreground mb-2">Infrastructure summary — v{labVersion} · Updated {lastUpdated}</p>
        <p className="text-xs text-muted-foreground mb-8 italic">Operational lab environment for cybersecurity training, development, and research. All systems are isolated from production networks.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allItems.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard glow="none" variant="small" className="text-center">
                <item.icon size={18} className="mx-auto mb-1 text-cyan-400" />
                <div className="text-lg font-bold text-white">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NetworkTopology() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const typeIcons: Record<string, React.ReactNode> = {
    router: <IconNetwork size={14} />,
    firewall: <IconShield size={14} />,
    switch: <IconNetwork size={14} />,
    server: <IconServer size={14} />,
    vm: <IconDeviceDesktop size={14} />,
    container: <IconBox size={14} />,
    cloud: <IconCloud size={14} />,
    internet: <IconGlobe size={14} />,
  };

  const zoneBgColors: Record<string, string> = {
    dmz: "bg-orange-500/20 border-orange-500/40",
    internal: "bg-cyan-500/20 border-cyan-500/40",
    management: "bg-purple-500/20 border-purple-500/40",
    monitoring: "bg-green-500/20 border-green-500/40",
    cloud: "bg-sky-500/20 border-sky-500/40",
    user: "bg-amber-500/20 border-amber-500/40",
  };

  return (
    <section id={SECTION_IDS.topology} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Network Topology</h2>
        <p className="text-muted-foreground mb-8">Interactive network map — click any node for details</p>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard glow="cyan" intensity="low" className="relative overflow-hidden" style={{ minHeight: 500 }}>
              <svg viewBox="0 0 100 85" className="w-full h-full" style={{ minHeight: 450 }}>
                {networkConnections.map((conn) => {
                  const fromN = networkNodes.find((n) => n.id === conn.from);
                  const toN = networkNodes.find((n) => n.id === conn.to);
                  if (!fromN || !toN) return null;
                  const isHighlighted = hoveredNode && (hoveredNode === conn.from || hoveredNode === conn.to);
                  return (
                    <g key={`${conn.from}-${conn.to}`}>
                      <line
                        x1={fromN.x} y1={fromN.y} x2={toN.x} y2={toN.y}
                        stroke={isHighlighted ? "#22d3ee" : "#ffffff20"}
                        strokeWidth={isHighlighted ? 1.5 : 0.8}
                        className="transition-all duration-300"
                      />
                      {conn.label && (
                        <text
                          x={(fromN.x + toN.x) / 2} y={(fromN.y + toN.y) / 2 - 1.5}
                          fill="#ffffff60" fontSize={2} textAnchor="middle"
                        >
                          {conn.label}
                        </text>
                      )}
                    </g>
                  );
                })}
                {networkNodes.map((node) => (
                  <g key={node.id}>
                    <rect
                      x={node.x - 9} y={node.y - 5} width={18} height={10} rx={2} ry={2}
                      fill={hoveredNode === node.id || selectedNode?.id === node.id ? "#22d3ee30" : "#ffffff08"}
                      stroke={hoveredNode === node.id || selectedNode?.id === node.id ? "#22d3ee" : "#ffffff30"}
                      strokeWidth={hoveredNode === node.id ? 1 : 0.5}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                    />
                    {node.type === "internet" || node.type === "cloud"
                      ? <circle cx={node.x} cy={node.y} r={4} fill={hoveredNode === node.id ? "#22d3ee" : "#ffffff40"} className="cursor-pointer" onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)} />
                      : null}
                    <text
                      x={node.x} y={node.y + 0.5}
                      fill={hoveredNode === node.id ? "#22d3ee" : "#ffffff"} fontSize={2.2}
                      textAnchor="middle" dominantBaseline="middle"
                      className="pointer-events-none select-none"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </GlassCard>
          </div>
          <div className="space-y-3">
            <GlassCard glow="none" variant="small">
              <h3 className="text-xs font-semibold text-white mb-2">Zones</h3>
              <div className="space-y-1.5">
                {["dmz", "internal", "management", "monitoring", "cloud"].map((zone) => (
                  <div key={zone} className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", zone === "dmz" ? "bg-orange-400" : zone === "internal" ? "bg-cyan-400" : zone === "management" ? "bg-purple-400" : zone === "monitoring" ? "bg-green-400" : "bg-sky-400")} />
                    <span className="text-xs capitalize text-muted-foreground">{zone}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div key={selectedNode.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                  <GlassCard glow="cyan" intensity="medium">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">{selectedNode.label}</h3>
                      <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-white"><IconX size={14} /></button>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="text-white capitalize">{selectedNode.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Zone:</span>
                        <span className={cn("capitalize", ZONE_COLORS[selectedNode.zone]?.split(" ")[0] || "text-white")}>{selectedNode.zone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={STATUS_COLORS[selectedNode.status]}>{selectedNode.status}</span>
                      </div>
                      <p className="text-muted-foreground pt-1">{selectedNode.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <GlassCard glow="none" variant="small">
                    <p className="text-xs text-muted-foreground text-center py-4">Click a network node to view details</p>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
            <GlassCard glow="none" variant="small">
              <h3 className="text-xs font-semibold text-white mb-2">Connections</h3>
              <div className="space-y-1">
                {networkConnections.slice(0, 6).map((conn) => (
                  <div key={`${conn.from}-${conn.to}`} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{networkNodes.find((n) => n.id === conn.from)?.label}</span>
                    <IconArrowRight size={8} />
                    <span>{networkNodes.find((n) => n.id === conn.to)?.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function VMCard({ vm }: { vm: VirtualMachine }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlassCard glow={expanded ? "cyan" : "none"} intensity="low" className="h-full">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white text-sm truncate">{vm.name}</h3>
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full shrink-0", STATUS_COLORS[vm.status])}>{vm.status}</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{vm.purpose}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <IconDeviceDesktop size={10} /><span>{vm.os}</span>
        <IconCpu size={10} /><span>{vm.cpu}</span>
        <IconDatabase size={10} /><span>{vm.memory}</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        <span className={cn("text-xs px-1.5 py-0.5 rounded-full", ZONE_COLORS[vm.networkZone])}>{vm.networkZone}</span>
        <span className={cn("text-xs px-1.5 py-0.5 rounded-full", TAG_COLORS[vm.tag])}>{TAG_LABELS[vm.tag]}</span>
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">{vm.securityRole}</span>
      </div>
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
        {expanded ? "Less" : "Details"} {expanded ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-2 border-t border-white/5 mt-2 space-y-2">
              <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">Services</div>
                <div className="flex flex-wrap gap-1">{vm.services.map((s) => <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{s}</span>)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">Projects</div>
                <div className="flex flex-wrap gap-1">{vm.projects.map((p) => <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{p}</span>)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium mb-1">Skills</div>
                <div className="flex flex-wrap gap-1">{vm.relatedSkills.map((s) => <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">{s}</span>)}</div>
              </div>
              <div className="text-xs text-muted-foreground">IP: {vm.ip}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function VMExplorer() {
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<VMStatus | "All">("All");

  const filtered = useMemo(() => {
    return virtualMachines.filter((vm) => {
      if (search && !vm.name.toLowerCase().includes(search.toLowerCase()) && !vm.purpose.toLowerCase().includes(search.toLowerCase()) && !vm.os.toLowerCase().includes(search.toLowerCase())) return false;
      if (zoneFilter !== "All" && vm.networkZone !== zoneFilter) return false;
      if (statusFilter !== "All" && vm.status !== statusFilter) return false;
      return true;
    });
  }, [search, zoneFilter, statusFilter]);

  return (
    <section id={SECTION_IDS.vms} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Virtual Machine Explorer</h2>
            <p className="text-muted-foreground">{filtered.length} of {virtualMachines.length} VMs</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search VMs..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
          </div>
          <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs">
            <option value="All">All Zones</option>
            {["dmz", "internal", "management", "monitoring", "cloud"].map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as VMStatus | "All")}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs">
            <option value="All">All Status</option>
            {["running", "stopped", "planned"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((vm, i) => (
            <motion.div key={vm.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}><VMCard vm={vm} /></motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground"><IconSearch size={32} className="mx-auto mb-2 opacity-50" /><p>No VMs match your filters</p></div>
        )}
      </div>
    </section>
  );
}

function ContainerDashboard() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id={SECTION_IDS.containers} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Container Dashboard</h2>
        <p className="text-muted-foreground mb-8">Docker-based services and their dependencies</p>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {containers.map((ct, i) => (
            <motion.div key={ct.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard glow={expanded === ct.id ? "purple" : "none"} intensity="low" className="h-full">
                <div className="flex items-center gap-2 mb-1">
                  <IconBox size={16} className="text-purple-400 shrink-0" />
                  <h3 className="font-semibold text-white text-sm truncate">{ct.name}</h3>
                  <span className={cn("text-xs px-1.5 py-0.5 rounded-full shrink-0", STATUS_COLORS[ct.status])}>{ct.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1 truncate">{ct.image}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{ct.purpose}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {ct.ports.slice(0, 2).map((p) => <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">{p}</span>)}
                  <span className={cn("text-xs px-1.5 py-0.5 rounded-full", TAG_COLORS[ct.tag])}>{TAG_LABELS[ct.tag]}</span>
                </div>
                <button onClick={() => setExpanded(expanded === ct.id ? null : ct.id)} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                  {expanded === ct.id ? "Less" : "Dependencies"} {expanded === ct.id ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}
                </button>
                <AnimatePresence>
                  {expanded === ct.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-2 border-t border-white/5 mt-2 space-y-1.5 text-xs">
                        <div><span className="text-muted-foreground">Networks: </span><span className="text-white">{ct.networks.join(", ")}</span></div>
                        {ct.dependencies.length > 0 && <div><span className="text-muted-foreground">Depends on: </span><span className="text-white">{ct.dependencies.join(", ")}</span></div>}
                        {ct.volumes.length > 0 && <div>
                          <span className="text-muted-foreground">Volumes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">{ct.volumes.map((v) => <span key={v} className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">{v}</span>)}</div>
                        </div>}
                        {ct.projects.length > 0 && <div>
                          <span className="text-muted-foreground">Projects:</span>
                          <div className="flex flex-wrap gap-1 mt-1">{ct.projects.map((p) => <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{p}</span>)}</div>
                        </div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ADView() {
  return (
    <section id={SECTION_IDS.ad} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Active Directory Lab</h2>
        <p className="text-muted-foreground mb-8">Domain environment for AD security testing and attack path validation</p>
        <GlassCard glow="purple" intensity="medium">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div><span className="text-xs text-muted-foreground">Domain</span><p className="text-sm text-white font-mono">{activeDirectory.domain}</p></div>
              <div><span className="text-xs text-muted-foreground">Domain Controller</span><p className="text-sm text-white">{activeDirectory.domainController}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <GlassCard glow="none" variant="small" className="text-center"><div className="text-xl font-bold text-white">{activeDirectory.users}</div><div className="text-xs text-muted-foreground">Users</div></GlassCard>
                <GlassCard glow="none" variant="small" className="text-center"><div className="text-xl font-bold text-white">{activeDirectory.groups}</div><div className="text-xs text-muted-foreground">Groups</div></GlassCard>
              </div>
              <div><span className="text-xs text-muted-foreground">Organizational Units</span>
                <div className="flex flex-wrap gap-1 mt-1">{activeDirectory.organizationalUnits.map((ou) => <span key={ou} className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">{ou}</span>)}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div><span className="text-xs text-muted-foreground">Workstations</span>
                <div className="flex flex-wrap gap-1 mt-1">{activeDirectory.workstations.map((w) => <span key={w} className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{w}</span>)}</div>
              </div>
              <div><span className="text-xs text-muted-foreground">Servers</span>
                <div className="flex flex-wrap gap-1 mt-1">{activeDirectory.servers.map((s) => <span key={s} className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">{s}</span>)}</div>
              </div>
              <div><span className="text-xs text-muted-foreground">Trust Relationships</span><p className="text-sm text-muted-foreground">{activeDirectory.trustRelationships[0]}</p></div>
              <div><span className="text-xs text-muted-foreground">Group Policy</span><p className="text-xs text-muted-foreground mt-1">{activeDirectory.gpoSummary}</p></div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function CloudLab() {
  return (
    <section id={SECTION_IDS.cloud} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Cloud Lab</h2>
        <p className="text-muted-foreground mb-8">AWS-based cloud resources for infrastructure security assessments</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {cloudResources.map((cr, i) => (
            <motion.div key={cr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <GlassCard glow="none" variant="small">
                <div className="flex items-center gap-2 mb-1">
                  <IconCloud size={14} className="text-sky-400 shrink-0" />
                  <h3 className="text-sm font-semibold text-white truncate">{cr.name}</h3>
                </div>
                <div className="text-xs text-muted-foreground mb-1">{cr.type} · {cr.region}</div>
                <p className="text-xs text-muted-foreground line-clamp-2">{cr.purpose}</p>
                {cr.projects.length > 0 && <div className="flex flex-wrap gap-1 mt-1">
                  {cr.projects.map((p) => <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400">{p}</span>)}
                </div>}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecurityStack() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const typeIcons: Record<string, React.ReactNode> = {
    Firewall: <IconShield size={16} />,
    IDS: <IconSearch size={16} />,
    SIEM: <IconChartBar size={16} />,
    Collector: <IconDatabase size={16} />,
    Intelligence: <IconBrain size={16} />,
    EDR: <IconBug size={16} />,
    Scanner: <IconSearch size={16} />,
    Backup: <IconServer size={16} />,
    Identity: <IconShield size={16} />,
  };

  return (
    <section id={SECTION_IDS.security} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Security Stack</h2>
        <p className="text-muted-foreground mb-8">Defense layers protecting the lab infrastructure</p>
        <div className="grid md:grid-cols-2 gap-3">
          {securityStack.map((sec) => (
            <GlassCard key={sec.id} glow={expanded === sec.id ? "green" : "none"} intensity="low" className="h-full">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-green-500/10 text-green-400 shrink-0">{typeIcons[sec.type.split(" ")[0] as keyof typeof typeIcons] || <IconShield size={16} />}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-white text-sm truncate">{sec.name}</h3>
                    <span className={cn("text-xs px-1.5 py-0.5 rounded-full shrink-0", STATUS_COLORS[sec.status])}>{sec.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{sec.type}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{sec.purpose}</p>
                  <button onClick={() => setExpanded(expanded === sec.id ? null : sec.id)} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 mt-1">
                    {expanded === sec.id ? "Less" : "Configuration"} {expanded === sec.id ? <IconChevronUp size={10} /> : <IconChevronDown size={10} />}
                  </button>
                  <AnimatePresence>
                    {expanded === sec.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="pt-2 border-t border-white/5 mt-2 space-y-1 text-xs">
                          <p className="text-muted-foreground">{sec.configSummary}</p>
                          <div className="flex flex-wrap gap-1">{sec.projects.map((p) => <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{p}</span>)}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoggingPipeline() {
  const [activeStage, setActiveStage] = useState(loggingPipeline[0].id);

  const current = loggingPipeline.find((s) => s.id === activeStage)!;

  return (
    <section id={SECTION_IDS.pipeline} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Logging Pipeline</h2>
        <p className="text-muted-foreground mb-8">End-to-end log flow from endpoint collection to incident response</p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {loggingPipeline.map((stage, i) => (
            <button key={stage.id} onClick={() => setActiveStage(stage.id)}
              className={cn(
                "flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all",
                activeStage === stage.id ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"
              )}
            >
              <span className="font-mono">{i + 1}</span>
              <span>{stage.label}</span>
              {i < loggingPipeline.length - 1 && <IconArrowRight size={10} className="opacity-50" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={current.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <GlassCard glow="cyan" intensity="medium">
              <h3 className="font-semibold text-white mb-1">{current.label}</h3>
              <p className="text-sm text-muted-foreground mb-3">{current.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">{current.tools.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{t}</span>)}</div>
              <p className="text-xs text-muted-foreground">{current.details}</p>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function MonitoringDashboard() {
  return (
    <section id={SECTION_IDS.monitoring} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Monitoring Dashboard</h2>
        <p className="text-muted-foreground mb-8">Live infrastructure health metrics (demo data — not real-time)</p>
        <div className="grid md:grid-cols-2 gap-4">
          {monitoringMetrics.map((metric) => (
            <GlassCard key={metric.label} glow={metric.status === "healthy" ? "green" : "amber"} intensity="low">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">{metric.label}</span>
                <span className={cn("text-xs", metric.status === "healthy" ? "text-green-400" : metric.status === "warning" ? "text-amber-400" : "text-red-400")}>{metric.usage}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-2">
                <motion.div
                  className={cn("h-full rounded-full", metric.status === "healthy" ? "bg-green-500" : metric.status === "warning" ? "bg-amber-500" : "bg-red-500")}
                  initial={{ width: 0 }} whileInView={{ width: `${metric.usage}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{metric.details}</p>
            </GlassCard>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center italic">
          Metrics represent current lab state from monitoring dashboard. All values are from a demonstration environment.
        </p>
      </div>
    </section>
  );
}

function AutomationCenter() {
  return (
    <section id={SECTION_IDS.automation} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Automation Center</h2>
        <p className="text-muted-foreground mb-8">Infrastructure automation and scheduled maintenance workflows</p>
        <div className="space-y-3">
          {automationWorkflows.map((wf, i) => (
            <motion.div key={wf.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard glow="none" variant="small">
                <div className="flex items-center gap-2 mb-1">
                  <IconRefresh size={14} className="text-cyan-400 shrink-0" />
                  <h3 className="text-sm font-semibold text-white">{wf.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{wf.description}</p>
                <div className="flex flex-wrap gap-1 mb-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">{wf.frequency}</span>
                  {wf.tools.map((t) => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{t}</span>)}
                </div>
                {wf.projects.length > 0 && <div className="flex flex-wrap gap-1">{wf.projects.map((p) => <span key={p} className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{p}</span>)}</div>}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentationHub() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const categories = useMemo(() => ["All", ...new Set(architectureDocuments.map((d) => d.category))], []);
  const [catFilter, setCatFilter] = useState("All");

  const filtered = useMemo(() => {
    return architectureDocuments.filter((d) => {
      if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== "All" && d.category !== catFilter) return false;
      return true;
    });
  }, [search, catFilter]);

  const iconMap: Record<string, React.ReactNode> = {
    Architecture: <IconGlobe size={14} />,
    "Setup Guides": <IconSettings size={14} />,
    "Lab Notes": <IconBook size={14} />,
    Runbooks: <IconTerminal2 size={14} />,
    Troubleshooting: <IconBug size={14} />,
    "Change Log": <IconRefresh size={14} />,
    "Maintenance Schedule": <IconClock size={14} />,
    "Network Diagrams": <IconNetwork size={14} />,
  };

  return (
    <section id={SECTION_IDS.docs} className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Documentation Hub</h2>
        <p className="text-muted-foreground mb-6">Architecture, setup guides, runbooks, and infrastructure notes</p>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search documentation..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCatFilter(cat)}
                className={cn("text-xs px-2.5 py-1.5 rounded-lg border transition-colors", catFilter === cat ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400" : "border-white/10 text-muted-foreground hover:text-white")}
              >{cat}</button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((doc) => (
            <button key={doc.id} onClick={() => setSelected(selected === doc.id ? null : doc.id)} className="text-left">
              <GlassCard glow={selected === doc.id ? "cyan" : "none"} intensity="low" className="h-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-cyan-400">{iconMap[doc.category] || <IconBook size={14} />}</span>
                  <h3 className="text-sm font-semibold text-white truncate">{doc.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{doc.description}</p>
                <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground mt-1 inline-block">{doc.category}</span>
              </GlassCard>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AILabGuide() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Explain the lab network architecture",
    "What is the SIEM configuration?",
    "How does the logging pipeline work?",
    "Describe the AD lab environment",
  ];

  const handleAsk = (q: string) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = question.toLowerCase();
      let answer = "";
      if (lower.includes("network") && (lower.includes("architecture") || lower.includes("topology"))) {
        answer = "The lab uses a segmented network with pfSense as the core firewall routing between VLANs: DMZ (web apps), Internal (offensive/defensive VMs), Management (AD, K8s), Monitoring (Splunk, Wazuh), and Cloud (AWS bastion). Each zone has dedicated firewall rules enforcing least-privilege access between segments.";
      } else if (lower.includes("siem")) {
        answer = "The lab runs both Splunk Enterprise and Wazuh XDR. Splunk ingests 300+ log sources with 20+ correlation searches and real-time alerting. Wazuh provides host-based IDS with FIM on all endpoints. Both feed into Grafana dashboards for unified visibility. Log retention is 90 days for Splunk, 180 for Elasticsearch.";
      } else if (lower.includes("logging") || lower.includes("pipeline")) {
        answer = "Logs flow through 8 stages: Endpoints (Sysmon/WinEventLog/auditd) → Filebeat/Splunk UF → Logstash (grok parsing/enrichment) → Splunk + Elasticsearch (indexing) → Sigma/SPL detection rules → Alert Manager → Kibana/Grafana dashboards → TheHive IR playbooks. This covers ~4.5 GB of logs daily.";
      } else if (lower.includes("ad") || lower.includes("active directory") || lower.includes("domain")) {
        answer = "The AD lab runs Windows Server 2022 as DC-01 on cyberlab.internal with 45 users, 12 groups, 6 OUs, and 3 workstations. GPOs enforce 14-char passwords, AppLocker, and comprehensive auditing. It's an isolated lab domain with no trust relationships, used for attack path validation and detection engineering.";
      } else if (lower.includes("improve") || lower.includes("recommend")) {
        answer = "Key improvements planned: 1) Deploy Keycloak SSO for centralized auth with MFA, 2) Add automation for VM provisioning via Ansible, 3) Implement log-shipping to a cloud SIEM for backup, 4) Expand K8s cluster with worker nodes for cloud-native security testing, 5) Deploy a SOAR platform for automated incident response.";
      } else {
        answer = "I can explain any part of the lab infrastructure: network topology, VMs, containers, security stack, logging pipeline, monitoring, cloud resources, AD lab, or automation workflows. Try asking a specific question about the architecture.";
      }
      setResponse(answer);
      setLoading(false);
    }, 800);
  };

  return (
    <section id={SECTION_IDS.assistant} className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <GlassCard glow="purple" intensity="medium" variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><IconBrain size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Lab Guide</h2>
              <p className="text-xs text-muted-foreground">Ask about infrastructure, architecture, or lab configuration</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => { setQuery(s); handleAsk(s); }}
                className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-cyan-500/30 transition-colors"
              >{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAsk(query)}
              placeholder="Ask a question about the infrastructure..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
            <Button variant="primary" size="md" onClick={() => handleAsk(query)} loading={loading}>Ask</Button>
          </div>
          <AnimatePresence>
            {response && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-4 rounded-lg bg-purple-500/5 border border-purple-500/20"
              >
                <div className="flex items-start gap-2">
                  <IconBrain size={16} className="text-purple-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{response}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">Answers based on documented lab architecture. Real IPs, credentials, and internal hostnames are never exposed.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}

function CyberLabPage() {
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
    const runningVMs = virtualMachines.filter((v) => v.status === "running");
    const allProjects = [...new Set(virtualMachines.flatMap((v) => v.projects))];
    const allSkills = [...new Set(virtualMachines.flatMap((v) => v.relatedSkills))];

    return (
      <div className="min-h-screen">
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs mb-4">
              <IconServer size={12} />Cyber Lab — Recruiter View
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Lab Infrastructure Overview</h1>
            <p className="text-muted-foreground mb-8">Multi-segment cybersecurity lab with {runningVMs.length} active VMs, {containers.length} containers, and a full security stack.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <GlassCard glow="cyan" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{labStats.virtualMachines}</div><div className="text-xs text-muted-foreground">VMs</div></GlassCard>
              <GlassCard glow="purple" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{labStats.containers}</div><div className="text-xs text-muted-foreground">Containers</div></GlassCard>
              <GlassCard glow="green" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{labStats.securityTools}</div><div className="text-xs text-muted-foreground">Security Tools</div></GlassCard>
              <GlassCard glow="blue" variant="small" className="text-center"><div className="text-2xl font-bold text-white">{labStats.networks}</div><div className="text-xs text-muted-foreground">Networks</div></GlassCard>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <GlassCard glow="green" intensity="low">
                <h3 className="text-sm font-semibold text-white mb-3">Security Stack</h3>
                <div className="space-y-1.5">
                  {securityStack.filter((s) => s.status === "running").slice(0, 6).map((s) => (
                    <div key={s.id} className="flex items-center gap-2 text-xs"><span className="text-cyan-400">•</span><span className="text-white">{s.name}</span><span className="text-muted-foreground">({s.type})</span></div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard glow="purple" intensity="low">
                <h3 className="text-sm font-semibold text-white mb-3">Key Projects Supported</h3>
                <div className="flex flex-wrap gap-1.5">{allProjects.map((p) => <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{p}</span>)}</div>
              </GlassCard>
            </div>

            <GlassCard glow="cyan" intensity="low">
              <h3 className="text-sm font-semibold text-white mb-3">Engineering Skills Applied</h3>
              <div className="flex flex-wrap gap-1.5">{allSkills.map((s) => <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{s}</span>)}</div>
              <p className="text-xs text-muted-foreground mt-3">Active Directory · Splunk · Wazuh · Elasticsearch · pfSense · Docker · Kubernetes · AWS · Automation scripting</p>
            </GlassCard>

            <p className="text-xs text-muted-foreground mt-6">Demonstration environment — real IPs, credentials, and internal hostnames are never exposed.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-1">
        {Object.entries(SECTION_IDS).map(([label, id]) => (
          <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className={cn("w-2 h-2 rounded-full transition-all duration-300", activeSection === id ? "bg-cyan-400 scale-125" : "bg-white/20 hover:bg-white/40")}
            title={label}
          />
        ))}
      </div>
      <HeroSection />
      <LabOverview />
      <NetworkTopology />
      <VMExplorer />
      <ContainerDashboard />
      <ADView />
      <CloudLab />
      <SecurityStack />
      <LoggingPipeline />
      <MonitoringDashboard />
      <AutomationCenter />
      <DocumentationHub />
      <AILabGuide />
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Cyber Lab & Home Infrastructure — All systems are isolated demonstration environments.
            Real IP addresses, credentials, API keys, and internal hostnames are never exposed.
            Operational, experimental, and planned infrastructure are clearly distinguished.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default CyberLabPage;
