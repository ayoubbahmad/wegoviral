import { Hook, ScriptTemplate } from '@/containers/Library/types';

import { Competitor, CompetitorPost } from '@/types/competitor';
import { Follower } from '@/types/followers';
import { PerformancePost, PostingTimeAnalysis } from '@/types/performance';
import {
  CommunityPost,
  CommunitySpace,
  CommunityEvent,
  LeaderboardEntry,
} from '@/types/communityFeed';

export const MOCK_HOOKS: Hook[] = [
  {
    id: '1',
    content: 'Stop doing [common mistake] if you want to [desired outcome].',
    type: 'Verbal',
    emotion: 'Fear',
    topic: 'Productivity',
    addedAt: '2023-10-26T10:00:00Z',
    performanceRating: 5,
  },
  {
    id: '2',
    content: 'POV: You finally discovered the secret to...',
    type: 'Visual',
    emotion: 'Curiosity',
    topic: 'Lifestyle',
    addedAt: '2023-10-25T14:30:00Z',
    performanceRating: 4,
  },
  {
    id: '3',
    content: 'They lied to you about...',
    type: 'Verbal',
    emotion: 'Surprise',
    topic: 'Business',
    addedAt: '2023-10-24T09:15:00Z',
    performanceRating: 5,
    lastUsed: '2023-10-30T10:00:00Z',
    usageCount: 3,
  },
];

export const MOCK_SCRIPTS: ScriptTemplate[] = [
  {
    id: '1',
    title: 'The Myth-Buster',
    category: 'Educational',
    content: [
      { step: 'Hook', description: 'State a common belief that is wrong.' },
      {
        step: 'The Truth',
        description: 'Reveal the counter-intuitive reality.',
      },
      { step: 'Evidence', description: 'Show why the old belief fails.' },
      { step: 'CTA', description: 'Follow for more truth bombs.' },
    ],
    createdAt: '2023-10-26T10:00:00Z',
  },
  {
    id: '2',
    title: 'Day in the Life',
    category: 'Storytelling',
    content: [
      { step: 'Opener', description: 'Wake up / Start of day shot.' },
      { step: 'Highlight', description: 'Show the most interesting task.' },
      {
        step: 'Struggle',
        description: 'Show a relatable problem engaged with.',
      },
      { step: 'Resolution', description: 'Wrapping up the day.' },
    ],
    createdAt: '2023-10-25T10:00:00Z',
  },
];

export const MOCK_COMPETITORS: Competitor[] = [
  {
    id: '1',
    handle: 'techguru',
    name: 'Alex Tech',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'Helping you master the modern stack. Ex-Google.',
    platform: 'instagram',
    externalUrl: 'https://www.instagram.com/techguru/',
    stats: {
      followers: '145k',
      avgLikes: '12k',
      engagementRate: '8.5%',
    },
    tags: ['Tech', 'Career'],
    isFollowing: true,
  },
  {
    id: '2',
    handle: 'creativeflow',
    name: 'Sarah Creates',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Design thinking for non-designers.',
    platform: 'instagram',
    externalUrl: 'https://www.instagram.com/creativeflow/',
    stats: {
      followers: '89k',
      avgLikes: '5.4k',
      engagementRate: '6.2%',
    },
    tags: ['Design', 'Creativity'],
    isFollowing: true,
  },
  {
    id: '3',
    handle: 'money_master',
    name: 'Rich Minds',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rich',
    bio: 'Financial freedom is a mindset.',
    platform: 'instagram',
    externalUrl: 'https://www.instagram.com/money_master/',
    stats: {
      followers: '210k',
      avgLikes: '15k',
      engagementRate: '7.1%',
    },
    tags: ['Finance', 'Business'],
    isFollowing: false,
  },
];

export const MOCK_COMPETITOR_POSTS: Record<string, CompetitorPost[]> = {
  '1': [
    {
      id: '101',
      competitorId: '1',
      thumbnailUrl:
        'https://placehold.co/400x600/18181b/fafafa?text=React+Tricks',
      captionExcerpt: 'Stop using useEffect for everything! Here is why...',
      postedAt: '2023-10-25T10:00:00Z',
      metrics: { likes: 15400, comments: 420 },
      isViral: true,
      analysis: {
        hook: 'Stop doing X',
        structure: 'Myth-Buster',
        notes: 'Fast cuts on every sentence.',
      },
    },
    {
      id: '102',
      competitorId: '1',
      thumbnailUrl:
        'https://placehold.co/400x600/18181b/fafafa?text=Career+Advice',
      captionExcerpt: 'How I doubled my salary in 6 months.',
      postedAt: '2023-10-20T10:00:00Z',
      metrics: { likes: 11200, comments: 340 },
      isViral: false,
    },
  ],
};

