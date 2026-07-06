"use client";

import type { CommandDef, CommandContext, TerminalLine, TerminalTheme, FSNode } from "./types";
import { resolvePath, getNode, listDir, isDirectory } from "./filesystem";
import { terminalThemes, getTheme } from "./themes";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { certifications } from "@/data/certifications";
import { experiences } from "@/data/experience";
import { blogPosts } from "@/data/blog";

export function getBuiltinCommands(): CommandDef[] {
  return [
    { name: "help", description: "Show available commands", category: "navigation" },
    { name: "clear", description: "Clear terminal screen", category: "navigation", aliases: ["cls"] },
    { name: "whoami", description: "Display current user info", category: "information" },
    { name: "pwd", description: "Print working directory", category: "navigation" },
    { name: "ls", description: "List directory contents", category: "navigation" },
    { name: "cd", description: "Change directory", category: "navigation" },
    { name: "cat", description: "Display file contents", category: "navigation" },
    { name: "open", description: "Open a project, cert, or blog post", category: "navigation" },
    { name: "tree", description: "Display directory tree", category: "navigation" },
    { name: "skills", description: "List all skills by category", category: "information" },
    { name: "projects", description: "List portfolio projects", category: "projects" },
    { name: "certifications", description: "List certifications", category: "information" },
    { name: "resume", description: "Display professional resume", category: "information" },
    { name: "contact", description: "Display contact information", category: "information" },
    { name: "dashboard", description: "Open the SOC dashboard", category: "information" },
    { name: "blog", description: "List blog posts", category: "information" },
    { name: "version", description: "Show version information", category: "information", aliases: ["ver"] },
    { name: "date", description: "Show current date", category: "information" },
    { name: "time", description: "Show current time", category: "information" },
    { name: "history", description: "Show command history", category: "navigation" },
    { name: "theme", description: "Change terminal theme", category: "settings", aliases: ["themes"] },
    { name: "search", description: "Search portfolio content", category: "search" },
    { name: "ai", description: "Open Cyber AI assistant", category: "ai" },
    { name: "ask", description: "Ask Cyber AI a question", category: "ai" },
    { name: "summarize", description: "Get AI summary of a project", category: "ai" },
    { name: "echo", description: "Echo text", category: "fun" },
    { name: "matrix", description: "Toggle matrix mode", category: "fun" },
    { name: "recruiter", description: "Toggle recruiter mode", category: "settings" },
    { name: "widgets", description: "Toggle system widgets", category: "settings" },
    { name: "exit", description: "Close terminal", category: "system", aliases: ["quit"] },
    { name: "download", description: "Download resume", category: "information" },
    { name: "sudo", description: "Execute with elevated privileges", category: "fun" },
    { name: "about", description: "About Cyber Nexus", category: "information" },
    { name: "email", description: "Open email client", category: "information" },
    { name: "github", description: "Open GitHub profile", category: "information" },
    { name: "linkedin", description: "Open LinkedIn profile", category: "information" },
  ];
}

