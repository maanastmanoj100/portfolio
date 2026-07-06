# Data Flow Architecture

## Rendering Strategy

```
Browser Request
    ↓
Next.js Server (RSC)
    ↓
Server Component — fetches data, renders HTML
    ↓
Client Component — hydrates, adds interactivity
    ↓
Zustand Store — client-side state management
```

- **Static pages** (`○`): Pre-rendered at build time — 33 of 36 routes
- **Dynamic pages** (`ƒ`): `/blog/[slug]`, `/projects/[slug]`, `/skills/[slug]`
- **API routes**: `/api/analytics` — serverless function

## State Management

| Store | Scope | Persisted |
|-------|-------|-----------|
| `ui-store` | UI state (modals, recruiter mode, search) | No |
| `theme-store` | Theme mode (dark, cyber, matrix) | Yes |
| `dashboard-store` | SOC metrics | No |
| `mouse-store` | Cursor position for effects | No |
| `search-store` | Search state | No |
| `settings-store` | User preferences | Yes |
| `terminal-store` | Terminal history | Yes |

## Data Sources

- **Static data**: TypeScript files in `data/` and `modules/*/` — compiled at build time
- **Simulated real-time**: `setInterval` + Zustand updates for demo metrics
- **API**: `/api/analytics` for page view tracking
- **External**: None — all data is self-contained for privacy and reproducibility
