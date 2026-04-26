# Phase 3: Preview & Layout — Implementation Plan

**Date Created:** 2026-04-26  
**Status:** Ready for Implementation  
**Scope:** Frontend Only  
**Difficulty:** Simple (layout) + Simple (Preview component)  

---

## 1. Scope & Difficulty

**Scope:** FE only — No backend changes. This phase focuses on UI composition and responsive layout.

**Breakdown:**
- **FE Layout (Simple):** Flex-based responsive layout with media queries; no complex state management beyond existing hooks
- **FE Preview Component (Simple):** Stateless component wrapping react-markdown; package already installed

**Why Simple:** 
- react-markdown and remark-gfm already in dependencies
- useDocument hook already handles state
- No new hooks or complex logic required
- Layout is standard CSS flexbox + media queries

---

## 2. User Role Coverage

**Affected Roles:** End Users (all personas use this editor)

| Step | Role | Impact |
|------|------|--------|
| Layout scaffolding | User | Enables split-view desktop / stacked mobile experience |
| Preview rendering | User | Renders live markdown preview as they type |
| Preview toggle (mobile) | User | Allows switching between editor and preview on small screens |
| Responsive styles | User | Ensures editor usable on desktop, tablet, mobile |

---

## 3. Research Findings

### Existing Infrastructure
- **Editor Component** (`src/components/Editor/index.tsx`): Fully functional CodeMirror wrapper accepting `content` and `onChange` props
- **useDocument Hook** (`src/hooks/useDocument.ts`): Manages document state (content, fileName, isDirty) with localStorage persistence
- **useUndoRedo Hook** (`src/hooks/useUndoRedo.ts`): Handles undo/redo history (not used in page yet)
- **Dependencies:** react-markdown v10.1.0, remark-gfm v4.0.1 already installed
- **Styling:** Plain CSS in `src/app/globals.css`, MUI ThemeProvider configured in `src/app/providers.tsx`
- **Layout:** Root layout wraps with Providers; Next.js 16 App Router in use

### Component Stubs Existing
- `src/components/Preview/` — Empty, needs implementation
- `src/components/Header/` — Empty, deferred to Phase 4
- `src/components/Toolbar/` — Empty, deferred to Phase 4
- `src/components/StatusBar/` — Empty, deferred to Phase 4

### Current Page
- `src/app/page.tsx` is a placeholder; needs replacement with functional editor layout

### Key Constraints
- Next.js 16 (breaking changes noted in AGENTS.md; must verify SSR/RSC boundaries)
- React 19 (latest)
- No MUI components used yet (deferred; plain CSS for Phase 3 per README)
- Editor must remain `'use client'` (uses CodeMirror)

---

## 4. Component Breakdown

### New Component: Preview
**File:** `src/components/Preview/index.tsx`

**Responsibility:** Render markdown content as HTML using react-markdown with GitHub-flavored markdown support.

**Props:**
```typescript
interface PreviewProps {
  readonly content: string;
}
```

**State:** None (stateless, receives content from parent)

**Behavior:**
- Accept markdown content string
- Render using react-markdown with remark-gfm plugin
- Apply dark-text colors for readability against light background
- Handle empty state gracefully (show placeholder text)

---

### Modified Component: EditorLayout (New Container)
**File:** `src/app/page.tsx` — Refactor to be the main layout orchestrator

**Responsibility:** Compose Editor, Preview, and responsive layout logic.

**Props:** None (root page component)

**State Used:**
- useDocument() — for content, fileName, isDirty
- useUndoRedo() — for undo/redo (wired up but displayed in Phase 4 toolbar)
- useState('desktop' | 'mobile', currentView) — track layout mode for mobile preview toggle

**Behavior:**
- Desktop (>= 768px): Show Editor + Preview side-by-side in flex row
- Mobile (< 768px): Stack vertically, show toggle to switch between editor and preview
- Pass content to both Editor and Preview
- Pass onChange from Editor to useDocument.setContent()
- Wire up undo/redo handlers (call from future toolbar)

---

## 5. Implementation Steps

### Step 1: Create Preview Component
**File:** `src/components/Preview/index.tsx`

**Change Type:** New file

**Exact Implementation:**
```typescript
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PreviewProps {
  readonly content: string;
}

export function Preview({ content }: PreviewProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        overflow: 'auto',
        padding: '24px',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#0a0a0a',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e5e5e5',
      }}
    >
      {content.trim() === '' ? (
        <div style={{ color: '#6b6b6b', fontStyle: 'italic' }}>
          Start typing markdown to see preview here...
        </div>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 {...props} style={{ fontSize: '28px', fontWeight: 700, marginTop: '20px', marginBottom: '12px' }} />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} style={{ fontSize: '24px', fontWeight: 700, marginTop: '16px', marginBottom: '10px' }} />
            ),
            h3: ({ node, ...props }) => (
              <h3 {...props} style={{ fontSize: '20px', fontWeight: 600, marginTop: '12px', marginBottom: '8px' }} />
            ),
            p: ({ node, ...props }) => (
              <p {...props} style={{ marginBottom: '12px' }} />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} style={{ marginLeft: '20px', marginBottom: '12px' }} />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} style={{ marginLeft: '20px', marginBottom: '12px' }} />
            ),
            code: ({ node, inline, ...props }: any) =>
              inline ? (
                <code {...props} style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '3px', fontFamily: 'var(--font-jetbrains-mono)' }} />
              ) : (
                <code {...props} style={{ backgroundColor: '#f0f0f0', padding: '12px', borderRadius: '4px', display: 'block', overflow: 'auto', fontFamily: 'var(--font-jetbrains-mono)', marginBottom: '12px' }} />
              ),
            blockquote: ({ node, ...props }) => (
              <blockquote {...props} style={{ borderLeft: '3px solid #6366f1', paddingLeft: '12px', marginLeft: 0, marginBottom: '12px', color: '#6b6b6b' }} />
            ),
            a: ({ node, ...props }) => (
              <a {...props} style={{ color: '#6366f1', textDecoration: 'underline' }} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
}
```

