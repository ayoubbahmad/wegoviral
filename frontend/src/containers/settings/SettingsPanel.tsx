'use client';

import { Skeleton } from '@/components/Skeleton';
import { useSettings } from './api';
import { SettingsSection } from './sections';
import { ProfilePanel } from './panels/ProfilePanel';
import { AccountPanel } from './panels/AccountPanel';
import { PreferencesPanel } from './panels/PreferencesPanel';
import { MembershipPanel } from './panels/MembershipPanel';

export function SettingsPanel({ section }: { section: SettingsSection }) {
  const { data } = useSettings();
  if (!data) return <Skeleton className='h-96 rounded-2xl' />;
  switch (section) {
    case 'profile':
      // Keyed so the form starts from the saved values again after a save
      return <ProfilePanel key={JSON.stringify([data.name, data.username, data.bio, data.niche, data.socialLinks, data.avatarUrl])} data={data} />;
    case 'account':
      return <AccountPanel data={data} />;
    case 'preferences':
      return <PreferencesPanel data={data} />;
    case 'membership':
      return <MembershipPanel data={data} />;
  }
}
