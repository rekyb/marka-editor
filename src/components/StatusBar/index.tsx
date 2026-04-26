'use client';

import { StatusBarStats } from '@/hooks/useStatusBar';
import { APP_NAME, APP_VERSION } from '@/constants';

interface StatusBarProps {
  readonly stats: StatusBarStats;
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

export function StatusBar({ stats }: StatusBarProps) {
  const sep = <span style={{ color: '#e8e8ec' }}>·</span>;
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{APP_NAME}</span>
        {sep}
        <span>v<strong>{APP_VERSION}</strong></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>Lines: <strong>{stats.lineCount}</strong></span>
        {sep}
        <span>Characters: <strong>{stats.characterCount}</strong></span>
        {sep}
        <span>File size: <strong>{formatFileSize(stats.fileSize)}</strong></span>
      </div>
    </footer>
  );
}
