"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function SkeletonText({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "h-4 w-full rounded-md",
        "bg-gradient-to-r from-[rgba(255,255,255,0.04)] via-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.04)]",
        "bg-[length:200%_100%] animate-shimmer",
        className,
      )}
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-glass)] p-5",
        "bg-gradient-to-br from-[rgba(16,17,20,0.65)] to-[rgba(21,22,26,0.45)]",
        "border border-[rgba(255,255,255,0.06)]",
        "backdrop-blur-2xl",
        className,
      )}
    >
      <SkeletonText className="w-3/4 mb-3" />
      <SkeletonText className="w-full mb-2" />
      <SkeletonText className="w-5/6" />
    </div>
  );
}

export function SkeletonCircle({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-full",
        "bg-gradient-to-r from-[rgba(255,255,255,0.04)] via-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.04)]",
        "bg-[length:200%_100%] animate-shimmer",
        className,
      )}
    />
  );
}

export function SkeletonTable({ rows = 3, className }: { rows?: number } & SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonText className="w-1/4" />
          <SkeletonText className="w-2/4" />
          <SkeletonText className="w-1/4" />
        </div>
      ))}
    </div>
  );
}
