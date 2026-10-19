import type { LockReason } from '@/types/communityFeed';
import { ROLE_LABELS } from './roles';

/** Plain-language explanation of why something is locked, one line per reason. */
export function describeLockReason(reason: LockReason): string {
  switch (reason.type) {
    case 'role':
      return reason.minRole === 'INSTRUCTOR'
        ? 'Only for instructors and the team'
        : `Only for ${ROLE_LABELS[reason.minRole].toLowerCase()}s and above`;
    case 'tier':
      return `For ${reason.tiers.map((tier) => tier.name).join(' or ')} members`;
    case 'time':
      return `Unlocks in ${reason.daysLeft} day${reason.daysLeft === 1 ? '' : 's'} (on ${new Date(reason.unlocksAt).toLocaleDateString()})`;
    case 'level':
      return `Reach Level ${reason.minLevel} (${reason.levelName}): ${reason.pointsToGo} more point${reason.pointsToGo === 1 ? '' : 's'} to go`;
  }
}
