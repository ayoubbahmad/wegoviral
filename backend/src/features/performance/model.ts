import { JsonValue } from "@prisma/client/runtime/library";

export interface UserPost {
  id: string;
  type: string;
  data: JsonValue;
  metrics: JsonValue;
  postedAt: Date;
  socialAccountId: string;
}

export interface ContentMixItem {
  label: string;
  value: number;
  color: string;
}

export interface PerformanceInsights {
  bestTime: string;
  contentMix: ContentMixItem[];
}
