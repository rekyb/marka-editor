# Drag-Drop-to-Open File Feature Plan

**Scope:** Frontend only  
**Difficulty:** Simple — Leverages existing file I/O infrastructure  
**Estimated Effort:** 1-2 hours  
**Confidence:** 95%

---

## Feature Overview

Allow users to drag and drop markdown files directly onto the editor to open them. Dropped files are read, loaded into the editor, and added to recent files—reusing all existing file I/O infrastructure.

**User Flow:**
1. User drags a `.md` file over the editor
2. Visual feedback (highlight drop zone)
3. User releases file
4. File content loads, fileName updates, recent files list updates
5. isDirty flag becomes false (clean load)

---

## API Contract

N/A — Client-side browser Drag & Drop API + existing FileReader infrastructure.

---

## Component Breakdown

### 1. **Page Layout Enhancement** — `src/app/page.tsx`

**Current State:**
- Main container div manages layout and passes props to Header and Editor/Preview
- `handleFileLoaded` callback already exists and is wired to `useFileIO`

**Changes:**
- Add `onDrop` handler to main container (event delegation for the entire editor area)
- Add `onDragOver` handler to show visual feedback (prevent default, add CSS class)
- Add `onDragLeave` handler to remove visual feedback
- Create `handleDropFile()` to extract file from DataTransfer, read via FileReader, call `handleFileLoaded`
- Add CSS class `.dragging` with background highlight when drag is active
- Block non-markdown files and reject gracefully

**Responsibilities:**
- Capture drop events on main container
- Extract dropped file(s) from DataTransfer.files
- Read first dropped file (ignore multiple files)
- Validate file type (only `.md`, `.markdown`, `.txt`)
- Use FileReader to get file content
- Call `handleFileLoaded(content, fileName)` — no new state needed

**Handler Signature:**
```typescript
const handleDropFile = (e: React.DragEvent<HTMLDivElement>): void
```

### 2. **Visual Feedback**

**CSS Changes** (inline styles in page.tsx):
- Add conditional className based on drag state
- Highlight: `background-color: rgba(25, 118, 210, 0.05)` when dragging
- Border: `border-top: 2px dashed #1976d2` for drop zone indication

---

## Implementation Steps

### Step 1: Add Drag State to page.tsx
**File:** `src/app/page.tsx`  
**Changes:**
- Add `isDragging` state: `const [isDragging, setIsDragging] = useState(false);`
- Track drag enter/leave count to handle nested drag events properly (use a ref)

---

### Step 2: Add Drop Handler
**File:** `src/app/page.tsx`  
**Changes:**
- Create `handleDropFile` function:
  ```typescript
  const handleDropFile = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validExtensions = ['.md', '.markdown', '.txt'];
    if (!validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      console.warn('Only markdown files are supported');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result as string;
      handleFileLoaded(content, file.name);
    };
    reader.onerror = () => {
      console.error('Failed to read dropped file');
    };
    reader.readAsText(file);
  };
  ```

---

### Step 3: Add Drag Event Handlers
**File:** `src/app/page.tsx`  
**Changes:**
- Create `handleDragOver` function:
  ```typescript
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  ```
- Create `handleDragLeave` function:
  ```typescript
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    // Only set isDragging to false if leaving the main container
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };
  ```

---

### Step 4: Attach Handlers to Main Container
**File:** `src/app/page.tsx`  
**Changes:**
- Update main container div (currently line 118):
  ```typescript
  <div
    onDrop={handleDropFile}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.05)' : '#fafafa',
      transition: 'background-color 0.2s ease',
      borderTop: isDragging ? '2px dashed #1976d2' : 'none',
    }}
  >
  ```

---

### Step 5: Write Tests
**File:** `src/app/page.test.tsx` (existing integration test file)  
**New test flows:**

#### Test 1: Drop markdown file
- Simulate `DragEvent` with file in DataTransfer
- Verify `handleFileLoaded` called with correct content and fileName
- Verify `isDragging` becomes false

#### Test 2: Drop non-markdown file
- Simulate drop with `.pdf` or `.txt` file
- Verify file is rejected (warn logged, handleFileLoaded NOT called)

