export interface Competitor {
  id: string;
  handle: string;
  name: string;
  avatarUrl: string;
  bio: string;
  stats: {
    followers: string;
    avgLikes: string;
    engagementRate: string;
  };
  tags: string[]; // e.g., "Tech", "Lifestyle"
  isFollowing?: boolean;
  watchlists?: { id: string; name: string }[];
  posts?: CompetitorPost[];
}

export interface CompetitorPost {
  id: string;
  competitorId: string;
  thumbnailUrl: string;
  captionExcerpt: string;
  postedAt: string;
  metrics: {
    likes: number;
    comments: number;
    views?: number;
  };
  isViral: boolean; // Calculated based on their avg engagement
  analysis?: {
    hook: string;
    structure: string;
    notes: string;
  };
}
