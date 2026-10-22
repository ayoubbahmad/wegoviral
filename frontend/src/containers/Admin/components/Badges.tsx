import { cn } from '@/lib/utils';
import { MemberStatus, UserRole } from '@/lib/roles';
import { T } from '@/i18n/T';

const ROLE_STYLES: Record<UserRole, string> = {
  MEMBER: 'bg-secondary/60 text-muted-foreground',
  INSTRUCTOR: 'bg-sky-500/10 text-sky-500',
  MODERATOR: 'bg-violet-500/10 text-violet-500',
  ADMIN: 'bg-primary/10 text-primary',
  SUPER_ADMIN: 'bg-primary text-primary-foreground',
};

const STATUS_STYLES: Record<MemberStatus, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-500',
  MUTED: 'bg-amber-500/10 text-amber-500',
  SUSPENDED: 'bg-orange-500/10 text-orange-500',
  BANNED: 'bg-red-500/10 text-red-500',
};

const pill = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap';

export const RoleBadge = ({ role }: { role: UserRole }) => (
  <span className={cn(pill, ROLE_STYLES[role])}><T k={`common.roles.${role}`} /></span>
);

export const StatusBadge = ({ status }: { status: MemberStatus }) => (
  <span className={cn(pill, STATUS_STYLES[status])}><T k={`common.statuses.${status}`} /></span>
);
