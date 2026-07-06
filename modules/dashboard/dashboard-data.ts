import type { SOCMetric, SOCAlert, SOCIncident, MitreTechnique, EndpointInfo, ThreatIntel, TimelineEvent, NetworkFlow, DashboardWidget } from "@/types";

export const SAMPLE_ALERTS: SOCAlert[] = [
  { id: "ALT-001", severity: "critical", title: "Suspicious PowerShell Execution", description: "PowerShell process launched with obfuscated arguments from non-admin context", timestamp: "2 min ago", sourceIp: "10.0.1.45", destIp: "10.0.2.100", sourceCountry: "Internal", destCountry: "Internal", sourceFlag: "🏢", destFlag: "🏢", mitreId: "T1059.001", mitreName: "Command and Scripting Interpreter", status: "investigating", analyst: "Analyst-01", confidence: 95, protocol: "WinRM", port: 5985 },
  { id: "ALT-002", severity: "critical", title: "Ransomware Encryption Detected", description: "File encryption activity pattern matching LockBit 3.0 on file server", timestamp: "5 min ago", sourceIp: "10.0.1.88", destIp: "10.0.3.50", sourceCountry: "Internal", destCountry: "Internal", sourceFlag: "🏢", destFlag: "🏢", mitreId: "T1486", mitreName: "Data Encrypted for Impact", status: "investigating", analyst: "SOC-Lead", confidence: 98, protocol: "SMB", port: 445 },
  { id: "ALT-003", severity: "high", title: "DDoS Attack on DNS Infrastructure", description: "Amplified DNS query flood targeting primary DNS servers", timestamp: "7 min ago", sourceIp: "45.33.32.xx", destIp: "203.0.113.10", sourceCountry: "US", destCountry: "Internal", sourceFlag: "🇺🇸", destFlag: "🏢", mitreId: "T1498", mitreName: "Network Denial of Service", status: "contained", analyst: "Analyst-03", confidence: 92, protocol: "DNS", port: 53 },
  { id: "ALT-004", severity: "high", title: "SQL Injection on Web Application", description: "Time-based blind SQL injection detected on login endpoint", timestamp: "10 min ago", sourceIp: "103.235.46.xx", destIp: "10.0.10.5", sourceCountry: "CN", destCountry: "Internal", sourceFlag: "🇨🇳", destFlag: "🏢", mitreId: "T1190", mitreName: "Exploit Public-Facing Application", status: "new", analyst: "Unassigned", confidence: 88, protocol: "HTTPS", port: 443 },
  { id: "ALT-005", severity: "medium", title: "Brute Force Attack on SSH Service", description: "1,200+ failed SSH authentication attempts in 5 minutes", timestamp: "14 min ago", sourceIp: "91.121.87.xx", destIp: "10.0.1.22", sourceCountry: "FR", destCountry: "Internal", sourceFlag: "🇫🇷", destFlag: "🏢", mitreId: "T1110", mitreName: "Brute Force", status: "contained", analyst: "Automated", confidence: 85, protocol: "SSH", port: 22 },
  { id: "ALT-006", severity: "critical", title: "Data Exfiltration via DNS Tunneling", description: "Unusual DNS query volume to unknown domain - potential data exfiltration", timestamp: "18 min ago", sourceIp: "10.0.2.15", destIp: "185.220.101.xx", sourceCountry: "Internal", destCountry: "RU", sourceFlag: "🏢", destFlag: "🇷🇺", mitreId: "T1048", mitreName: "Exfiltration Over Alternative Protocol", status: "investigating", analyst: "Analyst-02", confidence: 93, protocol: "DNS", port: 53 },
  { id: "ALT-007", severity: "medium", title: "Phishing Campaign Email Detection", description: "Spear-phishing email with malicious attachment targeting finance team", timestamp: "22 min ago", sourceIp: "217.160.0.xx", destIp: "10.0.5.100", sourceCountry: "DE", destCountry: "Internal", sourceFlag: "🇩🇪", destFlag: "🏢", mitreId: "T1566", mitreName: "Phishing", status: "new", analyst: "Unassigned", confidence: 82, protocol: "SMTP", port: 25 },
  { id: "ALT-008", severity: "low", title: "Port Scan Detection", description: "Horizontal port scan across subnet 10.0.1.0/24", timestamp: "26 min ago", sourceIp: "185.225.15.xx", destIp: "10.0.1.1-254", sourceCountry: "NL", destCountry: "Internal", sourceFlag: "🇳🇱", destFlag: "🏢", mitreId: "T1046", mitreName: "Network Service Scanning", status: "resolved", analyst: "Automated", confidence: 76, protocol: "TCP", port: 0 },
  { id: "ALT-009", severity: "high", title: "Malware C2 Beaconing", description: "Periodic beaconing to known malicious C2 infrastructure", timestamp: "30 min ago", sourceIp: "10.0.4.33", destIp: "5.188.62.xx", sourceCountry: "Internal", destCountry: "SE", sourceFlag: "🏢", destFlag: "🇸🇪", mitreId: "T1071", mitreName: "Application Layer Protocol", status: "investigating", analyst: "Analyst-03", confidence: 91, protocol: "HTTPS", port: 443 },
  { id: "ALT-010", severity: "medium", title: "Privilege Escalation via Token Manipulation", description: "SeDebugPrivilege abuse detected on domain controller", timestamp: "35 min ago", sourceIp: "10.0.1.200", destIp: "10.0.0.10", sourceCountry: "Internal", destCountry: "Internal", sourceFlag: "🏢", destFlag: "🏢", mitreId: "T1134", mitreName: "Access Token Manipulation", status: "new", analyst: "Unassigned", confidence: 87, protocol: "RPC", port: 135 },
];

