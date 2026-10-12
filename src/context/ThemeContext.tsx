import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'midnight' | 'espresso' | 'ivory';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  subtitle: string;
  accentLabel: string;
  primaryColor: string;
  bgColor: string;
  surfaceColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
}

export const THEME_CONFIGS: Record<ThemeMode, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Black',
    subtitle: 'Charcoal & Copper',
    accentLabel: 'Copper Accent',
    primaryColor: '#d97736',
    bgColor: '#0a0c10',
    surfaceColor: '#131722',
    borderColor: '#232a38',
    textColor: '#f5f6f8',
    icon: '🌙',
  },
  espresso: {
    id: 'espresso',
    name: 'Espresso Brown',
    subtitle: 'Deep Coffee & Bronze',
    accentLabel: 'Bronze Accent',
    primaryColor: '#c88f54',
    bgColor: '#100c09',
    surfaceColor: '#19130f',
    borderColor: '#362920',
    textColor: '#f7f1e8',
    icon: '☕',
  },
  ivory: {
    id: 'ivory',
    name: 'Warm Ivory',
    subtitle: 'Warm Canvas & Cognac',
    accentLabel: 'Cognac Accent',
    primaryColor: '#9c5222',
    bgColor: '#faf7f2',
    surfaceColor: '#ffffff',
    borderColor: '#ded4c5',
    textColor: '#1f1c19',
    icon: '📜',
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  config: ThemeConfig;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'mentora_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved && (saved === 'midnight' || saved === 'espresso' || saved === 'ivory')) {
        return saved;
      }
    } catch {
      // LocalStorage fallback
    }
    return 'midnight';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // LocalStorage fallback
    }
  };

  useEffect(() => {
    // Apply data-theme attribute on root and body
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    if (theme === 'ivory') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    config: THEME_CONFIGS[theme],
    availableThemes: Object.values(THEME_CONFIGS),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
