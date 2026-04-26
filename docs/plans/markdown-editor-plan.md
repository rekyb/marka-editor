# Markdown Editor v0 — Implementation Plan

**Scope:** Frontend only (standalone web app, client-side storage for v0)  
**Difficulty:** Complex — multiple integrated systems (editor, preview, state, keyboard shortcuts)  
**Target Users:** Tech professionals (dev, UX researcher, designer, PM, QA)

---

## 1. Scope & Constraints

### In Scope for v0
- Plain text editing with syntax highlighting
- Live preview toggle (split-view: editor left, preview right)
- Basic markdown formatting via toolbar (bold, italic, code, link, headings, lists)
- Open/Save via HTML5 File API (download markdown, import file)
- Undo/Redo (built-in to CodeMirror + history management)
- Line numbers (built-in to CodeMirror)
- Word/line/character count in status bar
- Keyboard shortcuts (Ctrl+S, Ctrl+O, Ctrl+B, Ctrl+I, Ctrl+K, Ctrl+Alt+C)
- Auto-save to localStorage (recovery on reload)
- Professional UI using MUI v7 + existing design tokens

### Explicitly Out of Scope
- Cloud sync / collaboration
- Dark mode (v1)
- Multiple export formats (PDF, HTML, etc.)
- Plugin system
- Version history / version control
- Advanced markdown (tables, footnotes, LaTeX, diagrams)
- Mobile optimization (starts desktop-first)
- User accounts / authentication

---

## 2. Architecture & Technology Decisions

### Core Libraries
- **Text Editor:** CodeMirror 6 (lightweight, excellent markdown support, built-in undo/redo, line numbers, performance)
- **Markdown Rendering:** react-markdown (simple, composable, safe by default)
- **Syntax Highlighting:** @codemirror/lang-markdown (included with CodeMirror)
- **State Management:** React hooks + useReducer (no external library needed for simplicity)
- **Framework:** Next.js App Router (Server Components for layout, Client Components for interactive parts)
- **Styling:** MUI v7 + CSS Modules (per CLAUDE.md standards)
- **Package Manager:** pnpm

### Data Flow

```
User Input (Editor)
    ↓
useDocument Hook (manage content state)
    ↓
useUndoRedo Hook (track history)
    ↓
Editor Component + Preview Component (render)
    ↓
localStorage (persist draft)
    ↓
File I/O (open/save)
```

### Component Hierarchy
```
Page (app/page.tsx)
├── Header (branding + title input)
├── MainContainer
│   ├── Editor (left panel)
│   ├── SplitDivider (resizable)
│   └── Preview (right panel, conditional)
└── StatusBar (word count, line count, char count)
```

---

## 3. File Structure

```
src/
├── app/
│   └── page.tsx                    # Main layout & state orchestration
├── components/
│   ├── Editor/
│   │   ├── index.tsx               # CodeMirror wrapper
│   │   └── Editor.test.tsx
│   ├── Preview/
│   │   ├── index.tsx               # react-markdown renderer
│   │   └── Preview.test.tsx
│   ├── Toolbar/
│   │   ├── index.tsx               # Format buttons
│   │   └── Toolbar.test.tsx
│   ├── StatusBar/
│   │   ├── index.tsx               # Word count, line count
│   │   └── StatusBar.test.tsx
│   └── Header/
│       ├── index.tsx               # Title input, save indicator
│       └── Header.test.tsx
├── hooks/
│   ├── useDocument.ts              # Content + fileName state
│   ├── useDocument.test.ts
│   ├── useUndoRedo.ts              # Undo/redo history
│   ├── useUndoRedo.test.ts
│   └── useKeyboardShortcuts.ts     # Keyboard event handling
├── types/
│   └── editor.ts                   # DocumentState, FormattingCommand types
└── utils/
    └── editor/
        ├── formatters.ts           # Text formatting logic (bold, italic, etc.)
        ├── formatters.test.ts
        ├── shortcuts.ts            # Keyboard shortcut definitions
        ├── shortcuts.test.ts
        └── fileIO.ts               # Open/save file handlers
```

---

## 4. Component Specifications

### 4.1 Editor Component
**File:** `src/components/Editor/index.tsx`

