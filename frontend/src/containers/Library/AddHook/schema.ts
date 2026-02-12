import { z } from 'zod';

export const HookSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['Verbal', 'Visual', 'Text', 'Audio']),
  emotion: z.enum([
    'Curiosity',
    'Fear',
    'Humor',
    'Desire',
    'Surprise',
    'Inspiration',
  ]),
  topic: z.string().optional(),
  sourceUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  sourceMetadata: z.any().optional(),
});

export type HookFormValues = z.infer<typeof HookSchema>;
