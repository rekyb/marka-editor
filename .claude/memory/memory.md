# Project Memory — Markdown Editor v0

## 2026-04-26

### Anti-Patterns
- MUI ThemeProvider + Emotion CSS-in-JS in Next.js SSR causes hydration mismatches where server and client generate different class names. Workaround: defer MUI styling until Phase 2 when components are built, use plain HTML/CSS for layout.

### Discoveries
- Removing Client Component providers (Providers.tsx) and MUI from root layout, using plain HTML/CSS instead, resolves hydration errors and unblocks Phase 2 work. This allows incremental styling later.

### Patterns
- xplan with exact file paths, component responsibilities, and test specifications produces implementation plans with 100% confidence and catches architectural unknowns upfront before coding.
- xdesign exploration mode (3 named concepts) lets users choose visual direction with concrete trade-offs before locking into implementation, reducing scope creep.

### Corrections
- Initial hydration fix attempts (Emotion cache provider, CssBaseline, suppressHydrationWarning) all failed because the root cause was MUI's sx prop generating different styles on server vs client. Solution: skip MUI for layout, use plain HTML, add MUI back later in Phase 2 when components are built.

## Progress

- Phase 1 (Project Setup): Complete
- Phase 2 (Core Editor Setup): Next
- Phases 3-9: Pending

## Tech Stack Decisions

- CodeMirror 6 for editor (lightweight, markdown support, undo/redo built-in)
- react-markdown for preview (safe rendering)
- Plain HTML/CSS for layout in Phase 1 (avoid MUI SSR issues initially)
- MUI v7 + Emotion deferred to Phase 2+ (add when components need styling)
- localStorage for auto-save (client-side only in v0)
