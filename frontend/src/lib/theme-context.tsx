'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const defaultContext: ThemeContextType = {
  theme: 'system',
  setTheme: () => {},
  isLoading: true,
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = (savedTheme || 'system') as Theme;
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setIsLoading(false);
  }, []);

  const applyTheme = useCallback((newTheme: Theme) => {
    const htmlElement = document.documentElement;

    if (newTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else if (newTheme === 'light') {
      htmlElement.classList.remove('dark');
    } else {
      // system: respect OS preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    }
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    },
    [applyTheme],
  );

  // Listen for system theme changes when theme is "system"
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
