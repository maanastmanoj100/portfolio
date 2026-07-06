export interface Persona {
  id: string;
  label: string;
  description: string;
  icon: string;
  focus: string[];
}

export const PERSONAS: Persona[] = [
  { id: "recruiter", label: "I'm a Recruiter", description: "Quick overview of qualifications, experience, and fit", icon: "IconUserSearch", focus: ["summary", "skills", "projects", "certs"] },
  { id: "hiring-manager", label: "I'm a Hiring Manager", description: "Role alignment, project depth, and team fit", icon: "IconBriefcase", focus: ["projects", "architecture", "leadership", "timeline"] },
  { id: "interviewer", label: "I'm a Technical Interviewer", description: "Deep technical assessment, architecture, and code", icon: "IconCode", focus: ["system-design", "code", "threat-models", "questions"] },
  { id: "student", label: "I'm a Student", description: "Learning path, mentorship, and career inspiration", icon: "IconSchool", focus: ["timeline", "learning", "resources", "journey"] },
  { id: "professional", label: "I'm a Cybersecurity Professional", description: "Peer-level technical review and collaboration", icon: "IconShield", focus: ["projects", "research", "oss", "architecture"] },
  { id: "explorer", label: "I'm Just Exploring", description: "Tour the full portfolio experience", icon: "IconCompass", focus: ["all"] },
];

export interface EvidenceChainItem {
  skill: string;
  category: string;
  level: number;
  evidence: { type: string; label: string; path: string }[];
}

export const EVIDENCE_CHAINS: EvidenceChainItem[] = [
  {
    skill: "Python", category: "Programming", level: 95,
    evidence: [
      { type: "project", label: "Sentinel AI — ML correlation engine", path: "/projects/sentinel-ai" },
      { type: "project", label: "Threat Hunter — Sigma rule engine", path: "/projects/threat-hunter" },
      { type: "project", label: "PhishShield — NLP phishing detection", path: "/projects/phishshield" },
      { type: "project", label: "Forensic Analyzer — artifact extraction", path: "/projects/forensic-analyzer" },
      { type: "lab", label: "Cyber Lab — automation scripts", path: "/cyber-lab" },
      { type: "wiki", label: "Python security automation guide", path: "/wiki?article=python-security" },
    ],
  },
  {
    skill: "TypeScript", category: "Programming", level: 90,
    evidence: [
      { type: "project", label: "Cyber Nexus — full-stack Next.js portfolio", path: "/" },
      { type: "project", label: "Command Center — real-time SOC dashboard", path: "/command-center" },
      { type: "project", label: "Cyber OS — desktop environment", path: "/cyber-os" },
      { type: "architecture", label: "Component architecture & state management", path: "/engineering" },
    ],
  },
  {
    skill: "Go", category: "Programming", level: 80,
    evidence: [
      { type: "project", label: "NetDefend — packet capture & anomaly detection", path: "/projects/netdefend" },
      { type: "project", label: "K8s Hardener — CIS benchmark automation", path: "/projects/k8s-hardener" },
      { type: "project", label: "CloudSec Enforcer — AWS scanning engine", path: "/projects/cloudsec-enforcer" },
    ],
  },
  {
    skill: "Penetration Testing", category: "Offensive Security", level: 88,
    evidence: [
      { type: "cert", label: "OSCP — Offensive Security Certified Professional", path: "/certifications" },
      { type: "project", label: "RedOps — adversary simulation toolkit", path: "/projects/redops" },
      { type: "ctf", label: "CTF Range — 34 challenges across 7 platforms", path: "/ctf-command-center" },
      { type: "lab", label: "Cyber Lab — AD attack lab", path: "/cyber-lab" },
    ],
  },
  {
    skill: "SOC Operations", category: "Defensive Security", level: 85,
    evidence: [
      { type: "project", label: "Sentinel AI — enterprise SIEM correlation", path: "/projects/sentinel-ai" },
      { type: "dashboard", label: "Command Center — SOC+NOC+OSINT fusion", path: "/command-center" },
      { type: "project", label: "Threat Hunter — threat hunting framework", path: "/projects/threat-hunter" },
      { type: "dashboard", label: "Dashboard — live SOC metrics", path: "/dashboard" },
    ],
  },
  {
    skill: "Cloud Security", category: "Cloud & DevSecOps", level: 82,
    evidence: [
      { type: "project", label: "CloudSec Enforcer — multi-cloud scanning", path: "/projects/cloudsec-enforcer" },
      { type: "project", label: "K8s Hardener — Kubernetes security", path: "/projects/k8s-hardener" },
      { type: "architecture", label: "Security Architecture Explorer — cloud threat models", path: "/security-architect" },
      { type: "lab", label: "Cyber Lab — AWS cloud resources", path: "/cyber-lab" },
    ],
  },
  {
    skill: "Machine Learning", category: "AI / ML", level: 78,
    evidence: [
      { type: "project", label: "Sentinel AI — ML-based threat correlation", path: "/projects/sentinel-ai" },
      { type: "project", label: "PhishShield — NLP email analysis", path: "/projects/phishshield" },
      { type: "wiki", label: "ML model training guide", path: "/wiki?article=ml-training" },
    ],
  },
  {
    skill: "Digital Forensics", category: "Forensics", level: 75,
    evidence: [
      { type: "project", label: "Forensic Analyzer — memory & disk analysis", path: "/projects/forensic-analyzer" },
      { type: "lab", label: "Cyber Lab — DFIR workstation", path: "/cyber-lab" },
      { type: "cert", label: "Digital forensics methodology", path: "/certifications" },
    ],
  },
  {
    skill: "Threat Intelligence", category: "Defensive Security", level: 80,
    evidence: [
      { type: "dashboard", label: "Command Center — OSINT & threat intel", path: "/command-center" },
      { type: "project", label: "Threat Hunter — Sigma & IOC matching", path: "/projects/threat-hunter" },
      { type: "project", label: "Threat Map — global attack visualization", path: "/attack-map" },
    ],
  },
  {
    skill: "Network Security", category: "Defensive Security", level: 83,
    evidence: [
      { type: "project", label: "NetDefend — network defense toolkit", path: "/projects/netdefend" },
      { type: "lab", label: "Cyber Lab — pfSense, Snort, network zones", path: "/cyber-lab" },
      { type: "wiki", label: "Networking fundamentals wiki", path: "/wiki?category=networking" },
    ],
  },
];

