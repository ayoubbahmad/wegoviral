import { JsonValue } from "@prisma/client/runtime/library";

export interface Interaction {
  id: string;
  type: string;
  content: string | null;
  timestamp: Date;
  followerId: string;
  createdAt: Date;
}

export interface Follower {
  id: string;
  handle: string;
  name: string | null;
  avatarUrl: string | null;
  segment: string;
  stats: JsonValue;
  socialAccountId: string;
  createdAt: Date;
  updatedAt: Date;
  interactions?: Interaction[];
}

export interface CommunitySummary {
  total: number;
  vips: number;
  newThisMonth: number;
}
