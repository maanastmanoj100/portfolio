import {
  IconShield, IconBrain, IconNetwork, IconBook, IconBrandGithub,
  IconChartBar, IconCertificate, IconSearch, IconSettings,
  IconBug, IconServer, IconTerminal, IconFolder, IconGlobe,
  IconMessage, IconHistory, IconDashboard, IconMap, IconFlag,
  IconTrophy, IconCode, IconDatabase, IconLock, IconApi,
  IconUsers, IconFileText, IconStar, IconHeart, IconRobot,
  IconDeviceGamepad2,
} from "@tabler/icons-react";

export interface OsApp {
  id: string;
  name: string;
  desc: string;
  category: string;
  icon: any;
  route?: string;
  color: string;
}

export const OS_APPS: OsApp[] = [
  // Projects & Portfolio
  { id: "projects", name: "Projects", desc: "Browse portfolio projects", category: "portfolio", icon: IconCode, route: "/projects", color: "text-cyan-400" },
  { id: "skills", name: "Skills", desc: "Technical skills & proficiencies", category: "portfolio", icon: IconBrain, route: "/skills", color: "text-purple-400" },
  { id: "certifications", name: "Certifications", desc: "Certifications & credentials", category: "portfolio", icon: IconCertificate, route: "/certifications", color: "text-amber-400" },
  { id: "blog", name: "Blog", desc: "Cybersecurity articles & write-ups", category: "portfolio", icon: IconFileText, route: "/blog", color: "text-blue-400" },
  { id: "resume", name: "Resume", desc: "Professional resume & CV", category: "portfolio", icon: IconFileText, route: "/resume", color: "text-green-400" },

  // SOC & Security
  { id: "soc-dashboard", name: "SOC Dashboard", desc: "Security operations center", category: "security", icon: IconShield, route: "/dashboard", color: "text-cyan-400" },
  { id: "threat-intel", name: "Threat Intelligence", desc: "Threat intel & analysis", category: "security", icon: IconMap, route: "/attack-map", color: "text-red-400" },
  { id: "ctf", name: "CTF Command Center", desc: "CTF challenges & write-ups", category: "security", icon: IconFlag, route: "/ctf-command-center", color: "text-amber-400" },
  { id: "lab", name: "Home Lab", desc: "Virtual cyber range infrastructure", category: "security", icon: IconServer, route: "/cyber-lab", color: "text-green-400" },
  { id: "architect", name: "Project Architect", desc: "AI project generator & planner", category: "security", icon: IconDatabase, route: "/project-architect", color: "text-purple-400" },
  { id: "architecture", name: "Architecture Studio", desc: "Security architecture explorer", category: "security", icon: IconLock, route: "/security-architect", color: "text-cyan-400" },
  { id: "wiki", name: "Wiki", desc: "Cybersecurity knowledge base", category: "security", icon: IconBook, route: "/wiki", color: "text-blue-400" },

  // Intelligence
  { id: "knowledge-graph", name: "Knowledge Graph", desc: "Interactive knowledge network", category: "intelligence", icon: IconNetwork, route: "/knowledge-graph", color: "text-purple-400" },
  { id: "career-intel", name: "Career Intelligence", desc: "Role insights & skill gaps", category: "intelligence", icon: IconChartBar, route: "/career-intelligence", color: "text-cyan-400" },
  { id: "github", name: "GitHub Intelligence", desc: "Repository analytics", category: "intelligence", icon: IconBrandGithub, route: "/github-intelligence", color: "text-white" },
  { id: "achievements", name: "Achievements", desc: "Gamification & milestones", category: "intelligence", icon: IconTrophy, route: "/achievements", color: "text-amber-400" },
  { id: "career-timeline", name: "Career Timeline", desc: "Professional journey timeline", category: "intelligence", icon: IconHistory, route: "/career-timeline", color: "text-blue-400" },

  // Communication & AI
  { id: "ai-copilot", name: "AI Copilot", desc: "Intelligent portfolio assistant", category: "system", icon: IconRobot, route: "#", color: "text-purple-400" },
  { id: "interview-sim", name: "Interview Simulator", desc: "Practice technical interviews", category: "system", icon: IconMessage, route: "/interview-simulator", color: "text-green-400" },
  { id: "cyber-persona", name: "Cyber Persona", desc: "AI-powered professional persona", category: "system", icon: IconUsers, route: "/cyber-persona", color: "text-cyan-400" },

  // System
  { id: "terminal", name: "Terminal", desc: "Portfolio command line", category: "system", icon: IconTerminal, route: "#", color: "text-green-400" },
  { id: "files", name: "File Explorer", desc: "Browse virtual file system", category: "system", icon: IconFolder, route: "#", color: "text-cyan-400" },
  { id: "browser", name: "Web Viewer", desc: "Browse portfolio pages", category: "system", icon: IconGlobe, route: "#", color: "text-blue-400" },
  { id: "settings", name: "Settings", desc: "OS preferences & customization", category: "system", icon: IconSettings, route: "#", color: "text-gray-400" },
  { id: "dashboard", name: "Dashboard", desc: "Portfolio analytics overview", category: "system", icon: IconDashboard, route: "/career-analytics", color: "text-cyan-400" },
  { id: "arcade", name: "Arcade", desc: "Logic, puzzle, cyber, and mini games", category: "system", icon: IconDeviceGamepad2, route: "/arcade", color: "text-purple-400" },
];

