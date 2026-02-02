export type PostType = "Reel" | "Carousel" | "Static";

export interface PerformancePost {
    id: string;
    thumbnailUrl: string;
    caption: string;
    postedAt: string; // ISO date
    type: PostType;
    metrics: {
        likes: number;
        comments: number;
        saves: number;
        shares: number;
        reach: number;
    };
    engagementScore: number; // calculated score
}

export interface PostingTimeAnalysis {
    dayFormatted: string; // e.g., "Mon", "Tue"
    hour: number; // 0-23
    score: number; // 0-10 intensity
}
