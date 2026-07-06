// ─── Type Definitions ───────────────────────────────────────────────────

export interface AppRegistration {
  id: string;
  name: string;
  desc: string;
  version: string;
  routes: string[];
  permissions: string[];
  dependencies: string[];
  category: string;
  health: "operational" | "degraded" | "experimental" | "planned";
  lastActive: string;
}

export interface CnxEvent {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  data: Record<string, unknown>;
  severity: "info" | "warning" | "error" | "achievement";
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  type: string;
  tags: string[];
  summary: string;
  source: string;
  url?: string;
  lastUpdated: string;
  relatedIds: string[];
}

export interface PortfolioHealthMetric {
  id: string;
  label: string;
  value: number;
  max: number;
  status: "good" | "warning" | "critical";
  recommendation: string;
}

export interface Goal {
  id: string;
  title: string;
  desc: string;
  category: "project" | "certification" | "learning" | "career" | "research";
  status: "completed" | "in-progress" | "planned" | "future";
  targetDate?: string;
  relatedIds: string[];
  priority: "low" | "medium" | "high";
}

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  desc: string;
  type: "feature" | "enhancement" | "fix" | "architecture" | "content";
  relatedIds: string[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  desc: string;
  status: "completed" | "current" | "planned" | "future";
  category: string;
  relatedIds: string[];
  quarter: string;
}

export interface AnalyticsSnapshot {
  date: string;
  totalPages: number;
  totalProjects: number;
  totalCertifications: number;
  totalSkills: number;
  totalBlogPosts: number;
  totalCTFChallenges: number;
  totalAchievements: number;
  totalArchitectures: number;
  documentationCoverage: number;
  searchIndexSize: number;
  appCount: number;
}

export interface AiDigest {
  id: string;
  week: string;
  date: string;
  updates: { category: string; items: string[] }[];
  summary: string;
}

export interface PublicApiEndpoint {
  path: string;
  method: "GET" | "POST";
  desc: string;
  responseType: string;
}

// ─── Application Registry ───────────────────────────────────────────────

