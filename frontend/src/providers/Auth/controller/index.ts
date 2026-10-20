import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { supabase, authRedirectUrl } from '@/lib/supabase';
import { authApi } from '../api';
import { User, SocialAccount, AuthContextType, AuthResult } from '../types';
import { activeLocale } from '@/i18n/active';
import { translate } from '@/i18n/translate';
import { messages, type MessageKey } from '@/i18n/messages';

const tr = (key: MessageKey) => translate(messages[activeLocale()], messages.en, activeLocale(), key);

/** Supabase answers in English; the common cases get a translated message. */
const SUPABASE_ERRORS: [RegExp, MessageKey][] = [
  [/invalid login credentials/i, 'auth.errors.invalidCredentials'],
  [/email not confirmed/i, 'auth.errors.notConfirmed'],
  [/rate limit|too many requests|security purposes/i, 'auth.errors.rateLimited'],
  [/password should be|weak password/i, 'auth.errors.weakPassword'],
  [/already registered|already exists/i, 'auth.errors.exists'],
];

const failure = (error: unknown, fallback: MessageKey): AuthResult => {
  const message = error instanceof Error ? error.message : '';
  const known = SUPABASE_ERRORS.find(([pattern]) => pattern.test(message));
  return { success: false, error: known ? tr(known[1]) : message || tr(fallback) };
};

export function useAuthController(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [activeSocialAccount, setActiveSocialAccount] =
    useState<SocialAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Supabase user whose profile is loaded; token refreshes don't refetch it
  const loadedAuthUserId = useRef<string | null>(null);

  useEffect(() => {
    const clearUser = () => {
      loadedAuthUserId.current = null;
      setUser(null);
      setSocialAccounts([]);
      setActiveSocialAccount(null);
      setIsLoading(false);
    };

    const loadProfile = async (session: Session) => {
      if (loadedAuthUserId.current === session.user.id) return;
      loadedAuthUserId.current = session.user.id;
      setIsLoading(true);
      try {
        // The backend creates the profile on the first authenticated request
        const { user } = await authApi.me();
        sessionStorage.removeItem('wgv_restricted_reload');
        setUser(user);
        const accounts = user.socialAccounts ?? [];
        setSocialAccounts(accounts);
        setActiveSocialAccount(accounts.find((acc) => acc.isActive) || accounts[0] || null);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load profile:', error);
        clearUser();
      }
    };

    // Fires INITIAL_SESSION on subscribe, then on every sign in / out
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // Supabase advises not to call its API inside this callback directly
      setTimeout(() => {
        if (session) loadProfile(session);
        else clearUser();
      }, 0);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const refreshUser = async () => {
    try {
      const { user } = await authApi.me();
      setUser(user);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return failure(error, 'auth.errors.loginFailed');
    return { success: true };
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    name?: string,
  ): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: authRedirectUrl('/auth/callback'),
        data: { full_name: name, username: username.toLowerCase() },
      },
    });
    if (error) return failure(error, 'auth.errors.registerFailed');
    // Supabase hides existing emails by returning a user without identities
    if (data.user && data.user.identities?.length === 0) {
      return {
        success: false,
        error: tr('auth.errors.exists'),
      };
    }
    return { success: true, needsConfirmation: !data.session };
  };

  const loginWithGoogle = async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: authRedirectUrl('/auth/callback') },
    });
    if (error) return failure(error, 'auth.errors.googleFailed');
    return { success: true };
  };

  const requestPasswordReset = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: authRedirectUrl('/auth/reset-password'),
    });
    if (error) return failure(error, 'auth.errors.resetFailed');
    return { success: true };
  };

  const updatePassword = async (password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return failure(error, 'auth.errors.updateFailed');
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const switchAccount = (accountId: string) => {
    const updatedAccounts = socialAccounts.map((acc) => ({
      ...acc,
      isActive: acc.id === accountId,
    }));

    setSocialAccounts(updatedAccounts);
    const newActive = updatedAccounts.find((acc) => acc.id === accountId);
    setActiveSocialAccount(newActive || null);
    if (user) {
      localStorage.setItem(
        `social_accounts_${user.id}`,
        JSON.stringify(updatedAccounts),
      );
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    loginWithGoogle,
    requestPasswordReset,
    updatePassword,
    logout,
    refreshUser,
    activeSocialAccount,
    socialAccounts,
    switchAccount,
  };
}
