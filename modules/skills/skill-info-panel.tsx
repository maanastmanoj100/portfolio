"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconExternalLink, IconBook, IconCode, IconCertificate, IconFolder, IconBrain } from "@tabler/icons-react";
import { GlassCard } from "@/components/ui/glass-card";
import { getSkillByName, getRelatedSkills, getConnectionsForSkill } from "@/data/skills-galaxy";
import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import type { GalaxySkill } from "@/types";

interface SkillInfoPanelProps {
  skillName: string | null;
  onClose: () => void;
  onSelectSkill: (name: string) => void;
}

const levelLabels: Record<string, string> = {
  core: "Core Expertise",
  intermediate: "Proficient",
  learning: "In Progress",
  expert: "Expert Level",
};

const clusterColors: Record<string, string> = {
  programming: "#2563eb",
  cybersecurity: "#ef4444",
  cloud: "#ff9900",
  networking: "#06b6d4",
  os: "#fcc624",
  web: "#61dafb",
  ai: "#ff6f00",
  automation: "#6366f1",
  devops: "#f05032",
  forensics: "#f43f5e",
  "reverse-engineering": "#ec4899",
  osint: "#14b8a6",
  mobile: "#3ddc84",
};

const clusterLabels: Record<string, string> = {
  programming: "Programming", cybersecurity: "Cybersecurity", cloud: "Cloud",
  networking: "Networking", os: "Operating Systems", web: "Web Development",
  ai: "AI & ML", automation: "Automation", devops: "DevOps",
  forensics: "Digital Forensics", "reverse-engineering": "Reverse Engineering",
  osint: "OSINT", mobile: "Mobile Security",
};

function SkillNodeMini({ name, color, isSelected, onSelect }: { name: string; color: string; isSelected: boolean; onSelect: (name: string) => void }) {
  return (
    <button
      onClick={() => onSelect(name)}
      className={`px-2 py-1 rounded-lg text-xs font-mono transition-all border ${
        isSelected
          ? "bg-current/10 border-current/30 text-foreground"
          : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground hover:border-white/20"
      }`}
      style={{ color: isSelected ? color : undefined, borderColor: isSelected ? `${color}80` : undefined }}
    >
      {name}
    </button>
  );
}

export function SkillInfoPanel({ skillName, onClose, onSelectSkill }: SkillInfoPanelProps) {
  const skill = skillName ? getSkillByName(skillName) : null;

  const related = useMemo(() => {
    if (!skill) return [];
    return getRelatedSkills(skill.name);
  }, [skill]);

  const connections = useMemo(() => {
    if (!skill) return [];
    return getConnectionsForSkill(skill.name);
  }, [skill]);

  const skillProjects = useMemo(() => {
    if (!skill?.projectIds) return [];
    return projects.filter((p) => skill.projectIds?.includes(p.id));
  }, [skill]);

  const skillCerts = useMemo(() => {
    if (!skill?.certificationIds) return [];
    return certifications.filter((c) => skill.certificationIds?.includes(c.badge));
  }, [skill]);

  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: 20, height: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          <GlassCard className="p-6" glow="blue" intensity="low">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded-full border"
                    style={{ color: clusterColors[skill.cluster], borderColor: `${clusterColors[skill.cluster]}40`, background: `${clusterColors[skill.cluster]}10` }}
                  >
                    {clusterLabels[skill.cluster]}
                  </span>
                  <span className="text-xs font-mono text-foreground-tertiary">{levelLabels[skill.nodeType]}</span>
                </div>
                <h2 className="text-xl font-medium text-foreground">{skill.name}</h2>
                <p className="text-xs text-foreground-tertiary mt-1 max-w-2xl">{skill.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/5 text-foreground-tertiary hover:text-foreground transition-colors"
              >
                <IconX size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">Level</div>
                <div className="text-sm font-medium text-foreground mt-1">{skill.level}%</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">Experience</div>
                <div className="text-sm font-medium text-foreground mt-1">{skill.yearsPracticed} years</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">Projects</div>
                <div className="text-sm font-medium text-foreground mt-1">{skillProjects.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider">Related Skills</div>
                <div className="text-sm font-medium text-foreground mt-1">{related.length}</div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2">Related Technologies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {related.map((r) => (
                    <SkillNodeMini key={r.name} name={r.name} color={r.color} isSelected={false} onSelect={onSelectSkill} />
                  ))}
                </div>
              </div>
            )}

            {skillProjects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <IconFolder size={12} /> Projects Using {skill.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {skillProjects.map((p) => (
                    <a
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${p.gradient}20`, color: p.category ? "#06b6d4" : undefined }}>
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

            {skillCerts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <IconCertificate size={12} /> Related Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillCerts.map((c) => (
                    <a
                      key={c.name}
                      href="/certifications"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <div className="text-xs font-medium text-foreground">{c.name}</div>
                      <span className="text-xs text-foreground-tertiary">{c.issuer}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {skill.exampleCommands && skill.exampleCommands.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <IconCode size={12} /> Example Commands
                </h3>
                <div className="space-y-2">
                  {skill.exampleCommands.map((ec, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-black/30 border border-white/5 font-mono">
                      <div className="text-[11px] text-cyan">{ec.command}</div>
                      <div className="text-xs text-foreground-tertiary mt-0.5">{ec.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skill.learningResources && skill.learningResources.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <IconBook size={12} /> Learning Resources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.learningResources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-foreground-tertiary hover:text-foreground"
                    >
                      {r.type === "book" ? "📖" : r.type === "course" ? "🎓" : r.type === "video" ? "🎬" : "📄"}
                      {r.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {skill.githubRepos && skill.githubRepos.length > 0 && (
              <div>
                <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <IconBrain size={12} /> GitHub Repositories
                </h3>
                <div className="space-y-2">
                  {skill.githubRepos.map((repo, i) => (
                    <a
                      key={i}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <IconCode size={14} className="text-foreground-tertiary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-foreground truncate">{repo.name}</div>
                        <div className="text-xs text-foreground-tertiary truncate">{repo.description}</div>
                      </div>
                      <IconExternalLink size={10} className="text-foreground-tertiary shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
