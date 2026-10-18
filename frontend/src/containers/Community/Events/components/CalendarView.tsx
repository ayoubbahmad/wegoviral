'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { cn } from '@/lib/utils';
import { CommunityEvent } from '@/types/communityFeed';
import { useEventsInRange } from '../api';
import { happensOn, isPast, monthGrid, sameDate } from '../utils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_PER_DAY = 3;

export const CalendarView = ({ category, onOpen }: { category?: string; onOpen: (event: CommunityEvent) => void }) => {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const { days, from, to } = monthGrid(month);
  const { data: events = [], isPending } = useEventsInRange(from, to, category);
  const today = new Date();

  const shift = (by: number) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + by, 1));

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-lg font-bold">{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
        <div className="flex gap-2">
          <button onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary/50">
            Today
          </button>
          <button aria-label="Previous month" onClick={() => shift(-1)} className="rounded-lg border border-border p-2 hover:bg-secondary/50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button aria-label="Next month" onClick={() => shift(1)} className="rounded-lg border border-border p-2 hover:bg-secondary/50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-border text-center text-xs font-semibold text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <div key={day} className="border-r border-border py-2 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {isPending ? (
        <Skeleton className="h-96 rounded-none" />
      ) : (
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const inMonth = day.getMonth() === month.getMonth();
            const dayEvents = events.filter((event) => happensOn(event, day));
            const isToday = sameDate(day, today);
            const pastDay = day < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'min-h-28 border-r border-t border-border p-1.5 [&:nth-child(7n)]:border-r-0',
                  (!inMonth || pastDay) && 'bg-secondary/20',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs',
                    isToday ? 'bg-red-500 font-bold text-white' : inMonth ? 'text-foreground' : 'text-muted-foreground/60',
                  )}
                >
                  {day.getDate()}
                </span>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, MAX_PER_DAY).map((event) => {
                    const faded = isPast(event) || event.status === 'CANCELLED';
                    return (
                      <button
                        key={event.id}
                        onClick={() => onOpen(event)}
                        title={event.title}
                        className={cn(
                          'flex w-full items-center gap-1 rounded-md px-1.5 py-1 text-left text-[11px] font-medium leading-tight transition-opacity hover:opacity-80',
                          faded
                            ? 'border border-border bg-background text-muted-foreground'
                            : event.status === 'DRAFT'
                              ? 'border border-dashed border-primary/50 bg-primary/5 text-primary'
                              : 'bg-primary text-primary-foreground',
                          event.status === 'CANCELLED' && 'line-through',
                        )}
                      >
                        {event.access.locked && <Lock className="w-3 h-3 shrink-0" />}
                        <span className="line-clamp-2">{event.title}</span>
                      </button>
                    );
                  })}
                  {dayEvents.length > MAX_PER_DAY && (
                    <p className="px-1 text-[11px] text-muted-foreground">+{dayEvents.length - MAX_PER_DAY} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