```typescript
interface EditorProps {
  value: string
  onChange: (value: string) => void
  lineNumbers?: boolean
}

export function Editor({ value, onChange, lineNumbers = true }: EditorProps) {
  // Returns CodeMirror instance with markdown language
  // Props: value (controlled), onChange callback
  // Built-in: syntax highlighting, line numbers, undo/redo
}
```

**Responsibilities:**
- Render CodeMirror instance with markdown language support
- Report text changes via onChange callback
- Display line numbers (always on by default)
- Provide editor instance ref for formatting commands

---

### 4.2 Preview Component
**File:** `src/components/Preview/index.tsx`

```typescript
interface PreviewProps {
  content: string
}

export function Preview({ content }: PreviewProps) {
  // Returns <ReactMarkdown> with custom components
  // Plugins: remark-gfm for tables, strikethrough
  // Security: escapes unsafe HTML by default
}
```

**Responsibilities:**
- Render markdown as HTML using react-markdown
- Apply custom styling to headings, code blocks, links
- Handle empty state (show placeholder)
- Render code blocks with proper formatting

---

### 4.3 Toolbar Component
**File:** `src/components/Toolbar/index.tsx`

```typescript
interface ToolbarProps {
  onFormat: (command: FormattingCommand) => void
  disabled?: boolean
}

export function Toolbar({ onFormat, disabled }: ToolbarProps) {
  // Button grid with: Bold, Italic, Code, Link, H1-H3, List (ul/ol)
  // Each button calls onFormat with command type
}
```

**Responsibilities:**
- Render formatting buttons (MUI Button components)
- Emit formatting commands on click
- Disable all buttons when editor is disabled
- Show tooltips for keyboard shortcuts

---

### 4.4 StatusBar Component
**File:** `src/components/StatusBar/index.tsx`

```typescript
interface StatusBarProps {
  content: string
}

export function StatusBar({ content }: StatusBarProps) {
  const wordCount = useMemo(() => calculateWordCount(content), [content])
  const lineCount = useMemo(() => calculateLineCount(content), [content])
  const charCount = content.length
  
  return <StatsDisplay words={wordCount} lines={lineCount} chars={charCount} />
}
```

**Responsibilities:**
- Calculate word count, line count, character count
- Update in real-time as content changes
- Display in professional format (e.g., "42 words · 8 lines · 234 chars")

---

### 4.5 Main Page Component
**File:** `src/app/page.tsx`

**State Management:**
```typescript
type DocumentState = {
  content: string
  fileName: string
  isDirty: boolean
  previewVisible: boolean
}
```

**Responsibilities:**
- Orchestrate all child components
- Manage document state (content, fileName, dirty flag)
- Manage undo/redo history via useUndoRedo hook
- Handle file I/O (open/save)
- Wire keyboard shortcuts
- Persist draft to localStorage
- Render layout (header, editor, preview, status bar)

---

## 5. Custom Hooks

### 5.1 useDocument Hook
**File:** `src/hooks/useDocument.ts`

```typescript
interface DocumentState {
  content: string
  fileName: string
  isDirty: boolean
}

export function useDocument() {
  const [state, setState] = useState<DocumentState>({ 
    content: '', 
    fileName: 'untitled.md',
    isDirty: false 
  })
  
  // setContent(newContent)
  // setFileName(newName)
  // markClean() / markDirty()
  // save to localStorage on every change
  // restore from localStorage on mount
  
  return { ...state, setContent, setFileName, markClean, markDirty }
}
```

**Responsibilities:**
- Manage document content, fileName, dirty state
- Persist to localStorage on every change
- Restore from localStorage on component mount
- Detect changes and mark as dirty

---

### 5.2 useUndoRedo Hook
**File:** `src/hooks/useUndoRedo.ts`

```typescript
interface HistoryState {
  past: string[]
  present: string
  future: string[]
}

export function useUndoRedo(initialValue: string = '') {
  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialValue,
    future: []
  })
  
  // push(newContent) - add to history
  // undo()
  // redo()
  // canUndo / canRedo boolean flags
  
  return { current: history.present, push, undo, redo, canUndo, canRedo }
}
```

**Responsibilities:**
- Maintain undo/redo stack
- Push new states on content change
- Clear future stack when new change made
- Provide canUndo/canRedo for button disable state

---

### 5.3 useKeyboardShortcuts Hook
**File:** `src/hooks/useKeyboardShortcuts.ts`

