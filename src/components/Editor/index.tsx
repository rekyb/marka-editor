'use client';

import { useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, lineNumbers } from '@codemirror/view';
import type { ViewUpdate } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import styles from './Editor.module.css';

interface EditorProps {
  readonly content: string;
  readonly onChange: (content: string, viewUpdate: ViewUpdate) => void;
  readonly onEditorReady?: (view: EditorView) => void;
  readonly isDarkMode?: boolean;
}

export function Editor({ content, onChange, onEditorReady, isDarkMode = false }: EditorProps) {
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
    <div className={styles.container}>
      <div className={styles.editorWrapper}>
        <CodeMirror
          value={content}
          extensions={[markdown(), lineNumbers()]}
          onChange={onChange}
          onCreateEditor={handleEditorReady}
          height="100%"
          theme={isDarkMode ? 'dark' : 'light'}
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
            height: '100%',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            lineHeight: '1.6',
          }}
        />
      </div>

      <div ref={scrollbarRef} className={styles.scrollbar}>
        <div ref={scrollbarInnerRef} className={styles.scrollbarInner} />
      </div>
    </div>
  );
}
