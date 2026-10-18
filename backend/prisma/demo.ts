/**
 * Demo data for trying the app: members, posts, polls, likes and comments.
 *
 *   yarn demo:seed   replaces any existing demo data with a fresh set
 *   yarn demo:clear  removes all demo data
 *
 * Demo members use the DEMO_EMAIL_DOMAIN; clearing deletes only those profiles
 * (their posts, comments, likes and votes cascade), so real data is untouched.
 * Demo members can't log in: they have no Supabase Auth account.
 */
import { PrismaClient, UserProfile } from '@prisma/client';

const prisma = new PrismaClient();

export const DEMO_EMAIL_DOMAIN = 'demo.wegoviral.test';

const MEMBERS = [
  { username: 'maya.creates', name: 'Maya Chen' },
  { username: 'leo_edits', name: 'Leo Martins' },
  { username: 'priya.grows', name: 'Priya Nair' },
  { username: 'sam_shoots', name: 'Sam Okafor' },
  { username: 'ines.talks', name: 'Inès Haddad' },
  { username: 'tom.daily', name: 'Tom Becker' },
];

type DemoPost = {
  author: number; // index in MEMBERS
  spaceId: string;
  title?: string;
  content: string;
  cover?: string; // picsum seed
  images?: string[]; // picsum seeds
  poll?: string[];
  hoursAgo: number;
  likedBy: number[];
  comments: [number, string][];
};

const POSTS: DemoPost[] = [
  {
    author: 2, spaceId: 'introductions', hoursAgo: 3,
    content: "Hi everyone 👋 I'm Priya, I make productivity content on TikTok and YouTube Shorts. Currently trying to crack long-form. Happy to be here!",
    likedBy: [0, 1, 3, 4], comments: [[0, 'Welcome Priya! Long-form is a whole different game, ask away 🙌'], [4, 'Love your shorts, welcome!']],
  },
  {
    author: 0, spaceId: 'wins', hoursAgo: 6, title: '100k views on a Reel I almost deleted',
    content: 'Just hit 100k on a Reel I almost didn\'t post. The hook was "Nobody tells you this about..." Anyone else noticing curiosity hooks outperforming everything lately?',
    cover: 'wgv-demo-win', likedBy: [1, 2, 3, 4, 5], comments: [[1, 'Huge! Curiosity hooks are carrying my account too.'], [3, 'Congrats 🔥 what was the topic?'], [0, '@sam_shoots budgeting for students!']],
  },
  {
    author: 1, spaceId: 'feedback', hoursAgo: 10, title: 'Rate my editing workflow',
    content: 'Cut everything on beat, captions under 4 words per line, never let a shot sit longer than 2 seconds. What would you change?',
    likedBy: [0, 5], comments: [[5, 'Try varying shot length on purpose, it creates rhythm.']],
  },
  {
    author: 5, spaceId: 'questions', hoursAgo: 20, title: 'Posting across time zones?',
    content: 'My audience is split between the US and Europe. How do you all pick posting times?',
    poll: ['Post for the US audience', 'Post for the EU audience', 'Alternate days'], likedBy: [2], comments: [],
  },
  {
    author: 3, spaceId: 'monetization', hoursAgo: 30, title: 'First brand deal at 8k followers 🎉',
    content: 'They found me through a niche hashtag. $350 for 1 Reel + 3 stories. Was that fair?',
    likedBy: [0, 1, 2, 4, 5], comments: [[2, 'Fair for a first deal. Next time ask for usage rights terms in writing.'], [4, 'Congrats!! Niche hashtags are underrated.']],
  },
  {
    author: 4, spaceId: 'collabs', hoursAgo: 40, title: 'Collab: food or fitness creator for a duet series',
    content: 'Looking for a food or fitness creator (10k–50k) for a duet series next month. I handle editing, you bring the recipes. DM me!',
    likedBy: [1], comments: [[1, 'Sent you a DM 👀']],
  },
  {
    author: 0, spaceId: 'hooks', hoursAgo: 50, title: 'This hook took my 3s retention from 41% to 63%',
    content: '"I wasted 2 years doing this wrong so you don\'t have to." Steal it 👀',
    cover: 'wgv-demo-hook', likedBy: [1, 2, 3, 5], comments: [[5, 'Testing this tomorrow.']],
  },
  {
    author: 3, spaceId: 'gear', hoursAgo: 70,
    content: 'Upgraded from my phone mic to a $25 lavalier and the comments about audio quality disappeared overnight. Best investment so far.',
    images: ['wgv-demo-mic-1', 'wgv-demo-mic-2'], likedBy: [0, 4], comments: [],
  },
  {
    author: 2, spaceId: 'challenges', hoursAgo: 90,
    content: "Day 12/30 of the posting challenge ✅ Haven't missed a day yet. Who else is still in?",
    likedBy: [0, 1, 3, 4, 5], comments: [[5, 'Day 11 here 💪'], [3, 'Still in!']],
  },
  {
    author: 5, spaceId: 'editing', hoursAgo: 110,
    content: 'CapCut vs Premiere for short-form: I switched to CapCut for anything under 60s and cut my editing time in half.',
    likedBy: [1], comments: [[1, 'Premiere for anything client-facing, CapCut for my own stuff.']],
  },
  {
    author: 4, spaceId: 'offtopic', hoursAgo: 130,
    content: 'What are you all listening to while editing? Need a new playlist ☕',
    likedBy: [0, 2], comments: [[0, 'Lo-fi beats, always.']],
  },
];

