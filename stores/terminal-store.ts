"use client";

import { create } from "zustand";

interface TerminalStore {
  theme: string;
  showWidgets: boolean;
  widgetsMinimized: boolean;
  setTheme: (name: string) => void;
  toggleWidgets: () => void;
  setWidgetsMinimized: (v: boolean) => void;
}

export const useTerminalStore = create<TerminalStore>((set) => ({
  theme: "glass",
  showWidgets: false,
  widgetsMinimized: false,
  setTheme: (name) => set({ theme: name }),
  toggleWidgets: () => set((s) => ({ showWidgets: !s.showWidgets })),
  setWidgetsMinimized: (v) => set({ widgetsMinimized: v }),
}));
