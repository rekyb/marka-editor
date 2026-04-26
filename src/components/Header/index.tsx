'use client';

import { Toolbar } from '@/components/Toolbar';
import { FormattingCommand } from '@/types/editor';

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
}

export function Header({ fileName, isDirty, onCommand, canUndo, canRedo, onUndo, onRedo, isPreviewActive, onTogglePreview }: HeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '48px',
          padding: '0 16px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          color: '#0a0a0a',
        }}
      >
        {fileName}
        {isDirty && <span style={{ marginLeft: '8px', color: '#6366f1' }}>●</span>}
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
