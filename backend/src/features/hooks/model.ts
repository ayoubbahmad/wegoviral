export interface Hook {
  id: string;
  content: string;
  type: string;
  emotion: string;
  topic: string;
  performanceRating: number;
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
  socialAccountId?: string;
}

export interface UpdateHookDTO {
  content?: string;
  type?: string;
  emotion?: string;
  topic?: string;
  performanceRating?: number;
  socialAccountId?: string;
  lastUsed?: Date;
}
