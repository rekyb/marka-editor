'use client';

import { StatusBarStats } from '@/hooks/useStatusBar';
import { APP_NAME, APP_VERSION } from '@/constants';
import styles from './StatusBar.module.css';

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
  const sep = <span className={styles.separator}>·</span>;
  return (
    <footer className={styles.statusBar}>
      <div className={styles.left}>
        <span>{APP_NAME}</span>
        {sep}
        <span>v<strong>{APP_VERSION}</strong></span>
      </div>
      <div className={styles.right}>
        <span>Lines: <strong>{stats.lineCount}</strong></span>
        {sep}
        <span>Characters: <strong>{stats.characterCount}</strong></span>
        {sep}
        <span>File size: <strong>{formatFileSize(stats.fileSize)}</strong></span>
      </div>
    </footer>
  );
}
