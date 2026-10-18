import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { CommunityEvent, EventInput } from '@/types/communityFeed';

export interface AccessRuleInput {
  minRole: string | null;
  tierIds: string[];
  minDays: number | null;
}

export const eventKeys = {
  all: ['events'] as const,
  list: (scope: string, category?: string) => ['events', 'list', scope, category ?? 'all'] as const,
  range: (from: string, to: string, category?: string) => ['events', 'range', from, to, category ?? 'all'] as const,
  categories: ['events', 'categories'] as const,
  detail: (id: string) => ['events', 'detail', id] as const,
  attendees: (id: string) => ['events', 'attendees', id] as const,
  access: (id: string) => ['events', 'access', id] as const,
};

export const useEvents = (scope: 'upcoming' | 'past', category?: string, limit = 100) =>
  useQuery({
    queryKey: [...eventKeys.list(scope, category), limit],
    queryFn: async () =>
      (await apiClient.get<CommunityEvent[]>('/events', { params: { scope, category, limit } })).data,
  });

export const useEventsInRange = (from: Date, to: Date, category?: string) =>
  useQuery({
    queryKey: eventKeys.range(from.toISOString(), to.toISOString(), category),
    queryFn: async () =>
      (
        await apiClient.get<CommunityEvent[]>('/events', {
          params: { scope: 'range', from: from.toISOString(), to: to.toISOString(), category, limit: 200 },
        })
      ).data,
  });

export const useEventCategories = () =>
  useQuery({
    queryKey: eventKeys.categories,
    queryFn: async () => (await apiClient.get<string[]>('/events/categories')).data,
  });

export const useEvent = (id: string | null) =>
  useQuery({
    queryKey: eventKeys.detail(id ?? ''),
    queryFn: async () => (await apiClient.get<CommunityEvent>(`/events/${id}`)).data,
    enabled: Boolean(id),
  });

/** Any change to an event can affect every list, the calendar and the feed card. */
const useRefreshEvents = () => {
  const queryClient = useQueryClient();
  return (event?: CommunityEvent) => {
    if (event) queryClient.setQueryData(eventKeys.detail(event.id), event);
    queryClient.invalidateQueries({ queryKey: eventKeys.all });
    queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] });
  };
};

export const useSaveEvent = () => {
  const refresh = useRefreshEvents();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: Partial<EventInput> }) =>
      id
        ? (await apiClient.patch<CommunityEvent>(`/events/${id}`, input)).data
        : (await apiClient.post<CommunityEvent>('/events', input)).data,
    onSuccess: (event) => refresh(event),
  });
};

export const useDeleteEvent = () => {
  const refresh = useRefreshEvents();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/events/${id}`)).data,
    onSuccess: () => refresh(),
  });
};

export const useRsvp = () => {
  const refresh = useRefreshEvents();
  return useMutation({
    mutationFn: async ({ id, going }: { id: string; going: boolean }) =>
      (await apiClient.request<CommunityEvent>({ method: going ? 'PUT' : 'DELETE', url: `/events/${id}/rsvp` })).data,
    onSuccess: (event) => refresh(event),
  });
};

export interface Attendee {
  id: string;
  username: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  rsvpAt: string;
}

export const useAttendees = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: eventKeys.attendees(id),
    queryFn: async () => (await apiClient.get<{ attendees: Attendee[] }>(`/events/${id}/attendees`)).data.attendees,
    enabled,
  });

/** Downloads the attendee list as CSV (the request needs the login token, so no plain link). */
export async function downloadAttendeesCsv(id: string, title: string) {
  const { data } = await apiClient.get<string>(`/events/${id}/attendees`, { params: { format: 'csv' }, responseType: 'text' });
  const url = URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: `${title.replace(/[^\w-]+/g, '-')}-attendees.csv` });
  link.click();
  URL.revokeObjectURL(url);
}

export const useEventAccess = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: eventKeys.access(id),
    queryFn: async () => (await apiClient.get<AccessRuleInput | null>(`/events/${id}/access`)).data,
    enabled,
  });

export const useSaveEventAccess = () => {
  const refresh = useRefreshEvents();
  return useMutation({
    mutationFn: async ({ id, rule }: { id: string; rule: AccessRuleInput }) =>
      (await apiClient.put(`/events/${id}/access`, rule)).data,
    onSuccess: () => refresh(),
  });
};
