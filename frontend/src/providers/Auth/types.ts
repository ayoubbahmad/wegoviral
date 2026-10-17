"use client";

import type { MemberStatus, Permission, UserRole } from "@/lib/roles";

/** Where a member is in the joining journey (APPLICATION → PENDING → RULES → QUIZ → DONE). */
export type OnboardingStep = "APPLICATION" | "PENDING" | "REJECTED" | "RULES" | "QUIZ" | "DONE";

export interface Onboarding {
    step: OnboardingStep;
    joinStatus: "PENDING" | "APPROVED" | "REJECTED";
    specialMember: boolean;
    guideVersion: number;
    rulesAcceptedVersion: number | null;
    rejectionNote: string | null;
    /** New members' first posts are reviewed before others see them */
    probation: Probation;
    canReviewPosts: boolean;
}

export type Probation =
    | { onProbation: false }
    | { onProbation: true; approvedPosts: number; pendingPosts: number; required: number };

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
    role: UserRole;
    /** Effective restriction: expired ones are already ACTIVE */
    status: MemberStatus;
    statusReason: string | null;
    statusUntil: string | null;
    /** Everything this user may do, computed by the backend */
    permissions: Permission[];
    onboarding: Onboarding;
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
    refreshUser: () => Promise<void>;
    activeSocialAccount: SocialAccount | null;
    socialAccounts: SocialAccount[];
    switchAccount: (accountId: string) => void;
}
