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
