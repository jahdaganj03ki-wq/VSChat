/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/webview/**/*.{ts,tsx}', './src/webview/index.html'],
  theme: {
    extend: {
      colors: {
        'apex-plan': '#3b82f6',
        'apex-code': '#22c55e',
        'apex-surface': 'var(--vscode-editor-background)',
        'apex-text': 'var(--vscode-editor-foreground)',
      },
    },
  },
  plugins: [],
};
