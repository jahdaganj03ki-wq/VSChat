import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps): React.ReactElement {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.6, wordBreak: 'break-word' }}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (match) {
              return <CodeBlock code={codeString} language={match[1]} />;
            }

            return (
              <code
                className={className}
                {...props}
                style={{
                  background: 'var(--vscode-textCodeBlock-background)',
                  padding: '2px 4px',
                  borderRadius: 3,
                  fontSize: '0.9em',
                }}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          p({ children }) {
            return <p style={{ margin: '4px 0' }}>{children}</p>;
          },
          ul({ children }) {
            return <ul style={{ margin: '4px 0', paddingLeft: 20 }}>{children}</ul>;
          },
          ol({ children }) {
            return <ol style={{ margin: '4px 0', paddingLeft: 20 }}>{children}</ol>;
          },
          h1({ children }) {
            return (
              <h1 style={{ fontSize: 16, fontWeight: 700, margin: '8px 0 4px' }}>{children}</h1>
            );
          },
          h2({ children }) {
            return (
              <h2 style={{ fontSize: 14, fontWeight: 600, margin: '8px 0 4px' }}>{children}</h2>
            );
          },
          h3({ children }) {
            return (
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: '6px 0 3px' }}>{children}</h3>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote
                style={{
                  borderLeft: '3px solid var(--vscode-textBlockQuote-border)',
                  padding: '4px 12px',
                  margin: '4px 0',
                  background: 'var(--vscode-textBlockQuote-background)',
                }}
              >
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
