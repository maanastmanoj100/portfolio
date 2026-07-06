import { projects } from "@/data/projects";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
  info: "#6366f1",
};

export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low", "info"];

export interface CVEItem {
  id: string;
  cveId: string;
  severity: Severity;
  cvss: number;
  title: string;
  description: string;
  published: string;
  affected: string[];
  vendor: string;
  exploitStatus: "confirmed" | "reported" | "theoretical" | "none";
  mitigationSummary: string;
  references: string[];
  mitreTechniques: string[];
  relatedProjects?: string[];
}

export interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  motivation: "financial" | "espionage" | "hacktivism" | "destruction" | "multiple";
  type: "apt" | "cybercrime" | "hacktivist" | "insider";
  description: string;
  commonTechniques: string[];
  targetIndustries: string[];
  geographicScope: string[];
  knownCampaigns: string[];
  mitreIds: string[];
  firstSeen: string;
  references: string[];
}

export interface MalwareFamily {
  id: string;
  name: string;
  category: "ransomware" | "trojan" | "worm" | "rootkit" | "loader" | "backdoor" | "stealer" | "wiper";
  description: string;
  behavior: string;
  persistence: string;
  propagation: string[];
  knownTargets: string[];
  detectionGuidance: string;
  mitigation: string;
  mitreTechniques: string[];
  associatedActors: string[];
  references: string[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  firstSeen: string;
  lastSeen: string;
  status: "active" | "declining" | "concluded";
  actors: string[];
  malware: string[];
  cvEs: string[];
  mitreTechniques: string[];
  timeline: { date: string; event: string }[];
  targets: string[];
}

export interface SecurityNews {
  id: string;
  headline: string;
  summary: string;
  date: string;
  category: "advisory" | "breach" | "research" | "update" | "industry";
  source: string;
  url: string;
  tags: string[];
}

export interface IOCExample {
  type: "ip" | "domain" | "hash" | "email" | "registry" | "process";
  value: string;
  context: string;
  severity: Severity;
}

export interface MitreTechniqueInfo {
  id: string;
  name: string;
  tactic: string;
  description: string;
  platforms: string[];
  detection: string;
  mitigation: string;
  relatedProjects: string[];
}

export interface IntelSummary {
  totalCVEs: number;
  criticalCVEs: number;
  highCVEs: number;
  activeCampaigns: number;
  trackedActors: number;
  malwareFamilies: number;
  lastUpdated: string;
  newsCount: number;
}

export const INTEL_SUMMARY: IntelSummary = {
  totalCVEs: 12,
  criticalCVEs: 3,
  highCVEs: 5,
  activeCampaigns: 2,
  trackedActors: 6,
  malwareFamilies: 6,
  lastUpdated: "2026-07-04 14:00 UTC",
  newsCount: 8,
};

export const CVE_DATABASE: CVEItem[] = [
  { id: "cve-1", cveId: "CVE-2026-34567", severity: "critical", cvss: 9.8, title: "Remote Code Execution in Kubernetes API Server", description: "A critical vulnerability in the Kubernetes API server allows unauthenticated remote code execution via specially crafted API requests. The flaw exists in the authentication token validation mechanism, potentially allowing complete cluster takeover.", published: "2026-06-28", affected: ["Kubernetes >= 1.28", "Kubernetes <= 1.30.2"], vendor: "CNCF", exploitStatus: "confirmed", mitigationSummary: "Upgrade to Kubernetes 1.30.3+ immediately. Restrict API server network access and enable audit logging.", references: ["https://github.com/kubernetes/kubernetes/issues/123456"], mitreTechniques: ["T1190", "T1078"], relatedProjects: ["k8s-hardener", "sentinel-ai"] },
  { id: "cve-2", cveId: "CVE-2026-33456", severity: "critical", cvss: 9.4, title: "Critical Heap Overflow in OpenSSL 3.x", description: "A heap buffer overflow vulnerability in OpenSSL 3.x TLS handshake processing allows remote attackers to execute arbitrary code. The flaw is triggered during certificate chain validation when parsing malformed ASN.1 data.", published: "2026-06-15", affected: ["OpenSSL 3.0.0 - 3.2.1"], vendor: "OpenSSL Foundation", exploitStatus: "confirmed", mitigationSummary: "Patch to OpenSSL 3.2.2+. Disable TLS 1.3 if unable to patch immediately.", references: ["https://openssl.org/news/secadv/20260615.txt"], mitreTechniques: ["T1573", "T1190"] },
  { id: "cve-3", cveId: "CVE-2026-31234", severity: "critical", cvss: 9.0, title: "Active Directory Domain Services Elevation of Privilege", description: "A critical elevation of privilege vulnerability exists in Active Directory Domain Services when a specially crafted authentication request is processed, allowing domain user to domain admin escalation.", published: "2026-05-20", affected: ["Windows Server 2019", "Windows Server 2022", "Windows Server 2025"], vendor: "Microsoft", exploitStatus: "confirmed", mitigationSummary: "Apply Microsoft June 2026 security update. Review AD security configuration and monitor for unusual authentication patterns.", references: ["https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-31234"], mitreTechniques: ["T1068", "T1134"], relatedProjects: ["redops"] },
  { id: "cve-4", cveId: "CVE-2026-28901", severity: "high", cvss: 8.8, title: "Stored XSS in Elasticsearch Kibana Dashboard", description: "A stored cross-site scripting vulnerability in Kibana dashboards allows attackers with dashboard creation privileges to execute arbitrary JavaScript in the context of viewers.", published: "2026-06-10", affected: ["Kibana 8.10 - 8.12.0"], vendor: "Elastic", exploitStatus: "reported", mitigationSummary: "Upgrade to Kibana 8.12.1. Sanitize dashboard inputs and restrict dashboard sharing.", references: ["https://discuss.elastic.co/t/kibana-8-12-1-security-update/345678"], mitreTechniques: ["T1559", "T1189"], relatedProjects: ["sentinel-ai"] },
  { id: "cve-5", cveId: "CVE-2026-27890", severity: "high", cvss: 8.5, title: "AWS IAM Role Chaining Privilege Escalation", description: "A logic flaw in AWS IAM role chaining allows principals with limited role assume permissions to escalate to more privileged roles through a race condition in the trust policy evaluation.", published: "2026-06-05", affected: ["AWS IAM", "AWS STS"], vendor: "Amazon Web Services", exploitStatus: "confirmed", mitigationSummary: "Review and restrict role trust policies. Implement permissions boundaries for all roles.", references: ["https://aws.amazon.com/security/security-bulletins/AWS-2026-005/"], mitreTechniques: ["T1078", "T1525"], relatedProjects: ["cloudsec-enforcer"] },
  { id: "cve-6", cveId: "CVE-2026-26543", severity: "high", cvss: 8.2, title: "Docker Container Escape via OverlayFS", description: "A vulnerability in the OverlayFS filesystem driver allows a process within a container to break out of container isolation and gain root access on the host.", published: "2026-05-25", affected: ["Docker Engine >= 24.0", "containerd >= 1.7"], vendor: "Docker/Moby", exploitStatus: "reported", mitigationSummary: "Update Docker and containerd to latest versions. Use user namespaces and seccomp profiles.", references: ["https://github.com/moby/moby/security/advisories/GHSA-xxxx-yyyy-zzzz"], mitreTechniques: ["T1611"], relatedProjects: ["k8s-hardener"] },
  { id: "cve-7", cveId: "CVE-2026-25123", severity: "high", cvss: 7.8, title: "Python urllib3 HTTP Request Smuggling", description: "A CRLF injection vulnerability in Python urllib3 allows HTTP request smuggling when connecting to malicious or compromised proxy servers.", published: "2026-05-10", affected: ["urllib3 >= 2.0, <= 2.2.1"], vendor: "Python urllib3", exploitStatus: "reported", mitigationSummary: "Upgrade urllib3 to 2.2.2+. Avoid using untrusted proxy servers.", references: ["https://github.com/urllib3/urllib3/security/advisories/GHSA-xxxx-yyyy-zzzz"], mitreTechniques: ["T1190"] },
  { id: "cve-8", cveId: "CVE-2026-24012", severity: "medium", cvss: 6.5, title: "Go net/http Memory Exhaustion via HTTP/2", description: "A memory exhaustion vulnerability in Go's net/http library when handling HTTP/2 CONTINUATION frames allows denial of service.", published: "2026-04-20", affected: ["Go <= 1.22.2"], vendor: "Go Team", exploitStatus: "theoretical", mitigationSummary: "Update to Go 1.22.3+. Limit HTTP/2 connection concurrency at the load balancer.", references: ["https://go.dev/issue/65432"], mitreTechniques: ["T1499"] },
  { id: "cve-9", cveId: "CVE-2026-22987", severity: "medium", cvss: 6.1, title: "GitHub Actions Artifact Poisoning", description: "An insufficient validation of CI/CD artifact signatures in GitHub Actions allows injection of malicious artifacts into build pipelines.", published: "2026-04-15", affected: ["GitHub Actions", "Self-hosted runners"], vendor: "GitHub", exploitStatus: "reported", mitigationSummary: "Enable artifact attestation. Use OIDC-based authentication for deployments.", references: ["https://github.blog/security/changelog/2026-04/artifact-signing-requirement-update/"], mitreTechniques: ["T1574"], relatedProjects: ["cloudsec-enforcer"] },
  { id: "cve-10", cveId: "CVE-2026-21876", severity: "low", cvss: 4.3, title: "Terraform State File Information Disclosure", description: "A misconfiguration in Terraform remote state storage can expose sensitive infrastructure configuration data through improperly scoped backend policies.", published: "2026-03-28", affected: ["Terraform >= 1.5", "Terraform Cloud"], vendor: "HashiCorp", exploitStatus: "theoretical", mitigationSummary: "Enable state file encryption. Restrict state file access with least privilege IAM policies.", references: ["https://discuss.hashicorp.com/t/terraform-state-security-best-practices/65432"], mitreTechniques: ["T1539"], relatedProjects: ["cloudsec-enforcer"] },
  { id: "cve-11", cveId: "CVE-2026-20765", severity: "high", cvss: 8.1, title: "Redis Lua Sandbox Escape", description: "A sandbox escape vulnerability in Redis' embedded Lua scripting engine allows authenticated users to execute arbitrary system commands.", published: "2026-06-22", affected: ["Redis >= 7.0, <= 7.2.4"], vendor: "Redis Ltd", exploitStatus: "confirmed", mitigationSummary: "Upgrade to Redis 7.2.5+. Restrict Lua script execution to trusted users only.", references: ["https://github.com/redis/redis/security/advisories/GHSA-xxxx-yyyy-zzzz"], mitreTechniques: ["T1204", "T1059"] },
  { id: "cve-12", cveId: "CVE-2026-19654", severity: "medium", cvss: 5.5, title: "Wireshark RTPS Dissector Crash", description: "A denial of service vulnerability in Wireshark's RTPS protocol dissector causes the application to crash when parsing malformed RTPS packets.", published: "2026-03-10", affected: ["Wireshark >= 4.0, <= 4.2.5"], vendor: "Wireshark Foundation", exploitStatus: "theoretical", mitigationSummary: "Update to Wireshark 4.2.6+. Disable RTPS dissector if not needed.", references: ["https://www.wireshark.org/security/wnpa-sec-2026-03.html"], mitreTechniques: ["T1499"] },
];

export const THREAT_ACTORS: ThreatActor[] = [
  { id: "apt-violet", name: "Violet Typhoon", aliases: ["APT-42", "Storm-1789"], motivation: "espionage", type: "apt", description: "State-sponsored cyber espionage group targeting defense contractors and critical infrastructure organizations in North America and Europe. Known for sophisticated spear-phishing campaigns and custom malware tooling.", commonTechniques: ["T1566", "T1059", "T1204", "T1573", "T1005"], targetIndustries: ["Defense", "Aerospace", "Energy", "Telecommunications"], geographicScope: ["North America", "Europe", "East Asia"], knownCampaigns: ["Operation Nightfall", "Project Eclipse"], mitreIds: ["T1566.001", "T1059.001", "T1204.002", "T1573.001", "T1005"], firstSeen: "2022-03", references: ["https://example.com/reports/violet-typhoon"] },
  { id: "ransom-cor", name: "Cipher Syndicate", aliases: ["RansomCorp", "CS-Group"], motivation: "financial", type: "cybercrime", description: "Professional ransomware-as-a-service operation using double extortion tactics. Targets enterprise environments through exposed RDP services and phishing. Known for custom encryptor and data leak sites.", commonTechniques: ["T1566", "T1190", "T1486", "T1048", "T1070"], targetIndustries: ["Healthcare", "Finance", "Manufacturing", "Education"], geographicScope: ["Global"], knownCampaigns: ["Operation Payload", "Ransom Surge 2025"], mitreIds: ["T1566.001", "T1190", "T1486", "T1048", "T1070"], firstSeen: "2023-06", references: ["https://example.com/reports/cipher-syndicate"] },
  { id: "solar-wind", name: "Solar Tempest", aliases: ["SolT", "UNC-2452"], motivation: "multiple", type: "apt", description: "Sophisticated cyber espionage and sabotage group known for supply chain attacks targeting software build pipelines. Uses intricate multi-stage implants and living-off-the-land techniques.", commonTechniques: ["T1195", "T1059", "T1574", "T1027", "T1090"], targetIndustries: ["Technology", "Government", "Energy", "Financial Services"], geographicScope: ["Global"], knownCampaigns: ["Supply Chain Compromise 2024", "Operation Solar Eclipse"], mitreIds: ["T1195.001", "T1059.001", "T1574.002", "T1027", "T1090"], firstSeen: "2020-12", references: ["https://example.com/reports/solar-tempest"] },
  { id: "phoenix-crew", name: "Phoenix Crew", aliases: ["PHC"], motivation: "hacktivism", type: "hacktivist", description: "Hacktivist collective targeting organizations perceived as engaging in censorship or human rights violations. Uses DDoS attacks, website defacement, and data leaks to amplify political messaging.", commonTechniques: ["T1498", "T1499", "T1485", "T1078"], targetIndustries: ["Government", "Media", "Telecommunications"], geographicScope: ["Middle East", "South Asia", "Europe"], knownCampaigns: ["Operation Free Press", "Digital Resistance"], mitreIds: ["T1498", "T1499", "T1485", "T1078"], firstSeen: "2024-01", references: ["https://example.com/reports/phoenix-crew"] },
  { id: "deep-void", name: "Deep Void", aliases: ["DV-APT"], motivation: "espionage", type: "apt", description: "Advanced persistent threat actor focused on exfiltrating intellectual property from semiconductor and AI research organizations. Uses custom malware and sophisticated social engineering.", commonTechniques: ["T1566", "T1059", "T1005", "T1020", "T1573"], targetIndustries: ["Semiconductor", "AI Research", "Pharmaceuticals", "Defense"], geographicScope: ["North America", "East Asia", "Western Europe"], knownCampaigns: ["Project Silicon", "Operation Neural Harvest"], mitreIds: ["T1566.002", "T1059.001", "T1005", "T1020", "T1573.001"], firstSeen: "2023-09", references: ["https://example.com/reports/deep-void"] },
  { id: "lunar-shadow", name: "Lunar Shadow", aliases: ["APT-LS"], motivation: "destruction", type: "apt", description: "Destructive cyber operations group targeting critical infrastructure, particularly power grids and water treatment facilities. Known for custom wiper malware and OT/ICS-specific attack capabilities.", commonTechniques: ["T1485", "T1561", "T806", "T839", "T882"], targetIndustries: ["Energy", "Water Treatment", "Transportation", "Government"], geographicScope: ["Eastern Europe", "Central Asia"], knownCampaigns: ["Operation Blackout", "Winter Storm"], mitreIds: ["T1485", "T1561.001", "T0839", "T0882"], firstSeen: "2022-08", references: ["https://example.com/reports/lunar-shadow"] },
];

export const MALWARE_FAMILIES: MalwareFamily[] = [
  { id: "mal-crypt", name: "CrypTorch", category: "ransomware", description: "Advanced ransomware variant using intermittent encryption to evade detection. Written in Rust with custom crypter and anti-analysis capabilities.", behavior: "Encrypts files using ChaCha20 with intermittent encryption pattern to evade detection. Deletes volume shadow copies and disables recovery.", persistence: "Installs as Windows service 'SysHelper' with scheduled task for persistence", propagation: ["Phishing attachments", "Exploited RDP", "SMB worm spread"], knownTargets: ["Healthcare organizations", "Financial institutions", "Manufacturing"], detectionGuidance: "Monitor for mass file rename events, SMB write activity spikes, and Windows service creation events.", mitigation: "Regular offline backups, network segmentation, RDP access control, user awareness training.", mitreTechniques: ["T1486", "T1490", "T1070", "T1048", "T1059"], associatedActors: ["ransom-cor"], references: ["https://example.com/analysis/cryptorch"] },
  { id: "mal-back", name: "ShadowGate", category: "backdoor", description: "Multi-stage backdoor used by Violet Typhoon for persistent access to compromised networks. Uses modular architecture with encrypted C2 communication.", behavior: "Dropper extracts payload from PNG steganography. Establishes C2 via HTTPS to compromised WordPress sites. Module loading for keylogging, screen capture, and file exfiltration.", persistence: "WMI event subscription and scheduled task with random names", propagation: ["Spear-phishing attachments", "Watering hole attacks", "Software update hijacking"], knownTargets: ["Defense contractors", "Telecommunications providers"], detectionGuidance: "Monitor for WMI persistence creation, anomalous HTTPS traffic to non-standard domains, and PNG file anomalies.", mitigation: "Network segmentation, email filtering, endpoint detection with behavioral analysis, TLS inspection.", mitreTechniques: ["T1059", "T1573", "T1005", "T1020", "T1204"], associatedActors: ["apt-violet"], references: ["https://example.com/analysis/shadowgate"] },
  { id: "mal-loader", name: "PayloadMule", category: "loader", description: "Lightweight loader malware distributed through malvertising campaigns. Downloads and executes secondary payloads while evading sandbox analysis.", behavior: "Checks for sandbox artifacts (debugger, VM, analysis tools). Sleeps with random delays. Downloads encrypted payload from paste sites.", persistence: "Registry run key and scheduled task", propagation: ["Malvertising", "Fake software downloads", "Compromised WordPress sites"], knownTargets: ["General consumers", "Small businesses"], detectionGuidance: "Monitor for suspicious scheduled task creation, registry modifications, and connections to paste sites.", mitigation: "Ad blockers, application allowlisting, endpoint detection, regular patching.", mitreTechniques: ["T1204", "T1059", "T1036", "T1070", "T1140"], associatedActors: ["ransom-cor"], references: ["https://example.com/analysis/payloadmule"] },
  { id: "mal-wiper", name: "IronWipe", category: "wiper", description: "Destructive wiper malware targeting industrial control systems. Overwrites MBR and key system files while targeting specific SCADA software configurations.", behavior: "Enumerates processes for SCADA software. Overwrites MBR with garbage data, corrupts database files, and triggers physical destruction of UPS devices via vendor APIs.", persistence: "N/A (single-use destructive payload)", propagation: ["Supply chain compromise", "Exploited VPN access", "USB drop"], knownTargets: ["Power utilities", "Water treatment plants", "Manufacturing"], detectionGuidance: "Monitor for unauthorized process termination, MBR write operations, and unexpected USB device connections.", mitigation: "Air-gapped critical systems, OT network segmentation, hardware root of trust verification.", mitreTechniques: ["T1485", "T1561", "T0839", "T0882"], associatedActors: ["lunar-shadow"], references: ["https://example.com/analysis/ironwipe"] },
  { id: "mal-steal", name: "SilentHarvest", category: "stealer", description: "Information stealer targeting browser credentials, cryptocurrency wallets, and password managers. Written in C# with Telegram-based C2 exfiltration.", behavior: "Scrapes browser databases for saved credentials. Targets specific cryptocurrency wallet files and browser extension data. Archives and exfiltrates via Telegram API.", persistence: "Registry run key hidden in legitimate software path", propagation: ["Email attachments", "Fake updates", "Pirated software"], knownTargets: ["Crypto investors", "Gamers", "Enterprise employees with remote access"], detectionGuidance: "Monitor for Telegram API calls, browser database read events, and archived file creation in temp directories.", mitigation: "Password manager usage, browser security settings, application allowlisting, email filtering.", mitreTechniques: ["T1555", "T1056", "T1115", "T1041"], associatedActors: ["ransom-cor"], references: ["https://example.com/analysis/silent-harvest"] },
  { id: "mal-trojan", name: "PhantomRAT", category: "trojan", description: "Full-featured remote access trojan used by Deep Void for long-term espionage operations. Features include keylogging, screen capture, audio recording, and file exfiltration.", behavior: "Dropper installs via DLL side-loading. C2 communication uses WebSocket over WSS with custom protocol. Commands for file operations, process management, and credential theft.", persistence: "DLL sideloading via legitimate signed application, WMI subscription", propagation: ["Spear-phishing with weaponized documents", "Supply chain attacks"], knownTargets: ["AI research labs", "Semiconductor fabs", "Government research"], detectionGuidance: "Monitor for DLL sideloading patterns, WebSocket connections to unknown origins, and unusual WMI activity.", mitigation: "Application control policies, DLL hijacking protection, network monitoring, email security.", mitreTechniques: ["T1059", "T1573", "T1056", "T1115", "T1123"], associatedActors: ["deep-void"], references: ["https://example.com/analysis/phantomrat"] },
];

export const CAMPAIGNS: Campaign[] = [
  { id: "camp-nf", name: "Operation Nightfall", description: "Ongoing cyber espionage campaign attributed to Violet Typhoon targeting defense contractors in North America. Uses ShadowGate backdoor with spear-phishing initial access.", firstSeen: "2025-09", lastSeen: "2026-06", status: "active", actors: ["apt-violet"], malware: ["ShadowGate"], cvEs: ["CVE-2026-34567"], mitreTechniques: ["T1566", "T1059", "T1573", "T1005", "T1190"], timeline: [{ date: "2025-09", event: "Initial spear-phishing campaign observed targeting defense HR departments" }, { date: "2025-11", event: "ShadowGate backdoor identified in forensic analysis" }, { date: "2026-01", event: "Campaign expands to include supply chain attacks on software vendors" }, { date: "2026-03", event: "CVE-2026-34567 exploitation observed in cluster compromise attempts" }, { date: "2026-06", event: "Ongoing activity with refined TTPs and updated ShadowGate variant" }], targets: ["North American defense contractors", "IT service providers"] },
  { id: "camp-rc", name: "Ransom Surge 2026", description: "Global ransomware campaign by Cipher Syndicate exploiting recently patched RCE vulnerabilities in edge devices for initial access.", firstSeen: "2026-03", lastSeen: "2026-06", status: "active", actors: ["ransom-cor"], malware: ["CrypTorch", "PayloadMule"], cvEs: ["CVE-2026-34567", "CVE-2026-26543"], mitreTechniques: ["T1190", "T1486", "T1048", "T1070", "T1059"], timeline: [{ date: "2026-03", event: "Initial exploitation of edge device vulnerabilities for network access" }, { date: "2026-04", event: "CrypTorch ransomware deployed in healthcare sector attacks" }, { date: "2026-05", event: "Data leak site publishes 15 victim datasets" }, { date: "2026-06", event: "Campaign shifts focus to manufacturing sector" }], targets: ["Healthcare", "Manufacturing", "Education"] },
  { id: "camp-sl", name: "Operation Solar Eclipse", description: "Supply chain compromise campaign by Solar Tempest targeting CI/CD pipelines in the technology sector.", firstSeen: "2024-06", lastSeen: "2026-04", status: "declining", actors: ["solar-wind"], malware: [], cvEs: ["CVE-2026-22987"], mitreTechniques: ["T1195", "T1574", "T1027", "T1059"], timeline: [{ date: "2024-06", event: "Initial compromise of open-source package maintainer accounts" }, { date: "2025-01", event: "Malicious commits inserted into popular npm packages" }, { date: "2025-08", event: "C2 infrastructure discovered in CI/CD pipeline artifacts" }, { date: "2026-04", event: "Campaign activity declines following public disclosures" }], targets: ["Technology companies", "Software vendors"] },
];

export const SECURITY_NEWS: SecurityNews[] = [
  { id: "news-1", headline: "CISA Issues Emergency Directive on Kubernetes API Exploitation", summary: "CISA issued Emergency Directive 26-03 requiring all federal agencies to patch CVE-2026-34567 within 48 hours following confirmed exploitation in the wild.", date: "2026-06-30", category: "advisory", source: "CISA", url: "#", tags: ["CISA", "Kubernetes", "Emergency Directive"] },
  { id: "news-2", headline: "Major Healthcare Provider Discloses Ransomware Breach Affecting 2M Patients", summary: "Midwest Health Systems disclosed a ransomware attack attributed to Cipher Syndicate, with 2 million patient records compromised and $15M ransom demand.", date: "2026-06-25", category: "breach", source: "HealthInfoSec", url: "#", tags: ["Ransomware", "Healthcare", "Breach"] },
  { id: "news-3", headline: "OpenSSL 3.2.2 Released with Critical Security Fixes", summary: "The OpenSSL project released version 3.2.2 addressing CVE-2026-33456 and two other high-severity vulnerabilities. Users are urged to upgrade immediately.", date: "2026-06-15", category: "update", source: "OpenSSL", url: "#", tags: ["OpenSSL", "Cryptography", "Patch"] },
  { id: "news-4", headline: "New Phishing Campaign Uses AI-Generated Content to Target Executives", summary: "Researchers report a sophisticated phishing campaign using AI-generated personalized emails targeting C-suite executives with realistic business context.", date: "2026-06-12", category: "research", source: "KrebsOnSecurity", url: "#", tags: ["Phishing", "AI", "Executive Targeting"] },
  { id: "news-5", headline: "Microsoft Patch Tuesday Addresses 87 Vulnerabilities, 3 Critical", summary: "Microsoft's June 2026 Patch Tuesday release fixes 87 CVEs including CVE-2026-31234 (Active Directory EoP) and two other critical remote code execution flaws.", date: "2026-06-09", category: "update", source: "Microsoft Security Response Center", url: "#", tags: ["Patch Tuesday", "Microsoft", "Active Directory"] },
  { id: "news-6", headline: "Violet Typhoon Expands Operations to European Telecom Sector", summary: "Threat intelligence researchers report Violet Typhoon has expanded targeting to include European telecommunications providers, using new ShadowGate variants.", date: "2026-06-01", category: "research", source: "Mandiant", url: "#", tags: ["APT", "Telecommunications", "Violet Typhoon"] },
  { id: "news-7", headline: "IC3 Reports Record-Breaking Cyber Crime Losses in Q2 2026", summary: "The FBI IC3 reported $4.2 billion in cyber crime losses for Q2 2026, driven by business email compromise and ransomware incidents.", date: "2026-05-28", category: "industry", source: "FBI IC3", url: "#", tags: ["Cyber Crime", "BEC", "Ransomware"] },
  { id: "news-8", headline: "New Container Escape Technique Demonstrates OverlayFS Risk", summary: "Security researchers published details of a new container escape technique exploiting OverlayFS race conditions, affecting major container runtimes.", date: "2026-05-22", category: "research", source: "Unit 42", url: "#", tags: ["Container Security", "Docker", "Exploit Research"] },
];

export const IOC_EXAMPLES: IOCExample[] = [
  { type: "ip", value: "185.234.73.18", context: "C2 server for ShadowGate backdoor — observed in Operation Nightfall campaign", severity: "high" },
  { type: "ip", value: "91.121.87.45", context: "Ransomware staging server distributing CrypTorch payloads", severity: "high" },
  { type: "domain", value: "cdn-update-service[.]com", context: "Fake software update domain used in PayloadMule malvertising campaign", severity: "medium" },
  { type: "domain", value: "microsoft-security-portal[.]org", context: "Phishing domain targeting Microsoft 365 credentials", severity: "high" },
  { type: "hash", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", context: "SHA-256 hash of CrypTorch ransomware sample (example — DO NOT USE FOR DETECTION)", severity: "high" },
  { type: "hash", value: "d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2", context: "MD5 hash of ShadowGate loader component", severity: "medium" },
  { type: "email", value: "security-alerts@microsoft-verify[.]org", context: "Spear-phishing sender address used in Violet Typhoon campaigns", severity: "high" },
  { type: "process", value: "svchost.exe -k netsvcs (running from temp directory)", context: "ShadowGate masquerades as svchost when launched from %TEMP%", severity: "medium" },
];

export const MITRE_TECHNIQUES: MitreTechniqueInfo[] = [
  { id: "T1190", name: "Exploit Public-Facing Application", tactic: "Initial Access", description: "Attackers exploit vulnerabilities in internet-facing systems to gain initial access to networks.", platforms: ["Windows", "Linux", "Cloud"], detection: "Monitor for unusual authentication patterns, exploit attempts in web logs, and unexpected process launches.", mitigation: "Regular patching, WAF deployment, network segmentation, vulnerability scanning.", relatedProjects: ["sentinel-ai", "netdefend"] },
  { id: "T1566", name: "Phishing", tactic: "Initial Access", description: "Adversaries send malicious emails with links or attachments to gain initial access to target systems.", platforms: ["Windows", "Linux", "macOS", "Cloud"], detection: "Email security gateway alerts, user-reported phishing, URL analysis, attachment sandboxing.", mitigation: "Email filtering, user awareness training, DMARC/DKIM/SPF, attachment sandboxing.", relatedProjects: ["phishshield"] },
  { id: "T1059", name: "Command and Scripting Interpreter", tactic: "Execution", description: "Adversaries abuse command and script interpreters like PowerShell, Bash, or Python to execute malicious code.", platforms: ["Windows", "Linux", "macOS"], detection: "Monitor for suspicious PowerShell/Bash execution, script block logging, and unusual parent-child process relationships.", mitigation: "PowerShell Constrained Language, application control, execution policy enforcement.", relatedProjects: ["sentinel-ai"] },
  { id: "T1486", name: "Data Encrypted for Impact", tactic: "Impact", description: "Adversaries encrypt data on target systems to disrupt operations and demand ransom for decryption.", platforms: ["Windows", "Linux", "Cloud"], detection: "Monitor for mass file extension changes, volume shadow copy deletion, and encryption API calls.", mitigation: "Regular backups, anti-ransomware tools, file integrity monitoring, user education.", relatedProjects: ["forensic-analyzer"] },
  { id: "T1573", name: "Encrypted Channel", tactic: "Command and Control", description: "Adversaries use encrypted C2 channels to evade network detection, often using HTTPS or custom encryption.", platforms: ["Windows", "Linux", "macOS"], detection: "JA3/S fingerprinting, TLS certificate anomaly detection, beaconing analysis, network flow monitoring.", mitigation: "TLS inspection, network monitoring, DNS sinkholing, threat intel feeds.", relatedProjects: ["sentinel-ai", "netdefend"] },
  { id: "T1078", name: "Valid Accounts", tactic: "Defense Evasion", description: "Adversaries use compromised credentials to authenticate as legitimate users and evade detection.", platforms: ["Windows", "Linux", "Cloud"], detection: "Monitor for unusual login patterns, impossible travel, account usage anomalies, and credential access alerts.", mitigation: "MFA enforcement, least privilege, credential rotation, identity monitoring.", relatedProjects: ["cloudsec-enforcer"] },
  { id: "T1195", name: "Supply Chain Compromise", tactic: "Initial Access", description: "Adversaries compromise third-party software, hardware, or services to infiltrate target environments.", platforms: ["Windows", "Linux", "Cloud", "macOS"], detection: "Software integrity verification, code signing, dependency scanning, CI/CD pipeline monitoring.", mitigation: "SBOM management, signed commits, artifact verification, vendor security assessments.", relatedProjects: ["chainguard"] },
  { id: "T1048", name: "Exfiltration Over Alternative Protocol", tactic: "Exfiltration", description: "Adversaries use non-standard protocols like HTTP, DNS, or ICMP to exfiltrate stolen data.", platforms: ["Windows", "Linux", "macOS"], detection: "Monitor for large DNS queries, unexpected HTTP POST requests, ICMP payload analysis, and data volume anomalies.", mitigation: "DLP solutions, network traffic analysis, DNS monitoring, egress filtering.", relatedProjects: ["netdefend", "threat-hunter"] },
];

export function getCVEById(id: string): CVEItem | undefined {
  return CVE_DATABASE.find(c => c.cveId === id || c.id === id);
}

export function getActorById(id: string): ThreatActor | undefined {
  return THREAT_ACTORS.find(a => a.id === id || a.name === id);
}

export function getMalwareById(id: string): MalwareFamily | undefined {
  return MALWARE_FAMILIES.find(m => m.id === id || m.name === id);
}

export function filterCVEs(query: string, severity?: Severity[]): CVEItem[] {
  let results = CVE_DATABASE;
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(c =>
      c.cveId.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.vendor.toLowerCase().includes(q) ||
      c.affected.some(a => a.toLowerCase().includes(q))
    );
  }
  if (severity && severity.length > 0) results = results.filter(c => severity.includes(c.severity));
  return results;
}

export function getRelatedProjectsForIntel(mitreIds: string[]): { title: string; href: string }[] {
  const seen = new Set<string>();
  const result: { title: string; href: string }[] = [];
  for (const mitreId of mitreIds) {
    const tech = MITRE_TECHNIQUES.find(t => t.id === mitreId);
    for (const pid of tech?.relatedProjects || []) {
      if (!seen.has(pid)) {
        seen.add(pid);
        const project = projects.find(p => p.id === pid);
        if (project) result.push({ title: project.title, href: `/projects/${project.id}` });
      }
    }
  }
  return result.slice(0, 6);
}

export function getCriticalCVEs() { return CVE_DATABASE.filter(c => c.severity === "critical"); }
export function getHighCVEs() { return CVE_DATABASE.filter(c => c.severity === "high"); }
export function getRecentNews(days: number = 30) { return SECURITY_NEWS; }
export function getActiveCampaigns() { return CAMPAIGNS.filter(c => c.status === "active"); }
