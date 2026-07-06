"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
  "Initializing secure workspace",
  "Loading threat intelligence",
  "Calibrating defense systems",
  "Establishing encrypted channel",
  "Synchronizing security stack",
  "Ready",
];

const PARTICLE_COUNT = 40;

function randomParticle() {
  return {
    id: Math.random(),
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 3,
    duration: Math.random() * 4 + 3,
    opacity: Math.random() * 0.4 + 0.1,
  };
}

export function LoaderAnimation() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [particles] = useState(() => Array.from({ length: PARTICLE_COUNT }, randomParticle));
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(next, 100);
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setFadingOut(true), 400);
      return () => clearTimeout(t);
    }
  }, [progress]);

  useEffect(() => {
    const phaseTimers: NodeJS.Timeout[] = [];
    let current = 0;
    const advance = () => {
      if (current < phrases.length - 1) {
        current++;
        setPhase(current);
        phaseTimers.push(setTimeout(advance, 600 + Math.random() * 400));
      }
    };
    phaseTimers.push(setTimeout(advance, 800));
    return () => phaseTimers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {!fadingOut && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08090c] overflow-hidden"
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 180, 216, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 216, 0.3) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-cyan-400"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: p.opacity,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [p.opacity, p.opacity * 2, p.opacity],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          <div className="relative flex flex-col items-center gap-8 z-10">
            {/* Animated logo mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent, rgba(0,180,216,0.15), transparent, rgba(139,92,246,0.15), transparent)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              {/* Inner glow ring */}
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  background: "conic-gradient(from 180deg, transparent, rgba(0,180,216,0.1), transparent, rgba(139,92,246,0.1), transparent)",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              {/* Center icon */}
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-purple-500/10 to-blue-500/15 border border-cyan-500/25 flex items-center justify-center backdrop-blur-sm">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <motion.path
                      d="M18 2L33 10.5V25.5L18 34L3 25.5V10.5L18 2Z"
                      stroke="url(#logo-grad)"
                      strokeWidth="1.5"
                      fill="rgba(0,180,216,0.08)"
                      animate={{ pathLength: [0, 1] }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M18 10L26 14.5V23.5L18 28L10 23.5V14.5L18 10Z"
                      stroke="rgba(0,180,216,0.4)"
                      strokeWidth="1"
                      fill="rgba(0,180,216,0.04)"
                      animate={{ pathLength: [0, 1] }}
                      transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
                    />
                    <defs>
                      <linearGradient id="logo-grad" x1="3" y1="2" x2="33" y2="34">
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
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#00b4d8] tracking-[0.3em] uppercase">Cyber Nexus</span>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-[#10b981]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            </motion.div>

            {/* Status text */}
            <div className="h-5 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-mono text-[#8e92a0]"
                >
                  {phrases[phase]}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >_</motion.span>
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="w-48 sm:w-64">
              <div className="relative h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, rgba(0,180,216,0.6), rgba(139,92,246,0.6))",
                  }}
                />
                <motion.div
                  className="absolute inset-y-0 left-0 w-20 rounded-full blur-sm"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, rgba(0,180,216,0.3), rgba(139,92,246,0.3))",
                  }}
                />
              </div>
              <motion.div className="text-[10px] font-mono text-[#5a5e6e] text-right mt-1">
                {Math.round(progress)}%
              </motion.div>
            </div>
          </div>

          {/* Bottom right version */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-4 right-4 text-[9px] font-mono text-[#5a5e6e]"
          >
            SECURE v2.0
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
