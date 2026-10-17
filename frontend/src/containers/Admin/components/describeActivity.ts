import { ROLE_LABELS, UserRole } from '@/lib/roles';
import { ActivityEntry } from '../types';

const formatUntil = (until: unknown) =>
  typeof until === 'string' ? `until ${new Date(until).toLocaleDateString()}` : 'indefinitely';

/** One readable sentence per log entry, without the actor's name (shown separately). */
export function describeActivity(entry: ActivityEntry): string {
  const target = entry.targetLabel ?? 'a member';
  const details = entry.details ?? {};
  const reason = typeof details.reason === 'string' ? ` — “${details.reason}”` : '';

  switch (entry.action) {
    case 'member.role_changed':
      return `changed ${target}'s role from ${ROLE_LABELS[details.from as UserRole] ?? details.from} to ${
        ROLE_LABELS[details.to as UserRole] ?? details.to
      }`;
    case 'member.muted':
      return `muted ${target} ${formatUntil(details.until)}${reason}`;
    case 'member.suspended':
      return `suspended ${target} ${formatUntil(details.until)}${reason}`;
    case 'member.banned':
      return `banned ${target}${reason}`;
    case 'member.restriction_lifted':
      return `lifted the restriction on ${target}`;
    case 'post.deleted':
      return `deleted a post: “${target}”`;
    case 'post.pinned':
      return `pinned a post: “${target}”`;
    case 'post.unpinned':
      return `unpinned a post: “${target}”`;
    case 'comment.deleted':
      return `deleted a comment: “${target}”`;
    default:
      return `${entry.action.replace(/[._]/g, ' ')} ${target}`;
  }
}
