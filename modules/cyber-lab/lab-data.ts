export type VMStatus = "running" | "stopped" | "planned";
export type LabTag = "operational" | "experimental" | "planned" | "conceptual";
export type NetworkZone = "dmz" | "internal" | "management" | "monitoring" | "development" | "user" | "cloud";
export type SecurityRole = "attacker" | "defender" | "monitor" | "target" | "infrastructure";

export interface VirtualMachine {
  id: string;
  name: string;
  purpose: string;
  os: string;
  cpu: string;
  memory: string;
  storage: string;
  services: string[];
  securityRole: SecurityRole;
  networkZone: NetworkZone;
  ip: string;
  projects: string[];
  relatedSkills: string[];
  status: VMStatus;
  tag: LabTag;
}

export interface Container {
  id: string;
  name: string;
  image: string;
  purpose: string;
  ports: string[];
  networks: string[];
  volumes: string[];
  dependencies: string[];
  projects: string[];
  status: VMStatus;
  tag: LabTag;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: "router" | "firewall" | "switch" | "server" | "vm" | "container" | "cloud" | "service" | "user" | "internet";
  zone: NetworkZone;
  x: number;
  y: number;
  description: string;
  status: "active" | "planned" | "maintenance";
}

export interface NetworkConnection {
  from: string;
  to: string;
  label?: string;
  type: "direct" | "vlan" | "tunnel" | "firewall" | "route";
}

export interface SecurityComponent {
  id: string;
  name: string;
  type: string;
  purpose: string;
  configSummary: string;
  projects: string[];
  status: VMStatus;
}

export interface LoggingStage {
  id: string;
  label: string;
  description: string;
  tools: string[];
  details: string;
}

export interface MonitoringMetric {
  label: string;
  usage: number;
  status: "healthy" | "warning" | "critical";
  details: string;
}

export interface CloudResource {
  id: string;
  name: string;
  provider: string;
  type: string;
  purpose: string;
  region: string;
  projects: string[];
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  frequency: string;
  tools: string[];
  projects: string[];
}

export const labVersion = "2.1.0";
export const lastUpdated = "2025-06-28";

export const labStats = {
  virtualMachines: 12,
  containers: 8,
  operatingSystems: 4,
  networks: 7,
  projectsHosted: 14,
  monitoringStack: 4,
  securityTools: 9,
  cloudServices: 6,
};

