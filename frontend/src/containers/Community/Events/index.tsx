'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CalendarDays, LayoutGrid, Plus } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { useCan } from '@/providers/Auth';
import { cn } from '@/lib/utils';
import { CommunityEvent } from '@/types/communityFeed';
import { useEventCategories, useEvents } from './api';
import { EventCard } from './components/EventCard';
import { CalendarView } from './components/CalendarView';
import { EventDetailDialog } from './components/EventDetailDialog';
import { EventFormDialog } from './components/EventFormDialog';
import { useT } from '@/i18n/provider';

type View = 'cards' | 'calendar';
const VIEW_KEY = 'wgv_events_view';

const readView = (): View => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'calendar' ? 'calendar' : 'cards';
  } catch {
    return 'cards';
  }
};

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={cn(
      'shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
      active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card/50 text-muted-foreground hover:text-foreground',
    )}
  >
    {children}
  </button>
);

export const CommunityEventsContainer = () => {
  const t = useT();
  const can = useCan();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [view, setView] = useState<View>(readView);
  const [category, setCategory] = useState<string | undefined>();
  const [timeframe, setTimeframe] = useState<'upcoming' | 'past'>('upcoming');
  const [editing, setEditing] = useState<CommunityEvent | 'new' | null>(null);
  const { data: categories = [] } = useEventCategories();
  const openEventId = params.get('event');

  // The open event lives in the URL so it can be shared and survives a refresh
  const openEvent = (id: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (id) next.set('event', id);
    else next.delete('event');
    router.replace(`${pathname}${next.toString() ? `?${next}` : ''}`, { scroll: false });
  };

  const changeView = (next: View) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // ignore
    }
  };

  return (
    <PageContainer>
      <PageHeader
        helpHref="/community/help/events"
        title={t('events.title')}
        description={t('events.description')}
        actions={
          can('events.create') && (
            <Button variant="primary" onClick={() => setEditing('new')}>
              <Plus className="w-4 h-4" /> {t('events.newEvent')}
            </Button>
          )
        }
      />

      <div className="flex items-center gap-3">
        <div role="tablist" aria-label={t('events.categories')} className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={!category} onClick={() => setCategory(undefined)}>{t('common.all')}</Chip>
          {categories.map((name) => (
            <Chip key={name} active={category === name} onClick={() => setCategory(name)}>
              {name}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label={t('events.view')} className="flex shrink-0 rounded-xl border border-border bg-card p-1">
          <button
            aria-label={t('events.cardsView')}
            aria-pressed={view === 'cards'}
            onClick={() => changeView('cards')}
            className={cn('rounded-lg p-2 transition-colors', view === 'cards' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            aria-label={t('events.calendarView')}
            aria-pressed={view === 'calendar'}
            onClick={() => changeView('calendar')}
            className={cn('rounded-lg p-2 transition-colors', view === 'calendar' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            <CalendarDays className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <CalendarView category={category} onOpen={(event) => openEvent(event.id)} />
      ) : (
        <CardsView category={category} timeframe={timeframe} onTimeframe={setTimeframe} onOpen={(event) => openEvent(event.id)} />
      )}

      {openEventId && (
        <EventDetailDialog eventId={openEventId} onClose={() => openEvent(null)} onEdit={(event) => setEditing(event)} />
      )}
      {editing && (
        <EventFormDialog
          event={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(event) => {
            setEditing(null);
            openEvent(event.id);
          }}
        />
      )}
    </PageContainer>
  );
};

interface CardsViewProps {
  category?: string;
  timeframe: 'upcoming' | 'past';
  onTimeframe: (timeframe: 'upcoming' | 'past') => void;
  onOpen: (event: CommunityEvent) => void;
}

const CardsView = ({ category, timeframe, onTimeframe, onOpen }: CardsViewProps) => {
  const t = useT();
  const { data: events = [], isPending, error } = useEvents(timeframe, category);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm font-semibold">
        {(['upcoming', 'past'] as const).map((option) => (
          <button
            key={option}
            onClick={() => onTimeframe(option)}
            className={cn('border-b-2 pb-1 transition-colors', timeframe === option ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
          >
            {option === 'upcoming' ? t('events.upcoming') : t('events.past')}
          </button>
        ))}
      </div>
      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={timeframe === 'upcoming' ? t('events.noUpcoming') : t('events.noPast')}
          description={timeframe === 'upcoming' ? t('events.newWillShow') : undefined}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onOpen={() => onOpen(event)} />
          ))}
        </div>
      )}
    </div>
  );
};
