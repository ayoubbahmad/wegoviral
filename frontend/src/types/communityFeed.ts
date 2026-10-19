import type { UserRole } from '@/lib/roles';

export type { UserRole };

export interface CommunityUser {
    id: string;
    username: string;
    name?: string | null;
    avatarUrl?: string | null;
    role?: UserRole;
    /** Up to 3 most recent badges, shown next to the name */
    badges?: BadgeChip[];
}

export interface BadgeChip {
    id: string;
    name: string;
    emoji: string;
    color: string;
}

export interface MemberLevel {
    level: number;
    name: string;
    minPoints: number;
    next: { level: number; name: string; minPoints: number; pointsToGo: number } | null;
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

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

export interface CommunityEvent {
    id: string;
    title: string;
    coverUrl: string | null;
    startsAt: string; // ISO
    endsAt: string; // ISO
    timezone: string; // the host's time zone
    locationType: 'ONLINE' | 'IN_PERSON';
    category: string | null;
    capacity: number | null;
    status: EventStatus;
    host: CommunityUser;
    goingCount: number;
    isFull: boolean;
    goingByMe: boolean;
    canManage: boolean;
    access: AccessResult;
    // Not sent for events the member can't open
    description?: string;
    location?: string | null;
    /** Only sent to members who are going, the host and staff */
    link?: string | null;
    hasLink?: boolean;
    recordingUrl?: string | null;
}

export interface EventInput {
    title: string;
    description: string;
    coverUrl?: string | null;
    startsAt: string;
    endsAt: string;
    timezone: string;
    locationType: 'ONLINE' | 'IN_PERSON';
    location?: string | null;
    link?: string | null;
    category?: string | null;
    capacity?: number | null;
    status: EventStatus;
    recordingUrl?: string | null;
}

export type LeaderboardPeriod = '7d' | '30d' | 'all';

export interface LeaderboardMember extends CommunityUser {
    points: number;
    badges: BadgeChip[];
}

export interface LeaderboardEntry {
    rank: number;
    /** Points earned in the period */
    points: number;
    member: LeaderboardMember;
    level: MemberLevel;
}

export interface Leaderboard {
    period: LeaderboardPeriod;
    entries: LeaderboardEntry[];
    me: { rank: number | null; periodPoints: number; member: LeaderboardMember; level: MemberLevel };
}

export interface HowPointsWork {
    rules: { action: string; label: string; points: number; dailyCap: number | null }[];
    levels: { level: number; name: string; minPoints: number }[];
    badges: (BadgeChip & { description: string; howToEarn: string })[];
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
    | { type: 'time'; unlocksAt: string; daysLeft: number }
    | { type: 'level'; minLevel: number; levelName: string; pointsToGo: number };

export interface AccessResult {
    locked: boolean;
    reasons: LockReason[];
}
