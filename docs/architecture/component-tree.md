# Component Tree

## Root Layout

```
<html> (recruiter-mode / matrix-mode classes)
  <body>
    <ClientLayout>
      <NavigationDock />         — Bottom dock (desktop) + bottom nav (mobile)
      <SearchModal />            — Global search overlay
      <AiAssistant />            — Floating AI assistant
      <HackerTerminal />         — Terminal overlay
      <CommandPalette />         — Ctrl+K palette
      <RecruiterBanner />        — Recruiter mode banner
      {children}                 — Page content
      <Footer />
    </ClientLayout>
  </body>
</html>
```

## UI Primitives

```
components/ui/
├── glass-card.tsx       — GlassCard: glow, variant, tilt, float
├── button.tsx           — Button: variant, size, loading, success, error, magnetic, ripple
├── command-palette.tsx  — Global command palette
├── search-modal.tsx     — Search overlay
├── ai-assistant.tsx     — AI chat assistant
└── hacker-terminal.tsx  — Terminal overlay
```

## Module Architecture

Each module follows:

```
modules/<name>/
├── <name>-data.ts       — Types, constants, mock data, helper functions
├── <name>-store.ts      — Zustand store (if needed)
└── <name>-page.tsx      — Client component with all sub-components

app/<name>/
└── page.tsx             — Server route, exports metadata
```
