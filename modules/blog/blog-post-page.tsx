"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/data/blog";
import { IconArrowLeft, IconClock, IconTag, IconCalendar } from "@tabler/icons-react";
import Link from "next/link";
import type { BlogPost } from "@/types";

export function BlogPostPage({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    slugPromise.then((p) => {
      const found = blogPosts.find((bp) => bp.slug === p.slug);
      if (found) setPost(found);
    });
  }, [slugPromise]);

  if (!post) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20 pb-20 flex items-center justify-center">
          <div className="text-soft-white/30 text-sm">Loading...</div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-8">
              <IconArrowLeft size={16} />
              Back to Blog
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-4">
              {post.featured && <Badge variant="primary" size="sm">Featured</Badge>}
              <Badge variant="default" size="sm">{post.category}</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-light text-soft-white mb-4 leading-tight">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-soft-white/40 font-mono mb-6">
              <span className="flex items-center gap-1.5"><IconCalendar size={14} />{post.date}</span>
              <span className="flex items-center gap-1.5"><IconClock size={14} />{post.readTime}</span>
            </div>

            <p className="text-lg text-soft-white/60 mb-8 leading-relaxed">{post.description}</p>

            <div className="flex flex-wrap gap-2 mb-10">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="default"><IconTag size={10} />{tag}</Badge>
              ))}
            </div>
          </motion.div>

          <GlassCard className="p-8" glow="cyan" intensity="medium">
            <article className="prose prose-invert max-w-none">
              <div className="space-y-6 text-soft-white/60 text-sm leading-relaxed">
                <p>
                  This article explores &ldquo;{post.title}&rdquo; in depth. In a production environment, this would contain
                  the full article content with rich formatting, code snippets, and interactive elements.
                </p>
                <h2 className="text-xl font-semibold text-soft-white mt-8 mb-4">Introduction</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                {post.references && (
                  <>
                    <h2 className="text-xl font-semibold text-soft-white mt-8 mb-4">References</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      {post.references.map((ref, i) => (
                        <li key={i} className="text-sm text-soft-white/50">{ref}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </article>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
