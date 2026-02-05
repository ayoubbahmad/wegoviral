"use client";

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
    socialAccounts?: SocialAccount[];
}

export interface SocialAccount {
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
