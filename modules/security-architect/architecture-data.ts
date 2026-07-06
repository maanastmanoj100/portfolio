// ─── Types ───────────────────────────────────────────────────────────────

export interface Architecture {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: "web" | "cloud" | "network" | "ai" | "monolith" | "microservices" | "hybrid" | "edge";
  status: "operational" | "concept" | "experimental";
  techStack: string[];
  securitySummary: string;
  relatedProjects: string[];
  documentation: { label: string; url: string }[];
  layers: {
    name: string;
    components: { name: string; description: string; trustBoundary?: string }[];
  }[];
  trustBoundaries: { name: string; description: string; between: string[] }[];
  dataFlows: {
    id: string;
    from: string;
    to: string;
    data: string;
    classification: "public" | "internal" | "confidential" | "restricted";
    encryption: "none" | "tls" | "mTLS" | "application";
    authMethod: string;
    logging: "none" | "basic" | "audit" | "siem";
  }[];
}

export interface ThreatFinding {
  id: string;
  component: string;
  category: "spoofing" | "tampering" | "repudiation" | "information_disclosure" | "denial_of_service" | "elevation_of_privilege";
  description: string;
  likelihood: "low" | "medium" | "high" | "critical";
  impact: "low" | "medium" | "high" | "critical";
  mitigation: string;
  evidence: string;
  status: "mitigated" | "partial" | "open" | "accepted";
  controlIds: string[];
}

export interface AttackTree {
  id: string;
  goal: string;
  paths: {
    id: string;
    description: string;
    conditions: string[];
    controls: string[];
    detection: string[];
    mitigation: string;
  }[];
}

export interface SecurityControl {
  id: string;
  name: string;
  category: string;
  purpose: string;
  applicableArchitectures: string[];
  relatedProjects: string[];
  implementationNotes: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  architecture: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "mitigated" | "accepted";
  trend: "improving" | "stable" | "worsening";
  mitigation: string;
  owner: string;
}

export interface SecurityRequirement {
  id: string;
  requirement: string;
  component: string;
  control: string;
  threat: string;
  mitigation: string;
  evidence: string;
}

export interface ADR {
  id: string;
  title: string;
  context: string;
  problem: string;
  decision: string;
  alternatives: string[];
  consequences: string;
  relatedProjects: string[];
  date: string;
  status: "proposed" | "approved" | "superseded";
  supersededBy?: string;
  version: number;
}

export interface ComplianceMapping {
  framework: string;
  control: string;
  description: string;
  architecture: string;
  status: "mapped" | "partial" | "planned";
}

export interface ArchitectureComparison {
  leftId: string;
  rightId: string;
  dimensions: { label: string; left: string; right: string; notes?: string }[];
}

export interface SimulationStep {
  stage: string;
  description: string;
  securityControls: string[];
  threatsMitigated: string[];
}

export interface NodeDef {
  id: string;
  label: string;
  type: "external" | "boundary" | "process" | "datastore" | "control";
  x: number;
  y: number;
}

export interface EdgeDef {
  from: string;
  to: string;
  label: string;
  classification: string;
  encrypted: boolean;
}

// ─── Architectures ───────────────────────────────────────────────────────

