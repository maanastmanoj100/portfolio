"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { IconUserShield, IconX, IconStar, IconDownload, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RecruiterBanner() {
  const app = useApp();

  return (
    <AnimatePresence>
      {app.recruiterMode && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
        >
          <div className="recruiter-highlight glass rounded-2xl border px-6 py-4 shadow-2xl relative">
            <button
              onClick={() => app.setRecruiterMode(false)}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-deep-navy border border-border text-soft-white/40 hover:text-soft-white"
            >
              <IconX size={14} />
            </button>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <IconUserShield size={20} className="text-cyan" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-soft-white">Recruiter Mode Active</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <IconStar key={i} size={12} className="text-yellow-400" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-soft-white/50">
                    Highlighting key achievements and relevant experience for hiring managers.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/resume">
                  <Button variant="primary" size="sm">
                    <IconDownload size={14} />
                    Resume
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="sm">
                    <IconMail size={14} />
                    Contact
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
