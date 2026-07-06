"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import {
  IconSearch, IconX, IconCertificate, IconShieldCheck, IconStar, IconExternalLink,
  IconFilter, IconClock, IconBook, IconCode, IconFlame, IconCloud, IconServer,
  IconNetwork, IconDeviceDesktop, IconBrain, IconEye, IconGlobe, IconBriefcase,
  IconRadar, IconFlag, IconTrophy, IconSwords, IconChevronRight, IconArrowRight,
  IconCheck, IconLock, IconDownload, IconRefresh, IconUserShield,
} from "@tabler/icons-react";
import { vaultCertifications, achievements, certificationRoadmap, categoryConfig } from "@/data/certifications-vault";
import { projects } from "@/data/projects";
import type { Certification, Achievement, RoadmapEntry } from "@/types";

const difficultyColors: Record<string, string> = {
  beginner: "#22c55e", intermediate: "#eab308", advanced: "#f97316", expert: "#ef4444",
};

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced", expert: "Expert",
};

const statusColors: Record<string, string> = {
  completed: "#22c55e", "in-progress": "#eab308", planned: "#64748b", active: "#22c55e", expired: "#ef4444",
};

const categoryIcons: Record<string, typeof IconShieldCheck> = {
  cybersecurity: IconShieldCheck, networking: IconNetwork, cloud: IconCloud,
  programming: IconCode, linux: IconDeviceDesktop, "ethical-hacking": IconFlame,
  soc: IconRadar, forensics: IconSearch, osint: IconEye, ai: IconBrain,
  "web-security": IconGlobe, devops: IconServer, professional: IconBriefcase,
};

function AnimatedCounter({ value, label, color }: { value: number; label: string; color: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="text-xl sm:text-2xl font-light tabular-nums" style={{ color }}>{display}+</div>
      <div className="text-xs font-mono text-foreground-tertiary mt-0.5 text-center">{label}</div>
    </div>
  );
}

