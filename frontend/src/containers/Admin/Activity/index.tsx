'use client';

import { useState } from 'react';
import { History, Loader2 } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { avatarFor, cn } from '@/lib/utils';
import { useAdminActivity } from '../api';
import { describeActivity } from '../components/describeActivity';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

const FILTERS = [undefined, 'member', 'post', 'comment', 'badge', 'course', 'challenge', 'help'] as const;

export const AdminActivityContainer = () => {
  const t = useT();
  const [targetType, setTargetType] = useState<string | undefined>();
  const { data, isPending, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAdminActivity(targetType);
  const entries = data?.pages.flatMap((page) => page.entries) ?? [];

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/activity-log" title={t('admin.activityPage.title')} description={t('admin.activityPage.description')} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('admin.activityPage.filterLabel')}>
        {FILTERS.map((filter) => (
          <button
            key={filter ?? 'all'}
            role="tab"
            aria-selected={targetType === filter}
            onClick={() => setTargetType(filter)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
              targetType === filter
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {t(`admin.activityPage.filters.${filter ?? 'all'}`)}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : entries.length === 0 ? (
        <EmptyState icon={History} title={t('admin.activityPage.emptyTitle')} description={t('admin.activityPage.emptyBody')} />
      ) : (
        <Card padding="none">
          <ul className="divide-y divide-border/50">
            {entries.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 px-6 py-4">
                {entry.actor ? (
                  <img src={avatarFor(entry.actor)} alt="" className="w-8 h-8 rounded-full border border-border shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
                )}
                <div className="min-w-0 flex-1 text-sm">
                  <p>
                    <span className="font-semibold">
                      {entry.actor ? `@${entry.actor.username}` : t('admin.activityPage.removedAccount')}
                    </span>{' '}
                    {describeActivity(entry, t)}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString(activeIntl())}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-sm font-semibold text-primary hover:underline disabled:opacity-60"
          >
            {isFetchingNextPage ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common.loadMore')}
          </button>
        </div>
      )}
    </PageContainer>
  );
};
