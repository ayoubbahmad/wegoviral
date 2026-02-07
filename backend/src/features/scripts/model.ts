import { JsonValue } from "@prisma/client/runtime/library";

export interface ScriptContent {
  topic?: string;
  hooks?: number[];
  style?: number | null;
  generatedContent?: string;
  [key: string]: any;
}

export interface Script {
  id: string;
  title: string;
  content: JsonValue;
  category: string;
  status: string;
  excerpt: string | null;
  wordCount: number | null;
  userId: string;
  hookId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScriptDTO {
  title: string;
  content: ScriptContent;
  category?: string;
}

export interface UpdateScriptDTO {
  title?: string;
  content?: ScriptContent;
  category?: string;
  status?: string;
}