**Rationale:**
- Client component (needed for ReactMarkdown hydration)
- Minimal custom styling for readability
- Placeholder text when empty
- Responsive padding and flex container for height management

**Test File:** `src/components/Preview/Preview.test.tsx`
**Test Plan:**
- Assert markdown content renders to HTML
- Assert heading hierarchy renders correctly
- Assert code blocks render with proper styling
- Assert empty state shows placeholder text
- Assert links are rendered with color styling
- Assert blockquotes render with left border

---

### Step 2: Refactor page.tsx to EditorLayout
**File:** `src/app/page.tsx`

**Change Type:** Full replacement

**Exact Implementation:**
```typescript
'use client';

import { useState } from 'react';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { useDocument } from '@/hooks/useDocument';
import { useUndoRedo } from '@/hooks/useUndoRedo';

export default function EditorLayout() {
  const { state, setContent } = useDocument();
  const { undo, redo } = useUndoRedo(state.content);
  const [view, setView] = useState<'editor' | 'preview'>('editor');

  // Determine if we're on mobile (< 768px)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // On desktop, show split view; on mobile, toggle between editor/preview
  const showEditor = !isMobile || view === 'editor';
  const showPreview = !isMobile || view === 'preview';

  const handleChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleUndo = () => {
    // Will be wired to toolbar in Phase 4
    undo();
  };

  const handleRedo = () => {
    // Will be wired to toolbar in Phase 4
    redo();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header and toolbar will go here in Phase 4 */}

      {/* Main editor/preview area */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {showEditor && (
          <Editor content={state.content} onChange={handleChange} />
        )}

        {showPreview && (
          <Preview content={state.content} />
        )}
      </div>

      {/* Mobile preview/editor toggle */}
      {isMobile && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e5e5',
          }}
        >
          <button
            onClick={() => setView('editor')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: view === 'editor' ? '#6366f1' : '#e5e5e5',
              color: view === 'editor' ? '#ffffff' : '#0a0a0a',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Editor
          </button>
          <button
            onClick={() => setView('preview')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: view === 'preview' ? '#6366f1' : '#e5e5e5',
              color: view === 'preview' ? '#ffffff' : '#0a0a0a',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            Preview
          </button>
        </div>
      )}

      {/* Status bar will go here in Phase 5 */}
    </div>
  );
}
```

**Rationale:**
- Single `'use client'` at page level (required for useState, hooks)
- Manages layout branching logic (desktop vs mobile)
- Passes content/onChange to Editor
- Passes content to Preview
- Mobile toggle for view switching
- Hooks wired (useDocument, useUndoRedo) for future phase integration
- Placeholder comments for Phase 4/5 components

**Test File:** `src/app/page.test.tsx`
**Test Plan:**
- Assert Editor and Preview render with correct props
- Assert desktop shows both Editor and Preview side-by-side
- Assert mobile shows toggle buttons
- Assert clicking mobile toggle switches view
- Assert content changes in Editor propagate to Preview
- Assert useDocument and useUndoRedo hooks are called correctly

---

### Step 3: Add Responsive Styles to globals.css
**File:** `src/app/globals.css`

**Change Type:** Append

**Exact Implementation:**
```css
/* Responsive breakpoints */
@media (max-width: 767px) {
  #__next {
    flex-direction: column;
  }
}

/* Editor and Preview container sizing */
@media (min-width: 768px) {
  #__next > div:nth-child(2) {
    flex-direction: row;
  }
}

/* Ensure CodeMirror renders properly in containers */
.cm-editor {
  height: 100%;
}

/* Preview typography */
.markdown-preview {
  word-wrap: break-word;
  word-break: break-word;
}

.markdown-preview img {
  max-width: 100%;
  height: auto;
  margin: 12px 0;
}

.markdown-preview table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 12px;
}

.markdown-preview table td,
.markdown-preview table th {
  border: 1px solid #e5e5e5;
  padding: 8px 12px;
}

.markdown-preview table th {
  background-color: #f0f0f0;
  font-weight: 600;
}
```

**Rationale:**
- Ensures proper flex layout behavior across breakpoints
- Handles CodeMirror height constraint
- Provides table and image styling for markdown preview
- Uses existing CSS variables for consistency