export const APP_REGISTRY: AppRegistration[] = [
  { id: "soc-dashboard", name: "SOC Dashboard", desc: "Security operations overview with real-time monitoring", version: "1.2.0", routes: ["/dashboard"], permissions: ["read:analytics"], dependencies: [], category: "security", health: "operational", lastActive: "2026-07-04" },
  { id: "threat-intel", name: "Threat Intelligence", desc: "Threat intel aggregation and TTP analysis", version: "1.0.0", routes: ["/attack-map"], permissions: [], dependencies: [], category: "security", health: "operational", lastActive: "2026-07-03" },
  { id: "knowledge-graph", name: "Knowledge Graph", desc: "Interactive visualization of portfolio knowledge", version: "1.1.0", routes: ["/knowledge-graph"], permissions: [], dependencies: ["semantic-index"], category: "intelligence", health: "operational", lastActive: "2026-07-04" },
  { id: "ctf-command", name: "CTF Command Center", desc: "CTF challenge tracking and write-ups", version: "1.0.0", routes: ["/ctf-command-center"], permissions: [], dependencies: [], category: "security", health: "operational", lastActive: "2026-07-02" },
  { id: "career-intel", name: "Career Intelligence", desc: "Role analysis and skill gap detection", version: "1.0.0", routes: ["/career-intelligence"], permissions: ["read:career"], dependencies: [], category: "intelligence", health: "operational", lastActive: "2026-07-01" },
  { id: "project-architect", name: "Project Architect", desc: "AI-assisted project planning and architecture", version: "1.0.0", routes: ["/project-architect"], permissions: [], dependencies: ["ai-context"], category: "tool", health: "operational", lastActive: "2026-07-04" },
  { id: "architecture-studio", name: "Architecture Studio", desc: "Security architecture exploration and threat modeling", version: "1.0.0", routes: ["/security-architect"], permissions: [], dependencies: [], category: "tool", health: "operational", lastActive: "2026-07-04" },
  { id: "wiki", name: "Knowledge Wiki", desc: "Cybersecurity learning encyclopedia", version: "1.0.0", routes: ["/wiki"], permissions: [], dependencies: ["semantic-index"], category: "knowledge", health: "operational", lastActive: "2026-07-03" },
  { id: "cyber-ai", name: "Cyber AI", desc: "Intelligent portfolio assistant across all modules", version: "2.0.0", routes: [], permissions: ["read:*"], dependencies: ["semantic-index", "ai-context"], category: "ai", health: "operational", lastActive: "2026-07-04" },
  { id: "github-intel", name: "GitHub Intelligence", desc: "Repository analytics and activity tracking", version: "1.0.0", routes: ["/github-intelligence"], permissions: ["read:github"], dependencies: [], category: "intelligence", health: "operational", lastActive: "2026-07-02" },
  { id: "achievements", name: "Achievements", desc: "Gamification and milestone tracking", version: "1.0.0", routes: ["/achievements"], permissions: [], dependencies: [], category: "engagement", health: "operational", lastActive: "2026-07-04" },
  { id: "home-lab", name: "Home Lab", desc: "Virtual cyber range infrastructure viewer", version: "1.0.0", routes: ["/cyber-lab"], permissions: [], dependencies: [], category: "infrastructure", health: "operational", lastActive: "2026-07-03" },
  { id: "cyber-os", name: "Cyber Nexus OS", desc: "Desktop operating environment shell", version: "1.0.0", routes: ["/cyber-os"], permissions: [], dependencies: [], category: "shell", health: "operational", lastActive: "2026-07-04" },
  { id: "career-timeline", name: "Career Timeline", desc: "Professional journey visualization", version: "1.0.0", routes: ["/career-timeline"], permissions: ["read:career"], dependencies: [], category: "career", health: "operational", lastActive: "2026-07-01" },
  { id: "interview-sim", name: "Interview Simulator", desc: "Technical interview practice platform", version: "1.0.0", routes: ["/interview-simulator"], permissions: [], dependencies: ["ai-context"], category: "tool", health: "operational", lastActive: "2026-06-28" },
];

// ─── Event History ──────────────────────────────────────────────────────

export const EVENT_HISTORY: CnxEvent[] = [
  { id: "evt-001", type: "project.added", source: "project-architect", timestamp: "2026-07-04T10:00:00Z", data: { project: "Security Architecture Explorer" }, severity: "info" },
  { id: "evt-002", type: "achievement.earned", source: "achievements", timestamp: "2026-07-04T09:30:00Z", data: { achievement: "Architecture Master" }, severity: "achievement" },
  { id: "evt-003", type: "blog.published", source: "blog", timestamp: "2026-07-03T14:00:00Z", data: { title: "Defense in Depth Strategies" }, severity: "info" },
  { id: "evt-004", type: "certificate.added", source: "certifications", timestamp: "2026-07-02T11:00:00Z", data: { cert: "AWS Security Specialty" }, severity: "achievement" },
  { id: "evt-005", type: "repository.updated", source: "github-intel", timestamp: "2026-07-01T16:00:00Z", data: { repo: "cyber-nexus" }, severity: "info" },
  { id: "evt-006", type: "theme.changed", source: "cyber-os", timestamp: "2026-07-01T08:00:00Z", data: { theme: "midnight-blue" }, severity: "info" },
  { id: "evt-007", type: "research.created", source: "wiki", timestamp: "2026-06-30T13:00:00Z", data: { topic: "Zero Trust Architecture" }, severity: "info" },
  { id: "evt-008", type: "architecture.updated", source: "architecture-studio", timestamp: "2026-06-29T15:00:00Z", data: { architecture: "Cloud Infrastructure" }, severity: "info" },
];

