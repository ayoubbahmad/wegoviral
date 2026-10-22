import { z } from 'zod';

export class ProfileError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const SOCIAL_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'x', 'facebook', 'linkedin', 'website'] as const;

export const UpdateProfileSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name').max(60),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9_]{3,30}$/, 'Use 3-30 lowercase letters, numbers or underscores'),
    bio: z.string().trim().max(300, 'Keep your bio under 300 characters').nullable(),
    niche: z.string().trim().max(60).nullable(),
    socialLinks: z
      .array(
        z.object({
          platform: z.enum(SOCIAL_PLATFORMS),
          url: z.string().trim().url('Enter a full link, starting with https://').max(300),
        }),
      )
      .max(7),
    avatarUrl: z.string().url().max(500).nullable(),
  })
  .partial();

export const AvatarUploadSchema = z.object({
  contentType: z.enum(['image/png', 'image/jpeg', 'image/webp']),
  size: z.number().int().positive().max(2 * 1024 * 1024, 'Pick a photo under 2 MB'),
});

export const PreferencesSchema = z
  .object({
    theme: z.enum(['light', 'dark', 'system']),
    reducedMotion: z.boolean(),
  })
  .partial();

export const PrivacySchema = z
  .object({
    showOnLeaderboard: z.boolean(),
    showBadges: z.boolean(),
    showSocialLinks: z.boolean(),
  })
  .partial();

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