---

## 6. Test Plan

### Test 1: Preview Component Rendering
**File:** `src/components/Preview/Preview.test.tsx`

**Test Cases:**
1. Renders markdown content as HTML
   - Assert `ReactMarkdown` receives correct content prop
   - Assert remark-gfm plugin is applied
2. Empty state shows placeholder
   - Assert placeholder text appears when content is empty/whitespace-only
3. Heading hierarchy renders
   - Test h1 → h3 all render with correct font sizes
4. Code blocks and inline code render
   - Test inline code has gray background
   - Test code blocks have gray background and pre styling
5. Links render with styling
   - Assert links have color styling
6. Blockquotes render with border
   - Assert blockquotes have left border and padding

---

### Test 2: EditorLayout Page Component
**File:** `src/app/page.test.tsx`

**Test Cases:**
1. Renders Editor and Preview components
   - Assert both components are mounted on desktop view
2. Desktop split-view layout
   - Assert flexDirection is 'row' on desktop
   - Assert both Editor and Preview have flex: 1
3. Mobile stacked layout with toggle
   - Mock window.innerWidth < 768
   - Assert toggle buttons render
   - Assert clicking "Editor" button sets view to 'editor'
   - Assert clicking "Preview" button sets view to 'preview'
   - Assert only one component shows at a time on mobile
4. Content sync between Editor and Preview
   - Type new content in Editor
   - Assert Preview receives updated content prop
5. useDocument hook integration
   - Assert useDocument is called and state is used
   - Assert setContent is called on Editor onChange
6. useUndoRedo hook wiring
   - Assert undo/redo functions are defined (will be used in Phase 4)

---

### Test 3: Responsive Styles
**File:** `src/app/globals.css` — Covered by visual regression testing

**Manual Testing:**
- Desktop (>= 768px): Verify Editor left, Preview right, both visible, equal width
- Tablet (600px): Verify toggle buttons appear, stacked layout
- Mobile (375px): Verify toggle functional, one view at a time, full width
- Verify CodeMirror height constraint works (100% height without overflow)

---

## 7. Implementation Wiring Diagram

```
page.tsx (EditorLayout)
├── useDocument() → state { content, fileName, isDirty }
├── useUndoRedo() → undo(), redo() [wired but not used in Phase 3]
├── useState() → view ('editor' | 'preview') [mobile only]
│
├── <Editor content={state.content} onChange={handleChange} />
│   └── CodeMirror 6 with markdown language support
│       └── Calls handleChange → setContent() → useDocument state update
│
└── <Preview content={state.content} />
    └── react-markdown with remark-gfm plugin
        └── Renders live markdown as user types
```

**Data Flow:**
1. User types in Editor → onChange fires → handleChange called
2. handleChange calls setContent(newContent)
3. useDocument updates state and localStorage
4. state.content changes → Editor and Preview both receive new content
5. Preview re-renders markdown output

---

## 8. Confidence Scoring

**Research Phase Findings:**
- ✓ Editor component fully documented and working
- ✓ Dependencies (react-markdown, remark-gfm) verified in package.json
- ✓ useDocument hook stable and tested
- ✓ Layout requirements clear from README
- ✓ Responsive design approach straightforward (flexbox + media queries)

**Unknowns Identified:** None

**Unknown Mitigation:**
- Window size detection: Use standard `window.innerWidth` check (safe)
- React 19 useState: Fully compatible, no breaking changes

**Base Score Calculation:**
- Total steps: 3 (Preview component, page refactor, CSS updates)
- Steps with zero unknowns: 3/3 = 100%
- Base score: (3/3) × 100 = 100%

**Deductions:**
- 0 (no unchecked research items)
- 0 (no MEDIUM unknowns)
- 0 (no HIGH unknowns)

**Final Confidence:** 100%

---

## 9. Git & Commit Strategy

**Branch:** `preview-layout` (already created)

**Commits (atomic, conventional):**
1. `feat: add Preview component with react-markdown`
2. `feat: refactor page.tsx into responsive EditorLayout`
3. `styles: add responsive CSS for editor/preview layout`

---

## 10. Acceptance Criteria

✓ Preview component renders markdown content correctly  
✓ Desktop shows Editor + Preview side-by-side  
✓ Mobile shows toggle with Editor/Preview stacked  
✓ Content syncs live between Editor and Preview  
✓ All tests pass (80% coverage on new files)  
✓ No build errors or warnings  
✓ No SSR/hydration issues  
✓ Responsive design verified across breakpoints  

---

## Summary

**Scope:** FE only | **Difficulty:** Simple (Layout) + Simple (Preview)

**Recommended Approach:**
- Use `/xvibe-fe` on Haiku for fast iteration (simple styling/layout work)
- Run tests after each implementation step
- Manual visual testing on mobile/desktop breakpoints

**Why This Confidence:**
- All dependencies already in place
- No external API calls or complex logic
- Standard React patterns
- Clear layout requirements from README
- Straightforward responsive CSS

**Next Step:** Proceed to implementation using `/xvibe-fe` for Phase 3 development.
