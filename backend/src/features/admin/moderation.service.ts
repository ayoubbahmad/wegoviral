/** Admin tools for moderation: reports queue, held content, recently deleted, warnings. */
import { Prisma, ReportStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import { canManageMember } from '../../lib/permissions';
import { awardPoints, revokePoints } from '../../lib/gamification';
import * as feedService from '../feed/service';
import { restrictMember } from './service';
import type { Actor } from './service';
import { AdminError, ResolveReportsInput } from './model';

const RESTORE_WINDOW_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const snippet = (text: string | null | undefined) => (text ?? '').slice(0, 80);

const authorSelect = { id: true, username: true, name: true, avatarUrl: true, role: true } satisfies Prisma.UserProfileSelect;

// ─── Reports ─────────────────────────────────────────────────────────────────

/** Reports grouped by the post or comment they're about, most reported first. */
export async function listReports(status: ReportStatus) {
  const reports = await prisma.contentReport.findMany({
    where: { status },
    orderBy: { createdAt: status === 'OPEN' ? 'asc' : 'desc' },
    take: 300,
    include: {
      reporter: { select: { id: true, username: true } },
      resolvedBy: { select: { id: true, username: true } },
      post: {
        select: {
          id: true, title: true, content: true, coverUrl: true, images: true, spaceId: true, createdAt: true, deletedAt: true,
          author: { select: authorSelect },
        },
      },
      comment: {
        select: { id: true, content: true, postId: true, createdAt: true, deletedAt: true, author: { select: authorSelect } },
      },
    },
  });

  const groups = new Map<string, {
    targetType: 'post' | 'comment';
    targetId: string;
    post: (typeof reports)[number]['post'];
    comment: (typeof reports)[number]['comment'];
    reports: { id: string; reason: string; note: string | null; createdAt: Date; reporter: { id: string; username: string } }[];
    resolution: string | null;
    resolvedBy: { id: string; username: string } | null;
    resolvedAt: Date | null;
  }>();
  for (const report of reports) {
    const targetType = report.postId ? 'post' : 'comment';
    const targetId = (report.postId ?? report.commentId)!;
    const key = `${targetType}:${targetId}`;
    if (!groups.has(key)) {
      groups.set(key, {
        targetType,
        targetId,
        post: report.post,
        comment: report.comment,
        reports: [],
        resolution: report.resolution,
        resolvedBy: report.resolvedBy,
        resolvedAt: report.resolvedAt,
      });
    }
    groups.get(key)!.reports.push({
      id: report.id,
      reason: report.reason,
      note: report.note,
      createdAt: report.createdAt,
      reporter: report.reporter,
    });
  }
  return [...groups.values()].sort((a, b) =>
    status === 'OPEN' ? b.reports.length - a.reports.length : 0,
  );
}

async function getReportTarget(targetType: 'post' | 'comment', targetId: string) {
  if (targetType === 'post') {
    const post = await prisma.communityPost.findUnique({
      where: { id: targetId },
      select: { authorId: true, title: true, content: true, deletedAt: true },
    });
    if (!post) throw new AdminError(404, 'Post not found');
    return { authorId: post.authorId, label: snippet(post.title || post.content), deleted: Boolean(post.deletedAt) };
  }
  const comment = await prisma.communityComment.findUnique({
    where: { id: targetId },
    select: { authorId: true, content: true, deletedAt: true },
  });
  if (!comment) throw new AdminError(404, 'Comment not found');
  return { authorId: comment.authorId, label: snippet(comment.content), deleted: Boolean(comment.deletedAt) };
}

/**
 * Closes all open reports on one post or comment: dismiss them, or remove the
 * content, optionally also warning, muting or suspending the author.
 */
export async function resolveReports(actor: Actor, input: ResolveReportsInput) {
  const target = await getReportTarget(input.targetType, input.targetId);
  const where = input.targetType === 'post' ? { postId: input.targetId } : { commentId: input.targetId };
  const open = await prisma.contentReport.count({ where: { ...where, status: 'OPEN' } });
  if (!open) throw new AdminError(409, 'These reports were already handled');

  const steps: string[] = [];
  // The author action first: it's the step most likely to be refused (rank, limits)
  if (input.action === 'remove' && input.authorAction) {
    const { type, reason, durationDays } = input.authorAction;
    if (type === 'warn') {
      await issueWarning(actor, target.authorId, reason);
      steps.push('warned the author');
    } else {
      await restrictMember(actor, target.authorId, {
        status: type === 'mute' ? 'MUTED' : 'SUSPENDED',
        reason,
        durationDays: durationDays ?? null,
      });
      steps.push(`${type === 'mute' ? 'muted' : 'suspended'} the author`);
    }
  }
  if (input.action === 'remove' && !target.deleted) {
    if (input.targetType === 'post') await feedService.deletePost(actor, input.targetId);
    else await feedService.deleteComment(actor, input.targetId);
    steps.unshift(`removed the ${input.targetType}`);
  }

  const status: ReportStatus = input.action === 'dismiss' ? 'DISMISSED' : 'RESOLVED';
  const resolution = input.action === 'dismiss' ? 'No action needed' : steps.join(', ') || 'Already removed';
  await prisma.contentReport.updateMany({
    where: { ...where, status: 'OPEN' },
    data: { status, resolution: input.note ? `${resolution} — ${input.note}` : resolution, resolvedById: actor.id, resolvedAt: new Date() },
  });
  await logActivity({
    actorId: actor.id,
    action: input.action === 'dismiss' ? 'reports.dismissed' : 'reports.resolved',
    targetType: input.targetType,
    targetId: input.targetId,
    targetLabel: target.label,
    details: { reports: open, resolution, ...(input.note ? { note: input.note } : {}) },
  });
  return { status, resolution };
}

// ─── Warnings ────────────────────────────────────────────────────────────────

export async function issueWarning(actor: Actor, userId: string, reason: string) {
  if (actor.id === userId) throw new AdminError(403, "You can't warn yourself");
  const member = await prisma.userProfile.findUnique({ where: { id: userId }, select: { role: true, username: true, name: true } });
  if (!member) throw new AdminError(404, 'Member not found');
  if (!canManageMember(actor.role, member.role)) {
    throw new AdminError(403, "You can't warn someone with the same or a higher role");
  }
  const warning = await prisma.memberWarning.create({ data: { userId, issuedById: actor.id, reason } });
  await awardPoints({ userId, action: 'WARNING_RECEIVED', sourceType: 'warning', sourceId: warning.id });
  await logActivity({
    actorId: actor.id,
    action: 'member.warned',
    targetType: 'member',
    targetId: userId,
    targetLabel: member.name ? `${member.name} (@${member.username})` : `@${member.username}`,
    details: { reason },
  });
  return warning;
}

// ─── Held by the word filter ─────────────────────────────────────────────────

export async function listHeldContent() {
  const [posts, comments] = await Promise.all([
    prisma.communityPost.findMany({
      where: { deletedAt: null, reviewStatus: 'PENDING', heldReason: { not: null } },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, content: true, heldReason: true, createdAt: true, spaceId: true, author: { select: authorSelect } },
    }),
    prisma.communityComment.findMany({
      where: { deletedAt: null, heldReason: { not: null } },
      orderBy: { createdAt: 'asc' },
      select: { id: true, content: true, heldReason: true, createdAt: true, postId: true, author: { select: authorSelect } },
    }),
  ]);
  return { posts, comments };
}

