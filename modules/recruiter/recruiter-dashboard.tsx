"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experiences } from "@/data/experience";
import { certificationRoadmap, vaultCertifications } from "@/data/certifications-vault";

import {
  IconDownload, IconExternalLink, IconShieldCheck, IconCode, IconBrandGithub,
  IconMail, IconBriefcase, IconSchool, IconCalendar, IconCheck, IconStar,
  IconCertificate, IconBrain, IconClock, IconX, IconUserShield, IconFileText,
  IconChevronDown, IconLink, IconFlag, IconMicrophone, IconQuestionMark, IconSend,
  IconPrinter, IconArrowRight, IconEye, IconFilter,
} from "@tabler/icons-react";

const profile = {
  name: "Maanas T Manoj",
  title: "Cybersecurity Engineer & Penetration Tester",
  status: "Open for Internship Opportunities",
  email: "maanas@cybernexus.io",
  github: "https://github.com/maanastmanoj",
  linkedin: "https://linkedin.com/in/maanas",
  portfolio: "https://cybernexus.io",
  intro: "Building secure systems through offensive security, defensive engineering, and AI-powered automation. Passionate about finding vulnerabilities before attackers do.",
  objective: "Seeking a challenging cybersecurity role where I can apply penetration testing, incident response, and security architecture expertise to protect critical infrastructure and drive security transformation.",
  availability: "Immediate (Internship / Full-time)",
  preferredRoles: ["Penetration Tester", "Security Engineer", "SOC Analyst", "Security Researcher"],
  interests: ["Offensive Security", "AI Security", "Cloud Security", "Threat Detection"],
  currentLearning: "Advanced Active Directory Attacks • Cloud Security Architecture • Malware Analysis",
  responseTime: "Within 24 hours",
  yearsLearning: 6,
};

const featuredProjectIds = ["sentinel-ai", "netdefend", "chainguard", "threat-hunter", "autopwn"];

function SectionTitle({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="text-cyan"><Icon size={14} /></div>
      <h2 className="text-xs font-mono text-foreground-tertiary uppercase tracking-widest">{label}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-2" />
    </div>
  );
}

function PortableText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <p className={cn("text-sm text-foreground/80 leading-relaxed", className)}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} className="text-foreground font-medium">{part.slice(2, -2)}</strong>
          : part
      )}
    </p>
  );
}

function ProfileHeader() {
  const ui = useUIStore();
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan/20 to-purple/20 border border-white/10 flex items-center justify-center">
          <IconUserShield size={36} className="text-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-mono text-purple tracking-wider uppercase">.recruiter-mode</span>
            <button onClick={() => ui.setRecruiterMode(false)} className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/5 text-foreground-tertiary hover:text-foreground hover:bg-white/10 transition-colors border border-white/10">
              <IconX size={8} className="inline mr-0.5" />Exit
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-foreground">{profile.name}</h1>
          <p className="text-sm text-foreground-secondary">{profile.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {profile.status}
            </span>
            <span className="text-xs text-foreground-tertiary font-mono">{profile.yearsLearning}+ years</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="primary" size="sm" onClick={() => { const a = document.createElement("a"); a.href = "/resume"; a.click(); }}>
            <IconDownload size={14} /> Resume
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { const a = document.createElement("a"); a.href = "mailto:" + profile.email; a.click(); }}>
            <IconMail size={14} /> Contact
          </Button>
        </div>
      </div>
      <PortableText text={profile.intro} className="mt-4 max-w-2xl text-sm text-foreground/70" />
    </motion.div>
  );
}

