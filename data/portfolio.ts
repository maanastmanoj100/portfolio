/**
 * Real portfolio content for the primary surfaces of the site.
 *
 * Everything here is taken from Maanas' public GitHub account
 * (github.com/maanastmanoj100) — repository names, languages, frameworks and
 * descriptions — plus the deployments that were verified reachable (HTTP 200)
 * at the time of writing. Nothing is invented: employers, certifications,
 * statistics and "years of experience" claims are deliberately absent rather
 * than guessed.
 *
 * Two intentional hooks are left for personal details we could not verify:
 *   1. `profile.name` / `profile.role` — derived from the GitHub handle and the
 *      kind of work in the repositories. Replace with the real values if needed.
 *   2. `profile.resumeUrl` — empty on purpose. Set it to a real CV URL and the
 *      "Resume" buttons appear automatically across the site.
 *
 * The legacy module pages (arcade, cyber-os, recruiter, …) still read the older
 * `data/projects.ts` etc. This file is the source of truth for the current
 * Home / Projects / About / Contact experiences only.
 */

export interface PortfolioProject {
  slug: string;
  name: string;
  /** One-line purpose, shown on cards. */
  tagline: string;
  /** A short, factual paragraph for the detail page. */
  summary: string;
  /** What it does, taken from the repository README/features. */
  highlights: string[];
  stack: string[];
  repoUrl: string;
  /** Only present when the live deployment was verified reachable. */
  liveUrl?: string;
  /** Repository creation date, from the GitHub API (YYYY-MM-DD). */
  created: string;
  /** `live` = playable demo, `source` = repository only. */
  status: "live" | "source";
}

