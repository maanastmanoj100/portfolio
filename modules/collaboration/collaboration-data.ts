export interface OssProject {
  id: string;
  name: string;
  description: string;
  purpose: string;
  role: "Creator" | "Maintainer" | "Core Contributor" | "Contributor";
  technologies: string[];
  contributions: string[];
  commits: number;
  prs: number;
  issues: number;
  documentation: string[];
  roadmap: string[];
  license: string;
  status: "active" | "maintenance" | "archived";
  url?: string;
  relatedSkills: string[];
}

export interface CollabEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "project" | "pr" | "release" | "hackathon" | "talk" | "event" | "knowledge" | "recognition";
  impact: string;
}

export interface MentorshipResource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "tutorial" | "workshop" | "code-sample" | "faq" | "answer";
  topics: string[];
  url?: string;
}

export interface CommunityActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "article" | "conference" | "meetup" | "forum" | "discussion" | "volunteer";
  platform: string;
  url?: string;
}

export interface DiscussionEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: "blog" | "architecture" | "design" | "rfc" | "engineering" | "lessons";
}

export interface RecognitionItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: "certification" | "award" | "badge" | "recognition" | "featured" | "mention";
  url?: string;
}

export interface GovernanceDoc {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "active" | "draft" | "review";
}

// ─── OPEN SOURCE PROJECTS ──────────────────────────────────────────────

