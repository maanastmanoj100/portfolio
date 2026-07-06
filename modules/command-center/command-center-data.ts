export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type AlertStatus = "open" | "investigating" | "contained" | "resolved" | "closed";
export type IncidentStatus = "open" | "investigating" | "contained" | "resolved" | "closed";
export type ServiceStatus = "operational" | "degraded" | "down" | "maintenance";
export type DataSource = "live" | "demo" | "historical" | "simulated";

export interface DataTag {
  label: string;
  source: DataSource;
}

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
  info: "#6366f1",
};

export const STATUS_COLORS: Record<IncidentStatus, string> = {
  open: "#ef4444",
  investigating: "#f97316",
  contained: "#3b82f6",
  resolved: "#10b981",
  closed: "#6b7280",
};

export const SOURCE_BADGES: Record<DataSource, { label: string; color: string }> = {
  live: { label: "LIVE", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  demo: { label: "DEMO", color: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  historical: { label: "HIST", color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  simulated: { label: "SIM", color: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
};

export interface SocAlert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: AlertStatus;
  source: DataSource;
  timestamp: string;
  mitreTechniques: string[];
  iocMatches: string[];
  sigmaRule: string;
  detectionRule: string;
  affectedSystems: string[];
  assignedAnalyst?: string;
  relatedProjects: string[];
  tags: string[];
  evidence: string[];
}

export interface NocMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: ServiceStatus;
  trend: "up" | "down" | "stable";
  source: DataSource;
  percentChange: number;
  history: { time: string; value: number }[];
}

export interface CveSummary {
  id: string;
  cveId: string;
  severity: Severity;
  cvss: number;
  title: string;
  published: string;
  affected: string[];
  exploitStatus: string;
  source: DataSource;
}

export interface ThreatActorSummary {
  id: string;
  name: string;
  motivation: string;
  type: string;
  recentActivity: string;
  source: DataSource;
}

export interface OsintFeed {
  id: string;
  headline: string;
  summary: string;
  date: string;
  category: "advisory" | "breach" | "research" | "update" | "industry" | "conference";
  source: string;
  url: string;
  tags: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "project" | "certification" | "ctf" | "research" | "architecture" | "milestone" | "learning";
  icon: string;
  source: DataSource;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  source: DataSource;
  openedAt: string;
  updatedAt: string;
  category: string;
  affectedAssets: string[];
  assignedTeam: string;
  timeline: { time: string; event: string }[];
  evidence: string[];
  mitreMapping: string[];
}

export interface InfrastructureNode {
  id: string;
  name: string;
  type: "cloud" | "firewall" | "router" | "vm" | "container" | "project" | "monitoring" | "storage" | "logging";
  status: ServiceStatus;
  x: number;
  y: number;
  description: string;
}

export interface InfrastructureConnection {
  from: string;
  to: string;
  label: string;
}

// ─── SOC ALERTS ─────────────────────────────────────────────────────────

export const SOC_ALERTS: SocAlert[] = [
  { id: "alert-001", title: "Suspicious PowerShell Execution - Lateral Movement", description: "Detected PowerShell Empire invocation on workstation SEC-WKS-042. Parent process winword.exe spawned powershell.exe with encoded commands. Pattern matches known C2 staging behavior.", severity: "critical", status: "investigating", source: "demo", timestamp: "2026-07-04 14:32:21 UTC", mitreTechniques: ["T1059.001", "T1021"], iocMatches: ["IP 185.234.73.18 (C2)", "Hash e3b0c44298fc"], sigmaRule: "powershell_empire_invocation", detectionRule: "EDR-012 - Suspicious Office Process Spawning Shell", affectedSystems: ["SEC-WKS-042", "DC-03"], assignedAnalyst: "SOC Analyst (Demo)", relatedProjects: ["sentinel-ai", "forensic-analyzer"], tags: ["lateral-movement", "powershell", "c2"], evidence: ["Event ID 4688: Process Creation", "Network connection to 185.234.73.18:443"] },
  { id: "alert-002", title: "Ransomware File Encryption Detected - Rapid File Rename", description: "EDR detected mass file rename operations on file server FS-02. Over 2,000 files renamed with .crypt extension in 30 seconds. Process origin: svchost.exe from non-standard path.", severity: "critical", status: "contained", source: "demo", timestamp: "2026-07-04 13:15:44 UTC", mitreTechniques: ["T1486", "T1490"], iocMatches: ["Process svchost.exe from %TEMP%", "Extension .crypt"], sigmaRule: "ransomware_mass_file_rename", detectionRule: "EDR-008 - Mass File Encryption Detection", affectedSystems: ["FS-02", "SEC-WKS-038", "SEC-WKS-039"], assignedAnalyst: "SOC Lead (Demo)", relatedProjects: ["forensic-analyzer", "threat-hunter"], tags: ["ransomware", "encryption", "contained"], evidence: ["2,340 files affected on FS-02", "Volume shadow copies deleted at 13:16:01"] },
  { id: "alert-003", title: "DNS Tunneling Detection - Data Exfiltration Indicators", description: "Anomalous DNS query volume detected from development server DEV-07. Over 15,000 subdomain queries to a single domain in 5 minutes. Base64-encoded subdomains suggest DNS tunneling tool.", severity: "high", status: "investigating", source: "demo", timestamp: "2026-07-04 12:45:12 UTC", mitreTechniques: ["T1048", "T1572"], iocMatches: ["Domain dns-tunnel.malicious[.]com", "Base64 subdomain pattern"], sigmaRule: "dns_tunnel_high_query_volume", detectionRule: "NDR-005 - DNS Query Volume Anomaly", affectedSystems: ["DEV-07", "DNS-01"], assignedAnalyst: "SOC Analyst (Demo)", relatedProjects: ["netdefend", "sentinel-ai"], tags: ["exfiltration", "dns-tunneling", "c2"], evidence: ["15,342 DNS queries in 5 min", "Average subdomain length: 42 chars"] },
  { id: "alert-004", title: "Brute Force Attack - RDP Service Targeted", description: "Multiple failed RDP authentication attempts detected from external IP range 91.121.87.0/24. Over 500 failed logins in 10 minutes targeting domain administrator accounts.", severity: "high", status: "open", source: "demo", timestamp: "2026-07-04 11:22:38 UTC", mitreTechniques: ["T1110"], iocMatches: ["IP range 91.121.87.0/24"], sigmaRule: "rdp_brute_force_external", detectionRule: "NDR-002 - External Brute Force Detection", affectedSystems: ["RDP-GW-01", "DC-01"], relatedProjects: ["netdefend", "cloudsec-enforcer"], tags: ["brute-force", "rdp", "authentication"], evidence: ["532 failed logins from 12 source IPs", "Target accounts: 8 domain admins"] },
  { id: "alert-005", title: "Phishing Campaign - Microsoft 365 Credential Harvesting", description: "Email gateway flagged 47 phishing emails targeting finance team with fake Microsoft 365 login pages. Emails originate from spoofed domain microsoft-security-portal[.]org.", severity: "high", status: "contained", source: "demo", timestamp: "2026-07-04 10:05:19 UTC", mitreTechniques: ["T1566.002", "T1056"], iocMatches: ["Domain microsoft-security-portal[.]org", "Sender patterns"], sigmaRule: "phishing_o365_credential_harvest", detectionRule: "ESG-003 - Phishing Campaign Detection", affectedSystems: ["All Finance Team (12 users)", "Email Gateway-02"], assignedAnalyst: "SOC Analyst (Demo)", relatedProjects: ["phishshield", "sentinel-ai"], tags: ["phishing", "credential-harvesting", "o365"], evidence: ["47 emails blocked at gateway", "2 users reported before clicking"] },
  { id: "alert-006", title: "Unauthorized Privilege Escalation - Service Account Abuse", description: "Service account SRV-BACKUP attempted unauthorized domain admin group membership change. Account exhibits anomalous login pattern with geographic impossible travel.", severity: "critical", status: "investigating", source: "demo", timestamp: "2026-07-04 09:30:55 UTC", mitreTechniques: ["T1068", "T1078"], iocMatches: ["Account SRV-BACKUP"], sigmaRule: "service_account_privilege_escalation", detectionRule: "IAM-001 - Privileged Group Modification Alert", affectedSystems: ["DC-01", "DC-02"], assignedAnalyst: "SOC Lead (Demo)", relatedProjects: ["cloudsec-enforcer", "sentinel-ai"], tags: ["privilege-escalation", "service-account", "domain-controller"], evidence: ["Group modification attempt at 09:30:52", "Login from IP 10.10.15.42 (unusual for this account)"] },
  { id: "alert-007", title: "SIEM Agent Heartbeat Failure - Monitoring Gap", description: "Five Windows endpoints have not sent security events to SIEM for over 30 minutes. Last known communication: 08:45 UTC. Possible agent tampering or network segmentation issue.", severity: "medium", status: "open", source: "live", timestamp: "2026-07-04 09:15:00 UTC", mitreTechniques: ["T1562"], iocMatches: [], sigmaRule: "siem_agent_heartbeat_failure", detectionRule: "SIEM-001 - Agent Heartbeat Monitoring", affectedSystems: ["SEC-WKS-044", "SEC-WKS-045", "SEC-WKS-046", "DEV-09", "FS-03"], relatedProjects: ["sentinel-ai"], tags: ["monitoring-gap", "agent-failure"], evidence: ["Last heartbeat: 08:45 UTC (30+ min gap)", "No agent tampering alerts from endpoints"] },
  { id: "alert-008", title: "Outbound Connection to Known Malicious IP", description: "Workstation SEC-WKS-037 established outbound HTTPS connection to IP 91.121.87.45, which is associated with known ransomware staging infrastructure. Process: chrome.exe with unusual command-line arguments.", severity: "high", status: "open", source: "demo", timestamp: "2026-07-04 08:52:33 UTC", mitreTechniques: ["T1071", "T1204"], iocMatches: ["IP 91.121.87.45 (ransomware staging)"], sigmaRule: "outbound_connection_malicious_ip", detectionRule: "NDR-001 - Malicious IP Connection Alert", affectedSystems: ["SEC-WKS-037"], relatedProjects: ["netdefend", "threat-hunter"], tags: ["c2-connection", "ransomware-staging", "outbound"], evidence: ["Connection established at 08:52:31", "Chrome.exe with --disable-web-security flag"] },
  { id: "alert-009", title: "Excessive SMB File Share Enumeration", description: "User account JSMITH enumerated over 500 file shares across the network in under 60 seconds using SharpHound. This behavior is consistent with Active Directory reconnaissance.", severity: "medium", status: "investigating", source: "demo", timestamp: "2026-07-04 08:10:22 UTC", mitreTechniques: ["T1069", "T1087"], iocMatches: ["Tool SharpHound detection"], sigmaRule: "ad_recon_sharphound_enumeration", detectionRule: "EDR-015 - Excessive Share Enumeration", affectedSystems: ["DC-01", "Multiple file servers"], assignedAnalyst: "SOC Analyst (Demo)", relatedProjects: ["sentinel-ai", "redops"], tags: ["reconnaissance", "ad-enumeration", "sharphound"], evidence: ["507 SMB tree connects in 58 seconds", "Process: SharpHound.exe executed from JSMITH workstation"] },
  { id: "alert-010", title: "Scheduled Task Created on Domain Controller", description: "A suspicious scheduled task 'SysHelper' was created on DC-01 by an account that was compromised earlier. Task runs at system startup and executes a PowerShell script from a network share.", severity: "critical", status: "contained", source: "demo", timestamp: "2026-07-04 07:45:10 UTC", mitreTechniques: ["T1053", "T1059"], iocMatches: ["Task name: SysHelper"], sigmaRule: "scheduled_task_on_dc", detectionRule: "EDR-010 - Scheduled Task Creation on Critical Systems", affectedSystems: ["DC-01"], assignedAnalyst: "SOC Lead (Demo)", relatedProjects: ["forensic-analyzer", "redops"], tags: ["persistence", "scheduled-task", "domain-controller"], evidence: ["Task 'SysHelper' created at 07:44:58", "Runs: powershell.exe -EncodedCommand ..."] },
  { id: "alert-011", title: "Container Registry Unauthorized Access Attempt", description: "Multiple failed authentication attempts against private container registry from external IP. Attempts to pull sensitive container images including production environment images.", severity: "medium", status: "open", source: "live", timestamp: "2026-07-04 06:30:15 UTC", mitreTechniques: ["T1078", "T1525"], iocMatches: ["External IP 45.33.32.156"], sigmaRule: "container_registry_brute_force", detectionRule: "CSP-003 - Registry Authentication Monitoring", affectedSystems: ["Container Registry-01"], relatedProjects: ["cloudsec-enforcer", "k8s-hardener"], tags: ["container-security", "registry", "unauthorized-access"], evidence: ["23 failed pull attempts", "Target images: production/*"] },
  { id: "alert-012", title: "SSL Certificate Expiry - Service Impact Imminent", description: "Wildcard certificate *.cybernexus.local expires in 24 hours. Certificate used by critical services including VPN gateway, web applications, and internal CA infrastructure.", severity: "low", status: "open", source: "live", timestamp: "2026-07-04 05:00:00 UTC", mitreTechniques: [], iocMatches: [], sigmaRule: "certificate_expiry_warning", detectionRule: "INFRA-002 - Certificate Expiry Monitoring", affectedSystems: ["VPN-GW-01", "Web Proxy-01", "Internal CA"], relatedProjects: [], tags: ["certificate", "maintenance", "expiry"], evidence: ["Certificate: *.cybernexus.local", "Expires: 2026-07-05 05:00 UTC"] },
];

// ─── NOC METRICS ────────────────────────────────────────────────────────

export const NOC_METRICS: NocMetric[] = [
  { id: "noc-srv", name: "Server Uptime", value: "99.97", unit: "%", status: "operational", trend: "up", source: "live", percentChange: 0.02, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 99.5 + Math.random() * 0.5 })) },
  { id: "noc-vm", name: "Virtual Machines", value: "24/24", unit: "online", status: "operational", trend: "stable", source: "live", percentChange: 0, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 24 })) },
  { id: "noc-container", name: "Container Health", value: "18/19", unit: "running", status: "degraded", trend: "down", source: "live", percentChange: -5.3, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 18 + Math.floor(Math.random() * 2) })) },
  { id: "noc-bandwidth", name: "Bandwidth Usage", value: "342", unit: "Mbps", status: "operational", trend: "up", source: "live", percentChange: 12.4, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 200 + Math.floor(Math.random() * 300) })) },
  { id: "noc-latency", name: "Average Latency", value: "12", unit: "ms", status: "operational", trend: "stable", source: "live", percentChange: 0.8, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 8 + Math.floor(Math.random() * 10) })) },
  { id: "noc-packet-loss", name: "Packet Loss", value: "0.02", unit: "%", status: "operational", trend: "down", source: "live", percentChange: -0.01, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 0.01 + Math.random() * 0.05 })) },
  { id: "noc-disk", name: "Storage Pool Usage", value: "12.4/20", unit: "TB", status: "operational", trend: "up", source: "live", percentChange: 2.1, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 11 + Math.random() * 2 })) },
  { id: "noc-ram", name: "Memory Utilization", value: "68", unit: "%", status: "operational", trend: "stable", source: "live", percentChange: 1.2, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 55 + Math.floor(Math.random() * 30) })) },
  { id: "noc-cpu", name: "Cluster CPU", value: "42", unit: "%", status: "operational", trend: "down", source: "live", percentChange: -3.5, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 30 + Math.floor(Math.random() * 40) })) },
  { id: "noc-services", name: "Service Availability", value: "98.5", unit: "%", status: "operational", trend: "stable", source: "live", percentChange: 0.1, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 97 + Math.random() * 3 })) },
  { id: "noc-docker", name: "Docker Engine Health", value: "4/4", unit: "nodes healthy", status: "operational", trend: "stable", source: "live", percentChange: 0, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 4 })) },
  { id: "noc-cloud", name: "Cloud Services", value: "6/6", unit: "available", status: "operational", trend: "stable", source: "live", percentChange: 0, history: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 6 })) },
];

