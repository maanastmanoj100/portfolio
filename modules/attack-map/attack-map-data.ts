import type { AlertSeverity } from "@/types";

export interface CountryData {
  code: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  threatScore: number;
  activeAttacks: number;
  recentAttacks: number;
  topAttackType: string;
  assets: number;
}

export interface AttackEvent {
  id: string;
  type: string;
  severity: AlertSeverity;
  sourceCode: string;
  destCode: string;
  timestamp: string;
  description: string;
  mitreId: string;
  mitreName: string;
  status: "active" | "blocked" | "investigating";
  actor: string;
  protocol: string;
  port: number;
}

export interface ThreatActor {
  id: string;
  name: string;
  type: "apt" | "cybercrime" | "hacktivist";
  motivation: string;
  knownTechniques: string[];
  targetIndustries: string[];
  campaigns: string[];
  malware: string[];
  mitreIds: string[];
  description: string;
}

export interface TimelineEntry {
  time: string;
  event: string;
  attackId: string;
  severity: AlertSeverity;
}

export const COUNTRIES: CountryData[] = [
  { code: "US", name: "United States", flag: "🇺🇸", lat: 38, lng: -97, threatScore: 72, activeAttacks: 4, recentAttacks: 187, topAttackType: "Phishing", assets: 1240 },
  { code: "RU", name: "Russia", flag: "🇷🇺", lat: 55, lng: 37, threatScore: 88, activeAttacks: 8, recentAttacks: 312, topAttackType: "Ransomware", assets: 520 },
  { code: "CN", name: "China", flag: "🇨🇳", lat: 35, lng: 105, threatScore: 85, activeAttacks: 6, recentAttacks: 278, topAttackType: "SQL Injection", assets: 890 },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", lat: 51, lng: -0.1, threatScore: 45, activeAttacks: 2, recentAttacks: 98, topAttackType: "DDoS", assets: 670 },
  { code: "DE", name: "Germany", flag: "🇩🇪", lat: 51, lng: 9, threatScore: 48, activeAttacks: 2, recentAttacks: 112, topAttackType: "Brute Force", assets: 580 },
  { code: "FR", name: "France", flag: "🇫🇷", lat: 46, lng: 2, threatScore: 42, activeAttacks: 1, recentAttacks: 87, topAttackType: "Phishing", assets: 490 },
  { code: "JP", name: "Japan", flag: "🇯🇵", lat: 36, lng: 139, threatScore: 35, activeAttacks: 1, recentAttacks: 65, topAttackType: "Malware", assets: 430 },
  { code: "KR", name: "South Korea", flag: "🇰🇷", lat: 37, lng: 127, threatScore: 55, activeAttacks: 3, recentAttacks: 134, topAttackType: "DDoS", assets: 380 },
  { code: "IN", name: "India", flag: "🇮🇳", lat: 20, lng: 78, threatScore: 52, activeAttacks: 3, recentAttacks: 156, topAttackType: "Brute Force", assets: 620 },
  { code: "BR", name: "Brazil", flag: "🇧🇷", lat: -15, lng: -47, threatScore: 40, activeAttacks: 2, recentAttacks: 92, topAttackType: "Malware", assets: 310 },
  { code: "AU", name: "Australia", flag: "🇦🇺", lat: -25, lng: 135, threatScore: 28, activeAttacks: 1, recentAttacks: 54, topAttackType: "Phishing", assets: 290 },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", lat: 52, lng: 5, threatScore: 32, activeAttacks: 1, recentAttacks: 72, topAttackType: "DDoS", assets: 340 },
  { code: "SE", name: "Sweden", flag: "🇸🇪", lat: 62, lng: 15, threatScore: 22, activeAttacks: 0, recentAttacks: 41, topAttackType: "Brute Force", assets: 210 },
  { code: "SG", name: "Singapore", flag: "🇸🇬", lat: 1.3, lng: 103.8, threatScore: 38, activeAttacks: 1, recentAttacks: 78, topAttackType: "SQL Injection", assets: 260 },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", lat: -30, lng: 25, threatScore: 35, activeAttacks: 1, recentAttacks: 63, topAttackType: "Ransomware", assets: 180 },
  { code: "AE", name: "UAE", flag: "🇦🇪", lat: 24, lng: 53, threatScore: 30, activeAttacks: 1, recentAttacks: 56, topAttackType: "Phishing", assets: 220 },
  { code: "IL", name: "Israel", flag: "🇮🇱", lat: 31, lng: 35, threatScore: 58, activeAttacks: 3, recentAttacks: 142, topAttackType: "Malware", assets: 340 },
  { code: "IR", name: "Iran", flag: "🇮🇷", lat: 32, lng: 53, threatScore: 72, activeAttacks: 5, recentAttacks: 198, topAttackType: "DDoS", assets: 160 },
  { code: "KP", name: "North Korea", flag: "🇰🇵", lat: 40, lng: 127, threatScore: 78, activeAttacks: 4, recentAttacks: 167, topAttackType: "Malware", assets: 90 },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", lat: 49, lng: 31, threatScore: 82, activeAttacks: 6, recentAttacks: 245, topAttackType: "DDoS", assets: 140 },
];