export const ARCHITECTURES: Architecture[] = [
  {
    id: "cyber-nexus",
    name: "Cyber Nexus Platform",
    tagline: "Full-stack Next.js portfolio with integrated security analytics",
    description:
      "The Cyber Nexus platform architecture follows a modern Next.js hybrid approach with static generation for portfolio content, server-rendered dynamic routes for blog and project detail pages, and a lightweight API layer for analytics. The architecture emphasises security observability through embedded threat monitoring, encrypted communications, and role-based access control for the recruiter mode feature. All static assets are served through a CDN with strict CSP headers.",
    type: "web",
    status: "operational",
    techStack: ["Next.js 16", "TypeScript", "Zustand", "Tailwind CSS", "Framer Motion", "Tabler Icons"],
    securitySummary: "CSP headers, HTTPS enforcement, input sanitisation, Zustand store isolation, recruiter mode RBAC, dependency scanning.",
    relatedProjects: ["Cyber Nexus", "Sentinel AI SOC", "Threat Intelligence Center", "Knowledge Graph"],
    documentation: [
      { label: "Architecture Overview", url: "#" },
      { label: "Security Posture", url: "#" },
    ],
    layers: [
      {
        name: "Presentation",
        components: [
          { name: "Next.js Pages", description: "27 static + 3 dynamic route pages", trustBoundary: "CDN" },
          { name: "Liquid Glass UI", description: "GlassCard, Button, motion components with recruiter mode integration" },
          { name: "Navigation Dock", description: "21-item sidebar with role-based visibility" },
        ],
      },
      {
        name: "State & Data",
        components: [
          { name: "Zustand Stores", description: "useUIStore for recruiterMode, theme state management" },
          { name: "Static Data Files", description: "Projects, skills, certs, blog data in /data" },
          { name: "Module Data Layers", description: "CTF, Lab, Knowledge Graph, Wiki, Achievement data" },
        ],
      },
      {
        name: "API & Services",
        components: [
          { name: "Analytics API", description: "Minimal /api/analytics endpoint for page views" },
          { name: "AI Simulator", description: "Client-side setTimeout simulation for AI responses" },
        ],
      },
    ],
    trustBoundaries: [
      { name: "Browser / Client", description: "Untrusted client environment", between: ["Browser", "CDN"] },
      { name: "CDN / Edge", description: "Static asset delivery with caching", between: ["CDN", "Next.js Server"] },
      { name: "Application Server", description: "Trusted server-side execution", between: ["Next.js Server", "Data Layer"] },
    ],
    dataFlows: [
      { id: "df1", from: "Browser", to: "CDN", data: "HTTP(S) page requests", classification: "public", encryption: "tls", authMethod: "None", logging: "basic" },
      { id: "df2", from: "CDN", to: "Next.js Server", data: "Static page delivery", classification: "public", encryption: "tls", authMethod: "None", logging: "basic" },
      { id: "df3", from: "Browser", to: "Analytics API", data: "Page view events", classification: "internal", encryption: "tls", authMethod: "None", logging: "audit" },
    ],
  },
  {
    id: "sentinel-ai-soc",
    name: "Sentinel AI SOC",
    tagline: "AI-augmented security operations centre with real-time threat correlation",
    description:
      "Sentinel AI SOC is a conceptual security operations architecture that combines SIEM telemetry with machine learning-based anomaly detection and automated incident response. The architecture follows a hub-and-spoke model with a central correlation engine ingesting logs from distributed collectors, feeding an AI analysis pipeline that generates enriched alerts for human analysts.",
    type: "ai",
    status: "concept",
    techStack: ["Wazuh", "ELK Stack", "MISP", "Python ML Pipeline", "Docker", "Kafka", "Keycloak"],
    securitySummary: "Encrypted log shipping, RBAC for SOC roles, MFA for analyst access, immutable audit trail, network segmentation between ingestion and analysis tiers.",
    relatedProjects: ["Sentinel AI SOC", "Threat Intelligence Center", "Cyber Lab"],
    documentation: [
      { label: "SOC Architecture", url: "#" },
      { label: "Detection Strategy", url: "#" },
    ],
    layers: [
      {
        name: "Data Ingestion",
        components: [
          { name: "Log Collectors", description: "Wazuh agents deployed across endpoints and servers", trustBoundary: "DMZ" },
          { name: "Network Sensors", description: "Suricata/Snort for packet-level inspection" },
          { name: "Threat Feeds", description: "MISP integration for IoC enrichment" },
        ],
      },
      {
        name: "Correlation & Analysis",
        components: [
          { name: "SIEM Cluster", description: "ELK stack with Wazuh indexer for log correlation" },
          { name: "ML Pipeline", description: "Python-based anomaly detection models ingesting from Kafka" },
          { name: "Alert Engine", description: "Rule-based + ML-scored alert generation" },
        ],
      },
      {
        name: "Response & Reporting",
        components: [
          { name: "Incident Dashboard", description: "Real-time SOC analyst view" },
          { name: "Automated Playbooks", description: "SOAR-style response actions" },
          { name: "Case Management", description: "Ticketing and evidence tracking" },
        ],
      },
    ],
    trustBoundaries: [
      { name: "Demilitarised Zone", description: "Exposed collectors with restricted outbound", between: ["Log Collectors", "Correlation Engine"] },
      { name: "SOC Internal Network", description: "Restricted access for analysts only", between: ["Correlation Engine", "Incident Dashboard"] },
      { name: "Management Plane", description: "Admin access with MFA", between: ["SOC Internal", "Configuration"] },
    ],
    dataFlows: [
      { id: "df-soc1", from: "Log Collectors", to: "Kafka", data: "Encrypted syslog/winlog streams", classification: "confidential", encryption: "mTLS", authMethod: "Certificate", logging: "audit" },
      { id: "df-soc2", from: "Kafka", to: "ML Pipeline", data: "Anonymised event stream", classification: "internal", encryption: "tls", authMethod: "Service Account", logging: "audit" },
      { id: "df-soc3", from: "ML Pipeline", to: "Alert Engine", data: "Enriched alerts with confidence scores", classification: "internal", encryption: "tls", authMethod: "Service Account", logging: "siem" },
    ],
  },
  {
    id: "threat-intel-center",
    name: "Threat Intelligence Center",
    tagline: "Centralised threat intelligence aggregation and analysis hub",
    description:
      "The Threat Intelligence Center aggregates IoCs, TTPs, and threat reports from multiple open-source and commercial feeds, normalises them into a unified STIX/TAXII-compatible format, and provides analyst workbenches for enrichment, correlation, and dissemination. The architecture prioritises data quality, deduplication, and timely distribution to consuming systems.",
    type: "cloud",
    status: "concept",
    techStack: ["MISP", "OpenCTI", "Python", "Elasticsearch", "Docker", "PostgreSQL", "Redis"],
    securitySummary: "Feeds authenticated via API tokens, encrypted storage at rest, analyst RBAC, audit logging for all queries, network isolation between feed ingestion and analysis.",
    relatedProjects: ["Threat Intelligence Center", "Sentinel AI SOC", "Cyber Lab"],
    documentation: [
      { label: "Intel Architecture", url: "#" },
      { label: "Feed Management", url: "#" },
    ],
    layers: [
      {
        name: "Feed Ingestion",
        components: [
          { name: "Feed Connectors", description: "STIX/TAXII clients, RSS scrapers, API harvesters" },
          { name: "Normalisation Pipeline", description: "Unified STIX 2.1 format conversion" },
          { name: "Deduplication Engine", description: "Fuzzy matching and IoC collision detection" },
        ],
      },
      {
        name: "Storage & Enrichment",
        components: [
          { name: "MISP Instance", description: "Primary threat intelligence platform" },
          { name: "OpenCTI", description: "Knowledge graph for threat actor/ campaign mapping" },
          { name: "Elasticsearch", description: "Full-text search and analytics" },
        ],
      },
      {
        name: "Consumption",
        components: [
          { name: "Analyst Workbench", description: "Search, filter, and investigate" },
          { name: "API Gateway", description: "REST/STIX APIs for consuming systems" },
          { name: "Report Generator", description: "Automated PDF/JSON threat reports" },
        ],
      },
    ],
    trustBoundaries: [
      { name: "External Feed Zone", description: "Untrusted external data sources", between: ["Feed Connectors", "Normalisation Pipeline"] },
      { name: "Intel Storage Zone", description: "Encrypted at rest, restricted API access", between: ["Normalisation Pipeline", "MISP"] },
      { name: "Analyst Zone", description: "RBAC-controlled access", between: ["Analyst Workbench", "MISP"] },
    ],
    dataFlows: [
      { id: "df-tic1", from: "External Feeds", to: "Feed Connectors", data: "Raw threat intelligence", classification: "public", encryption: "tls", authMethod: "API Token", logging: "basic" },
      { id: "df-tic2", from: "Feed Connectors", to: "MISP", data: "Normalised STIX 2.1 indicators", classification: "confidential", encryption: "mTLS", authMethod: "Certificate", logging: "audit" },
    ],
  },
  {
    id: "home-lab",
    name: "Home Lab Infrastructure",
    tagline: "Virtualised cyber range with multi-zone network segmentation",
    description:
      "The Home Lab is a virtualised cyber range built on Proxmox with pfSense routing, Wazuh monitoring, and isolated network zones. It provides a safe environment for security testing, CTF practice, and infrastructure experimentation. Network segmentation follows a production-inspired DMZ-Internal-Management model with strict firewall rules between zones.",
    type: "network",
    status: "operational",
    techStack: ["Proxmox VE", "pfSense", "Wazuh", "Kali Linux", "Windows Server", "Ubuntu", "Docker"],
    securitySummary: "Zone-based segmentation, default-deny firewall rules, isolated management VLAN, encrypted VPN access, monitored egress traffic, automated patching.",
    relatedProjects: ["Home Lab", "Cyber Lab", "CTF Command Center"],
    documentation: [
      { label: "Network Topology", url: "#" },
      { label: "Security Baselines", url: "#" },
    ],
    layers: [
      {
        name: "Edge / Perimeter",
        components: [
          { name: "pfSense Firewall", description: "Primary gateway with VLAN segmentation, IDS/IPS via Suricata" },
          { name: "VPN Gateway", description: "WireGuard-based remote access" },
        ],
      },
      {
        name: "DMZ",
        components: [
          { name: "Web Server", description: "Public-facing services (Juice Shop, DVWA)", trustBoundary: "DMZ" },
          { name: "Mail Gateway", description: "SMTP relay with spam filtering" },
        ],
      },
      {
        name: "Internal",
        components: [
          { name: "Active Directory", description: "Domain controller with 45 users, 12 groups" },
          { name: "Splunk / Wazuh", description: "Log aggregation and monitoring" },
          { name: "Malware Sandbox", description: "Isolated analysis environment" },
        ],
      },
      {
        name: "Management",
        components: [
          { name: "Proxmox VE", description: "Hypervisor management interface" },
          { name: "Ansible Tower", description: "Automation and configuration management" },
        ],
      },
    ],
    trustBoundaries: [
      { name: "Internet / WAN", description: "Untrusted external traffic", between: ["WAN", "pfSense"] },
      { name: "DMZ", description: "Isolated zone, no direct internal access", between: ["pfSense", "Web Server"] },
      { name: "Internal Network", description: "Trusted internal services, restricted from DMZ", between: ["DMZ", "AD Server"] },
      { name: "Management VLAN", description: "Administrative access only", between: ["Proxmox", "Internal Network"] },
    ],
    dataFlows: [
      { id: "df-hl1", from: "Internet", to: "pfSense", data: "HTTP(S) traffic", classification: "public", encryption: "tls", authMethod: "None", logging: "siem" },
      { id: "df-hl2", from: "pfSense", to: "Web Server", data: "HTTP(S) forwarded traffic", classification: "public", encryption: "tls", authMethod: "None", logging: "siem" },
      { id: "df-hl3", from: "Internal Clients", to: "AD Server", data: "Authentication requests", classification: "confidential", encryption: "tls", authMethod: "Kerberos", logging: "audit" },
    ],
  },
  {
    id: "cloud-infra",
    name: "Cloud Infrastructure",
    tagline: "AWS multi-account architecture with IaC and security guardrails",
    description:
      "The cloud infrastructure follows the AWS Well-Architected Framework with separate accounts for production, staging, and development. Infrastructure is defined as code using Terraform with automated security scanning integrated into the CI/CD pipeline. GuardDuty, Security Hub, and Config rules provide continuous compliance monitoring.",
    type: "cloud",
    status: "concept",
    techStack: ["AWS", "Terraform", "Docker", "GitHub Actions", "GuardDuty", "Security Hub", "CloudTrail"],
    securitySummary: "Multi-account isolation, IaC security scanning, automated compliance checks, encrypted EBS/S3, CloudTrail audit logging, IAM least privilege.",
    relatedProjects: ["Cloud Infrastructure", "Cyber Lab", "Project Architect"],
    documentation: [
      { label: "Cloud Architecture", url: "#" },
      { label: "Security Controls", url: "#" },
    ],
    layers: [
      {
        name: "Network",
        components: [
          { name: "VPC with Public/Private Subnets", description: "Multi-AZ with NAT gateways" },
          { name: "AWS WAF", description: "Web application firewall for ALB" },
          { name: "Route 53", description: "DNS with health checks and failover" },
        ],
      },
      {
        name: "Compute",
        components: [
          { name: "ECS Fargate", description: "Serverless container orchestration" },
          { name: "Lambda Functions", description: "Event-driven serverless compute" },
          { name: "EC2 Bastion", description: "Hardened jump host with Session Manager" },
        ],
      },
      {
        name: "Data",
        components: [
          { name: "RDS PostgreSQL", description: "Encrypted at rest with automated backups" },
          { name: "S3 Buckets", description: "Server-side encrypted with access logging" },
          { name: "ElastiCache Redis", description: "In-memory caching with auth" },
        ],
      },
      {
        name: "Security",
        components: [
          { name: "GuardDuty", description: "Threat detection service" },
          { name: "Security Hub", description: "Aggregated security findings" },
          { name: "CloudTrail", description: "API activity audit log" },
          { name: "KMS", description: "Managed key encryption" },
        ],
      },
    ],
    trustBoundaries: [
      { name: "Internet / Public", description: "Untrusted external traffic", between: ["Internet", "CloudFront/WAF"] },
      { name: "VPC Boundary", description: "Network isolation between accounts", between: ["Production VPC", "Staging VPC"] },
      { name: "Data Perimeter", description: "S3/ RDS access restricted by IAM", between: ["ECS", "RDS"] },
    ],
    dataFlows: [
      { id: "df-c1", from: "Internet", to: "CloudFront", data: "HTTP(S) requests", classification: "public", encryption: "tls", authMethod: "None", logging: "siem" },
      { id: "df-c2", from: "CloudFront", to: "ALB", data: "Forwarded requests", classification: "internal", encryption: "tls", authMethod: "None", logging: "audit" },
      { id: "df-c3", from: "ECS Fargate", to: "RDS", data: "SQL queries", classification: "confidential", encryption: "mTLS", authMethod: "IAM Database Auth", logging: "audit" },
    ],
  },
  {
    id: "api-gateway",
    name: "API Gateway Architecture",
    tagline: "Centralised API gateway with authentication, rate limiting, and audit",
    description:
      "The API Gateway architecture provides a unified entry point for all microservice communications with JWT-based authentication, rate limiting per consumer, request/response logging, and schema validation. It implements a defence-in-depth approach with WAF integration, IP allowlisting, and anomaly detection at the gateway layer.",
    type: "microservices",
    status: "concept",
    techStack: ["Kong", "JWT", "Redis", "PostgreSQL", "Prometheus", "Grafana", "OpenAPI"],
    securitySummary: "JWT validation at edge, rate limiting per API key, IP allow/deny lists, request body validation, audit logging, Prometheus metrics for anomaly detection.",
    relatedProjects: ["API Gateway", "Cyber Nexus", "Knowledge Graph"],
    documentation: [
      { label: "Gateway Design", url: "#" },
      { label: "Security Controls", url: "#" },
    ],
    layers: [
      {
        name: "Edge Gateway",
        components: [
          { name: "Kong Gateway", description: "API gateway with plugin architecture" },
          { name: "Rate Limiting Plugin", description: "Per-consumer request throttling" },
          { name: "IP Restriction", description: "Allow/deny list by consumer tier" },
        ],
      },
      {
        name: "Authentication",
        components: [
          { name: "JWT Validator", description: "RS256 token verification" },
          { name: "OAuth2 Provider", description: "Authorization code flow" },
          { name: "API Key Manager", description: "Key generation and rotation" },
        ],
      },
      {
        name: "Observability",
        components: [
          { name: "Request Logger", description: "Structured JSON audit logs" },
          { name: "Prometheus Exporter", description: "Latency, error rate, throughput" },
          { name: "Anomaly Detector", description: "Statistical deviation alerting" },
        ],
      },
    ],
    trustBoundaries: [
      { name: "Public Internet", description: "Untrusted client requests", between: ["Internet", "Kong Gateway"] },
      { name: "Gateway Internal", description: "Authenticated requests within VPC", between: ["Kong Gateway", "Microservices"] },
      { name: "Admin Plane", description: "Gateway configuration access", between: ["Kong Admin API", "Management"] },
    ],
    dataFlows: [
      { id: "df-api1", from: "Client", to: "Kong Gateway", data: "API requests with JWT", classification: "confidential", encryption: "tls", authMethod: "JWT", logging: "audit" },
      { id: "df-api2", from: "Kong Gateway", to: "Microservice", data: "Authenticated proxied requests", classification: "confidential", encryption: "mTLS", authMethod: "Mutual TLS", logging: "audit" },
    ],
  },
  {
    id: "docker-env",
    name: "Docker Container Environment",
    tagline: "Multi-service container architecture with network segmentation",
    description:
      "The Docker environment runs multiple containerised services across custom bridge networks with strict inter-network routing policies. Each logical service group operates on its own network with only explicitly permitted cross-network communication. Secrets are managed via Docker secrets and environment-specific configurations are externalised.",
    type: "microservices",
    status: "operational",
    techStack: ["Docker", "Docker Compose", "Traefik", "Portainer", "Prometheus", "Grafana"],
    securitySummary: "Custom bridge networks, non-root containers, read-only root filesystems, secrets management, resource limits, image scanning with Trivy, regular base image updates.",
    relatedProjects: ["Docker Environment", "Cyber Lab", "Home Lab"],
    documentation: [
      { label: "Container Strategy", url: "#" },
      { label: "Network Policy", url: "#" },
    ],
    layers: [
      {
        name: "Reverse Proxy",
        components: [
          { name: "Traefik", description: "TLS termination and dynamic routing" },
          { name: "Cert Manager", description: "Automated Let's Encrypt certificates" },
        ],
      },
      {
        name: "Application Networks",
        components: [
          { name: "Web Network", description: "Grafana, Portainer, Juice Shop" },
          { name: "Analytics Network", description: "ELK Stack, Prometheus" },
          { name: "Database Network", description: "PostgreSQL, Redis" },
        ],
      },
      {
        name: "Management",
        components: [
          { name: "Portainer", description: "Container management UI" },
          { name: "Watchtower", description: "Automated image updates" },
        ],
      },
    ],
    trustBoundaries: [
      { name: "External Network", description: "Internet-facing Traefik endpoint", between: ["Internet", "Traefik"] },
      { name: "Service Networks", description: "Isolated bridge networks per service group", between: ["Web Network", "Database Network"] },
      { name: "Host Socket", description: "Docker daemon access restricted", between: ["Containers", "Docker Host"] },
    ],
    dataFlows: [
      { id: "df-d1", from: "Internet", to: "Traefik", data: "HTTP(S) traffic", classification: "public", encryption: "tls", authMethod: "None", logging: "basic" },
      { id: "df-d2", from: "Traefik", to: "Grafana", data: "Proxied dashboard requests", classification: "internal", encryption: "tls", authMethod: "OAuth Proxy", logging: "audit" },
      { id: "df-d3", from: "Prometheus", to: "PostgreSQL", data: "Metrics queries", classification: "internal", encryption: "tls", authMethod: "Password", logging: "basic" },
    ],
  },
  {
    id: "ai-services",
    name: "AI Services Architecture",
    tagline: "Modular AI pipeline for security analysis and automation",
    description:
      "The AI Services architecture provides a modular pipeline for security-related machine learning tasks including anomaly detection, threat classification, and automated report generation. Models are containerised and deployed independently with a central orchestration layer managing data flow, model versioning, and inference scheduling.",
    type: "ai",
    status: "concept",
    techStack: ["Python", "TensorFlow", "PyTorch", "Kafka", "Docker", "MLflow", "FastAPI"],
    securitySummary: "Model isolation in containers, input sanitisation, output validation, inference audit logging, model access controls, adversarial input filtering.",
    relatedProjects: ["AI Services", "Sentinel AI SOC", "Project Architect"],
    documentation: [
      { label: "ML Pipeline Design", url: "#" },
      { label: "Model Security", url: "#" },
    ],
    layers: [
      {
        name: "Data Ingestion",
        components: [
          { name: "Kafka Streams", description: "Real-time event ingestion" },
          { name: "Feature Store", description: "Centralised feature engineering" },
        ],
      },
      {
        name: "Model Inference",
        components: [
          { name: "Anomaly Detector", description: "Unsupervised outlier detection model" },
          { name: "Classifier", description: "Supervised threat classification" },
          { name: "NLP Pipeline", description: "Text analysis for report generation" },
        ],
      },
      {
        name: "Orchestration",
        components: [
          { name: "MLflow", description: "Model registry and experiment tracking" },
          { name: "Airflow", description: "Pipeline scheduling" },
          { name: "FastAPI Gateway", description: "Inference API endpoints" },
        ],
      },
    ],
    trustBoundaries: [
      { name: "Ingestion Boundary", description: "Validated input data", between: ["Kafka", "Feature Store"] },
      { name: "Model Boundary", description: "Isolated model containers", between: ["Feature Store", "Model Containers"] },
      { name: "Output Boundary", description: "Validated inference results", between: ["Model Containers", "API Gateway"] },
    ],
    dataFlows: [
      { id: "df-ai1", from: "Kafka", to: "Feature Store", data: "Raw event streams", classification: "internal", encryption: "tls", authMethod: "Service Account", logging: "audit" },
      { id: "df-ai2", from: "Feature Store", to: "Model Containers", data: "Feature vectors", classification: "internal", encryption: "tls", authMethod: "Certificate", logging: "audit" },
      { id: "df-ai3", from: "Model Containers", to: "FastAPI Gateway", data: "Inference results", classification: "internal", encryption: "tls", authMethod: "Service Account", logging: "audit" },
    ],
  },
];