function PortfolioHighlights() {
  const totalProjects = projects.length;
  const totalSkills = skills.filter((s) => s.level >= 80).length;
  const totalCerts = certificationRoadmap.length;
  const totalLanguages = [...new Set(projects.flatMap((p) => p.languages || []))].length;
  const featuredCount = projects.filter((p) => p.featured).length;

  const items = [
    { value: totalProjects, label: "Projects Built", color: "#06b6d4" },
    { value: featuredCount, label: "Featured Projects", color: "#8b5cf6" },
    { value: totalSkills, label: "Expert Skills", color: "#22c55e" },
    { value: totalCerts, label: "Certifications", color: "#f97316" },
    { value: totalLanguages, label: "Languages", color: "#3b82f6" },
    { value: profile.yearsLearning, label: "Years Learning", suffix: "+", color: "#ec4899" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Portfolio Highlights" icon={IconStar} />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {items.map((item) => (
          <div key={item.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-lg sm:text-xl font-light tabular-nums" style={{ color: item.color }}>{item.value}{item.suffix || "+"}</div>
            <div className="text-xs font-mono text-foreground-tertiary mt-0.5 leading-tight">{item.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ExecutiveSummary() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Why Interview Me" icon={IconUserShield} />
      <GlassCard className="p-5 sm:p-6" glow="cyan" intensity="low">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2">Professional Summary</h3>
            <PortableText text={profile.objective} className="text-sm" />
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5">Technical Strengths</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map((i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-lg bg-cyan/5 text-cyan border border-cyan/10 font-mono">{i}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5">Availability</h3>
              <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                <IconClock size={12} className="text-foreground-tertiary" /> {profile.availability}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1.5">Preferred Roles</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.preferredRoles.map((r) => (
                  <span key={r} className="text-xs px-2 py-1 rounded-lg bg-purple/5 text-purple border border-purple/10 font-mono">{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function FeaturedProjects() {
  const featured = useMemo(() =>
    featuredProjectIds.map((id) => projects.find((p) => p.id === id)).filter(Boolean),
  []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Featured Projects" icon={IconCode} />
      <div className="space-y-3">
        {featured.map((project, i) => {
          if (!project) return null;
          const summary = project.recruiterSummary;
          return (
            <GlassCard key={project.id} className="p-4 sm:p-5" glow="none" intensity="low">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-cyan/5 text-cyan border border-cyan/10">{project.category.replace("-", " ")}</span>
                    <span className={cn("text-xs font-mono", project.difficulty === "expert" ? "text-red-400" : project.difficulty === "advanced" ? "text-orange-400" : "text-yellow-400")}>{project.difficulty}</span>
                    {project.featured && <IconStar size={8} className="text-yellow-500" />}
                  </div>
                  <h3 className="text-sm font-medium text-foreground">{project.title}</h3>
                  <p className="text-xs text-foreground-tertiary mt-0.5">{project.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {project.links.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground-tertiary hover:text-foreground transition-colors">
                      <IconBrandGithub size={12} />
                    </a>
                  )}
                  {project.links.live && (
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground-tertiary hover:text-foreground transition-colors">
                      <IconExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
              {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-xs text-foreground/70 leading-relaxed">{summary.overview}</p>
                    {summary.businessValue && (
                      <p className="text-xs text-foreground-tertiary/70 mt-1.5 italic leading-relaxed">{summary.businessValue}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {summary.skillsDemonstrated.slice(0, 4).map((s) => (
                        <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-foreground-tertiary font-mono">{s}</span>
                      ))}
                      {summary.skillsDemonstrated.length > 4 && <span className="text-xs text-foreground-tertiary font-mono">+{summary.skillsDemonstrated.length - 4}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {summary.keyAchievements.slice(0, 2).map((a) => (
                        <span key={a} className="flex items-center gap-0.5 text-xs text-green-500 font-mono"><IconCheck size={6} />{a}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-foreground-tertiary font-mono">
                      <span className="flex items-center gap-0.5"><IconClock size={8} /> {summary.timeInvested}</span>
                      {summary.teamSize && <span>· {summary.teamSize}</span>}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
      <div className="mt-3 text-center">
        <a href="/projects" className="inline-flex items-center gap-1 text-xs font-mono text-cyan hover:text-cyan/80 transition-colors">
          View all {projects.length} projects <IconArrowRight size={10} />
        </a>
      </div>
    </motion.div>
  );
}

function ProjectComparisonTable() {
  const [sortBy, setSortBy] = useState<"difficulty" | "title">("difficulty");
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

  const visible = useMemo(() => {
    let result = [...projects];
    if (filterDifficulty) result = result.filter((p) => p.difficulty === filterDifficulty);
    result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      const rank = { expert: 0, advanced: 1, intermediate: 2, beginner: 3 };
      return (rank[a.difficulty] ?? 99) - (rank[b.difficulty] ?? 99);
    });
    return result;
  }, [sortBy, filterDifficulty]);

  const difficulties = [...new Set(projects.map((p) => p.difficulty))];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Project Comparison" icon={IconFilter} />
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-foreground-tertiary">Sort:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "difficulty" | "title")} className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-foreground font-mono outline-none focus:border-cyan/30">
            <option value="difficulty">Difficulty</option>
            <option value="title">Name</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          {difficulties.map((d) => (
            <button key={d} onClick={() => setFilterDifficulty(filterDifficulty === d ? null : d)} className={cn("text-xs font-mono px-1.5 py-1 rounded-lg border transition-all", filterDifficulty === d ? "bg-cyan/10 border-cyan/30 text-cyan" : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground")}>
              {d}
            </button>
          ))}
          {filterDifficulty && <button onClick={() => setFilterDifficulty(null)} className="text-xs font-mono text-foreground-tertiary hover:text-foreground px-1">Clear</button>}
        </div>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full px-4 sm:px-0">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-2 px-2 text-foreground-tertiary font-medium">Project</th>
                <th className="text-left py-2 px-2 text-foreground-tertiary font-medium">Category</th>
                <th className="text-left py-2 px-2 text-foreground-tertiary font-medium hidden sm:table-cell">Skills</th>
                <th className="text-left py-2 px-2 text-foreground-tertiary font-medium">Difficulty</th>
                <th className="text-center py-2 px-2 text-foreground-tertiary font-medium">Links</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 px-2">
                    <div className="text-foreground text-xs font-medium">{p.title}</div>
                    <div className="text-xs text-foreground-tertiary truncate max-w-[120px] sm:max-w-[200px]">{p.description}</div>
                  </td>
                  <td className="py-2 px-2 text-foreground-tertiary">{p.category.replace("-", " ")}</td>
                  <td className="py-2 px-2 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-0.5 max-w-[200px]">
                      {(p.recruiterSummary?.skillsDemonstrated || p.tags || []).slice(0, 3).map((s) => (
                        <span key={s} className="text-xs px-1 py-0.5 rounded bg-white/5 text-foreground-tertiary">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <span className={cn("text-xs font-medium", p.difficulty === "expert" ? "text-red-400" : p.difficulty === "advanced" ? "text-orange-400" : p.difficulty === "intermediate" ? "text-yellow-400" : "text-green-400")}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {p.links.github && <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-white/10 text-foreground-tertiary hover:text-foreground transition-colors"><IconBrandGithub size={10} /></a>}
                      {p.links.live && <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-white/10 text-foreground-tertiary hover:text-foreground transition-colors"><IconExternalLink size={10} /></a>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function TechnicalSkills() {
  const categories = useMemo(() => {
    const map = new Map<string, typeof skills>();
    skills.forEach((s) => {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    });
    return Array.from(map.entries());
  }, []);

  const categoryLabels: Record<string, string> = {
    offensive: "Offensive Security", defensive: "Defensive Security", cloud: "Cloud & DevSecOps",
    forensics: "Forensics", programming: "Programming", ai: "AI / ML",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Technical Skills" icon={IconBrain} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map(([cat, catSkills]) => (
          <GlassCard key={cat} className="p-4" glow="none" intensity="low">
            <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2.5">{categoryLabels[cat] || cat}</h3>
            <div className="space-y-2">
              {catSkills.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{s.name}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.level}%`, background: s.color }} />
                    </div>
                    <span className="text-xs font-mono text-foreground-tertiary w-5 text-right">{s.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}

function CertificationSummary() {
  const certs = vaultCertifications;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Certifications" icon={IconCertificate} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {certs.slice(0, 9).map((cert) => (
          <div key={cert.credentialId} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-start gap-2">
              <IconShieldCheck size={12} className="text-cyan mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground truncate">{cert.name}</div>
                <div className="text-xs text-foreground-tertiary">{cert.issuer}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-foreground-tertiary">{cert.date}</span>
                  {cert.skills && <span className="text-xs font-mono text-foreground-tertiary">· {cert.skills.length} skills</span>}
                </div>
                {cert.verificationUrl && (
                  <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-xs text-cyan hover:text-cyan/80 mt-1 font-mono">
                    Verify <IconExternalLink size={6} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">
        <a href="/certifications" className="inline-flex items-center gap-1 text-xs font-mono text-cyan hover:text-cyan/80 transition-colors">
          View all certifications <IconArrowRight size={8} />
        </a>
      </div>
    </motion.div>
  );
}

function ExperienceTimeline() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Experience & Education" icon={IconBriefcase} />
      <div className="space-y-3">
        {experiences.map((exp, i) => (
          <div key={`${exp.company}-${exp.role}`} className="relative pl-8">
            <div className="absolute left-[11px] top-1 w-3 h-3 rounded-full bg-deep-navy border-2 flex items-center justify-center" style={{ borderColor: exp.type === "work" ? "#06b6d4" : "#8b5cf6" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: exp.type === "work" ? "#06b6d4" : "#8b5cf6" }} />
            </div>
            <GlassCard className="p-3 sm:p-4" glow="none" intensity="low">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {exp.type === "work" ? <IconBriefcase size={10} className="text-cyan" /> : <IconSchool size={10} className="text-purple" />}
                    <span className="text-xs font-mono text-foreground-tertiary uppercase">{exp.type}</span>
                  </div>
                  <h3 className="text-xs font-medium text-foreground">{exp.role}</h3>
                  <p className="text-xs text-cyan/70">{exp.company}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-foreground-tertiary shrink-0">
                  <IconCalendar size={8} /> {exp.period}
                </div>
              </div>
              {exp.highlights.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {exp.highlights.slice(0, 2).map((h, j) => (
                    <span key={j} className="flex items-center gap-1 text-xs text-foreground/60"><IconCheck size={7} className="text-green-500 shrink-0" />{h}</span>
                  ))}
                  {exp.highlights.length > 2 && <span className="text-xs text-foreground-tertiary">+{exp.highlights.length - 2} more</span>}
                </div>
              )}
            </GlassCard>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ResumeCenter() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Resume Center" icon={IconFileText} />
      <GlassCard className="p-5" glow="cyan" intensity="low">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground">Always One Click Away</h3>
            <p className="text-xs text-foreground-tertiary mt-0.5">Download, view online, or share my professional resume.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/resume"><Button variant="primary" size="sm"><IconDownload size={12} /> PDF</Button></a>
            <a href="/resume"><Button variant="secondary" size="sm"><IconEye size={12} /> View Online</Button></a>
            <button onClick={() => window.print()} className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-white/5 border border-white/10 text-foreground-tertiary hover:text-foreground hover:bg-white/10 transition-colors">
              <IconPrinter size={10} /> Print
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.origin + "/resume"); }} className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-white/5 border border-white/10 text-foreground-tertiary hover:text-foreground hover:bg-white/10 transition-colors">
              <IconLink size={10} /> Copy Link
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function InterviewPrep() {
  const questions = [
    { q: "Tell me about yourself.", a: "I'm a cybersecurity engineer with expertise in penetration testing, incident response, and AI-driven security. I've built enterprise-grade SOC platforms, discovered vulnerabilities in major platforms, and published security research. I'm currently pursuing advanced certifications and exploring cloud security." },
    { q: "Describe your strongest project.", a: "Sentinel AI is my flagship project — an enterprise SOC platform processing 10M+ events daily with 99.7% detection rate. I built the full stack from eBPF network sensors to ML detection models to a React dashboard. It reduced detection time from 48 hours to 3 minutes and saved an estimated $2.4M annually." },
    { q: "Explain your SOC Dashboard.", a: "The SOC Dashboard provides real-time security monitoring with live alert feeds, MITRE ATT&CK coverage mapping, incident investigation tools, and automated response playbooks. It handles 10M+ events daily with sub-50ms latency and supports 15,000+ endpoints." },
    { q: "What cybersecurity tools are you most comfortable with?", a: "I work extensively with Burp Suite, Metasploit, Cobalt Strike, Wireshark, Elasticsearch, and TensorFlow. I also develop custom tooling in Python, Rust, and Go for specific security use cases." },
    { q: "How do you approach penetration testing?", a: "I follow a structured methodology: reconnaissance and enumeration, vulnerability identification, exploitation and privilege escalation, lateral movement, and documentation. I use both automated scanners and manual techniques, always adhering to scope and rules of engagement." },
    { q: "What are you currently learning?", a: "I'm actively studying advanced Active Directory attack paths, cloud security architecture on AWS/Azure, and malware analysis. I'm also working toward my OSCP certification to validate hands-on penetration testing skills." },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Interview Preparation" icon={IconMicrophone} />
      <div className="space-y-1.5">
        {questions.map((item, i) => (
          <div key={i} className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.02] transition-colors">
              <span className="flex items-center gap-2 text-[11px] text-foreground">
                <IconQuestionMark size={10} className="text-cyan shrink-0" />
                {item.q}
              </span>
              <IconChevronDown size={12} className={cn("text-foreground-tertiary transition-transform shrink-0", openIndex === i && "rotate-180")} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-3 pb-3">
                    <p className="text-xs text-foreground/70 leading-relaxed">{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RecruiterFAQ() {
  const faqs = [
    { q: "What type of roles are you looking for?", a: "I'm seeking penetration testing, security engineering, and SOC analyst roles — preferably in environments where I can apply offensive and defensive security expertise to solve real-world problems." },
    { q: "Where are you located?", a: "Available for remote or on-site positions. Open to relocation for the right opportunity." },
    { q: "Are you available for internships?", a: "Yes, actively seeking internship opportunities to apply and expand my cybersecurity skills in a professional environment." },
    { q: "What technologies do you use daily?", a: "Python, TypeScript, Go, Linux, Docker, Kubernetes, Burp Suite, Metasploit, Wireshark, Elasticsearch, TensorFlow, and various cloud platforms (AWS/Azure)." },
    { q: "Which projects best demonstrate your skills?", a: "Sentinel AI (enterprise SOC platform), NetDefend (zero-trust network security), and ChainGuard (blockchain security) best showcase my full-stack security engineering capabilities." },
    { q: "How can I contact you?", a: "Email is best — maanas@cybernexus.io. I typically respond within 24 hours. You can also reach me on LinkedIn or GitHub." },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Recruiter FAQ" icon={IconQuestionMark} />
      <div className="space-y-1.5">
        {faqs.map((item, i) => (
          <div key={i} className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.02] transition-colors">
              <span className="flex items-center gap-2 text-[11px] text-foreground">
                <IconFlag size={10} className="text-purple shrink-0" />
                {item.q}
              </span>
              <IconChevronDown size={12} className={cn("text-foreground-tertiary transition-transform shrink-0", openIndex === i && "rotate-180")} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-3 pb-3">
                    <p className="text-xs text-foreground/70 leading-relaxed">{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ContactPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Contact" icon={IconSend} />
      <GlassCard className="p-5" glow="purple" intensity="low">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            {[
              { icon: IconMail, label: "Email", value: profile.email, href: "mailto:" + profile.email },
              { icon: IconBrandGithub, label: "GitHub", value: "maanastmanoj", href: profile.github },
              { icon: IconExternalLink, label: "LinkedIn", value: "in/maanas", href: profile.linkedin },
              { icon: IconLink, label: "Portfolio", value: "cybernexus.io", href: profile.portfolio },
            ].map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                  <item.icon size={12} className="text-foreground-tertiary" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">{item.label}</div>
                  <div className="text-xs text-foreground truncate">{item.value}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1">Preferred Contact</div>
              <div className="text-xs text-foreground">Email (fastest response)</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1">Response Time</div>
              <div className="flex items-center gap-1.5 text-xs text-foreground">
                <IconClock size={10} className="text-green-500" /> {profile.responseTime}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-1">Quick Actions</div>
              <div className="flex items-center gap-2">
                <a href={"mailto:" + profile.email} className="flex items-center gap-1 px-2 py-1 text-xs font-mono rounded-lg bg-cyan/10 text-cyan border border-cyan/20 hover:bg-cyan/15 transition-colors">
                  <IconSend size={8} /> Send Email
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 text-xs font-mono rounded-lg bg-white/5 text-foreground-tertiary border border-white/10 hover:text-foreground hover:bg-white/10 transition-colors">
                  <IconExternalLink size={8} /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function ExportOptions() {
  const generatePDF = (label: string) => {
    const content = `${profile.name} - ${label}\nGenerated from Cyber Nexus Portfolio\n\n${window.location.href}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${label.toLowerCase().replace(/\s+/g, "-")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const exports = [
    { label: "Portfolio Summary", icon: IconFileText },
    { label: "Project List", icon: IconCode },
    { label: "Certification Report", icon: IconCertificate },
    { label: "Contact Card", icon: IconUserShield },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.4 }} className="mb-10">
      <SectionTitle label="Export" icon={IconDownload} />
      <div className="flex flex-wrap gap-2">
        {exports.map((exp) => (
          <button key={exp.label} onClick={() => generatePDF(exp.label)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-xl bg-white/5 border border-white/10 text-foreground-tertiary hover:text-foreground hover:bg-white/10 hover:border-white/20 transition-all">
            <exp.icon size={10} /> {exp.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function RecruiterDashboard() {
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ProfileHeader />
        <PortfolioHighlights />
        <ExecutiveSummary />
        <FeaturedProjects />
        <ProjectComparisonTable />
        <TechnicalSkills />
        <CertificationSummary />
        <ExperienceTimeline />
        <ResumeCenter />
        <InterviewPrep />
        <RecruiterFAQ />
        <ContactPanel />
        <ExportOptions />
      </div>
    </div>
  );
}
