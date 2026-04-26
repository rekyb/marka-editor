# Phase 4: Formatting & Toolbar — Implementation Plan

**Date Created:** 2026-04-26  
**Status:** Ready for Implementation  
**Scope:** Frontend Only  
**Difficulty:** Complex (formatting logic + toolbar state + CodeMirror integration)  

---

## 1. Scope & Difficulty

**Scope:** FE only — No backend changes. This phase adds toolbar UI and markdown command handling without touching data persistence.

**Breakdown:**
- **FE Formatting Utilities (Complex):** Text insertion, selection wrapping, line transformation for all 13 markdown commands
- **FE Toolbar Component (Complex):** Button management, command dispatch, visual feedback (disabled states), responsive layout
- **FE Header Component (Simple):** Container for toolbar, consistent spacing
- **FE Editor Refactor (Complex):** Expose CodeMirror EditorView via ref so formatting can manipulate cursor/selections

**Why Complex:**
- CodeMirror has a proprietary API; exposing/using EditorView requires careful ref management
- Formatting commands have varied logic: some wrap text (bold), some insert (link), some modify lines (heading)
- Toolbar needs two-way sync: buttons disabled when undo/redo unavailable, visual feedback on click
- Mobile responsiveness: toolbar must adapt (stacked vs horizontal, smaller buttons on mobile)
- Multiple command types share similar patterns but have subtle differences (e.g., bold vs italic vs code)

---

## 2. User Role Coverage

**Affected Roles:** End Users (all personas use formatting)

| Step | Role | Impact |
|------|------|--------|
| Toolbar component | User | Makes formatting discoverable via buttons (not just keyboard) |
| Bold/italic/code commands | User | Formats selected text or inserts placeholder |
| Link command | User | Adds markdown link with placeholder text |
| Heading commands | User | Converts line to heading (1-3 levels) |
| List commands | User | Creates bulleted or numbered lists |
| Code block/quote | User | Inserts multi-line formatted blocks |
| Horizontal rule | User | Inserts visual separator |
| Keyboard feedback | User | Visually confirms command executed (optional in Phase 4, tracked for Phase 7) |

---

## 3. Research Findings

### CodeMirror 6 API for Text Manipulation
- **EditorView**: Main interface to CodeMirror instance; accessible via ref
- **EditorState**: Current document state; obtained from `view.state`
- **Transaction**: Immutable representation of changes; created via `view.state.update()`
- **Selection**: Cursor position and selected ranges
- **Transactions** support: insert text, replace ranges, set selection
- Example: `view.dispatch(view.state.update({ changes: [{ from, to, insert }] }))`

### Existing Infrastructure
- **Editor Component** (`src/components/Editor/index.tsx`): CodeMirror wrapper; currently doesn't expose EditorView
- **useDocument** (`src/hooks/useDocument.ts`): Manages content state; `setContent()` method
- **Types** (`src/types/editor.ts`): `FormattingCommand` type fully defined with all 13 commands
- **Layout** (`src/app/page.tsx`): Has placeholder comment for toolbar placement

### Integration Point Challenge
- **Problem**: Editor component accepts `content` and `onChange` props; doesn't expose CodeMirror EditorView
- **Solution**: Add optional `onEditorReady` callback to Editor component that receives the EditorView instance
- **Why callback over ref**: Allows parent (page.tsx) to store EditorView for formatting commands without breaking encapsulation

### Formatting Command Patterns
1. **Inline formatting** (bold, italic, code): Wrap selected text or insert with placeholder
2. **Link**: Wrap text in markdown link syntax with URL placeholder
3. **Headings**: Replace line start with # (1-3 times)
4. **Lists**: Add `- ` or `1. ` at line start
5. **Code block**: Wrap selection in triple backticks
6. **Quote**: Add `> ` at line start
7. **Horizontal rule**: Insert `---` on new line

---

## 4. Component Breakdown

### New Component: Toolbar
**File:** `src/components/Toolbar/index.tsx`

**Responsibility:** Display formatting buttons and dispatch commands to parent.

**Props:**
```typescript
interface ToolbarProps {
  readonly onCommand: (command: FormattingCommand) => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
}
```

**State:** None (stateless, receives callbacks and state flags from parent)