// ─── STRIDE Threat Findings ──────────────────────────────────────────────

export const STRIDE_FINDINGS: ThreatFinding[] = [
  // Cyber Nexus
  { id: "cn-s1", component: "Next.js Pages", category: "spoofing", description: "Attacker could spoof page routes via path traversal", likelihood: "low", impact: "medium", mitigation: "Next.js file-system routing prevents traversal; validate all dynamic params", evidence: "Input validation in [slug] routes", status: "mitigated", controlIds: ["AUTH-01", "VAL-01"] },
  { id: "cn-t1", component: "Zustand Store", category: "tampering", description: "Client-side store mutation could alter recruiterMode state", likelihood: "medium", impact: "low", mitigation: "RecruiterMode is read-only from server props; store validates against expected values", evidence: "Store initialisation from server data", status: "mitigated", controlIds: ["AUTH-02"] },
  { id: "cn-dos1", component: "Analytics API", category: "denial_of_service", description: "Unbounded analytics endpoint could be flooded", likelihood: "medium", impact: "low", mitigation: "Vercel serverless auto-scales; consider rate limiting for sustained loads", evidence: "Serverless function timeouts", status: "partial", controlIds: ["RL-01"] },
  // Sentinel AI SOC
  { id: "soc-s1", component: "Log Collectors", category: "spoofing", description: "Fake log sources could inject false telemetry", likelihood: "medium", impact: "high", mitigation: "mTLS between collectors and Kafka validates agent identity", evidence: "Certificate-based agent enrollment", status: "mitigated", controlIds: ["AUTH-03", "NET-02"] },
  { id: "soc-id1", component: "ML Pipeline", category: "information_disclosure", description: "Anonymised event stream could be re-identified via correlation", likelihood: "low", impact: "high", mitigation: "PII stripping pipeline with field-level encryption; strict access controls on raw data", evidence: "Data masking configuration", status: "mitigated", controlIds: ["ENC-02", "AUTH-02"] },
  { id: "soc-eop1", component: "Incident Dashboard", category: "elevation_of_privilege", description: "Analyst could escalate privileges via API tampering", likelihood: "low", impact: "critical", mitigation: "RBAC enforced at API layer; all actions logged and tied to analyst identity", evidence: "Keycloak RBAC policies", status: "mitigated", controlIds: ["AUTH-01", "AUD-01"] },
  // Home Lab
  { id: "hl-t1", component: "pfSense Firewall", category: "tampering", description: "Firewall rules could be modified by compromised management host", likelihood: "medium", impact: "critical", mitigation: "Management VLAN isolated; SSH key-based admin access; configuration backups with integrity checks", evidence: "Ansible-managed config with git audit trail", status: "mitigated", controlIds: ["NET-01", "AUTH-01"] },
  { id: "hl-dos1", component: "Proxmox VE", category: "denial_of_service", description: "Resource exhaustion by rogue VM could impact other guests", likelihood: "medium", impact: "high", mitigation: "Resource limits per VM; CPU/memory reservation; monitoring alerts on utilisation", evidence: "cgroup limits configured on all VMs", status: "mitigated", controlIds: ["MON-02", "NET-03"] },
  // Cloud Infrastructure
  { id: "ci-id1", component: "S3 Buckets", category: "information_disclosure", description: "Misconfigured S3 bucket could expose sensitive data", likelihood: "low", impact: "critical", mitigation: "S3 Block Public Access at account level; CloudTrail alerts on bucket policy changes; automated config rule checks", evidence: "Terraform aws_s3_bucket_public_access_block", status: "mitigated", controlIds: ["ENC-01", "MON-01"] },
  { id: "ci-eop1", component: "IAM Roles", category: "elevation_of_privilege", description: "Overly permissive IAM role could escalate privileges", likelihood: "medium", impact: "high", mitigation: "Least privilege via IAM policy conditions; access analyser; regular permission review", evidence: "IAM Access Analyser findings", status: "partial", controlIds: ["AUTH-02", "AUD-02"] },
  // API Gateway
  { id: "api-t1", component: "Kong Gateway", category: "tampering", description: "Malicious payload in API request could bypass validation", likelihood: "medium", impact: "high", mitigation: "Request body validation via Kong plugin; schema validation; WAF integration", evidence: "Kong validation plugin config", status: "partial", controlIds: ["VAL-01", "NET-02"] },
  { id: "api-r1", component: "JWT Validator", category: "repudiation", description: "Request origin could be denied without non-repudiation", likelihood: "low", impact: "medium", mitigation: "Structured audit logs with correlation IDs; request signing for critical operations", evidence: "Kong request logging plugin", status: "mitigated", controlIds: ["AUD-01"] },
];

