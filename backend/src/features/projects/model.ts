import { z } from 'zod';

export const ProjectTypeSchema = z.enum([
  'GENERAL',
  'CASE_STUDY',
  'CONTENT_SERIES',
  'COLLABORATIVE',
]);

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: ProjectTypeSchema.optional().default('GENERAL'),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Without the create default: a partial update must not reset the type to GENERAL
export const UpdateProjectSchema = CreateProjectSchema.extend({ type: ProjectTypeSchema.optional() }).partial();

export const CreateProjectItemSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.record(z.string(), z.any()).optional(),
  status: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const UpdateProjectItemSchema = CreateProjectItemSchema.partial();
