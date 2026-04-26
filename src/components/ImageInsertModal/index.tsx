'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ImageInsertModalProps {
  readonly isOpen: boolean;
  readonly onInsert: (altText: string, url: string) => void;
  readonly onCancel: () => void;
}

export function ImageInsertModal({ isOpen, onInsert, onCancel }: ImageInsertModalProps) {
  const [altText, setAltText] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleInsert = (): void => {
    onInsert(altText || 'image', url || '');
    setAltText('');
    setUrl('');
  };

  const handleCancel = (): void => {
    setAltText('');
    setUrl('');
    onCancel();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '24px',
          width: '90%',
          maxWidth: '500px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              margin: 0,
              color: '#0a0a0a',
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}
          >
            Insert Image
          </h2>
          <button
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              color: '#6b6b6b',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '6px',
              color: '#0a0a0a',
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}
          >
            Alt Text
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the image"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d5d5d5',
              borderRadius: '4px',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '6px',
              color: '#0a0a0a',
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}
          >
            Image URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d5d5d5',
              borderRadius: '4px',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {url && (
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#6b6b6b',
                margin: '0 0 8px 0',
                fontFamily: 'var(--font-dm-sans), sans-serif',
              }}
            >
              Preview
            </p>
            <img
              src={url}
              alt={altText || 'preview'}
              style={{
                maxWidth: '100%',
                maxHeight: '150px',
                borderRadius: '4px',
              }}
              onError={() => {
                // Silently ignore broken images
              }}
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={handleCancel}
            style={{
              padding: '10px 16px',
              border: '1px solid #d5d5d5',
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0a0a0a',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            style={{
              padding: '10px 16px',
              border: 'none',
              backgroundColor: '#6366f1',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#ffffff',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6366f1';
            }}
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}
