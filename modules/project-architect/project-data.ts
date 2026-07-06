export type ProjectCategory =
  | "soc" | "threat-intel" | "threat-hunting" | "blue-team" | "red-team"
  | "pentest" | "cloud-security" | "ai-security" | "malware-analysis"
  | "digital-forensics" | "automation" | "osint" | "networking"
  | "devsecops" | "iot-security" | "mobile-security" | "api-security"
  | "web-security" | "research" | "open-source";

export interface CategoryDef {
  label: string;
  icon: string;
  color: string;
  desc: string;
}

export const CATEGORIES: Record<ProjectCategory, CategoryDef> = {
  soc: { label: "SOC", icon: "IconShield", color: "text-cyan-400 bg-cyan-500/10", desc: "Security operations center tools & automation" },
  "threat-intel": { label: "Threat Intelligence", icon: "IconBrain", color: "text-purple-400 bg-purple-500/10", desc: "Threat data collection, analysis & sharing" },
  "threat-hunting": { label: "Threat Hunting", icon: "IconSearch", color: "text-amber-400 bg-amber-500/10", desc: "Proactive threat detection & hypothesis testing" },
  "blue-team": { label: "Blue Team", icon: "IconShield", color: "text-blue-400 bg-blue-500/10", desc: "Defensive security tools & monitoring" },
  "red-team": { label: "Red Team", icon: "IconFlag", color: "text-red-400 bg-red-500/10", desc: "Offensive security & adversarial simulation" },
  pentest: { label: "Penetration Testing", icon: "IconTarget", color: "text-orange-400 bg-orange-500/10", desc: "Automated & manual security assessment tools" },
  "cloud-security": { label: "Cloud Security", icon: "IconCloud", color: "text-sky-400 bg-sky-500/10", desc: "Cloud infrastructure security & posture management" },
  "ai-security": { label: "AI Security", icon: "IconRobot", color: "text-pink-400 bg-pink-500/10", desc: "AI/ML security, adversarial ML & model protection" },
  "malware-analysis": { label: "Malware Analysis", icon: "IconBug", color: "text-green-400 bg-green-500/10", desc: "Static & dynamic malware analysis tools" },
  "digital-forensics": { label: "Digital Forensics", icon: "IconSearch", color: "text-teal-400 bg-teal-500/10", desc: "Forensic acquisition, analysis & reporting" },
  automation: { label: "Automation", icon: "IconRobot", color: "text-cyan-400 bg-cyan-500/10", desc: "Security automation & orchestration" },
  osint: { label: "OSINT", icon: "IconWorld", color: "text-lime-400 bg-lime-500/10", desc: "Open-source intelligence gathering & analysis" },
  networking: { label: "Networking", icon: "IconNetwork", color: "text-indigo-400 bg-indigo-500/10", desc: "Network security tools & monitoring" },
  devsecops: { label: "DevSecOps", icon: "IconCode", color: "text-violet-400 bg-violet-500/10", desc: "Secure CI/CD pipelines & shift-left security" },
  "iot-security": { label: "IoT Security", icon: "IconDeviceLaptop", color: "text-amber-400 bg-amber-500/10", desc: "IoT/embedded device security assessment" },
  "mobile-security": { label: "Mobile Security", icon: "IconDeviceMobile", color: "text-rose-400 bg-rose-500/10", desc: "Mobile application security testing" },
  "api-security": { label: "API Security", icon: "IconCode", color: "text-fuchsia-400 bg-fuchsia-500/10", desc: "API security testing & protection" },
  "web-security": { label: "Web Security", icon: "IconGlobe", color: "text-emerald-400 bg-emerald-500/10", desc: "Web application security assessment" },
  research: { label: "Research", icon: "IconBooks", color: "text-white bg-white/10", desc: "Security research & vulnerability discovery" },
  "open-source": { label: "Open Source", icon: "IconBrandGithub", color: "text-gray-400 bg-gray-500/10", desc: "Community security tools & contributions" },
};

export const CATEGORY_LIST = Object.keys(CATEGORIES) as ProjectCategory[];

export interface GeneratedProject {
  id: string;
  title: string;
  purpose: string;
  problemStatement: string;
  targetUsers: string[];
  learningObjectives: string[];
  coreFeatures: string[];
  technicalChallenges: string[];
  expectedOutcomes: string[];
  relatedSkills: string[];
  relatedPortfolioProjects: string[];
  categories: ProjectCategory[];
  status: "concept-proposal" | "in-progress" | "completed";
  createdAt: string;
}

