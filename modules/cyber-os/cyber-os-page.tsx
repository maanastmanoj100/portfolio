"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconShield, IconBrain, IconNetwork, IconBook, IconBrandGithub,
  IconChartBar, IconCertificate, IconSearch, IconSettings, IconBug,
  IconServer, IconTerminal, IconFolder, IconGlobe, IconMessage,
  IconHistory, IconDashboard, IconMap, IconFlag, IconTrophy,
  IconCode, IconDatabase, IconLock, IconApi, IconUsers,
  IconFileText, IconStar, IconHeart, IconRobot, IconX,
  IconMinus, IconMaximize, IconMinimize, IconPlus, IconClock,
  IconBell, IconSun, IconMoon, IconRefresh, IconExternalLink,
  IconLayoutGrid, IconList, IconChevronRight, IconChevronLeft,
  IconArrowRight, IconCommand, IconAlertTriangle, IconCheck,
  IconGripVertical, IconWifi, IconBattery, IconVolume,
  IconActivity, IconCpu, IconDotsVertical, IconHome,
  IconSquare, IconSquareX, IconSquareMinus,
} from "@tabler/icons-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { useOsStore, type OsWindow } from "./os-store";
import {
  OS_APPS, VIRTUAL_FS, TERMINAL_COMMANDS, WALLPAPERS,
  BOOT_MESSAGES, EASTER_EGGS, COPILOT_SUGGESTIONS,
  type OsApp, type VfsNode,
  APP_CATEGORIES,
} from "./os-data";

// ─── Constants ──────────────────────────────────────────────────────────

const THEME_BG: Record<string, string> = {
  "liquid-glass": "from-gray-950 via-slate-900 to-gray-950",
  "dark-cyber": "from-black via-gray-900 to-black",
  "light-professional": "from-gray-100 via-white to-gray-200",
  "midnight-blue": "from-slate-950 via-blue-950 to-slate-950",
  "neon-matrix": "from-black via-green-950 to-black",
  "minimal": "from-gray-950 to-gray-900",
  "high-contrast": "from-black to-black",
};

const TASKBAR_HEIGHT = 48;
const DOCK_SIZE = 64;

// ─── Boot Screen ────────────────────────────────────────────────────────

function BootScreen() {
  const { boot, skipBoot } = useOsStore();
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    boot();
    const msgInt = setInterval(() => setMsgIdx((i) => Math.min(i + 1, BOOT_MESSAGES.length - 1)), 280);
    const progInt = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 12, 100)), 300);
    return () => { clearInterval(msgInt); clearInterval(progInt); };
  }, []);

  return (
    <motion.div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
      exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
    >
      <div className="text-center space-y-6 max-w-md">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <IconShield size={48} className="text-cyan-400 mx-auto" />
          <h1 className="text-2xl font-bold mt-3 bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
            Cyber Nexus OS
          </h1>
          <p className="text-gray-500 text-sm mt-1">v1.0 — Security Portfolio Platform</p>
        </motion.div>
        <div className="space-y-2">
          {BOOT_MESSAGES.slice(0, msgIdx + 1).map((m, i) => (
            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className={`text-xs font-mono ${i === msgIdx ? "text-cyan-400" : "text-gray-600"}`}
            >{m}</motion.p>
          ))}
        </div>
        <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
            style={{ width: `${progress}%` }} transition={{ duration: 0.3 }}
          />
        </div>
        <button onClick={skipBoot} className="text-xs text-gray-600 hover:text-gray-400 transition-colors mt-4">
          Skip boot (Space)
        </button>
      </div>
    </motion.div>
  );
}

// ─── Window Component ───────────────────────────────────────────────────

