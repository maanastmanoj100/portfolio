"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { IconArrowLeft, IconBrain } from "@tabler/icons-react";
import Link from "next/link";
import type { Skill } from "@/types";

export function SkillDetailPage({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const [skill, setSkill] = useState<Skill | null>(null);

  useEffect(() => {
    slugPromise.then((p) => {
      const slug = p.slug.replace(/-/g, " ");
      const found = skills.find((s) => s.name.toLowerCase() === slug);
      if (found) setSkill(found);
    });
  }, [slugPromise]);

  if (!skill) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
          <div className="text-soft-white/30 text-sm">Loading skill details...</div>
        </div>
      </PageTransition>
    );
  }

  const relatedProjects = projects.filter((p) =>
    p.tags.some((t) => t.toLowerCase().includes(skill.name.toLowerCase()))
  );

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link href="/skills">
            <Button variant="ghost" size="sm" className="mb-8">
              <IconArrowLeft size={16} />
              Back to Skills
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="primary">{skill.category}</Badge>
              <span className="text-xs text-soft-white/30 font-mono">{skill.level}% proficiency</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-soft-white mb-3">{skill.name}</h1>
            <p className="text-lg text-soft-white/60 mb-6">{skill.description}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <GlassCard className="p-6" glow="cyan" intensity="medium">
                <h2 className="text-sm font-semibold text-soft-white mb-4">Proficiency</h2>
                <div className="h-4 rounded-full bg-white/5 overflow-hidden mb-6">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${skill.color}40, ${skill.color})`,
                      width: `${skill.level}%`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <h2 className="text-sm font-semibold text-soft-white mb-3">Related Projects</h2>
                {relatedProjects.length > 0 ? (
                  <div className="space-y-2">
                    {relatedProjects.map((p) => (
                      <Link key={p.id} href={`/projects/${p.id}`}>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="text-sm text-soft-white">{p.title}</div>
                          <div className="text-xs text-soft-white/40 mt-0.5">{p.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-soft-white/40">No directly related projects listed.</p>
                )}
              </GlassCard>
            </div>

            <div className="space-y-4">
              <GlassCard className="p-5" glow="purple" intensity="low">
                <div className="flex items-center gap-2 mb-3">
                  <IconBrain size={16} className="text-purple" />
                  <h3 className="text-sm font-semibold text-soft-white">Skill Info</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-soft-white/40">Category:</span>{" "}
                    <span className="text-soft-white/80 capitalize">{skill.category}</span>
                  </div>
                  <div>
                    <span className="text-soft-white/40">Level:</span>{" "}
                    <span className="text-soft-white/80">{skill.level}%</span>
                  </div>
                  <div className="pt-2">
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: skill.color, width: `${skill.level}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>

              {skill.tools && skill.tools.length > 0 && (
                <GlassCard className="p-5" glow="blue" intensity="low">
                  <h3 className="text-sm font-semibold text-soft-white mb-3">Tools</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.tools.map((tool) => (
                      <Badge key={tool} size="sm">{tool}</Badge>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
