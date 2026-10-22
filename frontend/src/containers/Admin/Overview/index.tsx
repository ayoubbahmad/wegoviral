'use client';

import Link from 'next/link';
import { Activity, ClipboardCheck, Flag, MessageCircle, MessageSquare, UserCheck, UserPlus, Users } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { avatarFor } from '@/lib/utils';
import type { UserRole } from '@/lib/roles';
import { useAdminOverview } from '../api';
import { RoleBadge, StatusBadge } from '../components/Badges';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

const TEAM_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'INSTRUCTOR'];

export const AdminOverviewContainer = () => {
  const t = useT();
  const { data, isPending, error, refetch } = useAdminOverview();

  return (
    <PageContainer>
      <PageHeader title={t('admin.overview.title')} description={t('admin.overview.description')} />

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <Card className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-primary hover:underline">
            {t('admin.overview.tryAgain')}
          </button>
        </Card>
      ) : (
        <>
          {data.pendingApprovals > 0 && (
            <Link
              href="/admin/approvals"
              className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm font-semibold hover:bg-primary/10"
            >
              <UserCheck className="w-5 h-5 text-primary" />
              {t('admin.overview.pendingApprovals', { count: data.pendingApprovals })}
              <span className="ms-auto text-primary">{t('admin.overview.review')}</span>
            </Link>
          )}

          {data.openReports + data.heldContent > 0 && (
            <Link
              href="/admin/moderation"
              className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-4 text-sm font-semibold hover:bg-red-500/10"
            >
              <Flag className="w-5 h-5 text-red-500" />
              {[
                data.openReports && t('admin.overview.openReports', { count: data.openReports }),
                data.heldContent && t('admin.overview.held', { count: data.heldContent }),
              ]
                .filter(Boolean)
                .join(' · ')}
              <span className="ms-auto text-red-500">{t('admin.overview.moderate')}</span>
            </Link>
          )}

          {data.pendingReviews > 0 && (
            <Link
              href="/community/reviews"
              className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm font-semibold hover:bg-primary/10"
            >
              <ClipboardCheck className="w-5 h-5 text-primary" />
              {t('admin.overview.pendingReviews', { count: data.pendingReviews })}
              <span className="ms-auto text-primary">{t('admin.overview.review')}</span>
            </Link>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label={t('admin.overview.members')} value={data.members.total} icon={Users} />
            <StatCard label={t('admin.overview.newThisWeek')} value={data.members.newThisWeek} icon={UserPlus} />
            <StatCard
              label={t('admin.overview.activeThisWeek')}
              value={data.members.activeThisWeek}
              icon={Activity}
              description={t('admin.overview.activeHint')}
            />
            <StatCard label={t('admin.overview.postsThisWeek')} value={data.content.postsThisWeek} icon={MessageSquare} />
            <StatCard label={t('admin.overview.commentsThisWeek')} value={data.content.commentsThisWeek} icon={MessageCircle} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="space-y-4">
              <h2 className="font-bold">{t('admin.overview.team')}</h2>
              <ul className="space-y-2 text-sm">
                {TEAM_ROLES.map((role) => (
                  <li key={role} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t(`admin.overview.teamRoles.${role as 'ADMIN'}`)}</span>
                    <span className="font-semibold tabular-nums">{data.members.byRole[role] ?? 0}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold">{t('admin.overview.restricted')}</h2>
              <ul className="space-y-2 text-sm">
                {(['MUTED', 'SUSPENDED', 'BANNED'] as const).map((status) => (
                  <li key={status} className="flex items-center justify-between">
                    <StatusBadge status={status} />
                    <Link
                      href={`/admin/members?status=${status}`}
                      className="font-semibold tabular-nums hover:text-primary"
                    >
                      {data.members.restricted[status]}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">{t('admin.overview.newest')}</h2>
                <Link href="/admin/members" className="text-xs font-semibold text-muted-foreground hover:text-primary">
                  {t('admin.overview.seeAll')}
                </Link>
              </div>
              <ul className="space-y-3">
                {data.recentMembers.map((member) => (
                  <li key={member.id} className="flex items-center gap-3">
                    <img src={avatarFor(member)} alt="" className="w-8 h-8 rounded-full border border-border" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{member.name || `@${member.username}`}</p>
                      <p className="text-xs text-muted-foreground">{t('admin.overview.joined', { date: new Date(member.createdAt).toLocaleDateString(activeIntl()) })}</p>
                    </div>
                    <RoleBadge role={member.role} />
                  </li>
                ))}
              </ul>
            </Card>
          </div>

        </>
      )}
    </PageContainer>
  );
};
