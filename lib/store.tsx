"use client";

import { useUIStore } from "@/stores/ui-store";

/**
 * Backward-compatible hook mapping old useApp API to new Zustand stores.
 * New code should import directly from stores/{ui,theme,dashboard,search,settings}-store
 */
export function useApp() {
  const ui = useUIStore();
  return {
    commandPaletteOpen: ui.commandPaletteOpen,
    searchOpen: ui.searchOpen,
    aiAssistantOpen: ui.aiAssistantOpen,
    hackerTerminalOpen: ui.hackerTerminalOpen,
    recruiterMode: ui.recruiterMode,
    matrixMode: ui.matrixMode,
    mousePosition: { x: 0, y: 0 },
    currentPage: "",
    theme: "dark" as const,
    setCommandPaletteOpen: ui.setCommandPaletteOpen,
    setSearchOpen: ui.setSearchOpen,
    setAiAssistantOpen: ui.setAiAssistantOpen,
    setHackerTerminalOpen: ui.setHackerTerminalOpen,
    setRecruiterMode: ui.setRecruiterMode,
    setMatrixMode: ui.setMatrixMode,
    setCurrentPage: () => {},
  };
}
