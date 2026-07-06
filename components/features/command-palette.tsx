"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import {
  IconHome,
  IconCode,
  IconBrain,
  IconCertificate,
  IconFileText,
  IconNews,
  IconMail,
  IconTerminal2,
  IconRobot,
  IconUserShield,
  IconMoon,
  IconDownload,
  IconSearch,
} from "@tabler/icons-react";

const commands = [
  { id: "home", label: "Go to Home", icon: IconHome, action: "/" },
  { id: "projects", label: "View Projects", icon: IconCode, action: "/projects" },
  { id: "skills", label: "Explore Skills", icon: IconBrain, action: "/skills" },
  { id: "certs", label: "View Certifications", icon: IconCertificate, action: "/certifications" },
  { id: "resume", label: "Open Resume", icon: IconFileText, action: "/resume" },
  { id: "blog", label: "Read Blog", icon: IconNews, action: "/blog" },
  { id: "contact", label: "Get in Touch", icon: IconMail, action: "/contact" },
  { id: "terminal", label: "Toggle Terminal", icon: IconTerminal2, action: "terminal" },
  { id: "ai", label: "Open AI Assistant", icon: IconRobot, action: "ai" },
  { id: "recruiter", label: "Toggle Recruiter Mode", icon: IconUserShield, action: "recruiter" },
  { id: "matrix", label: "Toggle Matrix Mode", icon: IconMoon, action: "matrix" },
  { id: "download", label: "Download Resume", icon: IconDownload, action: "download" },
  { id: "search", label: "Search Site", icon: IconSearch, action: "search" },
];

export function CommandPalette() {
  const app = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const executeCommand = useCallback((cmd: typeof commands[0]) => {
    app.setCommandPaletteOpen(false);
    setQuery("");
    switch (cmd.action) {
      case "terminal":
        app.setHackerTerminalOpen(true);
        break;
      case "ai":
        app.setAiAssistantOpen(true);
        break;
      case "recruiter":
        app.setRecruiterMode(!app.recruiterMode);
        break;
      case "matrix":
        app.setMatrixMode(!app.matrixMode);
        break;
      case "download":
        window.open("/resume", "_blank");
        break;
      case "search":
        app.setSearchOpen(true);
        break;
      default:
        router.push(cmd.action);
    }
  }, [app, router]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!app.commandPaletteOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        executeCommand(filtered[selectedIndex]);
      }
      if (e.key === "Escape") {
        app.setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [app.commandPaletteOpen, filtered, selectedIndex, executeCommand, app]);

  return (
    <AnimatePresence>
      {app.commandPaletteOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => app.setCommandPaletteOpen(false)} />
          <motion.div
            className="relative w-full max-w-lg glass rounded-2xl border border-border shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 p-4 border-b border-border/50">
              <IconSearch size={16} className="text-soft-white/30 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm text-soft-white outline-none placeholder:text-soft-white/20"
              />
              <kbd className="px-1.5 py-0.5 text-xs bg-white/5 rounded text-soft-white/30">ESC</kbd>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    i === selectedIndex ? "bg-cyan/10 text-cyan" : "text-soft-white/60 hover:bg-white/5"
                  }`}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <cmd.icon size={16} />
                  <span>{cmd.label}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-soft-white/30">No results found</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
