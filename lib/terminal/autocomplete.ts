"use client";

import { getBuiltinCommands } from "./commands";

const allCommands = getBuiltinCommands();

export function getCompletions(partial: string): string[] {
  const lower = partial.toLowerCase();
  return allCommands
    .filter((cmd) => cmd.name.startsWith(lower) || (cmd.aliases ?? []).some((a) => a.startsWith(lower)))
    .map((cmd) => cmd.name);
}

export function getBestCompletion(partial: string): string | null {
  const matches = getCompletions(partial);
  if (matches.length === 1) return matches[0];
  return null;
}
