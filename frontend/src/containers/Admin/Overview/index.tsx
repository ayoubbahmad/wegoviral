'use client';

import Link from 'next/link';
import { Activity, MessageCircle, MessageSquare, UserPlus, Users } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { avatarFor } from '@/lib/utils';
import { ROLE_LABELS, UserRole } from '@/lib/roles';
import { useAdminOverview } from '../api';
import { RoleBadge, StatusBadge } from '../components/Badges';

const TEAM_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'INSTRUCTOR'];

export const AdminOverviewContainer = () => {
  const { data, isPending, error, refetch } = useAdminOverview();

  return (
    <PageContainer>
      <PageHeader title="Overview" description="How the community is doing this week." />

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
            Try again
          </button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Members" value={data.members.total} icon={Users} />
            <StatCard label="New this week" value={data.members.newThisWeek} icon={UserPlus} />
            <StatCard
              label="Active this week"
              value={data.members.activeThisWeek}
              icon={Activity}
              description="Posted, commented or liked"
            />
            <StatCard label="Posts this week" value={data.content.postsThisWeek} icon={MessageSquare} />
            <StatCard label="Comments this week" value={data.content.commentsThisWeek} icon={MessageCircle} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="space-y-4">
              <h2 className="font-bold">Team</h2>
              <ul className="space-y-2 text-sm">
                {TEAM_ROLES.map((role) => (
                  <li key={role} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{ROLE_LABELS[role]}s</span>
                    <span className="font-semibold tabular-nums">{data.members.byRole[role] ?? 0}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-bold">Restricted members</h2>
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
                <h2 className="font-bold">Newest members</h2>
                <Link href="/admin/members" className="text-xs font-semibold text-muted-foreground hover:text-primary">
                  See all
                </Link>
              </div>
              <ul className="space-y-3">
                {data.recentMembers.map((member) => (
                  <li key={member.id} className="flex items-center gap-3">
                    <img src={avatarFor(member)} alt="" className="w-8 h-8 rounded-full border border-border" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{member.name || `@${member.username}`}</p>
                      <p className="text-xs text-muted-foreground">Joined {new Date(member.createdAt).toLocaleDateString()}</p>
                    </div>
                    <RoleBadge role={member.role} />
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <p className="text-xs text-muted-foreground">
            Pending approvals and open reports will appear here with onboarding (Phase 2) and moderation (Phase 3).
          </p>
        </>
      )}
    </PageContainer>
  );
};
