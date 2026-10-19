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
    case 'post.approved':
      return `approved a new member's post: “${target}”`;
    case 'post.rejected':
      return `didn't approve a new member's post: “${target}”${typeof details.note === 'string' ? ` — “${details.note}”` : ''}`;
    case 'member.vouched_post_removed':
      return `removed a post this member had approved in review: “${target}”`;
    case 'member.referral_restricted':
      return `restricted ${target}, who joined through this member's referral link`;
    case 'reports.dismissed':
      return `dismissed ${details.reports} report${details.reports === 1 ? '' : 's'} on: “${target}”`;
    case 'reports.resolved':
      return `handled ${details.reports} report${details.reports === 1 ? '' : 's'} (${details.resolution}) on: “${target}”`;
    case 'member.warned':
      return `warned ${target}${reason}`;
    case 'post.edited':
      return `edited a post: “${target}”`;
    case 'comment.edited':
      return `edited a comment: “${target}”`;
    case 'post.restored':
      return `restored a post: “${target}”`;
    case 'comment.restored':
      return `restored a comment: “${target}”`;
    case 'comment.released':
      return `released a held comment: “${target}”`;
    case 'space.created':
      return `created the space ${target}`;
    case 'space.updated':
      return `edited the space ${target}`;
    case 'space.archived':
      return `archived the space ${target}`;
    case 'space.unarchived':
      return `brought back the space ${target}`;
    case 'spaces.reordered':
      return 'changed the order of the spaces';
    case 'tier.created':
      return `created the tier ${target}`;
    case 'tier.updated':
      return details.isDefault ? `made ${target} the default tier` : `edited the tier ${target}`;
    case 'tier.deleted':
      return `deleted the tier ${target}`;
    case 'member.tier_changed':
      return `moved ${target} from the ${details.from ?? 'default'} tier to ${details.to ?? 'the default tier'}`;
    case 'access.updated':
      return details.open ? `opened the ${entry.targetType} ${target} to every member` : `changed who can open the ${entry.targetType} ${target}`;
    case 'event.created':
      return `created the event “${target}”`;
    case 'event.published':
      return `published the event “${target}”`;
    case 'event.updated':
      return `edited the event “${target}”`;
    case 'event.cancelled':
      return `cancelled the event “${target}”`;
    case 'event.deleted':
      return `deleted the event “${target}”`;
    case 'points.rules_updated':
      return 'changed the point rules';
    case 'points.levels_updated':
      return `changed the levels (${details.levels} levels)`;
    case 'points.adjusted': {
      const points = Number(details.points);
      return `${points > 0 ? 'gave' : 'took'} ${Math.abs(points)} point${Math.abs(points) === 1 ? '' : 's'} ${points > 0 ? 'to' : 'from'} ${target}${reason}`;
    }
    case 'badge.created':
      return `created the badge ${target}`;
    case 'badge.updated':
      return `edited the badge ${target}`;
    case 'badge.archived':
      return `archived the badge ${target}`;
    case 'badge.unarchived':
      return `brought back the badge ${target}`;
    case 'badge.awarded':
      return `gave ${target} the ${details.badge} badge${typeof details.note === 'string' ? ` — “${details.note}”` : ''}`;
    case 'badge.removed':
      return `removed the ${details.badge} badge from ${target}`;
    case 'course.created':
      return `created the course “${target}”`;
    case 'course.published':
      return `published the course “${target}”`;
    case 'course.unpublished':
      return `moved the course “${target}” back to draft`;
    case 'course.archived':
      return `archived the course “${target}”`;
    case 'course.updated':
      return `edited the course “${target}”`;
    case 'course.deleted':
      return `deleted the course “${target}”`;
    default:
      return `${entry.action.replace(/[._]/g, ' ')} ${target}`;
  }
}