export async function releaseComment(actor: Actor, commentId: string) {
  const comment = await prisma.communityComment.findFirst({
    where: { id: commentId, deletedAt: null, heldReason: { not: null } },
    select: { postId: true, content: true, authorId: true },
  });
  if (!comment) throw new AdminError(404, 'No held comment found');
  await prisma.$transaction([
    prisma.communityComment.update({ where: { id: commentId }, data: { heldReason: null } }),
    prisma.communityPost.update({ where: { id: comment.postId }, data: { commentCount: { increment: 1 } } }),
  ]);
  await awardPoints({ userId: comment.authorId, action: 'COMMENT_ADDED', sourceType: 'comment', sourceId: commentId });
  await logActivity({
    actorId: actor.id,
    action: 'comment.released',
    targetType: 'comment',
    targetId: commentId,
    targetLabel: snippet(comment.content),
    details: { authorId: comment.authorId },
  });
}

// ─── Recently deleted ────────────────────────────────────────────────────────

export async function listDeleted() {
  const since = new Date(Date.now() - RESTORE_WINDOW_DAYS * DAY_MS);
  const deletedBy = { select: { id: true, username: true } };
  const [posts, comments] = await Promise.all([
    prisma.communityPost.findMany({
      where: { deletedAt: { gte: since } },
      orderBy: { deletedAt: 'desc' },
      take: 100,
      select: { id: true, title: true, content: true, deletedAt: true, deletedById: true, spaceId: true, author: { select: authorSelect } },
    }),
    prisma.communityComment.findMany({
      where: { deletedAt: { gte: since } },
      orderBy: { deletedAt: 'desc' },
      take: 100,
      select: { id: true, content: true, deletedAt: true, deletedById: true, postId: true, author: { select: authorSelect } },
    }),
  ]);
  // Resolve who deleted each item (no relation on purpose: the field is just an audit trail)
  const ids = [...new Set([...posts, ...comments].map((item) => item.deletedById).filter(Boolean))] as string[];
  const people = await prisma.userProfile.findMany({ where: { id: { in: ids } }, ...deletedBy });
  const byId = new Map(people.map((person) => [person.id, person]));
  const withDeleter = <T extends { deletedById: string | null }>(item: T) => ({
    ...item,
    deletedBy: item.deletedById ? byId.get(item.deletedById) ?? null : null,
  });
  return { posts: posts.map(withDeleter), comments: comments.map(withDeleter), windowDays: RESTORE_WINDOW_DAYS };
}

