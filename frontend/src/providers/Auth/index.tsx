"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { AuthContextType, User, SocialAccount } from "./types";

export * from "./types";

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
            const data: any = await apiClient.get("/auth/me");
            const user = data.user;
            setUser(user);

            if (user.socialAccounts && user.socialAccounts.length > 0) {
                setSocialAccounts(user.socialAccounts);
                const active = user.socialAccounts.find((acc: SocialAccount) => acc.isActive) || user.socialAccounts[0];
                setActiveSocialAccount(active);
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
            const data: any = await apiClient.post("/auth/login", { email, password });

            localStorage.setItem("creator_os_token", data.token);
            const user = data.user;
            setUser(user);

            if (user.socialAccounts && user.socialAccounts.length > 0) {
                setSocialAccounts(user.socialAccounts);
                const active = user.socialAccounts.find((acc: any) => acc.isActive) || user.socialAccounts[0];
                setActiveSocialAccount(active);
            }

            router.push("/home");
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const register = async (email: string, username: string, password: string, name?: string) => {
        try {
            const data: any = await apiClient.post("/auth/register", { email, username, password, name });

            localStorage.setItem("creator_os_token", data.token);
            const user = data.user;
            setUser(user);

            if (user.socialAccounts && user.socialAccounts.length > 0) {
                setSocialAccounts(user.socialAccounts);
                const active = user.socialAccounts.find((acc: any) => acc.isActive) || user.socialAccounts[0];
                setActiveSocialAccount(active);
            }

            router.push("/home");
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
