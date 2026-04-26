# Phase 6 — File I/O Implementation Plan

**Scope:** Frontend only  
**Difficulty:** Simple — Browser File APIs with minimal new state  
**Estimated Effort:** 3-4 hours

---

## Feature Overview

Add file open/save capabilities to the markdown editor using native browser File APIs. Users can:
1. **Open** — Select a markdown file from disk and load it into the editor
2. **Save** — Download the current document as a `.md` file
3. **Recent Files** — Access list of recently opened files with quick-load capability
4. **Auto-save** — Continue localStorage auto-save (existing)

---

## API Contract

N/A — This phase uses only client-side browser APIs (File Input, FileReader, Blob, localStorage).

---

## User Role Coverage

| Feature | All Users |
|---------|-----------|
| Open file | ✓ |
| Save file | ✓ |
| Recent files list | ✓ |
| Auto-save to localStorage | ✓ |

---

## Component Breakdown

### 1. **File Input Hook** — `src/hooks/useFileIO.ts`

**Purpose:** Abstract file open/save operations.

**Responsibilities:**
- Handle file selection via `<input type="file">`
- Read file content via FileReader API
- Track recently opened files in localStorage
- Generate downloadable Blob for save

**Interface:**
```typescript
interface UseFileIOReturn {
  readonly openFile: () => Promise<void>; // Opens file picker, loads file
  readonly saveFile: () => void; // Triggers download
  readonly recentFiles: readonly RecentFile[];
  readonly loadRecentFile: (fileKey: string) => Promise<void>;
  readonly clearRecentFiles: () => void;
}

interface RecentFile {
  readonly key: string; // unique key (timestamp-based)
  readonly name: string;
  readonly timestamp: number;
}
```

**State:**
- `recentFiles` — Array of { key, name, timestamp } from localStorage
- Key: `'marka-recent-files'` (JSON array, max 10 items)

### 2. **File Menu Component** — `src/components/FileMenu/index.tsx`

**Purpose:** UI for file operations in Header.

**Responsibilities:**
- Render file-related buttons (Open, Save, Recent files dropdown)
- Show recent files list
- Show file name and dirty indicator

**Props:**
```typescript
interface FileMenuProps {
  readonly fileName: string;
  readonly isDirty: boolean;
  readonly onOpenFile: () => Promise<void>;
  readonly onSaveFile: () => void;
  readonly recentFiles: readonly RecentFile[];
  readonly onLoadRecentFile: (fileKey: string) => Promise<void>;
  readonly onClearRecents: () => void;
}
```

**UI Elements:**
- "Open" button — triggers file picker
- "Save" button — downloads file
- "Recent Files" dropdown — list of recent files with timestamps
- File name display (moved from text to component)

### 3. **Updated useDocument Hook** — `src/hooks/useDocument.ts`

**Changes:**
- Add `markClean()` call after successful file load
- Add `setFileName()` calls for file open/recent file load

**No new props/returns — hooks together with useFileIO**

### 4. **Updated Header Component** — `src/components/Header/index.tsx`

**Changes:**
- Import and render `<FileMenu>` component
- Pass file operation handlers
- Integrate recent files list

### 5. **Updated Main Page** — `src/app/page.tsx`

**Changes:**
- Create `useFileIO` hook instance
- Pass file operation handlers to Header
- Pass recentFiles list to Header

---

## Implementation Steps

### Step 1: Create File I/O Hook
**File:** `src/hooks/useFileIO.ts`  
**Changes:**
- Implement `openFile()` — create hidden file input, listen for change event, read via FileReader, parse text, return content + fileName
- Implement `saveFile()` — create Blob from current content, trigger download via URL.createObjectURL + click on hidden anchor
- Implement `recentFiles` state — load from localStorage on init, initialize as empty array if not present
- Implement `loadRecentFile()` — retrieve content from recent file storage (localStorage), load into document
- Store recent files as: `{ key: timestamp, name: string, timestamp: number }` in localStorage
- Limit recent files to 10 items (FIFO queue)

**Test:** `src/hooks/useFileIO.test.ts`
- ✓ openFile triggers file input click
- ✓ FileReader parses uploaded text correctly
- ✓ saveFile creates blob and downloads
- ✓ Recent files are persisted to localStorage (max 10)
- ✓ loadRecentFile retrieves stored content
- ✓ clearRecentFiles empties list

---

### Step 2: Create File Menu Component
**File:** `src/components/FileMenu/index.tsx`  
**Changes:**
- Render "Open" button (icon: FileOpen from Lucide)
- Render "Save" button (icon: Download from Lucide)
- Render "Recent Files" dropdown with list
- Show file name in header
- Show isDirty indicator (blue dot)
- Style to match existing toolbar (inline styles)

**Test:** `src/components/FileMenu/FileMenu.test.tsx`
- ✓ Open button calls onOpenFile
- ✓ Save button calls onSaveFile
- ✓ Recent files dropdown renders list
- ✓ Recent file item calls onLoadRecentFile with correct key
- ✓ Clear recents button calls onClearRecents
- ✓ Dropdown visibility toggles on click

---

### Step 3: Update useDocument Hook
**File:** `src/hooks/useDocument.ts`  
**Changes:**
- No signature changes
- Existing `setFileName()` already marks as dirty — that's correct for user rename
- Document that `markClean()` should be called after successful file load
- Document that `setFileName()` is called by FileMenu after file open

**Test:** Existing tests pass without modification

---

