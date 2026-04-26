'use client';

import { useState, useRef, useEffect } from 'react';
import { EditorView } from '@codemirror/view';
import type { ViewUpdate } from '@codemirror/view';
import { undo as cmUndo, redo as cmRedo, undoDepth, redoDepth } from '@codemirror/commands';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { ImageInsertModal } from '@/components/ImageInsertModal';
import { useDocument } from '@/hooks/useDocument';
import { useStatusBar } from '@/hooks/useStatusBar';
import { applyFormatting } from '@/utils/markdown-commands';
import { FormattingCommand } from '@/types/editor';

export default function EditorLayout() {
  const { state, setContent, setFileName } = useDocument();
  const statusBarStats = useStatusBar(state.content);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    document.title = state.fileName;
  }, [state.fileName]);

  useEffect(() => {
    if (!isHydrated) return;

    const hasSeenWelcome = localStorage.getItem('marka-welcome-shown');
    if (!hasSeenWelcome) {
      fetch('/Welcome-to-Marka-Editor.md')
        .then((res) => res.text())
        .then((content) => {
          setContent(content);
          setFileName('Welcome-to-Marka-Editor.md');
          localStorage.setItem('marka-welcome-shown', 'true');
        })
        .catch(() => {
          // Silently fail if welcome file doesn't load
        });
    }
  }, [isHydrated, setContent, setFileName]);

  const handleChange = (newContent: string, viewUpdate: ViewUpdate): void => {
    setContent(newContent);
    setCanUndo(undoDepth(viewUpdate.state) > 0);
    setCanRedo(redoDepth(viewUpdate.state) > 0);
  };

  const handleEditorReady = (editorView: EditorView): void => {
    editorViewRef.current = editorView;
  };

  const handleCommand = (command: FormattingCommand): void => {
    if (command === 'image') {
      setIsImageModalOpen(true);
      return;
    }
    if (editorViewRef.current) {
      applyFormatting(editorViewRef.current, command);
    }
  };

  const handleImageInsert = (altText: string, url: string): void => {
    if (editorViewRef.current) {
      applyFormatting(editorViewRef.current, 'image', { altText, url });
    }
    setIsImageModalOpen(false);
  };

  const handleUndo = (): void => {
    if (!editorViewRef.current) return;
    cmUndo(editorViewRef.current);
    setCanUndo(undoDepth(editorViewRef.current.state) > 0);
    setCanRedo(redoDepth(editorViewRef.current.state) > 0);
  };

  const handleRedo = (): void => {
    if (!editorViewRef.current) return;
    cmRedo(editorViewRef.current);
    setCanUndo(undoDepth(editorViewRef.current.state) > 0);
    setCanRedo(redoDepth(editorViewRef.current.state) > 0);
  };

  const handleTogglePreview = (): void => {
    setIsPreviewActive((prev) => !prev);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fafafa' }}>
      <Header
        fileName={state.fileName}
        isDirty={state.isDirty}
        onCommand={handleCommand}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isPreviewActive={isPreviewActive}
        onTogglePreview={handleTogglePreview}
      />

      <div style={{ height: 'calc(100vh - 130px)', marginTop: '107px', overflow: 'hidden' }}>
        {isPreviewActive ? (
          <Preview content={state.content} />
        ) : (
          <Editor
            content={state.content}
            onChange={handleChange}
            onEditorReady={handleEditorReady}
          />
        )}
      </div>

      {isHydrated && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
          <StatusBar stats={statusBarStats} />
        </div>
      )}

      <ImageInsertModal
        isOpen={isImageModalOpen}
        onInsert={handleImageInsert}
        onCancel={() => setIsImageModalOpen(false)}
      />
    </div>
  );
}