export interface SystemDesignItem {
  id: string;
  title: string;
  description: string;
  category: string;
  designChoices: string[];
  threatModel: string[];
  controls: string[];
}

export const SYSTEM_DESIGNS: SystemDesignItem[] = [
  {
    id: "sd-1", title: "SOC Platform Architecture", description: "Scalable SIEM correlation engine ingesting 10M+ events daily with ML-based detection", category: "Security",
    designChoices: ["Event-driven microservices with Kafka message bus", "ML inference pipeline separated from ingestion for scaling", "Elasticsearch cluster with hot-warm-cold tiering", "Immutable event log with append-only storage"],
    threatModel: ["Unauthenticated API access → OAuth2 + API keys", "Event spoofing → cryptographic signing", "Data exfiltration → encryption at rest + TLS", "ML model poisoning → input validation + anomaly thresholds"],
    controls: ["RBAC with 4 role tiers", "Rate limiting per tenant", "Audit logging for all operations", "SIEM alert on anomalous query patterns"],
  },
  {
    id: "sd-2", title: "Network Defense System", description: "eBPF-based packet inspection with real-time anomaly detection and automated response", category: "Network",
    designChoices: ["eBPF XDP for kernel-level packet inspection", "Ring buffer for zero-copy data transfer", "Prometheus metrics with Grafana dashboards", "Modular plugin architecture for detection algorithms"],
    threatModel: ["Packet injection → sequence number validation", "Kernel module compromise → minimal eBPF bytecode verification", "Resource exhaustion → ring buffer backpressure", "Evasion → multi-layer detection (signature + behavioral + statistical)"],
    controls: ["eBPF verifier for safe bytecode execution", "Capability-based permissions", "Performance budgets per plugin", "Anomaly alerting with auto-threshold tuning"],
  },
  {
    id: "sd-3", title: "Cloud Security Scanner", description: "Multi-cloud posture management scanning AWS, Azure, and GCP against CIS benchmarks", category: "Cloud",
    designChoices: ["Provider-agnostic policy engine with adapter pattern", "Policy-as-code using Rego/OPA", "Parallel scanning with rate limiting per provider", "Remediation as idempotent Terraform modules"],
    threatModel: ["Cloud credential exposure → short-lived STS tokens", "Cross-account data leakage → resource-level isolation", "Policy bypass → mandatory policy evaluation on all resources", "Stale scan results → TTL-based cache invalidation"],
    controls: ["Credential rotation every 60 minutes", "Scan scope documented and auditable", "Remediation dry-run mode", "Compliance report signing"],
  },
  {
    id: "sd-4", title: "Phishing Detection Pipeline", description: "NLP-based email analysis with computer vision for brand impersonation detection", category: "AI/ML",
    designChoices: ["Ensemble model: BERT for text + CNN for logos", "Celery task queue for parallel email processing", "Real-time classification with batch retraining", "Feedback loop for continuous model improvement"],
    threatModel: ["Adversarial email content → adversarial training samples", "Model bias → balanced training datasets", "Evasion via image manipulation → data augmentation", "False positives → tunable confidence threshold per tenant"],
    controls: ["Human-in-the-loop for borderline classifications", "Model versioning with A/B testing", "Confidence scores exposed to analysts", "Periodic red-team testing of detection efficacy"],
  },
];

