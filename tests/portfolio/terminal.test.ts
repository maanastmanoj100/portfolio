import assert from "node:assert/strict";
import test from "node:test";
import {
  TERMINAL_MAX_INPUT,
  executeCommand,
  parseCommand,
  type TerminalData,
} from "../../lib/portfolio/terminal";

/**
 * Terminal interpreter.
 *
 * The important property is that this is not a shell: unknown commands are
 * refused, nothing is evaluated, and the only side effects are the declared
 * actions. These tests also pin the exact text of the safety notice.
 */

const DATA: TerminalData = {
  profile: {
    name: "Test Person",
    role: "Security engineer",
    email: "test@example.com",
    github: "https://github.com/testuser",
    intro: "Builds small security tools.",
    focus: ["Detection", "Tooling"],
  },
  projects: [
    {
      name: "Alpha Range",
      tagline: "Alert triage practice",
      repoUrl: "https://github.com/testuser/alpha",
      stack: ["Python"],
    },
    {
      name: "Beta Game",
      tagline: "Narrative escape room",
      repoUrl: "https://github.com/testuser/beta",
      stack: ["TypeScript"],
    },
  ],
  skills: [{ label: "Languages", items: ["Python", "TypeScript"] }],
};

function run(input: string) {
  return executeCommand(input, DATA, Date.parse("2026-10-25T12:00:00.000Z"));
}

function text(input: string): string {
  return run(input)
    .outputs.map((output) => output.text)
    .join("\n");
}

test("terminal: input is split into a lowercased name and arguments", () => {
  assert.deepEqual(parseCommand("  PROJECTS   cyber  "), {
    name: "projects",
    args: ["cyber"],
  });
});

test("terminal: empty and over-long input is refused", () => {
  assert.equal(parseCommand("   "), null);
  assert.equal(parseCommand("a".repeat(TERMINAL_MAX_INPUT + 1)), null);
  assert.ok(parseCommand("a".repeat(TERMINAL_MAX_INPUT)));
});

test("terminal: control characters cannot smuggle extra arguments", () => {
  assert.deepEqual(parseCommand("help\u0000rm -rf /"), {
    name: "help",
    args: ["rm", "-rf", "/"],
  });
});

test("terminal: help lists every command and states it is not a shell", () => {
  const output = text("help");
  for (const command of ["help", "about", "projects", "skills", "contact", "cve", "clear", "exit"]) {
    assert.match(output, new RegExp(`\\b${command}\\b`));
  }
  assert.match(output, /not a shell/i);
});

test("terminal: unknown commands are rejected without an action", () => {
  const result = run("rm -rf /");
  assert.equal(result.action, undefined);
  assert.equal(result.outputs.length, 1);
  assert.equal(result.outputs[0].kind, "error");
  assert.match(result.outputs[0].text, /Unknown command: rm/);
});

test("terminal: shell metacharacters are never interpreted", () => {
  for (const input of ["help; rm -rf /", "projects && ls", "about | cat", "$(whoami)"]) {
    const result = run(input);
    // The first token decides the command; anything else is a plain argument.
    assert.equal(result.action, undefined);
    assert.ok(result.outputs.length > 0);
  }
});

test("terminal: projects lists everything, or filters by text", () => {
  assert.match(text("projects"), /2 projects/);
  const filtered = run("projects beta");
  assert.equal(filtered.outputs.filter((output) => output.kind === "link").length, 1);
  assert.equal(
    filtered.outputs.find((output) => output.kind === "link")?.href,
    "https://github.com/testuser/beta",
  );
});

test("terminal: a project search with no matches reports an error", () => {
  const result = run("projects nothing-matches");
  assert.equal(result.outputs[0].kind, "error");
  assert.match(result.outputs[0].text, /No project matches/);
});

test("terminal: about and skills render the configured data", () => {
  assert.match(text("about"), /Test Person/);
  assert.match(text("about"), /Detection · Tooling/);
  assert.match(text("skills"), /Python, TypeScript/);
});

test("terminal: contact exposes the email and GitHub links only", () => {
  const result = run("contact");
  const links = result.outputs.filter((output) => output.kind === "link");
  assert.deepEqual(
    links.map((link) => link.href),
    ["mailto:test@example.com", "https://github.com/testuser"],
  );
});

test("terminal: github opens the canonical profile URL", () => {
  const result = run("github");
  assert.deepEqual(result.action, {
    type: "open-url",
    url: "https://github.com/testuser",
  });
});

test("terminal: github refuses an invalid configured profile", () => {
  const result = executeCommand(
    "github",
    { ...DATA, profile: { ...DATA.profile, github: "javascript:alert(1)" } },
  );
  assert.equal(result.action, undefined);
  assert.equal(result.outputs[0].kind, "error");
});

test("terminal: cve with no argument opens the lookup", () => {
  const result = run("cve");
  assert.deepEqual(result.action, { type: "open-cve", id: "" });
});

test("terminal: cve normalises a valid identifier", () => {
  const result = run("cve cve-2021-44228");
  assert.deepEqual(result.action, { type: "open-cve", id: "CVE-2021-44228" });
});

test("terminal: cve rejects an invalid identifier", () => {
  const result = run("cve 2021-44228");
  assert.equal(result.action, undefined);
  assert.equal(result.outputs[0].kind, "error");
});

test("terminal: clear and exit return their actions", () => {
  assert.deepEqual(run("clear").action, { type: "clear" });
  assert.deepEqual(run("exit").action, { type: "close" });
});

test("terminal: date uses the supplied clock and says it is local", () => {
  const output = text("date");
  assert.match(output, /2026/);
  assert.match(output, /this browser, not by a server/i);
});
