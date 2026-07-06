export type AchievementCategory =
  | "explorer" | "projects" | "labs" | "ctf" | "research"
  | "github" | "skills" | "learning" | "milestones";

export type AchievementType = "exploration" | "milestone" | "mission" | "hidden";
export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  type: AchievementType;
  criteria: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
  relatedProjects?: string[];
  relatedSkills?: string[];
  relatedCertifications?: string[];
  relatedSections?: string[];
  rarity: Rarity;
  evidence?: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  tasks: string[];
  progress: number;
  total: number;
  completed: boolean;
  reward: string;
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  category: string;
  evidence: string;
}

export const ACHIEVEMENT_CATEGORIES: { id: AchievementCategory; label: string }[] = [
  { id: "explorer", label: "Portfolio Explorer" },
  { id: "projects", label: "Projects" },
  { id: "labs", label: "Cyber Labs" },
  { id: "ctf", label: "CTFs" },
  { id: "research", label: "Research" },
  { id: "github", label: "GitHub" },
  { id: "skills", label: "Skills" },
  { id: "learning", label: "Learning" },
  { id: "milestones", label: "Milestones" },
];

export const achievements: Achievement[] = [
  {
    id: "welcome-explorer", name: "Welcome Explorer", description: "Viewed the Cyber Nexus homepage", icon: "🏠",
    category: "explorer", type: "exploration", criteria: "Visit the homepage", unlocked: false, rarity: "common",
    relatedSections: ["Home"],
  },
  {
    id: "project-hunter", name: "Project Hunter", description: "Opened 10 different project pages", icon: "🔍",
    category: "explorer", type: "exploration", criteria: "View 10 project pages", unlocked: false, progress: 0, maxProgress: 10, rarity: "uncommon",
    relatedSections: ["Projects"],
  },
  {
    id: "research-reader", name: "Research Reader", description: "Read 5 research articles or blog posts", icon: "📖",
    category: "explorer", type: "exploration", criteria: "Read 5 blog posts", unlocked: false, progress: 0, maxProgress: 5, rarity: "uncommon",
    relatedSections: ["Blog"],
  },
  {
    id: "architecture-explorer", name: "Architecture Explorer", description: "Visited the Cyber Lab infrastructure page", icon: "🏗️",
    category: "explorer", type: "exploration", criteria: "Visit the Cyber Lab page", unlocked: false, rarity: "common",
    relatedSections: ["Cyber Lab"],
  },
  {
    id: "knowledge-navigator", name: "Knowledge Navigator", description: "Explored 20 nodes in the Knowledge Graph", icon: "🧭",
    category: "explorer", type: "exploration", criteria: "Click on 20 Knowledge Graph nodes", unlocked: false, progress: 0, maxProgress: 20, rarity: "rare",
    relatedSections: ["Knowledge Graph"],
  },
  {
    id: "soc-operator", name: "SOC Operator", description: "Visited the live SOC Dashboard", icon: "🛡️",
    category: "explorer", type: "exploration", criteria: "Visit the SOC Dashboard", unlocked: false, rarity: "common",
    relatedSections: ["Dashboard"],
  },
  {
    id: "timeline-traveler", name: "Timeline Traveler", description: "Explored the Career Timeline end-to-end", icon: "⏳",
    category: "explorer", type: "exploration", criteria: "Scroll through the Career Timeline", unlocked: false, rarity: "uncommon",
    relatedSections: ["Career Timeline"],
  },
  {
    id: "ctf-recruit", name: "CTF Recruit", description: "Visited the CTF Command Center", icon: "🎯",
    category: "explorer", type: "exploration", criteria: "Visit the CTF Command Center", unlocked: false, rarity: "common",
    relatedSections: ["CTF Command Center"],
  },
  {
    id: "cert-collector", name: "Certification Collector", description: "Reviewed 5 certifications", icon: "🎓",
    category: "explorer", type: "exploration", criteria: "View 5 certification details", unlocked: false, progress: 0, maxProgress: 5, rarity: "uncommon",
    relatedSections: ["Certifications"],
  },
  {
    id: "ai-conversationalist", name: "AI Conversationalist", description: "Asked Cyber AI 5 questions", icon: "🤖",
    category: "explorer", type: "exploration", criteria: "Ask Cyber AI 5 questions", unlocked: false, progress: 0, maxProgress: 5, rarity: "rare",
    relatedSections: ["AI Twin"],
  },
  {
    id: "first-project", name: "First Cybersecurity Project", description: "Completed the first cybersecurity portfolio project", icon: "💻",
    category: "projects", type: "milestone", criteria: "Complete first cybersecurity project", unlocked: true, unlockedDate: "2024-01-15", rarity: "legendary",
    relatedProjects: ["project-cybershield"],
    relatedSkills: ["Web Security", "Penetration Testing"],
  },
  {
    id: "first-github", name: "First GitHub Repository", description: "Published the first open-source security tool", icon: "🐙",
    category: "github", type: "milestone", criteria: "Create first public GitHub repository", unlocked: true, unlockedDate: "2024-02-01", rarity: "legendary",
    relatedProjects: ["project-cybershield"],
  },
  {
    id: "first-ctf", name: "First CTF Completion", description: "Solved the first Capture The Flag challenge", icon: "🚩",
    category: "ctf", type: "milestone", criteria: "Complete first CTF challenge", unlocked: true, unlockedDate: "2024-01-20", rarity: "legendary",
    relatedProjects: ["offensive-security-lab"],
    relatedSkills: ["CTF", "Problem Solving"],
  },
  {
    id: "first-cert", name: "First Certification", description: "Earned the first industry certification", icon: "📜",
    category: "milestones", type: "milestone", criteria: "Earn a professional certification", unlocked: true, unlockedDate: "2024-03-01", rarity: "legendary",
    relatedCertifications: ["Security+"],
    evidence: "CompTIA Security+ certification earned",
  },
  {
    id: "first-blog", name: "Published First Blog", description: "Published the first cybersecurity research article", icon: "✍️",
    category: "research", type: "milestone", criteria: "Write and publish a blog post", unlocked: true, unlockedDate: "2024-02-15", rarity: "uncommon",
    relatedProjects: ["web-security-fundamentals"],
    relatedSkills: ["Technical Writing", "Web Security"],
  },
  {
    id: "sentinel-built", name: "Sentinel AI Architect", description: "Built the Sentinel AI SOC platform end-to-end", icon: "🤖",
    category: "projects", type: "milestone", criteria: "Complete Sentinel AI SOC project", unlocked: true, unlockedDate: "2024-08-01", rarity: "legendary",
    relatedProjects: ["sentinel-ai"],
    relatedSkills: ["AI", "SOC Operations", "Detection Engineering"],
    relatedCertifications: ["CySA+"],
  },
  {
    id: "cyber-nexus-built", name: "Cyber Nexus Creator", description: "Built the Cyber Nexus portfolio platform", icon: "🌐",
    category: "milestones", type: "milestone", criteria: "Complete Cyber Nexus portfolio", unlocked: true, unlockedDate: "2025-01-01", rarity: "legendary",
    relatedSkills: ["Full Stack Development", "TypeScript", "React"],
    evidence: "25+ pages, interactive knowledge graph, AI integration",
  },
  {
    id: "lab-completed", name: "Home Lab Engineer", description: "Completed the full home lab infrastructure", icon: "🔧",
    category: "labs", type: "milestone", criteria: "Set up complete home lab environment", unlocked: true, unlockedDate: "2024-11-15", rarity: "rare",
    relatedProjects: ["sentinel-ai", "active-directory-lab", "cloud-security-lab"],
    relatedSkills: ["Infrastructure", "Network Security", "Virtualization"],
    evidence: "12 VMs, 9 containers, full security stack across 7 network zones",
  },
  {
    id: "open-source-contrib", name: "Open Source Contributor", description: "Contributed to open-source security projects", icon: "🌍",
    category: "github", type: "milestone", criteria: "Contribute to open-source projects", unlocked: true, unlockedDate: "2024-06-10", rarity: "rare",
    relatedSkills: ["Open Source", "Collaboration"],
  },
  {
    id: "ad-expert", name: "Active Directory Specialist", description: "Completed the AD attack lab with full attack chain simulations", icon: "🏢",
    category: "labs", type: "milestone", criteria: "Complete Active Directory lab", unlocked: true, unlockedDate: "2024-09-01", rarity: "rare",
    relatedProjects: ["active-directory-lab"],
    relatedSkills: ["Active Directory", "Kerberos Attacks", "Privilege Escalation"],
    relatedCertifications: ["OSCP"],
  },
  {
    id: "cloud-sec-master", name: "Cloud Security Assessor", description: "Completed cloud security lab with IAM and container assessments", icon: "☁️",
    category: "labs", type: "milestone", criteria: "Complete cloud security lab", unlocked: true, unlockedDate: "2025-03-25", rarity: "rare",
    relatedProjects: ["cloud-security-lab"],
    relatedSkills: ["Cloud Security", "AWS", "Container Security"],
    relatedCertifications: ["AWS-Security"],
  },
  {
    id: "ctf-veteran", name: "CTF Veteran", description: "Completed 30+ CTF challenges across multiple platforms", icon: "⚔️",
    category: "ctf", type: "milestone", criteria: "Complete 30 CTF challenges", unlocked: true, unlockedDate: "2025-06-01", rarity: "legendary",
    relatedProjects: ["offensive-security-lab"],
    relatedSkills: ["Penetration Testing", "Web Security", "Exploit Development"],
    evidence: "34 challenges across TryHackMe, HTB, PortSwigger, PicoCTF, OverTheWire",
  },
  {
    id: "defender-elite", name: "SOC Defender Elite", description: "Built comprehensive detection engineering pipeline across multiple SIEMs", icon: "🛡️",
    category: "skills", type: "milestone", criteria: "Complete SOC automation framework", unlocked: true, unlockedDate: "2025-02-01", rarity: "rare",
    relatedProjects: ["soc-automation-framework", "sentinel-ai"],
    relatedSkills: ["SIEM", "Detection Engineering", "Incident Response"],
  },
  {
    id: "OSCP-earned", name: "OSCP — Offensive Security Certified", description: "Earned the highly-regarded hands-on penetration testing certification", icon: "🏅",
    category: "milestones", type: "milestone", criteria: "Pass OSCP examination", unlocked: true, unlockedDate: "2024-06-15", rarity: "legendary",
    relatedCertifications: ["OSCP"],
    relatedSkills: ["Penetration Testing", "Exploit Development", "Active Directory"],
    evidence: "24-hour practical exam, 10 machines, 70+ points",
  },
  {
    id: "ceh-earned", name: "CEH — Ethical Hacker", description: "Earned the Certified Ethical Hacker credential", icon: "🎯",
    category: "milestones", type: "milestone", criteria: "Pass CEH examination", unlocked: true, unlockedDate: "2024-04-01", rarity: "rare",
    relatedCertifications: ["CEH"],
    relatedSkills: ["Ethical Hacking", "Web Security", "Network Security"],
  },
  {
    id: "research-published", name: "Research Published", description: "Published technical security research", icon: "📄",
    category: "research", type: "milestone", criteria: "Publish original security research", unlocked: true, unlockedDate: "2024-08-15", rarity: "rare",
    relatedProjects: ["detection-engineering-guide", "eternalblue-analysis"],
    relatedSkills: ["Research", "Technical Writing"],
  },
  {
    id: "fullstack-dev", name: "Full Stack Security Engineer", description: "Built full-stack applications integrating security at every layer", icon: "⚡",
    category: "skills", type: "milestone", criteria: "Deliver end-to-end security application", unlocked: true, unlockedDate: "2024-08-01", rarity: "common",
    relatedProjects: ["sentinel-ai", "project-cybershield"],
    relatedSkills: ["TypeScript", "Python", "React"],
  },
  {
    id: "report-writer", name: "Documentation Champion", description: "Created comprehensive technical documentation for all projects", icon: "📋",
    category: "skills", type: "milestone", criteria: "Document 10+ projects with write-ups", unlocked: true, unlockedDate: "2025-04-01", rarity: "uncommon",
    relatedSkills: ["Technical Writing", "Documentation"],
  },
  {
    id: "ctf-elite", name: "CTF Elite", description: "Completed hard or insane difficulty CTF challenges", icon: "💎",
    category: "ctf", type: "milestone", criteria: "Complete a hard difficulty challenge", unlocked: true, unlockedDate: "2025-01-20", rarity: "legendary",
    relatedProjects: ["offensive-security-lab"],
    relatedSkills: ["Advanced Exploitation", "Binary Exploitation"],
    evidence: "PWN Buffer Overflow — ROP chain bypassing ASLR and NX",
  },
  {
    id: "easter-egg", name: "Retro Hacker", description: "Discovered the hidden retro terminal mode", icon: "🕹️",
    category: "explorer", type: "hidden", criteria: "Activate the Matrix theme", unlocked: false, rarity: "legendary",
    relatedSections: ["Settings"],
  },
  {
    id: "git-100", name: "Century Commit", description: "100+ commits across all GitHub repositories", icon: "📈",
    category: "github", type: "milestone", criteria: "Reach 100 GitHub commits", unlocked: true, unlockedDate: "2024-05-01", rarity: "uncommon",
  },
  {
    id: "platform-explorer", name: "Platform Explorer", description: "Completed challenges on 5 different CTF platforms", icon: "🌍",
    category: "ctf", type: "milestone", criteria: "Complete challenges on 5 platforms", unlocked: true, unlockedDate: "2024-07-28", rarity: "uncommon",
    relatedProjects: ["offensive-security-lab"],
    relatedSkills: ["Multi-platform Security"],
  },
  {
    id: "skill-master", name: "Skill Master", description: "Developed expertise in 20+ cybersecurity domains", icon: "🧠",
    category: "skills", type: "milestone", criteria: "Document 20+ skills", unlocked: true, unlockedDate: "2024-12-01", rarity: "rare",
    relatedSkills: ["Cross-domain Security Knowledge"],
  },
  {
    id: "siem-architect", name: "SIEM Architect", description: "Designed and deployed dual-SIEM architecture (Splunk + ELK)", icon: "📊",
    category: "labs", type: "milestone", criteria: "Deploy SIEM infrastructure", unlocked: true, unlockedDate: "2024-10-01", rarity: "rare",
    relatedProjects: ["sentinel-ai"],
    relatedSkills: ["SIEM", "Log Analysis", "Elasticsearch"],
  },
  {
    id: "mission-control", name: "Mission Control", description: "Completed all exploration missions", icon: "🎖️",
    category: "explorer", type: "mission", criteria: "Complete every exploration mission", unlocked: false, progress: 0, maxProgress: 5, rarity: "legendary",
    relatedSections: ["Home", "Projects", "Blog", "Knowledge Graph", "Cyber Lab"],
  },
  {
    id: "full-disclosure", name: "Full Disclosure", description: "Visited every major section of Cyber Nexus", icon: "🗂️",
    category: "explorer", type: "exploration", criteria: "Visit every main navigation section", unlocked: false, progress: 0, maxProgress: 16, rarity: "legendary",
    relatedSections: ["Home", "Projects", "Skills", "Certifications", "Dashboard", "Resume", "Blog", "AI Twin", "Interview", "GitHub", "Analytics", "Timeline", "CTF Range", "Cyber Lab", "Knowledge Graph", "Contact"],
  },
];

