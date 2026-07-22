export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  light: {
    name: 'light',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    error: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
  },
  dark: {
    name: 'dark',
    primary: '#818CF8',
    secondary: '#A78BFA',
    accent: '#F472B6',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    error: '#F87171',
    success: '#4ADE80',
    warning: '#FBBF24',
  },
};
