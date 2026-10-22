import type { UserRole } from '@/lib/roles';
import { activeIntl } from '@/i18n/active';
import type { MessageKey } from '@/i18n/messages';
import type { Vars } from '@/i18n/types';
import { ActivityEntry } from '../types';

type Translate = (key: MessageKey, vars?: Vars) => string;

/** Actions whose sentence is a plain template ("member.warned" → activity.member_warned). */
const SIMPLE = new Set([
  'member.muted', 'member.suspended', 'member.banned', 'member.restriction_lifted', 'member.warned',
  'post.deleted', 'post.pinned', 'post.unpinned', 'post.edited', 'post.restored', 'post.approved',
  'comment.deleted', 'comment.edited', 'comment.restored', 'comment.released',
  'member.special_granted', 'member.special_removed', 'guide.published', 'invite.revoked',
  'member.vouched_post_removed', 'member.referral_restricted', 'member.deletion_requested', 'member.deletion_cancelled',
  'space.created', 'space.updated', 'space.archived', 'space.unarchived', 'spaces.reordered',
  'tier.created', 'tier.deleted',
  'event.created', 'event.published', 'event.updated', 'event.cancelled', 'event.deleted',
  'points.rules_updated',
  'badge.created', 'badge.updated', 'badge.archived', 'badge.unarchived', 'badge.removed',
  'course.created', 'course.published', 'course.unpublished', 'course.archived', 'course.updated', 'course.deleted',
  'challenge.created', 'challenge.published', 'challenge.updated', 'challenge.cancelled', 'challenge.deleted',
  'challenge.winners_cleared',
  'help.created', 'help.updated', 'help.published', 'help.unpublished', 'help.deleted',
]);

const keyOf = (action: string) => `activity.${action.replace(/\./g, '_')}` as MessageKey;

/** One readable sentence per log entry, without the actor's name (shown separately), in the app's language. */
export function describeActivity(entry: ActivityEntry, t: Translate): string {
  const target = entry.targetLabel ?? t('activity.aMember');
  const details = entry.details ?? {};
  const quote = (text: unknown) => (typeof text === 'string' ? t('activity.quoted', { text }) : '');
  const role = (value: unknown) => t(`common.roles.${value as UserRole}`);
  const until = typeof details.until === 'string'
    ? t('activity.until', { date: new Date(details.until).toLocaleDateString(activeIntl()) })
    : t('activity.indefinitely');
  const base = { target, reason: quote(details.reason), note: quote(details.note), until, badge: String(details.badge ?? '') };

  if (SIMPLE.has(entry.action)) return t(keyOf(entry.action), base);

  switch (entry.action) {
    case 'member.role_changed':
      return t('activity.member_role_changed', { target, from: role(details.from), to: role(details.to) });
    case 'member.approved':
      return details.via === 'invite'
        ? t('activity.member_approved_invite', { target, invite: String(details.invite ?? '') })
        : details.via === 'referral'
          ? t('activity.member_approved_referral', base)
          : details.via === 'open_signup'
            ? t('activity.member_approved_open', base)
            : t('activity.member_approved', base);
    case 'member.rejected':
      return t('activity.member_rejected', base);
    case 'post.rejected':
      return t('activity.post_rejected', base);
    case 'settings.updated':
      return t('activity.settings_updated', { fields: Object.keys(details).join(', ') });
    case 'quiz.updated':
      return t('activity.quiz_updated', { count: Number(details.questions ?? 0) });
    case 'invite.created':
      return t(details.specialMember ? 'activity.invite_created_special' : 'activity.invite_created', base);
    case 'reports.dismissed':
      return t('activity.reports_dismissed', { target, count: Number(details.reports ?? 0) });
    case 'reports.resolved':
      return t('activity.reports_resolved', { target, count: Number(details.reports ?? 0), resolution: String(details.resolution ?? '') });
    case 'tier.updated':
      return t(details.isDefault ? 'activity.tier_default' : 'activity.tier_updated', base);
    case 'member.tier_changed':
      return t('activity.member_tier_changed', {
        target,
        from: typeof details.from === 'string' ? details.from : t('activity.defaultTier'),
        to: typeof details.to === 'string' ? details.to : t('activity.theDefaultTier'),
      });
    case 'access.updated': {
      const type = ['space', 'event', 'course', 'challenge'].includes(entry.targetType)
        ? t(`activity.types.${entry.targetType as 'space'}`)
        : entry.targetType;
      return t(details.open ? 'activity.access_opened' : 'activity.access_updated', { target, type });
    }
    case 'points.levels_updated':
      return t('activity.points_levels_updated', { count: Number(details.levels ?? 0) });
    case 'points.adjusted': {
      const points = Number(details.points);
      return t(points > 0 ? 'activity.points_given' : 'activity.points_taken', { ...base, count: Math.abs(points) });
    }
    case 'badge.awarded':
      return t('activity.badge_awarded', base);
    case 'challenge.check_in_removed':
      return t('activity.challenge_check_in_removed', { target, content: typeof details.content === 'string' ? `: ${t('activity.quoted', { text: details.content }).replace(/^ — /, '')}` : '' });
    case 'challenge.winners_picked':
      return t('activity.challenge_winners_picked', { target, count: Number(details.winners ?? 0), top: details.mode === 'top' ? t('activity.topOfBoard') : '' });
    default:
      return `${entry.action.replace(/[._]/g, ' ')} ${target}`;
  }
}
