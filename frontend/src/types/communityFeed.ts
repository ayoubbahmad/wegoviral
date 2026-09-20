export interface CommunityUser {
    id: string;
    username: string;
    avatarUrl: string;
}

export interface CommunityPost {
    id: string;
    author: CommunityUser;
    content: string;
    createdAt: string; // ISO date
    likeCount: number;
    commentCount: number;
    likedByMe?: boolean;
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