const SECRET_COMMANDS: Record<string, (ctx: CommandContext) => void> = {
  "sudo hire maanas": (ctx) => {
    ctx.appendLine({ text: "", type: "output" });
    ctx.appendLine({ text: "  ╔══════════════════════════════════════════════╗", type: "system" });
    ctx.appendLine({ text: "  ║   ACCESS GRANTED: SUPERUSER PRIVILEGES       ║", type: "system" });
    ctx.appendLine({ text: "  ╚══════════════════════════════════════════════╝", type: "system" });
    ctx.appendLine({ text: "", type: "output" });
    ctx.appendLine({ text: "  🎉 Thank you for your interest!", type: "success" });
    ctx.appendLine({ text: "  Maanas is ready to join your team.", type: "success" });
    ctx.appendLine({ text: "  Contact: maanas@cybernexus.io", type: "success" });
    ctx.appendLine({ text: "  \"Security isn't a product — it's a mindset.\"", type: "info" });
    ctx.appendLine({ text: "", type: "output" });
  },
  "unlock achievements": (ctx) => {
    ctx.appendLine({ text: "  🏆 Achievements Unlocked!", type: "system" });
    ctx.appendLine({ text: "  ├─ 🌟 Portfolio Explorer", type: "success" });
    ctx.appendLine({ text: "  ├─ 🔧 Terminal Power User", type: "success" });
    ctx.appendLine({ text: "  ├─ 🕵️ Secret Hunter", type: "success" });
    ctx.appendLine({ text: "  └─ 🧠 Cyber Enthusiast", type: "success" });
  },
  "cyber nexus": (ctx) => {
    ctx.appendLine({ text: "   ____      _            _   _            _     ", type: "system" });
    ctx.appendLine({ text: "  / ___|   _| |_ _   _   | \\ | | ___  ___ | |_   ", type: "system" });
    ctx.appendLine({ text: " | |  | | | | __| | | |  |  \\| |/ _ \\/ _ \\| __|  ", type: "system" });
    ctx.appendLine({ text: " | |__| |_| | |_| |_| |  | |\\  |  __/  __/| |_   ", type: "system" });
    ctx.appendLine({ text: "  \\____\\__, |\\__|\\__,_|  |_| \\_|\\___|\\___| \\__|  ", type: "system" });
    ctx.appendLine({ text: "       |___/                                     ", type: "system" });
    ctx.appendLine({ text: "  Where security meets innovation.", type: "info" });
  },
  about: (ctx) => {
    ctx.appendLine({ text: "  Cyber Nexus — Interactive Cybersecurity Portfolio", type: "system" });
    ctx.appendLine({ text: "  Built with Next.js, TypeScript, Tailwind CSS, Framer Motion", type: "output" });
    ctx.appendLine({ text: "  Architecture: Liquid Glass Design System", type: "output" });
    ctx.appendLine({ text: "  Version: 2.0.0", type: "output" });
    ctx.appendLine({ text: "  Creator: Maanas", type: "output" });
  },
};

function executeHelp(ctx: CommandContext) {
  const cats: { title: string; key: CommandDef["category"]; color: string }[] = [
    { title: "Navigation", key: "navigation", color: "#00b4d8" },
    { title: "Information", key: "information", color: "#10b981" },
    { title: "Projects", key: "projects", color: "#8b5cf6" },
    { title: "AI", key: "ai", color: "#f59e0b" },
    { title: "Settings", key: "settings", color: "#3b82f6" },
    { title: "Search", key: "search", color: "#ec4899" },
    { title: "Fun", key: "fun", color: "#ef4444" },
    { title: "System", key: "system", color: "#6b7280" },
  ];

  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  ╭──────────────────────────────────────────────╮", type: "system" });
  ctx.appendLine({ text: "  │         CyberShell — Available Commands       │", type: "system" });
  ctx.appendLine({ text: "  ╰──────────────────────────────────────────────╯", type: "system" });
  ctx.appendLine({ text: "", type: "output" });

  for (const cat of cats) {
    const cmds = getBuiltinCommands()
      .filter((c) => c.category === cat.key)
      .map((c) => c.name)
      .join(", ");
    ctx.appendLine({ text: `  ${cat.title}`, type: "system" });
    ctx.appendLine({ text: `    ${cmds}`, type: "output" });
    ctx.appendLine({ text: "", type: "output" });
  }

  ctx.appendLine({ text: "  Keyboard Shortcuts", type: "system" });
  ctx.appendLine({ text: "    Tab       — Autocomplete", type: "output" });
  ctx.appendLine({ text: "    ↑ / ↓    — Command history", type: "output" });
  ctx.appendLine({ text: "    Ctrl+L    — Clear screen", type: "output" });
  ctx.appendLine({ text: "    Ctrl+C    — Cancel input", type: "output" });
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  Type a command and press Enter.", type: "info" });
  ctx.appendLine({ text: "", type: "output" });
}

function executeWhoami(ctx: CommandContext) {
  ctx.appendLine({ text: "", type: "output" });
  const info = [
    ["Name", "Maanas"],
    ["Role", "Senior Security Engineer / Penetration Tester"],
    ["Focus", "Offensive Security, Incident Response, AI Security"],
    ["Interests", "Exploit Development, Threat Intelligence, Cloud Security"],
    ["Availability", "Open to opportunities"],
    ["GitHub", "github.com/maanas"],
    ["LinkedIn", "linkedin.com/in/maanas"],
    ["Portfolio", "Cyber Nexus v2.0.0"],
  ];
  for (const [label, value] of info) {
    ctx.appendLine({ text: `  ${label.padEnd(16)}${value}`, type: "output" });
  }
  ctx.appendLine({ text: "", type: "output" });
}

