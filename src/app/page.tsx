'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
import { useFileIO } from '@/hooks/useFileIO';
import { applyFormatting } from '@/utils/markdown-commands';
import { FormattingCommand } from '@/types/editor';

export default function EditorLayout() {
  const { state, setContent, setFileName, markClean } = useDocument();
  const statusBarStats = useStatusBar(state.content);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const editorViewRef = useRef<EditorView | null>(null);

  const handleFileLoaded = useCallback(
    (content: string, fileName: string): void => {
      setContent(content);
      setFileName(fileName);
      markClean();
    },
    [setContent, setFileName, markClean],
  );

  const fileIO = useFileIO({
    onFileLoaded: handleFileLoaded,
  });

  const handleSaveFile = useCallback((): void => {
    fileIO.saveFile(state.fileName, state.content);
    markClean();
  }, [fileIO, state.fileName, state.content, markClean]);

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

  useEffect(() => {
    const cancel = (): void => {
      setIsDragging(false);
    };
    // Catches drops outside our container (browser handles file, overlay stays otherwise)
    document.addEventListener('drop', cancel);
    // Catches tab/window switch mid-drag
    window.addEventListener('blur', cancel);
    return () => {
      document.removeEventListener('drop', cancel);
      window.removeEventListener('blur', cancel);
    };
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    // relatedTarget is where the cursor moved TO — if outside the container, drag has left
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDropFile = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validExtensions = ['.md', '.markdown', '.txt'];
    const isValidType = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isValidType) {
      console.warn('Only markdown files are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      const content = event.target?.result as string;
      handleFileLoaded(content, file.name);
    };
    reader.onerror = (): void => {
      console.error('Failed to read dropped file');
    };
    reader.readAsText(file);
  }, [handleFileLoaded]);

  return (
    <div
      onDrop={handleDropFile}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#fafafa',
        position: 'relative',
      }}
    >
      {isDragging && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
              borderRadius: '12px',
              border: '3px dashed rgba(255, 255, 255, 0.6)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              minWidth: '320px',
              minHeight: '320px',
              textAlign: 'center',
              animation: 'scaleIn 0.3s ease',
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              style={{ marginBottom: '16px' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#fff',
                margin: '0 0 8px 0',
              }}
            >
              Drop your file here
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#fff',
                margin: 0,
              }}
            >
              Markdown files (.md, .markdown, .txt)
            </p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <Header
        fileName={isHydrated ? state.fileName : 'untitled.md'}
        isDirty={isHydrated ? state.isDirty : false}
        onCommand={handleCommand}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isPreviewActive={isPreviewActive}
        onTogglePreview={handleTogglePreview}
        onOpenFile={fileIO.openFile}
        onSaveFile={handleSaveFile}
        recentFiles={fileIO.recentFiles}
        onLoadRecentFile={fileIO.loadRecentFile}
        onClearRecents={fileIO.clearRecentFiles}
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
