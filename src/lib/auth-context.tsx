"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
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
    login: () => void;
    logout: () => void;
    activeSocialAccount: SocialAccount | null;
    socialAccounts: SocialAccount[];
    switchAccount: (accountId: string) => void;
}

const MOCK_USER: User = {
    id: "mock-user-1",
    name: "Demo Creator",
    email: "creator@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
};

const defaultContext: AuthContextType = {
    user: null,
    isLoading: false,
    login: () => { },
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

    useEffect(() => {
        // Load user and social accounts from localStorage
        const storedUser = localStorage.getItem("mock_auth_user");
        const storedAccounts = localStorage.getItem("mock_social_accounts");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            setSocialAccounts(accounts);
            const active = accounts.find((acc: SocialAccount) => acc.isActive);
            setActiveSocialAccount(active || null);
        }

        setIsLoading(false);
    }, []);

    const login = () => {
        setUser(MOCK_USER);
        localStorage.setItem("mock_auth_user", JSON.stringify(MOCK_USER));
        router.push("/");
    };

    const logout = () => {
        setUser(null);
        setSocialAccounts([]);
        setActiveSocialAccount(null);
        localStorage.removeItem("mock_auth_user");
        localStorage.removeItem("mock_social_accounts");
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
        localStorage.setItem("mock_social_accounts", JSON.stringify(updatedAccounts));
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
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
