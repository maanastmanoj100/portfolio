/**
 * Terminal command interpreter.
 *
 * This is deliberately not a shell. Input is split into a command name and
 * plain-text arguments, matched against a fixed allowlist, and turned into
 * output lines plus (optionally) one UI action. Nothing is evaluated, executed,
 * passed to a function constructor or sent to a server.
 */

import { normalizeCveId } from "./cve";

export interface TerminalProfile {
  name: string;
  role: string;
  email: string;
  github: string;
  intro: string;
  focus: string[];
}

export interface TerminalProject {
  name: string;
  tagline: string;
  repoUrl: string;
  liveUrl?: string;
  stack: string[];
}

export interface TerminalSkillGroup {
  label: string;
  items: string[];
}

export interface TerminalData {
  profile: TerminalProfile;
  projects: TerminalProject[];
  skills: TerminalSkillGroup[];
}

export type TerminalOutputKind = "text" | "muted" | "error" | "success" | "link";

export interface TerminalOutput {
  kind: TerminalOutputKind;
  text: string;
  href?: string;
}

export type TerminalAction =
  | { type: "clear" }
  | { type: "close" }
  | { type: "open-cve"; id: string }
  | { type: "open-url"; url: string };

export interface TerminalResult {
  outputs: TerminalOutput[];
  action?: TerminalAction;
}

export interface ParsedCommand {
  name: string;
  args: string[];
}

export const TERMINAL_MAX_INPUT = 200;

export const TERMINAL_COMMANDS: { name: string; usage: string; description: string }[] = [
  { name: "help", usage: "help", description: "List the available commands." },
  { name: "about", usage: "about", description: "Show the portfolio introduction." },
  { name: "projects", usage: "projects [search]", description: "List projects, optionally filtered by text." },
  { name: "skills", usage: "skills", description: "Show the skills listed on this site." },
  { name: "contact", usage: "contact", description: "Show the email address and GitHub profile." },
  { name: "github", usage: "github", description: "Open the GitHub profile in a new tab." },
  { name: "date", usage: "date", description: "Show the current local date and time." },
  { name: "cve", usage: "cve CVE-YYYY-NNNN", description: "Open the CVE lookup, optionally with an identifier." },
  { name: "clear", usage: "clear", description: "Clear the terminal output." },
  { name: "exit", usage: "exit", description: "Close the terminal." },
];

const ALLOWED = new Set(TERMINAL_COMMANDS.map((command) => command.name));

/**
 * Split input into a lowercased command name and whitespace-separated
 * arguments. Returns null for empty input or when the input is too long.
 */
export function parseCommand(input: string): ParsedCommand | null {
  const trimmed = input.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  if (!trimmed || trimmed.length > TERMINAL_MAX_INPUT) return null;
  const [name, ...args] = trimmed.split(/\s+/);
  return { name: name.toLowerCase(), args };
}

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function helpOutput(): TerminalOutput[] {
  return [
    { kind: "muted", text: "Available commands:" },
    ...TERMINAL_COMMANDS.map((command) => ({
      kind: "text" as const,
      text: `${command.usage.padEnd(22)} ${command.description}`,
    })),
    {
      kind: "muted",
      text: "Input is handled locally in this page. It is not a shell and never runs system commands.",
    },
  ];
}

function aboutOutput(data: TerminalData): TerminalOutput[] {
  return [
    { kind: "success", text: `${data.profile.name} — ${data.profile.role}` },
    { kind: "text", text: data.profile.intro },
    {
      kind: "muted",
      text: `Focus: ${data.profile.focus.join(" · ")}`,
    },
  ];
}

function projectsOutput(data: TerminalData, args: string[]): TerminalOutput[] {
  const query = normalize(args.join(" "));
  const matches = query
    ? data.projects.filter((project) =>
        normalize(
          [project.name, project.tagline, ...project.stack].join(" "),
        ).includes(query),
      )
    : data.projects;

  if (matches.length === 0) {
    return [
      {
        kind: "error",
        text: `No project matches "${args.join(" ")}". Run "projects" to see everything.`,
      },
    ];
  }

  return [
    { kind: "muted", text: `${matches.length} ${matches.length === 1 ? "project" : "projects"}:` },
    ...matches.map((project) => ({
      kind: "link" as const,
      text: `${project.name} — ${project.tagline}`,
      href: project.repoUrl,
    })),
    { kind: "muted", text: "Links open the source repository on GitHub." },
  ];
}

