'use client';

import { notFound, useParams } from 'next/navigation';
import { SettingsPanel } from '@/containers/settings/SettingsPanel';
import { isSettingsSection } from '@/containers/settings/sections';

export default function SettingsSectionPage() {
  const { section } = useParams<{ section: string }>();
  if (!isSettingsSection(section)) notFound();
  return <SettingsPanel section={section} />;
}
