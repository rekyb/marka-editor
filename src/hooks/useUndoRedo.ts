'use client';

import { useState, useCallback } from 'react';
import { HistoryState } from '@/types/editor';

export function useUndoRedo(initialContent = '') {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialContent,
    future: [],
  });

  const push = useCallback((content: string) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: content,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
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

  const redo = useCallback(() => {
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
    push,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