// ─── CVE SUMMARY ────────────────────────────────────────────────────────

export const CVE_SUMMARIES: CveSummary[] = [
  { id: "cve-1", cveId: "CVE-2026-34567", severity: "critical", cvss: 9.8, title: "Remote Code Execution in Kubernetes API Server", published: "2026-06-28", affected: ["Kubernetes >= 1.28"], exploitStatus: "confirmed", source: "live" },
  { id: "cve-2", cveId: "CVE-2026-33456", severity: "critical", cvss: 9.4, title: "Heap Overflow in OpenSSL 3.x", published: "2026-06-15", affected: ["OpenSSL 3.0.0 - 3.2.1"], exploitStatus: "confirmed", source: "live" },
  { id: "cve-3", cveId: "CVE-2026-31234", severity: "critical", cvss: 9.0, title: "AD Domain Services EoP", published: "2026-05-20", affected: ["Windows Server 2019/2022/2025"], exploitStatus: "confirmed", source: "live" },
  { id: "cve-4", cveId: "CVE-2026-28901", severity: "high", cvss: 8.8, title: "Stored XSS in Kibana Dashboard", published: "2026-06-10", affected: ["Kibana 8.10 - 8.12.0"], exploitStatus: "reported", source: "live" },
  { id: "cve-5", cveId: "CVE-2026-27890", severity: "high", cvss: 8.5, title: "AWS IAM Role Chaining Escalation", published: "2026-06-05", affected: ["AWS IAM", "AWS STS"], exploitStatus: "confirmed", source: "live" },
  { id: "cve-6", cveId: "CVE-2026-26543", severity: "high", cvss: 8.2, title: "Docker OverlayFS Container Escape", published: "2026-05-25", affected: ["Docker >= 24.0"], exploitStatus: "reported", source: "live" },
  { id: "cve-7", cveId: "CVE-2026-25123", severity: "high", cvss: 7.8, title: "urllib3 HTTP Request Smuggling", published: "2026-05-10", affected: ["urllib3 >= 2.0"], exploitStatus: "reported", source: "live" },
  { id: "cve-8", cveId: "CVE-2026-20765", severity: "high", cvss: 8.1, title: "Redis Lua Sandbox Escape", published: "2026-06-22", affected: ["Redis >= 7.0"], exploitStatus: "confirmed", source: "live" },
  { id: "cve-9", cveId: "CVE-2026-24012", severity: "medium", cvss: 6.5, title: "Go net/http HTTP/2 Memory Exhaustion", published: "2026-04-20", affected: ["Go <= 1.22.2"], exploitStatus: "theoretical", source: "live" },
  { id: "cve-10", cveId: "CVE-2026-22987", severity: "medium", cvss: 6.1, title: "GitHub Actions Artifact Poisoning", published: "2026-04-15", affected: ["GitHub Actions"], exploitStatus: "reported", source: "live" },
];