export const APP_CATEGORIES = [
  { id: "portfolio", name: "Portfolio", color: "text-blue-400" },
  { id: "security", name: "Security", color: "text-cyan-400" },
  { id: "intelligence", name: "Intelligence", color: "text-purple-400" },
  { id: "system", name: "System", color: "text-gray-400" },
];

// ─── Virtual File System ────────────────────────────────────────────────

export interface VfsNode {
  name: string;
  type: "folder" | "file";
  children?: VfsNode[];
  icon?: string;
  size?: string;
  modified?: string;
}

export const VIRTUAL_FS: VfsNode[] = [
  {
    name: "Projects", type: "folder", icon: "folder", modified: "2026-07-04",
    children: [
      { name: "Cyber Nexus", type: "folder", icon: "folder", modified: "2026-07-04", children: [
        { name: "architecture.md", type: "file", icon: "file", size: "12 KB" },
        { name: "security-posture.md", type: "file", icon: "file", size: "8 KB" },
        { name: "tech-stack.md", type: "file", icon: "file", size: "4 KB" },
      ]},
      { name: "Sentinel AI SOC", type: "folder", icon: "folder", modified: "2026-06-20", children: [
        { name: "architecture-overview.md", type: "file", icon: "file", size: "15 KB" },
        { name: "detection-rules.md", type: "file", icon: "file", size: "22 KB" },
      ]},
      { name: "Home Lab", type: "folder", icon: "folder", modified: "2026-06-15", children: [
        { name: "network-topology.md", type: "file", icon: "file", size: "18 KB" },
        { name: "security-baselines.md", type: "file", icon: "file", size: "10 KB" },
      ]},
    ],
  },
  {
    name: "Research", type: "folder", icon: "folder", modified: "2026-07-01",
    children: [
      { name: "threat-intel", type: "folder", icon: "folder", children: [] },
      { name: "malware-analysis", type: "folder", icon: "folder", children: [] },
      { name: "network-security", type: "folder", icon: "folder", children: [] },
    ],
  },
  {
    name: "Write-ups", type: "folder", icon: "folder", modified: "2026-06-28",
    children: [
      { name: "CTF", type: "folder", icon: "folder", children: [] },
      { name: "Labs", type: "folder", icon: "folder", children: [] },
    ],
  },
  {
    name: "Certificates", type: "folder", icon: "folder", modified: "2026-05-15",
    children: [
      { name: "security-certifications.pdf", type: "file", icon: "file", size: "2.4 MB" },
      { name: "continuing-education.md", type: "file", icon: "file", size: "3 KB" },
    ],
  },
  {
    name: "Architecture", type: "folder", icon: "folder", modified: "2026-07-04",
    children: [
      { name: "adr", type: "folder", icon: "folder", children: [] },
      { name: "diagrams", type: "folder", icon: "folder", children: [] },
      { name: "threat-models", type: "folder", icon: "folder", children: [] },
    ],
  },
  { name: "Documents", type: "folder", icon: "folder", modified: "2026-06-10", children: [] },
  { name: "Exports", type: "folder", icon: "folder", modified: "2026-06-30", children: [] },
  { name: "Settings", type: "folder", icon: "folder", modified: "2026-07-04", children: [] },
];

