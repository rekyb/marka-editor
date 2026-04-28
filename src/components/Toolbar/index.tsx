'use client';

import {
  Bold, Italic, Code, Link, Image, Heading1, Heading2, Heading3,
  List, ListOrdered, FileCode, Quote, Minus, Table,
  Undo2, Redo2, Braces, FileText,
} from 'lucide-react';
import { IconButton } from '@/components/IconButton';
import { FormattingCommand } from '@/types/editor';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  readonly onCommand: (command: FormattingCommand) => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
  readonly isPreviewActive: boolean;
  readonly onTogglePreview: () => void;
}

const COMMAND_BUTTONS: ReadonlyArray<{
  readonly command: FormattingCommand;
  readonly icon: React.ElementType;
  readonly title: string;
}> = [
  { command: 'bold',          icon: Bold,        title: 'Bold' },
  { command: 'italic',        icon: Italic,      title: 'Italic' },
  { command: 'code',          icon: Code,        title: 'Inline Code' },
  { command: 'link',          icon: Link,        title: 'Insert Link' },
  { command: 'image',         icon: Image,       title: 'Insert Image' },
  { command: 'heading1',      icon: Heading1,    title: 'Heading 1' },
  { command: 'heading2',      icon: Heading2,    title: 'Heading 2' },
  { command: 'heading3',      icon: Heading3,    title: 'Heading 3' },
  { command: 'bulletList',    icon: List,        title: 'Bullet List' },
  { command: 'orderedList',   icon: ListOrdered, title: 'Ordered List' },
  { command: 'codeBlock',     icon: FileCode,    title: 'Code Block' },
  { command: 'quote',         icon: Quote,       title: 'Block Quote' },
  { command: 'horizontalRule',icon: Minus,       title: 'Horizontal Rule' },
  { command: 'table',         icon: Table,       title: 'Insert Table' },
];

export function Toolbar({ onCommand, canUndo, canRedo, onUndo, onRedo, isPreviewActive, onTogglePreview }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {COMMAND_BUTTONS.map(({ command, icon: Icon, title }) => (
        <IconButton
          key={command}
          icon={Icon}
          ariaLabel={title}
          disabled={isPreviewActive}
          title={isPreviewActive ? `${title} (disabled in formatted mode)` : title}
          onClick={() => { if (!isPreviewActive) onCommand(command); }}
          size="sm"
        />
      ))}

      <div className={styles.divider} />

      <IconButton
        icon={Undo2}
        ariaLabel="Undo"
        disabled={!canUndo || isPreviewActive}
        title={isPreviewActive ? 'Undo (disabled in formatted mode)' : 'Undo (Ctrl+Z)'}
        onClick={onUndo}
        size="sm"
      />

      <IconButton
        icon={Redo2}
        ariaLabel="Redo"
        disabled={!canRedo || isPreviewActive}
        title={isPreviewActive ? 'Redo (disabled in formatted mode)' : 'Redo (Ctrl+Y)'}
        onClick={onRedo}
        size="sm"
      />

      <div className={styles.spacer} />

      <div className={styles.toggleGroup}>
        <button
          onClick={onTogglePreview}
          title="Formatted mode"
          className={`${styles.toggleButton} ${isPreviewActive ? styles.active : ''}`}
        >
          <FileText size={14} />
          Formatted
        </button>

        <button
          onClick={onTogglePreview}
          title="Syntax mode"
          className={`${styles.toggleButton} ${!isPreviewActive ? styles.active : ''}`}
        >
          <Braces size={14} />
          Syntax
        </button>
      </div>
    </div>
  );
}