// ─── THREAT ACTORS ──────────────────────────────────────────────────────

export const THREAT_ACTOR_SUMMARIES: ThreatActorSummary[] = [
  { id: "apt-violet", name: "Violet Typhoon", motivation: "Espionage", type: "APT", recentActivity: "Operation Nightfall targeting defense contractors", source: "live" },
  { id: "ransom-cor", name: "Cipher Syndicate", motivation: "Financial", type: "Cybercrime", recentActivity: "Ransom Surge 2026 campaign (Healthcare, Manufacturing)", source: "live" },
  { id: "solar-wind", name: "Solar Tempest", motivation: "Multiple", type: "APT", recentActivity: "Supply chain compromise via CI/CD pipelines", source: "live" },
  { id: "deep-void", name: "Deep Void", motivation: "Espionage", type: "APT", recentActivity: "Targeting semiconductor & AI research IP theft", source: "live" },
  { id: "lunar-shadow", name: "Lunar Shadow", motivation: "Destruction", type: "APT", recentActivity: "OT/ICS targeting - power grid reconnaissance", source: "live" },
  { id: "phoenix-crew", name: "Phoenix Crew", motivation: "Hacktivism", type: "Hacktivist", recentActivity: "DDoS campaigns against media organizations", source: "live" },
];

// ─── OSINT FEEDS ────────────────────────────────────────────────────────

