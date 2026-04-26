'use client';

import { useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, lineNumbers } from '@codemirror/view';
import type { ViewUpdate } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';

interface EditorProps {
  readonly content: string;
  readonly onChange: (content: string, viewUpdate: ViewUpdate) => void;
  readonly onEditorReady?: (view: EditorView) => void;
}

export function Editor({ content, onChange, onEditorReady }: EditorProps) {
  const editorViewRef = useRef<EditorView | null>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const scrollbarInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;

    const scrollDOM = view.scrollDOM;
    const scrollbarEl = scrollbarRef.current;
    const scrollbarInner = scrollbarInnerRef.current;
    if (!scrollbarEl || !scrollbarInner) return;

    const updateScrollbarWidth = () => {
      scrollbarInner.style.width = `${scrollDOM.scrollWidth}px`;
    };

    const syncFromEditor = () => {
      scrollbarEl.scrollLeft = scrollDOM.scrollLeft;
    };

    const syncToEditor = () => {
      scrollDOM.scrollLeft = scrollbarEl.scrollLeft;
    };

    updateScrollbarWidth();
    scrollDOM.addEventListener('scroll', syncFromEditor);
    scrollbarEl.addEventListener('scroll', syncToEditor);

    const observer = new ResizeObserver(updateScrollbarWidth);
    observer.observe(scrollDOM);

    return () => {
      scrollDOM.removeEventListener('scroll', syncFromEditor);
      scrollbarEl.removeEventListener('scroll', syncToEditor);
      observer.disconnect();
    };
  }, []);

  const handleEditorReady = (view: EditorView) => {
    editorViewRef.current = view;
    onEditorReady?.(view);
  };

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <CodeMirror
          value={content}
          extensions={[markdown(), lineNumbers()]}
          onChange={onChange}
          onCreateEditor={handleEditorReady}
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

      <div
        ref={scrollbarRef}
        style={{
          position: 'sticky',
          bottom: 0,
          height: '12px',
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e5e5e5',
          overflowX: 'auto',
          overflowY: 'hidden',
          flexShrink: 0,
        }}
      >
        <div ref={scrollbarInnerRef} style={{ height: '100%' }} />
      </div>
    </div>
  );
}
