"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  children: ReactNode;
  className?: string;
  dot?: boolean;
  pulse?: boolean;
}

const variantStyles = {
  default: "bg-white/5 text-soft-white/50 border border-white/10",
  primary: "bg-cyan/10 text-cyan border border-cyan/20",
  success: "bg-green-500/10 text-green-400 border border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  danger: "bg-red-500/10 text-red-400 border border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
};

export function Badge({ variant = "default", size = "sm", children, className, dot, pulse }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono rounded-md whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs",
        variantStyles[variant],
        className
      )}
    >
      {(dot || pulse) && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          pulse ? "animate-pulse-glow" : "",
          variant === "success" ? "bg-green-400" :
          variant === "warning" ? "bg-yellow-400" :
          variant === "danger" ? "bg-red-400" :
          variant === "primary" ? "bg-cyan" : "bg-soft-white/30"
        )} />
      )}
      {children}
    </span>
  );
}
