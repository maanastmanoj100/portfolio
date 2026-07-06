"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { stagger as staggerConfig, fadeInUp } from "@/lib/animation";

interface StaggerProps {
  children: ReactNode;
  delay?: number;
  staggerDelay?: "fast" | "normal" | "slow";
  className?: string;
}

export function Stagger({ children, delay = 0, staggerDelay = "normal", className }: StaggerProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay, ...staggerConfig[staggerDelay] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}