function OsWindow({ win }: { win: OsWindow }) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, moveWindow, resizeWindow } = useOsStore();
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number; dragging: boolean }>({ startX: 0, startY: 0, winX: 0, winY: 0, dragging: false });
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number; dir: string }>({ startX: 0, startY: 0, startW: 0, startH: 0, dir: "" });
  const [size, setSize] = useState({ w: win.width, h: win.height });
  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const app = OS_APPS.find((a) => a.id === win.appId);

  const focused = useOsStore((s) => s.focusedWindow === win.id);

  useEffect(() => { setSize({ w: win.width, h: win.height }); setPos({ x: win.x, y: win.y }); }, [win.width, win.height, win.x, win.y]);

  const handleMouseDown = () => focusWindow(win.id);

  const startDrag = (e: React.MouseEvent) => {
    focusWindow(win.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: pos.x, winY: pos.y, dragging: true };
    const handler = (ev: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      const nx = Math.max(0, dragRef.current.winX + dx);
      const ny = Math.max(0, dragRef.current.winY + dy);
      setPos({ x: nx, y: ny });
    };
    const upHandler = () => {
      dragRef.current.dragging = false;
      moveWindow(win.id, pos.x, pos.y);
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", upHandler);
    };
    window.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", upHandler);
  };

  const startResize = (dir: string, e: React.MouseEvent) => {
    e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h, dir };
    const handler = (ev: MouseEvent) => {
      const dx = ev.clientX - resizeRef.current.startX;
      const dy = ev.clientY - resizeRef.current.startY;
      let nw = size.w, nh = size.h;
      if (dir.includes("e")) nw = Math.max(400, resizeRef.current.startW + dx);
      if (dir.includes("s")) nh = Math.max(300, resizeRef.current.startH + dy);
      if (dir.includes("w")) { nw = Math.max(400, resizeRef.current.startW - dx); setPos((p) => ({ ...p, x: pos.x + dx })); }
      setSize({ w: nw, h: nh });
    };
    const upHandler = () => {
      resizeWindow(win.id, size.w, size.h);
      window.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", upHandler);
    };
    window.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", upHandler);
  };

  const isMaximized = win.maximized;
  const displayW = isMaximized ? window.innerWidth : size.w;
  const displayH = isMaximized ? window.innerHeight - TASKBAR_HEIGHT - DOCK_SIZE - 8 : size.h;
  const displayX = isMaximized ? 0 : pos.x;
  const displayY = isMaximized ? 0 : pos.y;

  const WindowContent = useCallback(() => {
    if (win.appId === "terminal") return <TerminalApp />;
    if (win.appId === "files") return <FileExplorerApp />;
    if (win.appId === "settings") return <SettingsApp />;
    if (win.appId === "ai-copilot") return <AICopilotApp />;
    if (win.appId === "browser") return <BrowserApp />;
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center space-y-2">
          {app && <app.icon size={48} className="mx-auto opacity-30" />}
          <p className="text-sm">{app?.name || win.title}</p>
          <p className="text-xs text-gray-600">Window content loaded</p>
          {app?.route && app.route !== "#" && (
            <Button variant="ghost" size="sm" onClick={() => window.open(app.route, "_blank")}>
              <IconExternalLink size={14} /> Open page
            </Button>
          )}
        </div>
      </div>
    );
  }, [win.appId, win.title, app]);

  const showApp = app;
  const appColor = showApp?.color || "text-cyan-400";

  return (
    <motion.div
      className={`fixed rounded-lg overflow-hidden shadow-2xl ${
        focused ? "z-50" : "z-40"
      }`}
      style={{ left: displayX, top: displayY, width: displayW, height: displayH }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      onMouseDown={handleMouseDown}
    >
      <div className={`h-full flex flex-col bg-gray-950/90 backdrop-blur-2xl border ${
        focused ? "border-white/20" : "border-white/5"
      } rounded-lg overflow-hidden`}>
        {/* Title Bar */}
        <div className="flex items-center h-10 px-3 bg-white/5 border-b border-white/10 cursor-default"
          onMouseDown={startDrag}
        >
          <div className="flex items-center gap-2 mr-3">
            <button onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" title="Close" />
            <button onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }} className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors" title="Minimize" />
            <button onClick={(e) => { e.stopPropagation(); isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id); }} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" title={isMaximized ? "Restore" : "Maximize"} />
          </div>
          {showApp && <showApp.icon size={14} className={`${appColor} mr-2`} />}
          <span className="text-xs text-gray-300 font-medium truncate flex-1 text-center mr-20">{win.title}</span>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <WindowContent />
        </div>
        {/* Resize Handles */}
        {!isMaximized && (
          <>
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={(e) => startResize("se", e)} />
            <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" onMouseDown={(e) => startResize("sw", e)} />
            <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" onMouseDown={(e) => startResize("ne", e)} />
            <div className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize" onMouseDown={(e) => startResize("s", e)} />
            <div className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize" onMouseDown={(e) => startResize("e", e)} />
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Terminal App ───────────────────────────────────────────────────────

function TerminalApp() {
  const { terminalSessions, activeTerminalTab, addTerminalLine, clearTerminal, addTerminalSession, closeTerminalSession } = useOsStore();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const session = terminalSessions.find((t) => t.id === activeTerminalTab);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [session?.lines]);
  useEffect(() => { inputRef.current?.focus(); });

  const execute = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    addTerminalLine(activeTerminalTab, { text: `$ ${trimmed}`, className: "text-green-400" });
    setHistory((h) => [trimmed, ...h].slice(0, 100));
    setHistIdx(-1);

    if (trimmed === "clear") { clearTerminal(activeTerminalTab); return; }

    const [base, ...args] = trimmed.split(" ");
    const command = TERMINAL_COMMANDS[base];
    if (command) {
      const output = typeof command.output === "function" ? command.output(args) : command.output;
      if (output) {
        output.split("\n").forEach((line) => addTerminalLine(activeTerminalTab, { text: line, className: "text-gray-300" }));
      }
    } else {
      addTerminalLine(activeTerminalTab, { text: `Command not found: ${base}. Type 'help' for available commands.`, className: "text-red-400" });
    }
    addTerminalLine(activeTerminalTab, { text: "", className: "" });
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { execute(input); setInput(""); }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && histIdx < history.length - 1) {
        const idx = histIdx + 1;
        setHistIdx(idx);
        setInput(history[idx]);
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) { setHistIdx(histIdx - 1); setInput(history[histIdx - 1]); }
      else { setHistIdx(-1); setInput(""); }
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/80" onClick={() => inputRef.current?.focus()}>
      <div className="flex items-center gap-1 px-2 py-1 border-b border-white/10 bg-white/5">
        <button onClick={() => addTerminalSession()} className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"><IconPlus size={12} /></button>
        {terminalSessions.map((ts) => (
          <button key={ts.id} onClick={() => useOsStore.setState({ activeTerminalTab: ts.id })}
            className={`px-2 py-0.5 rounded text-xs ${ts.id === activeTerminalTab ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
          >Terminal {terminalSessions.indexOf(ts) + 1}</button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-3 font-mono text-xs space-y-0.5">
        {session?.lines.map((line, i) => (
          <div key={i} className={line.className || "text-gray-300"} style={{ whiteSpace: "pre-wrap" }}>{line.text || "\u00A0"}</div>
        ))}
        <div className="flex items-center gap-1">
          <span className="text-green-400">$</span>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
            className="flex-1 bg-transparent border-none outline-none text-green-300 caret-green-400 text-xs"
            spellCheck={false} autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── File Explorer App ──────────────────────────────────────────────────

function FileExplorerApp() {
  const [currentPath, setCurrentPath] = useState<string[]>(["Projects", "Cyber Nexus"]);
  const [view, setView] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");

  const getNode = (path: string[]): VfsNode | null => {
    let node: VfsNode | undefined = { name: "root", type: "folder", children: VIRTUAL_FS };
    for (const seg of path) {
      node = node.children?.find((c) => c.name === seg);
      if (!node) return null;
    }
    return node;
  };

  const current = getNode(currentPath);
  const children = current?.children || [];
  const filtered = search ? children.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())) : children;

  return (
    <div className="h-full flex flex-col bg-gray-950/90">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
        <button onClick={() => setCurrentPath((p) => p.slice(0, -1))} disabled={currentPath.length === 0} className="p-2 rounded hover:bg-white/10 text-gray-400"><IconChevronLeft size={14} /></button>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          {currentPath.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <IconChevronRight size={10} />}
              <button onClick={() => setCurrentPath(currentPath.slice(0, i + 1))} className="hover:text-white transition-colors">{seg}</button>
            </span>
          ))}
        </div>
        <div className="flex-1" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="w-40 px-2 py-1 rounded text-xs bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none" />
        <button onClick={() => setView(view === "grid" ? "list" : "grid")} className="p-2 rounded hover:bg-white/10 text-gray-400">
          {view === "grid" ? <IconList size={14} /> : <IconLayoutGrid size={14} />}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">Empty folder</div>
        )}
        <div className={view === "grid" ? "grid grid-cols-6 gap-2" : "space-y-0.5"}>
          {filtered.map((node) => (
            <button key={node.name} onClick={() => node.type === "folder" && setCurrentPath([...currentPath, node.name])}
              className={`flex items-center gap-2 p-2 rounded hover:bg-white/5 text-left transition-colors ${view === "grid" ? "flex-col text-center" : ""}`}
            >
              <IconFolder size={view === "grid" ? 32 : 16} className={node.type === "folder" ? "text-cyan-400" : "text-gray-400"} />
              <div className="min-w-0">
                <p className="text-xs text-white truncate">{node.name}</p>
                {view === "list" && node.type === "file" && <p className="text-xs text-gray-500">{node.size}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Settings App ───────────────────────────────────────────────────────

function SettingsApp() {
  const { theme, setTheme, animationLevel, setAnimationLevel, glassIntensity, setGlassIntensity, fontSize, setFontSize, focusMode, setFocusMode, accessibilityReducedMotion, setAccessibilityReducedMotion, accessibilityHighContrast, setAccessibilityHighContrast } = useOsStore();

  return (
    <div className="h-full flex flex-col p-4 space-y-4 overflow-auto">
      <h2 className="text-lg font-bold text-white">Settings</h2>

      <div className="space-y-3">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Appearance</p>
        <div className="grid grid-cols-4 gap-2">
          {(["liquid-glass", "dark-cyber", "light-professional", "midnight-blue", "neon-matrix", "minimal", "high-contrast"] as const).map((t) => (
            <button key={t} onClick={() => setTheme(t)}
              className={`p-2 rounded-lg border text-center transition-all ${
                theme === t ? "border-cyan-500 bg-cyan-500/10" : "border-white/10 hover:border-white/30"
              }`}
            >
              <div className={`h-8 rounded mb-1 bg-gradient-to-br ${THEME_BG[t]} border border-white/10`} />
              <p className="text-xs text-gray-300 truncate">{t.replace(/-/g, " ")}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Animation</p>
        {(["full", "reduced", "minimal"] as const).map((a) => (
          <label key={a} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
            <input type="radio" name="animation" checked={animationLevel === a} onChange={() => setAnimationLevel(a)} className="accent-cyan-500" />
            <span className="text-sm text-gray-300 capitalize">{a}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Glass Intensity</p>
        <div className="flex gap-2">
          {(["low", "medium", "high"] as const).map((g) => (
            <button key={g} onClick={() => setGlassIntensity(g)}
              className={`flex-1 p-2 rounded-lg text-xs border transition-all ${
                glassIntensity === g ? "border-cyan-500 bg-cyan-500/10 text-cyan-300" : "border-white/10 text-gray-400 hover:border-white/30"
              }`}
            >{g}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Font Size</p>
        <div className="flex gap-2">
          {(["small", "medium", "large"] as const).map((f) => (
            <button key={f} onClick={() => setFontSize(f)}
              className={`flex-1 p-2 rounded-lg text-xs border transition-all ${
                fontSize === f ? "border-cyan-500 bg-cyan-500/10 text-cyan-300" : "border-white/10 text-gray-400 hover:border-white/30"
              }`}
            >{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Accessibility</p>
        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <span className="text-sm text-gray-300">Reduced Motion</span>
          <input type="checkbox" checked={accessibilityReducedMotion} onChange={(e) => setAccessibilityReducedMotion(e.target.checked)} className="accent-cyan-500" />
        </label>
        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <span className="text-sm text-gray-300">High Contrast</span>
          <input type="checkbox" checked={accessibilityHighContrast} onChange={(e) => setAccessibilityHighContrast(e.target.checked)} className="accent-cyan-500" />
        </label>
        <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <span className="text-sm text-gray-300">Focus Mode</span>
          <input type="checkbox" checked={focusMode} onChange={(e) => setFocusMode(e.target.checked)} className="accent-cyan-500" />
        </label>
      </div>
    </div>
  );
}

// ─── AI Copilot App ────────────────────────────────────────────────────

function AICopilotApp() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = useCallback(async (q: string) => {
    setQuery(q); setLoading(true); setResponse("");
    await new Promise((r) => setTimeout(r, 600));
    const ql = q.toLowerCase();
    if (ql.includes("navigate") || ql.includes("open") || ql.includes("go to")) {
      const target = OS_APPS.find((a) => a.name.toLowerCase().includes(ql) || a.id.includes(ql));
      setResponse(target ? `Opening ${target.name} in a new window. Use the dock or app launcher if the window doesn't appear.` : `I can navigate to any portfolio section. Try: "Open SOC Dashboard", "Open Knowledge Graph", or "Show certification page".`);
    } else if (ql.includes("project")) {
      setResponse("Portfolio projects include: Cyber Nexus (the platform you're exploring), Sentinel AI SOC (AI threat detection), Home Lab (virtual cyber range), Threat Intelligence Center, Knowledge Graph, and more. Each project has detailed documentation in the Projects app.");
    } else if (ql.includes("skill")) {
      setResponse("Technical skills span: Web & Network Security, Cloud Security (AWS), SIEM operations (Splunk, Wazuh), Python/TypeScript development, Threat Modeling, Incident Response, Docker/Kubernetes, Terraform, and Penetration Testing.");
    } else if (ql.includes("recruit") || ql.includes("resume")) {
      setResponse("Recruiter mode provides a curated view of the portfolio including the resume, top projects, certifications, and skills. Open the Recruiter workspace from the workspace switcher in the taskbar.");
    } else {
      setResponse("I'm your AI assistant for Cyber Nexus OS. I can help navigate the portfolio, summarize projects and skills, recommend learning paths, search documentation, and guide recruiters. Try asking: 'Open Knowledge Graph', 'Summarize projects', or 'Show skills overview'.");
    }
    setLoading(false);
  }, []);

  return (
    <div className="h-full flex flex-col p-4 space-y-3">
      <div className="flex items-center gap-2">
        <IconRobot size={20} className="text-purple-400" />
        <h2 className="text-white font-semibold">AI Copilot</h2>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {COPILOT_SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => handleAsk(s)} className="px-2 py-2 rounded text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20">{s}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && query && handleAsk(query)}
          placeholder="Ask the AI copilot..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50"
        />
        <Button variant="primary" size="sm" onClick={() => handleAsk(query)} disabled={loading || !query}>
          <IconBrain size={14} /> Ask
        </Button>
      </div>
      <AnimatePresence>
        {(loading || response) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 overflow-auto"
          >
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400"><div className="w-3 h-3 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />Thinking...</div>
            ) : (
              <p className="text-sm text-gray-200 whitespace-pre-line">{response}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Browser App ────────────────────────────────────────────────────────

function BrowserApp() {
  const [url, setUrl] = useState("about:home");
  const pages = OS_APPS.filter((a) => a.route && a.route !== "#").slice(0, 12);
  return (
    <div className="h-full flex flex-col bg-gray-950/90">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
        <button className="p-2 rounded hover:bg-white/10 text-gray-400"><IconChevronLeft size={14} /></button>
        <button className="p-2 rounded hover:bg-white/10 text-gray-400"><IconChevronRight size={14} /></button>
        <button className="p-2 rounded hover:bg-white/10 text-gray-400"><IconRefresh size={14} /></button>
        <div className="flex-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
          {url === "about:home" ? "cyber-nexus.local/home" : url}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {url === "about:home" && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <IconGlobe size={48} className="text-cyan-400 mx-auto mb-2" />
              <h2 className="text-white font-bold text-lg">Web Viewer</h2>
              <p className="text-gray-500 text-sm">Browse portfolio pages</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {pages.map((app) => (
                <button key={app.id} onClick={() => app.route && window.open(app.route, "_blank")}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-center transition-colors"
                >
                  <app.icon size={24} className={`${app.color} mx-auto mb-1`} />
                  <p className="text-xs text-gray-300 truncate">{app.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Launcher ────────────────────────────────────────────────────────

function AppLauncher() {
  const { setAppLauncherOpen, openWindow } = useOsStore();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => {
    let apps = OS_APPS;
    if (cat !== "all") apps = apps.filter((a) => a.category === cat);
    if (search) { const q = search.toLowerCase(); apps = apps.filter((a) => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)); }
    return apps;
  }, [cat, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16"
      onClick={() => setAppLauncherOpen(false)}
    >
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-lg bg-gray-950/90 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applications..." autoFocus
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none"
            />
          </div>
          <div className="flex gap-1 mt-2">
            <button onClick={() => setCat("all")}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${cat === "all" ? "bg-cyan-500/20 text-cyan-300" : "text-gray-500 hover:text-gray-300"}`}
            >All</button>
            {APP_CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${cat === c.id ? "bg-cyan-500/20 text-cyan-300" : "text-gray-500 hover:text-gray-300"}`}
              >{c.name}</button>
            ))}
          </div>
        </div>
        <div className="max-h-80 overflow-auto p-2 space-y-0.5">
          {filtered.map((app) => (
            <button key={app.id} onClick={() => { openWindow(app.id, app.name, app.route); setAppLauncherOpen(false); }}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <app.icon size={20} className={app.color} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white truncate">{app.name}</p>
                <p className="text-xs text-gray-500 truncate">{app.desc}</p>
              </div>
              <span className="text-xs text-gray-600 capitalize">{app.category}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Command Palette ────────────────────────────────────────────────────

function CommandPalette() {
  const { setCommandPaletteOpen, openWindow, setGlobalSearchOpen, setAppLauncherOpen } = useOsStore();
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);

  const commands = useMemo(() => {
    const base = [
      { label: "Open Terminal", action: () => openWindow("terminal", "Terminal"), icon: IconTerminal },
      { label: "Open File Explorer", action: () => openWindow("files", "File Explorer"), icon: IconFolder },
      { label: "Open Settings", action: () => openWindow("settings", "Settings"), icon: IconSettings },
      { label: "Open AI Copilot", action: () => openWindow("ai-copilot", "AI Copilot"), icon: IconRobot },
      { label: "Open Browser", action: () => openWindow("browser", "Web Viewer"), icon: IconGlobe },
      { label: "Search Portfolio", action: () => { setCommandPaletteOpen(false); setGlobalSearchOpen(true); }, icon: IconSearch },
      { label: "Open App Launcher", action: () => { setCommandPaletteOpen(false); setAppLauncherOpen(true); }, icon: IconLayoutGrid },
      { label: "Open SOC Dashboard", action: () => openWindow("soc-dashboard", "SOC Dashboard", "/dashboard"), icon: IconShield },
      { label: "Open Knowledge Graph", action: () => openWindow("knowledge-graph", "Knowledge Graph", "/knowledge-graph"), icon: IconNetwork },
      { label: "Open Career Intel", action: () => openWindow("career-intel", "Career Intelligence", "/career-intelligence"), icon: IconChartBar },
      { label: "Open Projects", action: () => openWindow("projects", "Projects", "/projects"), icon: IconCode },
      { label: "Open Wiki", action: () => openWindow("wiki", "Wiki", "/wiki"), icon: IconBook },
      { label: "Open GitHub", action: () => openWindow("github", "GitHub", "/github-intelligence"), icon: IconBrandGithub },
      { label: "Open CTF", action: () => openWindow("ctf", "CTF Command Center", "/ctf-command-center"), icon: IconFlag },
      { label: "Open Lab", action: () => openWindow("lab", "Home Lab", "/cyber-lab"), icon: IconServer },
      { label: "Open Architecture Studio", action: () => openWindow("architecture", "Architecture Studio", "/security-architect"), icon: IconLock },
      { label: "Open Project Architect", action: () => openWindow("architect", "Project Architect", "/project-architect"), icon: IconDatabase },
    ];
    if (!query) return base;
    const q = query.toLowerCase();
    return base.filter((c) => c.label.toLowerCase().includes(q));
  }, [query, openWindow, setCommandPaletteOpen, setGlobalSearchOpen, setAppLauncherOpen]);

  useEffect(() => { setIdx(0); }, [query]);

  const execute = (cmd: typeof commands[0]) => { cmd.action(); setCommandPaletteOpen(false); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-md bg-gray-950/90 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <IconCommand size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && commands[idx]) execute(commands[idx]); if (e.key === "ArrowDown") setIdx((i) => Math.min(i + 1, commands.length - 1)); if (e.key === "ArrowUp") setIdx((i) => Math.max(0, i - 1)); }}
              placeholder="Type a command..." autoFocus
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none"
            />
          </div>
        </div>
        <div className="max-h-72 overflow-auto p-2 space-y-0.5">
          {commands.map((cmd, i) => (
            <button key={cmd.label} onClick={() => execute(cmd)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${i === idx ? "bg-cyan-500/20 text-white" : "hover:bg-white/5 text-gray-300"}`}
            >
              <cmd.icon size={16} className="text-cyan-400" />
              <span className="text-sm">{cmd.label}</span>
            </button>
          ))}
          {commands.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No commands found</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Global Search ──────────────────────────────────────────────────────

function GlobalSearch() {
  const { setGlobalSearchOpen, openWindow } = useOsStore();
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const res: { label: string; desc: string; icon: any; color: string; action: () => void }[] = [];
    OS_APPS.filter((a) => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)).forEach((a) => {
      res.push({ label: a.name, desc: a.desc, icon: a.icon, color: a.color, action: () => { openWindow(a.id, a.name, a.route); setGlobalSearchOpen(false); } });
    });
    return res;
  }, [query, openWindow, setGlobalSearchOpen]);

  useEffect(() => { setIdx(0); }, [query]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24"
      onClick={() => setGlobalSearchOpen(false)}
    >
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
        className="w-full max-w-lg bg-gray-950/90 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && results[idx]) results[idx].action(); if (e.key === "ArrowDown") setIdx((i) => Math.min(i + 1, results.length - 1)); if (e.key === "ArrowUp") setIdx((i) => Math.max(0, i - 1)); }}
              placeholder="Search portfolio..." autoFocus
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none"
            />
          </div>
        </div>
        <div className="max-h-72 overflow-auto p-2 space-y-0.5">
          {results.map((r, i) => (
            <button key={r.label} onClick={r.action}
              className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${i === idx ? "bg-cyan-500/20" : "hover:bg-white/5"}`}
            >
              <r.icon size={18} className={r.color} />
              <div className="min-w-0">
                <p className="text-sm text-white truncate">{r.label}</p>
                <p className="text-xs text-gray-500 truncate">{r.desc}</p>
              </div>
            </button>
          ))}
          {query && results.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No results for &ldquo;{query}&rdquo;</p>}
          {!query && <p className="text-sm text-gray-500 text-center py-4">Start typing to search across the portfolio</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Notification Center ────────────────────────────────────────────────

function NotificationCenter() {
  const { setNotificationCenterOpen, notifications, markNotificationRead, clearNotifications } = useOsStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/40 flex items-start justify-end pt-12"
      onClick={() => setNotificationCenterOpen(false)}
    >
      <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
        className="w-80 h-full bg-gray-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-semibold">Notifications</h2>
          <button onClick={clearNotifications} className="text-xs text-gray-500 hover:text-gray-300">Clear all</button>
        </div>
        <div className="space-y-1 p-2">
          {notifications.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No notifications</p>}
          {notifications.map((n) => (
            <div key={n.id} onClick={() => markNotificationRead(n.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${n.read ? "opacity-50" : "bg-white/5 hover:bg-white/10"}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white font-medium">{n.title}</p>
                {!n.read && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
              <p className="text-xs text-gray-600 mt-1">{n.time}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Control Center ─────────────────────────────────────────────────────

function ControlCenterQuick() {
  const { setControlCenterOpen, theme, setTheme, focusMode, setFocusMode, animationLevel, setAnimationLevel } = useOsStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/40 flex items-start justify-end pt-12"
      onClick={() => setControlCenterOpen(false)}
    >
      <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
        className="w-72 bg-gray-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">Control Center</h2>
          <IconWifi size={16} className="text-cyan-400" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: IconSun, label: "Theme", onClick: () => setTheme(theme === "dark-cyber" ? "liquid-glass" : "dark-cyber") },
            { icon: IconMoon, label: "Dark", onClick: () => setTheme("dark-cyber") },
            { icon: IconActivity, label: "Animations", onClick: () => setAnimationLevel(animationLevel === "full" ? "reduced" : "full") },
          ].map((b) => (
            <button key={b.label} onClick={b.onClick} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-center">
              <b.icon size={18} className="text-cyan-400 mx-auto mb-1" />
              <p className="text-xs text-gray-300">{b.label}</p>
            </button>
          ))}
        </div>

        <label className="flex items-center justify-between p-2 rounded-lg bg-white/5">
          <span className="text-xs text-gray-300">Focus Mode</span>
          <input type="checkbox" checked={focusMode} onChange={(e) => setFocusMode(e.target.checked)} className="accent-cyan-500" />
        </label>

        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400"><IconWifi size={12} className="inline mr-1" />Network</span>
            <span className="text-green-400">Connected</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400"><IconBattery size={12} className="inline mr-1" />Power</span>
            <span className="text-cyan-400">98%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400"><IconVolume size={12} className="inline mr-1" />Audio</span>
            <span className="text-gray-300">100%</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Widgets ────────────────────────────────────────────────────────────

function ClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i); }, []);
  return (
    <GlassCard glow="none" variant="small" className="h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-2xl font-bold text-white tabular-nums">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        <p className="text-xs text-gray-400">{time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</p>
      </div>
    </GlassCard>
  );
}

function StatsWidget() {
  const stats = useMemo(() => ({
    projects: "8",
    certs: "5",
    skills: "20+",
    ctf: "34",
  }), []);
  return (
    <GlassCard glow="none" variant="small" className="h-full">
      <div className="p-2 space-y-1">
        <p className="text-xs text-gray-400 font-medium">Portfolio Stats</p>
        <div className="grid grid-cols-4 gap-1 text-center">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k}>
              <p className="text-sm font-bold text-cyan-400">{v}</p>
              <p className="text-xs text-gray-500 uppercase">{k}</p>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function GithubWidget() {
  const repos = [
    { name: "cyber-nexus", stars: 12, lang: "TypeScript" },
    { name: "home-lab-iac", stars: 8, lang: "HCL" },
    { name: "soc-automation", stars: 5, lang: "Python" },
  ];
  return (
    <GlassCard glow="none" variant="small" className="h-full">
      <div className="p-2 space-y-1.5">
        <div className="flex items-center gap-1">
          <IconBrandGithub size={12} className="text-gray-400" />
          <p className="text-xs text-gray-400 font-medium">GitHub</p>
        </div>
        {repos.map((r) => (
          <div key={r.name} className="flex items-center justify-between">
            <span className="text-xs text-gray-300 truncate">{r.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{r.lang}</span>
              <span className="text-xs text-gray-500">★ {r.stars}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function PerfWidget() {
  const perf = useOsStore((s) => s.performanceHistory);
  const latest = perf[perf.length - 1];
  useEffect(() => {
    const i = setInterval(() => useOsStore.getState().recordPerformance(), 3000);
    return () => clearInterval(i);
  }, []);
  return (
    <GlassCard glow="none" variant="small" className="h-full">
      <div className="p-2 space-y-1">
        <div className="flex items-center gap-1">
          <IconCpu size={12} className="text-gray-400" />
          <p className="text-xs text-gray-400 font-medium">Performance</p>
        </div>
        {latest ? (
          <div className="grid grid-cols-3 gap-1 text-center">
            <div><p className="text-xs font-bold text-cyan-400">{latest.cpu}%</p><p className="text-xs text-gray-500">CPU</p></div>
            <div><p className="text-xs font-bold text-purple-400">{latest.mem}%</p><p className="text-xs text-gray-500">MEM</p></div>
            <div><p className="text-xs font-bold text-green-400">{latest.fps}</p><p className="text-xs text-gray-500">FPS</p></div>
          </div>
        ) : (
          <p className="text-xs text-gray-500">Initializing...</p>
        )}
        {perf.length > 1 && (
          <svg viewBox="0 0 80 20" className="w-full h-4">
            <polyline fill="none" stroke="rgba(6,182,212,0.5)" strokeWidth="1"
              points={perf.slice(-20).map((p, i) => `${(i / Math.min(perf.length, 20)) * 80},${20 - (p.cpu / 100) * 18}`).join(" ")}
            />
          </svg>
        )}
      </div>
    </GlassCard>
  );
}

// ─── Dock ───────────────────────────────────────────────────────────────

function Dock() {
  const { openWindow, dockApps, pinnedApps, toggleDockApp } = useOsStore();
  const windows = useOsStore((s) => s.windows);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const allDockApps = OS_APPS.filter((a) => dockApps.includes(a.id) || pinnedApps.includes(a.id));

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-end gap-1 px-2 py-1.5 rounded-2xl bg-gray-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
        {allDockApps.map((app) => {
          const isOpen = windows.some((w) => w.appId === app.id && !w.minimized);
          const isMinimized = windows.some((w) => w.appId === app.id && w.minimized);
          return (
            <div key={app.id} className="relative">
              <button onClick={() => openWindow(app.id, app.name, app.route)}
                onMouseEnter={() => setHovered(app.id)} onMouseLeave={() => { setHovered(null); setShowMenu(null); }}
                className={`relative p-2 rounded-xl transition-all duration-150 ${
                  hovered === app.id ? "bg-white/10 scale-110" : "bg-transparent"
                }`}
              >
                <app.icon size={24} className={app.color} />
                {(isOpen || isMinimized) && (
                  <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isMinimized ? "bg-gray-600" : "bg-cyan-400"}`} />
                )}
              </button>
              {hovered === app.id && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-gray-900 border border-white/10 whitespace-nowrap">
                  <p className="text-xs text-white">{app.name}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Taskbar ────────────────────────────────────────────────────────────

function Taskbar() {
  const { setAppLauncherOpen, setCommandPaletteOpen, setGlobalSearchOpen, setNotificationCenterOpen, setControlCenterOpen, windows, focusedWindow, focusWindow, minimizeWindow, restoreWindow, notifications } = useOsStore();
  const unread = notifications.filter((n) => !n.read).length;
  const [time, setTime] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(i); }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-10 z-30 bg-gray-950/80 backdrop-blur-2xl border-b border-white/10 flex items-center px-3 gap-1">
      <button onClick={() => setAppLauncherOpen(true)} className="p-2.5 rounded-lg hover:bg-white/10 transition-colors">
        <IconShield size={18} className="text-cyan-400" />
      </button>
      <button onClick={() => setCommandPaletteOpen(true)} title="Command Palette (Ctrl+K)" className="p-2.5 rounded-lg hover:bg-white/10 transition-colors hidden sm:block">
        <IconCommand size={16} className="text-gray-400" />
      </button>

      <div className="flex-1 flex items-center gap-0.5 px-2 overflow-hidden">
        {windows.filter((w) => !w.minimized).slice(0, 8).map((w) => {
          const app = OS_APPS.find((a) => a.id === w.appId);
          const isFocused = focusedWindow === w.id;
          return (
            <button key={w.id} onClick={() => isFocused ? minimizeWindow(w.id) : focusWindow(w.id)}
              className={`flex items-center gap-1.5 px-2 py-2 rounded text-xs transition-colors max-w-[140px] ${
                isFocused ? "bg-white/15 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
            >
              {app && <app.icon size={12} className={app.color} />}
              <span className="truncate">{w.title}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => setGlobalSearchOpen(true)} title="Search (Ctrl+F)" className="p-2.5 rounded-lg hover:bg-white/10 transition-colors">
          <IconSearch size={14} className="text-gray-400" />
        </button>
        <button onClick={() => setNotificationCenterOpen(true)} className="p-2.5 rounded-lg hover:bg-white/10 transition-colors relative">
          <IconBell size={14} className="text-gray-400" />
          {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-cyan-500 text-xs flex items-center justify-center text-white font-bold">{unread}</span>}
        </button>
        <button onClick={() => setControlCenterOpen(true)} className="p-2.5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5">
          <IconWifi size={12} className="text-green-400" />
          <span className="text-xs text-gray-300 tabular-nums">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Desktop Icons ──────────────────────────────────────────────────────

function DesktopIcons() {
  const { openWindow } = useOsStore();
  const desktopApps = [
    { id: "soc-dashboard", name: "SOC Dashboard", icon: IconShield, color: "text-cyan-400" },
    { id: "knowledge-graph", name: "Knowledge Graph", icon: IconNetwork, color: "text-purple-400" },
    { id: "terminal", name: "Terminal", icon: IconTerminal, color: "text-green-400" },
    { id: "files", name: "Files", icon: IconFolder, color: "text-cyan-400" },
    { id: "settings", name: "Settings", icon: IconSettings, color: "text-gray-400" },
    { id: "wiki", name: "Wiki", icon: IconBook, color: "text-blue-400" },
  ];
  return (
    <div className="absolute left-4 top-14 flex flex-col gap-1">
      {desktopApps.map((app) => (
        <button key={app.id} onDoubleClick={() => openWindow(app.id, app.name)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors w-48"
        >
          <app.icon size={20} className={app.color} />
          <span className="text-xs text-gray-300 truncate">{app.name}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Workspace Switcher ─────────────────────────────────────────────────

function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, switchWorkspace } = useOsStore();
  return (
    <div className="absolute top-14 right-4 flex gap-1">
      {workspaces.map((ws) => (
        <button key={ws.id} onClick={() => switchWorkspace(ws.id)}
          className={`px-2 py-2 rounded text-xs border transition-colors ${
            activeWorkspace === ws.id ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-300" : "border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/30"
          }`}
        >{ws.name}</button>
      ))}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────

export default function CyberOsPage() {
  const { showBoot, booted, desktopReady, windows, commandPaletteOpen, globalSearchOpen, notificationCenterOpen, controlCenterOpen, appLauncherOpen, theme } = useOsStore();
  const themeGradient = THEME_BG[theme] || THEME_BG["liquid-glass"];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        useOsStore.setState({ commandPaletteOpen: false, globalSearchOpen: false, notificationCenterOpen: false, controlCenterOpen: false, appLauncherOpen: false });
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useOsStore.setState((s) => ({ commandPaletteOpen: !s.commandPaletteOpen }));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        useOsStore.setState((s) => ({ globalSearchOpen: !s.globalSearchOpen }));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (showBoot) {
    return (
      <div className="fixed inset-0 z-[9999]">
        <AnimatePresence>
          <BootScreen />
        </AnimatePresence>
      </div>
    );
  }

  if (!booted || !desktopReady) {
    return <div className="fixed inset-0 bg-black" />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Wallpaper */}
      <div className={`absolute inset-0 bg-gradient-to-br ${themeGradient}`} />

      {/* Desktop Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-cyan-500/20"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar />

      {/* Desktop Icons */}
      <DesktopIcons />

      {/* Workspace Switcher */}
      <WorkspaceSwitcher />

      {/* Widgets */}
      <div className="absolute right-4" style={{ top: 100 }}>
        <div className="flex flex-col gap-2">
          <div style={{ width: 220, height: 90 }}><ClockWidget /></div>
          <div style={{ width: 220, height: 70 }}><StatsWidget /></div>
          <div style={{ width: 220, height: 100 }}><GithubWidget /></div>
          <div style={{ width: 220, height: 80 }}><PerfWidget /></div>
        </div>
      </div>

      {/* Windows */}
      <div className="absolute inset-0 pt-10" style={{ bottom: DOCK_SIZE + 8 }}>
        <AnimatePresence>
          {windows.map((win) => (
            <OsWindow key={win.id} win={win} />
          ))}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <Dock />

      {/* Overlays */}
      <AnimatePresence>
        {appLauncherOpen && <AppLauncher />}
        {commandPaletteOpen && <CommandPalette />}
        {globalSearchOpen && <GlobalSearch />}
        {notificationCenterOpen && <NotificationCenter />}
        {controlCenterOpen && <ControlCenterQuick />}
      </AnimatePresence>
    </div>
  );
}
