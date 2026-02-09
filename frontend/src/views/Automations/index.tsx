'use client';

import { AutomationsContainer } from '@/containers/Automations';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Plus, XCircle } from 'lucide-react';
import { useAutomationsController } from '@/containers/Automations/controller';

export const AutomationsView = () => {
  const { isAdding, toggleAdding } = useAutomationsController();

  return (
    <PageContainer>
      <PageHeader
        title='Automations'
        description='Trigger automatic messages based on keywords in comments or mentions.'
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
            {isAdding ? 'Cancel' : 'New Automation'}
          </Button>
        }
      />
      <AutomationsContainer />
    </PageContainer>
  );
};
