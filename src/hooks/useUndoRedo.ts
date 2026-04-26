'use client';

import { useState, useCallback } from 'react';
import { HistoryState } from '@/types/editor';

interface UseUndoRedoReturn {
  readonly content: string;
  readonly record: (content: string) => void;
  readonly undo: () => void;
  readonly redo: () => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

export function useUndoRedo(initialContent = ''): UseUndoRedoReturn {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialContent,
    future: [],
  });

  const record = useCallback((content: string): void => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: content,
      future: [],
    }));
  }, []);

  const undo = useCallback((): void => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = prev.past.slice(0, -1);
      const newPresent = prev.past[prev.past.length - 1];
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback((): void => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const newPresent = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  return {
    content: history.present,
    record,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
