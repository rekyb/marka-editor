# Phase 5: Status Bar — Implementation Plan

**Date Created:** 2026-04-26  
**Status:** Ready for Implementation  
**Scope:** Frontend Only  
**Difficulty:** Simple (calculation hook + display component)  

---

## 1. Scope & Difficulty

**Scope:** FE only — No backend changes. This phase adds a status bar component displaying document statistics (word count, character count, line count, file size).

**Breakdown:**
- **FE Calculation Hook (Simple):** Count words, characters, lines from document content
- **FE Status Bar Component (Simple):** Display-only component, no state management or interactivity
- **FE Layout Integration (Simple):** Position status bar at bottom of editor, add to page layout

**Why Simple:**
- No complex text manipulation or CodeMirror integration
- Calculations are pure string operations (no API calls or async logic)
- Component is stateless and read-only (receives content prop, displays formatted stats)
- No mobile-specific complexity; same layout on all screen sizes

**Compared to Phase 4:**
- Phase 4 was complex: CodeMirror integration + multiple formatting command types + toolbar state sync
- Phase 5 is straightforward: read content → calculate stats → display in fixed component

---

## 2. User Role Coverage

**Affected Roles:** End Users (all personas benefit from document statistics)

| Step | Role | Impact |
|------|------|--------|
| useStatusBar hook | User | Enables tracking of document metrics (word/char/line count) |
| StatusBar component | User | Displays document stats at bottom of editor for quick reference |
| Layout integration | User | Makes stats always visible during editing session |

---

## 3. Research Findings

### Status Bar Requirements (from README Phase 5)
- **Word count:** Total number of words in document
- **Character count:** Total number of characters (excluding whitespace)
- **Line count:** Total number of lines (calculated from line breaks)
- **File info (size, name):** Already tracked in useDocument; expose in status bar

