export type HookType = 'Visual' | 'Verbal' | 'Text' | 'Audio';
export type Emotion =
  | 'Curiosity'
  | 'Fear'
  | 'Desire'
  | 'Humor'
  | 'Surprise'
  | 'Inspiration';

export interface Hook {
  id: string;
  content: string;
  type: HookType;
  emotion: Emotion;
  topic: string;
  addedAt: string;
  performanceRating?: 1 | 2 | 3 | 4 | 5;
  sourceUrl?: string;
  views?: number;
  tags?: string[];
  sourceMetadata?: {
    url?: string;
    title?: string;
    thumbnail?: string;
    handle?: string;
  } | null;
  lastUsed?: string;
  usageCount?: number;
}

export interface ScriptTemplate {
  id: string;
  title: string;
  category: string;
  content: any[];
  excerpt?: string;
  wordCount?: number;
  views?: number;
  tags?: string[];
  sourceMetadata?: any;
  createdAt: string;
}

export interface CreateHookDTO {
  content: string;
  type: HookType;
  emotion: Emotion;
  topic: string;
  sourceUrl?: string;
}

export interface UpdateHookDTO extends Partial<CreateHookDTO> {
  performanceRating?: 1 | 2 | 3 | 4 | 5;
}

export interface CreateScriptTemplateDTO {
  title: string;
  content: any[];
  category: string;
}

export interface UpdateScriptTemplateDTO extends Partial<CreateScriptTemplateDTO> {}
