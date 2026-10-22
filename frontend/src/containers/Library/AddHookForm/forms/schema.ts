'use client';

import { z } from 'zod';
import type { MessageKey } from '@/i18n/messages';

type Translate = (key: MessageKey) => string;

// Built with the app's language so field errors read naturally
export const HookSchema = (t: Translate) =>
  z.object({
    content: z.string().min(1, t('creator.library.errors.content')),
    type: z.enum(['Verbal', 'Visual', 'Text', 'Audio']),
    emotion: z.enum(['Curiosity', 'Fear', 'Humor', 'Desire', 'Surprise', 'Inspiration']),
    topic: z.string().optional(),
    sourceUrl: z.string().url(t('creator.library.errors.url')).optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
    sourceMetadata: z.any().optional(),
  });

export type HookFormValues = z.infer<ReturnType<typeof HookSchema>>;
