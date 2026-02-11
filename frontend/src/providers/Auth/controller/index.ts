import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../api';
import { User, SocialAccount, AuthContextType } from '../types';

export function useAuthController(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [activeSocialAccount, setActiveSocialAccount] =
    useState<SocialAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('creator_os_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.me();
      const user = data.user;
      setUser(user);

      if (user.socialAccounts && user.socialAccounts.length > 0) {
        setSocialAccounts(user.socialAccounts);
        const active =
          user.socialAccounts.find((acc) => acc.isActive) ||
          user.socialAccounts[0];
        setActiveSocialAccount(active);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('creator_os_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });

      localStorage.setItem('creator_os_token', data.token);
      const user = data.user;
      setUser(user);

      if (user.socialAccounts && user.socialAccounts.length > 0) {
        setSocialAccounts(user.socialAccounts);
        const active =
          user.socialAccounts.find((acc) => acc.isActive) ||
          user.socialAccounts[0];
        setActiveSocialAccount(active);
      }

      router.push('/home');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    name?: string,
  ) => {
    try {
      const data = await authApi.register({ email, username, password, name });

      localStorage.setItem('creator_os_token', data.token);
      const user = data.user;
      setUser(user);

      if (user.socialAccounts && user.socialAccounts.length > 0) {
        setSocialAccounts(user.socialAccounts);
        const active =
          user.socialAccounts.find((acc) => acc.isActive) ||
          user.socialAccounts[0];
        setActiveSocialAccount(active);
      }

      router.push('/home');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setSocialAccounts([]);
    setActiveSocialAccount(null);
    localStorage.removeItem('creator_os_token');
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
    logout,
    activeSocialAccount,
    socialAccounts,
    switchAccount,
  };
}
