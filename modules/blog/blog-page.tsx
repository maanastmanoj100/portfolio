"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/data/blog";
import { cn } from "@/lib/utils";
import { IconClock } from "@tabler/icons-react";
import Link from "next/link";

const categories = ["all", "research", "tutorial", "opinion", "case-study", "tooling"];

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

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
            <span className="text-xs text-cyan font-mono tracking-wider uppercase">.blog</span>
            <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
              Security <span className="text-gradient font-medium">Research</span>
            </h1>
            <p className="text-soft-white/50 mt-3 max-w-xl text-sm">
              Deep dives into cybersecurity research, tools, and industry analysis.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 text-xs rounded-xl border transition-all font-mono",
                  activeCategory === cat
                    ? "bg-cyan/10 border-cyan/30 text-cyan"
                    : "bg-transparent border-white/10 text-soft-white/40 hover:text-soft-white/60 hover:border-white/20"
                )}
              >
                {cat.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <GlassCard className="h-full flex flex-col" glow="cyan" intensity="low">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        {post.featured && <Badge variant="primary" size="sm">Featured</Badge>}
                        <Badge variant="default" size="sm">{post.category}</Badge>
                      </div>
                      <h3 className="text-base font-semibold text-soft-white mb-2 leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-soft-white/50 mb-4 flex-1 line-clamp-3">{post.description}</p>
                      <div className="flex items-center gap-3 text-xs text-soft-white/30 font-mono mb-3">
                        <span className="flex items-center gap-1"><IconClock size={12} />{post.readTime}</span>
                        <span>{post.date}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} size="sm">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
