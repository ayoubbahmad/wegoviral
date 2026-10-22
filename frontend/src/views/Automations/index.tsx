'use client';

import { AutomationsContainer } from '@/containers/Automations';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Plus, XCircle } from 'lucide-react';
import { useAutomationsController } from '@/containers/Automations/controller';
import { useT } from '@/i18n/provider';

export const AutomationsView = () => {
  const t = useT();
  const { isAdding, toggleAdding } = useAutomationsController();

  return (
    <PageContainer>
      <PageHeader
        title={t('creator.automations.title')}
        description={t('creator.automations.description')}
        actions={
          <Button
            onClick={toggleAdding}
            variant={isAdding ? 'outline' : 'primary'}
            className='px-5'
          >
            {isAdding ? (
              <XCircle className='w-4 h-4' />
            ) : (
              <Plus className='w-4 h-4' />
            )}
            {isAdding ? t('common.cancel') : t('creator.automations.new')}
          </Button>
        }
      />
      <AutomationsContainer />
    </PageContainer>
  );
};
