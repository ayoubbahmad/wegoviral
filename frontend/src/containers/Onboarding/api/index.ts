import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'other', label: 'Other' },
] as const;

export const FOLLOWER_RANGES = ['0-1k', '1k-10k', '10k-50k', '50k-100k', '100k-500k', '500k+'] as const;

export type Platform = (typeof PLATFORMS)[number]['value'];

export interface ApplicationInput {
  fullName: string;
  phone: string;
  niche: string;
  platforms: { platform: Platform; handle: string }[];
  followerRange?: string;
  about?: string;
  code?: string;
}

export interface CodePreview {
  valid: boolean;
  reason?: string;
  type?: 'invite' | 'referral';
  label?: string;
  referrer?: { username: string; name: string | null; avatarUrl: string | null };
}

export interface Guide {
  version: number;
  sections: { id: string; title: string; body: string; mediaUrl: string | null }[];
  quiz: { passPercent: number; questions: { id: string; question: string; options: string[] }[] } | null;
  acceptedVersion: number | null;
  acceptedAt: string | null;
  quizPassedVersion: number | null;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  passPercent: number;
  results: boolean[];
}

export const useCodePreview = (code: string | null) =>
  useQuery({
    queryKey: ['onboarding', 'code', code],
    queryFn: async () => (await apiClient.get<CodePreview>(`/onboarding/codes/${code}`)).data,
    enabled: Boolean(code),
  });

export const useGuide = () =>
  useQuery({
    queryKey: ['onboarding', 'guide'],
    queryFn: async () => (await apiClient.get<Guide>('/onboarding/guide')).data,
  });

export const useSubmitApplication = () =>
  useMutation({
    mutationFn: async (input: ApplicationInput) =>
      (await apiClient.post<{ approved: boolean }>('/onboarding/application', input)).data,
  });

export const useAcceptRules = () =>
  useMutation({
    mutationFn: async (version: number) =>
      (await apiClient.post<{ acceptedVersion: number }>('/onboarding/guide/accept', { version })).data,
  });

export const useSubmitQuiz = () =>
  useMutation({
    mutationFn: async (answers: number[]) =>
      (await apiClient.post<QuizResult>('/onboarding/quiz', { answers })).data,
  });

export const useReferral = () =>
  useQuery({
    queryKey: ['onboarding', 'referral'],
    queryFn: async () =>
      (await apiClient.get<{ code: string; referralCount: number }>('/onboarding/referral')).data,
  });