export interface ArchitectureModel {
  systemArchitecture: string;
  componentDiagram: { component: string; description: string; dependencies: string[] }[];
  dataFlow: { source: string; target: string; data: string; protocol: string }[];
  deploymentModel: string;
  trustBoundaries: { boundary: string; description: string; controls: string[] }[];
  securityControls: { control: string; category: string; description: string }[];
  threatModel: { threat: string; risk: string; mitigation: string }[];
  scalabilityConsiderations: string[];
}

export interface TechRecommendation {
  category: string;
  recommended: string[];
  alternatives: string[];
  rationale: string;
  tradeoffs: string;
}

export interface ImplPhase {
  name: string;
  objectives: string[];
  deliverables: string[];
  estimatedEffort: string;
  dependencies: string[];
}

export interface ProjectBlueprint {
  title: string;
  description: string;
  categories: ProjectCategory[];
  technologies: string[];
  phases: ImplPhase[];
  folderStructure: string[];
  databases: { name: string; type: string; tables: string[]; indexes: string[] }[];
  apis: { name: string; type: "rest" | "graphql" | "websocket"; endpoints: string[] }[];
  securityArch: { domain: string; recommendations: string[]; rationale: string }[];
  threatModel: { model: string; threats: { threat: string; severity: string; mitigation: string }[] }[];
  testingStrategy: { layer: string; description: string; tools: string[] }[];
  devopsConfig: { tool: string; purpose: string; config: string }[];
  estimatedComplexity: "low" | "medium" | "high" | "very-high";
  estimatedSize: "small" | "medium" | "large" | "xlarge";
  estimatedDuration: string;
  learningCurve: string;
  skillRequirements: string[];
  certRecommendations: string[];
  knowledgeGraphNodes: string[];
}

export const PHASES_DEFINITION: ImplPhase[] = [
  { name: "Planning", objectives: ["Define project scope", "Identify stakeholders", "Set milestones"], deliverables: ["Project charter", "Requirements doc", "Timeline"], estimatedEffort: "1-2 weeks", dependencies: [] },
  { name: "Research", objectives: ["Review existing solutions", "Select technologies", "Design architecture"], deliverables: ["Tech stack doc", "Architecture diagram", "Risk assessment"], estimatedEffort: "1-3 weeks", dependencies: ["Planning"] },
  { name: "Architecture", objectives: ["Design system architecture", "Define data models", "Plan security controls"], deliverables: ["Architecture spec", "Data flow diagrams", "Security model"], estimatedEffort: "2-4 weeks", dependencies: ["Research"] },
  { name: "Backend", objectives: ["Implement core services", "Build APIs", "Set up databases"], deliverables: ["API endpoints", "Database schema", "Service layer"], estimatedEffort: "4-8 weeks", dependencies: ["Architecture"] },
  { name: "Frontend", objectives: ["Build UI components", "Implement dashboards", "Create visualizations"], deliverables: ["UI components", "Dashboard views", "Interactive charts"], estimatedEffort: "3-6 weeks", dependencies: ["Backend"] },
  { name: "Security", objectives: ["Implement auth/authz", "Configure encryption", "Run security tests"], deliverables: ["Security review", "Pen test report", "Hardening guide"], estimatedEffort: "2-4 weeks", dependencies: ["Backend", "Frontend"] },
  { name: "Testing", objectives: ["Write unit tests", "Integration testing", "Performance testing"], deliverables: ["Test suite", "Coverage report", "Benchmark results"], estimatedEffort: "2-3 weeks", dependencies: ["Backend", "Frontend"] },
  { name: "Documentation", objectives: ["Write user docs", "API documentation", "Deployment guide"], deliverables: ["README", "API docs", "Runbook"], estimatedEffort: "1-2 weeks", dependencies: ["Testing"] },
  { name: "Deployment", objectives: ["Set up CI/CD", "Configure monitoring", "Deploy to production"], deliverables: ["Deployed system", "Monitoring dashboards", "Rollback plan"], estimatedEffort: "1-2 weeks", dependencies: ["Testing", "Documentation"] },
  { name: "Maintenance", objectives: ["Monitor system health", "Address issues", "Plan iterations"], deliverables: ["Maintenance log", "Update roadmap", "Performance reports"], estimatedEffort: "Ongoing", dependencies: ["Deployment"] },
];

