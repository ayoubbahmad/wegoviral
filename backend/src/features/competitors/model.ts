import { JsonValue } from '@prisma/client/runtime/library';

export interface CompetitorPost {
  id: string;
  type: string;
  data: JsonValue;
  postedAt: Date;
  competitorId: string;
}

export interface Competitor {
  id: string;
  handle: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  tags: string[];
  stats: JsonValue;
  userId: string;
  socialAccountId: string | null;
  createdAt: Date;
  updatedAt: Date;
  posts?: CompetitorPost[];
  isFollowing?: boolean;
}

export interface CreateCompetitorDTO {
  handle: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  tags?: string[];
  stats?: any;
  socialAccountId?: string;
}

export interface UpdateCompetitorDTO {
  handle?: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  tags?: string[];
  stats?: any;
  socialAccountId?: string;
}

export interface BulkCreateCompetitorDTO {
  handles: string[]; // Can be handle or URL
  tags?: string[];
  socialAccountId?: string;
}
