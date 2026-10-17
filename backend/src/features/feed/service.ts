import { randomUUID } from 'crypto';
import { Prisma, UserRole } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { supabaseAdmin, COMMUNITY_BUCKET } from '../../lib/supabase-admin';
import { can } from '../../lib/permissions';
import { logActivity } from '../../lib/activity';
import { CreatePostInput, FeedError } from './model';

/** The signed-in member performing an action. */
export interface Actor {
  id: string;
  role: UserRole;
}

const isModerator = (actor: Actor) => can(actor.role, 'community.moderate');
const snippet = (text: string | null | undefined) => (text ?? '').slice(0, 80);
const TOP_POSTS_WINDOW_DAYS = 30;

const authorSelect = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
  role: true,
} satisfies Prisma.UserProfileSelect;

/** Everything needed to render a post for one viewer. */
const postInclude = (viewerId: string) =>
  ({
    author: { select: authorSelect },
    likes: { where: { userId: viewerId }, select: { userId: true } },
    bookmarks: { where: { userId: viewerId }, select: { userId: true } },
    pollOptions: { orderBy: { position: 'asc' } },
    pollVotes: { where: { userId: viewerId }, select: { optionId: true } },
  }) satisfies Prisma.CommunityPostInclude;

type PostWithViewer = Prisma.CommunityPostGetPayload<{
  include: ReturnType<typeof postInclude>;
}>;

const toPostDto = (post: PostWithViewer) => ({
  id: post.id,
  spaceId: post.spaceId,
  author: post.author,
  title: post.title ?? undefined,
  content: post.content,
  coverUrl: post.coverUrl ?? undefined,
  images: post.images.length ? post.images : undefined,
  pinned: post.pinned,
  likeCount: post.likeCount,
  commentCount: post.commentCount,
  createdAt: post.createdAt,
  likedByMe: post.likes.length > 0,
  bookmarkedByMe: post.bookmarks.length > 0,
  poll: post.pollOptions.length
    ? {
        options: post.pollOptions.map((option) => ({
          id: option.id,
          label: option.label,
          votes: option.voteCount,
        })),
        votedOptionId: post.pollVotes[0]?.optionId,
      }
    : undefined,
});

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

async function getLivePost(postId: string) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, deletedAt: null },
    select: { id: true, authorId: true, title: true, content: true },
  });
  if (!post) throw new FeedError(404, 'Post not found');
  return post;
}

async function getPostForViewer(postId: string, viewerId: string) {
  const post = await prisma.communityPost.findUniqueOrThrow({
    where: { id: postId },
    include: postInclude(viewerId),
  });
  return toPostDto(post);
}

// ─── Spaces ──────────────────────────────────────────────────────────────────

export async function listSpaces() {
  const [spaces, counts] = await Promise.all([
    prisma.communitySpace.findMany({ orderBy: { position: 'asc' } }),
    prisma.communityPost.groupBy({
      by: ['spaceId'],
      where: { deletedAt: null },
      _count: { _all: true },
    }),
  ]);
  const countBySpace = new Map(counts.map((count) => [count.spaceId, count._count._all]));
  return spaces.map((space) => ({ ...space, postCount: countBySpace.get(space.id) ?? 0 }));
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function listPosts(
  viewerId: string,
  { spaceId, cursor, limit }: { spaceId?: string; cursor?: string; limit: number },
) {
  const posts = await prisma.communityPost.findMany({
    where: { deletedAt: null, ...(spaceId ? { spaceId } : {}) },
    // Pinned posts first; id breaks ties so the cursor is stable
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: postInclude(viewerId),
  });

  const hasMore = posts.length > limit;
  const page = hasMore ? posts.slice(0, limit) : posts;
  return {
    posts: page.map(toPostDto),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  };
}

/** Most engaged recent posts; comments weigh double since they signal conversation. */
export async function listTopPosts(limit = 5) {
  const since = new Date(Date.now() - TOP_POSTS_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const recent = await prisma.communityPost.findMany({
    where: { deletedAt: null, createdAt: { gte: since } },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      spaceId: true,
      title: true,
      content: true,
      likeCount: true,
      commentCount: true,
      author: { select: { username: true } },
    },
  });
  return recent
    .map((post) => ({ ...post, score: post.likeCount + post.commentCount * 2 }))
    .filter((post) => post.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...post }) => ({ ...post, content: post.content.slice(0, 200) }));
}

export async function createPost(author: Actor, input: CreatePostInput) {
  const authorId = author.id;
  const space = await prisma.communitySpace.findUnique({ where: { id: input.spaceId } });
  if (!space) throw new FeedError(400, 'This space does not exist');
  if (space.adminOnly && !isModerator(author)) {
    throw new FeedError(403, `Only the team can post in ${space.name}`);
  }

  const post = await prisma.communityPost.create({
    data: {
      spaceId: space.id,
      authorId,
      title: input.title || null,
      content: input.content,
      coverUrl: input.coverUrl ?? null,
      images: input.images,
      pollOptions: input.pollOptions
        ? { create: input.pollOptions.map((label, position) => ({ label, position })) }
        : undefined,
    },
    include: postInclude(authorId),
  });
  return toPostDto(post);
}

