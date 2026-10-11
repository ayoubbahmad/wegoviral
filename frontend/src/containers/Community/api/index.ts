import {
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';
import {
  CommunityComment,
  CommunityPost,
  CommunitySpace,
  CreatePostPayload,
  FeedPage,
  NewPostDraft,
  TopPost,
} from '@/types/communityFeed';

const PAGE_SIZE = 20;
const STORAGE_BUCKET = 'community';

export const feedKeys = {
  all: ['feed'] as const,
  spaces: ['feed', 'spaces'] as const,
  posts: ['feed', 'posts'] as const,
  postsBySpace: (spaceId?: string) => ['feed', 'posts', spaceId ?? 'all'] as const,
  top: ['feed', 'top'] as const,
  comments: (postId: string) => ['feed', 'comments', postId] as const,
};

// ─── Cache helpers ───────────────────────────────────────────────────────────

/** Applies an update to a post in every cached feed (All + each space). */
const updateCachedPost = (
  queryClient: QueryClient,
  postId: string,
  update: (post: CommunityPost) => CommunityPost,
) => {
  queryClient.setQueriesData<InfiniteData<FeedPage>>({ queryKey: feedKeys.posts }, (data) =>
    data && {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        posts: page.posts.map((post) => (post.id === postId ? update(post) : post)),
      })),
    },
  );
};

const removeCachedPost = (queryClient: QueryClient, postId: string) => {
  queryClient.setQueriesData<InfiniteData<FeedPage>>({ queryKey: feedKeys.posts }, (data) =>
    data && {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        posts: page.posts.filter((post) => post.id !== postId),
      })),
    },
  );
};

/** Optimistic mutation: snapshot feeds, apply locally, roll back on error. */
const optimisticPostUpdate = (queryClient: QueryClient) => ({
  snapshot: async () => {
    await queryClient.cancelQueries({ queryKey: feedKeys.posts });
    return queryClient.getQueriesData<InfiniteData<FeedPage>>({ queryKey: feedKeys.posts });
  },
  rollback: (snapshot?: [readonly unknown[], InfiniteData<FeedPage> | undefined][]) => {
    snapshot?.forEach(([key, data]) => queryClient.setQueryData(key, data));
  },
});

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useSpaces = () =>
  useQuery({
    queryKey: feedKeys.spaces,
    queryFn: async () => (await apiClient.get<CommunitySpace[]>('/feed/spaces')).data,
  });

export const useFeedPosts = (spaceId?: string) =>
  useInfiniteQuery({
    queryKey: feedKeys.postsBySpace(spaceId),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) =>
      (
        await apiClient.get<FeedPage>('/feed/posts', {
          params: { spaceId, cursor: pageParam, limit: PAGE_SIZE },
        })
      ).data,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

export const useTopPosts = () =>
  useQuery({
    queryKey: feedKeys.top,
    queryFn: async () => (await apiClient.get<TopPost[]>('/feed/posts/top')).data,
  });

export const useComments = (postId: string, enabled: boolean) =>
  useQuery({
    queryKey: feedKeys.comments(postId),
    queryFn: async () =>
      (await apiClient.get<CommunityComment[]>(`/feed/posts/${postId}/comments`)).data,
    enabled,
  });

// ─── Uploads ─────────────────────────────────────────────────────────────────

/** Uploads straight to Supabase Storage with a signed URL from our API. */
async function uploadImage(file: File) {
  const { data } = await apiClient.post<{ path: string; token: string; publicUrl: string }>(
    '/feed/uploads',
    { contentType: file.type, size: file.size },
  );
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .uploadToSignedUrl(data.path, data.token, file, { contentType: file.type });
  if (error) throw new Error(`Could not upload ${file.name}: ${error.message}`);
  return data.publicUrl;
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (draft: NewPostDraft) => {
      const [coverUrl, ...images] = await Promise.all([
        draft.coverFile ? uploadImage(draft.coverFile) : Promise.resolve(undefined),
        ...draft.imageFiles.map(uploadImage),
      ]);
      const payload: CreatePostPayload = {
        spaceId: draft.spaceId,
        title: draft.title?.trim() || undefined,
        content: draft.content.trim(),
        coverUrl,
        images: images as string[],
        pollOptions: draft.pollOptions,
      };
      return (await apiClient.post<CommunityPost>('/feed/posts', payload)).data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feedKeys.all }),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      await apiClient.delete(`/feed/posts/${postId}`);
      return postId;
    },
    onSuccess: (postId) => {
      removeCachedPost(queryClient, postId);
      queryClient.invalidateQueries({ queryKey: feedKeys.spaces });
      queryClient.invalidateQueries({ queryKey: feedKeys.top });
    },
  });
};

