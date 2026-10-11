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

export default function FollowersPage() {
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
        title='Follower Intelligence'
        description='Identify your most valuable fans and understand who is engaging with you.'
      />

      {/* Health Stats */}
      <div className='grid gap-6 md:grid-cols-3'>
        <StatCard
          label='Total Followers'
          value={summary.total || '12,345'}
          icon={Users}
          trend={summary.total ? undefined : 12}
        />

        <StatCard
          label='Loyal Fans (VIP)'
          value={summary.vips || '482'}
          icon={UserCheck}
          description='Fans with highly consistent engagement.'
          className='[&_svg]:text-yellow-600 [&_.bg-primary\/10]:bg-yellow-500/10'
        />

        <StatCard
          label='New Faces'
          value={summary.newThisMonth || '145'}
          icon={UserPlus}
          description='Joined in the last 30 days.'
          className='[&_svg]:text-blue-600 [&_.bg-primary\/10]:bg-blue-500/10'
        />
      </div>

      {/* Filters */}
      <Tabs
        activeId={filter}
        onChange={(id) => setFilter(id as any)}
        items={[
          { id: 'All', label: 'All Members', icon: Users },
          { id: 'VIP', label: 'Loyal & VIP', icon: UserCheck },
          { id: 'TopLikers', label: 'Top Likers', icon: ThumbsUp },
          { id: 'New', label: 'New Faces', icon: UserPlus },
        ]}
        containerClassName='!justify-start'
      />

      {/* List */}
      {isLoading ? (
        <div className='p-12 text-center text-muted-foreground'>
          Loading follower data...
        </div>
      ) : (
        <FollowerList followers={displayedFollowers} />
      )}
    </PageContainer>
  );
}
