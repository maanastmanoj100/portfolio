export type NodeType =
  | "project" | "skill" | "certification" | "technology"
  | "tool" | "blog" | "ctf" | "lab_vm" | "research"
  | "learning_path" | "future_goal" | "os" | "framework";

export type EdgeType =
  | "uses" | "built_with" | "documents" | "explains"
  | "inspired_by" | "extends" | "depends_on" | "related_to"
  | "requires" | "leads_to" | "demonstrates" | "supports"
  | "trains" | "hosts" | "connects_to" | "validates";

export interface GraphNode {
  id: string;
  label: string;
  description: string;
  type: NodeType;
  category: string;
  color: string;
  size: number;
  href?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  pinned: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label: string;
}

const NODE_COLORS: Record<NodeType, string> = {
  project: "#22d3ee",
  skill: "#8b5cf6",
  certification: "#f59e0b",
  technology: "#3b82f6",
  tool: "#10b981",
  blog: "#ef4444",
  ctf: "#ec4899",
  lab_vm: "#14b8a6",
  research: "#f97316",
  learning_path: "#6366f1",
  future_goal: "#84cc16",
  os: "#64748b",
  framework: "#06b6d4",
};

const NODE_SIZES: Record<NodeType, number> = {
  project: 12,
  skill: 10,
  certification: 9,
  technology: 8,
  tool: 7,
  blog: 9,
  ctf: 8,
  lab_vm: 9,
  research: 8,
  learning_path: 11,
  future_goal: 7,
  os: 7,
  framework: 8,
};

export function createNode(
  id: string, label: string, description: string,
  type: NodeType, category: string, href?: string
): GraphNode {
  return {
    id, label, description, type, category,
    color: NODE_COLORS[type], size: NODE_SIZES[type],
    href, x: 0, y: 0, vx: 0, vy: 0, pinned: false,
  };
}

export function createEdge(
  id: string, source: string, target: string, type: EdgeType, label: string
): GraphEdge {
  return { id, source, target, type, label };
}

export const labelByType: Record<NodeType, string> = {
  project: "Project", skill: "Skill", certification: "Certification",
  technology: "Technology", tool: "Tool", blog: "Blog Post",
  ctf: "CTF Challenge", lab_vm: "Lab VM", research: "Research",
  learning_path: "Learning Path", future_goal: "Future Goal",
  os: "Operating System", framework: "Framework",
};

