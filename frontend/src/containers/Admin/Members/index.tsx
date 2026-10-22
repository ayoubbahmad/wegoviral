'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search, Star, Users } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Select } from '@/components/Select';
import { Table } from '@/components/Table';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { avatarFor } from '@/lib/utils';
import { MemberStatus, ROLE_LABELS, STATUS_LABELS, UserRole } from '@/lib/roles';
import { MEMBERS_PAGE_SIZE, useAdminMembers } from '../api';
import { RoleBadge, StatusBadge } from '../components/Badges';
import { MembersFilters } from '../types';
import { MemberPanel } from './MemberPanel';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

const SEARCH_DEBOUNCE_MS = 300;

/** Filters live in the URL so they survive refreshes and can be linked to. */
const useMembersFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filters: MembersFilters = {
    search: params.get('search') || undefined,
    role: (params.get('role') as UserRole) || undefined,
    status: (params.get('status') as MemberStatus) || undefined,
    sort: (params.get('sort') as MembersFilters['sort']) || 'newest',
    page: Number(params.get('page')) || 1,
  };

  const setFilters = (changes: Partial<MembersFilters>) => {
    const next = new URLSearchParams(params.toString());
    // Any filter change starts again from page 1
    const merged = { ...filters, page: 1, ...changes };
    for (const [key, value] of Object.entries(merged)) {
      if (value && !(key === 'page' && value === 1) && !(key === 'sort' && value === 'newest')) {
        next.set(key, String(value));
      } else {
        next.delete(key);
      }
    }
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return { filters, setFilters, selectedId: params.get('member'), params, pathname, router };
};

export const AdminMembersContainer = () => {
  const t = useT();
  const { filters, setFilters, selectedId, params, pathname, router } = useMembersFilters();
  const { data, isPending, isFetching, error } = useAdminMembers(filters);
  const [search, setSearch] = useState(filters.search ?? '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((filters.search ?? '') !== search.trim()) setFilters({ search: search.trim() || undefined });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const openMember = (id: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (id) next.set('member', id);
    else next.delete('member');
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / MEMBERS_PAGE_SIZE)) : 1;

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/member-panel"
        title={t('admin.members.title')}
        description={data ? t('admin.members.count', { count: data.total }) : t('admin.members.everyone')}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('admin.members.search')}
            aria-label={t('admin.members.searchLabel')}
            className="h-11 w-full rounded-lg border border-border bg-card ps-11 pe-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="grid grid-cols-3 gap-3 md:w-[480px]">
          <Select
            aria-label={t('admin.members.roleFilter')}
            value={filters.role ?? ''}
            onChange={(event) => setFilters({ role: (event.target.value as UserRole) || undefined })}
            options={[
              { value: '', label: t('admin.members.allRoles') },
              ...(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => ({ value: role, label: t(`common.roles.${role}`) })),
            ]}
          />
          <Select
            aria-label={t('admin.members.statusFilter')}
            value={filters.status ?? ''}
            onChange={(event) => setFilters({ status: (event.target.value as MemberStatus) || undefined })}
            options={[
              { value: '', label: t('admin.members.allStatuses') },
              ...(Object.keys(STATUS_LABELS) as MemberStatus[]).map((status) => ({
                value: status,
                label: t(`common.statuses.${status}`),
              })),
            ]}
          />
          <Select
            aria-label={t('admin.members.sort')}
            value={filters.sort}
            onChange={(event) => setFilters({ sort: event.target.value as MembersFilters['sort'] })}
            options={[
              { value: 'newest', label: t('admin.members.newest') },
              { value: 'oldest', label: t('admin.members.oldest') },
              { value: 'name', label: t('admin.members.name') },
            ]}
          />
        </div>
      </div>

      {isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : data.members.length === 0 ? (
        <EmptyState icon={Users} title={t('admin.members.emptyTitle')} description={t('admin.members.emptyBody')} />
      ) : (
        <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <Table>
            <Table.Header>
              <Table.Head>{t('admin.members.colMember')}</Table.Head>
              <Table.Head>{t('admin.members.colRole')}</Table.Head>
              <Table.Head>{t('admin.members.colStatus')}</Table.Head>
              <Table.Head align="right">{t('admin.members.colPosts')}</Table.Head>
              <Table.Head align="right">{t('admin.members.colComments')}</Table.Head>
              <Table.Head align="right">{t('admin.members.colJoined')}</Table.Head>
            </Table.Header>
            <Table.Body>
              {data.members.map((member) => (
                <Table.Row key={member.id} onClick={() => openMember(member.id)}>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <img src={avatarFor(member)} alt="" className="w-9 h-9 rounded-full border border-border" />
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-sm font-semibold truncate">
                          {member.name || `@${member.username}`}
                          {member.specialMember && <Star className="w-3.5 h-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label={t('admin.members.special')} />}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{member.username} · {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4"><RoleBadge role={member.role} /></td>
                  <td className="px-8 py-4">
                    {member.joinStatus === 'APPROVED' ? (
                      <StatusBadge status={member.status} />
                    ) : (
                      <span className="inline-flex rounded-full bg-secondary/60 px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground">
                        {member.joinStatus === 'PENDING' ? t('admin.members.notApprovedYet') : t('admin.members.notApproved')}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-end text-sm tabular-nums">{member.postCount}</td>
                  <td className="px-8 py-4 text-end text-sm tabular-nums">{member.commentCount}</td>
                  <td className="px-8 py-4 text-end text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(member.createdAt).toLocaleDateString(activeIntl())}
                  </td>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-3 text-sm">
              <span className="text-muted-foreground">
                {t('admin.members.page', { page: filters.page, total: totalPages })}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page <= 1}
                aria-label={t('admin.members.previousPage')}
                className="p-2 rounded-lg border border-border hover:bg-secondary/50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page >= totalPages}
                aria-label={t('admin.members.nextPage')}
                className="p-2 rounded-lg border border-border hover:bg-secondary/50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      )}

      <MemberPanel memberId={selectedId} onClose={() => openMember(null)} />
    </PageContainer>
  );
};
