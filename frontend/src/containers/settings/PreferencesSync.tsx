'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import { useAuth } from '@/providers/Auth';
import { useTheme } from '@/providers/Theme';

/**
 * Applies the member's saved preferences: their theme when they sign in (e.g. on a new device),
 * and reduced motion everywhere (framer-motion animations and CSS transitions).
 */
export function PreferencesSync({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const syncedFor = useRef<string | null>(null);
  const reducedMotion = Boolean(user?.preferences?.reducedMotion);

  useEffect(() => {
    if (!user || syncedFor.current === user.id) return;
    syncedFor.current = user.id;
    const saved = user.preferences?.theme;
    if (saved && saved !== theme) setTheme(saved);
  }, [user, theme, setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  return <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>{children}</MotionConfig>;
}
