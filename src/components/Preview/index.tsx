'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewProps {
  readonly content: string;
}

export function Preview({ content }: PreviewProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        overflow: 'auto',
        padding: '24px',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#0a0a0a',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e5e5e5',
      }}
    >
      {content.trim() === '' ? (
        <div style={{ color: '#6b6b6b', fontStyle: 'italic' }}>
          Start typing markdown to see preview here...
        </div>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                {...props}
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  marginTop: '20px',
                  marginBottom: '12px',
                }}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginTop: '16px',
                  marginBottom: '10px',
                }}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                {...props}
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  marginTop: '12px',
                  marginBottom: '8px',
                }}
              />
            ),
            p: ({ node, ...props }) => <p {...props} style={{ marginBottom: '12px' }} />,
            ul: ({ node, ...props }) => (
              <ul {...props} style={{ marginLeft: '20px', marginBottom: '12px' }} />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} style={{ marginLeft: '20px', marginBottom: '12px' }} />
            ),
            code: ({ node, inline, className, children, ...props }: any) => {
              const language = className?.replace('language-', '') || 'text';
              const codeString = String(children).replace(/\n$/, '');

              if (inline) {
                return (
                  <code
                    {...props}
                    style={{
                      backgroundColor: '#f0f0f0',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-jetbrains-mono)',
                    }}
                  >
                    {codeString}
                  </code>
                );
              }

              return (
                <SyntaxHighlighter
                  language={language}
                  style={vs}
                  customStyle={{
                    borderRadius: '4px',
                    padding: '12px',
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: '14px',
                    margin: '0 0 12px 0',
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                style={{
                  borderLeft: '3px solid #6366f1',
                  paddingLeft: '12px',
                  marginLeft: 0,
                  marginBottom: '12px',
                  color: '#6b6b6b',
                }}
              />
            ),
            a: ({ node, ...props }) => (
              <a
                {...props}
                style={{
                  color: '#6366f1',
                  textDecoration: 'underline',
                }}
              />
            ),
            table: ({ node, ...props }) => (
              <table
                {...props}
                style={{
                  borderCollapse: 'collapse',
                  marginBottom: '12px',
                  width: 'auto',
                }}
              />
            ),
            thead: ({ node, ...props }) => <thead {...props} />,
            tbody: ({ node, ...props }) => <tbody {...props} />,
            tr: ({ node, ...props }) => <tr {...props} />,
            th: ({ node, ...props }) => (
              <th
                {...props}
                style={{
                  border: '1px solid #d5d5d5',
                  padding: '10px 12px',
                  textAlign: 'left',
                  backgroundColor: '#f5f5f5',
                  fontWeight: 600,
                }}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                {...props}
                style={{
                  border: '1px solid #d5d5d5',
                  padding: '10px 12px',
                }}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
}