export const EVENT_TYPES = [
  "project.added", "project.updated", "project.completed",
  "certificate.added", "certificate.renewed",
  "repository.updated", "repository.created",
  "blog.published", "blog.updated",
  "achievement.earned",
  "research.created", "research.published",
  "theme.changed",
  "architecture.updated", "architecture.created",
  "skill.added", "skill.endorsed",
  "notification.received",
  "ai.response.generated",
];

// ─── Knowledge Index ────────────────────────────────────────────────────

export const KNOWLEDGE_INDEX: KnowledgeEntry[] = [
  { id: "ki-proj-1", title: "Cyber Nexus Platform", type: "project", tags: ["next.js", "portfolio", "react", "typescript"], summary: "Full-stack cybersecurity portfolio platform with 32+ pages", source: "projects", url: "/projects", lastUpdated: "2026-07-04", relatedIds: ["ki-skill-1", "ki-skill-2"] },
  { id: "ki-proj-2", title: "Sentinel AI SOC", type: "project", tags: ["soc", "ai", "security", "ml"], summary: "AI-augmented security operations center concept", source: "projects", url: "/projects", lastUpdated: "2026-06-20", relatedIds: ["ki-skill-3"] },
  { id: "ki-proj-3", title: "Home Lab Infrastructure", type: "project", tags: ["proxmox", "pfsense", "wazuh", "lab"], summary: "Virtualized cyber range with multi-zone segmentation", source: "projects", url: "/projects", lastUpdated: "2026-06-15", relatedIds: ["ki-skill-4"] },
  { id: "ki-skill-1", title: "TypeScript", type: "skill", tags: ["language", "frontend", "type-safe"], summary: "Strongly typed JavaScript for application development", source: "skills", url: "/skills", lastUpdated: "2026-07-01", relatedIds: ["ki-proj-1"] },
  { id: "ki-skill-2", title: "Next.js", type: "skill", tags: ["framework", "react", "ssr", "ssg"], summary: "React framework with static and server rendering", source: "skills", url: "/skills", lastUpdated: "2026-07-01", relatedIds: ["ki-proj-1"] },
  { id: "ki-skill-3", title: "SIEM Operations", type: "skill", tags: ["soc", "monitoring", "wazuh", "splunk"], summary: "Security information and event management", source: "skills", url: "/skills", lastUpdated: "2026-06-15", relatedIds: ["ki-proj-2"] },
  { id: "ki-skill-4", title: "Network Security", type: "skill", tags: ["firewall", "vlan", "segmentation", "pfsense"], summary: "Network defense and segmentation strategies", source: "skills", url: "/skills", lastUpdated: "2026-06-10", relatedIds: ["ki-proj-3"] },
  { id: "ki-cert-1", title: "CompTIA Security+", type: "certification", tags: ["comptia", "foundational", "security"], summary: "Foundational cybersecurity certification", source: "certifications", url: "/certifications", lastUpdated: "2025-09-01", relatedIds: [] },
  { id: "ki-cert-2", title: "AWS Security Specialty", type: "certification", tags: ["aws", "cloud", "security"], summary: "AWS cloud security specialization", source: "certifications", url: "/certifications", lastUpdated: "2026-07-02", relatedIds: [] },
  { id: "ki-blog-1", title: "Defense in Depth Strategies", type: "article", tags: ["defense", "layered-security", "best-practices"], summary: "Comprehensive guide to layered security architecture", source: "blog", url: "/blog", lastUpdated: "2026-07-03", relatedIds: ["ki-proj-1"] },
  { id: "ki-arch-1", title: "Cyber Nexus Architecture", type: "architecture", tags: ["next.js", "web", "design"], summary: "Full-stack Next.js architecture with static generation", source: "security-architect", url: "/security-architect", lastUpdated: "2026-07-04", relatedIds: ["ki-proj-1"] },
  { id: "ki-ctf-1", title: "OWASP Top 10 Challenges", type: "ctf", tags: ["web", "owasp", "pentest"], summary: "Web application security CTF challenges", source: "ctf-command", url: "/ctf-command-center", lastUpdated: "2026-06-25", relatedIds: [] },
];

