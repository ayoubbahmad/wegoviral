import { Hook, ScriptTemplate } from "@/types/library";
import { Competitor, CompetitorPost } from "@/types/competitor";

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

export const MOCK_COMPETITORS: Competitor[] = [
    {
        id: "1",
        handle: "@techguru",
        name: "Alex Tech",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        bio: "Helping you master the modern stack. Ex-Google.",
        stats: {
            followers: "145k",
            avgLikes: "12k",
            engagementRate: "8.5%",
        },
        tags: ["Tech", "Career"],
        isFollowing: true,
    },
    {
        id: "2",
        handle: "@creativeflow",
        name: "Sarah Creates",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        bio: "Design thinking for non-designers.",
        stats: {
            followers: "89k",
            avgLikes: "5.4k",
            engagementRate: "6.2%",
        },
        tags: ["Design", "Creativity"],
        isFollowing: true,
    },
    {
        id: "3",
        handle: "@money_master",
        name: "Rich Minds",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rich",
        bio: "Financial freedom is a mindset.",
        stats: {
            followers: "210k",
            avgLikes: "15k",
            engagementRate: "7.1%",
        },
        tags: ["Finance", "Business"],
        isFollowing: false,
    },
];

export const MOCK_COMPETITOR_POSTS: Record<string, CompetitorPost[]> = {
    "1": [
        {
            id: "101",
            competitorId: "1",
            thumbnailUrl: "https://placehold.co/400x600/18181b/fafafa?text=React+Tricks",
            captionExcerpt: "Stop using useEffect for everything! Here is why...",
            postedAt: "2023-10-25T10:00:00Z",
            metrics: { likes: 15400, comments: 420 },
            isViral: true,
            analysis: { hook: "Stop doing X", structure: "Myth-Buster", notes: "Fast cuts on every sentence." }
        },
        {
            id: "102",
            competitorId: "1",
            thumbnailUrl: "https://placehold.co/400x600/18181b/fafafa?text=Career+Advice",
            captionExcerpt: "How I doubled my salary in 6 months.",
            postedAt: "2023-10-20T10:00:00Z",
            metrics: { likes: 11200, comments: 340 },
            isViral: false,
        }
    ]
};
