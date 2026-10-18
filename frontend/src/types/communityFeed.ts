import type { UserRole } from '@/lib/roles';

export type { UserRole };

export interface CommunityUser {
    id: string;
    username: string;
    name?: string | null;
    avatarUrl?: string | null;
    role?: UserRole;
}

export interface CommunitySpace {
    id: string;
    name: string;
    emoji: string;
    description: string;
    adminOnly: boolean; // only moderators/admins can post here
    coverUrl?: string | null;
    archivedAt?: string | null;
    /** Whether the current member can open this space (Phase 4 access rules) */
    access: AccessResult;
    position: number;
    postCount: number;
}

export interface CommunityPollOption {
    id: string;
    label: string;
    votes: number;
}

export interface CommunityPoll {
    options: CommunityPollOption[];
    votedOptionId?: string;
}

export interface CommunityPost {
    id: string;
    spaceId: string;
    author: CommunityUser;
    title?: string;
    content: string;
    coverUrl?: string;
    images?: string[];
    poll?: CommunityPoll;
    pinned: boolean;
    /** PENDING: waiting for review, only the author sees it */
    reviewStatus: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    /** Why the post was refused (only sent to its author) */
    reviewNote?: string;
    /** Held by the word filter (only sent to its author) */
    heldForReview?: boolean;
    editedAt?: string;
    editedByStaff?: boolean;
    createdAt: string; // ISO date
    likeCount: number;
    commentCount: number;
    likedByMe: boolean;
    bookmarkedByMe: boolean;
}

export interface FeedPage {
    posts: CommunityPost[];
    nextCursor: string | null;
}

export interface TopPost {
    id: string;
    spaceId: string;
    title: string | null;
    content: string;
    likeCount: number;
    commentCount: number;
    author: { username: string };
}

export interface CommunityComment {
    id: string;
    postId: string;
    content: string;
    createdAt: string;
    editedAt?: string;
    editedByStaff?: boolean;
    /** Held by the word filter: only its author sees it until the team releases it */
    heldForReview?: boolean;
    author: CommunityUser;
}

/** What the create-post modal hands over; files are uploaded before the post is saved. */
export interface NewPostDraft {
    spaceId: string;
    title?: string;
    content: string;
    coverFile?: File;
    imageFiles: File[];
    pollOptions?: string[];
}

export interface CreatePostPayload {
    spaceId: string;
    title?: string;
    content: string;
    coverUrl?: string;
    images: string[];
    pollOptions?: string[];
}

export interface CommunityEvent {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO date
    attendeeCount: number;
    createdBy: CommunityUser;
}

export interface LeaderboardEntry {
    rank: number;
    user: CommunityUser;
    points: number;
}

export type ReportReason = 'SPAM' | 'HARASSMENT' | 'HATE' | 'NSFW' | 'MISINFORMATION' | 'SELF_PROMOTION' | 'OTHER';

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
    { value: 'SPAM', label: 'Spam or scam' },
    { value: 'HARASSMENT', label: 'Harassment or bullying' },
    { value: 'HATE', label: 'Hate speech' },
    { value: 'NSFW', label: 'Inappropriate or explicit' },
    { value: 'MISINFORMATION', label: 'False information' },
    { value: 'SELF_PROMOTION', label: 'Unwanted self-promotion' },
    { value: 'OTHER', label: 'Something else' },
];

export type LockReason =
    | { type: 'role'; minRole: UserRole }
    | { type: 'tier'; tiers: { id: string; name: string }[] }
    | { type: 'time'; unlocksAt: string; daysLeft: number };

export interface AccessResult {
    locked: boolean;
    reasons: LockReason[];
}
