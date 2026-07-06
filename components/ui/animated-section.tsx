"use client";

import { motion } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMouseStore } from "@/stores/mouse-store";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export function AnimatedSection({ children, className, delay = 0, id }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMouseStore((s) => s.normalizedX);

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative", className)}
    >
      {children}
    </motion.section>
  );
}
