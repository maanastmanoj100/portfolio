"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootSteps = [
  { label: "Initializing Secure Workspace...", duration: 600 },
  { label: "Loading Threat Intelligence...", duration: 500 },
  { label: "Connecting AI Assistant...", duration: 400 },
  { label: "Synchronizing Security Dashboard...", duration: 500 },
  { label: "Verifying Digital Identity...", duration: 400 },
  { label: "Loading Projects...", duration: 300 },
];

const TOTAL_BASE_MS = bootSteps.reduce((acc, s) => acc + s.duration, 0);

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const finish = useCallback(() => {
    setSkipped(true);
    setTimeout(onComplete, 600);
  }, [onComplete]);

  useEffect(() => {
    if (skipped) return;
    let i = 0;
    const tick = () => {
      if (i < bootSteps.length) {
        setStep(i);
        i++;
        setTimeout(tick, bootSteps[i - 1].duration);
      } else {
        setReady(true);
        setTimeout(onComplete, 800);
      }
    };
    tick();
    return () => { i = bootSteps.length + 1; };
  }, [skipped, onComplete]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "Escape") finish();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [finish]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08090c]"
      >
        <div className="relative flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#00b4d8] animate-pulse-glow" />
              <span className="text-xs font-mono text-[#8e92a0] tracking-widest uppercase">Cyber Nexus v2.0</span>
            </div>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[rgba(0,180,216,0.3)] to-transparent" />
          </motion.div>

          <div className="flex flex-col gap-1.5 min-w-[280px]">
            {bootSteps.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: i <= step ? 1 : 0.25,
                  x: i <= step ? 0 : -8,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-4 flex justify-center">
                  {i < step ? (
                    <svg className="w-3.5 h-3.5 text-[#10b981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : i === step ? (
                    <div className="w-3 h-3 rounded-full border-2 border-[#00b4d8] border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5a5e6e]" />
                  )}
                </div>
                <span
                  className={`text-sm font-mono transition-colors duration-300 ${
                    i < step
                      ? "text-[#8e92a0]"
                      : i === step
                        ? "text-[#e4e8f0]"
                        : "text-[#5a5e6e]"
                  }`}
                >
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-3"
          >
            {!ready && (
              <button
                onClick={finish}
                className="text-xs font-mono text-[#5a5e6e] hover:text-[#8e92a0] transition-colors tracking-wider uppercase"
              >
                Skip &mdash; Press Space
              </button>
            )}
          </motion.div>

          {ready && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-mono text-[#00b4d8] tracking-wider"
            >
              <span className="typing-cursor">Cyber Nexus Ready</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