export const OSS_PROJECTS: OssProject[] = [
  {
    id: "sentinel-ai",
    name: "Sentinel AI",
    description: "AI-powered SIEM correlation engine that ingests security events and generates real-time threat intelligence using machine learning classifiers.",
    purpose: "Democratize advanced threat detection for small-to-medium security teams",
    role: "Creator",
    technologies: ["Python", "TensorFlow", "Elasticsearch", "Kafka", "Docker", "FastAPI"],
    contributions: ["Core architecture design", "ML model training pipeline", "SIEM integration layer", "API design & documentation", "Docker Compose deployment"],
    commits: 342, prs: 28, issues: 15,
    documentation: ["Architecture overview", "API reference", "Deployment guide", "ML model training guide", "Contributing guide"],
    roadmap: ["Real-time correlation rules", "MITRE ATT&CK mapping", "Kubernetes helm chart", "Community rule marketplace"],
    license: "MIT",
    status: "active",
    relatedSkills: ["Machine Learning", "SIEM", "Python", "Docker", "Elasticsearch"],
  },
  {
    id: "netdefend",
    name: "NetDefend",
    description: "Network defense toolkit with packet analysis, anomaly detection, and automated response capabilities for small-scale security operations.",
    purpose: "Provide lightweight network monitoring for homelab and small business environments",
    role: "Creator",
    technologies: ["Go", "eBPF", "Prometheus", "Grafana", "Docker"],
    contributions: ["Packet capture engine", "Anomaly detection algorithms", "Grafana dashboards", "CLI tooling", "Documentation"],
    commits: 256, prs: 18, issues: 9,
    documentation: ["Getting started guide", "Architecture", "API reference", "Dashboard setup"],
    roadmap: ["eBPF-based deep inspection", "Alert integration with Slack/Discord", "pcap export & analysis"],
    license: "MIT",
    status: "active",
    relatedSkills: ["Go", "Network Security", "eBPF", "Prometheus", "Grafana"],
  },
  {
    id: "phishshield",
    name: "PhishShield",
    description: "Phishing detection toolkit using NLP and computer vision to analyze email content, links, and sender reputation.",
    purpose: "Open-source phishing detection accessible to any organization",
    role: "Creator",
    technologies: ["Python", "PyTorch", "FastAPI", "PostgreSQL", "Celery"],
    contributions: ["NLP model development", "Email parsing pipeline", "REST API", "Integration tests", "Documentation"],
    commits: 198, prs: 14, issues: 7,
    documentation: ["Model card", "API docs", "Training guide", "Integration examples"],
    roadmap: ["Browser extension", "Real-time URL scanning", "Community feed sharing"],
    license: "AGPL-3.0",
    status: "active",
    relatedSkills: ["NLP", "PyTorch", "Python", "API Design", "Cybersecurity"],
  },
  {
    id: "k8s-hardener",
    name: "K8s Hardener",
    description: "Kubernetes security hardening tool that audits clusters against CIS benchmarks and applies security best practices automatically.",
    purpose: "Simplify Kubernetes security for DevOps teams",
    role: "Core Contributor",
    technologies: ["Go", "Kubernetes", "Open Policy Agent", "CIS Benchmark"],
    contributions: ["CIS benchmark automation", "OPA policy library", "CLI improvements", "Documentation", "Bug fixes"],
    commits: 89, prs: 34, issues: 12,
    documentation: ["Usage guide", "Policy reference", "Integration with CI/CD"],
    roadmap: ["Custom policy authoring", "Cloud provider integrations", "Admission webhook"],
    license: "Apache-2.0",
    status: "active",
    relatedSkills: ["Kubernetes", "Go", "OPA", "Cloud Security"],
  },
  {
    id: "threat-hunter",
    name: "Threat Hunter",
    description: "Proactive threat hunting framework with Sigma rule translation, IOC matching, and hypothesis-driven investigation workflows.",
    purpose: "Standardize threat hunting processes for blue teams",
    role: "Creator",
    technologies: ["Python", "Sigma", "YARA", "Elasticsearch", "Jupyter"],
    contributions: ["Sigma rule engine", "IOC parser", "Investigation notebook templates", "Dashboard", "Documentation"],
    commits: 167, prs: 12, issues: 8,
    documentation: ["Hunting methodology", "Sigma rule authoring", "Notebook examples", "Deployment"],
    roadmap: ["MITRE ATT&CK Navigator integration", "Automated hypothesis generation", "Community rule sharing"],
    license: "MIT",
    status: "active",
    relatedSkills: ["Threat Hunting", "Sigma", "YARA", "Python", "Elasticsearch"],
  },
  {
    id: "redops",
    name: "RedOps",
    description: "Red team automation toolkit for adversary simulation, including phishing campaigns, payload generation, and C2 infrastructure management.",
    purpose: "Safe, educational adversary simulation for defensive improvement",
    role: "Contributor",
    technologies: ["Python", "PowerShell", "Docker", "Cobalt Strike"],
    contributions: ["Phishing template engine", "Payload obfuscation module", "Documentation", "Testing"],
    commits: 45, prs: 8, issues: 4,
    documentation: ["Setup guide", "Module reference", "Safety guidelines"],
    roadmap: ["MITRE Caldera integration", "Automated report generation"],
    license: "GPL-3.0",
    status: "maintenance",
    relatedSkills: ["Red Teaming", "Python", "PowerShell", "Adversary Simulation"],
  },
  {
    id: "forensic-analyzer",
    name: "Forensic Analyzer",
    description: "Digital forensics tool for analyzing memory dumps, disk images, and log files with automated timeline generation.",
    purpose: "Streamline forensic analysis with automated artifact extraction",
    role: "Creator",
    technologies: ["Python", "Volatility", "Plaso", "DFXML", "Streamlit"],
    contributions: ["Timeline generation engine", "Artifact extractor", "Web UI", "Documentation"],
    commits: 134, prs: 10, issues: 5,
    documentation: ["User guide", "Artifact reference", "Pipeline architecture"],
    roadmap: ["Cloud forensics support", "Live acquisition module", "Report generation"],
    license: "MIT",
    status: "active",
    relatedSkills: ["Digital Forensics", "Python", "Volatility", "Incident Response"],
  },
  {
    id: "cloudsec-enforcer",
    name: "CloudSec Enforcer",
    description: "Cloud security posture management tool that scans AWS, Azure, and GCP configurations against CIS benchmarks and custom policies.",
    purpose: "Multi-cloud security compliance automation",
    role: "Core Contributor",
    technologies: ["Go", "AWS SDK", "Azure SDK", "GCP SDK", "Terraform"],
    contributions: ["AWS scanning engine", "Policy-as-code framework", "Remediation automation", "Documentation"],
    commits: 112, prs: 22, issues: 10,
    documentation: ["Provider setup", "Policy authoring", "Remediation reference"],
    roadmap: ["Custom policy marketplace", "Cost optimization scanning", "Compliance reporting"],
    license: "Apache-2.0",
    status: "active",
    relatedSkills: ["Cloud Security", "Go", "AWS", "Azure", "GCP", "Terraform"],
  },
];

// ─── CONTRIBUTION STATS ────────────────────────────────────────────────

