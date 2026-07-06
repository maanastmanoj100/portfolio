import type { GalaxySkill, GalaxyConnection, SkillConstellation, SkillLearningPath } from "@/types";

export const galaxySkills: GalaxySkill[] = [
  // ── Programming ──
  { name: "Python", level: 95, category: "programming", cluster: "programming", nodeType: "core", icon: "python", yearsPracticed: 8, description: "Primary language for security tooling, automation, and ML. Used across all major projects.", color: "#2563eb", relatedSkills: ["TypeScript", "Go", "Rust", "Machine Learning", "NLP", "Automation"], projectIds: ["sentinel-ai", "threat-hunter", "autopwn", "redops", "forensic-analyzer", "log-ai", "ai-red-teamer", "mobile-sec-scanner", "phishshield"], certificationIds: ["pcep", "pcap"], blogSlugs: ["python-security-automation"], githubRepos: [{ name: "security-toolkit", url: "https://github.com/maanas/security-toolkit", description: "Modular Python security tools" }], exampleCommands: [{ command: "python -m http.server 8080", description: "Quick HTTP server for file transfer" }, { command: "python3 -c \"import socket; print(socket.gethostbyname('example.com'))\"", description: "DNS resolution one-liner" }], learningResources: [{ title: "Black Hat Python", url: "#", type: "book" }, { title: "Python for Cybersecurity", url: "#", type: "course" }] },
  { name: "TypeScript", level: 88, category: "programming", cluster: "programming", nodeType: "core", icon: "typescript", yearsPracticed: 5, description: "Full-stack development with type safety. Powers the Cyber Nexus platform and CLI tools.", color: "#3178c6", relatedSkills: ["Python", "JavaScript", "React", "Node.js"], projectIds: ["sentinel-ai", "ctf-platform", "phishshield", "dashboard"], githubRepos: [{ name: "cyber-nexus", url: "https://github.com/maanas/cyber-nexus", description: "Portfolio platform" }], learningResources: [{ title: "TypeScript Handbook", url: "#", type: "documentation" }] },
  { name: "JavaScript", level: 90, category: "programming", cluster: "programming", nodeType: "intermediate", icon: "javascript", yearsPracticed: 7, description: "Core web language for browser extensions and full-stack applications.", color: "#f7df1e", relatedSkills: ["TypeScript", "React", "Node.js", "Python"], projectIds: ["phishshield", "ctf-platform"] },
  { name: "Rust", level: 85, category: "programming", cluster: "programming", nodeType: "core", icon: "rust", yearsPracticed: 4, description: "Systems programming for performance-critical security tools and blockchain auditing.", color: "#7c3aed", relatedSkills: ["C/C++", "Python", "Go", "Reverse Engineering"], projectIds: ["chainguard", "netdefend", "cryptovault"], certificationIds: ["rust-cert"], githubRepos: [{ name: "chainguard-engine", url: "https://github.com/maanas/chainguard", description: "Blockchain security auditor in Rust" }], learningResources: [{ title: "The Rust Book", url: "#", type: "book" }] },
  { name: "Go", level: 82, category: "programming", cluster: "programming", nodeType: "intermediate", icon: "go", yearsPracticed: 4, description: "Backend services, CLI tools, and network programming. Used for concurrent systems.", color: "#0891b2", relatedSkills: ["Python", "Rust", "Docker", "Kubernetes"], projectIds: ["netdefend", "redops", "k8s-hardener", "cloudsec-enforcer"] },
  { name: "C/C++", level: 80, category: "programming", cluster: "programming", nodeType: "intermediate", icon: "cpp", yearsPracticed: 6, description: "Low-level systems programming, exploit development, and embedded security.", color: "#0284c7", relatedSkills: ["Rust", "Reverse Engineering", "Exploit Development", "Fuzzing"], projectIds: ["zero-day-hunter", "cryptovault", "wifi-defender"], learningResources: [{ title: "Hacking: The Art of Exploitation", url: "#", type: "book" }] },
  { name: "Java", level: 70, category: "programming", cluster: "programming", nodeType: "learning", icon: "java", yearsPracticed: 3, description: "Enterprise applications and Android security analysis.", color: "#b07219", relatedSkills: ["Python", "Mobile Security"], projectIds: ["mobile-sec-scanner"] },

  // ── Cybersecurity Tools ──
  { name: "Nmap", level: 95, category: "offensive", cluster: "cybersecurity", nodeType: "core", icon: "nmap", yearsPracticed: 8, description: "Network discovery and security auditing. Expertise in NSE scripting and advanced scan techniques.", color: "#ef4444", relatedSkills: ["Wireshark", "Network Security", "TCP/IP", "Metasploit"], projectIds: ["autopwn", "redops", "netdefend"], exampleCommands: [{ command: "nmap -sC -sV -p- target.com", description: "Full port scan with default scripts" }, { command: "nmap --script vuln target.com", description: "Vulnerability scan" }], certificationIds: ["oscp", "ceh"] },
  { name: "Burp Suite", level: 92, category: "offensive", cluster: "cybersecurity", nodeType: "core", icon: "burp", yearsPracticed: 7, description: "Web application security testing. Custom extensions and automated scanning pipelines.", color: "#f97316", relatedSkills: ["Web Security", "Python", "JavaScript", "Metasploit"], projectIds: ["autopwn", "phishshield"], certificationIds: ["oscp", "ceh", "gwapt"], learningResources: [{ title: "Web Application Hackers Handbook", url: "#", type: "book" }] },
  { name: "Metasploit", level: 90, category: "offensive", cluster: "cybersecurity", nodeType: "core", icon: "metasploit", yearsPracticed: 7, description: "Exploit development and penetration testing framework. Module development and post-exploitation.", color: "#eab308", relatedSkills: ["Nmap", "Exploit Development", "Python", "Red Team"], projectIds: ["redops", "autopwn"], certificationIds: ["oscp"] },
  { name: "Wireshark", level: 88, category: "defensive", cluster: "cybersecurity", nodeType: "intermediate", icon: "wireshark", yearsPracticed: 7, description: "Network protocol analysis and traffic inspection. Custom display filters and Lua dissectors.", color: "#22c55e", relatedSkills: ["Nmap", "TCP/IP", "Network Security", "Network Forensics"], projectIds: ["netdefend", "forensic-analyzer", "sentinel-ai"], certificationIds: ["gcia"] },
  { name: "Hydra", level: 85, category: "offensive", cluster: "cybersecurity", nodeType: "intermediate", icon: "hydra", yearsPracticed: 6, description: "Password cracking and authentication testing. Multi-protocol brute-force automation.", color: "#84cc16", relatedSkills: ["John the Ripper", "Network Security", "Python"], projectIds: ["autopwn"] },
  { name: "John the Ripper", level: 82, category: "offensive", cluster: "cybersecurity", nodeType: "intermediate", icon: "john", yearsPracticed: 5, description: "Password hash cracking with custom rules and GPU acceleration.", color: "#65a30d", relatedSkills: ["Hydra", "Cryptography", "Python"], projectIds: ["autopwn"] },
  { name: "Gobuster", level: 80, category: "offensive", cluster: "cybersecurity", nodeType: "intermediate", icon: "gobuster", yearsPracticed: 4, description: "Directory and DNS brute-forcing for web reconnaissance.", color: "#ca8a04", relatedSkills: ["Nmap", "Burp Suite", "Web Security", "DNS"], projectIds: ["autopwn", "redops"] },

  // ── Cloud Technologies ──
  { name: "AWS", level: 90, category: "cloud", cluster: "cloud", nodeType: "core", icon: "aws", yearsPracticed: 6, description: "Cloud architecture and security across EC2, S3, Lambda, VPC, IAM, CloudTrail, and GuardDuty.", color: "#ff9900", relatedSkills: ["Azure", "Docker", "Kubernetes", "Terraform", "Cloud Security"], projectIds: ["cloudsec-enforcer", "sentinel-ai"], certificationIds: ["aws-sa", "aws-security"], learningResources: [{ title: "AWS Certified Security Specialty", url: "#", type: "course" }] },
  { name: "Azure", level: 82, category: "cloud", cluster: "cloud", nodeType: "intermediate", icon: "azure", yearsPracticed: 4, description: "Azure security services including Sentinel, Defender, Entra ID, and Policy.", color: "#0078d4", relatedSkills: ["AWS", "Docker", "Cloud Security"], projectIds: ["cloudsec-enforcer"], certificationIds: ["az-500"] },
  { name: "Docker", level: 92, category: "cloud", cluster: "cloud", nodeType: "core", icon: "docker", yearsPracticed: 6, description: "Containerization for security tools, microservices, and CTF infrastructure.", color: "#2496ed", relatedSkills: ["Kubernetes", "Linux", "DevOps", "Go"], projectIds: ["ctf-platform", "sentinel-ai", "re-analyzer", "k8s-hardener", "forensic-analyzer"], learningResources: [{ title: "Docker Deep Dive", url: "#", type: "book" }] },
  { name: "Kubernetes", level: 85, category: "cloud", cluster: "cloud", nodeType: "core", icon: "kubernetes", yearsPracticed: 5, description: "Container orchestration, security hardening, admission control, and RBAC.", color: "#326ce5", relatedSkills: ["Docker", "Linux", "Go", "Cloud Security"], projectIds: ["k8s-hardener", "sentinel-ai", "ctf-platform"], certificationIds: ["cka", "cks"], learningResources: [{ title: "Kubernetes Security", url: "#", type: "book" }] },

  // ── Networking ──
  { name: "TCP/IP", level: 90, category: "defensive", cluster: "networking", nodeType: "core", icon: "tcpip", yearsPracticed: 8, description: "Deep understanding of TCP/IP stack, packet analysis, and network protocol exploitation.", color: "#06b6d4", relatedSkills: ["Nmap", "Wireshark", "Network Security", "DNS", "HTTP"], projectIds: ["netdefend", "sentinel-ai", "forensic-analyzer"] },
  { name: "DNS", level: 88, category: "defensive", cluster: "networking", nodeType: "intermediate", icon: "dns", yearsPracticed: 7, description: "DNS security, tunneling detection, and protocol analysis.", color: "#3b82f6", relatedSkills: ["TCP/IP", "Network Security", "HTTP", "Gobuster"], projectIds: ["netdefend", "sentinel-ai"] },
  { name: "HTTP/HTTPS", level: 92, category: "defensive", cluster: "networking", nodeType: "core", icon: "http", yearsPracticed: 8, description: "Web protocol security including request smuggling, header injection, and TLS analysis.", color: "#6366f1", relatedSkills: ["Burp Suite", "Web Security", "TCP/IP", "JavaScript"], projectIds: ["autopwn", "phishshield", "sentinel-ai"] },
  { name: "SSH", level: 85, category: "defensive", cluster: "networking", nodeType: "intermediate", icon: "ssh", yearsPracticed: 7, description: "Secure shell protocol, key management, tunneling, and audit.", color: "#8b5cf6", relatedSkills: ["TCP/IP", "Linux", "VPN", "Network Security"], projectIds: ["netdefend"] },
  { name: "VPN", level: 80, category: "defensive", cluster: "networking", nodeType: "learning", icon: "vpn", yearsPracticed: 5, description: "VPN technologies including WireGuard, OpenVPN, and IPsec.", color: "#a855f7", relatedSkills: ["SSH", "TCP/IP", "Network Security"], projectIds: ["netdefend"] },

  // ── Operating Systems ──
  { name: "Linux", level: 95, category: "defensive", cluster: "os", nodeType: "core", icon: "linux", yearsPracticed: 10, description: "Primary operating system. Expert in administration, hardening, kernel security, and performance tuning.", color: "#fcc624", relatedSkills: ["Docker", "Kubernetes", "Bash", "Python", "Network Security"], projectIds: ["sentinel-ai", "k8s-hardener", "forensic-analyzer", "netdefend", "cryptovault"], certificationIds: ["lpic", "rhcsa"], learningResources: [{ title: "Linux Device Drivers", url: "#", type: "book" }] },
  { name: "Kali Linux", level: 93, category: "offensive", cluster: "os", nodeType: "core", icon: "kali", yearsPracticed: 7, description: "Primary pentesting distribution. Custom tooling and kernel module development.", color: "#557c94", relatedSkills: ["Linux", "Nmap", "Metasploit", "Wireshark", "Python"], projectIds: ["autopwn", "redops"] },
  { name: "Ubuntu", level: 90, category: "defensive", cluster: "os", nodeType: "intermediate", icon: "ubuntu", yearsPracticed: 8, description: "Server administration, security hardening, and container host management.", color: "#e95420", relatedSkills: ["Linux", "Docker", "Kubernetes", "Cloud Security"], projectIds: ["sentinel-ai", "k8s-hardener"] },
  { name: "Windows", level: 78, category: "defensive", cluster: "os", nodeType: "intermediate", icon: "windows", yearsPracticed: 6, description: "Windows security including Active Directory, PowerShell, and forensic analysis.", color: "#00a4ef", relatedSkills: ["Linux", "Active Directory", "Network Security"], projectIds: ["forensic-analyzer", "redops"], certificationIds: ["az-500"] },
  { name: "Active Directory", level: 82, category: "defensive", cluster: "os", nodeType: "intermediate", icon: "activedirectory", yearsPracticed: 5, description: "AD security assessment, privilege escalation, and Kerberos attacks.", color: "#0033cc", relatedSkills: ["Windows", "Network Security", "Red Team"], projectIds: ["redops", "autopwn"], certificationIds: ["oscp"] },

  // ── Web Development ──
  { name: "React", level: 88, category: "programming", cluster: "web", nodeType: "core", icon: "react", yearsPracticed: 5, description: "Modern UI development with Next.js, TypeScript, and state management.", color: "#61dafb", relatedSkills: ["TypeScript", "JavaScript", "Node.js", "Python"], projectIds: ["sentinel-ai", "ctf-platform", "dashboard"] },
  { name: "Next.js", level: 85, category: "programming", cluster: "web", nodeType: "core", icon: "nextjs", yearsPracticed: 4, description: "Full-stack React framework for production applications.", color: "#000000", relatedSkills: ["React", "TypeScript", "Node.js"], projectIds: ["sentinel-ai", "cyber-nexus"] },
  { name: "Node.js", level: 85, category: "programming", cluster: "web", nodeType: "intermediate", icon: "nodejs", yearsPracticed: 5, description: "Server-side JavaScript for API development and tooling.", color: "#339933", relatedSkills: ["JavaScript", "TypeScript", "React", "Python"], projectIds: ["ctf-platform", "phishshield"] },
  { name: "Tailwind CSS", level: 82, category: "programming", cluster: "web", nodeType: "intermediate", icon: "tailwind", yearsPracticed: 3, description: "Utility-first CSS framework for rapid UI development.", color: "#06b6d4", relatedSkills: ["React", "Next.js", "TypeScript"], projectIds: ["sentinel-ai", "cyber-nexus"] },

  // ── AI & ML ──
  { name: "TensorFlow", level: 85, category: "ai", cluster: "ai", nodeType: "core", icon: "tensorflow", yearsPracticed: 5, description: "Deep learning framework for security ML models. Used for anomaly detection and phishing detection.", color: "#ff6f00", relatedSkills: ["Python", "Machine Learning", "NLP", "Computer Vision"], projectIds: ["sentinel-ai", "phishshield", "log-ai"], learningResources: [{ title: "Hands-On ML with Scikit-Learn & TF", url: "#", type: "book" }] },
  { name: "PyTorch", level: 80, category: "ai", cluster: "ai", nodeType: "intermediate", icon: "pytorch", yearsPracticed: 4, description: "Research-focused deep learning for threat detection and NLP.", color: "#ee4c2c", relatedSkills: ["Python", "Machine Learning", "NLP", "TensorFlow"], projectIds: ["threat-hunter", "ai-red-teamer"] },
  { name: "Machine Learning", level: 85, category: "ai", cluster: "ai", nodeType: "core", icon: "ml", yearsPracticed: 5, description: "Security-focused ML including anomaly detection, classification, and adversarial ML.", color: "#06b6d4", relatedSkills: ["Python", "TensorFlow", "NLP", "Computer Vision"], projectIds: ["sentinel-ai", "phishshield", "threat-hunter", "log-ai", "ai-red-teamer"], certificationIds: ["ml-cert"] },
  { name: "NLP", level: 80, category: "ai", cluster: "ai", nodeType: "intermediate", icon: "nlp", yearsPracticed: 4, description: "Natural language processing for threat intel analysis, log parsing, and social engineering detection.", color: "#0ea5e9", relatedSkills: ["Python", "Machine Learning", "Transformers"], projectIds: ["phishshield", "log-ai", "osint-scraper", "threat-hunter"] },
  { name: "Computer Vision", level: 78, category: "ai", cluster: "ai", nodeType: "learning", icon: "cv", yearsPracticed: 3, description: "Visual analysis for phishing detection and image-based threat intelligence.", color: "#2563eb", relatedSkills: ["Python", "Machine Learning", "TensorFlow"], projectIds: ["phishshield"] },

  // ── Automation ──
  { name: "CI/CD", level: 88, category: "cloud", cluster: "automation", nodeType: "core", icon: "cicd", yearsPracticed: 5, description: "Pipeline automation for security testing, deployment, and compliance scanning.", color: "#6366f1", relatedSkills: ["Docker", "Kubernetes", "Terraform", "Git"], projectIds: ["cloudsec-enforcer", "k8s-hardener"] },
  { name: "Terraform", level: 85, category: "cloud", cluster: "automation", nodeType: "intermediate", icon: "terraform", yearsPracticed: 4, description: "Infrastructure-as-code for cloud security automation and policy enforcement.", color: "#7b42bc", relatedSkills: ["AWS", "Azure", "Docker", "Cloud Security"], projectIds: ["cloudsec-enforcer", "k8s-hardener"], learningResources: [{ title: "Terraform Up & Running", url: "#", type: "book" }] },
  { name: "Ansible", level: 80, category: "cloud", cluster: "automation", nodeType: "intermediate", icon: "ansible", yearsPracticed: 4, description: "Configuration management and security automation for server hardening.", color: "#ee0000", relatedSkills: ["Linux", "Python", "DevOps"], projectIds: ["k8s-hardener", "cloudsec-enforcer"] },
  { name: "Shell Scripting", level: 92, category: "programming", cluster: "automation", nodeType: "core", icon: "bash", yearsPracticed: 9, description: "Advanced Bash/Zsh scripting for automation, log analysis, and security operations.", color: "#4eaa25", relatedSkills: ["Linux", "Python", "CI/CD"], projectIds: ["sentinel-ai", "forensic-analyzer"] },

  // ── DevOps ──
  { name: "Git", level: 92, category: "programming", cluster: "devops", nodeType: "core", icon: "git", yearsPracticed: 8, description: "Version control, branching strategies, and CI/CD integration.", color: "#f05032", relatedSkills: ["CI/CD", "Linux", "Python"], projectIds: ["all"] },
  { name: "GitHub Actions", level: 85, category: "cloud", cluster: "devops", nodeType: "intermediate", icon: "githubactions", yearsPracticed: 4, description: "CI/CD workflows for automated testing, security scanning, and deployment.", color: "#2088ff", relatedSkills: ["CI/CD", "Git", "Docker"], projectIds: ["cloudsec-enforcer", "k8s-hardener"] },
  { name: "Monitoring", level: 82, category: "defensive", cluster: "devops", nodeType: "intermediate", icon: "monitoring", yearsPracticed: 4, description: "System and security monitoring with Prometheus, Grafana, and ELK stack.", color: "#e6522c", relatedSkills: ["Docker", "Linux", "Python", "Cloud Security"], projectIds: ["sentinel-ai", "log-ai"] },

  // ── Digital Forensics ──
  { name: "Memory Forensics", level: 85, category: "forensics", cluster: "forensics", nodeType: "core", icon: "memory", yearsPracticed: 5, description: "Volatile memory analysis using Volatility 3 for artifact extraction and rootkit detection.", color: "#f43f5e", relatedSkills: ["Linux", "Windows", "Reverse Engineering", "Python"], projectIds: ["forensic-analyzer"], certificationIds: ["gcfi"] },
  { name: "Disk Forensics", level: 83, category: "forensics", cluster: "forensics", nodeType: "intermediate", icon: "disk", yearsPracticed: 5, description: "File system analysis, data carving, and timeline reconstruction.", color: "#e11d48", relatedSkills: ["Linux", "Memory Forensics", "Python"], projectIds: ["forensic-analyzer"] },
  { name: "Network Forensics", level: 84, category: "forensics", cluster: "forensics", nodeType: "intermediate", icon: "networkforensics", yearsPracticed: 5, description: "PCAP analysis, traffic reconstruction, and network timeline analysis.", color: "#be123c", relatedSkills: ["Wireshark", "TCP/IP", "Network Security"], projectIds: ["forensic-analyzer", "netdefend"] },

  // ── Reverse Engineering ──
  { name: "Binary Analysis", level: 85, category: "offensive", cluster: "reverse-engineering", nodeType: "core", icon: "binary", yearsPracticed: 5, description: "Static and dynamic binary analysis for vulnerability research and malware analysis.", color: "#ec4899", relatedSkills: ["C/C++", "Python", "Reverse Engineering", "Fuzzing"], projectIds: ["re-analyzer", "zero-day-hunter"] },
  { name: "IDA Pro", level: 82, category: "offensive", cluster: "reverse-engineering", nodeType: "intermediate", icon: "ida", yearsPracticed: 4, description: "Interactive disassembler for deep binary analysis and plugin development.", color: "#d946ef", relatedSkills: ["Binary Analysis", "Ghidra", "Python"], projectIds: ["re-analyzer"], certificationIds: ["osed"] },
  { name: "Ghidra", level: 80, category: "offensive", cluster: "reverse-engineering", nodeType: "intermediate", icon: "ghidra", yearsPracticed: 4, description: "NSA's reverse engineering framework for malware analysis and vulnerability research.", color: "#a855f7", relatedSkills: ["Binary Analysis", "IDA Pro", "Python", "Java"], projectIds: ["re-analyzer"] },
  { name: "Fuzzing", level: 82, category: "offensive", cluster: "reverse-engineering", nodeType: "intermediate", icon: "fuzzing", yearsPracticed: 4, description: "Automated vulnerability discovery using AFL++, LibFuzzer, and custom harnesses.", color: "#7c3aed", relatedSkills: ["C/C++", "Binary Analysis", "Python"], projectIds: ["zero-day-hunter"] },

  // ── OSINT ──
  { name: "Reconnaissance", level: 88, category: "offensive", cluster: "osint", nodeType: "core", icon: "recon", yearsPracticed: 7, description: "Open-source intelligence gathering and passive reconnaissance techniques.", color: "#14b8a6", relatedSkills: ["Python", "Network Security", "Social Engineering"], projectIds: ["osint-scraper", "redops"] },
  { name: "Social Engineering", level: 85, category: "offensive", cluster: "osint", nodeType: "intermediate", icon: "social", yearsPracticed: 6, description: "Phishing simulations, pretexting, and human-centric security assessments.", color: "#0d9488", relatedSkills: ["Reconnaissance", "Python", "Web Security"], projectIds: ["phishshield", "redops"] },
  { name: "Threat Intelligence", level: 90, category: "defensive", cluster: "osint", nodeType: "core", icon: "threatintel", yearsPracticed: 6, description: "Threat intel collection, STIX/TAXII, indicator management, and attribution analysis.", color: "#8b5cf6", relatedSkills: ["OSINT", "Python", "NLP", "Machine Learning"], projectIds: ["threat-hunter", "osint-scraper", "sentinel-ai"], learningResources: [{ title: "Intelligence-Driven IR", url: "#", type: "book" }] },

  // ── Mobile Security ──
  { name: "Android Security", level: 82, category: "offensive", cluster: "mobile", nodeType: "intermediate", icon: "android", yearsPracticed: 4, description: "Android app security assessment, APK analysis, and reverse engineering.", color: "#3ddc84", relatedSkills: ["Java", "Python", "Mobile Security", "Reverse Engineering"], projectIds: ["mobile-sec-scanner"] },
  { name: "iOS Security", level: 78, category: "offensive", cluster: "mobile", nodeType: "learning", icon: "ios", yearsPracticed: 3, description: "iOS app security analysis, IPA inspection, and Swift/ObjC reversing.", color: "#000000", relatedSkills: ["Mobile Security", "Python", "Reverse Engineering"], projectIds: ["mobile-sec-scanner"] },
  { name: "Mobile Security", level: 82, category: "offensive", cluster: "mobile", nodeType: "intermediate", icon: "mobile", yearsPracticed: 4, description: "Cross-platform mobile app security testing with OWASP MASVS coverage.", color: "#14b8a6", relatedSkills: ["Android Security", "iOS Security", "Python", "Burp Suite"], projectIds: ["mobile-sec-scanner"], certificationIds: ["masvs"] },
];

