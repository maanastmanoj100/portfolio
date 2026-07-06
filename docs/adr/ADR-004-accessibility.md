# ADR-004: Accessibility Standards

**Status:** Accepted  
**Date:** 2026-07-04  
**Author:** Cyber Nexus Engineering

## Context

The portfolio must be accessible to all users, including those using screen readers, keyboard navigation, or preferring reduced motion / high contrast.

## Decision

Target **WCAG AA** compliance with the following measures:

1. **Keyboard navigation**: All interactive elements reachable via Tab, visual focus indicators
2. **Screen readers**: Semantic HTML, ARIA labels, `role` attributes, skip-to-content links
3. **Reduced motion**: `prefers-reduced-motion` media query disables non-essential animations
4. **High contrast**: `prefers-contrast: more` media query intensifies borders and text
5. **Focus management**: Modals trap focus, restore on close
6. **Color contrast**: All text meets 4.5:1 ratio against backgrounds

## Consequences

- + Wider audience reach
- + Better SEO (semantic HTML)
- + Professional credibility
- - Additional development effort per component
- - Animation-heavy designs need fallback states
