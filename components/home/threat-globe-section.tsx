"use client";

import { motion } from "framer-motion";
import { AttackGlobe } from "@/components/three/globe";

export function ThreatGlobeSection() {
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
          <span className="text-xs text-cyan font-mono tracking-wider uppercase">.global</span>
          <h2 className="text-3xl sm:text-4xl font-light text-soft-white mt-2">
            Global Threat <span className="text-gradient">Map</span>
          </h2>
          <p className="text-soft-white/50 mt-2 max-w-lg text-sm">
            Real-time visualization of global cyber threats and attack vectors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden glass border border-border/50"
        >
          <AttackGlobe />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
              <span className="text-xs text-soft-white/40 font-mono">12,847 threats blocked today</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-soft-white/30 font-mono">
              <span>🌐 50+ countries</span>
              <span>⚡ Real-time</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
