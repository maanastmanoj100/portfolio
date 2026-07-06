# Contribution Guide

## Getting Started

```bash
git clone <repo>
cd cyber-nexus
npm install
npm run dev
```

## Development Workflow

1. Create a branch from `main`
2. Make changes following code conventions
3. Verify: `npm run lint && npm run build`
4. Open a pull request

## Code Conventions

- TypeScript strict mode
- `"use client"` only when interactivity is needed
- Module pattern: data layer separate from components
- `GlassCard` / `Button` for UI primitives
- Tabler icons from `@tabler/icons-react`
- `cn()` utility for conditional classes
- `text-muted-foreground` for secondary text
- CSS custom properties for colors

## Adding a New Module

1. Create `modules/<name>/<name>-data.ts` — types, constants, data
2. Create `modules/<name>/<name>-page.tsx` — `"use client"` component
3. Create `app/<name>/page.tsx` — server route with metadata
4. Add nav item to `components/layout/navigation-dock.tsx`

## Commit Messages

Follow conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