export interface DecisionLog {
  id: string;
  title: string;
  challenge: string;
  tradeoffs: string[];
  chosen: string;
  lessons: string[];
  alternatives: string[];
  improvements: string[];
  date: string;
}

export const DECISION_LOG: DecisionLog[] = [
  {
    id: "dl-1", title: "ML vs Rule-based Correlation", date: "2026-03",
    challenge: "Should Sentinel AI use machine learning or traditional rule-based correlation for threat detection?",
    tradeoffs: ["ML offers better unknown-threat detection but requires training data", "Rules are deterministic and explainable but miss novel attacks", "ML has higher computational cost and latency", "Rules are easier to audit and tune"],
    chosen: "Hybrid approach: ML for anomaly scoring + rules for known patterns, with analyst feedback loop",
    lessons: ["Hybrid gave 99.7% detection vs 94% rules-only", "ML false positive rate dropped 60% after 3 months of analyst feedback", "Rules provide fallback when ML confidence is low"],
    alternatives: ["Pure ML with unsupervised learning", "Pure rule-based with community Sigma rules", "Third-party SIEM with built-in correlation"],
    improvements: ["Add explainable AI for alert reasoning", "Implement online learning for real-time model updates", "Build community rule marketplace for crowdsourced detection"],
  },
  {
    id: "dl-2", title: "eBPF vs libpcap for Packet Capture", date: "2026-02",
    challenge: "Should NetDefend use eBPF (kernel-level) or libpcap (userspace) for packet capture?",
    tradeoffs: ["eBPF offers 10x better performance but requires Linux 5.x+", "libpcap is portable across OS but has higher overhead", "eBPF has steeper learning curve and debugging complexity", "libpcap has broader community and tooling support"],
    chosen: "eBPF XDP for production traffic, libpcap fallback for compatibility mode",
    lessons: ["eBPF reduced CPU usage by 73% at line rate", "Development time was 2x longer due to kernel debugging", "Compatibility mode captured 30% of users who couldn't run eBPF"],
    alternatives: ["DPDK for userspace packet processing", "PF_RING with DNA acceleration", "Raw AF_PACKET sockets"],
    improvements: ["Add eBPF CO-RE (Compile Once Run Everywhere)", "Build eBPF verifier simulator for safe development", "Create libpcap-to-eBPF migration guide"],
  },
  {
    id: "dl-3", title: "Monorepo vs Polyrepo", date: "2026-01",
    challenge: "Should the Cyber Nexus portfolio use a monorepo or polyrepo structure?",
    tradeoffs: ["Monorepo simplifies shared UI components and types", "Polyrepo enables independent versioning and CI", "Monorepo requires more build tooling (Turborepo)", "Polyrepo makes cross-project refactoring harder"],
    chosen: "Monorepo with Turborepo for build caching and workspace management",
    lessons: ["Shared types caught 40+ cross-module issues during development", "Turborepo caching reduced CI time by 65%", "Module boundaries required disciplined code ownership"],
    alternatives: ["Git submodules with polyrepo", "Nx workspace manager", "Lerna with independent mode"],
    improvements: ["Add automated module boundary enforcement", "Implement code ownership via CODEOWNERS", "Extract shared packages to separate workspace"],
  },
  {
    id: "dl-4", title: "State Management Strategy", date: "2026-01",
    challenge: "What state management approach best suits the multi-module Cyber Nexus architecture?",
    tradeoffs: ["Zustand is lightweight but lacks devtools", "Redux has excellent tooling but high boilerplate", "Jotai offers atomic state but learning curve", "React Context is built-in but causes re-render cascades"],
    chosen: "Zustand stores per domain module + React Query for server state",
    lessons: ["Per-module stores prevented global state coupling", "React Query eliminated 200+ lines of manual cache logic", "Migration from Context to Zustand reduced re-renders by 35%"],
    alternatives: ["Redux Toolkit with RTK Query", "Valtio for proxy-based state", "XState for state machine heavy modules"],
    improvements: ["Add Zustand devtools middleware for debugging", "Implement store persistence with selective hydration", "Create shared store patterns documentation"],
  },
  {
    id: "dl-5", title: "CSS Architecture", date: "2026-01",
    challenge: "How to style a multi-module Next.js app with consistent Liquid Glass design language?",
    tradeoffs: ["Tailwind provides utility-first consistency but verbose JSX", "CSS modules offer component isolation but duplicate styles", "CSS-in-JS (styled-components) has runtime cost", "Global CSS is simple but scales poorly"],
    chosen: "Tailwind CSS with custom design token extensions + cn() utility for conditional classes",
    lessons: ["Design tokens in tailwind.config prevented UI drift across 20+ modules", "cn() utility reduced class name bugs", "Custom plugin for glass effects centralized the Liquid Glass look"],
    alternatives: ["Vanilla Extract with zero-runtime CSS", "Panda CSS for atomic styles", "Emotion with CSS prop"],
    improvements: ["Extract component variants to a shared recipe system", "Add visual regression testing for key components", "Document design token usage in engineering wiki"],
  },
];