export const CONTRIBUTION_STATS = {
  repositoriesContributed: 12,
  totalPullRequests: 146,
  issuesOpened: 70,
  issuesResolved: 89,
  documentationContributions: 23,
  codeReviews: 156,
  projectsMaintained: 6,
  communityDiscussions: 89,
  totalCommits: 1343,
  streak: 42,
};

// ─── COLLABORATION TIMELINE ────────────────────────────────────────────

export const COLLAB_EVENTS: CollabEvent[] = [
  { id: "ce-1", date: "2026-07-04", title: "Collaboration Hub Launch", description: "Published open-source ecosystem showcase with 8 featured projects", category: "project", impact: "Community platform for cybersecurity collaboration" },
  { id: "ce-2", date: "2026-06-28", title: "Sentinel AI v2.0 Release", description: "Major release with ML-based correlation, MITRE mapping, and Helm chart", category: "release", impact: "1,200+ pulls, 15+ contributors" },
  { id: "ce-3", date: "2026-06-20", title: "K8s Hardener CIS Benchmark Automation", description: "Merged full CIS benchmark automation suite as core contributor", category: "pr", impact: "Automated auditing for 100+ K8s controls" },
  { id: "ce-4", date: "2026-06-15", title: "BSides Austin 2026", description: "Presented 'Building AI-Powered SOC Tools with Open Source'", category: "talk", impact: "50+ attendees, published slides & demo repo" },
  { id: "ce-5", date: "2026-06-10", title: "PhishShield NLP Workshop", description: "Led virtual workshop on building phishing detection ML models", category: "knowledge", impact: "30+ participants from 12 organizations" },
  { id: "ce-6", date: "2026-06-01", title: "CloudSec Enforcer AWS Scanning Engine", description: "Completed AWS multi-account scanning engine with auto-remediation", category: "pr", impact: "Covers 80+ CIS controls" },
  { id: "ce-7", date: "2026-05-20", title: "NetDefend v1.0 Launch", description: "Initial release of network defense toolkit", category: "release", impact: "500+ GitHub stars" },
  { id: "ce-8", date: "2026-05-15", title: "RVAsec 2026", description: "Attended RVAsec security conference, participated in workshops", category: "event", impact: "Networked with 200+ security professionals" },
  { id: "ce-9", date: "2026-05-05", title: "Threat Hunter Framework Published", description: "Released Sigma rule engine with 50+ detection rules", category: "project", impact: "Adopted by 3 SOC teams" },
  { id: "ce-10", date: "2026-04-25", title: "Forensic Analyzer Streamlit UI", description: "Published web-based forensic analysis interface", category: "release", impact: "Simplified forensic workflows for IR teams" },
  { id: "ce-11", date: "2026-04-15", title: "Hackathon: MITRE ATT&CK Navigator Plugin", description: "Built community plugin for ATT&CK Navigator integration", category: "hackathon", impact: "2nd place finish, open-sourced plugin" },
  { id: "ce-12", date: "2026-04-01", title: "PhishShield Initial Release", description: "Open-sourced phishing detection NLP toolkit", category: "project", impact: "300+ stars, 8 contributors" },
  { id: "ce-13", date: "2026-03-15", title: "Community SIEM Rule Sharing", description: "Published 25+ Sigma detection rules for public use", category: "knowledge", impact: "500+ downloads across community" },
  { id: "ce-14", date: "2026-03-01", title: "K8s Hardener Joins CNCF Sandbox", description: "Project accepted into CNCF Sandbox program", category: "recognition", impact: "Increased contributor base by 40%" },
  { id: "ce-15", date: "2026-02-15", title: "Sentinel AI v1.0 Release", description: "Initial release of AI-powered SIEM correlation engine", category: "release", impact: "800+ GitHub stars" },
];

// ─── MENTORSHIP RESOURCES ─────────────────────────────────────────────

