"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconCode, IconBook, IconShield, IconCpu, IconDatabase,
  IconFileText, IconBrandGithub, IconUsers, IconSettings,
  IconCheck, IconX, IconAlertTriangle, IconInfoCircle,
  IconArrowRight, IconSearch, IconBrain, IconStar,
  IconTrendingUp, IconTrendingDown, IconMinus, IconPlus,
  IconExternalLink, IconLock, IconRobot, IconRefresh,
} from "@tabler/icons-react";
import {
  ADRS, DOCS_INDEX, DEPENDENCIES, PERF_METRICS, QUALITY_METRICS,
  TECH_DEBT, DEP_TREND, MODULE_INVENTORY, COMPONENT_DOCS,
  ENGINEERING_PROMPTS,
} from "./engineering-data";

// ─── SECTION HEADER ─────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label, badge, action }: { icon: any; label: string; badge?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-[var(--color-accent)]" />
        <h2 className="text-sm font-semibold text-[var(--color-foreground)]">{label}</h2>
        {badge && (
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
            {badge}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── STATUS DOT ─────────────────────────────────────────────────────────

function StatusDot({ status }: { status: "pass" | "warn" | "fail" | "up-to-date" | "minor-behind" | "major-behind" | "security" | "open" | "in-progress" | "resolved" }) {
  const colors: Record<string, string> = {
    pass: "bg-green-400", "up-to-date": "bg-green-400",
    warn: "bg-amber-400", "minor-behind": "bg-amber-400",
    fail: "bg-red-400", "major-behind": "bg-red-400", security: "bg-red-400",
    open: "bg-red-400", "in-progress": "bg-amber-400", resolved: "bg-green-400",
  };
  return <div className={cn("w-2 h-2 rounded-full flex-shrink-0", colors[status] || "bg-gray-400")} />;
}

// ─── HERO ──────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
          <IconCode size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">Enterprise Engineering Platform</h1>
          <p className="text-xs font-mono text-[var(--color-foreground-tertiary)]">
            Architecture · Observability · Quality · Documentation · Developer Experience
          </p>
        </div>
      </div>
      <GlassCard glow="cyan" variant="feature">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex-shrink-0">
            <IconShield size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-[var(--color-foreground-secondary)] leading-relaxed">
              Cyber Nexus is engineered with production-grade practices: <strong className="text-[var(--color-foreground)]">TypeScript strict mode</strong>,
              <strong className="text-[var(--color-foreground)]"> modular architecture</strong>, <strong className="text-[var(--color-foreground)]">accessible UI primitives</strong>,
              <strong className="text-[var(--color-foreground)]"> performance budgets</strong>, and <strong className="text-[var(--color-foreground)]">comprehensive documentation</strong>.
              10 self-contained modules, 33 static routes, 8 architecture decisions, and zero secrets committed — all built with Next.js 16, React 19, and the Liquid Glass design system.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── ARCHITECTURE OVERVIEW ─────────────────────────────────────────────

function ArchitectureSection() {
  const [expandedAdr, setExpandedAdr] = useState<string | null>(null);

  return (
    <div className="space-y-4 mb-8">
      <SectionHeader icon={IconDatabase} label="Architecture" badge={`${ADRS.length} ADRs · ${DOCS_INDEX.length} docs`} />

      {/* Structure Map */}
      <GlassCard glow="none" variant="default" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Application Layer", items: ["33 static routes", "3 dynamic routes", "1 API route", "Root layout + error handling"], color: "text-cyan-400", border: "border-cyan-400/20" },
            { title: "Module Layer", items: ["10 self-contained modules", "Data + Store + Component pattern", "Isolated type definitions", "Independent feature sets"], color: "text-purple-400", border: "border-purple-400/20" },
            { title: "Infrastructure Layer", items: ["Next.js 16 App Router", "Tailwind CSS v4 design tokens", "Zustand v5 state management", "Framer Motion animations"], color: "text-emerald-400", border: "border-emerald-400/20" },
          ].map((layer) => (
            <div key={layer.title} className={cn("p-3 rounded-xl border", layer.border, "bg-[rgba(255,255,255,0.02)]")}>
              <div className={cn("text-xs font-semibold mb-2", layer.color)}>{layer.title}</div>
              <ul className="space-y-1">
                {layer.items.map((item) => (
                  <li key={item} className="text-xs text-[var(--color-foreground-secondary)] flex items-center gap-1.5">
                    <div className={cn("w-1 h-1 rounded-full", layer.color.replace("text", "bg"))} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ADRs */}
      <GlassCard glow="none" variant="default">
        <SectionHeader icon={IconFileText} label="Architecture Decision Records" />
        <div className="space-y-1">
          {ADRS.map((adr) => {
            const expanded = expandedAdr === adr.id;
            const statusColor = adr.status === "Accepted" ? "text-green-400" : adr.status === "Proposed" ? "text-amber-400" : "text-gray-400";
            return (
              <div key={adr.id} className="border-b border-[rgba(255,255,255,0.04)] last:border-0">
                <button
                  onClick={() => setExpandedAdr(expanded ? null : adr.id)}
                  className="w-full flex items-center gap-3 py-2 px-2 rounded-lg text-left transition-colors hover:bg-[rgba(255,255,255,0.02)]"
                >
                  <span className={cn("text-xs font-mono font-semibold w-16 flex-shrink-0", statusColor)}>{adr.status}</span>
                  <span className="flex-1 text-xs text-[var(--color-foreground)]">{adr.title}</span>
                  <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">{adr.date}</span>
                  {expanded ? <IconMinus size={12} className="text-[var(--color-foreground-tertiary)]" /> : <IconPlus size={12} className="text-[var(--color-foreground-tertiary)]" />}
                </button>
                {expanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-3 pb-2">
                    <p className="text-xs text-[var(--color-foreground-secondary)]">{adr.summary}</p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Documentation Index */}
      <GlassCard glow="none" variant="default">
        <SectionHeader icon={IconBook} label="Documentation Index" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {DOCS_INDEX.map((doc) => (
            <div key={doc.id} className="p-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <div className="text-xs font-medium text-[var(--color-foreground)] truncate">{doc.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-[var(--color-foreground-tertiary)] capitalize">{doc.category}</span>
                <span className="text-xs text-[var(--color-foreground-tertiary)]">{doc.wordCount} words</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── QUALITY SCORECARD ──────────────────────────────────────────────────

function QualityScorecard() {
  const score = useMemo(() => {
    const total = QUALITY_METRICS.length;
    const passed = QUALITY_METRICS.filter(m => m.status === "pass").length;
    const warned = QUALITY_METRICS.filter(m => m.status === "warn").length;
    const failed = QUALITY_METRICS.filter(m => m.status === "fail").length;
    return { total, passed, warned, failed, pct: Math.round((passed / total) * 100) };
  }, []);

  return (
    <div className="space-y-4 mb-8">
      <SectionHeader icon={IconStar} label="Quality Scorecard" badge={`${score.pct}%`} />

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2">
        <GlassCard glow="none" variant="small" className="text-center">
          <div className="text-lg font-bold text-green-400 font-mono">{score.passed}</div>
          <div className="text-xs text-[var(--color-foreground-tertiary)]">Passed</div>
        </GlassCard>
        <GlassCard glow="none" variant="small" className="text-center">
          <div className="text-lg font-bold text-amber-400 font-mono">{score.warned}</div>
          <div className="text-xs text-[var(--color-foreground-tertiary)]">Warning</div>
        </GlassCard>
        <GlassCard glow="none" variant="small" className="text-center">
          <div className="text-lg font-bold text-red-400 font-mono">{score.failed}</div>
          <div className="text-xs text-[var(--color-foreground-tertiary)]">Failed</div>
        </GlassCard>
        <GlassCard glow="none" variant="small" className="text-center">
          <div className="text-lg font-bold font-mono text-[var(--color-foreground)]">{score.total}</div>
          <div className="text-xs text-[var(--color-foreground-tertiary)]">Total Metrics</div>
        </GlassCard>
      </div>

      {/* Metric Bars */}
      <GlassCard glow="none" variant="default">
        <div className="space-y-3">
          {QUALITY_METRICS.map((metric) => {
            const barColor = metric.status === "pass" ? "bg-green-400" : metric.status === "warn" ? "bg-amber-400" : "bg-red-400";
            return (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <StatusDot status={metric.status} />
                    <span className="text-xs font-medium text-[var(--color-foreground)]">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-mono font-bold", metric.status === "pass" ? "text-green-400" : metric.status === "warn" ? "text-amber-400" : "text-red-400")}>
                      {metric.value}{metric.unit}
                    </span>
                    <span className="text-xs text-[var(--color-foreground-tertiary)]">/ {metric.target}{metric.unit}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("h-full rounded-full", barColor)}
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Performance Metrics */}
      <GlassCard glow="none" variant="default">
        <SectionHeader icon={IconCpu} label="Performance Budget" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PERF_METRICS.map((metric) => {
            const TrendIcon = metric.trend === "up" ? IconTrendingUp : metric.trend === "down" ? IconTrendingDown : undefined;
            return (
              <div key={metric.label} className="p-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-1.5 mb-1">
                  <StatusDot status={metric.status} />
                  <span className="text-xs text-[var(--color-foreground-secondary)]">{metric.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={cn("text-xs font-bold font-mono", metric.status === "pass" ? "text-green-400" : "text-amber-400")}>{metric.value}</span>
                  <span className="text-xs text-[var(--color-foreground-tertiary)]">target: {metric.target}</span>
                  {TrendIcon && <TrendIcon size={10} className={metric.trend === "up" ? "text-green-400" : "text-red-400"} />}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── MAINTENANCE DASHBOARD ──────────────────────────────────────────────

function MaintenanceDashboard() {
  return (
    <div className="space-y-4 mb-8">
      <SectionHeader icon={IconSettings} label="Maintenance Dashboard" badge={`${TECH_DEBT.filter(t => t.status === "open").length} open items`} />

      {/* Dependency Health */}
      <GlassCard glow="none" variant="default">
        <SectionHeader icon={IconBrandGithub} label="Dependency Health" />
        <div className="space-y-1">
          {DEPENDENCIES.map((dep) => (
            <div key={dep.name} className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-xs">
              <StatusDot status={dep.status} />
              <span className="w-28 font-mono text-[var(--color-foreground)]">{dep.name}</span>
              <span className="text-[var(--color-foreground-tertiary)]">{dep.version}</span>
              {dep.status !== "up-to-date" && (
                <>
                  <IconArrowRight size={10} className="text-[var(--color-foreground-tertiary)]" />
                  <span className="text-[var(--color-foreground-secondary)]">{dep.latest}</span>
                </>
              )}
              <span className={cn(
                "ml-auto text-xs font-mono px-1.5 py-0.5 rounded",
                dep.status === "up-to-date" ? "text-green-400 bg-green-400/10" :
                dep.status === "minor-behind" ? "text-amber-400 bg-amber-400/10" :
                dep.status === "security" ? "text-red-400 bg-red-400/10" :
                "text-[var(--color-foreground-tertiary)] bg-[rgba(255,255,255,0.04)]"
              )}>
                {dep.status === "up-to-date" ? "CURRENT" : dep.status === "minor-behind" ? "UPDATE" : dep.status === "security" ? "SECURITY" : "MAJOR"}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Dependency Trend Chart */}
      <GlassCard glow="none" variant="default">
        <SectionHeader icon={IconTrendingUp} label="Dependency Trend" />
        <div className="flex items-end gap-3 h-24 px-2">
          {DEP_TREND.map((month) => {
            const max = Math.max(...DEP_TREND.map(m => m.outdated + m.secure));
            const totalH = 80;
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative w-full flex items-end justify-center" style={{ height: totalH }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: (month.secure / max) * totalH }}
                    className="absolute bottom-0 w-5 rounded-t bg-green-400/40"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: ((month.outdated + month.secure) / max) * totalH }}
                    className="absolute bottom-0 w-5 rounded-t bg-amber-400/30"
                    style={{ height: ((month.outdated + month.secure) / max) * totalH }}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: (month.outdated / max) * totalH }}
                    className="absolute bottom-0 w-5 rounded-t bg-amber-400/60"
                  />
                </div>
                <span className="text-xs font-mono text-[var(--color-foreground-tertiary)]">{month.month.slice(5)}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-2 text-xs text-[var(--color-foreground-tertiary)]">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-green-400/40" /> Up-to-date</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-amber-400/60" /> Outdated</span>
        </div>
      </GlassCard>

      {/* Technical Debt */}
      <GlassCard glow="none" variant="default">
        <SectionHeader icon={IconAlertTriangle} label="Technical Debt" />
        <div className="space-y-2">
          {TECH_DEBT.map((debt) => (
            <div key={debt.id} className="flex items-start gap-3 p-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <StatusDot status={debt.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--color-foreground)]">{debt.title}</span>
                  <span className={cn(
                    "text-xs font-mono px-1 py-0.5 rounded",
                    debt.impact === "high" ? "bg-red-400/10 text-red-400" : debt.impact === "medium" ? "bg-amber-400/10 text-amber-400" : "bg-blue-400/10 text-blue-400"
                  )}>{debt.impact}</span>
                  <span className={cn(
                    "text-xs font-mono px-1 py-0.5 rounded capitalize",
                    debt.status === "open" ? "bg-red-400/10 text-red-400" : debt.status === "in-progress" ? "bg-amber-400/10 text-amber-400" : "bg-green-400/10 text-green-400"
                  )}>{debt.status}</span>
                </div>
                <div className="text-xs text-[var(--color-foreground-secondary)] mt-0.5">{debt.description}</div>
                <div className="text-xs text-[var(--color-foreground-tertiary)] mt-0.5">Area: {debt.area} · Effort: {debt.effort}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Module Inventory */}
      <GlassCard glow="none" variant="default">
        <SectionHeader icon={IconDatabase} label="Module Inventory" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-[var(--color-foreground-tertiary)] border-b border-[rgba(255,255,255,0.06)]">
                <th className="text-left py-2 px-2">Module</th>
                <th className="text-right py-2 px-2">Pages</th>
                <th className="text-right py-2 px-2">Components</th>
                <th className="text-right py-2 px-2">Types</th>
                <th className="text-center py-2 px-2">Docs</th>
                <th className="text-center py-2 px-2">Tests</th>
              </tr>
            </thead>
            <tbody>
              {MODULE_INVENTORY.map((mod) => (
                <tr key={mod.name} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-2 px-2 text-[var(--color-foreground)]">{mod.name}</td>
                  <td className="py-2 px-2 text-right text-[var(--color-foreground-secondary)]">{mod.pages}</td>
                  <td className="py-2 px-2 text-right text-[var(--color-foreground-secondary)]">{mod.components}</td>
                  <td className="py-2 px-2 text-right text-[var(--color-foreground-secondary)]">{mod.dataTypes}</td>
                  <td className="py-2 px-2 text-center">{mod.hasDocs ? <IconCheck size={10} className="text-green-400 mx-auto" /> : <IconX size={10} className="text-red-400 mx-auto" />}</td>
                  <td className="py-2 px-2 text-center">{mod.hasTests ? <IconCheck size={10} className="text-green-400 mx-auto" /> : <IconX size={10} className="text-red-400 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── COMPONENT LIBRARY STATUS ───────────────────────────────────────────

function ComponentLibrarySection() {
  return (
    <div className="space-y-4 mb-8">
      <SectionHeader icon={IconCode} label="Component Library" badge={`${COMPONENT_DOCS.length} primitives`} />

      <GlassCard glow="none" variant="default">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-[var(--color-foreground-tertiary)] border-b border-[rgba(255,255,255,0.06)]">
                <th className="text-left py-2 px-2">Component</th>
                <th className="text-center py-2 px-2">Documented</th>
                <th className="text-center py-2 px-2">Tests</th>
                <th className="text-center py-2 px-2">A11y</th>
                <th className="text-center py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENT_DOCS.map((comp) => (
                <tr key={comp.component} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-2 px-2 text-[var(--color-foreground)]">{comp.component}</td>
                  <td className="py-2 px-2 text-center">{comp.documented ? <IconCheck size={10} className="text-green-400 mx-auto" /> : <IconX size={10} className="text-red-400 mx-auto" />}</td>
                  <td className="py-2 px-2 text-center">{comp.hasTests ? <IconCheck size={10} className="text-green-400 mx-auto" /> : <IconX size={10} className="text-red-400 mx-auto" />}</td>
                  <td className="py-2 px-2 text-center">{comp.hasA11y ? <IconCheck size={10} className="text-green-400 mx-auto" /> : <IconX size={10} className="text-amber-400 mx-auto" />}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={cn(
                      "text-xs font-mono px-1.5 py-0.5 rounded",
                      comp.documented && comp.hasA11y ? "text-green-400 bg-green-400/10" : "text-amber-400 bg-amber-400/10"
                    )}>
                      {comp.documented && comp.hasA11y ? "READY" : "NEEDS WORK"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── OPEN SOURCE READINESS ──────────────────────────────────────────────

function OpenSourceSection() {
  const files = [
    { name: "LICENSE", desc: "MIT License — permissive open source", status: "created" },
    { name: "CODE_OF_CONDUCT.md", desc: "Contributor Covenant v2.1", status: "created" },
    { name: "CONTRIBUTING.md", desc: "Contribution guidelines & workflow", status: "created" },
    { name: "SECURITY.md", desc: "Responsible disclosure policy", status: "created" },
    { name: "ROADMAP.md", desc: "Current, next, and future milestones", status: "created" },
  ];

  return (
    <div className="space-y-4 mb-8">
      <SectionHeader icon={IconUsers} label="Open Source Readiness" />

      <GlassCard glow="none" variant="default">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {files.map((f) => (
            <div key={f.name} className="flex items-start gap-3 p-2.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
              <div className="w-7 h-7 rounded-lg bg-green-400/10 border border-green-400/20 flex items-center justify-center flex-shrink-0">
                <IconCheck size={12} className="text-green-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--color-foreground)]">{f.name}</div>
                <div className="text-xs text-[var(--color-foreground-secondary)]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-2.5 rounded-lg bg-amber-400/5 border border-amber-400/20">
          <div className="flex items-start gap-2">
            <IconAlertTriangle size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-amber-400">GitHub Community Standards</div>
              <div className="text-xs text-[var(--color-foreground-secondary)]">Next steps: Add issue templates, PR templates, GitHub Actions CI/CD workflow, and Dependabot configuration.</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── DEVELOPER EXPERIENCE ───────────────────────────────────────────────

function DevExperienceSection() {
  const features = [
    { icon: IconRefresh, label: "Hot Reload", desc: "Turbopack dev server with instant HMR" },
    { icon: IconSearch, label: "Typed APIs", desc: "TypeScript strict mode catches errors at build time" },
    { icon: IconBrain, label: "AI Assistant", desc: "AI Engineering Assistant for architecture Q&A" },
    { icon: IconFileText, label: "Auto Docs", desc: "ADRs and architecture docs live in docs/" },
    { icon: IconCode, label: "Consistent Tooling", desc: "ESLint, Prettier-ready, single tsconfig" },
    { icon: IconLock, label: "Security First", desc: "No secrets, data source transparency, CSP" },
  ];

  return (
    <div className="space-y-4 mb-8">
      <SectionHeader icon={IconCpu} label="Developer Experience" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <GlassCard key={f.label} glow="none" variant="small">
              <div className="flex items-start gap-2">
                <Icon size={14} className="text-[var(--color-accent)] mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-[var(--color-foreground)]">{f.label}</div>
                  <div className="text-xs text-[var(--color-foreground-secondary)]">{f.desc}</div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Quick Commands */}
      <GlassCard glow="none" variant="default">
        <SectionHeader icon={IconBrandGithub} label="Quick Reference" />
        <div className="space-y-1 font-mono text-xs">
          {[
            { cmd: "npm run dev", desc: "Start development server (Turbopack)" },
            { cmd: "npm run build", desc: "Production build with type check" },
            { cmd: "npm run lint", desc: "Run ESLint (core-web-vitals + TS)" },
            { cmd: "npm run start", desc: "Start production server" },
          ].map(({ cmd, desc }) => (
            <div key={cmd} className="flex items-center gap-3 py-1.5 px-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
              <code className="text-emerald-400">{cmd}</code>
              <span className="text-[var(--color-foreground-tertiary)]">{desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── AI ENGINEERING ASSISTANT ───────────────────────────────────────────

function EngineeringAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; isAi: boolean }[]>([
    { text: "I'm your AI Engineering Assistant. Ask me about the architecture, codebase structure, design decisions, or engineering practices.", isAi: true },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleAsk = (question: string) => {
    setMessages(prev => [...prev, { text: question, isAi: false }]);
    setIsThinking(true);
    const prompt = ENGINEERING_PROMPTS.find(p => p.question === question);
    const answer = prompt?.answer || "I can answer questions about the project architecture, module structure, design system, state management, accessibility, performance, testing strategy, security practices, and documentation. Try one of the suggested questions.";
    setTimeout(() => {
      setMessages(prev => [...prev, { text: answer, isAi: true }]);
      setIsThinking(false);
    }, 800);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="space-y-4 mb-8">
      <SectionHeader icon={IconRobot} label="AI Engineering Assistant" />

      <div className="flex flex-wrap gap-1 mb-2">
        {ENGINEERING_PROMPTS.map((p) => (
          <button
            key={p.question}
            onClick={() => handleAsk(p.question)}
            className="px-2 py-1 rounded-lg text-xs font-mono bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-secondary)] hover:bg-[rgba(16,185,129,0.1)] hover:text-emerald-400 hover:border-emerald-400/20 transition-all"
          >
            {p.question}
          </button>
        ))}
      </div>

      <GlassCard glow="none" variant="default">
        <div ref={chatRef} className="h-[300px] overflow-y-auto space-y-3 pr-1">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-2", msg.isAi ? "" : "flex-row-reverse")}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                msg.isAi ? "bg-emerald-500/20" : "bg-cyan-500/20"
              )}>
                {msg.isAi ? <IconRobot size={12} className="text-emerald-400" /> : <IconBrain size={12} className="text-cyan-400" />}
              </div>
              <div className={cn(
                "max-w-[80%] p-2.5 rounded-xl text-xs leading-relaxed",
                msg.isAi
                  ? "bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.12)] text-[var(--color-foreground)]"
                  : "bg-[rgba(0,180,216,0.06)] border border-[rgba(0,180,216,0.12)] text-[var(--color-foreground)]"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-foreground-tertiary)]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Analyzing codebase...
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                handleAsk(input.trim());
                setInput("");
              }
            }}
            placeholder="Ask about the architecture..."
            className="flex-1 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[11px] font-mono text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-tertiary)] outline-none focus:border-emerald-400/30"
          />
          <Button variant="glass" size="sm" onClick={() => { if (input.trim()) { handleAsk(input.trim()); setInput(""); } }}>
            Ask
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────

export default function EngineeringPage() {
  const [activeSection, setActiveSection] = useState<string>("architecture");

  const sections = [
    { id: "architecture", label: "Architecture", icon: IconDatabase },
    { id: "quality", label: "Quality", icon: IconStar },
    { id: "maintenance", label: "Maintenance", icon: IconSettings },
    { id: "components", label: "Components", icon: IconCode },
    { id: "opensource", label: "Open Source", icon: IconUsers },
    { id: "devx", label: "DevX", icon: IconCpu },
    { id: "ai", label: "AI Assistant", icon: IconRobot },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[1400px] mx-auto px-4 pt-6 pb-24">
        <HeroSection />

        {/* Section Nav */}
        <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all",
                  activeSection === s.id
                    ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                    : "text-[var(--color-foreground-tertiary)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.04)]"
                )}
              >
                <Icon size={12} />
                {s.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {activeSection === "architecture" && <ArchitectureSection />}
          {activeSection === "quality" && <QualityScorecard />}
          {activeSection === "maintenance" && <MaintenanceDashboard />}
          {activeSection === "components" && <ComponentLibrarySection />}
          {activeSection === "opensource" && <OpenSourceSection />}
          {activeSection === "devx" && <DevExperienceSection />}
          {activeSection === "ai" && <EngineeringAssistant />}
        </motion.div>

        {/* Footer */}
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 text-xs font-mono text-[var(--color-foreground-tertiary)] text-center">
          Enterprise Engineering Platform — Documentation and metrics reflect the current state of development.
          ADRs marked Proposed are planned but not yet implemented. Quality metrics are self-assessed targets.
        </div>
      </div>
    </div>
  );
}