export const MOCK_FOLLOWERS: Follower[] = [
  {
    id: '101',
    username: 'loyal_fan_1',
    fullName: 'Jessica Smith',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    joinDate: '2023-01-15T10:00:00Z',
    stats: { likes: 145, comments: 32, storyReplies: 12 },
    loyaltyScore: 95,
    segment: 'VIP',
    lastInteractionDate: '2023-10-26T10:00:00Z',
    sampleComments: [
      'This is exactly what I needed!',
      'Loved the editing on this one 🔥',
      'Can you do a part 2?',
    ],
  },
  {
    id: '102',
    username: 'super_dave',
    fullName: 'Dave Brown',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave',
    joinDate: '2023-03-20T10:00:00Z',
    stats: { likes: 89, comments: 15, storyReplies: 5 },
    loyaltyScore: 82,
    segment: 'Superfan',
    lastInteractionDate: '2023-10-25T14:30:00Z',
    sampleComments: ['First!', 'Great insights as always.'],
  },
  {
    id: '103',
    username: 'newbie_sarah',
    fullName: 'Sarah Jones',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ',
    joinDate: '2023-10-20T10:00:00Z',
    stats: { likes: 3, comments: 1, storyReplies: 0 },
    loyaltyScore: 15,
    segment: 'New',
    lastInteractionDate: '2023-10-24T09:15:00Z',
  },
  {
    id: '104',
    username: 'mark_design',
    fullName: 'Mark Design',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
    joinDate: '2023-05-12T10:00:00Z',
    stats: { likes: 56, comments: 4, storyReplies: 1 },
    loyaltyScore: 60,
    segment: 'Regular',
    lastInteractionDate: '2023-10-22T11:00:00Z',
  },
];

export const MOCK_PERFORMANCE_POSTS: PerformancePost[] = [
  {
    id: '201',
    thumbnailUrl: 'https://placehold.co/400x600/18181b/fafafa?text=Top+Reel',
    caption: 'So many people get this wrong...',
    postedAt: '2023-10-24T18:00:00Z',
    type: 'Reel',
    metrics: {
      likes: 2500,
      comments: 120,
      saves: 450,
      shares: 320,
      reach: 45000,
    },
    engagementScore: 9.8,
  },
  {
    id: '202',
    thumbnailUrl: 'https://placehold.co/400x400/18181b/fafafa?text=Carousel',
    caption: '5 Tools I use daily.',
    postedAt: '2023-10-22T14:00:00Z',
    type: 'Carousel',
    metrics: {
      likes: 1800,
      comments: 85,
      saves: 890,
      shares: 150,
      reach: 32000,
    },
    engagementScore: 8.5,
  },
  {
    id: '203',
    thumbnailUrl: 'https://placehold.co/400x500/18181b/fafafa?text=Static',
    caption: 'Monday Motivation.',
    postedAt: '2023-10-18T09:00:00Z',
    type: 'Static',
    metrics: { likes: 900, comments: 30, saves: 20, shares: 10, reach: 12000 },
    engagementScore: 4.2,
  },
];

export const MOCK_POSTING_TIMES: PostingTimeAnalysis[] = [
  { dayFormatted: 'Mon', hour: 9, score: 6 },
  { dayFormatted: 'Mon', hour: 12, score: 4 },
  { dayFormatted: 'Mon', hour: 18, score: 8 },
  { dayFormatted: 'Tue', hour: 9, score: 5 },
  { dayFormatted: 'Tue', hour: 12, score: 7 },
  { dayFormatted: 'Tue', hour: 18, score: 10 }, // Best time
  { dayFormatted: 'Wed', hour: 9, score: 5 },
  { dayFormatted: 'Wed', hour: 12, score: 6 },
  { dayFormatted: 'Wed', hour: 18, score: 8 },
  { dayFormatted: 'Thu', hour: 9, score: 4 },
  { dayFormatted: 'Thu', hour: 11, score: 9 },
  { dayFormatted: 'Thu', hour: 18, score: 7 },
  { dayFormatted: 'Fri', hour: 9, score: 3 },
  { dayFormatted: 'Fri', hour: 12, score: 5 },
  { dayFormatted: 'Fri', hour: 17, score: 6 },
];

const MOCK_USER_MAYA = {
  id: 'u1',
  username: 'maya_creates',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
};
const MOCK_USER_LEO = {
  id: 'u2',
  username: 'leo_edits',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
};
const MOCK_USER_PRIYA = {
  id: 'u3',
  username: 'priya_growth',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
};
const MOCK_USER_SAM = {
  id: 'u4',
  username: 'sam_scripts',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
};

