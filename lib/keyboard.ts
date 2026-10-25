"use client";

import { useEffect, useRef } from "react";

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  /** Allow the shortcut while focus is in an input, textarea or select. */
  allowInInput?: boolean;
  /** Allow the shortcut while a modal dialog is open. */
  allowInDialog?: boolean;
  handler: () => void;
  description: string;
}

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return Boolean(target.closest("[contenteditable='true']"));
}

function hasOpenModal(): boolean {
  return Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'));
}

/**
 * Global keyboard shortcuts.
 *
 * A single listener is registered per hook call and removed on unmount. The
 * matcher is strict: modifiers that the shortcut does not ask for must be
 * absent, so Ctrl+K does not also fire on Ctrl+Shift+K, and plain letter
 * shortcuts never run while the visitor is typing.
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat) return;
      if (event.key === "Dead" || event.key === "Process") return;

      const editable = isEditableTarget(event.target);
      const modal = hasOpenModal();
      const key = event.key.toLowerCase();

      for (const shortcut of shortcutsRef.current) {
        if (editable && !shortcut.allowInInput) continue;
        if (modal && !shortcut.allowInDialog) continue;
        if (key !== shortcut.key.toLowerCase()) continue;

        const needsCtrl = shortcut.ctrl ?? false;
        const needsMeta = shortcut.meta ?? false;
        if (needsCtrl !== event.ctrlKey) continue;
        if (needsMeta !== event.metaKey) continue;
        if ((shortcut.shift ?? false) !== event.shiftKey) continue;
        if ((shortcut.alt ?? false) !== event.altKey) continue;

        event.preventDefault();
        shortcut.handler();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
