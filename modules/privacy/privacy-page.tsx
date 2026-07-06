"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";

export function PrivacyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <span className="text-xs text-cyan font-mono tracking-wider uppercase">.legal</span>
            <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
              Privacy <span className="text-gradient font-medium">Policy</span>
            </h1>
          </motion.div>

          <GlassCard className="p-8" glow="cyan" intensity="low">
            <div className="prose prose-invert max-w-none text-sm text-soft-white/60 space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-soft-white">Information We Collect</h2>
                <p>
                  This portfolio website collects minimal information to provide a better user experience. 
                  We may collect anonymous usage analytics including page views, interaction patterns, 
                  and feature usage to improve the portfolio.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-soft-white">How We Use Your Information</h2>
                <p>
                  Any information collected is used solely for:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Improving website performance and user experience</li>
                  <li>Analyzing which projects and content are most relevant to visitors</li>
                  <li>Responding to contact form inquiries</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-soft-white">Cookies & Tracking</h2>
                <p>
                  This website uses minimal local storage for theme preferences and settings. 
                  No third-party tracking cookies are used. Analytics data is anonymized and 
                  cannot be traced back to individual users.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-soft-white">Data Security</h2>
                <p>
                  All data transmitted through this website is encrypted using HTTPS. 
                  Contact form submissions are transmitted securely and stored only for 
                  the purpose of responding to your inquiry.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-soft-white">Your Rights</h2>
                <p>
                  You have the right to request access to, correction of, or deletion of 
                  any personal data collected. To exercise these rights, please use the 
                  contact form on this website.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-soft-white">Changes to This Policy</h2>
                <p>
                  This privacy policy may be updated periodically. The latest version 
                  will always be available at this URL. Last updated: January 2025.
                </p>
              </section>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
