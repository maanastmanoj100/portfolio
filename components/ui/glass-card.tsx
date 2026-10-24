"use client";

import { type HTMLAttributes, forwardRef, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardHover } from "@/lib/animation";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "purple" | "blue" | "green" | "amber" | "none";
  intensity?: "low" | "medium" | "high";
  as?: "div" | "button" | "a";
  href?: string;
  disableTilt?: boolean;
  disableFloat?: boolean;
  variant?: "default" | "small" | "dashboard" | "feature" | "elevated";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, glow = "cyan", intensity = "medium", as: Component = "div", href, disableTilt = false, disableFloat = false, variant = "default", ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glowX, setGlowX] = useState(50);
    const [glowY, setGlowY] = useState(50);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
      setIsTouchDevice(
        typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches
      );
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableTilt || isTouchDevice) return;
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRotateX(((y - rect.height / 2) / (rect.height / 2)) * -3);
      setRotateY(((x - rect.width / 2) / (rect.width / 2)) * 3);
      setGlowX((x / rect.width) * 100);
      setGlowY((y / rect.height) * 100);
    };

    const glowColors: Record<string, string> = {
      cyan: "rgba(0, 180, 216,",
      purple: "rgba(139, 92, 246,",
      blue: "rgba(59, 130, 246,",
      green: "rgba(16, 185, 129,",
      amber: "rgba(245, 158, 11,",
      none: "rgba(0,0,0,",
    };

    const opacity = intensity === "low" ? "0.04" : intensity === "high" ? "0.12" : "0.08";
    const glowColor = glowColors[glow] + opacity + ")";

    const variants = {
      default: "p-5",
      small: "p-3",
      dashboard: "p-4",
      feature: "p-6",
      elevated: "p-6 shadow-2xl",
    };

    const Tag = Component === "a" ? motion.a : motion.div;

    return (
      <Tag
        ref={ref}
        href={href}
        className={cn(
          "group relative overflow-hidden rounded-[var(--radius-glass)]",
          "bg-gradient-to-br from-[rgba(16,17,20,0.65)] via-[rgba(21,22,26,0.45)] to-[rgba(16,17,20,0.35)]",
          "backdrop-blur-2xl saturate-[1.2]",
          "border border-[rgba(255,255,255,0.06)]",
          "shadow-[0_4px_24px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)]",
          isHovered && "z-10",
          isTouchDevice && glow !== "none" && "border-[rgba(255,255,255,0.12)]",
          variants[variant],
          className,
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setRotateX(0); setRotateY(0); }}
        animate={{
          rotateX: disableTilt ? 0 : rotateX,
          rotateY: disableTilt ? 0 : rotateY,
          boxShadow: isHovered
            ? "0 12px 48px rgba(0,0,0,0.5),0 2px 4px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)"
            : isTouchDevice && glow !== "none"
            ? "0 4px 24px rgba(0,0,0,0.4),0 1px 2px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)"
            : "0 4px 24px rgba(0,0,0,0.4),0 1px 2px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.03)",
          borderColor: isHovered ? "rgba(255,255,255,0.12)" : isTouchDevice && glow !== "none" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
          y: isHovered && !disableFloat ? -2 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.4 }}
        whileTap={{ scale: 0.98 }}
        style={{ perspective: disableTilt ? undefined : 1000, touchAction: "manipulation" } as React.CSSProperties}
        {...(props as any)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[inherit]"
          style={{ background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${glowColors[glow]} 0.12) 0%, transparent 60%)` }}
        />

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 rounded-[inherit]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/[0.03]" />
        </div>

        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ border: `1px solid ${glowColors[glow]} 0.08)` }}
        />

        <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,255,255,0.02)] via-transparent to-transparent" />
        </div>

        <div className="relative z-10">{children}</div>
      </Tag>
    );
  },
);

GlassCard.displayName = "GlassCard";
