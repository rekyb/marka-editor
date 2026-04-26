'use client';

import { useMemo } from 'react';

export interface StatusBarStats {
  readonly wordCount: number;
  readonly characterCount: number;
  readonly lineCount: number;
  readonly fileSize: number;
}

export function useStatusBar(content: string): StatusBarStats {
  return useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean);
    const wordCount = content.trim() === '' ? 0 : words.length;

    const characterCount = content.replace(/\s/g, '').length;

    const lines = content.split('\n');
    const lineCount = content === '' ? 0 : lines.length;

    const fileSize = new Blob([content]).size;

    return {
      wordCount,
      characterCount,
      lineCount,
      fileSize,
    };
  }, [content]);
}