export interface PerProjectQuestion {
  projectId: string;
  projectName: string;
  questions: InterviewQuestion[];
}

export interface InterviewQuestion {
  question: string;
  context: string;
  followUps: string[];
  topics: string[];
}

export const PER_PROJECT_QUESTIONS: PerProjectQuestion[] = [
  {
    projectId: "sentinel-ai", projectName: "Sentinel AI",
    questions: [
      { question: "How did you achieve 99.7% detection rate?", context: "Candidate should explain the hybrid ML+rule approach, training data, and feedback loop", followUps: ["How did you measure false positive rate?", "What happens when ML confidence is low?", "How do you handle concept drift?"], topics: ["Machine Learning", "SIEM", "Detection Engineering"] },
      { question: "How does the system handle 10M+ events daily?", context: "Scalability discussion covering Kafka partitioning, Elasticsearch cluster tiering, and parallel processing", followUps: ["What's the bottleneck in the pipeline?", "How do you handle spikes?", "What's the storage retention strategy?"], topics: ["Scalability", "Event Processing", "Infrastructure"] },
      { question: "How do you prevent ML model poisoning?", context: "Security considerations for ML-based security systems", followUps: ["What input validation do you have?", "How do you detect adversarial inputs?", "How often do you retrain?"], topics: ["ML Security", "Adversarial ML", "Security Architecture"] },
    ],
  },
  {
    projectId: "netdefend", projectName: "NetDefend",
    questions: [
      { question: "Why eBPF over traditional packet capture?", context: "Performance vs portability tradeoff discussion", followUps: ["What's the CPU reduction?", "How do you handle kernel version differences?", "What happens if eBPF fails to load?"], topics: ["eBPF", "Network Security", "Performance"] },
      { question: "How does anomaly detection work?", context: "Statistical vs ML-based anomaly detection in network traffic", followUps: ["What baseline do you use?", "How do you handle seasonal patterns?", "What's the false positive rate?"], topics: ["Anomaly Detection", "Network Monitoring", "ML"] },
    ],
  },
  {
    projectId: "phishshield", projectName: "PhishShield",
    questions: [
      { question: "How does the NLP model distinguish phishing from legitimate email?", context: "Technical deep-dive into BERT-based classification architecture", followUps: ["What features does the model use?", "How do you handle encrypted emails?", "How do you detect new phishing techniques?"], topics: ["NLP", "Phishing", "ML"] },
      { question: "How do you prevent adversarial attacks on the model?", context: "Security of the ML pipeline against adversarial inputs", followUps: ["What data augmentation do you use?", "How do you handle base64-encoded content?", "What's the confidence threshold strategy?"], topics: ["Adversarial ML", "Email Security", "Model Security"] },
    ],
  },
  {
    projectId: "k8s-hardener", projectName: "K8s Hardener",
    questions: [
      { question: "How do you automate CIS benchmark auditing?", context: "Technical approach to Kubernetes security automation", followUps: ["How do you handle custom configurations?", "What's the remediation workflow?", "How do you avoid breaking running clusters?"], topics: ["Kubernetes", "CIS Benchmark", "Automation"] },
      { question: "How does OPA integration work?", context: "Policy-as-code for Kubernetes admission control", followUps: ["What policies do you enforce?", "How do you test policies?", "How do you handle policy violations?"], topics: ["OPA", "Policy Engine", "Kubernetes Security"] },
    ],
  },
];

