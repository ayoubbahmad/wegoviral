import { MessageSquare, CalendarDays, Trophy } from 'lucide-react';

export const COMMUNITY_TABS = [
  { id: 'Feed', label: 'Feed', icon: MessageSquare },
  { id: 'Events', label: 'Events', icon: CalendarDays },
  { id: 'LeaderBoard', label: 'LeaderBoard', icon: Trophy },
] as const;

export type CommunityTabId = (typeof COMMUNITY_TABS)[number]['id'];
