'use client';

import { FolderOpen, Download, Clock, Moon, Sun } from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { Menu, MenuItem } from '@/components/Menu';
import { RecentFile } from '@/types/editor';
import styles from './FileMenu.module.css';

interface FileMenuProps {
  readonly onOpenFile: () => Promise<void>;
  readonly onSaveFile: () => void;
  readonly recentFiles: readonly RecentFile[];
  readonly onLoadRecentFile: (fileKey: string) => Promise<void>;
  readonly onClearRecents: () => void;
  readonly isDarkMode: boolean;
  readonly onToggleDarkMode: () => void;
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function truncateName(name: string, maxLength: number = 35): string {
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
}

export function FileMenu({
  onOpenFile,
  onSaveFile,
  recentFiles,
  onLoadRecentFile,
  onClearRecents,
  isDarkMode,
  onToggleDarkMode,
}: FileMenuProps) {
  return (
    <div className={styles.container}>
      <IconButton
        icon={FolderOpen}
        ariaLabel="Open File"
        onClick={onOpenFile}
        size="sm"
      />

      <IconButton
        icon={Download}
        ariaLabel="Save File"
        onClick={onSaveFile}
        size="sm"
      />

      <IconButton
        icon={isDarkMode ? Sun : Moon}
        ariaLabel={isDarkMode ? 'Deactivate dark mode' : 'Activate dark mode'}
        onClick={onToggleDarkMode}
        size="sm"
      />

      <Menu
        trigger={(onClick) => (
          <IconButton
            icon={Clock}
            ariaLabel="Recent Files"
            onClick={onClick}
            size="sm"
          />
        )}
        placement="bottom"
      >
        <div className={styles.menuContent}>
          {recentFiles.length === 0 ? (
            <div className={styles.emptyState}>
              No recent files
            </div>
          ) : (
            <>
              {recentFiles.map((file) => (
                <MenuItem
                  key={file.key}
                  onClick={() => onLoadRecentFile(file.key)}
                  title={file.name}
                >
                  <div className={styles.menuItem}>
                    <span className={styles.fileName}>{truncateName(file.name)}</span>
                    <span className={styles.fileTime}>{formatTime(file.timestamp)}</span>
                  </div>
                </MenuItem>
              ))}
              <button
                onClick={onClearRecents}
                className={styles.clearButton}
              >
                Clear Recent
              </button>
            </>
          )}
        </div>
      </Menu>
    </div>
  );
}