export interface TimelineMilestone {
  year: string;
  label: string;
  items: { date: string; title: string; category: string; detail: string; evidence?: string }[];
}

export const TECHNICAL_TIMELINE: TimelineMilestone[] = [
  {
    year: "2026", label: "Current — Advanced & Building",
    items: [
      { date: "2026-Q3", title: "Recruiter Experience Platform", category: "project", detail: "Built dedicated workspace for recruiters with smart entry, evidence explorer, and interview tools" },
      { date: "2026-Q2", title: "Global Command Center", category: "project", detail: "SOC+NOC+OSINT fusion dashboard with real-time monitoring and AI incident analysis" },
      { date: "2026-Q2", title: "Enterprise Engineering Platform", category: "project", detail: "ADR framework, quality metrics, dependency management, and open-source governance" },
      { date: "2026-Q2", title: "Collaboration Hub", category: "project", detail: "Open-source ecosystem showcase with 8 projects, mentorship resources, and community timeline" },
      { date: "2026-Q2", title: "BSides Austin Speaker", category: "talk", detail: "Presented 'Building AI-Powered SOC Tools with Open Source' to 50+ attendees" },
      { date: "2026-Q1", title: "Cyber OS Desktop Environment", category: "project", detail: "Full browser-based OS with window manager, terminal, file explorer, and AI copilot" },
      { date: "2026-Q1", title: "CX Platform — Cyber Nexus X", category: "project", detail: "Unified mission control with 15-app registry, digital twin, and semantic search" },
      { date: "2026-Q1", title: "Knowledge Wiki & Learning Encyclopedia", category: "project", detail: "43 articles, 27 categories, 11 cheat sheets, MITRE/OWASP integration" },
    ],
  },
  {
    year: "2025", label: "Intermediate — Building & Learning",
    items: [
      { date: "2025-Q4", title: "AI Project Architect & Security Architecture Explorer", category: "project", detail: "Project generation AI and threat modeling platform with STRIDE/attack trees" },
      { date: "2025-Q4", title: "Achievement & Gamification System", category: "project", detail: "30 achievements, 5 missions, 16 passport stamps across portfolio" },
      { date: "2025-Q4", title: "Knowledge Graph", category: "project", detail: "79 nodes, 128 edges, custom SVG force-directed graph with 6 knowledge clusters" },
      { date: "2025-Q3", title: "Cyber Lab & Home Infrastructure", category: "project", detail: "12 VMs, 9 containers, AD domain, cloud resources, and logging pipeline" },
      { date: "2025-Q3", title: "CTF Command Center", category: "project", detail: "34 challenges across 7 platforms with write-ups, attack chains, and analytics" },
      { date: "2025-Q3", title: "Sentinel AI—Enterprise SOC Platform", category: "project", detail: "AI-powered SIEM with ML correlation, 10M+ events/day, 99.7% detection rate" },
      { date: "2025-Q2", title: "OSCP Certification", category: "cert", detail: "Offensive Security Certified Professional — hands-on penetration testing" },
      { date: "2025-Q2", title: "NetDefend & CloudSec Enforcer", category: "project", detail: "eBPF network defense toolkit and multi-cloud security scanner" },
      { date: "2025-Q1", title: "TryHackMe Top 1%", category: "recognition", detail: "Ranked in top 1% of TryHackMe users globally" },
    ],
  },
  {
    year: "2024", label: "Foundation — Learning & Experimenting",
    items: [
      { date: "2024-Q4", title: "SOC Dashboard & Career Analytics", category: "project", detail: "Live SOC metrics dashboard and career analytics platform" },
      { date: "2024-Q3", title: "PhishShield & Threat Hunter", category: "project", detail: "NLP phishing detection toolkit and Sigma rule-based threat hunting framework" },
      { date: "2024-Q3", title: "Forensic Analyzer", category: "project", detail: "Digital forensics tool for memory dump and disk image analysis" },
      { date: "2024-Q2", title: "K8s Hardener CNCF Sandbox", category: "recognition", detail: "Project accepted into CNCF Sandbox program for Kubernetes security" },
      { date: "2024-Q2", title: "RedOps & Community IR Drills", category: "project", detail: "Adversary simulation toolkit and volunteer red team for community exercises" },
      { date: "2024-Q1", title: "Initial Portfolio Launch", category: "project", detail: "First version of Cyber Nexus portfolio with core modules" },
    ],
  },
];

