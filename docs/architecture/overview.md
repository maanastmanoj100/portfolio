# Cyber Nexus — Architecture Overview

## Project Structure

```
cyber-nexus/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home page
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Tailwind v4 + Liquid Glass tokens
│   └── */page.tsx        # 33 route pages
├── components/           # Reusable UI components
│   ├── layout/           # Navigation dock, top bar, footer
│   ├── ui/               # GlassCard, Button, and other primitives
│   └── shared/           # Shared section components
├── modules/              # Self-contained feature modules
│   ├── ctf-command-center/
│   ├── cyber-lab/
│   ├── knowledge-graph/
│   ├── achievement/
│   ├── wiki/
│   ├── project-architect/
│   ├── security-architect/
│   ├── cyber-os/
│   ├── cyber-nexus-x/
│   ├── command-center/
│   └── platform-engineering/
├── data/                 # Source data (projects, skills, certs, blog)
├── stores/               # Zustand state stores
├── lib/                  # Utilities, hooks, helpers
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── public/               # Static assets
├── docs/                 # Architecture & engineering documentation
└── tooling/              # Shared dev tooling configs
```

## Design Decisions

- **Next.js App Router** — Server components by default, client components where interactivity is needed
- **Tailwind CSS v4** — CSS-based configuration via `@theme` directive in `globals.css`
- **Zustand** — Lightweight state management with `persist` middleware for settings
- **Framer Motion** — Declarative animations and gesture handling
- **Tabler Icons** — Consistent icon system across all modules
- **Module isolation** — Each feature is self-contained in `modules/<name>/` with its own data layer, components, and types

## Key Patterns

1. **Module pattern**: `modules/<name>/<name>-data.ts` (data) + `<name>-page.tsx` (client component) + `app/<name>/page.tsx` (server route)
2. **Data source transparency**: All data tagged as LIVE, DEMO, HIST, or SIM
3. **Liquid Glass design**: Consistent glassmorphism via CSS custom properties
4. **Keyboard shortcuts**: Centralized in `lib/keyboard.ts` via `useKeyboardShortcuts`
5. **Recruiter mode**: Toggled via `useUIStore` — applies `recruiter-mode` CSS class
