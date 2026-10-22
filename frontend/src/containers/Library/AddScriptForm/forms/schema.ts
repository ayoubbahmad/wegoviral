import { z } from 'zod';
import type { MessageKey } from '@/i18n/messages';

type Translate = (key: MessageKey) => string;

// Built with the app's language so field errors read naturally
export const ScriptStepSchema = (t: Translate) =>
  z.object({
    step: z.string().min(1, t('creator.library.errors.stepName')),
    description: z.string().optional(),
  });

export const ScriptTemplateSchema = (t: Translate) =>
  z.object({
    title: z.string().min(1, t('creator.library.errors.title')),
    category: z.enum(['Educational', 'Entertainment', 'Sales', 'Storytelling']),
    content: z.array(ScriptStepSchema(t)).min(1, t('creator.library.errors.oneStep')),
    sourceUrl: z.string().url(t('creator.library.errors.url')).optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
    sourceMetadata: z.any().optional(),
  });

export type ScriptTemplateFormValues = z.infer<ReturnType<typeof ScriptTemplateSchema>>;