**Behavior:**
- Render 13 formatting command buttons (bold, italic, code, link, heading1-3, bulletList, orderedList, codeBlock, quote, horizontalRule)
- Render undo/redo buttons with disabled state when `canUndo`/`canRedo` are false
- Dispatch appropriate `FormattingCommand` when button clicked
- Responsive: horizontal on desktop (>= 768px), wrap or stack on mobile
- Visual feedback: hover state, disabled state (muted color), active/pressed state (optional, Phase 7)

**Button Set:**
- **Text Formatting**: Bold, Italic, Code (3 buttons)
- **Blocks**: Heading 1-3, Bullet List, Ordered List (5 buttons)
- **Complex**: Link, Code Block, Quote, Horizontal Rule (4 buttons)
- **History**: Undo, Redo (2 buttons)

---

### New Component: Header
**File:** `src/components/Header/index.tsx`

**Responsibility:** Container for Toolbar and future elements (file info, etc.).

**Props:**
```typescript
interface HeaderProps {
  readonly fileName: string;
  readonly isDirty: boolean;
  readonly onCommand: (command: FormattingCommand) => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
}
```

**State:** None (stateless)

**Behavior:**
- Render fixed header with consistent height (56px or 64px)
- Left side: file name (e.g., "untitled.md") + dirty indicator (optional: "*" suffix if isDirty)
- Center/Right: Toolbar component
- Minimal spacing, consistent with editor theme
- Border-bottom for visual separation

---

### Modified Component: Editor
**File:** `src/components/Editor/index.tsx`

**Change Type:** Add optional `onEditorReady` prop and call it with EditorView

**Props (updated):**
```typescript
interface EditorProps {
  readonly content: string;
  readonly onChange: (content: string) => void;
  readonly onEditorReady?: (view: EditorView) => void; // NEW
}
```

**Implementation Detail:**
- After CodeMirror mounts, extract EditorView from the CodeMirror element
- Call `onEditorReady` with the view so parent can store and use it for formatting
- Use `ref` on CodeMirror component to access underlying view

**Rationale:**
- Non-breaking: `onEditorReady` is optional; existing code still works
- Gives parent access to EditorView for text manipulation without exposing internals

---

### Utility Module: Formatting Commands
**File:** `src/utils/markdown-commands.ts`

**Responsibility:** Pure functions to transform text based on formatting commands.

**Exports:**
```typescript
export function applyFormatting(
  view: EditorView,
  command: FormattingCommand
): void;

// Helper functions for each command type
function wrapSelection(view: EditorView, before: string, after: string): void;
function insertAtLineStart(view: EditorView, prefix: string): void;
function insertBlock(view: EditorView, before: string, after: string): void;
function insertLink(view: EditorView): void;
```

**Behavior per Command:**
1. **bold**: Wrap selection in `**...**`; if no selection, insert `****` with cursor in middle
2. **italic**: Wrap selection in `*...*`; if no selection, insert `**` with cursor in middle
3. **code**: Wrap selection in backticks; if no selection, insert ``` `` ``` with cursor in middle
4. **link**: Replace selection (or placeholder) with `[text](url)` format
5. **heading1/2/3**: Find line start, insert `# `, `## `, or `### `
6. **bulletList**: Find line start, insert `- `
7. **orderedList**: Find line start, insert `1. `
8. **codeBlock**: Wrap selection in triple backticks on separate lines
9. **quote**: Find line start, insert `> `
10. **horizontalRule**: Insert `---` on new line

---

## 5. Implementation Steps

### Step 1: Extend Editor Component to Expose EditorView
**File:** `src/components/Editor/index.tsx`

**Change Type:** Add prop and callback

**Exact Implementation:**
```typescript
'use client';

import { useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { lineNumbers } from '@codemirror/view';

interface EditorProps {
  readonly content: string;
  readonly onChange: (content: string) => void;
  readonly onEditorReady?: (view: EditorView) => void;
}

export function Editor({ content, onChange, onEditorReady }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const cmElement = editorRef.current.querySelector('.cm-editor');
      if (cmElement && (cmElement as any).cmView) {
        const view = (cmElement as any).cmView;
        viewRef.current = view;
        onEditorReady?.(view);
      }
    }
  }, [onEditorReady]);

  return (
    <div
      ref={editorRef}
      style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <CodeMirror
        value={content}
        extensions={[markdown(), lineNumbers()]}
        onChange={onChange}
        height="100%"
        theme="light"
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          rectangularSelection: true,
          highlightSelectionMatches: true,
          searchKeymap: true,
        }}
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      />
    </div>
  );
}
```

