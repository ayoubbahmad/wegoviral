export interface Competitor {
  id: string;
  handle: string;
  name: string;
  avatarUrl: string;
  bio: string;
  platform: string;
  externalUrl: string;
  stats: {
    followers: string;
    avgLikes: string;
    engagementRate: string;
  };
  tags: string[]; // e.g., "Tech", "Lifestyle"
  isFollowing?: boolean;
  watchlists?: { id: string; name: string }[];
  posts?: CompetitorPost[];
  creatorId?: string | null;
}

export interface Creator {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  competitors?: Competitor[];
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
