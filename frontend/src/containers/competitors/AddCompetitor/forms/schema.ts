import * as z from 'zod';

export const watchlistSchema = z.object({
  competitors: z
    .array(
      z.object({
        platform: z.string().min(1, 'Platform is required'),
        value: z.string().min(1, 'URL or username is required'),
      }),
    )
    .min(1, 'At least one competitor is required'),
});

export type WatchlistFormValues = z.infer<typeof watchlistSchema>;
