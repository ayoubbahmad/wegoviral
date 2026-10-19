import { z } from 'zod';
import { communityPublicUrlPrefix } from '../../lib/supabase-admin';

const optionalUrl = z.string().trim().url('Enter a full link, starting with https://').max(500).optional().nullable().or(z.literal('').transform(() => null));

const isValidTimezone = (zone: string) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
};

// No defaults here: they would also fill in fields missing from a partial update
const ChallengeFields = z.object({
  title: z.string().trim().min(3, 'Give the challenge a title').max(120),
  description: z.string().trim().max(1000),
  rules: z.string().trim().max(5000),
  prizes: z.string().trim().max(1000),
  coverUrl: optionalUrl,
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  timezone: z.string().refine(isValidTimezone, 'Unknown time zone'),
  checkInType: z.enum(['DAILY', 'ONE_TIME']),
  requiredCheckIns: z.number().int().min(1).max(366).nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED']),
  completionBadgeId: z.string().min(1).nullable(),
  winnerBadgeId: z.string().min(1).nullable(),
});

export const CreateChallengeSchema = ChallengeFields.extend({
  description: ChallengeFields.shape.description.default(''),
  rules: ChallengeFields.shape.rules.default(''),
  prizes: ChallengeFields.shape.prizes.default(''),
  checkInType: ChallengeFields.shape.checkInType.default('DAILY'),
  requiredCheckIns: ChallengeFields.shape.requiredCheckIns.optional(),
  status: ChallengeFields.shape.status.default('DRAFT'),
  completionBadgeId: ChallengeFields.shape.completionBadgeId.optional(),
  winnerBadgeId: ChallengeFields.shape.winnerBadgeId.optional(),
}).refine((challenge) => challenge.endsAt > challenge.startsAt, { message: 'The challenge must end after it starts', path: ['endsAt'] });

export const UpdateChallengeSchema = ChallengeFields.partial();

export const ListChallengesQuerySchema = z.object({
  scope: z.enum(['active', 'upcoming', 'past']).default('active'),
});

export const CheckInSchema = z.object({
  content: z.string().trim().min(1, 'Say what you did').max(2000),
  // Only images uploaded through the community uploader
  imageUrl: z.string().url().refine((url) => url.startsWith(communityPublicUrlPrefix), 'Invalid image URL').nullable().optional(),
  link: optionalUrl,
});

export const WinnersSchema = z.union([
  z.object({ mode: z.literal('manual'), userIds: z.array(z.string().min(1)).min(1).max(20) }),
  z.object({ mode: z.literal('top'), count: z.number().int().min(1).max(20) }),
  z.object({ mode: z.literal('clear') }),
]);

export type CreateChallengeInput = z.infer<typeof CreateChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof UpdateChallengeSchema>;
export type CheckInInput = z.infer<typeof CheckInSchema>;
export type WinnersInput = z.infer<typeof WinnersSchema>;

export class ChallengeError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