export const OSINT_FEEDS: OsintFeed[] = [
  { id: "osint-1", headline: "CISA Emergency Directive: Kubernetes Cluster Compromise", summary: "CISA issues ED 26-03 requiring federal agencies to patch CVE-2026-34567 within 48 hours.", date: "2026-07-03", category: "advisory", source: "CISA", url: "#", tags: ["CISA", "Kubernetes", "Critical"] },
  { id: "osint-2", headline: "Black Hat USA 2026 - Schedule Published", summary: "Black Hat USA 2026 conference schedule announced with 120+ briefings on AI security, cloud attacks, and OT threats.", date: "2026-07-02", category: "conference", source: "Black Hat", url: "#", tags: ["Conference", "Black Hat", "InfoSec"] },
  { id: "osint-3", headline: "New Ransomware Variant Targets VMware ESXi", summary: "Researchers identify new ransomware strain specifically targeting VMware ESXi hypervisors via the CVE-2026-26543 container escape.", date: "2026-07-01", category: "research", source: "Mandiant", url: "#", tags: ["Ransomware", "VMware", "ESXi"] },
  { id: "osint-4", headline: "DEF CON 34 - CTF Registration Open", summary: "DEF CON 34 CTF registration is now open. Qualifier rounds begin August 1st with finals at DEF CON in Las Vegas.", date: "2026-06-30", category: "conference", source: "DEF CON", url: "#", tags: ["Conference", "CTF", "DEF CON"] },
  { id: "osint-5", headline: "Microsoft Patch Tuesday - June 2026", summary: "Microsoft releases 87 patches including 3 critical. CVE-2026-31234 (AD EoP) requires immediate attention.", date: "2026-06-28", category: "update", source: "MSRC", url: "#", tags: ["Patch Tuesday", "Microsoft", "Critical"] },
  { id: "osint-6", headline: "Phishing Campaign Uses AI-Generated Personalized Lures", summary: "New phishing campaign uses LLM-generated content tailored to individual targets with 60% success rate.", date: "2026-06-25", category: "breach", source: "KrebsOnSecurity", url: "#", tags: ["Phishing", "AI", "Social Engineering"] },
  { id: "osint-7", headline: "OpenSSL 3.2.2 Released with Critical Fix", summary: "OpenSSL 3.2.2 addresses CVE-2026-33456 and two additional high-severity vulnerabilities.", date: "2026-06-22", category: "advisory", source: "OpenSSL", url: "#", tags: ["OpenSSL", "Cryptography", "Patch"] },
  { id: "osint-8", headline: "Zero-Day Exploitation in Edge Devices on the Rise", summary: "Report shows 340% increase in zero-day exploitation targeting edge devices (VPNs, firewalls, routers) in H1 2026.", date: "2026-06-20", category: "industry", source: "Unit 42", url: "#", tags: ["Zero-Day", "Edge", "IoT"] },
  { id: "osint-9", headline: "IC3 Reports $4.2B in Cyber Crime Losses Q2 2026", summary: "FBI IC3 reports record cyber crime losses driven by BEC ($1.8B) and ransomware ($1.2B) incidents.", date: "2026-06-18", category: "industry", source: "FBI IC3", url: "#", tags: ["Cyber Crime", "BEC", "Ransomware"] },
  { id: "osint-10", headline: "BSidesLV 2026 - Call for Papers Extended", summary: "BSides Las Vegas CFP extended to July 15. Seeking talks on red team, blue team, forensics, and privacy.", date: "2026-06-15", category: "conference", source: "BSidesLV", url: "#", tags: ["Conference", "BSides", "CFP"] },
];

// ─── INFRASTRUCTURE MAP ─────────────────────────────────────────────────

export const INFRASTRUCTURE_NODES: InfrastructureNode[] = [
  { id: "cloud-aws", name: "AWS Cloud", type: "cloud", status: "operational", x: 50, y: 30, description: "Primary cloud provider — 6 services active" },
  { id: "cloud-azure", name: "Azure AD", type: "cloud", status: "operational", x: 50, y: 45, description: "Identity & directory services" },
  { id: "fw-perimeter", name: "Perimeter FW", type: "firewall", status: "operational", x: 50, y: 60, description: "pfSense — 5 rules, 2 active VPN tunnels" },
  { id: "fw-internal", name: "Internal FW", type: "firewall", status: "operational", x: 50, y: 72, description: "Zone-based segmentation — DMZ, Internal, Management" },
  { id: "router-core", name: "Core Router", type: "router", status: "operational", x: 50, y: 82, description: "BGP with 3 upstream peers, OSPF internally" },
  { id: "vm-kali", name: "Kali Linux", type: "vm", status: "operational", x: 20, y: 95, description: "Penetration testing & offensive security" },
  { id: "vm-dc", name: "Domain Controller", type: "vm", status: "operational", x: 35, y: 95, description: "AD DS, DNS, DHCP — cyberlab.internal" },
  { id: "vm-web", name: "Web Server", type: "vm", status: "operational", x: 50, y: 95, description: "Nginx, Juice Shop, Guacamole" },
  { id: "vm-splunk", name: "Splunk SIEM", type: "vm", status: "operational", x: 65, y: 95, description: "Log aggregation & security monitoring" },
  { id: "vm-wazuh", name: "Wazuh", type: "vm", status: "degraded", x: 80, y: 95, description: "EDR & XDR — queue backlog" },
  { id: "container-grafana", name: "Grafana", type: "container", status: "operational", x: 20, y: 108, description: "Monitoring dashboards & visualization" },
  { id: "container-elk", name: "ELK Stack", type: "container", status: "operational", x: 35, y: 108, description: "Elasticsearch, Logstash, Kibana" },
  { id: "container-prom", name: "Prometheus", type: "container", status: "operational", x: 50, y: 108, description: "Metrics collection & alerting" },
  { id: "container-port", name: "Portainer", type: "container", status: "operational", x: 65, y: 108, description: "Container management UI" },
  { id: "proj-sentinel", name: "Sentinel AI", type: "project", status: "operational", x: 20, y: 120, description: "AI-powered SIEM correlation" },
  { id: "proj-netdefend", name: "NetDefend", type: "project", status: "operational", x: 35, y: 120, description: "Network defense toolkit" },
  { id: "monitor-nagios", name: "Nagios Core", type: "monitoring", status: "operational", x: 50, y: 120, description: "Infrastructure monitoring" },
  { id: "storage-nas", name: "NAS Storage", type: "storage", status: "operational", x: 65, y: 120, description: "12.4 TB used / 20 TB total" },
  { id: "logging-syslog", name: "Syslog Server", type: "logging", status: "operational", x: 80, y: 120, description: "Centralized syslog aggregation" },
];

