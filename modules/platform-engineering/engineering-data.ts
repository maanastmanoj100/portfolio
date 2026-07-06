export interface AdrEntry {
  id: string;
  title: string;
  status: "Accepted" | "Proposed" | "Deprecated" | "Superseded";
  date: string;
  summary: string;
  path: string;
}

export interface DocEntry {
  id: string;
  title: string;
  category: string;
  path: string;
  wordCount: number;
  lastUpdated: string;
}

export interface DependencyInfo {
  name: string;
  version: string;
  latest: string;
  status: "up-to-date" | "minor-behind" | "major-behind" | "security";
  severity?: "critical" | "high" | "medium" | "low";
  advisory?: string;
}

export interface PerfMetric {
  label: string;
  value: string;
  target: string;
  status: "pass" | "warn" | "fail";
  trend: "up" | "down" | "stable";
}

export interface QualityMetric {
  label: string;
  value: number;
  target: number;
  unit: string;
  status: "pass" | "warn" | "fail";
  priority: "critical" | "high" | "medium" | "low";
}

export interface TechDebtItem {
  id: string;
  title: string;
  description: string;
  area: string;
  effort: "small" | "medium" | "large";
  impact: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
}

export interface DocCoverageItem {
  component: string;
  documented: boolean;
  hasTests: boolean;
  hasA11y: boolean;
}

export interface DependencyTrend {
  month: string;
  outdated: number;
  secure: number;
  critical: number;
}

// ─── ARCHITECTURE DECISION RECORDS ─────────────────────────────────────

export const ADRS: AdrEntry[] = [
  { id: "adr-001", title: "Monorepo Structure", status: "Accepted", date: "2026-07-04", summary: "Single Next.js application as monorepo root with directory-based separation of concerns.", path: "/docs/adr/ADR-001-monorepo-structure.md" },
  { id: "adr-002", title: "Liquid Glass Design System", status: "Accepted", date: "2026-07-04", summary: "Tailwind CSS v4 with @theme directive for design tokens, GlassCard/Button primitives.", path: "/docs/adr/ADR-002-design-system.md" },
  { id: "adr-003", title: "State Management with Zustand", status: "Accepted", date: "2026-07-04", summary: "Zustand for all client state with persist middleware for settings/preferences.", path: "/docs/adr/ADR-003-state-management.md" },
  { id: "adr-004", title: "Accessibility Standards (WCAG AA)", status: "Accepted", date: "2026-07-04", summary: "Keyboard navigation, screen readers, reduced motion, high contrast, focus management.", path: "/docs/adr/ADR-004-accessibility.md" },
  { id: "adr-005", title: "Testing Strategy", status: "Proposed", date: "2026-07-04", summary: "Three-tier: unit (Vitest), integration (Testing Library), E2E (Playwright).", path: "/docs/adr/ADR-005-testing-strategy.md" },
  { id: "adr-006", title: "Performance Optimization", status: "Accepted", date: "2026-07-04", summary: "Static generation, image optimization, lazy loading, package optimization.", path: "/docs/adr/ADR-006-performance.md" },
  { id: "adr-007", title: "CI/CD Pipeline", status: "Proposed", date: "2026-07-04", summary: "GitHub Actions with lint, type-check, test, build, deploy workflow.", path: "/docs/adr/ADR-007-cicd.md" },
  { id: "adr-008", title: "Security Engineering", status: "Accepted", date: "2026-07-04", summary: "No secrets, data source transparency, CSP, dependency scanning, responsible disclosure.", path: "/docs/adr/ADR-008-security.md" },
];

// ─── DOCUMENTATION INDEX ───────────────────────────────────────────────

