"use client";

import { create } from "zustand";

type ThemeMode = "dark" | "cyber" | "matrix";

interface ThemeState {
  mode: ThemeMode;
  accentColor: "cyan" | "purple" | "blue" | "green";
  reducedMotion: boolean;
  fontSize: "normal" | "large";
}

interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (color: ThemeState["accentColor"]) => void;
  setReducedMotion: (v: boolean) => void;
  setFontSize: (size: ThemeState["fontSize"]) => void;
}

const getInitialTheme = (): ThemeState => {
  if (typeof window === "undefined") {
    return { mode: "dark", accentColor: "cyan", reducedMotion: false, fontSize: "normal" };
  }
  const saved = localStorage.getItem("cyber-nexus-theme");
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return { mode: "dark", accentColor: "cyan", reducedMotion: prefersReduced, fontSize: "normal" };
};

export const useThemeStore = create<ThemeState & ThemeActions>((set, get) => ({
  ...getInitialTheme(),

  setMode: (mode) => {
    document.documentElement.classList.remove("matrix-mode");
    if (mode === "matrix") {
      document.documentElement.classList.add("matrix-mode");
    }
    set((s) => {
      const next = { ...s, mode };
      localStorage.setItem("cyber-nexus-theme", JSON.stringify(next));
      return { mode };
    });
  },
  setAccentColor: (accentColor) =>
    set((s) => {
      const next = { ...s, accentColor };
      localStorage.setItem("cyber-nexus-theme", JSON.stringify(next));
      return { accentColor };
    }),
  setReducedMotion: (reducedMotion) =>
    set((s) => {
      const next = { ...s, reducedMotion };
      localStorage.setItem("cyber-nexus-theme", JSON.stringify(next));
      return { reducedMotion };
    }),
  setFontSize: (fontSize) =>
    set((s) => {
      const next = { ...s, fontSize };
      localStorage.setItem("cyber-nexus-theme", JSON.stringify(next));
      return { fontSize };
    }),
}));
