import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { UserRole } from '@/lib/roles';
import type { BadgeChip, FeedPage, MemberLevel } from '@/types/communityFeed';
import type { SocialLink } from '@/containers/settings/api';
import { feedKeys } from '../api';

export type DirectorySort = 'recent' | 'points' | 'name';

export interface MemberCard {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  niche: string | null;
  points: number;
  createdAt: string;
  level: MemberLevel;
  badges: BadgeChip[];
}

export interface MemberProfile extends MemberCard {
  bio: string | null;
  socialLinks: SocialLink[];
  postCount: number;
  commentCount: number;
  isSelf: boolean;
}

export const useMembers = (q: string, sort: DirectorySort, page: number) =>
  useQuery({
    queryKey: ['members', q, sort, page],
    queryFn: async () =>
      (await apiClient.get<{ members: MemberCard[]; total: number; page: number; pageSize: number }>('/members', { params: { q: q || undefined, sort, page } })).data,
    placeholderData: keepPreviousData,
  });

export const useMemberProfile = (username: string) =>
  useQuery({
    queryKey: ['members', 'profile', username],
    queryFn: async () => (await apiClient.get<MemberProfile>(`/members/${username}`)).data,
    retry: false,
  });

/** One member's posts; under the feed keys so likes and votes update it like the timeline */
export const useMemberPosts = (authorId: string | undefined) =>
  useInfiniteQuery({
    queryKey: [...feedKeys.posts, 'author', authorId ?? ''],
    enabled: Boolean(authorId),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => (await apiClient.get<FeedPage>('/feed/posts', { params: { authorId, cursor: pageParam, limit: 10 } })).data,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