export const INCIDENTS: SOCIncident[] = [
  {
    id: "INC-001", title: "LockBit Ransomware Outbreak", severity: "critical", status: "investigating",
    created: "2026-07-04T02:15:00Z", updated: "2026-07-04T02:45:00Z",
    affectedAssets: ["FS-01 (File Server)", "DC-02 (Domain Controller)", "APP-05 (App Server)"],
    mitreTechnique: "T1486", mitreTactic: "Impact",
    detectionRule: "Ransomware - File Encryption Pattern",
    assignedAnalyst: "SOC-Lead",
    description: "LockBit 3.0 ransomware variant detected encrypting files on primary file server. Initial access via compromised VPN credential. Propagating via PsExec.",
    timeline: [
      { time: "02:15", event: "Alert triggered - file encryption detected" },
      { time: "02:18", event: "Analyst assigned - investigating scope" },
      { time: "02:25", event: "Affected systems isolated from network" },
      { time: "02:35", event: "IOCs extracted and shared with threat intel" },
      { time: "02:45", event: "Containment in progress - forensic imaging started" },
    ],
    evidence: ["Process dump: ransomware.exe", "Network logs: C2 communication", "Registry changes: Run keys modified"],
    recommendedActions: ["Isolate all affected systems", "Reset compromised credentials", "Deploy EDR quarantine rules", "Initiate backup restoration"],
  },
  {
    id: "INC-002", title: "DNS Data Exfiltration Campaign", severity: "critical", status: "investigating",
    created: "2026-07-04T01:50:00Z", updated: "2026-07-04T02:30:00Z",
    affectedAssets: ["WKST-15 (Workstation)", "Proxy-01 (Web Proxy)"],
    mitreTechnique: "T1048", mitreTactic: "Exfiltration",
    detectionRule: "DNS Tunneling Anomaly Detection",
    assignedAnalyst: "Analyst-02",
    description: "Sustained DNS tunneling detected from workstation WKST-15. 50K+ DNS queries to suspicious domain over 2 hours. Data encoding detected in subdomain fields.",
    timeline: [
      { time: "01:50", event: "DNS anomaly alert triggered" },
      { time: "01:55", event: "Traffic capture initiated on DNS server" },
      { time: "02:10", event: "Domain correlation - linked to known threat actor" },
      { time: "02:25", event: "Workstation isolated - memory acquisition started" },
      { time: "02:30", event: "DNS sinkhole configured for malicious domain" },
    ],
    evidence: ["DNS logs: 52,341 queries to malicious domain", "Memory dump: WKST-15", "Network PCAP: DNS tunnel traffic"],
    recommendedActions: ["Block malicious domain at firewall", "Scan workstation for persistence", "Review VPN logs for source of compromise"],
  },
  {
    id: "INC-003", title: "Web Application SQL Injection", severity: "high", status: "new",
    created: "2026-07-04T02:20:00Z", updated: "2026-07-04T02:20:00Z",
    affectedAssets: ["WEB-01 (Web Server)", "DB-01 (Database)"],
    mitreTechnique: "T1190", mitreTactic: "Initial Access",
    detectionRule: "WAF - SQL Injection Signature",
    assignedAnalyst: "Unassigned",
    description: "Time-based blind SQL injection attempted on login endpoint. WAF blocked the majority of attempts but some may have bypassed due to encoding variations.",
    timeline: [
      { time: "02:20", event: "Alert triggered - SQL injection detected by WAF" },
    ],
    evidence: ["WAF logs: 847 blocked requests", "Web server logs: Source IP 103.235.46.xx"],
    recommendedActions: ["Review web server logs for successful queries", "Deploy parameterized queries", "Rate-limit login endpoint"],
  },
];

