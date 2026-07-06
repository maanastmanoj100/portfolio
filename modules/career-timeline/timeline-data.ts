import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { galaxySkills } from "@/data/skills-galaxy";
import { vaultCertifications, achievements, certificationRoadmap } from "@/data/certifications-vault";
import { blogPosts } from "@/data/blog";
import { experiences } from "@/data/experience";

export interface TimelineMilestone {
  id: string;
  title: string;
  date: string;
  chapter: TimelineChapter;
  category: MilestoneCategory;
  summary: string;
  details: string;
  skills: string[];
  technologies: string[];
  evidenceLinks: { label: string; href: string; type: "project" | "cert" | "blog" | "github" | "experience" | "achievement" }[];
  learningTime?: string;
  difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
  reflection?: string;
  status: "completed" | "in-progress" | "planned";
}

export type TimelineChapter =
  | "foundation" | "programming" | "networking" | "linux"
  | "cybersecurity-fundamentals" | "hands-on-labs" | "ctfs"
  | "projects" | "research" | "advanced-engineering"
  | "current-focus" | "future-roadmap";

export type MilestoneCategory =
  | "education" | "programming" | "networking" | "linux" | "projects"
  | "cybersecurity" | "research" | "certifications" | "ctfs"
  | "competitions" | "open-source" | "portfolio" | "career-goals";

export interface ChapterDefinition {
  id: TimelineChapter;
  label: string;
  description: string;
  color: string;
  period: string;
}

export interface MilestoneConnection {
  from: string;
  to: string;
  label: string;
}

export const CHAPTERS: ChapterDefinition[] = [
  { id: "foundation", label: "Foundation", description: "Academic and early programming foundation", color: "#06b6d4", period: "2013 — 2017" },
  { id: "programming", label: "Programming", description: "Building core programming skills for security", color: "#2563eb", period: "2017 — 2019" },
  { id: "networking", label: "Networking", description: "Understanding network protocols and security", color: "#3b82f6", period: "2017 — 2021" },
  { id: "linux", label: "Linux", description: "Linux system administration and security", color: "#fcc624", period: "2017 — Present" },
  { id: "cybersecurity-fundamentals", label: "Cybersecurity Fundamentals", description: "Core security concepts and tools", color: "#22c55e", period: "2019 — 2023" },
  { id: "hands-on-labs", label: "Hands-On Labs", description: "Practical labs and certification preparation", color: "#f59e0b", period: "2023 — 2025" },
  { id: "ctfs", label: "CTFs & Competitions", description: "Competitive security challenges", color: "#ef4444", period: "2023 — Present" },
  { id: "projects", label: "Projects", description: "Major security projects and platforms", color: "#8b5cf6", period: "2024 — Present" },
  { id: "research", label: "Research & Writing", description: "Security research and technical writing", color: "#a855f7", period: "2019 — Present" },
  { id: "advanced-engineering", label: "Advanced Engineering", description: "Enterprise-level security engineering", color: "#6366f1", period: "2023 — Present" },
  { id: "current-focus", label: "Current Focus", description: "Active learning and development", color: "#06b6d4", period: "Present" },
  { id: "future-roadmap", label: "Future Roadmap", description: "Planned certifications and goals", color: "#64748b", period: "Future" },
];

export const CATEGORY_DEFS: Record<MilestoneCategory, { label: string; color: string; icon: string }> = {
  education: { label: "Education", color: "#06b6d4", icon: "school" },
  programming: { label: "Programming", color: "#2563eb", icon: "code" },
  networking: { label: "Networking", color: "#3b82f6", icon: "network" },
  linux: { label: "Linux", color: "#fcc624", icon: "linux" },
  projects: { label: "Projects", color: "#8b5cf6", icon: "code" },
  cybersecurity: { label: "Cybersecurity", color: "#22c55e", icon: "shield" },
  research: { label: "Research", color: "#a855f7", icon: "book" },
  certifications: { label: "Certifications", color: "#f59e0b", icon: "certificate" },
  ctfs: { label: "CTFs", color: "#ef4444", icon: "flag" },
  competitions: { label: "Competitions", color: "#f97316", icon: "trophy" },
  "open-source": { label: "Open Source", color: "#6366f1", icon: "github" },
  portfolio: { label: "Portfolio", color: "#06b6d4", icon: "globe" },
  "career-goals": { label: "Career Goals", color: "#64748b", icon: "target" },
};

