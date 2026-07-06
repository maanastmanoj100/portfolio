"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMELINE, ATTACK_EVENTS, severityColors, getCountryByCode } from "./attack-map-data";
import type { AttackEvent as AttackEventType } from "./attack-map-data";
import { IconPlayerPlay, IconPlayerPause, IconPlayerTrackNext, IconPlayerTrackPrev, IconRadar } from "@tabler/icons-react";

export function AttackTimeline() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= TIMELINE.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  const handlePlay = () => setPlaying(!playing);
  const handlePrev = () => setCurrentIndex(Math.max(0, currentIndex - 1));
  const handleNext = () => setCurrentIndex(Math.min(TIMELINE.length - 1, currentIndex + 1));
  const handleReset = () => { setCurrentIndex(0); setPlaying(false); };

  const visibleEntries = TIMELINE.slice(0, currentIndex + 1);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase">Attack Timeline</span>
        <span className="text-xs font-mono text-foreground-tertiary">{currentIndex + 1} / {TIMELINE.length}</span>
      </div>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/60" />
        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
          {visibleEntries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <div
                className={`w-[15px] h-[15px] rounded-full border-2 shrink-0 mt-0.5 relative z-10 flex items-center justify-center ${
                  i === currentIndex ? "animate-pulse-glow bg-cyan/20 border-cyan" : "bg-white/5 border-border/60"
                }`}
              >
                {i === currentIndex && <div className="w-1.5 h-1.5 rounded-full bg-cyan" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${
                    entry.severity === "critical" ? "text-red-400" :
                    entry.severity === "high" ? "text-orange-400" :
                    entry.severity === "medium" ? "text-yellow-400" :
                    entry.severity === "low" ? "text-blue-400" : "text-foreground-tertiary"
                  }`}>
                    {entry.time}
                  </span>
                  {entry.attackId && (
                    <span className="text-xs font-mono text-cyan bg-cyan/10 px-1 py-0.5 rounded">{entry.attackId}</span>
                  )}
                </div>
                <p className="text-xs text-foreground mt-0.5">{entry.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30">
        <button onClick={handlePlay} className="flex items-center gap-1 text-xs font-mono px-2.5 py-2.5 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan hover:bg-cyan/20 transition-colors">
          {playing ? <IconPlayerPause size={12} /> : <IconPlayerPlay size={12} />}
          {playing ? "Pause" : "Play"}
        </button>
        <button onClick={handlePrev} disabled={currentIndex === 0} className="text-foreground-tertiary hover:text-foreground disabled:opacity-30 p-2.5 transition-colors">
          <IconPlayerTrackPrev size={14} />
        </button>
        <button onClick={handleNext} disabled={currentIndex >= TIMELINE.length - 1} className="text-foreground-tertiary hover:text-foreground disabled:opacity-30 p-2.5 transition-colors">
          <IconPlayerTrackNext size={14} />
        </button>
        <div className="flex-1" />
        <button onClick={handleReset} className="text-xs font-mono text-foreground-tertiary hover:text-foreground px-1.5 py-2">
          Reset
        </button>
      </div>
    </div>
  );
}

export function LiveEventFeed() {
  const [feed, setFeed] = useState<AttackEventType[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFeed([...ATTACK_EVENTS].reverse().slice(0, 8));
    const interval = setInterval(() => {
      const shuffled = [...ATTACK_EVENTS].sort(() => Math.random() - 0.5);
      setFeed(shuffled.slice(0, 8));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [feed]);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground-secondary font-mono tracking-wider uppercase">Live Events</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-glow" />
        </div>
        <span className="text-xs text-foreground-tertiary font-mono">{feed.length} active</span>
      </div>
      <div ref={feedRef} className="space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        <AnimatePresence mode="popLayout">
          {feed.map((event) => {
            const src = getCountryByCode(event.sourceCode);
            const dst = getCountryByCode(event.destCode);
            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.015] border border-border/30 hover:border-border/50 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: severityColors[event.severity] }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan">{event.id}</span>
                    <span className={`text-xs font-mono px-1 py-0.5 rounded ${
                      event.status === "active" ? "text-red-400 bg-red-500/10" :
                      event.status === "investigating" ? "text-yellow-400 bg-yellow-500/10" :
                      "text-green-400 bg-green-500/10"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="text-xs text-foreground truncate">{event.description}</div>
                  <div className="flex items-center gap-2 text-xs text-foreground-tertiary mt-0.5">
                    <span>{event.type}</span>
                    <span>·</span>
                    <span>{src?.flag ?? event.sourceCode} → {dst?.flag ?? event.destCode}</span>
                    <span>·</span>
                    <span>{event.protocol}:{event.port}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