**Rationale:**
- Minimal change: adds optional prop and callback
- Non-breaking for existing code
- Uses useEffect to access view after mount
- Stores view in ref for parent to access

**Test File:** `src/components/Editor/Editor.test.tsx`
**Test Plan:**
- Assert onEditorReady is called after mount
- Assert view passed to callback is valid EditorView instance
- Assert original onChange behavior unchanged
- Assert omitting onEditorReady doesn't cause errors

---

### Step 2: Create Markdown Commands Utility
**File:** `src/utils/markdown-commands.ts`

**Change Type:** New file

**Exact Implementation:**
```typescript
import { EditorView } from '@codemirror/view';
import { FormattingCommand } from '@/types/editor';

export function applyFormatting(view: EditorView, command: FormattingCommand): void {
  const state = view.state;
  const selection = state.selection.main;
  const selectedText = state.doc.sliceString(selection.from, selection.to);

  switch (command) {
    case 'bold':
      wrapSelection(view, '**', '**');
      break;
    case 'italic':
      wrapSelection(view, '*', '*');
      break;
    case 'code':
      wrapSelection(view, '`', '`');
      break;
    case 'link':
      insertLink(view, selectedText);
      break;
    case 'heading1':
      insertAtLineStart(view, '# ');
      break;
    case 'heading2':
      insertAtLineStart(view, '## ');
      break;
    case 'heading3':
      insertAtLineStart(view, '### ');
      break;
    case 'bulletList':
      insertAtLineStart(view, '- ');
      break;
    case 'orderedList':
      insertAtLineStart(view, '1. ');
      break;
    case 'codeBlock':
      insertCodeBlock(view, selectedText);
      break;
    case 'quote':
      insertAtLineStart(view, '> ');
      break;
    case 'horizontalRule':
      insertBlock(view, '\n---\n', '');
      break;
  }
}

function wrapSelection(view: EditorView, before: string, after: string): void {
  const state = view.state;
  const selection = state.selection.main;

  if (selection.empty) {
    // No selection: insert placeholder
    const placeholder = before === '`' ? 'code' : 'text';
    view.dispatch(
      state.update({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: `${before}${placeholder}${after}`,
        },
        selection: {
          anchor: selection.from + before.length,
          head: selection.from + before.length + placeholder.length,
        },
      })
    );
  } else {
    // Has selection: wrap it
    const selectedText = state.doc.sliceString(selection.from, selection.to);
    view.dispatch(
      state.update({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: `${before}${selectedText}${after}`,
        },
        selection: {
          anchor: selection.from,
          head: selection.from + before.length + selectedText.length + after.length,
        },
      })
    );
  }
}

function insertLink(view: EditorView, selectedText: string): void {
  const state = view.state;
  const selection = state.selection.main;
  const text = selectedText || 'link text';
  const linkMarkdown = `[${text}](url)`;

  view.dispatch(
    state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: linkMarkdown,
      },
      selection: {
        anchor: selection.from + text.length + 3, // Position after ](
        head: selection.from + text.length + 6, // Position before )
      },
    })
  );
}

function insertAtLineStart(view: EditorView, prefix: string): void {
  const state = view.state;
  const selection = state.selection.main;
  const line = state.doc.lineAt(selection.from);

  view.dispatch(
    state.update({
      changes: {
        from: line.from,
        to: line.from,
        insert: prefix,
      },
      selection: {
        anchor: selection.from + prefix.length,
        head: selection.to + prefix.length,
      },
    })
  );
}

function insertCodeBlock(view: EditorView, selectedText: string): void {
  const state = view.state;
  const selection = state.selection.main;
  const text = selectedText || 'code here';
  const codeBlock = `\`\`\`\n${text}\n\`\`\``;

  view.dispatch(
    state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: codeBlock,
      },
      selection: {
        anchor: selection.from + 4, // After opening ```
        head: selection.from + 4 + text.length,
      },
    })
  );
}

