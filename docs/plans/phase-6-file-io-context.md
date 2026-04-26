# Phase 6 File I/O — Research Findings

## Project Architecture Overview

### Current State
- **Framework:** Next.js 16 (App Router) + React 19
- **State Management:** Custom hooks (`useDocument`, `useStatusBar`, `useUndoRedo`)
- **Storage:** Browser localStorage only
- **UI:** Plain CSS with inline styles + Lucide icons

### Document State Management (useDocument hook)
- **Persists:** content + fileName to localStorage
- **Key properties:** `state.content`, `state.fileName`, `state.isDirty`
- **Mutations:** `setContent()`, `setFileName()`, `markClean()`, `markDirty()`
- **Current flow:** Content auto-persists to localStorage on every change

### Header Component Architecture
- Displays: fileName + isDirty indicator (blue dot)
- Fixed position at top with toolbar below
- Receives: fileName, isDirty, onCommand handlers

### File-Related Infrastructure Already Present
- `DocumentState` type includes `fileName` field
- Header already displays and can manage fileName
- isDirty flag already tracks unsaved state
- No file system APIs currently implemented

## Browser File APIs Available
1. **File Input API** — `<input type="file">` for reading files
2. **Blob/File API** — For creating downloadable files
3. **FileReader API** — For reading uploaded files
4. **localStorage** — Current persistence mechanism

## Phase 6 Scope

### In Scope
1. **Open File** — File picker → read markdown file → load into editor
2. **Save File** — Download current document as `.md` file
3. **Recent Files** — Track recently opened files in localStorage
4. **Auto-save** — Continue existing localStorage auto-save on every change

### Out of Scope (Phase 7+)
- Cloud sync / server persistence
- File history / versions
- Multiple file tabs
- Keyboard shortcut registry
- Settings/preferences

## Technical Dependencies
- No new packages required (File APIs are native)
- Build on existing `useDocument` hook
- Integrate with existing localStorage
- Use Lucide icons for UI buttons (FileOpen, Download icons available)

## Browser Support
- File Input API: All modern browsers ✓
- FileReader API: All modern browsers ✓
- Blob API: All modern browsers ✓
- localStorage: All modern browsers ✓

## Unknowns / Open Questions
- None identified — File I/O is straightforward browser API usage