// ─── Portfolio Health ────────────────────────────────────────────────────

export const PORTFOLIO_HEALTH: PortfolioHealthMetric[] = [
  { id: "ph-1", label: "Documentation Coverage", value: 85, max: 100, status: "good", recommendation: "Consider adding architecture diagrams to the Wiki module." },
  { id: "ph-2", label: "Search Index Coverage", value: 92, max: 100, status: "good", recommendation: "All major content types are indexed." },
  { id: "ph-3", label: "Broken Links", value: 0, max: 10, status: "good", recommendation: "No broken links detected." },
  { id: "ph-4", label: "Accessibility Score", value: 78, max: 100, status: "warning", recommendation: "Improve ARIA labels on interactive diagrams and ensure keyboard navigation for all sections." },
  { id: "ph-5", label: "Performance Score", value: 88, max: 100, status: "good", recommendation: "Consider lazy-loading heavy diagram components." },
  { id: "ph-6", label: "Metadata Quality", value: 82, max: 100, status: "good", recommendation: "Add more detailed descriptions to project data entries." },
  { id: "ph-7", label: "Module Health", value: 15, max: 15, status: "good", recommendation: "All 15 registered applications are operational." },
  { id: "ph-8", label: "Dependency Status", value: 95, max: 100, status: "good", recommendation: "Dependencies are up to date." },
];

// ─── Goals ──────────────────────────────────────────────────────────────

export const GOALS: Goal[] = [
  { id: "g-1", title: "Complete CISSP Certification", desc: "Achieve Certified Information Systems Security Professional", category: "certification", status: "in-progress", targetDate: "2026-Q4", relatedIds: [], priority: "high" },
  { id: "g-2", title: "Build Kubernetes Security Lab", desc: "Extend home lab with K8s cluster for container security testing", category: "project", status: "planned", targetDate: "2026-Q3", relatedIds: ["ki-proj-3"], priority: "medium" },
  { id: "g-3", title: "Publish Threat Research Paper", desc: "Compile and publish research on emerging attack techniques", category: "research", status: "planned", relatedIds: [], priority: "medium" },
  { id: "g-4", title: "Master Cloud Security Architecture", desc: "Deepen AWS/Azure security architecture expertise", category: "learning", status: "in-progress", relatedIds: ["ki-cert-2"], priority: "high" },
  { id: "g-5", title: "OSCP Certification", desc: "Offensive Security Certified Professional", category: "certification", status: "planned", relatedIds: [], priority: "medium" },
  { id: "g-6", title: "Build SIEM Correlation Rules", desc: "Develop custom Wazuh/Splunk rules for threat detection", category: "project", status: "in-progress", relatedIds: ["ki-proj-2", "ki-proj-3"], priority: "high" },
  { id: "g-7", title: "Contribute to Open Source Security Tools", desc: "Submit PRs to 3 security-focused open source projects", category: "career", status: "future", relatedIds: [], priority: "low" },
  { id: "g-8", title: "Research Zero Trust Implementation", desc: "Study and document practical Zero Trust architecture patterns", category: "research", status: "planned", relatedIds: [], priority: "medium" },
];

// ─── Changelog ──────────────────────────────────────────────────────────

