'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuthController } from './controller';
import { AuthContextType } from './types';
import type { Permission } from '@/lib/roles';

export * from './types';

const defaultContext: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  requestPasswordReset: async () => ({ success: false }),
  updatePassword: async () => ({ success: false }),
  logout: () => {},
  refreshUser: async () => {},
  activeSocialAccount: null,
  socialAccounts: [],
  switchAccount: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthController();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/** Permission check for hiding UI the user can't use (the API enforces it too). */
export function useCan() {
  const { user } = useContext(AuthContext);
  return (permission: Permission) => Boolean(user?.permissions.includes(permission));
}

/** Re-reads the profile, e.g. after applying or accepting the rules. */
export function useRefreshUser() {
  return useContext(AuthContext).refreshUser;
}
