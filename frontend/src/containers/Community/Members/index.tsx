'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { SearchInput } from '@/components/SearchInput';
import { Select } from '@/components/Select';
import { Skeleton } from '@/components/Skeleton';
import { Button } from '@/components/Button';
import { MemberBadges } from '@/components/MemberBadges';
import { useT } from '@/i18n/provider';
import { DirectorySort, MemberCard, useMembers } from './api';

const SORTS: DirectorySort[] = ['recent', 'points', 'name'];

export const avatarOf = (member: { avatarUrl: string | null; username: string }) =>
  member.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`;

/** The member directory: search, sort and open a profile. */
export const CommunityMembersContainer = () => {
  const t = useT();
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<DirectorySort>('recent');
  const [page, setPage] = useState(1);
  const { data, isPending } = useMembers(query, sort, page);
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  // Search once the member pauses typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <PageContainer>
      <PageHeader title={t('members.title')} description={t('members.description')} />

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onSearch={() => setQuery(search.trim())}
          placeholder={t('members.search')}
          containerClassName='max-w-none flex-1'
        />
        <div className='w-full sm:w-48'>
          <Select
            aria-label={t('members.sort')}
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as DirectorySort);
              setPage(1);
            }}
            options={SORTS.map((value) => ({ value, label: t(`members.sorts.${value}`) }))}
          />
        </div>
      </div>

      {isPending ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className='h-32 rounded-2xl' />
          ))}
        </div>
      ) : !data?.members.length ? (
        <EmptyState icon={Users} title={t('members.emptyTitle')} description={t('members.emptyBody')} />
      ) : (
        <div className='space-y-6'>
          <p className='text-sm text-muted-foreground'>{t('members.count', { count: data.total })}</p>
          <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {data.members.map((member) => (
              <li key={member.id}>
                <DirectoryCard member={member} />
              </li>
            ))}
          </ul>
          {pages > 1 && (
            <div className='flex items-center justify-center gap-3'>
              <Button variant='outline' size='sm' disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className='h-4 w-4 rtl:rotate-180' /> {t('members.previous')}
              </Button>
              <span className='text-sm text-muted-foreground'>{t('members.pageOf', { page, pages })}</span>
              <Button variant='outline' size='sm' disabled={page >= pages} onClick={() => setPage(page + 1)}>
                {t('members.next')} <ChevronRight className='h-4 w-4 rtl:rotate-180' />
              </Button>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

const DirectoryCard = ({ member }: { member: MemberCard }) => {
  const t = useT();
  return (
    <Link
      href={`/community/members/${member.username}`}
      className='flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40'
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- avatars come from storage, Google or DiceBear */}
      <img src={avatarOf(member)} alt='' className='h-12 w-12 shrink-0 rounded-full border border-border object-cover' />
      <div className='min-w-0 flex-1 space-y-1'>
        <div className='flex items-center gap-2'>
          <p className='truncate font-semibold'>{member.name || `@${member.username}`}</p>
          <MemberBadges badges={member.badges} />
        </div>
        <p className='truncate text-xs text-muted-foreground' dir='ltr'>@{member.username}</p>
        {member.niche && <p className='truncate text-sm text-foreground/80'>{member.niche}</p>}
        <p className='text-xs text-muted-foreground'>{t('members.level', { level: member.level.level, name: member.level.name })}</p>
      </div>
    </Link>
  );
};
