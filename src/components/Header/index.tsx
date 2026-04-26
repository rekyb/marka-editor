'use client';

import { Toolbar } from '@/components/Toolbar';
import { FileMenu } from '@/components/FileMenu';
import { FormattingCommand, RecentFile } from '@/types/editor';

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
}: HeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '65px',
          padding: '0 16px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          color: '#0a0a0a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/icon.svg" width={32} height={32} alt="" style={{ marginRight: '10px', flexShrink: 0 }} />
        </div>
        <FileMenu
          fileName={fileName}
          isDirty={isDirty}
          onOpenFile={onOpenFile}
          onSaveFile={onSaveFile}
          recentFiles={recentFiles}
          onLoadRecentFile={onLoadRecentFile}
          onClearRecents={onClearRecents}
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