export const DOCS_INDEX: DocEntry[] = [
  { id: "doc-arch-overview", title: "Architecture Overview", category: "architecture", path: "/docs/architecture/overview.md", wordCount: 420, lastUpdated: "2026-07-04" },
  { id: "doc-data-flow", title: "Data Flow Architecture", category: "architecture", path: "/docs/architecture/data-flow.md", wordCount: 280, lastUpdated: "2026-07-04" },
  { id: "doc-component-tree", title: "Component Tree", category: "architecture", path: "/docs/architecture/component-tree.md", wordCount: 190, lastUpdated: "2026-07-04" },
  { id: "doc-adr-001", title: "ADR-001: Monorepo Structure", category: "adr", path: "/docs/adr/ADR-001-monorepo-structure.md", wordCount: 180, lastUpdated: "2026-07-04" },
  { id: "doc-adr-002", title: "ADR-002: Design System", category: "adr", path: "/docs/adr/ADR-002-design-system.md", wordCount: 200, lastUpdated: "2026-07-04" },
  { id: "doc-adr-003", title: "ADR-003: State Management", category: "adr", path: "/docs/adr/ADR-003-state-management.md", wordCount: 160, lastUpdated: "2026-07-04" },
  { id: "doc-adr-004", title: "ADR-004: Accessibility", category: "adr", path: "/docs/adr/ADR-004-accessibility.md", wordCount: 170, lastUpdated: "2026-07-04" },
  { id: "doc-adr-005", title: "ADR-005: Testing Strategy", category: "adr", path: "/docs/adr/ADR-005-testing-strategy.md", wordCount: 210, lastUpdated: "2026-07-04" },
  { id: "doc-adr-006", title: "ADR-006: Performance", category: "adr", path: "/docs/adr/ADR-006-performance.md", wordCount: 190, lastUpdated: "2026-07-04" },
  { id: "doc-adr-007", title: "ADR-007: CI/CD", category: "adr", path: "/docs/adr/ADR-007-cicd.md", wordCount: 200, lastUpdated: "2026-07-04" },
  { id: "doc-adr-008", title: "ADR-008: Security", category: "adr", path: "/docs/adr/ADR-008-security.md", wordCount: 180, lastUpdated: "2026-07-04" },
  { id: "doc-guide-contributing", title: "Contributing Guide", category: "guides", path: "/docs/guides/contributing.md", wordCount: 150, lastUpdated: "2026-07-04" },
  { id: "doc-guide-deployment", title: "Deployment Guide", category: "guides", path: "/docs/guides/deployment.md", wordCount: 120, lastUpdated: "2026-07-04" },
];

// ─── DEPENDENCIES ──────────────────────────────────────────────────────

export const DEPENDENCIES: DependencyInfo[] = [
  { name: "next", version: "16.2.10", latest: "16.2.10", status: "up-to-date" },
  { name: "react", version: "19.2.4", latest: "19.2.4", status: "up-to-date" },
  { name: "react-dom", version: "19.2.4", latest: "19.2.4", status: "up-to-date" },
  { name: "framer-motion", version: "12.42.2", latest: "12.44.0", status: "minor-behind" },
  { name: "zustand", version: "5.0.14", latest: "5.0.14", status: "up-to-date" },
  { name: "@tabler/icons-react", version: "3.44.0", latest: "3.50.0", status: "minor-behind" },
  { name: "tailwindcss", version: "4.0.0", latest: "4.0.0", status: "up-to-date" },
  { name: "typescript", version: "5.7.3", latest: "5.8.2", status: "minor-behind" },
  { name: "three", version: "0.185.1", latest: "0.186.0", status: "minor-behind" },
  { name: "@react-three/fiber", version: "9.6.1", latest: "9.6.1", status: "up-to-date" },
  { name: "gsap", version: "3.15.0", latest: "3.15.0", status: "up-to-date" },
];

// ─── PERFORMANCE METRICS ───────────────────────────────────────────────

export const PERF_METRICS: PerfMetric[] = [
  { label: "First Contentful Paint", value: "0.8s", target: "< 1.0s", status: "pass", trend: "stable" },
  { label: "Largest Contentful Paint", value: "1.4s", target: "< 2.0s", status: "pass", trend: "up" },
  { label: "Total Blocking Time", value: "85ms", target: "< 100ms", status: "pass", trend: "down" },
  { label: "Cumulative Layout Shift", value: "0.03", target: "< 0.05", status: "pass", trend: "stable" },
  { label: "JavaScript Bundle (critical)", value: "420 KB", target: "< 500 KB", status: "pass", trend: "up" },
  { label: "Lighthouse Performance", value: "94", target: "> 90", status: "pass", trend: "stable" },
  { label: "Lighthouse Accessibility", value: "88", target: "> 90", status: "warn", trend: "stable" },
  { label: "Lighthouse Best Practices", value: "92", target: "> 90", status: "pass", trend: "up" },
  { label: "Lighthouse SEO", value: "95", target: "> 90", status: "pass", trend: "stable" },
];

// ─── QUALITY METRICS ───────────────────────────────────────────────────

export const QUALITY_METRICS: QualityMetric[] = [
  { label: "Documentation Coverage", value: 65, target: 80, unit: "%", status: "warn", priority: "high" },
  { label: "Test Coverage", value: 0, target: 70, unit: "%", status: "fail", priority: "critical" },
  { label: "Type Safety (strict)", value: 100, target: 100, unit: "%", status: "pass", priority: "high" },
  { label: "Accessibility (AA)", value: 75, target: 90, unit: "%", status: "warn", priority: "high" },
  { label: "Performance Budget", value: 100, target: 100, unit: "%", status: "pass", priority: "medium" },
  { label: "Bundle Size Budget", value: 100, target: 100, unit: "%", status: "pass", priority: "medium" },
  { label: "ESLint Zero Warnings", value: 100, target: 100, unit: "%", status: "pass", priority: "high" },
  { label: "Build Pass Rate", value: 100, target: 100, unit: "%", status: "pass", priority: "critical" },
  { label: "Dependencies Up-to-Date", value: 55, target: 80, unit: "%", status: "warn", priority: "medium" },
  { label: "ADRs Documented", value: 100, target: 100, unit: "%", status: "pass", priority: "medium" },
];

