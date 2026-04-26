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

## 2026-04-26 (Afternoon — Image Modal & Scrollbar)

### Corrections
- Code block rendering wrapped SyntaxHighlighter in a `<div>`, causing `<pre>` inside `<p>` hydration errors. Fix: return SyntaxHighlighter directly from code component handler, letting react-markdown manage structure. React-markdown's custom component handlers must respect parent element constraints.

### Discoveries
- Creating a dedicated ImageInsertModal with form inputs, live preview, and clear insert/cancel callbacks provides a clean pattern for user-guided content insertion. Dedicated modal components decouple insertion logic from toolbar state.
- ResizeObserver on CodeMirror's scrollDOM provides reliable scroll-width tracking for synchronized UI elements, avoiding brittle manual measurements. Enables sticky scrollbar implementation that mirrors editor content width.

### Patterns
- Passing options objects to utility functions (applyFormatting with `{ altText, url }`) cleanly extends functionality without signature bloat. Options objects scale better than adding multiple parameters.
- Dedicated modal components with form inputs and clear insert/cancel callbacks make integration with toolbar straightforward and composable.

### Anti-Patterns
- Attempting to make CodeMirror's internal scrollbar "sticky" via CSS or wrapper hacks is friction-prone. Parallel scrollbar elements synced via scroll event listeners work more reliably.
- Wrapping code blocks in extra divs when returning from react-markdown custom component handlers breaks the expected HTML structure (pre cannot be descendant of p).

## 2026-04-26 (Evening — Dynamic Title & Status Bar)

### Corrections
- Assumed file-opening functionality was needed when user asked for dynamic title display. Over-engineered with Ctrl+O shortcut and file input, then removed when user clarified scope. Clarify feature scope explicitly before implementing extensions.
- Created clickable filename button to trigger file picker when user only wanted plain text title that updates dynamically. Misread UI interaction request as requiring affordance change.

### Discoveries
- User prefers formatted/preview mode as default on app load, not syntax mode. Suggests UX priority for this app is consuming markdown content, not editing.
- Version tracking in constants file makes automatic version display in status bar and simplifies version updates at merge time.

### Patterns
- User requests benefit from literal, minimal implementation rather than feature extensions. File title request was cleanest when reduced to only title update, no file picker.
- StatusBar with left-right split layout (version on left, document stats on right) provides clean visual hierarchy for app info vs document info.

### Anti-Patterns
- Adding extra functionality beyond what was requested (file open feature for a title display request) creates unnecessary rework when user clarifies scope.

## Tech Stack Decisions

- CodeMirror 6 for editor (lightweight, markdown support, undo/redo built-in)
- react-markdown for preview (safe rendering)
- Plain HTML/CSS for layout in Phase 1 (avoid MUI SSR issues initially)
- MUI v7 + Emotion deferred to Phase 2+ (add when components need styling)
- localStorage for auto-save (client-side only in v0)
- Default to formatted/preview mode on app load (UX priority: content consumption)
