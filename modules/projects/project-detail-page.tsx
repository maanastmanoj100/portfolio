"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PageTransition } from "@/components/layout/page-transition";
import { projects, PROJECT_CATEGORIES } from "@/data/projects";
import { ArchitectureViewer } from "./project-architecture-viewer";
import { SecurityAnalysis } from "./project-security-analysis";
import { ImplementationTimeline } from "./project-timeline";
import { CodeHighlights } from "./project-code-highlights";
import { AIProjectExplainer } from "./project-ai-explainer";
import type { Project } from "@/types";
import { IconArrowLeft, IconBrandGithub, IconExternalLink, IconFileText, IconBook, IconVideo, IconArrowUpRight, IconStar } from "@tabler/icons-react";

const difficultyColors: Record<string, string> = {
  beginner: "#3b82f6", intermediate: "#eab308", advanced: "#f97316", expert: "#ef4444",
};

const statusColors: Record<string, string> = {
  completed: "#10b981", in_progress: "#f59e0b", maintenance: "#3b82f6", archived: "#6b7280",
};

function ProjectHero({ project }: { project: Project }) {
  const catColor = PROJECT_CATEGORIES.find((c) => c.id === project.category)?.color || "#06b6d4";
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-white/[0.02] to-transparent">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/[0.03] via-transparent to-purple/[0.03]" />
      <div className="relative p-5 sm:p-6">
        <Link href="/projects">
          <button className="flex items-center gap-1 text-xs font-mono text-foreground-tertiary hover:text-foreground mb-4 transition-colors">
            <IconArrowLeft size={12} /> Back to Command Center
          </button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-1.5 py-0.5 rounded border" style={{ color: catColor, borderColor: `${catColor}30`, background: `${catColor}10` }}>
                {PROJECT_CATEGORIES.find((c) => c.id === project.category)?.label}
              </span>
              {project.secondaryCategories?.map((sc) => {
                const scColor = PROJECT_CATEGORIES.find((c) => c.id === sc)?.color || "#06b6d4";
                return (
                  <span key={sc} className="text-xs font-mono px-1 py-0.5 rounded border" style={{ color: scColor, borderColor: `${scColor}20`, background: `${scColor}08` }}>
                    {PROJECT_CATEGORIES.find((c) => c.id === sc)?.label}
                  </span>
                );
              })}
              {project.featured && <span className="text-xs font-mono text-cyan bg-cyan/10 px-1 py-0.5 rounded border border-cyan/20">FEATURED</span>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-light text-foreground">{project.title}</h1>
            <p className="text-xs sm:text-sm text-foreground-secondary mt-2 max-w-2xl leading-relaxed">{project.description}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-mono text-foreground-tertiary">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: difficultyColors[project.difficulty] }} />
                {project.difficulty}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[project.status] }} />
                {project.status}
              </span>
              <span>📅 {project.completionDate}</span>
              <span>⏱ {project.duration}</span>
              {project.stars && <span>★ {project.stars}</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-lg border border-border/40 text-foreground-secondary hover:text-foreground hover:border-border/60 transition-all bg-white/[0.02]">
                <IconBrandGithub size={12} /> GitHub
              </a>
            )}
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-lg border border-cyan/30 text-cyan hover:bg-cyan/10 transition-all bg-cyan/[0.03]">
                <IconExternalLink size={12} /> Live Demo
              </a>
            )}
            {project.links.case_study && (
              <a href={project.links.case_study} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-lg border border-purple/30 text-purple hover:bg-purple/10 transition-all bg-purple/[0.03]">
                <IconFileText size={12} /> Case Study
              </a>
            )}
            {project.links.documentation && (
              <a href={project.links.documentation} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-lg border border-border/40 text-foreground-secondary hover:text-foreground hover:border-border/60 transition-all bg-white/[0.02]">
                <IconBook size={12} /> Docs
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TechStackSection({ project }: { project: Project }) {
  const expColors: Record<string, string> = {
    expert: "#ef4444", advanced: "#f97316", intermediate: "#eab308",
  };
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Tech Stack</span>
      <div className="flex flex-wrap gap-2">
        {project.techStack.map((t) => (
          <div key={t.name} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-border/30 bg-white/[0.015] hover:border-cyan/20 transition-colors">
            <span className="text-xs font-mono text-foreground">{t.name}</span>
            <span className="text-xs font-mono px-1 py-0.5 rounded" style={{ background: `${expColors[t.experience]}15`, color: expColors[t.experience] }}>{t.experience}</span>
            <div className="text-xs text-foreground-tertiary max-w-[120px] truncate hidden sm:block">{t.usage}</div>
          </div>
        ))}
      </div>
      {project.languages.length > 0 && (
        <div className="mt-3">
          <span className="text-xs text-foreground-tertiary font-mono">Languages:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {project.languages.map((l) => (
              <span key={l} className="text-xs font-mono text-cyan bg-cyan/10 px-1.5 py-0.5 rounded border border-cyan/20">{l}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProblemSection({ project }: { project: Project }) {
  if (!project.problemStatement && !project.objectives && !project.challenges && !project.lessonsLearned) return null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {project.problemStatement && (
        <div className="glass-card p-4">
          <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-2 block">Problem Statement</span>
          <p className="text-xs text-foreground-secondary leading-relaxed">{project.problemStatement}</p>
        </div>
      )}
      {project.objectives && project.objectives.length > 0 && (
        <div className="glass-card p-4">
          <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-2 block">Objectives</span>
          <ul className="space-y-1">
            {project.objectives.map((o, i) => (
              <li key={i} className="text-xs text-foreground-secondary flex items-start gap-1.5">
                <span className="text-cyan shrink-0 mt-0.5">→</span>{o}
              </li>
            ))}
          </ul>
        </div>
      )}
      {project.challenges && project.challenges.length > 0 && (
        <div className="glass-card p-4">
          <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-2 block">Key Challenges</span>
          <ul className="space-y-1">
            {project.challenges.map((c, i) => (
              <li key={i} className="text-xs text-foreground-secondary flex items-start gap-1.5">
                <span className="text-orange-400 shrink-0 mt-0.5">⚠</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}
      {project.lessonsLearned && project.lessonsLearned.length > 0 && (
        <div className="glass-card p-4">
          <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-2 block">Lessons Learned</span>
          <ul className="space-y-1">
            {project.lessonsLearned.map((l, i) => (
              <li key={i} className="text-xs text-foreground-secondary flex items-start gap-1.5">
                <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>{l}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MetricsSection({ project }: { project: Project }) {
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Project Metrics</span>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {project.metrics.map((m) => (
          <div key={m.label} className="p-2.5 rounded-lg bg-white/[0.015] border border-border/20 text-center">
            <div className="text-base font-mono text-cyam font-medium">{m.value}{m.suffix || ""}</div>
            <div className="text-xs text-foreground-tertiary font-mono mt-0.5">{m.label}</div>
          </div>
        ))}
        {project.commits && (
          <div className="p-2.5 rounded-lg bg-white/[0.015] border border-border/20 text-center">
            <div className="text-base font-mono text-foreground font-medium">{project.commits.toLocaleString()}</div>
            <div className="text-xs text-foreground-tertiary font-mono mt-0.5">Commits</div>
          </div>
        )}
        {project.contributors && (
          <div className="p-2.5 rounded-lg bg-white/[0.015] border border-border/20 text-center">
            <div className="text-base font-mono text-foreground font-medium">{project.contributors}</div>
            <div className="text-xs text-foreground-tertiary font-mono mt-0.5">Contributors</div>
          </div>
        )}
        {project.loc && (
          <div className="p-2.5 rounded-lg bg-white/[0.015] border border-border/20 text-center">
            <div className="text-base font-mono text-foreground font-medium">{(project.loc / 1000).toFixed(0)}K</div>
            <div className="text-xs text-foreground-tertiary font-mono mt-0.5">Lines of Code</div>
          </div>
        )}
        {project.complexity && (
          <div className="p-2.5 rounded-lg bg-white/[0.015] border border-border/20 text-center">
            <div className="text-base font-mono capitalize" style={{ color: difficultyColors[project.complexity] }}>{project.complexity}</div>
            <div className="text-xs text-foreground-tertiary font-mono mt-0.5">Complexity</div>
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedProjects({ project }: { project: Project }) {
  const related = useMemo(() => projects.filter((p) => project.relatedProjects?.includes(p.id) && p.id !== project.id), [project]);
  if (related.length === 0) return null;
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Related Projects</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {related.map((rp) => (
          <Link key={rp.id} href={`/projects/${rp.id}`}>
            <div className="flex items-center gap-2 p-2.5 rounded-lg border border-border/30 hover:border-cyan/20 transition-all bg-white/[0.01] group">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-foreground font-medium group-hover:text-cyan transition-colors">{rp.title}</div>
                <div className="text-xs text-foreground-tertiary truncate">{rp.description}</div>
              </div>
              <IconArrowUpRight size={10} className="text-foreground-tertiary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FutureSection({ project }: { project: Project }) {
  if (!project.futureImprovements || project.futureImprovements.length === 0) return null;
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-2 block">Future Improvements</span>
      <ul className="space-y-1">
        {project.futureImprovements.map((f, i) => (
          <li key={i} className="text-xs text-foreground-secondary flex items-start gap-1.5">
            <span className="text-cyan shrink-0 mt-0.5">→</span>{f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecruiterView({ project }: { project: Project }) {
  const rs = project.recruiterSummary;
  if (!rs) return null;
  return (
    <div className="glass-card p-4 recruiter-highlight">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-3 block">Recruiter Summary</span>
      <p className="text-xs text-foreground-secondary leading-relaxed mb-3">{rs.overview}</p>
      <p className="text-xs text-foreground-tertiary leading-relaxed mb-3">{rs.businessValue}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <span className="text-xs text-cyan font-mono uppercase tracking-wider">Skills</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {rs.skillsDemonstrated.map((s) => (
              <span key={s} className="text-xs font-mono text-foreground-secondary bg-white/5 px-1.5 py-0.5 rounded border border-border/30">{s}</span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs text-cyan font-mono uppercase tracking-wider">Key Achievements</span>
          <ul className="space-y-0.5 mt-1">
            {rs.keyAchievements.map((a, i) => (
              <li key={i} className="text-xs text-foreground-secondary flex items-start gap-1">
                <span className="text-emerald-400 shrink-0">✓</span>{a}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-foreground-tertiary font-mono">
        <span>⏱ {rs.timeInvested}</span>
        <span>👥 {rs.teamSize}</span>
      </div>
    </div>
  );
}

function TagsSection({ project }: { project: Project }) {
  return (
    <div className="glass-card p-4">
      <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase mb-2 block">Tags</span>
      <div className="flex flex-wrap gap-1">
        {project.tags.map((t) => (
          <span key={t} className="text-xs font-mono text-foreground-tertiary bg-white/5 px-1.5 py-0.5 rounded border border-border/30 hover:border-cyan/20 hover:text-foreground-secondary transition-colors">{t}</span>
        ))}
      </div>
    </div>
  );
}

export function ProjectDetailPage({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    slugPromise.then((p) => {
      const found = projects.find((pr) => pr.id === p.slug);
      setProject(found || null);
      setLoading(false);
    });
  }, [slugPromise]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
          <div className="text-xs text-foreground-tertiary font-mono">Loading project workspace...</div>
        </div>
      </PageTransition>
    );
  }

  if (!project) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs text-foreground-tertiary font-mono mb-3">Project not found</div>
            <Link href="/projects">
              <button className="text-xs font-mono text-cyan border border-cyan/30 px-3 py-1.5 rounded-lg hover:bg-cyan/10 transition-colors">
                ← Back to Command Center
              </button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const sections: { id: string; label: string }[] = [
    { id: "overview", label: "Overview" },
    ...(project.architecture ? [{ id: "architecture", label: "Architecture" }] : []),
    ...(project.securityAnalysis ? [{ id: "security", label: "Security" }] : []),
    ...(project.implementationTimeline ? [{ id: "timeline", label: "Timeline" }] : []),
    ...(project.codeHighlights ? [{ id: "code", label: "Code" }] : []),
    ...(project.aiExplainers ? [{ id: "ai", label: "AI Explain" }] : []),
    ...(project.recruiterSummary ? [{ id: "recruiter", label: "Recruiter" }] : []),
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ProjectHero project={project} />

          <div className="flex gap-1 overflow-x-auto custom-scrollbar py-3 mb-4 sticky top-[60px] z-10 bg-[#0a0b0e]/80 backdrop-blur-xl -mx-4 px-4 border-b border-border/10">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`text-xs font-mono px-2 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                  activeSection === s.id ? "bg-cyan/10 border-cyan/30 text-cyan" : "border-border/30 text-foreground-tertiary hover:text-foreground hover:border-border/60"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activeSection === "overview" && (
              <>
                <MetricsSection project={project} />
                <ProblemSection project={project} />
                <TechStackSection project={project} />
                <TagsSection project={project} />
                <FutureSection project={project} />
                <RelatedProjects project={project} />
              </>
            )}

            {activeSection === "architecture" && project.architecture && (
              <ArchitectureViewer project={project} />
            )}

            {activeSection === "security" && project.securityAnalysis && (
              <SecurityAnalysis project={project} />
            )}

            {activeSection === "timeline" && project.implementationTimeline && (
              <ImplementationTimeline project={project} />
            )}

            {activeSection === "code" && project.codeHighlights && (
              <CodeHighlights project={project} />
            )}

            {activeSection === "ai" && project.aiExplainers && (
              <AIProjectExplainer project={project} />
            )}

            {activeSection === "recruiter" && project.recruiterSummary && (
              <RecruiterView project={project} />
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
