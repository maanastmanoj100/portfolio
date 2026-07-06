export interface ProjectTech {
  name: string;
  experience: "expert" | "advanced" | "intermediate";
  usage: string;
  docs?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  suffix?: string;
  prefix?: string;
}

export interface ProjectLink {
  url: string;
  label: string;
}

export interface ProjectArchitectureNode {
  id: string;
  label: string;
  type: "service" | "database" | "client" | "gateway" | "cache" | "queue" | "storage" | "external";
  description: string;
  layer: number;
  protocols?: string[];
  children?: string[];
}

export interface ProjectArchitectureEdge {
  from: string;
  to: string;
  label: string;
  protocol: string;
  encrypted: boolean;
  animated?: boolean;
}

export interface ProjectSecurityControl {
  name: string;
  category: "preventive" | "detective" | "corrective" | "deterrent";
  description: string;
  implementation: string;
  mitreMapping?: string[];
}

export interface ProjectThreatModel {
  threat: string;
  risk: "critical" | "high" | "medium" | "low";
  attackVector: string;
  impact: string;
  mitigation: string;
  control: string;
}

export interface ProjectTimelinePhase {
  phase: string;
  duration: string;
  description: string;
  status: "completed" | "in_progress" | "planned";
  deliverables: string[];
  technologies?: string[];
}

export interface ProjectCodeHighlight {
  title: string;
  language: string;
  code: string;
  description: string;
  securityRelevance?: string;
}

export interface ProjectGalleryItem {
  type: "image" | "video" | "diagram" | "demo";
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}

export interface ProjectRecruiterSummary {
  overview: string;
  businessValue: string;
  skillsDemonstrated: string[];
  keyAchievements: string[];
  timeInvested: string;
  teamSize: string;
}

export interface ProjectCategory {
  id: string;
  label: string;
  color: string;
  icon: string;
}

export type ProjectCategoryId =
  | "web-security" | "network-security" | "soc" | "threat-intel" | "cloud-security"
  | "forensics" | "reverse-engineering" | "osint" | "ctf" | "ai-security"
  | "automation" | "machine-learning" | "research" | "infrastructure" | "programming"
  | "cryptography" | "redteam" | "compliance" | "web3" | "mobile-security";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  image: string;
  gradient: string;
  links: {
    github?: string;
    live?: string;
    case_study?: string;
    documentation?: string;
    report?: string;
    walkthrough?: string;
  };
  metrics: ProjectMetric[];
  category: ProjectCategoryId;
  secondaryCategories?: ProjectCategoryId[];
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  status: "completed" | "in_progress" | "maintenance" | "archived";
  completionDate: string;
  duration: string;
  featured: boolean;
  featuredRank?: number;
  openSource: boolean;
  personal: boolean;
  academic: boolean;
  professional: boolean;
  platforms: string[];
  languages: string[];
  techStack: ProjectTech[];
  architecture?: {
    nodes: ProjectArchitectureNode[];
    edges: ProjectArchitectureEdge[];
    description: string;
  };
  securityAnalysis?: {
    threatModel: ProjectThreatModel[];
    attackSurface: string[];
    riskAnalysis: string;
    securityControls: ProjectSecurityControl[];
    mitreMapping: string[];
    owaspMapping?: string[];
    bestPractices: string[];
  };
  implementationTimeline?: ProjectTimelinePhase[];
  codeHighlights?: ProjectCodeHighlight[];
  gallery?: ProjectGalleryItem[];
  recruiterSummary?: ProjectRecruiterSummary;
  aiExplainers?: {
    quick: string;
    technical: string;
    recruiter: string;
    architecture: string;
    lessons: string;
    securityConcepts: string[];
  };
  problemStatement?: string;
  objectives?: string[];
  challenges?: string[];
  lessonsLearned?: string[];
  futureImprovements?: string[];
  relatedProjects?: string[];
  relatedCertifications?: string[];
  relatedSkills?: string[];
  relatedBlogs?: string[];
  commits?: number;
  contributors?: number;
  stars?: number;
  loc?: number;
  complexity?: "low" | "medium" | "high";
}

export interface Skill {
  name: string;
  level: number;
  category: "offensive" | "defensive" | "cloud" | "forensics" | "programming" | "ai";
  description: string;
  color: string;
  relatedProjects?: string[];
  certifications?: string[];
  tools?: string[];
}

export type GalaxyNodeType = "core" | "intermediate" | "learning" | "expert";

export type GalaxyCluster =
  | "programming" | "cybersecurity" | "networking" | "cloud"
  | "os" | "web" | "ai" | "automation" | "linux"
  | "forensics" | "reverse-engineering" | "osint" | "devops" | "mobile";