export const galaxyConnections: GalaxyConnection[] = [
  // Programming language relationships
  { source: "Python", target: "Machine Learning", type: "workflow" },
  { source: "Python", target: "NLP", type: "workflow" },
  { source: "Python", target: "Computer Vision", type: "workflow" },
  { source: "Python", target: "Automation", type: "dependency" },
  { source: "Python", target: "Shell Scripting", type: "workflow" },
  { source: "TypeScript", target: "JavaScript", type: "dependency" },
  { source: "TypeScript", target: "React", type: "dependency" },
  { source: "TypeScript", target: "Next.js", type: "dependency" },
  { source: "Rust", target: "C/C++", type: "dependency" },
  { source: "Rust", target: "Blockchain Security", type: "workflow" },
  { source: "Go", target: "Docker", type: "workflow" },
  { source: "Go", target: "Kubernetes", type: "workflow" },
  { source: "C/C++", target: "Fuzzing", type: "workflow" },
  { source: "C/C++", target: "Binary Analysis", type: "dependency" },

  // Cybersecurity tool chains
  { source: "Nmap", target: "Metasploit", type: "toolchain" },
  { source: "Nmap", target: "Wireshark", type: "toolchain" },
  { source: "Nmap", target: "Gobuster", type: "toolchain" },
  { source: "Burp Suite", target: "Metasploit", type: "toolchain" },
  { source: "Burp Suite", target: "Web Security", type: "workflow" },
  { source: "Hydra", target: "John the Ripper", type: "toolchain" },
  { source: "Nmap", target: "Hydra", type: "toolchain" },

  // Cloud relationships
  { source: "AWS", target: "Azure", type: "dependency" },
  { source: "Docker", target: "Kubernetes", type: "dependency" },
  { source: "Docker", target: "CI/CD", type: "workflow" },
  { source: "Kubernetes", target: "Linux", type: "dependency" },
  { source: "Terraform", target: "AWS", type: "workflow" },
  { source: "Terraform", target: "Azure", type: "workflow" },
  { source: "Ansible", target: "Linux", type: "workflow" },
  { source: "CI/CD", target: "GitHub Actions", type: "workflow" },

  // Networking relationships
  { source: "TCP/IP", target: "DNS", type: "dependency" },
  { source: "TCP/IP", target: "HTTP/HTTPS", type: "dependency" },
  { source: "TCP/IP", target: "SSH", type: "dependency" },
  { source: "TCP/IP", target: "VPN", type: "dependency" },
  { source: "HTTP/HTTPS", target: "Burp Suite", type: "workflow" },
  { source: "DNS", target: "Gobuster", type: "workflow" },

  // OS relationships
  { source: "Linux", target: "Kali Linux", type: "dependency" },
  { source: "Linux", target: "Ubuntu", type: "dependency" },
  { source: "Linux", target: "Docker", type: "dependency" },
  { source: "Linux", target: "Shell Scripting", type: "workflow" },
  { source: "Windows", target: "Active Directory", type: "dependency" },

  // Web development
  { source: "React", target: "Next.js", type: "dependency" },
  { source: "React", target: "TypeScript", type: "workflow" },
  { source: "Next.js", target: "Tailwind CSS", type: "workflow" },
  { source: "Node.js", target: "React", type: "dependency" },
  { source: "Node.js", target: "TypeScript", type: "dependency" },

  // AI/ML
  { source: "Machine Learning", target: "TensorFlow", type: "dependency" },
  { source: "Machine Learning", target: "PyTorch", type: "dependency" },
  { source: "NLP", target: "Machine Learning", type: "dependency" },
  { source: "Computer Vision", target: "TensorFlow", type: "dependency" },
  { source: "NLP", target: "Transformers", type: "dependency" },

  // Forensics
  { source: "Memory Forensics", target: "Linux", type: "dependency" },
  { source: "Memory Forensics", target: "Windows", type: "dependency" },
  { source: "Disk Forensics", target: "Linux", type: "dependency" },
  { source: "Network Forensics", target: "Wireshark", type: "dependency" },
  { source: "Network Forensics", target: "TCP/IP", type: "dependency" },

  // Reverse Engineering
  { source: "Binary Analysis", target: "IDA Pro", type: "dependency" },
  { source: "Binary Analysis", target: "Ghidra", type: "dependency" },
  { source: "Binary Analysis", target: "Fuzzing", type: "workflow" },
  { source: "IDA Pro", target: "Python", type: "workflow" },
  { source: "Ghidra", target: "Python", type: "workflow" },

  // OSINT
  { source: "Reconnaissance", target: "Social Engineering", type: "toolchain" },
  { source: "Reconnaissance", target: "Threat Intelligence", type: "workflow" },
  { source: "Threat Intelligence", target: "NLP", type: "workflow" },
  { source: "OSINT", target: "Reconnaissance", type: "dependency" },

  // Mobile
  { source: "Android Security", target: "Mobile Security", type: "dependency" },
  { source: "iOS Security", target: "Mobile Security", type: "dependency" },
  { source: "Mobile Security", target: "Burp Suite", type: "toolchain" },

  // Cross-domain learning paths
  { source: "Python", target: "Nmap", type: "workflow" },
  { source: "Networking", target: "Linux", type: "learning" },
  { source: "Linux", target: "Python", type: "learning" },
  { source: "Web Security", target: "Penetration Testing", type: "learning" },
  { source: "Nmap", target: "Vulnerability Research", type: "learning" },
];

