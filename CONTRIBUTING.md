# Contributing to Cyber Nexus

Thank you for considering contributing! This document outlines the process.

## Getting Started

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

## Development

### Code Style

- TypeScript strict mode
- ESLint with `eslint-config-next` (core-web-vitals + typescript)
- Tailwind CSS v4 with Liquid Glass design tokens
- Prefer CSS custom properties over hardcoded values

### Module Pattern

Follow the established module pattern:

```
modules/<name>/
├── <name>-data.ts    — Types, constants, data, helpers
├── <name>-store.ts   — Zustand store (if needed)
└── <name>-page.tsx   — Client component

app/<name>/
└── page.tsx          — Server route with metadata
```

### Pull Request Process

1. Ensure build passes: `npm run build`
2. Ensure lint passes: `npm run lint`
3. Update documentation if adding features
4. Open PR with clear description of changes

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).
