import { z } from 'zod';

const optionalUrl = z.string().trim().url('Enter a full link, starting with https://').max(500).optional().nullable().or(z.literal('').transform(() => null));

// No defaults here: they would also fill in fields missing from a partial update
const CourseFields = z.object({
  title: z.string().trim().min(3, 'Give the course a title').max(120),
  description: z.string().trim().max(5000),
  coverUrl: optionalUrl,
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  completionBadgeId: z.string().min(1).nullable().optional(),
  /** Admins only: hand the course to another instructor */
  ownerId: z.string().min(1).optional(),
});

export const CreateCourseSchema = CourseFields.omit({ ownerId: true, status: true }).extend({
  description: CourseFields.shape.description.default(''),
});
export const UpdateCourseSchema = CourseFields.partial();

const ModuleFields = z.object({
  title: z.string().trim().min(1, 'Give the module a title').max(120),
  dripDays: z.number().int().min(1).max(3650).nullable(),
});
export const CreateModuleSchema = ModuleFields.extend({ dripDays: ModuleFields.shape.dripDays.optional() });
export const UpdateModuleSchema = ModuleFields.partial();

const AttachmentSchema = z
  .object({
    name: z.string().trim().min(1, 'Give the attachment a name').max(120),
    url: z.string().trim().url('Enter a full link, starting with https://').max(1000).nullable().optional(),
    storagePath: z.string().max(500).nullable().optional(),
    size: z.number().int().min(0).nullable().optional(),
  })
  .refine((attachment) => Boolean(attachment.url) !== Boolean(attachment.storagePath), 'An attachment is either a link or an uploaded file');

const LessonFields = z.object({
  title: z.string().trim().min(1, 'Give the lesson a title').max(150),
  type: z.enum(['VIDEO', 'TEXT']),
  videoUrl: optionalUrl,
  content: z.string().max(50_000),
  durationMinutes: z.number().int().min(1).max(1000).nullable(),
  attachments: z.array(AttachmentSchema).max(20),
});
export const CreateLessonSchema = LessonFields.partial().extend({ title: LessonFields.shape.title });
export const UpdateLessonSchema = LessonFields.partial();

/** The whole outline in its new order; lessons can move between modules. */
export const OutlineSchema = z.object({
  modules: z.array(z.object({ id: z.string().min(1), lessonIds: z.array(z.string().min(1)) })).max(200),
});

export const CourseUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(200),
  size: z.number().int().positive().max(50 * 1024 * 1024, 'Files must be 50 MB or smaller'),
});

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
export type CreateModuleInput = z.infer<typeof CreateModuleSchema>;
export type UpdateModuleInput = z.infer<typeof UpdateModuleSchema>;
export type CreateLessonInput = z.infer<typeof CreateLessonSchema>;
export type UpdateLessonInput = z.infer<typeof UpdateLessonSchema>;
export type OutlineInput = z.infer<typeof OutlineSchema>;

export class CourseError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