export interface TimelineEntry {
  /** YYYY-MM */
  date: string;
  title: string;
  detail: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const profile = {
  /** Derived from the GitHub handle @maanastmanoj100 — replace if desired. */
  name: "Maanas",
  role: "Cybersecurity & Full-Stack Developer",
  email: "maanastmanoj100@gmail.com",
  github: "https://github.com/maanastmanoj100",
  /** Empty on purpose — see the file header. */
  resumeUrl: "" as string,
  intro:
    "I design and build security-focused web applications and interactive labs. My work spans a full-stack SOC dashboard simulator, browser escape rooms that teach cryptography and network defence, and a CTF event built around real evidence hunting.",
  metaDescription:
    "Cybersecurity and full-stack developer. Security tooling, escape rooms and full-stack web apps — built with Next.js, React, TypeScript, Python and Docker.",
  focus: ["Security tooling", "Full-stack web apps", "CTF & puzzle design"],
  /** Date the links and facts above were last checked. */
  lastVerified: "2026-10-25",
};

/**
 * The strongest four projects, shown on the home page and first on /projects.
 * Ordered by how well they demonstrate range (backend, frontend, security,
 * interactive design).
 */
export const featuredProjects: PortfolioProject[] = [
  {
    slug: "cyber-range-soc-lite",
    name: "Cyber Range SOC Lite",
    tagline: "A SOC dashboard simulator that generates and triages security alerts.",
    summary:
      "A beginner-friendly Security Operations Center dashboard simulator built with FastAPI, React (Vite), SQLite and Docker. The backend exposes alert CRUD, attack-simulation and dashboard-summary endpoints; the frontend renders summary stat cards and a live alert list.",
    highlights: [
      "REST API for alerts, simulated attacks and dashboard summaries",
      "SQLAlchemy models persisted to SQLite",
      "Separate attack-simulator and detection-engine services",
      "Containerised backend services for reproducible setup",
      "React dashboard with summary cards and an alert list",
    ],
    stack: ["Python", "FastAPI", "React", "Vite", "SQLite", "Docker", "Tailwind CSS"],
    repoUrl: "https://github.com/maanastmanoj100/Cyber-Range-SOC-Lite",
    liveUrl: "https://cyber-range-soc-lite.vercel.app",
    created: "2026-07-01",
    status: "live",
  },
  {
    slug: "save-mahabali",
    name: "Save Mahabali",
    tagline: "An Onam-themed browser escape room with ten puzzle rooms.",
    summary:
      "A free, browser-based escape room adventure. Players travel through ten story-driven puzzle rooms, recover nine sacred relics and rescue King Mahabali. Built with Next.js 14 (App Router), TypeScript and Tailwind CSS.",
    highlights: [
      "Ten story-driven puzzle rooms — word, memory, matching, ordering and a Caesar cipher",
      "Journey timer that pauses on tab blur and persists across reloads",
      "Save & resume progress via localStorage",
      "Firebase Firestore leaderboard with a zero-config localStorage fallback",
      "Printable certificate, keyboard navigation and prefers-reduced-motion support",
    ],
    stack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Firebase", "Web Audio"],
    repoUrl: "https://github.com/maanastmanoj100/Save_Maveli",
    liveUrl: "https://save-maveli.vercel.app",
    created: "2026-08-04",
    status: "live",
  },
  {
    slug: "midnight-breach",
    name: "Operation: Midnight Breach",
    tagline: "A cinematic CTF murder mystery with evidence-based flag submission.",
    summary:
      "A CTF murder-mystery event built with React, Tailwind CSS and Firebase. A mock Express backend validates flags and hint requests, and the story is told through planted evidence artefacts such as access logs, a Morse-code audio clip and a phishing email.",
    highlights: [
      "React (Vite) frontend with Tailwind CSS v4",
      "Express mock backend for flag validation, hints and team state",
      "Firestore security rules and Firebase Functions deployment path",
      "Investigation evidence: access logs, Morse audio, phishing email, chat logs",
      "Guest play mode so the event can be tried without an account",
    ],
    stack: ["React", "Vite", "Tailwind CSS v4", "Node.js / Express", "Firebase"],
    repoUrl: "https://github.com/maanastmanoj100/MidnightBreach",
    liveUrl: "https://midnight-breach-test.vercel.app",
    created: "2026-06-12",
    status: "live",
  },
  {
    slug: "the-netherworld-trap",
    name: "The Netherworld Trap",
    tagline: "A Kerala-inspired dark-fantasy escape room with cinematic cutscenes.",
    summary:
      "A dark-fantasy escape room in which the player guides Maveli out of the Netherworld. The experience is built around a cinematic cutscene system and a set of puzzle mechanics, all in TypeScript with React and Tailwind CSS.",
    highlights: [
      "Cinematic scene system (camera rig, lighting overlays, particle canvas, title cards)",
      "Achievements, a curse meter and a dialogue system",
      "Fantasy inventory, in-game clock and HUD",
      "Room entrances with bespoke artwork",
      "Documented architecture (ARCHITECTURE.md)",
    ],
    stack: ["TypeScript", "React", "Vite", "Tailwind CSS"],
    repoUrl: "https://github.com/maanastmanoj100/Pathallam_escape",
    liveUrl: "https://pathallam-escape.vercel.app",
    created: "2026-08-01",
    status: "live",
  },
];

/**
 * Smaller repositories and experiments. Only links that resolve are included:
 * repositories whose deployments returned 404/500 are listed as source-only.
 */
export const otherProjects: PortfolioProject[] = [
  {
    slug: "save-mahabali-v4",
    name: "Save Mahabali V4",
    tagline: "An earlier build of the Onam escape-room adventure.",
    summary:
      "A prior iteration of Save Mahabali: solve rooms, gather relics and beat the clock. Kept public as a record of how the game evolved.",
    highlights: [],
    stack: ["TypeScript", "Next.js", "Tailwind CSS"],
    repoUrl: "https://github.com/maanastmanoj100/Save_Maveli_V4",
    liveUrl: "https://savemaveliv4.vercel.app",
    created: "2026-08-28",
    status: "live",
  },
  {
    slug: "mock-phishing",
    name: "Mock Phishing",
    tagline: "A phishing-simulation page for security-awareness training.",
    summary:
      "A static phishing page used to demonstrate what a credential-harvesting attempt looks like, built for awareness training rather than real collection.",
    highlights: [],
    stack: ["HTML", "CSS"],
    repoUrl: "https://github.com/maanastmanoj100/mock_phishing",
    created: "2026-10-16",
    status: "source",
  },
  {
    slug: "crypto-lab",
    name: "CryptoLab",
    tagline: "A cryptography playground for experimenting with ciphers.",
    summary:
      "A TypeScript web app for exploring classical and modern cryptography concepts interactively.",
    highlights: [],
    stack: ["TypeScript"],
    repoUrl: "https://github.com/maanastmanoj100/CryptoLab",
    created: "2026-07-23",
    status: "source",
  },
  {
    slug: "caesar-cipher",
    name: "Caesar Cipher",
    tagline: "A small Python implementation of the Caesar cipher.",
    summary:
      "A focused Python utility for encoding and decoding Caesar-shift messages, published under AGPL-3.0.",
    highlights: [],
    stack: ["Python"],
    repoUrl: "https://github.com/maanastmanoj100/CaesarCipher",
    created: "2026-07-12",
    status: "source",
  },
  {
    slug: "password-strength-analyser",
    name: "Password Strength Analyser",
    tagline: "A browser tool that scores password strength in plain JavaScript.",
    summary:
      "A dependency-free web page that estimates password strength directly in the browser.",
    highlights: [],
    stack: ["HTML", "CSS", "JavaScript"],
    repoUrl: "https://github.com/maanastmanoj100/Password_Strength_Analyser",
    created: "2026-06-28",
    status: "source",
  },
  {
    slug: "cyber-nexus",
    name: "Cyber Nexus (this site)",
    tagline: "The Next.js portfolio you are reading, including its interactive modules.",
    summary:
      "A TypeScript Next.js portfolio with a security-module playground, an arcade of small security games and a component-driven glass interface.",
    highlights: [],
    stack: ["TypeScript", "Next.js", "Tailwind CSS"],
    repoUrl: "https://github.com/maanastmanoj100/portfolio",
    liveUrl: "https://portfolio-alpha-five-y41jiu443a.vercel.app",
    created: "2026-07-06",
    status: "live",
  },
];

/** Skills inferred directly from the languages and stacks used in the repos above. */
export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "HTML", "CSS"],
  },
  {
    label: "Frameworks & libraries",
    items: ["Next.js", "React", "Vite", "Tailwind CSS", "FastAPI"],
  },
  {
    label: "Data, tooling & platforms",
    items: ["Docker", "SQLite", "Firebase / Firestore", "Git & GitHub", "Vercel"],
  },
];