export const FOLDER_STRUCTURE_MICROSERVICES = [
  "backend/services/auth/", "backend/services/api/", "backend/services/worker/",
  "frontend/src/components/", "frontend/src/pages/", "frontend/src/hooks/",
  "docs/architecture/", "docs/api/", "docs/deployment/",
  "docker/dev/", "docker/prod/",
  "tests/unit/", "tests/integration/", "tests/e2e/",
  "scripts/deploy/", "scripts/migrate/",
  "configs/dev/", "configs/prod/",
  "assets/icons/", "assets/images/",
  ".github/workflows/",
  "README.md", "LICENSE", "CONTRIBUTING.md", "docker-compose.yml", ".gitignore",
];

export const FOLDER_STRUCTURE_MONOLITH = [
  "src/controllers/", "src/models/", "src/services/", "src/middleware/",
  "src/utils/", "src/config/",
  "docs/",
  "tests/", "tests/fixtures/",
  "scripts/",
  "public/",
  "migrations/",
  "docker/",
  ".github/",
  "README.md", "LICENSE", "CONTRIBUTING.md", "Dockerfile", ".gitignore",
];

export const FOLDER_STRUCTURE_SECURITY_TOOL = [
  "modules/", "core/", "plugins/", "rules/",
  "config/",
  "output/",
  "docs/",
  "tests/", "tests/fixtures/",
  "scripts/",
  "docker/",
  ".github/",
  "README.md", "LICENSE", "pyproject.toml", "setup.py",
];

export const TECH_STACKS: TechRecommendation[] = [
  { category: "Programming Languages", recommended: ["Python", "TypeScript", "Go", "Rust"], alternatives: ["Java", "C#", "Ruby"], rationale: "Python dominates security tooling; TypeScript enables fullstack; Go/Rust for performance-critical components", tradeoffs: "Python slower but faster to develop; Rust has steep learning curve" },
  { category: "Frameworks", recommended: ["Next.js", "FastAPI", "Django", "Flask"], alternatives: ["Express", "Spring Boot", "Rails"], rationale: "Next.js for fullstack React; FastAPI for high-performance Python APIs; Django for data-heavy apps", tradeoffs: "Next.js has larger bundle; Django is opinionated" },
  { category: "Databases", recommended: ["PostgreSQL", "Redis", "Elasticsearch", "TimescaleDB"], alternatives: ["MongoDB", "MySQL", "Cassandra"], rationale: "PostgreSQL for relational data; Redis for caching/queues; Elasticsearch for logs/search; TimescaleDB for time-series metrics", tradeoffs: "Elasticsearch requires careful sizing; TimescaleDB adds complexity" },
  { category: "Containers", recommended: ["Docker", "Kubernetes", "Podman", "Docker Compose"], alternatives: ["Nomad", "containerd"], rationale: "Docker for dev/CI; K8s for orchestration; Podman for daemonless containers", tradeoffs: "K8s has operational overhead; Docker requires root" },
  { category: "Cloud Services", recommended: ["AWS (EC2, EKS, S3, Lambda, RDS, Security Hub)", "Azure (VDI, Sentinel, Defender)"], alternatives: ["GCP", "DigitalOcean", "Linode"], rationale: "AWS has widest security service catalog; Azure integrates with MS ecosystem", tradeoffs: "Multi-cloud increases complexity; vendor lock-in risks" },
  { category: "Monitoring", recommended: ["Prometheus", "Grafana", "ELK Stack", "Wazuh"], alternatives: ["Datadog", "Splunk", "New Relic"], rationale: "Prometheus/Grafana for metrics; ELK for logs; Wazuh for SIEM/HIDS", tradeoffs: "Self-hosted requires maintenance; SaaS has recurring costs" },
  { category: "Logging", recommended: ["Filebeat", "Logstash", "Loki", "Vector"], alternatives: ["Fluentd", "Splunk Forwarder"], rationale: "ELK stack is standard; Loki integrates with Grafana; Vector is high-performance", tradeoffs: "ELK can be resource-heavy; Loki queries are limited" },
  { category: "Authentication", recommended: ["OAuth 2.0 / OIDC", "Keycloak", "Auth0", "Passkey"], alternatives: ["LDAP", "SAML", "Cognito"], rationale: "OAuth2/OIDC is industry standard; Keycloak is self-hosted; Auth0 for SaaS", tradeoffs: "Self-hosted Keycloak needs maintenance; Auth0 has usage costs" },
  { category: "Message Queues", recommended: ["RabbitMQ", "Kafka", "NATS", "Redis Streams"], alternatives: ["SQS", "Pulsar"], rationale: "RabbitMQ for reliable delivery; Kafka for event streaming; NATS for lightweight messaging", tradeoffs: "Kafka has operational complexity; RabbitMQ throughput limits" },
  { category: "Frontend", recommended: ["React", "Tailwind CSS", "Framer Motion", "D3.js"], alternatives: ["Vue", "Svelte", "Chart.js"], rationale: "React has largest ecosystem; Tailwind for rapid styling; Framer for animations; D3 for custom viz", tradeoffs: "React bundle size; D3 has learning curve" },
  { category: "Backend", recommended: ["FastAPI", "Node.js/Express", "Go Fiber", "Actix Web"], alternatives: ["Django", "Flask", "Spring Boot"], rationale: "FastAPI for async Python; Node.js for JS fullstack; Go for throughput; Actix for Rust perf", tradeoffs: "Python GIL limits concurrency; Go ecosystem less mature" },
  { category: "AI Services", recommended: ["OpenAI API", "Hugging Face", "LangChain", "Ollama"], alternatives: ["Anthropic Claude", "Google Vertex AI", "TensorFlow"], rationale: "OpenAI for LLM integration; HF for open models; LangChain for chains; Ollama for local inference", tradeoffs: "API costs add up; local models need GPU" },
];

