export type Segment = "VIP" | "Superfan" | "Regular" | "New";

export interface InteractionStats {
    likes: number;
    comments: number;
    storyReplies: number;
    shares?: number;
}

export interface Follower {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
    joinDate: string; // ISO date
    stats: InteractionStats;
    loyaltyScore: number; // 0-100 calculated score
    segment: Segment;
    lastInteractionDate: string;
}
