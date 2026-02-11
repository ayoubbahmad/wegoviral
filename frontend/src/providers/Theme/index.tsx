'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useThemeController } from './controller';
import { ThemeContextType } from './types';

export * from './types';

const defaultContext: ThemeContextType = {
  theme: 'system',
  setTheme: () => {},
  isLoading: true,
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeContext = useThemeController();

  return (
    <ThemeContext.Provider value={themeContext}>
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