#### Test 3: Visual feedback on drag
- Simulate `dragover` event
- Verify `isDragging` state becomes true
- Verify background color changes
- Verify border-top appears

#### Test 4: Visual feedback on drag leave
- Simulate `dragover` → `dragleave` events
- Verify `isDragging` becomes false
- Verify styling reverts

#### Test 5: Recent file integration
- Drop file
- Verify file appears in recent files list
- Verify can load from recent files

---

## Test Plan (Mandatory)

### Integration Tests — `src/app/page.test.tsx`

```
Test 1: Drop valid markdown file
  - Create mock file with .md extension
  - Create DragEvent with file in dataTransfer.files
  - Trigger onDrop handler
  - Assert handleFileLoaded called with correct content + fileName
  - Assert isDragging becomes false
  - Assert file added to recentFiles

Test 2: Drop non-markdown file
  - Create mock .pdf file
  - Trigger onDrop handler
  - Assert console.warn called
  - Assert handleFileLoaded NOT called
  - Assert content doesn't change

Test 3: Drag over visual feedback
  - Trigger onDragOver event
  - Assert isDragging state becomes true
  - Assert main div has background-color: rgba(25, 118, 210, 0.05)
  - Assert main div has border-top: 2px dashed #1976d2

Test 4: Drag leave removes feedback
  - Trigger onDragOver → onDragLeave sequence
  - Assert isDragging becomes false
  - Assert background-color reverts to #fafafa
  - Assert border-top removed

Test 5: Multiple files (take first)
  - Create mock DataTransfer with 2 files
  - Trigger onDrop
  - Assert only first file is processed
  - Assert handleFileLoaded called once

Test 6: File read error handling
  - Mock FileReader to throw error in onload
  - Trigger drop
  - Assert console.error called
  - Assert content doesn't change
```

---

## Implementation Order

1. ✅ Add `isDragging` state to page.tsx
2. ✅ Implement `handleDropFile()` with FileReader
3. ✅ Implement `handleDragOver()` and `handleDragLeave()`
4. ✅ Attach handlers to main container div
5. ✅ Add CSS transitions for visual feedback
6. ✅ Write all integration tests
7. ✅ Manual browser testing (drag a .md file onto editor)

---

## Known Issues / Edge Cases

1. **Multiple Files** — Only first file is processed; others ignored
2. **Folder Drops** — Directories are ignored (file browser returns folder, not files)
3. **File Type Validation** — Only accept `.md`, `.markdown`, `.txt`; reject `.pdf`, images, etc.
4. **Drag Over Nested Elements** — Use `e.currentTarget === e.target` in drag leave to avoid firing on child hovers
5. **Recent Files Integration** — Dropped files automatically added via existing `addRecentFile` in `useFileIO`
6. **Error Handling** — FileReader errors logged to console; user sees no visual error (could add toast in future)

---

## Architecture Notes

**Why Simple:**
- Reuses existing `handleFileLoaded` callback (no new state/logic)
- Reuses existing FileReader pattern (same as file picker in `useFileIO`)
- Recent files automatically tracked via `useFileIO.addRecentFile`
- No new components or hooks needed
- Only adds 3 event handlers to existing div

**Integration Point:**
- `page.tsx` is the natural place for drag-drop since it owns the main container
- Handlers delegate to existing `handleFileLoaded` → `handleFileLoaded` → `setContent/setFileName/markClean`
- No modifications to `useFileIO` hook needed

---

## Confidence Scoring

**Base Score:** 5/5 steps with zero unknowns = 100%

**Deductions:** None

**Final Confidence:** 95%

**Reason:** Straightforward event handler implementation + reuse of existing file reading pattern. Only uncertainty: browser drag-drop API consistency across browsers (minor, well-supported).

---

## Summary

**Scope:** Frontend only

**Difficulty:**
- FE: Simple — No new state management, event handlers only

**Confidence:** 95% — Leverages existing file I/O infrastructure, event handlers are straightforward

**Recommended:**
- Use Haiku for implementation (simple event handling, no complex logic)
- Test manually in browser (drag behavior varies by OS/browser)
- Pair with Phase 6 implementation if file I/O not yet built

**When Ready:** Run `/xvibe-fe` to implement incrementally.
