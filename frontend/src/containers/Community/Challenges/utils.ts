import type { ChallengeSummary } from '@/types/challenges';

const short = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

/** "Starts Nov 3", "Ends in 4 days", "Ended Oct 12". */
export function describeDates(challenge: Pick<ChallengeSummary, 'phase' | 'startsAt' | 'endsAt'>) {
  if (challenge.phase === 'upcoming') return `Starts ${short(challenge.startsAt)}`;
  if (challenge.phase === 'ended') return `Ended ${short(challenge.endsAt)}`;
  const days = Math.ceil((new Date(challenge.endsAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  return days <= 1 ? 'Ends today' : `Ends in ${days} days`;
}

/** Every day of the challenge (YYYY-MM-DD), for the check-in calendar. */
export function challengeDays(startDay: string, count: number) {
  const [year, month, day] = startDay.split('-').map(Number);
  return Array.from({ length: count }, (_, index) => new Date(Date.UTC(year, month - 1, day + index)).toISOString().slice(0, 10));
}
