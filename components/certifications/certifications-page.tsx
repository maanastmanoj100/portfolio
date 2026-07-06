"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { certifications } from "@/data/certifications";
import { cn } from "@/lib/utils";
import { IconCertificate, IconExternalLink, IconStar, IconShieldCheck } from "@tabler/icons-react";

export function CertificationsPage() {
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
            <span className="text-xs text-cyan font-mono tracking-wider uppercase">.certifications</span>
            <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
              Professional <span className="text-gradient font-medium">Credentials</span>
            </h1>
            <p className="text-soft-white/50 mt-3 max-w-xl text-sm">
              Industry-recognized certifications validating expertise across security domains.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <GlassCard className="h-full flex flex-col" glow="purple" intensity="medium">
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20">
                        <IconShieldCheck size={20} className="text-purple" />
                      </div>
                      {cert.featured && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                          <IconStar size={10} className="text-yellow-400" fill="currentColor" />
                          <span className="text-xs text-yellow-400 font-mono">Featured</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-soft-white mb-1 leading-snug">{cert.name}</h3>
                    <p className="text-sm text-soft-white/50 mb-1">{cert.issuer}</p>
                    <p className="text-xs text-soft-white/30 font-mono mb-4">
                      Issued: {cert.date}
                      {cert.expires && ` · Expires: ${cert.expires}`}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-soft-white/50 border border-white/10 font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <a
                      href={`https://example.com/verify/${cert.credentialId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan/60 hover:text-cyan transition-colors"
                    >
                      <IconExternalLink size={12} />
                      Verify Credential
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
