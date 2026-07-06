"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { experiences } from "@/data/experience";
import { cn } from "@/lib/utils";
import { IconDownload, IconBriefcase, IconSchool, IconCalendar, IconMapPin } from "@tabler/icons-react";

export function ResumePage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex items-start justify-between gap-4 flex-wrap"
          >
            <div>
              <span className="text-xs text-cyan font-mono tracking-wider uppercase">.resume</span>
              <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
                Professional <span className="text-gradient font-medium">Experience</span>
              </h1>
              <p className="text-soft-white/50 mt-3 max-w-xl text-sm">
                Security professional with 5+ years of experience in offensive and defensive security.
              </p>
            </div>
            <Button variant="primary">
              <IconDownload size={16} />
              Download PDF
            </Button>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan/50 via-purple/30 to-transparent" />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={`${exp.company}-${exp.role}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative pl-14"
                >
                  <div className="absolute left-[14px] top-1 w-[18px] h-[18px] rounded-full bg-deep-navy border-2 border-cyan/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-cyan" />
                  </div>

                  <GlassCard className="p-6" glow="cyan" intensity="low">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {exp.type === "work" ? (
                            <IconBriefcase size={14} className="text-cyan" />
                          ) : (
                            <IconSchool size={14} className="text-purple" />
                          )}
                          <span className="text-xs text-soft-white/40 font-mono">{exp.type}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-soft-white">{exp.role}</h3>
                        <p className="text-sm text-cyan/80">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-soft-white/40 font-mono shrink-0">
                        <IconCalendar size={12} />
                        {exp.period}
                      </div>
                    </div>

                    <p className="text-sm text-soft-white/60 mb-4">{exp.description}</p>

                    <ul className="space-y-2 mb-4">
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-soft-white/50">
                          <span className="text-cyan mt-1.5 shrink-0">
                            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                              <circle cx="3" cy="3" r="3" fill="currentColor" />
                            </svg>
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-soft-white/50 border border-white/10 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
