"use client";

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
    role: 'MEMBER' | 'MODERATOR' | 'ADMIN';
    socialAccounts?: SocialAccount[];
}

export interface SocialAccount {
    id: string;
    platform: string;
    username: string;
    avatarUrl?: string;
    isActive: boolean;
}

export interface AuthResult {
    success: boolean;
    error?: string;
    /** Sign-up succeeded but the user must confirm their email first */
    needsConfirmation?: boolean;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<AuthResult>;
    register: (email: string, username: string, password: string, name?: string) => Promise<AuthResult>;
    loginWithGoogle: () => Promise<AuthResult>;
    requestPasswordReset: (email: string) => Promise<AuthResult>;
    updatePassword: (password: string) => Promise<AuthResult>;
    logout: () => void;
    activeSocialAccount: SocialAccount | null;
    socialAccounts: SocialAccount[];
    switchAccount: (accountId: string) => void;
}
