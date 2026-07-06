"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, leftIcon, rightIcon, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-mono text-[var(--color-foreground-secondary)] mb-1.5 tracking-wider uppercase">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center gap-2 rounded-xl",
            "bg-[rgba(255,255,255,0.03)] border",
            "backdrop-blur-xl transition-all duration-300",
            focused && !error && "border-[rgba(0,180,216,0.3)] bg-[rgba(0,180,216,0.03)]",
            error && "border-[rgba(239,68,68,0.4)]",
            success && !error && "border-[rgba(16,185,129,0.3)]",
            !focused && !error && !success && "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]",
            className,
          )}
        >
          {leftIcon && (
            <span className={cn(
              "pl-3 transition-colors duration-300",
              focused ? "text-[var(--color-accent)]" : "text-[var(--color-foreground-tertiary)]",
            )}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-transparent px-3 py-2.5 text-sm text-[var(--color-foreground)]",
              "placeholder:text-[var(--color-foreground-tertiary)] placeholder:transition-all",
              "focus:placeholder:text-[rgba(255,255,255,0.2)]",
              "focus:outline-none",
              "file:mr-3 file:py-1 file:px-3 file:rounded-lg file:text-xs file:font-mono",
              "file:bg-[rgba(255,255,255,0.05)] file:border file:border-[rgba(255,255,255,0.08)]",
              "file:text-[var(--color-foreground)] file:cursor-pointer",
              "hover:file:bg-[rgba(255,255,255,0.08)]",
              leftIcon && "pl-2",
              rightIcon && "pr-2",
            )}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
            {...props}
          />
          {rightIcon && !error && !success && (
            <span className="pr-3 text-[var(--color-foreground-tertiary)]">{rightIcon}</span>
          )}
          <AnimatePresence>
            {error && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="pr-3 text-[var(--color-rose)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </motion.span>
            )}
            {success && !error && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="pr-3 text-[var(--color-emerald)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs text-[var(--color-rose)]"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
