"use client";

import { IconX, IconCheck, IconAlertTriangle, IconInfoCircle, IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/stores/toast-store";

/**
 * Toast container.
 *
 * Previously rendered each toast through framer-motion (`AnimatePresence` +
 * `layout` + shared variants), which meant the animation library shipped on
 * every page even though no primary surface ever shows a toast. The entrance is
 * a CSS keyframe now; the store is a plain zustand module.
 */

export { useToastStore };

const icons = {
  success: IconCheck,
  error: IconAlertCircle,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
};

const styles = {
  success: "border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] text-[var(--color-emerald)]",
  error: "border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] text-[var(--color-rose)]",
  warning: "border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)] text-[var(--color-amber)]",
  info: "border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.08)] text-[var(--color-blue-accent)]",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[150] flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "animate-toast-in pointer-events-auto flex items-start gap-3 rounded-[var(--radius-glass)] border p-4",
              "bg-gradient-to-br from-[rgba(16,17,20,0.8)] to-[rgba(21,22,26,0.6)]",
              "shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl",
              styles[toast.type],
            )}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && <p className="mt-0.5 text-xs opacity-70">{toast.description}</p>}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-40 transition-opacity hover:opacity-100"
            >
              <IconX size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