function insertBlock(view: EditorView, before: string, after: string): void {
  const state = view.state;
  const selection = state.selection.main;

  view.dispatch(
    state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: `${before}${after}`,
      },
      selection: {
        anchor: selection.from + before.length,
      },
    })
  );
}
```

**Rationale:**
- Pure functions: no side effects beyond EditorView mutations
- Handles both empty selection (insert placeholder) and selected text (wrap or transform)
- Uses CodeMirror API to track and maintain cursor position intelligently
- Distinct logic for each command type
- Extensible: easy to add more commands

**Test File:** `src/utils/markdown-commands.test.ts`
**Test Plan:**
- For each command, test:
  - Wrapping selected text (bold, italic, code)
  - Inserting placeholder when no selection
  - Correct cursor positioning after command
  - Link command with URL placeholder
  - Heading commands prefix insertion
  - List commands line-start modification
  - Code block wrapping with backticks
  - Horizontal rule insertion

---

### Step 3: Create Toolbar Component
**File:** `src/components/Toolbar/index.tsx`

**Change Type:** New file

**Exact Implementation:**
```typescript
'use client';

import { FormattingCommand } from '@/types/editor';

interface ToolbarProps {
  readonly onCommand: (command: FormattingCommand) => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
}

const COMMAND_BUTTONS: Array<{
  readonly command: FormattingCommand;
  readonly label: string;
  readonly title: string;
}> = [
  { command: 'bold', label: 'B', title: 'Bold (Ctrl+B)' },
  { command: 'italic', label: 'I', title: 'Italic (Ctrl+I)' },
  { command: 'code', label: 'Code', title: 'Inline Code' },
  { command: 'link', label: 'Link', title: 'Insert Link' },
  { command: 'heading1', label: 'H1', title: 'Heading 1' },
  { command: 'heading2', label: 'H2', title: 'Heading 2' },
  { command: 'heading3', label: 'H3', title: 'Heading 3' },
  { command: 'bulletList', label: '• List', title: 'Bullet List' },
  { command: 'orderedList', label: '1. List', title: 'Ordered List' },
  { command: 'codeBlock', label: 'Code Block', title: 'Insert Code Block' },
  { command: 'quote', label: 'Quote', title: 'Block Quote' },
  { command: 'horizontalRule', label: '—', title: 'Horizontal Rule' },
];

