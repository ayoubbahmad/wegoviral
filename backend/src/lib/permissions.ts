/**
 * Single source of truth for who can do what. The frontend receives the
 * current user's permission list from /auth/me instead of re-implementing it.
 * See docs/ADMIN_ROADMAP.md → "Roles & permissions".
 */
import { MemberStatus, UserRole } from '@prisma/client';

/** Higher rank = more power. Used for "can only act on people below you". */
export const ROLE_RANK: Record<UserRole, number> = {
  MEMBER: 0,
  INSTRUCTOR: 1,
  MODERATOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

const atLeast = (role: UserRole) =>
  (Object.keys(ROLE_RANK) as UserRole[]).filter((r) => ROLE_RANK[r] >= ROLE_RANK[role]);

export const PERMISSIONS = {
  /** Moderate the feed: post in team-only spaces, pin, delete any post/comment */
  'community.moderate': atLeast('MODERATOR'),
  /** Open the Admin space */
  'admin.access': atLeast('MODERATOR'),
  'stats.view': atLeast('MODERATOR'),
  'members.view': atLeast('MODERATOR'),
  /** Mute or suspend (moderators: temporary only, see MODERATOR_MAX_RESTRICTION_DAYS) */
  'members.restrict': atLeast('MODERATOR'),
  /** Ban, and restrictions without an end date */
  'members.ban': atLeast('ADMIN'),
  /** Set roles up to Moderator / Instructor */
  'roles.manage': atLeast('ADMIN'),
  /** Appoint Admins and Super Admins */
  'roles.manage_admins': atLeast('SUPER_ADMIN'),
  'activity.view': atLeast('MODERATOR'),
  /** Approve or reject applications */
  'members.approve': atLeast('MODERATOR'),
  /** Mark special members (skip approval, guide and probation) */
  'members.exempt': atLeast('MODERATOR'),
  /** Create and revoke staff invite links */
  'invites.manage': atLeast('ADMIN'),
  /** Joining rules, community guide and quiz, flagged words */
  'community.settings': atLeast('ADMIN'),
  /** Create, edit, reorder and archive spaces */
  'spaces.manage': atLeast('ADMIN'),
} satisfies Record<string, UserRole[]>;

export type Permission = keyof typeof PERMISSIONS;

export const MODERATOR_MAX_RESTRICTION_DAYS = 7;

export function can(role: UserRole, permission: Permission) {
  return (PERMISSIONS[permission] as UserRole[]).includes(role);
}

export function permissionsFor(role: UserRole): Permission[] {
  return (Object.keys(PERMISSIONS) as Permission[]).filter((permission) => can(role, permission));
}

/** Roles an actor may assign. Nobody assigns roles at or above their own, except Super Admins. */
export function assignableRoles(actorRole: UserRole): UserRole[] {
  if (can(actorRole, 'roles.manage_admins')) return Object.keys(ROLE_RANK) as UserRole[];
  if (can(actorRole, 'roles.manage')) return ['MEMBER', 'INSTRUCTOR', 'MODERATOR'];
  return [];
}

/** Staff can only manage members ranked below them (Super Admins can manage everyone but themselves). */
export function canManageMember(actorRole: UserRole, targetRole: UserRole) {
  if (actorRole === 'SUPER_ADMIN') return true;
  return ROLE_RANK[actorRole] > ROLE_RANK[targetRole];
}

/** A restriction whose end date has passed no longer applies. */
export function effectiveStatus(status: MemberStatus, until: Date | null): MemberStatus {
  if (status !== 'ACTIVE' && until && until.getTime() <= Date.now()) return 'ACTIVE';
  return status;
}
