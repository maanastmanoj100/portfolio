"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/layout/page-transition";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { IconMail, IconBrandGithub, IconBrandLinkedin, IconBrandTwitter, IconSend, IconMapPin, IconShieldCheck } from "@tabler/icons-react";

const contactMethods = [
  { icon: IconMail, label: "Email", value: "hello@cybernexus.dev", href: "mailto:hello@cybernexus.dev" },
  { icon: IconBrandGithub, label: "GitHub", value: "@cybernexus", href: "https://github.com" },
  { icon: IconBrandLinkedin, label: "LinkedIn", value: "Cyber Nexus", href: "https://linkedin.com" },
  { icon: IconBrandTwitter, label: "Twitter", value: "@cybernexus", href: "https://twitter.com" },
];

export function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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
            <span className="text-xs text-cyan font-mono tracking-wider uppercase">.contact</span>
            <h1 className="text-4xl sm:text-5xl font-light text-soft-white mt-2">
              Get in <span className="text-gradient font-medium">Touch</span>
            </h1>
            <p className="text-soft-white/50 mt-3 max-w-xl text-sm">
              Have a security challenge? Let&apos;s discuss how I can help protect your organization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GlassCard className="p-6 sm:p-8" glow="cyan" intensity="medium">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                      <IconShieldCheck size={32} className="text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-soft-white mb-2">Message Sent Successfully</h3>
                    <p className="text-sm text-soft-white/50">I&apos;ll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs text-soft-white/40 font-mono mb-1.5">Name</label>
                        <input
                          required
                          value={formState.name}
                          onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-soft-white outline-none focus:border-cyan/30 transition-colors placeholder:text-soft-white/20"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-soft-white/40 font-mono mb-1.5">Email</label>
                        <input
                          required
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-soft-white outline-none focus:border-cyan/30 transition-colors placeholder:text-soft-white/20"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-soft-white/40 font-mono mb-1.5">Subject</label>
                      <input
                        required
                        value={formState.subject}
                        onChange={(e) => setFormState((s) => ({ ...s, subject: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-soft-white outline-none focus:border-cyan/30 transition-colors placeholder:text-soft-white/20"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-soft-white/40 font-mono mb-1.5">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-soft-white outline-none focus:border-cyan/30 transition-colors placeholder:text-soft-white/20 resize-none"
                        placeholder="Tell me about your security needs..."
                      />
                    </div>
                    <Button type="submit" variant="primary">
                      <IconSend size={16} />
                      Send Message
                    </Button>
                  </form>
                )}
              </GlassCard>
            </div>

            <div className="space-y-4">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={method.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <a href={method.href} target="_blank" rel="noopener noreferrer">
                      <GlassCard className="p-4 flex items-center gap-4" glow="blue" intensity="low">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                          <Icon size={18} className="text-cyan" />
                        </div>
                        <div>
                          <div className="text-xs text-soft-white/40 font-mono">{method.label}</div>
                          <div className="text-sm text-soft-white">{method.value}</div>
                        </div>
                      </GlassCard>
                    </a>
                  </motion.div>
                );
              })}

              <GlassCard className="p-4" glow="purple" intensity="low">
                <div className="flex items-center gap-3">
                  <IconMapPin size={16} className="text-purple shrink-0" />
                  <div>
                    <div className="text-xs text-soft-white/40 font-mono">Location</div>
                    <div className="text-sm text-soft-white">Available Worldwide</div>
                    <div className="text-xs text-soft-white/30">Remote · EST Timezone</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
