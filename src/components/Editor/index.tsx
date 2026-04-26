'use client';

import { useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { lineNumbers } from '@codemirror/view';

interface EditorProps {
  readonly content: string;
  readonly onChange: (content: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

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
