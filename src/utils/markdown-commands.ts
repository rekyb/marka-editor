import { EditorView } from '@codemirror/view';
import { FormattingCommand } from '@/types/editor';

export function applyFormatting(view: EditorView, command: FormattingCommand, options?: { altText?: string; url?: string }): void {
  const { state } = view;
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
    case 'image':
      insertImage(view, options?.altText, options?.url);
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
      insertHorizontalRule(view);
      break;
    case 'table':
      insertTable(view);
      break;
  }
}

function wrapSelection(view: EditorView, before: string, after: string): void {
  const { state } = view;
  const selection = state.selection.main;

  if (selection.empty) {
    const placeholder = before === '`' ? 'code' : 'text';
    view.dispatch(
      state.update({
        changes: { from: selection.from, to: selection.to, insert: `${before}${placeholder}${after}` },
        selection: { anchor: selection.from + before.length, head: selection.from + before.length + placeholder.length },
      })
    );
  } else {
    const text = state.doc.sliceString(selection.from, selection.to);
    view.dispatch(
      state.update({
        changes: { from: selection.from, to: selection.to, insert: `${before}${text}${after}` },
        selection: { anchor: selection.from, head: selection.from + before.length + text.length + after.length },
      })
    );
  }
}

function insertLink(view: EditorView, selectedText: string): void {
  const { state } = view;
  const selection = state.selection.main;
  const text = selectedText || 'link text';
  const linkMarkdown = `[${text}](url)`;

  view.dispatch(
    state.update({
      changes: { from: selection.from, to: selection.to, insert: linkMarkdown },
      // anchor/head selects the `url` placeholder: [ + text + ]( = text.length + 3 chars before url
      selection: { anchor: selection.from + text.length + 3, head: selection.from + text.length + 6 },
    })
  );
}

function insertImage(view: EditorView, altText?: string, url?: string): void {
  const { state } = view;
  const selection = state.selection.main;
  const alt = altText || 'image';
  const imageUrl = url || 'image-url';
  const imageMarkdown = `![${alt}](${imageUrl})`;

  view.dispatch(
    state.update({
      changes: { from: selection.from, to: selection.to, insert: imageMarkdown },
      selection: { anchor: selection.from + imageMarkdown.length },
    })
  );
}

function insertAtLineStart(view: EditorView, prefix: string): void {
  const { state } = view;
  const selection = state.selection.main;
  const line = state.doc.lineAt(selection.from);

  view.dispatch(
    state.update({
      changes: { from: line.from, to: line.from, insert: prefix },
      selection: { anchor: selection.from + prefix.length, head: selection.to + prefix.length },
    })
  );
}

function insertCodeBlock(view: EditorView, selectedText: string): void {
  const { state } = view;
  const selection = state.selection.main;
  const text = selectedText || 'code here';
  const codeBlock = `\`\`\`\n${text}\n\`\`\``;

  view.dispatch(
    state.update({
      changes: { from: selection.from, to: selection.to, insert: codeBlock },
      // anchor/head selects the text content: ``` + \n = 4 chars before text
      selection: { anchor: selection.from + 4, head: selection.from + 4 + text.length },
    })
  );
}

function insertHorizontalRule(view: EditorView): void {
  const { state } = view;
  const selection = state.selection.main;

  view.dispatch(
    state.update({
      changes: { from: selection.from, to: selection.to, insert: '\n---\n' },
      selection: { anchor: selection.from + 5 },
    })
  );
}

function insertTable(view: EditorView): void {
  const { state } = view;
  const selection = state.selection.main;
  const table = '|  Column 1  |  Column 2  |\n|------------|------------|\n|  Data 1    |  Data 2    |';

  view.dispatch(
    state.update({
      changes: { from: selection.from, to: selection.to, insert: `\n${table}\n` },
      selection: { anchor: selection.from + 1 },
    })
  );
}
