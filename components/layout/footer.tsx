"use client";

import Link from "next/link";
import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter, IconBrandYoutube, IconMail, IconShieldCheck } from "@tabler/icons-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-deep-navy/30 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20">
                <IconShieldCheck size={18} className="text-cyan" />
              </div>
              <span className="font-semibold text-gradient">Cyber Nexus</span>
            </Link>
            <p className="text-sm text-soft-white/50 max-w-md leading-relaxed">
              Cybersecurity professional specializing in penetration testing, incident response, and security architecture. 
              Building a safer digital world, one system at a time.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[
                { icon: IconBrandGithub, href: "https://github.com", label: "GitHub" },
                { icon: IconBrandLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: IconBrandTwitter, href: "https://twitter.com", label: "Twitter" },
                { icon: IconBrandYoutube, href: "https://youtube.com", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-soft-white/40 hover:text-cyan hover:bg-white/5 transition-all"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-soft-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {["Projects", "Skills", "Certifications"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-soft-white/50 hover:text-cyan transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-soft-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { label: "Resume", href: "/resume" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-soft-white/50 hover:text-cyan transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-soft-white/30">
            &copy; {currentYear} Cyber Nexus. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-soft-white/30">
            <span>Built with Next.js • Three.js • Framer Motion</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse-glow" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
