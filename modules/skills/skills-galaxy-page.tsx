"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { SkillsGalaxyThree } from "./skills-galaxy-three";
import { SkillInfoPanel } from "./skill-info-panel";
import { galaxySkills, skillConstellations, learningPaths } from "@/data/skills-galaxy";
import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { useUIStore } from "@/stores/ui-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";
import {
  IconSearch, IconX, IconCode, IconShield, IconCloud,
  IconNetwork, IconDeviceDesktop, IconGlobe, IconBrain, IconRobot,
  IconSettings, IconTools, IconEye,
  IconFilter, IconRoute, IconArrowRight,
} from "@tabler/icons-react";

const clusterIcons: Record<string, typeof IconCode> = {
  programming: IconCode,
  cybersecurity: IconShield,
  cloud: IconCloud,
  networking: IconNetwork,
  os: IconDeviceDesktop,
  web: IconGlobe,
  ai: IconBrain,
  automation: IconRobot,
  devops: IconSettings,
  forensics: IconSearch,
  "reverse-engineering": IconTools,
  osint: IconEye,
  mobile: IconDeviceDesktop,
};

const clusterColors: Record<string, string> = {
  programming: "#2563eb", cybersecurity: "#ef4444", cloud: "#ff9900",
  networking: "#06b6d4", os: "#fcc624", web: "#61dafb",
  ai: "#ff6f00", automation: "#6366f1", devops: "#f05032",
  forensics: "#f43f5e", "reverse-engineering": "#ec4899",
  osint: "#14b8a6", mobile: "#3ddc84",
};

function AnimatedCounter({ value, label, color }: { value: number; label: string; color: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl sm:text-3xl font-light tabular-nums" style={{ color }}>
        {display}+
      </div>
      <div className="text-xs font-mono text-foreground-tertiary mt-0.5 text-center">{label}</div>
    </div>
  );
}

