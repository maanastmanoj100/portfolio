# ADR-001: Monorepo Structure

**Status:** Accepted  
**Date:** 2026-07-04  
**Author:** Cyber Nexus Engineering

## Context

The project needs to scale from a personal portfolio to a production-grade platform with multiple applications, shared packages, and tooling configurations.

## Decision

Use a single Next.js application as the monorepo root with clear directory separation:

- `app/` — Application routes (Next.js App Router)
- `modules/` — Self-contained feature modules
- `components/` — Shared UI component library
- `lib/` — Shared utilities and hooks
- `stores/` — Global state management
- `data/` — Source data layer
- `docs/` — Architecture documentation

## Consequences

- + Simple tooling (single `package.json`, `tsconfig.json`)
- + Easy refactoring across modules
- + All code visible in a single project
- - No independent versioning of packages
- - Build time grows with module count

## Alternatives Considered

- **Turborepo multi-package**: Over-engineered for current scale
- **Git submodules**: Adds unnecessary complexity