```typescript
interface KeyboardCommand {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  callback: () => void
}

export function useKeyboardShortcuts(commands: KeyboardCommand[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Match pressed key against commands
      // Call matching callback
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commands])
}
```

**Responsibilities:**
- Register keyboard shortcuts
- Listen to window keydown events
- Match key combinations (Ctrl/Cmd + key)
- Call registered callbacks
- Cross-platform support (Ctrl on Windows/Linux, Cmd on Mac)

---

## 6. Utility Functions

### 6.1 Text Formatting
**File:** `src/utils/editor/formatters.ts`

```typescript
// Wrap selected text with markdown syntax
export function wrapSelection(text: string, before: string, after: string): string
export function makeBold(selection: string): string       // **text**
export function makeItalic(selection: string): string     // *text*
export function makeCode(selection: string): string       // `text`
export function makeLink(selection: string): string       // [text](url)
export function makeHeading(selection: string, level: 1|2|3): string  // # text
export function makeList(text: string, ordered: boolean): string // - item or 1. item
export function makeCodeBlock(selection: string): string  // ```\ntext\n```
```

**Responsibilities:**
- Apply markdown syntax to selected text
- Handle edge cases (empty selection, multi-line, etc.)
- Return formatted text

---

### 6.2 File I/O
**File:** `src/utils/editor/fileIO.ts`

```typescript
export function saveFile(content: string, fileName: string): void {
  // Create blob from content
  // Trigger browser download
  // Use fileName as download name
}

export function openFile(): Promise<{ content: string, fileName: string }> {
  // Create hidden <input type="file" accept=".md,.txt" />
  // Return file content and name when selected
}
```

**Responsibilities:**
- Create downloadable markdown file
- Open file browser and read selected file
- Handle file read errors gracefully

---

### 6.3 Keyboard Shortcuts Definition
**File:** `src/utils/editor/shortcuts.ts`