export const CHANGELOG: ChangelogEntry[] = [
  { id: "cl-1", version: "1.0.0", date: "2025-09-01", title: "Initial Portfolio Launch", desc: "First version of Cyber Nexus with core projects and skills pages", type: "feature", relatedIds: ["ki-proj-1"] },
  { id: "cl-2", version: "1.1.0", date: "2025-10-15", title: "Knowledge Graph Integration", desc: "Added interactive knowledge graph with 79 nodes and 128 edges", type: "feature", relatedIds: ["knowledge-graph"] },
  { id: "cl-3", version: "1.2.0", date: "2025-11-01", title: "CTF Command Center", desc: "Added CTF challenge tracking with 34 challenges across 7 platforms", type: "feature", relatedIds: ["ctf-command"] },
  { id: "cl-4", version: "1.3.0", date: "2025-12-01", title: "Cyber Lab Infrastructure", desc: "Added home lab visualization with 12 VMs and network topology", type: "feature", relatedIds: ["home-lab"] },
  { id: "cl-5", version: "1.4.0", date: "2026-01-15", title: "Achievement System", desc: "Gamification with 30 achievements, missions, and passport stamps", type: "feature", relatedIds: ["achievements"] },
  { id: "cl-6", version: "1.5.0", date: "2026-02-15", title: "Knowledge Wiki Launch", desc: "43-article cybersecurity encyclopedia with cheat sheets and diagrams", type: "feature", relatedIds: ["wiki"] },
  { id: "cl-7", version: "1.6.0", date: "2026-03-01", title: "Career Intelligence Module", desc: "Role analysis, skill gap detection, and career planning tools", type: "feature", relatedIds: ["career-intel"] },
  { id: "cl-8", version: "1.7.0", date: "2026-05-01", title: "Project Architect", desc: "AI-assisted project planning with architecture blueprints", type: "feature", relatedIds: ["project-architect"] },
  { id: "cl-9", version: "1.8.0", date: "2026-06-01", title: "Architecture Studio", desc: "Security architecture explorer with STRIDE threat modeling", type: "feature", relatedIds: ["architecture-studio"] },
  { id: "cl-10", version: "2.0.0", date: "2026-07-04", title: "Cyber Nexus OS & CNX Platform", desc: "Desktop OS environment and shared intelligence platform launch", type: "architecture", relatedIds: ["cyber-os", "cyber-nexus-x"] },
];

// ─── Roadmap ────────────────────────────────────────────────────────────

export const ROADMAP: RoadmapItem[] = [
  { id: "rm-1", title: "Cyber Nexus Platform", desc: "Core portfolio with 32 pages and Liquid Glass design", status: "completed", category: "platform", relatedIds: ["ki-proj-1"], quarter: "2025-Q3" },
  { id: "rm-2", title: "Knowledge Graph", desc: "Interactive knowledge visualization engine", status: "completed", category: "feature", relatedIds: ["knowledge-graph"], quarter: "2025-Q4" },
  { id: "rm-3", title: "CTF & Cyber Range", desc: "Challenge tracking and lab infrastructure", status: "completed", category: "security", relatedIds: ["ctf-command", "home-lab"], quarter: "2025-Q4" },
  { id: "rm-4", title: "Wiki & Learning Encyclopedia", desc: "43-article cybersecurity knowledge base", status: "completed", category: "knowledge", relatedIds: ["wiki"], quarter: "2026-Q1" },
  { id: "rm-5", title: "Career Intelligence", desc: "Role analysis and skill gap detection", status: "completed", category: "career", relatedIds: ["career-intel"], quarter: "2026-Q1" },
  { id: "rm-6", title: "Project Architect", desc: "AI-assisted project planning tool", status: "completed", category: "tool", relatedIds: ["project-architect"], quarter: "2026-Q2" },
  { id: "rm-7", title: "Architecture Studio", desc: "Security architecture and threat modeling", status: "completed", category: "tool", relatedIds: ["architecture-studio"], quarter: "2026-Q2" },
  { id: "rm-8", title: "Cyber Nexus OS", desc: "Desktop operating environment shell", status: "completed", category: "platform", relatedIds: ["cyber-os"], quarter: "2026-Q3" },
  { id: "rm-9", title: "Cyber Nexus X Platform", desc: "Shared intelligence layer connecting all modules", status: "current", category: "platform", relatedIds: [], quarter: "2026-Q3" },
  { id: "rm-10", title: "Kubernetes Security Lab", desc: "Container security testing environment", status: "planned", category: "infrastructure", relatedIds: ["home-lab"], quarter: "2026-Q3" },
  { id: "rm-11", title: "CISSP Certification", desc: "Professional security certification", status: "current", category: "career", relatedIds: [], quarter: "2026-Q4" },
  { id: "rm-12", title: "Public REST API", desc: "Read-only portfolio API for external integrations", status: "planned", category: "platform", relatedIds: [], quarter: "2026-Q4" },
  { id: "rm-13", title: "Offline PWA Mode", desc: "Progressive web app with offline reading", status: "planned", category: "platform", relatedIds: [], quarter: "2027-Q1" },
  { id: "rm-14", title: "Threat Research Publication", desc: "Original security research paper", status: "future", category: "research", relatedIds: [], quarter: "2027-Q1" },
  { id: "rm-15", title: "OSCP Certification", desc: "Offensive security professional credential", status: "future", category: "career", relatedIds: [], quarter: "2027-Q2" },
];

