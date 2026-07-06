"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OsWindow {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  route?: string;
}

export interface Widget {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
  openWindows: string[];
}

export interface TerminalSession {
  id: string;
  lines: { text: string; className?: string }[];
  cwd: string;
}

interface OsState {
  booted: boolean;
  booting: boolean;
  showBoot: boolean;
  bootSkipped: boolean;
  desktopReady: boolean;

  windows: OsWindow[];
  nextZ: number;
  focusedWindow: string | null;
  windowHistory: string[];

  dockApps: string[];
  pinnedApps: string[];
  recentApps: string[];

  widgets: Widget[];
  activeWorkspace: string;
  workspaces: Workspace[];

  commandPaletteOpen: boolean;
  globalSearchOpen: boolean;
  notificationCenterOpen: boolean;
  controlCenterOpen: boolean;
  appLauncherOpen: boolean;

  notifications: { id: string; title: string; desc: string; time: string; read: boolean; category: string }[];

  theme: "liquid-glass" | "dark-cyber" | "light-professional" | "midnight-blue" | "neon-matrix" | "minimal" | "high-contrast";
  wallpaper: string;
  animationLevel: "full" | "reduced" | "minimal";
  glassIntensity: "low" | "medium" | "high";
  fontSize: "small" | "medium" | "large";
  focusMode: boolean;
  accessibilityReducedMotion: boolean;
  accessibilityHighContrast: boolean;

  terminalSessions: TerminalSession[];
  activeTerminalTab: string;

  performanceHistory: { cpu: number; mem: number; fps: number; time: string }[];

  easterEggsFound: string[];
  easterEggUnlocked: string | null;

  recruiterWorkspaceActive: boolean;

  // Actions
  boot: () => void;
  skipBoot: () => void;
  setBooted: () => void;

