"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
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

/**
 * Button.
 *
 * The magnetic cursor-follow, click ripples, spring physics and pointer glow
 * have been removed — they ran per-frame state updates for a purely decorative
 * effect. The variant/size/state API is unchanged, so existing call sites keep
 * working. `glow` and `magnetic` remain in the signature and are emitted as
 * inert `data-*` attributes.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    glow = true,
    loading,
    success,
    error,
    magnetic = true,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  },
  ref,
) {
  const state: ButtonState = loading
    ? "loading"
    : success
      ? "success"
      : error
        ? "error"
        : "idle";

  return (
    <button
      ref={ref}
      disabled={disabled || state === "loading"}
      className={cn(
        "relative inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
        size === "sm" && "px-3 py-2 text-xs",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-5 py-3 text-base",
        size === "xl" && "px-6 py-3.5 text-lg",
        variant === "primary" &&
          "bg-accent text-background hover:bg-accent/90",
        variant === "secondary" &&
          "border border-border bg-white/[0.04] text-foreground hover:border-border-hover hover:bg-white/[0.08]",
        variant === "ghost" &&
          "text-foreground-secondary hover:bg-white/[0.04] hover:text-foreground",
        variant === "glass" &&
          "border border-border bg-white/[0.04] text-foreground backdrop-blur-xl hover:border-border-hover hover:bg-white/[0.08]",
        variant === "danger" &&
          "border border-rose/30 bg-rose/10 text-rose hover:bg-rose/20",
        state === "success" && "border border-emerald/40 text-emerald",
        state === "error" && "border border-rose/40 text-rose",
        disabled && "pointer-events-none opacity-40",
        className,
      )}
      data-glow={glow ? "on" : "off"}
      data-magnetic={magnetic ? "on" : "off"}
      {...props}
    >
      {state === "loading" && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {state === "success" && <IconCheck size={16} />}
      {state === "error" && <IconX size={16} />}
      {state === "idle" && leftIcon}
      <span className={cn(state !== "idle" && "sr-only")}>{children}</span>
      {state === "idle" && rightIcon}
    </button>
  );
});

Button.displayName = "Button";
