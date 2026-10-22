'use client';

import { PageHeader } from '@/components/PageHeader';
import { useT } from '@/i18n/provider';

export default function ExportsPage() {
  const t = useT();
  return (
    <div className='space-y-12 pb-32'>
      <PageHeader title={t('creator.exports.title')} description={t('creator.exports.description')} />
    </div>
  );
}
