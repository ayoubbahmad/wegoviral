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
  joinStatus: JoinStatus;
  specialMember: boolean;
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
  targetType: 'member' | 'post' | 'comment' | 'space' | 'settings' | 'guide' | 'invite';
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
