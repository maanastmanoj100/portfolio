"use client";

import { useEffect, useRef, useState } from "react";
import { IconAlertTriangle, IconCheck, IconCopy } from "@tabler/icons-react";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  /** Exact text placed on the clipboard. Never read from hidden DOM. */
  value: string;
  /** Accessible name, e.g. "Copy email address". */
  label: string;
  variant?: "icon" | "text";
  className?: string;
}

type CopyState = "idle" | "copied" | "error";

/**
 * Copy-to-clipboard button with visible and screen-reader feedback.
 * The confirmation is announced through a polite live region and resets after
 * two seconds.
 */
export function CopyButton({ value, label, variant = "icon", className }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  async function handleCopy() {
    const result = await copyText(value);
    setState(result.ok ? "copied" : "error");
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2_000);
  }

  const icon =
    state === "copied" ? (
      <IconCheck size={14} aria-hidden="true" />
    ) : state === "error" ? (
      <IconAlertTriangle size={14} aria-hidden="true" />
    ) : (
      <IconCopy size={14} aria-hidden="true" />
    );

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-md border border-border text-xs text-foreground-secondary transition-colors hover:border-border-hover hover:text-foreground",
          variant === "icon" ? "h-8 w-8 shrink-0" : "px-2.5 py-1.5",
          state === "copied" && "border-emerald/40 text-emerald",
          state === "error" && "border-rose/40 text-rose",
          className,
        )}
      >
        {icon}
        {variant === "text" && (
          <span>
            {state === "copied" ? "Copied" : state === "error" ? "Copy failed" : "Copy"}
          </span>
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? `${label}: copied to clipboard.`
          : state === "error"
            ? `${label}: copying failed.`
            : ""}
      </span>
    </>
  );
}
