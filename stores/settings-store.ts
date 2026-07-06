"use client";

import { create } from "zustand";

interface SettingsState {
  autoRotateThreats: boolean;
  showAnalytics: boolean;
  compactMode: boolean;
  soundEnabled: boolean;
  terminalFontSize: "sm" | "md" | "lg";
}

interface SettingsActions {
  setAutoRotateThreats: (v: boolean) => void;
  setShowAnalytics: (v: boolean) => void;
  setCompactMode: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  setTerminalFontSize: (v: SettingsState["terminalFontSize"]) => void;
  resetSettings: () => void;
}

const defaults: SettingsState = {
  autoRotateThreats: true,
  showAnalytics: true,
  compactMode: false,
  soundEnabled: false,
  terminalFontSize: "md",
};

const loadSettings = (): SettingsState => {
  if (typeof window === "undefined") return defaults;
  try {
    const saved = localStorage.getItem("cyber-nexus-settings");
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
};

const saveSettings = (settings: SettingsState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cyber-nexus-settings", JSON.stringify(settings));
  }
};

export const useSettingsStore = create<SettingsState & SettingsActions>((set, get) => ({
  ...loadSettings(),

  setAutoRotateThreats: (autoRotateThreats) =>
    set((s) => {
      const next = { ...s, autoRotateThreats };
      saveSettings(next);
      return { autoRotateThreats };
    }),
  setShowAnalytics: (showAnalytics) =>
    set((s) => {
      const next = { ...s, showAnalytics };
      saveSettings(next);
      return { showAnalytics };
    }),
  setCompactMode: (compactMode) =>
    set((s) => {
      const next = { ...s, compactMode };
      saveSettings(next);
      return { compactMode };
    }),
  setSoundEnabled: (soundEnabled) =>
    set((s) => {
      const next = { ...s, soundEnabled };
      saveSettings(next);
      return { soundEnabled };
    }),
  setTerminalFontSize: (terminalFontSize) =>
    set((s) => {
      const next = { ...s, terminalFontSize };
      saveSettings(next);
      return { terminalFontSize };
    }),
  resetSettings: () => {
    saveSettings(defaults);
    set(defaults);
  },
}));