export const ATTACK_EVENTS: AttackEvent[] = [
  { id: "ATK-001", type: "Ransomware", severity: "critical", sourceCode: "RU", destCode: "US", timestamp: "2m ago", description: "LockBit 3.0 ransomware outbreak targeting healthcare sector", mitreId: "T1486", mitreName: "Data Encrypted for Impact", status: "active", actor: "Silent Bounty", protocol: "SMB", port: 445 },
  { id: "ATK-002", type: "DDoS", severity: "high", sourceCode: "CN", destCode: "US", timestamp: "4m ago", description: "Amplified DNS DDoS attack on financial services infrastructure", mitreId: "T1498", mitreName: "Network Denial of Service", status: "active", actor: "Unknown", protocol: "DNS", port: 53 },
  { id: "ATK-003", type: "Phishing", severity: "high", sourceCode: "RU", destCode: "UK", timestamp: "6m ago", description: "Spear-phishing campaign targeting defense contractors", mitreId: "T1566", mitreName: "Phishing", status: "active", actor: "APT42", protocol: "SMTP", port: 25 },
  { id: "ATK-004", type: "SQL Injection", severity: "medium", sourceCode: "CN", destCode: "KR", timestamp: "8m ago", description: "SQL injection attack on e-commerce payment gateway", mitreId: "T1190", mitreName: "Exploit Public-Facing Application", status: "blocked", actor: "Unknown", protocol: "HTTPS", port: 443 },
  { id: "ATK-005", type: "Brute Force", severity: "medium", sourceCode: "IR", destCode: "IL", timestamp: "10m ago", description: "Credential stuffing attack on VPN gateway", mitreId: "T1110", mitreName: "Brute Force", status: "blocked", actor: "Unknown", protocol: "SSH", port: 22 },
  { id: "ATK-006", type: "Malware", severity: "critical", sourceCode: "KP", destCode: "KR", timestamp: "12m ago", description: "Supply chain malware植入 in software update mechanism", mitreId: "T1195", mitreName: "Supply Chain Compromise", status: "investigating", actor: "Lazarus", protocol: "HTTPS", port: 443 },
  { id: "ATK-007", type: "DDoS", severity: "high", sourceCode: "IR", destCode: "AE", timestamp: "14m ago", description: "Layer 7 DDoS attack on government portal", mitreId: "T1498", mitreName: "Network Denial of Service", status: "active", actor: "Unknown", protocol: "HTTPS", port: 443 },
  { id: "ATK-008", type: "Data Exfiltration", severity: "critical", sourceCode: "US", destCode: "CN", timestamp: "16m ago", description: "DNS tunneling data exfiltration from aerospace firm", mitreId: "T1048", mitreName: "Exfiltration Over Alternative Protocol", status: "investigating", actor: "APT42", protocol: "DNS", port: 53 },
  { id: "ATK-009", type: "Ransomware", severity: "high", sourceCode: "RU", destCode: "DE", timestamp: "18m ago", description: "BlackCat ransomware variant deployed via PsExec lateral movement", mitreId: "T1486", mitreName: "Data Encrypted for Impact", status: "active", actor: "Silent Bounty", protocol: "SMB", port: 445 },
  { id: "ATK-010", type: "Phishing", severity: "medium", sourceCode: "CN", destCode: "JP", timestamp: "20m ago", description: "Business email compromise attack on supply chain finance", mitreId: "T1566", mitreName: "Phishing", status: "blocked", actor: "Unknown", protocol: "SMTP", port: 25 },
  { id: "ATK-011", type: "Malware", severity: "high", sourceCode: "RU", destCode: "UA", timestamp: "22m ago", description: "HermeticWiper malware detected in energy sector", mitreId: "T1561", mitreName: "Disk Wipe", status: "active", actor: "Sandworm", protocol: "HTTPS", port: 443 },
  { id: "ATK-012", type: "Brute Force", severity: "low", sourceCode: "CN", destCode: "IN", timestamp: "25m ago", description: "SSH brute force attempt on cloud infrastructure", mitreId: "T1110", mitreName: "Brute Force", status: "blocked", actor: "Unknown", protocol: "SSH", port: 22 },
  { id: "ATK-013", type: "SQL Injection", severity: "high", sourceCode: "IR", destCode: "IL", timestamp: "28m ago", description: "SQL injection on critical infrastructure SCADA interface", mitreId: "T1190", mitreName: "Exploit Public-Facing Application", status: "active", actor: "APT33", protocol: "HTTPS", port: 443 },
  { id: "ATK-014", type: "Data Exfiltration", severity: "medium", sourceCode: "US", destCode: "RU", timestamp: "30m ago", description: "Suspicious SMB read volumes indicating data staging", mitreId: "T1030", mitreName: "Data Transfer Size Limits", status: "investigating", actor: "APT29", protocol: "SMB", port: 445 },
  { id: "ATK-015", type: "DDoS", severity: "low", sourceCode: "CN", destCode: "SG", timestamp: "32m ago", description: "SYN flood attack on web hosting platform", mitreId: "T1498", mitreName: "Network Denial of Service", status: "blocked", actor: "Unknown", protocol: "TCP", port: 80 },
  { id: "ATK-016", type: "Malware", severity: "critical", sourceCode: "KP", destCode: "US", timestamp: "35m ago", description: "Crowdfunding campaign malware distribution via torrents", mitreId: "T1204", mitreName: "User Execution", status: "active", actor: "Lazarus", protocol: "HTTPS", port: 443 },
];

