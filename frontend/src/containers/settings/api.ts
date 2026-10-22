import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/Auth';
import type { BadgeChip, MemberLevel } from '@/types/communityFeed';

export const SOCIAL_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'x', 'facebook', 'linkedin', 'website'] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type SocialLink = { platform: SocialPlatform; url: string };
export type ThemePreference = 'light' | 'dark' | 'system';
export interface Preferences {
  theme?: ThemePreference;
  reducedMotion?: boolean;
}
export interface Privacy {
  showOnLeaderboard: boolean;
  showBadges: boolean;
  showSocialLinks: boolean;
}

export interface SettingsData extends Privacy {
  name: string | null;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  niche: string | null;
  socialLinks: SocialLink[];
  preferences: Preferences;
  deletionRequestedAt: string | null;
  createdAt: string;
  points: number;
  level: MemberLevel;
  tier: { id: string; name: string } | null;
  badges: (BadgeChip & { description: string; awardedAt: string })[];
  guide: { currentVersion: number; acceptedVersion: number | null; acceptedAt: string | null };
}

export type ProfileInput = Partial<Pick<SettingsData, 'name' | 'username' | 'bio' | 'niche' | 'socialLinks' | 'avatarUrl'>>;

const settingsKey = ['settings'] as const;

export const useSettings = () =>
  useQuery({ queryKey: settingsKey, queryFn: async () => (await apiClient.get<SettingsData>('/profile/settings')).data });

/** Saves, then refreshes the settings and the signed-in user (name and photo show in the sidebar). */
const useSettingsMutation = <TInput, TResult>(fn: (input: TInput) => Promise<TResult>) => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  return useMutation({
    mutationFn: fn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: settingsKey });
      await refreshUser();
    },
  });
};

export const useUpdateProfile = () =>
  useSettingsMutation(async (input: ProfileInput) => (await apiClient.patch('/profile', input)).data);

export const useUpdatePreferences = () =>
  useSettingsMutation(async (input: Preferences) => (await apiClient.put<Preferences>('/profile/preferences', input)).data);

export const useUpdatePrivacy = () =>
  useSettingsMutation(async (input: Partial<Privacy>) => (await apiClient.put<Privacy>('/profile/privacy', input)).data);

export const useDeletionRequest = () =>
  useSettingsMutation(async (requested: boolean) =>
    (await (requested ? apiClient.post('/profile/deletion-request') : apiClient.delete('/profile/deletion-request'))).data,
  );

/** Uploads straight to storage with a signed URL from our API; returns the public URL. */
export async function uploadAvatar(file: File) {
  const { data } = await apiClient.post<{ path: string; token: string; publicUrl: string }>('/profile/avatar-upload', {
    contentType: file.type,
    size: file.size,
  });
  const { error } = await supabase.storage.from('community').uploadToSignedUrl(data.path, data.token, file, { contentType: file.type });
  if (error) throw error;
  return data.publicUrl;
}

export const checkUsername = async (username: string) =>
  (await apiClient.get<{ available: boolean; reason?: string }>('/auth/username-available', { params: { username } })).data;
