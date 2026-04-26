'use client';

import {
  Bold, Italic, Code, Link, Image, Heading1, Heading2, Heading3,
  List, ListOrdered, FileCode, Quote, Minus, Table,
  Undo2, Redo2, Braces, FileText,
} from 'lucide-react';
import { FormattingCommand } from '@/types/editor';

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

const buttonBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '3px',
  border: '1px solid #d5d5d5',
  backgroundColor: '#f9f9f9',
  color: '#0a0a0a',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',
  flexShrink: 0,
};

function onEnter(e: React.MouseEvent<HTMLButtonElement>): void {
  e.currentTarget.style.backgroundColor = '#f0f0f0';
  e.currentTarget.style.borderColor = '#b0b0b0';
}

function onLeave(e: React.MouseEvent<HTMLButtonElement>): void {
  e.currentTarget.style.backgroundColor = '#f9f9f9';
  e.currentTarget.style.borderColor = '#d5d5d5';
}

const divider = (
  <div style={{ width: '1px', height: '20px', backgroundColor: '#e5e5e5', margin: '0 2px', flexShrink: 0 }} />
);

export function Toolbar({ onCommand, canUndo, canRedo, onUndo, onRedo, isPreviewActive, onTogglePreview }: ToolbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '3px',
        padding: '6px 12px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {COMMAND_BUTTONS.map(({ command, icon: Icon, title }) => (
        <button
          key={command}
          onClick={() => { onCommand(command); }}
          title={title}
          style={buttonBase}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <Icon size={15} />
        </button>
      ))}

      {divider}

      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        style={{
          ...buttonBase,
          backgroundColor: canUndo ? '#f9f9f9' : '#f5f5f5',
          color: canUndo ? '#0a0a0a' : '#b0b0b0',
          cursor: canUndo ? 'pointer' : 'not-allowed',
        }}
        onMouseEnter={(e) => { if (canUndo) onEnter(e); }}
        onMouseLeave={(e) => { if (canUndo) onLeave(e); }}
      >
        <Undo2 size={15} />
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        style={{
          ...buttonBase,
          backgroundColor: canRedo ? '#f9f9f9' : '#f5f5f5',
          color: canRedo ? '#0a0a0a' : '#b0b0b0',
          cursor: canRedo ? 'pointer' : 'not-allowed',
        }}
        onMouseEnter={(e) => { if (canRedo) onEnter(e); }}
        onMouseLeave={(e) => { if (canRedo) onLeave(e); }}
      >
        <Redo2 size={15} />
      </button>

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: 'flex',
          backgroundColor: '#e5e5e5',
          borderRadius: '4px',
          padding: '2px',
          gap: '2px',
        }}
      >
        <button
          onClick={onTogglePreview}
          title="Syntax mode"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '3px',
            border: 'none',
            backgroundColor: !isPreviewActive ? '#6366f1' : 'transparent',
            color: !isPreviewActive ? '#ffffff' : '#0a0a0a',
            cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (isPreviewActive) {
              e.currentTarget.style.backgroundColor = '#d0d0d0';
            }
          }}
          onMouseLeave={(e) => {
            if (isPreviewActive) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <Braces size={14} />
          Syntax
        </button>

        <button
          onClick={onTogglePreview}
          title="Formatted mode"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '3px',
            border: 'none',
            backgroundColor: isPreviewActive ? '#6366f1' : 'transparent',
            color: isPreviewActive ? '#ffffff' : '#0a0a0a',
            cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isPreviewActive) {
              e.currentTarget.style.backgroundColor = '#d0d0d0';
            }
          }}
          onMouseLeave={(e) => {
            if (!isPreviewActive) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <FileText size={14} />
          Formatted
        </button>
      </div>
    </div>
  );
}