export const INFRASTRUCTURE_CONNECTIONS: InfrastructureConnection[] = [
  { from: "cloud-aws", to: "fw-perimeter", label: "VPN / Direct Connect" },
  { from: "cloud-azure", to: "fw-perimeter", label: "Azure ExpressRoute" },
  { from: "fw-perimeter", to: "fw-internal", label: "DMZ Zone" },
  { from: "fw-perimeter", to: "router-core", label: "WAN" },
  { from: "fw-internal", to: "router-core", label: "Internal LAN" },
  { from: "router-core", to: "vm-kali", label: "Offensive VLAN" },
  { from: "router-core", to: "vm-dc", label: "Management VLAN" },
  { from: "router-core", to: "vm-web", label: "DMZ VLAN" },
  { from: "router-core", to: "vm-splunk", label: "SIEM VLAN" },
  { from: "router-core", to: "vm-wazuh", label: "EDR VLAN" },
  { from: "router-core", to: "container-grafana", label: "Monitoring VLAN" },
  { from: "router-core", to: "container-elk", label: "Logging VLAN" },
  { from: "router-core", to: "container-prom", label: "Metrics VLAN" },
  { from: "router-core", to: "container-port", label: "Orchestration VLAN" },
  { from: "vm-splunk", to: "monitor-nagios", label: "Alert Forwarding" },
  { from: "container-elk", to: "logging-syslog", label: "Log Ingestion" },
  { from: "monitor-nagios", to: "storage-nas", label: "Backup Target" },
  { from: "proj-sentinel", to: "vm-splunk", label: "SIEM Integration" },
  { from: "proj-netdefend", to: "router-core", label: "Network Integration" },
  { from: "vm-dc", to: "cloud-azure", label: "AD Sync" },
];

// ─── INCIDENTS ──────────────────────────────────────────────────────────

export const INCIDENTS: Incident[] = [
  { id: "inc-001", title: "PowerShell Lateral Movement — SEC-WKS-042", description: "Suspicious PowerShell Empire invocation detected on SEC-WKS-042 with C2 beaconing to known malicious IP. Initial access via spear-phishing attachment. Scope: lateral movement to DC-03 in progress.", severity: "critical", status: "investigating", source: "demo", openedAt: "2026-07-04 14:32 UTC", updatedAt: "2026-07-04 14:52 UTC", category: "Lateral Movement", affectedAssets: ["SEC-WKS-042", "DC-03"], assignedTeam: "SOC Tier 2", timeline: [{ time: "14:32", event: "Alert triggered: PowerShell Empire invocation" }, { time: "14:35", event: "SOC analyst assigned — initial triage" }, { time: "14:40", event: "Confirmed C2 beacon to 185.234.73.18:443" }, { time: "14:45", event: "Isolated SEC-WKS-042 from network" }, { time: "14:50", event: "Forensic imaging initiated" }], evidence: ["Memory dump of SEC-WKS-042", "Network pcap — C2 traffic captured", "Process creation logs: winword.exe → powershell.exe"], mitreMapping: ["T1059.001", "T1021", "T1071"] },
  { id: "inc-002", title: "Ransomware Outbreak — FS-02 File Server", description: "Mass file encryption event detected on FS-02. Svchost.exe from non-standard path encrypted 2,300+ files. Ransom note dropped: README_CrypTorch.txt. VSS deleted. Contained via EDR isolation.", severity: "critical", status: "contained", source: "demo", openedAt: "2026-07-04 13:15 UTC", updatedAt: "2026-07-04 13:45 UTC", category: "Ransomware", affectedAssets: ["FS-02", "SEC-WKS-038", "SEC-WKS-039"], assignedTeam: "SOC Tier 3", timeline: [{ time: "13:15", event: "Mass file rename alert triggered" }, { time: "13:18", event: "Ransomware confirmed — CrypTorch variant" }, { time: "13:22", event: "FS-02 isolated from network" }, { time: "13:25", event: "Volume shadow copy deletion detected at 13:16" }, { time: "13:30", event: "Affected workstations isolated" }, { time: "13:45", event: "Incident contained — no further encryption" }], evidence: ["2,340 encrypted files on FS-02", "Ransom note: README_CrypTorch.txt", "Process: svchost.exe from C:\\Users\\Public\\"], mitreMapping: ["T1486", "T1490", "T1070"] },
  { id: "inc-003", title: "Data Exfiltration via DNS Tunneling", description: "Anomalous DNS query volume from DEV-07 to a single domain. Subdomain patterns consistent with DNS tunneling tool (dnscat2, Iodine). Over 15K queries in 5 minutes.", severity: "high", status: "investigating", source: "demo", openedAt: "2026-07-04 12:45 UTC", updatedAt: "2026-07-04 13:10 UTC", category: "Data Exfiltration", affectedAssets: ["DEV-07", "DNS-01"], assignedTeam: "SOC Tier 2", timeline: [{ time: "12:45", event: "DNS volume anomaly detected by NDR" }, { time: "12:50", event: "DNS tunneling analysis initiated" }, { time: "13:00", event: "Domain sinkholed via DNS firewall" }, { time: "13:10", event: "DEV-07 isolated for forensic analysis" }], evidence: ["15,342 DNS queries in 5 min", "Base64-encoded subdomain content", "Tool signature: dnscat2-like protocol"], mitreMapping: ["T1048", "T1572"] },
  { id: "inc-004", title: "Phishing Campaign — Finance Team Targeting", description: "Coordinated phishing campaign targeting 12 finance team members with fake M365 login pages. 47 emails blocked by gateway. 2 users reported before clicking.", severity: "medium", status: "contained", source: "demo", openedAt: "2026-07-04 10:05 UTC", updatedAt: "2026-07-04 10:30 UTC", category: "Phishing", affectedAssets: ["Finance Team (12 users)", "Email Gateway-02"], assignedTeam: "SOC Tier 1", timeline: [{ time: "10:05", event: "Phishing campaign detected by ESG" }, { time: "10:10", event: "All malicious emails quarantined" }, { time: "10:15", event: "Phishing domain blocked at DNS" }, { time: "10:30", event: "User awareness notification sent" }], evidence: ["47 blocked emails with malicious links", "Domain: microsoft-security-portal[.]org", "2 users reported via PhishAlarm button"], mitreMapping: ["T1566.002"] },
  { id: "inc-005", title: "Service Account Compromise — Privilege Escalation Attempt", description: "Backup service account SRV-BACKUP exhibited impossible travel (login from 2 geographic regions within 5 min) and attempted unauthorized group membership change.", severity: "critical", status: "investigating", source: "demo", openedAt: "2026-07-04 09:30 UTC", updatedAt: "2026-07-04 09:55 UTC", category: "Account Compromise", affectedAssets: ["DC-01", "DC-02", "SRV-BACKUP"], assignedTeam: "SOC Tier 3", timeline: [{ time: "09:30", event: "Privileged group modification attempt blocked" }, { time: "09:35", event: "Impossible travel detected" }, { time: "09:40", event: "Account SRV-BACKUP disabled" }, { time: "09:50", event: "Password reset initiated for all service accounts" }], evidence: ["Login from IP 10.10.15.42 (US) and 91.121.87.33 (EU) in 5 min", "Attempted: Add to Domain Admins group"], mitreMapping: ["T1068", "T1078"] },
];

