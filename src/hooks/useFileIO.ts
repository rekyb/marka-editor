'use client';

import { useState, useEffect, useCallback } from 'react';
import { RecentFile, DocumentState } from '@/types/editor';

const RECENT_FILES_KEY = 'marka-recent-files';
const RECENT_FILE_PREFIX = 'marka-recent-file-';
const MAX_RECENT_FILES = 10;

interface UseFileIOReturn {
  readonly openFile: () => Promise<void>;
  readonly saveFile: (fileName: string, content: string) => void;
  readonly recentFiles: readonly RecentFile[];
  readonly loadRecentFile: (fileKey: string) => Promise<void>;
  readonly clearRecentFiles: () => void;
}

type FileIOCallbacks = {
  readonly onFileLoaded: (content: string, fileName: string) => void;
};

export function useFileIO(callbacks: FileIOCallbacks): UseFileIOReturn {
  const [recentFiles, setRecentFiles] = useState<readonly RecentFile[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(RECENT_FILES_KEY);
    if (stored) {
      try {
        setRecentFiles(JSON.parse(stored));
      } catch {
        setRecentFiles([]);
      }
    }
  }, []);

  const addRecentFile = useCallback((name: string, content: string): void => {
    if (typeof window === 'undefined') return;
    const key = `${Date.now()}`;
    const newFile: RecentFile = { key, name, timestamp: Date.now() };

    setRecentFiles((prev) => {
      const updated = [newFile, ...prev].slice(0, MAX_RECENT_FILES);
      localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updated));
      return updated;
    });

    localStorage.setItem(`${RECENT_FILE_PREFIX}${key}`, name);
    localStorage.setItem(`${RECENT_FILE_PREFIX}${key}-content`, content);
  }, []);

  const openFile = useCallback(async (): Promise<void> => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const content = event.target?.result as string;
        callbacks.onFileLoaded(content, file.name);
        addRecentFile(file.name, content);
      };
      reader.onerror = () => {
        console.error('Failed to read file');
      };
      reader.readAsText(file);
    };

    input.click();
  }, [callbacks, addRecentFile]);

  const saveFile = useCallback((fileName: string, content: string): void => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const loadRecentFile = useCallback(async (fileKey: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    const fileName = localStorage.getItem(`${RECENT_FILE_PREFIX}${fileKey}`);
    const content = localStorage.getItem(`${RECENT_FILE_PREFIX}${fileKey}-content`);

    if (fileName && content) {
      callbacks.onFileLoaded(content, fileName);
    }
  }, [callbacks]);

  const clearRecentFiles = useCallback((): void => {
    if (typeof window === 'undefined') return;
    recentFiles.forEach((file) => {
      localStorage.removeItem(`${RECENT_FILE_PREFIX}${file.key}`);
      localStorage.removeItem(`${RECENT_FILE_PREFIX}${file.key}-content`);
    });
    localStorage.removeItem(RECENT_FILES_KEY);
    setRecentFiles([]);
  }, [recentFiles]);

  return {
    openFile,
    saveFile,
    recentFiles,
    loadRecentFile,
    clearRecentFiles,
  };
}
