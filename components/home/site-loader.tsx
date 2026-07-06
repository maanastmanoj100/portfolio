"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_PHASES = [
  { text: "Initializing secure workspace", duration: 500 },
  { text: "Loading threat intelligence", duration: 400 },
  { text: "Calibrating defense systems", duration: 600 },
  { text: "Establishing encrypted channel", duration: 500 },
  { text: "Synchronizing security stack", duration: 400 },
  { text: "System ready", duration: 300 },
];

export function SiteLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Phase progression
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i < BOOT_PHASES.length) {
        setPhase(i);
        i++;
        setTimeout(tick, BOOT_PHASES[i - 1].duration);
      } else {
        setReady(true);
        setTimeout(() => onComplete(), 800);
      }
    };
    tick();
    return () => { cancelled = true; };
  }, [onComplete]);

  // Smooth progress fill
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + (100 - prev) * 0.035 + 0.5;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#08090c] overflow-hidden"
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(0,180,216,0.3) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(0,180,216,0.3) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px rounded-full bg-cyan-400/30"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{
            y: [0, -20 - Math.random() * 20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "conic-gradient(from 0deg, transparent, rgba(0,180,216,0.12), transparent, rgba(139,92,246,0.12), transparent)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{ background: "conic-gradient(from 180deg, transparent, rgba(0,180,216,0.08), transparent, rgba(139,92,246,0.08), transparent)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-purple-500/10 to-blue-500/15 border border-cyan-500/25 flex items-center justify-center backdrop-blur-sm">
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <motion.path
                  d="M18 2L33 10.5V25.5L18 34L3 25.5V10.5L18 2Z"
                  stroke="url(#loader-grad)"
                  strokeWidth="1.5"
                  fill="rgba(0,180,216,0.06)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path
                  d="M18 10L26 14.5V23.5L18 28L10 23.5V14.5L18 10Z"
                  stroke="rgba(0,180,216,0.35)"
                  strokeWidth="1"
                  fill="rgba(0,180,216,0.03)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="loader-grad" x1="3" y1="2" x2="33" y2="34">
                    <stop offset="0%" stopColor="#00b4d8" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-cyan-400 tracking-[0.25em] uppercase">Cyber Nexus</span>
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        </motion.div>

        {/* Status */}
        <div className="h-4 flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-xs font-mono text-[#8e92a0]"
            >
              {BOOT_PHASES[Math.min(phase, BOOT_PHASES.length - 1)].text}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >_</motion.span>
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Progress */}
        <div className="w-48 sm:w-56">
          <div className="relative h-[3px] rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, rgba(0,180,216,0.5), rgba(139,92,246,0.5))",
              }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 w-16 rounded-full blur-md"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, rgba(0,180,216,0.2), rgba(139,92,246,0.2))",
              }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#5a5e6e] text-right mt-1">
            {Math.min(Math.round(progress), 100)}%
          </div>
        </div>

        {/* Skip */}
        {!ready && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={onComplete}
            className="text-[10px] font-mono text-[#5a5e6e] hover:text-[#8e92a0] transition-colors tracking-widest uppercase"
          >
            Skip
          </motion.button>
        )}

        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-cyan-400"
          >
            <span className="typing-cursor">Entering Nexus</span>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 text-[9px] font-mono text-[#5a5e6e]">
        SECURE v2.0
      </div>
    </motion.div>
  );
}