// ─── TECHNICAL DEBT ────────────────────────────────────────────────────

export const TECH_DEBT: TechDebtItem[] = [
  { id: "td-1", title: "No test infrastructure", description: "No test runner configured. Zero test coverage across all modules.", area: "Testing", effort: "large", impact: "high", status: "open" },
  { id: "td-2", title: "Missing CI/CD pipeline", description: "No GitHub Actions workflows for automated build, test, or deployment.", area: "DevOps", effort: "medium", impact: "high", status: "open" },
  { id: "td-3", title: "Lighthouse accessibility below target", description: "Current Lighthouse a11y score is 88, target is 90+.", area: "Accessibility", effort: "medium", impact: "medium", status: "open" },
  { id: "td-4", title: "Several dependencies behind latest", description: "Framer-motion, Tabler Icons, TypeScript, Three.js have available updates.", area: "Dependencies", effort: "small", impact: "low", status: "open" },
  { id: "td-5", title: "No visual regression testing", description: "No Storybook or Chromatic setup for visual regression detection.", area: "Testing", effort: "large", impact: "medium", status: "open" },
  { id: "td-6", title: "No environment variable validation", description: "No schema validation for environment variables at build time.", area: "Infrastructure", effort: "small", impact: "low", status: "open" },
];

// ─── DEPENDENCY TREND ──────────────────────────────────────────────────

export const DEP_TREND: DependencyTrend[] = [
  { month: "2026-04", outdated: 4, secure: 18, critical: 0 },
  { month: "2026-05", outdated: 3, secure: 20, critical: 0 },
  { month: "2026-06", outdated: 5, secure: 22, critical: 1 },
  { month: "2026-07", outdated: 4, secure: 24, critical: 0 },
];

// ─── MODULE INVENTORY ──────────────────────────────────────────────────

export const MODULE_INVENTORY = [
  { name: "ctf-command-center", pages: 34, components: 11, dataTypes: 7, hasDocs: true, hasTests: false },
  { name: "cyber-lab", pages: 12, components: 13, dataTypes: 9, hasDocs: true, hasTests: false },
  { name: "knowledge-graph", pages: 79, components: 3, dataTypes: 4, hasDocs: true, hasTests: false },
  { name: "achievement", pages: 30, components: 8, dataTypes: 6, hasDocs: true, hasTests: false },
  { name: "wiki", pages: 43, components: 16, dataTypes: 8, hasDocs: true, hasTests: false },
  { name: "project-architect", pages: 1, components: 16, dataTypes: 5, hasDocs: true, hasTests: false },
  { name: "security-architect", pages: 8, components: 15, dataTypes: 8, hasDocs: true, hasTests: false },
  { name: "command-center", pages: 1, components: 12, dataTypes: 10, hasDocs: true, hasTests: false },
  { name: "cyber-os", pages: 1, components: 25, dataTypes: 6, hasDocs: true, hasTests: false },
  { name: "cyber-nexus-x", pages: 1, components: 24, dataTypes: 12, hasDocs: true, hasTests: false },
];

// ─── COMPONENT DOCUMENTATION STATUS ────────────────────────────────────

export const COMPONENT_DOCS: DocCoverageItem[] = [
  { component: "GlassCard", documented: true, hasTests: false, hasA11y: true },
  { component: "Button", documented: true, hasTests: false, hasA11y: true },
  { component: "NavigationDock", documented: true, hasTests: false, hasA11y: true },
  { component: "SearchModal", documented: true, hasTests: false, hasA11y: true },
  { component: "AiAssistant", documented: true, hasTests: false, hasA11y: true },
  { component: "HackerTerminal", documented: true, hasTests: false, hasA11y: false },
  { component: "CommandPalette", documented: true, hasTests: false, hasA11y: true },
  { component: "RecruiterBanner", documented: true, hasTests: false, hasA11y: true },
  { component: "ForceGraph", documented: true, hasTests: false, hasA11y: false },
  { component: "ThreatMap", documented: true, hasTests: false, hasA11y: false },
];

// ─── AI ENGINEERING ASSISTANT SUGGESTIONS ──────────────────────────────

export interface EngineeringPrompt {
  question: string;
  answer: string;
}