export const missions: Mission[] = [
  {
    id: "mission-ai", name: "AI Explorer", description: "Explore all AI-powered features across the portfolio",
    tasks: ["Visit the AI Digital Twin", "Ask Cyber AI a question", "Use the Interview Simulator", "Visit the AI Knowledge Guide"],
    progress: 0, total: 4, completed: false, reward: "AI Conversationalist achievement",
  },
  {
    id: "mission-projects", name: "Project Investigator", description: "Review every cybersecurity project",
    tasks: ["Visit the Projects page", "Open 5 project details", "Read a project write-up", "Visit a project's GitHub link"],
    progress: 0, total: 4, completed: false, reward: "Project Hunter achievement",
  },
  {
    id: "mission-lab", name: "Lab Operator", description: "Explore the home lab infrastructure",
    tasks: ["Visit the Cyber Lab page", "Click a VM in the topology", "Review the security stack", "Read a lab document"],
    progress: 0, total: 4, completed: false, reward: "Architecture Explorer achievement",
  },
  {
    id: "mission-knowledge", name: "Knowledge Seeker", description: "Navigate the interconnected portfolio",
    tasks: ["Visit the Knowledge Graph", "Click 5 nodes to explore", "Review a learning path", "Ask the AI Knowledge Guide a question"],
    progress: 0, total: 4, completed: false, reward: "Knowledge Navigator achievement",
  },
  {
    id: "mission-career", name: "Career Investigator", description: "Explore career progression and growth",
    tasks: ["Visit the Career Timeline", "View the Career Analytics dashboard", "Review certifications", "Read the resume"],
    progress: 0, total: 4, completed: false, reward: "Timeline Traveler achievement",
  },
];