function executeLs(ctx: CommandContext) {
  const parts = resolvePath(ctx.currentDir, "");
  const entries = listDir(parts);
  if (!entries) {
    ctx.appendLine({ text: "ls: cannot access directory", type: "error" });
    return;
  }
  if (entries.length === 0) {
    ctx.appendLine({ text: "  (empty)", type: "output" });
    return;
  }
  const dirs = entries.filter((e) => e.type === "directory").map((e) => `${e.name}/`);
  const files = entries.filter((e) => e.type === "file").map((e) => e.name);
  ctx.appendLine({ text: [...dirs, ...files].join("  "), type: "output" });
}

function executeCd(ctx: CommandContext, args: string[]) {
  const target = args[0] ?? "~";
  if (target === "~" || target === "home") {
    ctx.setCurrentDir("/home/visitor");
    return;
  }
  if (target === "/") {
    ctx.setCurrentDir("/");
    return;
  }
  if (target === "..") {
    const parts = ctx.currentDir.split("/").filter(Boolean);
    parts.pop();
    ctx.setCurrentDir("/" + parts.join("/") || "/");
    return;
  }
  const resolved = resolvePath(ctx.currentDir, target);
  if (!isDirectory(resolved)) {
    ctx.appendLine({ text: `cd: ${target}: No such directory`, type: "error" });
    return;
  }
  ctx.setCurrentDir("/" + resolved.join("/"));
}

function executeCat(ctx: CommandContext, args: string[]) {
  if (!args[0]) {
    ctx.appendLine({ text: "cat: missing operand", type: "error" });
    return;
  }
  const resolved = resolvePath(ctx.currentDir, args[0]);
  const node = getNode(resolved);
  if (!node) {
    ctx.appendLine({ text: `cat: ${args[0]}: No such file`, type: "error" });
    return;
  }
  if (node.type === "directory") {
    ctx.appendLine({ text: `cat: ${args[0]}: Is a directory`, type: "error" });
    return;
  }
  ctx.appendLine({ text: node.content ?? "(empty)", type: "output" });
}

function executeTree(ctx: CommandContext) {
  const parts = resolvePath(ctx.currentDir, "");
  const node = getNode(parts);
  if (!node) return;
  function printTree(n: FSNode, prefix: string, isLast: boolean) {
    const connector = isLast ? "└── " : "├── ";
    const icon = n.type === "directory" ? "📁" : "📄";
    ctx.appendLine({ text: `${prefix}${connector}${icon} ${n.name}`, type: "output" });
    if (n.children) {
      const childPrefix = prefix + (isLast ? "    " : "│   ");
      n.children.forEach((child, idx) => {
        printTree(child, childPrefix, idx === n.children!.length - 1);
      });
    }
  }
  ctx.appendLine({ text: `.`, type: "output" });
  node.children?.forEach((child, idx) => {
    printTree(child, "", idx === (node.children?.length ?? 0) - 1);
  });
}

function executeOpen(ctx: CommandContext, args: string[]) {
  if (!args[0]) {
    ctx.appendLine({ text: "open: missing operand. Usage: open <type> <id>", type: "error" });
    ctx.appendLine({ text: "  Types: project, cert, blog", type: "info" });
    ctx.appendLine({ text: "  Examples: open project 1, open cert 2", type: "info" });
    return;
  }
  const type = args[0].toLowerCase();
  const index = parseInt(args[1], 10);

  if (type === "project" || type === "projects") {
    if (isNaN(index) || index < 1 || index > projects.length) {
      ctx.appendLine({ text: `open: invalid project index. Use 'projects' to list.`, type: "error" });
      return;
    }
    const proj = projects[index - 1];
    ctx.navigateTo(`/projects/${proj.id}`);
    ctx.appendLine({ text: `Opening "${proj.title}"...`, type: "success" });
    return;
  }

  if (type === "cert" || type === "certification" || type === "certifications") {
    if (isNaN(index) || index < 1 || index > certifications.length) {
      ctx.appendLine({ text: `open: invalid certification index.`, type: "error" });
      return;
    }
    const cert = certifications[index - 1];
    ctx.navigateTo(`/certifications#${cert.badge}`);
    ctx.appendLine({ text: `Navigating to "${cert.name}"...`, type: "success" });
    return;
  }

  if (type === "blog" || type === "post") {
    if (isNaN(index) || index < 1 || index > blogPosts.length) {
      ctx.appendLine({ text: `open: invalid blog post index.`, type: "error" });
      return;
    }
    const post = blogPosts[index - 1];
    ctx.navigateTo(`/blog/${post.slug}`);
    ctx.appendLine({ text: `Opening "${post.title}"...`, type: "success" });
    return;
  }

  ctx.appendLine({ text: `open: unknown type '${type}'. Use: project, cert, blog`, type: "error" });
}