  openWindow: (appId: string, title: string, route?: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;

  setCommandPaletteOpen: (v: boolean) => void;
  setGlobalSearchOpen: (v: boolean) => void;
  setNotificationCenterOpen: (v: boolean) => void;
  setControlCenterOpen: (v: boolean) => void;
  setAppLauncherOpen: (v: boolean) => void;

  addNotification: (n: { title: string; desc: string; category: string }) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  setTheme: (t: OsState["theme"]) => void;
  setWallpaper: (w: string) => void;
  setAnimationLevel: (a: OsState["animationLevel"]) => void;
  setGlassIntensity: (g: OsState["glassIntensity"]) => void;
  setFontSize: (f: OsState["fontSize"]) => void;
  setFocusMode: (v: boolean) => void;
  setAccessibilityReducedMotion: (v: boolean) => void;
  setAccessibilityHighContrast: (v: boolean) => void;

  addTerminalSession: () => string;
  closeTerminalSession: (id: string) => void;
  addTerminalLine: (sessionId: string, line: { text: string; className?: string }) => void;
  clearTerminal: (sessionId: string) => void;

  addEasterEgg: (id: string) => void;
  unlockEasterEgg: (id: string | null) => void;

  setRecruiterWorkspaceActive: (v: boolean) => void;

  toggleDockApp: (appId: string) => void;
  addRecentApp: (appId: string) => void;
  togglePinApp: (appId: string) => void;

  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
  moveWidget: (id: string, x: number, y: number) => void;

  switchWorkspace: (id: string) => void;

  recordPerformance: () => void;
}

const STORE_KEY = "cyber-nexus-os";

export const useOsStore = create<OsState>()(
  persist(
    (set, get) => ({
      booted: false,
      booting: false,
      showBoot: true,
      bootSkipped: false,
      desktopReady: false,

      windows: [],
      nextZ: 1,
      focusedWindow: null,
      windowHistory: [],

      dockApps: ["terminal", "files", "browser", "soc-dashboard", "knowledge-graph", "settings", "ai-copilot"],
      pinnedApps: ["projects", "skills", "certifications", "github", "blog"],
      recentApps: [],

      widgets: [
        { id: "widget-clock", type: "clock", x: 20, y: 20, width: 240, height: 120 },
        { id: "widget-stats", type: "stats", x: 280, y: 20, width: 300, height: 120 },
        { id: "widget-github", type: "github", x: 20, y: 160, width: 300, height: 200 },
      ],
      activeWorkspace: "default",
      workspaces: [
        { id: "default", name: "Main Desktop", icon: "layout-grid", openWindows: [] },
        { id: "soc", name: "SOC Workspace", icon: "shield", openWindows: [] },
        { id: "dev", name: "Development", icon: "code", openWindows: [] },
        { id: "research", name: "Research", icon: "book", openWindows: [] },
        { id: "recruiter", name: "Recruiter View", icon: "user", openWindows: [] },
        { id: "learning", name: "Learning", icon: "brain", openWindows: [] },
      ],

      commandPaletteOpen: false,
      globalSearchOpen: false,
      notificationCenterOpen: false,
      controlCenterOpen: false,
      appLauncherOpen: false,

      notifications: [
        { id: "n1", title: "Welcome to Cyber Nexus OS", desc: "Explore the desktop environment. Press Cmd+K to open the command palette.", time: "Just now", read: false, category: "system" },
        { id: "n2", title: "New Chapter Released", desc: "Security Architecture Explorer is now available as an application.", time: "2h ago", read: false, category: "update" },
        { id: "n3", title: "GitHub Activity", desc: "3 repositories updated with new security documentation.", time: "1d ago", read: true, category: "github" },
      ],

      theme: "liquid-glass",
      wallpaper: "default",
      animationLevel: "full",
      glassIntensity: "medium",
      fontSize: "medium",
      focusMode: false,
      accessibilityReducedMotion: false,
      accessibilityHighContrast: false,

      terminalSessions: [
        {
          id: "ts-1",
          lines: [
            { text: "Cyber Nexus OS Terminal v1.0", className: "text-cyan-400" },
            { text: "Type 'help' for available commands.", className: "text-gray-400" },
            { text: "", className: "" },
          ],
          cwd: "/home/cybernexus",
        },
      ],
      activeTerminalTab: "ts-1",

      performanceHistory: [],

      easterEggsFound: [],
      easterEggUnlocked: null,

      recruiterWorkspaceActive: false,

      // ─── Boot ──────────────────────────────────────────
      boot: () => {
        set({ booting: true, showBoot: true });
        setTimeout(() => set({ booting: false, booted: true, desktopReady: true, showBoot: false }), 3000);
      },
      skipBoot: () => set({ booting: false, booted: true, desktopReady: true, showBoot: false, bootSkipped: true }),
      setBooted: () => set({ booted: true, desktopReady: true }),

      // ─── Windows ───────────────────────────────────────
      openWindow: (appId, title, route) => {
        const state = get();
        const existing = state.windows.find((w) => w.appId === appId && !w.minimized);
        if (existing) {
          set({ focusedWindow: existing.id, nextZ: state.nextZ + 1, windows: state.windows.map((w) => w.id === existing.id ? { ...w, zIndex: state.nextZ } : w) });
          get().addRecentApp(appId);
          return;
        }
        const minimized = state.windows.find((w) => w.appId === appId && w.minimized);
        if (minimized) {
          set({ focusedWindow: minimized.id, nextZ: state.nextZ + 1, windows: state.windows.map((w) => w.id === minimized.id ? { ...w, minimized: false, zIndex: state.nextZ } : w) });
          get().addRecentApp(appId);
          return;
        }
        const count = state.windows.filter((w) => w.appId === appId).length;
        const id = `win-${appId}-${Date.now()}`;
        const offset = (count * 30) % 180;
        const win: OsWindow = {
          id, appId, title,
          x: 80 + offset, y: 60 + offset,
          width: 800, height: 520,
          minimized: false, maximized: false,
          zIndex: state.nextZ, route,
        };
        set({
          windows: [...state.windows, win],
          focusedWindow: id,
          nextZ: state.nextZ + 1,
          windowHistory: [...state.windowHistory, id],
        });
        get().addRecentApp(appId);
      },
      closeWindow: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id), focusedWindow: s.focusedWindow === id ? null : s.focusedWindow })),
      focusWindow: (id) => set((s) => ({ focusedWindow: id, nextZ: s.nextZ + 1, windows: s.windows.map((w) => w.id === id ? { ...w, zIndex: s.nextZ } : w) })),
      minimizeWindow: (id) => set((s) => ({ windows: s.windows.map((w) => w.id === id ? { ...w, minimized: true } : w) })),
      maximizeWindow: (id) => set((s) => ({ windows: s.windows.map((w) => w.id === id ? { ...w, maximized: true } : w) })),
      restoreWindow: (id) => set((s) => ({ windows: s.windows.map((w) => w.id === id ? { ...w, maximized: false, minimized: false } : w) })),
      moveWindow: (id, x, y) => set((s) => ({ windows: s.windows.map((w) => w.id === id ? { ...w, x, y } : w) })),
      resizeWindow: (id, width, height) => set((s) => ({ windows: s.windows.map((w) => w.id === id ? { ...w, width, height } : w) })),

      // ─── Overlays ──────────────────────────────────────
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
      setGlobalSearchOpen: (v) => set({ globalSearchOpen: v }),
      setNotificationCenterOpen: (v) => set({ notificationCenterOpen: v }),
      setControlCenterOpen: (v) => set({ controlCenterOpen: v }),
      setAppLauncherOpen: (v) => set({ appLauncherOpen: v }),

