export type SkillCategory =
  | "programming" | "cybersecurity" | "networking" | "linux" | "windows"
  | "cloud" | "containers" | "devsecops" | "threat-hunting"
  | "incident-response" | "soc" | "pentest" | "forensics"
  | "malware-analysis" | "reverse-engineering" | "osint"
  | "automation" | "databases" | "version-control" | "documentation"
  | "research" | "professional";

export type LearningStatus = "active" | "maintaining" | "mastered" | "planning";

export interface SkillEvidence {
  projects: string[];
  certifications: string[];
  labs: string[];
  ctfs: string[];
  blogPosts: string[];
  articles: string[];
  githubRepos: { name: string; url: string; description: string }[];
}

export interface SkillEntry {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  firstLearned: string;
  learningStatus: LearningStatus;
  evidence: SkillEvidence;
  relatedSkills: string[];
  futureGoals: string[];
  evidenceCount: number;
}

export interface RoleCompatibility {
  id: string;
  role: string;
  description: string;
  relevantSkillIds: string[];
  supportingProjects: string[];
  certificates: string[];
  labs: string[];
}

export interface TechStack {
  id: string;
  name: string;
  description: string;
  skillIds: string[];
}

export const CATEGORY_LABELS: Record<SkillCategory, string> = {
  programming: "Programming", cybersecurity: "Cybersecurity", networking: "Networking",
  linux: "Linux", windows: "Windows", cloud: "Cloud", containers: "Containers",
  devsecops: "DevSecOps", "threat-hunting": "Threat Hunting",
  "incident-response": "Incident Response", soc: "SOC", pentest: "Penetration Testing",
  forensics: "Digital Forensics", "malware-analysis": "Malware Analysis",
  "reverse-engineering": "Reverse Engineering", osint: "OSINT",
  automation: "Automation", databases: "Databases", "version-control": "Version Control",
  documentation: "Documentation", research: "Research", professional: "Professional Skills",
};

