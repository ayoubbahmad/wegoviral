'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuthController } from './controller';
import { AuthContextType } from './types';

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
