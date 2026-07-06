"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { NetworkGraph } from "./network-graph";
import { LoadingScreen } from "./loading-screen";
import { IconArrowRight, IconDownload, IconMail, IconCode, IconCertificate, IconBrain, IconClock, IconGitCommit, IconShieldCheck, IconActivity, IconTerminal2, IconRobot, IconBrandGithub, IconUserShield, IconFileText, IconBook } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

const titles = [
  "Cybersecurity Engineer",
  "Penetration Tester",
  "SOC Analyst",
  "Ethical Hacker",
];

const dashboardStats = [
  { label: "Projects", value: 18, icon: IconCode },
  { label: "Certificates", value: 9, icon: IconCertificate },
  { label: "Skills", value: 32, icon: IconBrain },
  { label: "Learning", value: 1, icon: IconClock, suffix: "yr" },
];

const activityFeed = [
  { action: "Repository Updated", detail: "cyber-nexus", time: "2 minutes ago", icon: IconGitCommit },
  { action: "Write-up Published", detail: "AD Attack Paths", time: "Yesterday", icon: IconFileText },
  { action: "TryHackMe Room", detail: "Steel Mountain", time: "Last Week", icon: IconShieldCheck },
  { action: "SOC Dashboard", detail: "System Healthy", time: "Online", icon: IconActivity },
];

const floatingWidgets = [
  { label: "Current Lab", value: "Active Directory", icon: IconCode, x: "left-[5%]", y: "top-[15%]", delay: 1.6 },
  { label: "Latest Project", value: "Threat Hunter", icon: IconShieldCheck, x: "right-[5%]", y: "top-[20%]", delay: 1.8 },
  { label: "GitHub Commits", value: "142 this month", icon: IconGitCommit, x: "left-[3%]", y: "top-[55%]", delay: 2.0 },
  { label: "Latest Article", value: "Zero-Day Analysis", icon: IconBook, x: "right-[4%]", y: "top-[60%]", delay: 2.2 },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1000;
          const step = Math.ceil(value / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
          observer.disconnect();
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function LeftPanel() {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center gap-5"
    >
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(0,180,216,0.2)] bg-[rgba(0,180,216,0.06)] text-xs text-[var(--color-accent)] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse-glow" />
          Available for Internship
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[var(--color-foreground)] leading-[1.1] mb-3">
          <span className="font-mono text-sm text-[var(--color-foreground-tertiary)] tracking-widest block mb-2">CYBER SECURITY</span>
          MAANAS T MANOJ
        </h1>

        <div className="h-8 flex items-center gap-2 mb-3">
          <span className="text-lg text-[var(--color-foreground-secondary)] font-light">—</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={titleIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-lg text-[var(--color-foreground)] font-medium"
            >
              {titles[titleIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        <p className="text-sm text-[var(--color-foreground-secondary)] leading-relaxed max-w-md">
          Building secure systems through offensive security, defensive engineering, and AI-powered automation.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
    </motion.div>
  );
}

function RightPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3"
    >
      <GlassCard variant="dashboard" className="p-4">
        <div className="text-xs font-mono text-[var(--color-foreground-tertiary)] tracking-wider uppercase mb-3">
          Cyber Overview
        </div>
        <div className="grid grid-cols-2 gap-3">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[var(--color-foreground-tertiary)]">
                  <Icon size={12} />
                  <span className="text-xs font-mono uppercase tracking-wider">{stat.label}</span>
                </div>
                <span className="text-2xl font-light text-[var(--color-foreground)] tabular-nums">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix ?? ""} />
                  {stat.suffix && <span className="text-xs text-[var(--color-foreground-tertiary)] ml-0.5">{stat.suffix.replace("yr", "")}</span>}
                  {!stat.suffix && <span className="text-xs text-[var(--color-foreground-tertiary)] ml-0.5">+</span>}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-foreground-tertiary)] font-mono uppercase tracking-wider">Status</span>
            <span className="flex items-center gap-1.5 text-[#10b981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              Available
            </span>
          </div>
        </div>
      </GlassCard>

      <GlassCard variant="small" className="p-3">
        <div className="text-xs font-mono text-[var(--color-foreground-tertiary)] tracking-wider uppercase mb-2">
          GitHub Activity
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "73%" }}
              transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple-accent)]"
            />
          </div>
          <span className="text-xs text-[var(--color-foreground-secondary)]">142/200</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-foreground-tertiary)]">
          <IconGitCommit size={10} />
          <span>42 commits this week</span>
        </div>
      </GlassCard>

      <GlassCard variant="small" className="p-3">
        <div className="text-xs font-mono text-[var(--color-foreground-tertiary)] tracking-wider uppercase mb-1">
          Current Focus
        </div>
        <p className="text-xs text-[var(--color-foreground-secondary)]">
          Cyber Threat Detection &amp; AI-driven SOC automation
        </p>
      </GlassCard>
    </motion.div>
  );
}

