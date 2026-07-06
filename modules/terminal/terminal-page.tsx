"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "system" | "error" | "success";
}

const bootSequence: TerminalLine[] = [
  { text: "CYBER NEXUS SECURITY TERMINAL v2.0", type: "system" },
  { text: "→ Kernel loaded", type: "success" },
  { text: "→ Security modules initialized", type: "success" },
  { text: "→ Encrypted channel established", type: "success" },
  { text: "→ System ready. Type 'help' for commands.", type: "system" },
  { text: "", type: "output" },
];

const helpText = `Available Commands:
  help           - Show this help
  whoami         - Display user info
  ls             - List directories
  cd <dir>       - Change directory
  cat <file>     - Read file
  ping           - Test connectivity
  clear          - Clear terminal
  date           - Show date/time
  matrix         - Toggle matrix mode
  whois          - Lookup info
  fetch          - System info
  banner         - Show banner
  cowsay <msg>   - Fun message
  fortune        - Random quote
  history        - Command history
  exit           - Close terminal
  sudo <cmd>     - (simulated)`;

const responses: Record<string, (args: string[]) => TerminalLine[]> = {
  whoami: () => [{ text: "senior-security-engineer", type: "output" }],
  date: () => [{ text: new Date().toString(), type: "output" }],
  whois: () => [{ text: "Cyber Nexus - Security Professional", type: "output" }, { text: "Expertise: Penetration Testing, Incident Response, Security Architecture", type: "output" }],
  fetch: () => [
    { text: "          .---.         ", type: "output" },
    { text: "         /     \\        ", type: "output" },
    { text: "        /       \\       ", type: "output" },
    { text: "       |  🛡️  |  Cyber Nexus Terminal", type: "output" },
    { text: "        \\       /       ", type: "output" },
    { text: "         \\     /        ", type: "output" },
    { text: "          '---'         ", type: "output" },
    { text: "------------------------", type: "output" },
    { text: "OS: CyberNexus OS v2.0", type: "output" },
    { text: "Kernel: Secure Linux 6.8", type: "output" },
    { text: "Shell: /bin/cyber-shell", type: "output" },
    { text: "Uptime: 6 years, 3 months", type: "output" },
    { text: "Packages: 47 security tools", type: "output" },
    { text: "------------------------", type: "output" },
  ],
  banner: () => [
    { text: "╔══════════════════════════════════╗", type: "output" },
    { text: "║     CYBER NEXUS v2.0            ║", type: "output" },
    { text: "║   Security Operations Terminal  ║", type: "output" },
    { text: "╚══════════════════════════════════╝", type: "output" },
  ],
  fortune: () => {
    const fortunes = [
      "The best defense is a good offense.",
      "Security is not a product, but a process.",
      "Trust, but verify. Then verify again.",
      "There are two types of companies: those that have been hacked, and those that don't know it yet.",
      "Complexity is the enemy of security.",
    ];
    return [{ text: fortunes[Math.floor(Math.random() * fortunes.length)], type: "success" }];
  },
  cowsay: (args) => {
    const msg = args.join(" ") || "Moo!";
    return [
      { text: `  ${"_".repeat(msg.length + 2)}`, type: "output" },
      { text: ` < ${msg} >`, type: "output" },
      { text: `  ${"-".repeat(msg.length + 2)}`, type: "output" },
      { text: "        \\   ^__^", type: "output" },
      { text: "         \\  (oo)\\_______", type: "output" },
      { text: "            (__)\\       )\\/\\", type: "output" },
      { text: "                ||----w |", type: "output" },
      { text: "                ||     ||", type: "output" },
    ];
  },
};

export function TerminalPage() {
  const [lines, setLines] = useState<TerminalLine[]>(bootSequence);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const fontSize = useSettingsStore((s) => s.terminalFontSize);

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLine = useCallback((line: TerminalLine) => {
    setLines((prev) => [...prev, line]);
  }, []);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    addLine({ text: `visitor@cybernexus:~$ ${trimmed}`, type: "input" });

    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (responses[command]) {
      responses[command](args).forEach((line) => addLine(line));
      return;
    }

    switch (command) {
      case "help":
        helpText.split("\n").forEach((line) => addLine({ text: line, type: "output" }));
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        addLine({ text: "Use the dock button or press Escape to close.", type: "system" });
        break;
      case "matrix":
        addLine({ text: "Toggle matrix mode from Settings or type 'matrix' in Konami code.", type: "system" });
        break;
      case "sudo":
        addLine({ text: `[sudo] password for visitor:`, type: "output" });
        setTimeout(() => addLine({ text: "Nice try. You don't have root here.", type: "error" }), 500);
        break;
      case "history":
        history.forEach((h, i) => addLine({ text: `  ${i + 1}  ${h}`, type: "output" }));
        break;
      default:
        addLine({ text: `bash: ${command}: command not found. Type 'help' for available commands.`, type: "error" });
    }
  }, [addLine, history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const fontSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-xs text-cyan font-mono tracking-wider uppercase">.terminal</span>
            <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
              Interactive <span className="text-gradient font-medium">Terminal</span>
            </h1>
          </motion.div>

          <GlassCard className="overflow-hidden" glow="cyan" intensity="medium">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-black/20">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs text-soft-white/30 font-mono ml-3">cybernexus-terminal — ssh session</span>
              </div>
              <span className="text-xs text-soft-white/20 font-mono">encrypted 🔒</span>
            </div>

            <div
              ref={terminalRef}
              className="h-[60vh] overflow-y-auto p-4 bg-black/40 font-mono space-y-1"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    fontSizes[fontSize],
                    "leading-relaxed",
                    line.type === "input" && "text-soft-white/60",
                    line.type === "error" && "text-red-400",
                    line.type === "system" && "text-cyan",
                    line.type === "success" && "text-green-400",
                    line.type === "output" && "text-soft-white/40"
                  )}
                >
                  {line.type === "system" && <span className="text-cyan mr-2">◆</span>}
                  {line.type === "success" && <span className="text-green-400 mr-2">✓</span>}
                  {line.type === "error" && <span className="text-red-400 mr-2">✗</span>}
                  <span className="whitespace-pre">{line.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-border/50 bg-black/20">
              <span className={cn("text-cyan shrink-0 font-mono", fontSizes[fontSize])}>visitor@cybernexus:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-soft-white outline-none font-mono"
                style={{ fontSize: fontSizes[fontSize] === "text-xs" ? "inherit" : undefined }}
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
