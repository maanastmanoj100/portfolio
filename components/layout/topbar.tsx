"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { IconShieldCheck } from "@tabler/icons-react";

export function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const ui = useUIStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled ? "bg-deep-navy/60 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 touch-action-manipulation" style={{ minHeight: 44 }}>
            <div className="relative flex h-7 w-7 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-500/30 blur-sm" />
              <span className="relative text-base font-bold text-gradient">CN</span>
            </div>
            <span className="hidden sm:block text-xs font-semibold text-soft-white/70">
              Cyber Nexus
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => ui.setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs text-soft-white/30 border border-white/10 rounded-lg hover:border-white/20 transition-colors touch-action-manipulation"
              style={{ minHeight: 44 }}
            >
              <kbd className="text-xs">⌘K</kbd>
              <span>Commands</span>
            </button>
            <button
              onClick={() => ui.setCommandPaletteOpen(true)}
              className="flex sm:hidden items-center justify-center touch-action-manipulation"
              style={{ minWidth: 44, minHeight: 44 }}
              aria-label="Commands"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-soft-white/40">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <span className="flex items-center gap-1 text-xs text-soft-white/20 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-glow" />
              <span className="hidden sm:inline">v2.0</span>
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