function FloatingWidgets() {
  return (
    <>
      {floatingWidgets.map((w) => {
        const Icon = w.icon;
        return (
          <motion.div
            key={w.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: w.delay, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute hidden xl:flex flex-col gap-1",
              w.x, w.y,
            )}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
              className="glass-card p-2.5 min-w-[130px]"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon size={10} className="text-[var(--color-accent)]" />
                <span className="text-xs font-mono text-[var(--color-foreground-tertiary)] tracking-wider uppercase">{w.label}</span>
              </div>
              <span className="text-xs text-[var(--color-foreground)]">{w.value}</span>
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}

function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      className="absolute bottom-32 left-1/2 -translate-x-1/2 hidden lg:block"
    >
      <GlassCard variant="small" className="p-3 min-w-[240px]">
        <div className="text-xs font-mono text-[var(--color-foreground-tertiary)] tracking-wider uppercase mb-2">
          Live Activity
        </div>
        <div className="flex flex-col gap-1.5">
          {activityFeed.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.action}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + i * 0.15 }}
                className="flex items-center gap-2"
              >
                <Icon size={10} className="text-[var(--color-foreground-tertiary)]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[var(--color-foreground)] truncate">{item.action}</span>
                    <span className="text-xs text-[var(--color-accent)] whitespace-nowrap">{item.time}</span>
                  </div>
                  <div className="text-xs text-[var(--color-foreground-tertiary)] truncate">{item.detail}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function QuickActions() {
  const ui = useUIStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.6 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2"
    >
      <div className="glass-card p-2 flex flex-col gap-1.5">
        <button
          onClick={() => ui.setHackerTerminalOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--color-foreground-tertiary)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          title="Open Terminal"
        >
          <IconTerminal2 size={16} />
        </button>
        <button
          onClick={() => ui.setAiAssistantOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--color-foreground-tertiary)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          title="AI Assistant"
        >
          <IconRobot size={16} />
        </button>
        <div className="w-full h-px bg-[rgba(255,255,255,0.06)]" />
        <a
          href="/resume"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--color-foreground-tertiary)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          title="Download Resume"
        >
          <IconDownload size={16} />
        </a>
        <a
          href="https://github.com/maanastmanoj"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--color-foreground-tertiary)] hover:text-[var(--color-foreground)] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          title="View GitHub"
        >
          <IconBrandGithub size={16} />
        </a>
        <div className="w-full h-px bg-[rgba(255,255,255,0.06)]" />
        <button
          onClick={() => ui.toggleRecruiterMode()}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--color-foreground-tertiary)] hover:text-[var(--color-accent)] hover:bg-[rgba(0,180,216,0.06)] transition-colors"
          title="Recruiter Mode"
        >
          <IconUserShield size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="text-xs font-mono text-[var(--color-foreground-tertiary)] tracking-widest uppercase">Scroll</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-foreground-tertiary)]">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {mounted && <LoadingScreen onComplete={handleLoadingComplete} />}

      <AnimatePresence>
        {!loading && (
          <motion.section
            ref={sectionRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 pb-24"
            style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          >
            <FloatingWidgets />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                <div className="lg:col-span-4">
                  <LeftPanel />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:col-span-4 flex items-center justify-center"
                >
                  <div className="w-full max-w-[320px] aspect-square">
                    <NetworkGraph />
                  </div>
                </motion.div>

                <div className="lg:col-span-4">
                  <RightPanel />
                </div>
              </div>
            </div>

            <ActivityFeed />
            <ScrollIndicator />
          </motion.section>
        )}
      </AnimatePresence>

      <QuickActions />
    </>
  );
}