export const nodes: GraphNode[] = [
  createNode("sentinel-ai", "Sentinel AI SOC", "Enterprise AI-powered SOC platform with real-time threat detection, automated incident response, and predictive analytics", "project", "SOC", "/projects/sentinel-ai"),
  createNode("project-cybershield", "Project CyberShield", "Advanced web application firewall and intrusion prevention system combining signature-based and behavioral detection", "project", "Web Security", "/projects/project-cybershield"),
  createNode("offensive-security-lab", "Offensive Security Lab", "Comprehensive penetration testing framework with automated reconnaissance and reporting pipeline", "project", "Penetration Testing", "/projects/offensive-security-lab"),
  createNode("active-directory-lab", "Active Directory Lab", "Enterprise AD environment for attack path simulations and detection engineering", "project", "Active Directory", "/projects/active-directory-lab"),
  createNode("cloud-security-lab", "Cloud Security Lab", "AWS infrastructure security assessment platform with automated auditing and compliance checking", "project", "Cloud Security", "/projects/cloud-security-lab"),
  createNode("threat-intel-platform", "Threat Intelligence Platform", "Automated threat intelligence aggregation, analysis, and enrichment platform", "project", "Threat Intelligence", "/projects/threat-intel-platform"),
  createNode("soc-automation-framework", "SOC Automation Framework", "Automated SOC operations pipeline with enrichment, triage, and response playbooks", "project", "Automation", "/projects/soc-automation-framework"),
  createNode("network-defense-lab", "Network Defense Lab", "Network security monitoring lab with IDS/IPS, traffic analysis, and detection engineering", "project", "Network Security", "/projects/network-defense-lab"),
  createNode("dfir-lab", "DFIR Lab", "Digital forensics and incident response lab with memory analysis and timeline reconstruction", "project", "Forensics", "/projects/dfir-lab"),
  createNode("crypto-research-lab", "Cryptography Research Lab", "Applied cryptography research with implementation analysis and vulnerability research", "project", "Cryptography", "/projects/crypto-research-lab"),

  createNode("penetration-testing", "Penetration Testing", "Systematic security assessment methodology for identifying and exploiting vulnerabilities", "skill", "Offensive"),
  createNode("vulnerability-research", "Vulnerability Research", "Systematic discovery and analysis of security vulnerabilities in software and systems", "skill", "Offensive"),
  createNode("exploit-development", "Exploit Development", "Creation of proof-of-concept exploits for identified security vulnerabilities", "skill", "Offensive"),
  createNode("web-security", "Web Security", "Security assessment of web applications including OWASP Top 10 vulnerabilities", "skill", "Web"),
  createNode("network-security", "Network Security", "Design and assessment of secure network architectures and protocols", "skill", "Network"),
  createNode("active-directory-security", "Active Directory Security", "AD security assessment, attack path analysis, and defensive hardening", "skill", "AD"),
  createNode("cloud-security", "Cloud Security", "Security assessment of cloud infrastructure including AWS, Azure, and GCP", "skill", "Cloud"),
  createNode("soc-operations", "SOC Operations", "Security operations center management including monitoring, triage, and incident response", "skill", "SOC"),
  createNode("threat-hunting", "Threat Hunting", "Proactive search for advanced threats and adversaries within network environments", "skill", "SOC"),
  createNode("digital-forensics", "Digital Forensics", "Systematic investigation of digital evidence including disk, memory, and network forensics", "skill", "Forensics"),
  createNode("malware-analysis", "Malware Analysis", "Static and dynamic analysis of malicious software to understand behavior and impact", "skill", "Malware"),
  createNode("incident-response", "Incident Response", "Structured approach to handling security incidents following NIST 800-61 framework", "skill", "SOC"),
  createNode("siem-engineering", "SIEM Engineering", "Design, deployment, and tuning of SIEM platforms including Splunk and Elasticsearch", "skill", "SOC"),
  createNode("detection-engineering", "Detection Engineering", "Development of detection rules and signatures using Sigma, SPL, and YARA", "skill", "SOC"),
  createNode("python", "Python", "Primary automation and tooling language used across all portfolio projects", "skill", "Programming"),
  createNode("typescript", "TypeScript", "Web development language used for Cyber Nexus portfolio and related tools", "skill", "Programming"),

  createNode("OSCP", "OSCP", "Offensive Security Certified Professional — hands-on penetration testing certification", "certification", "Offensive Security"),
  createNode("CEH", "CEH", "Certified Ethical Hacker — comprehensive ethical hacking methodology certification", "certification", "EC-Council"),
  createNode("Security+", "Security+", "CompTIA Security+ — foundational cybersecurity certification", "certification", "CompTIA"),
  createNode("CySA+", "CySA+", "CompTIA Cybersecurity Analyst — behavioral analytics and security operations", "certification", "CompTIA"),
  createNode("Network+", "Network+", "CompTIA Network+ — networking fundamentals and infrastructure certification", "certification", "CompTIA"),
  createNode("AWS-Security", "AWS Certified Security", "AWS security services, compliance, and infrastructure protection certification", "certification", "Amazon Web Services"),

  createNode("python-lang", "Python", "High-level programming language for automation, data analysis, and security tools", "technology", "Programming"),
  createNode("typescript-lang", "TypeScript", "Typed JavaScript superset for building scalable web applications", "technology", "Programming"),
  createNode("go", "Go", "Compiled language for high-performance network tools and concurrent applications", "technology", "Programming"),
  createNode("rust", "Rust", "Systems programming language focused on safety, speed, and memory efficiency", "technology", "Programming"),
  createNode("splunk", "Splunk", "Enterprise SIEM platform for log aggregation, correlation, and security monitoring", "tool", "SIEM"),
  createNode("elasticsearch", "Elasticsearch", "Distributed search and analytics engine for log storage and analysis", "tool", "SIEM"),
  createNode("kibana", "Kibana", "Data visualization dashboard for Elasticsearch log data", "tool", "SIEM"),
  createNode("wazuh", "Wazuh", "Open-source XDR platform for endpoint security monitoring and compliance", "tool", "Security"),
  createNode("nmap", "Nmap", "Network discovery and security scanning tool", "tool", "Network"),
  createNode("burp-suite", "Burp Suite", "Web application security testing framework", "tool", "Web"),
  createNode("metasploit", "Metasploit", "Penetration testing framework with exploit development capabilities", "tool", "Exploitation"),
  createNode("bloodhound", "BloodHound", "Active Directory attack path mapping and analysis tool", "tool", "AD"),
  createNode("wireshark", "Wireshark", "Network protocol analyzer for traffic inspection and analysis", "tool", "Network"),
  createNode("ghidra", "Ghidra", "Reverse engineering framework for binary analysis and decompilation", "tool", "Reverse Engineering"),
  createNode("docker", "Docker", "Container platform for application packaging and deployment", "technology", "Containers"),
  createNode("kubernetes", "Kubernetes", "Container orchestration platform for automated deployment and scaling", "technology", "Containers"),

  createNode("web-security-fundamentals", "Web Security Fundamentals", "Deep dive into OWASP Top 10 vulnerabilities with practical exploitation and mitigation", "blog", "Tutorial", "/blog/web-security-fundamentals"),
  createNode("eternalblue-analysis", "EternalBlue Analysis", "Technical analysis of MS17-010 EternalBlue exploit and its defensive implications", "blog", "Research", "/blog/eternalblue-analysis"),
  createNode("detection-engineering-guide", "Detection Engineering Guide", "Comprehensive guide to building effective detection rules with Sigma and SPL", "blog", "Tutorial", "/blog/detection-engineering-guide"),
  createNode("malware-analysis-workflow", "Malware Analysis Workflow", "Step-by-step methodology for analyzing malicious software samples", "blog", "Tutorial", "/blog/malware-analysis-workflow"),
  createNode("cloud-security-best-practices", "Cloud Security Best Practices", "AWS security hardening guide covering IAM, network, and data protection", "blog", "Guide", "/blog/cloud-security-best-practices"),
  createNode("buffer-overflow-guide", "Buffer Overflow Guide", "From stack overflows to ROP chains — modern binary exploitation techniques", "blog", "Tutorial", "/blog/buffer-overflow-guide"),

  createNode("thm-mr-robot", "Mr Robot CTF", "Multi-layered CTF combining web exploitation, steganography, and privilege escalation", "ctf", "Web Security"),
  createNode("thm-attacktive-directory", "Attacktive Directory", "AD attack chain with Kerberoasting, AS-REP roasting, and privilege escalation", "ctf", "Active Directory"),
  createNode("lab-soc-detection", "SOC Detection Engineering Lab", "Custom-built SOC lab for developing detection rules across multiple attack scenarios", "ctf", "SOC"),
  createNode("pwn-buffer-overflow", "PWN Buffer Overflow", "Advanced buffer overflow with ROP chain construction bypassing ASLR and NX", "ctf", "Binary Exploitation"),

  createNode("vm-kali", "Kali Linux", "Primary offensive security workstation for penetration testing and exploit development", "lab_vm", "Offensive"),
  createNode("vm-sentinel", "Sentinel AI", "AI-powered SOC platform with detection, monitoring, and incident response", "lab_vm", "SOC"),
  createNode("vm-domain-controller", "AD Domain Controller", "Windows Server 2022 domain controller for AD lab environment", "lab_vm", "Active Directory"),
  createNode("vm-splunk", "Splunk SIEM", "Enterprise log aggregation and SIEM operations platform", "lab_vm", "SIEM"),
  createNode("vm-pfsense", "pfSense Firewall", "Network firewall with segmentation, NAT, and VLAN routing", "lab_vm", "Network Security"),
  createNode("vm-malware-sandbox", "Malware Sandbox", "Isolated environment for static and dynamic malware analysis", "lab_vm", "Malware Analysis"),

  createNode("machine-learning", "Machine Learning for Security", "Applying ML techniques to threat detection, anomaly identification, and security analytics", "research", "AI Security"),
  createNode("ad-attack-paths", "Advanced AD Attack Paths", "Research into complex Active Directory attack chains and detection strategies", "research", "Active Directory"),
  createNode("cloud-threat-hunting", "Cloud Threat Hunting", "Methodologies for proactive threat detection in multi-cloud environments", "research", "Cloud Security"),

  createNode("path-soc-analyst", "SOC Analyst Path", "Progressive learning path from SOC fundamentals to advanced threat hunting", "learning_path", "SOC"),
  createNode("path-pentester", "Penetration Tester Path", "Structured progression from networking to advanced exploitation", "learning_path", "Offensive Security"),
  createNode("path-cloud-sec", "Cloud Security Path", "Learning journey from cloud fundamentals to advanced security assessment", "learning_path", "Cloud Security"),

  createNode("goal-soar", "SOAR Platform", "Security orchestration, automation, and response platform for automated incident handling", "future_goal", "Automation"),
  createNode("goal-cloud-siem", "Cloud SIEM Federation", "Federated SIEM architecture across hybrid cloud environments", "future_goal", "Cloud"),
  createNode("goal-ai-detection", "AI Detection Pipeline", "Machine learning pipeline for real-time anomaly detection and threat prediction", "future_goal", "AI"),
];