export const DOC_TEMPLATES = [
  { id: "readme", label: "README.md", sections: ["Project Title", "Description", "Features", "Installation", "Usage", "Architecture", "Security", "Contributing", "License"] },
  { id: "architecture-guide", label: "Architecture Guide", sections: ["System Overview", "Component Diagram", "Data Flow", "Technology Stack", "Security Architecture", "Deployment Model", "Scalability"] },
  { id: "installation-guide", label: "Installation Guide", sections: ["Prerequisites", "Environment Setup", "Configuration", "Build Steps", "Verification", "Troubleshooting"] },
  { id: "developer-guide", label: "Developer Guide", sections: ["Setup", "Code Style", "Testing", "CI/CD", "API Reference", "Database Schema", "Contributing"] },
  { id: "api-docs", label: "API Documentation", sections: ["Overview", "Authentication", "Endpoints", "Request/Response Examples", "Error Codes", "Rate Limiting"] },
  { id: "threat-model", label: "Threat Model", sections: ["System Overview", "Trust Boundaries", "Threat Enumeration (STRIDE)", "Mitigations", "Residual Risk", "Review Schedule"] },
  { id: "deployment-guide", label: "Deployment Guide", sections: ["Environment Requirements", "Infrastructure", "Deploy Steps", "Monitoring Setup", "Rollback Procedure", "Post-Deployment"] },
  { id: "runbook", label: "Runbook", sections: ["System Overview", "Health Checks", "Alert Response", "Escalation Paths", "Backup/Restore", "Incident Response"] },
  { id: "changelog", label: "Changelog", sections: ["Version", "Date", "Added", "Changed", "Fixed", "Deprecated", "Security"] },
  { id: "contributing-guide", label: "Contributing Guide", sections: ["Code of Conduct", "Getting Started", "Pull Request Process", "Development Workflow", "Style Guide", "Testing Requirements"] },
];

export const TESTING_LAYERS = [
  { layer: "Unit Tests", description: "Test individual functions, methods, and classes in isolation using mocks for external dependencies.", tools: ["pytest", "Jest", "Go Test", "cargo test"] },
  { layer: "Integration Tests", description: "Verify interactions between components — database queries, API calls, message queues, and service-to-service communication.", tools: ["pytest + pytest-asyncio", "Supertest", "Testcontainers"] },
  { layer: "API Tests", description: "Validate API endpoints for correct responses, status codes, authentication, authorization, input validation, and error handling.", tools: ["Postman/Newman", "Insomnia", "httpx", "REST Client"] },
  { layer: "Security Tests", description: "Identify vulnerabilities — injection flaws, XSS, CSRF, auth bypasses, insecure deserialization, SSRF, and dependency vulnerabilities.", tools: ["OWASP ZAP", "Burp Suite", "Bandit", "Semgrep", "Trivy"] },
  { layer: "Performance Tests", description: "Measure system throughput, response times, resource utilization, and identify bottlenecks under various load conditions.", tools: ["k6", "Locust", "Artillery", "wrk"] },
  { layer: "Accessibility Tests", description: "Ensure the interface meets WCAG standards — keyboard navigation, screen reader support, color contrast, and focus management.", tools: ["axe-core", "Lighthouse", "Pa11y", "Wave"] },
  { layer: "Chaos Testing", description: "Inject failures into the system to verify resilience — network partitions, service crashes, resource exhaustion, and latency spikes.", tools: ["Chaos Monkey", "Gremlin", "Litmus", "Chaos Mesh"] },
];

