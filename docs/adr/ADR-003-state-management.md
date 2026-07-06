# ADR-003: State Management

**Status:** Accepted  
**Date:** 2026-07-04  
**Author:** Cyber Nexus Engineering

## Context

The portfolio has global UI state (modals, theme, search), page-level state (dashboard metrics, terminal), and persistent preferences.

## Decision

Use **Zustand** as the sole state management library:

- Global stores in `stores/` (ui, theme, dashboard, mouse, search, settings, terminal)
- Module stores co-located in `modules/<name>/` (e.g., `os-store.ts`, `cnx-store.ts`)
- `persist` middleware for settings and preferences (localStorage)

## Consequences

- + Minimal boilerplate compared to Redux
- + TypeScript-first API
- + `persist` middleware handles serialization transparently
- - No built-in devtools (use React DevTools instead)
- - Stores are global singletons

## Data Flow

```
User Action → Component → Store Action → State Update → Re-render
                              ↓
                       persist (localStorage)
```
