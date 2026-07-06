"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { ProjectCard } from "./project-card";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

const categories = ["all", "ai", "web3", "infrastructure", "compliance", "redteam", "research"];

export function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

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
            <span className="text-xs text-cyan font-mono tracking-wider uppercase">.projects</span>
            <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
              Security <span className="text-gradient font-medium">Projects</span>
            </h1>
            <p className="text-soft-white/50 mt-3 max-w-xl text-sm">
              Award-winning cybersecurity solutions spanning AI, blockchain, infrastructure, and more.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2.5 text-xs rounded-xl border transition-all font-mono",
                  activeCategory === cat
                    ? "bg-cyan/10 border-cyan/30 text-cyan"
                    : "bg-transparent border-white/10 text-soft-white/40 hover:text-soft-white/60 hover:border-white/20"
                )}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