// ─── Attack Trees ────────────────────────────────────────────────────────

export const ATTACK_TREES: AttackTree[] = [
  {
    id: "at-web",
    goal: "Unauthorised Access to Admin Dashboard",
    paths: [
      {
        id: "at-web-1",
        description: "Exploit weak session token to impersonate admin user",
        conditions: ["Session token generated with weak entropy", "Token intercepted via XSS or network sniffing", "No IP binding on session"],
        controls: ["Cryptographically secure random token generation", "HttpOnly and Secure cookie flags", "Session-to-IP binding"],
        detection: ["Anomaly detection on session usage patterns", "Login from new IP/location alerting"],
        mitigation: "Enforce short session TTL, implement refresh token rotation, and deploy Web Application Firewall with session monitoring.",
      },
      {
        id: "at-web-2",
        description: "SQL injection through login form to bypass authentication",
        conditions: ["Unsanitised input in username field", "Database user has elevated privileges", "Error messages reveal query structure"],
        controls: ["Parameterised queries / ORM", "Web Application Firewall with SQLi rules", "Least privilege database user"],
        detection: ["WAF alerting on SQLi patterns", "Database query audit logs", "RASP (Runtime Application Self-Protection)"],
        mitigation: "Use parameterised queries exclusively, deploy WAF with OWASP CRS rules, and run periodic DAST scans.",
      },
    ],
  },
  {
    id: "at-cloud",
    goal: "Exfiltrate Data from S3 Bucket",
    paths: [
      {
        id: "at-cloud-1",
        description: "Compromise EC2 instance with S3 read access to exfiltrate data",
        conditions: ["EC2 instance has overly permissive IAM role", "SSH key compromised or vulnerable application", "No S3 bucket policy restricting access"],
        controls: ["IAM role with least privilege access", "S3 bucket policy with source IP restriction", "S3 Server Access Logging"],
        detection: ["VPC Flow Logs showing unusual data transfer", "CloudTrail GetObject/Object events from unexpected IPs", "GuardDuty anomaly detection"],
        mitigation: "Implement S3 bucket policies with principal/ARN conditions, enable S3 Object Lock for immutability, and use VPC Endpoints for S3 access.",
      },
    ],
  },
  {
    id: "at-lab",
    goal: "Move Laterally from DMZ to Internal Network",
    paths: [
      {
        id: "at-lab-1",
        description: "Exploit web server in DMZ to pivot to internal hosts",
        conditions: ["Web server has outbound connectivity to internal network", "No network segmentation between DMZ and internal", "Web application vulnerability (RCE or file upload)"],
        controls: ["Strict firewall rules: DMZ cannot initiate to internal", "Application-level isolation", "Host-based IDS on DMZ servers"],
        detection: ["pfSense connection tracking anomalies", "Suricata alerting on internal-directed traffic from DMZ IPs", "Wazuh integrity monitoring"],
        mitigation: "Enforce default-deny between DMZ and internal, implement jump host for any cross-zone access, and deploy honeypot within DMZ.",
      },
    ],
  },
];

