# Marka Editor

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rekyb_marka-editor&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rekyb_marka-editor)

Open source markdown editor for anyone who need fast, distraction-free markdown editing.

## Features (v0)

- **Plain Text Editing** — Fast, responsive CodeMirror 6 editor with monospace font
- **Syntax Highlighting** — Manual toggle for markdown syntax highlighting (via preview mode)
- **Live Preview** — Toggle between syntax and formatted preview modes
- **Formatting Toolbar** — 14+ markdown formatting shortcuts (bold, italic, code, lists, headings, links, images, tables, blockquotes, etc.)
- **Image Insertion** — Modal dialog for inserting images with alt text
- **Undo/Redo** — Full history stack with UI controls and keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Auto-Save** — Local storage persistence between sessions
- **File Status** — Visual indicator (dot) for unsaved changes
- **Line Numbers** — Always visible in editor for reference
- **Syntax Highlighting in Code Blocks** — Prism.js highlighting for markdown code blocks
- **Keyboard Shortcuts** — Full keyboard support for power users
- **Word Count** — (Planned - Phase 5) Display word and character count in status bar
- **Open & Save** — (Planned - Phase 6) Load and save markdown files locally

## Current Status

**Phase 4** ✅ — Formatting Toolbar Complete

The editor is fully functional with:
- ✅ Real-time markdown editing with CodeMirror 6
- ✅ Live preview mode with syntax highlighting for code blocks
- ✅ 14+ formatting commands via toolbar
- ✅ Image insertion modal
- ✅ Full undo/redo with UI controls
- ✅ Auto-save to localStorage
- ✅ Clean, distraction-free UI

**Next Steps (Phase 5):** Add status bar with word/character count

## Tech Stack

- **Frontend Framework** — Next.js 16 with React 19 (App Router, Server Components)
- **Editor** — CodeMirror 6 with markdown language support
- **Preview** — react-markdown with GitHub-flavored markdown (remark-gfm)
- **Styling** — Plain CSS (MUI v9 deferred to Phase 2+)
- **Fonts** — DM Sans (body), Open Sans (labels), JetBrains Mono (editor)
- **State Management** — Custom React hooks (useDocument, useUndoRedo)
- **Storage** — Browser localStorage for document persistence

## Getting Started

### Installation

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

The \`--legacy-peer-deps\` flag is needed for React 19 compatibility with CodeMirror dependencies.

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to start editing.

### Production Build

\`\`\`bash
npm run build
npm run start
\`\`\`

## Project Structure

\`\`\`
src/
├── app/
│ ├── layout.tsx # Root layout with font loading
│ ├── page.tsx # Main editor layout (EditorLayout component)
│ ├── globals.css # Global styles and reset
│ ├── emotion-cache.tsx # Emotion cache provider for SSR
│ └── providers.tsx # App providers (Emotion + fonts)
├── components/
│ ├── Editor/
│ │ └── index.tsx # CodeMirror editor wrapper
│ ├── Preview/
│ │ └── index.tsx # react-markdown preview with syntax highlighting
│ ├── Header/
│ │ └── index.tsx # File name, dirty indicator, toolbar integration
│ ├── Toolbar/
│ │ └── index.tsx # 14+ formatting commands with icons
│ └── ImageInsertModal/
│ └── index.tsx # Modal for inserting images with alt text
├── hooks/
│ ├── useDocument.ts # Document state + localStorage
│ ├── useDocument.test.ts # useDocument unit tests
│ ├── useUndoRedo.ts # Undo/redo history stack
│ └── useUndoRedo.test.ts # useUndoRedo unit tests
├── types/
│ └── editor.ts # TypeScript interfaces (FormattingCommand, DocumentState, etc.)
└── utils/
 └── markdown-commands.ts # Formatting command implementations
\`\`\`

## Roadmap

### Phase 1 ✅ Complete

- Project setup with Next.js 16 and TypeScript
- Dependency installation (CodeMirror 6, react-markdown)
- Resolved SSR hydration issues
- Basic page structure

### Phase 2 ✅ Complete

- \`useDocument\` hook — document state management with localStorage
- \`useUndoRedo\` hook — undo/redo history
- \`Editor\` component — CodeMirror integration with markdown support

### Phase 3 ✅ Complete

- \`Preview\` component — react-markdown rendering with syntax highlighting
- Layout with editor/preview toggle
- Mode toggle: "Syntax" (edit) and "Formatted" (preview) buttons
- Empty state message for preview

### Phase 4 ✅ Complete

- Formatting toolbar with 14+ commands
- Markdown command handling via \`markdown-commands\` utility
- Icon-based button UI with hover effects
- Undo/redo buttons with state-based disabling
- Image insertion modal dialog
- Support for: bold, italic, code, link, image, headings (H1-H3), lists, code blocks, quotes, tables, horizontal rules

### Phase 5 → Status Bar

- Word count display
- Character count
- File info (size, name)

### Phase 6 → File I/O

- Load files from disk (file picker)
- Save files to disk
- Recent files list
- File format detection

### Phase 7 → Keyboard Shortcuts

- Global keyboard shortcut registry
- Settings/preferences modal
- Customize shortcuts
- Keyboard shortcut cheat sheet

### Phase 8 → Polish & Testing

- Accessibility improvements (ARIA, semantic HTML)
- Error handling and edge cases
- Performance optimization
- Mobile responsiveness improvements

### Phase 9 → E2E Testing

- Playwright test suite
- Critical user flows covered
- Cross-browser validation

## Development Notes

### Styling Approach

Phase 1-4 use inline styles and plain CSS to minimize dependencies. MUI v9 will be introduced in Phase 5+ to provide a unified component library and design system, as specified in CLAUDE.md.

### TypeScript

Strict TypeScript mode enforced. All components and hooks are fully typed. FormattingCommand is a union type defining all supported markdown operations.

### Testing Status

- ✅ Unit tests with Vitest for hooks (\`useDocument.test.ts\`, \`useUndoRedo.test.ts\`)
- 📋 Component tests with @testing-library/react (Phase 8)
- 📋 E2E tests with Playwright (Phase 9)
- Target: 80% coverage on new files

### Editor Integration

CodeMirror 6 is used with:
- Custom extensions for markdown language support
- Undo/redo via CodeMirror's native command system
- View updates tracked for state management
- EditorView passed as ref to apply formatting commands

### Known Dependencies

- \`--legacy-peer-deps\` required for React 19 compatibility with CodeMirror
- Emotion + Emotion Cache for SSR support (added to prevent hydration mismatch)

## Contributing

This is a personal project for a tech team. Contributions welcome via pull requests.

## License

MIT

## Author

Rekyb ([GitHub](https://github.com/rekyb))
