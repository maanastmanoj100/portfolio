"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";
import { IconSearch, IconCode, IconBrain, IconFileText, IconNews } from "@tabler/icons-react";

const searchData = [
  { label: "Sentinel AI", href: "/projects", type: "Project", icon: IconCode },
  { label: "ChainGuard", href: "/projects", type: "Project", icon: IconCode },
  { label: "Penetration Testing", href: "/skills", type: "Skill", icon: IconBrain },
  { label: "Incident Response", href: "/skills", type: "Skill", icon: IconBrain },
  { label: "OSCP Certification", href: "/certifications", type: "Certification", icon: IconBrain },
  { label: "Security Resume", href: "/resume", type: "Resume", icon: IconFileText },
  { label: "Zero Trust Architecture", href: "/blog", type: "Blog", icon: IconNews },
  { label: "AI Threat Detection", href: "/blog", type: "Blog", icon: IconNews },
];

export function SearchModal() {
  const app = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = query
    ? searchData.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = useCallback((item: typeof searchData[0]) => {
    app.setSearchOpen(false);
    setQuery("");
    router.push(item.href);
  }, [app, router]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!app.searchOpen) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && results[selectedIndex]) handleSelect(results[selectedIndex]);
      if (e.key === "Escape") app.setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [app.searchOpen, results, selectedIndex, handleSelect, app]);

  return (
    <AnimatePresence>
      {app.searchOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => app.setSearchOpen(false)} />
          <motion.div
            className="relative w-full max-w-lg glass rounded-2xl border border-border shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 p-4 border-b border-border/50">
              <IconSearch size={16} className="text-soft-white/30 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, skills, articles..."
                className="flex-1 bg-transparent text-sm text-soft-white outline-none placeholder:text-soft-white/20"
              />
              <kbd className="px-1.5 py-0.5 text-xs bg-white/5 rounded text-soft-white/30">ESC</kbd>
            </div>
            {query && (
              <div className="max-h-64 overflow-y-auto p-2">
                {results.map((item, i) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      i === selectedIndex ? "bg-cyan/10 text-cyan" : "text-soft-white/60 hover:bg-white/5"
                    }`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <item.icon size={16} className="shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <span className="text-xs text-soft-white/30 font-mono">{item.type}</span>
                  </button>
                ))}
                {results.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-soft-white/30">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
