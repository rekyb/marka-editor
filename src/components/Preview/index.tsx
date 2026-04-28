'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './Preview.module.css';

interface PreviewProps {
  readonly content: string;
}

export function Preview({ content }: PreviewProps) {
  return (
    <div className={styles.preview}>
      {content.trim() === '' ? (
        <div className={styles.empty}>
          Start typing markdown to see preview here...
        </div>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 {...props} className={styles.h1} />,
            h2: ({ node, ...props }) => <h2 {...props} className={styles.h2} />,
            h3: ({ node, ...props }) => <h3 {...props} className={styles.h3} />,
            p: ({ node, ...props }) => <p {...props} className={styles.p} />,
            ul: ({ node, ...props }) => <ul {...props} className={styles.ul} />,
            ol: ({ node, ...props }) => <ol {...props} className={styles.ol} />,
            code: ({ node, inline, className, children, ...props }: any) => {
              const language = className?.replace('language-', '') || 'text';
              const codeString = String(children).replace(/\n$/, '');

              if (inline) {
                return (
                  <code {...props} className={styles.code}>
                    {codeString}
                  </code>
                );
              }

              return (
                <SyntaxHighlighter
                  language={language}
                  style={vs}
                  className={styles.codeBlock}
                >
                  {codeString}
                </SyntaxHighlighter>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote {...props} className={styles.blockquote} />
            ),
            a: ({ node, ...props }) => <a {...props} className={styles.link} />,
            table: ({ node, ...props }) => (
              <table {...props} className={styles.table} />
            ),
            thead: ({ node, ...props }) => <thead {...props} />,
            tbody: ({ node, ...props }) => <tbody {...props} />,
            tr: ({ node, ...props }) => <tr {...props} />,
            th: ({ node, ...props }) => <th {...props} className={styles.th} />,
            td: ({ node, ...props }) => <td {...props} className={styles.td} />,
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
}
