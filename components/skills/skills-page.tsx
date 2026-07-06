"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { skills } from "@/data/skills";
import { cn } from "@/lib/utils";
import { SkillGalaxy } from "./skill-galaxy";
import { IconBrain, IconShield, IconCloud, IconSearch, IconCode, IconRobot } from "@tabler/icons-react";

const categoryConfig = {
  offensive: { label: "Offensive Security", icon: IconShield, color: "from-red-500/20 to-orange-500/20", border: "border-red-500/30" },
  defensive: { label: "Defensive Security", icon: IconShield, color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/30" },
  cloud: { label: "Cloud Security", icon: IconCloud, color: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/30" },
  forensics: { label: "Digital Forensics", icon: IconSearch, color: "from-rose-500/20 to-red-500/20", border: "border-rose-500/30" },
  programming: { label: "Programming", icon: IconCode, color: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" },
  ai: { label: "AI & Machine Learning", icon: IconRobot, color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30" },
};

export function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const categories = Object.entries(categoryConfig);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="text-xs text-purple font-mono tracking-wider uppercase">.skills</span>
            <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
              Technical <span className="text-gradient font-medium">Expertise</span>
            </h1>
            <p className="text-soft-white/50 mt-3 max-w-xl text-sm">
              Comprehensive skill set spanning offensive security, defensive operations, and engineering.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <SkillGalaxy />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {categories.map(([key, config]) => {
              const Icon = config.icon;
              const count = skills.filter((s) => s.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key === activeCategory ? "all" : key)}
                  className={cn(
                    "relative p-4 rounded-xl border text-left transition-all",
                    activeCategory === key
                      ? cn(config.border, "bg-white/5")
                      : "border-white/5 bg-transparent hover:border-white/10"
                  )}
                >
                  <Icon size={18} className={cn("mb-2", activeCategory === key ? "text-cyan" : "text-soft-white/40")} />
                  <div className="text-xs font-medium text-soft-white">{config.label}</div>
                  <div className="text-xs text-soft-white/30 font-mono mt-0.5">{count} skills</div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <GlassCard className="p-5" glow="blue" intensity="low">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-soft-white">{skill.name}</span>
                    <span className="text-xs text-soft-white/40 font-mono">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-3">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${skill.color}40, ${skill.color})`,
                        width: `${skill.level}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <p className="text-xs text-soft-white/40 leading-relaxed">{skill.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
