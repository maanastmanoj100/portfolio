import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    company: "CyberSec Corp",
    role: "Senior Security Engineer",
    period: "2023 - Present",
    description: "Leading security architecture and incident response for a Fortune 500 company.",
    highlights: [
      "Architected zero-trust network security model reducing breach risk by 95%",
      "Led incident response team handling 500+ security events annually",
      "Developed automated threat detection pipeline processing 10M+ events daily",
      "Mentored team of 5 junior security engineers",
    ],
    technologies: ["Python", "Go", "Kubernetes", "AWS", "TensorFlow", "Elasticsearch"],
    type: "work",
  },
  {
    company: "SecureTech Solutions",
    role: "Penetration Testing Lead",
    period: "2021 - 2023",
    description: "Led penetration testing engagements for enterprise clients across multiple industries.",
    highlights: [
      "Conducted 100+ penetration tests for Fortune 500 clients",
      "Discovered 20+ critical vulnerabilities in major platforms",
      "Developed custom exploitation frameworks reducing testing time by 40%",
      "Published 5 security advisories for responsibly disclosed vulnerabilities",
    ],
    technologies: ["Python", "Rust", "Burp Suite", "Metasploit", "C2 Frameworks"],
    type: "work",
  },
  {
    company: "StartupSecure",
    role: "Security Researcher",
    period: "2019 - 2021",
    description: "Conducted cutting-edge security research in web3 and AI security domains.",
    highlights: [
      "Published 3 peer-reviewed papers on blockchain security",
      "Discovered critical vulnerabilities in top DeFi protocols",
      "Built automated smart contract auditing tool used by 500+ developers",
      "Presented at Black Hat and DEF CON security conferences",
    ],
    technologies: ["Solidity", "Rust", "Python", "Machine Learning", "Reverse Engineering"],
    type: "work",
  },
  {
    company: "MIT",
    role: "M.S. Computer Science - Cybersecurity",
    period: "2017 - 2019",
    description: "Graduate research focused on AI-driven security systems and cryptography.",
    highlights: [
      "Research in adversarial machine learning for security applications",
      "Published thesis on automated vulnerability discovery using ML",
      "Teaching assistant for graduate-level network security course",
      "Dean's list with research honors",
    ],
    technologies: ["Python", "C++", "PyTorch", "CUDA", "Cryptography"],
    type: "education",
  },
  {
    company: "Stanford University",
    role: "B.S. Computer Science",
    period: "2013 - 2017",
    description: "Bachelor's degree in Computer Science with focus on security and systems.",
    highlights: [
      "Graduated with honors (GPA: 3.9/4.0)",
      "CTF team member - placed top 10 in international competitions",
      "Undergraduate research in network security protocols",
      "President of Cybersecurity Student Association",
    ],
    technologies: ["C", "C++", "Python", "Assembly", "Networking"],
    type: "education",
  },
];
