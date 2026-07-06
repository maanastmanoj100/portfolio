# ADR-007: CI/CD Pipeline

**Status:** Proposed  
**Date:** 2026-07-04  
**Author:** Cyber Nexus Engineering

## Context

Automated builds, tests, and deployments are essential for maintainable software engineering.

## Decision

GitHub Actions pipeline with the following workflow:

### On PR / Push to main

```
1. Checkout + Install dependencies
2. Lint (ESLint)
3. Type check (TypeScript — strict)
4. Unit tests (Vitest)
5. Build (next build)
6. Preview deployment (Vercel)
```

### On Release

```
1. Run full test suite
2. Build production bundle
3. Deploy to production (Vercel)
4. Run Lighthouse CI
5. Generate release notes
```

## Quality Gates

- Zero TypeScript errors (`strict: true`)
- Zero ESLint warnings
- Build passes clean
- All tests pass (once implemented)
- < 100 KB increase in critical bundle

## Consequences
- + Automated quality assurance
- + Preview deployments for review
- - Requires GitHub Actions configuration
- - Build minutes consumed per commit
