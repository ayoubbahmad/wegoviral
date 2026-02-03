import { Hook, ScriptTemplate } from "@/types/library";
import { Competitor, CompetitorPost } from "@/types/competitor";
import { Follower } from "@/types/community";
import { PerformancePost, PostingTimeAnalysis } from "@/types/performance";

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
        lastUsed: "2023-10-30T10:00:00Z",
        usageCount: 3,
    },
];

export const MOCK_SCRIPTS: ScriptTemplate[] = [
    {
        id: "1",
        title: "The Myth-Buster",
        category: "Educational",
        content: [
            { step: "Hook", description: "State a common belief that is wrong." },
            { step: "The Truth", description: "Reveal the counter-intuitive reality." },
            { step: "Evidence", description: "Show why the old belief fails." },
            { step: "CTA", description: "Follow for more truth bombs." },
        ],
        createdAt: "2023-10-26T10:00:00Z",
    },
    {
        id: "2",
        title: "Day in the Life",
        category: "Storytelling",
        content: [
            { step: "Opener", description: "Wake up / Start of day shot." },
            { step: "Highlight", description: "Show the most interesting task." },
            { step: "Struggle", description: "Show a relatable problem engaged with." },
            { step: "Resolution", description: "Wrapping up the day." },
        ],
        createdAt: "2023-10-25T10:00:00Z",
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

export const MOCK_COMMUNITY: Follower[] = [
    {
        id: "101",
        username: "loyal_fan_1",
        fullName: "Jessica Smith",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
        joinDate: "2023-01-15T10:00:00Z",
        stats: { likes: 145, comments: 32, storyReplies: 12 },
        loyaltyScore: 95,
        segment: "VIP",
        lastInteractionDate: "2023-10-26T10:00:00Z",
        sampleComments: ["This is exactly what I needed!", "Loved the editing on this one 🔥", "Can you do a part 2?"],
    },
    {
        id: "102",
        username: "super_dave",
        fullName: "Dave Brown",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dave",
        joinDate: "2023-03-20T10:00:00Z",
        stats: { likes: 89, comments: 15, storyReplies: 5 },
        loyaltyScore: 82,
        segment: "Superfan",
        lastInteractionDate: "2023-10-25T14:30:00Z",
        sampleComments: ["First!", "Great insights as always."],
    },
    {
        id: "103",
        username: "newbie_sarah",
        fullName: "Sarah Jones",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ",
        joinDate: "2023-10-20T10:00:00Z",
        stats: { likes: 3, comments: 1, storyReplies: 0 },
        loyaltyScore: 15,
        segment: "New",
        lastInteractionDate: "2023-10-24T09:15:00Z",
    },
    {
        id: "104",
        username: "mark_design",
        fullName: "Mark Design",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
        joinDate: "2023-05-12T10:00:00Z",
        stats: { likes: 56, comments: 4, storyReplies: 1 },
        loyaltyScore: 60,
        segment: "Regular",
        lastInteractionDate: "2023-10-22T11:00:00Z",
    },
];

export const MOCK_PERFORMANCE_POSTS: PerformancePost[] = [
    {
        id: "201",
        thumbnailUrl: "https://placehold.co/400x600/18181b/fafafa?text=Top+Reel",
        caption: "So many people get this wrong...",
        postedAt: "2023-10-24T18:00:00Z",
        type: "Reel",
        metrics: { likes: 2500, comments: 120, saves: 450, shares: 320, reach: 45000 },
        engagementScore: 9.8,
    },
    {
        id: "202",
        thumbnailUrl: "https://placehold.co/400x400/18181b/fafafa?text=Carousel",
        caption: "5 Tools I use daily.",
        postedAt: "2023-10-22T14:00:00Z",
        type: "Carousel",
        metrics: { likes: 1800, comments: 85, saves: 890, shares: 150, reach: 32000 },
        engagementScore: 8.5,
    },
    {
        id: "203",
        thumbnailUrl: "https://placehold.co/400x500/18181b/fafafa?text=Static",
        caption: "Monday Motivation.",
        postedAt: "2023-10-18T09:00:00Z",
        type: "Static",
        metrics: { likes: 900, comments: 30, saves: 20, shares: 10, reach: 12000 },
        engagementScore: 4.2,
    },
];

export const MOCK_POSTING_TIMES: PostingTimeAnalysis[] = [
    { dayFormatted: "Mon", hour: 9, score: 6 },
    { dayFormatted: "Mon", hour: 12, score: 4 },
    { dayFormatted: "Mon", hour: 18, score: 8 },
    { dayFormatted: "Tue", hour: 9, score: 5 },
    { dayFormatted: "Tue", hour: 12, score: 7 },
    { dayFormatted: "Tue", hour: 18, score: 10 }, // Best time
    { dayFormatted: "Wed", hour: 9, score: 5 },
    { dayFormatted: "Wed", hour: 12, score: 6 },
    { dayFormatted: "Wed", hour: 18, score: 8 },
    { dayFormatted: "Thu", hour: 9, score: 4 },
    { dayFormatted: "Thu", hour: 11, score: 9 },
    { dayFormatted: "Thu", hour: 18, score: 7 },
    { dayFormatted: "Fri", hour: 9, score: 3 },
    { dayFormatted: "Fri", hour: 12, score: 5 },
    { dayFormatted: "Fri", hour: 17, score: 6 },
];
