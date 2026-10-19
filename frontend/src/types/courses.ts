import type { AccessResult, BadgeChip, CommunityUser } from './communityFeed';

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type LessonType = 'VIDEO' | 'TEXT';

export interface CourseProgress {
  startedAt: string;
  lastActivityAt: string;
  lastLessonId: string | null;
  completedAt: string | null;
  completedLessons: number;
}

export interface CourseSummary {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  status: CourseStatus;
  owner: CommunityUser;
  completionBadge: BadgeChip | null;
  moduleCount: number;
  lessonCount: number;
  totalMinutes: number;
  enrolledCount: number;
  canManage: boolean;
  isOwner: boolean;
  access: AccessResult;
  /** null until the member opens a lesson */
  progress: CourseProgress | null;
  updatedAt: string;
}

export interface OutlineLesson {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes: number | null;
  attachmentCount: number;
  completed: boolean;
}

export interface OutlineModule {
  id: string;
  title: string;
  dripDays: number | null;
  locked: boolean;
  /** When a dripped module opens (null: open, or opens once the member starts) */
  unlocksAt: string | null;
  lessons: OutlineLesson[];
}

export interface CourseDetail extends CourseSummary {
  modules: OutlineModule[];
}

export interface LessonAttachmentView {
  id: string;
  name: string;
  url: string | null;
  size: number | null;
  isFile: boolean;
}

export interface LessonView {
  id: string;
  title: string;
  type: LessonType;
  videoUrl: string | null;
  content: string;
  durationMinutes: number | null;
  module: { id: string; title: string };
  attachments: LessonAttachmentView[];
  completed: boolean;
  previous: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
  canComplete: boolean;
}

// ─── Builder ─────────────────────────────────────────────────────────────────

export interface AttachmentInput {
  name: string;
  url?: string | null;
  storagePath?: string | null;
  size?: number | null;
}

export interface EditableAttachment extends LessonAttachmentView {
  storagePath: string | null;
}

export interface EditableLesson {
  id: string;
  moduleId: string;
  title: string;
  type: LessonType;
  videoUrl: string | null;
  content: string;
  durationMinutes: number | null;
  attachments: EditableAttachment[];
}

export interface EditableModule {
  id: string;
  title: string;
  dripDays: number | null;
  lessons: EditableLesson[];
}

export interface EditableCourse {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  status: CourseStatus;
  ownerId: string;
  owner: CommunityUser;
  completionBadgeId: string | null;
  canChangeOwner: boolean;
  modules: EditableModule[];
}

export interface CourseInput {
  title?: string;
  description?: string;
  coverUrl?: string | null;
  status?: CourseStatus;
  completionBadgeId?: string | null;
  ownerId?: string;
}

export interface LessonInput {
  title?: string;
  type?: LessonType;
  videoUrl?: string | null;
  content?: string;
  durationMinutes?: number | null;
  attachments?: AttachmentInput[];
}

export interface CourseStats {
  enrolled: number;
  completed: number;
  completionRate: number;
  activeThisWeek: number;
  lessons: { id: string; title: string; moduleTitle: string; completedCount: number }[];
  members: (CommunityUser & {
    email?: string;
    startedAt: string;
    lastActivityAt: string;
    completedAt: string | null;
    completedLessons: number;
  })[];
}
