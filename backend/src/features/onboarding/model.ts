import { z } from 'zod';

export const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'facebook', 'x', 'linkedin', 'snapchat', 'twitch', 'other'] as const;
export const FOLLOWER_RANGES = ['0-1k', '1k-10k', '10k-50k', '50k-100k', '100k-500k', '500k+'] as const;

export const ApplicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100),
  // Loose on purpose: international formats vary; we only want something callable
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid phone number, e.g. +212 6 12 34 56 78'),
  niche: z.string().trim().min(2, 'Tell us what you create').max(200),
  platforms: z
    .array(
      z.object({
        platform: z.enum(PLATFORMS),
        handle: z.string().trim().min(1, 'Add your handle or link').max(200),
      }),
    )
    .min(1, 'Add at least one platform')
    .max(10),
  followerRange: z.enum(FOLLOWER_RANGES).optional(),
  about: z.string().trim().max(1000).optional(),
  /** Invite or referral code from a /join link */
  code: z.string().trim().max(50).optional(),
});

export const AcceptRulesSchema = z.object({ version: z.number().int().min(1) });

export const QuizAnswersSchema = z.object({ answers: z.array(z.number().int().min(0)).min(1) });

export type ApplicationInput = z.infer<typeof ApplicationSchema>;

export class OnboardingError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