### Step 4: Update Header Component
**File:** `src/components/Header/index.tsx`  
**Changes:**
- Move fileName display from plain text to inside FileMenu component
- Import FileMenu and render it in the header top bar
- Pass file operation props to FileMenu

**Signature changes:** Add these props to HeaderProps:
```typescript
readonly onOpenFile: () => Promise<void>;
readonly onSaveFile: () => void;
readonly recentFiles: readonly RecentFile[];
readonly onLoadRecentFile: (fileKey: string) => Promise<void>;
readonly onClearRecents: () => void;
```

**Test:** Update `src/app/page-test.tsx` to pass new props

---

### Step 5: Update Main Page
**File:** `src/app/page.tsx`  
**Changes:**
- Initialize `useFileIO` hook: `const fileIO = useFileIO(state, setContent, setFileName);`
- Pass fileIO methods and recent files to Header
- Update Header component call with new file operation props

**Hook integration:**
```typescript
const { openFile, saveFile, recentFiles, loadRecentFile, clearRecentFiles } = useFileIO(state, setContent, setFileName, markClean);
```

**Test:** Existing integration test updated with new file operation flows

---

### Step 6: Integration Testing
**File:** `src/app/page.test.tsx`  
**New test flows:**
- ✓ User clicks Open → selects file → content loads → fileName updates → isDirty is false
- ✓ User clicks Save → downloads file with current fileName
- ✓ User opens file → name appears in recent files list
- ✓ User clicks recent file → content loads → fileName updates
- ✓ Open file workflow doesn't lose undo/redo history after load

---

## Test Plan (Mandatory)

### Hook Tests — `src/hooks/useFileIO.test.ts`
```
Test 1: openFile() mechanics
  - Mock FileInput DOM element
  - Mock FileReader API
  - Verify returns { content, fileName }
  - Verify recent file is added to localStorage

Test 2: saveFile() download
  - Mock URL.createObjectURL
  - Mock HTMLAnchorElement.click
  - Verify blob is created with correct content
  - Verify download is triggered with correct fileName

Test 3: recentFiles persistence
  - Store 11 files sequentially
  - Verify only 10 remain (FIFO)
  - Verify localStorage is updated
  - Verify retrieval gets correct list

Test 4: loadRecentFile() recovery
  - Store content in recent files
  - Call loadRecentFile(key)
  - Verify content is retrieved from localStorage
  - Verify returns Promise

Test 5: clearRecentFiles cleanup
  - Populate recent files
  - Call clearRecentFiles()
  - Verify localStorage is cleared
  - Verify empty array returned
```

### Component Tests — `src/components/FileMenu/FileMenu.test.tsx`
```
Test 1: Open button interaction
  - Render with props
  - Click Open button
  - Verify onOpenFile called

Test 2: Save button interaction
  - Render with props
  - Click Save button
  - Verify onSaveFile called

Test 3: Recent files dropdown
  - Render with recentFiles array
  - Verify list renders with file names
  - Verify timestamps display

Test 4: Recent file selection
  - Render with recentFiles
  - Click recent file item
  - Verify onLoadRecentFile called with correct key

Test 5: Clear recents action
  - Render with recentFiles
  - Click Clear Recent Files
  - Verify onClearRecents called

Test 6: Empty state
  - Render with empty recentFiles
  - Verify "No recent files" message shows
```

### Integration Tests — `src/app/page.test.tsx`
```
Test 1: File open workflow
  - Simulate file selection
  - Verify content updates
  - Verify fileName updates
  - Verify isDirty becomes false
  - Verify recent files list updated

Test 2: File save workflow
  - Simulate content change
  - Click Save
  - Verify download is initiated
  - Verify fileName in download

Test 3: Recent file load workflow
  - Open file (adds to recent)
  - Change content
  - Click recent file
  - Verify old content loads
  - Verify fileName updates

Test 4: Auto-save + file operations
  - Load file
  - Change content
  - Verify auto-save to localStorage
  - Close and reopen page
  - Verify content persists from localStorage
```

---

## Implementation Order

1. ✅ Create `useFileIO` hook with full functionality
2. ✅ Create `FileMenu` component with UI
3. ✅ Update Header to render FileMenu
4. ✅ Update page.tsx to wire everything
5. ✅ Write all tests (hook + component + integration)
6. ✅ Manual testing in browser (file open/save flows)

---

## Known Issues / Edge Cases

1. **File Read Errors** — If FileReader fails, catch error and show toast notification
2. **Large Files** — FileReader loads entire file into memory; OK for markdown editor
3. **Binary Files** — Only accept `.md` files; reject others silently
4. **Recent Files Storage** — localStorage limited to ~5MB; 10 files is safe
5. **Download Naming** — Use current `fileName` for download; append `.md` if missing
6. **Undo/Redo on File Load** — CodeMirror undo stack is cleared on content set; this is expected

---

## Confidence Scoring

**Base Score:** 100% (5/5 steps with zero unknowns)

**Deductions:** None

**Final Confidence:** 100%

**Why:** File I/O using browser APIs is straightforward and well-documented. No external dependencies required. Existing `useDocument` hook provides perfect foundation for file operations. No architectural unknowns.

---

## Summary

**Scope:** Frontend only

**Difficulty:**
- BE: N/A
- FE: Simple — Native browser APIs, no complex state

**Confidence:** 100% — Straightforward browser API usage on solid foundation

**Recommended:**
- Use Haiku for implementation (Browser APIs are simple, not computation-heavy)
- Build incrementally: hook → component → integration → test
- Test each step in browser (file picker works differently in dev/prod)

**Next Phase:** Phase 7 (Keyboard Shortcuts Registry)