function skillsOutput(data: TerminalData): TerminalOutput[] {
  return [
    { kind: "muted", text: "Skills listed on this site:" },
    ...data.skills.map((group) => ({
      kind: "text" as const,
      text: `${group.label}: ${group.items.join(", ")}`,
    })),
  ];
}

function contactOutput(data: TerminalData): TerminalOutput[] {
  return [
    { kind: "text", text: "Email:" },
    { kind: "link", text: data.profile.email, href: `mailto:${data.profile.email}` },
    { kind: "text", text: "GitHub:" },
    { kind: "link", text: data.profile.github, href: data.profile.github },
    {
      kind: "muted",
      text: "Please don't send secrets or credentials in a first message.",
    },
  ];
}

function githubHandle(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.hostname !== "github.com") return null;
    const handle = parsed.pathname.replace(/^\/+|\/+$/g, "");
    return /^[A-Za-z0-9-]{1,39}$/.test(handle) ? handle : null;
  } catch {
    return null;
  }
}

function dateOutput(now: number): TerminalOutput[] {
  const date = new Date(now);
  if (Number.isNaN(date.getTime())) {
    return [{ kind: "error", text: "The local clock is unavailable." }];
  }
  return [
    { kind: "text", text: date.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" }) },
    { kind: "muted", text: "Reported by this browser, not by a server." },
  ];
}

export function executeCommand(
  input: string,
  data: TerminalData,
  now: number = Date.now(),
): TerminalResult {
  const parsed = parseCommand(input);
  if (!parsed) {
    return {
      outputs: [
        {
          kind: "error",
          text: `Enter a command of up to ${TERMINAL_MAX_INPUT} characters. Run "help" for the list.`,
        },
      ],
    };
  }

  const { name, args } = parsed;
  if (!ALLOWED.has(name)) {
    return {
      outputs: [
        {
          kind: "error",
          text: `Unknown command: ${name}. Run "help" to see the available commands.`,
        },
      ],
    };
  }

  switch (name) {
    case "help":
      return { outputs: helpOutput() };
    case "about":
      return { outputs: aboutOutput(data) };
    case "projects":
      return { outputs: projectsOutput(data, args) };
    case "skills":
      return { outputs: skillsOutput(data) };
    case "contact":
      return { outputs: contactOutput(data) };
    case "github": {
      const handle = githubHandle(data.profile.github);
      if (!handle) {
        return {
          outputs: [{ kind: "error", text: "No valid GitHub profile is configured." }],
        };
      }
      return {
        outputs: [{ kind: "text", text: `Opening github.com/${handle} in a new tab.` }],
        action: { type: "open-url", url: `https://github.com/${handle}` },
      };
    }
    case "date":
      return { outputs: dateOutput(now) };
    case "cve": {
      if (args.length === 0) {
        return {
          outputs: [
            { kind: "text", text: "Opening the CVE lookup." },
            { kind: "muted", text: "Data is read from the NIST National Vulnerability Database." },
          ],
          action: { type: "open-cve", id: "" },
        };
      }
      const id = normalizeCveId(args[0]);
      if (!id) {
        return {
          outputs: [
            {
              kind: "error",
              text: `"${args[0]}" is not a valid CVE identifier. Use the form CVE-YYYY-NNNN.`,
            },
          ],
        };
      }
      return {
        outputs: [{ kind: "text", text: `Looking up ${id} in the NIST NVD.` }],
        action: { type: "open-cve", id },
      };
    }
    case "clear":
      return { outputs: [], action: { type: "clear" } };
    case "exit":
      return {
        outputs: [{ kind: "muted", text: "Closing the terminal." }],
        action: { type: "close" },
      };
    default:
      return {
        outputs: [{ kind: "error", text: "Unknown command. Run \"help\"." }],
      };
  }
}
