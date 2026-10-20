import { CommunityEvent } from '@/types/communityFeed';
import { activeIntl, activeLocale } from '@/i18n/active';
import { translate } from '@/i18n/translate';
import { messages } from '@/i18n/messages';

/** "Sat, Oct 25 · 6:00 – 8:00 PM", in the viewer's own time zone. */
export function formatEventWhen(event: Pick<CommunityEvent, 'startsAt' | 'endsAt'>) {
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  const sameDay = start.toDateString() === end.toDateString();
  const day = start.toLocaleDateString(activeIntl(), { weekday: 'short', month: 'short', day: 'numeric' });
  const time = (date: Date) => date.toLocaleTimeString(activeIntl(), { hour: 'numeric', minute: '2-digit' });
  return sameDay
    ? `${day} · ${time(start)} – ${time(end)}`
    : `${day} ${time(start)} – ${end.toLocaleDateString(activeIntl(), { month: 'short', day: 'numeric' })} ${time(end)}`;
}

export const viewerTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const isPast = (event: Pick<CommunityEvent, 'endsAt'>) => new Date(event.endsAt).getTime() < Date.now();

/** The weeks shown for a month, starting on Sunday, including spill-over days. */
export function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()) + 1);
  const days: Date[] = [];
  for (const day = new Date(start); day < end; day.setDate(day.getDate() + 1)) days.push(new Date(day));
  return { days, from: start, to: end };
}

export const sameDate = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/** True when the event takes place (at least partly) on that calendar day. */
export function happensOn(event: Pick<CommunityEvent, 'startsAt' | 'endsAt'>, day: Date) {
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;
  return new Date(event.startsAt).getTime() < dayEnd && new Date(event.endsAt).getTime() > dayStart;
}

// ─── Add to calendar ─────────────────────────────────────────────────────────

const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const where = (event: CommunityEvent) =>
  event.locationType === 'IN_PERSON' ? event.location ?? '' : event.link ?? translate(messages[activeLocale()], messages.en, activeLocale(), 'events.onlineLocation');

export function googleCalendarUrl(event: CommunityEvent) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${icsDate(event.startsAt)}/${icsDate(event.endsAt)}`,
    details: `${event.description ?? ''}\n\n${window.location.origin}/community/events?event=${event.id}`.trim(),
    location: where(event),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const icsText = (text: string) => text.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

export function downloadIcs(event: CommunityEvent) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WeGoViral//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@wegoviral`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(event.startsAt)}`,
    `DTEND:${icsDate(event.endsAt)}`,
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(event.description ?? '')}`,
    `LOCATION:${icsText(where(event))}`,
    `URL:${window.location.origin}/community/events?event=${event.id}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: `${event.title.replace(/[^\w-]+/g, '-')}.ics` });
  link.click();
  URL.revokeObjectURL(url);
}
