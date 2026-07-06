"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";
import { useTerminalStore } from "@/stores/terminal-store";
import { useKeyboardShortcuts } from "@/lib/keyboard";
import { executeCommand, getBestCompletion, getCompletions, getTheme, terminalThemes } from "@/lib/terminal";
import type { TerminalLine, TerminalTheme } from "@/lib/terminal";
import { IconTerminal2, IconX, IconMinus, IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons-react";

const BOOT_LINES: { text: string; delay: number }[] = [
  { text: "Initializing CyberShell...", delay: 100 },
  { text: "Loading Commands...", delay: 250 },
  { text: "Connecting Portfolio Database...", delay: 400 },
  { text: "Loading Project Index...", delay: 550 },
  { text: "Loading Resume...", delay: 700 },
  { text: "Loading Certifications...", delay: 800 },
  { text: "Terminal Ready.", delay: 950 },
];

function createDownloadUrl() {
  const blob = new Blob(
    [
      "Maanas - Senior Security Engineer\n",
      "===============================\n\n",
      "Email: maanas@cybernexus.io\n",
      "LinkedIn: linkedin.com/in/maanas\n",
      "GitHub: github.com/maanas\n\n",
      "Award-winning cybersecurity professional with expertise in penetration testing,\n",
      "incident response, and security architecture.\n",
    ],
    { type: "text/plain" },
  );
  return URL.createObjectURL(blob);
}

export function CyberShell() {
  const router = useRouter();
  const isOpen = useUIStore((s) => s.hackerTerminalOpen);
  const setIsOpen = useUIStore((s) => s.setHackerTerminalOpen);
  const openAiAssistant = useUIStore((s) => s.setAiAssistantOpen);
  const toggleMatrix = useUIStore((s) => s.toggleMatrixMode);
  const toggleRecruiterMode = useUIStore((s) => s.toggleRecruiterMode);
  const { theme: themeName, setTheme } = useTerminalStore();

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState("/home/visitor");
  const [isBooted, setIsBooted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 820, height: 520 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, posX: 0, posY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [autoCompleteMatches, setAutoCompleteMatches] = useState<string[]>([]);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const bootTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const theme = getTheme(themeName);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    });
  }, []);

  const appendLine = useCallback(
    (line: TerminalLine) => {
      setLines((prev) => [...prev, line]);
      setTimeout(scrollToBottom, 0);
    },
    [scrollToBottom],
  );

  const clearLines = useCallback(() => {
    setLines([]);
    setHistoryIndex(-1);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setLines([]);
      setIsBooted(false);
      setCurrentDir("/home/visitor");
      setInput("");
      setHistoryIndex(-1);
      setIsMinimized(false);
      setIsMaximized(false);
      setPosition({ x: 0, y: 0 });
      setSize({ width: 820, height: 520 });
      return;
    }
    setPosition({ x: 0, y: 0 });
    setIsMaximized(false);
    setIsMinimized(false);

    let idx = 0;
    const runBoot = () => {
      if (idx < BOOT_LINES.length) {
        const line = BOOT_LINES[idx];
        appendLine({ text: line.text, type: idx === BOOT_LINES.length - 1 ? "success" : "system" });
        idx++;
        bootTimeoutRef.current = setTimeout(runBoot, line.delay);
      } else {
        setIsBooted(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    runBoot();

    return () => {
      if (bootTimeoutRef.current) clearTimeout(bootTimeoutRef.current);
    };
  }, [isOpen, appendLine]);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    if (isOpen && isBooted) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, isBooted]);

  const addToHistory = useCallback((cmd: string) => {
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
  }, []);

  const closeTerminal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const openExternal = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const downloadResume = useCallback(() => {
    const url = createDownloadUrl();
    const a = document.createElement("a");
    a.href = url;
    a.download = "maanas-resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const cmdContext = {
    currentDir,
    setCurrentDir,
    appendLine,
    clearLines,
    theme: themeName,
    setTheme,
    closeTerminal,
    navigateTo,
    openExternal,
    openAiAssistant: () => openAiAssistant(true),
    toggleMatrix,
    toggleRecruiterMode: () => toggleRecruiterMode(),
    downloadResume,
    addToHistory,
    isBooted,
  };

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;
      executeCommand(trimmed, cmdContext);
      setInput("");
      setHistoryIndex(-1);
      setShowAutoComplete(false);
    },
    [cmdContext],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCommand(input);
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const words = input.split(/\s+/);
        const partial = words[words.length - 1];
        if (!partial) return;
        const best = getBestCompletion(partial);
        if (best) {
          words[words.length - 1] = best;
          setInput(words.join(" "));
          setShowAutoComplete(false);
        } else {
          const matches = getCompletions(partial);
          if (matches.length > 1) {
            setAutoCompleteMatches(matches);
            setShowAutoComplete(true);
          }
        }
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        const newIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIdx);
        setInput(history[newIdx]);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;
        if (historyIndex === history.length - 1) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          const newIdx = historyIndex + 1;
          setHistoryIndex(newIdx);
          setInput(history[newIdx]);
        }
        return;
      }

      if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        clearLines();
        return;
      }

      if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
        if (!input) {
          appendLine({ text: "^C", type: "output" });
        } else {
          setInput("");
        }
        return;
      }
    },
    [input, history, historyIndex, handleCommand, clearLines, appendLine],
  );

  const handlePointerDownHeader = useCallback(
    (e: React.PointerEvent) => {
      if (isMaximized) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY, posX: position.x, posY: position.y });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isMaximized, position],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging && !isMaximized) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setPosition({ x: dragStart.posX + dx, y: dragStart.posY + dy });
      }
      if (isResizing) {
        const dw = e.clientX - resizeStart.x;
        const dh = e.clientY - resizeStart.y;
        setSize({
          width: Math.max(480, resizeStart.w + dw),
          height: Math.max(300, resizeStart.h + dh),
        });
      }
    },
    [isDragging, isResizing, dragStart, resizeStart, isMaximized],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handlePointerDownResize = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      setIsResizing(true);
      setResizeStart({ x: e.clientX, y: e.clientY, w: size.width, h: size.height });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [size],
  );

  const toggleMinimize = useCallback(() => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsMinimized(true);
    }
  }, [isMinimized]);

  const toggleMaximize = useCallback(() => {
    if (isMaximized) {
      setIsMaximized(false);
      setPosition({ x: 0, y: 0 });
      setSize({ width: 820, height: 520 });
    } else {
      setIsMaximized(true);
      setPosition({ x: 0, y: 0 });
      setSize({ width: 0, height: 0 });
    }
  }, [isMaximized]);

  const windowStyle = isMaximized
    ? { top: 0, left: 0, right: 0, bottom: 0, width: "100%" as const, height: "100%" as const }
    : { top: `calc(50% + ${position.y}px)`, left: `calc(50% + ${position.x}px)`, width: size.width, height: size.height };

  const inputPrompt = `${theme.prompt}@cybernexus:${currentDir}$`;

  useKeyboardShortcuts([
    { key: "k", ctrl: true, handler: closeTerminal, description: "Close terminal" },
  ]);

  const lineClass = (type: TerminalLine["type"]) => {
    switch (type) {
      case "input":
        return "opacity-60";
      case "error":
        return "text-red-400";
      case "system":
        return "text-cyan";
      case "success":
        return "text-emerald-400";
      case "info":
        return "text-purple-400";
      default:
        return "text-foreground-secondary";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeTerminal} />

          <motion.div
            ref={windowRef}
            className="absolute flex flex-col overflow-hidden font-mono text-sm"
            style={{
              ...windowStyle,
              background: theme.bg,
              backdropFilter: "blur(32px) saturate(1.3)",
              WebkitBackdropFilter: "blur(32px) saturate(1.3)",
              borderRadius: isMaximized ? 0 : 14,
              border: `1px solid ${theme.border}`,
              boxShadow: "0 8px 64px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
              transform: `translate(calc(-50% + ${isMaximized ? 0 : position.x}px), calc(-50% + ${isMaximized ? 0 : position.y}px))`,
              top: isMaximized ? 0 : "50%",
              left: isMaximized ? 0 : "50%",
            }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{
              opacity: isMinimized ? 0 : 1,
              scale: isMinimized ? 0.9 : 1,
              y: isMinimized ? 40 : 0,
            }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5 select-none shrink-0"
              style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}` }}
              onPointerDown={handlePointerDownHeader}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); closeTerminal(); }}
                    className="w-3 h-3 rounded-full bg-red-500/60 hover:bg-red-400 transition-colors flex items-center justify-center group"
                  >
                    <IconX size={8} className="opacity-0 group-hover:opacity-100 text-red-900" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMinimize(); }}
                    className="w-3 h-3 rounded-full bg-yellow-500/60 hover:bg-yellow-400 transition-colors flex items-center justify-center group"
                  >
                    <IconMinus size={8} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
                    className="w-3 h-3 rounded-full bg-green-500/60 hover:bg-green-400 transition-colors flex items-center justify-center group"
                  >
                    {isMaximized ? (
                      <IconArrowsMinimize size={8} className="opacity-0 group-hover:opacity-100 text-green-900" />
                    ) : (
                      <IconArrowsMaximize size={8} className="opacity-0 group-hover:opacity-100 text-green-900" />
                    )}
                  </button>
                </div>
                <span className="text-xs ml-3" style={{ color: `${theme.promptColor}80` }}>
                  CyberShell v1.0
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs opacity-50 tracking-wide">Connected — Portfolio Workspace</span>
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                  <span className="opacity-60">Online</span>
                </span>
                <span className="text-xs opacity-40">Session: Guest</span>
              </div>
            </div>

            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5"
              style={{ scrollBehavior: "smooth" }}
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={`leading-relaxed whitespace-pre-wrap ${lineClass(line.type)}`}
                  style={
                    line.type === "system"
                      ? { color: theme.systemColor }
                      : line.type === "error"
                        ? { color: theme.errorColor }
                        : line.type === "success"
                          ? { color: theme.successColor }
                          : line.type === "info"
                            ? { color: theme.infoColor }
                            : line.type === "input"
                              ? { color: theme.outputColor, opacity: 0.6 }
                              : { color: theme.outputColor }
                  }
                >
                  {line.text}
                </div>
              ))}

              {showAutoComplete && autoCompleteMatches.length > 0 && (
                <div
                  className="text-xs py-1 px-2 rounded mt-1"
                  style={{
                    background: `${theme.systemColor}10`,
                    border: `1px solid ${theme.systemColor}20`,
                    color: theme.outputColor,
                  }}
                >
                  <span className="opacity-50">Suggestions: </span>
                  {autoCompleteMatches.join("  ")}
                </div>
              )}
            </div>

            <div
              className="px-4 py-2.5 shrink-0"
              style={{ borderTop: `1px solid ${theme.border}`, background: theme.headerBg }}
            >
              {isBooted ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs shrink-0" style={{ color: theme.promptColor }}>
                    {inputPrompt}
                  </span>
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent text-sm outline-none"
                      style={{ color: theme.inputColor, caretColor: theme.cursor }}
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-30 animate-pulse">Booting...</span>
                </div>
              )}
            </div>

            {!isMaximized && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                onPointerDown={handlePointerDownResize}
                style={{ touchAction: "none" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-1 right-1 opacity-30">
                  <path d="M0 10 L10 0 M0 6 L6 10 M4 10 L10 4" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