export async function deletePost(actor: Actor, postId: string) {
  const post = await getLivePost(postId);
  const isOwn = post.authorId === actor.id;
  if (!isOwn && !isModerator(actor)) {
    throw new FeedError(403, 'You can only delete your own posts');
  }
  await prisma.communityPost.update({ where: { id: postId }, data: { deletedAt: new Date() } });
  if (!isOwn) {
    await logActivity({
      actorId: actor.id,
      action: 'post.deleted',
      targetType: 'post',
      targetId: postId,
      targetLabel: snippet(post.title || post.content),
      details: { authorId: post.authorId },
    });
  }
}

export async function setPinned(actor: Actor, postId: string, pinned: boolean) {
  if (!isModerator(actor)) throw new FeedError(403, 'Only the team can pin posts');
  const post = await getLivePost(postId);
  await prisma.communityPost.update({ where: { id: postId }, data: { pinned } });
  await logActivity({
    actorId: actor.id,
    action: pinned ? 'post.pinned' : 'post.unpinned',
    targetType: 'post',
    targetId: postId,
    targetLabel: snippet(post.title || post.content),
  });
  return getPostForViewer(postId, actor.id);
}

// ─── Reactions ───────────────────────────────────────────────────────────────

export async function setLiked(userId: string, postId: string, liked: boolean) {
  await getLivePost(postId);
  if (liked) {
    try {
      await prisma.$transaction([
        prisma.communityPostLike.create({ data: { postId, userId } }),
        prisma.communityPost.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } }),
      ]);
    } catch (error) {
      if (!isUniqueViolation(error)) throw error; // already liked: nothing to do
    }
  } else {
    await prisma.$transaction(async (tx) => {
      const { count } = await tx.communityPostLike.deleteMany({ where: { postId, userId } });
      if (count) {
        await tx.communityPost.update({ where: { id: postId }, data: { likeCount: { decrement: count } } });
      }
    });
  }
  const { likeCount } = await prisma.communityPost.findUniqueOrThrow({
    where: { id: postId },
    select: { likeCount: true },
  });
  return { likedByMe: liked, likeCount };
}

export async function setBookmarked(userId: string, postId: string, bookmarked: boolean) {
  await getLivePost(postId);
  if (bookmarked) {
    await prisma.communityBookmark.upsert({
      where: { postId_userId: { postId, userId } },
      create: { postId, userId },
      update: {},
    });
  } else {
    await prisma.communityBookmark.deleteMany({ where: { postId, userId } });
  }
  return { bookmarkedByMe: bookmarked };
}

export async function vote(userId: string, postId: string, optionId: string) {
  await getLivePost(postId);
  const option = await prisma.communityPollOption.findFirst({ where: { id: optionId, postId } });
  if (!option) throw new FeedError(400, 'This option is not part of the poll');

  try {
    await prisma.$transaction([
      prisma.communityPollVote.create({ data: { postId, userId, optionId } }),
      prisma.communityPollOption.update({ where: { id: optionId }, data: { voteCount: { increment: 1 } } }),
    ]);
  } catch (error) {
    if (isUniqueViolation(error)) throw new FeedError(409, 'You already voted on this poll');
    throw error;
  }
  return getPostForViewer(postId, userId);
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function listComments(postId: string) {
  await getLivePost(postId);
  return prisma.communityComment.findMany({
    where: { postId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    take: 200,
    select: { id: true, postId: true, content: true, createdAt: true, author: { select: authorSelect } },
  });
}

export async function createComment(authorId: string, postId: string, content: string) {
  await getLivePost(postId);
  const [comment] = await prisma.$transaction([
    prisma.communityComment.create({
      data: { postId, authorId, content },
      select: { id: true, postId: true, content: true, createdAt: true, author: { select: authorSelect } },
    }),
    prisma.communityPost.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } }),
  ]);
  return comment;
}

export async function deleteComment(actor: Actor, commentId: string) {
  const comment = await prisma.communityComment.findFirst({
    where: { id: commentId, deletedAt: null },
    select: { authorId: true, postId: true, content: true },
  });
  if (!comment) throw new FeedError(404, 'Comment not found');
  const isOwn = comment.authorId === actor.id;
  if (!isOwn && !isModerator(actor)) {
    throw new FeedError(403, 'You can only delete your own comments');
  }
  await prisma.$transaction([
    prisma.communityComment.update({ where: { id: commentId }, data: { deletedAt: new Date() } }),
    prisma.communityPost.update({
      where: { id: comment.postId },
      data: { commentCount: { decrement: 1 } },
    }),
  ]);
  if (!isOwn) {
    await logActivity({
      actorId: actor.id,
      action: 'comment.deleted',
      targetType: 'comment',
      targetId: commentId,
      targetLabel: snippet(comment.content),
      details: { authorId: comment.authorId, postId: comment.postId },
    });
  }
}

// ─── Uploads ─────────────────────────────────────────────────────────────────

const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/** Signed URL the browser uploads to directly, so files never pass through this server. */
export async function createImageUpload(userId: string, contentType: string) {
  const path = `posts/${userId}/${randomUUID()}.${EXTENSIONS[contentType]}`;
  const { data, error } = await supabaseAdmin.storage
    .from(COMMUNITY_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message || 'Could not create upload URL');

  const { data: publicUrl } = supabaseAdmin.storage.from(COMMUNITY_BUCKET).getPublicUrl(path);
  return { path, token: data.token, publicUrl: publicUrl.publicUrl };
}
