export const theme = {
  colors: {
    primary: '#6366f1',
    neutral: '#0a0a0a',
    background: '#ffffff',
    border: '#d5d5d5',
    surface: '#f9f9f9',
    surfaceHover: '#f0f0f0',
    disabled: '#b0b0b0',
    success: '#10b981',
    error: '#ef4444',
    text: {
      primary: '#0a0a0a',
      secondary: '#6b6b6b',
      disabled: '#b0b0b0',
      onPrimary: '#ffffff',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  typography: {
    button: { fontSize: '12px', fontWeight: 500, fontFamily: 'var(--font-dm-sans)' },
    label: { fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-dm-sans)' },
    body: { fontSize: '14px', fontWeight: 400, fontFamily: 'var(--font-dm-sans)' },
    small: { fontSize: '12px', fontWeight: 400, fontFamily: 'var(--font-dm-sans)' },
  },
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
  },
  borderRadius: {
    sm: '3px',
    md: '4px',
    lg: '8px',
  },
};

export type Theme = typeof theme;