export function SkillsGalaxyPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeClusters, setActiveClusters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showLearningPaths, setShowLearningPaths] = useState(false);
  const [activeLearningPath, setActiveLearningPath] = useState<string | null>(null);
  const recruiterMode = useUIStore((s) => s.recruiterMode);

  const toggleCluster = useCallback((clusterId: string) => {
    setActiveClusters((prev) =>
      prev.includes(clusterId)
        ? prev.filter((c) => c !== clusterId)
        : [...prev, clusterId]
    );
  }, []);

  const filteredSkills = useMemo(() => {
    let result = galaxySkills;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.cluster.toLowerCase().includes(q)
      );
    }
    if (activeClusters.length > 0) {
      result = result.filter((s) => activeClusters.includes(s.cluster));
    }
    return result;
  }, [searchQuery, activeClusters]);

  const stats = useMemo(() => ({
    languages: galaxySkills.filter((s) => s.cluster === "programming").length,
    tools: galaxySkills.filter((s) => s.cluster === "cybersecurity").length,
    frameworks: galaxySkills.filter((s) => ["web", "ai", "automation"].includes(s.cluster)).length,
    cloud: galaxySkills.filter((s) => s.cluster === "cloud").length,
    os: galaxySkills.filter((s) => s.cluster === "os").length,
    networking: galaxySkills.filter((s) => s.cluster === "networking").length,
    certs: certifications.length,
    projects: projects.length,
  }), []);

  const handleSelectSkill = useCallback((name: string) => {
    setSelectedSkill((prev) => prev === name ? null : name);
  }, []);

  const handleSearchResultClick = useCallback((name: string) => {
    setSearchQuery("");
    setSelectedSkill(name);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-purple font-mono tracking-wider uppercase">.skills</span>
              {recruiterMode && (
                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/20">Recruiter View</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-foreground">
              Skills <span className="text-gradient font-medium">Galaxy</span>
            </h1>
            <p className="text-foreground-tertiary text-xs mt-1.5 max-w-xl">
              Explore the technologies, programming languages, cybersecurity tools, frameworks, and concepts powering Cyber Nexus.
            </p>
          </motion.div>

          {!recruiterMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <AnimatedCounter value={stats.languages} label="Languages" color="#2563eb" />
              <AnimatedCounter value={stats.tools} label="Security Tools" color="#ef4444" />
              <AnimatedCounter value={stats.frameworks} label="Frameworks" color="#6366f1" />
              <AnimatedCounter value={stats.cloud} label="Cloud Tech" color="#ff9900" />
              <AnimatedCounter value={stats.os} label="OS" color="#fcc624" />
              <AnimatedCounter value={stats.networking} label="Networking" color="#06b6d4" />
              <AnimatedCounter value={stats.certs} label="Certifications" color="#8b5cf6" />
              <AnimatedCounter value={stats.projects} label="Projects" color="#22c55e" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4"
          >
            <div className="relative flex-1 max-w-md w-full">
              <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, tools, languages..."
                className="w-full h-9 pl-9 pr-8 text-xs bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-foreground-tertiary/50 focus:outline-none focus:border-cyan/30 focus:bg-white/10 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-white/10 text-foreground-tertiary">
                  <IconX size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-9 text-xs font-mono rounded-xl border transition-all",
                  showFilters || activeClusters.length > 0
                    ? "bg-cyan/10 border-cyan/30 text-cyan"
                    : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground hover:border-white/20"
                )}
              >
                <IconFilter size={12} />
                Filters
              </button>
              <button
                onClick={() => setShowLearningPaths(!showLearningPaths)}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-9 text-xs font-mono rounded-xl border transition-all",
                  showLearningPaths
                    ? "bg-purple/10 border-purple/30 text-purple"
                    : "bg-white/5 border-white/10 text-foreground-tertiary hover:text-foreground hover:border-white/20"
                )}
              >
                <IconRoute size={12} />
                Paths
              </button>
              {selectedSkill && (
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="flex items-center gap-1.5 px-3 h-9 text-xs font-mono rounded-xl border border-white/10 bg-white/5 text-foreground-tertiary hover:text-foreground hover:border-white/20 transition-all"
                >
                  <IconX size={12} />
                  Clear
                </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-4"
              >
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {skillConstellations.map((c) => {
                    const active = activeClusters.includes(c.id);
                    const Icon = clusterIcons[c.id] || IconCode;
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCluster(c.id)}
                        className={cn(
                          "flex items-center gap-1 text-xs font-mono px-2 py-1.5 rounded-lg border transition-all",
                          active
                            ? "border-current bg-current/10 text-current"
                            : "border-white/10 text-foreground-tertiary hover:text-foreground hover:border-white/20"
                        )}
                        style={active ? { color: clusterColors[c.id] || c.color } : undefined}
                      >
                        <Icon size={10} />
                        {c.label}
                      </button>
                    );
                  })}
                  {activeClusters.length > 0 && (
                    <button
                      onClick={() => setActiveClusters([])}
                      className="text-xs font-mono text-foreground-tertiary hover:text-foreground px-2 py-1.5"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showLearningPaths && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-3">Learning Paths</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {learningPaths.map((path) => (
                  <button
                    key={path.id}
                    onClick={() => setActiveLearningPath(activeLearningPath === path.id ? null : path.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all",
                      activeLearningPath === path.id
                        ? "bg-cyan/5 border-cyan/30"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-xs font-mono px-1.5 py-0.5 rounded",
                        path.difficulty === "beginner" ? "bg-green-500/10 text-green-500" :
                        path.difficulty === "intermediate" ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-red-500/10 text-red-500"
                      )}>
                        {path.difficulty}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-foreground">{path.title}</div>
                    <div className="text-xs text-foreground-tertiary mt-0.5">{path.description}</div>
                    {activeLearningPath === path.id && (
                      <div className="mt-3 space-y-1">
                        {path.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono">
                            <div className="w-4 h-4 rounded-full bg-cyan/10 text-cyan flex items-center justify-center text-xs font-bold">{i + 1}</div>
                            <span className="text-foreground">{step}</span>
                            {i < path.steps.length - 1 && <IconArrowRight size={8} className="text-foreground-tertiary" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={cn(
              "rounded-2xl overflow-hidden border",
              recruiterMode ? "h-[400px]" : "h-[500px] sm:h-[600px]",
              "bg-gradient-to-b from-black/40 to-transparent border-white/5"
            )}
          >
            <SkillsGalaxyThree
              selectedSkill={selectedSkill}
              hoveredSkill={hoveredSkill}
              searchQuery={searchQuery}
              activeClusters={activeClusters}
              onSelectSkill={handleSelectSkill}
              onHoverSkill={setHoveredSkill}
            />
          </motion.div>

          {searchQuery && filteredSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <div className="text-xs font-mono text-foreground-tertiary mb-2">Search Results ({filteredSkills.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {filteredSkills.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleSearchResultClick(s.name)}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono rounded-lg bg-white/5 hover:bg-white/10 text-foreground hover:text-cyan transition-all border border-white/10"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                    {s.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <SkillInfoPanel
            skillName={selectedSkill}
            onClose={() => setSelectedSkill(null)}
            onSelectSkill={handleSelectSkill}
          />

          {!selectedSkill && !recruiterMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8"
            >
              <h3 className="text-xs font-mono text-foreground-tertiary uppercase tracking-wider mb-4">Explore by Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {skillConstellations.map((c) => {
                  const Icon = clusterIcons[c.id] || IconCode;
                  const count = galaxySkills.filter((s) => s.cluster === c.id).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveClusters([c.id]);
                        setShowFilters(true);
                      }}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left border border-white/5 hover:border-white/20 group"
                    >
                      <Icon size={16} className="mb-1.5 transition-colors" style={{ color: clusterColors[c.id] }} />
                      <div className="text-xs font-medium text-foreground">{c.label}</div>
                      <div className="text-xs font-mono text-foreground-tertiary mt-0.5">{count} skills</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
