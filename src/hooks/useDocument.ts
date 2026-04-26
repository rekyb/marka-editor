'use client';

import { useState, useEffect, useCallback } from 'react';
import { DocumentState } from '@/types/editor';

const STORAGE_KEY = 'markdown-editor-document';

export function useDocument(initialFileName = 'untitled.md') {
  const [state, setState] = useState<DocumentState>({
    content: '',
    fileName: initialFileName,
    isDirty: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(parsed);
      } catch {
        // Invalid JSON, start fresh
      }
    }
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setContent = useCallback((content: string) => {
    setState((prev) => ({
      ...prev,
      content,
      isDirty: true,
    }));
  }, []);

  const setFileName = useCallback((fileName: string) => {
    setState((prev) => ({
      ...prev,
      fileName,
      isDirty: true,
    }));
  }, []);

  const markClean = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDirty: false,
    }));
  }, []);

  const markDirty = useCallback(() => {
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