export const MITRE_TECHNIQUES: MitreTechnique[] = [
  { tactic: "Initial Access", techniqueId: "T1190", techniqueName: "Exploit Public-Facing Application", coverage: "extensive", detectionEnabled: true, relatedIncidents: 3, description: "Attacker exploits a vulnerability in an Internet-facing application" },
  { tactic: "Initial Access", techniqueId: "T1566", techniqueName: "Phishing", coverage: "comprehensive", detectionEnabled: true, relatedIncidents: 8, description: "Spear-phishing with malicious attachments or links" },
  { tactic: "Execution", techniqueId: "T1059.001", techniqueName: "PowerShell", coverage: "extensive", detectionEnabled: true, relatedIncidents: 12, description: "Adversaries may abuse PowerShell for execution" },
  { tactic: "Execution", techniqueId: "T1204", techniqueName: "User Execution", coverage: "partial", detectionEnabled: true, relatedIncidents: 5, description: "User executes malicious file delivered via phishing" },
  { tactic: "Persistence", techniqueId: "T1547", techniqueName: "Boot or Logon Autostart", coverage: "partial", detectionEnabled: false, relatedIncidents: 2, description: "Malicious code added to startup folders or registry" },
  { tactic: "Privilege Escalation", techniqueId: "T1134", techniqueName: "Access Token Manipulation", coverage: "extensive", detectionEnabled: true, relatedIncidents: 4, description: "Token manipulation for privilege escalation" },
  { tactic: "Privilege Escalation", techniqueId: "T1055", techniqueName: "Process Injection", coverage: "extensive", detectionEnabled: true, relatedIncidents: 6, description: "Code injection into running processes" },
  { tactic: "Defense Evasion", techniqueId: "T1027", techniqueName: "Obfuscated Files or Info", coverage: "partial", detectionEnabled: true, relatedIncidents: 9, description: "Obfuscation to evade detection" },
  { tactic: "Defense Evasion", techniqueId: "T1070", techniqueName: "Indicator Removal", coverage: "none", detectionEnabled: false, relatedIncidents: 1, description: "Clearing event logs or forensic artifacts" },
  { tactic: "Credential Access", techniqueId: "T1110", techniqueName: "Brute Force", coverage: "comprehensive", detectionEnabled: true, relatedIncidents: 15, description: "Brute force attacks against authentication" },
  { tactic: "Credential Access", techniqueId: "T1003", techniqueName: "OS Credential Dumping", coverage: "extensive", detectionEnabled: true, relatedIncidents: 7, description: "Dumping credentials from LSASS or SAM" },
  { tactic: "Discovery", techniqueId: "T1087", techniqueName: "Account Discovery", coverage: "partial", detectionEnabled: true, relatedIncidents: 4, description: "Enumerating accounts and permissions" },
  { tactic: "Discovery", techniqueId: "T1046", techniqueName: "Network Service Scanning", coverage: "extensive", detectionEnabled: true, relatedIncidents: 11, description: "Scanning for open ports and services" },
  { tactic: "Lateral Movement", techniqueId: "T1021", techniqueName: "Remote Services", coverage: "extensive", detectionEnabled: true, relatedIncidents: 6, description: "Using RDP, WinRM, or SSH for lateral movement" },
  { tactic: "Lateral Movement", techniqueId: "T1550", techniqueName: "Use Alternate Auth Material", coverage: "partial", detectionEnabled: true, relatedIncidents: 3, description: "Pass-the-hash or pass-the-ticket attacks" },
  { tactic: "Collection", techniqueId: "T1005", techniqueName: "Data from Local System", coverage: "partial", detectionEnabled: false, relatedIncidents: 2, description: "Collecting sensitive data from local system" },
  { tactic: "Command & Control", techniqueId: "T1071", techniqueName: "Application Layer Protocol", coverage: "extensive", detectionEnabled: true, relatedIncidents: 10, description: "C2 communication over HTTP/HTTPS/DNS" },
  { tactic: "Exfiltration", techniqueId: "T1048", techniqueName: "Exfiltration Over Alternative Protocol", coverage: "extensive", detectionEnabled: true, relatedIncidents: 4, description: "Data exfiltration over DNS or other protocols" },
  { tactic: "Impact", techniqueId: "T1486", techniqueName: "Data Encrypted for Impact", coverage: "extensive", detectionEnabled: true, relatedIncidents: 3, description: "Ransomware file encryption" },
];

