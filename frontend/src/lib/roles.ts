/** Roles, statuses and permissions as defined by the backend (backend/src/lib/permissions.ts). */
export type UserRole = 'MEMBER' | 'INSTRUCTOR' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
export type MemberStatus = 'ACTIVE' | 'MUTED' | 'SUSPENDED' | 'BANNED';

export type Permission =
  | 'community.moderate'
  | 'admin.access'
  | 'stats.view'
  | 'members.view'
  | 'members.restrict'
  | 'members.ban'
  | 'roles.manage'
  | 'roles.manage_admins'
  | 'activity.view'
  | 'members.approve'
  | 'members.exempt'
  | 'invites.manage'
  | 'community.settings';

export const ROLE_LABELS: Record<UserRole, string> = {
  MEMBER: 'Member',
  INSTRUCTOR: 'Instructor',
  MODERATOR: 'Moderator',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
};

/** Short badge shown next to names in the feed; members get none. */
export const ROLE_BADGES: Partial<Record<UserRole, string>> = {
  INSTRUCTOR: 'Instructor',
  MODERATOR: 'Mod',
  ADMIN: 'Team',
  SUPER_ADMIN: 'Team',
};

export const STATUS_LABELS: Record<MemberStatus, string> = {
  ACTIVE: 'Active',
  MUTED: 'Muted',
  SUSPENDED: 'Suspended',
  BANNED: 'Banned',
};