export const skills: SkillEntry[] = [
  {
    id: "python", name: "Python", category: "programming",
    description: "Primary language for security tooling, automation, ML/AI, and backend services. Used across all major projects for detection engineering, data analysis, and exploit development.",
    firstLearned: "2018", learningStatus: "mastered",
    evidence: { projects: ["sentinel-ai", "threat-hunter", "autopwn", "redops", "forensic-analyzer", "log-ai", "ai-red-teamer", "phishshield"], certifications: ["pcep", "pcap"], labs: ["vm-kali", "vm-sentinel"], ctfs: ["thm-mr-robot"], blogPosts: ["python-security-automation"], articles: ["security-programming"], githubRepos: [{ name: "security-toolkit", url: "https://github.com/maanas/security-toolkit", description: "Modular Python security tools for automation" }] },
    relatedSkills: ["typescript", "rust", "bash", "network-automation"], futureGoals: ["Advanced ML security applications", "Rust-Python hybrid tools"],
    evidenceCount: 12,
  },
  {
    id: "typescript", name: "TypeScript", category: "programming",
    description: "Full-stack development with type safety. Powers the entire Cyber Nexus portfolio platform, CLI tools, and dashboard infrastructure.",
    firstLearned: "2020", learningStatus: "mastered",
    evidence: { projects: ["sentinel-ai", "ctf-platform", "phishshield", "dashboard"], certifications: [], labs: [], ctfs: [], blogPosts: [], articles: ["security-programming"], githubRepos: [{ name: "cyber-nexus", url: "https://github.com/maanas/cyber-nexus", description: "Cyber Nexus portfolio platform" }] },
    relatedSkills: ["javascript", "python", "automation-scripting"], futureGoals: ["TypeScript security linter", "Type-safe DSL for detection rules"],
    evidenceCount: 6,
  },
  {
    id: "javascript", name: "JavaScript", category: "programming",
    description: "Core web language for browser extensions, API development, and full-stack applications.",
    firstLearned: "2017", learningStatus: "maintaining",
    evidence: { projects: ["phishshield", "ctf-platform"], certifications: [], labs: [], ctfs: [], blogPosts: [], articles: [], githubRepos: [] },
    relatedSkills: ["typescript", "python"], futureGoals: [],
    evidenceCount: 2,
  },
  {
    id: "bash", name: "Bash/Shell Scripting", category: "linux",
    description: "Essential for Linux automation, log analysis pipelines, system administration, and security operations workflows.",
    firstLearned: "2018", learningStatus: "mastered",
    evidence: { projects: ["sentinel-ai", "netdefend"], certifications: ["lpic", "rhcsa"], labs: ["vm-kali", "vm-splunk", "vm-wazuh"], ctfs: [], blogPosts: [], articles: ["linux-security-fundamentals", "linux-cli-security"], githubRepos: [{ name: "bash-security-tools", url: "https://github.com/maanas/bash-security-tools", description: "Shell-based security auditing tools" }] },
    relatedSkills: ["python", "linux-admin", "automation-scripting"], futureGoals: ["Advanced sed/awk mastery", "POSIX compliance auditing"],
    evidenceCount: 8,
  },
  {
    id: "powershell", name: "PowerShell", category: "windows",
    description: "Windows automation, AD administration, forensic data collection, and security analysis scripting.",
    firstLearned: "2020", learningStatus: "active",
    evidence: { projects: ["active-directory-lab"], certifications: ["az-500"], labs: ["vm-domain-controller", "vm-win-client"], ctfs: ["thm-steel-mountain"], blogPosts: [], articles: ["windows-security-essentials", "windows-log-analysis", "active-directory-security"], githubRepos: [{ name: "powershell-security", url: "https://github.com/maanas/powershell-security", description: "PowerShell security and administration scripts" }] },
    relatedSkills: ["windows-admin", "active-directory", "automation-scripting"], futureGoals: ["PowerShell 7 cross-platform workflows", "PowerShell DSC for compliance automation"],
    evidenceCount: 8,
  },
  {
    id: "sql", name: "SQL", category: "databases",
    description: "Database query and security analysis. Used for log analysis, data correlation, and security assessment.",
    firstLearned: "2018", learningStatus: "maintaining",
    evidence: { projects: ["sentinel-ai", "soc-automation-framework"], certifications: [], labs: ["vm-splunk", "vm-elk"], ctfs: ["ctf-sqli"], blogPosts: [], articles: ["common-web-vulnerabilities"], githubRepos: [] },
    relatedSkills: ["python", "siem-platform", "automation-scripting"], futureGoals: ["Advanced SIEM query optimization"],
    evidenceCount: 5,
  },
  {
    id: "network-security", name: "Network Security", category: "networking",
    description: "Network defense architecture including segmentation, firewall policy design, IDS/IPS, VPNs, and traffic analysis.",
    firstLearned: "2020", learningStatus: "mastered",
    evidence: { projects: ["sentinel-ai", "netdefend", "soc-automation-framework"], certifications: ["security-plus", "network-plus", "ccna"], labs: ["vm-pfsense", "vm-kali", "vm-splunk"], ctfs: ["thm-mr-robot"], blogPosts: ["zero-trust-architecture-deep-dive"], articles: ["network-security-fundamentals", "osi-model", "tcp-ip-suite"], githubRepos: [] },
    relatedSkills: ["firewalls", "wireshark", "nmap", "network-automation"], futureGoals: ["Zero Trust Architecture implementation", "SDN security"],
    evidenceCount: 12,
  },
  {
    id: "firewalls", name: "Firewalls & ACLs", category: "networking",
    description: "Firewall rule design, network ACL management, and stateful/stateless traffic filtering across physical and cloud environments.",
    firstLearned: "2020", learningStatus: "mastered",
    evidence: { projects: ["sentinel-ai", "cloud-security-lab"], certifications: ["security-plus", "ccna"], labs: ["vm-pfsense", "vm-cloud-bastion"], ctfs: [], blogPosts: [], articles: ["network-security-fundamentals", "cloud-security-fundamentals"], githubRepos: [] },
    relatedSkills: ["network-security", "aws-networking", "cloud-security"], futureGoals: ["NGFW policy automation"],
    evidenceCount: 7,
  },
  {
    id: "wireshark", name: "Wireshark / Packet Analysis", category: "networking",
    description: "Deep packet inspection, protocol analysis, traffic forensics, and custom display filter creation.",
    firstLearned: "2019", learningStatus: "maintaining",
    evidence: { projects: ["sentinel-ai", "forensic-analyzer"], certifications: ["gcia"], labs: ["vm-kali", "vm-dfir-workstation"], ctfs: [], blogPosts: [], articles: ["tcp-ip-suite"], githubRepos: [] },
    relatedSkills: ["network-security", "tcpip", "network-forensics"], futureGoals: ["Lua dissector development"],
    evidenceCount: 5,
  },
  {
    id: "nmap", name: "Nmap / Network Mapping", category: "networking",
    description: "Network discovery, port scanning, service enumeration, OS fingerprinting, and NSE script development.",
    firstLearned: "2019", learningStatus: "mastered",
    evidence: { projects: ["offensive-security-lab", "autopwn"], certifications: ["oscp", "ceh"], labs: ["vm-kali", "vm-pfsense"], ctfs: ["thm-mr-robot", "thm-steel-mountain"], blogPosts: [], articles: ["penetration-testing-tools"], githubRepos: [] },
    relatedSkills: ["network-security", "wireshark", "vulnerability-assessment"], futureGoals: ["NSE module development"],
    evidenceCount: 8,
  },
  {
    id: "linux-admin", name: "Linux Administration", category: "linux",
    description: "System administration, hardening, performance tuning, kernel security, and service management across enterprise distributions.",
    firstLearned: "2018", learningStatus: "mastered",
    evidence: { projects: ["sentinel-ai", "cloud-security-lab", "soc-automation-framework"], certifications: ["lpic", "rhcsa"], labs: ["vm-kali", "vm-sentinel", "vm-web-server", "vm-splunk", "vm-wazuh", "vm-cloud-bastion"], ctfs: [], blogPosts: [], articles: ["linux-security-fundamentals", "linux-cli-security"], githubRepos: [{ name: "linux-hardening", url: "https://github.com/maanas/linux-hardening", description: "Linux security hardening scripts and configurations" }] },
    relatedSkills: ["bash", "docker", "k8s-security", "network-automation"], futureGoals: ["Kernel module security audit", "eBPF-based security monitoring"],
    evidenceCount: 12,
  },
  {
    id: "windows-admin", name: "Windows Administration", category: "windows",
    description: "Windows Server management, Group Policy, security configuration, event log management, and system hardening.",
    firstLearned: "2020", learningStatus: "active",
    evidence: { projects: ["active-directory-lab"], certifications: ["az-500", "ms-500"], labs: ["vm-domain-controller", "vm-win-client", "vm-dfir-workstation"], ctfs: ["thm-steel-mountain"], blogPosts: [], articles: ["windows-security-essentials", "windows-log-analysis"], githubRepos: [] },
    relatedSkills: ["active-directory", "powershell", "windows-forensics"], futureGoals: ["Windows Defender for Cloud", "Microsoft 365 Defender advanced hunting"],
    evidenceCount: 7,
  },
  {
    id: "active-directory", name: "Active Directory Security", category: "windows",
    description: "AD security assessment, attack path analysis with BloodHound, privilege escalation, Kerberos attacks, and defensive hardening.",
    firstLearned: "2021", learningStatus: "active",
    evidence: { projects: ["active-directory-lab"], certifications: ["oscp", "crto"], labs: ["vm-domain-controller", "vm-win-client", "vm-kali"], ctfs: [], blogPosts: [], articles: ["active-directory-security", "ad-attack-vectors"], githubRepos: [{ name: "ad-security-audit", url: "https://github.com/maanas/ad-security-audit", description: "Active Directory security assessment toolkit" }] },
    relatedSkills: ["windows-admin", "kerberos", "bloodhound", "pentest-networks"], futureGoals: ["AD CS attack paths", "Azure AD security assessment"],
    evidenceCount: 8,
  },
  {
    id: "server-hardening", name: "Server Hardening", category: "linux",
    description: "Enterprise server security hardening including CIS benchmarks, STIG compliance, kernel parameter tuning, and service minimization.",
    firstLearned: "2019", learningStatus: "maintaining",
    evidence: { projects: ["sentinel-ai", "cloud-security-lab"], certifications: ["security-plus", "lpic"], labs: ["vm-web-server", "vm-pfsense", "vm-cloud-bastion"], ctfs: [], blogPosts: [], articles: ["linux-security-fundamentals"], githubRepos: [{ name: "server-hardening", url: "https://github.com/maanas/server-hardening", description: "Server hardening automation" }] },
    relatedSkills: ["linux-admin", "cloud-security", "container-security"], futureGoals: ["Automated STIG compliance checking"],
    evidenceCount: 7,
  },
  {
    id: "cloud-security", name: "Cloud Security (AWS)", category: "cloud",
    description: "AWS security architecture including IAM policies, S3 security, VPC design, CloudTrail auditing, GuardDuty, and security compliance automation.",
    firstLearned: "2021", learningStatus: "active",
    evidence: { projects: ["cloud-security-lab", "sentinel-ai"], certifications: ["aws-sa", "aws-security", "ccsp"], labs: ["vm-cloud-bastion"], ctfs: [], blogPosts: ["cloud-security"], articles: ["cloud-security-fundamentals"], githubRepos: [{ name: "cloud-security-toolkit", url: "https://github.com/maanas/cloud-security-toolkit", description: "AWS security assessment tools" }] },
    relatedSkills: ["aws-networking", "iam", "container-security", "terraform"], futureGoals: ["AWS Security Hub advanced analytics", "Multi-cloud security posture management"],
    evidenceCount: 9,
  },
  {
    id: "terraform", name: "Terraform / IaC", category: "cloud",
    description: "Infrastructure as Code for cloud resource provisioning, security group management, and compliance-as-code implementations.",
    firstLearned: "2022", learningStatus: "active",
    evidence: { projects: ["cloud-security-lab"], certifications: ["aws-sa"], labs: ["vm-cloud-bastion"], ctfs: [], blogPosts: [], articles: ["cloud-security-fundamentals", "devsecops-pipeline"], githubRepos: [{ name: "terraform-security", url: "https://github.com/maanas/terraform-security", description: "Terraform modules for secure cloud infrastructure" }] },
    relatedSkills: ["cloud-security", "aws-networking", "docker", "k8s-security"], futureGoals: ["Cross-cloud IaC standardization", "Policy-as-Code with OPA/Sentinel"],
    evidenceCount: 6,
  },
  {
    id: "docker", name: "Docker / Containerization", category: "containers",
    description: "Container security, image hardening, Dockerfile optimization, registry management, and container runtime security.",
    firstLearned: "2020", learningStatus: "mastered",
    evidence: { projects: ["sentinel-ai", "cloud-security-lab", "ctf-platform"], certifications: ["cks"], labs: ["vm-k8s-master", "vm-sentinel", "ct-portainer"], ctfs: [], blogPosts: ["kubernetes-security-hardening"], articles: ["docker-security", "container-security-overview"], githubRepos: [{ name: "docker-security-tools", url: "https://github.com/maanas/docker-security-tools", description: "Docker security scanning and hardening" }] },
    relatedSkills: ["linux-admin", "k8s-security", "devsecops-automation", "terraform"], futureGoals: ["Rootless container adoption", "OCI artifact signing standardization"],
    evidenceCount: 10,
  },
  {
    id: "k8s-security", name: "Kubernetes Security", category: "containers",
    description: "K8s cluster security, RBAC configuration, pod security policies (PSP/PSS), admission controllers, network policies, and audit logging.",
    firstLearned: "2021", learningStatus: "active",
    evidence: { projects: ["cloud-security-lab"], certifications: ["cks", "cka"], labs: ["vm-k8s-master", "ct-grafana", "ct-prometheus"], ctfs: [], blogPosts: ["kubernetes-security-hardening"], articles: ["container-security-overview", "docker-security"], githubRepos: [{ name: "k8s-security-audit", url: "https://github.com/maanas/k8s-security-audit", description: "Kubernetes security audit and hardening toolkit" }] },
    relatedSkills: ["docker", "linux-admin", "cloud-security", "devsecops-automation"], futureGoals: ["Service mesh security (Istio)", "K8s admission webhook development"],
    evidenceCount: 9,
  },
  {
    id: "soc-operations", name: "SOC Operations", category: "soc",
    description: "Security operations center processes, tier model implementation, escalation procedures, SLA management, and SOC maturity improvement.",
    firstLearned: "2022", learningStatus: "maintaining",
    evidence: { projects: ["sentinel-ai", "soc-automation-framework"], certifications: ["cysa-plus", "security-plus", "cissp"], labs: ["vm-splunk", "vm-wazuh"], ctfs: [], blogPosts: [], articles: ["soc-operations", "soc-maturity", "incident-response-lifecycle"], githubRepos: [] },
    relatedSkills: ["siem-platform", "threat-intel", "incident-response", "detection-engineering"], futureGoals: ["SOAR implementation", "SOC metrics automation"],
    evidenceCount: 8,
  },
  {
    id: "siem-platform", name: "SIEM (Splunk/ELK)", category: "soc",
    description: "SIEM architecture, log ingestion, search/query optimization, correlation rule creation, dashboard design, and data pipeline management.",
    firstLearned: "2021", learningStatus: "active",
    evidence: { projects: ["sentinel-ai", "soc-automation-framework"], certifications: ["splunk-power-user", "cysa-plus"], labs: ["vm-splunk", "vm-wazuh", "vm-elk"], ctfs: [], blogPosts: [], articles: ["siem-architecture", "soc-operations", "mitre-attack-framework"], githubRepos: [{ name: "siem-rules", url: "https://github.com/maanas/siem-rules", description: "SIEM correlation rules and detection content" }] },
    relatedSkills: ["soc-operations", "detection-engineering", "threat-intel", "log-analysis"], futureGoals: ["ML-driven anomaly detection in SIEM", "Automated SIEM tuning"],
    evidenceCount: 9,
  },
  {
    id: "detection-engineering", name: "Detection Engineering", category: "soc",
    description: "Detection rule development using Sigma, YARA, Splunk SPL, KQL, and Elastic EQL. Coverage mapping to MITRE ATT&CK.",
    firstLearned: "2022", learningStatus: "active",
    evidence: { projects: ["sentinel-ai", "soc-automation-framework"], certifications: [], labs: ["vm-splunk", "vm-wazuh", "vm-sentinel"], ctfs: [], blogPosts: [], articles: ["mitre-attack-framework", "siem-architecture", "threat-hunting-methodology"], githubRepos: [{ name: "detection-rules", url: "https://github.com/maanas/detection-rules", description: "Sigma and custom detection rules mapped to MITRE ATT&CK" }] },
    relatedSkills: ["siem-platform", "threat-intel", "yara", "sigma"], futureGoals: ["Adversary emulation planning", "Detection-as-Code pipeline"],
    evidenceCount: 7,
  },
  {
    id: "threat-intel", name: "Threat Intelligence", category: "threat-hunting",
    description: "Threat intelligence collection, analysis, and operationalization. IOC management, TTP analysis, and intelligence-driven detection.",
    firstLearned: "2022", learningStatus: "active",
    evidence: { projects: ["sentinel-ai", "soc-automation-framework"], certifications: ["cissp"], labs: ["vm-splunk", "vm-misp"], ctfs: [], blogPosts: [], articles: ["threat-hunting-methodology", "mitre-attack-framework"], githubRepos: [] },
    relatedSkills: ["detection-engineering", "threat-hunting", "soc-operations"], futureGoals: ["CTI platform deployment", "Automated intelligence ingestion pipeline"],
    evidenceCount: 5,
  },
  {
    id: "threat-hunting", name: "Threat Hunting", category: "threat-hunting",
    description: "Hypothesis-driven proactive threat detection, baseline analysis, anomaly identification, and IOA-based investigation.",
    firstLearned: "2023", learningStatus: "active",
    evidence: { projects: ["sentinel-ai"], certifications: ["gcia"], labs: ["vm-splunk", "vm-elk", "vm-dfir-workstation"], ctfs: [], blogPosts: [], articles: ["threat-hunting-methodology", "mitre-attack-framework"], githubRepos: [] },
    relatedSkills: ["detection-engineering", "threat-intel", "siem-platform", "log-analysis"], futureGoals: ["Automated hunting playbooks", "UEBA implementation"],
    evidenceCount: 6,
  },
  {
    id: "incident-response", name: "Incident Response", category: "incident-response",
    description: "Full IR lifecycle management: detection, containment, eradication, recovery, and post-mortem analysis following NIST 800-61 methodology.",
    firstLearned: "2021", learningStatus: "maintaining",
    evidence: { projects: ["sentinel-ai", "soc-automation-framework"], certifications: ["gcih", "cissp", "cysa-plus"], labs: ["vm-dfir-workstation", "vm-splunk", "vm-wazuh"], ctfs: [], blogPosts: ["incident-response-playbook"], articles: ["incident-response-lifecycle", "digital-forensics-process"], githubRepos: [{ name: "ir-playbooks", url: "https://github.com/maanas/ir-playbooks", description: "Incident response runbooks and automation scripts" }] },
    relatedSkills: ["soc-operations", "digital-forensics", "malware-analysis", "threat-hunting"], futureGoals: ["Automated IR orchestration", "Cloud incident response specialization"],
    evidenceCount: 10,
  },
  {
    id: "digital-forensics", name: "Digital Forensics", category: "forensics",
    description: "Evidence acquisition, forensic imaging, timeline analysis, filesystem forensics, and report preparation for legal proceedings.",
    firstLearned: "2022", learningStatus: "active",
    evidence: { projects: [], certifications: ["gcfi", "chfi"], labs: ["vm-dfir-workstation", "vm-malware-sandbox", "vm-win-client"], ctfs: ["thm-forensics"], blogPosts: [], articles: ["digital-forensics-process", "windows-log-analysis"], githubRepos: [{ name: "forensic-tools", url: "https://github.com/maanas/forensic-tools", description: "Digital forensic analysis scripts" }] },
    relatedSkills: ["windows-forensics", "malware-analysis", "incident-response", "volatility"], futureGoals: ["MacOS forensics", "Cloud forensics specialization"],
    evidenceCount: 7,
  },
  {
    id: "malware-analysis", name: "Malware Analysis", category: "malware-analysis",
    description: "Static and dynamic malware analysis, sandbox execution, behavioral analysis, and IOC extraction for detection and response.",
    firstLearned: "2022", learningStatus: "active",
    evidence: { projects: [], certifications: ["grem"], labs: ["vm-malware-sandbox", "vm-dfir-workstation", "vm-kali"], ctfs: [], blogPosts: ["malware-analysis"], articles: ["malware-analysis-fundamentals"], githubRepos: [{ name: "malware-lab", url: "https://github.com/maanas/malware-lab", description: "Malware analysis sandbox configuration and scripts" }] },
    relatedSkills: ["digital-forensics", "reverse-engineering", "yara", "incident-response"], futureGoals: ["Kernel-level malware analysis", "MacOS malware research"],
    evidenceCount: 6,
  },
  {
    id: "web-security", name: "Web Application Security", category: "pentest",
    description: "Web application vulnerability assessment, OWASP Top 10 exploitation, secure code review, and defensive application security architecture.",
    firstLearned: "2020", learningStatus: "mastered",
    evidence: { projects: ["web-security-fundamentals", "offensive-security-lab"], certifications: ["oscp", "ceh", "gwapt"], labs: ["lab-juice-shop", "vm-kali"], ctfs: ["thm-mr-robot", "thm-sqli"], blogPosts: ["web-security"], articles: ["web-app-security", "common-web-vulnerabilities", "owasp-top-10"], githubRepos: [{ name: "web-security-tools", url: "https://github.com/maanas/web-security-tools", description: "Web application security testing toolkit" }] },
    relatedSkills: ["burp-suite", "owasp", "network-security", "javascript", "python"], futureGoals: ["Browser security research", "API security testing methodology"],
    evidenceCount: 12,
  },
  {
    id: "burp-suite", name: "Burp Suite", category: "pentest",
    description: "Web application interception proxy for manual and automated security testing. Extension development and scanning pipeline automation.",
    firstLearned: "2020", learningStatus: "mastered",
    evidence: { projects: ["web-security-fundamentals", "offensive-security-lab"], certifications: ["oscp", "ceh", "gwapt"], labs: ["lab-juice-shop", "vm-kali"], ctfs: ["thm-mr-robot", "thm-sqli"], blogPosts: [], articles: ["penetration-testing-tools"], githubRepos: [] },
    relatedSkills: ["web-security", "owasp", "nmap"], futureGoals: ["BApp store extension development"],
    evidenceCount: 8,
  },
  {
    id: "exploit-development", name: "Exploit Development", category: "pentest",
    description: "Vulnerability research, fuzzing, buffer overflow exploitation, ROP chain construction, and exploit mitigation bypass techniques.",
    firstLearned: "2021", learningStatus: "active",
    evidence: { projects: ["offensive-security-lab"], certifications: ["oscp", "osce"], labs: ["vm-kali", "vm-malware-sandbox"], ctfs: ["thm-bof"], blogPosts: [], articles: ["reverse-engineering-fundamentals", "malware-analysis-fundamentals"], githubRepos: [{ name: "exploit-dev", url: "https://github.com/maanas/exploit-dev", description: "Exploit development PoCs and tools" }] },
    relatedSkills: ["reverse-engineering", "python", "assembly", "c-family"], futureGoals: ["Windows kernel exploitation", "ARM64 exploit development"],
    evidenceCount: 7,
  },
  {
    id: "reverse-engineering", name: "Reverse Engineering", category: "reverse-engineering",
    description: "Binary analysis, disassembly, decompilation, protocol reversing, and patch analysis using Ghidra, IDA Pro, and x64dbg.",
    firstLearned: "2022", learningStatus: "active",
    evidence: { projects: [], certifications: ["grem", "osce"], labs: ["vm-kali", "vm-dfir-workstation", "vm-malware-sandbox"], ctfs: ["thm-reverse"], blogPosts: [], articles: ["reverse-engineering-fundamentals", "malware-analysis-fundamentals"], githubRepos: [{ name: "reverse-engineering-lab", url: "https://github.com/maanas/reverse-engineering-lab", description: "Reverse engineering scripts and analysis" }] },
    relatedSkills: ["exploit-development", "malware-analysis", "assembly", "c-family"], futureGoals: ["Game hacking research", "Firmware reversing"],
    evidenceCount: 6,
  },
  {
    id: "cryptography", name: "Cryptography", category: "cybersecurity",
    description: "Cryptographic primitives, PKI, TLS protocol, hashing algorithms, encryption standards, and key management practices.",
    firstLearned: "2020", learningStatus: "maintaining",
    evidence: { projects: ["sentinel-ai"], certifications: ["security-plus", "cissp"], labs: [], ctfs: ["thm-crypto"], blogPosts: ["cryptography"], articles: ["cryptography-concepts", "tls-pki-infrastructure"], githubRepos: [] },
    relatedSkills: ["web-security", "tls-pki", "network-security"], futureGoals: ["Post-quantum cryptography research", "Hardware security module integration"],
    evidenceCount: 6,
  },
  {
    id: "osint", name: "OSINT Techniques", category: "osint",
    description: "Open-source intelligence gathering, domain investigation, social media analysis, and reconnaissance methodology.",
    firstLearned: "2021", learningStatus: "maintaining",
    evidence: { projects: [], certifications: [], labs: ["vm-kali"], ctfs: ["thm-osint"], blogPosts: [], articles: ["osint-techniques"], githubRepos: [] },
    relatedSkills: ["web-security", "network-security", "nmap"], futureGoals: ["Automated OSINT pipeline development"],
    evidenceCount: 3,
  },
  {
    id: "devsecops-automation", name: "DevSecOps Pipeline Security", category: "devsecops",
    description: "CI/CD security integration including SAST, DAST, SCA, container scanning, IaC validation, and shift-left security practices.",
    firstLearned: "2022", learningStatus: "active",
    evidence: { projects: ["cloud-security-lab", "soc-automation-framework"], certifications: ["cks", "aws-sa"], labs: ["vm-cloud-bastion", "vm-k8s-master"], ctfs: [], blogPosts: [], articles: ["devsecops-pipeline", "cloud-security-fundamentals"], githubRepos: [{ name: "devsecops-pipeline", url: "https://github.com/maanas/devsecops-pipeline", description: "CI/CD security pipeline templates" }] },
    relatedSkills: ["terraform", "docker", "k8s-security", "cloud-security"], futureGoals: ["Supply chain security (SLSA, SBOM)", "Security-as-Code standardization"],
    evidenceCount: 7,
  },
  {
    id: "automation-scripting", name: "Security Automation", category: "automation",
    description: "Workflow automation, SOAR integration, playbook development, and automated incident response orchestration.",
    firstLearned: "2021", learningStatus: "active",
    evidence: { projects: ["sentinel-ai", "soc-automation-framework"], certifications: [], labs: ["vm-splunk", "vm-wazuh", "vm-sentinel"], ctfs: [], blogPosts: [], articles: ["soc-operations", "devsecops-pipeline"], githubRepos: [{ name: "automation-playbooks", url: "https://github.com/maanas/automation-playbooks", description: "Security automation and SOAR playbooks" }] },
    relatedSkills: ["python", "bash", "powershell", "soc-operations"], futureGoals: ["Full SOAR deployment", "Autonomous incident response"],
    evidenceCount: 6,
  },
  {
    id: "technical-writing", name: "Technical Writing", category: "documentation",
    description: "Security documentation, incident reports, research papers, architecture diagrams, and knowledge base article authoring.",
    firstLearned: "2019", learningStatus: "maintaining",
    evidence: { projects: ["sentinel-ai", "cyber-nexus"], certifications: [], labs: [], ctfs: [], blogPosts: ["zero-trust-architecture-deep-dive", "ai-powered-threat-detection", "smart-contract-security", "incident-response-playbook", "kubernetes-security-hardening", "phishing-defense-2024"], articles: [], githubRepos: [] },
    relatedSkills: ["research-methodology", "documentation-automation"], futureGoals: ["Technical book publication", "API documentation standardization"],
    evidenceCount: 6,
  },
  {
    id: "research-methodology", name: "Security Research", category: "research",
    description: "Hypothesis-driven research, vulnerability discovery, experimental design, responsible disclosure, and peer-reviewed publication.",
    firstLearned: "2021", learningStatus: "active",
    evidence: { projects: [], certifications: [], labs: ["vm-malware-sandbox", "vm-kali"], ctfs: ["thm-reverse"], blogPosts: ["smart-contract-security", "ai-powered-threat-detection"], articles: ["research-methodology", "malware-analysis-fundamentals"], githubRepos: [{ name: "security-research", url: "https://github.com/maanas/security-research", description: "Security research notes and PoCs" }] },
    relatedSkills: ["technical-writing", "exploit-development", "malware-analysis"], futureGoals: ["CVE discovery", "Conference presentation"],
    evidenceCount: 6,
  },
  {
    id: "version-control", name: "Git / Version Control", category: "version-control",
    description: "Git workflow management, branching strategies, code review, GitHub Actions CI/CD, and repository security best practices.",
    firstLearned: "2018", learningStatus: "mastered",
    evidence: { projects: ["sentinel-ai", "cyber-nexus", "cloud-security-lab", "active-directory-lab"], certifications: [], labs: [], ctfs: [], blogPosts: [], articles: ["devsecops-pipeline"], githubRepos: [{ name: "cyber-nexus", url: "https://github.com/maanas/cyber-nexus", description: "Cyber Nexus portfolio" }, { name: "security-toolkit", url: "https://github.com/maanas/security-toolkit", description: "Security toolkit" }] },
    relatedSkills: ["devsecops-automation", "technical-writing"], futureGoals: ["Advanced GitHub Actions security workflows"],
    evidenceCount: 6,
  },
  {
    id: "professional-communication", name: "Professional Communication", category: "professional",
    description: "Technical presentation, cross-team collaboration, incident communication, stakeholder reporting, and mentorship.",
    firstLearned: "2019", learningStatus: "maintaining",
    evidence: { projects: [], certifications: [], labs: [], ctfs: [], blogPosts: [], articles: ["career-paths"], githubRepos: [] },
    relatedSkills: ["technical-writing", "research-methodology"], futureGoals: ["Security leadership development"],
    evidenceCount: 1,
  },
];