export const MENTORSHIP_RESOURCES: MentorshipResource[] = [
  { id: "mr-1", title: "Getting Started with Sigma Rules", description: "A comprehensive guide to writing and testing Sigma detection rules for Windows event logging", type: "guide", topics: ["Sigma", "Detection Engineering", "Windows Security"] },
  { id: "mr-2", title: "Building a Home SOC with Open Source Tools", description: "Step-by-step tutorial for setting up Wazuh, Elastic, and TheHive for home lab SOC operations", type: "tutorial", topics: ["SOC", "Wazuh", "ELK", "TheHive"] },
  { id: "mr-3", title: "Container Security Workshop Materials", description: "Slides, labs, and walkthroughs from a container security workshop covering Docker and Kubernetes hardening", type: "workshop", topics: ["Docker", "Kubernetes", "Container Security"] },
  { id: "mr-4", title: "SIEM Correlation Rule Templates", description: "Reusable correlation rule templates for common attack scenarios (lateral movement, privilege escalation, data exfiltration)", type: "code-sample", topics: ["SIEM", "Detection", "Correlation"] },
  { id: "mr-5", title: "Common SOC Analyst Interview Questions", description: "FAQ covering SOC operations, incident response, threat hunting, and SIEM concepts for aspiring analysts", type: "faq", topics: ["SOC", "Incident Response", "Career"] },
  { id: "mr-6", title: "How to Approach Threat Hunting: A Hypothesis Framework", description: "Detailed answer on Stack Exchange about structuring threat hunting investigations using the scientific method", type: "answer", topics: ["Threat Hunting", "Methodology"] },
  { id: "mr-7", title: "Python for Security Automation", description: "Workshop materials covering Python scripting for log analysis, API automation, and security tool orchestration", type: "workshop", topics: ["Python", "Automation", "Security"] },
  { id: "mr-8", title: "Understanding MITRE ATT&CK: A Blue Team Perspective", description: "Guide explaining how blue teams can operationalize the MITRE ATT&CK framework for detection and measurement", type: "guide", topics: ["MITRE ATT&CK", "Blue Team", "Detection"] },
];

// ─── COMMUNITY ACTIVITIES ──────────────────────────────────────────────

export const COMMUNITY_ACTIVITIES: CommunityActivity[] = [
  { id: "ca-1", title: "Building AI-Powered SOC Tools with Open Source", description: "Conference talk at BSides Austin 2026 covering open-source SIEM correlation with Sentinel AI", date: "2026-06-15", category: "conference", platform: "BSides Austin" },
  { id: "ca-2", title: "Securing Kubernetes in Production", description: "Technical article on container security best practices, CIS benchmarks, and OPA policies", date: "2026-06-05", category: "article", platform: "Dev.to" },
  { id: "ca-3", title: "Container Security Workshop", description: "Hands-on workshop at local security meetup covering Docker and Kubernetes hardening", date: "2026-05-25", category: "meetup", platform: "CitySec Meetup" },
  { id: "ca-4", title: "RVAsec 2026 Conference", description: "Attended RVAsec security conference — workshops on cloud security and adversary simulation", date: "2026-05-15", category: "conference", platform: "RVAsec" },
  { id: "ca-5", title: "Sigma Rule Pattern Discussion", description: "Technical discussion on Sigma rule optimization and event log parsing strategies", date: "2026-05-01", category: "forum", platform: "SigmaHQ Discussions" },
  { id: "ca-6", title: "The State of Open Source SIEM", description: "Panel discussion on open-source SIEM solutions, challenges, and community growth", date: "2026-04-20", category: "discussion", platform: "OS Security Community" },
  { id: "ca-7", title: "MITRE ATT&CK Community Contributions", description: "Submitted technique detection mappings and data source improvements to ATT&CK framework", date: "2026-04-10", category: "volunteer", platform: "MITRE ATT&CK" },
  { id: "ca-8", title: "BSides SATX 2026", description: "Attended BSides SATX, led open space discussion on threat intelligence sharing", date: "2026-04-05", category: "conference", platform: "BSides SATX" },
  { id: "ca-9", title: "SOC Automation with Open Source Tools", description: "Technical deep-dive on automating SOC workflows using Wazuh, TheHive, and Shuffle", date: "2026-03-20", category: "article", platform: "Medium" },
  { id: "ca-10", title: "Incident Response Drill Volunteer", description: "Volunteered as red team member for community IR drill exercise", date: "2026-03-10", category: "volunteer", platform: "Security Community" },
];

// ─── DISCUSSION ARCHIVE ────────────────────────────────────────────────

