import type { MemberStatus, UserRole } from '@/lib/roles';
import type { BadgeChip, MemberLevel } from '@/types/communityFeed';

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
  joinStatus: JoinStatus;
  specialMember: boolean;
  tierId: string | null;
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
  targetType: 'member' | 'post' | 'comment' | 'space' | 'settings' | 'guide' | 'invite' | 'tier';
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
  joining: MemberJoining;
  points: number;
  level: MemberLevel;
  badges: MemberBadgeRow[];
  allowedActions: {
    changeRole: boolean;
    assignableRoles: UserRole[];
    restrict: boolean;
    ban: boolean;
    indefinite: boolean;
    /** null = no limit */
    maxRestrictionDays: number | null;
    setSpecial: boolean;
    reviewApplication: boolean;
    setTier: boolean;
    manageGamification: boolean;
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
  pendingApprovals: number;
  pendingReviews: number;
  openReports: number;
  heldContent: number;
  recentMembers: AdminMember[];
}

export interface RestrictionInput {
  status: 'MUTED' | 'SUSPENDED' | 'BANNED';
  reason: string;
  durationDays: number | null;
}

// ─── Joining (Phase 2a) ──────────────────────────────────────────────────────

export type JoinStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApplicationPlatform {
  platform: string;
  handle: string;
}

export interface Application {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  niche: string;
  platforms: ApplicationPlatform[];
  followerRange: string | null;
  about: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
  invite: { id?: string; label: string } | null;
  reviewedBy: { id?: string; username: string } | null;
}

export interface ApplicationWithUser extends Application {
  user: {
    id: string;
    username: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
    joinStatus: JoinStatus;
    referredBy: { id: string; username: string; name: string | null } | null;
  };
}

export interface MemberJoining {
  phone: string | null;
  application: Application | null;
  referredBy: { id: string; username: string; name: string | null } | null;
  referralCount: number;
  rulesAcceptedVersion: number | null;
  rulesAcceptedAt: string | null;
  quizPassedVersion: number | null;
  rulesAcceptances: { version: number; acceptedAt: string }[];
  probation: { onProbation: false } | { onProbation: true; approvedPosts: number; pendingPosts: number; required: number };
}

export interface CommunitySettings {
  requireApproval: boolean;
  requireRules: boolean;
  requireQuiz: boolean;
  quizPassPercent: number;
  probationPostCount: number;
  guideVersion: number;
  flaggedWords: string[];
}

export interface GuideSectionDraft {
  id?: string;
  title: string;
  body: string;
  mediaUrl?: string | null;
}

export interface QuizQuestionDraft {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface AdminGuide {
  version: number;
  sections: GuideSectionDraft[];
  questions: QuizQuestionDraft[];
  stats: { approvedMembers: number; acceptedAnyVersion: number; acceptedLatest: number };
}

export interface InviteLink {
  id: string;
  code: string;
  label: string;
  autoApprove: boolean;
  specialMember: boolean;
  expiresAt: string | null;
  maxUses: number | null;
  useCount: number;
  revokedAt: string | null;
  createdAt: string;
  createdBy: { id: string; username: string } | null;
}

export interface CreateInviteInput {
  label: string;
  autoApprove: boolean;
  specialMember: boolean;
  expiresInDays: number | null;
  maxUses: number | null;
}

// ─── Moderation & spaces (Phase 3) ───────────────────────────────────────────

export interface ModAuthor {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
}

export interface ReportGroup {
  targetType: 'post' | 'comment';
  targetId: string;
  post: { id: string; title: string | null; content: string; coverUrl: string | null; images: string[]; spaceId: string; createdAt: string; deletedAt: string | null; author: ModAuthor } | null;
  comment: { id: string; content: string; postId: string; createdAt: string; deletedAt: string | null; author: ModAuthor } | null;
  reports: { id: string; reason: string; note: string | null; createdAt: string; reporter: { id: string; username: string } }[];
  resolution: string | null;
  resolvedBy: { id: string; username: string } | null;
  resolvedAt: string | null;
}

export type ReportStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED';

export interface ResolveReportsInput {
  targetType: 'post' | 'comment';
  targetId: string;
  action: 'dismiss' | 'remove';
  authorAction?: { type: 'warn' | 'mute' | 'suspend'; reason: string; durationDays?: number | null };
  note?: string;
}

export interface HeldContent {
  posts: { id: string; title: string | null; content: string; heldReason: string; createdAt: string; spaceId: string; author: ModAuthor }[];
  comments: { id: string; content: string; heldReason: string; createdAt: string; postId: string; author: ModAuthor }[];
}

export interface DeletedContent {
  windowDays: number;
  posts: { id: string; title: string | null; content: string; deletedAt: string; spaceId: string; author: ModAuthor; deletedBy: { id: string; username: string } | null }[];
  comments: { id: string; content: string; deletedAt: string; postId: string; author: ModAuthor; deletedBy: { id: string; username: string } | null }[];
}

export interface AdminSpace {
  id: string;
  name: string;
  emoji: string;
  description: string;
  coverUrl: string | null;
  adminOnly: boolean;
  position: number;
  archivedAt: string | null;
  postCount: number;
  access: AccessRule | null;
}

export interface SpaceInput {
  name: string;
  emoji: string;
  description: string;
  coverUrl?: string;
  adminOnly: boolean;
}

// ─── Access rules & tiers (Phase 4) ──────────────────────────────────────────

export interface AccessRule {
  minRole: UserRole | null;
  tierIds: string[];
  minDays: number | null;
  minLevel: number | null;
}

export interface Tier {
  id: string;
  name: string;
  description: string | null;
  position: number;
  isDefault: boolean;
  memberCount: number;
}

// ─── Points, levels & badges (Phase 6) ───────────────────────────────────────

export interface MemberBadgeRow {
  awardedAt: string;
  note: string | null;
  badge: BadgeChip & { archivedAt: string | null };
  /** null = earned automatically */
  awardedBy: { username: string } | null;
}

export type AutoBadgeType = 'POSTS' | 'COMMENTS' | 'LIKES_RECEIVED' | 'EVENTS_JOINED' | 'COURSES_COMPLETED' | 'CHALLENGES_COMPLETED' | 'CHALLENGES_WON' | 'POINTS';

export interface AdminBadge extends BadgeChip {
  description: string;
  autoRule: { type: AutoBadgeType; threshold: number } | null;
  archivedAt: string | null;
  holderCount: number;
}

export interface PointRuleRow {
  action: string;
  label: string;
  points: number;
  dailyCap: number | null;
  enabled: boolean;
}

export interface GamificationConfig {
  rules: PointRuleRow[];
  levels: { level: number; name: string; minPoints: number }[];
  badges: AdminBadge[];
  autoBadgeTypes: { type: AutoBadgeType; label: string }[];
}

export interface BadgeInput {
  name: string;
  emoji: string;
  color: string;
  description: string;
  autoRule: { type: AutoBadgeType; threshold: number } | null;
}
