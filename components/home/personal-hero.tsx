"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { IconArrowRight, IconDownload, IconMail, IconCode, IconCertificate, IconBrain, IconClock, IconBrandGithub, IconMapPin, IconUser } from "@tabler/icons-react";
import Link from "next/link";

const titles = [
  "Cybersecurity Engineer",
  "Penetration Tester",
  "SOC Analyst",
  "Ethical Hacker",
];

const stats = [
  { label: "Projects", value: 18, icon: IconCode },
  { label: "Certificates", value: 9, icon: IconCertificate },
  { label: "Skills", value: 32, icon: IconBrain },
  { label: "Experience", value: 1, icon: IconClock, suffix: "yr" },
];

export function PersonalHero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center pt-16 pb-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Photo + Identity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start"
          >
            {/* Profile Image */}
            <div className="relative mb-6 group">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {!imgError ? (
                  <img
                    src="/images/profile.jpg"
                    alt="Maanas T Manoj"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <IconUser size={80} className="text-cyan-400/60" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-glow" />
              </div>
            </div>

            {/* Name & Titles */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-xs text-cyan-400 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                Available for Opportunities
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-3">
                Maanas T Manoj
              </h1>

              <div className="h-8 flex items-center justify-center lg:justify-start gap-2 mb-3">
                <span className="text-lg text-foreground-secondary font-light">—</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titleIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg text-foreground font-medium"
                  >
                    {titles[titleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

              <p className="text-sm text-foreground-secondary leading-relaxed max-w-md mx-auto lg:mx-0 mb-6">
                Building secure systems through offensive security, defensive engineering, and AI-powered automation. Passionate about penetration testing, incident response, and security architecture.
              </p>

              <div className="flex items-center gap-2 text-xs text-foreground-tertiary font-mono justify-center lg:justify-start mb-6">
                <IconMapPin size={12} />
                <span>Kerala, India</span>
                <span className="mx-2">|</span>
                <IconBrandGithub size={12} />
                <span>maanastmanoj</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                <Link href="/projects">
                  <Button variant="primary" size="md" magnetic>
                    <IconCode size={16} />
                    Explore Projects
                  </Button>
                </Link>
                <Link href="/resume">
                  <Button variant="secondary" size="md" magnetic>
                    <IconDownload size={16} />
                    View Resume
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" size="md">
                    <IconMail size={16} />
                    Contact
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right: Stats + Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <GlassCard glow="none" className="p-6 sm:p-8">
              <div className="text-xs font-mono text-foreground-tertiary tracking-wider uppercase mb-5">
                Quick Overview
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <stat.icon size={18} className="text-cyan-400 mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-foreground">
                      {stat.value}{stat.suffix || ""}
                    </div>
                    <div className="text-xs text-foreground-tertiary font-mono mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  Dedicated cybersecurity professional with hands-on experience in penetration testing, SOC operations, and security automation. I build tools that make systems more resilient and share knowledge through detailed write-ups and open-source contributions.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Penetration Testing", "Incident Response", "Security Architecture", "Python", "TypeScript", "Go", "Cloud Security", "AI/ML"].map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-foreground-secondary font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { label: "Projects", href: "/projects", icon: IconCode },
                { label: "Certifications", href: "/certifications", icon: IconCertificate },
                { label: "Skills", href: "/skills", icon: IconBrain },
                { label: "Arcade", href: "/arcade", icon: IconArrowRight },
              ].map((link) => (
                <Link key={link.label} href={link.href}>
                  <GlassCard glow="none" className="p-3 flex items-center gap-2 hover:border-cyan-500/20 transition-all cursor-pointer">
                    <link.icon size={14} className="text-cyan-400 shrink-0" />
                    <span className="text-xs font-mono text-foreground-secondary">{link.label}</span>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
