export interface Script {
  id: string;
  title: string;
  excerpt?: string;
  content: any; // Flexible content structure
  category: string;
  status: "Draft" | "Completed";
  lastUpdated: string;
  wordCount: number;
  userId: string;
}

export interface CreateScriptDTO {
  title: string;
  content: any;
  category?: string;
  socialAccountId?: string;
}

export interface UpdateScriptDTO extends Partial<CreateScriptDTO> {
  status?: "Draft" | "Completed";
}
