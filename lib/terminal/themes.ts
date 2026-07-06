"use client";

import type { TerminalTheme } from "./types";

export const terminalThemes: Record<string, TerminalTheme> = {
  glass: {
    name: "glass",
    prompt: "visitor@cybernexus",
    promptColor: "#00b4d8",
    inputColor: "#e4e8f0",
    outputColor: "#8e92a0",
    errorColor: "#ef4444",
    systemColor: "#00b4d8",
    successColor: "#10b981",
    infoColor: "#8b5cf6",
    bg: "rgba(10,11,14,0.88)",
    headerBg: "rgba(0,0,0,0.3)",
    border: "rgba(0,180,216,0.12)",
    cursor: "#00b4d8",
  },
  dark: {
    name: "dark",
    prompt: "visitor@cybernexus",
    promptColor: "#10b981",
    inputColor: "#e4e8f0",
    outputColor: "#a0a0b0",
    errorColor: "#ff5555",
    systemColor: "#50fa7b",
    successColor: "#10b981",
    infoColor: "#bd93f9",
    bg: "rgba(0,0,0,0.92)",
    headerBg: "rgba(0,0,0,0.4)",
    border: "rgba(255,255,255,0.06)",
    cursor: "#10b981",
  },
  matrix: {
    name: "matrix",
    prompt: "root@cybernexus",
    promptColor: "#00ff41",
    inputColor: "#00ff41",
    outputColor: "#00cc33",
    errorColor: "#ff0033",
    systemColor: "#00ff41",
    successColor: "#00ff41",
    infoColor: "#00aa22",
    bg: "rgba(0,10,0,0.92)",
    headerBg: "rgba(0,5,0,0.4)",
    border: "rgba(0,255,65,0.10)",
    cursor: "#00ff41",
  },
  soc: {
    name: "soc",
    prompt: "analyst@soc",
    promptColor: "#f59e0b",
    inputColor: "#f8fafc",
    outputColor: "#94a3b8",
    errorColor: "#ef4444",
    systemColor: "#f59e0b",
    successColor: "#22c55e",
    infoColor: "#3b82f6",
    bg: "rgba(15,23,42,0.92)",
    headerBg: "rgba(0,0,0,0.3)",
    border: "rgba(245,158,11,0.10)",
    cursor: "#f59e0b",
  },
};

export function getTheme(name: string): TerminalTheme {
  return terminalThemes[name] ?? terminalThemes.glass;
}
