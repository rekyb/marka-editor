'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { useDocument } from '@/hooks/useDocument';
import { useUndoRedo } from '@/hooks/useUndoRedo';

export default function EditorLayout() {
  const { state, setContent } = useDocument();
  const { undo, redo } = useUndoRedo(state.content);
  const [view, setView] = useState<'editor' | 'preview'>('editor');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showEditor = !isMobile || view === 'editor';
  const showPreview = !isMobile || view === 'preview';

  const handleChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        {showEditor && (
          <Editor content={state.content} onChange={handleChange} />
        )}

        {showPreview && (
          <Preview content={state.content} />
        )}
      </div>

      {isMobile && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e5e5',
          }}
        >
          <button
            onClick={() => setView('editor')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: view === 'editor' ? '#6366f1' : '#e5e5e5',
              color: view === 'editor' ? '#ffffff' : '#0a0a0a',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '14px',
            }}
          >
            Editor
          </button>
          <button
            onClick={() => setView('preview')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: view === 'preview' ? '#6366f1' : '#e5e5e5',
              color: view === 'preview' ? '#ffffff' : '#0a0a0a',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '14px',
            }}
          >
            Preview
          </button>
        </div>
      )}
    </div>
  );
}
