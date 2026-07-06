import type { ThreatEvent } from "@/types";

export const threatFeed: ThreatEvent[] = [
  { id: "T001", type: "critical", title: "Ransomware Outbreak - LockBit 3.0 Variant", source: "Threat Intelligence", timestamp: "2 min ago", ip: "185.220.101.x", country: "RU", flag: "🇷🇺" },
  { id: "T002", type: "high", title: "DDoS Attack Targeting DNS Infrastructure", source: "SOC Alert", timestamp: "5 min ago", ip: "45.33.32.x", country: "US", flag: "🇺🇸" },
  { id: "T003", type: "high", title: "SQL Injection Attempt on Web Application", source: "WAF", timestamp: "8 min ago", ip: "103.235.46.x", country: "CN", flag: "🇨🇳" },
  { id: "T004", type: "medium", title: "Brute Force Attack - SSH Service", source: "IDS", timestamp: "12 min ago", ip: "91.121.87.x", country: "FR", flag: "🇫🇷" },
  { id: "T005", type: "critical", title: "Data Exfiltration Detected - Internal Network", source: "DLP", timestamp: "15 min ago", ip: "10.0.1.x", country: "Internal", flag: "🏢" },
  { id: "T006", type: "medium", title: "Phishing Campaign Targeting Executives", source: "Email Security", timestamp: "18 min ago", ip: "217.160.0.x", country: "DE", flag: "🇩🇪" },
  { id: "T007", type: "low", title: "Port Scan Detection - Reconnaissance", source: "NIDS", timestamp: "22 min ago", ip: "185.225.15.x", country: "NL", flag: "🇳🇱" },
  { id: "T008", type: "high", title: "Malware Download - C2 Communication", source: "Endpoint Protection", timestamp: "27 min ago", ip: "5.188.62.x", country: "SE", flag: "🇸🇪" },
  { id: "T009", type: "low", title: "Failed Authentication Attempts", source: "SIEM", timestamp: "30 min ago", ip: "78.46.89.x", country: "UA", flag: "🇺🇦" },
  { id: "T010", type: "medium", title: "DNS Tunneling Anomaly", source: "Network Analytics", timestamp: "35 min ago", ip: "192.168.1.x", country: "Internal", flag: "🏢" },
  { id: "T011", type: "high", title: "Zero-Day Exploit Attempt - CVE-2024-xxx", source: "Vulnerability Scanner", timestamp: "40 min ago", ip: "104.248.50.x", country: "SG", flag: "🇸🇬" },
  { id: "T012", type: "critical", title: "Supply Chain Attack - Dependency Compromise", source: "SCA", timestamp: "45 min ago", ip: "N/A", country: "Global", flag: "🌐" },
];

export const socMetrics = [
  { label: "Threats Blocked", value: "12,847", change: 12, status: "up" as const },
  { label: "Active Incidents", value: "3", change: -2, status: "down" as const },
  { label: "Mean Time to Detect", value: "4.2m", change: -15, status: "down" as const },
  { label: "Mean Time to Respond", value: "8.7m", change: -22, status: "down" as const },
  { label: "Total Events Today", value: "1.2M", change: 8, status: "up" as const },
  { label: "Systems Monitored", value: "5,230", change: 10, status: "up" as const },
];
