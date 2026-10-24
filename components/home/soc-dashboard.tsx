"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { socMetrics } from "@/data/threats";
import { IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react";

function MetricCard({ metric, index }: { metric: typeof socMetrics[0]; index: number }) {
  const StatusIcon = metric.status === "up" ? IconTrendingUp : metric.status === "down" ? IconTrendingDown : IconMinus;
  const statusColor = metric.status === "up" ? "text-green-400" : metric.status === "down" ? "text-red-400" : "text-yellow-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="p-4 min-h-[80px]" glow="cyan" intensity="low">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-soft-white/40 font-mono">{metric.label}</span>
          <StatusIcon size={14} className={cn(statusColor)} />
        </div>
        <div className="flex items-end gap-2">
          <span className="text-xl sm:text-2xl font-semibold text-soft-white">{metric.value}</span>
          <span className={cn("text-xs mb-1", statusColor)}>
            {metric.change > 0 ? "+" : ""}{metric.change}%
          </span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", metric.status === "up" ? "bg-green-400/50" : "bg-cyan/50")}
            initial={{ width: 0 }}
            animate={{ width: `${50 + Math.abs(metric.change) * 3}%` }}
            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function SOCDashboard() {
  return (
    <section className="py-20 relative overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 overflow-x-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 text-xs font-mono border border-cyan/20 text-cyan rounded bg-cyan/5">
              LIVE
            </span>
            <span className="text-xs text-soft-white/30 font-mono">SOC Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-soft-white">
            Security Operations{" "}
            <span className="text-gradient">Center</span>
          </h2>
          <p className="text-soft-white/50 mt-2 max-w-lg text-sm">
            Real-time metrics from the security operations center monitoring 5,230+ systems worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {socMetrics.map((metric, i) => (
            <MetricCard key={metric.label} metric={metric} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
