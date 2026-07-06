import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        "rounded-[var(--radius-glass)]",
        "bg-gradient-to-br from-[rgba(16,17,20,0.4)] to-[rgba(21,22,26,0.3)]",
        "border border-[rgba(255,255,255,0.04)]",
        "backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-4 text-[var(--color-foreground-tertiary)]">{icon}</div>
      <h3 className="text-lg font-medium text-[var(--color-foreground)] mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-foreground-secondary)] max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
