# Marka Editor

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rekyb_marka-editor&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rekyb_marka-editor)

Open source markdown editor for anyone who need fast, distraction-free markdown editing.

## Features (v0)

- **Plain Text Editing** — Fast, responsive CodeMirror 6 editor with monospace font
- **Syntax Highlighting** — Manual toggle for markdown syntax highlighting
- **Live Preview** — Split-view layout on desktop, stacked on mobile with toggle
- **Open & Save** — Load and save markdown files locally
- **Basic Formatting** — Toolbar with markdown formatting shortcuts (bold, italic, code, lists, headings, etc.)
- **Undo/Redo** — Full history stack with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Line Numbers** — Always visible for reference
- **Word Count** — Display word and character count in status bar
- **Keyboard Shortcuts** — Full keyboard support for power users
- **Auto-Save** — Local storage persistence between sessions

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
│ ├── page.tsx # Home page placeholder
│ └── globals.css # Global styles and reset
├── components/
│ └── Editor/
│ └── index.tsx # CodeMirror editor wrapper
├── hooks/
│ ├── useDocument.ts # Document state + localStorage
│ ├── useUndoRedo.ts # Undo/redo history stack
│ └── use\*.ts # Feature hooks (forthcoming)
├── types/
│ └── editor.ts # TypeScript interfaces for editor state
└── utils/ # Utility functions (forthcoming)
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

### Phase 3 → Preview & Layout

- \`Preview\` component — react-markdown rendering
- Responsive layout (desktop split-view, mobile stacked)
- Preview toggle

### Phase 4 → Formatting & Toolbar

- Formatting toolbar component
- Markdown command handling
- Visual feedback for formatting

### Phase 5 → Status Bar

- Word count display
- Character count
- File info (size, name)

### Phase 6 → File I/O

- Load files from disk
- Save files to disk
- Recent files list

### Phase 7 → Keyboard Shortcuts

- Global keyboard shortcut registry
- Settings/preferences modal
- Customize shortcuts

### Phase 8 → Polish & Testing

- Accessibility improvements (ARIA, semantic HTML)
- Error handling and edge cases
- Performance optimization

### Phase 9 → E2E Testing

- Playwright test suite
- Critical user flows covered
- Cross-browser validation

## Development Notes

### Hydration Workaround

This project uses plain HTML/CSS for layout in Phase 1 to avoid MUI SSR hydration mismatches. MUI v9 and Emotion styling will be integrated in Phase 2+ when components are built, after the foundation is stable.

### TypeScript

Strict TypeScript mode enforced. All components and hooks are fully typed.

### Testing (Forthcoming)

- Unit tests with Vitest (80% coverage target)
- E2E tests with Playwright
- Component tests with @testing-library/react

## Contributing

This is a personal project for a tech team. Contributions welcome via pull requests.

## License

MIT

## Author

Rekyb ([GitHub](https://github.com/rekyb))
