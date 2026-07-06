"use client";

import { create } from "zustand";
import { useEffect } from "react";

interface MouseState {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

interface MouseActions {
  updatePosition: (x: number, y: number) => void;
}

export const useMouseStore = create<MouseState & MouseActions>((set) => ({
  x: 0,
  y: 0,
  normalizedX: 0.5,
  normalizedY: 0.5,

  updatePosition: (x, y) =>
    set({
      x,
      y,
      normalizedX: x / (typeof window !== "undefined" ? window.innerWidth : 1),
      normalizedY: y / (typeof window !== "undefined" ? window.innerHeight : 1),
    }),
}));

export function useMouseTracker() {
  const updatePosition = useMouseStore((s) => s.updatePosition);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [updatePosition]);
}