/** Milestones drawn from real repository creation dates. */
export const timeline: TimelineEntry[] = [
  {
    date: "2026-06",
    title: "Password Strength Analyser",
    detail: "A dependency-free browser tool for estimating password strength.",
  },
  {
    date: "2026-06",
    title: "Operation: Midnight Breach",
    detail: "A cinematic CTF murder-mystery event built with React, Tailwind and Firebase.",
  },
  {
    date: "2026-07",
    title: "Cyber Range SOC Lite",
    detail: "A full-stack SOC dashboard simulator with FastAPI, React, SQLite and Docker.",
  },
  {
    date: "2026-07",
    title: "Cyber Nexus portfolio",
    detail: "This Next.js portfolio, including its interactive security modules and arcade.",
  },
  {
    date: "2026-07",
    title: "Caesar Cipher & CryptoLab",
    detail: "Two cryptography experiments — one in Python, one in TypeScript.",
  },
  {
    date: "2026-08",
    title: "The Netherworld Trap",
    detail: "A Kerala-inspired dark-fantasy escape room with a cinematic cutscene system.",
  },
  {
    date: "2026-08",
    title: "Save Mahabali",
    detail: "A ten-room Onam escape room in Next.js 14 with a Firebase leaderboard.",
  },
  {
    date: "2026-10",
    title: "Mock Phishing",
    detail: "A phishing-simulation page for security-awareness training.",
  },
];

/**
 * No public certifications to display yet. Add real entries here and the About
 * page will render them; leaving the array empty keeps the site honest rather
 * than listing credentials that cannot be verified.
 */
export const certifications: { name: string; issuer: string; date: string }[] = [];
