"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);

  const posStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === "top" ? 4 : -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 ${posStyles[position]} px-2 py-1 text-xs font-mono whitespace-nowrap rounded-lg bg-[rgba(16,17,20,0.9)] border border-[rgba(255,255,255,0.06)] text-[var(--color-foreground-secondary)] backdrop-blur-xl pointer-events-none`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
