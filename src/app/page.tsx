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
import { useDarkMode } from '@/hooks/useDarkMode';
import { applyFormatting } from '@/utils/markdown-commands';
import { FormattingCommand } from '@/types/editor';
import styles from './page.module.css';

export default function EditorLayout() {
  const { state, setContent, setFileName, markClean } = useDocument();
  const statusBarStats = useStatusBar(state.content);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
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
      className={styles.root}
    >
      {isDragging && (
        <div className={styles.dragOverlay}>
          <div className={styles.dragContent}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              className={styles.dragIcon}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <h2 className={styles.dragTitle}>Drop your file here</h2>
            <p className={styles.dragSubtitle}>
              Markdown files (.md, .markdown, .txt)
            </p>
          </div>
        </div>
      )}
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
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className={styles.mainContent}>
        {isPreviewActive ? (
          <Preview content={state.content} />
        ) : (
          <Editor
            content={state.content}
            onChange={handleChange}
            onEditorReady={handleEditorReady}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {isHydrated && (
        <div className={styles.statusBarWrapper}>
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