// ─── TIMELINE EVENTS ────────────────────────────────────────────────────

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "tl-1", date: "2026-07-04", title: "Global Command Center Launch", description: "Chapter 33 — SOC, NOC, Threat Intel, OSINT Fusion dashboard activated", category: "milestone", icon: "shield", source: "live" },
  { id: "tl-2", date: "2026-07-03", title: "Cyber Nexus X Platform", description: "Shared intelligence platform with Mission Control dashboards", category: "project", icon: "code", source: "live" },
  { id: "tl-3", date: "2026-07-02", title: "Cyber Nexus OS Desktop", description: "Desktop environment with window management, terminal, file explorer", category: "project", icon: "code", source: "live" },
  { id: "tl-4", date: "2026-07-01", title: "Security Architecture Studio", description: "Threat modeling, STRIDE analysis, attack trees, controls library", category: "architecture", icon: "shield", source: "live" },
  { id: "tl-5", date: "2026-06-30", title: "AI Project Architect", description: "AI-powered project generator with architecture planning", category: "project", icon: "code", source: "live" },
  { id: "tl-6", date: "2026-06-28", title: "Knowledge Wiki Launch", description: "43 articles, cheat sheets, MITRE/OWASP references, learning paths", category: "milestone", icon: "book", source: "live" },
  { id: "tl-7", date: "2026-06-27", title: "Achievement System", description: "30 badges, missions, trophies, portfolio passport", category: "milestone", icon: "trophy", source: "live" },
  { id: "tl-8", date: "2026-06-26", title: "Knowledge Graph", description: "79 nodes, 128 edges across 13 entity types", category: "architecture", icon: "network", source: "live" },
  { id: "tl-9", date: "2026-06-25", title: "Home Cyber Lab", description: "12 VMs, 9 containers, AD, cloud, security stack", category: "project", icon: "server", source: "live" },
  { id: "tl-10", date: "2026-06-24", title: "CTF Command Center", description: "34 challenges, 7 platforms, learning roadmap", category: "ctf", icon: "flag", source: "live" },
  { id: "tl-11", date: "2026-06-20", title: "Career Intelligence Module", description: "Role intelligence, skill gap analysis, career analytics", category: "milestone", icon: "chart", source: "live" },
  { id: "tl-12", date: "2026-06-15", title: "Competency Matrix Engine", description: "Skill progression tracking with weighted skill scores", category: "learning", icon: "brain", source: "live" },
  { id: "tl-13", date: "2026-06-10", title: "GitHub Intelligence Dashboard", description: "Repository analytics, commit patterns, language distribution", category: "project", icon: "github", source: "live" },
  { id: "tl-14", date: "2026-06-05", title: "Interview Simulator", description: "AI-powered technical interview practice with scoring", category: "project", icon: "robot", source: "live" },
  { id: "tl-15", date: "2026-06-01", title: "SOC Dashboard Redesign", description: "Real-time metrics, alert timelines, MITRE mapping integration", category: "architecture", icon: "dashboard", source: "live" },
  { id: "tl-16", date: "2026-05-25", title: "Threat Intelligence Module", description: "CVE database, threat actors, malware families, campaigns", category: "project", icon: "shield", source: "live" },
  { id: "tl-17", date: "2026-05-20", title: "Attack Map Visualization", description: "Global threat heatmap with real-time animation", category: "architecture", icon: "globe", source: "live" },
  { id: "tl-18", date: "2026-05-15", title: "Cyber Persona AI Twin", description: "AI-powered digital twin with portfolio knowledge", category: "project", icon: "brain", source: "live" },
  { id: "tl-19", date: "2026-05-10", title: "OSCP Certification Completed", description: "Offensive Security Certified Professional", category: "certification", icon: "certificate", source: "historical" },
  { id: "tl-20", date: "2026-05-01", title: "Career Timeline", description: "Interactive professional journey visualization", category: "milestone", icon: "history", source: "live" },
  { id: "tl-21", date: "2026-04-15", title: "TryHackMe Top 1% Achievement", description: "Ranked in top 1% on TryHackMe platform", category: "ctf", icon: "flag", source: "historical" },
  { id: "tl-22", date: "2026-04-01", title: "AI Security Research Paper", description: "Published research on LLM-powered SIEM correlation techniques", category: "research", icon: "book", source: "historical" },
  { id: "tl-23", date: "2026-03-15", title: "Home Lab v2 Expansion", description: "Added Wazuh, Splunk, ELK stack to home lab infrastructure", category: "architecture", icon: "server", source: "historical" },
  { id: "tl-24", date: "2026-03-01", title: "Portfolio v3 Launch", description: "Complete rewrite with Liquid Glass design system", category: "milestone", icon: "code", source: "historical" },
];