export const roles: RoleCompatibility[] = [
  { id: "role-soc", role: "SOC Analyst", description: "Monitor, triage, and escalate security incidents using SIEM platforms and threat intelligence.",
    relevantSkillIds: ["soc-operations", "siem-platform", "detection-engineering", "threat-intel", "incident-response", "network-security", "windows-admin", "linux-admin"],
    supportingProjects: ["sentinel-ai", "soc-automation-framework"], certificates: ["security-plus", "cysa-plus", "gcih"], labs: ["vm-splunk", "vm-wazuh", "vm-sentinel"] },
  { id: "role-pentest", role: "Penetration Tester", description: "Identify and exploit vulnerabilities in networks, web applications, and systems through authorized assessments.",
    relevantSkillIds: ["web-security", "nmap", "burp-suite", "exploit-development", "network-security", "active-directory", "reverse-engineering", "python", "bash", "cryptography"],
    supportingProjects: ["offensive-security-lab", "web-security-fundamentals", "active-directory-lab"], certificates: ["oscp", "ceh", "osce"], labs: ["vm-kali", "vm-domain-controller", "lab-juice-shop"] },
  { id: "role-engineer", role: "Security Engineer", description: "Design, implement, and maintain security infrastructure including SIEM, EDR, firewalls, and cloud security controls.",
    relevantSkillIds: ["linux-admin", "windows-admin", "cloud-security", "docker", "k8s-security", "firewalls", "siem-platform", "devsecops-automation", "terraform", "automation-scripting"],
    supportingProjects: ["sentinel-ai", "cloud-security-lab", "soc-automation-framework"], certificates: ["aws-sa", "aws-security", "cks", "ccna"], labs: ["vm-pfsense", "vm-cloud-bastion", "vm-k8s-master", "vm-splunk"] },
  { id: "role-cloud", role: "Cloud Security Engineer", description: "Secure cloud infrastructure across IaaS, PaaS, and SaaS with IAM, encryption, monitoring, and compliance automation.",
    relevantSkillIds: ["cloud-security", "terraform", "docker", "k8s-security", "devsecops-automation", "network-security", "iam", "automation-scripting", "linux-admin"],
    supportingProjects: ["cloud-security-lab", "sentinel-ai"], certificates: ["aws-sa", "aws-security", "ccsp", "cks"], labs: ["vm-cloud-bastion", "vm-k8s-master"] },
  { id: "role-hunter", role: "Threat Hunter", description: "Proactively search for threats using hypothesis-driven analysis, advanced SIEM queries, and threat intelligence integration.",
    relevantSkillIds: ["threat-hunting", "threat-intel", "detection-engineering", "siem-platform", "incident-response", "network-security", "python"],
    supportingProjects: ["sentinel-ai", "soc-automation-framework"], certificates: ["gcia", "cysa-plus"], labs: ["vm-splunk", "vm-elk", "vm-dfir-workstation"] },
  { id: "role-forensics", role: "Digital Forensics Analyst", description: "Collect, preserve, and analyze digital evidence for incident investigations and legal proceedings.",
    relevantSkillIds: ["digital-forensics", "malware-analysis", "incident-response", "windows-admin", "linux-admin", "reverse-engineering", "technical-writing"],
    supportingProjects: [], certificates: ["gcfi", "chfi", "grem"], labs: ["vm-dfir-workstation", "vm-malware-sandbox", "vm-win-client"] },
];

