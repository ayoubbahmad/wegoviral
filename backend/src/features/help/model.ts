import { z } from 'zod';

const ROLES = ['MEMBER', 'INSTRUCTOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] as const;
export const HELP_SPACES = ['COMMUNITY', 'CREATOR', 'ADMIN'] as const;

const ArticleFields = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes, e.g. how-points-work'),
  space: z.enum(HELP_SPACES),
  audience: z.enum(ROLES),
  category: z.string().trim().min(2, 'Pick a section').max(60),
  title: z.string().trim().min(3, 'Give the article a title').max(120),
  summary: z.string().trim().max(300),
  body: z.string().max(50_000),
  published: z.boolean(),
});

export const CreateArticleSchema = ArticleFields.extend({
  audience: ArticleFields.shape.audience.default('MEMBER'),
  summary: ArticleFields.shape.summary.default(''),
  body: ArticleFields.shape.body.default(''),
  published: ArticleFields.shape.published.default(false),
});
export const UpdateArticleSchema = ArticleFields.partial();
export const ReorderArticlesSchema = z.object({ ids: z.array(z.string().min(1)).min(1).max(500) });

export const HelpQuerySchema = z.object({
  space: z.enum(['community', 'creator', 'admin']).transform((value) => value.toUpperCase() as (typeof HELP_SPACES)[number]),
  q: z.string().trim().max(100).optional(),
});

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;

export class HelpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
