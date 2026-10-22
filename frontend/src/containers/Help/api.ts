import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { UserRole } from '@/lib/roles';
import type { Translations } from '@/lib/translations';

export type HelpSpaceId = 'community' | 'creator' | 'admin';
export type HelpSpaceKey = 'COMMUNITY' | 'CREATOR' | 'ADMIN';

export interface HelpArticleSummary {
  id: string;
  slug: string;
  space: HelpSpaceKey;
  audience: UserRole;
  category: string;
  title: string;
  summary: string;
  position: number;
  updatedAt: string;
  published?: boolean;
}

export interface HelpArticle extends HelpArticleSummary {
  body: string;
  published: boolean;
  updatedBy: { username: string; name: string | null } | null;
  /** Only when loaded for editing */
  translations?: Translations;
  related: { slug: string; title: string }[];
}

export interface HelpArticleInput {
  slug?: string;
  space?: HelpSpaceKey;
  audience?: UserRole;
  category?: string;
  title?: string;
  summary?: string;
  body?: string;
  published?: boolean;
  translations?: Translations;
}

export const helpKeys = {
  all: ['help'] as const,
  list: (space: HelpSpaceId, q: string) => ['help', 'list', space, q] as const,
  article: (slug: string) => ['help', 'article', slug] as const,
  manage: (space: HelpSpaceId) => ['help', 'manage', space] as const,
};

export const useHelpArticles = (space: HelpSpaceId, q = '') =>
  useQuery({
    queryKey: helpKeys.list(space, q),
    queryFn: async () => (await apiClient.get<HelpArticleSummary[]>('/help/articles', { params: { space, q: q || undefined } })).data,
    placeholderData: keepPreviousData,
  });

/** `forEditing` loads every language instead of the reader's one. */
export const useHelpArticle = (slug: string | null, { forEditing = false } = {}) =>
  useQuery({
    queryKey: forEditing ? [...helpKeys.article(slug ?? ''), 'edit'] : helpKeys.article(slug ?? ''),
    queryFn: async () => (await apiClient.get<HelpArticle>(`/help/articles/${slug}`, { params: forEditing ? { raw: 1 } : undefined })).data,
    enabled: Boolean(slug),
  });

export const useManagedArticles = (space: HelpSpaceId) =>
  useQuery({
    queryKey: helpKeys.manage(space),
    queryFn: async () => (await apiClient.get<HelpArticleSummary[]>('/help/manage', { params: { space } })).data,
  });

const useRefresh = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: helpKeys.all });
};

export const useSaveArticle = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: HelpArticleInput }) =>
      (id ? await apiClient.patch<HelpArticle>(`/help/manage/${id}`, input) : await apiClient.post<HelpArticle>('/help/manage', input)).data,
    onSuccess: refresh,
  });
};

export const useDeleteArticle = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/help/manage/${id}`)).data,
    onSuccess: refresh,
  });
};

export const useReorderArticles = () => {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: async (ids: string[]) => (await apiClient.put('/help/manage/order', { ids })).data,
    onSuccess: refresh,
  });
};