export const techStacks: TechStack[] = [
  { id: "stack-soc", name: "SOC Operations Stack", description: "Tools and skills for security monitoring and operations", skillIds: ["soc-operations", "siem-platform", "detection-engineering", "threat-intel", "incident-response", "automation-scripting", "python"] },
  { id: "stack-web", name: "Web Security Stack", description: "Skills for web application security assessment", skillIds: ["web-security", "burp-suite", "owasp", "network-security", "javascript", "python", "nmap"] },
  { id: "stack-cloud", name: "Cloud Security Stack", description: "Skills for cloud infrastructure security", skillIds: ["cloud-security", "terraform", "docker", "k8s-security", "devsecops-automation", "linux-admin", "network-security"] },
  { id: "stack-pentest", name: "Penetration Testing Stack", description: "Skills for offensive security engagements", skillIds: ["nmap", "burp-suite", "web-security", "exploit-development", "active-directory", "network-security", "python", "bash", "reverse-engineering"] },
  { id: "stack-devsecops", name: "DevSecOps Stack", description: "Skills for CI/CD and pipeline security", skillIds: ["devsecops-automation", "terraform", "docker", "k8s-security", "cloud-security", "automation-scripting", "version-control"] },
  { id: "stack-forensics", name: "Digital Forensics Stack", description: "Skills for forensic analysis and investigation", skillIds: ["digital-forensics", "malware-analysis", "incident-response", "windows-admin", "linux-admin", "powershell", "wireshark"] },
];

export function getSkillById(id: string): SkillEntry | undefined {
  return skills.find((s) => s.id === id);
}

export function getSkillsByCategory(cat: SkillCategory): SkillEntry[] {
  return skills.filter((s) => s.category === cat);
}

export function getTotalEvidenceCount(): number {
  return skills.reduce((sum, s) => sum + s.evidenceCount, 0);
}

export function getActiveSkillCount(): number {
  return skills.filter((s) => s.learningStatus === "active").length;
}
