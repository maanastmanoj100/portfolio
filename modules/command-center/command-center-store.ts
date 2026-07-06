"use client";

import { create } from "zustand";

export type ActivePanel = "soc" | "noc" | "threat" | "osint" | "infra" | "analyst" | "incidents" | "timeline" | "wall" | "terminal" | "executive";

export interface TerminalLine {
  text: string;
  className?: string;
}

interface CommandCenterState {
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;

  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;

  terminalOpen: boolean;
  setTerminalOpen: (v: boolean) => void;

  terminalLines: TerminalLine[];
  addTerminalLine: (line: TerminalLine) => void;
  clearTerminal: () => void;

  alertFilter: {
    severity: string[];
    status: string[];
    search: string;
  };
  setAlertFilter: (filter: Partial<CommandCenterState["alertFilter"]>) => void;

  infraFilter: string;
  setInfraFilter: (f: string) => void;

  incidentFilter: string;
  setIncidentFilter: (f: string) => void;

  expandedAlerts: string[];
  toggleAlertExpand: (id: string) => void;

  expandedIncidents: string[];
  toggleIncidentExpand: (id: string) => void;

  timelineFilter: string;
  setTimelineFilter: (f: string) => void;

  uiTime: string;
  uiUtc: string;
  cpuUsage: number;
  memUsage: number;
  fps: number;
  networkStatus: "online" | "degraded" | "offline";
  aiStatus: "online" | "processing" | "offline";
  visitorCount: number;

  updateUiClock: () => void;
  simulateMetrics: () => void;
}

export const useCommandCenterStore = create<CommandCenterState>()((set) => ({
  activePanel: "soc",
  setActivePanel: (panel) => set({ activePanel: panel }),

  paletteOpen: false,
  setPaletteOpen: (v) => set({ paletteOpen: v }),

  terminalOpen: false,
  setTerminalOpen: (v) => set({ terminalOpen: v }),

  terminalLines: [
    { text: "Global Command Center Terminal v1.0", className: "text-cyan-400 font-bold" },
    { text: "Type 'help' for available commands.", className: "text-gray-400" },
    { text: "", className: "" },
  ],
  addTerminalLine: (line) => set((s) => ({ terminalLines: [...s.terminalLines, line].slice(-200) })),
  clearTerminal: () => set({ terminalLines: [] }),

  alertFilter: { severity: [], status: [], search: "" },
  setAlertFilter: (filter) => set((s) => ({ alertFilter: { ...s.alertFilter, ...filter } })),

  infraFilter: "all",
  setInfraFilter: (f) => set({ infraFilter: f }),

  incidentFilter: "",
  setIncidentFilter: (f) => set({ incidentFilter: f }),

  expandedAlerts: [],
  toggleAlertExpand: (id) => set((s) => ({
    expandedAlerts: s.expandedAlerts.includes(id)
      ? s.expandedAlerts.filter((a) => a !== id)
      : [...s.expandedAlerts, id],
  })),

  expandedIncidents: [],
  toggleIncidentExpand: (id) => set((s) => ({
    expandedIncidents: s.expandedIncidents.includes(id)
      ? s.expandedIncidents.filter((a) => a !== id)
      : [...s.expandedIncidents, id],
  })),

  timelineFilter: "all",
  setTimelineFilter: (f) => set({ timelineFilter: f }),

  uiTime: new Date().toLocaleTimeString(),
  uiUtc: new Date().toUTCString().slice(17, 26),
  cpuUsage: Math.floor(Math.random() * 30 + 20),
  memUsage: Math.floor(Math.random() * 25 + 50),
  fps: 60,
  networkStatus: "online",
  aiStatus: "online",
  visitorCount: 1427,

  updateUiClock: () => set({
    uiTime: new Date().toLocaleTimeString(),
    uiUtc: new Date().toUTCString().slice(17, 26),
  }),

  simulateMetrics: () => set((s) => ({
    cpuUsage: Math.floor(Math.random() * 30 + 20),
    memUsage: Math.floor(Math.random() * 25 + 50),
    fps: 55 + Math.floor(Math.random() * 10),
    networkStatus: Math.random() > 0.9 ? ("degraded" as const) : ("online" as const),
    aiStatus: Math.random() > 0.95 ? ("processing" as const) : ("online" as const),
    visitorCount: s.visitorCount + (Math.random() > 0.7 ? 1 : 0),
  })),
}));
