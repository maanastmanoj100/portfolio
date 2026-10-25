"use client";

import { create } from "zustand";
import type { Toast } from "@/types";

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

/**
 * Toast state lives in its own module so importing the store (or the
 * container) no longer drags an animation library into the bundle.
 */
export const useToastStore = create<ToastStore>((set) => ({
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