export const TESTING_CHECKLIST = [
  "All unit tests pass with >80% coverage",
  "Integration tests cover all critical paths",
  "API tests validate all endpoints with auth and error cases",
  "Security scan shows no critical/high vulnerabilities",
  "Performance tests meet defined SLOs under expected load",
  "Accessibility audit passes WCAG 2.1 AA",
  "Chaos tests verify system self-healing",
  "Dependency audit shows no known CVEs",
  "Container images scanned for vulnerabilities",
  "Secrets scanning completes with no exposures",
];

export const DEVOPS_RECOMMENDATIONS = [
  { tool: "Docker", purpose: "Containerization for consistent environments across dev, test, and production", config: "Multi-stage builds, distroless base images, .dockerignore" },
  { tool: "GitHub Actions", purpose: "CI/CD pipeline automation — build, test, scan, deploy", config: "Matrix builds, caching, environment-specific secrets, concurrency controls" },
  { tool: "Terraform", purpose: "Infrastructure as Code for cloud resource provisioning", config: "Modular structure, remote state, workspaces, policy as code (Sentinel)" },
  { tool: "Prometheus + Grafana", purpose: "Metrics collection, alerting, and dashboards", config: "ServiceMonitor CRDs, recording rules, alertmanager routing" },
  { tool: "ELK / Loki", purpose: "Centralized logging with structured log aggregation and search", config: "Log shipping sidecars, retention policies, structured JSON logging" },
  { tool: "Velero", purpose: "Automated backups for Kubernetes resources and persistent volumes", config: "Scheduled backups, retention policies, restic for file-level backup" },
  { tool: "Vault / Sealed Secrets", purpose: "Secrets management — encryption at rest, rotation, audit logging", config: "Dynamic secrets, transit engine, Kubernetes mutating webhook" },
  { tool: "ArgoCD", purpose: "GitOps deployment with automated sync and drift detection", config: "ApplicationSets, sync waves, PR-based promotions, rollback" },
  { tool: "Helm", purpose: "Kubernetes package management for reusable chart deployments", config: "Chart versioning, values separation, dependency management" },
  { tool: "OpenTelemetry", purpose: "Distributed tracing for observability across microservices", config: "Auto-instrumentation, sampling rates, trace context propagation" },
];