export function buildMilestones(): TimelineMilestone[] {
  const m: TimelineMilestone[] = [];

  // ── Education milestones from experiences ──
  for (const exp of experiences) {
    if (exp.type === "education") {
      m.push({
        id: `edu-${exp.company.toLowerCase().replace(/\s+/g, "-")}`,
        title: exp.role,
        date: exp.period.split(" - ")[0],
        chapter: "foundation",
        category: "education",
        summary: `${exp.company}`,
        details: exp.description,
        skills: exp.technologies,
        technologies: exp.technologies,
        evidenceLinks: [{ label: exp.company, href: "/resume", type: "experience" }],
        status: "completed",
        reflection: exp.highlights.slice(0, 2).join(". "),
      });
    }
  }

  // ── Work experience as milestones ──
  for (const exp of experiences) {
    if (exp.type === "work") {
      m.push({
        id: `work-${exp.company.toLowerCase().replace(/\s+/g, "-")}`,
        title: `${exp.role} at ${exp.company}`,
        date: exp.period.split(" - ")[0],
        chapter: "advanced-engineering",
        category: "cybersecurity",
        summary: exp.description.slice(0, 100),
        details: exp.description,
        skills: exp.technologies,
        technologies: exp.technologies,
        evidenceLinks: [{ label: `${exp.role} — ${exp.company}`, href: "/resume", type: "experience" }],
        status: "completed",
        reflection: exp.highlights.slice(0, 2).join(". "),
      });
    }
  }

  // ── Certification milestones ──
  for (const cert of vaultCertifications) {
    const chapter: TimelineChapter = cert.difficulty === "beginner" || cert.difficulty === "intermediate"
      ? "hands-on-labs"
      : cert.difficulty === "advanced"
        ? "cybersecurity-fundamentals"
        : "advanced-engineering";
    m.push({
      id: `cert-${cert.badge}`,
      title: cert.name.split("(")[0].trim(),
      date: cert.date,
      chapter,
      category: "certifications",
      summary: `${cert.issuer} — ${cert.learningHours || "?"} hours of study`,
      details: cert.description || cert.careerValue || "",
      skills: cert.skills || [],
      technologies: cert.topics?.slice(0, 5) || [],
      evidenceLinks: [{ label: cert.name.split("(")[0].trim(), href: "/certifications", type: "cert" }],
      learningTime: cert.learningHours ? `${cert.learningHours}h` : undefined,
      difficulty: cert.difficulty,
      status: "completed",
      reflection: `Prepared with ${cert.practicalLabs || 0} practical labs across ${cert.topics?.length || 0} topic areas.`,
    });
  }

  // ── Featured project milestones ──
  for (const proj of projects.filter(p => p.featured)) {
    m.push({
      id: `proj-${proj.id}`,
      title: proj.title,
      date: proj.completionDate,
      chapter: "projects",
      category: "projects",
      summary: proj.description.slice(0, 120),
      details: proj.longDescription.slice(0, 200),
      skills: proj.techStack.map(t => t.name),
      technologies: [...proj.languages, ...proj.techStack.map(t => t.name)],
      evidenceLinks: [
        { label: proj.title, href: `/projects/${proj.id}`, type: "project" },
        ...(proj.links.github ? [{ label: "GitHub Repository", href: proj.links.github, type: "github" as const }] : []),
      ],
      difficulty: proj.difficulty,
      status: proj.status === "in_progress" ? "in-progress" : "completed",
      reflection: proj.lessonsLearned?.[0] || `Built with ${proj.techStack.length} technologies over ${proj.duration}.`,
    });
  }

  // ── Achievement milestones (CTFs, competitions, etc.) ──
  for (const ach of achievements) {
    const chapter: TimelineChapter = ach.type === "ctf" || ach.type === "competition" ? "ctfs" : "research";
    m.push({
      id: `ach-${ach.id}`,
      title: ach.title,
      date: ach.date,
      chapter,
      category: ach.type === "ctf" ? "ctfs" : ach.type === "competition" ? "competitions" : ach.type === "opensource" ? "open-source" : "research",
      summary: ach.description.slice(0, 100),
      details: ach.description,
      skills: ach.skills || [],
      technologies: [],
      evidenceLinks: [{ label: ach.title, href: "#", type: "achievement" }],
      status: "completed",
      reflection: `Recognized by ${ach.issuer}.`,
    });
  }

  // ── Blog/research milestones ──
  for (const blog of blogPosts.filter(b => b.featured)) {
    m.push({
      id: `blog-${blog.slug}`,
      title: blog.title,
      date: blog.date,
      chapter: "research",
      category: "research",
      summary: blog.description.slice(0, 100),
      details: blog.description,
      skills: blog.tags,
      technologies: blog.tags,
      evidenceLinks: [{ label: blog.title, href: `/blog/${blog.slug}`, type: "blog" }],
      status: "completed",
    });
  }

  // ── Programming language milestones (derived from galaxySkills) ──
  const langMilestones: { name: string; year: number; cluster: string }[] = [
    { name: "C/C++", year: 2013, cluster: "programming" },
    { name: "Python", year: 2014, cluster: "programming" },
    { name: "JavaScript", year: 2015, cluster: "programming" },
    { name: "TypeScript", year: 2019, cluster: "programming" },
    { name: "Go", year: 2020, cluster: "programming" },
    { name: "Rust", year: 2020, cluster: "programming" },
  ];
  for (const lm of langMilestones) {
    const gs = galaxySkills.find(s => s.name === lm.name);
    m.push({
      id: `lang-${lm.name.toLowerCase().replace(/\W+/g, "-")}`,
      title: `Learned ${lm.name}`,
      date: `${lm.year}`,
      chapter: "programming",
      category: "programming",
      summary: `${gs?.description || `${lm.name} programming language`}`,
      details: `Started learning ${lm.name} for cybersecurity applications. ${gs?.yearsPracticed || 0}+ years of experience.`,
      skills: [lm.name],
      technologies: [lm.name],
      evidenceLinks: [],
      status: "completed",
      reflection: gs?.description || "",
    });
  }

  // ── Portfolio evolution milestones ──
  const portVersions = [
    { version: "v1.0", title: "Initial Portfolio Launch", date: "2024-01", desc: "Basic Next.js portfolio with project showcase and resume." },
    { version: "v2.0", title: "Added AI Assistant", date: "2024-06", desc: "Integrated Cyber AI conversational assistant with portfolio-aware responses." },
    { version: "v2.5", title: "SOC Dashboard & Analytics", date: "2024-09", desc: "Added live SOC monitoring dashboard with real-time threat metrics." },
    { version: "v3.0", title: "Recruiter Mode", date: "2024-12", desc: "Executive recruiter experience with simplified navigation and candidate evaluation." },
    { version: "v3.5", title: "Skills Galaxy", date: "2025-03", desc: "Interactive 3D skills visualization and galaxy navigation." },
    { version: "v4.0", title: "GitHub Intelligence & Cyber Persona", date: "2025-06", desc: "GitHub analytics dashboard and AI digital twin with conversation engine." },
    { version: "v4.5", title: "Career Analytics & Interview Simulator", date: "2025-07", desc: "Career analytics dashboard and AI interview simulator." },
  ];
  for (const pv of portVersions) {
    m.push({
      id: `portfolio-${pv.version.replace(/\./g, "-")}`,
      title: `Cyber Nexus ${pv.version}: ${pv.title}`,
      date: pv.date,
      chapter: "research",
      category: "portfolio",
      summary: pv.desc,
      details: pv.desc,
      skills: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
      technologies: ["React", "Next.js", "TypeScript"],
      evidenceLinks: [{ label: `v${pv.version} — ${pv.title}`, href: "#", type: "project" }],
      status: "completed",
    });
  }

  // ── Current focus milestones ──
  const currentProjects = projects.filter(p => p.status === "in_progress");
  for (const cp of currentProjects) {
    m.push({
      id: `current-${cp.id}`,
      title: `Building: ${cp.title}`,
      date: new Date().toISOString().slice(0, 7),
      chapter: "current-focus",
      category: "projects",
      summary: cp.description.slice(0, 100),
      details: cp.description,
      skills: cp.techStack.map(t => t.name),
      technologies: [...cp.languages, ...cp.techStack.map(t => t.name)],
      evidenceLinks: [{ label: cp.title, href: `/projects/${cp.id}`, type: "project" }],
      status: "in-progress",
    });
  }

  const plannedCerts = certificationRoadmap.filter(r => r.status === "planned");
  for (const pc of plannedCerts) {
    m.push({
      id: `planned-${pc.badge}`,
      title: `Plan: ${pc.certName.split("(")[0].trim()}`,
      date: "2025",
      chapter: "future-roadmap",
      category: "career-goals",
      summary: pc.description,
      details: pc.description,
      skills: pc.skills,
      technologies: [],
      evidenceLinks: [{ label: pc.certName.split("(")[0].trim(), href: "/certifications", type: "cert" }],
      status: "planned",
      reflection: `Category: ${pc.category.replace(/-/g, " ")}`,
    });
  }

  // Sort by date
  m.sort((a, b) => {
    if (a.status === "planned" && b.status !== "planned") return 1;
    if (a.status !== "planned" && b.status === "planned") return -1;
    return a.date.localeCompare(b.date);
  });

  return m;
}

export function buildConnections(milestones: TimelineMilestone[]): MilestoneConnection[] {
  const conns: MilestoneConnection[] = [];
  const completed = milestones.filter(m => m.status === "completed");

  for (let i = 0; i < completed.length - 1; i++) {
    const curr = completed[i];
    const next = completed[i + 1];

    const sharedSkills = curr.skills.filter(s => next.skills.includes(s));
    if (sharedSkills.length > 0) {
      conns.push({
        from: curr.id,
        to: next.id,
        label: sharedSkills.slice(0, 2).join(", "),
      });
    } else {
      conns.push({ from: curr.id, to: next.id, label: "→" });
    }
  }

  return conns;
}

export function getMilestonesByChapter(milestones: TimelineMilestone[]): Map<TimelineChapter, TimelineMilestone[]> {
  const map = new Map<TimelineChapter, TimelineMilestone[]>();
  for (const ch of CHAPTERS) map.set(ch.id, []);
  for (const m of milestones) {
    const arr = map.get(m.chapter);
    if (arr) arr.push(m);
  }
  return map;
}