// ─── Security Controls ───────────────────────────────────────────────────

export const SECURITY_CONTROLS: SecurityControl[] = [
  { id: "AUTH-01", name: "Multi-Factor Authentication", category: "Authentication", purpose: "Require additional verification beyond passwords for all administrative access.", applicableArchitectures: ["cyber-nexus", "sentinel-ai-soc", "cloud-infra", "api-gateway"], relatedProjects: ["Cloud Infrastructure", "API Gateway"], implementationNotes: "Enforce MFA for all console/admin access. Use TOTP or WebAuthn. Exclude service accounts with compensating controls." },
  { id: "AUTH-02", name: "Least Privilege RBAC", category: "Authorization", purpose: "Grant minimum permissions necessary for role function; enforce at API and UI layer.", applicableArchitectures: ["cyber-nexus", "threat-intel-center", "cloud-infra", "ai-services"], relatedProjects: ["Cyber Nexus", "Knowledge Graph"], implementationNotes: "Define roles per application function. Review quarterly. Automate with Terraform for cloud resources." },
  { id: "AUTH-03", name: "Mutual TLS Authentication", category: "Authentication", purpose: "Require certificate-based authentication for service-to-service communication.", applicableArchitectures: ["sentinel-ai-soc", "api-gateway", "ai-services"], relatedProjects: ["Sentinel AI SOC", "API Gateway"], implementationNotes: "Deploy internal CA for service certificates. Auto-renew via cert-manager. Revoke on pod/service termination." },
  { id: "ENC-01", name: "Encryption at Rest", category: "Encryption", purpose: "Protect stored data against physical theft or unauthorised storage access.", applicableArchitectures: ["cloud-infra", "threat-intel-center", "home-lab", "cyber-nexus"], relatedProjects: ["Cloud Infrastructure", "Home Lab"], implementationNotes: "Use AES-256 for all storage volumes. Enforce encryption in IaC. Rotate KMS keys annually." },
  { id: "ENC-02", name: "Field-Level Encryption", category: "Encryption", purpose: "Encrypt sensitive fields (PII, credentials) within application data stores.", applicableArchitectures: ["sentinel-ai-soc", "threat-intel-center"], relatedProjects: ["Threat Intelligence Center", "Sentinel AI SOC"], implementationNotes: "Use deterministic encryption for indexed fields. Store encryption keys in vault. Audit all decryption access." },
  { id: "SEC-01", name: "Secrets Management", category: "Secrets Management", purpose: "Centralised, encrypted storage for API keys, passwords, and certificates.", applicableArchitectures: ["cloud-infra", "docker-env", "api-gateway"], relatedProjects: ["Docker Environment", "Cloud Infrastructure"], implementationNotes: "Use HashiCorp Vault or AWS Secrets Manager. Never hardcode secrets. Rotate on schedule and after incidents." },
  { id: "VAL-01", name: "Input Validation & Sanitisation", category: "Input Validation", purpose: "Validate and sanitise all user-supplied input to prevent injection attacks.", applicableArchitectures: ["cyber-nexus", "api-gateway", "ai-services"], relatedProjects: ["API Gateway", "Cyber Nexus"], implementationNotes: "Use allowlist validation where possible. Apply context-specific escaping (HTML, SQL, shell). Reject unexpected input early." },
  { id: "RL-01", name: "Rate Limiting", category: "Rate Limiting", purpose: "Throttle request rates to prevent abuse and denial of service.", applicableArchitectures: ["api-gateway", "cyber-nexus", "cloud-infra"], relatedProjects: ["API Gateway", "Cyber Nexus"], implementationNotes: "Implement per-client rate limiting. Use sliding window algorithm. Return 429 with Retry-After header." },
  { id: "LOG-01", name: "Centralised Audit Logging", category: "Logging", purpose: "Capture and retain security-relevant events with tamper protection.", applicableArchitectures: ["sentinel-ai-soc", "cloud-infra", "api-gateway", "home-lab"], relatedProjects: ["Sentinel AI SOC", "Home Lab"], implementationNotes: "Ship all logs to SIEM. Include timestamp, user ID, action, outcome, and source IP. Protect log integrity with hashing." },
  { id: "MON-01", name: "Continuous Security Monitoring", category: "Monitoring", purpose: "Real-time detection of security events and policy violations.", applicableArchitectures: ["sentinel-ai-soc", "cloud-infra", "home-lab", "docker-env"], relatedProjects: ["Home Lab", "Cloud Infrastructure"], implementationNotes: "Deploy Wazuh/Splunk for log monitoring. Integrate with GuardDuty for cloud. Alert on critical severity within 5 minutes." },
  { id: "MON-02", name: "Resource Monitoring & Alerting", category: "Monitoring", purpose: "Monitor system resources for capacity planning and anomaly detection.", applicableArchitectures: ["home-lab", "docker-env", "cloud-infra"], relatedProjects: ["Home Lab", "Docker Environment"], implementationNotes: "Set up Prometheus + Grafana dashboards. Alert on CPU > 80%, disk > 85%, memory > 80%. Correlate with security events." },
  { id: "BCK-01", name: "Automated Backup & Recovery", category: "Backups", purpose: "Ensure data recoverability within defined RTO and RPO.", applicableArchitectures: ["home-lab", "cloud-infra", "docker-env"], relatedProjects: ["Home Lab", "Cloud Infrastructure"], implementationNotes: "Automate daily backups with integrity verification. Test restoration quarterly. Encrypt backups. Store offsite." },
  { id: "NET-01", name: "Network Segmentation", category: "Network Segmentation", purpose: "Isolate network zones based on trust level and function.", applicableArchitectures: ["home-lab", "cloud-infra", "docker-env", "sentinel-ai-soc"], relatedProjects: ["Home Lab", "Docker Environment"], implementationNotes: "Use VLANs for on-prem, VPC subnets for cloud, custom bridge networks for Docker. Default-deny between zones." },
  { id: "NET-02", name: "Web Application Firewall", category: "Network Segmentation", purpose: "Filter and monitor HTTP traffic to protect against web exploits.", applicableArchitectures: ["cloud-infra", "api-gateway", "cyber-nexus"], relatedProjects: ["Cloud Infrastructure", "API Gateway"], implementationNotes: "Deploy AWS WAF or ModSecurity. Use OWASP CRS rules. Monitor blocked requests and tune rules to reduce false positives." },
  { id: "NET-03", name: "Network Intrusion Detection", category: "Network Segmentation", purpose: "Detect malicious network activity through signature and anomaly analysis.", applicableArchitectures: ["home-lab", "sentinel-ai-soc"], relatedProjects: ["Home Lab", "Sentinel AI SOC"], implementationNotes: "Deploy Suricata/Snort at network perimeter and DMZ. Update signatures daily. Correlate with SIEM alerts." },
  { id: "AUD-01", name: "Immutable Audit Trail", category: "Audit Trails", purpose: "Maintain tamper-evident log of all security-relevant changes.", applicableArchitectures: ["sentinel-ai-soc", "cloud-infra", "api-gateway"], relatedProjects: ["Sentinel AI SOC", "Cloud Infrastructure"], implementationNotes: "Use append-only storage for logs. Hash chain or digital signature for integrity. Regular audit log review." },
  { id: "AUD-02", name: "Permission Change Auditing", category: "Audit Trails", purpose: "Track and alert on all permission or policy modifications.", applicableArchitectures: ["cloud-infra", "threat-intel-center", "api-gateway"], relatedProjects: ["Threat Intelligence Center", "Cloud Infrastructure"], implementationNotes: "Monitor IAM/role changes via CloudTrail. Alert on privilege escalation. Require approval for admin role grants." },
];

