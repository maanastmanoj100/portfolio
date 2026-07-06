"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { threatFeed } from "@/data/threats";
import { IconShieldExclamation, IconAlertTriangle, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";

const severityConfig = {
  critical: { color: "text-red-400 border-red-500/30 bg-red-500/10", icon: IconShieldExclamation },
  high: { color: "text-orange-400 border-orange-500/30 bg-orange-500/10", icon: IconAlertTriangle },
  medium: { color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10", icon: IconAlertCircle },
  low: { color: "text-blue-400 border-blue-500/30 bg-blue-500/10", icon: IconInfoCircle },
};

export function ThreatFeed() {
  const [visibleThreats, setVisibleThreats] = useState(threatFeed.slice(0, 5));
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
      setVisibleThreats((prev) => {
        const next = [...threatFeed];
        const removed = prev[0];
        const idx = next.findIndex((t) => t.id === removed?.id);
        const newThreats = idx >= 0
          ? [...next.slice(idx + 1), ...next.slice(0, idx + 1)]
          : next;
        return newThreats.slice(0, 5);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 text-xs font-mono border border-red-500/20 text-red-400 rounded bg-red-500/5">
              {pulse ? "ACTIVE" : "MONITORING"}
            </span>
            <span className="text-xs text-soft-white/30 font-mono">Global Threat Feed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-soft-white">
            Threat Intelligence{" "}
            <span className="text-gradient">Feed</span>
          </h2>
          <p className="text-soft-white/50 mt-2 max-w-lg text-sm">
            Real-time threat intelligence aggregated from global security sources and SOC alerts.
          </p>
        </motion.div>

        <GlassCard className="overflow-hidden" glow="blue" intensity="low">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between text-xs text-soft-white/40 font-mono">
              <span className="w-20">Severity</span>
              <span className="flex-1">Threat</span>
              <span className="w-24 hidden sm:block">Source</span>
              <span className="w-20 hidden sm:block">Time</span>
              <span className="w-20 text-right">Origin</span>
            </div>
          </div>
          <div className="divide-y divide-border/30">
            <AnimatePresence mode="popLayout">
              {visibleThreats.map((threat) => {
                const config = severityConfig[threat.type];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={threat.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="p-3 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className={cn("flex items-center gap-2 w-20", config.color)}>
                      <Icon size={14} />
                      <span className="text-xs uppercase font-mono">{threat.type}</span>
                    </div>
                    <span className="flex-1 text-sm text-soft-white/80 truncate">{threat.title}</span>
                    <span className="w-24 text-xs text-soft-white/40 hidden sm:block font-mono">{threat.source}</span>
                    <span className="w-20 text-xs text-soft-white/30 hidden sm:block font-mono">{threat.timestamp}</span>
                    <span className="w-20 text-right text-sm flex items-center justify-end gap-1">
                      <span className="text-xs">{threat.flag}</span>
                      <span className="text-xs text-soft-white/40 font-mono">{threat.ip}</span>
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="p-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-soft-white/30 font-mono">
              {threatFeed.length} threats in last 24h
            </span>
            <span className="flex items-center gap-1.5 text-xs text-soft-white/30 font-mono">
              <span className={cn("w-1.5 h-1.5 rounded-full", pulse ? "bg-green-400" : "bg-green-400/50")} />
              Live
            </span>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