// ─── Commands ───────────────────────────────────────────────────────────

export const TERMINAL_COMMANDS: Record<string, { desc: string; output: string | ((args: string[]) => string) }> = {
  help: {
    desc: "Show available commands",
    output: `Available commands:
  help          Show this help message
  projects      List portfolio projects
  skills        Show technical skills
  timeline      Display career timeline
  certificates  List certifications
  github        GitHub repository stats
  lab           Home lab status
  soc           SOC dashboard status
  search <q>    Search portfolio content
  clear         Clear terminal
  whoami        Display user info
  date          Show current date
  echo <msg>    Print a message
  neofetch      Display system info
  matrix        Toggle matrix mode
  theme <name>  Change desktop theme
  easter-egg    Discover hidden content`,
  },
  projects: {
    desc: "List portfolio projects",
    output: "Projects:\n  Cyber Nexus (Next.js Portfolio)\n  Sentinel AI SOC (AI Threat Detection)\n  Threat Intelligence Center\n  Home Lab (Virtual Cyber Range)\n  Knowledge Graph (Interactive Visualization)\n  Docker Security Environment\n  API Gateway Architecture\n  AI Services Pipeline",
  },
  skills: {
    desc: "Show technical skills",
    output: "Skills:\n  Web Security · Network Security · Cloud Security (AWS)\n  SIEM (Splunk, Wazuh) · Python · TypeScript\n  Threat Modeling · Incident Response\n  Docker · Kubernetes · Terraform\n  Penetration Testing · Malware Analysis",
  },
  timeline: {
    desc: "Display career timeline",
    output: "Career Timeline:\n  2026 - Security Architecture Explorer\n  2026 - AI Project Architect\n  2025 - Cyber Nexus Platform Launch\n  2025 - Home Lab Infrastructure\n  2024 - Cloud Security Certification\n  2023 - SOC Analyst Experience",
  },
  certificates: {
    desc: "List certifications",
    output: "Certifications:\n  Security+ (CompTIA)\n  Certified Ethical Hacker (CEH)\n  AWS Security Specialty\n  CISSP (In Progress)\n  OSCP (In Progress)",
  },
  github: {
    desc: "GitHub repository stats",
    output: "GitHub Intelligence:\n  cyber-nexus - Main portfolio platform\n  sentinel-ai-soc - AI SOC concept\n  home-lab - Infrastructure as code\n  threat-intel-center - Threat intelligence\n  knowledge-graph - Interactive graph engine",
  },
  lab: {
    desc: "Home lab status",
    output: "Home Lab Status:\n  Hypervisor: Proxmox VE (Online)\n  Firewall: pfSense (Active)\n  SIEM: Wazuh (Ingesting)\n  AD: Windows Server (Running)\n  Kali: Ready\n  Containers: 9 running",
  },
  soc: {
    desc: "SOC dashboard status",
    output: "SOC Dashboard Status:\n  Events Today: 1,247\n  Critical Alerts: 0\n  High Alerts: 2\n  Medium Alerts: 7\n  Low Alerts: 34\n  MITRE ATT&CK Coverage: 142 techniques",
  },
  search: {
    desc: "Search portfolio content",
    output: (args) => args.length > 0 ? `Searching for "${args.join(" ")}"...\n  (Search functionality available in the global search)` : "Usage: search <query>",
  },
  whoami: {
    desc: "Display user info",
    output: "cybernexus\n  Role: Security Engineer & Researcher\n  Shell: Cyber Nexus OS Terminal\n  Environment: Educational Portfolio",
  },
  date: {
    desc: "Show current date",
    output: new Date().toString(),
  },
  echo: {
    desc: "Print a message",
    output: (args) => args.join(" ") || "",
  },
  clear: {
    desc: "Clear terminal",
    output: "",
  },
  neofetch: {
    desc: "Display system info",
    output: `cybernexus@portfolio
  OS: Cyber Nexus OS v1.0
  Shell: Educational Terminal
  Resolution: Browser-Based
  Theme: Liquid Glass
  CPU: Portfolio Simulation
  Memory: Web Application
  FPS: 60 (Simulated)`,
  },
  matrix: {
    desc: "Toggle matrix mode",
    output: "Matrix mode toggled. (Use the setting in Control Center)",
  },
  theme: {
    desc: "Change desktop theme",
    output: (args) => {
      const themes = ["liquid-glass", "dark-cyber", "light-professional", "midnight-blue", "neon-matrix", "minimal", "high-contrast"];
      if (args.length === 0) return `Available themes: ${themes.join(", ")}`;
      if (themes.includes(args[0])) return `Theme changed to ${args[0]}. (Use Control Center to customize further.)`;
      return `Unknown theme: ${args[0]}. Available: ${themes.join(", ")}`;
    },
  },
  "easter-egg": {
    desc: "Discover hidden content",
    output: "You found an easter egg! 🥚\nTry these: 'matrix', 'neofetch', theme names, or explore the desktop corners...",
  },
};

