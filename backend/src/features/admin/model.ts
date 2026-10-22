import { z } from 'zod';
import { translationsSchema } from '../../lib/localize';

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
  targetType: z.enum(['member', 'post', 'comment', 'space', 'settings', 'guide', 'invite', 'tier', 'event', 'badge', 'course', 'challenge', 'help']).optional(),
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
    flaggedWords: z
      .array(z.string().trim().min(1).max(50))
      .max(300)
      .transform((words) => [...new Set(words.map((word) => word.toLowerCase()))]),
  })
  .partial();

export const GuideSectionsSchema = z.object({
  sections: z
    .array(
      z.object({
        title: z.string().trim().min(1, 'Every section needs a title').max(120),
        body: z.string().trim().min(1, 'Every section needs some text').max(10000),
        mediaUrl: z.string().trim().url().max(500).optional().or(z.literal('').transform(() => undefined)),
        translations: translationsSchema({ title: z.string().trim().max(120), body: z.string().trim().max(10000) }).default({}),
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
          translations: translationsSchema({ question: z.string().trim().max(300), options: z.array(z.string().trim().max(200)).max(6) }).default({}),
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

// ─── Moderation & spaces (Phase 3) ───────────────────────────────────────────

export const ListReportsQuerySchema = z.object({
  status: z.enum(['OPEN', 'RESOLVED', 'DISMISSED']).default('OPEN'),
});

export const ResolveReportsSchema = z
  .object({
    targetType: z.enum(['post', 'comment']),
    targetId: z.string().min(1),
    action: z.enum(['dismiss', 'remove']),
    authorAction: z
      .object({
        type: z.enum(['warn', 'mute', 'suspend']),
        reason: z.string().trim().min(3, 'Give the author a short reason').max(500),
        durationDays: z.number().int().min(1).max(365).nullable().optional(),
      })
      .optional(),
    note: z.string().trim().max(500).optional(),
  })
  .refine((input) => input.action === 'remove' || !input.authorAction, {
    message: 'Author actions only apply when removing content',
  });

export const WarnMemberSchema = z.object({ reason: z.string().trim().min(3, 'Give a short reason').max(500) });

export const RestoreSchema = z.object({ targetType: z.enum(['post', 'comment']), id: z.string().min(1) });

const optionalUrl = z.string().trim().url().max(500).optional().or(z.literal('').transform(() => undefined));

export const SpaceSchema = z.object({
  name: z.string().trim().min(2, 'Give the space a name').max(40),
  emoji: z.string().trim().min(1, 'Pick an emoji').max(8),
  description: z.string().trim().min(3, 'Describe the space in a few words').max(200),
  coverUrl: optionalUrl,
  adminOnly: z.boolean(),
  translations: translationsSchema({ name: z.string().trim().max(40), description: z.string().trim().max(200) }).optional(),
});

// Defaults only on create: on a partial update they would overwrite fields the admin didn't touch
export const CreateSpaceSchema = SpaceSchema.extend({ adminOnly: SpaceSchema.shape.adminOnly.default(false) });
export const UpdateSpaceSchema = SpaceSchema.partial();
export const ReorderSpacesSchema = z.object({ ids: z.array(z.string().min(1)).min(1).max(100) });
export const ArchiveSpaceSchema = z.object({ archived: z.boolean() });

export type ResolveReportsInput = z.infer<typeof ResolveReportsSchema>;
export type SpaceInput = z.infer<typeof CreateSpaceSchema>;

// ─── Access rules & tiers (Phase 4) ──────────────────────────────────────────

export const TierSchema = z.object({
  name: z.string().trim().min(2, 'Give the tier a name').max(40),
  description: z.string().trim().max(200).optional(),
});
export const UpdateTierSchema = TierSchema.partial().extend({ isDefault: z.boolean().optional() });

export const MemberTierSchema = z.object({ tierId: z.string().min(1).nullable() });

export const AccessRuleSchema = z.object({
  minRole: z.enum(ROLE_VALUES).nullable().optional(),
  tierIds: z.array(z.string().min(1)).max(20).default([]),
  minDays: z.number().int().min(1).max(3650).nullable().optional(),
  minLevel: z.number().int().min(2).max(100).nullable().optional(),
});

export type TierInput = z.infer<typeof TierSchema>;
export type AccessRuleInput = z.infer<typeof AccessRuleSchema>;

// ─── Points, levels & badges (Phase 6) ───────────────────────────────────────

export const PointRulesSchema = z.object({
  rules: z
    .array(
      z.object({
        action: z.string().min(1),
        points: z.number().int().min(-1000).max(1000),
        dailyCap: z.number().int().min(1).max(10000).nullable(),
        enabled: z.boolean(),
      }),
    )
    .min(1),
});

export const LevelsSchema = z.object({
  levels: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'Every level needs a name').max(30),
        minPoints: z.number().int().min(0).max(10_000_000),
        translations: translationsSchema({ name: z.string().trim().max(30) }).default({}),
      }),
    )
    .min(1)
    .max(50),
});

const AutoRuleSchema = z.object({
  type: z.enum(['POSTS', 'COMMENTS', 'LIKES_RECEIVED', 'EVENTS_JOINED', 'COURSES_COMPLETED', 'CHALLENGES_COMPLETED', 'CHALLENGES_WON', 'POINTS']),
  threshold: z.number().int().min(1).max(10_000_000),
});

export const BadgeSchema = z.object({
  name: z.string().trim().min(2, 'Give the badge a name').max(40),
  emoji: z.string().trim().min(1, 'Pick an emoji').max(8),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a color like #f59e0b'),
  description: z.string().trim().max(200),
  autoRule: AutoRuleSchema.nullable(),
  translations: translationsSchema({ name: z.string().trim().max(40), description: z.string().trim().max(200) }).optional(),
});
export const UpdateBadgeSchema = BadgeSchema.partial();
export const ArchiveBadgeSchema = z.object({ archived: z.boolean() });
export const AwardBadgeSchema = z.object({ badgeId: z.string().min(1), note: z.string().trim().max(200).optional() });
export const AdjustPointsSchema = z.object({
  points: z.number().int().min(-10000).max(10000).refine((value) => value !== 0, 'Enter a number other than 0'),
  reason: z.string().trim().min(3, 'Give a short reason').max(200),
});

export type PointRulesInput = z.infer<typeof PointRulesSchema>;
export type LevelsInput = z.infer<typeof LevelsSchema>;
export type BadgeInput = z.infer<typeof BadgeSchema>;

// ─── Stats (Phase 10) ────────────────────────────────────────────────────────

const isValidTimezone = (zone: string) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
};

export const StatsQuerySchema = z.object({
  range: z.enum(['30d', '90d', '12m']).default('30d'),
  timezone: z.string().refine(isValidTimezone, 'Unknown time zone').default('UTC'),
});
export type StatsQuery = z.infer<typeof StatsQuerySchema>;