```typescript
export const KEYBOARD_SHORTCUTS = {
  SAVE: { key: 'S', ctrl: true, desc: 'Save file' },
  OPEN: { key: 'O', ctrl: true, desc: 'Open file' },
  BOLD: { key: 'B', ctrl: true, desc: 'Bold' },
  ITALIC: { key: 'I', ctrl: true, desc: 'Italic' },
  CODE: { key: '`', ctrl: true, desc: 'Inline code' },
  LINK: { key: 'K', ctrl: true, desc: 'Link' },
  CODE_BLOCK: { key: 'C', ctrl: true, alt: true, desc: 'Code block' },
  TOGGLE_PREVIEW: { key: 'P', ctrl: true, desc: 'Toggle preview' },
}
```

---

## 7. Implementation Steps

### Phase 1: Project Setup (2 steps)
1. **Initialize Next.js project**
   - Run: `pnpm create next-app@latest`
   - Config: App Router, TypeScript, no tailwind (using MUI + CSS modules)
   - Files created: `src/app/page.tsx`, `src/app/layout.tsx`, package.json
   
2. **Install dependencies**
   - Run: `pnpm add codemirror @codemirror/lang-markdown react-codemirror react-markdown remark-gfm @mui/material @mui/icons-material`
   - Update: `package.json`
   - Verify: `pnpm install && pnpm next build` succeeds

### Phase 2: Core Editor Setup (3 steps)
3. **Create useDocument hook**
   - File: `src/hooks/useDocument.ts`
   - Implement: state (content, fileName, isDirty), localStorage persistence
   - Test: `src/hooks/useDocument.test.ts` — verify state updates, localStorage sync
   
4. **Create useUndoRedo hook**
   - File: `src/hooks/useUndoRedo.ts`
   - Implement: history stack (past/present/future), undo/redo/push actions
   - Test: `src/hooks/useUndoRedo.test.ts` — verify undo/redo chain, future clearing
   
5. **Create Editor component**
   - File: `src/components/Editor/index.tsx`
   - Implement: CodeMirror instance, markdown language, line numbers
   - Test: `src/components/Editor/Editor.test.tsx` — verify rendering, onChange callback

### Phase 3: Preview & Layout (3 steps)
6. **Create Preview component**
   - File: `src/components/Preview/index.tsx`
   - Implement: react-markdown with remark-gfm plugin, custom styling
   - Test: `src/components/Preview/Preview.test.tsx` — verify markdown rendering, empty state

7. **Create split-view layout in main page**
   - File: `src/app/page.tsx`
   - Implement: Grid layout (editor left, preview right), toggle visibility, CSS for responsiveness
   - State: previewVisible boolean, handle resize
   - Test: Vitest layout snapshots

8. **Wire Editor + Preview together**
   - File: `src/app/page.tsx`
   - Update: Editor onChange → useDocument.setContent → Preview content prop
   - Test: Vitest integration — type in editor, see in preview

### Phase 4: Formatting & Toolbar (3 steps)
9. **Create formatters utility functions**
   - File: `src/utils/editor/formatters.ts`
   - Implement: wrapSelection, makeBold, makeItalic, makeCode, makeLink, makeHeading, makeList
   - Test: `src/utils/editor/formatters.test.ts` — verify text wrapping for each format

10. **Create Toolbar component**
    - File: `src/components/Toolbar/index.tsx`
    - Implement: MUI Button grid (Bold, Italic, Code, Link, H1-H3, UL, OL)
    - Props: onFormat callback
    - Test: `src/components/Toolbar/Toolbar.test.ts` — verify button clicks emit correct commands

11. **Wire Toolbar to Editor**
    - File: `src/app/page.tsx`
    - Implement: onFormat handler → get editor selection → apply formatter → update content
    - Challenge: Access editor selection from parent component (use ref or CodeMirror API)
    - Test: Playwright E2E — select text, click Bold button, verify **text** applied

### Phase 5: Status Bar (1 step)
12. **Create StatusBar component**
    - File: `src/components/StatusBar/index.tsx`
    - Implement: Calculate word count, line count, char count
    - Test: `src/components/StatusBar/StatusBar.test.ts` — verify counts on multiple inputs

### Phase 6: File I/O (2 steps)
13. **Create file I/O utility functions**
    - File: `src/utils/editor/fileIO.ts`
    - Implement: saveFile (blob download), openFile (file input)
    - Test: `src/utils/editor/fileIO.test.ts` — mock Blob, verify calls

14. **Wire Save/Open to main page**
    - File: `src/app/page.tsx`
    - Implement: onClick handlers for Save/Open buttons
    - State: Handle fileName updates, dirty flag after save
    - Test: Playwright E2E — save file, open file, verify round-trip

### Phase 7: Keyboard Shortcuts (2 steps)
15. **Create keyboard shortcuts definition & hook**
    - File: `src/utils/editor/shortcuts.ts` + `src/hooks/useKeyboardShortcuts.ts`
    - Implement: shortcut definitions, useKeyboardShortcuts hook with Ctrl/Cmd detection
    - Test: `src/hooks/useKeyboardShortcuts.test.ts` — verify key matching, Mac/Windows support

16. **Register shortcuts in main page**
    - File: `src/app/page.tsx`
    - Implement: useKeyboardShortcuts hook with commands for Save, Open, Bold, Italic, Link, CodeBlock, TogglePreview
    - Test: Playwright E2E — press Ctrl+S, verify save; Ctrl+B, verify bold applied

### Phase 8: Polish & Testing (2 steps)
17. **Apply MUI styling & design system**
    - File: Update all components
    - Implement: Use MUI components (Button, Stack, Paper, etc.), apply design tokens from DESIGN.md
    - Colors: Primary indigo (#6366F1), surface white, text near-black
    - Spacing: 4px grid, 16px padding, 8px gaps
    - Typography: MUI theme fonts (DM Sans body, Open Sans headings)

18. **Add Vitest unit tests (80%+ coverage)**
    - Coverage required on: formatters.ts, fileIO.ts, useDocument.ts, useUndoRedo.ts
    - Run: `pnpm vitest run` before marking done
    - If coverage < 80%, add missing tests

### Phase 9: E2E Testing (1 step)
19. **Add Playwright E2E tests**
    - File: `e2e/editor.spec.ts`
    - Tests:
      - ✓ User can type and see preview update
      - ✓ User can toggle preview visibility
      - ✓ User can save file (triggers download)
      - ✓ User can open file (reads content)
      - ✓ Ctrl+B applies bold formatting
      - ✓ Ctrl+S saves file
      - ✓ Ctrl+O opens file
      - ✓ Undo/Redo works (Ctrl+Z, Ctrl+Shift+Z)
      - ✓ Word count updates
      - ✓ Line numbers display

---

## 8. API Contract

**Note:** No backend API in v0. All operations are client-side.

**Future (v1+):** When adding cloud sync:
```typescript
POST /api/documents
  body: { content: string, fileName: string }
  response: { id: string, url: string }

