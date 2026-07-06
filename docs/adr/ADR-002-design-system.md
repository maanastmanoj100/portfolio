# ADR-002: Liquid Glass Design System

**Status:** Accepted  
**Date:** 2026-07-04  
**Author:** Cyber Nexus Engineering

## Context

The portfolio needs a distinctive, professional visual identity that communicates cybersecurity expertise while remaining accessible.

## Decision

Implement "Liquid Glass" design system entirely in CSS:

- **Tailwind CSS v4** with `@theme` directive for design tokens
- **CSS custom properties** for runtime theme switching (dark, cyber, matrix)
- **`GlassCard`** component with glow, tilt, and float effects
- **`Button`** component with magnetic hover, ripple click, and state machine (idle → loading → success/error)
- **`cn()` utility** for conditional class merging

## Consequences

- + Zero runtime CSS-in-JS overhead
- + Full design token control without framework lock-in
- + Easy theme switching via CSS class toggling on `<html>`
- - Custom implementation requires manual documentation

## Key Tokens

```
--color-graphite-900: #0a0b0e    (darkest background)
--color-accent:      #00b4d8    (cyan primary)
--color-glass-bg:    multi-stop gradient
--radius-glass:      14px
```
