# Deployment Guide

## Production Build

```bash
npm run build
npm run start
```

## Vercel Deployment (Recommended)

1. Connect repository to Vercel
2. Framework preset: Next.js
3. Build command: `npm run build`
4. Output directory: `.next`

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| (none currently) | — | — |

No environment variables are currently required. The project is fully self-contained.

## Post-Deployment Checklist

- [ ] All pages render correctly
- [ ] Static pages pre-rendered (`○` in build output)
- [ ] Dynamic routes work (`/blog/[slug]`, etc.)
- [ ] Recruiter mode toggles correctly
- [ ] Theme switching works
- [ ] Terminal responds to commands
- [ ] Search returns results
- [ ] Lighthouse scores > 90
- [ ] No broken internal links
