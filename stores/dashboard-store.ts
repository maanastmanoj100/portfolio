"use client";

import { create } from "zustand";
import { SAMPLE_ALERTS, INCIDENTS, OVERVIEW_METRICS, WIDGET_LAYOUTS } from "@/modules/dashboard/dashboard-data";
import type { SOCMetric, SOCAlert, SOCIncident, DashboardView, DashboardWidget, AlertSeverity } from "@/types";

interface DashboardState {
  activeView: DashboardView;
  alerts: SOCAlert[];
  incidents: SOCIncident[];
  metrics: SOCMetric[];
  widgets: DashboardWidget[];
  pinnedWidgets: Record<string, boolean>;
  selectedIncident: SOCIncident | null;
  searchQuery: string;
  severityFilter: AlertSeverity | null;
  sidebarCollapsed: boolean;
  showSimulatedLabel: boolean;
}

interface DashboardActions {
  setActiveView: (v: DashboardView) => void;
  addAlert: (alert: SOCAlert) => void;
  setSelectedIncident: (i: SOCIncident | null) => void;
  setSearchQuery: (q: string) => void;
  setSeverityFilter: (s: AlertSeverity | null) => void;
  toggleSidebar: () => void;
  togglePinWidget: (id: string) => void;
  hideWidget: (id: string) => void;
  resetLayout: () => void;
  setShowSimulatedLabel: (v: boolean) => void;
}

export const useDashboardStore = create<DashboardState & DashboardActions>((set, get) => ({
  activeView: "overview",
  alerts: SAMPLE_ALERTS,
  incidents: INCIDENTS,
  metrics: OVERVIEW_METRICS,
  widgets: WIDGET_LAYOUTS,
  pinnedWidgets: {},
  selectedIncident: null,
  searchQuery: "",
  severityFilter: null,
  sidebarCollapsed: false,
  showSimulatedLabel: true,

  setActiveView: (activeView) => set({ activeView }),
  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 50) })),
  setSelectedIncident: (selectedIncident) => set({ selectedIncident }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSeverityFilter: (severityFilter) => set({ severityFilter }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  togglePinWidget: (id) =>
    set((s) => ({ pinnedWidgets: { ...s.pinnedWidgets, [id]: !s.pinnedWidgets[id] } })),
  hideWidget: (id) =>
    set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id) })),
  resetLayout: () => set({ widgets: WIDGET_LAYOUTS, pinnedWidgets: {} }),
  setShowSimulatedLabel: (showSimulatedLabel) => set({ showSimulatedLabel }),
}));
