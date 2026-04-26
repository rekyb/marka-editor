'use client';

import { useState, useEffect, useCallback } from 'react';
import { DocumentState } from '@/types/editor';

const STORAGE_KEY = 'markdown-editor-document';

interface UseDocumentReturn {
  readonly state: DocumentState;
  readonly setContent: (content: string) => void;
  readonly setFileName: (fileName: string) => void;
  readonly markClean: () => void;
  readonly markDirty: () => void;
}

export function useDocument(initialFileName = 'untitled.md'): UseDocumentReturn {
  const [state, setState] = useState<DocumentState>(() => {
    if (typeof window === 'undefined') {
      return {
        content: '',
        fileName: initialFileName,
        isDirty: false,
      };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          content: '',
          fileName: initialFileName,
          isDirty: false,
        };
      }
    }
    return {
      content: '',
      fileName: initialFileName,
      isDirty: false,
    };
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const setContent = useCallback((content: string): void => {
    setState((prev) => ({
      ...prev,
      content,
      isDirty: true,
    }));
  }, []);

  const setFileName = useCallback((fileName: string): void => {
    setState((prev) => ({
      ...prev,
      fileName,
      isDirty: true,
    }));
  }, []);

  const markClean = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      isDirty: false,
    }));
  }, []);

  const markDirty = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      isDirty: true,
    }));
  }, []);

  return {
    state,
    setContent,
    setFileName,
    markClean,
    markDirty,
  };
}
