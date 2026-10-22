import { BadgeCheck, LucideIcon, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';

export const SETTINGS_SECTIONS = ['profile', 'account', 'preferences', 'membership'] as const;
export type SettingsSection = (typeof SETTINGS_SECTIONS)[number];

export const SECTION_ICONS: Record<SettingsSection, LucideIcon> = {
  profile: UserRound,
  account: ShieldCheck,
  preferences: SlidersHorizontal,
  membership: BadgeCheck,
};

export const isSettingsSection = (value: unknown): value is SettingsSection =>
  SETTINGS_SECTIONS.includes(value as SettingsSection);
