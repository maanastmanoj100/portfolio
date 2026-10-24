"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experiences } from "@/data/experience";
import { vaultCertifications, certificationRoadmap } from "@/data/certifications-vault";
import { createConversationEngine } from "./conversation-engine";
import {
  IconRobot, IconSend, IconX, IconBrain, IconCode, IconShieldCheck, IconCertificate,
  IconClock, IconBook, IconStar, IconUser, IconMessage, IconArrowRight,
  IconChevronDown, IconExternalLink, IconFileText, IconBriefcase, IconSchool,
  IconMicrophone, IconVolume, IconFlag, IconSearch, IconCheck, IconDownload,
  IconRefresh, IconHeart, IconBulb, IconTarget, IconUsers, IconEye,
  IconGraph, IconSparkles, IconUserShield, IconActivity,
} from "@tabler/icons-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: { label: string; href: string }[];
}

const profile = {
  name: "Maanas T Manoj",
  title: "Cybersecurity Engineer & Penetration Tester",
  status: "Open for Internship",
  interests: ["Offensive Security", "AI Security", "Cloud Security", "Threat Detection"],
  currentLearning: "Advanced AD Attacks • Cloud Security Architecture • Malware Analysis",
  availability: "Immediate",
  yearsLearning: 6,
};

function DigitalAvatar() {
  return (
    <div className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan/20 via-purple/10 to-transparent blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border border-cyan/20"
        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan/10 to-purple/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
          <motion.div
            className="text-cyan/80"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <IconBrain size={48} className="sm:w-16 sm:h-16" />
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan/30 blur-sm"
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-purple/30 blur-sm"
        animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan/40"
          style={{ top: `${15 + i * 30}%`, left: `${i * 20 + 5}%` }}
          animate={{ y: [-4, 4, -4], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </div>
  );
}

const suggestions = [
  "Tell me about yourself",
  "What projects have you built?",
  "What are your top skills?",
  "Show your certifications",
  "How did you learn cybersecurity?",
];

const recruiterSuggestions = [
  "Summarize the portfolio",
  "What is the strongest project?",
  "Recommend interview questions",
  "Generate a candidate summary",
  "What are your career goals?",
];

function SectionTitle({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="text-cyan"><Icon size={14} /></div>
      <h2 className="text-xs font-mono text-foreground-tertiary uppercase tracking-widest">{label}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2" />
    </div>
  );
}

function PersonalDashboard() {
  const vault = vaultCertifications;
  const latestCert = vault.filter((c) => c.status === "active" && c.date).sort((a, b) => b.date.localeCompare(a.date))[0];
  const featured = projects.filter((p) => p.featured).sort((a, b) => (b.featuredRank || 99) - (a.featuredRank || 99))[0];

  const items = [
    { label: "Current Focus", value: "Cyber Threat Detection & AI-driven SOC", icon: IconTarget, color: "#06b6d4" },
    { label: "Latest Project", value: featured?.title || "Sentinel AI SOC", icon: IconCode, color: "#8b5cf6", href: featured ? `/projects/${featured.id}` : undefined },
    { label: "Currently Learning", value: profile.currentLearning, icon: IconBook, color: "#22c55e" },
    { label: "Recent Cert", value: latestCert?.name || "OSCP", icon: IconCertificate, color: "#f97316", href: "/certifications" },
    { label: "Availability", value: profile.availability, icon: IconActivity, color: "#3b82f6" },
    { label: "Active Interests", value: profile.interests.join(" · "), icon: IconHeart, color: "#ec4899" },
  ];

  return (
    <div className="mb-8">
      <SectionTitle label="Personal Dashboard" icon={IconGraph} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.label} className={cn("p-3 rounded-xl bg-white/[0.02] border border-white/5", item.href && "hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer")} onClick={() => item.href && (window.location.href = item.href)}>
            <div className="flex items-center gap-2 mb-1">
              <item.icon size={10} style={{ color: item.color }} />
              <span className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CareerJourney() {
  const milestones = [
    { year: "2013", label: "Started Programming", detail: "Built foundation in Python, C, and systems programming", icon: IconCode },
    { year: "2015", label: "Networking & Linux", detail: "Deep-dived into protocols, routing, and Linux administration", icon: IconBrain },
    { year: "2017", label: "Cybersecurity", detail: "Transitioned into offensive and defensive security", icon: IconShieldCheck },
    { year: "2018", label: "TryHackMe & Labs", detail: "Hundreds of hours of practical labs and CTF challenges", icon: IconFlag },
    { year: "2019", label: "Professional Projects", detail: "Built enterprise-grade security tools and platforms", icon: IconCode },
    { year: "2021", label: "Research", detail: "Published security research and blog articles", icon: IconBook },
    { year: "2023", label: "Advanced Labs", detail: "OSCP prep, AD attack labs, cloud security architectures", icon: IconTarget },
    { year: "2025+", label: "Future Goals", detail: "AI security research, security architecture leadership", icon: IconStar },
  ];

  return (
    <div className="mb-8">
      <SectionTitle label="Career Journey" icon={IconFlag} />
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-cyan/30 via-purple/20 to-transparent" />
        <div className="space-y-3 pl-10">
          {milestones.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div key={m.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.3 }} className="relative">
                <div className="absolute -left-7 w-[14px] h-[14px] rounded-full bg-deep-navy border-2 flex items-center justify-center" style={{ borderColor: i < milestones.length - 1 ? "#06b6d4" : "#8b5cf6" }}>
                  <div className="w-[6px] h-[6px] rounded-full" style={{ background: i < milestones.length - 1 ? "#06b6d4" : "#8b5cf6" }} />
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-mono text-foreground-tertiary mt-0.5 w-8 shrink-0">{m.year}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Icon size={10} className="text-cyan shrink-0" />
                      <span className="text-[11px] font-medium text-foreground">{m.label}</span>
                    </div>
                    <p className="text-xs text-foreground-tertiary mt-0.5">{m.detail}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LearningRoadmap() {
  const roadmap = certificationRoadmap;
  const completed = roadmap.filter((r) => r.status === "completed");
  const inProgress = roadmap.filter((r) => r.status === "in-progress");
  const planned = roadmap.filter((r) => r.status === "planned");

  return (
    <div className="mb-8">
      <SectionTitle label="Learning Roadmap" icon={IconBook} />
      <div className="space-y-3">
        {completed.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-green-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><IconCheck size={8} /> Completed ({completed.length})</h3>
            <div className="flex flex-wrap gap-1">
              {completed.map((r) => <span key={r.badge} className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 font-mono">{r.certName}</span>)}
            </div>
          </div>
        )}
        {inProgress.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-yellow-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><IconRefresh size={8} /> In Progress ({inProgress.length})</h3>
            <div className="flex flex-wrap gap-1">
              {inProgress.map((r) => <span key={r.badge} className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-mono">{r.certName}</span>)}
            </div>
          </div>
        )}
        {planned.length > 0 && (
          <div>
            <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5 flex items-center gap-1"><IconClock size={8} /> Planned ({planned.length})</h3>
            <div className="flex flex-wrap gap-1">
              {planned.map((r) => <span key={r.badge} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-foreground-tertiary border border-white/10 font-mono">{r.certName}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PersonalityProfile() {
  const traits = [
    { icon: IconBulb, label: "Problem Solving", desc: "Approaches security challenges methodically, breaking complex problems into manageable components" },
    { icon: IconEye, label: "Curiosity", desc: "Continuously explores new attack vectors, technologies, and defense strategies" },
    { icon: IconBrain, label: "Analytical Thinking", desc: "Data-driven decision making with strong foundation in threat modeling and risk analysis" },
    { icon: IconHeart, label: "Continuous Learning", desc: "Invests hundreds of hours in labs, certifications, and hands-on practice" },
    { icon: IconUsers, label: "Collaboration", desc: "Experience leading teams, mentoring juniors, and working cross-functionally" },
    { icon: IconFileText, label: "Documentation", desc: "Believes thorough documentation is essential for security operations" },
    { icon: IconTarget, label: "Attention to Detail", desc: "Meticulous approach to vulnerability identification and security analysis" },
  ];

  return (
    <div className="mb-8">
      <SectionTitle label="Personality Profile" icon={IconUser} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {traits.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-0.5">
                <Icon size={12} className="text-cyan shrink-0" />
                <span className="text-xs font-medium text-foreground">{t.label}</span>
              </div>
              <p className="text-xs text-foreground-tertiary leading-relaxed">{t.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CybersecurityInterests() {
  const interestAreas = [
    { label: "SOC", desc: "Security operations, SIEM, incident response", icon: IconShieldCheck },
    { label: "Threat Hunting", desc: "Proactive threat detection and analysis", icon: IconSearch },
    { label: "Penetration Testing", desc: "Web, network, and mobile pentesting", icon: IconTarget },
    { label: "Cloud Security", desc: "AWS/Azure/GCP security architecture", icon: IconBrain },
    { label: "AI Security", desc: "ML for detection, adversarial ML", icon: IconSparkles },
    { label: "Automation", desc: "DevSecOps, SOAR, security automation", icon: IconRobot },
    { label: "Networking", desc: "Protocols, segmentation, zero-trust", icon: IconGraph },
    { label: "DevSecOps", desc: "CI/CD security, shift-left, IaC", icon: IconCode },
    { label: "Digital Forensics", desc: "Memory, disk, and network forensics", icon: IconSearch },
    { label: "OSINT", desc: "Open-source intelligence gathering", icon: IconEye },
  ];

  return (
    <div className="mb-8">
      <SectionTitle label="Cybersecurity Interests" icon={IconStar} />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {interestAreas.map((area) => {
          const Icon = area.icon;
          return (
            <div key={area.label} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-center hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <Icon size={14} className="mx-auto text-cyan mb-1" />
              <div className="text-xs font-medium text-foreground">{area.label}</div>
              <div className="text-xs text-foreground-tertiary mt-0.5 leading-tight">{area.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveStatus() {
  return (
    <div className="mb-8">
      <SectionTitle label="Live Status" icon={IconActivity} />
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
        <span className="flex items-center gap-1.5 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-500">Available</span>
        </span>
        <span className="text-foreground-tertiary text-xs font-mono flex items-center gap-1">
          <IconBook size={9} /> Learning: {profile.currentLearning}
        </span>
        <span className="text-foreground-tertiary text-xs font-mono">Portfolio v2.0</span>
        <span className="text-foreground-tertiary text-xs font-mono">Last updated: 2026</span>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const activities = [
    { action: "Repository Updated", detail: "cyber-nexus portfolio", time: "2 minutes ago", icon: IconCode },
    { action: "Write-up Published", detail: "AD Attack Paths Deep Dive", time: "Yesterday", icon: IconFileText },
    { action: "THM Room Completed", detail: "Steel Mountain — Advanced", time: "Last Week", icon: IconFlag },
    { action: "SOC Dashboard Online", detail: "System Healthy — 10M+ events/day", time: "Online", icon: IconActivity },
    { action: "CTF Completed", detail: "HackTheBox — Seasonal 2026", time: "2 weeks ago", icon: IconTarget },
  ];

  return (
    <div className="mb-8">
      <SectionTitle label="Recent Activity" icon={IconActivity} />
      <div className="space-y-1.5">
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.01] border border-white/5">
              <Icon size={10} className="text-cyan shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-foreground">{a.action}</span>
                  <span className="text-xs font-mono text-foreground-tertiary">{a.time}</span>
                </div>
                <div className="text-xs text-foreground-tertiary truncate">{a.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CyberPersonaPage() {
  const recruiterMode = useUIStore((s) => s.recruiterMode);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello. I'm **Cyber Persona**, the AI-powered digital twin representing the knowledge within this portfolio. I can explain projects, discuss skills, summarize certifications, explore cybersecurity topics, and guide you through my learning journey. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(createConversationEngine());
  const [hasStarted, setHasStarted] = useState(false);
  const activeSuggestions = recruiterMode ? recruiterSuggestions : suggestions;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);
    setHasStarted(true);

    setTimeout(() => {
      const result = engineRef.current.answer(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: result.response, sources: result.suggestions.length > 0 ? result.sources : undefined }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  }, [input, isTyping]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      const form = document.getElementById("cyber-persona-input");
      form?.focus();
    }, 50);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <span className="text-xs text-purple font-mono tracking-wider uppercase">.cyber-persona</span>
            <h1 className="text-3xl sm:text-4xl font-light text-foreground mt-1">
              AI <span className="text-gradient font-medium">Digital Twin</span>
            </h1>
            <p className="text-foreground-tertiary text-xs mt-1.5 max-w-xl">
              An intelligent representation of my cybersecurity journey. Ask me anything about the projects, skills, and experience documented in this portfolio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="lg:col-span-4 space-y-6">
              <GlassCard className="p-6 text-center" glow="cyan" intensity="low">
                <DigitalAvatar />
                <h2 className="text-lg font-medium text-foreground mt-4">{profile.name}</h2>
                <p className="text-xs text-foreground-secondary">{profile.title}</p>
                <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {profile.status}
                </span>
              </GlassCard>

              <PersonalDashboard />
              <CareerJourney />
              <LearningRoadmap />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="lg:col-span-5 space-y-6">
              <GlassCard className="p-4 sm:p-5 flex flex-col" glow="purple" intensity="low" style={{ minHeight: "500px" }}>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-purple/10 border border-purple/20"><IconRobot size={14} className="text-purple" /></div>
                    <span className="text-xs font-medium text-foreground">Cyber Persona</span>
                    {recruiterMode && <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-cyan/10 text-cyan rounded font-mono"><IconUserShield size={8} />Recruiter</span>}
                    <span className="px-1.5 py-0.5 text-xs bg-green-500/10 text-green-500 rounded font-mono">Online</span>
                  </div>
                  <button onClick={() => { setMessages([{ role: "assistant", content: "Hello. I'm **Cyber Persona**, the AI-powered digital twin representing the knowledge within this portfolio. I can explain projects, discuss skills, summarize certifications, explore cybersecurity topics, and guide you through my learning journey. What would you like to know?" }]); engineRef.current = createConversationEngine(); }} className="flex items-center gap-1 px-2.5 py-2 text-xs font-mono rounded-lg bg-white/5 text-foreground-tertiary hover:text-foreground hover:bg-white/10 transition-colors border border-white/10 touch-action-manipulation" style={{ minHeight: 44 }}>
                    <IconRefresh size={8} /> New Chat
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 mb-3 px-0.5" style={{ maxHeight: "380px", minHeight: "300px" }}>
                  {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[85%] sm:max-w-[90%] p-2.5 rounded-xl text-[11px] leading-relaxed break-words", msg.role === "user" ? "bg-cyan/10 border border-cyan/20 text-cyan" : "bg-white/5 border border-white/10 text-foreground/80")}>
                        <div className="break-words" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>").replace(/\n/g, "<br />") }} />
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-white/5">
                            {msg.sources.map((s) => (
                              <a key={s.href} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-0.5 text-xs font-mono text-cyan hover:text-cyan/80 px-1.5 py-0.5 rounded bg-cyan/5 border border-cyan/10 transition-colors">
                                <IconExternalLink size={6} /> {s.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-foreground-tertiary/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-foreground-tertiary/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-foreground-tertiary/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="space-y-2 pt-3 border-t border-white/5">
                  <div className="flex flex-wrap gap-1">
                    {!hasStarted && activeSuggestions.map((s) => (
                      <button key={s} onClick={() => handleSuggestionClick(s)} className="text-xs px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground-tertiary hover:text-foreground border border-white/10 transition-colors font-mono touch-action-manipulation" style={{ minHeight: 44 }}>
                        {s}
                      </button>
                    ))}
                    {hasStarted && messages[messages.length - 1]?.role === "assistant" && (
                      <div className="flex flex-wrap gap-1 w-full">
                        <span className="text-xs font-mono text-foreground-tertiary w-full mb-0.5">Suggested:</span>
                        {activeSuggestions.slice(0, 3).map((s) => (
                          <button key={s} onClick={() => handleSuggestionClick(s)} className="text-xs px-2.5 py-2 rounded bg-white/5 hover:bg-white/10 text-foreground-tertiary hover:text-foreground border border-white/10 transition-colors font-mono touch-action-manipulation" style={{ minHeight: 44 }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 w-full">
                    <input id="cyber-persona-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Ask Cyber Persona anything..." className="flex-1 min-w-0 px-3 py-2.5 text-xs sm:text-[11px] bg-white/5 border border-white/10 rounded-xl text-foreground outline-none placeholder:text-foreground-tertiary/30 focus:border-cyan/30 transition-colors touch-action-manipulation" style={{ minHeight: 44 }} />
                    <button onClick={handleSend} disabled={!input.trim() || isTyping} className="p-3 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan/20 transition-colors disabled:opacity-30 shrink-0 touch-action-manipulation" style={{ minWidth: 44, minHeight: 44 }}>
                      <IconSend size={16} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="lg:col-span-3 space-y-6">
              <PersonalityProfile />
              <CybersecurityInterests />
              <LiveStatus />
              <ActivityFeed />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-center">
            <p className="text-xs font-mono text-foreground-tertiary">
              Cyber Persona is an AI-powered digital twin that answers using only information available within this portfolio. <a href="/privacy" className="text-cyan hover:text-cyan/80">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
