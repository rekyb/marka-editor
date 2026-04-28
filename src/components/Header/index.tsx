'use client';

import { Toolbar } from '@/components/Toolbar';
import { FileMenu } from '@/components/FileMenu';
import { FormattingCommand, RecentFile } from '@/types/editor';
import styles from './Header.module.css';

interface HeaderProps {
  readonly fileName: string;
  readonly isDirty: boolean;
  readonly onCommand: (command: FormattingCommand) => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
  readonly isPreviewActive: boolean;
  readonly onTogglePreview: () => void;
  readonly onOpenFile: () => Promise<void>;
  readonly onSaveFile: () => void;
  readonly recentFiles: readonly RecentFile[];
  readonly onLoadRecentFile: (fileKey: string) => Promise<void>;
  readonly onClearRecents: () => void;
  readonly isDarkMode: boolean;
  readonly onToggleDarkMode: () => void;
}

export function Header({
  fileName,
  isDirty,
  onCommand,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isPreviewActive,
  onTogglePreview,
  onOpenFile,
  onSaveFile,
  recentFiles,
  onLoadRecentFile,
  onClearRecents,
  isDarkMode,
  onToggleDarkMode,
}: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.titleSection}>
          <img src="/icon.svg" width={32} height={32} alt="" className={styles.logo} />
          <span className={styles.fileName}>{fileName}</span>
          {isDirty && <span className={styles.dirtyIndicator}>●</span>}
        </div>
        <FileMenu
          onOpenFile={onOpenFile}
          onSaveFile={onSaveFile}
          recentFiles={recentFiles}
          onLoadRecentFile={onLoadRecentFile}
          onClearRecents={onClearRecents}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
        />
      </div>

      <Toolbar
        onCommand={onCommand}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        isPreviewActive={isPreviewActive}
        onTogglePreview={onTogglePreview}
      />
    </div>
  );
}