export const THREAT_ACTORS: ThreatActor[] = [
  {
    id: "APT42", name: "APT42 — Phantom Sentinel", type: "apt",
    motivation: "Nation-state espionage, intellectual property theft",
    knownTechniques: ["Spear-phishing", "PowerShell", "DNS Tunneling", "Token Manipulation"],
    targetIndustries: ["Defense", "Aerospace", "Technology", "Telecommunications"],
    campaigns: ["Operation Cloud Hopper", "Phantom Drive Campaign 2026"],
    malware: ["BeaconNG", "Cobalt Strike", "Mimikatz"],
    mitreIds: ["T1566", "T1059.001", "T1048", "T1134"],
    description: "State-sponsored APT group operating since 2018. Known for sophisticated phishing campaigns targeting defense contractors and technology firms. Uses DNS tunneling for C2 communication.",
  },
  {
    id: "SILENT-BOUNTY", name: "Silent Bounty", type: "cybercrime",
    motivation: "Financial gain through ransomware and extortion",
    knownTechniques: ["Ransomware", "Lateral Movement", "Credential Dumping", "Data Exfiltration"],
    targetIndustries: ["Healthcare", "Finance", "Energy", "Manufacturing"],
    campaigns: ["LockBit 3.0 Campaign", "BlackCat Deployment Wave"],
    malware: ["LockBit 3.0", "BlackCat/ALPHV", "PsExec"],
    mitreIds: ["T1486", "T1021", "T1003", "T1048"],
    description: "Financially motivated ransomware group operating LockBit 3.0 variant. Known for double extortion tactics — encrypting files and exfiltrating data simultaneously.",
  },
  {
    id: "LAZARUS", name: "Lazarus Group", type: "apt",
    motivation: "Financial theft, cyber espionage, sabotage",
    knownTechniques: ["Supply Chain Attacks", "Malware", "Social Engineering", "Cryptocurrency Theft"],
    targetIndustries: ["Cryptocurrency", "Defense", "Finance", "Media"],
    campaigns: ["WannaCry", "BTC Heist 2026", "Supply Chain Compromise Wave"],
    malware: ["HermeticWiper", "RustBucket", "AppleJeus"],
    mitreIds: ["T1195", "T1204", "T1561", "T1486"],
    description: "North Korea-linked APT group active since 2009. Notorious for the WannaCry ransomware attack and numerous cryptocurrency exchange heists.",
  },
  {
    id: "SANDWORM", name: "Sandworm Team", type: "apt",
    motivation: "Geopolitical disruption, critical infrastructure targeting",
    knownTechniques: ["Disk Wiping", "ICS/SCADA Attacks", "DDoS", "Living-off-the-land"],
    targetIndustries: ["Energy", "Government", "Telecommunications", "Transportation"],
    campaigns: ["Ukraine Power Grid Attack", "Olympic Destroyer"],
    malware: ["HermeticWiper", "Industroyer", "Prestige"],
    mitreIds: ["T1561", "T1498", "T0835", "T0812"],
    description: "Russian GRU-linked APT group specializing in critical infrastructure attacks. Known for targeting Ukrainian power grids and industrial control systems.",
  },
  {
    id: "APT33", name: "APT33 — Refined Kitten", type: "apt",
    motivation: "Intellectual property theft, strategic espionage",
    knownTechniques: ["SQL Injection", "Password Spraying", "Custom Malware", "RDP Lateral Movement"],
    targetIndustries: ["Aerospace", "Energy", "Chemical", "Defense"],
    campaigns: ["Operation Cleaver", "Aerospace Targeting Campaign"],
    malware: ["Shamoon", "StoneDrill", "TDTESS"],
    mitreIds: ["T1190", "T1110", "T1021", "T1071"],
    description: "Iranian state-sponsored APT group active since 2013. Focuses on aerospace and energy sectors with custom malware and exploit development.",
  },
  {
    id: "APT29", name: "APT29 — Cozy Bear", type: "apt",
    motivation: "Political intelligence, diplomatic espionage",
    knownTechniques: ["Living-off-the-land", "PowerShell", "SMB Exploitation", "Steganography"],
    targetIndustries: ["Government", "Think Tanks", "Healthcare", "Energy"],
    campaigns: ["SolarWinds", "COVID-19 Vaccine Research Targeting"],
    malware: ["Sunburst", "Teardrop", "GoldMax"],
    mitreIds: ["T1078", "T1059.001", "T1574", "T1005"],
    description: "Russian SVR-linked APT group. Gained global attention for the SolarWinds supply chain attack. Uses sophisticated living-off-the-land techniques.",
  },
];