export const usePinPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, pinned }: { postId: string; pinned: boolean }) =>
      (await apiClient.patch<CommunityPost>(`/feed/posts/${postId}/pin`, { pinned })).data,
    // Pinning changes the order, so refetch instead of patching the cache
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feedKeys.posts }),
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const optimistic = optimisticPostUpdate(queryClient);
  return useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) =>
      (
        await apiClient.request<{ likedByMe: boolean; likeCount: number }>({
          method: liked ? 'PUT' : 'DELETE',
          url: `/feed/posts/${postId}/like`,
        })
      ).data,
    onMutate: async ({ postId, liked }) => {
      const snapshot = await optimistic.snapshot();
      updateCachedPost(queryClient, postId, (post) => ({
        ...post,
        likedByMe: liked,
        likeCount: post.likeCount + (liked ? 1 : -1),
      }));
      return { snapshot };
    },
    onError: (_error, _vars, context) => optimistic.rollback(context?.snapshot),
    onSuccess: (result, { postId }) =>
      updateCachedPost(queryClient, postId, (post) => ({ ...post, ...result })),
  });
};

export const useBookmarkPost = () => {
  const queryClient = useQueryClient();
  const optimistic = optimisticPostUpdate(queryClient);
  return useMutation({
    mutationFn: async ({ postId, bookmarked }: { postId: string; bookmarked: boolean }) =>
      (
        await apiClient.request<{ bookmarkedByMe: boolean }>({
          method: bookmarked ? 'PUT' : 'DELETE',
          url: `/feed/posts/${postId}/bookmark`,
        })
      ).data,
    onMutate: async ({ postId, bookmarked }) => {
      const snapshot = await optimistic.snapshot();
      updateCachedPost(queryClient, postId, (post) => ({ ...post, bookmarkedByMe: bookmarked }));
      return { snapshot };
    },
    onError: (_error, _vars, context) => optimistic.rollback(context?.snapshot),
  });
};

export const useVotePoll = () => {
  const queryClient = useQueryClient();
  const optimistic = optimisticPostUpdate(queryClient);
  return useMutation({
    mutationFn: async ({ postId, optionId }: { postId: string; optionId: string }) =>
      (await apiClient.post<CommunityPost>(`/feed/posts/${postId}/vote`, { optionId })).data,
    onMutate: async ({ postId, optionId }) => {
      const snapshot = await optimistic.snapshot();
      updateCachedPost(queryClient, postId, (post) =>
        post.poll
          ? {
              ...post,
              poll: {
                votedOptionId: optionId,
                options: post.poll.options.map((option) =>
                  option.id === optionId ? { ...option, votes: option.votes + 1 } : option,
                ),
              },
            }
          : post,
      );
      return { snapshot };
    },
    onError: (_error, _vars, context) => optimistic.rollback(context?.snapshot),
    onSuccess: (post) => updateCachedPost(queryClient, post.id, () => post),
  });
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) =>
      (await apiClient.post<CommunityComment>(`/feed/posts/${postId}/comments`, { content })).data,
    onSuccess: (comment) => {
      queryClient.setQueryData<CommunityComment[]>(feedKeys.comments(postId), (comments = []) => [
        ...comments,
        comment,
      ]);
      updateCachedPost(queryClient, postId, (post) => ({
        ...post,
        commentCount: post.commentCount + 1,
      }));
      queryClient.invalidateQueries({ queryKey: feedKeys.top });
    },
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      await apiClient.delete(`/feed/comments/${commentId}`);
      return commentId;
    },
    onSuccess: (commentId) => {
      queryClient.setQueryData<CommunityComment[]>(feedKeys.comments(postId), (comments = []) =>
        comments.filter((comment) => comment.id !== commentId),
      );
      updateCachedPost(queryClient, postId, (post) => ({
        ...post,
        commentCount: Math.max(0, post.commentCount - 1),
      }));
    },
  });
};
