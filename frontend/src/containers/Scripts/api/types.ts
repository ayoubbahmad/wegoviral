export interface Script {
    id: string;
    title: string;
    category: string;
    content: any;
    status: "Draft" | "Completed";
    excerpt?: string;
    wordCount?: number;
    templateId?: string;
    createdAt: string;
    lastUpdated?: string;
}

export interface CreateScriptDTO {
    title: string;
    content: any;
    category?: string;
    templateId?: string;
}

export interface UpdateScriptDTO extends Partial<CreateScriptDTO> {
    status?: "Draft" | "Completed";
}
