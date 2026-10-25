"use client";

import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "purple" | "blue" | "green" | "amber" | "none";
  intensity?: "low" | "medium" | "high";
  as?: "div" | "button" | "a";
  href?: string;
  disableTilt?: boolean;
  disableFloat?: boolean;
  variant?: "default" | "small" | "dashboard" | "feature" | "elevated";
}

const variantPadding = {
  default: "p-5",
  small: "p-3",
  dashboard: "p-4",
  feature: "p-6",
  elevated: "p-6",
};

/**
 * Glass surface.
 *
 * The previous implementation ran a per-mousemove React state update on every
 * card (3D tilt + a radial glow that followed the cursor), plus a spring
 * animation and a hover float. All of that is gone: the card is now a static
 * surface with a single border-colour transition. `glow`, `intensity`,
 * `disableTilt` and `disableFloat` are kept in the prop signature so existing
 * call sites keep compiling, and are emitted as inert `data-*` attributes.
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    { className, children, as: Component = "div", href, variant = "default", ...props },
    ref,
  ) {
    const { glow, intensity, disableTilt, disableFloat, ...domProps } = props;

    const classes = cn(
      "relative overflow-hidden rounded-[var(--radius-glass)]",
      "border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] backdrop-blur-xl",
      "transition-colors duration-200 hover:border-[var(--color-border-hover)]",
      variantPadding[variant],
      className,
    );

    const dataAttrs = {
      "data-glow": glow,
      "data-intensity": intensity,
      "data-tilt": disableTilt ? "off" : undefined,
      "data-float": disableFloat ? "off" : undefined,
    };

    if (Component === "a") {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...dataAttrs}
          {...(domProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          <div className="relative z-10">{children}</div>
        </a>
      );
    }

    if (Component === "button") {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={classes}
          {...dataAttrs}
          {...(domProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          <div className="relative z-10">{children}</div>
        </button>
      );
    }

    return (
      <div ref={ref} className={classes} {...dataAttrs} {...domProps}>
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);

GlassCard.displayName = "GlassCard";