export const edges: GraphEdge[] = [
  createEdge("e1", "sentinel-ai", "python-lang", "built_with", "Built with"),
  createEdge("e2", "sentinel-ai", "typescript-lang", "built_with", "Built with"),
  createEdge("e3", "sentinel-ai", "splunk", "uses", "Integrates with"),
  createEdge("e4", "sentinel-ai", "elasticsearch", "uses", "Integrates with"),
  createEdge("e5", "sentinel-ai", "wazuh", "uses", "Integrates with"),
  createEdge("e6", "sentinel-ai", "soc-operations", "demonstrates", "Demonstrates"),
  createEdge("e7", "sentinel-ai", "detection-engineering", "demonstrates", "Demonstrates"),
  createEdge("e8", "sentinel-ai", "siem-engineering", "demonstrates", "Demonstrates"),
  createEdge("e9", "sentinel-ai", "incident-response", "demonstrates", "Demonstrates"),
  createEdge("e10", "sentinel-ai", "machine-learning", "related_to", "Related to"),
  createEdge("e11", "project-cybershield", "web-security", "demonstrates", "Demonstrates"),
  createEdge("e12", "project-cybershield", "python-lang", "built_with", "Built with"),
  createEdge("e13", "project-cybershield", "burp-suite", "uses", "Uses"),
  createEdge("e14", "project-cybershield", "nmap", "uses", "Uses"),
  createEdge("e15", "offensive-security-lab", "python-lang", "built_with", "Built with"),
  createEdge("e16", "offensive-security-lab", "nmap", "uses", "Uses"),
  createEdge("e17", "offensive-security-lab", "metasploit", "uses", "Uses"),
  createEdge("e18", "offensive-security-lab", "penetration-testing", "demonstrates", "Demonstrates"),
  createEdge("e19", "offensive-security-lab", "exploit-development", "demonstrates", "Demonstrates"),
  createEdge("e20", "offensive-security-lab", "vulnerability-research", "demonstrates", "Demonstrates"),
  createEdge("e21", "active-directory-lab", "bloodhound", "uses", "Uses"),
  createEdge("e22", "active-directory-lab", "active-directory-security", "demonstrates", "Demonstrates"),
  createEdge("e23", "cloud-security-lab", "cloud-security", "demonstrates", "Demonstrates"),
  createEdge("e24", "cloud-security-lab", "go", "built_with", "Built with"),
  createEdge("e25", "cloud-security-lab", "python-lang", "built_with", "Built with"),
  createEdge("e26", "threat-intel-platform", "python-lang", "built_with", "Built with"),
  createEdge("e27", "threat-intel-platform", "threat-hunting", "demonstrates", "Demonstrates"),
  createEdge("e28", "soc-automation-framework", "python-lang", "built_with", "Built with"),
  createEdge("e29", "soc-automation-framework", "soc-operations", "demonstrates", "Demonstrates"),
  createEdge("e30", "network-defense-lab", "wireshark", "uses", "Uses"),
  createEdge("e31", "network-defense-lab", "network-security", "demonstrates", "Demonstrates"),
  createEdge("e32", "dfir-lab", "digital-forensics", "demonstrates", "Demonstrates"),
  createEdge("e33", "dfir-lab", "incident-response", "demonstrates", "Demonstrates"),
  createEdge("e34", "crypto-research-lab", "python-lang", "built_with", "Built with"),
  createEdge("e35", "crypto-research-lab", "rust", "built_with", "Built with"),

  createEdge("e36", "sentinel-ai", "OSCP", "related_to", "Related to"),
  createEdge("e37", "offensive-security-lab", "OSCP", "related_to", "Related to"),
  createEdge("e38", "active-directory-lab", "OSCP", "related_to", "Related to"),
  createEdge("e39", "sentinel-ai", "CySA+", "related_to", "Related to"),
  createEdge("e40", "sentinel-ai", "Security+", "related_to", "Related to"),
  createEdge("e41", "cloud-security-lab", "AWS-Security", "related_to", "Related to"),
  createEdge("e42", "network-defense-lab", "Network+", "related_to", "Related to"),

  createEdge("e43", "OSCP", "penetration-testing", "requires", "Validates"),
  createEdge("e44", "OSCP", "exploit-development", "requires", "Validates"),
  createEdge("e45", "OSCP", "web-security", "requires", "Validates"),
  createEdge("e46", "OSCP", "active-directory-security", "requires", "Validates"),
  createEdge("e47", "CEH", "web-security", "validates", "Validates"),
  createEdge("e48", "CEH", "network-security", "validates", "Validates"),
  createEdge("e49", "Security+", "network-security", "validates", "Validates"),
  createEdge("e50", "Security+", "incident-response", "validates", "Validates"),
  createEdge("e51", "CySA+", "soc-operations", "validates", "Validates"),
  createEdge("e52", "CySA+", "threat-hunting", "validates", "Validates"),
  createEdge("e53", "CySA+", "siem-engineering", "validates", "Validates"),
  createEdge("e54", "Network+", "network-security", "validates", "Validates"),
  createEdge("e55", "AWS-Security", "cloud-security", "validates", "Validates"),

  createEdge("e56", "web-security-fundamentals", "project-cybershield", "documents", "Documents"),
  createEdge("e57", "web-security-fundamentals", "web-security", "explains", "Explains"),
  createEdge("e58", "eternalblue-analysis", "offensive-security-lab", "documents", "Documents"),
  createEdge("e59", "detection-engineering-guide", "sentinel-ai", "documents", "Documents"),
  createEdge("e60", "detection-engineering-guide", "detection-engineering", "explains", "Explains"),
  createEdge("e61", "malware-analysis-workflow", "malware-analysis", "explains", "Explains"),
  createEdge("e62", "cloud-security-best-practices", "cloud-security-lab", "documents", "Documents"),
  createEdge("e63", "cloud-security-best-practices", "cloud-security", "explains", "Explains"),
  createEdge("e64", "buffer-overflow-guide", "offensive-security-lab", "documents", "Documents"),
  createEdge("e65", "buffer-overflow-guide", "exploit-development", "explains", "Explains"),

  createEdge("e66", "thm-mr-robot", "web-security", "trains", "Trains"),
  createEdge("e67", "thm-mr-robot", "penetration-testing", "trains", "Trains"),
  createEdge("e68", "thm-attacktive-directory", "active-directory-security", "trains", "Trains"),
  createEdge("e69", "thm-attacktive-directory", "bloodhound", "uses", "Uses"),
  createEdge("e70", "lab-soc-detection", "soc-operations", "trains", "Trains"),
  createEdge("e71", "lab-soc-detection", "siem-engineering", "trains", "Trains"),
  createEdge("e72", "pwn-buffer-overflow", "exploit-development", "trains", "Trains"),
  createEdge("e73", "pwn-buffer-overflow", "offensive-security-lab", "related_to", "Related to"),

  createEdge("e74", "vm-kali", "offensive-security-lab", "hosts", "Hosts"),
  createEdge("e75", "vm-kali", "penetration-testing", "supports", "Supports"),
  createEdge("e76", "vm-sentinel", "sentinel-ai", "hosts", "Hosts"),
  createEdge("e77", "vm-domain-controller", "active-directory-lab", "hosts", "Hosts"),
  createEdge("e78", "vm-domain-controller", "active-directory-security", "supports", "Supports"),
  createEdge("e79", "vm-splunk", "siem-engineering", "supports", "Supports"),
  createEdge("e80", "vm-splunk", "soc-operations", "supports", "Supports"),
  createEdge("e81", "vm-pfsense", "network-defense-lab", "hosts", "Hosts"),
  createEdge("e82", "vm-pfsense", "network-security", "supports", "Supports"),
  createEdge("e83", "vm-malware-sandbox", "threat-intel-platform", "hosts", "Hosts"),
  createEdge("e84", "vm-malware-sandbox", "malware-analysis", "supports", "Supports"),

  createEdge("e85", "splunk", "siem-engineering", "supports", "Supports"),
  createEdge("e86", "elasticsearch", "siem-engineering", "supports", "Supports"),
  createEdge("e87", "wazuh", "detection-engineering", "supports", "Supports"),
  createEdge("e88", "nmap", "network-security", "supports", "Supports"),
  createEdge("e89", "burp-suite", "web-security", "supports", "Supports"),
  createEdge("e90", "metasploit", "penetration-testing", "supports", "Supports"),
  createEdge("e91", "bloodhound", "active-directory-security", "supports", "Supports"),
  createEdge("e92", "wireshark", "network-security", "supports", "Supports"),
  createEdge("e93", "ghidra", "malware-analysis", "supports", "Supports"),
  createEdge("e94", "docker", "cloud-security", "supports", "Supports"),
  createEdge("e95", "kubernetes", "cloud-security", "supports", "Supports"),

  createEdge("e96", "penetration-testing", "vulnerability-research", "leads_to", "Leads to"),
  createEdge("e97", "network-security", "web-security", "requires", "Requires"),
  createEdge("e98", "web-security", "active-directory-security", "leads_to", "Leads to"),
  createEdge("e99", "active-directory-security", "soc-operations", "leads_to", "Leads to"),
  createEdge("e100", "soc-operations", "threat-hunting", "leads_to", "Leads to"),
  createEdge("e101", "python", "python-lang", "related_to", "Related to"),
  createEdge("e102", "typescript", "typescript-lang", "related_to", "Related to"),

  createEdge("e103", "path-soc-analyst", "soc-operations", "trains", "Trains"),
  createEdge("e104", "path-soc-analyst", "siem-engineering", "trains", "Trains"),
  createEdge("e105", "path-soc-analyst", "detection-engineering", "trains", "Trains"),
  createEdge("e106", "path-soc-analyst", "incident-response", "trains", "Trains"),
  createEdge("e107", "path-pentester", "penetration-testing", "trains", "Trains"),
  createEdge("e108", "path-pentester", "exploit-development", "trains", "Trains"),
  createEdge("e109", "path-pentester", "web-security", "trains", "Trains"),
  createEdge("e110", "path-cloud-sec", "cloud-security", "trains", "Trains"),
  createEdge("e111", "path-cloud-sec", "cloud-security-lab", "related_to", "Related to"),

  createEdge("e112", "machine-learning", "sentinel-ai", "inspired_by", "Inspired"),
  createEdge("e113", "ad-attack-paths", "active-directory-lab", "inspired_by", "Inspired"),
  createEdge("e114", "cloud-threat-hunting", "cloud-security-lab", "inspired_by", "Inspired"),

  createEdge("e115", "goal-soar", "soc-automation-framework", "extends", "Extends"),
  createEdge("e116", "goal-soar", "soc-operations", "requires", "Requires"),
  createEdge("e117", "goal-cloud-siem", "sentinel-ai", "extends", "Extends"),
  createEdge("e118", "goal-cloud-siem", "cloud-security", "requires", "Requires"),
  createEdge("e119", "goal-ai-detection", "machine-learning", "requires", "Requires"),
  createEdge("e120", "goal-ai-detection", "sentinel-ai", "extends", "Extends"),

  createEdge("e121", "python-lang", "go", "related_to", "Related to"),
  createEdge("e122", "docker", "kubernetes", "related_to", "Related to"),
  createEdge("e123", "splunk", "elasticsearch", "related_to", "Related to"),
  createEdge("e124", "nmap", "wireshark", "related_to", "Related to"),
  createEdge("e125", "sentinel-ai", "soc-automation-framework", "related_to", "Related to"),
  createEdge("e126", "sentinel-ai", "threat-intel-platform", "related_to", "Related to"),
  createEdge("e127", "active-directory-lab", "offensive-security-lab", "related_to", "Related to"),
  createEdge("e128", "cloud-security-lab", "network-defense-lab", "related_to", "Related to"),
];

