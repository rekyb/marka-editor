'use client';

import { useState } from 'react';
import { FolderOpen, Download, ChevronDown } from 'lucide-react';
import { RecentFile } from '@/types/editor';

interface FileMenuProps {
  readonly fileName: string;
  readonly isDirty: boolean;
  readonly onOpenFile: () => Promise<void>;
  readonly onSaveFile: () => void;
  readonly recentFiles: readonly RecentFile[];
  readonly onLoadRecentFile: (fileKey: string) => Promise<void>;
  readonly onClearRecents: () => void;
}

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
  fontSize: '12px',
  fontFamily: 'var(--font-dm-sans), sans-serif',
  transition: 'background-color 0.15s, border-color 0.15s',
  padding: 0,
};

export function FileMenu({
  fileName,
  isDirty,
  onOpenFile,
  onSaveFile,
  recentFiles,
  onLoadRecentFile,
  onClearRecents,
}: FileMenuProps) {
  const [isRecentOpen, setIsRecentOpen] = useState(false);

  const handleOpenClick = async (): Promise<void> => {
    await onOpenFile();
  };

  const handleSaveClick = (): void => {
    onSaveFile();
  };

  const handleRecentFileClick = async (key: string): Promise<void> => {
    await onLoadRecentFile(key);
    setIsRecentOpen(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#0a0a0a' }}>{fileName}</span>
        {isDirty && <span style={{ color: '#6366f1', fontSize: '12px' }}>●</span>}
      </div>

      <button
        onClick={handleOpenClick}
        style={buttonBase}
        title="Open File"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
      >
        <FolderOpen size={16} />
      </button>

      <button
        onClick={handleSaveClick}
        style={buttonBase}
        title="Save File"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
      >
        <Download size={16} />
      </button>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsRecentOpen(!isRecentOpen)}
          style={{
            ...buttonBase,
            width: 'auto',
            padding: '0 8px',
            backgroundColor: isRecentOpen ? '#f0f0f0' : '#f9f9f9',
          }}
          title="Recent Files"
          onMouseEnter={(e) => {
            if (!isRecentOpen) e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            if (!isRecentOpen) e.currentTarget.style.backgroundColor = '#f9f9f9';
          }}
        >
          <ChevronDown size={16} />
        </button>

        {isRecentOpen && (
          <div
            style={{
              position: 'absolute',
              top: '38px',
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid #d5d5d5',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              minWidth: '200px',
              zIndex: 100,
            }}
          >
            {recentFiles.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '12px', color: '#999' }}>
                No recent files
              </div>
            ) : (
              <>
                {recentFiles.map((file) => (
                  <button
                    key={file.key}
                    onClick={() => handleRecentFileClick(file.key)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'left',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: '#0a0a0a',
                      borderBottom: '1px solid #f0f0f0',
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {file.name}
                  </button>
                ))}
                <button
                  onClick={onClearRecents}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: '#999',
                    borderTop: '1px solid #f0f0f0',
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                  }}
                >
                  Clear Recent
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