function executeProjects(ctx: CommandContext) {
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  ╭─ Portfolio Projects ─────────────────────────╮", type: "system" });
  ctx.appendLine({ text: "", type: "output" });
  projects.forEach((p, i) => {
    ctx.appendLine({ text: `  ${(i + 1).toString().padEnd(3)}${p.title}`, type: "output" });
    ctx.appendLine({ text: `      ${p.description}`, type: "output" });
    ctx.appendLine({ text: `      Tags: ${p.tags.slice(0, 3).join(", ")}`, type: "info" });
    ctx.appendLine({ text: "", type: "output" });
  });
  ctx.appendLine({ text: "  Usage: open project <number>", type: "info" });
  ctx.appendLine({ text: "", type: "output" });
}

function executeSkills(ctx: CommandContext) {
  const categories = [...new Set(skills.map((s) => s.category))];
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  ╭─ Skills & Expertise ─────────────────────────╮", type: "system" });
  ctx.appendLine({ text: "", type: "output" });

  for (const cat of categories) {
    const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
    ctx.appendLine({ text: `  ${catLabel}`, type: "system" });
    const catSkills = skills.filter((s) => s.category === cat);
    for (const s of catSkills) {
      const bar = "█".repeat(Math.floor(s.level / 10)) + "░".repeat(10 - Math.floor(s.level / 10));
      ctx.appendLine({ text: `    ${s.name.padEnd(24)}${bar} ${s.level}%`, type: "output" });
    }
    ctx.appendLine({ text: "", type: "output" });
  }
}

function executeCertifications(ctx: CommandContext) {
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  ╭─ Certifications ─────────────────────────────╮", type: "system" });
  ctx.appendLine({ text: "", type: "output" });
  certifications.forEach((c, i) => {
    ctx.appendLine({ text: `  ${(i + 1).toString().padEnd(3)}${c.name}`, type: "output" });
    ctx.appendLine({ text: `      Issuer: ${c.issuer}  |  ${c.date}  |  ${c.credentialId}`, type: "output" });
    ctx.appendLine({ text: "", type: "output" });
  });
  ctx.appendLine({ text: "  Usage: open cert <number>", type: "info" });
  ctx.appendLine({ text: "", type: "output" });
}

function executeResume(ctx: CommandContext) {
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  ╭─ Professional Resume ────────────────────────╮", type: "system" });
  ctx.appendLine({ text: "", type: "output" });

  ctx.appendLine({ text: "  Professional Summary", type: "system" });
  ctx.appendLine({ text: "  Senior Security Engineer with expertise in penetration testing,", type: "output" });
  ctx.appendLine({ text: "  incident response, and security architecture. Passionate about", type: "output" });
  ctx.appendLine({ text: "  offensive security, AI-driven threat detection, and building", type: "output" });
  ctx.appendLine({ text: "  resilient security systems.", type: "output" });
  ctx.appendLine({ text: "", type: "output" });

  ctx.appendLine({ text: "  Education", type: "system" });
  const edu = experiences.filter((e) => e.type === "education");
  for (const e of edu) {
    ctx.appendLine({ text: `  ${e.role} — ${e.company} (${e.period})`, type: "output" });
  }
  ctx.appendLine({ text: "", type: "output" });

  ctx.appendLine({ text: "  Experience", type: "system" });
  const work = experiences.filter((e) => e.type === "work");
  for (const e of work) {
    ctx.appendLine({ text: `  ${e.role} @ ${e.company} (${e.period})`, type: "output" });
    for (const h of e.highlights.slice(0, 2)) {
      ctx.appendLine({ text: `    → ${h}`, type: "output" });
    }
  }
  ctx.appendLine({ text: "", type: "output" });

  ctx.appendLine({ text: "  Commands:", type: "info" });
  ctx.appendLine({ text: "    download resume  — Download PDF", type: "output" });
  ctx.appendLine({ text: "", type: "output" });
}