// ─── GLOBAL STATS ───────────────────────────────────────────────────────

export interface GlobalStats {
  totalProjects: number;
  totalCertifications: number;
  totalSkills: number;
  totalCTFChallenges: number;
  totalLabVMs: number;
  totalBlogPosts: number;
  totalWikiArticles: number;
  totalAchievements: number;
  totalGithubRepos: number;
  uptime: string;
  version: string;
}

export const GLOBAL_STATS: GlobalStats = {
  totalProjects: 10,
  totalCertifications: 6,
  totalSkills: 16,
  totalCTFChallenges: 34,
  totalLabVMs: 12,
  totalBlogPosts: 8,
  totalWikiArticles: 43,
  totalAchievements: 30,
  totalGithubRepos: 14,
  uptime: "99.98%",
  version: "3.0.0",
};

// ─── COMMAND PALETTE COMMANDS ───────────────────────────────────────────

export interface PaletteCommand {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  href?: string;
  action?: string;
}

export const PALETTE_COMMANDS: PaletteCommand[] = [
  { id: "cmd-1", label: "Open SOC Dashboard", category: "Navigate", shortcut: "G S", href: "/dashboard" },
  { id: "cmd-2", label: "Search CVEs", category: "Search", shortcut: "G C", href: "/command-center?panel=threat" },
  { id: "cmd-3", label: "Launch Knowledge Wiki", category: "Navigate", shortcut: "G W", href: "/wiki" },
  { id: "cmd-4", label: "Find Project", category: "Search", shortcut: "G P", href: "/projects" },
  { id: "cmd-5", label: "Open Resume", category: "Navigate", shortcut: "G R", href: "/resume" },
  { id: "cmd-6", label: "Switch Theme", category: "System", shortcut: "G T", action: "theme" },
  { id: "cmd-7", label: "Generate Report", category: "Action", shortcut: "G G", action: "report" },
  { id: "cmd-8", label: "Toggle Focus Mode", category: "System", shortcut: "G F", action: "focus" },
  { id: "cmd-9", label: "Open AI Chat", category: "System", shortcut: "G A", action: "ai" },
  { id: "cmd-10", label: "Toggle Recruiter Mode", category: "System", shortcut: "G H", action: "recruiter" },
  { id: "cmd-11", label: "View CTF Challenges", category: "Navigate", href: "/ctf-command-center" },
  { id: "cmd-12", label: "Open Infrastructure Map", category: "Navigate", action: "infra-map" },
  { id: "cmd-13", label: "View Active Alerts", category: "Search", action: "alerts" },
  { id: "cmd-14", label: "Knowledge Graph", category: "Navigate", href: "/knowledge-graph" },
  { id: "cmd-15", label: "Network Operations Center", category: "Navigate", action: "noc" },
  { id: "cmd-16", label: "Cyber Lab", category: "Navigate", href: "/cyber-lab" },
  { id: "cmd-17", label: "Achievements", category: "Navigate", href: "/achievements" },
  { id: "cmd-18", label: "Career Analytics", category: "Navigate", href: "/career-analytics" },
  { id: "cmd-19", label: "Threat Intelligence", category: "Navigate", action: "threat-intel" },
  { id: "cmd-20", label: "Interview Simulator", category: "Navigate", href: "/interview-simulator" },
];

// ─── TERMINAL COMMANDS ──────────────────────────────────────────────────

export interface TermCommand {
  command: string;
  description: string;
  usage: string;
  handler: (args: string[]) => { text: string; className?: string }[];
}

