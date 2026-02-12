import { z } from 'zod';

export const ScriptStepSchema = z.object({
  step: z.string().min(1, 'Step name is required'),
  description: z.string().optional(),
});

export const ScriptTemplateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['Educational', 'Entertainment', 'Sales', 'Storytelling']),
  content: z.array(ScriptStepSchema).min(1, 'At least one step is required'),
  sourceUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  sourceMetadata: z.any().optional(),
});

export type ScriptTemplateFormValues = z.infer<typeof ScriptTemplateSchema>;