export interface GalaxySkill extends Skill {
  cluster: GalaxyCluster;
  nodeType: GalaxyNodeType;
  icon: string;
  yearsPracticed: number;
  learningResources?: { title: string; url: string; type: "course" | "book" | "video" | "documentation" }[];
  exampleCommands?: { command: string; description: string }[];
  relatedSkills: string[];
  projectIds?: string[];
  certificationIds?: string[];
  blogSlugs?: string[];
  githubRepos?: { name: string; url: string; description: string }[];
  color: string;
}

export interface GalaxyConnection {
  source: string;
  target: string;
  type: "dependency" | "workflow" | "project" | "learning" | "toolchain";
}

export interface SkillConstellation {
  id: GalaxyCluster;
  label: string;
  color: string;
  description: string;
  skills: string[];
  position: { x: number; y: number; z: number };
}

export interface SkillLearningPath {
  id: string;
  title: string;
  description: string;
  steps: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  image: string;
  badge: string;
  skills: string[];
  expires?: string;
  featured: boolean;
  description?: string;
  examDetails?: string;
  category?: "cybersecurity" | "networking" | "cloud" | "programming" | "linux" | "ethical-hacking" | "soc" | "forensics" | "osint" | "ai" | "web-security" | "devops" | "professional";
  difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
  platform?: string;
  learningHours?: number;
  practicalLabs?: number;
  projectsBuilt?: string[];
  relatedCertifications?: string[];
  topics?: string[];
  learningObjectives?: string[];
  careerValue?: string;
  verificationUrl?: string;
  status?: "active" | "expired" | "in-progress";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "badge" | "competition" | "hackathon" | "ctf" | "opensource" | "recognition";
  icon: string;
  color: string;
  issuer: string;
  proofUrl?: string;
  skills?: string[];
}

export interface RoadmapEntry {
  certName: string;
  badge: string;
  status: "completed" | "in-progress" | "planned";
  date?: string;
  description: string;
  skills: string[];
  category: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  readTime: string;
  tags: string[];
  category: "research" | "tutorial" | "opinion" | "case-study" | "tooling";
  featured: boolean;
  author?: string;
  references?: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
  technologies: string[];
  type: "work" | "education" | "certification";
  location?: string;
}

export interface ThreatEvent {
  id: string;
  type: "critical" | "high" | "medium" | "low";
  title: string;
  source: string;
  timestamp: string;
  ip: string;
  country: string;
  flag: string;
  details?: string;
  mitigated?: boolean;
}

export interface SOCMetric {
  label: string;
  value: string;
  change: number;
  status: "up" | "down" | "stable";
  details?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: "metric" | "chart" | "feed" | "map" | "terminal" | "analytics";
  size: "sm" | "md" | "lg" | "full";
  data: any;
}

export type NavItem = {
  label: string;
  href: string;
  shortcut?: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
};

export type RecruiterPreferences = {
  focusArea: string[];
  experienceLevel: string;
  interestedIn: string[];
};

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  duration?: number;
}

export interface PageMeta {
  title: string;
  description: string;
  icon?: string;
  breadcrumbs?: { label: string; href: string }[];
}

// ── Sentinel AI SOC Types ──

export type AlertSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface SOCAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  sourceCountry: string;
  destCountry: string;
  sourceFlag: string;
  destFlag: string;
  mitreId: string;
  mitreName: string;
  status: "new" | "investigating" | "contained" | "resolved";
  analyst: string;
  confidence: number;
  protocol: string;
  port: number;
}

export interface SOCIncident {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: "new" | "open" | "investigating" | "contained" | "resolved";
  created: string;
  updated: string;
  affectedAssets: string[];
  mitreTechnique: string;
  mitreTactic: string;
  detectionRule: string;
  assignedAnalyst: string;
  description: string;
  timeline: { time: string; event: string }[];
  evidence: string[];
  recommendedActions: string[];
}

export interface MitreTechnique {
  tactic: string;
  techniqueId: string;
  techniqueName: string;
  coverage: "none" | "partial" | "extensive" | "comprehensive";
  detectionEnabled: boolean;
  relatedIncidents: number;
  description: string;
}

export interface EndpointInfo {
  hostname: string;
  os: string;
  health: "healthy" | "warning" | "critical" | "offline";
  riskScore: number;
  lastSeen: string;
  alerts: number;
  patches: number;
  ip: string;
}

export interface ThreatIntel {
  type: "cve" | "actor" | "malware" | "ioc";
  id: string;
  title: string;
  description: string;
  date: string;
  severity: AlertSeverity;
  source: string;
  related: string[];
}

export interface TimelineEvent {
  phase: string;
  description: string;
  timestamp: string;
  details: string;
  mitreId: string;
  status: "completed" | "in_progress" | "pending";
}

export interface NetworkFlow {
  direction: "inbound" | "outbound" | "internal";
  allowed: number;
  blocked: number;
  dropped: number;
  total: number;
}

export type DashboardView = "overview" | "alerts" | "incidents" | "mitre" | "network" | "endpoints" | "intel" | "timeline";
