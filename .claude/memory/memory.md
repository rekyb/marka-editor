# Project Memory — Markdown Editor v0

## 2026-04-26

### Planning Session (Morning)

#### Corrections
- Initial hydration fix attempts (Emotion cache provider, CssBaseline, suppressHydrationWarning) all failed because the root cause was MUI's sx prop generating different styles on server vs client. Solution: skip MUI for layout, use plain HTML, add MUI back later in Phase 2 when components are built.
- Settings had overly permissive `"Bash(git *)"` permission; replaced with specific commands (git status, git log, git diff) to reduce security surface while keeping needed operations available.
- Model setting `"haiku"` in settings.local.json conflicted with xplan's Opus requirement; removed local override to use global setting (local config can shadow global settings silently).

#### Discoveries
- Removing Client Component providers (Providers.tsx) and MUI from root layout, using plain HTML/CSS instead, resolves hydration errors and unblocks Phase 2 work. This allows incremental styling later.
- Next.js 16 SSR triggers during build; `localStorage` access in hook initializers throws ReferenceError during prerender. Guard with `typeof window !== 'undefined'` to prevent server-side code during build phase.

#### Patterns
- xplan with exact file paths, component responsibilities, and test specifications produces implementation plans with 100% confidence and catches architectural unknowns upfront before coding.
- xdesign exploration mode (3 named concepts) lets users choose visual direction with concrete trade-offs before locking into implementation, reducing scope creep.
- xplan → xvibe-fe workflow produces working implementation with no rework; structured planning with confidence scoring before fast iteration eliminates uncertainty.
- Conventional commits (feat:, fix:, styles:) with atomic scope changes enable clean git history and easy bisect; each commit is a unit of work understandable in isolation.

#### Anti-Patterns
- MUI ThemeProvider + Emotion CSS-in-JS in Next.js SSR causes hydration mismatches where server and client generate different class names. Workaround: defer MUI styling until Phase 2 when components are built, use plain HTML/CSS for layout.

## Progress

- Phase 1 (Project Setup): Complete
- Phase 2 (Core Editor Setup): Complete
- Phase 3 (Preview & Layout): Complete (2026-04-26)
- Phase 4-9: Pending

## Tech Stack Decisions

- CodeMirror 6 for editor (lightweight, markdown support, undo/redo built-in)
- react-markdown for preview (safe rendering)
- Plain HTML/CSS for layout in Phase 1 (avoid MUI SSR issues initially)
- MUI v7 + Emotion deferred to Phase 2+ (add when components need styling)
- localStorage for auto-save (client-side only in v0)
