import { z } from 'zod';
import { communityPublicUrlPrefix } from '../../lib/supabase-admin';

// Images must come from our own storage bucket, not arbitrary URLs
const communityImageUrl = z
  .string()
  .url()
  .refine((url) => url.startsWith(communityPublicUrlPrefix), 'Invalid image URL');

export const CreatePostSchema = z
  .object({
    spaceId: z.string().min(1, 'Choose a space'),
    title: z.string().trim().max(120).optional(),
    content: z.string().trim().max(10000).default(''),
    coverUrl: communityImageUrl.optional(),
    images: z.array(communityImageUrl).max(8).default([]),
    pollOptions: z.array(z.string().trim().min(1).max(80)).min(2).max(5).optional(),
  })
  .refine((post) => Boolean(post.title || post.content), {
    message: 'Add a title or some text',
  });

export const ListPostsQuerySchema = z.object({
  spaceId: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const PinPostSchema = z.object({ pinned: z.boolean() });

export const ReviewPostSchema = z.object({ note: z.string().trim().max(500).optional() });

export const VoteSchema = z.object({ optionId: z.string().min(1) });

export const CreateCommentSchema = z.object({
  content: z.string().trim().min(1, 'Comment cannot be empty').max(2000),
});

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const CreateUploadSchema = z.object({
  contentType: z.enum(ALLOWED_IMAGE_TYPES),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES, 'Images must be 5 MB or smaller'),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;

/** Errors with an HTTP status the controller can pass straight through. */
export class FeedError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
