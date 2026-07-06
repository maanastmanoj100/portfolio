"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { IconShieldCheck, IconTarget, IconEye, IconLock } from "@tabler/icons-react";

const stats = [
  { label: "Years Experience", value: "6+" },
  { label: "Projects Completed", value: "50+" },
  { label: "Certifications", value: "12+" },
  { label: "CVEs Discovered", value: "15+" },
];

const values = [
  { icon: IconShieldCheck, title: "Integrity", description: "Ethical security practices with transparent reporting and responsible disclosure." },
  { icon: IconTarget, title: "Precision", description: "Meticulous attention to detail in every engagement, leaving no stone unturned." },
  { icon: IconEye, title: "Vigilance", description: "Constant awareness of emerging threats and evolving attack vectors." },
  { icon: IconLock, title: "Excellence", description: "Committed to the highest standards in security research and implementation." },
];

export function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="text-xs text-cyan font-mono tracking-wider uppercase">.about</span>
            <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
              About <span className="text-gradient font-medium">Cyber Nexus</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <GlassCard className="p-8" glow="cyan" intensity="medium">
                <p className="text-soft-white/70 leading-relaxed mb-4">
                  Cyber Nexus is a cybersecurity portfolio built by a seasoned security professional 
                  with over 6 years of experience in offensive and defensive security operations. 
                  The mission is to demonstrate expertise, share knowledge, and connect with 
                  organizations that value robust security practices.
                </p>
                <p className="text-soft-white/70 leading-relaxed mb-6">
                  From penetration testing Fortune 500 companies to architecting zero-trust 
                  networks, every project represents a commitment to excellence in cybersecurity. 
                  This platform showcases real-world security work, research, and tools built 
                  to solve complex security challenges.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                      <div className="text-xs text-soft-white/40 font-mono mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
            <div>
              <GlassCard className="p-6" glow="purple" intensity="medium">
                <h3 className="text-sm font-semibold text-soft-white mb-3">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="text-soft-white/40">Role:</span> <span className="text-soft-white/80">Security Engineer</span></div>
                  <div><span className="text-soft-white/40">Location:</span> <span className="text-soft-white/80">Remote · Worldwide</span></div>
                  <div><span className="text-soft-white/40">Timezone:</span> <span className="text-soft-white/80">EST (UTC-5)</span></div>
                  <div><span className="text-soft-white/40">Availability:</span> <Badge variant="success" dot pulse>Open to Work</Badge></div>
                  <div><span className="text-soft-white/40">Languages:</span> <span className="text-soft-white/80">English, Spanish</span></div>
                  <div><span className="text-soft-white/40">Clearance:</span> <span className="text-soft-white/80">Secret (Active)</span></div>
                </div>
              </GlassCard>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-light text-soft-white mb-6">
              Core <span className="text-gradient">Values</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <GlassCard className="p-5 h-full" glow="blue" intensity="low">
                      <Icon size={24} className="text-cyan mb-3" />
                      <h3 className="text-sm font-semibold text-soft-white mb-1">{v.title}</h3>
                      <p className="text-xs text-soft-white/50 leading-relaxed">{v.description}</p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