function executeContact(ctx: CommandContext) {
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  ╭─ Contact ───────────────────────────────────╮", type: "system" });
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: `  ${"Email".padEnd(16)}maanas@cybernexus.io`, type: "output" });
  ctx.appendLine({ text: `  ${"GitHub".padEnd(16)}github.com/maanas`, type: "output" });
  ctx.appendLine({ text: `  ${"LinkedIn".padEnd(16)}linkedin.com/in/maanas`, type: "output" });
  ctx.appendLine({ text: `  ${"Portfolio".padEnd(16)}cybernexus.io`, type: "output" });
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  Commands:", type: "info" });
  ctx.appendLine({ text: "    email     — Open email client", type: "output" });
  ctx.appendLine({ text: "    github    — Open GitHub profile", type: "output" });
  ctx.appendLine({ text: "    linkedin  — Open LinkedIn profile", type: "output" });
  ctx.appendLine({ text: "", type: "output" });
}

function executeBlog(ctx: CommandContext) {
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  ╭─ Latest Write-ups ───────────────────────────╮", type: "system" });
  ctx.appendLine({ text: "", type: "output" });
  blogPosts.forEach((p, i) => {
    ctx.appendLine({ text: `  ${(i + 1).toString().padEnd(3)}${p.title}`, type: "output" });
    ctx.appendLine({ text: `      ${p.date}  ·  ${p.readTime}  ·  ${p.tags.slice(0, 2).join(", ")}`, type: "output" });
    ctx.appendLine({ text: "", type: "output" });
  });
  ctx.appendLine({ text: "  Usage: open blog <number>", type: "info" });
  ctx.appendLine({ text: "", type: "output" });
}

function executeDashboard(ctx: CommandContext) {
  ctx.navigateTo("/dashboard");
  ctx.appendLine({ text: "Opening SOC Dashboard...", type: "success" });
}

function executeSearch(ctx: CommandContext, args: string[]) {
  const query = args.join(" ").toLowerCase();
  if (!query) {
    ctx.appendLine({ text: "search: missing query. Usage: search <term>", type: "error" });
    return;
  }

  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: `  Searching for "${query}"...`, type: "system" });
  ctx.appendLine({ text: "", type: "output" });

  let found = false;

  const projResults = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query)),
  );
  if (projResults.length > 0) {
    ctx.appendLine({ text: "  Projects", type: "info" });
    projResults.forEach((p) => ctx.appendLine({ text: `    → ${p.title}`, type: "output" }));
    ctx.appendLine({ text: "", type: "output" });
    found = true;
  }

  const skillResults = skills.filter(
    (s) => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query),
  );
  if (skillResults.length > 0) {
    ctx.appendLine({ text: "  Skills", type: "info" });
    skillResults.forEach((s) => ctx.appendLine({ text: `    → ${s.name} (${s.level}%)`, type: "output" }));
    ctx.appendLine({ text: "", type: "output" });
    found = true;
  }

  const certResults = certifications.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.issuer.toLowerCase().includes(query) ||
      c.skills.some((sk) => sk.toLowerCase().includes(query)),
  );
  if (certResults.length > 0) {
    ctx.appendLine({ text: "  Certifications", type: "info" });
    certResults.forEach((c) => ctx.appendLine({ text: `    → ${c.name}`, type: "output" }));
    ctx.appendLine({ text: "", type: "output" });
    found = true;
  }

  const blogResults = blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query)),
  );
  if (blogResults.length > 0) {
    ctx.appendLine({ text: "  Blog Posts", type: "info" });
    blogResults.forEach((p) => ctx.appendLine({ text: `    → ${p.title}`, type: "output" }));
    ctx.appendLine({ text: "", type: "output" });
    found = true;
  }

  if (!found) {
    ctx.appendLine({ text: "  No results found.", type: "output" });
  }

  ctx.appendLine({ text: "  Tip: use 'open project <n>' or 'open blog <n>' to navigate", type: "info" });
  ctx.appendLine({ text: "", type: "output" });
}