const picsum = (seed: string, width = 1200, height = 500) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

async function clearDemo() {
  const { count } = await prisma.userProfile.deleteMany({
    where: { email: { endsWith: `@${DEMO_EMAIL_DOMAIN}` } },
  });
  return count;
}

async function seedDemo() {
  const removed = await clearDemo();
  if (removed) console.log(`Removed ${removed} previous demo members`);

  const spaceIds = new Set((await prisma.communitySpace.findMany({ select: { id: true } })).map((s) => s.id));

  const members: UserProfile[] = [];
  for (const member of MEMBERS) {
    members.push(
      await prisma.userProfile.create({
        data: {
          email: `${member.username.replace(/\W/g, '')}@${DEMO_EMAIL_DOMAIN}`,
          username: member.username,
          name: member.name,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`,
          // Demo members are already part of the community
          joinStatus: 'APPROVED',
        },
      }),
    );
  }

  let postCount = 0;
  for (const post of POSTS) {
    if (!spaceIds.has(post.spaceId)) {
      console.warn(`Skipping a post: space "${post.spaceId}" doesn't exist`);
      continue;
    }
    const createdAt = new Date(Date.now() - post.hoursAgo * 60 * 60 * 1000);
    const created = await prisma.communityPost.create({
      data: {
        spaceId: post.spaceId,
        authorId: members[post.author].id,
        title: post.title,
        content: post.content,
        coverUrl: post.cover ? picsum(post.cover) : null,
        images: (post.images ?? []).map((seed) => picsum(seed, 800, 600)),
        createdAt,
        likeCount: post.likedBy.length,
        commentCount: post.comments.length,
        likes: { create: post.likedBy.map((index) => ({ userId: members[index].id })) },
        comments: {
          create: post.comments.map(([index, content], order) => ({
            authorId: members[index].id,
            content,
            createdAt: new Date(createdAt.getTime() + (order + 1) * 15 * 60 * 1000),
          })),
        },
        pollOptions: post.poll
          ? { create: post.poll.map((label, position) => ({ label, position })) }
          : undefined,
      },
      include: { pollOptions: true },
    });

    // A few demo votes so polls show results
    if (created.pollOptions.length) {
      const voters = members.filter((_, index) => index !== post.author).slice(0, 4);
      for (const [index, voter] of voters.entries()) {
        const option = created.pollOptions[index % created.pollOptions.length];
        await prisma.communityPollVote.create({ data: { postId: created.id, userId: voter.id, optionId: option.id } });
        await prisma.communityPollOption.update({ where: { id: option.id }, data: { voteCount: { increment: 1 } } });
      }
    }
    postCount++;
  }

  // Events: a few upcoming ones and a past one with a recording, with RSVPs
  const at = (days: number, hourUtc: number) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + days);
    date.setUTCHours(hourUtc, 0, 0, 0);
    return date;
  };
  const EVENTS = [
    { title: 'Live hook workshop', category: 'Workshops', days: 3, hour: 18, host: 0, going: [1, 2, 3], description: 'Bring 3 hooks; we rewrite them live together.', link: 'https://meet.google.com/demo-hooks' },
    { title: 'Brand deals Q&A with the founders', category: 'Q&A', days: 8, hour: 19, host: 2, going: [0, 1, 4, 5], capacity: 50, description: 'Pricing, contracts and how to pitch brands.', link: 'https://meet.google.com/demo-deals' },
    { title: 'Casablanca creators meetup', category: 'Meetups', days: 15, hour: 17, host: 4, going: [2], location: 'Café Bohème, Casablanca', description: 'Coffee and collabs, in person.' },
    { title: 'Editing speed-run: CapCut tricks', category: 'Workshops', days: 22, hour: 18, host: 1, going: [], description: 'Cut a Reel in 15 minutes.', link: 'https://meet.google.com/demo-edit' },
    { title: 'Monthly content sprint kickoff', category: 'Challenges', days: -6, hour: 18, host: 3, going: [0, 2, 5], description: '30 days, one post a day.', link: 'https://meet.google.com/demo-sprint', recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  ];
  for (const event of EVENTS) {
    const startsAt = at(event.days, event.hour);
    await prisma.communityEvent.create({
      data: {
        title: event.title,
        description: event.description,
        category: event.category,
        startsAt,
        endsAt: new Date(startsAt.getTime() + 90 * 60 * 1000),
        timezone: 'Africa/Casablanca',
        locationType: event.location ? 'IN_PERSON' : 'ONLINE',
        location: event.location ?? null,
        link: event.link ?? null,
        capacity: event.capacity ?? null,
        status: 'PUBLISHED',
        recordingUrl: event.recordingUrl ?? null,
        hostId: members[event.host].id,
        rsvps: { create: event.going.map((index) => ({ userId: members[index].id })) },
      },
    });
  }

  console.log(`Seeded ${members.length} demo members, ${postCount} posts and ${EVENTS.length} events`);
}

const command = process.argv[2];

(command === 'clear'
  ? clearDemo().then((count) => console.log(`Removed ${count} demo members and their content`))
  : command === 'seed'
    ? seedDemo()
    : Promise.reject(new Error('Usage: demo.ts seed|clear')))
  .catch((error) => {
    console.error('❌', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