export async function restoreContent(actor: Actor, targetType: 'post' | 'comment', id: string) {
  const since = new Date(Date.now() - RESTORE_WINDOW_DAYS * DAY_MS);
  if (targetType === 'post') {
    const post = await prisma.communityPost.findFirst({
      where: { id, deletedAt: { gte: since } },
      select: { title: true, content: true, authorId: true, reviewStatus: true },
    });
    if (!post) throw new AdminError(404, `Only posts deleted in the last ${RESTORE_WINDOW_DAYS} days can be restored`);
    await prisma.communityPost.update({ where: { id }, data: { deletedAt: null, deletedById: null } });
    // Undo the removal's effect on points
    await revokePoints({ action: 'POST_REMOVED_BY_TEAM', sourceId: id });
    await revokePoints({ action: 'VOUCHED_POST_REMOVED', sourceId: id });
    if (post.reviewStatus === 'PUBLISHED') {
      await awardPoints({ userId: post.authorId, action: 'POST_PUBLISHED', sourceType: 'post', sourceId: id });
    }
    await logActivity({ actorId: actor.id, action: 'post.restored', targetType: 'post', targetId: id, targetLabel: snippet(post.title || post.content) });
    return { restored: true };
  }
  const comment = await prisma.communityComment.findFirst({
    where: { id, deletedAt: { gte: since } },
    select: { content: true, postId: true, heldReason: true, authorId: true, post: { select: { deletedAt: true } } },
  });
  if (!comment) throw new AdminError(404, `Only comments deleted in the last ${RESTORE_WINDOW_DAYS} days can be restored`);
  if (comment.post.deletedAt) throw new AdminError(409, 'Restore the post first: this comment belongs to a deleted post');
  await prisma.$transaction([
    prisma.communityComment.update({ where: { id }, data: { deletedAt: null, deletedById: null } }),
    ...(comment.heldReason
      ? []
      : [prisma.communityPost.update({ where: { id: comment.postId }, data: { commentCount: { increment: 1 } } })]),
  ]);
  if (!comment.heldReason) {
    await awardPoints({ userId: comment.authorId, action: 'COMMENT_ADDED', sourceType: 'comment', sourceId: id });
  }
  await logActivity({ actorId: actor.id, action: 'comment.restored', targetType: 'comment', targetId: id, targetLabel: snippet(comment.content) });
  return { restored: true };
}
