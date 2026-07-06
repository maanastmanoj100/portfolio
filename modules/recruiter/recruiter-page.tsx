"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  PERSONAS, EVIDENCE_CHAINS, SYSTEM_DESIGNS, DECISION_LOG,
  PER_PROJECT_QUESTIONS, TECHNICAL_TIMELINE, DEMO_LINKS,
  ANALYTICS_METRICS, RECRUITER_PROMPTS,
  type Persona, type EvidenceChainItem, type DecisionLog,
  type SystemDesignItem, type PerProjectQuestion,
} from "./recruiter-data";
import {
  IconCode, IconUsers, IconSearch, IconX, IconCheck,
  IconChevronDown, IconChevronUp, IconArrowRight, IconExternalLink,
  IconBrain, IconCalendar, IconClock, IconStar, IconShield,
  IconFileText, IconMessage2, IconDownload, IconPrinter,
  IconLink, IconChartBar, IconNetwork, IconServer,
  IconTerminal2, IconFlag, IconRobot, IconBook,
  IconCertificate, IconBriefcase, IconUserSearch,
  IconCompass, IconDashboard, IconShieldExclamation,
  IconLayoutGrid, IconShieldCheck, IconBooks,
  IconQuestionMark, IconSend, IconEye, IconFilter,
  IconUserPlus, IconHeart, IconEdit, IconSettings,
} from "@tabler/icons-react";

const EVIDENCE_TYPE_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  project: IconCode, lab: IconServer, wiki: IconBook, cert: IconCertificate,
  dashboard: IconDashboard, architecture: IconShieldCheck, ctf: IconFlag,
};

const EVIDENCE_TYPE_COLORS: Record<string, string> = {
  project: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  lab: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  wiki: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  cert: "text-green-400 bg-green-500/10 border-green-500/20",
  dashboard: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  architecture: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  ctf: "text-red-400 bg-red-500/10 border-red-500/20",
};

const PROFILE = {
  name: "Maanas T Manoj",
  title: "Cybersecurity Engineer & Penetration Tester",
  email: "maanas@cybernexus.io",
  status: "Open for Internship Opportunities",
  yearsLearning: 6,
  intro: "Building secure systems through offensive security, defensive engineering, and AI-powered automation. Passionate about finding vulnerabilities before attackers do.",
  objective: "Cybersecurity engineer with deep expertise in penetration testing, SOC operations, and AI-driven security. Built enterprise-grade platforms processing 10M+ events daily. Published research, contributed to CNCF projects, and spoke at BSides. Seeking a challenging role applying offensive and defensive security.",
  interests: ["Offensive Security", "AI Security", "Cloud Security", "Threat Detection"],
  preferredRoles: ["Penetration Tester", "Security Engineer", "SOC Analyst", "Security Researcher"],
};

const PERSONA_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  IconUserSearch, IconBriefcase, IconCode, IconBook, IconShield, IconCompass,
};

function PersonaCard({ p, selected, onClick }: { p: Persona; selected: boolean; onClick: () => void }) {
  const Icon = PERSONA_ICONS[p.icon as keyof typeof PERSONA_ICONS] || IconUsers;
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className={cn("p-4 rounded-xl border text-left transition-all w-full", selected ? "border-cyan-500/40 bg-cyan-500/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20")}>
      <div className={cn(selected ? "text-cyan-400" : "text-muted-foreground")}>
        <Icon size={20} />
      </div>
      <div className={cn("font-semibold text-sm", selected ? "text-cyan-400" : "text-foreground")}>{p.label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{p.description}</div>
    </motion.button>
  );
}

function SmartEntrySection({ persona, setPersona, onEnter }: { persona: string | null; setPersona: (p: string | null) => void; onEnter: () => void }) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
          <IconUserPlus size={14} />Chapter 37 — Recruiter Experience Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
          Welcome to My Portfolio
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the path that best describes why you're here. Each pathway optimizes the experience without hiding any content.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
        {PERSONAS.map(p => (
          <PersonaCard key={p.id} p={p} selected={persona === p.id} onClick={() => setPersona(persona === p.id ? null : p.id)} />
        ))}
      </div>
      <div className="text-center">
        <Button variant="primary" size="lg" disabled={!persona} onClick={onEnter}>
          Enter Platform <IconArrowRight size={16} />
        </Button>
        <button onClick={onEnter} className="ml-3 text-sm text-muted-foreground hover:text-foreground transition-colors">Skip — show everything</button>
      </div>
    </section>
  );
}