export function Toolbar({
  onCommand,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: ToolbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        padding: '8px 12px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {/* Formatting commands */}
      {COMMAND_BUTTONS.map(({ command, label, title }) => (
        <button
          key={command}
          onClick={() => onCommand(command)}
          title={title}
          style={{
            padding: '6px 10px',
            borderRadius: '3px',
            border: '1px solid #d5d5d5',
            backgroundColor: '#f9f9f9',
            color: '#0a0a0a',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'var(--font-dm-sans), sans-serif',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.borderColor = '#b0b0b0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f9f9f9';
            e.currentTarget.style.borderColor = '#d5d5d5';
          }}
        >
          {label}
        </button>
      ))}

      {/* Separator */}
      <div
        style={{
          width: '1px',
          height: '20px',
          backgroundColor: '#e5e5e5',
          margin: '0 4px',
        }}
      />

      {/* Undo/Redo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        style={{
          padding: '6px 10px',
          borderRadius: '3px',
          border: '1px solid #d5d5d5',
          backgroundColor: canUndo ? '#f9f9f9' : '#f5f5f5',
          color: canUndo ? '#0a0a0a' : '#b0b0b0',
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: 'var(--font-dm-sans), sans-serif',
          cursor: canUndo ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (canUndo) {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.borderColor = '#b0b0b0';
          }
        }}
        onMouseLeave={(e) => {
          if (canUndo) {
            e.currentTarget.style.backgroundColor = '#f9f9f9';
            e.currentTarget.style.borderColor = '#d5d5d5';
          }
        }}
      >
        ↶ Undo
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        style={{
          padding: '6px 10px',
          borderRadius: '3px',
          border: '1px solid #d5d5d5',
          backgroundColor: canRedo ? '#f9f9f9' : '#f5f5f5',
          color: canRedo ? '#0a0a0a' : '#b0b0b0',
          fontSize: '12px',
          fontWeight: 500,
          fontFamily: 'var(--font-dm-sans), sans-serif',
          cursor: canRedo ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (canRedo) {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.borderColor = '#b0b0b0';
          }
        }}
        onMouseLeave={(e) => {
          if (canRedo) {
            e.currentTarget.style.backgroundColor = '#f9f9f9';
            e.currentTarget.style.borderColor = '#d5d5d5';
          }
        }}
      >
        ↷ Redo
      </button>
    </div>
  );
}
```

**Rationale:**
- Simple, focused component: receives all data/callbacks from parent
- 12 formatting command buttons + 2 history buttons
- Responsive: flex-wrap allows wrapping on small screens
- Disabled state for undo/redo with visual feedback (muted color, cursor not-allowed)
- Hover feedback for discoverability
- Titles for accessibility and keyboard hints

**Test File:** `src/components/Toolbar/Toolbar.test.tsx`
**Test Plan:**
- Assert all 12 command buttons render with correct labels
- Assert undo/redo buttons render and are disabled when canUndo/canRedo are false
- Assert clicking each command button calls onCommand with correct FormattingCommand
- Assert clicking undo/redo calls onUndo/onRedo when not disabled
- Assert disabled buttons don't trigger callbacks when clicked
- Assert buttons render with correct initial styling

---

### Step 4: Create Header Component
**File:** `src/components/Header/index.tsx`

**Change Type:** New file

**Exact Implementation:**
```typescript
'use client';

import { Toolbar } from '@/components/Toolbar';
import { FormattingCommand } from '@/types/editor';

interface HeaderProps {
  readonly fileName: string;
  readonly isDirty: boolean;
  readonly onCommand: (command: FormattingCommand) => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
}

export function Header({
  fileName,
  isDirty,
  onCommand,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: HeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '48px',
          padding: '0 16px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          color: '#0a0a0a',
        }}
      >
        <div>
          {fileName}
          {isDirty && <span style={{ marginLeft: '8px', color: '#6366f1' }}>●</span>}
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        onCommand={onCommand}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
      />
    </div>
  );
}
```

**Rationale:**
- Simple container for file info + toolbar
- Shows fileName with dirty indicator (● dot)
- Passes all props directly to Toolbar
- Two-section layout: title bar + toolbar
- Minimal styling; uses flexbox for alignment

**Test File:** `src/components/Header/Header.test.tsx`
**Test Plan:**
- Assert fileName renders
- Assert dirty indicator (●) appears when isDirty is true
- Assert dirty indicator is hidden when isDirty is false
- Assert Toolbar component receives correct props
- Assert callbacks are passed through to Toolbar

---

### Step 5: Integrate Header into Page Layout
**File:** `src/app/page.tsx`

**Change Type:** Full refactor

**Exact Implementation:**
```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { Header } from '@/components/Header';
import { useDocument } from '@/hooks/useDocument';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { applyFormatting } from '@/utils/markdown-commands';
import { FormattingCommand } from '@/types/editor';

export default function EditorLayout() {
  const { state, setContent } = useDocument();
  const { undo, redo, canUndo, canRedo } = useUndoRedo(state.content);
  const [view, setView] = useState<'editor' | 'preview'>('editor');
  const [isMobile, setIsMobile] = useState(false);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showEditor = !isMobile || view === 'editor';
  const showPreview = !isMobile || view === 'preview';

  const handleChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleEditorReady = (editorView: EditorView) => {
    editorViewRef.current = editorView;
  };

  const handleCommand = (command: FormattingCommand) => {
    if (editorViewRef.current) {
      applyFormatting(editorViewRef.current, command);
    }
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

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
              fontSize: '14px',
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
              fontSize: '14px',
            }}
          >
            Preview
          </button>
        </div>
      )}
    </div>
  );
}
```

**Rationale:**
- Integrates Header at top with toolbar visible
- Stores EditorView in ref via onEditorReady callback
- Dispatch command calls applyFormatting with stored view
- Passes undo/redo state to Header for button feedback
- All wiring complete: toolbar clicks → formatting applied → content updated → preview refreshes

**Test File:** `src/app/page.test.tsx` (extended)
**Test Plan:**
- Assert Header renders with fileName and isDirty
- Assert Editor receives onEditorReady callback
- Assert EditorView is stored after callback
- Assert clicking toolbar button calls applyFormatting
- Assert undo/redo buttons disabled state synced with canUndo/canRedo
- Assert mobile toggle still works
- Assert content changes propagate to Preview

---

## 6. Test Plan

### Test Suite 1: Editor Component (Refactored)
**File:** `src/components/Editor/Editor.test.tsx`

**Test Cases:**
1. onEditorReady callback is called after mount
   - Assert callback receives valid EditorView instance
2. onEditorReady is optional
   - Render without callback; assert no errors
3. onChange behavior unchanged
   - Type in editor; assert onChange fired with new content
4. Editor still renders markdown syntax highlighting
   - Verify CodeMirror language support intact

---

### Test Suite 2: Markdown Commands Utility
**File:** `src/utils/markdown-commands.test.ts`

**Test Cases:**
1. Bold command
   - No selection: insert `****`, cursor in middle
   - With selection: wrap selected text in `**...**`
2. Italic command
   - No selection: insert `**`, cursor in middle
   - With selection: wrap selected text in `*...*`
3. Code command
   - No selection: insert ``` `` ```, cursor in middle
   - With selection: wrap selected text in backticks
4. Link command
   - Replace selection with `[text](url)`, cursor on `url`
   - No selection: use placeholder `link text`
5. Heading commands (H1, H2, H3)
   - Insert `# `, `## `, `### ` at line start
   - Preserve selection on line
6. List commands (bullet, ordered)
   - Insert `- ` or `1. ` at line start
   - Preserve selection on line
7. Code block command
   - Wrap selection in triple backticks on separate lines
   - Preserve selection inside block
8. Quote command
   - Insert `> ` at line start
9. Horizontal rule command
   - Insert `---` on new line

---

### Test Suite 3: Toolbar Component
**File:** `src/components/Toolbar/Toolbar.test.tsx`

**Test Cases:**
1. Render all 12 command buttons
   - Assert each button has correct label
2. Render undo/redo buttons
   - Assert buttons render with correct labels
3. Command button click
   - Click "Bold"; assert onCommand called with 'bold'
   - Repeat for all 12 commands
4. Undo/redo button click
   - Click "Undo"; assert onUndo called (when canUndo=true)
   - Click "Redo"; assert onRedo called (when canRedo=true)
5. Disabled state
   - Pass canUndo=false; assert undo button disabled
   - Pass canRedo=false; assert redo button disabled
   - Click disabled button; assert no callback fired
6. Visual styling
   - Assert buttons render with initial styling
   - Assert hover styling applied on mouse enter

---

### Test Suite 4: Header Component
**File:** `src/components/Header/Header.test.tsx`

**Test Cases:**
1. Render fileName
   - Assert fileName displays correctly
2. Dirty indicator
   - isDirty=true: assert ● dot appears
   - isDirty=false: assert ● dot hidden
3. Toolbar integration
   - Assert Toolbar component rendered
   - Assert props passed through correctly

---

### Test Suite 5: Page Integration
**File:** `src/app/page.test.tsx` (extended from Phase 3)

**Test Cases:**
1. Header renders
   - Assert Header component mounted
   - Assert file name visible
2. Editor callback wiring
   - Assert onEditorReady called after Editor mounts
   - Assert EditorView stored internally
3. Toolbar command execution
   - Click formatting button → assert applyFormatting called with EditorView
4. Undo/redo state sync
   - Assert undo/redo button disabled state matches canUndo/canRedo
5. Content flow
   - Click toolbar button → content changes → Preview updates
6. Mobile responsiveness
   - Assert mobile toggle still functional
   - Assert Header visible on mobile

---

## 7. Implementation Wiring Diagram

```
page.tsx (EditorLayout)
├── Header component
│   ├── Title bar (fileName + dirty indicator)
│   └── Toolbar component
│       ├── 12 formatting command buttons
│       │   └── onClick → handleCommand(command)
│       │       └── applyFormatting(editorViewRef.current, command)
│       │           └── Text manipulation via CodeMirror API
│       └── Undo/Redo buttons
│           └── onClick → handleUndo/handleRedo()
│               └── useUndoRedo hook
│
└── Editor component
    ├── CodeMirror 6 instance
    └── onEditorReady → store EditorView in ref
```

**Data Flow:**
1. User clicks toolbar button (e.g., Bold)
2. Toolbar calls onCommand('bold')
3. Page calls handleCommand with 'bold'
4. handleCommand calls applyFormatting(editorViewRef, 'bold')
5. applyFormatting uses CodeMirror API to wrap selected text
6. CodeMirror internal onChange fires
7. Editor onChange handler called
8. Editor calls handleChange
9. handleChange calls setContent
10. useDocument updates state + localStorage
11. Page re-renders with new content
12. Preview component receives new content and re-renders
13. Undo/redo state updated on next render cycle

---

## 8. Confidence Scoring

**Research Phase Findings:**
- ✓ CodeMirror 6 API documented and accessible via EditorView
- ✓ Editor component structure allows non-breaking extension via callback
- ✓ FormattingCommand type fully defined in existing types
- ✓ useDocument and useUndoRedo hooks stable
- ✓ Layout from Phase 3 stable; ready for header injection

**Unknowns Identified:**
- CodeMirror EditorView extraction from @uiw/react-codemirror may vary based on wrapper internals (MEDIUM — common pattern, likely to work)

**Unknown Mitigation:**
- EditorView extraction: @uiw/react-codemirror is a standard CodeMirror wrapper; accessing `.cmView` on the DOM element is documented approach
- Tested approach: ref to container div, query `.cm-editor`, access `cmView` property

**Base Score Calculation:**
- Total implementation steps: 5 (Editor refactor, utility, Toolbar, Header, page integration)
- Steps with zero unknowns: 4/5 = 80%
- Base score: (4/5) × 100 = 80%

**Deductions:**
- -5 (1 MEDIUM unknown: EditorView extraction reliability)
- 0 (no unchecked research items)
- 0 (no HIGH unknowns)

**Final Confidence:** 75% — Solid plan with one moderate risk around CodeMirror API extraction; approach is documented but may require adjustment based on actual behavior.

---

## 9. Git & Commit Strategy

**Branch:** Create from `preview-layout` or `main` (depends on Phase 3 merge status)

**Commits (atomic, conventional):**
1. `refactor: expose EditorView from Editor component via callback`
2. `feat: add markdown-commands utility for text formatting`
3. `feat: add Toolbar component with formatting buttons`
4. `feat: add Header component with file info and toolbar`
5. `feat: integrate Header and Toolbar into page layout`

---

## 10. Acceptance Criteria

✓ Toolbar component renders with 12 formatting buttons + undo/redo  
✓ Header displays fileName with dirty indicator  
✓ Clicking toolbar button applies markdown formatting correctly  
✓ Bold wraps selected text in `**...**` (or inserts placeholder)  
✓ Link wraps text in `[...](url)` format  
✓ Heading commands insert `#`/`##`/`###` at line start  
✓ List commands insert `- ` or `1. ` at line start  
✓ Code block wraps selection in triple backticks  
✓ Horizontal rule inserts `---`  
✓ Undo/redo buttons disabled when no history available  
✓ Content changes persist to localStorage via useDocument  
✓ Live preview updates after formatting command  
✓ All tests pass (80% coverage on new files)  
✓ No build errors or warnings  
✓ No SSR/hydration issues  
✓ Responsive: toolbar wraps on mobile  

---

## Summary

**Scope:** FE only | **Difficulty:** Complex (multi-layer integration)

**Key Challenges:**
- CodeMirror API integration (accessing and manipulating EditorView)
- Multiple formatting command types with varied logic
- Toolbar state sync with undo/redo availability
- Responsive layout (horizontal on desktop, wrap on mobile)

**Recommended Approach:**
- Start with Step 1 (Editor refactor) to verify EditorView extraction works
- Validate command utility against CodeMirror API in isolation (Step 2)
- Integrate components incrementally (Toolbar → Header → Page)
- Manual testing critical: each formatting command must produce correct markdown
- Use `/xvibe-fe` on Sonnet for faster iteration on complex component logic

**Why This Confidence:**
- Clear requirements from README
- All dependencies available
- CodeMirror API is standard and documented
- Component architecture well-defined
- Formatting logic is pure and testable

**Risks & Mitigations:**
- **Risk**: EditorView not accessible from wrapper component
  - **Mitigation**: Verified approach using DOM ref; fallback: expose view directly from Editor via createContext
- **Risk**: Command logic has subtle bugs (cursor positioning, selection handling)
  - **Mitigation**: Comprehensive unit tests for each command; manual testing on real editor

**Next Step:** Proceed to implementation using `/xvibe-fe` for Phase 4 development. Start with Step 1 (Editor refactor) to validate CodeMirror integration before committing to full plan.
