import { JsonValue } from '@prisma/client/runtime/library';

export interface CompetitorPost {
  id: string;
  competitorId: string;
  thumbnailUrl: string;
  captionExcerpt: string;
  postedAt: Date;
  metrics: JsonValue;
  isViral: boolean;
  analysis?: JsonValue;
  externalUrl?: string; // New field for deduplication
  createdAt: Date;
}

export interface Competitor {
  id: string;
  handle: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  tags: string[];
  stats: JsonValue;
  platform: string;
  externalUrl: string;
  originUrl: string | null;
  userId: string;
  socialAccountId: string | null;
  creatorId: string | null; // New field
  createdAt: Date;
  updatedAt: Date;
  posts?: CompetitorPost[];
  isFollowing?: boolean;
}

export interface Creator {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  competitors?: Competitor[];
}

export interface CreateCreatorDTO {
  name: string;
}

export interface CreateCompetitorDTO {
  // ... existing fields ...
  handle: string;
  name: string;
  platform: string;
  externalUrl: string;
  originUrl?: string;
  avatarUrl?: string;
  bio?: string;
  tags?: string[];
  stats?: any;
  socialAccountId?: string;
  watchlistIds?: string[];
  creatorId?: string; // New field
}

export interface UpdateCompetitorDTO {
  handle?: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  tags?: string[];
  stats?: any;
  socialAccountId?: string;
  watchlistIds?: string[];
}

export interface BulkCreateCompetitorDTO {
  handles: string[]; // Can be handle or URL
  tags?: string[];
  socialAccountId?: string;
  watchlistId?: string;
}
