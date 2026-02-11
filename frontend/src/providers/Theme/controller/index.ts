import { useState, useEffect, useCallback } from 'react';
import { Theme, ThemeContextType } from '../types';

export function useThemeController(): ThemeContextType {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isLoading, setIsLoading] = useState(true);

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

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = (savedTheme || 'system') as Theme;
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setIsLoading(false);
  }, [applyTheme]);

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

  return {
    theme,
    setTheme,
    isLoading,
  };
}
