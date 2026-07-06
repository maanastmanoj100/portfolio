"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { IconBrandGithub, IconExternalLink, IconFileText } from "@tabler/icons-react";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="h-full flex flex-col overflow-hidden" glow="cyan" intensity="medium">
        <div className={cn("relative p-8 bg-gradient-to-br", project.gradient)}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-soft-white/30 font-mono">{project.category}</span>
              <h3 className="text-2xl font-semibold text-soft-white mt-1">{project.title}</h3>
            </div>
            <div className="flex gap-2">
              {project.links.github && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-black/20 border border-white/10 text-soft-white/60 hover:text-cyan hover:border-cyan/30 transition-all">
                  <IconBrandGithub size={16} />
                </a>
              )}
              {project.links.live && (
                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-black/20 border border-white/10 text-soft-white/60 hover:text-cyan hover:border-cyan/30 transition-all">
                  <IconExternalLink size={16} />
                </a>
              )}
              {project.links.case_study && (
                <a href={project.links.case_study} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-black/20 border border-white/10 text-soft-white/60 hover:text-cyan hover:border-cyan/30 transition-all">
                  <IconFileText size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-sm text-soft-white/60 leading-relaxed mb-4 flex-1">{project.longDescription}</p>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-soft-white/50 border border-white/10 font-mono">
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/50">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="text-lg font-semibold text-soft-white">{metric.value}</div>
                <div className="text-xs text-soft-white/30 font-mono">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
