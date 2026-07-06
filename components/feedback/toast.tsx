"use client";

import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconCheck, IconAlertTriangle, IconInfoCircle, IconAlertCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { notificationSlide } from "@/lib/animation";
import type { Toast } from "@/types";

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast = { ...toast, id };
    set((s) => ({ toasts: [...s.toasts, newToast] }));
    const duration = toast.duration || 4000;
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

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

export { useToastStore };

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              variants={notificationSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "rounded-[var(--radius-glass)] border p-4 flex items-start gap-3",
                "bg-gradient-to-br from-[rgba(16,17,20,0.8)] to-[rgba(21,22,26,0.6)]",
                "backdrop-blur-2xl",
                "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                styles[toast.type],
              )}
            >
              <Icon size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.description && <p className="text-xs opacity-70 mt-0.5">{toast.description}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
              >
                <IconX size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
