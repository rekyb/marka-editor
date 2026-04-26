# Markdown Editor v0 — Design Exploration (3 Concepts)

**Mode:** Explore  
**Device:** Responsive (desktop split-view, mobile stacked)  
**Tone:** Professional + concise  
**Design System:** DESIGN.md (indigo primary, white surfaces, DM Sans, 4px grid)

---

## Concept 1: MINIMAL MODE
### "Content-First, Tools on Demand"

**Visual Direction**
An editor that retreats into the background. Typography is the primary visual element. The toolbar appears only when needed (on editor focus or keyboard hover). The interface uses negative space extensively — wide margins, generous line height, breathing room around content. The editor and preview feel like two separate canvases, not panels in a dashboard. Interaction is keyboard-first; mouse users discover buttons through context.

**Layout Structure**

**Desktop (≥1024px):**
- Full viewport split: editor left (55%), preview right (45%), thin divider (1px indigo)
- Top bar: minimal header with just filename input (left) + save indicator (right, no button)
- Bottom bar: status bar with word count, line count, char count (right-aligned, small 12px font)
- Toolbar: hidden by default; appears on editor focus with gentle fade-in, positioned floating above editor (not anchored to top)
- Padding: 32px top/bottom, 24px left/right

**Mobile (<768px):**
- Stacked: editor full width (top 60%), divider (2px), preview full width (bottom 40%)
- Toolbar floats at bottom as 48px action bar with 4 buttons (Bold, Italic, Link, More)
- Status bar: simplified to word count only, positioned under toolbar
- Padding: 16px sides, 12px top/bottom

