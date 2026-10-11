'use client';

import { useMemo, useState } from 'react';
import { MOCK_LEADERBOARD } from '@/lib/mock-data';
import { useCommunityStore } from '../slice';

/** Events and leaderboard (still mock data); the feed uses useFeedController. */
export const useCommunityController = () => {
  const { events, createEvent, isCreateEventModalOpen, setIsCreateEventModalOpen } =
    useCommunityStore();

  // Captured once per mount: "upcoming" doesn't need to tick live
  const [now] = useState(() => Date.now());

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => new Date(event.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events, now]);

  return {
    events,
    upcomingEvents,
    handleCreateEvent: createEvent,
    isCreateEventModalOpen,
    setIsCreateEventModalOpen,
    leaderboard: MOCK_LEADERBOARD,
  };
};