export const ENDPOINTS: EndpointInfo[] = [
  { hostname: "DC-01", os: "Windows Server 2022", health: "healthy", riskScore: 12, lastSeen: "1 min ago", alerts: 0, patches: 0, ip: "10.0.0.10" },
  { hostname: "FS-01", os: "Windows Server 2022", health: "warning", riskScore: 45, lastSeen: "1 min ago", alerts: 2, patches: 1, ip: "10.0.3.50" },
  { hostname: "WEB-01", os: "Ubuntu 24.04 LTS", health: "healthy", riskScore: 18, lastSeen: "2 min ago", alerts: 1, patches: 0, ip: "10.0.10.5" },
  { hostname: "DB-01", os: "RHEL 9.4", health: "healthy", riskScore: 8, lastSeen: "1 min ago", alerts: 0, patches: 0, ip: "10.0.10.10" },
  { hostname: "WKST-15", os: "Windows 11 Enterprise", health: "critical", riskScore: 88, lastSeen: "5 min ago", alerts: 4, patches: 3, ip: "10.0.2.15" },
  { hostname: "APP-05", os: "Windows Server 2022", health: "warning", riskScore: 52, lastSeen: "3 min ago", alerts: 2, patches: 1, ip: "10.0.5.50" },
  { hostname: "PROXY-01", os: "Ubuntu 24.04 LTS", health: "healthy", riskScore: 22, lastSeen: "1 min ago", alerts: 0, patches: 0, ip: "10.0.0.20" },
  { hostname: "FW-01", os: "Fortinet FortiOS 7.4", health: "healthy", riskScore: 5, lastSeen: "0 min ago", alerts: 0, patches: 0, ip: "10.0.0.1" },
];

