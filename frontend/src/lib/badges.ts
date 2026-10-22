import type { MessageKey } from '@/i18n/messages';
import type { Vars } from '@/i18n/types';

export type AutoBadgeRule = { type: string; threshold: number } | null | undefined;

const AUTO_TYPES = ['POSTS', 'COMMENTS', 'LIKES_RECEIVED', 'EVENTS_JOINED', 'COURSES_COMPLETED', 'CHALLENGES_COMPLETED', 'CHALLENGES_WON', 'POINTS'] as const;

/** "10 posts published", or "Given by the team" for manual badges, in the app's language. */
export function howToEarn(rule: AutoBadgeRule, t: (key: MessageKey, vars?: Vars) => string) {
  if (!rule) return t('points.givenByTeam');
  if (!AUTO_TYPES.includes(rule.type as (typeof AUTO_TYPES)[number])) return `${rule.threshold} ${rule.type}`;
  return t(`points.autoTypes.${rule.type as (typeof AUTO_TYPES)[number]}`, { count: rule.threshold });
}

export const isAutoType = (type: string): type is (typeof AUTO_TYPES)[number] => AUTO_TYPES.includes(type as (typeof AUTO_TYPES)[number]);
