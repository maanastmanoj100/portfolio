"use client";

import { forwardRef, useRef, useState, useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconCheck, IconX } from "@tabler/icons-react";

type ButtonState = "idle" | "loading" | "success" | "error";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "glass" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  magnetic?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, loading, success, error, magnetic = true, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
      setIsTouchDevice(
        typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches
      );
    }, []);

    const state: ButtonState = loading ? "loading" : success ? "success" : error ? "error" : "idle";

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || disabled || state !== "idle" || isTouchDevice) return;
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
      setMousePos({ x, y });
    };

    const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || state !== "idle") return;
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
      props.onClick?.(e);
    };

    return (
      <motion.button
        ref={buttonRef}
        disabled={disabled || state === "loading"}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl font-medium overflow-hidden select-none min-h-[44px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
          "transition-colors duration-300",
          size === "sm" && "px-4 py-2 text-xs",
          size === "md" && "px-6 py-3 text-sm",
          size === "lg" && "px-7 py-3.5 text-base",
          size === "xl" && "px-9 py-4 text-lg",
          variant === "primary" && [
            "bg-gradient-to-r from-[rgba(0,180,216,0.15)] to-[rgba(59,130,246,0.15)]",
            "border border-[rgba(0,180,216,0.25)]",
            "text-[var(--color-accent)]",
            "hover:from-[rgba(0,180,216,0.25)] hover:to-[rgba(59,130,246,0.25)]",
            "hover:border-[rgba(0,180,216,0.4)]",
            "shadow-[0_0_20px_rgba(0,180,216,0.06)]",
            "hover:shadow-[0_0_30px_rgba(0,180,216,0.12)]",
          ],
          variant === "secondary" && [
            "bg-[rgba(255,255,255,0.04)]",
            "border border-[rgba(255,255,255,0.08)]",
            "text-[var(--color-foreground)]",
            "hover:bg-[rgba(255,255,255,0.08)]",
            "hover:border-[rgba(255,255,255,0.15)]",
          ],
          variant === "ghost" && [
            "text-[var(--color-foreground-secondary)]",
            "hover:text-[var(--color-foreground)]",
            "hover:bg-[rgba(255,255,255,0.04)]",
          ],
          variant === "glass" && [
            "backdrop-blur-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]",
            "text-[var(--color-foreground)]",
            "hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]",
          ],
          variant === "danger" && [
            "bg-[rgba(239,68,68,0.08)]",
            "border border-[rgba(239,68,68,0.2)]",
            "text-[var(--color-rose)]",
            "hover:bg-[rgba(239,68,68,0.15)]",
            "hover:border-[rgba(239,68,68,0.3)]",
          ],
          state === "success" && variant === "primary" && "!border-[rgba(16,185,129,0.4)] !text-[var(--color-emerald)]",
          state === "error" && variant === "primary" && "!border-[rgba(239,68,68,0.4)] !text-[var(--color-rose)]",
          disabled && "opacity-40 pointer-events-none",
          className,
        )}
        style={{ touchAction: "manipulation" } as React.CSSProperties}
        animate={{
          x: state === "idle" ? mousePos.x : 0,
          y: state === "idle" ? mousePos.y : 0,
          scale: state === "idle" ? (mousePos.x !== 0 || mousePos.y !== 0 ? 1.02 : 1) : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.3 }}
        whileTap={disabled || state !== "idle" ? {} : { scale: 0.96 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...(props as any)}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute rounded-full bg-[rgba(255,255,255,0.12)] animate-ripple"
            style={{
              left: ripple.x - 4,
              top: ripple.y - 4,
              width: 8,
              height: 8,
            }}
          />
        ))}

        {glow && variant === "primary" && state === "idle" && !disabled && (
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,180,216,0.08)] to-[rgba(59,130,246,0.08)] blur-xl" />
          </div>
        )}

        {state === "loading" && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {state === "success" && <IconCheck size={16} />}
        {state === "error" && <IconX size={16} />}
        {state === "idle" && leftIcon}
        <span className={cn("relative z-10 flex items-center gap-2", state !== "idle" && "opacity-0 absolute")}>
          {children}
        </span>
        {state === "idle" && rightIcon}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