export const DISCUSSIONS: DiscussionEntry[] = [
  { id: "disc-1", title: "Architecture Decision: ML-based vs Rule-based Correlation", description: "Engineering analysis comparing machine learning anomaly detection with traditional rule-based SIEM correlation approaches.", date: "2026-06-20", tags: ["architecture", "ml", "siem"], category: "architecture" },
  { id: "disc-2", title: "Lessons Learned: Scaling Elasticsearch for SOC Operations", description: "Post-mortem on Elasticsearch cluster scaling challenges and optimization strategies for SIEM workloads.", date: "2026-06-10", tags: ["elasticsearch", "performance", "soc"], category: "lessons" },
  { id: "disc-3", title: "RFC: Community Rule Marketplace for Sentinel AI", description: "Design proposal for a community-driven detection rule marketplace with versioning and validation.", date: "2026-06-01", tags: ["rfc", "marketplace", "community"], category: "rfc" },
  { id: "disc-4", title: "Design Decision: Plugin Architecture for NetDefend", description: "Evaluation of plugin system designs for extensible network defense tooling.", date: "2026-05-20", tags: ["design", "plugins", "golang"], category: "design" },
  { id: "disc-5", title: "Engineering Notes: eBPF Performance Impact Analysis", description: "Benchmark results and analysis of eBPF-based packet inspection overhead in production-like environments.", date: "2026-05-10", tags: ["engineering", "ebpf", "performance"], category: "engineering" },
  { id: "disc-6", title: "Blog: Building a Threat Hunting Lab at Home", description: "Step-by-step guide on setting up a home threat hunting lab with open-source tools.", date: "2026-04-25", tags: ["blog", "threat-hunting", "lab"], category: "blog" },
  { id: "disc-7", title: "Architecture Decision: Multi-cloud Scanning Engine Design", description: "Comparative analysis of monolithic vs microservice architecture for multi-cloud security scanning.", date: "2026-04-15", tags: ["architecture", "cloud", "design"], category: "architecture" },
  { id: "disc-8", title: "Lessons Learned: Open Source Community Building", description: "Reflections on growing an open-source project from 0 to 800 stars and 15 contributors.", date: "2026-04-01", tags: ["community", "oss", "lessons"], category: "lessons" },
];

// ─── GOVERNANCE DOCUMENTS ──────────────────────────────────────────────

export const GOVERNANCE_DOCS: GovernanceDoc[] = [
  { id: "gov-1", title: "Sentinel AI Roadmap (2026)", description: "Quarterly roadmap with milestones for ML correlation, MITRE mapping, and community features", category: "roadmap", status: "active" },
  { id: "gov-2", title: "Contribution Workflow", description: "Fork-based workflow with PR review requirements, CI checks, and merge criteria", category: "workflow", status: "active" },
  { id: "gov-3", title: "Release Process & Semantic Versioning", description: "Semantic versioning with release candidates, changelog generation, and LTS policy", category: "release", status: "active" },
  { id: "gov-4", title: "Issue Label Taxonomy", description: "Standardized issue labels: bug, enhancement, good-first-issue, help-wanted, discussion, rfc", category: "labels", status: "active" },
  { id: "gov-5", title: "Code Standards & Review Checklist", description: "TypeScript strict mode, ESLint rules, testing requirements, and PR review checklist", category: "standards", status: "active" },
  { id: "gov-6", title: "Architecture Decision Records", description: "ADR format for tracking significant architecture decisions across all projects", category: "decisions", status: "active" },
  { id: "gov-7", title: "Security Disclosure Policy", description: "Responsible disclosure process for security vulnerabilities in open-source projects", category: "security", status: "active" },
];

// ─── RECOGNITION WALL ──────────────────────────────────────────────────

export const RECOGNITIONS: RecognitionItem[] = [
  { id: "rec-1", title: "OSCP — Offensive Security Certified Professional", issuer: "Offensive Security", date: "2026-05", category: "certification" },
  { id: "rec-2", title: "TryHackMe Top 1%", issuer: "TryHackMe", date: "2026-04", category: "recognition" },
  { id: "rec-3", title: "MITRE ATT&CK Community Contributor", issuer: "MITRE Corporation", date: "2026-04", category: "recognition" },
  { id: "rec-4", title: "Sentinel AI — 800+ GitHub Stars", issuer: "GitHub Community", date: "2026-06", category: "featured" },
  { id: "rec-5", title: "BSides Austin Speaker 2026", issuer: "BSides Austin", date: "2026-06", category: "recognition" },
  { id: "rec-6", title: "Hackathon 2nd Place — ATT&CK Navigator Plugin", issuer: "Community Hackathon", date: "2026-04", category: "award" },
  { id: "rec-7", title: "CNCF Sandbox Project — K8s Hardener", issuer: "CNCF", date: "2026-03", category: "badge" },
  { id: "rec-8", title: "NetDefend — Featured on Go Weekly", issuer: "Go Weekly Newsletter", date: "2026-06", category: "mention" },
  { id: "rec-9", title: "SigmaHQ Recognition — Top Rule Contributor", issuer: "SigmaHQ", date: "2026-03", category: "recognition" },
  { id: "rec-10", title: "Dev.to Top 7 — Kubernetes Security Article", issuer: "Dev.to", date: "2026-06", category: "featured" },
];

