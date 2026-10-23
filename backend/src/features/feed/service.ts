import { randomUUID } from 'crypto';
import { Prisma, UserRole } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { supabaseAdmin, COMMUNITY_BUCKET } from '../../lib/supabase-admin';
import { can } from '../../lib/permissions';
import { logActivity } from '../../lib/activity';
import { countApprovedReviewedPosts, isOnProbation, reviewerEligibility } from '../../lib/review';
import { getSettings } from '../../lib/settings';
import { findFlaggedWord } from '../../lib/contentFilter';
import { awardPoints, badgesSelect, flattenBadges, revokePoints } from '../../lib/gamification';
import { AccessViewer, accessByResource, describeLock, evaluateRule, getRule, lockedResourceIds } from '../../lib/access';
import type { AuthenticatedUser } from '../../middleware/auth.middleware';
import { CreatePostInput, EditPostInput, FeedError, ReportInput } from './model';
import { localizeRecord } from '../../lib/localize';

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
  ...badgesSelect,
} satisfies Prisma.UserProfileSelect;

/** Authors come with their latest badges, flattened for display next to the name. */
const flattenAuthor = flattenBadges;

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
  author: flattenAuthor(post.author),
  title: post.title ?? undefined,
  content: post.content,
  coverUrl: post.coverUrl ?? undefined,
  images: post.images.length ? post.images : undefined,
  pinned: post.pinned,
  reviewStatus: post.reviewStatus,
  // The reviewer's note is only for the author
  reviewNote: post.authorId === viewerId ? post.reviewNote ?? undefined : undefined,
  // Held by the word filter: the author is told it's waiting for the team
  heldForReview: post.authorId === viewerId && Boolean(post.heldReason) ? true : undefined,
  editedAt: post.editedAt ?? undefined,
  editedByStaff: post.editedByStaff || undefined,
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
async function getLivePost(
  postId: string,
  { allowUnpublished = false, viewer }: { allowUnpublished?: boolean; viewer?: AccessViewer } = {},
) {
  const post = await prisma.communityPost.findFirst({
    where: { id: postId, deletedAt: null, ...(allowUnpublished ? {} : { reviewStatus: 'PUBLISHED' }) },
    select: { id: true, authorId: true, title: true, content: true, reviewedById: true, spaceId: true },
  });
  if (!post) throw new FeedError(404, 'Post not found');
  // Posts in a space the viewer can't open don't exist for them (authors keep their own)
  if (viewer && post.authorId !== viewer.id && (await isSpaceLocked(post.spaceId, viewer))) {
    throw new FeedError(404, 'Post not found');
  }
  return post;
}

async function isSpaceLocked(spaceId: string, viewer: AccessViewer) {
  return (await evaluateRule(await getRule('space', spaceId), viewer)).locked;
}

async function getPostForViewer(postId: string, viewerId: string) {
  const post = await prisma.communityPost.findUniqueOrThrow({
    where: { id: postId },
    include: postInclude(viewerId),
  });
  return toPostDto(post, viewerId);
}

// ─── Spaces ──────────────────────────────────────────────────────────────────