export const MOCK_COMMUNITY_SPACES: CommunitySpace[] = [
  {
    id: 'announcements',
    name: 'Announcements',
    emoji: '📣',
    description: 'News and updates from the We Go Viral team.',
    adminOnly: true,
  },
  {
    id: 'introductions',
    name: 'Introduce Yourself',
    emoji: '👋',
    description: 'New here? Tell us who you are, what you create and where.',
  },
  {
    id: 'wins',
    name: 'Wins',
    emoji: '🏆',
    description: 'Share your milestones, viral moments and small victories.',
  },
  {
    id: 'feedback',
    name: 'Feedback',
    emoji: '🎬',
    description: 'Post a hook, script or video and get honest feedback.',
  },
  {
    id: 'collabs',
    name: 'Collabs',
    emoji: '🤝',
    description: 'Find creators to collaborate with.',
  },
  {
    id: 'questions',
    name: 'Questions',
    emoji: '💬',
    description: 'Ask anything about growth, editing, tools or monetization.',
  },
  {
    id: 'hooks',
    name: 'Hooks & Scripts',
    emoji: '✍️',
    description: 'Share hooks that worked and workshop your scripts together.',
  },
  {
    id: 'editing',
    name: 'Editing',
    emoji: '🎞️',
    description: 'Editing workflows, transitions, captions and software tips.',
  },
  {
    id: 'monetization',
    name: 'Monetization',
    emoji: '💰',
    description: 'Brand deals, creator funds, products and pricing your work.',
  },
  {
    id: 'challenges',
    name: 'Challenges',
    emoji: '🔥',
    description: 'Join community challenges and post your progress.',
  },
  {
    id: 'gear',
    name: 'Tools & Gear',
    emoji: '🎙️',
    description: 'Cameras, mics, lighting, apps — what are you using?',
  },
  {
    id: 'offtopic',
    name: 'Off-topic',
    emoji: '☕',
    description: 'Everything else. Take a break and hang out.',
  },
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p0',
    title: 'Welcome to the new We Go Viral community 🚀',
    coverUrl: 'https://picsum.photos/seed/wegoviral-welcome/1200/500',
    spaceId: 'announcements',
    author: MOCK_USER_SAM,
    content:
      'Welcome to the new We Go Viral community space! Pick a space above to filter the feed, and choose where your post goes when you share.',
    createdAt: '2023-10-28T08:00:00Z',
    likeCount: 92,
    commentCount: 17,
    likedByMe: false,
  },
  {
    id: 'p1',
    title: '100k views on a Reel I almost deleted',
    spaceId: 'wins',
    author: MOCK_USER_MAYA,
    content:
      'Just hit 100k on a Reel I almost didn\'t post — the hook was "Nobody tells you this about..." Anyone else notice curiosity hooks outperforming everything else lately?',
    createdAt: '2023-10-27T09:30:00Z',
    likeCount: 34,
    commentCount: 8,
    likedByMe: false,
  },
  {
    id: 'p2',
    spaceId: 'feedback',
    author: MOCK_USER_LEO,
    content:
      'Sharing my editing workflow for fast-turnaround Reels — cut everything on beat, keep captions under 4 words per line, and never let a shot sit longer than 2 seconds.',
    createdAt: '2023-10-26T18:15:00Z',
    likeCount: 21,
    commentCount: 5,
    likedByMe: true,
  },
  {
    id: 'p3',
    spaceId: 'wins',
    author: MOCK_USER_PRIYA,
    content:
      'PSA: posting consistency still beats virality chasing. Three months of daily posting did more for my growth than any single viral hit.',
    createdAt: '2023-10-25T12:00:00Z',
    likeCount: 57,
    commentCount: 14,
    likedByMe: false,
  },
  {
    id: 'p4',
    title: 'Collab: food or fitness creator for a duet series',
    spaceId: 'collabs',
    author: MOCK_USER_LEO,
    content:
      'Looking for a fitness or food creator (10k–50k) for a duet series next month. I handle editing, you bring the recipes. DM me!',
    createdAt: '2023-10-24T16:40:00Z',
    likeCount: 12,
    commentCount: 6,
    likedByMe: false,
  },
  {
    id: 'p5',
    spaceId: 'introductions',
    author: MOCK_USER_PRIYA,
    content:
      "Hi everyone 👋 I'm Priya, I make productivity content on TikTok and YouTube Shorts. Currently trying to crack long-form. Happy to be here!",
    createdAt: '2023-10-23T10:05:00Z',
    likeCount: 40,
    commentCount: 11,
    likedByMe: false,
  },
  {
    id: 'p6',
    title: 'This hook took my 3s retention from 41% to 63%',
    coverUrl: 'https://picsum.photos/seed/wegoviral-hook/1200/500',
    spaceId: 'hooks',
    author: MOCK_USER_MAYA,
    content:
      'Hook I tested this week: "I wasted 2 years doing this wrong so you don\'t have to." Retention at 3s went from 41% to 63%. Steal it 👀',
    createdAt: '2023-10-22T14:20:00Z',
    likeCount: 58,
    commentCount: 19,
    likedByMe: false,
  },
  {
    id: 'p7',
    spaceId: 'editing',
    author: MOCK_USER_LEO,
    content:
      'CapCut vs Premiere for short-form in 2023 — I switched to CapCut for anything under 60s and cut my editing time in half. Fight me.',
    createdAt: '2023-10-21T20:10:00Z',
    likeCount: 33,
    commentCount: 27,
    likedByMe: false,
  },
  {
    id: 'p8',
    title: 'First brand deal at 8k followers 🎉',
    spaceId: 'monetization',
    author: MOCK_USER_SAM,
    content:
      'Got my first brand deal at 8k followers! They found me through a niche hashtag. Rate was $350 for 1 Reel + 3 stories. Was that fair?',
    createdAt: '2023-10-20T11:45:00Z',
    likeCount: 71,
    commentCount: 34,
    likedByMe: false,
  },
  {
    id: 'p9',
    spaceId: 'challenges',
    author: MOCK_USER_PRIYA,
    content:
      'Day 12/30 of the posting challenge ✅ Haven\'t missed a day yet. Who else is still in?',
    createdAt: '2023-10-19T09:00:00Z',
    likeCount: 45,
    commentCount: 22,
    likedByMe: false,
  },
  {
    id: 'p10',
    images: [
      'https://picsum.photos/seed/wegoviral-mic-1/800/600',
      'https://picsum.photos/seed/wegoviral-mic-2/800/600',
    ],
    spaceId: 'gear',
    author: MOCK_USER_MAYA,
    content:
      'Upgraded from my phone mic to a cheap lavalier ($25) and comments about audio quality disappeared overnight. Best investment so far.',
    createdAt: '2023-10-18T17:30:00Z',
    likeCount: 29,
    commentCount: 9,
    likedByMe: false,
  },
  {
    id: 'p11',
    title: 'Posting across time zones?',
    poll: {
      options: [
        { id: 'o1', label: 'Post for the US audience', votes: 18 },
        { id: 'o2', label: 'Post for the EU audience', votes: 9 },
        { id: 'o3', label: 'Alternate days', votes: 14 },
      ],
    },
    spaceId: 'questions',
    author: MOCK_USER_SAM,
    content:
      'How do you all handle posting times across time zones? My audience is split between the US and Europe.',
    createdAt: '2023-10-17T13:15:00Z',
    likeCount: 14,
    commentCount: 12,
    likedByMe: false,
  },
];

