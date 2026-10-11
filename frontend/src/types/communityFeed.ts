export interface CommunityUser {
    id: string;
    username: string;
    avatarUrl: string;
}

export interface CommunitySpace {
    id: string;
    name: string;
    emoji: string;
    description: string;
    adminOnly?: boolean; // only founders/admins can post here
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
    createdAt: string; // ISO date
    likeCount: number;
    commentCount: number;
    likedByMe?: boolean;
    bookmarkedByMe?: boolean;
}

export interface NewPostInput {
    spaceId: string;
    title?: string;
    content: string;
    coverUrl?: string;
    images?: string[];
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
