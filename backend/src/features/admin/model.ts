import { z } from 'zod';

export const ROLE_VALUES = ['MEMBER', 'INSTRUCTOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] as const;
export const STATUS_VALUES = ['ACTIVE', 'MUTED', 'SUSPENDED', 'BANNED'] as const;

export const ListMembersQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  role: z.enum(ROLE_VALUES).optional(),
  status: z.enum(STATUS_VALUES).optional(),
  sort: z.enum(['newest', 'oldest', 'name']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const ChangeRoleSchema = z.object({ role: z.enum(ROLE_VALUES) });

export const RestrictMemberSchema = z.object({
  status: z.enum(['MUTED', 'SUSPENDED', 'BANNED']),
  reason: z.string().trim().min(3, 'Give a short reason').max(500),
  /** null = until lifted by staff */
  durationDays: z.number().int().min(1).max(365).nullable(),
});

export const ListActivityQuerySchema = z.object({
  targetType: z.enum(['member', 'post', 'comment', 'space', 'settings', 'guide', 'invite']).optional(),
  targetId: z.string().optional(),
  actorId: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListMembersQuery = z.infer<typeof ListMembersQuerySchema>;
export type RestrictMemberInput = z.infer<typeof RestrictMemberSchema>;
export type ListActivityQuery = z.infer<typeof ListActivityQuerySchema>;

export class AdminError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// ─── Joining (Phase 2a) ──────────────────────────────────────────────────────

export const ListApplicationsQuerySchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const RejectApplicationSchema = z.object({
  note: z.string().trim().max(500).optional(),
});

export const SpecialMemberSchema = z.object({ specialMember: z.boolean() });

export const UpdateSettingsSchema = z
  .object({
    requireApproval: z.boolean(),
    requireRules: z.boolean(),
    requireQuiz: z.boolean(),
    quizPassPercent: z.number().int().min(1).max(100),
    probationPostCount: z.number().int().min(0).max(20),
  })
  .partial();

export const GuideSectionsSchema = z.object({
  sections: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'Every section needs a title').max(120),
        body: z.string().trim().min(1, 'Every section needs some text').max(10000),
        mediaUrl: z.string().trim().url().max(500).optional().or(z.literal('').transform(() => undefined)),
      }),
    )
    .max(30),
});

export const QuizSchema = z.object({
  questions: z
    .array(
      z
        .object({
          question: z.string().trim().min(1, 'Every question needs text').max(300),
          options: z.array(z.string().trim().min(1, 'Options cannot be empty').max(200)).min(2).max(6),
          correctIndex: z.number().int().min(0),
        })
        .refine((q) => q.correctIndex < q.options.length, 'Pick the correct answer for every question'),
    )
    .max(20),
});

export const CreateInviteSchema = z.object({
  label: z.string().trim().min(2, 'Give the link a name').max(100),
  autoApprove: z.boolean().default(true),
  specialMember: z.boolean().default(false),
  expiresInDays: z.number().int().min(1).max(365).nullable().default(null),
  maxUses: z.number().int().min(1).max(100000).nullable().default(null),
});

export type ListApplicationsQuery = z.infer<typeof ListApplicationsQuerySchema>;
export type UpdateSettingsInput = z.infer<typeof UpdateSettingsSchema>;
export type GuideSectionsInput = z.infer<typeof GuideSectionsSchema>;
export type QuizInput = z.infer<typeof QuizSchema>;
export type CreateInviteInput = z.infer<typeof CreateInviteSchema>;