// ─── Analytics Snapshot ─────────────────────────────────────────────────

export const ANALYTICS_SNAPSHOT: AnalyticsSnapshot = {
  date: "2026-07-04",
  totalPages: 32,
  totalProjects: 8,
  totalCertifications: 5,
  totalSkills: 20,
  totalBlogPosts: 6,
  totalCTFChallenges: 34,
  totalAchievements: 30,
  totalArchitectures: 8,
  documentationCoverage: 85,
  searchIndexSize: 12,
  appCount: 15,
};

export const ANALYTICS_HISTORY: AnalyticsSnapshot[] = [
  { date: "2025-09-01", totalPages: 6, totalProjects: 3, totalCertifications: 2, totalSkills: 8, totalBlogPosts: 1, totalCTFChallenges: 0, totalAchievements: 0, totalArchitectures: 1, documentationCoverage: 40, searchIndexSize: 0, appCount: 3 },
  { date: "2025-12-01", totalPages: 12, totalProjects: 5, totalCertifications: 3, totalSkills: 12, totalBlogPosts: 2, totalCTFChallenges: 34, totalAchievements: 0, totalArchitectures: 3, documentationCoverage: 55, searchIndexSize: 0, appCount: 6 },
  { date: "2026-03-01", totalPages: 20, totalProjects: 6, totalCertifications: 4, totalSkills: 16, totalBlogPosts: 4, totalCTFChallenges: 34, totalAchievements: 30, totalArchitectures: 5, documentationCoverage: 70, searchIndexSize: 0, appCount: 10 },
  { date: "2026-07-04", totalPages: 32, totalProjects: 8, totalCertifications: 5, totalSkills: 20, totalBlogPosts: 6, totalCTFChallenges: 34, totalAchievements: 30, totalArchitectures: 8, documentationCoverage: 85, searchIndexSize: 12, appCount: 15 },
];

// ─── AI Digests ─────────────────────────────────────────────────────────

export const AI_DIGESTS: AiDigest[] = [
  {
    id: "digest-1", week: "July 2026 Week 1", date: "2026-07-04",
    updates: [
      { category: "Platform", items: ["Cyber Nexus OS desktop environment launched", "Shared CNX intelligence platform initialized"] },
      { category: "Architecture", items: ["Security Architecture Explorer added with 8 architecture models", "STRIDE threat modeling workspace integrated"] },
      { category: "Tools", items: ["Project Architect module with AI-assisted planning", "Architecture comparison engine"] },
    ],
    summary: "Major platform evolution this week with the launch of the Cyber Nexus OS desktop environment and the shared CNX intelligence platform. The Security Architecture Explorer brings 8 architecture models with full STRIDE analysis, while the Project Architect enables AI-assisted project planning.",
  },
  {
    id: "digest-2", week: "June 2026 Week 4", date: "2026-06-28",
    updates: [
      { category: "Knowledge", items: ["Wiki expanded with new cheat sheets and MITRE ATT&CK mappings"] },
      { category: "Content", items: ["New blog post on defense in depth strategies"] },
    ],
    summary: "Knowledge base expansion with additional wiki content and new blog publication on layered security architecture.",
  },
];

// ─── Public API Endpoints ───────────────────────────────────────────────

