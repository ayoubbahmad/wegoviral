import type { LockReason } from '@/types/communityFeed';
import { activeIntl } from '@/i18n/active';
import type { MessageKey } from '@/i18n/messages';
import type { Vars } from '@/i18n/types';

type Translate = (key: MessageKey, vars?: Vars) => string;

/** Plain-language explanation of why something is locked, one line per reason. */
export function describeLockReason(reason: LockReason, t: Translate): string {
  switch (reason.type) {
    case 'role':
      return reason.minRole === 'INSTRUCTOR' ? t('common.lock.instructors') : t('common.lock.role', { role: t(`common.roles.${reason.minRole}`) });
    case 'tier':
      return t('common.lock.tier', { tiers: reason.tiers.map((tier) => tier.name).join(t('common.lock.or')) });
    case 'time':
      return t('common.lock.time', { count: reason.daysLeft, date: new Date(reason.unlocksAt).toLocaleDateString(activeIntl()) });
    case 'level':
      return t('common.lock.level', { level: reason.minLevel, name: reason.levelName, count: reason.pointsToGo });
  }
}