**Visual Hierarchy**
- Editor background: pure white (#FFFFFF)
- Preview background: off-white (#FAFAFA, from design system)
- Divider: 1px indigo (#6366F1), no shadow
- Text: DM Sans 15px, line-height 1.6 (generous for readability)
- Code in editor: JetBrains Mono 13px, 1.5 line-height

**Key Differentiator**
The toolbar is ephemeral — it only exists in the user's attention when they need it. This rewards power users (keyboard shortcuts) while remaining discoverable. The preview has a slightly different background to create visual separation without hard borders.

---

## Concept 2: STUDIO MODE
### "Professional Workspace, All Tools Visible"

**Visual Direction**
A workspace that puts the full toolkit on display, reminiscent of professional writing software (think Ulysses, iA Writer, or Figma). The interface is divided into clear zones: a fixed header with branding and file controls, a persistent toolbar, the main editor/preview area, and a status bar. Every tool is one click away. The aesthetic is clean and organized, with subtle visual boundaries between zones. Buttons are visible and organized by function (file ops, formatting, view modes).

**Layout Structure**

**Desktop (≥1024px):**
- Fixed header (56px): left side has logo + app name, center has filename input, right side has save/open buttons + menu
- Sticky toolbar (48px): below header, organized into groups — File ops (Save, Open, New), Format ops (Bold, Italic, Code, Link, H1-H3, Lists), View ops (Toggle Preview, Word Count toggle)
- Main content (split): editor left (50%), divider (1px indigo), preview right (50%)
- Status bar (40px): fixed bottom, right-aligned — word count, line count, char count, unsaved indicator (red dot)
- Padding: editor/preview have 16px internal padding, toolbar buttons have 12px padding with 8px gaps

**Mobile (<768px):**
- Header stays fixed (56px)
- Toolbar collapses to icon-only buttons (6 visible: B, I, Link, H, List, More…)
- Main content: stacked editor (55vh) + preview (45vh)
- Status bar: shows only word count, right side
- Buttons become touch-sized (44px min height)

**Visual Hierarchy**
- Header background: white (#FFFFFF) with 1px bottom border (#E8E8EC)
- Toolbar background: white (#FFFFFF) with 1px bottom border (#E8E8EC)
- Buttons: secondary style (transparent bg, indigo text #6366F1, 6px radius, 12px horiz padding)
- Active button: indigo bg (#6366F1), white text, same radius
- Hover: subtle bg-alt (near-white, #F5F5F5)
- Editor/preview: white surface with 1px border (#E8E8EC)
- Divider: thin 1px indigo (#6366F1)

**Component Example: Toolbar Button Group**
```
[Save] [Open] [New]  |  [B] [I] [`] [Link] [H1▼] [List▼]  |  [Preview] [Word Count]
  ↑ File ops          ↑ Format ops                          ↑ View ops
Each group has 8px gap, groups separated by 1px border
Hover on button: subtle lift (shadow) + bg-alt
Focus: 3px indigo ring (from design system)
```

**Key Differentiator**
Everything is visible and accessible. No hidden menus or context-dependent UI. The interface is self-documenting — new users can explore the toolbar and discover features. Keyboard shortcuts are visible as tooltips on buttons. This is the "professional tool" aesthetic.

---

## Concept 3: CENTERED MODE
### "Preview as Primary, Editor as Companion"

**Visual Direction**
The preview is the hero, not the editor. The layout is flipped in visual hierarchy — the preview sits prominent in the center, and the editor is a secondary "source" view on the side. This is ideal for users who are more focused on the rendered output (designers viewing design specs, PMs writing feature docs that will be published). The editor becomes a tool for refinement, not the main event. Spacing and color treatment emphasize the preview pane.

**Layout Structure**

**Desktop (≥1024px):**
- Header (56px): filename input (center), save/open buttons (right), optional preview toggle (right)
- Main area split: editor narrow left (30%), preview center/right (70%), thin divider (1px indigo)
- Preview background is brighter/lighter to draw attention: soft gray (#FAFAFA from design system)
- Editor background: white (#FFFFFF)
- Toolbar: integrated into editor panel, top of editor (48px), vertical button layout to save space
- Status bar (40px): below editor, word count + line count only, compact
- Padding: editor 12px, preview 32px (more breathing room around content)

**Mobile (<768px):**
- Stacked: editor full width (40vh), divider, preview full width (60vh — larger allocation)
- Toolbar: bottom floating action bar (compact, 4 buttons visible)
- Status bar: integrated into preview header

**Visual Hierarchy**
- Editor: white background, smaller text area, toolbar buttons in 2 columns (B/I on top, Code/Link below)
- Preview: off-white background (#FAFAFA), larger canvas, generous margins (32px), typography leads
- Divider: 1px indigo, but visual weight goes to preview (it's the "main" panel)
- Button styling: same as Studio Mode, but in editor's narrow left column
- Preview content: renders at full line-width with MUI Typography defaults (optimized for reading)

**Component Example: Editor Panel (Left Column)**
```
┌─────────────┐
│ Toolbar     │  [B] [I]
│ (2-col)     │  [C] [L]
│             │  [H] [•]
│ Editor      │
│ content     │
│ area        │
│             │
│ Word: 42    │
│ Line: 8     │
└─────────────┘
```

**Key Differentiator**
The preview is not a secondary "what you wrote" view — it's the primary deliverable. The editor is positioned as the "source of truth" that feeds the preview. This works well for documentation-focused users who care about how the content looks when rendered. The narrow editor forces conciseness.

---

## Responsive Behavior Across Concepts

### Desktop Split-View (≥1024px)
- **Minimal Mode:** Editor 55% / Preview 45%, toolbar floats
- **Studio Mode:** Editor 50% / Preview 50%, fixed toolbar + header visible always
- **Centered Mode:** Editor 30% / Preview 70%, toolbar in editor column

### Tablet (768px - 1024px)
- **Minimal Mode:** Editor 60% / Preview 40% (more editor real estate)
- **Studio Mode:** Editor 50% / Preview 50%, toolbar in 2 rows (responsive grid)
- **Centered Mode:** Editor 35% / Preview 65%, toolbar collapses to icons

### Mobile (<768px)
- **All concepts:** Stacked (editor top, preview bottom)
- Toolbar becomes bottom floating action bar (48px height)
- Buttons expand to full width or cluster horizontally
- Status bar simplified (word count primary, others in menu)

---

## Copy: All Three Concepts

### Header / File Controls
- **Filename input placeholder:** "untitled.md"
- **Save button:** "Save"
- **Open button:** "Open"
- **Save indicator (when dirty):** "Unsaved" (red text) or red dot without text

### Toolbar / Format Buttons
Buttons show both icon + label on desktop, icon-only on mobile.
- **Bold:** "Bold" (tooltip: "Ctrl+B / Cmd+B")
- **Italic:** "Italic" (tooltip: "Ctrl+I / Cmd+I")
- **Code:** "Code" (tooltip: "Ctrl+` / Cmd+`")
- **Link:** "Link" (tooltip: "Ctrl+K / Cmd+K")
- **Heading:** "Heading" with dropdown for H1, H2, H3 (tooltip: "H1, H2, H3")
- **List:** "List" with dropdown for unordered / ordered (tooltip: "Bullet or numbered")
- **Code Block:** "Code Block" (tooltip: "Ctrl+Alt+C / Cmd+Opt+C")

### Status Bar
- **Word count:** "Words: 42"
- **Line count:** "Lines: 8"
- **Character count:** "Characters: 234"
- **Combined (compact):** "42 words · 8 lines · 234 chars"

### Empty States
- **New document, editor focused:** (no placeholder text — white canvas, cursor blinking)
- **New document, preview visible:** "Start writing markdown to see a preview here"

### Error Messages
- **File too large:** "File exceeds 10MB. Try a smaller file."
- **Invalid file type:** "Only .md and .txt files are supported."
- **Save failed:** "Could not save file. Check your browser storage."

### Keyboard Shortcuts (Tooltips shown on hover)
- "Ctrl+S / Cmd+S" (Save)
- "Ctrl+O / Cmd+O" (Open)
- "Ctrl+B / Cmd+B" (Bold)
- "Ctrl+I / Cmd+I" (Italic)
- "Ctrl+` / Cmd+`" (Inline code)
- "Ctrl+K / Cmd+K" (Link)
- "Ctrl+Alt+C / Cmd+Opt+C" (Code block)
- "Ctrl+P / Cmd+P" (Toggle preview)

---

## Design System Tokens Applied

| Token | Value | Usage |
|-------|-------|-------|
| **Primary Color** | #6366F1 (indigo) | Active buttons, focus rings, dividers, link text in preview |
| **Surface** | #FFFFFF | Editor background, header, toolbar background |
| **Background** | #FAFAFA | Preview background, alt surfaces |
| **Text Primary** | #0A0A0A | Body text, labels |
| **Text Secondary** | #6B6B6B | Descriptions, status bar text |
| **Border** | #E8E8EC | Panel borders, dividers (except primary divider) |
| **Body Font** | DM Sans 15px | All UI text, editor body |
| **Code Font** | JetBrains Mono 13px | Markdown code blocks, inline code display |
| **Heading Font** | Open Sans | Page title (if shown), section headings in preview |
| **Spacing** | 4px grid | 4, 8, 12, 16, 20, 24, 32px gaps and padding |
| **Border Radius** | 6px buttons, 8px panels | Input fields, buttons, panels |
| **Shadow** | 0 8px 30px rgba(0,0,0,0.08) | Hover state only (buttons, floating toolbar) |
| **Focus Ring** | 3px indigo, 3px outline | All interactive elements |

---

## Summary Table

| Aspect | Minimal Mode | Studio Mode | Centered Mode |
|--------|--------------|-------------|---------------|
| **Best For** | Power users, keyboard-first | New users, all tools visible | Documentation writers, preview-focused |
| **Toolbar** | Hidden/floating | Fixed, persistent | Vertical in editor column |
| **Preview Emphasis** | Equal to editor | Equal to editor | Primary, editor secondary |
| **Visual Complexity** | Low (minimal UI) | Medium (organized toolkit) | Medium (hierarchy-based) |
| **Keyboard Friendly** | Excellent | Good | Good |
| **Discoverability** | Low (must hover) | High (all visible) | Medium (toolbar in column) |
| **Mobile Experience** | Bottom floating bar | Collapsed toolbar | Stacked, editor smaller |
| **Best Persona** | Dev, power users | PMs, QA, new users | Designer, UX researcher |

---

## Next Steps

Choose one concept, and I can generate a full **Implement** spec with:
- Exact component hierarchy (all props, states)
- Pixel-perfect spacing and typography specs
- All interactive states (hover, focus, active, disabled, loading, error)
- Animation/motion direction
- Code-ready component breakdown

**Questions for refinement:**
1. Which concept resonates most with your team's workflow?
2. Should the editor have a gutter line numbers display, or is the line count in the status bar sufficient?
3. For the preview, should headings be larger than editor text (to emphasize rendered output), or same size?