export const THREAT_INTEL: ThreatIntel[] = [
  { type: "cve", id: "CVE-2026-1234", title: "Microsoft Exchange Remote Code Execution", description: "Critical RCE vulnerability in Exchange Server allowing unauthenticated attackers to execute arbitrary commands.", date: "2026-07-02", severity: "critical", source: "NVD", related: ["T1190", "Exchange Servers"] },
  { type: "cve", id: "CVE-2026-5678", title: "Linux Kernel Privilege Escalation", description: "Use-after-free vulnerability in Linux kernel's netfilter subsystem allowing local privilege escalation.", date: "2026-06-28", severity: "high", source: "MITRE", related: ["T1068", "Linux Servers"] },
  { type: "actor", id: "APT-42", title: "APT42 — Phantom Sentinel", description: "Advanced persistent threat group linked to nation-state-sponsored cyber espionage campaigns targeting defense contractors.", date: "2026-06-25", severity: "critical", source: "CrowdStrike", related: ["T1566", "T1059.001", "T1048"] },
  { type: "actor", id: "SILENT-BOUNTY", title: "Silent Bounty — Ransomware Gang", description: "Financially motivated ransomware group operating the LockBit 3.0 variant with focus on enterprise targets.", date: "2026-06-20", severity: "high", source: "Mandiant", related: ["T1486", "T1021"] },
  { type: "malware", id: "BEACON-NG", title: "BeaconNG — C2 Framework", description: "Next-generation command and control framework with DNS-over-HTTPS tunneling and encrypted C2 channels.", date: "2026-06-15", severity: "critical", source: "Recorded Future", related: ["T1071", "T1572"] },
  { type: "malware", id: "STEALTHWALKER", title: "StealthWalker — Rootkit", description: "Advanced kernel-mode rootkit using process hollowing and direct kernel object manipulation for persistence.", date: "2026-06-10", severity: "high", source: "ESET", related: ["T1055", "T1014"] },
  { type: "ioc", id: "IOC-2026-001", title: "Malicious C2 Domain Cluster", description: "Domain generation algorithm (DGA) detected generating 100+ domains daily linked to BeaconNG infrastructure.", date: "2026-06-30", severity: "high", source: "Internal", related: ["ALT-009", "T1071"] },
  { type: "ioc", id: "IOC-2026-002", title: "Suspicious Hash List", description: "SHA256 hashes for LockBit 3.0 ransomware variants identified across multiple incidents globally.", date: "2026-06-22", severity: "critical", source: "VirusTotal", related: ["INC-001", "T1486"] },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { phase: "Initial Access", description: "Compromised VPN credential used to access internal network", timestamp: "01:45", details: "Credential stuffing attack on VPN gateway succeeded using credentials from previous breach", mitreId: "T1078", status: "completed" },
  { phase: "Execution", description: "Malicious PowerShell script executed on compromised workstation", timestamp: "01:52", details: "Base64-encoded PowerShell one-liner downloaded and executed with obfuscated arguments", mitreId: "T1059.001", status: "completed" },
  { phase: "Persistence", description: "Scheduled task created for beacon persistence", timestamp: "01:58", details: "Malicious scheduled task 'SystemUpdate' created to launch beacon every 15 minutes", mitreId: "T1053.005", status: "completed" },
  { phase: "Privilege Escalation", description: "Token manipulation to gain SYSTEM privileges", timestamp: "02:05", details: "SeDebugPrivilege abused to escalate from user to SYSTEM on compromised host", mitreId: "T1134", status: "completed" },
  { phase: "Lateral Movement", description: "PsExec used to move to file server", timestamp: "02:10", details: "Using stolen credentials and PsExec to deploy ransomware payload to FS-01", mitreId: "T1021", status: "completed" },
  { phase: "Exfiltration", description: "Sensitive data staged and exfiltrated via DNS", timestamp: "02:18", details: "50K+ DNS queries encoding stolen data to external DNS server operated by attacker", mitreId: "T1048", status: "in_progress" },
  { phase: "Impact", description: "Ransomware encryption triggered", timestamp: "02:22", details: "LockBit 3.0 ransomware executed, encrypting documents and databases on file server", mitreId: "T1486", status: "in_progress" },
  { phase: "Detection", description: "EDR alert triggered — file encryption detected", timestamp: "02:25", details: "Sentinel EDR detected mass file extension changes and alerted SOC team", mitreId: "", status: "completed" },
  { phase: "Containment", description: "Affected systems isolated from network", timestamp: "02:35", details: "Network isolation applied to FS-01, DC-02, and APP-05 via firewall policy update", mitreId: "", status: "in_progress" },
  { phase: "Recovery", description: "Backup restoration initiated", timestamp: "02:50", details: "Last clean backup identified and restoration process initiated for critical systems", mitreId: "", status: "pending" },
  { phase: "Lessons Learned", description: "Post-incident review pending", timestamp: "—", details: "Full incident review to be conducted after containment and recovery completed", mitreId: "", status: "pending" },
];