GET /api/documents/:id
  response: { content: string, fileName: string }

PUT /api/documents/:id
  body: { content: string }
  response: { success: boolean }
```

---

## 9. Test Plan Summary

| Component/Hook | File | Key Tests |
|---|---|---|
| useDocument | useDocument.test.ts | State updates, localStorage sync, dirty flag |
| useUndoRedo | useUndoRedo.test.ts | Undo/redo chain, future clearing, canUndo/canRedo |
| Editor | Editor.test.tsx | Rendering, onChange callback, line numbers |
| Preview | Preview.test.tsx | Markdown rendering, empty state, code blocks |
| Toolbar | Toolbar.test.tsx | Button rendering, onFormat callback, disabled state |
| StatusBar | StatusBar.test.tsx | Word/line/char count accuracy |
| formatters | formatters.test.ts | Bold, italic, code, link, headings, lists |
| fileIO | fileIO.test.ts | Save/open file handlers |
| useKeyboardShortcuts | useKeyboardShortcuts.test.ts | Key matching, Ctrl/Cmd detection |
| **E2E (Playwright)** | editor.spec.ts | Type → preview, format, save, open, shortcuts |

---

## 10. Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "codemirror": "^6.x",
    "@codemirror/lang-markdown": "^6.x",
    "@codemirror/language": "^6.x",
    "@codemirror/state": "^6.x",
    "@codemirror/view": "^6.x",
    "react-codemirror": "^4.x",
    "react-markdown": "^8.x",
    "remark-gfm": "^3.x",
    "@mui/material": "^5.x",
    "@mui/icons-material": "^5.x",
    "@emotion/react": "^11.x",
    "@emotion/styled": "^11.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vitest": "^x.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "@playwright/test": "^1.x"
  }
}
```

---

## 11. Known Unknowns & Risks

### Resolved
- ✓ **Editor library:** CodeMirror 6 selected (lightweight, proven, excellent markdown support)
- ✓ **Markdown rendering:** react-markdown selected (safe, composable, no XSS issues)
- ✓ **State management:** Custom hook + useReducer (no external dependency, simple)
- ✓ **Keyboard shortcuts:** useKeyboardShortcuts hook with Ctrl/Cmd handling
- ✓ **Undo/Redo:** CodeMirror has built-in undo, custom hook for app-level history
- ✓ **File I/O:** HTML5 File API is stable and cross-browser supported

### Potential Risks & Mitigations
1. **CodeMirror bundle size (~300KB gzipped)**
   - Mitigation: Dynamic import editor on demand; most users won't notice
   - v0 decision: Accept size, optimize in v1 if needed
   
2. **Performance with large files (>50k lines)**
   - Mitigation: CodeMirror handles this well; virtualization not needed for v0
   - Risk level: Low (users are professionals, unlikely to edit massive files)

3. **Toolbar accessing editor selection**
   - Challenge: Parent component needs to read current selection from CodeMirror
   - Solution: Use useRef to access editor instance, call `editor.state.sliceDoc(from, to)` for selection
   - Risk level: Low (CodeMirror API is stable)

4. **localStorage size limits (~5-10MB)**
   - Mitigation: Store only last version; add quota check before saving
   - Risk level: Very low (markdown files rarely exceed 1MB)

---

## 12. Confidence Scoring

**Base Score:** (19 implementation steps with clear file paths / 19) × 100 = **100%**

**Deductions:**
- -0: No unchecked research items
- -0: No MEDIUM unknowns
- -0: No HIGH unknowns (all tech stack decided, all components designed)

**Final Confidence: 100%** (pending Phase 1 setup)

**Rationale:** All components are well-defined, file structure is clear, dependencies are proven, and there are no architectural unknowns. The main risk is execution speed (integration of CodeMirror with custom hooks), but the approach is straightforward with no surprising dependencies.

---

## Next Steps

1. ✓ Approve this plan (or request clarifications)
2. Run Phase 1: Initialize Next.js + install dependencies
3. Build Phases 2-9 sequentially (each phase produces testable code)
4. Measure test coverage after each phase: must reach 80% before v0 release
5. Run full E2E suite before shipping