export interface DemoLink {
  id: string;
  label: string;
  description: string;
  path: string;
  category: string;
  icon: string;
}

export const DEMO_LINKS: DemoLink[] = [
  { id: "demo-1", label: "SOC Dashboard", description: "Live security monitoring metrics", path: "/dashboard", category: "security", icon: "IconDashboard" },
  { id: "demo-2", label: "Command Center", description: "SOC + NOC + OSINT fusion", path: "/command-center", category: "security", icon: "IconShieldExclamation" },
  { id: "demo-3", label: "Knowledge Graph", description: "Interactive skill and project connections", path: "/knowledge-graph", category: "data", icon: "IconNetwork" },
  { id: "demo-4", label: "Cyber OS Desktop", description: "Browser-based desktop environment", path: "/cyber-os", category: "ui", icon: "IconLayoutGrid" },
  { id: "demo-5", label: "Architecture Studio", description: "Threat modeling and security architecture", path: "/security-architect", category: "security", icon: "IconShieldCheck" },
  { id: "demo-6", label: "Terminal", description: "Interactive command interface", path: "/terminal", category: "tools", icon: "IconTerminal2" },
  { id: "demo-7", label: "Career Dashboard", description: "Analytics and career metrics", path: "/career-analytics", category: "career", icon: "IconChartBar" },
  { id: "demo-8", label: "AI Twin", description: "AI-powered digital twin", path: "/cyber-persona", category: "ai", icon: "IconRobot" },
  { id: "demo-9", label: "CTF Range", description: "CTF challenge management", path: "/ctf-command-center", category: "security", icon: "IconFlag" },
  { id: "demo-10", label: "Cyber Lab", description: "Home lab infrastructure", path: "/cyber-lab", category: "infra", icon: "IconServer" },
  { id: "demo-11", label: "Wiki", description: "Cybersecurity encyclopedia", path: "/wiki", category: "learning", icon: "IconBooks" },
  { id: "demo-12", label: "Engineering Platform", description: "Quality metrics and ADR tracking", path: "/engineering", category: "dev", icon: "IconCode" },
];

export interface AnalyticsMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
}

