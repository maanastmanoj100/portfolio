# ADR-005: Testing Strategy

**Status:** Proposed  
**Date:** 2026-07-04  
**Author:** Cyber Nexus Engineering

## Context

The project currently has no test infrastructure. As the codebase grows, testing is needed to maintain reliability.

## Decision

Implement a three-tier testing strategy:

### Tier 1 — Unit Tests (Vitest + Testing Library)
- Pure utility functions in `lib/`
- Data transformation helpers
- Store logic

### Tier 2 — Integration Tests (Vitest + Testing Library)
- Component rendering and interaction
- Module page smoke tests
- Form validation

### Tier 3 — End-to-End Tests (Playwright)
- Critical user flows
- Page navigation
- Theme switching
- Recruiter mode toggle

### Coverage Targets
- **Unit**: 90%+
- **Integration**: 70%+
- **E2E**: 10 critical paths

## Consequences
- + Prevent regressions during refactoring
- + Document component behavior
- - Additional build pipeline complexity
- - Requires CI integration

## Future
- Visual regression testing (Storybook + Chromatic)
- Accessibility audit automation (axe-core)
- Performance budget enforcement (Lighthouse CI)
