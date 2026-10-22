'use client';

import { useState } from 'react';
import { useFollowers } from '@/hooks/useFollowers';
import { FollowerList } from '@/containers/Followers/FollowerList';
import { Users, UserCheck, UserPlus, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_FOLLOWERS } from '@/lib/mock-data';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Tabs } from '@/components/Tabs';
import { PageContainer } from '@/components/PageContainer';
import { StatCard } from '@/components/StatCard';
import { useT } from '@/i18n/provider';

export default function FollowersPage() {
  const t = useT();
  const { followers, summary, isLoading } = useFollowers();
  const [filter, setFilter] = useState<'All' | 'VIP' | 'New' | 'TopLikers'>(
    'All',
  );

  // Fallback to mock data if no followers yet to show the UI value
  const dataToUse =
    followers && followers.length > 0 ? followers : MOCK_FOLLOWERS;

  const getFilteredAndSortedFollowers = () => {
    let result = [...dataToUse];

    // Filter
    if (filter === 'VIP') {
      result = result.filter(
        (f) => f.segment === 'VIP' || f.segment === 'Superfan',
      );
    } else if (filter === 'New') {
      result = result.filter((f) => f.segment === 'New');
    }

    // Sort
    if (filter === 'TopLikers') {
      result.sort((a, b) => b.stats.likes - a.stats.likes);
    }

    return result;
  };

  const displayedFollowers = getFilteredAndSortedFollowers();

  return (
    <PageContainer>
      <PageHeader
        title={t('creator.followers.title')}
        description={t('creator.followers.description')}
      />

      {/* Health Stats */}
      <div className='grid gap-6 md:grid-cols-3'>
        <StatCard
          label={t('creator.followers.total')}
          value={summary.total || '12,345'}
          icon={Users}
          trend={summary.total ? undefined : 12}
        />

        <StatCard
          label={t('creator.followers.loyal')}
          value={summary.vips || '482'}
          icon={UserCheck}
          description={t('creator.followers.loyalBody')}
          className='[&_svg]:text-yellow-600 [&_.bg-primary\/10]:bg-yellow-500/10'
        />

        <StatCard
          label={t('creator.followers.newFaces')}
          value={summary.newThisMonth || '145'}
          icon={UserPlus}
          description={t('creator.followers.newFacesBody')}
          className='[&_svg]:text-blue-600 [&_.bg-primary\/10]:bg-blue-500/10'
        />
      </div>

      {/* Filters */}
      <Tabs
        activeId={filter}
        onChange={(id) => setFilter(id as any)}
        items={[
          { id: 'All', label: t('creator.followers.tabs.All'), icon: Users },
          { id: 'VIP', label: t('creator.followers.tabs.VIP'), icon: UserCheck },
          { id: 'TopLikers', label: t('creator.followers.tabs.TopLikers'), icon: ThumbsUp },
          { id: 'New', label: t('creator.followers.tabs.New'), icon: UserPlus },
        ]}
        containerClassName='!justify-start'
      />

      {/* List */}
      {isLoading ? (
        <div className='p-12 text-center text-muted-foreground'>
          {t('creator.followers.loading')}
        </div>
      ) : (
        <FollowerList followers={displayedFollowers} />
      )}
    </PageContainer>
  );
}
