import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { COMMUNITY_BUCKET, communityPublicUrlPrefix, supabaseAdmin } from '../../lib/supabase-admin';
import { levelFor } from '../../lib/gamification';
import { effectiveTierId, getTiers } from '../../lib/access';
import { getSettings } from '../../lib/settings';
import { logActivity } from '../../lib/activity';
import { ProfileError, UpdateProfileInput } from './model';

const EXTENSIONS: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

/** Everything the Settings page shows, in one request. */
export async function getSettingsData(userId: string) {
  const [profile, settings, tiers] = await Promise.all([
    prisma.userProfile.findUniqueOrThrow({
      where: { id: userId },
      select: {
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        niche: true,
        socialLinks: true,
        preferences: true,
        showOnLeaderboard: true,
        showBadges: true,
        showSocialLinks: true,
        deletionRequestedAt: true,
        createdAt: true,
        points: true,
        tierId: true,
        rulesAcceptedVersion: true,
        rulesAcceptedAt: true,
        application: { select: { niche: true } },
        badges: {
          orderBy: { awardedAt: 'desc' },
          where: { badge: { archivedAt: null } },
          select: { awardedAt: true, badge: { select: { id: true, name: true, emoji: true, color: true, description: true, translations: true } } },
        },
      },
    }),
    getSettings(),
    getTiers(),
  ]);
  const tierId = await effectiveTierId(profile.tierId);
  const tier = tiers.find((item) => item.id === tierId);
  const { application, badges, tierId: _tierId, ...rest } = profile;
  return {
    ...rest,
    // Until the member sets one, the niche from their sign-up form
    niche: profile.niche ?? application?.niche ?? null,
    level: await levelFor(profile.points),
    tier: tier ? { id: tier.id, name: tier.name } : null,
    badges: badges.map((row) => ({ ...row.badge, awardedAt: row.awardedAt })),
    guide: { currentVersion: settings.guideVersion, acceptedVersion: profile.rulesAcceptedVersion, acceptedAt: profile.rulesAcceptedAt },
  };
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  if (input.avatarUrl && !input.avatarUrl.startsWith(`${communityPublicUrlPrefix}avatars/${userId}/`)) {
    throw new ProfileError(400, 'Invalid image URL');
  }
  if (input.username) {
    const taken = await prisma.userProfile.findFirst({ where: { username: input.username, id: { not: userId } }, select: { id: true } });
    if (taken) throw new ProfileError(409, 'This username is already taken');
  }
  const data: Prisma.UserProfileUpdateInput = {
    ...input,
    ...(input.bio !== undefined ? { bio: input.bio || null } : {}),
    ...(input.niche !== undefined ? { niche: input.niche || null } : {}),
  };
  return prisma.userProfile.update({
    where: { id: userId },
    data,
    select: { name: true, username: true, avatarUrl: true, bio: true, niche: true, socialLinks: true },
  });
}

/** Signed URL the browser uploads the new photo to directly. */
export async function createAvatarUpload(userId: string, contentType: string) {
  const path = `avatars/${userId}/${randomUUID()}.${EXTENSIONS[contentType]}`;
  const { data, error } = await supabaseAdmin.storage.from(COMMUNITY_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message || 'Could not create upload URL');
  const { data: publicUrl } = supabaseAdmin.storage.from(COMMUNITY_BUCKET).getPublicUrl(path);
  return { path, token: data.token, publicUrl: publicUrl.publicUrl };
}

export async function updatePreferences(userId: string, changes: Record<string, unknown>) {
  const { preferences } = await prisma.userProfile.findUniqueOrThrow({ where: { id: userId }, select: { preferences: true } });
  const merged = { ...(preferences as Record<string, unknown>), ...changes };
  await prisma.userProfile.update({ where: { id: userId }, data: { preferences: merged as Prisma.InputJsonObject } });
  return merged;
}

export async function updatePrivacy(userId: string, changes: { showOnLeaderboard?: boolean; showBadges?: boolean; showSocialLinks?: boolean }) {
  return prisma.userProfile.update({
    where: { id: userId },
    data: changes,
    select: { showOnLeaderboard: true, showBadges: true, showSocialLinks: true },
  });
}

/** The team handles the deletion; the member can change their mind until then. */
export async function setDeletionRequest(userId: string, requested: boolean) {
  const profile = await prisma.userProfile.update({
    where: { id: userId },
    data: { deletionRequestedAt: requested ? new Date() : null },
    select: { deletionRequestedAt: true, username: true },
  });
  await logActivity({
    actorId: userId,
    action: requested ? 'member.deletion_requested' : 'member.deletion_cancelled',
    targetType: 'member',
    targetId: userId,
    targetLabel: profile.username,
  });
  return { deletionRequestedAt: profile.deletionRequestedAt };
}
