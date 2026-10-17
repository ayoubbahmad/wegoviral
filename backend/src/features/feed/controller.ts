import { Response } from 'express';
import { ZodError } from 'zod';
import * as feedService from './service';
import {
  CreateCommentSchema,
  CreatePostSchema,
  CreateUploadSchema,
  FeedError,
  ListPostsQuerySchema,
  PinPostSchema,
  ReviewPostSchema,
  VoteSchema,
} from './model';

/** Wraps a handler so validation and permission errors map to proper status codes. */
const handle =
  (action: string, fn: (req: any, res: Response) => Promise<unknown>) =>
  async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request' });
      }
      if (error instanceof FeedError) {
        return res.status(error.status).json({ error: error.message });
      }
      req.log?.error({ err: error }, `${action} failed`);
      res.status(500).json({ error: `Failed to ${action}` });
    }
  };

export const listSpaces = handle('load spaces', async (_req, res) => {
  res.json(await feedService.listSpaces());
});

export const listPosts = handle('load posts', async (req, res) => {
  const query = ListPostsQuerySchema.parse(req.query);
  res.json(await feedService.listPosts(req.user.id, query));
});

export const listTopPosts = handle('load top posts', async (_req, res) => {
  res.json(await feedService.listTopPosts());
});

export const createPost = handle('create post', async (req, res) => {
  const input = CreatePostSchema.parse(req.body);
  res.status(201).json(await feedService.createPost(req.user, input));
});

export const deletePost = handle('delete post', async (req, res) => {
  await feedService.deletePost(req.user, req.params.id);
  res.status(204).end();
});

export const pinPost = handle('pin post', async (req, res) => {
  const { pinned } = PinPostSchema.parse(req.body);
  res.json(await feedService.setPinned(req.user, req.params.id, pinned));
});

export const likePost = handle('like post', async (req, res) => {
  res.json(await feedService.setLiked(req.user.id, req.params.id, true));
});

export const unlikePost = handle('unlike post', async (req, res) => {
  res.json(await feedService.setLiked(req.user.id, req.params.id, false));
});

export const bookmarkPost = handle('bookmark post', async (req, res) => {
  res.json(await feedService.setBookmarked(req.user.id, req.params.id, true));
});

export const unbookmarkPost = handle('remove bookmark', async (req, res) => {
  res.json(await feedService.setBookmarked(req.user.id, req.params.id, false));
});

export const votePoll = handle('vote', async (req, res) => {
  const { optionId } = VoteSchema.parse(req.body);
  res.json(await feedService.vote(req.user.id, req.params.id, optionId));
});

export const listComments = handle('load comments', async (req, res) => {
  res.json(await feedService.listComments(req.params.id));
});

export const createComment = handle('add comment', async (req, res) => {
  const { content } = CreateCommentSchema.parse(req.body);
  res.status(201).json(await feedService.createComment(req.user.id, req.params.id, content));
});

export const deleteComment = handle('delete comment', async (req, res) => {
  await feedService.deleteComment(req.user, req.params.id);
  res.status(204).end();
});

export const createUpload = handle('prepare upload', async (req, res) => {
  const { contentType } = CreateUploadSchema.parse(req.body);
  res.status(201).json(await feedService.createImageUpload(req.user.id, contentType));
});

export const listPendingReviews = handle('load posts to review', async (req, res) => {
  res.json(await feedService.listPendingReviews(req.user));
});

export const approvePost = handle('approve post', async (req, res) => {
  res.json(await feedService.reviewPost(req.user, req.params.id, 'PUBLISHED'));
});

export const rejectPost = handle('reject post', async (req, res) => {
  const { note } = ReviewPostSchema.parse(req.body ?? {});
  res.json(await feedService.reviewPost(req.user, req.params.id, 'REJECTED', note));
});
