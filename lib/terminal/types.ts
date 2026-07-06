"use client";

export type LineType = "input" | "output" | "system" | "error" | "success" | "info";

export interface TerminalLine {
  text: string;
  type: LineType;
  html?: string;
}

export interface TerminalTheme {
  name: string;
  prompt: string;
  promptColor: string;
  inputColor: string;
  outputColor: string;
  errorColor: string;
  systemColor: string;
  successColor: string;
  infoColor: string;
  bg: string;
  headerBg: string;
  border: string;
  cursor: string;
}

export interface TerminalWidget {
  id: string;
  label: string;
  render: () => string;
}

export interface FSNode {
  name: string;
  type: "file" | "directory";
  children?: FSNode[];
  content?: string;
}

export interface CommandDef {
  name: string;
  description: string;
  category: "navigation" | "information" | "projects" | "ai" | "settings" | "search" | "fun" | "system";
  usage?: string;
  aliases?: string[];
}

export interface CommandContext {
  currentDir: string;
  setCurrentDir: (dir: string) => void;
  appendLine: (line: TerminalLine) => void;
  clearLines: () => void;
  theme: string;
  setTheme: (themeName: string) => void;
  closeTerminal: () => void;
  navigateTo: (path: string) => void;
  openExternal: (url: string) => void;
  openAiAssistant: () => void;
  toggleMatrix: () => void;
  toggleRecruiterMode: () => void;
  downloadResume: () => void;
  addToHistory: (cmd: string) => void;
  isBooted: boolean;
}
