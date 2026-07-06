# ADR-006: Performance Optimization

**Status:** Accepted  
**Date:** 2026-07-04  
**Author:** Cyber Nexus Engineering

## Context

The portfolio includes heavy visualizations (3D, force graphs, animations) and must load quickly and run smoothly.

## Decision

1. **Static generation**: All non-dynamic pages pre-rendered at build time (`○` static)
2. **Image optimization**: Next.js `<Image>` with AVIF/WebP format negotiation
3. **Package optimization**: `optimizePackageImports` for Tabler icons, framer-motion, Three.js
4. **Lazy loading**: Heavy components (3D scenes, force graphs) loaded via dynamic import
5. **Animation performance**: GPU-accelerated transforms (`translate3d`, `scale`) — no layout-triggering properties
6. **Bundle analysis**: Monitor via `next/bundle-analyzer`

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.0s |
| Largest Contentful Paint | < 2.0s |
| Total Blocking Time | < 100ms |
| Cumulative Layout Shift | < 0.05 |
| JavaScript bundle | < 500 KB (critical path) |
| Lighthouse Performance | > 90 |

## Consequences
- + Fast initial load (static HTML)
- + Smooth 60fps animations
- - Static pages don't reflect real-time data without client-side hydration
