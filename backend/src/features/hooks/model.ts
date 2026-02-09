export interface Hook {
  id: string;
  content: string;
  type: string;
  emotion: string;
  topic: string;
  performanceRating: number;
  views: number;
  tags: string[];
  sourceMetadata?: {
    url?: string;
    title?: string;
    thumbnail?: string;
    handle?: string;
  } | null;
  lastUsed?: Date | null;
  userId: string;
  socialAccountId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHookDTO {
  content: string;
  type: string;
  emotion?: string;
  topic?: string;
  performanceRating?: number;
  views?: number;
  tags?: string[];
  sourceMetadata?: any;
  socialAccountId?: string;
}

export interface UpdateHookDTO {
  content?: string;
  type?: string;
  emotion?: string;
  topic?: string;
  performanceRating?: number;
  views?: number;
  tags?: string[];
  sourceMetadata?: any;
  socialAccountId?: string;
  lastUsed?: Date;
}
