"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "flex items-center gap-3 group",
        disabled && "opacity-40 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors duration-300",
          checked ? "bg-[var(--color-accent)]" : "bg-[rgba(255,255,255,0.08)]",
        )}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-md"
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      {label && <span className="text-sm text-[var(--color-foreground-secondary)] group-hover:text-[var(--color-foreground)] transition-colors">{label}</span>}
    </button>
  );
}
