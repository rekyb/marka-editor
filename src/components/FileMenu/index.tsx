'use client';

import { useState } from 'react';
import { FolderOpen, Download, Clock } from 'lucide-react';
import { RecentFile } from '@/types/editor';

interface FileMenuProps {
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
          style={buttonBase}
          title="Recent Files"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
        >
          <Clock size={16} />
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
              minWidth: '280px',
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
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'left',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      transition: 'background-color 0.15s',
                      alignItems: 'flex-start',
                      gap: '4px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    title={file.name}
                  >
                    <span style={{ fontSize: '12px', color: '#0a0a0a', fontWeight: 500 }}>
                      {truncateName(file.name)}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#999' }}>
                      <span>Local File</span>
                      <span>•</span>
                      <span>{formatTime(file.timestamp)}</span>
                    </div>
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
