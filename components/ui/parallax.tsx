"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  as?: "div" | "section";
}

export function Parallax({ children, speed = 0.5, className, as: Tag = "div" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 60, speed * -60]);

  const Component = motion.create(Tag);

  return (
    <Component ref={ref} style={{ y }} className={className}>
      {children}
    </Component>
  );
}
