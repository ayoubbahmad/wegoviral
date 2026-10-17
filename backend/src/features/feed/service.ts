import { randomUUID } from 'crypto';
import { Prisma, UserRole } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { supabaseAdmin, COMMUNITY_BUCKET } from '../../lib/supabase-admin';
import { can } from '../../lib/permissions';
import { logActivity } from '../../lib/activity';
import { countApprovedReviewedPosts, isOnProbation, reviewerEligibility } from '../../lib/review';
import { getSettings } from '../../lib/settings';
import type { AuthenticatedUser } from '../../middleware/auth.middleware';
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

const toPostDto = (post: PostWithViewer, viewerId: string) => ({
  id: post.id,
  spaceId: post.spaceId,
  author: post.author,
  title: post.title ?? undefined,
  content: post.content,
  coverUrl: post.coverUrl ?? undefined,
  images: post.images.length ? post.images : undefined,
  pinned: post.pinned,
  reviewStatus: post.reviewStatus,
  // The reviewer's note is only for the author
  reviewNote: post.authorId === viewerId ? post.reviewNote ?? undefined : undefined,
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

/** A post others can see. Posts waiting for review only exist for their author (and reviewers). */
async function getLivePost(postId: string, { allowUnpublished = false } = {}) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, deletedAt: null, ...(allowUnpublished ? {} : { reviewStatus: 'PUBLISHED' }) },
    select: { id: true, authorId: true, title: true, content: true, reviewedById: true },
  });
  if (!post) throw new FeedError(404, 'Post not found');
  return post;
}

async function getPostForViewer(postId: string, viewerId: string) {
  const post = await prisma.communityPost.findUniqueOrThrow({
    where: { id: postId },
    include: postInclude(viewerId),
  });
  return toPostDto(post, viewerId);
}

// ─── Spaces ──────────────────────────────────────────────────────────────────

export async function listSpaces() {
  const [spaces, counts] = await Promise.all([
    prisma.communitySpace.findMany({ orderBy: { position: 'asc' } }),
    prisma.communityPost.groupBy({
      by: ['spaceId'],
      where: { deletedAt: null, reviewStatus: 'PUBLISHED' },
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
    where: {
      deletedAt: null,
      ...(spaceId ? { spaceId } : {}),
      // Everyone sees published posts; authors also see their own posts waiting for (or refused at) review
      OR: [{ reviewStatus: 'PUBLISHED' }, { authorId: viewerId }],
    },
    // Pinned posts first; id breaks ties so the cursor is stable
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: postInclude(viewerId),
  });

  const hasMore = posts.length > limit;
  const page = hasMore ? posts.slice(0, limit) : posts;
  return {
    posts: page.map((post) => toPostDto(post, viewerId)),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  };
}

/** Most engaged recent posts; comments weigh double since they signal conversation. */
export async function listTopPosts(limit = 5) {
  const since = new Date(Date.now() - TOP_POSTS_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const recent = await prisma.communityPost.findMany({
    where: { deletedAt: null, reviewStatus: 'PUBLISHED', createdAt: { gte: since } },
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
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: { id: authorId },
    select: { role: true, specialMember: true, probationCompletedAt: true },
  });
  const needsReview = await isOnProbation(profile);

  const post = await prisma.communityPost.create({
    data: {
      spaceId: space.id,
      authorId,
      reviewStatus: needsReview ? 'PENDING' : 'PUBLISHED',
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
  return toPostDto(post, authorId);
}

export async function deletePost(actor: Actor, postId: string) {
  // Authors can withdraw a post that's still waiting for (or was refused at) review
  const post = await getLivePost(postId, { allowUnpublished: true });
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
    // Responsibility trail: the member who approved this post during review vouched for it
    if (post.reviewedById && post.reviewedById !== actor.id) {
      await logActivity({
        actorId: actor.id,
        action: 'member.vouched_post_removed',
        targetType: 'member',
        targetId: post.reviewedById,
        targetLabel: snippet(post.title || post.content),
        details: { postId, authorId: post.authorId },
      });
    }
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

// ─── Post review (probation) ─────────────────────────────────────────────────

async function assertCanReview(reviewer: AuthenticatedUser) {
  const { canReview, reason } = await reviewerEligibility(reviewer);
  if (!canReview) throw new FeedError(403, reason ?? "You can't review posts yet");
}

/** Posts waiting for review, oldest first; never the reviewer's own. */
export async function listPendingReviews(reviewer: AuthenticatedUser) {
  await assertCanReview(reviewer);
  const posts = await prisma.communityPost.findMany({
    where: { deletedAt: null, reviewStatus: 'PENDING', authorId: { not: reviewer.id } },
    orderBy: { createdAt: 'asc' },
    take: 50,
    include: postInclude(reviewer.id),
  });
  return posts.map((post) => toPostDto(post, reviewer.id));
}

export async function reviewPost(
  reviewer: AuthenticatedUser,
  postId: string,
  decision: 'PUBLISHED' | 'REJECTED',
  note?: string,
) {
  await assertCanReview(reviewer);
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, deletedAt: null },
    select: { authorId: true, title: true, content: true, reviewStatus: true },
  });
  if (!post) throw new FeedError(404, 'Post not found');
  if (post.authorId === reviewer.id) throw new FeedError(403, "You can't review your own post");

  const now = new Date();
  // Only one reviewer wins if two decide at the same time
  const { count } = await prisma.communityPost.updateMany({
    where: { id: postId, reviewStatus: 'PENDING' },
    data: {
      reviewStatus: decision,
      reviewedById: reviewer.id,
      reviewedAt: now,
      reviewNote: note || null,
      // An approved post goes live now, so it appears at the top of the feed
      ...(decision === 'PUBLISHED' ? { createdAt: now } : {}),
    },
  });
  if (!count) throw new FeedError(409, 'This post has already been reviewed');

  await logActivity({
    actorId: reviewer.id,
    action: decision === 'PUBLISHED' ? 'post.approved' : 'post.rejected',
    targetType: 'post',
    targetId: postId,
    targetLabel: snippet(post.title || post.content),
    details: { authorId: post.authorId, ...(note ? { note } : {}) },
  });

  // Enough approved posts: the author's probation is over
  if (decision === 'PUBLISHED') {
    const [{ probationPostCount }, approved] = await Promise.all([
      getSettings(),
      countApprovedReviewedPosts(post.authorId),
    ]);
    if (approved >= probationPostCount) {
      await prisma.userProfile.updateMany({
        where: { id: post.authorId, probationCompletedAt: null },
        data: { probationCompletedAt: now },
      });
    }
  }
  return { reviewStatus: decision };
}
