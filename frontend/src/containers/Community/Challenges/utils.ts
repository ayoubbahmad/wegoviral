import type { ChallengeSummary } from '@/types/challenges';
import { activeIntl, activeLocale } from '@/i18n/active';
import { translate } from '@/i18n/translate';
import { messages, type MessageKey } from '@/i18n/messages';
import type { Vars } from '@/i18n/types';

const short = (iso: string) => new Date(iso).toLocaleDateString(activeIntl(), { month: 'short', day: 'numeric' });
const tr = (key: MessageKey, vars?: Vars) => translate(messages[activeLocale()], messages.en, activeLocale(), key, vars);

/** "Starts Nov 3", "Ends in 4 days", "Ended Oct 12", in the app's language. */
export function describeDates(challenge: Pick<ChallengeSummary, 'phase' | 'startsAt' | 'endsAt'>) {
  if (challenge.phase === 'upcoming') return tr('challenges.dates.starts', { date: short(challenge.startsAt) });
  if (challenge.phase === 'ended') return tr('challenges.dates.ended', { date: short(challenge.endsAt) });
  const days = Math.ceil((new Date(challenge.endsAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  return days <= 1 ? tr('challenges.dates.endsToday') : tr('challenges.dates.endsIn', { count: days });
}

/** Every day of the challenge (YYYY-MM-DD), for the check-in calendar. */
export function challengeDays(startDay: string, count: number) {
  const [year, month, day] = startDay.split('-').map(Number);
  return Array.from({ length: count }, (_, index) => new Date(Date.UTC(year, month - 1, day + index)).toISOString().slice(0, 10));
}
