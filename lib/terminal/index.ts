export type { TerminalLine, TerminalTheme, TerminalWidget, FSNode, CommandDef, CommandContext, LineType } from "./types";
export { getBuiltinCommands, executeCommand } from "./commands";
export { virtualFS, resolvePath, getNode, listDir, pathExists, isDirectory } from "./filesystem";
export { getCompletions, getBestCompletion } from "./autocomplete";
export { terminalThemes, getTheme } from "./themes";