export const NETWORK_FLOWS: NetworkFlow[] = [
  { direction: "inbound", allowed: 245_000, blocked: 12_400, dropped: 850, total: 258_250 },
  { direction: "outbound", allowed: 182_000, blocked: 3_200, dropped: 420, total: 185_620 },
  { direction: "internal", allowed: 520_000, blocked: 1_800, dropped: 150, total: 521_950 },
];

export const ATTACK_CATEGORIES = [
  { label: "Malware", value: 32, color: "#ef4444" },
  { label: "Phishing", value: 28, color: "#f97316" },
  { label: "Brute Force", value: 18, color: "#eab308" },
  { label: "Injection", value: 12, color: "#a855f7" },
  { label: "DoS/DDoS", value: 7, color: "#3b82f6" },
  { label: "Other", value: 3, color: "#6b7280" },
];

export const DETECTION_SOURCES = [
  { label: "EDR", value: 35, color: "#06b6d4" },
  { label: "WAF", value: 22, color: "#8b5cf6" },
  { label: "IDS/IPS", value: 18, color: "#10b981" },
  { label: "SIEM", value: 15, color: "#f59e0b" },
  { label: "Email", value: 8, color: "#ec4899" },
  { label: "Network", value: 2, color: "#6366f1" },
];

export const ALERT_TREND_DATA = [
  { day: "Mon", critical: 2, high: 5, medium: 8, low: 12 },
  { day: "Tue", critical: 1, high: 7, medium: 10, low: 15 },
  { day: "Wed", critical: 4, high: 9, medium: 6, low: 8 },
  { day: "Thu", critical: 3, high: 4, medium: 12, low: 10 },
  { day: "Fri", critical: 5, high: 8, medium: 9, low: 14 },
  { day: "Sat", critical: 2, high: 3, medium: 5, low: 7 },
  { day: "Sun", critical: 1, high: 2, medium: 4, low: 6 },
];

export const TOP_COUNTRIES = [
  { country: "Russia", flag: "🇷🇺", attacks: 1423, percent: 28 },
  { country: "China", flag: "🇨🇳", attacks: 1187, percent: 23 },
  { country: "United States", flag: "🇺🇸", attacks: 987, percent: 19 },
  { country: "Germany", flag: "🇩🇪", attacks: 523, percent: 10 },
  { country: "France", flag: "🇫🇷", attacks: 456, percent: 9 },
  { country: "Netherlands", flag: "🇳🇱", attacks: 312, percent: 6 },
  { country: "Other", flag: "🌐", attacks: 256, percent: 5 },
];

export const ANALYST_ACTIVITY = [
  { name: "SOC-Lead", assigned: 4, resolved: 2, time: "3.2m" },
  { name: "Analyst-01", assigned: 3, resolved: 1, time: "4.8m" },
  { name: "Analyst-02", assigned: 2, resolved: 0, time: "6.1m" },
  { name: "Analyst-03", assigned: 1, resolved: 1, time: "2.5m" },
  { name: "Automated", assigned: 8, resolved: 5, time: "0.8m" },
];