export const SECURITY_ARCH_DOMAINS = [
  { domain: "Authentication", recommendations: ["Implement OAuth 2.0/OIDC with PKCE", "Enforce MFA for admin access", "Use short-lived tokens with refresh rotation", "Rate-limit login attempts"], rationale: "OAuth2/OIDC is industry standard; MFA reduces account takeover risk; short-lived tokens limit exposure from token leaks" },
  { domain: "Authorization", recommendations: ["RBAC with least privilege", "Attribute-based access control (ABAC) for fine-grained permissions", "Audit all authorization decisions"], rationale: "RBAC is maintainable for most cases; ABAC handles complex policies; auditing enables incident investigation" },
  { domain: "Encryption", recommendations: ["TLS 1.3 for all communications", "AES-256-GCM for data at rest", "Encrypt secrets with Vault transit engine", "Use HPKE for application-level encryption"], rationale: "TLS 1.3 provides forward secrecy; AES-256-GCM is NIST-approved; defense-in-depth for sensitive data" },
  { domain: "Secrets Management", recommendations: ["Centralized secrets with HashiCorp Vault", "Auto-rotation for database/service credentials", "Audit every secret access", "Never store secrets in env files or repos"], rationale: "Centralized management prevents sprawl; rotation limits blast radius; auditing enables compliance" },
  { domain: "Logging", recommendations: ["Structured JSON logging with correlation IDs", "Log all auth events, access changes, and errors", "Immutable log storage with append-only access", "Real-time alerting on security events"], rationale: "Structured logs enable automated analysis; immutable storage prevents tampering; correlation IDs enable tracing" },
  { domain: "Monitoring", recommendations: ["Real-time dashboards for security metrics", "Anomaly detection on access patterns", "Alert on unusual API traffic or error spikes", "Monthly security review meetings"], rationale: "Real-time visibility enables rapid response; anomaly detection catches unknown threats; reviews improve posture" },
  { domain: "Audit Trails", recommendations: ["Record all admin actions with before/after state", "Tamper-proof audit log storage", "Quarterly audit log review", "Automated compliance reporting"], rationale: "Tamper-proof logs satisfy compliance; before/after state enables rollback analysis; automated reporting reduces overhead" },
  { domain: "Input Validation", recommendations: ["Schema validation on all API inputs", "Content-type verification and size limits", "Parameterized queries for database access", "Allowlist-based sanitization"], rationale: "Schema validation prevents injection; size limits prevent DoS; parameterized queries prevent SQL injection; allowlists are safer than denylists" },
  { domain: "Dependency Management", recommendations: ["Automated vulnerability scanning with Dependabot/Renovate", "Software Bill of Materials (SBOM) generation", "Regular update cadence with automated testing", "Pin versions with lockfiles"], rationale: "Automated scanning catches known vulnerabilities; SBOM enables supply chain transparency; pinning prevents unexpected changes" },
  { domain: "Secure Configuration", recommendations: ["Hardened base images with minimal attack surface", "Security benchmarks (CIS, NIST) for all services", "Infrastructure as Code with policy-as-code validation", "Regular configuration drift detection"], rationale: "Hardened images reduce baseline risk; benchmarks ensure compliance; policy-as-code prevents misconfiguration; drift detection catches changes" },
];

export const STRIDE_THREATS = [
  { threat: "Spoofing", description: "Attacker impersonates a user, service, or system component to gain unauthorized access.", mitigations: ["Strong authentication (MFA)", "Certificate-based service identity", "API key rotation", "Mutual TLS"] },
  { threat: "Tampering", description: "Attacker modifies data in transit or at rest — messages, logs, configuration files, or database records.", mitigations: ["Data integrity checks (HMAC, signatures)", "Immutable audit logs", "Code signing", "File integrity monitoring (AIDE, Tripwire)"] },
  { threat: "Repudiation", description: "User denies performing an action due to insufficient audit trails or logging.", mitigations: ["Comprehensive audit logging", "Digital signatures on critical actions", "Centralized log aggregation", "Tamper-proof log storage"] },
  { threat: "Information Disclosure", description: "Unauthorized access to sensitive data — credentials, PII, source code, internal configurations.", mitigations: ["Encryption at rest and in transit", "Access control with least privilege", "Data classification policies", "Secrets management (Vault)"] },
  { threat: "Denial of Service", description: "Attacker overwhelms system resources to make the service unavailable to legitimate users.", mitigations: ["Rate limiting and throttling", "Auto-scaling groups", "Load balancers and CDNs", "DDoS protection (AWS Shield, Cloudflare)"] },
  { threat: "Elevation of Privilege", description: "Attacker escalates from limited access to higher privileges — admin, root, or service account.", mitigations: ["RBAC with least privilege", "Regular privilege audits", "Process isolation (containers)", "Just-in-time access (Teleport)"] },
];

export const SKILL_MAPPING_CATEGORIES = [
  { category: "Languages", skills: ["Python", "TypeScript", "Go", "Rust", "Bash", "PowerShell", "SQL", "YAML/JSON"] },
  { category: "Cloud", skills: ["AWS", "Azure", "Terraform", "CloudFormation", "IAM", "Container Security", "Serverless"] },
  { category: "Security Tools", skills: ["Metasploit", "Burp Suite", "Nmap", "Wireshark", "BloodHound", "Impacket", "Mimikatz"] },
  { category: "Defensive", skills: ["SIEM", "EDR", "IDS/IPS", "SOAR", "Threat Intel", "Incident Response", "Forensics"] },
  { category: "DevSecOps", skills: ["CI/CD", "Docker", "Kubernetes", "Helm", "ArgoCD", "Vault", "Prometheus"] },
  { category: "Soft Skills", skills: ["Technical Writing", "Architecture Design", "Threat Modeling", "Risk Assessment", "Mentoring"] },
];

