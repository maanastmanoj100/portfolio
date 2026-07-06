import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experiences } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { vaultCertifications } from "@/data/certifications-vault";
import { blogPosts } from "@/data/blog";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface EngineContext {
  lastTopic: string | null;
  lastProjectId: string | null;
  lastCertId: string | null;
  history: Message[];
}

interface Answer {
  response: string;
  suggestions: string[];
  sources: { label: string; href: string }[];
}

const profile = {
  name: "Maanas T Manoj",
  title: "Cybersecurity Engineer & Penetration Tester",
  status: "Open for Internship Opportunities",
  intro: "Building secure systems through offensive security, defensive engineering, and AI-powered automation.",
  yearsLearning: 6,
  interests: ["Offensive Security", "AI Security", "Cloud Security", "Threat Detection"],
  availability: "Immediate (Internship / Full-time)",
  email: "maanas@cybernexus.io",
  github: "github.com/maanastmanoj",
  linkedin: "linkedin.com/in/maanas",
};

function findProjects(query: string): { project: typeof projects[0]; score: number }[] {
  const q = query.toLowerCase();
  return projects
    .map((p) => {
      let score = 0;
      if (p.title.toLowerCase().includes(q)) score += 10;
      if (p.description.toLowerCase().includes(q)) score += 5;
      if (p.tags.some((t) => t.toLowerCase().includes(q))) score += 3;
      if (p.languages?.some((l) => l.toLowerCase().includes(q))) score += 3;
      if (p.techStack?.some((t) => t.name.toLowerCase().includes(q))) score += 2;
      if (p.category?.toLowerCase().includes(q)) score += 2;
      if (p.recruiterSummary?.skillsDemonstrated.some((s) => s.toLowerCase().includes(q))) score += 2;
      return { project: p, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);
}

function findSkills(query: string) {
  const q = query.toLowerCase();
  return skills.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
}

function findCerts(query: string) {
  const q = query.toLowerCase();
  const allCerts = [...certifications, ...vaultCertifications];
  return allCerts.filter((c) => c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q) || c.skills?.some((s) => s.toLowerCase().includes(q)));
}

function findBlogs(query: string) {
  const q = query.toLowerCase();
  return blogPosts.filter((b) => b.title.toLowerCase().includes(q) || b.tags.some((t) => t.toLowerCase().includes(q)));
}

function buildResponse(results: { label: string; items: { title: string; detail: string; href?: string }[] }[]): string {
  if (results.length === 0) return "";
  const parts: string[] = [];
  for (const group of results) {
    if (group.items.length === 0) continue;
    parts.push(`**${group.label}**`);
    group.items.slice(0, 5).forEach((item) => {
      parts.push(`• ${item.title} — ${item.detail}`);
    });
    if (group.items.length > 5) parts.push(`  ...and ${group.items.length - 5} more.`);
  }
  return parts.join("\n");
}

function getSources(results: { label: string; items: { title: string; detail: string; href?: string }[] }[]): { label: string; href: string }[] {
  const sources: { label: string; href: string }[] = [];
  for (const group of results) {
    for (const item of group.items) {
      if (item.href && !sources.some((s) => s.href === item.href)) {
        sources.push({ label: item.title, href: item.href });
      }
    }
  }
  return sources.slice(0, 6);
}

const topicResponders: Record<string, (query: string, ctx: EngineContext) => Answer | null> = {
  about: () => ({
    response: `I'm ${profile.name}, a ${profile.title.toLowerCase()}. ${profile.intro} I have ${profile.yearsLearning}+ years of experience across offensive security, defensive engineering, and AI-driven automation. I'm currently ${profile.status.toLowerCase()}. My core interests include ${profile.interests.join(", ")}.`,
    suggestions: ["What projects have you built?", "What are your top skills?", "How did you learn cybersecurity?", "Show your certifications", "What are you learning now?"],
    sources: [],
  }),

  projects: (q, ctx) => {
    const query = q || (ctx.lastTopic === "projects" && ctx.lastProjectId ? ctx.lastProjectId : "");
    if (!query) {
      const featured = projects.filter((p) => p.featured).slice(0, 5);
      return {
        response: `I've built **${projects.length} projects**, ${featured.length} of which are featured highlights:\n${featured.map((p) => `• **${p.title}** — ${p.description}`).join("\n")}\n\nAsk me about any specific project for detailed information.`,
        suggestions: ["Tell me about Sentinel AI", "Explain NetDefend", "Show me ChainGuard", "What technologies do you use?", "Show all projects"],
        sources: featured.map((p) => ({ label: p.title, href: `/projects/${p.id}` })),
      };
    }
    const matches = findProjects(query);
    if (matches.length === 0) {
      return { response: `I couldn't find any projects matching "${query}". Try asking about: Sentinel AI, NetDefend, ChainGuard, Threat Hunter, or Autopwn.`, suggestions: ["List all projects", "What is Sentinel AI?", "Show featured projects"], sources: [] };
    }
    const best = matches[0].project;
    ctx.lastProjectId = best.id;
    ctx.lastTopic = "projects";
    const summary = best.recruiterSummary;
    const detail = [];
    if (summary?.overview) detail.push(`**Overview:** ${summary.overview}`);
    if (summary?.businessValue) detail.push(`**Business Value:** ${summary.businessValue}`);
    if (best.languages?.length) detail.push(`**Technologies:** ${best.languages.join(", ")}`);
    if (summary?.skillsDemonstrated?.length) detail.push(`**Skills:** ${summary.skillsDemonstrated.slice(0, 6).join(", ")}`);
    if (summary?.keyAchievements?.length) detail.push(`**Key Results:** ${summary.keyAchievements.slice(0, 3).join(" | ")}`);
    return {
      response: `**${best.title}**\n${detail.join("\n")}`,
      suggestions: ["What technologies were used?", "Which certification helped build this?", "Show similar projects", "Explain the architecture", `Tell me about ${matches.length > 1 ? matches[1].project.title : "NetDefend"}`],
      sources: [{ label: best.title, href: `/projects/${best.id}` }, ...(best.links?.github ? [{ label: `${best.title} GitHub`, href: best.links.github }] : []), ...(best.links?.case_study ? [{ label: `${best.title} Case Study`, href: best.links.case_study }] : [])].filter(Boolean) as { label: string; href: string }[],
    };
  },

  skills: (q) => {
    const query = q || "";
    if (!query) {
      const cats = [...new Set(skills.map((s) => s.category))];
      const catInfo = cats.map((c) => {
        const catSkills = skills.filter((s) => s.category === c);
        return `${c}: ${catSkills.slice(0, 4).map((s) => s.name).join(", ")}`;
      });
      return {
        response: `I track **${skills.length} technical skills** across ${cats.length} categories:\n${catInfo.map((c) => `• ${c}`).join("\n")}\n\nMy strongest areas are penetration testing (95%), incident response (92%), Python (95%), and cloud security (90%). Need details on any specific skill?`,
        suggestions: ["What are your top programming skills?", "Show offensive security skills", "Tell me about your AI/ML skills", "Which tools do you use daily?"],
        sources: [],
      };
    }
    const matches = findSkills(query);
    if (matches.length === 0) {
      return { response: `I don't have a skill matching "${query}" in my portfolio. You can browse all skills on the Skills page.`, suggestions: ["Show all skills", "What are your top skills?", "Which tools do you use?"], sources: [] };
    }
    return {
      response: matches.map((s) => `• **${s.name}** — ${s.description} (Proficiency: ${s.level}%)`).join("\n"),
      suggestions: ["What projects use these skills?", "Show related certifications", "Browse all skills"],
      sources: [{ label: "Skills Page", href: "/skills" }],
    };
  },

  certifications: (q) => {
    const query = q || "";
    const allCerts = [...certifications, ...vaultCertifications];
    if (!query) {
      return {
        response: `I hold **${allCerts.length} industry certifications**. Key highlights:\n${allCerts.slice(0, 6).map((c) => `• **${c.name}** — ${c.issuer} (${c.date})`).join("\n")}\n\nView all certifications on the Certifications page for verification links and details.`,
        suggestions: ["Show my OSCP details", "What certifications are most relevant to SOC roles?", "Tell me about CEH", "Which certification was hardest?"],
        sources: [{ label: "Certifications", href: "/certifications" }],
      };
    }
    const matches = findCerts(query);
    if (matches.length === 0) {
      return { response: `I couldn't find a certification matching "${query}". Browse all certifications on the Certifications page.`, suggestions: ["List all certifications", "Show featured certifications"], sources: [] };
    }
    const cert = matches[0];
    const links = [];
    if (cert.verificationUrl) links.push({ label: `Verify ${cert.name}`, href: cert.verificationUrl });
    links.push({ label: "Certifications Page", href: "/certifications" });
    return {
      response: `**${cert.name}** issued by ${cert.issuer}\n• Completed: ${cert.date}\n• Credential ID: ${cert.credentialId}${cert.skills?.length ? `\n• Skills: ${cert.skills.slice(0, 8).join(", ")}` : ""}${cert.learningHours ? `\n• Learning Hours: ${cert.learningHours}h` : ""}${cert.careerValue ? `\n• ${cert.careerValue}` : ""}`,
      suggestions: ["Show similar certifications", "Which projects use this certification?", "What is your most recent certification?", "Verify this credential"],
      sources: links,
    };
  },

  experience: () => {
    const work = experiences.filter((e) => e.type === "work");
    const edu = experiences.filter((e) => e.type === "education");
    return {
      response: `**Professional Experience**\n${work.map((e) => `• **${e.role}** @ ${e.company} (${e.period})\n  ${e.highlights.slice(0, 2).join(" | ")}`).join("\n")}\n\n**Education**\n${edu.map((e) => `• **${e.role}** @ ${e.company} (${e.period})`).join("\n")}`,
      suggestions: ["Current responsibilities", "What are your career goals?", "Show detailed resume", "Contact information"],
      sources: [{ label: "Resume", href: "/resume" }],
    };
  },

  learning: () => {
    const vault = vaultCertifications;
    const active = vault.filter((c) => c.status === "active");
    const inProgress = vault.filter((c) => c.status === "in-progress");
    return {
      response: `**Currently Learning:** Advanced Active Directory attacks, cloud security architecture, and malware analysis. Working toward OSCP certification.\n\n**Active Certifications:** ${active.length} currently maintained.\n**In Progress:** ${inProgress.length} certification(s) in progress.\n\n**Learning Philosophy:** I believe in hands-on, practical learning. Every certification in my portfolio was earned through labs, real-world projects, and continuous practice.`,
      suggestions: ["Show my learning roadmap", "What should beginners study?", "What are your career goals?", "Show certifications in progress"],
      sources: [{ label: "Certification Vault", href: "/certifications" }],
    };
  },

  technologies: () => {
    const allLangs = [...new Set(projects.flatMap((p) => p.languages || []))];
    const allPlatforms = [...new Set(projects.flatMap((p) => p.platforms || []))];
    const allTools = [...new Set(projects.flatMap((p) => p.techStack?.map((t) => t.name) || []))];
    return {
      response: `**Primary Languages:** ${allLangs.slice(0, 10).join(", ")}\n**Platforms:** ${allPlatforms.slice(0, 8).join(", ")}\n**Tools & Frameworks:** ${allTools.slice(0, 15).join(", ")}`,
      suggestions: ["Which projects use Python?", "What cloud platforms do you use?", "Tell me about your tech stack", "Show Kubernetes projects"],
      sources: [],
    };
  },

  career: () => ({
    response: `My cybersecurity journey:\n\n1. **Started Programming** — Built a foundation in Python, C, and systems programming\n2. **Networking & Linux** — Deep-dived into protocols, routing, and Linux administration\n3. **Cybersecurity** — Transitioned into offensive and defensive security\n4. **TryHackMe & Labs** — Hundreds of hours of practical labs and CTF challenges\n5. **Professional Projects** — Built enterprise-grade security tools and platforms\n6. **Research** — Published security research and blog articles\n7. **Advanced Labs** — OSCP prep, AD attack labs, cloud security architectures\n8. **Future Goals** — AI security research, advanced cloud security, security architecture leadership`,
    suggestions: ["What certifications support your career?", "Show your latest project", "What are your career goals?", "How do you stay current?"],
    sources: [],
  }),

  blog: (q) => {
    const query = q || "";
    if (!query) {
      const featured = blogPosts.filter((b) => b.featured);
      return {
        response: `I've written **${blogPosts.length} articles** on cybersecurity topics:\n${featured.map((b) => `• **${b.title}** — ${b.description}`).join("\n")}`,
        suggestions: ["Show all blog posts", "Search blog by topic", "Tell me about zero trust architecture"],
        sources: featured.map((b) => ({ label: b.title, href: `/blog/${b.slug}` })),
      };
    }
    const matches = findBlogs(query);
    if (matches.length === 0) return { response: `No articles found matching "${query}".`, suggestions: ["Show all blog posts", "Browse by category"], sources: [] };
    return {
      response: matches.map((b) => `• **${b.title}** — ${b.description} (${b.readTime}, ${b.date})`).join("\n"),
      suggestions: ["Show featured articles", "Tell me about security research", "Browse all posts"],
      sources: matches.map((b) => ({ label: b.title, href: `/blog/${b.slug}` })),
    };
  },

  resume: () => ({
    response: `You can view or download my full resume from the Resume page.\n• **Contact:** ${profile.email}\n• **GitHub:** ${profile.github}\n• **LinkedIn:** ${profile.linkedin}\n\nI have ${experiences.filter((e) => e.type === "work").length} professional experiences and ${experiences.filter((e) => e.type === "education").length} educational qualifications.`,
    suggestions: ["Show work experience", "Show education", "Download resume", "Contact information"],
    sources: [{ label: "Resume", href: "/resume" }],
  }),

  contact: () => ({
    response: `**Email:** ${profile.email}\n**GitHub:** ${profile.github}\n**LinkedIn:** ${profile.linkedin}\n**Preferred Contact:** Email (fastest response)\n**Response Time:** Within 24 hours\n\nI'm ${profile.status.toLowerCase()} and ${profile.availability.toLowerCase()}.`,
    suggestions: ["Send me an email", "View GitHub profile", "Visit LinkedIn", "Show resume"],
    sources: [],
  }),

  help: () => ({
    response: "I can help you explore this portfolio. Try asking about:\n• **Projects** — Details on any project, technologies used, architecture decisions\n• **Skills** — Technical expertise across domains\n• **Certifications** — Industry credentials and verification\n• **Experience** — Work history and education\n• **Learning** — Current studies and roadmap\n• **Career** — Journey and goals\n• **Blog** — Research articles and write-ups\n• **Technologies** — Languages, platforms, and tools\n• **Resume** — Download or view online\n• **Contact** — How to reach me",
    suggestions: ["Tell me about yourself", "Show featured projects", "What are your top skills?", "How did you learn cybersecurity?"],
    sources: [],
  }),
};

const fallbackResponses = [
  "I don't have information about that in my portfolio. Could you ask me about my projects, skills, certifications, experience, or learning journey?",
  "That's outside the knowledge I have from this portfolio. I can tell you about projects, certifications, skills, and my cybersecurity journey. What would you like to know?",
  "I'm not sure about that — my knowledge comes only from this portfolio. Try asking about specific projects, skills, or certifications.",
];

export function createConversationEngine() {
  const ctx: EngineContext = { lastTopic: null, lastProjectId: null, lastCertId: null, history: [] };

  const isFollowUp = (query: string): boolean => {
    const followUpPhrases = ["it", "this", "that", "tell me more", "explain more", "what technologies", "which", "how", "why", "show me", "similar", "related"];
    return followUpPhrases.some((p) => query.toLowerCase().startsWith(p));
  };

  const classifyTopic = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("project") || q.includes("built") || q.includes("build") || q.includes("develop") || q.includes("sentinel") || q.includes("netdefend") || q.includes("chainguard") || q.includes("autopwn")) return "projects";
    if (q.includes("skill") || q.includes("expertise") || q.includes("proficient") || q.includes("know")) return "skills";
    if (q.includes("certif") || q.includes("credential") || q.includes("oscp") || q.includes("ceh") || q.includes("cissp")) return "certifications";
    if (q.includes("experience") || q.includes("work") || q.includes("job") || q.includes("company") || q.includes("employ")) return "experience";
    if (q.includes("learn") || q.includes("study") || q.includes("roadmap") || q.includes("course") || q.includes("training") || q.includes("beginner")) return "learning";
    if (q.includes("technolog") || q.includes("tool") || q.includes("language") || q.includes("framework") || q.includes("platform") || q.includes("tech stack")) return "technologies";
    if (q.includes("career") || q.includes("journey") || q.includes("start") || q.includes("how did you")) return "career";
    if (q.includes("blog") || q.includes("article") || q.includes("write") || q.includes("research") || q.includes("post")) return "blog";
    if (q.includes("resume") || q.includes("cv")) return "resume";
    if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("linkedin") || q.includes("github")) return "contact";
    if (q.includes("help") || q.includes("what can you") || q.includes("what do you know")) return "help";
    if (q.includes("about") || q.includes("yourself") || q.includes("who are you") || q.includes("introduce")) return "about";
    if (q.includes("architecture") || q.includes("design") || q.includes("why")) return "projects";
    if (ctx.lastTopic && isFollowUp(q)) return ctx.lastTopic;
    return "about";
  };

  const answer = (question: string): Answer => {
    ctx.history.push({ role: "user", content: question });
    const topic = classifyTopic(question);
    const responder = topicResponders[topic];
    if (!responder) {
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return { response: fallback, suggestions: ["Tell me about yourself", "Show featured projects", "What are your top skills?", "Show certifications"], sources: [] };
    }
    const result = responder(question, ctx);
    if (!result) {
      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return { response: fallback, suggestions: ["Tell me about yourself", "Show featured projects", "What are your top skills?", "Show certifications"], sources: [] };
    }
    ctx.lastTopic = topic;
    ctx.history.push({ role: "assistant", content: result.response });
    return result;
  };

  const getContext = () => ctx;

  return { answer, getContext };
}
