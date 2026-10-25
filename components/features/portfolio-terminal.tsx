"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconTerminal2, IconX } from "@tabler/icons-react";
import { useUIStore } from "@/stores/ui-store";
import { useToolsStore } from "@/stores/tools-store";
import { useDialog } from "@/hooks/use-dialog";
import {
  executeCommand,
  type TerminalData,
  type TerminalOutput,
} from "@/lib/portfolio/terminal";
import { featuredProjects, otherProjects, profile, skillGroups } from "@/data/portfolio";

/**
 * Portfolio terminal.
 *
 * Every command reads from `data/portfolio.ts` through a fixed interpreter in
 * `lib/portfolio/terminal.ts`. There is no shell, no `eval`, no network call
 * for command execution, and the UI says so.
 */

const TERMINAL_DATA: TerminalData = {
  profile: {
    name: profile.name,
    role: profile.role,
    email: profile.email,
    github: profile.github,
    intro: profile.intro,
    focus: profile.focus,
  },
  projects: [...featuredProjects, ...otherProjects].map((project) => ({
    name: project.name,
    tagline: project.tagline,
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
    stack: project.stack,
  })),
  skills: skillGroups,
};

interface TerminalLine {
  id: string;
  kind: TerminalOutput["kind"] | "input";
  text: string;
  href?: string;
}

let lineCounter = 0;

function nextLineId(): string {
  lineCounter += 1;
  return `terminal-line-${lineCounter}`;
}

function initialLines(): TerminalLine[] {
  return [
    { id: nextLineId(), kind: "success", text: "Cyber Nexus — portfolio terminal" },
    {
      id: nextLineId(),
      kind: "muted",
      text: "This is a local interface over this site's data. It is not a shell, has no server session and cannot run system commands.",
    },
    { id: nextLineId(), kind: "text", text: 'Type "help" to see the available commands.' },
  ];
}

const QUICK_COMMANDS = ["help", "projects", "about", "skills"];

function isSafeExternalUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export function PortfolioTerminal() {
  const setTerminalOpen = useUIStore((state) => state.setHackerTerminalOpen);
  const openCve = useToolsStore((state) => state.openCve);

  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setTerminalOpen(false), [setTerminalOpen]);

  const containerRef = useDialog({
    open: true,
    onClose: close,
    initialFocusRef: inputRef,
  });

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [lines]);

  const runCommand = useCallback(
    (raw: string) => {
      const command = raw.trim();
      if (!command) return;

      const result = executeCommand(command, TERMINAL_DATA, Date.now());
      setLines((previous) => [
        ...previous,
        { id: nextLineId(), kind: "input", text: command },
        ...result.outputs.map((output) => ({ ...output, id: nextLineId() })),
      ]);
      setHistory((previous) => [command, ...previous].slice(0, 50));
      setHistoryIndex(-1);
      setInput("");

      const action = result.action;
      if (!action) return;

      if (action.type === "clear") {
        setLines([]);
      } else if (action.type === "close") {
        close();
      } else if (action.type === "open-cve") {
        close();
        openCve(action.id);
      } else if (action.type === "open-url" && isSafeExternalUrl(action.url)) {
        window.open(action.url, "_blank", "noopener,noreferrer");
      }
    },
    [close, openCve],
  );

  function handleHistoryUp() {
    if (history.length === 0) return;
    const next = Math.min(historyIndex + 1, history.length - 1);
    setHistoryIndex(next);
    setInput(history[next]);
  }

  function handleHistoryDown() {
    if (historyIndex <= 0) {
      setHistoryIndex(-1);
      setInput("");
      return;
    }
    const next = historyIndex - 1;
    setHistoryIndex(next);
    setInput(history[next]);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-terminal-title"
        tabIndex={-1}
        className="relative flex h-[min(82vh,34rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <IconTerminal2 size={15} className="text-accent" aria-hidden="true" />
          <h2 id="portfolio-terminal-title" className="text-sm font-medium text-foreground">
            Terminal
          </h2>
          <span className="rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-foreground-tertiary">
            Local interface
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close terminal"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-foreground-secondary transition-colors hover:bg-white/[0.04] hover:text-foreground"
          >
            <IconX size={16} aria-hidden="true" />
          </button>
        </div>

        <div
          ref={outputRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Terminal output"
          tabIndex={0}
          className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed sm:text-sm"
        >
          {lines.map((line) => {
            if (line.kind === "link" && line.href) {
              return (
                <p key={line.id} className="break-words">
                  <a
                    href={line.href}
                    target={line.href.startsWith("http") ? "_blank" : undefined}
                    rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
                  >
                    {line.text}
                  </a>
                </p>
              );
            }

            if (line.kind === "input") {
              return (
                <p key={line.id} className="break-words text-foreground">
                  <span className="mr-1.5 select-none text-accent" aria-hidden="true">
                    $
                  </span>
                  {line.text}
                </p>
              );
            }

            return (
              <p
                key={line.id}
                className={
                  line.kind === "error"
                    ? "break-words text-rose"
                    : line.kind === "success"
                      ? "break-words text-emerald"
                      : line.kind === "muted"
                        ? "break-words text-foreground-tertiary"
                        : "break-words text-foreground-secondary"
                }
              >
                {line.text}
              </p>
            );
          })}
        </div>

        <div className="border-t border-border px-4 py-2.5">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {QUICK_COMMANDS.map((command) => (
              <button
                key={command}
                type="button"
                onClick={() => runCommand(command)}
                className="rounded border border-border px-2 py-1 font-mono text-[11px] text-foreground-secondary transition-colors hover:border-border-hover hover:text-foreground"
              >
                {command}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              runCommand(input);
            }}
            className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5"
          >
            <label htmlFor="portfolio-terminal-input" className="sr-only">
              Terminal command
            </label>
            <span className="select-none font-mono text-sm text-accent" aria-hidden="true">
              $
            </span>
            <input
              ref={inputRef}
              id="portfolio-terminal-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  handleHistoryUp();
                } else if (event.key === "ArrowDown") {
                  event.preventDefault();
                  handleHistoryDown();
                }
              }}
              aria-describedby="portfolio-terminal-hint"
              placeholder="help"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={200}
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-foreground-tertiary"
            />
            <button
              type="submit"
              className="rounded border border-border px-2.5 py-1 text-xs text-foreground-secondary transition-colors hover:border-border-hover hover:text-foreground"
            >
              Run
            </button>
          </form>
          <p id="portfolio-terminal-hint" className="mt-1.5 text-[11px] text-foreground-tertiary">
            Enter runs a command. Up and Down browse history. Nothing is sent to a server.
          </p>
        </div>
      </div>
    </div>
  );
}
