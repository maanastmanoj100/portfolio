"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CnxState {
  eventLog: { type: string; source: string; data: string; timestamp: number }[];
  activeAlerts: string[];
  searchHistory: string[];
  bookmarks: string[];
  digestsRead: string[];
  goalsCompleted: string[];
  healthDismissed: string[];
  onboardingComplete: boolean;
  lastSessionTimestamp: number;

  logEvent: (type: string, source: string, data?: string) => void;
  clearEvents: () => void;
  addSearchQuery: (q: string) => void;
  toggleBookmark: (id: string) => void;
  markDigestRead: (id: string) => void;
  toggleGoalComplete: (id: string) => void;
  dismissHealth: (id: string) => void;
  completeOnboarding: () => void;
}

export const useCnxStore = create<CnxState>()(
  persist(
    (set, get) => ({
      eventLog: [],
      activeAlerts: [],
      searchHistory: [],
      bookmarks: [],
      digestsRead: [],
      goalsCompleted: [],
      healthDismissed: [],
      onboardingComplete: false,
      lastSessionTimestamp: Date.now(),

      logEvent: (type, source, data) => {
        const event = { type, source, data: data || "", timestamp: Date.now() };
        set((s) => ({ eventLog: [event, ...s.eventLog].slice(0, 200), lastSessionTimestamp: Date.now() }));
      },
      clearEvents: () => set({ eventLog: [] }),
      addSearchQuery: (q) => set((s) => ({ searchHistory: [q, ...s.searchHistory.filter((x) => x !== q)].slice(0, 20) })),
      toggleBookmark: (id) => set((s) => ({ bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((b) => b !== id) : [...s.bookmarks, id] })),
      markDigestRead: (id) => set((s) => ({ digestsRead: s.digestsRead.includes(id) ? s.digestsRead : [...s.digestsRead, id] })),
      toggleGoalComplete: (id) => set((s) => ({ goalsCompleted: s.goalsCompleted.includes(id) ? s.goalsCompleted.filter((g) => g !== id) : [...s.goalsCompleted, id] })),
      dismissHealth: (id) => set((s) => ({ healthDismissed: [...s.healthDismissed, id] })),
      completeOnboarding: () => set({ onboardingComplete: true }),
    }),
    { name: "cyber-nexus-x" },
  ),
);
