import type { MemberStatus, UserRole } from '@/lib/roles';

export interface AdminMember {
  id: string;
  username: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  status: MemberStatus;
  statusReason: string | null;
  statusUntil: string | null;
  createdAt: string;
  postCount: number;
  commentCount: number;
}

export interface ActivityActor {
  id: string;
  username: string;
  name?: string | null;
  avatarUrl: string | null;
}

export interface ActivityEntry {
  id: string;
  action: string;
  targetType: 'member' | 'post' | 'comment' | 'space';
  targetId: string | null;
  targetLabel: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  actor: ActivityActor | null;
}

export interface MemberDetail extends AdminMember {
  likesGiven: number;
  likesReceived: number;
  history: ActivityEntry[];
  allowedActions: {
    changeRole: boolean;
    assignableRoles: UserRole[];
    restrict: boolean;
    ban: boolean;
    indefinite: boolean;
    /** null = no limit */
    maxRestrictionDays: number | null;
  };
}

export interface MembersPage {
  members: AdminMember[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MembersFilters {
  search?: string;
  role?: UserRole;
  status?: MemberStatus;
  sort: 'newest' | 'oldest' | 'name';
  page: number;
}

export interface AdminOverview {
  members: {
    total: number;
    newThisWeek: number;
    activeThisWeek: number;
    byRole: Partial<Record<UserRole, number>>;
    restricted: Record<'MUTED' | 'SUSPENDED' | 'BANNED', number>;
  };
  content: { postsThisWeek: number; commentsThisWeek: number };
  recentMembers: AdminMember[];
}

export interface RestrictionInput {
  status: 'MUTED' | 'SUSPENDED' | 'BANNED';
  reason: string;
  durationDays: number | null;
}