export const trophies: Trophy[] = [
  { id: "trophy-portfolio-v1", title: "Cyber Nexus v1.0 Launch", description: "Initial portfolio release with interactive SOC dashboard and project showcase", date: "2024-01-01", icon: "🚀", category: "Portfolio Release", evidence: "/" },
  { id: "trophy-portfolio-v2", title: "Cyber Nexus v2.0 — Liquid Glass", description: "Major redesign with Liquid Glass design system, AI integration, and Knowledge Graph", date: "2025-06-01", icon: "💎", category: "Portfolio Release", evidence: "/" },
  { id: "trophy-sentinel-ga", title: "Sentinel AI SOC — General Availability", description: "Enterprise SOC platform with real-time detection, AI-powered analysis, and automated response", date: "2024-08-01", icon: "🤖", category: "Project Milestone", evidence: "/projects/sentinel-ai" },
  { id: "trophy-oscp", title: "OSCP Certification Earned", description: "Passed the 24-hour hands-on penetration testing examination", date: "2024-06-15", icon: "🏅", category: "Certification", evidence: "/certifications" },
  { id: "trophy-30-ctf", title: "30 CTF Challenge Milestone", description: "Completed over 30 CTF challenges across 5+ platforms", date: "2025-06-01", icon: "⚔️", category: "CTF", evidence: "/ctf-command-center" },
  { id: "trophy-lab-complete", title: "Home Lab Infrastructure Complete", description: "Deployed 12 VMs, 9 containers, and full security monitoring stack", date: "2024-11-15", icon: "🔧", category: "Infrastructure", evidence: "/cyber-lab" },
  { id: "trophy-blog-6", title: "Six Research Articles Published", description: "Published technical research on web security, malware analysis, cloud security, and more", date: "2025-04-01", icon: "✍️", category: "Research", evidence: "/blog" },
  { id: "trophy-25-pages", title: "25-Page Portfolio Milestone", description: "Cyber Nexus expanded to 25 unique interactive pages", date: "2025-07-04", icon: "🌐", category: "Portfolio Release", evidence: "/" },
];