export const PUBLIC_API_ENDPOINTS: PublicApiEndpoint[] = [
  { path: "/api/v1/projects", method: "GET", desc: "List all portfolio projects", responseType: "Project[]" },
  { path: "/api/v1/projects/:id", method: "GET", desc: "Get project by ID", responseType: "Project" },
  { path: "/api/v1/skills", method: "GET", desc: "List all technical skills", responseType: "Skill[]" },
  { path: "/api/v1/certifications", method: "GET", desc: "List all certifications", responseType: "Certification[]" },
  { path: "/api/v1/blog", method: "GET", desc: "List blog articles", responseType: "Article[]" },
  { path: "/api/v1/architectures", method: "GET", desc: "List security architectures", responseType: "Architecture[]" },
  { path: "/api/v1/knowledge/search", method: "GET", desc: "Semantic search across indexed content", responseType: "KnowledgeEntry[]" },
  { path: "/api/v1/registry", method: "GET", desc: "List registered applications", responseType: "AppRegistration[]" },
  { path: "/api/v1/status", method: "GET", desc: "Platform health status", responseType: "HealthStatus" },
];

// ─── Automation Tasks ───────────────────────────────────────────────────

export const AUTOMATION_TASKS = [
  { id: "auto-1", name: "Search Index Update", desc: "Rebuild semantic search index from all content sources", frequency: "Daily", lastRun: "2026-07-04T08:00:00Z", status: "operational" as const },
  { id: "auto-2", name: "Metadata Generation", desc: "Auto-generate metadata for new content entries", frequency: "On change", lastRun: "2026-07-04T10:30:00Z", status: "operational" as const },
  { id: "auto-3", name: "Broken Link Detection", desc: "Scan all pages for broken internal and external links", frequency: "Weekly", lastRun: "2026-07-01T06:00:00Z", status: "operational" as const },
  { id: "auto-4", name: "Sitemap Generation", desc: "Generate XML sitemap for search engines", frequency: "On build", lastRun: "2026-07-04T00:00:00Z", status: "operational" as const },
  { id: "auto-5", name: "Documentation Coverage Check", desc: "Identify modules with missing or incomplete documentation", frequency: "Weekly", lastRun: "2026-07-02T12:00:00Z", status: "operational" as const },
  { id: "auto-6", name: "Accessibility Audit", desc: "Run automated a11y checks on all pages", frequency: "Monthly", lastRun: "2026-06-15T08:00:00Z", status: "operational" as const },
];

// ─── Digital Twin Timeline ──────────────────────────────────────────────

export const DIGITAL_TWIN_MILESTONES = [
  { date: "2023", label: "Started Cybersecurity Journey", desc: "Began foundational security studies", category: "learning", icon: "brain" },
  { date: "2024", label: "Security+ Certification", desc: "CompTIA Security+ credential earned", category: "certification", icon: "certificate" },
  { date: "2025-Q3", label: "Cyber Nexus Launch", desc: "Initial portfolio platform published", category: "project", icon: "code" },
  { date: "2025-Q4", label: "Knowledge Graph & CTF Center", desc: "Interactive knowledge visualization and challenge tracking", category: "project", icon: "network" },
  { date: "2026-Q1", label: "Wiki & Career Intelligence", desc: "Knowledge base and career analysis modules", category: "project", icon: "book" },
  { date: "2026-Q2", label: "Project Architect & Security Studio", desc: "AI planning tools and threat modeling workspace", category: "project", icon: "lock" },
  { date: "2026-Q3", label: "Cyber Nexus OS & CNX Platform", desc: "Desktop environment and shared intelligence layer", category: "platform", icon: "layout-grid" },
  { date: "2026-Q4", label: "CISSP & K8s Lab (Planned)", desc: "Professional certification and container security lab", category: "goal", icon: "target" },
  { date: "2027", label: "Research Publication & OSCP (Planned)", desc: "Original security research and advanced offensive certification", category: "goal", icon: "star" },
];
