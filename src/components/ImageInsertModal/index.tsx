'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './ImageInsertModal.module.css';

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
    <div className={styles.backdrop} onClick={handleCancel}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Insert Image</h2>
          <button onClick={handleCancel} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Alt Text</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the image"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Image URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={styles.input}
          />
        </div>

        {url && (
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)', margin: '0 0 8px 0' }}>
              Preview
            </p>
            <img
              src={url}
              alt={altText || 'preview'}
              style={{
                maxWidth: '100%',
                maxHeight: '150px',
                borderRadius: 'var(--radius-sm)',
              }}
              onError={() => {
                // Silently ignore broken images
              }}
            />
          </div>
        )}

        <div className={styles.buttons}>
          <button onClick={handleCancel} className={`${styles.button} ${styles.cancelButton}`}>
            Cancel
          </button>
          <button onClick={handleInsert} className={`${styles.button} ${styles.insertButton}`}>
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}
