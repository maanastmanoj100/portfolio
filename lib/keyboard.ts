"use client";

import { useEffect } from "react";

interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(
        (e.target as HTMLElement)?.tagName
      );

      for (const s of shortcuts) {
        const mod = s.ctrl ? e.ctrlKey : s.meta ? e.metaKey : true;
        const shift = s.shift ? e.shiftKey : !e.shiftKey;
        if (mod && shift && e.key.toLowerCase() === s.key.toLowerCase() && !isInput) {
          e.preventDefault();
          s.handler();
          return;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
