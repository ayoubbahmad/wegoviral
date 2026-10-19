import type { AccessResult, BadgeChip, CommunityUser } from './communityFeed';

export type ChallengeStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
export type CheckInType = 'DAILY' | 'ONE_TIME';
export type ChallengePhase = 'upcoming' | 'active' | 'ended';
export type ChallengeScope = 'active' | 'upcoming' | 'past';

export interface ChallengeMember extends CommunityUser {
  badges: BadgeChip[];
}

export interface MyChallengeState {
  joinedAt: string;
  checkInCount: number;
  currentStreak: number;
  bestStreak: number;
  completedAt: string | null;
  winnerRank: number | null;
  checkedInToday: boolean;
}

export interface ChallengeSummary {
  id: string;
  title: string;
  description: string;
  prizes: string;
  coverUrl: string | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  checkInType: CheckInType;
  requiredCheckIns: number;
  totalDays: number;
  status: ChallengeStatus;
  phase: ChallengePhase;
  participantCount: number;
  createdBy: CommunityUser;
  completionBadge: BadgeChip | null;
  winnerBadge: BadgeChip | null;
  winnersPickedAt: string | null;
  canManage: boolean;
  access: AccessResult;
  /** null until the member joins */
  me: MyChallengeState | null;
}

export interface ChallengeDetail extends ChallengeSummary {
  rules: string;
  /** YYYY-MM-DD in the challenge's time zone */
  startDay: string;
  today: string;
  myDays: string[];
  winners: { rank: number; member: ChallengeMember; checkInCount: number }[];
}

export interface CheckIn {
  id: string;
  day: string;
  content: string;
  imageUrl: string | null;
  link: string | null;
  createdAt: string;
  author: ChallengeMember;
  canDelete: boolean;
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  member: ChallengeMember;
  checkInCount: number;
  currentStreak: number;
  bestStreak: number;
  completed: boolean;
  winnerRank: number | null;
}

export interface ChallengeLeaderboard {
  entries: ChallengeLeaderboardEntry[];
  me: ChallengeLeaderboardEntry | null;
  required: number;
}

export interface ChallengeInput {
  title?: string;
  description?: string;
  rules?: string;
  prizes?: string;
  coverUrl?: string | null;
  startsAt?: string;
  endsAt?: string;
  timezone?: string;
  checkInType?: CheckInType;
  requiredCheckIns?: number | null;
  status?: ChallengeStatus;
  completionBadgeId?: string | null;
  winnerBadgeId?: string | null;
}
