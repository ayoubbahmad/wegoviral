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
    case 'member.approved': {
      const via = details.via === 'invite' ? ` via the invite “${details.invite}”` : details.via === 'referral' ? ' through their referral link' : details.via === 'open_signup' ? ' (approval was off)' : '';
      return `approved ${target}${via}`;
    }
    case 'member.rejected':
      return `didn't approve ${target}${typeof details.note === 'string' ? ` — “${details.note}”` : ''}`;
    case 'member.special_granted':
      return `made ${target} a special member`;
    case 'member.special_removed':
      return `removed special-member status from ${target}`;
    case 'settings.updated':
      return `changed the joining rules (${Object.keys(details).join(', ')})`;
    case 'guide.published':
      return `published ${target}`;
    case 'quiz.updated':
      return `updated the community quiz (${details.questions} questions)`;
    case 'invite.created':
      return `created the invite link “${target}”${details.specialMember ? ' for special members' : ''}`;
    case 'invite.revoked':
      return `turned off the invite link “${target}”`;
    default:
      return `${entry.action.replace(/[._]/g, ' ')} ${target}`;
  }
}