function ExecutiveOverview() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <GlassCard glow="cyan" className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">60-Second Overview</div>
            <h2 className="text-2xl font-bold mb-2">{PROFILE.name}</h2>
            <p className="text-muted-foreground">{PROFILE.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />{PROFILE.status}
              </span>
              <span className="text-xs text-muted-foreground">{PROFILE.yearsLearning}+ years</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{PROFILE.objective}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {PROFILE.preferredRoles.map(r => (
                <span key={r} className="text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">{r}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">Quick Stats</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Years Learning", value: "6+" },
                { label: "Projects Built", value: "12+" },
                { label: "Open Source", value: "8 Projects" },
                { label: "Certifications", value: "9+" },
                { label: "Conference Talks", value: "2+" },
                { label: "GitHub Stars", value: "2.1k+" },
                { label: "PRs Merged", value: "146+" },
                { label: "CTF Challenges", value: "34+" },
              ].map(s => (
                <div key={s.label} className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                  <div className="text-lg font-bold text-cyan-400">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

function EvidenceExplorer() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return EVIDENCE_CHAINS;
    const q = search.toLowerCase();
    return EVIDENCE_CHAINS.filter(e => e.skill.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
  }, [search]);

  return (
    <section id="evidence" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Evidence Explorer</h2>
        <p className="text-muted-foreground mb-8">Every skill links to supporting evidence — projects, labs, certifications, and more.</p>
        <div className="relative max-w-sm mb-6">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search skills..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
        </div>
        <div className="space-y-3">
          {filtered.map(chain => (
            <GlassCard key={chain.skill} className={cn("p-4", selected === chain.skill && "border-cyan-500/30")}>
              <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setSelected(selected === chain.skill ? null : chain.skill)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{chain.skill}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">{chain.category}</span>
                    <span className="text-xs text-muted-foreground">{chain.level}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {chain.evidence.slice(0, 3).map(e => (
                      <span key={e.label} className={cn("text-xs px-2 py-0.5 rounded-full border", EVIDENCE_TYPE_COLORS[e.type] || "text-muted-foreground bg-white/5")}>{e.type} · {e.label}</span>
                    ))}
                    {chain.evidence.length > 3 && <span className="text-xs text-muted-foreground">+{chain.evidence.length - 3} more</span>}
                  </div>
                </div>
                <IconChevronDown size={16} className={cn("text-muted-foreground transition-transform shrink-0", selected === chain.skill && "rotate-180")} />
              </div>
              <AnimatePresence>
                {selected === chain.skill && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="border-t border-white/5 mt-3 pt-3 space-y-2">
                      {chain.evidence.map(e => {
                        const Icon = EVIDENCE_TYPE_ICONS[e.type] || IconFileText;
                        return (
                          <a key={e.label} href={e.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                          <div className="text-muted-foreground"><Icon size={14} /></div>
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{e.label}</span>
                            <IconExternalLink size={10} className="text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ShowcasedProjects() {
  const [open, setOpen] = useState<string | null>(null);
  const projects = [
    { id: "sentinel-ai", name: "Sentinel AI", description: "Enterprise SOC platform with ML-based correlation engine processing 10M+ events daily", role: "Creator & Lead Architect", tech: ["Python", "TensorFlow", "Elasticsearch", "Kafka", "FastAPI"], problem: "Security teams struggle with alert fatigue — 94% of alerts are false positives. Analysts spend 48+ hours investigating incidents.", architecture: "Event-driven microservices with Kafka message bus. ML inference pipeline for real-time scoring. Elasticsearch hot-warm-cold tiering for cost-efficient storage. React dashboard with WebSocket live updates.", lessons: ["Hybrid ML+rule approach achieves 99.7% detection vs 94% rules-only", "Analyst feedback loop reduced false positives by 60% in 3 months", "Kafka partitioning was critical for handling traffic spikes"], future: ["Community rule marketplace", "MITRE ATT&CK Navigator integration", "Automated incident response playbooks"] },
    { id: "netdefend", name: "NetDefend", description: "Network defense toolkit with eBPF-based packet inspection and anomaly detection", role: "Creator & Lead Developer", tech: ["Go", "eBPF", "Prometheus", "Grafana"], problem: "Small teams lack affordable network monitoring with real-time anomaly detection capabilities.", architecture: "eBPF XDP for kernel-level packet capture with ring buffer zero-copy transfer. Plugin architecture for detection algorithms. Prometheus metrics with Grafana dashboards.", lessons: ["eBPF reduced CPU usage by 73% vs libpcap", "Plugin architecture enabled community contributions", "Compatibility mode (libpcap fallback) captured 30% more users"], future: ["eBPF CO-RE (Compile Once Run Everywhere)", "Community detection plugin marketplace", "Kubernetes-native deployment"] },
    { id: "phishshield", name: "PhishShield", description: "NLP-based phishing detection with BERT text classification and CNN logo analysis", role: "Creator & ML Engineer", tech: ["Python", "PyTorch", "FastAPI", "Celery"], problem: "Phishing attacks are increasingly sophisticated — traditional rule-based filters miss 30% of modern attacks.", architecture: "Ensemble model with BERT for text content + CNN for brand logo analysis. Celery task queue for parallel email processing. Real-time classification with batch retraining.", lessons: ["Ensemble model outperformed single-model approaches by 15%", "Adversarial training samples improved resilience against evasion", "Human-in-the-loop for borderline cases was essential"], future: ["Browser extension for real-time protection", "Community feed sharing", "Real-time URL scanning integration"] },
    { id: "cloudsec-enforcer", name: "CloudSec Enforcer", description: "Multi-cloud security posture management for AWS, Azure, and GCP", role: "Core Contributor", tech: ["Go", "AWS SDK", "Azure SDK", "GCP SDK", "OPA"], problem: "Organizations struggle to maintain consistent security posture across multiple cloud providers.", architecture: "Provider-agnostic policy engine with adapter pattern. Policy-as-code using Rego/OPA. Parallel scanning with rate limiting per provider. Idempotent Terraform remediation modules.", lessons: ["Provider-agnostic design required careful abstraction", "OPA policies were 5x more maintainable than custom JSON", "Short-lived STS tokens prevented credential exposure"], future: ["Custom policy marketplace", "Cost optimization scanning", "Compliance reporting automation"] },
  ];

  return (
    <section id="showcase" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Project Showcase</h2>
        <p className="text-muted-foreground mb-8">Deep dives into architecture, decisions, and lessons learned</p>
        <div className="space-y-4">
          {projects.map(p => (
            <GlassCard key={p.id} glow={open === p.id ? "cyan" : "none"} className={cn("p-5 transition-all", open === p.id && "border-cyan-500/30")}>
              <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setOpen(open === p.id ? null : p.id)}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-cyan-400">{p.role}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <div className="flex gap-1">{p.tech.slice(0, 3).map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">{t}</span>)}</div>
                  </div>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
                <IconChevronDown size={18} className={cn("text-muted-foreground shrink-0 transition-transform", open === p.id && "rotate-180")} />
              </div>
              <AnimatePresence>
                {open === p.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="border-t border-white/5 mt-4 pt-4 space-y-4">
                      <div>
                        <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Business Problem</span>
                        <p className="text-sm text-muted-foreground mt-1">{p.problem}</p>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Architecture</span>
                        <p className="text-sm text-muted-foreground mt-1">{p.architecture}</p>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-green-400 uppercase tracking-wider">Lessons Learned</span>
                        <ul className="mt-1 space-y-0.5">
                          {p.lessons.map(l => <li key={l} className="text-sm text-muted-foreground flex items-center gap-2"><IconCheck size={12} className="text-green-400 shrink-0" />{l}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Future Improvements</span>
                        <ul className="mt-1 space-y-0.5">
                          {p.future.map(f => <li key={f} className="text-sm text-muted-foreground flex items-center gap-2"><IconArrowRight size={12} className="text-purple-400 shrink-0" />{f}</li>)}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function TechnicalTimelineSection() {
  const [filter, setFilter] = useState<string | null>(null);
  const filtered = TECHNICAL_TIMELINE.map(yr => ({
    ...yr,
    items: filter ? yr.items.filter(i => i.category === filter) : yr.items,
  })).filter(yr => yr.items.length > 0);
  const categories = Array.from(new Set(TECHNICAL_TIMELINE.flatMap(yr => yr.items.map(i => i.category))));

  return (
    <section id="timeline" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Technical Timeline</h2>
        <p className="text-muted-foreground mb-8">Learning milestones, projects, certifications, and research</p>
        <div className="flex flex-wrap gap-2 mb-8">
          <Button variant={filter === null ? "primary" : "ghost"} size="sm" onClick={() => setFilter(null)}>All</Button>
          {categories.map(c => (
            <Button key={c} variant={filter === c ? "primary" : "ghost"} size="sm" onClick={() => setFilter(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </Button>
          ))}
        </div>
        <div className="space-y-12">
          {filtered.map(yr => (
            <div key={yr.year}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-cyan-400">{yr.year}</span>
                <span className="text-sm text-muted-foreground">{yr.label}</span>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/20 to-transparent" />
              </div>
              <div className="space-y-3">
                {yr.items.map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-4 pl-4 border-l border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="shrink-0 text-right w-20">
                      <span className="text-xs font-mono text-muted-foreground">{item.date}</span>
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full border text-muted-foreground border-white/10 bg-white/5">{item.category}</span>
                      </div>
                      <h3 className="font-semibold text-sm mt-0.5">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function SystemDesignGallery() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="system-design" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">System Design Gallery</h2>
        <p className="text-muted-foreground mb-8">Architecture decisions, threat models, and security controls</p>
        <div className="grid md:grid-cols-2 gap-4">
          {SYSTEM_DESIGNS.map(sd => (
            <GlassCard key={sd.id} glow={open === sd.id ? "cyan" : "none"} className={cn("p-4", open === sd.id && "border-cyan-500/30")}>
              <div className="cursor-pointer" onClick={() => setOpen(open === sd.id ? null : sd.id)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border",
                    sd.category === "Security" ? "text-red-400 border-red-500/20 bg-red-500/10" :
                    sd.category === "Network" ? "text-green-400 border-green-500/20 bg-green-500/10" :
                    sd.category === "Cloud" ? "text-blue-400 border-blue-500/20 bg-blue-500/10" :
                    "text-purple-400 border-purple-500/20 bg-purple-500/10")}>{sd.category}</span>
                </div>
                <h3 className="font-semibold">{sd.title}</h3>
                <p className="text-sm text-muted-foreground">{sd.description}</p>
              </div>
              <AnimatePresence>
                {open === sd.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="border-t border-white/5 mt-3 pt-3 space-y-3">
                      <div>
                        <span className="text-xs font-mono text-cyan-400">Design Choices</span>
                        <ul className="mt-1 space-y-0.5">{sd.designChoices.map(c => <li key={c} className="text-xs text-muted-foreground flex items-center gap-1.5"><IconCheck size={10} className="text-cyan-400 shrink-0" />{c}</li>)}</ul>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-amber-400">Threat Model</span>
                        <ul className="mt-1 space-y-0.5">{sd.threatModel.map(t => <li key={t} className="text-xs text-muted-foreground flex items-center gap-1.5"><IconShield size={10} className="text-amber-400 shrink-0" />{t}</li>)}</ul>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-green-400">Security Controls</span>
                        <ul className="mt-1 space-y-0.5">{sd.controls.map(c => <li key={c} className="text-xs text-muted-foreground flex items-center gap-1.5"><IconCheck size={10} className="text-green-400 shrink-0" />{c}</li>)}</ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function DecisionJournalSection() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="decisions" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Decision Journal</h2>
        <p className="text-muted-foreground mb-8">Engineering challenges, trade-offs, and lessons learned</p>
        <div className="space-y-4">
          {DECISION_LOG.map(dl => (
            <GlassCard key={dl.id} glow={open === dl.id ? "amber" : "none"} className={cn("p-5", open === dl.id && "border-amber-500/30")}>
              <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setOpen(open === dl.id ? null : dl.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground font-mono">{dl.date}</span>
                  </div>
                  <h3 className="font-semibold">{dl.title}</h3>
                  <p className="text-sm text-muted-foreground">{dl.challenge}</p>
                </div>
                <IconChevronDown size={16} className={cn("text-muted-foreground shrink-0 transition-transform", open === dl.id && "rotate-180")} />
              </div>
              <AnimatePresence>
                {open === dl.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="border-t border-white/5 mt-4 pt-4 grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-mono text-amber-400 uppercase">Trade-offs Considered</span>
                        <ul className="mt-2 space-y-1">{dl.tradeoffs.map(t => <li key={t} className="text-sm text-muted-foreground flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />{t}</li>)}</ul>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-green-400 uppercase">Decision</span>
                        <p className="text-sm text-muted-foreground mt-2">{dl.chosen}</p>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-cyan-400 uppercase">Lessons Learned</span>
                        <ul className="mt-2 space-y-1">{dl.lessons.map(l => <li key={l} className="text-sm text-muted-foreground flex items-center gap-2"><IconCheck size={12} className="text-cyan-400 shrink-0" />{l}</li>)}</ul>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-purple-400 uppercase">Alternatives Considered</span>
                        <ul className="mt-2 space-y-1">{dl.alternatives.map(a => <li key={a} className="text-sm text-muted-foreground flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />{a}</li>)}</ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function LiveDemoHub() {
  const [filter, setFilter] = useState<string | null>(null);
  const categories = Array.from(new Set(DEMO_LINKS.map(d => d.category)));
  const filtered = filter ? DEMO_LINKS.filter(d => d.category === filter) : DEMO_LINKS;

  return (
    <section id="demo-hub" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Live Demo Hub</h2>
        <p className="text-muted-foreground mb-8">Launch interactive demos without leaving the recruiter workspace</p>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant={filter === null ? "primary" : "ghost"} size="sm" onClick={() => setFilter(null)}>All</Button>
          {categories.map(c => <Button key={c} variant={filter === c ? "primary" : "ghost"} size="sm" onClick={() => setFilter(c)}>{c.charAt(0).toUpperCase() + c.slice(1)}</Button>)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(d => (
            <a key={d.id} href={d.path} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all group">
              <div className="text-muted-foreground group-hover:text-cyan-400 transition-colors mb-1">
                {d.icon === "IconDashboard" ? <IconDashboard size={18} /> :
                 d.icon === "IconShieldExclamation" ? <IconShieldExclamation size={18} /> :
                 d.icon === "IconNetwork" ? <IconNetwork size={18} /> :
                 d.icon === "IconLayoutGrid" ? <IconLayoutGrid size={18} /> :
                 d.icon === "IconShieldCheck" ? <IconShieldCheck size={18} /> :
                 d.icon === "IconTerminal2" ? <IconTerminal2 size={18} /> :
                 d.icon === "IconChartBar" ? <IconChartBar size={18} /> :
                 d.icon === "IconRobot" ? <IconRobot size={18} /> :
                 d.icon === "IconFlag" ? <IconFlag size={18} /> :
                 d.icon === "IconServer" ? <IconServer size={18} /> :
                 d.icon === "IconBooks" ? <IconBooks size={18} /> :
                 <IconCode size={18} />}
              </div>
              <h3 className="text-sm font-semibold group-hover:text-cyan-400 transition-colors">{d.label}</h3>
              <p className="text-xs text-muted-foreground">{d.description}</p>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function InterviewQuestionBank() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="questions" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Interview Question Bank</h2>
        <p className="text-muted-foreground mb-8">Questions interviewers typically ask, organized by project</p>
        <div className="space-y-6">
          {PER_PROJECT_QUESTIONS.map(pq => (
            <div key={pq.projectId}>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">{pq.projectName}</h3>
              <div className="space-y-2">
                {pq.questions.map((q, i) => (
                  <GlassCard key={i} glow={open === `${pq.projectId}-${i}` ? "cyan" : "none"} className={cn("p-4", open === `${pq.projectId}-${i}` && "border-cyan-500/30")}>
                    <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setOpen(open === `${pq.projectId}-${i}` ? null : `${pq.projectId}-${i}`)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><IconQuestionMark size={14} className="text-cyan-400 shrink-0" /><span className="font-semibold text-sm">{q.question}</span></div>
                        <p className="text-xs text-muted-foreground mt-1">{q.context}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">{q.topics.map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">{t}</span>)}</div>
                      </div>
                      <IconChevronDown size={14} className={cn("text-muted-foreground shrink-0 transition-transform", open === `${pq.projectId}-${i}` && "rotate-180")} />
                    </div>
                    <AnimatePresence>
                      {open === `${pq.projectId}-${i}` && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="border-t border-white/5 mt-3 pt-3">
                            <span className="text-xs font-mono text-amber-400">Possible Follow-ups</span>
                            <ul className="mt-2 space-y-1">{q.followUps.map(f => <li key={f} className="text-sm text-muted-foreground flex items-center gap-2"><IconArrowRight size={10} className="text-amber-400 shrink-0" />{f}</li>)}</ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function AiRecruiterAssistant() {
  const [active, setActive] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ q: string; a: string }[]>([]);

  const handlePrompt = (i: number) => {
    const p = RECRUITER_PROMPTS[i];
    setChatHistory(h => [...h, { q: p.question, a: p.answer }]);
    setActive(i);
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    setChatInput("");
    const match = RECRUITER_PROMPTS.find(p => p.question.toLowerCase().includes(q.toLowerCase()));
    setChatHistory(h => [...h, { q, a: match ? match.answer : "I can answer questions about projects, skills, architecture decisions, certifications, and career history. Try asking about a specific project or technology." }]);
  };

  return (
    <section id="ai-assistant" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">AI Recruiter Assistant</h2>
        <p className="text-muted-foreground mb-8">Ask questions about projects, skills, and experience — answers always cite portfolio evidence</p>
        <GlassCard glow="cyan" className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-6">
              {RECRUITER_PROMPTS.map((p, i) => (
                <Button key={i} variant={active === i ? "primary" : "glass"} size="sm" onClick={() => handlePrompt(i)}>
                  {p.question}
                </Button>
              ))}
            </div>
            <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
              {chatHistory.map((h, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center"><IconBrain size={12} className="text-cyan-400" /></div>
                    <div className="text-sm text-white/90">{h.q}</div>
                  </div>
                  <div className="flex items-start gap-3 ml-9">
                    <div className="text-sm text-muted-foreground leading-relaxed">{h.a}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Ask about projects, skills, architecture..." value={chatInput}
                onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleChat()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
              <Button variant="primary" size="md" onClick={handleChat}>Ask</Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}

function AnalyticsSection() {
  return (
    <section id="analytics" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl font-bold mb-2">Analytics</h2>
        <p className="text-muted-foreground mb-8">Privacy-respecting metrics on portfolio engagement</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ANALYTICS_METRICS.map(m => (
            <GlassCard key={m.label} className="p-4">
              <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
              <div className="text-lg font-bold">{m.value}</div>
              <div className={cn("text-xs mt-1 flex items-center gap-1", m.trend === "up" ? "text-green-400" : m.trend === "down" ? "text-red-400" : "text-muted-foreground")}>
                <span>{m.trend === "up" ? "↑" : m.trend === "down" ? "↓" : "→"}</span>
                <span>{m.change}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function PrintShareMode() {
  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/recruiter");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" size="md" onClick={() => window.print()}>
          <IconPrinter size={14} className="mr-1" /> Print Mode
        </Button>
        <Button variant="glass" size="md" onClick={copyShareLink}>
          <IconLink size={14} className="mr-1" /> Copy Share Link
        </Button>
        <a href="/resume"><Button variant="glass" size="md"><IconDownload size={14} className="mr-1" /> Download Resume</Button></a>
        <span className="text-xs text-muted-foreground ml-2">Share link: {typeof window !== "undefined" ? window.location.origin + "/recruiter" : ""}</span>
      </div>
    </section>
  );
}

function FeedbackPortal() {
  const [sent, setSent] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <GlassCard glow="purple" className="p-6">
        <h3 className="text-lg font-bold mb-1">Feedback Portal</h3>
        <p className="text-sm text-muted-foreground mb-4">Optional — trusted reviewers can leave feedback privately</p>
        {sent ? (
          <div className="flex items-center gap-2 text-green-400 text-sm"><IconCheck size={14} />Thank you! Your feedback has been received.</div>
        ) : (
          <div className="flex items-start gap-3">
            <textarea placeholder="General feedback, technical suggestions, or observations..." className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none" rows={3} />
            <Button variant="primary" size="md" onClick={() => setSent(true)}><IconSend size={14} className="mr-1" />Send</Button>
          </div>
        )}
      </GlassCard>
    </section>
  );
}

export default function RecruiterExperiencePage() {
  const [persona, setPersona] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SmartEntrySection persona={persona} setPersona={setPersona} onEnter={() => setEntered(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <IconUserPlus size={20} className="text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400">Recruiter Platform</span>
            {persona && <span className="text-xs text-muted-foreground">· {PERSONAS.find(p => p.id === persona)?.label}</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Viewing as:</span>
            <select value={persona || ""} onChange={e => setPersona(e.target.value || null)}
              className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-muted-foreground focus:outline-none focus:border-cyan-500/50">
              <option value="">All Content</option>
              {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.label.replace("I'm a ", "").replace("I'm ", "")}</option>)}
            </select>
            <button onClick={() => setEntered(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-2">Change Path</button>
          </div>
        </div>
      </div>

      <ExecutiveOverview />
      <EvidenceExplorer />
      <ShowcasedProjects />
      <TechnicalTimelineSection />
      <SystemDesignGallery />
      <DecisionJournalSection />
      <LiveDemoHub />
      <InterviewQuestionBank />
      <AiRecruiterAssistant />
      <AnalyticsSection />
      <FeedbackPortal />
      <PrintShareMode />
    </div>
  );
}