export const OVERVIEW_METRICS: SOCMetric[] = [
  { label: "Critical Alerts", value: "4", change: 33, status: "up", details: "3 new in last hour" },
  { label: "High Alerts", value: "12", change: 20, status: "up", details: "8 new in last hour" },
  { label: "Medium Alerts", value: "28", change: 12, status: "up", details: "15 new in last hour" },
  { label: "Low Alerts", value: "47", change: -5, status: "down", details: "22 new in last hour" },
  { label: "Total Events (24h)", value: "1.2M", change: 8, status: "up", details: "93.4K events/hour avg" },
  { label: "Blocked Attacks", value: "8,432", change: 15, status: "up", details: "12.3% increase from yesterday" },
  { label: "Open Incidents", value: "3", change: 0, status: "stable", details: "2 investigating, 1 new" },
  { label: "Resolved Incidents", value: "156", change: 5, status: "up", details: "8 resolved this week" },
  { label: "Avg Response Time", value: "4.2m", change: -22, status: "down", details: "Improved from 5.4m last week" },
  { label: "Threat Score", value: "72", change: 8, status: "up", details: "Moderate risk — elevated activity" },
];

export const WIDGET_LAYOUTS: DashboardWidget[] = [
  { id: "overview-metrics", title: "Overview Metrics", type: "metric", size: "full", data: {} },
  { id: "alert-feed", title: "Live Alert Feed", type: "feed", size: "lg", data: {} },
  { id: "incidents", title: "Active Incidents", type: "analytics", size: "md", data: {} },
  { id: "alert-trend", title: "Alert Trend (7 Days)", type: "chart", size: "md", data: {} },
  { id: "mitre-matrix", title: "MITRE ATT&CK", type: "analytics", size: "lg", data: {} },
  { id: "threat-timeline", title: "Threat Timeline", type: "analytics", size: "md", data: {} },
  { id: "attack-categories", title: "Attack Categories", type: "chart", size: "sm", data: {} },
  { id: "detection-sources", title: "Detection Sources", type: "chart", size: "sm", data: {} },
  { id: "top-countries", title: "Top Attack Sources", type: "chart", size: "sm", data: {} },
  { id: "endpoints", title: "Endpoint Status", type: "analytics", size: "md", data: {} },
  { id: "network-overview", title: "Network Traffic", type: "analytics", size: "sm", data: {} },
  { id: "threat-intel", title: "Threat Intelligence", type: "analytics", size: "md", data: {} },
  { id: "ai-assistant", title: "AI Threat Assistant", type: "analytics", size: "sm", data: {} },
  { id: "analyst-activity", title: "Analyst Activity", type: "chart", size: "sm", data: {} },
];

export const sidebarNav = [
  { id: "overview" as const, label: "Overview", icon: "radar" },
  { id: "alerts" as const, label: "Alert Feed", icon: "bell" },
  { id: "incidents" as const, label: "Incidents", icon: "shield" },
  { id: "mitre" as const, label: "MITRE ATT&CK", icon: "grid" },
  { id: "network" as const, label: "Network", icon: "activity" },
  { id: "endpoints" as const, label: "Endpoints", icon: "monitor" },
  { id: "intel" as const, label: "Threat Intel", icon: "brain" },
  { id: "timeline" as const, label: "Timeline", icon: "clock" },
];

export const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
  info: "#6b7280",
};

export const severityBg = {
  critical: "bg-red-500/10 border-red-500/25",
  high: "bg-orange-500/10 border-orange-500/25",
  medium: "bg-yellow-500/10 border-yellow-500/25",
  low: "bg-blue-500/10 border-blue-500/25",
  info: "bg-gray-500/10 border-gray-500/25",
};

export const healthConfig = {
  healthy: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25", dot: "bg-emerald-400" },
  warning: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/25", dot: "bg-yellow-400" },
  critical: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/25", dot: "bg-red-400" },
  offline: { color: "text-gray-500", bg: "bg-gray-500/10 border-gray-500/25", dot: "bg-gray-500" },
};