function CertificateCard({
  cert, featured, onSelect, recruiterMode,
}: {
  cert: Certification; featured?: boolean; onSelect: (cert: Certification) => void; recruiterMode: boolean;
}) {
  const category = cert.category ? categoryConfig[cert.category] : null;
  const CatIcon = cert.category ? categoryIcons[cert.category] || IconCertificate : IconCertificate;

  return (
    <motion.button
      layout
      onClick={() => onSelect(cert)}
      className={cn(
        "relative group text-left w-full overflow-hidden rounded-2xl border transition-all duration-300",
        featured
          ? "col-span-1 sm:col-span-2 lg:col-span-3 row-span-2 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-cyan/20 hover:border-cyan/40"
          : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]",
      )}
    >
      <div className={cn("p-5", featured && "sm:p-8")}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "shrink-0 rounded-xl flex items-center justify-center",
            featured ? "w-14 h-14 sm:w-20 sm:h-20" : "w-10 h-10",
            "bg-gradient-to-br from-white/5 to-white/10 border border-white/10"
          )}>
            <IconShieldCheck size={featured ? 28 : 18} className="text-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {category && (
                <span className="text-xs font-mono px-1.5 py-0.5 rounded-full border" style={{ color: category.color, borderColor: `${category.color}30`, background: `${category.color}10` }}>
                  <CatIcon size={8} className="inline mr-0.5" />{category.label}
                </span>
              )}
              {cert.difficulty && (
                <span className="text-xs font-mono px-1.5 py-0.5 rounded-full" style={{ color: difficultyColors[cert.difficulty], background: `${difficultyColors[cert.difficulty]}10` }}>
                  {difficultyLabels[cert.difficulty]}
                </span>
              )}
              {cert.featured && (
                <span className="flex items-center gap-0.5 text-xs font-mono px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                  <IconStar size={8} />Featured
                </span>
              )}
            </div>
            <h3 className={cn("font-medium text-foreground", featured ? "text-lg sm:text-xl" : "text-sm")}>{cert.name}</h3>
            <p className="text-xs text-foreground-tertiary mt-0.5">{cert.issuer}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-foreground-tertiary">
              <span>{cert.date}</span>
              {cert.credentialId && <span>ID: {cert.credentialId}</span>}
              {cert.status && (
                <span className="flex items-center gap-1" style={{ color: statusColors[cert.status] }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[cert.status] }} />
                  {cert.status}
                </span>
              )}
            </div>

            {featured && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cert.learningHours && (
                  <div className="p-2 rounded-lg bg-white/5">
                    <div className="text-xs font-mono text-foreground-tertiary">Learning Hours</div>
                    <div className="text-sm font-medium text-cyan">{cert.learningHours}h</div>
                  </div>
                )}
                {cert.practicalLabs && (
                  <div className="p-2 rounded-lg bg-white/5">
                    <div className="text-xs font-mono text-foreground-tertiary">Practical Labs</div>
                    <div className="text-sm font-medium text-cyan">{cert.practicalLabs}</div>
                  </div>
                )}
                {cert.skills && (
                  <div className="p-2 rounded-lg bg-white/5 sm:col-span-2">
                    <div className="text-xs font-mono text-foreground-tertiary">Key Skills</div>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {cert.skills.slice(0, 4).map((s) => (
                        <span key={s} className="text-xs px-1 py-0.5 rounded bg-white/5 text-foreground-tertiary">{s}</span>
                      ))}
                      {cert.skills.length > 4 && <span className="text-xs text-foreground-tertiary">+{cert.skills.length - 4}</span>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!recruiterMode && cert.careerValue && (
              <p className="text-xs text-foreground-tertiary/70 mt-2 italic leading-relaxed">{cert.careerValue}</p>
            )}
          </div>

          {!recruiterMode && (
            <div className="shrink-0">
              <IconChevronRight size={16} className="text-foreground-tertiary/30 group-hover:text-cyan/50 transition-colors" />
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function CertificateDetail({ cert, onClose, recruiterMode }: { cert: Certification; onClose: () => void; recruiterMode: boolean }) {
  const category = cert.category ? categoryConfig[cert.category] : null;
  const CatIcon = cert.category ? categoryIcons[cert.category] || IconCertificate : IconCertificate;
  const certProjects = useMemo(() => {
    if (!cert.projectsBuilt) return [];
    return projects.filter((p) => cert.projectsBuilt?.includes(p.id));
  }, [cert]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-6"
    >
      <GlassCard className="p-6 sm:p-8" glow="cyan" intensity="medium">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-cyan/10 to-purple/10 border border-white/10 flex items-center justify-center">
              <IconShieldCheck size={28} className="text-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {category && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border" style={{ color: category.color, borderColor: `${category.color}30`, background: `${category.color}10` }}>
                    <CatIcon size={9} className="inline mr-0.5" />{category.label}
                  </span>
                )}
                {cert.difficulty && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: difficultyColors[cert.difficulty], background: `${difficultyColors[cert.difficulty]}10` }}>
                    {difficultyLabels[cert.difficulty]}
                  </span>
                )}
                {cert.featured && (
                  <span className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <IconStar size={9} />Featured
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-medium text-foreground mt-1">{cert.name}</h2>
              <p className="text-sm text-foreground-tertiary">{cert.issuer}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-foreground-tertiary hover:text-foreground transition-colors">
            <IconX size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-white/5">
            <div className="text-xs font-mono text-foreground-tertiary uppercase">Issued</div>
            <div className="text-sm font-medium text-foreground mt-0.5">{cert.date}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="text-xs font-mono text-foreground-tertiary uppercase">Credential ID</div>
            <div className="text-xs font-mono text-foreground mt-0.5 break-all">{cert.credentialId}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="text-xs font-mono text-foreground-tertiary uppercase">Learning Hours</div>
            <div className="text-sm font-medium text-foreground mt-0.5">{cert.learningHours || "—"}h</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <div className="text-xs font-mono text-foreground-tertiary uppercase">Practical Labs</div>
            <div className="text-sm font-medium text-foreground mt-0.5">{cert.practicalLabs || "—"}</div>
          </div>
        </div>

        {cert.description && (
          <div className="mb-6">
            <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{cert.description}</p>
          </div>
        )}

        {cert.careerValue && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-cyan/5 to-purple/5 border border-cyan/10">
            <p className="text-xs text-foreground/70 italic">{cert.careerValue}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {cert.skills && cert.skills.length > 0 && (
            <div>
              <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {cert.skills.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-foreground/70 border border-white/10 font-mono">{s}</span>
                ))}
              </div>
            </div>
          )}
          {cert.topics && cert.topics.length > 0 && (
            <div>
              <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2">Topics Covered</h3>
              <div className="flex flex-wrap gap-1.5">
                {cert.topics.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-foreground/70 border border-white/10 font-mono">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {certProjects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <IconCode size={12} /> Projects Built
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {certProjects.map((p) => (
                <a key={p.id} href={`/projects/${p.id}`} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${p.gradient}20` }}>
                    {p.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">{p.title}</div>
                    <div className="text-xs text-foreground-tertiary truncate">{p.description}</div>
                  </div>
                  <IconExternalLink size={10} className="text-foreground-tertiary shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          {cert.verificationUrl && (
            <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-xl bg-cyan/10 text-cyan hover:bg-cyan/15 transition-colors border border-cyan/20">
              <IconShieldCheck size={12} /> Verify Credential
            </a>
          )}
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-xl bg-white/5 text-foreground-tertiary hover:text-foreground hover:bg-white/10 transition-colors border border-white/10">
            <IconDownload size={12} /> Download Certificate
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center shrink-0" style={{ color: achievement.color }}>
          {achievement.type === "ctf" ? <IconFlag size={18} /> :
           achievement.type === "hackathon" ? <IconTrophy size={18} /> :
           achievement.type === "competition" ? <IconSwords size={18} /> :
           achievement.type === "opensource" ? <IconCode size={18} /> :
           achievement.type === "recognition" ? <IconStar size={18} /> :
           <IconStar size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-medium text-foreground">{achievement.title}</h4>
          <p className="text-xs text-foreground-tertiary mt-0.5">{achievement.issuer} · {achievement.date}</p>
          <p className="text-xs text-foreground-tertiary/70 mt-1 leading-relaxed">{achievement.description}</p>
          {achievement.skills && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {achievement.skills.map((s) => (
                <span key={s} className="text-xs px-1 py-0.5 rounded bg-white/5 text-foreground-tertiary font-mono">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RoadmapSection({ roadmap }: { roadmap: RoadmapEntry[] }) {
  const categories = useMemo(() => {
    const cats = new Map<string, RoadmapEntry[]>();
    roadmap.forEach((entry) => {
      if (!cats.has(entry.category)) cats.set(entry.category, []);
      cats.get(entry.category)!.push(entry);
    });
    return Array.from(cats.entries());
  }, [roadmap]);

  return (
    <div className="space-y-6">
      {categories.map(([cat, entries]) => (
        <div key={cat}>
          <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">{catConfig(cat)?.label || cat}</h3>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
            <div className="space-y-4 pl-8">
              {entries.map((entry, i) => (
                <div key={entry.badge} className="relative">
                  <div className={cn(
                    "absolute -left-8 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    entry.status === "completed" ? "bg-green-500/10 border-green-500/30" :
                    entry.status === "in-progress" ? "bg-yellow-500/10 border-yellow-500/30" :
                    "bg-white/5 border-white/10"
                  )}>
                    {entry.status === "completed" ? <IconCheck size={10} className="text-green-500" /> :
                     entry.status === "in-progress" ? <IconRefresh size={10} className="text-yellow-500" /> :
                     <IconLock size={10} className="text-foreground-tertiary/50" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-xl border transition-all",
                    entry.status === "completed" ? "bg-white/[0.02] border-white/10" :
                    entry.status === "in-progress" ? "bg-yellow-500/[0.02] border-yellow-500/20" :
                    "bg-white/[0.01] border-white/5 opacity-50"
                  )}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{entry.certName}</span>
                      <span className={cn(
                        "text-xs font-mono px-1.5 py-0.5 rounded",
                        entry.status === "completed" ? "bg-green-500/10 text-green-500" :
                        entry.status === "in-progress" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-white/5 text-foreground-tertiary"
                      )}>{entry.status}</span>
                    </div>
                    <p className="text-xs text-foreground-tertiary mt-0.5">{entry.description}</p>
                    {entry.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.skills.map((s) => (
                          <span key={s} className="text-xs px-1 py-0.5 rounded bg-white/5 text-foreground-tertiary/70 font-mono">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function catConfig(cat: string) {
  return categoryConfig[cat] || null;
}

export function CertificateVaultPage() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const recruiterMode = useUIStore((s) => s.recruiterMode);

  const filteredCerts = useMemo(() => {
    let result = vaultCertifications;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (activeCategory) {
      result = result.filter((c) => c.category === activeCategory);
    }
    return result;
  }, [searchQuery, activeCategory]);

  const featuredCert = useMemo(() => vaultCertifications.find((c) => c.featured && c.badge === "oscp"), []);

  const stats = useMemo(() => ({
    total: vaultCertifications.length,
    hours: vaultCertifications.reduce((a, c) => a + (c.learningHours || 0), 0),
    platforms: new Set(vaultCertifications.map((c) => c.issuer)).size,
    labs: vaultCertifications.reduce((a, c) => a + (c.practicalLabs || 0), 0),
    projects: new Set(vaultCertifications.flatMap((c) => c.projectsBuilt || [])).size,
    active: vaultCertifications.filter((c) => c.status === "active").length,
  }), []);

  const categories = useMemo(() => {
    const cats = new Set(vaultCertifications.map((c) => c.category).filter(Boolean) as string[]);
    return Array.from(cats).sort();
  }, []);

  const handleSelectCert = useCallback((cert: Certification) => {
    setSelectedCert((prev) => prev?.credentialId === cert.credentialId ? null : cert);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-purple font-mono tracking-wider uppercase">.vault</span>
              {recruiterMode && <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/20">Recruiter View</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-foreground">
              Certificate <span className="text-gradient font-medium">Vault</span>
            </h1>
            <p className="text-foreground-tertiary text-xs mt-1.5 max-w-xl">
              A curated collection of cybersecurity certifications, technical achievements, and continuous professional development.
            </p>
          </motion.div>

          {!recruiterMode && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
              <AnimatedCounter value={stats.total} label="Certifications" color="#06b6d4" />
              <AnimatedCounter value={stats.hours} label="Learning Hours" color="#8b5cf6" />
              <AnimatedCounter value={stats.platforms} label="Platforms" color="#ff9900" />
              <AnimatedCounter value={stats.labs} label="Practical Labs" color="#22c55e" />
              <AnimatedCounter value={stats.projects} label="Projects Built" color="#f97316" />
              <AnimatedCounter value={stats.active} label="Active Certs" color="#3b82f6" />
            </motion.div>
          )}

          {featuredCert && !selectedCert && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-6">
              <CertificateCard cert={featuredCert} featured onSelect={handleSelectCert} recruiterMode={recruiterMode} />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-md w-full">
              <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search certifications, skills, issuers..."
                className="w-full h-9 pl-9 pr-8 text-xs bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-foreground-tertiary/50 focus:outline-none focus:border-cyan/30 focus:bg-white/10 transition-all" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-white/10 text-foreground-tertiary">
                  <IconX size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className={cn("flex items-center gap-1.5 px-3 h-9 text-xs font-mono rounded-xl border transition-all", showFilters || activeCategory ? "bg-cyan/10 border-cyan/30 text-cyan" : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground hover:border-white/20")}>
                <IconFilter size={12} /> Filters
              </button>
              <button onClick={() => setShowRoadmap(!showRoadmap)} className={cn("flex items-center gap-1.5 px-3 h-9 text-xs font-mono rounded-xl border transition-all", showRoadmap ? "bg-purple/10 border-purple/30 text-purple" : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground hover:border-white/20")}>
                <IconFlag size={12} /> Roadmap
              </button>
              {selectedCert && (
                <button onClick={() => setSelectedCert(null)} className="flex items-center gap-1.5 px-3 h-9 text-xs font-mono rounded-xl border border-white/10 bg-white/5 text-foreground-tertiary hover:text-foreground hover:border-white/20 transition-all">
                  <IconX size={12} /> Clear
                </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mb-4">
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {categories.map((cat) => {
                    const active = activeCategory === cat;
                    const config = categoryConfig[cat];
                    const CatIcon = categoryIcons[cat] || IconCertificate;
                    return (
                      <button key={cat} onClick={() => setActiveCategory(active ? null : cat)}
                        className={cn("flex items-center gap-1 text-xs font-mono px-2 py-1.5 rounded-lg border transition-all", active ? "border-current bg-current/10 text-current" : "border-white/10 text-foreground-tertiary hover:text-foreground hover:border-white/20")}
                        style={active ? { color: config?.color || "#06b6d4" } : undefined}>
                        <CatIcon size={10} /> {config?.label || cat}
                      </button>
                    );
                  })}
                  {activeCategory && <button onClick={() => setActiveCategory(null)} className="text-xs font-mono text-foreground-tertiary hover:text-foreground px-2 py-1.5">Clear all</button>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showRoadmap && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-4">Certification Roadmap</h3>
              <RoadmapSection roadmap={certificationRoadmap} />
            </motion.div>
          )}

          {selectedCert ? (
            <CertificateDetail cert={selectedCert} onClose={() => setSelectedCert(null)} recruiterMode={recruiterMode} />
          ) : searchQuery && filteredCerts.length === 0 ? (
            <div className="text-center py-12">
              <IconCertificate size={32} className="mx-auto text-foreground-tertiary/30 mb-3" />
              <p className="text-sm text-foreground-tertiary">No certifications match your search.</p>
            </div>
          ) : null}

          {!selectedCert && (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {filteredCerts.filter((c) => c.badge !== featuredCert?.badge).map((cert, i) => (
                <motion.div key={cert.badge} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.3 }}>
                  <CertificateCard cert={cert} onSelect={handleSelectCert} recruiterMode={recruiterMode} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!selectedCert && !recruiterMode && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <IconTrophy size={12} /> Achievement Wall
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