export async function listSpaces(viewer: AccessViewer) {
  const [spaces, counts] = await Promise.all([
    prisma.communitySpace.findMany({ where: { archivedAt: null }, orderBy: { position: 'asc' } }),
    prisma.communityPost.groupBy({
      by: ['spaceId'],
      where: { deletedAt: null, reviewStatus: 'PUBLISHED' },
      _count: { _all: true },
    }),
  ]);
  const countBySpace = new Map(counts.map((count) => [count.spaceId, count._count._all]));
  const access = await accessByResource('space', viewer);
  return spaces.map((space) => ({
    ...space,
    postCount: countBySpace.get(space.id) ?? 0,
    // Locked spaces stay listed so members can see what they'd unlock
    access: access.get(space.id) ?? { locked: false, reasons: [] },
  }));
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function listPosts(
  viewer: AccessViewer,
  { spaceId, authorId, cursor, limit }: { spaceId?: string; authorId?: string; cursor?: string; limit: number },
) {
  const viewerId = viewer.id;
  if (spaceId) {
    const access = await evaluateRule(await getRule('space', spaceId), viewer);
    if (access.locked) throw new FeedError(403, describeLock(access));
  }
  const locked = await lockedResourceIds('space', viewer);
  const posts = await prisma.communityPost.findMany({
    where: {
      deletedAt: null,
      ...(spaceId ? { spaceId } : locked.length ? { spaceId: { notIn: locked } } : {}),
      ...(authorId ? { authorId } : {}),
      // Everyone sees published posts; authors also see their own posts waiting for (or refused at) review
      OR: [{ reviewStatus: 'PUBLISHED' }, { authorId: viewerId }],
    },
    // Pinned posts first on the timeline (not on a profile); id breaks ties so the cursor is stable
    orderBy: authorId ? [{ createdAt: 'desc' }, { id: 'desc' }] : [{ pinned: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
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
export async function listTopPosts(viewer: AccessViewer, limit = 5) {
  const since = new Date(Date.now() - TOP_POSTS_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const locked = await lockedResourceIds('space', viewer);
  const recent = await prisma.communityPost.findMany({
    where: {
      deletedAt: null,
      reviewStatus: 'PUBLISHED',
      createdAt: { gte: since },
      ...(locked.length ? { spaceId: { notIn: locked } } : {}),
    },
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

export async function createPost(author: AccessViewer, input: CreatePostInput) {
  const authorId = author.id;
  const space = await prisma.communitySpace.findUnique({ where: { id: input.spaceId } });
  if (!space) throw new FeedError(400, 'This space does not exist');
  const spaceName = localizeRecord(space).name;
  if (space.archivedAt) throw new FeedError(400, `${spaceName} is archived and closed to new posts`);
  const spaceAccess = await evaluateRule(await getRule('space', space.id), author);
  if (spaceAccess.locked) throw new FeedError(403, `${spaceName}: ${describeLock(spaceAccess)}`);
  if (space.adminOnly && !isModerator(author)) {
    throw new FeedError(403, `Only the team can post in ${spaceName}`);
  }
  const profile = await prisma.userProfile.findUniqueOrThrow({
    where: { id: authorId },
    select: { role: true, specialMember: true, probationCompletedAt: true },
  });
  const needsReview = await isOnProbation(profile);
  const flagged = isModerator(author) ? null : await flaggedWordIn(`${input.title ?? ''}\n${input.content}`);

  const post = await prisma.communityPost.create({
    data: {
      spaceId: space.id,
      authorId,
      reviewStatus: needsReview || flagged ? 'PENDING' : 'PUBLISHED',
      heldReason: flagged ? `Contains “${flagged}”` : null,
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
  // Posts waiting for review score once approved
  if (post.reviewStatus === 'PUBLISHED') {
    await awardPoints({ userId: authorId, action: 'POST_PUBLISHED', sourceType: 'post', sourceId: post.id });
  }
  return toPostDto(post, authorId);
}

export async function deletePost(actor: Actor, postId: string) {
  // Authors can withdraw a post that's still waiting for (or was refused at) review
  const post = await getLivePost(postId, { allowUnpublished: true });
  const isOwn = post.authorId === actor.id;
  if (!isOwn && !isModerator(actor)) {
    throw new FeedError(403, 'You can only delete your own posts');
  }
  await prisma.communityPost.update({ where: { id: postId }, data: { deletedAt: new Date(), deletedById: actor.id } });
  // A deleted post doesn't keep its points (no post-and-delete farming)
  await revokePoints({ userId: post.authorId, action: 'POST_PUBLISHED', sourceId: postId });
  if (!isOwn) {
    await awardPoints({ userId: post.authorId, action: 'POST_REMOVED_BY_TEAM', sourceType: 'post', sourceId: postId });
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
      await awardPoints({ userId: post.reviewedById, action: 'VOUCHED_POST_REMOVED', sourceType: 'post', sourceId: postId });
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

export async function setLiked(viewer: AccessViewer, postId: string, liked: boolean) {
  const userId = viewer.id;
  const post = await getLivePost(postId, { viewer });
  // The author earns a point per like from someone else
  const likeSource = { userId: post.authorId, action: 'LIKE_RECEIVED' as const, sourceId: `${postId}:${userId}` };
  if (liked) {
    try {
      await prisma.$transaction([
        prisma.communityPostLike.create({ data: { postId, userId } }),
        prisma.communityPost.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } }),
      ]);
      if (post.authorId !== userId) await awardPoints({ ...likeSource, sourceType: 'like' });
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
    await revokePoints(likeSource);
  }
  const { likeCount } = await prisma.communityPost.findUniqueOrThrow({
    where: { id: postId },
    select: { likeCount: true },
  });
  return { likedByMe: liked, likeCount };
}

export async function setBookmarked(viewer: AccessViewer, postId: string, bookmarked: boolean) {
  const userId = viewer.id;
  await getLivePost(postId, { viewer });
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

export async function vote(viewer: AccessViewer, postId: string, optionId: string) {
  const userId = viewer.id;
  await getLivePost(postId, { viewer });
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

const commentSelect = {
  id: true,
  postId: true,
  content: true,
  createdAt: true,
  editedAt: true,
  editedByStaff: true,
  heldReason: true,
  author: { select: authorSelect },
} satisfies Prisma.CommunityCommentSelect;

const toCommentDto = (
  { heldReason, ...comment }: Prisma.CommunityCommentGetPayload<{ select: typeof commentSelect }>,
) => ({
  ...comment,
  author: flattenAuthor(comment.author),
  editedAt: comment.editedAt ?? undefined,
  editedByStaff: comment.editedByStaff || undefined,
  heldForReview: heldReason ? true : undefined,
});

export async function listComments(viewer: AccessViewer, postId: string) {
  const viewerId = viewer.id;
  await getLivePost(postId, { viewer });
  const comments = await prisma.communityComment.findMany({
    // Held comments are only visible to their author until the team releases them
    where: { postId, deletedAt: null, OR: [{ heldReason: null }, { authorId: viewerId }] },
    orderBy: { createdAt: 'asc' },
    take: 200,
    select: commentSelect,
  });
  return comments.map(toCommentDto);
}

export async function createComment(author: AccessViewer, postId: string, content: string) {
  await getLivePost(postId, { viewer: author });
  const flagged = isModerator(author) ? null : await flaggedWordIn(content);
  const comment = await prisma.communityComment.create({
    data: { postId, authorId: author.id, content, heldReason: flagged ? `Contains “${flagged}”` : null },
    select: commentSelect,
  });
  // Held comments only count once released
  if (!flagged) {
    await prisma.communityPost.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } });
    await awardPoints({ userId: author.id, action: 'COMMENT_ADDED', sourceType: 'comment', sourceId: comment.id });
  }
  return toCommentDto(comment);
}

export async function editComment(actor: Actor, commentId: string, content: string) {
  const comment = await prisma.communityComment.findFirst({
    where: { id: commentId, deletedAt: null },
    select: { authorId: true, postId: true, heldReason: true },
  });
  if (!comment) throw new FeedError(404, 'Comment not found');
  const isOwn = comment.authorId === actor.id;
  if (!isOwn && !isModerator(actor)) throw new FeedError(403, 'You can only edit your own comments');

  // An author adding a flagged word sends the comment back for review
  const flagged = isOwn && !isModerator(actor) ? await flaggedWordIn(content) : null;
  const newlyHeld = Boolean(flagged) && !comment.heldReason;
  const updated = await prisma.communityComment.update({
    where: { id: commentId },
    data: {
      content,
      editedAt: new Date(),
      editedByStaff: !isOwn,
      ...(flagged ? { heldReason: `Contains “${flagged}”` } : {}),
    },
    select: commentSelect,
  });
  if (newlyHeld) {
    await prisma.communityPost.update({ where: { id: comment.postId }, data: { commentCount: { decrement: 1 } } });
  }
  if (!isOwn) {
    await logActivity({
      actorId: actor.id,
      action: 'comment.edited',
      targetType: 'comment',
      targetId: commentId,
      targetLabel: snippet(content),
      details: { authorId: comment.authorId, postId: comment.postId },
    });
  }
  return toCommentDto(updated);
}

export async function deleteComment(actor: Actor, commentId: string) {
  const comment = await prisma.communityComment.findFirst({
    where: { id: commentId, deletedAt: null },
    select: { authorId: true, postId: true, content: true, heldReason: true },
  });
  if (!comment) throw new FeedError(404, 'Comment not found');
  const isOwn = comment.authorId === actor.id;
  if (!isOwn && !isModerator(actor)) {
    throw new FeedError(403, 'You can only delete your own comments');
  }
  await prisma.$transaction([
    prisma.communityComment.update({
      where: { id: commentId },
      data: { deletedAt: new Date(), deletedById: actor.id },
    }),
    // Held comments were never counted
    ...(comment.heldReason
      ? []
      : [prisma.communityPost.update({ where: { id: comment.postId }, data: { commentCount: { decrement: 1 } } })]),
  ]);
  await revokePoints({ userId: comment.authorId, action: 'COMMENT_ADDED', sourceId: commentId });
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

// ─── Editing posts ───────────────────────────────────────────────────────────

export async function editPost(actor: Actor, postId: string, input: EditPostInput) {
  const post = await getLivePost(postId, { allowUnpublished: true });
  const isOwn = post.authorId === actor.id;
  if (!isOwn && !isModerator(actor)) throw new FeedError(403, 'You can only edit your own posts');

  const title = input.title === undefined ? post.title : input.title || null;
  const content = input.content ?? post.content;
  if (!title && !content) throw new FeedError(400, 'Add a title or some text');

  // An author adding a flagged word sends the post back for review
  const flagged = isOwn && !isModerator(actor) ? await flaggedWordIn(`${title ?? ''}\n${content}`) : null;
  await prisma.communityPost.update({
    where: { id: postId },
    data: {
      title,
      content,
      editedAt: new Date(),
      editedByStaff: !isOwn,
      ...(flagged ? { reviewStatus: 'PENDING', heldReason: `Contains “${flagged}”` } : {}),
    },
  });
  if (!isOwn) {
    await logActivity({
      actorId: actor.id,
      action: 'post.edited',
      targetType: 'post',
      targetId: postId,
      targetLabel: snippet(title || content),
      details: { authorId: post.authorId },
    });
  }
  return getPostForViewer(postId, actor.id);
}

// ─── Reports ─────────────────────────────────────────────────────────────────

const REPORTED_ALREADY = 'You already reported this. The team will look at it.';

export async function reportPost(reporter: AccessViewer, postId: string, input: ReportInput) {
  const post = await getLivePost(postId, { viewer: reporter });
  if (post.authorId === reporter.id) throw new FeedError(400, "You can't report your own post");
  try {
    await prisma.contentReport.create({ data: { reporterId: reporter.id, postId, reason: input.reason, note: input.note } });
  } catch (error) {
    if (isUniqueViolation(error)) throw new FeedError(409, REPORTED_ALREADY);
    throw error;
  }
  return { reported: true };
}

export async function reportComment(reporter: AccessViewer, commentId: string, input: ReportInput) {
  const comment = await prisma.communityComment.findFirst({
    where: { id: commentId, deletedAt: null, heldReason: null },
    select: { authorId: true, post: { select: { spaceId: true } } },
  });
  if (!comment || (await isSpaceLocked(comment.post.spaceId, reporter))) throw new FeedError(404, 'Comment not found');
  if (comment.authorId === reporter.id) throw new FeedError(400, "You can't report your own comment");
  try {
    await prisma.contentReport.create({ data: { reporterId: reporter.id, commentId, reason: input.reason, note: input.note } });
  } catch (error) {
    if (isUniqueViolation(error)) throw new FeedError(409, REPORTED_ALREADY);
    throw error;
  }
  return { reported: true };
}

async function flaggedWordIn(text: string) {
  const { flaggedWords } = await getSettings();
  return findFlaggedWord(text, flaggedWords);
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
    where: {
      deletedAt: null,
      reviewStatus: 'PENDING',
      authorId: { not: reviewer.id },
      // Posts held by the word filter are for staff only; peers never see spaces they can't open
      ...(isModerator(reviewer)
        ? {}
        : { heldReason: null, spaceId: { notIn: await lockedResourceIds('space', reviewer) } }),
    },
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
    select: { authorId: true, title: true, content: true, reviewStatus: true, heldReason: true },
  });
  if (!post) throw new FeedError(404, 'Post not found');
  if (post.authorId === reviewer.id) throw new FeedError(403, "You can't review your own post");
  if (post.heldReason && !isModerator(reviewer)) {
    throw new FeedError(403, 'Only the team can review posts held by the filter');
  }

  const now = new Date();
  // Only one reviewer wins if two decide at the same time
  const { count } = await prisma.communityPost.updateMany({
    where: { id: postId, reviewStatus: 'PENDING' },
    data: {
      reviewStatus: decision,
      reviewedById: reviewer.id,
      reviewedAt: now,
      reviewNote: note || null,
      heldReason: null,
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

  await awardPoints({ userId: reviewer.id, action: 'POST_REVIEWED', sourceType: 'post', sourceId: postId });
  if (decision === 'PUBLISHED') {
    await awardPoints({ userId: post.authorId, action: 'POST_PUBLISHED', sourceType: 'post', sourceId: postId });
  }

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
