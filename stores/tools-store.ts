"use client";

import { create } from "zustand";

interface ToolsState {
  cveOpen: boolean;
  /** Optional identifier pre-filled when the lookup is opened from a shortcut. */
  cveQuery: string;
  openCve: (id?: string) => void;
  closeCve: () => void;
}

/**
 * State for the CVE lookup dialog. Kept separate from the main UI store so the
 * overlay, the command palette and the terminal can share it without importing
 * the larger UI state module.
 */
export const useToolsStore = create<ToolsState>((set) => ({
  cveOpen: false,
  cveQuery: "",
  openCve: (id = "") => set({ cveOpen: true, cveQuery: id }),
  closeCve: () => set({ cveOpen: false }),
}));