export const passportStamps = [
  { id: "stamp-home", label: "Command Center", icon: "🏠", page: "/" },
  { id: "stamp-projects", label: "Project Command Center", icon: "💻", page: "/projects" },
  { id: "stamp-skills", label: "Skills Galaxy", icon: "🧠", page: "/skills" },
  { id: "stamp-certs", label: "Certification Vault", icon: "🎓", page: "/certifications" },
  { id: "stamp-dashboard", label: "SOC Dashboard", icon: "🛡️", page: "/dashboard" },
  { id: "stamp-resume", label: "Resume & Experience", icon: "📋", page: "/resume" },
  { id: "stamp-blog", label: "Security Research", icon: "✍️", page: "/blog" },
  { id: "stamp-ai", label: "AI Digital Twin", icon: "🤖", page: "/cyber-persona" },
  { id: "stamp-interview", label: "Interview Simulator", icon: "🎯", page: "/interview-simulator" },
  { id: "stamp-github", label: "GitHub Intelligence", icon: "🐙", page: "/github-intelligence" },
  { id: "stamp-analytics", label: "Career Analytics", icon: "📊", page: "/career-analytics" },
  { id: "stamp-timeline", label: "Career Timeline", icon: "⏳", page: "/career-timeline" },
  { id: "stamp-ctf", label: "CTF Command Center", icon: "🚩", page: "/ctf-command-center" },
  { id: "stamp-lab", label: "Cyber Lab", icon: "🔧", page: "/cyber-lab" },
  { id: "stamp-knowledge", label: "Knowledge Graph", icon: "🧭", page: "/knowledge-graph" },
  { id: "stamp-contact", label: "Contact", icon: "📧", page: "/contact" },
];

