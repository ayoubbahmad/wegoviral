'use client';

import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { SettingsNav } from '@/containers/settings/SettingsNav';
import { useT } from '@/i18n/provider';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = useT();
  return (
    <PageContainer>
      <PageHeader title={t('settings.title')} description={t('settings.description')} />
      <div className='grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]'>
        <SettingsNav className='hidden md:block md:sticky md:top-8 md:self-start' />
        <div className='min-w-0 max-w-3xl'>{children}</div>
      </div>
    </PageContainer>
  );
}