export const skillConstellations: SkillConstellation[] = [
  { id: "programming", label: "Programming", color: "#2563eb", description: "Languages and development paradigms powering security tools", skills: ["Python", "TypeScript", "JavaScript", "Rust", "Go", "C/C++", "Java"], position: { x: -8, y: 3, z: 0 } },
  { id: "cybersecurity", label: "Cybersecurity", color: "#ef4444", description: "Core security tools and testing frameworks", skills: ["Nmap", "Burp Suite", "Metasploit", "Wireshark", "Hydra", "John the Ripper", "Gobuster"], position: { x: 5, y: 5, z: 2 } },
  { id: "cloud", label: "Cloud", color: "#ff9900", description: "Cloud platforms and container orchestration", skills: ["AWS", "Azure", "Docker", "Kubernetes"], position: { x: 6, y: -3, z: 3 } },
  { id: "networking", label: "Networking", color: "#06b6d4", description: "Network protocols and infrastructure security", skills: ["TCP/IP", "DNS", "HTTP/HTTPS", "SSH", "VPN"], position: { x: -4, y: 6, z: -1 } },
  { id: "os", label: "Operating Systems", color: "#fcc624", description: "OS administration and security hardening", skills: ["Linux", "Kali Linux", "Ubuntu", "Windows", "Active Directory"], position: { x: -2, y: -5, z: 4 } },
  { id: "web", label: "Web Development", color: "#61dafb", description: "Modern web frameworks and frontend engineering", skills: ["React", "Next.js", "Node.js", "Tailwind CSS"], position: { x: 8, y: 1, z: -2 } },
  { id: "ai", label: "AI & ML", color: "#ff6f00", description: "Artificial intelligence and machine learning for security", skills: ["TensorFlow", "PyTorch", "Machine Learning", "NLP", "Computer Vision"], position: { x: -6, y: -3, z: -3 } },
  { id: "automation", label: "Automation", color: "#6366f1", description: "Infrastructure automation and CI/CD pipelines", skills: ["CI/CD", "Terraform", "Ansible", "Shell Scripting"], position: { x: 3, y: -6, z: -1 } },
  { id: "devops", label: "DevOps", color: "#f05032", description: "Development operations and tooling", skills: ["Git", "GitHub Actions", "Monitoring"], position: { x: 7, y: -4, z: -3 } },
  { id: "forensics", label: "Forensics", color: "#f43f5e", description: "Digital forensics and incident response", skills: ["Memory Forensics", "Disk Forensics", "Network Forensics"], position: { x: -5, y: -1, z: 5 } },
  { id: "reverse-engineering", label: "Reverse Engineering", color: "#ec4899", description: "Binary analysis and vulnerability research", skills: ["Binary Analysis", "IDA Pro", "Ghidra", "Fuzzing"], position: { x: -7, y: 1, z: -4 } },
  { id: "osint", label: "OSINT", color: "#14b8a6", description: "Open-source intelligence and threat research", skills: ["Reconnaissance", "Social Engineering", "Threat Intelligence"], position: { x: 2, y: 4, z: -4 } },
  { id: "mobile", label: "Mobile Security", color: "#3ddc84", description: "Mobile platform security assessment", skills: ["Android Security", "iOS Security", "Mobile Security"], position: { x: 4, y: 0, z: 5 } },
];

