# Markdown Editor v0 — Research & Context

## Problem Statement
Your team (dev, UX researcher, designer, PM, QA) needs a lightweight markdown editor for writing documentation, design specs, and working notes. Current solutions (external tools, IDE plugins) create friction across different roles and workflows.

## User Research Summary

**Target Users:** Tech professionals
- **Developers:** Appreciate keyboard shortcuts, syntax highlighting, markdown expertise
- **UX Researchers:** Need formatting for notes, quotes, lists
- **Designers:** Want live preview, simple interface, focus on writing
- **PMs:** Need to write specs, format requirements, export cleanly
- **QA:** Document test cases, format edge cases, tables (future)

**Key Insight:** All roles value simplicity, speed, and not leaving the browser.

## Technology Landscape

### Editor Libraries
| Library | Size | Undo/Redo | Line Numbers | Markdown | Notes |
|---------|------|-----------|--------------|----------|-------|
| **CodeMirror 6** | ~300KB | ✓ Built-in | ✓ Built-in | ✓ Excellent | *Selected* — lightweight, great DX |
| Monaco Editor | ~1MB | ✓ Built-in | ✓ Built-in | ✓ Good | Too heavy for this use case |
| Ace Editor | ~250KB | ✓ Built-in | ✓ Built-in | ✓ Good | Good, but CodeMirror has better ecosystem |
| TipTap | Variable | ✓ Built-in | ✗ No | Rich text only | Wrong paradigm (rich text vs markdown) |

**Decision:** CodeMirror 6 offers the best balance of features, bundle size, and ecosystem for markdown editing.

### Markdown Rendering
| Library | Security | Features | Size | Notes |
|---------|----------|----------|------|-------|
| **react-markdown** | ✓ Safe (escapes HTML) | Customizable, plugins (gfm) | ~50KB | *Selected* — simple, secure, composable |
| markdown-it | ✓ Safe | Very flexible | ~50KB | Requires wrapper for React |
| unified/remark | ✓ Safe | Extensible plugins | Larger | Overkill for v0 |

**Decision:** react-markdown provides safe rendering with good React integration.

### Bundle Size Impact
```
CodeMirror 6: ~300KB gzipped
react-markdown: ~50KB gzipped
MUI v7: ~350KB gzipped (already in project)
Total NEW: ~350KB (CodeMirror is main overhead)

Mitigation: Dynamic import or code-splitting for editor component
```

## Stack Alignment

**Per CLAUDE.md global standards:**
- ✓ Frontend: Next.js App Router, Server Components ← **APPLIES**
- ✓ Database: MongoDB ← **NOT NEEDED for v0** (client-side storage only)
- ✓ Testing: Playwright + Vitest ← **APPLIES**
- ✓ TypeScript: Strict mode ← **APPLIES**
- ✓ UI: MUI v7 ← **APPLIES**
- ✓ Package manager: pnpm ← **APPLIES**

No conflicts with project standards.

## Architecture Patterns

### State Management Decision
**Why useReducer + custom hooks instead of external state manager?**
1. No shared cross-component state (except editor ↔ preview)
2. Undo/redo is simpler with custom reducer
3. Reduces dependencies (lighter bundle)
4. Clear data flow: Editor → useDocument → Preview

**Alternative considered:** Redux, Zustand
- Redux: Overkill for single-document app
- Zustand: Could work, but not needed yet

### File I/O Strategy
**Why HTML5 File API instead of backend?**
1. v0 requirement: "No cloud sync"
2. Simplifies deployment (no backend infrastructure)
3. Users expect browser download/open UX
4. Easy to extend to backend in v1 (wrap saveFile/openFile)

**localStorage for auto-save:**
- Recovers draft if browser crashes
- No network dependency
- ~5-10MB limit sufficient for markdown files

## Keyboard Shortcuts Justification

Selected shortcuts follow IDE/editor conventions:

| Shortcut | Convention | Rationale |
|----------|-----------|-----------|
| Ctrl+S / Cmd+S | Save | Universal expectation across OS |
| Ctrl+O / Cmd+O | Open | Universal expectation across OS |
| Ctrl+B / Cmd+B | Bold | Browsers (Gmail, Docs), Office |
| Ctrl+I / Cmd+I | Italic | Browsers, Office |
| Ctrl+K / Cmd+K | Link | Browsers, Slack, Figma |
| Ctrl+` / Cmd+` | Code | VS Code, IDEs |
| Ctrl+Alt+C / Cmd+Opt+C | Code Block | Avoids browser conflicts |
| Ctrl+P / Cmd+P | Toggle Preview | Custom but memorable |

Note: CodeMirror has built-in Ctrl+Z/Ctrl+Shift+Z (Undo/Redo), no need to redefine.

## Accessibility Considerations

- **Semantic HTML:** Use `<button>`, `<textarea>` not `<div>` (CodeMirror handles this)
- **ARIA labels:** Buttons have descriptive labels + title attributes
- **Keyboard navigation:** All toolbar buttons focusable, operable via keyboard
- **Focus indicators:** MUI provides visible focus rings
- **Color contrast:** Indigo (#6366F1) / white passes WCAG AA
- **Reduced motion:** CodeMirror animations respect `prefers-reduced-motion`

## Performance Baselines

**Target metrics (v0):**
- Time to Interactive (TTI): < 2s
- Largest Contentful Paint (LCP): < 1.5s
- Cumulative Layout Shift (CLS): < 0.1
- Memory: < 50MB on init, < 100MB with large file

**Not yet optimized:** Code-splitting, image optimization, service worker (v1+)

## Design System Integration

**Applying DESIGN.md tokens:**
```
Primary Color:      #6366F1 (indigo) → buttons, active editor lines
Surface:            #FFFFFF → editor background, preview pane
Text Primary:       #0A0A0A → body text
Border:             #E8E8EC → editor border, dividers
Font (Body):        DM Sans (from Google Fonts)
Font (Heading):     Open Sans (from Google Fonts)
Spacing:            4px grid (4, 8, 12, 16, 20, 24, 32...)
Border Radius:      6px buttons/inputs, 8px panels
Shadows:            Minimal — only on hover (0 8px 30px rgba(0,0,0,0.08))
```

## Future Extensibility

**v1 Candidates (not in v0):**
- Cloud sync (Firebase, Supabase, or custom backend)
- Collaborative editing (Yjs, Automerge)
- Dark mode
- Export (PDF, HTML, LaTeX)
- Templates
- Search/replace
- Plugin system

**Architecture enables:** All of these with minimal refactor due to separation of concerns (hooks isolate state, components are small).

## Risk Mitigation Plan

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| CodeMirror bundle size | Low | Medium | Dynamic import; v1 code-splitting |
| Keyboard shortcut conflicts | Low | Low | Document conflicts; use Ctrl+Alt for custom |
| localStorage quota exceeded | Very low | Low | Add quota check; warn user |
| File I/O not supported (old browsers) | Very low | Low | Graceful fallback (hide Save/Open buttons) |
| Performance with >100k lines | Low | Low | CodeMirror handles virtualization internally |

