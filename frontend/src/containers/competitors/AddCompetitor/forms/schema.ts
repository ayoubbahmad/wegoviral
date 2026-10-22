import * as z from 'zod';
import type { MessageKey } from '@/i18n/messages';

type Translate = (key: MessageKey) => string;

// Built with the app's language so field errors read naturally
export const watchlistSchema = (t: Translate) =>
  z.object({
    competitors: z
      .array(
        z.object({
          platform: z.string().min(1, t('creator.competitors.platformRequired')),
          value: z.string().min(1, t('creator.competitors.valueRequired')),
        }),
      )
      .min(1, t('creator.competitors.oneRequired')),
    watchlistId: z.string().optional(),
  });

export type WatchlistFormValues = z.infer<ReturnType<typeof watchlistSchema>>;