// ─── Risks ───────────────────────────────────────────────────────────────

export const RISKS: Risk[] = [
  { id: "R-001", title: "API Rate Limiting Not Implemented", description: "The Cyber Nexus analytics endpoint lacks rate limiting, making it vulnerable to inadvertent or intentional flooding.", architecture: "cyber-nexus", category: "Application Security", severity: "medium", status: "open", trend: "stable", mitigation: "Implement rate limiting at the Vercel edge or via a third-party API gateway.", owner: "Platform Team" },
  { id: "R-002", title: "Cloud IAM Permissions Overly Broad", description: "Some IAM roles in the cloud infrastructure may grant broader permissions than necessary for routine operations.", architecture: "cloud-infra", category: "Identity & Access", severity: "high", status: "open", trend: "worsening", mitigation: "Run IAM Access Analyser weekly; implement automated remediation for high-severity findings.", owner: "Cloud Team" },
  { id: "R-003", title: "Log Shipping Without Integrity Verification", description: "Logs from lab endpoints to the SIEM are shipped without integrity hashing, risking tampering in transit.", architecture: "home-lab", category: "Logging & Monitoring", severity: "medium", status: "accepted", trend: "stable", mitigation: "Implement Lumberjack protocol or TLS-shipped logs with SHA-256 hashing. Currently accepted due to lab environment risk profile.", owner: "Lab Admin" },
  { id: "R-004", title: "Docker Base Images Not Regularly Scanned", description: "Container images are not consistently scanned for known vulnerabilities before deployment.", architecture: "docker-env", category: "Supply Chain", severity: "high", status: "open", trend: "worsening", mitigation: "Integrate Trivy into CI/CD pipeline; enforce severity thresholds; automate weekly image rebuilds.", owner: "Platform Team" },
  { id: "R-005", title: "Threat Feed Authentication Using Long-Lived Tokens", description: "Threat intelligence feed connections use API tokens without rotation schedules.", architecture: "threat-intel-center", category: "Secrets Management", severity: "medium", status: "mitigated", trend: "improving", mitigation: "Implemented quarterly rotation schedule; token issuance audit trail added. Remaining risk: manual rotation process.", owner: "Intel Team" },
  { id: "R-006", title: "ML Model Adversarial Input Risk", description: "AI service models may be vulnerable to adversarial inputs designed to cause misclassification.", architecture: "ai-services", category: "Application Security", severity: "medium", status: "open", trend: "stable", mitigation: "Implement adversarial input filtering; add confidence threshold alerts; regular model retraining.", owner: "AI Team" },
  { id: "R-007", title: "SOC Dashboard MFA Not Enforced", description: "The Sentinel AI SOC dashboard does not currently require MFA for analyst access.", architecture: "sentinel-ai-soc", category: "Identity & Access", severity: "critical", status: "open", trend: "stable", mitigation: "Enable MFA via Keycloak; apply conditional access policy for SOC analysts.", owner: "SOC Team" },
  { id: "R-008", title: "No Anomaly Detection on API Gateway Traffic", description: "The API gateway lacks behavioural anomaly detection to identify unusual traffic patterns.", architecture: "api-gateway", category: "Detection & Response", severity: "medium", status: "open", trend: "stable", mitigation: "Integrate Prometheus metrics with anomaly detection service; define baseline traffic profiles per consumer.", owner: "Platform Team" },
];

// ─── Security Requirements Matrix ────────────────────────────────────────

export const SECURITY_REQUIREMENTS: SecurityRequirement[] = [
  { id: "SR-001", requirement: "All administrative access must use MFA", component: "Keycloak / Auth Service", control: "Multi-Factor Authentication", threat: "Credential theft leading to account takeover", mitigation: "Enforce TOTP-based MFA for all admin users", evidence: "Keycloak MFA policy configuration" },
  { id: "SR-002", requirement: "Service-to-service communication must be encrypted with mTLS", component: "API Gateway / Service Mesh", control: "Mutual TLS Authentication", threat: "Man-in-the-middle interception of internal traffic", mitigation: "Deploy internal CA; issue short-lived certs per service", evidence: "mTLS handshake logs" },
  { id: "SR-003", requirement: "All stored secrets must be encrypted and rotated regularly", component: "Secrets Store", control: "Secrets Management", threat: "Static credential exposure via data breach", mitigation: "Vault/Secrets Manager with automatic rotation", evidence: "Secrets rotation schedule and audit" },
  { id: "SR-004", requirement: "User input must be validated against allowlist patterns", component: "API Gateway / Application", control: "Input Validation & Sanitisation", threat: "SQL injection, XSS, command injection", mitigation: "Allowlist validation at API layer; parameterised queries at DB layer", evidence: "Validation plugin configuration" },
  { id: "SR-005", requirement: "Security events must be logged with tamper-evident integrity", component: "SIEM / Log Aggregator", control: "Immutable Audit Trail", threat: "Log tampering to hide attack traces", mitigation: "Append-only log storage with hash chaining", evidence: "Log integrity verification process" },
  { id: "SR-006", requirement: "Network zones must enforce default-deny between trust levels", component: "Firewall / VPC / Docker Networks", control: "Network Segmentation", threat: "Lateral movement from compromised low-trust zone", mitigation: "Default-deny ACLs; explicit allow rules only for required flows", evidence: "Firewall rule audit" },
];