export const learningPaths: SkillLearningPath[] = [
  {
    id: "pentesting-basics",
    title: "Penetration Testing Fundamentals",
    description: "From networking basics to web application exploitation",
    difficulty: "beginner",
    steps: ["Networking", "Linux", "Python", "Nmap", "Burp Suite", "Metasploit", "Web Security", "Penetration Testing"],
  },
  {
    id: "soc-analyst",
    title: "SOC Analyst Track",
    description: "Build blue-team skills for security operations",
    difficulty: "intermediate",
    steps: ["Networking", "Linux", "Wireshark", "Threat Intelligence", "Incident Response", "Security Architecture", "SOC"],
  },
  {
    id: "exploit-dev",
    title: "Exploit Development",
    description: "From vulnerability research to weaponized exploits",
    difficulty: "advanced",
    steps: ["C/C++", "Python", "Binary Analysis", "Fuzzing", "Reverse Engineering", "Exploit Development", "Zero-Day Research"],
  },
  {
    id: "cloud-security",
    title: "Cloud Security Engineer",
    description: "Secure cloud infrastructure from the ground up",
    difficulty: "intermediate",
    steps: ["Linux", "Networking", "AWS", "Azure", "Docker", "Kubernetes", "Terraform", "Cloud Security"],
  },
  {
    id: "ai-security",
    title: "AI Security Specialist",
    description: "Apply machine learning to security challenges",
    difficulty: "advanced",
    steps: ["Python", "Machine Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "AI Security"],
  },
];

export function getSkillsByCluster(cluster: string): GalaxySkill[] {
  return galaxySkills.filter((s) => s.cluster === cluster);
}

export function getSkillByName(name: string): GalaxySkill | undefined {
  return galaxySkills.find((s) => s.name === name);
}

export function getRelatedSkills(name: string): GalaxySkill[] {
  const skill = getSkillByName(name);
  if (!skill) return [];
  return skill.relatedSkills.map((n) => getSkillByName(n)).filter(Boolean) as GalaxySkill[];
}

export function getConnectionsForSkill(name: string): GalaxyConnection[] {
  return galaxyConnections.filter((c) => c.source === name || c.target === name);
}
