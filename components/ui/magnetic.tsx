"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
  disabled?: boolean;
}

export function Magnetic({ children, intensity = 0.15, className, disabled }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * intensity,
      y: (e.clientY - rect.top - rect.height / 2) * intensity,
    });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