export function getTerminalResponse(input: string): { text: string; className?: string }[] {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case "help":
      return [
        { text: "── Global Command Center Terminal ──", className: "text-cyan-400 font-bold" },
        { text: "help        — Show available commands", className: "text-green-400" },
        { text: "status      — Display system status", className: "text-green-400" },
        { text: "alerts      — List recent security alerts", className: "text-green-400" },
        { text: "cves        — Show critical CVEs", className: "text-green-400" },
        { text: "threats     — Display active threat actors", className: "text-green-400" },
        { text: "metrics     — Show NOC metrics", className: "text-green-400" },
        { text: "incidents   — List active incidents", className: "text-green-400" },
        { text: "timeline    — Show mission timeline", className: "text-green-400" },
        { text: "search <q>  — Search knowledge base", className: "text-green-400" },
        { text: "open <page> — Navigate to a page", className: "text-green-400" },
        { text: "clear       — Clear terminal", className: "text-green-400" },
        { text: "── Type any command to begin ──", className: "text-cyan-400 font-bold" },
      ];
    case "status":
      return [
        { text: "╔══════════════════════════════════════╗", className: "text-cyan-400" },
        { text: "║  CYBER NEXUS COMMAND CENTER STATUS   ║", className: "text-cyan-400 font-bold" },
        { text: "╚══════════════════════════════════════╝", className: "text-cyan-400" },
        { text: "", className: "" },
        { text: "System Status:  ONLINE", className: "text-green-400" },
        { text: "Uptime:         99.97%", className: "text-green-400" },
        { text: "Open Incidents: 5", className: SOC_ALERTS.filter(a => a.status === "open" || a.status === "investigating").length > 3 ? "text-amber-400" : "text-green-400" },
        { text: "Threat Level:   Elevated", className: "text-amber-400" },
        { text: "AI Analyst:     Online", className: "text-green-400" },
        { text: "Portfolio:      v3.0.0", className: "text-blue-400" },
        { text: "Last Updated:   " + new Date().toUTCString(), className: "text-gray-400" },
      ];
    case "alerts":
      return [
        { text: "── Recent Security Alerts ──", className: "text-cyan-400 font-bold" },
        ...SOC_ALERTS.slice(0, 6).map(a => ({
          text: `[${a.severity.toUpperCase()}] ${a.title} — ${a.timestamp}`,
          className: a.severity === "critical" ? "text-red-400" : a.severity === "high" ? "text-amber-400" : "text-yellow-400" as string,
        })),
        { text: `── ${SOC_ALERTS.length} total alerts · ${SOC_ALERTS.filter(a => a.severity === "critical").length} critical ──`, className: "text-cyan-400 font-bold" },
      ];
    case "cves":
      return [
        { text: "── Critical CVEs ──", className: "text-cyan-400 font-bold" },
        ...CVE_SUMMARIES.filter(c => c.severity === "critical").map(c => ({
          text: `${c.cveId} (CVSS ${c.cvss}): ${c.title}`,
          className: "text-red-400" as string,
        })),
        { text: "", className: "" },
        { text: `See /threat-intel for full CVE database`, className: "text-gray-400" },
      ];
    case "threats":
      return [
        { text: "── Active Threat Actors ──", className: "text-cyan-400 font-bold" },
        ...THREAT_ACTOR_SUMMARIES.map(t => ({
          text: `${t.name} — [${t.type}] ${t.motivation} — ${t.recentActivity}`,
          className: "text-amber-400" as string,
        })),
      ];
    case "metrics":
      return [
        { text: "── NOC Metrics ──", className: "text-cyan-400 font-bold" },
        ...NOC_METRICS.filter(m => m.status !== "operational").map(m => ({
          text: `⚠ ${m.name}: ${m.value} ${m.unit} — Status: ${m.status.toUpperCase()}`,
          className: "text-amber-400" as string,
        })),
        { text: "", className: "" },
        { text: `All other systems operational`, className: "text-green-400" },
      ];
    case "incidents":
      return [
        { text: "── Active Incidents ──", className: "text-cyan-400 font-bold" },
        ...INCIDENTS.filter(i => i.status !== "closed").map(i => ({
          text: `[${i.severity.toUpperCase()}] ${i.title} (${i.status})`,
          className: i.severity === "critical" ? "text-red-400" : "text-amber-400" as string,
        })),
        { text: "", className: "" },
        { text: `${INCIDENTS.filter(i => i.status !== "closed").length} active incidents`, className: "text-gray-400" },
      ];
    case "timeline":
      return [
        { text: "── Mission Timeline (Last 10 Events) ──", className: "text-cyan-400 font-bold" },
        ...TIMELINE_EVENTS.slice(0, 10).map(e => ({
          text: `${e.date} — ${e.title}`,
          className: "text-blue-400" as string,
        })),
      ];
    case "search":
      if (args.length === 0) return [{ text: "Usage: search <query>", className: "text-amber-400" }];
      const query = args.join(" ").toLowerCase();
      const results = [
        ...TIMELINE_EVENTS.filter(e => e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query)).map(e => ({ text: `[Timeline] ${e.title} — ${e.date}`, className: "text-blue-400" as string })),
        ...SOC_ALERTS.filter(a => a.title.toLowerCase().includes(query)).map(a => ({ text: `[SOC Alert] ${a.title}`, className: "text-red-400" as string })),
      ];
      if (results.length === 0) return [{ text: `No results for "${query}"`, className: "text-gray-400" }];
      return [{ text: `── Search Results for "${query}" ──`, className: "text-cyan-400 font-bold" }, ...results.slice(0, 10)];
    case "open":
      if (args.length === 0) return [{ text: "Usage: open <page>", className: "text-amber-400" }];
      const pageMap: Record<string, string> = {
        "soc": "/dashboard", "wiki": "/wiki", "projects": "/projects", "resume": "/resume",
        "cves": "/command-center?panel=threat", "lab": "/cyber-lab", "ctf": "/ctf-command-center",
        "graph": "/knowledge-graph", "achievements": "/achievements", "blog": "/blog",
        "career": "/career-analytics", "github": "/github-intelligence",
      };
      const target = pageMap[args[0].toLowerCase()];
      if (target) {
        if (typeof window !== "undefined") window.location.href = target;
        return [{ text: `Navigating to ${target}...`, className: "text-green-400" }];
      }
      return [{ text: `Unknown page: ${args[0]}. Type 'help' for available commands.`, className: "text-amber-400" }];
    case "clear":
      return [];
    default:
      return [
        { text: `Unknown command: ${cmd}`, className: "text-red-400" },
        { text: "Type 'help' for available commands.", className: "text-gray-400" },
      ];
  }
}

// ─── AI ANALYST SUGGESTIONS ─────────────────────────────────────────────

export interface AiSuggestion {
  question: string;
  answer: string;
}

export const AI_SUGGESTIONS: AiSuggestion[] = [
  { question: "What's the current threat level?", answer: "Current threat level is **Elevated**. There are 5 open incidents being tracked: 1 ransomware containment, 1 lateral movement investigation, 1 possible data exfiltration, 1 phishing campaign, and 1 account compromise. Critical CVEs affecting Kubernetes and OpenSSL remain unpatched in some environments." },
  { question: "Summarize recent SOC alerts", answer: "In the last 24 hours, the SOC has generated **12 alerts**. Of these, **3 are critical** (PowerShell lateral movement, ransomware encryption, scheduled task on DC). **4 are high** (DNS tunneling, RDP brute force, phishing campaign, malicious IP connection). **3 medium** and **2 low** severity. Current investigation queue: 4 alerts under active investigation." },
  { question: "How is the infrastructure performing?", answer: "Infrastructure health is **98.5%** overall. All 24 VMs are online. 18/19 containers running (one Wazuh container degraded with queue backlog). Average latency 12ms. Packet loss 0.02%. Bandwidth usage 342 Mbps. **One degraded component**: Wazuh EDR node has a processing backlog of approximately 2,300 events." },
  { question: "What projects are most relevant to current threats?", answer: "Current active threats map to these portfolio projects: **Sentinel AI** (SIEM correlation for all alert types), **NetDefend** (network defense for DNS tunneling, brute force), **Forensic Analyzer** (evidence collection for ransomware incident), **CloudSec Enforcer** (IAM hardening for account compromise), **PhishShield** (phishing campaign detection), **RedOps** (lateral movement simulation and detection)." },
  { question: "Show my career progress", answer: "You've completed **6 certifications** (including OSCP), built **10 portfolio projects**, solved **34 CTF challenges** across 7 platforms, achieved **30 badges/achievements**, and authored **43 wiki articles**. Your skill tree covers 16 core competencies across network defense, SIEM, cloud security, forensics, and red teaming. Current learning path: Advanced Cloud Security Architecture." },
  { question: "What should I learn next?", answer: "Based on current threat landscape and your skill gaps, I recommend: **1. Cloud Security** — Kubernetes hardening, cloud IAM deep dive (relevant to CVE-2026-34567). **2. OT/ICS Security** — Growing threat from Lunar Shadow, high demand skill. **3. AI Security** — LLM security, adversarial ML (emerging field). **4. Purple Team Operations** — Integrating your red and blue team skills for adversary emulation." },
];