export const ANALYTICS_METRICS: AnalyticsMetric[] = [
  { label: "Most Viewed Project", value: "Sentinel AI", change: "42% of views", trend: "up" },
  { label: "Avg Session Duration", value: "8m 32s", change: "+15% this month", trend: "up" },
  { label: "Top Search Query", value: "SOC Dashboard", change: "23 searches", trend: "stable" },
  { label: "Recruiter Mode Usage", value: "31%", change: "+8% this quarter", trend: "up" },
  { label: "Most Engaged Module", value: "Command Center", change: "4.2 avg visits/user", trend: "up" },
  { label: "Project Detail Views", value: "1,247", change: "+22% this quarter", trend: "up" },
  { label: "Active Pages", value: "35", change: "static", trend: "stable" },
  { label: "Return Visitor Rate", value: "44%", change: "+5% this month", trend: "up" },
];

export interface RecruiterPrompt {
  question: string;
  answer: string;
}

export const RECRUITER_PROMPTS: RecruiterPrompt[] = [
  { question: "What are this candidate's strongest projects?", answer: "**Sentinel AI** is the flagship — an enterprise SOC platform with ML-based correlation, 10M+ events/day throughput, and 99.7% detection rate (evidence: `/projects/sentinel-ai`). **NetDefend** demonstrates deep systems work with eBPF-based packet inspection. **CloudSec Enforcer** shows multi-cloud security expertise across AWS, Azure, and GCP." },
  { question: "Show projects using Docker.", answer: "Several projects use Docker extensively: **Sentinel AI** (Docker Compose deployment with Kafka, Elasticsearch, ML services), **NetDefend** (containerized network sensors), **PhishShield** (Celery workers in containers), and **Threat Hunter** (Jupyter notebooks). Detailed in the **Cyber Lab** container section with 9 container definitions." },
  { question: "Explain the SOC dashboard.", answer: "The **Command Center** (route: `/command-center`) is a SOC+NOC+OSINT fusion dashboard with 11 panels: real-time global status bar with 12 indicators, 8-card metrics grid, SOC alert panel with MITRE ATT&CK mapping, NOC infrastructure metrics, OSINT feed dashboard, interactive infrastructure map, AI security analyst, incident queue with expandable timelines, mission timeline, command palette, and live terminal." },
  { question: "Find Python work.", answer: "Python is the primary language across 6 projects. **Sentinel AI** uses TensorFlow + FastAPI for ML correlation. **PhishShield** uses PyTorch + Celery for NLP. **Threat Hunter** implements Sigma rule parsing. **Forensic Analyzer** uses Volatility + Plaso. Each has public GitHub repositories with Python code. Evidence chains in the **Evidence Explorer** link each skill to specific projects." },
  { question: "Show cloud security experience.", answer: "Cloud security is demonstrated through: **CloudSec Enforcer** (multi-cloud CIS scanning for AWS/Azure/GCP), **K8s Hardener** (Kubernetes security with OPA policies), and **Security Architecture Explorer** (cloud threat models with STRIDE). The **Cyber Lab** also includes AWS cloud resources. Each project links to architecture diagrams and design decisions." },
  { question: "Summarize the learning journey.", answer: "Started in 2024 with foundational projects (SOC Dashboard, PhishShield, Threat Hunter). Earned **OSCP** in 2025. Built **Sentinel AI** and **NetDefend** to enterprise scale. Contributed to **CNCF Sandbox** project. Spoke at **BSides Austin** in 2026. Currently building the **Recruiter Experience Platform** and exploring advanced AD attacks and cloud security. Full timeline in the **Technical Timeline** section." },
  { question: "Recommend projects relevant to penetration testing.", answer: "**RedOps** (adversary simulation with phishing templates and C2 infrastructure), **CTF Command Center** (34 challenges across 7 platforms), and **Cyber Lab** (AD attack lab with 45 users, 12 groups, 6 OUs). These demonstrate hands-on offensive security skills validated by **OSCP** certification and **TryHackMe Top 1%** ranking." },
  { question: "What architecture decisions has this candidate made?", answer: "Key decisions documented in the **Decision Journal**: hybrid ML+rule correlation (99.7% detection), eBPF vs libpcap (73% CPU reduction), monorepo with Turborepo (65% faster CI), Zustand per-module stores (35% fewer re-renders), and Tailwind with design tokens (consistent UI across 20+ modules). Each includes tradeoffs, alternatives, and lessons learned." },
];

export interface FeedbackCategory {
  id: string;
  label: string;
  description: string;
  placeholder: string;
}
