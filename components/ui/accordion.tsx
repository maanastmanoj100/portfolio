"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-[rgba(255,255,255,0.06)] last:border-0", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
      >
        <span>{title}</span>
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-3 text-sm text-[var(--color-foreground-secondary)]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