export const TIMELINE: TimelineEntry[] = [
  { time: "01:30", event: "Initial reconnaissance — Port scanning of target networks", attackId: "", severity: "low" },
  { time: "01:45", event: "Phishing campaign launched against defense contractors", attackId: "ATK-003", severity: "high" },
  { time: "02:00", event: "VPN credential compromise via brute force", attackId: "ATK-005", severity: "medium" },
  { time: "02:15", event: "Ransomware deployment on healthcare infrastructure", attackId: "ATK-001", severity: "critical" },
  { time: "02:22", event: "DDoS attack on financial services DNS", attackId: "ATK-002", severity: "high" },
  { time: "02:30", event: "Malware beacon detected — C2 communication established", attackId: "ATK-016", severity: "critical" },
  { time: "02:38", event: "Data exfiltration via DNS tunneling detected", attackId: "ATK-008", severity: "critical" },
  { time: "02:45", event: "SCADA SQL injection attempt blocked", attackId: "ATK-013", severity: "high" },
  { time: "02:52", event: "Energy sector wiper malware deployed", attackId: "ATK-011", severity: "high" },
  { time: "03:00", event: "Incident response teams activated across all active campaigns", attackId: "", severity: "info" },
];

export const ATTACK_TYPES = [
  { type: "Ransomware", count: 24, color: "#ef4444" },
  { type: "DDoS", count: 31, color: "#f97316" },
  { type: "Phishing", count: 42, color: "#eab308" },
  { type: "SQL Injection", count: 18, color: "#a855f7" },
  { type: "Brute Force", count: 27, color: "#3b82f6" },
  { type: "Malware", count: 35, color: "#06b6d4" },
  { type: "Data Exfiltration", count: 12, color: "#ec4899" },
];

export const ATTACK_TREND = [
  { day: "Mon", count: 18 }, { day: "Tue", count: 24 }, { day: "Wed", count: 31 },
  { day: "Thu", count: 22 }, { day: "Fri", count: 28 }, { day: "Sat", count: 15 },
  { day: "Sun", count: 12 },
];

export const severityColors: Record<string, string> = {
  critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#3b82f6", info: "#6b7280",
};

export function getCountryByCode(code: string): CountryData | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
