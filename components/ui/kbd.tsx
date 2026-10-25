import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small keyboard hint. Purely presentational; always paired with text. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "rounded border border-border bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] leading-4 text-foreground-tertiary",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
