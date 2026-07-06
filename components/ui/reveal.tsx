"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const directionVariants = {
  up: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

export function Reveal({ children, direction = "up", delay = 0, duration = 0.5, className, once = true, threshold = 0.1 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={directionVariants[direction]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