function executeTheme(ctx: CommandContext, args: string[]) {
  if (!args[0]) {
    ctx.appendLine({ text: "Available themes: glass, dark, matrix, soc", type: "output" });
    ctx.appendLine({ text: "Usage: theme <name>", type: "info" });
    return;
  }
  const name = args[0].toLowerCase();
  if (!terminalThemes[name]) {
    ctx.appendLine({ text: `theme: '${name}' not found. Available: ${Object.keys(terminalThemes).join(", ")}`, type: "error" });
    return;
  }
  ctx.setTheme(name);
  ctx.appendLine({ text: `Theme changed to '${name}'.`, type: "success" });
}

function executeAi(ctx: CommandContext) {
  ctx.openAiAssistant();
  ctx.appendLine({ text: "Launching Cyber AI assistant...", type: "success" });
}

function executeAsk(ctx: CommandContext, args: string[]) {
  const question = args.join(" ").replace(/^["']|["']$/g, "");
  if (!question) {
    ctx.appendLine({ text: "ask: missing question. Usage: ask \"your question\"", type: "error" });
    return;
  }
  ctx.openAiAssistant();
  ctx.appendLine({ text: `Sent to Cyber AI: "${question}"`, type: "success" });
}

function executeSummarize(ctx: CommandContext, args: string[]) {
  if (!args[0]) {
    ctx.appendLine({ text: "summarize: missing project identifier. Usage: summarize <project number>", type: "error" });
    return;
  }
  const index = parseInt(args[0], 10);
  if (isNaN(index) || index < 1 || index > projects.length) {
    ctx.appendLine({ text: `summarize: invalid project index.`, type: "error" });
    return;
  }
  const proj = projects[index - 1];
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: `  🤖 AI Summary: ${proj.title}`, type: "system" });
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: `  ${proj.longDescription}`, type: "output" });
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  Key Metrics:", type: "info" });
  for (const m of proj.metrics) {
    ctx.appendLine({ text: `    ${m.label}: ${m.value}`, type: "output" });
  }
  ctx.appendLine({ text: "", type: "output" });
  ctx.appendLine({ text: "  Technologies:", type: "info" });
  ctx.appendLine({ text: `    ${proj.tags.join(", ")}`, type: "output" });
  ctx.appendLine({ text: "", type: "output" });
}

function executeMatrix(ctx: CommandContext) {
  ctx.toggleMatrix();
  ctx.appendLine({ text: "Matrix mode toggled.", type: "system" });
}

function executeRecruiter(ctx: CommandContext) {
  ctx.toggleRecruiterMode();
  ctx.appendLine({ text: "Recruiter mode toggled.", type: "system" });
}

function executeVersion(ctx: CommandContext) {
  ctx.appendLine({ text: "CyberShell v1.0 — Portfolio v2.0.0", type: "output" });
  ctx.appendLine({ text: "Runtime: Cyber Nexus Liquid Glass Engine", type: "output" });
}

function executeDate(ctx: CommandContext) {
  ctx.appendLine({ text: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }), type: "output" });
}