export const ENGINEERING_PROMPTS: EngineeringPrompt[] = [
  { question: "How is the project structured?", answer: "Cyber Nexus is a single Next.js 16 application organized as a monorepo. **`app/`** contains 33 route pages using the App Router. **`modules/`** holds self-contained features (CTF, Cyber Lab, Knowledge Graph, Wiki, Achievements, etc.) each with a data layer, store, and page component. **`components/`** has the shared UI library (GlassCard, Button, Dock, Terminal). **`stores/`** has global Zustand stores. **`docs/`** documents architecture decisions and guides." },
  { question: "What design system does it use?", answer: "The Liquid Glass design system is implemented entirely in **Tailwind CSS v4** via the `@theme` directive in `app/globals.css`. Key tokens: graphite backgrounds (`#0a0b0e`), cyan accent (`#00b4d8`), glass gradients with backdrop blur, and custom border radius scale (10–28px). The two core primitives are **GlassCard** (glow/tilt/float, 5 variants) and **Button** (5 variants, magnetic hover, ripple click, state machine). All colors use CSS custom properties for runtime theme switching (dark, cyber, matrix)." },
  { question: "How is state managed?", answer: "Uses **Zustand v5** with the `persist` middleware for settings that survive refresh. Global stores in `stores/`: `ui-store` (modals, recruiter mode), `theme-store` (dark/cyber/matrix), `dashboard-store` (SOC metrics). Module-specific stores are co-located: `os-store.ts` manages the Cyber OS desktop (windows, dock, notifications, terminal), `cnx-store.ts` manages the Cyber Nexus X shared platform. Persisted data goes to localStorage; non-essential state reinitializes on load." },
  { question: "What accessibility features exist?", answer: "Targets **WCAG AA** with: (1) Full keyboard navigation on all interactive elements with visible focus indicators, (2) Semantic HTML with ARIA labels and roles throughout, (3) `prefers-reduced-motion` media query disables non-essential animations (GSAP/Framer), (4) `prefers-contrast: more` handling for borders and text, (5) Focus trapping in modals (Command Palette, Search, Terminal), (6) Color contrast ratios meeting 4.5:1 minimum. Current Lighthouse Accessibility score: **88/100** (target: 90+)." },
  { question: "What are the performance targets?", answer: "All static pages pre-rendered at build time (`○`). Targets: **FCP < 1.0s** (current: 0.8s), **LCP < 2.0s** (1.4s), **TBT < 100ms** (85ms), **CLS < 0.05** (0.03), **JS bundle < 500 KB** (420 KB). Uses Next.js image optimization (AVIF/WebP), `optimizePackageImports` for Tabler icons/Framer/Three.js, and GPU-accelerated CSS transforms for animations. Current Lighthouse Performance: **94**." },
  { question: "What's the testing strategy?", answer: "Currently **no test infrastructure exists** — this is the top technical debt item. The proposed strategy (ADR-005) defines three tiers: **Tier 1 — Unit tests** (Vitest + Testing Library) for pure utilities, data helpers, and stores. **Tier 2 — Integration tests** (Vitest + Testing Library) for component rendering, module smoke tests. **Tier 3 — E2E** (Playwright) for critical user flows: navigation, theme switching, recruiter mode. Coverage targets: 90% unit, 70% integration, 10 critical E2E paths." },
  { question: "How are modules structured?", answer: "Each feature follows an isolated module pattern: **`modules/<name>/<name>-data.ts`** — TypeScript types, constants, mock data, helper functions. **`<name>-store.ts`** — optional Zustand store. **`<name>-page.tsx`** — client component with `\"use client\"` directive. The route page at **`app/<name>/page.tsx`** is a server component that imports the module page and exports `Metadata`. This pattern ensures modules can be developed, tested, and refactored independently while sharing the Liquid Glass design language." },
  { question: "What documentation exists?", answer: "**Architecture docs** in `docs/`: overview, data flow, component tree. **ADRs** in `docs/adr/`: 8 architecture decision records covering monorepo, design system, state management, accessibility, testing, performance, CI/CD, security. **Guides** in `docs/guides/`: contributing guide and deployment guide. **Module documentation** embedded in each module's data layer and component code. **Governance files** at root: LICENSE (MIT), CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md, ROADMAP.md. Documentation coverage: ~65% (target: 80%)." },
  { question: "What security practices are followed?", answer: "1. **No secrets in repo** — `.env*` in gitignore, no credentials committed. 2. **Data source transparency** — all data tagged LIVE/DEMO/HIST/SIM. 3. **No real infrastructure** — fictional IPs (10.10.x.x), sanitized configs. 4. **Responsible disclosure** — SECURITY.md with contact info. 5. **Dependency scanning** — via npm audit (to be automated). 6. **TypeScript strict mode** catches type-level vulnerabilities. 7. **Content Security Policy** — planned via next.config.ts. 8. **Input validation** on search, terminal, and chat interfaces." },
];
