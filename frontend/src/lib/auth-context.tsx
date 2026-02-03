"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "./api-client";

interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
}

interface SocialAccount {
    id: string;
    platform: string;
    username: string;
    avatarUrl?: string;
    isActive: boolean;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, username: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    activeSocialAccount: SocialAccount | null;
    socialAccounts: SocialAccount[];
    switchAccount: (accountId: string) => void;
}

const defaultContext: AuthContextType = {
    user: null,
    isLoading: true,
    login: async () => ({ success: false }),
    register: async () => ({ success: false }),
    logout: () => { },
    activeSocialAccount: null,
    socialAccounts: [],
    switchAccount: () => { },
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
    const [activeSocialAccount, setActiveSocialAccount] = useState<SocialAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("creator_os_token");
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const data = await apiFetch("/auth/me");
            setUser(data.user);

            // Mock social accounts migration - for now we still handle it in local storage
            // In a real app, these would come from the backend linked to the user
            const storedAccounts = localStorage.getItem(`social_accounts_${data.user.id}`);
            if (storedAccounts) {
                const accounts = JSON.parse(storedAccounts);
                setSocialAccounts(accounts);
                const active = accounts.find((acc: SocialAccount) => acc.isActive);
                setActiveSocialAccount(active || null);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            localStorage.removeItem("creator_os_token");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email: string, password: string) => {
        try {
            const data = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            localStorage.setItem("creator_os_token", data.token);
            setUser(data.user);
            router.push("/performance"); // Redirect to dashboard
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const register = async (email: string, username: string, password: string, name?: string) => {
        try {
            const data = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, username, password, name }),
            });

            localStorage.setItem("creator_os_token", data.token);
            setUser(data.user);
            router.push("/performance"); // Redirect to dashboard
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setSocialAccounts([]);
        setActiveSocialAccount(null);
        localStorage.removeItem("creator_os_token");
        router.push("/login");
    };

    const switchAccount = (accountId: string) => {
        const updatedAccounts = socialAccounts.map(acc => ({
            ...acc,
            isActive: acc.id === accountId
        }));

        setSocialAccounts(updatedAccounts);
        const newActive = updatedAccounts.find(acc => acc.id === accountId);
        setActiveSocialAccount(newActive || null);
        if (user) {
            localStorage.setItem(`social_accounts_${user.id}`, JSON.stringify(updatedAccounts));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            register,
            logout,
            activeSocialAccount,
            socialAccounts,
            switchAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