function executeTime(ctx: CommandContext) {
  ctx.appendLine({ text: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" }), type: "output" });
}

function executeHistory(ctx: CommandContext) {
  ctx.appendLine({ text: "Command history available via ↑/↓ arrows.", type: "output" });
}

function executeDownload(ctx: CommandContext, args: string[]) {
  if (args[0] === "resume") {
    ctx.downloadResume();
    ctx.appendLine({ text: "Downloading resume...", type: "success" });
  } else {
    ctx.appendLine({ text: "Usage: download resume", type: "info" });
  }
}

function executeWidgets(ctx: CommandContext) {
  ctx.appendLine({ text: "Widget feature coming soon.", type: "output" });
}

function executeEcho(ctx: CommandContext, args: string[]) {
  ctx.appendLine({ text: args.join(" "), type: "output" });
}

type CommandHandler = (ctx: CommandContext, args: string[]) => void;

const commandHandlers: Record<string, CommandHandler> = {
  help: (ctx) => executeHelp(ctx),
  clear: (ctx) => ctx.clearLines(),
  cls: (ctx) => ctx.clearLines(),
  whoami: (ctx) => executeWhoami(ctx),
  pwd: (ctx) => ctx.appendLine({ text: ctx.currentDir, type: "output" }),
  ls: (ctx) => executeLs(ctx),
  cd: (ctx, args) => executeCd(ctx, args),
  cat: (ctx, args) => executeCat(ctx, args),
  open: (ctx, args) => executeOpen(ctx, args),
  tree: (ctx) => executeTree(ctx),
  projects: (ctx) => executeProjects(ctx),
  skills: (ctx) => executeSkills(ctx),
  certifications: (ctx) => executeCertifications(ctx),
  resume: (ctx) => executeResume(ctx),
  contact: (ctx) => executeContact(ctx),
  blog: (ctx) => executeBlog(ctx),
  dashboard: (ctx) => executeDashboard(ctx),
  search: (ctx, args) => executeSearch(ctx, args),
  theme: (ctx, args) => executeTheme(ctx, args),
  themes: (ctx, args) => executeTheme(ctx, args),
  ai: (ctx) => executeAi(ctx),
  ask: (ctx, args) => executeAsk(ctx, args),
  summarize: (ctx, args) => executeSummarize(ctx, args),
  matrix: (ctx) => executeMatrix(ctx),
  recruiter: (ctx) => executeRecruiter(ctx),
  version: (ctx) => executeVersion(ctx),
  ver: (ctx) => executeVersion(ctx),
  date: (ctx) => executeDate(ctx),
  time: (ctx) => executeTime(ctx),
  history: (ctx) => executeHistory(ctx),
  download: (ctx, args) => executeDownload(ctx, args),
  widgets: (ctx) => executeWidgets(ctx),
  email: (ctx) => { ctx.openExternal("mailto:maanas@cybernexus.io"); ctx.appendLine({ text: "Opening email client...", type: "success" }); },
  github: (ctx) => { ctx.openExternal("https://github.com/maanas"); ctx.appendLine({ text: "Opening GitHub profile...", type: "success" }); },
  linkedin: (ctx) => { ctx.openExternal("https://linkedin.com/in/maanas"); ctx.appendLine({ text: "Opening LinkedIn profile...", type: "success" }); },
  echo: (ctx, args) => executeEcho(ctx, args),
  exit: (ctx) => ctx.closeTerminal(),
  quit: (ctx) => ctx.closeTerminal(),
  sudo: (ctx, args) => {
    const full = "sudo " + args.join(" ");
    if (SECRET_COMMANDS[full]) {
      SECRET_COMMANDS[full](ctx);
    } else {
      ctx.appendLine({ text: "Permission denied. Nice try.", type: "error" });
    }
  },
  about: (ctx) => SECRET_COMMANDS.about(ctx),
  unlock: (ctx, args) => {
    const full = "unlock " + args.join(" ");
    if (SECRET_COMMANDS[full]) {
      SECRET_COMMANDS[full](ctx);
    } else {
      ctx.appendLine({ text: "Nothing to unlock.", type: "output" });
    }
  },
};

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

function findClosestCommand(input: string): string | null {
  const names = getBuiltinCommands().map((c) => c.name);
  let best: string | null = null;
  let bestDist = Infinity;
  for (const name of names) {
    const dist = levenshtein(input, name);
    if (dist < bestDist && dist <= 3) {
      bestDist = dist;
      best = name;
    }
  }
  return best;
}

export function executeCommand(input: string, ctx: CommandContext) {
  const trimmed = input.trim();
  if (!trimmed) return;

  ctx.addToHistory(trimmed);
  ctx.appendLine({ text: `${getTheme(ctx.theme).prompt}@cybernexus:${ctx.currentDir}$ ${trimmed}`, type: "input" });

  const lower = trimmed.toLowerCase();

  for (const [phrase, handler] of Object.entries(SECRET_COMMANDS)) {
    if (lower === phrase) {
      handler(ctx);
      return;
    }
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  const handler = commandHandlers[command];
  if (handler) {
    handler(ctx, args);
    return;
  }

  if (command === "sudo" && args[0] === "apt") {
    ctx.appendLine({ text: "This is not a Debian system. Use 'help' for available commands.", type: "error" });
    return;
  }

  const suggestion = findClosestCommand(command);
  if (suggestion) {
    ctx.appendLine({ text: `Command not found: '${command}'. Did you mean '${suggestion}'?`, type: "error" });
  } else {
    ctx.appendLine({ text: `Command not found: '${command}'. Type 'help' to view available commands.`, type: "error" });
  }
}