// ─── ADRs ────────────────────────────────────────────────────────────────

export const ADR_RECORDS: ADR[] = [
  {
    id: "ADR-001",
    title: "Adopt Zustand for Client State Management",
    context: "Cyber Nexus requires lightweight state management for recruiter mode toggle and theme preferences without the overhead of Redux.",
    problem: "State management solution must be minimal, TypeScript-native, and support easy store isolation.",
    decision: "Use Zustand for client-side state. Store is initialised from server props and validated against expected values. No persistence layer needed for current requirements.",
    alternatives: ["Redux Toolkit (rejected: overkill for 2 stores)", "Context API (rejected: unnecessary re-renders)", "Jotai (considered but Zustand simpler for this use case)"],
    consequences: "Tiny bundle impact (~1KB). Simple API for store creation. Easy to test. May need to revisit if global state complexity grows significantly.",
    relatedProjects: ["Cyber Nexus"],
    date: "2025-09-01",
    status: "approved",
    version: 1,
  },
  {
    id: "ADR-002",
    title: "Next.js Static Generation with ISR for Portfolio Content",
    context: "Portfolio content is largely static but may require occasional updates without full rebuilds.",
    problem: "Need fast page loads, SEO support, and the ability to update content without redeploying.",
    decision: "Use static generation (SSG) for all portfolio pages with Incremental Static Regeneration (ISR) for blog and project detail pages. Dynamic routes at build time.",
    alternatives: ["SSR (rejected: unnecessary server load)", "Client-side rendering (rejected: poor SEO)", "Full static build (adopted but with ISR opt-in)"],
    consequences: "Fastest possible page loads. SEO-friendly. ISR allows content updates within ~60s. Build time increases with content volume.",
    relatedProjects: ["Cyber Nexus"],
    date: "2025-09-15",
    status: "approved",
    version: 1,
  },
  {
    id: "ADR-003",
    title: "Virtualised Lab with Proxmox and Zone-Based Networking",
    context: "Home lab requires isolated environments for security testing while maintaining resource efficiency.",
    problem: "Need multi-zone network isolation, snapshot/restore capabilities, and support for diverse operating systems.",
    decision: "Use Proxmox VE as hypervisor with VLAN-tagged network zones (WAN, DMZ, Internal, Management, Monitoring). pfSense for routing and firewall policy enforcement.",
    alternatives: ["VMware vSphere (rejected: licensing cost)", "VirtualBox (rejected: lacks central management)", "Docker-only (rejected: need full OS isolation for AD and Windows targets)"],
    consequences: "Full OS isolation with hardware passthrough support. Snapshot capability for CTF state management. Higher resource overhead than container-only approach.",
    relatedProjects: ["Home Lab", "Cyber Lab"],
    date: "2025-10-01",
    status: "approved",
    version: 2,
  },
  {
    id: "ADR-004",
    title: "Custom SVG Force-Directed Graph for Knowledge Graph",
    context: "Knowledge Graph requires interactive visualisation of 79 nodes and 128 edges without heavy external dependencies.",
    problem: "Need performant, interactive graph rendering that integrates with the Liquid Glass design system.",
    decision: "Build a custom SVG force-directed graph engine with manual physics simulation. Avoid D3.js and Three.js to minimise bundle size and maintain design consistency.",
    alternatives: ["D3.js force layout (rejected: adds 250KB)", "Three.js / WebGL (rejected: overkill for 2D graph)", "React Flow (rejected: focused on DAGs, not knowledge graphs)"],
    consequences: "Small bundle (~8KB gzipped). Full control over rendering and interactions. Development time for physics engine was higher than using a library.",
    relatedProjects: ["Knowledge Graph"],
    date: "2025-11-01",
    status: "approved",
    version: 1,
  },
  {
    id: "ADR-005",
    title: "API Gateway with Kong for Microservice Architecture",
    context: "Growing number of services requires centralised API management with consistent security policies.",
    problem: "Need authentication, rate limiting, logging, and routing for multiple backend services without duplicating logic in each service.",
    decision: "Deploy Kong Gateway with declarative configuration. Plugins for JWT validation, rate limiting, request logging, and IP restriction. Config stored in git.",
    alternatives: ["AWS API Gateway (rejected: vendor lock-in, higher cost for lab)", "Traefik (rejected: primarily ingress-focused)", "Custom Go proxy (rejected: maintenance overhead)"],
    consequences: "Rich plugin ecosystem reduces per-service security code. Declarative config supports GitOps. Additional infrastructure component to maintain.",
    relatedProjects: ["API Gateway"],
    date: "2025-12-01",
    status: "proposed",
    version: 1,
  },
  {
    id: "ADR-006",
    title: "SIEM Selection: Wazuh Over Splunk for Lab Environment",
    context: "Lab needs SIEM capabilities for log aggregation, alerting, and compliance monitoring without ongoing licensing costs.",
    problem: "Need enterprise-grade SIEM functionality suitable for learning and demonstration within budget constraints.",
    decision: "Use Wazuh (open-source fork of OSSEC) as primary SIEM with ELK stack for visualisation. Splunk Free for supplementary use.",
    alternatives: ["Splunk Enterprise (rejected: licensing cost for lab)", "ELK Stack standalone (rejected: Wazuh adds security-specific rules out of box)", "Graylog (considered but smaller community)"],
    consequences: "Zero licensing cost. Wazuh provides pre-built security rules and compliance mappings. More configuration effort than commercial SIEM.",
    relatedProjects: ["Sentinel AI SOC", "Home Lab", "Threat Intelligence Center"],
    date: "2025-10-15",
    status: "approved",
    version: 1,
  },
];

// ─── Compliance Mappings ─────────────────────────────────────────────────