export const virtualMachines: VirtualMachine[] = [
  {
    id: "vm-kali",
    name: "Kali Linux Attacker",
    purpose: "Primary offensive security workstation for penetration testing, exploitation, and CTF challenges",
    os: "Kali Linux (Debian 12)",
    cpu: "4 vCPU", memory: "8 GB", storage: "80 GB SSD",
    services: ["Metasploit", "Burp Suite", "Nmap", "BloodHound", "Impacket", "Wireshark"],
    securityRole: "attacker",
    networkZone: "internal",
    ip: "10.10.10.10/24",
    projects: ["offensive-security-lab", "project-cybershield", "active-directory-lab"],
    relatedSkills: ["Penetration Testing", "Exploit Development", "Network Security"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-sentinel",
    name: "Sentinel AI SOC",
    purpose: "AI-powered Security Operations Center platform with detection, monitoring, and incident response capabilities",
    os: "Ubuntu Server 24.04 LTS",
    cpu: "8 vCPU", memory: "16 GB", storage: "250 GB NVMe",
    services: ["Wazuh Manager", "Elasticsearch", "Kibana", "Custom Detection Engine", "Alert Manager"],
    securityRole: "defender",
    networkZone: "internal",
    ip: "10.10.10.20/24",
    projects: ["sentinel-ai", "soc-automation-framework"],
    relatedSkills: ["SOC Operations", "Detection Engineering", "SIEM Administration", "Threat Hunting"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-domain-controller",
    name: "Windows Domain Controller",
    purpose: "Active Directory domain controller for AD lab environment with users, groups, and GPOs",
    os: "Windows Server 2022",
    cpu: "4 vCPU", memory: "8 GB", storage: "120 GB SSD",
    services: ["Active Directory DNS", "DHCP", "Group Policy", "Certificate Services"],
    securityRole: "infrastructure",
    networkZone: "management",
    ip: "10.10.20.10/24",
    projects: ["active-directory-lab", "sentinel-ai"],
    relatedSkills: ["Active Directory", "Windows Security", "Group Policy", "Identity Management"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-win-client",
    name: "Windows 11 Enterprise",
    purpose: "Domain-joined workstation simulating corporate endpoints for AD attacks and EDR testing",
    os: "Windows 11 Enterprise",
    cpu: "2 vCPU", memory: "4 GB", storage: "60 GB SSD",
    services: ["Windows Defender", "Sysmon", "OSQuery"],
    securityRole: "target",
    networkZone: "user",
    ip: "10.10.20.50/24",
    projects: ["active-directory-lab", "sentinel-ai"],
    relatedSkills: ["Windows Security", "Endpoint Detection", "Sysmon Analysis"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-web-server",
    name: "Web Application Server",
    purpose: "Hosts vulnerable web applications for testing and project demos (DVWA, Juice Shop, custom apps)",
    os: "Ubuntu Server 24.04 LTS",
    cpu: "2 vCPU", memory: "4 GB", storage: "50 GB SSD",
    services: ["Apache", "Nginx", "MySQL", "Docker", "DVWA", "OWASP Juice Shop"],
    securityRole: "target",
    networkZone: "dmz",
    ip: "10.10.30.10/24",
    projects: ["project-cybershield", "cloud-security-lab"],
    relatedSkills: ["Web Security", "Web Application Testing", "Docker", "Linux Administration"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-pfsense",
    name: "pfSense Firewall",
    purpose: "Network firewall and router providing segmentation, NAT, VLAN routing, and traffic filtering",
    os: "pfSense 2.7 CE (FreeBSD)",
    cpu: "2 vCPU", memory: "4 GB", storage: "30 GB SSD",
    services: ["Firewall", "NAT", "DHCP", "DNS Resolver", "OpenVPN", "Traffic Shaper"],
    securityRole: "infrastructure",
    networkZone: "management",
    ip: "10.10.0.1/24",
    projects: ["sentinel-ai", "network-defense-lab"],
    relatedSkills: ["Network Security", "Firewall Administration", "VPN", "VLAN"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-splunk",
    name: "Splunk SIEM",
    purpose: "Log aggregation, correlation, and SIEM operations for security event monitoring and threat detection",
    os: "Ubuntu Server 22.04 LTS",
    cpu: "6 vCPU", memory: "12 GB", storage: "500 GB SSD",
    services: ["Splunk Enterprise", "Universal Forwarder", "Splunk ES", "Custom Dashboards"],
    securityRole: "monitor",
    networkZone: "monitoring",
    ip: "10.10.40.10/24",
    projects: ["sentinel-ai", "soc-automation-framework"],
    relatedSkills: ["SIEM", "Splunk", "Log Analysis", "Detection Engineering", "SOC Operations"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-wazuh",
    name: "Wazuh Security Platform",
    purpose: "Open-source security monitoring with XDR capabilities, file integrity monitoring, and vulnerability detection",
    os: "Ubuntu Server 24.04 LTS",
    cpu: "4 vCPU", memory: "8 GB", storage: "200 GB SSD",
    services: ["Wazuh Manager", "Wazuh Indexer", "Wazuh Dashboard", "Filebeat"],
    securityRole: "monitor",
    networkZone: "monitoring",
    ip: "10.10.40.20/24",
    projects: ["sentinel-ai", "soc-automation-framework"],
    relatedSkills: ["XDR", "File Integrity Monitoring", "Vulnerability Detection", "Security Monitoring"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-malware-sandbox",
    name: "Malware Analysis Sandbox",
    purpose: "Isolated environment for static and dynamic malware analysis with network simulation",
    os: "REMnux (Ubuntu 22.04)",
    cpu: "4 vCPU", memory: "8 GB", storage: "150 GB SSD",
    services: ["Ghidra", "Flare VM Tools", "Volatility", "YARA", "Cuckoo Sandbox"],
    securityRole: "attacker",
    networkZone: "internal",
    ip: "10.10.10.30/24",
    projects: ["threat-intel-platform"],
    relatedSkills: ["Malware Analysis", "Reverse Engineering", "YARA Rule Writing", "Forensics"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-cloud-bastion",
    name: "Cloud Bastion Host",
    purpose: "Secure jump box for managing cloud resources via encrypted tunnels and session logging",
    os: "Ubuntu Server 24.04 LTS",
    cpu: "2 vCPU", memory: "2 GB", storage: "30 GB SSD",
    services: ["SSH Server", "OpenVPN", "Auditd", "Fail2ban"],
    securityRole: "infrastructure",
    networkZone: "cloud",
    ip: "10.10.50.10/24",
    projects: ["cloud-security-lab"],
    relatedSkills: ["Cloud Security", "SSH Hardening", "VPN", "Infrastructure Security"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-dfir-workstation",
    name: "DFIR Workstation",
    purpose: "Digital forensics and incident response workstation for evidence acquisition and analysis",
    os: "Windows 10 Pro",
    cpu: "4 vCPU", memory: "8 GB", storage: "250 GB SSD",
    services: ["FTK Imager", "Autopsy", "Volatility", "Kape", "Plaso", "RegRipper"],
    securityRole: "defender",
    networkZone: "internal",
    ip: "10.10.10.40/24",
    projects: ["dfir-lab", "sentinel-ai"],
    relatedSkills: ["Digital Forensics", "Incident Response", "Memory Analysis", "Timeline Analysis"],
    status: "running", tag: "operational",
  },
  {
    id: "vm-kubernetes-master",
    name: "Kubernetes Control Plane",
    purpose: "Container orchestration master node managing a small K8s cluster for cloud-native security testing",
    os: "Ubuntu Server 24.04 LTS",
    cpu: "4 vCPU", memory: "8 GB", storage: "80 GB SSD",
    services: ["kube-apiserver", "etcd", "kube-scheduler", "kube-controller-manager", "containerd"],
    securityRole: "infrastructure",
    networkZone: "management",
    ip: "10.10.20.20/24",
    projects: ["cloud-security-lab"],
    relatedSkills: ["Kubernetes", "Container Security", "Cloud Native Security", "DevSecOps"],
    status: "running", tag: "operational",
  },
];

export const containers: Container[] = [
  {
    id: "ct-grafana",
    name: "grafana", image: "grafana/grafana:latest",
    purpose: "Infrastructure and security monitoring dashboards",
    ports: ["3000:3000"], networks: ["monitoring-net"],
    volumes: ["grafana-data:/var/lib/grafana"], dependencies: [],
    projects: ["sentinel-ai"], status: "running", tag: "operational",
  },
  {
    id: "ct-prometheus",
    name: "prometheus", image: "prom/prometheus:latest",
    purpose: "Metrics collection and alerting for infrastructure monitoring",
    ports: ["9090:9090"], networks: ["monitoring-net"],
    volumes: ["prometheus-data:/prometheus", "./prometheus.yml:/etc/prometheus/prometheus.yml"],
    dependencies: [], projects: ["sentinel-ai"], status: "running", tag: "operational",
  },
  {
    id: "ct-elasticsearch",
    name: "elasticsearch", image: "docker.elastic.co/elasticsearch/elasticsearch:8.12",
    purpose: "Distributed search and analytics engine for log storage",
    ports: ["9200:9200", "9300:9300"], networks: ["elk-net"],
    volumes: ["es-data:/usr/share/elasticsearch/data"],
    dependencies: [], projects: ["sentinel-ai"], status: "running", tag: "operational",
  },
  {
    id: "ct-kibana",
    name: "kibana", image: "docker.elastic.co/kibana/kibana:8.12",
    purpose: "Data visualization dashboard for Elasticsearch logs",
    ports: ["5601:5601"], networks: ["elk-net"],
    volumes: [], dependencies: ["elasticsearch"],
    projects: ["sentinel-ai"], status: "running", tag: "operational",
  },
  {
    id: "ct-logstash",
    name: "logstash", image: "docker.elastic.co/logstash/logstash:8.12",
    purpose: "Log ingestion, parsing, and enrichment pipeline",
    ports: ["5044:5044", "5000:5000"], networks: ["elk-net"],
    volumes: ["./logstash.conf:/usr/share/logstash/pipeline/logstash.conf"],
    dependencies: ["elasticsearch"], projects: ["sentinel-ai"], status: "running", tag: "operational",
  },
  {
    id: "ct-portainer",
    name: "portainer", image: "portainer/portainer-ce:latest",
    purpose: "Container management UI for Docker environment",
    ports: ["9000:9000", "8000:8000"], networks: ["management-net"],
    volumes: ["/var/run/docker.sock:/var/run/docker.sock", "portainer-data:/data"],
    dependencies: [], projects: [], status: "running", tag: "operational",
  },
  {
    id: "ct-juice-shop",
    name: "juice-shop", image: "bkimminich/juice-shop:latest",
    purpose: "OWASP Juice Shop intentionally vulnerable web application for training",
    ports: ["8080:3000"], networks: ["web-net"],
    volumes: [], dependencies: [],
    projects: ["project-cybershield"], status: "running", tag: "operational",
  },
  {
    id: "ct-guacamole",
    name: "guacamole", image: "guacamole/guacamole:latest",
    purpose: "Remote desktop gateway for browser-based VM access",
    ports: ["8081:8080"], networks: ["management-net"],
    volumes: [], dependencies: ["guacd"],
    projects: [], status: "running", tag: "operational",
  },
  {
    id: "ct-guacd",
    name: "guacd", image: "guacamole/guacd:latest",
    purpose: "Guacamole proxy daemon for remote desktop connections",
    ports: ["4822:4822"], networks: ["management-net"],
    volumes: [], dependencies: [],
    projects: [], status: "running", tag: "operational",
  },
];

export const networkNodes: NetworkNode[] = [
  { id: "internet", label: "Internet", type: "internet", zone: "dmz", x: 50, y: 10, description: "External network access via ISP connection", status: "active" },
  { id: "router", label: "ISP Router", type: "router", zone: "dmz", x: 25, y: 25, description: "Primary internet gateway with NAT", status: "active" },
  { id: "firewall", label: "pfSense Firewall", type: "firewall", zone: "dmz", x: 50, y: 25, description: "Network segmentation, VLAN routing, and traffic filtering", status: "active" },
  { id: "dmz-switch", label: "DMZ Switch", type: "switch", zone: "dmz", x: 50, y: 40, description: "DMZ network for public-facing services", status: "active" },
  { id: "web-server", label: "Web App Server", type: "server", zone: "dmz", x: 35, y: 52, description: "Vulnerable web applications", status: "active" },
  { id: "internal-switch", label: "Internal Switch", type: "switch", zone: "internal", x: 75, y: 40, description: "Internal lab network", status: "active" },
  { id: "kali", label: "Kali Linux", type: "vm", zone: "internal", x: 65, y: 52, description: "Offensive security workstation", status: "active" },
  { id: "sentinel", label: "Sentinel AI SOC", type: "vm", zone: "internal", x: 85, y: 52, description: "AI-powered SOC platform", status: "active" },
  { id: "malware-sandbox", label: "Malware Sandbox", type: "vm", zone: "internal", x: 75, y: 62, description: "Isolated malware analysis", status: "active" },
  { id: "dfir", label: "DFIR Workstation", type: "vm", zone: "internal", x: 65, y: 72, description: "Forensics and IR workstation", status: "active" },
  { id: "mgmt-switch", label: "Management Switch", type: "switch", zone: "management", x: 25, y: 40, description: "Management and orchestration", status: "active" },
  { id: "domain-controller", label: "AD Domain Controller", type: "server", zone: "management", x: 15, y: 52, description: "Active Directory", status: "active" },
  { id: "k8s-master", label: "K8s Control Plane", type: "vm", zone: "management", x: 35, y: 52, description: "Kubernetes master node", status: "active" },
  { id: "monitoring-switch", label: "Monitoring Switch", type: "switch", zone: "monitoring", x: 25, y: 55, description: "Monitoring infrastructure network", status: "active" },
  { id: "splunk", label: "Splunk SIEM", type: "server", zone: "monitoring", x: 15, y: 70, description: "Log aggregation and SIEM", status: "active" },
  { id: "wazuh", label: "Wazuh XDR", type: "vm", zone: "monitoring", x: 35, y: 70, description: "Open-source security monitoring", status: "active" },
  { id: "cloud-gate", label: "Cloud Bastion", type: "cloud", zone: "cloud", x: 85, y: 25, description: "Cloud resource gateway", status: "active" },
];

export const networkConnections: NetworkConnection[] = [
  { from: "internet", to: "router", type: "direct" },
  { from: "router", to: "firewall", type: "direct" },
  { from: "firewall", to: "dmz-switch", type: "vlan", label: "VLAN 10 (DMZ)" },
  { from: "dmz-switch", to: "web-server", type: "direct" },
  { from: "firewall", to: "internal-switch", type: "vlan", label: "VLAN 20 (Internal)" },
  { from: "internal-switch", to: "kali", type: "direct" },
  { from: "internal-switch", to: "sentinel", type: "direct" },
  { from: "internal-switch", to: "malware-sandbox", type: "direct" },
  { from: "internal-switch", to: "dfir", type: "direct" },
  { from: "firewall", to: "mgmt-switch", type: "vlan", label: "VLAN 30 (Management)" },
  { from: "mgmt-switch", to: "domain-controller", type: "direct" },
  { from: "mgmt-switch", to: "k8s-master", type: "direct" },
  { from: "mgmt-switch", to: "monitoring-switch", type: "route" },
  { from: "monitoring-switch", to: "splunk", type: "direct" },
  { from: "monitoring-switch", to: "wazuh", type: "direct" },
  { from: "firewall", to: "cloud-gate", type: "tunnel", label: "VPN Tunnel" },
];

export interface ADEntity {
  domain: string;
  domainController: string;
  users: number;
  groups: number;
  organizationalUnits: string[];
  workstations: string[];
  servers: string[];
  trustRelationships: string[];
  gpoSummary: string;
}

export const activeDirectory: ADEntity = {
  domain: "cyberlab.internal",
  domainController: "DC-01 (vm-domain-controller)",
  users: 45,
  groups: 12,
  organizationalUnits: ["Users", "Computers", "Servers", "Service Accounts", "Admins", "Security Groups"],
  workstations: ["WS-01 (Win 11)", "WS-02 (Win 11)", "WS-03 (Win 11)"],
  servers: ["DC-01", "Splunk-Forwarder-01", "Web-Dev-01"],
  trustRelationships: ["None configured (isolated lab domain)"],
  gpoSummary: "Password policy (14 char, 60-day rotation), AppLocker rules, Windows Firewall enablement, Audit policy for logon/logoff events",
};

export const cloudResources: CloudResource[] = [
  { id: "cloud-vm-1", name: "bastion-host", provider: "AWS", type: "EC2 t3.medium", purpose: "Secure bastion for lab access", region: "us-east-1", projects: ["cloud-security-lab"] },
  { id: "cloud-vm-2", name: "vuln-web-app", provider: "AWS", type: "EC2 t3.small", purpose: "Cloud-hosted vulnerable web app", region: "us-east-1", projects: ["cloud-security-lab", "project-cybershield"] },
  { id: "cloud-s3-1", name: "demo-bucket", provider: "AWS", type: "S3 Standard", purpose: "S3 security assessment demo", region: "us-east-1", projects: ["cloud-security-lab"] },
  { id: "cloud-vpc-1", name: "lab-vpc", provider: "AWS", type: "VPC", purpose: "Isolated cloud lab network", region: "us-east-1", projects: ["cloud-security-lab"] },
  { id: "cloud-iam-1", name: "lab-roles", provider: "AWS", type: "IAM Roles", purpose: "Least privilege IAM for lab resources", region: "global", projects: ["cloud-security-lab"] },
  { id: "cloud-sg-1", name: "lab-security-groups", provider: "AWS", type: "Security Groups", purpose: "Network ACLs for cloud resources", region: "us-east-1", projects: ["cloud-security-lab"] },
];

export const securityStack: SecurityComponent[] = [
  { id: "sec-pfsense", name: "pfSense Firewall", type: "Network Firewall", purpose: "Stateful packet inspection, VLAN segmentation, and NAT policies", configSummary: "Dedicated firewall rules per VLAN; allow established sessions; block inbound WAN by default", projects: ["sentinel-ai", "network-defense-lab"], status: "running" },
  { id: "sec-wazuh", name: "Wazuh XDR", type: "IDS/IPS", purpose: "Host-based intrusion detection with file integrity monitoring and active response", configSummary: "Agent-based monitoring on all endpoints; FIM on /etc and C:\\Windows\\System32; active response scripts for suspicious processes", projects: ["sentinel-ai", "soc-automation-framework"], status: "running" },
  { id: "sec-snort", name: "Snort IDS", type: "Network IDS", purpose: "Network-based intrusion detection on DMZ and internal segments", configSummary: "Community ruleset + custom rules for web attacks; alerting to Splunk via syslog", projects: ["sentinel-ai"], status: "running" },
  { id: "sec-splunk", name: "Splunk SIEM", type: "SIEM", purpose: "Enterprise log aggregation, correlation, alerting, and dashboarding", configSummary: "300+ data sources; 20+ correlation searches; real-time alerting via email; 90-day log retention", projects: ["sentinel-ai", "soc-automation-framework"], status: "running" },
  { id: "sec-logstash", name: "ELK Log Collector", type: "Log Collector", purpose: "Centralized log parsing, enrichment, and forwarding pipeline", configSummary: "Filebeat → Logstash → Elasticsearch pipeline; grok filters for 50+ log formats", projects: ["sentinel-ai"], status: "running" },
  { id: "sec-threatintel", name: "MISP Threat Intel", type: "Threat Intelligence", purpose: "Threat intelligence feed aggregation and indicator sharing", configSummary: "MISP community feeds; automated IOC ingestion into Splunk and Wazuh", projects: ["threat-intel-platform", "sentinel-ai"], status: "running" },
  { id: "sec-defender", name: "Microsoft Defender for Endpoint", type: "EDR", purpose: "Endpoint detection, response, and antivirus on Windows systems", configSummary: "Real-time protection; cloud-delivered protection; network protection enabled", projects: ["active-directory-lab"], status: "running" },
  { id: "sec-nessus", name: "Nessus Vulnerability Scanner", type: "Vulnerability Scanner", purpose: "Scheduled vulnerability scanning across all lab subnets", configSummary: "Weekly authenticated scans; CVSS-based prioritization; reports to Splunk", projects: ["sentinel-ai", "offensive-security-lab"], status: "running" },
  { id: "sec-borg", name: "BorgBackup", type: "Backup", purpose: "Automated encrypted backups of critical VMs and configurations", configSummary: "Daily incremental; weekly full; AES-256 encrypted; 30-day retention; off-site copy to cloud", projects: [], status: "running" },
  { id: "sec-keycloak", name: "Keycloak SSO", type: "Identity Management", purpose: "Centralized authentication and authorization for lab services", configSummary: "LDAP integration with AD; SAML for Splunk/Wazuh; MFA via TOTP", projects: [], status: "planned" },
];

export const loggingPipeline: LoggingStage[] = [
  { id: "pipe-1", label: "Endpoints", description: "Sysmon, Windows Event Log, auditd, osquery on all VMs and containers", tools: ["Sysmon", "osquery", "auditd", "WinEventLog"], details: "All endpoints forward logs via syslog or WinEventLog to centralized collectors" },
  { id: "pipe-2", label: "Log Collectors", description: "Filebeat and Splunk Universal Forwarder aggregate logs before processing", tools: ["Filebeat", "Splunk UF", "rsyslog"], details: "Load-balanced forwarders prevent data loss and provide failover" },
  { id: "pipe-3", label: "Parsing & Enrichment", description: "Logstash grok filters parse unstructured logs; enrichment adds context", tools: ["Logstash", "Grok", "GeoIP"], details: "50+ grok patterns for common log formats; GeoIP enrichment on firewall logs" },
  { id: "pipe-4", label: "SIEM Platforms", description: "Splunk and Elasticsearch index, correlate, and store processed logs", tools: ["Splunk Enterprise", "Elasticsearch"], details: "Splunk for real-time correlation; Elasticsearch for long-term storage and analysis" },
  { id: "pipe-5", label: "Detection Rules", description: "Sigma rules and custom SPL searches trigger on suspicious patterns", tools: ["Sigma", "SPL", "KQL"], details: "100+ Sigma rules converted to SPL; custom detection logic for behavioral anomalies" },
  { id: "pipe-6", label: "Alerting", description: "Matched rules generate alerts routed to dashboards and notification channels", tools: ["Alert Manager", "Splunk Alerts", "Email"], details: "Severity-based routing: critical alerts SMS/email within 5 minutes" },
  { id: "pipe-7", label: "Dashboards", description: "Real-time visualizations for SOC monitoring, health status, and threat trends", tools: ["Kibana", "Splunk Dashboards", "Grafana"], details: "12 SOC dashboards; 6 infrastructure dashboards; 3 executive summaries" },
  { id: "pipe-8", label: "Incident Response", description: "Standardized playbooks triggered by confirmed alerts for containment and recovery", tools: ["TheHive", "Cortex", "Custom Playbooks"], details: "IR workflows follow NIST 800-61 framework; automated containment for known IoCs" },
];

export const monitoringMetrics: MonitoringMetric[] = [
  { label: "CPU", usage: 42, status: "healthy", details: "12 vCPU pool across hypervisor; peak at 68% during CTF challenges" },
  { label: "Memory", usage: 58, status: "healthy", details: "48 GB allocated; 28 GB in use; Splunk and Elasticsearch are largest consumers" },
  { label: "Storage", usage: 64, status: "healthy", details: "2 TB total pool; 1.28 TB used; log storage grows ~5 GB/week" },
  { label: "Network", usage: 35, status: "healthy", details: "1 Gbps internal; average 350 Mbps during lab exercises" },
  { label: "Containers", usage: 80, status: "warning", details: "8 of 10 container slots in use; planning additional capacity" },
  { label: "Logs/24h", usage: 72, status: "healthy", details: "~4.5 GB of logs ingested daily; 3.2 GB from Windows endpoints" },
];

export const automationWorkflows: AutomationWorkflow[] = [
  { id: "auto-backup", name: "Automated VM Backups", description: "Daily incremental and weekly full backups of all running VMs with encryption", frequency: "Daily (incremental) + Weekly (full)", tools: ["BorgBackup", "Bash", "cron"], projects: [] },
  { id: "auto-healthcheck", name: "Infrastructure Health Checks", description: "Automated service health verification across all infrastructure components", frequency: "Every 5 minutes", tools: ["Bash", "curl", "Prometheus", "Grafana"], projects: ["sentinel-ai"] },
  { id: "auto-log-cleanup", name: "Log Rotation & Cleanup", description: "Automated log rotation, compression, and archival with retention policy enforcement", frequency: "Daily", tools: ["logrotate", "Bash", "cron"], projects: ["sentinel-ai"] },
  { id: "auto-vuln-scan", name: "Weekly Vulnerability Scan", description: "Authenticated vulnerability scanning of all lab subnets with report generation", frequency: "Weekly (Sunday 02:00)", tools: ["Nessus", "Nmap", "Bash"], projects: ["sentinel-ai", "offensive-security-lab"] },
  { id: "auto-updates", name: "Security Patch Management", description: "Automated security updates for Ubuntu and Windows systems with staged rollout", frequency: "Weekly (Saturday 03:00)", tools: ["unattended-upgrades", "WSUS", "Ansible"], projects: [] },
  { id: "auto-deployment", name: "Container Deployment Pipeline", description: "CI/CD pipeline for rebuilding and deploying container updates with rollback capability", frequency: "On-demand / Git push", tools: ["Docker Compose", "GitHub Actions", "Bash"], projects: ["sentinel-ai", "project-cybershield"] },
];

export const architectureDocuments = [
  { id: "doc-1", title: "Lab Architecture Overview", description: "Complete infrastructure design including network topology, security zones, and system architecture", category: "Architecture" },
  { id: "doc-2", title: "VM Provisioning Guide", description: "Standard operating procedure for creating and configuring new lab virtual machines", category: "Setup Guides" },
  { id: "doc-3", title: "Logging Pipeline Configuration", description: "Detailed configuration of the ELK and Splunk logging pipelines with grok patterns", category: "Lab Notes" },
  { id: "doc-4", title: "Incident Response Runbook", description: "Step-by-step IR procedures for common security incidents in the lab environment", category: "Runbooks" },
  { id: "doc-5", title: "Network Troubleshooting Guide", description: "Common network issues in the lab and their resolution procedures", category: "Troubleshooting" },
  { id: "doc-6", title: "Infrastructure Change Log", description: "Track all infrastructure changes, upgrades, and configuration modifications", category: "Change Log" },
  { id: "doc-7", title: "Backup & Recovery Procedures", description: "Backup schedules, restoration testing, and disaster recovery plans", category: "Runbooks" },
  { id: "doc-8", title: "Container Orchestration Setup", description: "Kubernetes cluster setup, configuration, and security hardening procedures", category: "Setup Guides" },
  { id: "doc-9", title: "Monthly Maintenance Schedule", description: "Recurring maintenance tasks including patch cycles, log review, and capacity planning", category: "Maintenance Schedule" },
  { id: "doc-10", title: "Network Diagram (Detailed)", description: "Comprehensive network diagram showing all subnets, VLANs, and traffic flows", category: "Network Diagrams" },
  { id: "doc-11", title: "AD Lab Configuration Guide", description: "Active Directory domain setup, user provisioning, GPO configuration, and attack simulations", category: "Setup Guides" },
  { id: "doc-12", title: "SIEM Rule Catalog", description: "Complete catalog of Splunk and Wazuh detection rules with testing results", category: "Lab Notes" },
];

export function getVMById(id: string): VirtualMachine | undefined {
  return virtualMachines.find((vm) => vm.id === id);
}

export function getContainerById(id: string): Container | undefined {
  return containers.find((c) => c.id === id);
}

export function getNetworkNodeById(id: string): NetworkNode | undefined {
  return networkNodes.find((n) => n.id === id);
}