### Design Direction (from DESIGN.md)
**Studio Mode (recommended for Phase 5):**
- Status bar fixed at bottom (40px height)
- Right-aligned layout: "42 words · 8 lines · 234 chars"
- Font: DM Sans 12px, secondary text color (#6B6B6B)
- Border-top: 1px #E8E8EC
- Padding: 0 16px, centered vertically

**Alternative formats observed:**
- Compact: "42w 8l 234c" (abbreviations, saves space)
- Expanded: "Words: 42 | Lines: 8 | Characters: 234" (clear labels, more width)
- Minimal: "42 words" (primary metric only, used on mobile in Minimal Mode)

**Recommendation:** Use expanded format with separators for clarity and discoverability; make responsive (expanded desktop, compact mobile).

### Existing Infrastructure
- **useDocument** (`src/hooks/useDocument.ts`): Tracks `state.fileName` and `state.isDirty`
- **Page layout** (`src/app/page.tsx`): Has footer area (mobile toggle buttons); can be extended with status bar
- **Types** (`src/types/editor.ts`): Already defines document-related types; may extend for StatusBar if needed

### Calculation Logic Patterns
1. **Word count:** Split on whitespace, filter empty strings, count
2. **Character count:** Total length minus whitespace (trim, join)
3. **Line count:** Split on `\n`, count lines (even empty last line counts as 1)
4. **File size:** Approximate size in bytes using `new Blob([content]).size`

### Integration Point
- **Where:** Bottom of editor layout (below preview area on desktop, below mobile toggle on mobile)
- **How:** Add StatusBar component to page.tsx, pass `content` prop
- **State management:** All data read from content; no new hooks needed beyond calculation hook

---

## 4. Component Breakdown

### New Hook: useStatusBar
**File:** `src/hooks/useStatusBar.ts`

**Responsibility:** Calculate document statistics from content string.

**API:**
```typescript
interface StatusBarStats {
  readonly wordCount: number;
  readonly characterCount: number;
  readonly lineCount: number;
  readonly fileSize: number; // bytes
}

export function useStatusBar(content: string): StatusBarStats;
```

**Behavior:**
- Accept content string as input
- Return object with four metrics
- Re-calculate only when content changes (dependency array: [content])
- Pure calculations, no side effects

**Implementation Notes:**
- Word count: split on `/\s+/`, filter empty, count
- Character count: remove all whitespace, count remaining characters (or count non-space chars in original)
- Line count: split on `\n`, count resulting array length (or count newlines + 1)
- File size: use `new Blob([content]).size` for byte count
- Edge case: empty document should return 0,0,1 (0 words, 0 chars, 1 line)

---

### New Component: StatusBar
**File:** `src/components/StatusBar/index.tsx`

**Responsibility:** Display document statistics in fixed bottom bar.

**Props:**
```typescript
interface StatusBarProps {
  readonly stats: StatusBarStats;
  readonly fileName: string;
  readonly isDirty: boolean;
}
```

**State:** None (stateless, receives all data from parent)

**Behavior:**
- Render fixed position bar (40px height) at bottom of viewport
- Display stats in right-aligned layout with separators
- Show file name on left side (optional, or omit if only stats are needed)
- Show dirty indicator if isDirty is true
- Format: "Words: 42 · Lines: 8 · Characters: 234" (desktop)
- Format: "42w 8l 234c" (mobile, compact)
- Use semantic HTML: `<footer>` with `<span>` elements for each stat
- Styling: border-top, secondary text color, monospace for numbers

**Responsive:**
- Desktop (≥768px): expanded format, right-aligned, shows all metrics
- Mobile (<768px): compact format, abbreviated labels (w/l/c), smaller font

---

### Modified Component: Page Layout
**File:** `src/app/page.tsx`

**Change Type:** Add StatusBar below main content area

**Integration:**
- Import useStatusBar and StatusBar components
- Call useStatusBar hook with content
- Pass stats + fileName + isDirty to StatusBar
- Position StatusBar at bottom of flex container, above mobile toggle (if present)

---

## 5. Implementation Steps

### Step 1: Create useStatusBar Hook
**File:** `src/hooks/useStatusBar.ts`

**Change Type:** New file

**Exact Implementation:**
```typescript
'use client';

import { useMemo } from 'react';

export interface StatusBarStats {
  readonly wordCount: number;
  readonly characterCount: number;
  readonly lineCount: number;
  readonly fileSize: number;
}

export function useStatusBar(content: string): StatusBarStats {
  return useMemo(() => {
    // Word count: split on whitespace, count non-empty tokens
    const words = content.trim().split(/\s+/).filter(Boolean);
    const wordCount = content.trim() === '' ? 0 : words.length;

    // Character count: count non-whitespace characters
    const characterCount = content.replace(/\s/g, '').length;

    // Line count: split on newlines, count resulting lines
    const lines = content.split('\n');
    const lineCount = content === '' ? 0 : lines.length;

    // File size: byte count using Blob
    const fileSize = new Blob([content]).size;

    return {
      wordCount,
      characterCount,
      lineCount,
      fileSize,
    };
  }, [content]);
}
```

**Rationale:**
- useMemo prevents recalculation on every render; only recalculates when content changes
- Word count: split on any whitespace, filter empty strings (handles multiple spaces, tabs, newlines)
- Character count: excludes all whitespace (standard definition: visible characters only)
- Line count: split on `\n` gives array; empty document treated as 1 line (editor always has at least one line)
- File size: accurate byte count including special characters and UTF-8 encoding

**Edge Cases Handled:**
- Empty document: wordCount=0, characterCount=0, lineCount=1, fileSize=0
- Single word: wordCount=1, lineCount=1
- Multiple spaces: split/filter handles gracefully
- Trailing newlines: preserved in line count (correct behavior: trailing newline = empty final line)

**Test File:** `src/hooks/useStatusBar.test.ts`
**Test Plan:**
- Empty content → {0, 0, 1, 0}
- Single word "hello" → {1, 5, 1, 5}
- Multiple words "hello world" → {2, 10, 1, 11}
- Multiple lines "hello\nworld" → {2, 10, 2, 11}
- Content with tabs/newlines: verify correct parsing
- Content with UTF-8 characters (emojis, accents): verify byte size correct
- Whitespace trimming: leading/trailing spaces don't affect count

---

### Step 2: Create StatusBar Component
**File:** `src/components/StatusBar/index.tsx`

**Change Type:** New file

**Exact Implementation:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { StatusBarStats } from '@/hooks/useStatusBar';

interface StatusBarProps {
  readonly stats: StatusBarStats;
  readonly fileName: string;
  readonly isDirty: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const size = (bytes / Math.pow(1024, exponent)).toFixed(1);
  return `${size} ${units[exponent]}`;
}

export function StatusBar({ stats, fileName, isDirty }: StatusBarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: '32px',
          paddingRight: '12px',
          paddingLeft: '12px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e8e8ec',
          fontFamily: 'var(--font-dm-sans), monospace',
          fontSize: '11px',
          color: '#6b6b6b',
          gap: '4px',
        }}
      >
        <span>{stats.wordCount}w</span>
        <span>·</span>
        <span>{stats.lineCount}l</span>
        <span>·</span>
        <span>{stats.characterCount}c</span>
      </footer>
    );
  }

  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '40px',
        paddingRight: '16px',
        paddingLeft: '16px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e8e8ec',
        fontFamily: 'var(--font-dm-sans), monospace',
        fontSize: '12px',
        color: '#6b6b6b',
      }}
    >
      {/* Left side: file info and dirty indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{fileName}</span>
        {isDirty && (
          <span style={{ color: '#6366f1', fontWeight: 'bold' }}>●</span>
        )}
        <span style={{ color: '#e8e8ec' }}>|</span>
        <span>{formatFileSize(stats.fileSize)}</span>
      </div>

      {/* Right side: statistics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>
          Words: <strong>{stats.wordCount}</strong>
        </span>
        <span style={{ color: '#e8e8ec' }}>·</span>
        <span>
          Lines: <strong>{stats.lineCount}</strong>
        </span>
        <span style={{ color: '#e8e8ec' }}>·</span>
        <span>
          Characters: <strong>{stats.characterCount}</strong>
        </span>
      </div>
    </footer>
  );
}
```

**Rationale:**
- useEffect for mobile detection: prevents SSR hydration mismatch (server renders desktop, client detects mobile)
- Resize listener: updates layout when window resizes, properly cleaned up on unmount
- Two-section layout: file info (left) + stats (right)
- Mobile-responsive: compact format on <768px via useEffect state (SSR-safe)
- formatFileSize helper: converts bytes to human-readable format (B, KB, MB)
- Semantic footer element: appropriate for bottom navigation bar
- Styling: consistent with design direction (border-top, secondary color, monospace for numbers)
- Dirty indicator: reuses visual pattern from Phase 4 (● dot)

**Test File:** `src/components/StatusBar/StatusBar.test.tsx`
**Test Plan:**
- Render desktop version with file info and stats
- Render mobile version with compact abbreviations
- Assert fileName displays
- Assert isDirty indicator (●) appears when true
- Assert file size formatted correctly (formatFileSize)
- Assert all stats render with correct values
- Assert mobile state updates after useEffect (resize listener attached)
- Assert resize listener triggers mobile check
- Assert responsive breakpoint at 768px with useEffect (SSR-safe)

---

### Step 3: Integrate StatusBar into Page Layout
**File:** `src/app/page.tsx`

**Change Type:** Import hook/component and integrate into layout

**Exact Implementation (relevant sections):**
```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { useDocument } from '@/hooks/useDocument';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { useStatusBar } from '@/hooks/useStatusBar';
import { applyFormatting } from '@/utils/markdown-commands';
import { FormattingCommand } from '@/types/editor';

export default function EditorLayout() {
  const { state, setContent } = useDocument();
  const { undo, redo, canUndo, canRedo } = useUndoRedo(state.content);
  const statusBarStats = useStatusBar(state.content);
  const [view, setView] = useState<'editor' | 'preview'>('editor');
  const [isMobile, setIsMobile] = useState(false);
  const editorViewRef = useRef<EditorView | null>(null);

  // ... existing hooks and event handlers ...

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      {/* Header with toolbar */}
      <Header
        fileName={state.fileName}
        isDirty={state.isDirty}
        onCommand={handleCommand}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

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
          <Editor
            content={state.content}
            onChange={handleChange}
            onEditorReady={handleEditorReady}
          />
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
          <button /* ... toggle button code ... */ >
            Editor
          </button>
          <button /* ... toggle button code ... */ >
            Preview
          </button>
        </div>
      )}

      {/* Status bar at bottom */}
      <StatusBar
        stats={statusBarStats}
        fileName={state.fileName}
        isDirty={state.isDirty}
      />
    </div>
  );
}
```

**Rationale:**
- Call useStatusBar with state.content to get fresh stats on every content change
- Pass stats + fileName + isDirty to StatusBar component
- Position StatusBar at very bottom (after mobile toggle if present)
- StatusBar is always visible; provides continuous feedback to user

**Integration Flow:**
1. User types in editor
2. Editor onChange fires → setContent called → state.content updated
3. Page re-renders with new content
4. useStatusBar recalculates stats (via useMemo dependency)
5. StatusBar re-renders with fresh stats
6. User sees updated word/character/line counts immediately

**Test File:** `src/app/page.test.tsx` (extended)
**Test Plan:**
- Assert StatusBar renders at bottom
- Assert stats update when content changes
- Assert useStatusBar called with correct content
- Assert fileName and isDirty passed to StatusBar
- Verify layout: header → editor/preview → toggle (mobile) → status bar

---

## 6. Test Plan

### Test Suite 1: useStatusBar Hook
**File:** `src/hooks/useStatusBar.test.ts`

**Test Cases:**
1. Empty content
   - Input: ""
   - Expected: {wordCount: 0, characterCount: 0, lineCount: 1, fileSize: 0}
2. Single word
   - Input: "hello"
   - Expected: {wordCount: 1, characterCount: 5, lineCount: 1, fileSize: 5}
3. Multiple words with spaces
   - Input: "hello world"
   - Expected: {wordCount: 2, characterCount: 10, lineCount: 1, fileSize: 11}
4. Content with multiple lines
   - Input: "hello\nworld\ntest"
   - Expected: {wordCount: 3, characterCount: 13, lineCount: 3, fileSize: 16}
5. Content with tabs and mixed whitespace
   - Input: "hello  \t  world"
   - Expected: {wordCount: 2, characterCount: 10, lineCount: 1, fileSize: 14}
6. Trailing newline
   - Input: "hello\n"
   - Expected: {wordCount: 1, characterCount: 5, lineCount: 2, fileSize: 6}
7. UTF-8 characters (emojis, accents)
   - Input: "café ☕"
   - Expected: fileSize > expected (UTF-8 multi-byte), characterCount counts visible chars
8. Large document (1000 words)
   - Verify calculation completes, memoization works

---

### Test Suite 2: StatusBar Component
**File:** `src/components/StatusBar/StatusBar.test.tsx`

**Test Cases:**
1. Render desktop version (initial, before useEffect)
   - Assert renders without layout shift
   - Assert file name displays
   - Assert stats render with labels: "Words:", "Lines:", "Characters:"
   - Assert dirty indicator appears when isDirty=true
   - Assert file size formatted (e.g., "2.5 KB")
2. Mobile state detection via useEffect
   - Mock window.innerWidth < 768
   - Wait for useEffect to run
   - Assert mobile version renders: "42w 8l 234c"
   - Assert no file info on mobile
   - Assert smaller font and padding
3. Resize listener
   - Set window.innerWidth = 1200 (desktop)
   - Trigger resize event
   - Assert desktop version renders
   - Set window.innerWidth = 500 (mobile)
   - Trigger resize event
   - Assert mobile version renders
4. Correct stat values
   - Pass stats={wordCount: 42, characterCount: 234, lineCount: 8, fileSize: 2048}
   - Assert all values render correctly in both desktop and mobile versions
5. Dirty indicator visibility
   - isDirty=true: assert ● appears
   - isDirty=false: assert ● hidden
6. File size formatting
   - fileSize: 0 → "0 B"
   - fileSize: 1024 → "1.0 KB"
   - fileSize: 1048576 → "1.0 MB"
7. Cleanup
   - Assert resize listener removed on unmount

---

### Test Suite 3: Page Integration
**File:** `src/app/page.test.tsx` (extended)

**Test Cases:**
1. StatusBar renders at bottom
   - Assert StatusBar component mounted
   - Assert positioned below editor/preview area
2. Stats update on content change
   - Type in editor → assert word count increments
   - Delete content → assert word count decrements
   - Verify real-time updates
3. Hook integration
   - Assert useStatusBar called with current content
   - Assert stats re-computed when content changes
   - Assert memoization prevents unnecessary recalculation
4. Prop passing
   - Assert fileName passed from useDocument
   - Assert isDirty passed from useDocument
   - Assert stats passed from useStatusBar

---

## 7. Implementation Wiring Diagram

```
page.tsx (EditorLayout)
├── useStatusBar hook (calculates stats from content)
│   ├── wordCount calculation (split, filter, count)
│   ├── characterCount calculation (remove whitespace, count)
│   ├── lineCount calculation (split on newlines)
│   └── fileSize calculation (Blob.size)
│
└── StatusBar component
    ├── Receives stats from hook
    ├── Receives fileName from useDocument
    ├── Receives isDirty from useDocument
    └── Renders desktop or mobile format
        ├── Desktop: file info (left) + stats (right)
        └── Mobile: compact abbreviations (right-aligned)