// ─── Wallpapers ─────────────────────────────────────────────────────────

export const WALLPAPERS = [
  { id: "default", name: "Cyber Nexus", gradient: "from-gray-950 via-slate-900 to-gray-950" },
  { id: "dark", name: "Dark Matter", gradient: "from-black via-gray-900 to-black" },
  { id: "ocean", name: "Deep Ocean", gradient: "from-slate-950 via-blue-950 to-slate-950" },
  { id: "aurora", name: "Cyber Aurora", gradient: "from-gray-950 via-purple-950 to-gray-950" },
  { id: "matrix", name: "Neon Matrix", gradient: "from-black via-green-950 to-black" },
  { id: "sunset", name: "Digital Sunset", gradient: "from-gray-900 via-amber-950 to-gray-900" },
];

// ─── Boot Messages ──────────────────────────────────────────────────────

export const BOOT_MESSAGES = [
  "Initialising Cyber Nexus kernel...",
  "Loading Liquid Glass interface...",
  "Mounting virtual file system...",
  "Starting window manager...",
  "Initialising security modules...",
  "Loading user preferences...",
  "Establishing portfolio connections...",
  "Calibrating glass reflections...",
  "Optimising animation pipeline...",
  "Ready.",
];

// ─── Easter Eggs ────────────────────────────────────────────────────────

export const EASTER_EGGS = [
  { id: "konami", name: "Konami Code", desc: "Enter the classic cheat code", icon: IconStar },
  { id: "matrix-fall", name: "Matrix Rain", desc: "Watch the digital rain fall", icon: IconBug },
  { id: "retro-term", name: "Retro Terminal", desc: "Switch to vintage green terminal theme", icon: IconTerminal },
  { id: "ascii-art", name: "ASCII Surprise", desc: "Hidden ASCII art in the terminal", icon: IconCode },
  { id: "dev-credits", name: "Developer Credits", desc: "Who built this OS?", icon: IconUsers },
];

// ─── Notification presets ──────────────────────────────────────────────

export const NOTIFICATION_PRESETS = [
  { title: "System Ready", desc: "All modules loaded successfully.", category: "system" as const },
  { title: "GitHub Sync Complete", desc: "Repository data updated.", category: "github" as const },
  { title: "New Achievement Unlocked", desc: "Explore more to earn badges.", category: "achievement" as const },
  { title: "Portfolio Updated", desc: "Latest changes applied.", category: "update" as const },
  { title: "Learning Milestone", desc: "You've explored 75% of the portfolio.", category: "learning" as const },
];

// ─── AI Copilot Suggestions ─────────────────────────────────────────────

export const COPILOT_SUGGESTIONS = [
  "Navigate to SOC Dashboard",
  "Open Project Architect",
  "Show security architecture",
  "Launch Knowledge Graph",
  "Open career intelligence",
  "Start terminal session",
  "Switch to recruiter workspace",
];
