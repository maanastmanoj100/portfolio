"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconArrowRight, IconBrandGithub, IconExternalLink } from "@tabler/icons-react";

export function FeaturedProjects() {
  const featured = projects.slice(0, 3);

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
          <h2 className="text-3xl sm:text-4xl font-light text-soft-white">
            Featured{" "}
            <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-soft-white/50 mt-2 max-w-lg text-sm">
            Award-winning cybersecurity solutions that demonstrate expertise across multiple domains.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="h-full flex flex-col" glow="cyan" intensity="medium">
                <div className={cn("p-6 bg-gradient-to-br rounded-t-2xl", project.gradient)}>
                  <div className="h-32 flex items-end">
                    <h3 className="text-xl font-semibold text-soft-white">{project.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-soft-white/60 mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-soft-white/50 border border-white/10 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.links.github && (
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-soft-white/40 hover:text-cyan transition-colors">
                        <IconBrandGithub size={16} />
                      </a>
                    )}
                    {project.links.live && (
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-soft-white/40 hover:text-cyan transition-colors">
                        <IconExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link href="/projects">
            <Button variant="secondary">
              View All Projects
              <IconArrowRight size={16} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
