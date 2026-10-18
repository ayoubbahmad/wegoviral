'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CalendarPlus,
  Download,
  ExternalLink,
  Loader2,
  Lock,
  MapPin,
  PlayCircle,
  Users,
  Video,
  X,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { useToast } from '@/providers/Toast';
import { useAuth } from '@/providers/Auth';
import { avatarFor } from '@/lib/utils';
import { describeLockReason } from '@/lib/access';
import { CommunityEvent } from '@/types/communityFeed';
import { downloadAttendeesCsv, useAttendees, useDeleteEvent, useEvent, useRsvp, useSaveEvent } from '../api';
import { downloadIcs, formatEventWhen, googleCalendarUrl, isPast, viewerTimezone } from '../utils';
import { EventBadges } from './EventBadges';

interface EventDetailDialogProps {
  eventId: string;
  onClose: () => void;
  onEdit: (event: CommunityEvent) => void;
}

export const EventDetailDialog = ({ eventId, onClose, onEdit }: EventDetailDialogProps) => {
  const { data: event, isPending, error } = useEvent(eventId);

  useEffect(() => {
    const handleKeyDown = (keyEvent: KeyboardEvent) => keyEvent.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={(mouseEvent) => mouseEvent.target === mouseEvent.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label="Event details" className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-150">
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 rounded-lg bg-card/80 p-2 text-muted-foreground backdrop-blur hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
        {isPending ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="p-6 text-sm text-muted-foreground">{error.message}</p>
        ) : (
          <EventDetails event={event} onClose={onClose} onEdit={onEdit} />
        )}
      </div>
    </div>,
    document.body,
  );
};

const EventDetails = ({ event, onClose, onEdit }: { event: CommunityEvent; onClose: () => void; onEdit: (event: CommunityEvent) => void }) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const rsvp = useRsvp();
  const save = useSaveEvent();
  const remove = useDeleteEvent();
  const [showAttendees, setShowAttendees] = useState(false);
  const ended = isPast(event);
  const canInteract = user?.onboarding.step === 'DONE' && user.status !== 'MUTED';
  const canRsvp = event.status === 'PUBLISHED' && !ended && !event.access.locked;
  const hostZone = event.timezone !== viewerTimezone();

  const toggleGoing = () =>
    rsvp.mutate(
      { id: event.id, going: !event.goingByMe },
      {
        onSuccess: (updated) => showToast(updated.goingByMe ? "You're going! Add it to your calendar so you don't miss it." : 'RSVP cancelled'),
        onError: (err) => showToast(err.message, 'error'),
      },
    );

  const setStatus = (status: 'PUBLISHED' | 'CANCELLED') => {
    if (status === 'CANCELLED' && !window.confirm(`Cancel "${event.title}"? Members who are going will see it as cancelled.`)) return;
    save.mutate(
      { id: event.id, input: { status } },
      { onSuccess: () => showToast(status === 'PUBLISHED' ? 'Event published' : 'Event cancelled'), onError: (err) => showToast(err.message, 'error') },
    );
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete "${event.title}"? This can't be undone.`)) return;
    remove.mutate(event.id, {
      onSuccess: () => {
        showToast('Event deleted');
        onClose();
      },
      onError: (err) => showToast(err.message, 'error'),
    });
  };

  return (
    <>
      {event.coverUrl && <img src={event.coverUrl} alt="" className="h-48 w-full object-cover" />}
      <div className="space-y-5 p-6">
        <div className="space-y-2 pr-8">
          <EventBadges event={event} />
          <h2 className="text-2xl font-bold tracking-tight">{event.title}</h2>
          <p className="text-sm font-medium">{formatEventWhen(event)}</p>
          {hostZone && (
            <p className="text-xs text-muted-foreground">Times shown in your time zone. The host set it in {event.timezone.replace('_', ' ')}.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            {event.locationType === 'ONLINE' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            {event.locationType === 'ONLINE' ? 'Online' : event.location || 'In person'}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {event.goingCount}
            {event.capacity ? ` / ${event.capacity}` : ''} going
          </span>
          <span className="flex items-center gap-1.5">
            <img src={avatarFor(event.host)} alt="" className="w-5 h-5 rounded-full border border-border" />
            Hosted by @{event.host.username}
          </span>
        </div>

        {event.access.locked ? (
          <div className="space-y-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Lock className="w-4 h-4" /> This event is locked
            </p>
            {event.access.reasons.map((reason, index) => (
              <p key={index} className="text-muted-foreground">{describeLockReason(reason)}</p>
            ))}
          </div>
        ) : (
          event.description && <p className="whitespace-pre-wrap text-sm leading-relaxed">{event.description}</p>
        )}

        {/* Member actions */}
        <div className="flex flex-wrap gap-2">
          {canRsvp && canInteract && (
            <Button variant={event.goingByMe ? 'outline' : 'primary'} onClick={toggleGoing} disabled={rsvp.isPending || (!event.goingByMe && event.isFull)}>
              {rsvp.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : event.goingByMe ? 'Cancel my RSVP' : event.isFull ? 'Event is full' : "I'm going"}
            </Button>
          )}
          {event.link && !ended && event.status === 'PUBLISHED' && (
            <a href={event.link} target="_blank" rel="noreferrer">
              <Button variant="primary">
                <ExternalLink className="w-4 h-4" /> Join link
              </Button>
            </a>
          )}
          {!event.link && event.hasLink && canRsvp && !event.goingByMe && (
            <p className="self-center text-xs text-muted-foreground">The live link appears once you&apos;re going.</p>
          )}
          {!ended && event.status === 'PUBLISHED' && !event.access.locked && (
            <>
              <a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer">
                <Button variant="ghost">
                  <CalendarPlus className="w-4 h-4" /> Google Calendar
                </Button>
              </a>
              <Button variant="ghost" onClick={() => downloadIcs(event)}>
                <Download className="w-4 h-4" /> .ics
              </Button>
            </>
          )}
          {event.recordingUrl && (
            <a href={event.recordingUrl} target="_blank" rel="noreferrer">
              <Button variant="outline">
                <PlayCircle className="w-4 h-4" /> Watch the recording
              </Button>
            </a>
          )}
        </div>

        {/* Host & staff */}
        {event.canManage && (
          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Manage</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(event)}>Edit</Button>
              {event.status === 'DRAFT' && (
                <Button variant="primary" size="sm" onClick={() => setStatus('PUBLISHED')} disabled={save.isPending}>Publish</Button>
              )}
              {event.status === 'PUBLISHED' && !ended && (
                <Button variant="outline" size="sm" onClick={() => setStatus('CANCELLED')} disabled={save.isPending}>Cancel event</Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowAttendees((open) => !open)}>
                {showAttendees ? 'Hide attendees' : `Attendees (${event.goingCount})`}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete} disabled={remove.isPending} className="text-red-500 hover:bg-red-500/10">
                Delete
              </Button>
            </div>
            {showAttendees && <AttendeeList event={event} />}
          </div>
        )}
      </div>
    </>
  );
};

const AttendeeList = ({ event }: { event: CommunityEvent }) => {
  const { showToast } = useToast();
  const { data: attendees = [], isPending } = useAttendees(event.id, true);
  if (isPending) return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
  return (
    <div className="space-y-2">
      {attendees.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nobody yet.</p>
      ) : (
        <ul className="max-h-60 space-y-2 overflow-y-auto">
          {attendees.map((attendee) => (
            <li key={attendee.id} className="flex items-center gap-2 text-sm">
              <img src={avatarFor(attendee)} alt="" className="w-7 h-7 rounded-full border border-border" />
              <span className="font-medium">{attendee.name || `@${attendee.username}`}</span>
              <span className="text-xs text-muted-foreground truncate">{attendee.email}</span>
            </li>
          ))}
        </ul>
      )}
      {attendees.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => downloadAttendeesCsv(event.id, event.title).catch((err) => showToast(err.message, 'error'))}
        >
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      )}
    </div>
  );
};
