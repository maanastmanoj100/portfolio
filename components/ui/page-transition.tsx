"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { pageEnter } from "@/lib/animation";

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={pageEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
