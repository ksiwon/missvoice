// src/styles/theme.ts
import { ThemeType } from '../types';

export const theme: ThemeType = {
  colors: {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    accent: '#06b6d4', // Cyan
    background: '#0f172a', // Dark slate
    surface: '#1e293b', // Slate 800
    text: {
      primary: '#f8fafc', // Slate 50
      secondary: '#cbd5e1', // Slate 300
      accent: '#06b6d4', // Cyan
    },
    border: '#334155', // Slate 700
    error: '#ef4444', // Red 500
    success: '#10b981', // Emerald 500
    warning: '#f59e0b', // Amber 500
  },
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    secondary: "'Poppins', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
  },
};