      // ─── Notifications ─────────────────────────────────
      addNotification: (n) => set((s) => ({
        notifications: [{ id: `n-${Date.now()}`, ...n, time: "Just now", read: false }, ...s.notifications].slice(0, 50),
      })),
      markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
      clearNotifications: () => set({ notifications: [] }),

      // ─── Settings ──────────────────────────────────────
      setTheme: (t) => set({ theme: t }),
      setWallpaper: (w) => set({ wallpaper: w }),
      setAnimationLevel: (a) => set({ animationLevel: a }),
      setGlassIntensity: (g) => set({ glassIntensity: g }),
      setFontSize: (f) => set({ fontSize: f }),
      setFocusMode: (v) => set({ focusMode: v }),
      setAccessibilityReducedMotion: (v) => set({ accessibilityReducedMotion: v, animationLevel: v ? "minimal" : "full" }),
      setAccessibilityHighContrast: (v) => set({ accessibilityHighContrast: v }),

      // ─── Terminal ──────────────────────────────────────
      addTerminalSession: () => {
        const id = `ts-${Date.now()}`;
        set((s) => ({ terminalSessions: [...s.terminalSessions, { id, lines: [{ text: `Terminal session ${s.terminalSessions.length + 1}`, className: "text-cyan-400" }], cwd: "/home/cybernexus" }], activeTerminalTab: id }));
        return id;
      },
      closeTerminalSession: (id) => set((s) => ({ terminalSessions: s.terminalSessions.filter((t) => t.id !== id) })),
      addTerminalLine: (sessionId, line) => set((s) => ({ terminalSessions: s.terminalSessions.map((t) => t.id === sessionId ? { ...t, lines: [...t.lines, line] } : t) })),
      clearTerminal: (sessionId) => set((s) => ({ terminalSessions: s.terminalSessions.map((t) => t.id === sessionId ? { ...t, lines: [] } : t) })),

      // ─── Easter Eggs ───────────────────────────────────
      addEasterEgg: (id) => set((s) => ({ easterEggsFound: s.easterEggsFound.includes(id) ? s.easterEggsFound : [...s.easterEggsFound, id] })),
      unlockEasterEgg: (id) => set({ easterEggUnlocked: id }),

      // ─── Recruiter ─────────────────────────────────────
      setRecruiterWorkspaceActive: (v) => set({ recruiterWorkspaceActive: v }),

      // ─── Dock / Apps ───────────────────────────────────
      toggleDockApp: (appId) => set((s) => ({ dockApps: s.dockApps.includes(appId) ? s.dockApps.filter((a) => a !== appId) : [...s.dockApps, appId] })),
      addRecentApp: (appId) => set((s) => ({ recentApps: [appId, ...s.recentApps.filter((a) => a !== appId)].slice(0, 10) })),
      togglePinApp: (appId) => set((s) => ({ pinnedApps: s.pinnedApps.includes(appId) ? s.pinnedApps.filter((a) => a !== appId) : [...s.pinnedApps, appId] })),

      // ─── Widgets ───────────────────────────────────────
      addWidget: (widget) => set((s) => ({ widgets: [...s.widgets, widget] })),
      removeWidget: (id) => set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id) })),
      moveWidget: (id, x, y) => set((s) => ({ widgets: s.widgets.map((w) => w.id === id ? { ...w, x, y } : w) })),

      // ─── Workspaces ────────────────────────────────────
      switchWorkspace: (id) => set({ activeWorkspace: id }),

      // ─── Performance ───────────────────────────────────
      recordPerformance: () => set((s) => {
        const now = new Date().toLocaleTimeString();
        const hist = [...s.performanceHistory, { cpu: Math.floor(20 + Math.random() * 40), mem: Math.floor(40 + Math.random() * 35), fps: Math.floor(50 + Math.random() * 10), time: now }].slice(-30);
        return { performanceHistory: hist };
      }),
    }),
    {
      name: STORE_KEY,
      partialize: (state) => ({
        theme: state.theme,
        wallpaper: state.wallpaper,
        animationLevel: state.animationLevel,
        glassIntensity: state.glassIntensity,
        fontSize: state.fontSize,
        focusMode: state.focusMode,
        accessibilityReducedMotion: state.accessibilityReducedMotion,
        accessibilityHighContrast: state.accessibilityHighContrast,
        dockApps: state.dockApps,
        pinnedApps: state.pinnedApps,
        widgets: state.widgets,
        workspace: state.activeWorkspace,
        easterEggsFound: state.easterEggsFound,
      }),
    },
  ),
);