export function getNode(id: string): GraphNode | undefined {
  return nodes.find((n) => n.id === id);
}

export function getEdgesForNode(id: string): GraphEdge[] {
  return edges.filter((e) => e.source === id || e.target === id);
}

export function getConnectedNodes(id: string): GraphNode[] {
  const connected = new Set<string>();
  getEdgesForNode(id).forEach((e) => {
    connected.add(e.source);
    connected.add(e.target);
  });
  connected.delete(id);
  return nodes.filter((n) => connected.has(n.id));
}

export function getNodeTypeCounts(): Record<NodeType, number> {
  const counts: Record<string, number> = {};
  nodes.forEach((n) => { counts[n.type] = (counts[n.type] || 0) + 1; });
  return counts as Record<NodeType, number>;
}

export function searchNodes(query: string): GraphNode[] {
  const q = query.toLowerCase();
  return nodes.filter(
    (n) =>
      n.label.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      n.type.toLowerCase().includes(q)
  );
}

export const knowledgeClusters = [
  {
    id: "soc", label: "SOC Operations", color: "#22d3ee",
    nodes: ["sentinel-ai", "soc-automation-framework", "soc-operations", "siem-engineering", "detection-engineering", "incident-response", "splunk", "wazuh", "vm-sentinel", "vm-splunk"],
  },
  {
    id: "ad", label: "Active Directory", color: "#8b5cf6",
    nodes: ["active-directory-lab", "active-directory-security", "bloodhound", "vm-domain-controller", "OSCP", "thm-attacktive-directory", "ad-attack-paths"],
  },
  {
    id: "web", label: "Web Security", color: "#f59e0b",
    nodes: ["project-cybershield", "web-security", "burp-suite", "web-security-fundamentals", "thm-mr-robot", "CEH"],
  },
  {
    id: "cloud", label: "Cloud Security", color: "#3b82f6",
    nodes: ["cloud-security-lab", "cloud-security", "AWS-Security", "docker", "kubernetes", "cloud-security-best-practices", "cloud-threat-hunting", "vm-pfsense"],
  },
  {
    id: "pentest", label: "Penetration Testing", color: "#ef4444",
    nodes: ["offensive-security-lab", "penetration-testing", "exploit-development", "vulnerability-research", "metasploit", "nmap", "pwn-buffer-overflow", "buffer-overflow-guide", "vm-kali"],
  },
  {
    id: "learning", label: "Learning Paths", color: "#6366f1",
    nodes: ["path-soc-analyst", "path-pentester", "path-cloud-sec", "goal-soar", "goal-cloud-siem", "goal-ai-detection", "machine-learning"],
  },
];

export const learningPaths = [
  {
    id: "soc-progression", title: "SOC Analyst Progression",
    description: "From fundamentals to advanced threat hunting",
    steps: ["Network+", "Security+", "CySA+", "siem-engineering", "soc-operations", "detection-engineering", "threat-hunting", "sentinel-ai"],
  },
  {
    id: "pentest-progression", title: "Penetration Testing Progression",
    description: "From networking to advanced exploitation",
    steps: ["Network+", "nmap", "web-security", "burp-suite", "penetration-testing", "exploit-development", "active-directory-security", "OSCP"],
  },
  {
    id: "cloud-progression", title: "Cloud Security Progression",
    description: "From cloud fundamentals to security assessment",
    steps: ["Network+", "network-security", "docker", "cloud-security", "AWS-Security", "cloud-security-lab", "goal-cloud-siem"],
  },
];