export function generateProjectId(): string {
  const prefix = "prj-arch-";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}${timestamp}-${random}`;
}

export function getCategoryLabel(cat: ProjectCategory): string {
  return CATEGORIES[cat]?.label ?? cat;
}

export function getCategoryColor(cat: ProjectCategory): string {
  return CATEGORIES[cat]?.color ?? "text-white bg-white/10";
}

export function estimateDuration(complexity: string): string {
  const map: Record<string, string> = {
    low: "2-4 weeks",
    medium: "1-3 months",
    high: "3-6 months",
    "very-high": "6-12 months",
  };
  return map[complexity] ?? "unknown";
}

export const SAMPLE_CONCEPTS: GeneratedProject[] = [
  {
    id: "sample-threat-hunter",
    title: "Automated Threat Hunter",
    purpose: "Proactive threat detection across network, endpoint, and cloud telemetry",
    problemStatement: "Security teams struggle to identify sophisticated threats that evade signature-based detection. Manual threat hunting is time-consuming and inconsistent.",
    targetUsers: ["SOC analysts", "Threat hunters", "Incident responders"],
    learningObjectives: ["Understand adversary TTPs and detection engineering", "Build correlation rules across data sources", "Implement machine learning for anomaly detection"],
    coreFeatures: ["Multi-source telemetry ingestion", "MITRE ATT&CK mapping engine", "ML-based anomaly detection", "Automated hypothesis generation", "Case management integration"],
    technicalChallenges: ["High-volume telemetry processing", "Reducing false positives", "Correlating across disparate data sources", "Real-time alerting at scale"],
    expectedOutcomes: ["Reduced mean detection time", "Increased threat coverage", "Automated hunting playbooks"],
    relatedSkills: ["Python", "SIEM", "Threat Intelligence", "Machine Learning", "Elasticsearch"],
    relatedPortfolioProjects: ["sentinel-ai", "soc-automation"],
    categories: ["threat-hunting", "soc", "automation"],
    status: "concept-proposal",
    createdAt: "2026-06-15",
  },
  {
    id: "sample-cloud-sec",
    title: "Cloud Security Posture Manager",
    purpose: "Continuous cloud security assessment and compliance monitoring",
    problemStatement: "Multi-cloud environments are complex to secure. Misconfigurations are the leading cause of cloud breaches, and manual audits cannot keep pace.",
    targetUsers: ["Cloud security engineers", "DevOps teams", "Compliance officers"],
    learningObjectives: ["Cloud security best practices", "Policy-as-code implementation", "Compliance automation"],
    coreFeatures: ["Multi-cloud scanner (AWS, Azure, GCP)", "CIS benchmark automation", "Real-time compliance dashboards", "Auto-remediation workflows", "IaC scanning (Terraform, CloudFormation)"],
    technicalChallenges: ["API rate limiting across cloud providers", "Policy engine performance at scale", "False positive tuning", "Multi-account aggregation"],
    expectedOutcomes: ["Reduced misconfiguration risk", "Automated compliance reporting", "Faster incident remediation"],
    relatedSkills: ["AWS", "Azure", "Terraform", "Python", "Compliance"],
    relatedPortfolioProjects: ["cloud-security-lab"],
    categories: ["cloud-security", "automation", "devsecops"],
    status: "concept-proposal",
    createdAt: "2026-06-10",
  },
  {
    id: "sample-api-sec",
    title: "API Security Testing Framework",
    purpose: "Automated API security assessment with CI/CD integration",
    problemStatement: "APIs are the primary attack vector for modern applications, yet many organizations lack automated security testing integrated into their development pipelines.",
    targetUsers: ["AppSec engineers", "DevOps teams", "Penetration testers"],
    learningObjectives: ["OWASP API Security Top 10", "Automated security testing in CI/CD", "API fuzzing techniques"],
    coreFeatures: ["Automated API discovery", "OWASP API Top 10 scanner", "Fuzzing engine", "CI/CD plugin (GitHub Actions, GitLab CI)", "OpenAPI/Swagger import", "Detailed remediation guidance"],
    technicalChallenges: ["Handling auth workflows automatically", "Stateful API testing", "Reducing false positives", "Performance impact on CI pipelines"],
    expectedOutcomes: ["Shift-left API security", "Continuous compliance", "Developer-friendly reports"],
    relatedSkills: ["REST API", "OWASP", "Python", "CI/CD", "Burp Suite"],
    relatedPortfolioProjects: ["sentinel-ai"],
    categories: ["api-security", "web-security", "devsecops"],
    status: "concept-proposal",
    createdAt: "2026-06-05",
  },
];