export const COMPLIANCE_MAPPINGS: ComplianceMapping[] = [
  // OWASP ASVS
  { framework: "OWASP ASVS", control: "V2.1 - Authentication Verification", description: "MFA for all administrative interfaces", architecture: "cyber-nexus", status: "planned" },
  { framework: "OWASP ASVS", control: "V5.1 - Input Validation", description: "Validate all input against allowlist patterns", architecture: "api-gateway", status: "mapped" },
  { framework: "OWASP ASVS", control: "V8.1 - Data Protection", description: "Encrypt sensitive data at rest", architecture: "cloud-infra", status: "mapped" },
  { framework: "OWASP ASVS", control: "V7.1 - Log Content", description: "Audit logs must include timestamp, source IP, user ID, and action", architecture: "sentinel-ai-soc", status: "mapped" },
  // OWASP Top 10
  { framework: "OWASP Top 10", control: "A01 - Broken Access Control", description: "RBAC with least privilege enforcement", architecture: "cloud-infra", status: "mapped" },
  { framework: "OWASP Top 10", control: "A03 - Injection", description: "Parameterised queries and WAF protection", architecture: "api-gateway", status: "mapped" },
  { framework: "OWASP Top 10", control: "A05 - Security Misconfiguration", description: "IaC scanning and automated compliance checks", architecture: "cloud-infra", status: "partial" },
  // MITRE ATT&CK
  { framework: "MITRE ATT&CK", control: "T1078 - Valid Accounts", description: "MFA and anomaly detection on account usage", architecture: "sentinel-ai-soc", status: "mapped" },
  { framework: "MITRE ATT&CK", control: "T1040 - Network Sniffing", description: "mTLS for all service-to-service communication", architecture: "api-gateway", status: "mapped" },
  { framework: "MITRE ATT&CK", control: "T1485 - Data Destruction", description: "Immutable backups with versioning", architecture: "cloud-infra", status: "partial" },
  // CIS Controls
  { framework: "CIS Controls", control: "CSC 4 - Controlled Use of Administrative Privileges", description: "MFA and session management for admin access", architecture: "cloud-infra", status: "mapped" },
  { framework: "CIS Controls", control: "CSC 6 - Maintenance, Monitoring, and Analysis of Audit Logs", description: "Centralised SIEM with alerting", architecture: "sentinel-ai-soc", status: "mapped" },
  { framework: "CIS Controls", control: "CSC 13 - Data Protection", description: "Encryption at rest and in transit", architecture: "home-lab", status: "mapped" },
  // NIST CSF
  { framework: "NIST CSF", control: "DE.CM-1 - Continuous Monitoring", description: "Real-time security event monitoring via SIEM", architecture: "sentinel-ai-soc", status: "mapped" },
  { framework: "NIST CSF", control: "PR.AC-4 - Access Permissions", description: "Least privilege RBAC for all systems", architecture: "cloud-infra", status: "mapped" },
  { framework: "NIST CSF", control: "PR.DS-2 - Data-in-Transit Protection", description: "TLS/mTLS for all network communication", architecture: "api-gateway", status: "mapped" },
];

// ─── Simulation Steps ────────────────────────────────────────────────────

export const SIMULATION_STEPS: SimulationStep[] = [
  { stage: "User Request", description: "Client sends HTTP(S) request to application", securityControls: ["TLS encryption", "CSP headers", "HSTS preload"], threatsMitigated: ["Eavesdropping", "Clickjacking", "Protocol downgrade"] },
  { stage: "Authentication", description: "Request authenticated via JWT or session token", securityControls: ["JWT validation", "MFA enforcement", "Account lockout"], threatsMitigated: ["Credential theft", "Session hijacking", "Brute force"] },
  { stage: "Authorization", description: "RBAC check on requested resource", securityControls: ["Role-based access control", "Permission caching", "Audit logging"], threatsMitigated: ["Privilege escalation", "Unauthorised access"] },
  { stage: "Input Validation", description: "Request payload validated against schema", securityControls: ["Allowlist validation", "WAF inspection", "Content-type verification"], threatsMitigated: ["SQL injection", "XSS", "Command injection"] },
  { stage: "Application Logic", description: "Business logic executed in application layer", securityControls: ["Rate limiting", "Request timeouts", "Resource quotas"], threatsMitigated: ["DoS", "Resource exhaustion", "Business logic abuse"] },
  { stage: "Database Access", description: "Data retrieved or persisted via ORM/query builder", securityControls: ["Parameterised queries", "Least privilege DB user", "Connection encryption"], threatsMitigated: ["SQL injection", "Data exfiltration", "Unauthorised queries"] },
  { stage: "Logging", description: "Request outcome recorded in audit log", securityControls: ["Structured logging", "Log integrity hashing", "PII redaction"], threatsMitigated: ["Repudiation", "Log tampering", "Data leak via logs"] },
  { stage: "Monitoring", description: "Metrics and alerts evaluated for anomalies", securityControls: ["SIEM correlation", "Threshold alerting", "Anomaly detection"], threatsMitigated: ["Advanced persistent threats", "Slow exfiltration", "Lateral movement"] },
  { stage: "Response", description: "Response returned to client with security headers", securityControls: ["Content-Security-Policy", "X-Content-Type-Options", "Referrer-Policy"], threatsMitigated: ["XSS", "MIME sniffing", "Referrer leakage"] },
];

// ─── Architecture Comparison ─────────────────────────────────────────────

export const ARCHITECTURE_COMPARISONS: ArchitectureComparison[] = [
  {
    leftId: "cyber-nexus",
    rightId: "sentinel-ai-soc",
    dimensions: [
      { label: "Scalability", left: "Horizontal via CDN + serverless functions", right: "Horizontal via Kafka partitioning + container scaling", notes: "Both scale horizontally; SOC requires stateful coordination" },
      { label: "Availability", left: "99.9% with CDN caching and multi-region deployment", right: "99.5% with Kafka replication + multi-node SIEM cluster" },
      { label: "Security Controls", left: "CSP, RBAC, TLS, input validation", right: "mTLS, MFA, SIEM, anomaly detection, audit trails" },
      { label: "Authentication", left: "Session-based with recruiter mode state", right: "JWT + MFA + certificate-based service auth" },
      { label: "Deployment", left: "Vercel serverless + static export", right: "Docker orchestrated via Docker Compose / K8s" },
      { label: "Observability", left: "Basic analytics endpoint", right: "Full SIEM with ELK, Prometheus, Grafana, audit logging" },
      { label: "Maintainability", left: "Low — single page application with data files", right: "Medium — multi-service with shared state and pipelines" },
      { label: "Trade-offs", left: "Simpler but less defence-in-depth", right: "Strong security posture but higher operational complexity" },
    ],
  },
  {
    leftId: "home-lab",
    rightId: "cloud-infra",
    dimensions: [
      { label: "Scalability", left: "Bounded by physical hardware", right: "Elastic via AWS auto-scaling and managed services" },
      { label: "Availability", left: "Single host; downtime during maintenance", right: "Multi-AZ with failover and RDS replicas" },
      { label: "Security Controls", left: "pfSense, VLANs, Wazuh, VPN access", right: "GuardDuty, Security Hub, WAF, CloudTrail, IAM" },
      { label: "Authentication", left: "Active Directory + local accounts", right: "IAM roles, SSO with Identity Center, temporary credentials" },
      { label: "Deployment", left: "Manual provisioning via Proxmox UI", right: "Terraform IaC with CI/CD pipeline" },
      { label: "Observability", left: "Wazuh + Grafana stack", right: "CloudWatch + Security Hub + GuardDuty" },
      { label: "Maintainability", left: "High — manual patching and snapshots", right: "Low — managed services reduce maintenance" },
      { label: "Trade-offs", left: "Maximum control but requires manual effort", right: "Lower operational overhead but vendor-dependent" },
    ],
  },
];

// ─── Helper Functions ────────────────────────────────────────────────────

export const getArchitectureById = (id: string) => ARCHITECTURES.find((a) => a.id === id);
export const getControlsForArchitecture = (archId: string) => SECURITY_CONTROLS.filter((c) => c.applicableArchitectures.includes(archId));
export const getRisksForArchitecture = (archId: string) => RISKS.filter((r) => r.architecture === archId);
export const getFindingsForComponent = (component: string) => STRIDE_FINDINGS.filter((f) => f.component === component);
export const getFindingsForCategory = (category: string) => STRIDE_FINDINGS.filter((f) => f.category === category);
export const getFindingsForArchitecture = (archId: string) => {
  const arch = getArchitectureById(archId);
  if (!arch) return [];
  const allComponents = arch.layers.flatMap((l) => l.components.map((c) => c.name));
  return STRIDE_FINDINGS.filter((f) => allComponents.includes(f.component));
};
export const getADRsForProject = (projectId: string) => ADR_RECORDS.filter((a) => a.relatedProjects.includes(projectId));