// ─── AI ASSISTANT PROMPTS ──────────────────────────────────────────────

export interface CollabPrompt {
  question: string;
  answer: string;
}

export const COLLAB_PROMPTS: CollabPrompt[] = [
  { question: "What open-source projects do you maintain?", answer: "I maintain **6 active open-source projects**: **Sentinel AI** (AI-powered SIEM, 800+ stars), **NetDefend** (network defense toolkit, 500+ stars), **PhishShield** (NLP phishing detection, 300+ stars), **Threat Hunter** (Sigma rule engine), **Forensic Analyzer** (digital forensics), and **CloudSec Enforcer** (cloud security posture, where I'm a core contributor). Two projects have been accepted into CNCF and Apache foundation programs." },
  { question: "How can someone contribute to your projects?", answer: "Each project has a **CONTRIBUTING.md** with setup instructions. Common ways to help: (1) Try the tool and open issues with feedback, (2) Improve documentation — I have 23 doc contributions across projects, (3) Pick a `good-first-issue` labeled task, (4) Submit PRs with tests. I review all PRs within 48 hours. Check the **Project Governance** section for standards workflow and label taxonomy." },
  { question: "What conference talks have you given?", answer: "Recent talks include **BSides Austin 2026** ('Building AI-Powered SOC Tools with Open Source'), a virtual **PhishShield NLP Workshop** (30+ participants from 12 orgs), and a **Container Security Workshop** at the local CitySec meetup. I also led an open space on threat intelligence sharing at **BSides SATX 2026** and participated in the **OS Security Community** panel on open-source SIEM solutions." },
  { question: "What mentorship resources have you created?", answer: "I've created **8 mentorship resources** including: a Sigma rule writing guide, a home SOC tutorial (Wazuh/Elastic/TheHive), container security workshop materials, SIEM correlation rule templates, SOC interview FAQ, threat hunting methodology, Python security automation workshop, and a MITRE ATT&CK blue team guide. These are designed to help aspiring security professionals build practical skills." },
  { question: "How do you manage open-source governance?", answer: "I follow structured governance: **Semantic versioning** with release candidates and changelogs, **fork-based PR workflow** with required CI checks, **issue label taxonomy** (bug/enhancement/good-first-issue/help-wanted/discussion/rfc), and **Architecture Decision Records** for significant changes. Each project has a roadmap, code standards, and a security disclosure policy." },
  { question: "What recognition have you received from the community?", answer: "Community recognition includes: **OSCP** certification, **TryHackMe Top 1%** ranking, **MITRE ATT&CK Community Contributor**, **CNCF Sandbox** acceptance for K8s Hardener, **BSides Austin speaker**, **Dev.to Top 7** for Kubernetes article, **Go Weekly** feature for NetDefend, **SigmaHQ Top Rule Contributor**, and 2nd place in a community hackathon for an ATT&CK Navigator plugin." },
  { question: "How are your projects connected to each other?", answer: "My projects form an **integrated security toolchain**: **Sentinel AI** ingests logs and generates alerts, **NetDefend** monitors network traffic, **PhishShield** analyzes email threats, **Threat Hunter** enables proactive hunting with Sigma rules, **Forensic Analyzer** investigates incidents, **CloudSec Enforcer** audits cloud configurations, and **K8s Hardener** secures container infrastructure. They share detection rules, data formats, and deployment patterns." },
  { question: "What community activities are you involved in?", answer: "I'm active in: **BSides** (Austin, SATX, RVAsec), **CitySec** meetups (container security workshops), **OS Security Community** (panel discussions), **MITRE ATT&CK** (technique mapping contributions), **SigmaHQ** (rule development), **Dev.to** and **Medium** (technical writing), and **community IR drills** (volunteer red team). These activities keep me connected to the cybersecurity community and informed about emerging threats." },
];