// Event dates are relative to today so "upcoming" always has content in the mock
const daysFromNow = (days: number, hourUtc: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hourUtc, 0, 0, 0);
  return date.toISOString();
};

export const MOCK_COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'e1',
    title: 'Live Hook Workshop',
    description:
      'A live session breaking down what makes a hook actually stop the scroll, with real examples.',
    date: daysFromNow(2, 17),
    attendeeCount: 128,
    createdBy: MOCK_USER_PRIYA,
  },
  {
    id: 'e2',
    title: 'Creator Q&A: Editing on a Budget',
    description: 'Ask your editing questions, tool recommendations included.',
    date: daysFromNow(9, 19),
    attendeeCount: 64,
    createdBy: MOCK_USER_LEO,
  },
  {
    id: 'e3',
    title: 'Monthly Content Sprint Kickoff',
    date: daysFromNow(16, 15),
    attendeeCount: 41,
    createdBy: MOCK_USER_SAM,
  },
  {
    id: 'e4',
    title: 'Brand Deals 101 with the Founders',
    description: 'How to pitch brands, price your work and read a contract.',
    date: daysFromNow(-5, 18),
    attendeeCount: 203,
    createdBy: MOCK_USER_SAM,
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user: MOCK_USER_PRIYA, points: 4820 },
  { rank: 2, user: MOCK_USER_MAYA, points: 4210 },
  { rank: 3, user: MOCK_USER_LEO, points: 3990 },
  { rank: 4, user: MOCK_USER_SAM, points: 3105 },
  {
    rank: 5,
    user: {
      id: 'u5',
      username: 'nina_films',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina',
    },
    points: 2870,
  },
  {
    rank: 6,
    user: {
      id: 'u6',
      username: 'theo_hooks',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Theo',
    },
    points: 2440,
  },
];
