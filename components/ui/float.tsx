"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";

interface FloatProps {
  children: ReactNode;
  amplitude?: number;
  speed?: number;
  delay?: number;
  className?: string;
}

export function Float({ children, amplitude = 6, speed = 4, delay = 0, className }: FloatProps) {
  const offset = useMemo(() => ({
    y: Array.from({ length: 3 }, () => (Math.random() - 0.5) * amplitude),
  }), []);

  return (
    <motion.div
      className={className}
      animate={{
        y: [offset.y[0], offset.y[0] - amplitude * 0.5, offset.y[0]],
      }}
      transition={{
        duration: speed + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay + Math.random() * 2,
      }}
    >
      {children}
    </motion.div>
  );
}
