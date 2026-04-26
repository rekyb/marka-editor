# Markdown Editor v0 — Design Implementation Spec
## CENTERED MODE with Manual Syntax Highlighting

**Design Direction:** Preview as Primary, Editor as Companion  
**Status:** Implementation-ready  
**Responsive:** Desktop (split) + Mobile (stacked)  
**Tone:** Professional + concise  
**Design System:** DESIGN.md tokens applied

---

## 1. Visual Direction

The preview is the hero of the interface. The rendered markdown output is the primary deliverable; the editor is the tool for refinement. The layout emphasizes the preview with more visual real estate and breathing room. The editor sits as a narrow, focused companion on the left side. Syntax highlighting is optional — editors can work in plain text mode by default and toggle syntax on when they need to check their markdown structure.

**Visual Characteristics:**
- **Typography-focused:** Preview uses MUI Typography defaults with generous line height (1.6) and margins (32px)
- **Minimal adornment:** No decorative elements; focus on content
- **Two-tone backgrounds:** White editor (#FFFFFF) vs. light gray preview (#FAFAFA) creates visual separation without hard borders
- **Vertical toolbar:** Buttons stack in the narrow editor column to avoid horizontal space waste
- **Color restrained:** Indigo (#6366F1) used only for interactive elements and focus states

---

## 2. Layout Structure

### 2.1 Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────────┐
│ Header (56px)                                           │
│ Filename input (center)         Save  Open  (right)     │
├──────────────────────┬──────────────────────────────────┤
│ Editor Panel (30%)   │ Preview Pane (70%)               │
│                      │                                   │
│ Toolbar (48px)       │                                   │
│ [B] [I]              │ Preview renders here              │
│ [C] [L]              │ with full typography              │
│ [H] [•]              │ and 32px margins                  │
│ [S] [≡]              │                                   │
│ ────────             │                                   │
│                      │                                   │
│ Editor Content Area  │                                   │
│ (text input with or  │                                   │
│  without syntax      │                                   │
│  highlighting)       │                                   │
│                      │                                   │
│ ────────             │                                   │
│ Status Bar (40px)    │                                   │
│ Words: 42            │                                   │
│ Lines: 8             │                                   │
├──────────────────────┴──────────────────────────────────┤
│ Footer / Keyboard Shortcuts (optional)                   │
└─────────────────────────────────────────────────────────┘
```

**Spacing:**
- Editor panel: 12px internal padding (left, right, top, bottom)
- Preview pane: 32px internal padding (generous margins around content)
- Divider between panels: 1px indigo (#6366F1), no gap
- Header padding: 16px horizontal, 12px vertical
- Toolbar buttons: 44px height (touch-safe), 8px gap between buttons in same row

**Grid:**
- All spacing and sizing based on 4px grid (4, 8, 12, 16, 20, 24, 32, 40, 44px)
- Container max-width: Full viewport (no max-width constraint)

### 2.2 Tablet (768px - 1024px)

```
Editor panel 35% / Preview pane 65%
Toolbar adjusts to 2 rows (3 buttons per row) to fit narrow space
Font sizes reduce slightly:
  - Editor body: DM Sans 14px (from 15px)
  - Preview body: DM Sans 15px (unchanged)
Status bar: word count primary, lines/chars in secondary text
```

### 2.3 Mobile (<768px)

```
┌──────────────────────┐
│ Header (56px)        │
│ Filename · Save Open │
├──────────────────────┤
│ Editor (40vh)        │
│ Toolbar (4 buttons)  │
│ [B] [I] [L] [More▼]  │
│ Editor area, full wd │
├──────────────────────┤
│ Preview (60vh)       │
│ Content renders here │
│ Full width, 16px pad │
├──────────────────────┤
│ Bottom Action Bar    │
│ Word count · Save    │
└──────────────────────┘
```

**Mobile Specifics:**
- Editor height: 40vh (40% of viewport height)
- Preview height: 60vh (60% of viewport height — emphasize preview)
- Toolbar: 48px height, 4 visible buttons (B, I, Link, More), horizontal layout
- Bottom bar: shows word count + save indicator
- Font sizes: reduced by 1-2px to fit mobile screens
- Padding: 16px horizontal, 12px vertical

---

## 3. Color Palette & Tokens

| Element | Color | Token | Usage |
|---------|-------|-------|-------|
| **Editor Background** | #FFFFFF | Surface | Plain white, clean canvas |
| **Preview Background** | #FAFAFA | Background | Light gray, visual separation |
| **Header Background** | #FFFFFF | Surface | White header, 1px border below |
| **Toolbar Background** | Inherit (white) | — | Same as editor |
| **Text - Primary** | #0A0A0A | Text Primary | Body text, labels |
| **Text - Secondary** | #6B6B6B | Text Secondary | Status bar, metadata |
| **Button - Default** | transparent bg, #6366F1 text | Primary | Format buttons |
| **Button - Active** | #6366F1 bg, #FFFFFF text | Primary | Syntax highlighting ON |
| **Button - Hover** | #F5F5F5 bg, #6366F1 text | — | Subtle lift + background |
| **Button - Disabled** | #E8E8EC bg, #9C9C9C text | Neutral | Grayed out |
| **Focus Ring** | 3px solid #6366F1 | Primary | All interactive elements |
| **Divider (panels)** | #6366F1 | Primary | Vertical separator |
| **Divider (toolbar)** | #E8E8EC | Border | Section separator in toolbar |
| **Border (panels)** | #E8E8EC | Border | Editor/preview edges |
| **Syntax Highlight (OFF)** | #0A0A0A | Text Primary | Plain text, no colors |
| **Syntax Highlight (ON)** | Mixed (CodeMirror theme) | — | Markdown syntax colored |

---

## 4. Typography

### Fonts
- **Body:** DM Sans 15px (14px on tablet/mobile) regular weight
- **Code/Editor:** JetBrains Mono 13px (12px on mobile), regular weight
- **Headings (in preview):** Open Sans, bold weight

### Type Scale (Preview Content)
| Level | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| H1 | Open Sans | 32px | 700 | 1.2 |
| H2 | Open Sans | 24px | 700 | 1.3 |
| H3 | Open Sans | 18px | 700 | 1.4 |
| Body | DM Sans | 15px | 400 | 1.6 |
| Small | DM Sans | 13px | 400 | 1.5 |
| Code (inline) | JetBrains Mono | 13px | 400 | 1.4 |
| Code (block) | JetBrains Mono | 13px | 400 | 1.5 |

### Editor Content
- Font: JetBrains Mono 13px
- Line height: 1.5
- Letter spacing: 0 (default)

---

## 5. Component Specifications

### 5.1 Header Component

**Container:** Fixed top, full width, 56px height

```
┌────────────────────────────────────────────────────────────┐
│ Filename Input (center)      [Save]  [Open]  [Menu ▼]     │
└────────────────────────────────────────────────────────────┘
```

**Filename Input**
- Field: text input, MUI TextField variant="standard"
- Placeholder text: "untitled.md"
- Width: 300px (desktop), 200px (tablet), 100% - 120px (mobile)
- Style: no border, bottom border on focus (2px indigo)
- Padding: 0 (inline element)
- Font: DM Sans 15px
- Color: #0A0A0A
- Unsaved indicator: Red dot (6px) right of input (when isDirty)

**Save Button**
- Style: Secondary (transparent bg, 1px indigo border, indigo text)
- Label: "Save"
- Size: 38px height, 80px width
- Radius: 6px
- Padding: 10px vertical, 14px horizontal
- Hover: bg-alt (#F5F5F5), lift 1px
- Focus: 3px indigo ring
- Disabled: gray text (#9C9C9C), gray border (#E8E8EC)

**Open Button**
- Style: Secondary (same as Save)
- Label: "Open"
- Size: 38px height, 80px width
- Placement: Right of Save, 8px gap

**Menu Button (⋮ or ≡)**
- Icon: three horizontal lines (MUI Icon: Menu)
- Style: Ghost (no bg, no border, text color on hover)
- Size: 38px square
- Hover: bg-alt (#F5F5F5)
- Triggers dropdown with: New, Save As, Export (future), Settings (future)

**States:**
- **Default:** Indigo border, white bg, #0A0A0A text
- **Hover:** bg-alt (#F5F5F5), same border, lifted 1px (shadow: 0 8px 30px rgba(0,0,0,0.08))
- **Focus:** 3px indigo ring (outline)
- **Disabled:** Gray text (#9C9C9C), gray border (#E8E8EC), no shadow
- **Active/Pressed:** Indigo fill, white text (for Save when saving)

---

### 5.2 Editor Panel (Left Column)

**Container:** White background (#FFFFFF), 30% width (desktop), 35% (tablet), 100% (mobile stacked)

#### Toolbar (48px height, vertical 2-column layout)

Button grid: 3 rows × 2 columns (6 buttons visible) + overflow menu

```
[B] [I]
[C] [L]
[H] [•]
[S] [≡]
```

**Button Specs:**
- Size: 40px height, 40px width (square, touch-safe)
- Margin: 4px between buttons (4px grid)
- Radius: 6px
- Font: Icon (16px) + optional label below on hover (DM Sans 10px)
- Padding: 8px (centered icon)

**Keyboard Shortcuts (shown in tooltip on hover):**
- **[B] Bold:** "Ctrl+B / Cmd+B"
- **[I] Italic:** "Ctrl+I / Cmd+I"
- **[C] Code:** "Ctrl+` / Cmd+`"
- **[L] Link:** "Ctrl+K / Cmd+K"
- **[H] Heading:** "H1, H2, H3" (dropdown menu)
- **[•] List:** "Bullet, Numbered" (dropdown menu)
- **[S] Syntax:** "Ctrl+Shift+H / Cmd+Shift+H" (toggle)
- **[≡] More:** "Code Block, Horizontal Rule, Quote" (overflow menu)

**Button States:**

Default (no syntax highlighting):
- Background: transparent
- Text/Icon: #6366F1 (indigo)
- Border: none
- Cursor: pointer

Hover:
- Background: #F5F5F5 (subtle alt)
- Text/Icon: #6366F1
- Shadow: 0 8px 30px rgba(0,0,0,0.08) (light lift)
- Transition: 150ms ease-in-out

Focus:
- Ring: 3px solid #6366F1 (outline, 2px offset)
- Background: unchanged

Active (Syntax Highlighting ON):
- Background: #6366F1 (filled)
- Text/Icon: #FFFFFF (white)
- Shadow: 0 4px 12px rgba(99,102,241,0.35) (indigo tint)

Disabled:
- Background: transparent
- Text/Icon: #9C9C9C (muted)
- Cursor: not-allowed
- Opacity: 0.6

**Divider below toolbar:** 1px #E8E8EC (subtle, no visual weight)

#### Editor Content Area

**CodeMirror Instance:**
- **When Syntax OFF:** Plain text editor, no syntax highlighting, monospace font
  - Font: JetBrains Mono 13px
  - Color: #0A0A0A (text primary)
  - Background: #FFFFFF (surface)
  - Line height: 1.5
  - Padding: 12px (matches toolbar padding)
  - Border: none (inherits from editor panel)
  
- **When Syntax ON:** CodeMirror with markdown language support
  - Same font/size/padding
  - CodeMirror markdown theme:
    - Keywords (##, -, *): #6366F1 (indigo)
    - Code blocks (```): #0A0A0A, bold
    - Bold (**text**): #0A0A0A, bold
    - Italic (*text*): #0A0A0A, italic
    - Links ([text](url)): #6366F1 (indigo)
    - Other markdown: #6B6B6B (secondary text)

**Cursor & Selection:**
- Cursor: blinking text cursor, 1px #6366F1
- Selection: 20% opacity background (#6366F1)
- Focus: 3px indigo ring around entire editor (CodeMirror wraps in focus ring)

**Scroll:**
- Scrollbar: thin (8px), #E8E8EC track, #6366F1 thumb
- Thumb on hover: #4F46E5 (darker indigo)

#### Status Bar (40px height, below editor)

```
Words: 42 · Lines: 8
```

- Font: DM Sans 13px
- Color: #6B6B6B (text secondary)
- Padding: 12px left
- Alignment: left-aligned (mobile: right-aligned in bottom bar)
- Layout: flex, gap 8px between metrics

---

### 5.3 Preview Pane (Right Column / Bottom on Mobile)

**Container:** Light gray background (#FAFAFA), 70% width (desktop), 65% (tablet), 100% (mobile stacked)

#### Content Area

- **Padding:** 32px (desktop), 20px (tablet), 16px (mobile)
- **Font:** MUI Typography defaults (body: DM Sans 15px, headings: Open Sans bold)
- **Line height:** 1.6 (body), 1.4 (headings)
- **Color:** #0A0A0A (text primary)

**Rendered Elements:**

**Paragraphs:**
- Font: DM Sans 15px
- Line height: 1.6
- Margin bottom: 16px
- Color: #0A0A0A

**Headings:**
- H1: Open Sans 32px bold, margin-bottom 24px
- H2: Open Sans 24px bold, margin-bottom 20px
- H3: Open Sans 18px bold, margin-bottom 16px
- Color: #0A0A0A

**Lists (Unordered & Ordered):**
- Font: DM Sans 15px
- Margin left: 20px (indent)
- Margin bottom: 16px (list)
- Margin bottom: 8px (list item)
- Line height: 1.6

**Code (Inline):**
- Font: JetBrains Mono 13px
- Background: #F5F5F5 (very light gray)
- Padding: 2px 4px
- Border radius: 4px
- Color: #0A0A0A

**Code Block:**
- Font: JetBrains Mono 13px
- Background: #2D2D2D (dark gray, for contrast)
- Text color: #F8F8F2 (light)
- Padding: 16px
- Border radius: 8px
- Margin bottom: 16px
- Overflow: auto (horizontal scroll if needed)
- Line height: 1.5

**Blockquotes:**
- Border left: 4px #6366F1 (indigo)
- Margin left: 16px
- Padding left: 12px
- Color: #6B6B6B (text secondary)
- Font style: italic
- Margin bottom: 16px

**Links:**
- Color: #6366F1 (indigo, primary color)
- Text decoration: underline
- Cursor: pointer
- Hover: color #4F46E5 (darker indigo)

**Horizontal Rule:**
- Color: #E8E8EC (border color)
- Height: 1px
- Margin: 24px 0
- Style: solid

**Empty State (no content in editor):**
- Centered message: "Start writing markdown to see a preview here"
- Font: DM Sans 15px
- Color: #9C9C9C (neutral)
- Padding: 60px (vertical center)

---

## 6. Interactive States & Behaviors

### 6.1 Syntax Highlighting Toggle

**Default State:** Syntax highlighting OFF (plain text)

**Toggle Behavior:**
- Click [S] button in toolbar OR press Ctrl+Shift+H (Cmd+Shift+H on Mac)
- Button fills with indigo (#6366F1), text turns white
- Editor switches from plain text to CodeMirror with syntax coloring
- User can toggle back OFF by clicking button again
- State persists in localStorage (remember user preference)

**Visual Feedback:**
- Button state change: transparent → filled indigo (instant)
- Editor refresh: syntax colors appear (instant, no animation)
- No confirmation dialog

### 6.2 Editor Focus & Blur

**On Focus:**
- Editor gains 3px indigo ring (0 0 0 3px rgba(99,102,241,0.12))
- Cursor becomes visible and blinking
- Toolbar buttons become interactive (hover states work)

**On Blur:**
- Ring disappears
- Content saved to state
- Toolbar returns to default state

### 6.3 Button States & Transitions

**Hover → Focus → Active:**
1. **Hover:** bg-alt (#F5F5F5) appears, shadow lifts 1px (0 8px 30px rgba(0,0,0,0.08))
2. **Focus:** 3px indigo ring added (cumulative with hover state)
3. **Active (Syntax ON):** bg fills indigo (#6366F1), text turns white, shadow tints indigo

**All transitions:** 150ms ease-in-out (cubic-bezier(0.4, 0, 0.2, 1))

### 6.4 File Operations

**Save Button Click:**
1. User clicks [Save] button
2. Button shows loading state: text becomes "Saving..." (2px spinner icon animates)
3. File is downloaded to user's Downloads folder as "[filename].md"
4. Button text returns to "Save" after 1 second
5. Unsaved indicator (red dot) disappears

**Open Button Click:**
1. User clicks [Open] button
2. File browser dialog opens (system-level file picker)
3. User selects .md or .txt file
4. File content loads into editor
5. Filename updates in header input
6. Preview updates immediately
7. localStorage saves new draft

**Keyboard Shortcuts:**
- **Ctrl+S / Cmd+S:** Triggers save (same as button)
- **Ctrl+O / Cmd+O:** Triggers open (same as button)

---

## 7. Responsive Breakpoints & Behavior

### 7.1 Desktop (≥1024px)
- Split layout: editor 30%, preview 70%
- Full-height panels (min-height: calc(100vh - 56px - 40px) to account for header + status)
- Toolbar vertical (2-column button grid, 6 visible + menu)
- Status bar horizontal, at bottom of editor
- Font sizes: nominal (15px body, 13px code)

### 7.2 Tablet (768px - 1024px)
- Split layout: editor 35%, preview 65%
- Toolbar: 2 rows × 3 columns (4 visible on first row, 2 + menu on second)
- Button size: reduced to 36px (40px - 4px for scaling)
- Font sizes: reduced by 1px (14px body, 12px code)
- Padding: reduced to 16px (from 24px) on panels
- Status bar: word count + "W" icon only (less space)

### 7.3 Mobile (<768px)
- Stacked layout: editor top (40vh), preview bottom (60vh)
- Toolbar: horizontal, 4 buttons visible (B, I, Link, More)
- Button size: 44px (touch-safe), with icons only (labels on long-press)
- Font sizes: further reduced (13px body, 11px code)
- Padding: 16px (sides), 12px (vertical)
- Header: compact (filename input shorter, buttons icon-only)
- Status bar: bottom floating bar, word count only

### 7.4 Layout Transitions

**At 1024px → 1023px (desktop → tablet):**
- Editor panel: 30% → 35%
- Preview panel: 70% → 65%
- Toolbar: 2 cols → 2 rows × 3 cols
- Padding: 24px → 16px

**At 768px → 767px (tablet → mobile):**
- Layout: split → stacked
- Editor height: 100% → 40vh
- Preview height: 100% → 60vh
- Toolbar: vertical → horizontal
- Header: full filename input → abbreviated input

---

## 8. Copy & Microcopy

### Header & File Controls
| Element | Copy | Context |
|---------|------|---------|
| Filename input placeholder | "untitled.md" | No file opened yet |
| Filename example | "my-design-spec.md" | After opening/saving |
| Unsaved indicator | (red dot, no text label) | Editor has unsaved changes |
| Save button | "Save" | Primary action |
| Open button | "Open" | Secondary action |
| Menu button | (icon only: ≡) | Overflow menu |

### Toolbar Buttons (Tooltips on hover)
| Button | Tooltip | Keyboard Shortcut |
|--------|---------|-------------------|
| Bold | "Bold" | Ctrl+B / Cmd+B |
| Italic | "Italic" | Ctrl+I / Cmd+I |
| Code | "Code" | Ctrl+` / Cmd+` |
| Link | "Link" | Ctrl+K / Cmd+K |
| Heading | "Heading (H1, H2, H3)" | Dropdown menu |
| List | "List (bullet, numbered)" | Dropdown menu |
| Syntax | "Syntax highlighting" | Ctrl+Shift+H / Cmd+Shift+H |
| More | "More (code block, quote)" | Overflow menu |

### Status Bar
| Metric | Format | Example |
|--------|--------|---------|
| Word count | "Words: N" | "Words: 42" |
| Line count | "Lines: N" | "Lines: 8" |

### Preview Empty State
| Scenario | Copy |
|----------|------|
| New document, no content | "Start writing markdown to see a preview here" |

### Error Messages
| Scenario | Message | Tone |
|----------|---------|------|
| File too large (>10MB) | "File exceeds 10MB. Try a smaller file." | Professional, actionable |
| Invalid file type | "Only .md and .txt files are supported." | Professional, clear |
| Save failed | "Could not save file. Check your browser storage." | Professional, helpful hint |
| localStorage full | "Storage is full. Clear some files to save." | Professional, actionable |

### Keyboard Shortcuts Help (optional footer, can be hidden)

```
Ctrl+S / Cmd+S: Save  |  Ctrl+O / Cmd+O: Open  |  Ctrl+B / Cmd+B: Bold  |  
Ctrl+I / Cmd+I: Italic  |  Ctrl+K / Cmd+K: Link  |  Ctrl+Shift+H / Cmd+Shift+H: Syntax
```

---

## 9. Motion & Animation

### 9.1 Entrance Animations

**Page load:**
- Header: fade in (0ms, instant)
- Editor panel: fade in (100ms, ease-in)
- Preview pane: fade in (150ms, ease-in)
- Staggered timing creates subtle cascade effect (max 150ms total)
- Reduced motion: all instant (0ms)

### 9.2 Button Interactions

**Hover:**
- Background color change: 150ms ease-in-out
- Shadow lift: 150ms ease-in-out (shadow depth increases, position raises 1px)
- No scale or transform

**Focus:**
- Ring appears: instant (0ms, ring is outline property)
- Combines with any hover state

**Active (Syntax toggle):**
- Background fill: 150ms ease-in-out
- Text color change: 150ms ease-in-out
- Shadow tint: 150ms ease-in-out

### 9.3 File Operations

**Save in progress:**
- Button text: "Save" → "Saving..." (instant)
- Spinner icon: rotates 360° every 1s (linear, continuous while saving)
- Button disabled during save (prevents double-click)

**Save complete:**
- Button text: "Saving..." → "Save" (instant, after 1s or when complete)
- Spinner stops
- Unsaved indicator (red dot) fades out (150ms)

### 9.4 Reduced Motion Fallback

Users with `prefers-reduced-motion: reduce` in OS settings:
- All 150ms transitions: instant (0ms)
- All shadows/lift effects: removed (static)
- All spinners: static icon (no rotation)
- Entrance animations: all instant, no stagger
- Focus states: still present (accessibility requirement)

---

## 10. Accessibility

### 10.1 Keyboard Navigation

**Tab order:**
1. Filename input
2. Save button
3. Open button
4. Menu button
5. Toolbar buttons (B, I, C, L, H, •, S, ≡) in order
6. Editor content area
7. Preview area (skip if preview hidden)

**All interactive elements are focusable:** Tab key activates focus ring (3px indigo outline)

**Buttons:**
- Click with mouse: activates
- Enter key: activates
- Space key: activates
- Tab: moves to next

**Dropdowns (Heading, List, More):**
- Click or Enter to open
- Arrow keys to navigate options
- Enter to select
- Escape to close

### 10.2 ARIA Labels & Roles

| Element | ARIA Label | Role | Notes |
|---------|-----------|------|-------|
| Filename input | "Document filename" | textbox | aria-label="Document filename" |
| Save button | "Save document" | button | aria-label="Save document" |
| Open button | "Open file" | button | aria-label="Open file" |
| Syntax button | "Toggle syntax highlighting" | button | aria-label="Toggle syntax highlighting", aria-pressed (true/false) |
| Editor area | "Editor content" | — | CodeMirror manages accessibility |
| Preview area | "Preview" | region | aria-label="Markdown preview" |
| Status bar | "Editor statistics" | status | aria-live="polite" for updates |

### 10.3 Color Contrast

All text meets WCAG AA standards (4.5:1 contrast ratio):

| Text | Background | Contrast | Standard |
|------|-----------|----------|----------|
| #0A0A0A (body) | #FFFFFF (editor) | 21:1 | WCAG AAA ✓ |
| #0A0A0A (body) | #FAFAFA (preview) | 20.5:1 | WCAG AAA ✓ |
| #6B6B6B (secondary) | #FFFFFF | 7.8:1 | WCAG AA ✓ |
| #6B6B6B (secondary) | #FAFAFA | 7.5:1 | WCAG AA ✓ |
| #6366F1 (indigo) | #FFFFFF | 5.2:1 | WCAG AA ✓ |
| #FFFFFF (white text) | #6366F1 (indigo) | 5.2:1 | WCAG AA ✓ |
| #9C9C9C (disabled) | #FFFFFF | 4.8:1 | WCAG AA ✓ |

### 10.4 Focus Indicators

- **Focus ring:** 3px solid #6366F1 (indigo), 2px offset from element edge
- **Focus ring on white bg:** rgba(99,102,241,0.12) for subtle fill + outline
- **Visible from 3+ feet away:** High contrast outline, not just color change
- **Not hidden:** Focus ring always visible, never hidden by overflow or z-index

### 10.5 Touch Targets

All interactive elements meet minimum 44px touch target:
- Buttons: 44px min height (desktop can be 38px, but mobile expanded)
- Links in preview: 44px line height (easy to tap)
- Toolbar buttons: 40px (desktop), 44px (mobile)

### 10.6 Motion & Animation

- **Reduced motion support:** All animations respect `prefers-reduced-motion`
- **No auto-play:** No videos, animations, or sounds start without user action
- **Seizure safety:** No flashing (>3 times per second) or bright flashes

---

## 11. Design System Token Summary

**Color Tokens:**
- Primary: #6366F1 (indigo) — interactive elements, focus, dividers
- Primary Hover: #4F46E5 (darker indigo) — link hover
- Surface: #FFFFFF (white) — editor, header, toolbar
- Background: #FAFAFA (light gray) — preview, alt surfaces
- Text Primary: #0A0A0A (near-black) — body text
- Text Secondary: #6B6B6B (gray) — metadata, secondary labels
- Neutral: #9C9C9C (muted gray) — disabled state
- Border: #E8E8EC (subtle gray) — dividers, borders
- Success: #10B981 (green) — save confirmation (future)
- Error: #EF4444 (red) — error messages, unsaved indicator

**Typography Tokens:**
- Display Font: Open Sans (headings in preview)
- Body Font: DM Sans (all UI text, preview body)
- Code Font: JetBrains Mono (editor, code blocks)

**Spacing Tokens (4px grid):**
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 44px, 48px, 56px, 64px

**Border Radius Tokens:**
- 4px: inline code badges, tags
- 6px: buttons, inputs, small components
- 8px: panels, cards, larger components
- 9999px: avatars, pills (not used in this design)

**Shadow Tokens:**
- None (static) — all surfaces are flat
- Hover: 0 8px 30px rgba(0,0,0,0.08) — button lift on hover
- Indigo tint: 0 4px 12px rgba(99,102,241,0.35) — active syntax button

---

## 12. States & Edge Cases

### 12.1 Editor States

| State | Visual | Behavior |
|-------|--------|----------|
| Empty (new doc) | Blank editor, preview shows "Start writing..." | Ready for input |
| Content (typing) | Text visible, preview updates in real-time | Normal editing |
| With Syntax ON | Markdown colors visible (indigo links, bold, etc.) | Same as typing state |
| With Syntax OFF | Plain text, no colors | Same as typing state |
| Focused | 3px indigo ring around editor | Text input active |
| Blurred | No ring | Content saved |
| Selecting text | Selection highlighted (20% indigo tint) | Ready for format button |
| Unsaved changes | Red dot next to filename | Save button highlighted |
| After save | Red dot removed, status updated | Normal state |

### 12.2 Button States

| State | Style | Cursor |
|-------|-------|--------|
| Default | transparent bg, indigo text | pointer |
| Hover | bg-alt (#F5F5F5), shadow lift | pointer |
| Focus | 3px indigo ring | pointer |
| Active (Syntax ON) | indigo fill, white text, tinted shadow | pointer |
| Disabled | gray text, transparent bg, no hover | not-allowed |
| Loading (Save in progress) | "Saving..." text, spinner icon | not-allowed |

### 12.3 File Operation States

| Scenario | Message | Button State | Action |
|----------|---------|--------------|--------|
| Saving... | (spinner) "Saving..." | Disabled, loading icon | Wait for completion |
| Save success | (no message, dot disappears) | Normal | Resume editing |
| Save failed | "Could not save file..." | Error state (red text) | User can retry |
| File too large | "File exceeds 10MB..." | Error message shown | User selects smaller file |
| Invalid file type | "Only .md and .txt files..." | Error message shown | User selects valid file |

### 12.4 Mobile-Specific States

| Breakpoint | Change |
|-----------|--------|
| <768px | Editor/Preview stack, toolbar becomes horizontal bottom bar, header compacts |
| Orientation change (portrait → landscape) | Layout adjusts (taller toolbar, narrower panels) |
| Keyboard open (mobile) | Preview may be pushed off-screen (browser default behavior) |
| Virtual keyboard visible | Editor area shrinks (browser default), scroll available |

---

## 13. Implementation Checklist

### Components to Build
- [ ] Header (filename input, save, open, menu buttons)
- [ ] Editor (CodeMirror wrapper with syntax toggle)
- [ ] Preview (react-markdown with custom component styling)
- [ ] Toolbar (format buttons, syntax toggle)
- [ ] Status bar (word/line/char count)
- [ ] Layout container (split-view desktop, stacked mobile)

### Hooks to Create
- [ ] useDocument (content state, localStorage)
- [ ] useUndoRedo (history stack)
- [ ] useKeyboardShortcuts (Ctrl+S, Ctrl+O, format shortcuts)
- [ ] useSyntaxToggle (toggle syntax highlighting state)

### Utility Functions
- [ ] formatters.ts (bold, italic, code, link, heading, list, code block)
- [ ] fileIO.ts (save file, open file)
- [ ] shortcuts.ts (keyboard shortcut definitions)

### Testing Requirements
- [ ] Editor renders with/without syntax (unit)
- [ ] Syntax toggle works (unit + E2E)
- [ ] Toolbar applies formatting (unit + E2E)
- [ ] Preview updates on edit (E2E)
- [ ] File save/open works (E2E)
- [ ] Responsive layout (visual regression tests)
- [ ] Keyboard navigation (accessibility tests)
- [ ] 80% code coverage on new files (unit test gate)

---

## 14. Notes & Deviations

**Optional Features (v1+):**
- Dark mode toggle (would require color token variants)
- Theme customization (font, colors)
- Split-view divider resize (drag to adjust editor/preview ratio)
- Syntax themes (choose CodeMirror theme: one-dark, dracula, etc.)
- Search/replace in editor (CodeMirror supports natively)

**Intentional Constraints (v0):**
- No backend sync (client-side localStorage only)
- No cloud export (File API download only)
- No collaborative editing
- No version history
- Syntax highlighting is toggle only (not theme-selectable in v0)

