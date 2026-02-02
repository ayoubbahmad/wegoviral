export type HookType = "Visual" | "Verbal" | "Text" | "Audio";
export type Emotion = "Curiosity" | "Fear" | "Desire" | "Humor" | "Surprise" | "Inspiration";

export interface Hook {
    id: string;
    content: string;
    type: HookType;
    emotion: Emotion;
    topic: string; // e.g., "Productivity", "Fitness"
    addedAt: string; // ISO date
    performanceRating?: 1 | 2 | 3 | 4 | 5; // User rating of effectiveness
    sourceUrl?: string; // Link to where this hook was found (competitor post)
    lastUsed?: string; // ISO date
    usageCount?: number;
}

export interface ScriptTemplate {
    id: string;
    name: string;
    category: "Educational" | "Entertainment" | "Sales" | "Storytelling";
    structure: {
        step: string;
        description: string;
        durationEstimate?: string;
    }[];
    exampleUrl?: string;
}