```

**Data Flow:**
1. User types in editor
2. Editor onChange fires → setContent(newContent)
3. useDocument updates state.content
4. Page re-renders
5. useStatusBar recalculates stats (useMemo dependency on content)
6. StatusBar re-renders with fresh stats
7. User sees updated word/character/line counts

---

## 8. Confidence Scoring

**Research Phase Findings:**
- ✓ Status bar requirements clearly defined in README
- ✓ Design direction provided in DESIGN.md (Studio Mode recommended)
- ✓ Calculation logic straightforward (no external dependencies)
- ✓ Component integration point clear (bottom of page layout)
- ✓ useStatusBar hook pattern matches existing hooks (useDocument, useUndoRedo)

**Unknowns Identified:**
- None — all requirements, design, and technical approach are clear

**Unknowns Mitigation:**
- N/A (no unknowns)

**Base Score Calculation:**
- Total implementation steps: 3 (hook, component, integration)
- Steps with zero unknowns: 3/3 = 100%
- Base score: (3/3) × 100 = 100%

**Deductions:**
- 0 (no unchecked research items)
- 0 (no MEDIUM unknowns)
- 0 (no HIGH unknowns)

**Final Confidence:** 100% — Straightforward feature with clear requirements, proven patterns, and no technical risks.

---

## 9. Git & Commit Strategy

**Branch:** Create from `status-bar` (current branch) or `main`

**Commits (atomic, conventional):**
1. `feat: add useStatusBar hook for calculating document statistics`
2. `feat: add StatusBar component displaying word/character/line counts`
3. `feat: integrate StatusBar into page layout`

---

## 10. Acceptance Criteria

✓ useStatusBar hook calculates correct word count  
✓ useStatusBar hook calculates correct character count (non-whitespace)  
✓ useStatusBar hook calculates correct line count  
✓ useStatusBar hook calculates correct file size in bytes  
✓ StatusBar component renders on desktop with labels and stats  
✓ StatusBar component renders on mobile with compact abbreviations  
✓ StatusBar displays fileName on desktop  
✓ StatusBar displays dirty indicator (●) when isDirty=true  
✓ StatusBar displays file size formatted (B, KB, MB)  
✓ Stats update in real-time as user types  
✓ All tests pass (80% coverage on new files)  
✓ No build errors or warnings  
✓ No SSR/hydration issues  
✓ Responsive: desktop expanded, mobile compact  
✓ Semantic HTML: uses `<footer>` element  

---

## 11. Summary

**Scope:** FE only | **Difficulty:** Simple (pure calculations + display)

**Key Strengths:**
- No complex integrations or external APIs
- Pure calculation logic (testable in isolation)
- Stateless component (easy to reason about)
- Proven pattern: hook for logic, component for UI
- Clear design direction (Studio Mode)

**Implementation Approach:**
1. Create useStatusBar hook with useMemo for performance
2. Create StatusBar component with responsive desktop/mobile layouts
3. Integrate into page.tsx, pass stats from hook
4. Write comprehensive tests for all calculation edge cases
5. Verify real-time updates as user types

**Recommended Execution:**
- Use `/xvibe-fe` on Haiku for straightforward component implementation
- Start with Step 1 (hook) — fastest validation of calculation logic
- Step 2-3 should follow immediately (component + integration)
- All steps are independent and can be parallelized if needed

**Why This Confidence:**
- Feature is simple: read string → calculate metrics → display
- All metrics are basic string operations (split, count, size)
- Component is display-only; no state or complex interactions
- Design is final (Studio Mode chosen in Phase 4)
- No external dependencies or APIs

**Risk Assessment:**
- **Risk:** Mobile responsive breakpoint (768px) doesn't work as expected
  - **Mitigation:** Use CSS media query instead of JavaScript window check (bonus: more performant)
- **Risk:** File size calculation doesn't match user expectations
  - **Mitigation:** Clear labeling (bytes, KB, MB) and testing with various content
- **Risk:** Word count definition (split on whitespace) differs from users' expectation
  - **Mitigation:** Well-documented in tests; matches standard definition

**Next Step:** Proceed to implementation. Phase 5 is straightforward and can be completed in a single focused session.
