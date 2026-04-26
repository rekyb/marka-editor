'use client';

import { StatusBarStats } from '@/hooks/useStatusBar';

interface StatusBarProps {
  readonly stats: StatusBarStats;
  readonly fileName: string;
  readonly isDirty: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const size = (bytes / Math.pow(1024, exponent)).toFixed(1);
  return `${size} ${units[exponent]}`;
}

export function StatusBar({ stats, fileName, isDirty }: StatusBarProps) {
  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '40px',
        paddingRight: '16px',
        paddingLeft: '16px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e8e8ec',
        fontFamily: 'var(--font-dm-sans), monospace',
        fontSize: '12px',
        color: '#6b6b6b',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{fileName}</span>
        {isDirty && (
          <span style={{ color: '#6366f1', fontWeight: 'bold' }}>●</span>
        )}
        <span style={{ color: '#e8e8ec' }}>|</span>
        <span>{formatFileSize(stats.fileSize)}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>
          Words: <strong>{stats.wordCount}</strong>
        </span>
        <span style={{ color: '#e8e8ec' }}>·</span>
        <span>
          Lines: <strong>{stats.lineCount}</strong>
        </span>
        <span style={{ color: '#e8e8ec' }}>·</span>
        <span>
          Characters: <strong>{stats.characterCount}</strong>
        </span>
      </div>
    </footer>
  );
}
