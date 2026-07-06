"use client";

import { create } from "zustand";

interface UIState {
  commandPaletteOpen: boolean;
  searchOpen: boolean;
  aiAssistantOpen: boolean;
  hackerTerminalOpen: boolean;
  recruiterMode: boolean;
  matrixMode: boolean;
  mobileMenuOpen: boolean;
}

interface UIActions {
  setCommandPaletteOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setAiAssistantOpen: (v: boolean) => void;
  setHackerTerminalOpen: (v: boolean) => void;
  setRecruiterMode: (v: boolean) => void;
  setMatrixMode: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  toggleRecruiterMode: () => void;
  toggleMatrixMode: () => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  commandPaletteOpen: false,
  searchOpen: false,
  aiAssistantOpen: false,
  hackerTerminalOpen: false,
  recruiterMode: false,
  matrixMode: false,
  mobileMenuOpen: false,

  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setAiAssistantOpen: (v) => set({ aiAssistantOpen: v }),
  setHackerTerminalOpen: (v) => set({ hackerTerminalOpen: v }),
  setRecruiterMode: (v) => {
    set({ recruiterMode: v });
    document.documentElement.classList.toggle("recruiter-mode", v);
  },
  setMatrixMode: (v) => {
    set({ matrixMode: v });
    document.documentElement.classList.toggle("matrix-mode", v);
  },
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  toggleRecruiterMode: () =>
    set((s) => {
      document.documentElement.classList.toggle("recruiter-mode", !s.recruiterMode);
      return { recruiterMode: !s.recruiterMode };
    }),
  toggleMatrixMode: () =>
    set((s) => {
      document.documentElement.classList.toggle("matrix-mode", !s.matrixMode);
      return { matrixMode: !s.matrixMode };
    }),
}));
