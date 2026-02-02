import { Hook, ScriptTemplate } from "@/types/library";

export const MOCK_HOOKS: Hook[] = [
    {
        id: "1",
        content: "Stop doing [common mistake] if you want to [desired outcome].",
        type: "Verbal",
        emotion: "Fear",
        topic: "Productivity",
        addedAt: "2023-10-26T10:00:00Z",
        performanceRating: 5,
    },
    {
        id: "2",
        content: "POV: You finally discovered the secret to...",
        type: "Visual",
        emotion: "Curiosity",
        topic: "Lifestyle",
        addedAt: "2023-10-25T14:30:00Z",
        performanceRating: 4,
    },
    {
        id: "3",
        content: "They lied to you about...",
        type: "Verbal",
        emotion: "Surprise",
        topic: "Business",
        addedAt: "2023-10-24T09:15:00Z",
        performanceRating: 5,
    },
];

export const MOCK_SCRIPTS: ScriptTemplate[] = [
    {
        id: "1",
        name: "The Myth-Buster",
        category: "Educational",
        structure: [
            { step: "Hook", description: "State a common belief that is wrong." },
            { step: "The Truth", description: "Reveal the counter-intuitive reality." },
            { step: "Evidence", description: "Show why the old belief fails." },
            { step: "CTA", description: "Follow for more truth bombs." },
        ],
    },
    {
        id: "2",
        name: "Day in the Life",
        category: "Storytelling",
        structure: [
            { step: "Opener", description: "Wake up / Start of day shot." },
            { step: "Highlight", description: "Show the most interesting task." },
            { step: "Struggle", description: "Show a relatable problem engaged with." },
            { step: "Resolution", description: "Wrapping up the day." },
        ],
    },
];