export const learningChallenges = [
  {
    id: "challenge-tech-id", name: "Technology Identifier",
    description: "Identify the technologies used in the Sentinel AI SOC platform",
    hint: "Check the project's tech stack section",
  },
  {
    id: "challenge-path-trace", name: "Path Tracer",
    description: "Trace the learning path from Network+ to Sentinel AI SOC",
    hint: "Follow the Knowledge Graph learning paths",
  },
  {
    id: "challenge-cert-connect", name: "Certification Connector",
    description: "Identify which certifications are related to the Active Directory Lab",
    hint: "Check the project's related certifications",
  },
  {
    id: "challenge-graph-navigate", name: "Graph Navigator",
    description: "Find 5 projects connected to Python in the Knowledge Graph",
    hint: "Search for Python in the Knowledge Graph",
  },
];

export function getAchievementsByCategory(cat: AchievementCategory): Achievement[] {
  return achievements.filter((a) => a.category === cat);
}

export function getAchievementsByType(type: AchievementType): Achievement[] {
  return achievements.filter((a) => a.type === type);
}

export function getUnlockedAchievements(): Achievement[] {
  return achievements.filter((a) => a.unlocked);
}

export const TOTAL_ACHIEVEMENTS = achievements.length;
export const TOTAL_UNLOCKED = getUnlockedAchievements().length;
