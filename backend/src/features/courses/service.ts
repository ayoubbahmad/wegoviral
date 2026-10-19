/**
 * Courses (docs/ADMIN_ROADMAP.md, Phase 7): course → modules → lessons.
 * Instructors manage their own courses, admins every course. Access rules
 * (Phase 4) lock a whole course; modules can open some days after a member
 * starts (drip).
 */
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { logActivity } from '../../lib/activity';
import { can } from '../../lib/permissions';
import { AccessResult, AccessViewer, accessByResource, describeLock, getRule } from '../../lib/access';
import { awardPoints, revokePoints } from '../../lib/gamification';
import { COURSE_FILES_BUCKET, supabaseAdmin } from '../../lib/supabase-admin';
import {
  CourseError,
  CreateCourseInput,
  CreateLessonInput,
  CreateModuleInput,
  OutlineInput,
  UpdateCourseInput,
  UpdateLessonInput,
  UpdateModuleInput,
} from './model';

const DAY_MS = 24 * 60 * 60 * 1000;
const OPEN: AccessResult = { locked: false, reasons: [] };
const SIGNED_URL_SECONDS = 60 * 60;

const personSelect = { id: true, username: true, name: true, avatarUrl: true, role: true } satisfies Prisma.UserProfileSelect;

const courseInclude = {
  owner: { select: personSelect },
  completionBadge: { select: { id: true, name: true, emoji: true, color: true } },
  modules: {
    orderBy: { position: 'asc' },
    include: {
      lessons: {
        orderBy: { position: 'asc' },
        select: { id: true, title: true, type: true, durationMinutes: true, _count: { select: { attachments: true } } },
      },
    },
  },
  _count: { select: { enrollments: true } },
} satisfies Prisma.CourseInclude;

type CourseRow = Prisma.CourseGetPayload<{ include: typeof courseInclude }>;
type Enrollment = Prisma.CourseEnrollmentGetPayload<object>;

/** Admins manage every course; instructors (and admins) the ones they own. */
const canManage = (viewer: AccessViewer, course: { ownerId: string }) =>
  can(viewer.role, 'courses.manage') || (course.ownerId === viewer.id && can(viewer.role, 'courses.create'));

/** Drafts: owner and admins. Archived: also members who already started. */
const visibilityFilter = (viewer: AccessViewer): Prisma.CourseWhereInput =>
  can(viewer.role, 'courses.manage')
    ? { deletedAt: null }
    : {
        deletedAt: null,
        OR: [
          { status: 'PUBLISHED' },
          { ownerId: viewer.id },
          { status: 'ARCHIVED', enrollments: { some: { userId: viewer.id } } },
        ],
      };

const lessonsOf = (course: CourseRow) => course.modules.flatMap((module) => module.lessons);

/** When a dripped module opens for this member (null: open now, or "once you start"). */
function moduleLock(module: { dripDays: number | null }, enrollment: Enrollment | null | undefined, manage: boolean) {
  if (!module.dripDays || manage) return { locked: false, unlocksAt: null as string | null };
  if (!enrollment) return { locked: true, unlocksAt: null };
  const unlocksAt = new Date(enrollment.startedAt.getTime() + module.dripDays * DAY_MS);
  return { locked: unlocksAt.getTime() > Date.now(), unlocksAt: unlocksAt.toISOString() };
}

function progressOf(course: CourseRow, enrollment: Enrollment | null | undefined, completed: Set<string>) {
  if (!enrollment) return null;
  const lessonIds = lessonsOf(course).map((lesson) => lesson.id);
  return {
    startedAt: enrollment.startedAt,
    lastActivityAt: enrollment.lastActivityAt,
    lastLessonId: enrollment.lastLessonId,
    completedAt: enrollment.completedAt,
    completedLessons: lessonIds.filter((id) => completed.has(id)).length,
  };
}

function toCourseSummary(course: CourseRow, viewer: AccessViewer, access: AccessResult, enrollment: Enrollment | null | undefined, completed: Set<string>) {
  const lessons = lessonsOf(course);
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    coverUrl: course.coverUrl,
    status: course.status,
    owner: course.owner,
    completionBadge: course.completionBadge,
    moduleCount: course.modules.length,
    lessonCount: lessons.length,
    totalMinutes: lessons.reduce((sum, lesson) => sum + (lesson.durationMinutes ?? 0), 0),
    enrolledCount: course._count.enrollments,
    canManage: canManage(viewer, course),
    isOwner: course.ownerId === viewer.id,
    access,
    progress: progressOf(course, enrollment, completed),
    updatedAt: course.updatedAt,
  };
}

async function viewerState(viewer: AccessViewer, courseIds: string[]) {
  const [access, enrollments, progress] = await Promise.all([
    accessByResource('course', viewer),
    prisma.courseEnrollment.findMany({ where: { userId: viewer.id, courseId: { in: courseIds } } }),
    prisma.lessonProgress.findMany({ where: { userId: viewer.id, courseId: { in: courseIds } }, select: { lessonId: true } }),
  ]);
  return {
    access,
    enrollments: new Map(enrollments.map((enrollment) => [enrollment.courseId, enrollment])),
    completed: new Set(progress.map((row) => row.lessonId)),
  };
}

/** The access result, with managers always let in. */
const accessFor = (state: Awaited<ReturnType<typeof viewerState>>, viewer: AccessViewer, course: CourseRow) =>
  canManage(viewer, course) ? OPEN : state.access.get(course.id) ?? OPEN;

export async function listCourses(viewer: AccessViewer) {
  const courses = await prisma.course.findMany({
    where: visibilityFilter(viewer),
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: courseInclude,
  });
  const state = await viewerState(viewer, courses.map((course) => course.id));
  return courses.map((course) =>
    toCourseSummary(course, viewer, accessFor(state, viewer, course), state.enrollments.get(course.id), state.completed),
  );
}

async function getVisibleCourse(viewer: AccessViewer, id: string) {
  const course = await prisma.course.findFirst({ where: { id, ...visibilityFilter(viewer) }, include: courseInclude });
  if (!course) throw new CourseError(404, 'Course not found');
  return course;
}

/** Course page: details and outline. Locked courses still show the outline, never lesson content. */
export async function getCourse(viewer: AccessViewer, id: string) {
  const course = await getVisibleCourse(viewer, id);
  const state = await viewerState(viewer, [id]);
  const enrollment = state.enrollments.get(id);
  const manage = canManage(viewer, course);
  const access = accessFor(state, viewer, course);
  return {
    ...toCourseSummary(course, viewer, access, enrollment, state.completed),
    modules: course.modules.map((module) => {
      const lock = moduleLock(module, enrollment, manage);
      return {
        id: module.id,
        title: module.title,
        dripDays: module.dripDays,
        locked: access.locked || lock.locked,
        unlocksAt: lock.unlocksAt,
        lessons: module.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
          durationMinutes: lesson.durationMinutes,
          attachmentCount: lesson._count.attachments,
          completed: state.completed.has(lesson.id),
        })),
      };
    }),
  };
}

/** Loads a lesson the viewer may open, or explains why not. */
async function openLesson(viewer: AccessViewer, courseId: string, lessonId: string) {
  const course = await getVisibleCourse(viewer, courseId);
  const manage = canManage(viewer, course);
  const module = course.modules.find((m) => m.lessons.some((lesson) => lesson.id === lessonId));
  if (!module) throw new CourseError(404, 'Lesson not found');
  if (!manage) {
    if (course.status === 'DRAFT') throw new CourseError(404, 'Course not found');
    const access = (await accessByResource('course', viewer)).get(courseId);
    if (access?.locked) throw new CourseError(403, describeLock(access));
  }
  const enrollment = await prisma.courseEnrollment.findUnique({ where: { courseId_userId: { courseId, userId: viewer.id } } });
  // Starting the course is what starts the drip clock, so the first open module counts as "started"
  const lock = moduleLock(module, enrollment, manage);
  if (lock.locked) {
    throw new CourseError(403, lock.unlocksAt ? `This module opens on ${new Date(lock.unlocksAt).toLocaleDateString('en-GB')}` : `This module opens ${module.dripDays} days after you start the course`);
  }
  return { course, module, manage, enrollment };
}

/** Members are enrolled the first time they open a lesson; managers previewing aren't counted. */
async function touchEnrollment(viewer: AccessViewer, courseId: string, lessonId: string) {
  return prisma.courseEnrollment.upsert({
    where: { courseId_userId: { courseId, userId: viewer.id } },
    create: { courseId, userId: viewer.id, lastLessonId: lessonId },
    update: { lastLessonId: lessonId, lastActivityAt: new Date() },
  });
}

async function signedAttachments(attachments: { id: string; name: string; url: string | null; storagePath: string | null; size: number | null }[]) {
  return Promise.all(
    attachments.map(async (attachment) => {
      if (!attachment.storagePath) return { id: attachment.id, name: attachment.name, url: attachment.url, size: attachment.size, isFile: false };
      const { data } = await supabaseAdmin.storage
        .from(COURSE_FILES_BUCKET)
        .createSignedUrl(attachment.storagePath, SIGNED_URL_SECONDS, { download: attachment.name });
      return { id: attachment.id, name: attachment.name, url: data?.signedUrl ?? null, size: attachment.size, isFile: true };
    }),
  );
}

export async function getLesson(viewer: AccessViewer, courseId: string, lessonId: string) {
  const { course, module, manage, enrollment } = await openLesson(viewer, courseId, lessonId);
  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: lessonId },
    include: { attachments: { orderBy: { position: 'asc' } } },
  });
  if (!manage) await touchEnrollment(viewer, courseId, lessonId);
  const ordered = course.modules.flatMap((m) => m.lessons.map((l) => ({ id: l.id, title: l.title, moduleId: m.id })));
  const index = ordered.findIndex((l) => l.id === lessonId);
  const completed = await prisma.lessonProgress.findUnique({ where: { lessonId_userId: { lessonId, userId: viewer.id } } });
  return {
    id: lesson.id,
    title: lesson.title,
    type: lesson.type,
    videoUrl: lesson.videoUrl,
    content: lesson.content,
    durationMinutes: lesson.durationMinutes,
    module: { id: module.id, title: module.title },
    attachments: await signedAttachments(lesson.attachments),
    completed: Boolean(completed),
    previous: ordered[index - 1] ?? null,
    next: ordered[index + 1] ?? null,
    // Owners preview their own course; they don't take it
    canComplete: course.ownerId !== viewer.id,
    startedAt: enrollment?.startedAt ?? null,
  };
}

/** Marks a lesson done; finishing the last one completes the course (points and badge once). */
export async function setLessonCompleted(viewer: AccessViewer, courseId: string, lessonId: string, completed: boolean) {
  const { course } = await openLesson(viewer, courseId, lessonId);
  if (course.ownerId === viewer.id) throw new CourseError(400, "You can't take your own course");
  if (!completed) {
    await prisma.lessonProgress.deleteMany({ where: { lessonId, userId: viewer.id } });
    await revokePoints({ userId: viewer.id, action: 'LESSON_COMPLETED', sourceId: lessonId });
    return { completed: false, courseCompleted: false };
  }
  const enrollment = await touchEnrollment(viewer, courseId, lessonId);
  await prisma.lessonProgress.createMany({ data: [{ lessonId, userId: viewer.id, courseId }], skipDuplicates: true });
  await awardPoints({ userId: viewer.id, action: 'LESSON_COMPLETED', sourceType: 'lesson', sourceId: lessonId });

  const lessonIds = lessonsOf(course).map((lesson) => lesson.id);
  const done = await prisma.lessonProgress.count({ where: { userId: viewer.id, lessonId: { in: lessonIds } } });
  const finishedNow = done === lessonIds.length && !enrollment.completedAt;
  if (finishedNow) {
    await prisma.courseEnrollment.update({ where: { courseId_userId: { courseId, userId: viewer.id } }, data: { completedAt: new Date() } });
    await awardPoints({ userId: viewer.id, action: 'COURSE_COMPLETED', sourceType: 'course', sourceId: courseId });
    if (course.completionBadgeId) {
      const badge = await prisma.badge.findFirst({ where: { id: course.completionBadgeId, archivedAt: null } });
      if (badge) {
        await prisma.memberBadge.createMany({ data: [{ badgeId: badge.id, userId: viewer.id, note: `Finished ${course.title}` }], skipDuplicates: true });
      }
    }
  }
  return { completed: true, courseCompleted: finishedNow };
}

// ─── Building courses ────────────────────────────────────────────────────────

async function getManagedCourse(viewer: AccessViewer, id: string) {
  const course = await getVisibleCourse(viewer, id);
  if (!canManage(viewer, course)) throw new CourseError(403, 'Only the instructor and admins can edit this course');
  return course;
}

/** Everything the builder needs, including lesson content and attachments. */
export async function getCourseForEditing(viewer: AccessViewer, id: string) {
  await getManagedCourse(viewer, id);
  const course = await prisma.course.findUniqueOrThrow({
    where: { id },
    include: {
      owner: { select: personSelect },
      modules: {
        orderBy: { position: 'asc' },
        include: { lessons: { orderBy: { position: 'asc' }, include: { attachments: { orderBy: { position: 'asc' } } } } },
      },
    },
  });
  return {
    ...course,
    canChangeOwner: can(viewer.role, 'courses.manage'),
    modules: await Promise.all(
      course.modules.map(async (module) => ({
        ...module,
        lessons: await Promise.all(
          module.lessons.map(async (lesson) => ({
            ...lesson,
            attachments: (await signedAttachments(lesson.attachments)).map((signed, index) => ({
              ...signed,
              storagePath: lesson.attachments[index].storagePath,
            })),
          })),
        ),
      })),
    ),
  };
}

export async function createCourse(viewer: AccessViewer, input: CreateCourseInput) {
  if (!can(viewer.role, 'courses.create')) throw new CourseError(403, "You can't create courses");
  await assertBadge(input.completionBadgeId);
  const course = await prisma.course.create({ data: { ...input, ownerId: viewer.id } });
  await logActivity({ actorId: viewer.id, action: 'course.created', targetType: 'course', targetId: course.id, targetLabel: course.title });
  return getCourse(viewer, course.id);
}

async function assertBadge(badgeId: string | null | undefined) {
  if (badgeId && !(await prisma.badge.findFirst({ where: { id: badgeId, archivedAt: null } }))) {
    throw new CourseError(400, 'Unknown badge');
  }
}

export async function updateCourse(viewer: AccessViewer, id: string, input: UpdateCourseInput) {
  const course = await getManagedCourse(viewer, id);
  await assertBadge(input.completionBadgeId);
  if (input.ownerId && input.ownerId !== course.ownerId) {
    if (!can(viewer.role, 'courses.manage')) throw new CourseError(403, 'Only admins can hand a course to someone else');
    const owner = await prisma.userProfile.findUnique({ where: { id: input.ownerId }, select: { role: true } });
    if (!owner || !can(owner.role, 'courses.create')) throw new CourseError(400, 'Courses can only belong to instructors and admins');
  }
  if (input.status === 'PUBLISHED' && course.status !== 'PUBLISHED' && lessonsOf(course).length === 0) {
    throw new CourseError(400, 'Add at least one lesson before publishing');
  }
  await prisma.course.update({ where: { id }, data: input });
  const action =
    input.status && input.status !== course.status
      ? ({ PUBLISHED: 'course.published', ARCHIVED: 'course.archived', DRAFT: 'course.unpublished' } as const)[input.status]
      : 'course.updated';
  await logActivity({
    actorId: viewer.id,
    action,
    targetType: 'course',
    targetId: id,
    targetLabel: input.title ?? course.title,
    details: { changed: Object.keys(input), ownerId: course.ownerId },
  });
  return getCourse(viewer, id);
}

export async function deleteCourse(viewer: AccessViewer, id: string) {
  const course = await getManagedCourse(viewer, id);
  await prisma.course.update({ where: { id }, data: { deletedAt: new Date() } });
  await logActivity({ actorId: viewer.id, action: 'course.deleted', targetType: 'course', targetId: id, targetLabel: course.title });
}

async function managedModule(viewer: AccessViewer, moduleId: string) {
  const module = await prisma.courseModule.findUnique({ where: { id: moduleId }, select: { id: true, courseId: true } });
  if (!module) throw new CourseError(404, 'Module not found');
  await getManagedCourse(viewer, module.courseId);
  return module;
}

async function managedLesson(viewer: AccessViewer, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { select: { courseId: true } }, attachments: true },
  });
  if (!lesson) throw new CourseError(404, 'Lesson not found');
  await getManagedCourse(viewer, lesson.module.courseId);
  return lesson;
}

export async function createModule(viewer: AccessViewer, courseId: string, input: CreateModuleInput) {
  await getManagedCourse(viewer, courseId);
  const last = await prisma.courseModule.aggregate({ where: { courseId }, _max: { position: true } });
  return prisma.courseModule.create({ data: { courseId, title: input.title, dripDays: input.dripDays ?? null, position: (last._max.position ?? -1) + 1 } });
}

export async function updateModule(viewer: AccessViewer, moduleId: string, input: UpdateModuleInput) {
  await managedModule(viewer, moduleId);
  return prisma.courseModule.update({ where: { id: moduleId }, data: input });
}

export async function deleteModule(viewer: AccessViewer, moduleId: string) {
  await managedModule(viewer, moduleId);
  const files = await prisma.lessonAttachment.findMany({ where: { lesson: { moduleId }, storagePath: { not: null } }, select: { storagePath: true } });
  await prisma.courseModule.delete({ where: { id: moduleId } });
  await removeFiles(files.map((file) => file.storagePath as string));
}

/** Attachments must be links, or files uploaded for this course. */
function attachmentRows(courseId: string, attachments: NonNullable<UpdateLessonInput['attachments']>) {
  return attachments.map((attachment, position) => {
    if (attachment.storagePath && !attachment.storagePath.startsWith(`courses/${courseId}/`)) {
      throw new CourseError(400, 'That file belongs to another course');
    }
    return { name: attachment.name, url: attachment.url ?? null, storagePath: attachment.storagePath ?? null, size: attachment.size ?? null, position };
  });
}

async function removeFiles(paths: string[]) {
  if (!paths.length) return;
  const { error } = await supabaseAdmin.storage.from(COURSE_FILES_BUCKET).remove(paths);
  if (error) console.error('Failed to remove course files', error);
}

export async function createLesson(viewer: AccessViewer, moduleId: string, input: CreateLessonInput) {
  const module = await managedModule(viewer, moduleId);
  const last = await prisma.lesson.aggregate({ where: { moduleId }, _max: { position: true } });
  const { attachments = [], ...fields } = input;
  const lesson = await prisma.lesson.create({
    data: {
      ...fields,
      moduleId,
      position: (last._max.position ?? -1) + 1,
      attachments: { create: attachmentRows(module.courseId, attachments) },
    },
  });
  await prisma.course.update({ where: { id: module.courseId }, data: { updatedAt: new Date() } });
  return lesson;
}

export async function updateLesson(viewer: AccessViewer, lessonId: string, input: UpdateLessonInput) {
  const lesson = await managedLesson(viewer, lessonId);
  const { attachments, ...fields } = input;
  await prisma.$transaction([
    prisma.lesson.update({ where: { id: lessonId }, data: fields }),
    ...(attachments
      ? [
          prisma.lessonAttachment.deleteMany({ where: { lessonId } }),
          prisma.lessonAttachment.createMany({ data: attachmentRows(lesson.module.courseId, attachments).map((row) => ({ ...row, lessonId })) }),
        ]
      : []),
  ]);
  if (attachments) {
    const kept = new Set(attachments.map((attachment) => attachment.storagePath).filter(Boolean));
    await removeFiles(lesson.attachments.map((a) => a.storagePath).filter((path): path is string => Boolean(path) && !kept.has(path)));
  }
  return prisma.lesson.findUniqueOrThrow({ where: { id: lessonId }, include: { attachments: { orderBy: { position: 'asc' } } } });
}

export async function deleteLesson(viewer: AccessViewer, lessonId: string) {
  const lesson = await managedLesson(viewer, lessonId);
  await prisma.lesson.delete({ where: { id: lessonId } });
  await removeFiles(lesson.attachments.map((a) => a.storagePath).filter((path): path is string => Boolean(path)));
}

/** Saves the new order of modules and lessons (lessons may move to another module). */
export async function saveOutline(viewer: AccessViewer, courseId: string, input: OutlineInput) {
  const course = await getManagedCourse(viewer, courseId);
  const moduleIds = course.modules.map((module) => module.id).sort();
  const lessonIds = lessonsOf(course).map((lesson) => lesson.id).sort();
  const sentModules = input.modules.map((module) => module.id).sort();
  const sentLessons = input.modules.flatMap((module) => module.lessonIds).sort();
  if (sentModules.join() !== moduleIds.join() || sentLessons.join() !== lessonIds.join()) {
    throw new CourseError(409, 'The course changed in the meantime. Reload and try again.');
  }
  await prisma.$transaction([
    ...input.modules.map((module, position) => prisma.courseModule.update({ where: { id: module.id }, data: { position } })),
    ...input.modules.flatMap((module) =>
      module.lessonIds.map((lessonId, position) => prisma.lesson.update({ where: { id: lessonId }, data: { moduleId: module.id, position } })),
    ),
  ]);
  return getCourseForEditing(viewer, courseId);
}

const safeFileName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(-100) || 'file';

/** Signed upload into the private bucket; the browser sends the file straight to storage. */
export async function createAttachmentUpload(viewer: AccessViewer, courseId: string, fileName: string) {
  await getManagedCourse(viewer, courseId);
  const path = `courses/${courseId}/${randomUUID()}/${safeFileName(fileName)}`;
  const { data, error } = await supabaseAdmin.storage.from(COURSE_FILES_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message || 'Could not create upload URL');
  return { bucket: COURSE_FILES_BUCKET, path, token: data.token };
}

// ─── Stats ───────────────────────────────────────────────────────────────────

/** Enrolments, completion and drop-off per lesson. Emails only for staff who can see members. */
export async function getCourseStats(viewer: AccessViewer, courseId: string) {
  const course = await getManagedCourse(viewer, courseId);
  const lessons = course.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title })));
  const [enrollments, perLesson] = await Promise.all([
    prisma.courseEnrollment.findMany({
      where: { courseId },
      orderBy: { lastActivityAt: 'desc' },
      take: 500,
      include: { user: { select: { ...personSelect, email: true } } },
    }),
    prisma.lessonProgress.groupBy({ by: ['lessonId'], where: { courseId }, _count: { _all: true } }),
  ]);
  const doneByLesson = new Map(perLesson.map((row) => [row.lessonId, row._count._all]));
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const progressRows = await prisma.lessonProgress.groupBy({ by: ['userId'], where: { courseId, lessonId: { in: [...lessonIds] } }, _count: { _all: true } });
  const doneByMember = new Map(progressRows.map((row) => [row.userId, row._count._all]));
  const showEmails = can(viewer.role, 'members.view');
  const enrolled = course._count.enrollments;
  const completedCount = await prisma.courseEnrollment.count({ where: { courseId, completedAt: { not: null } } });
  const weekAgo = new Date(Date.now() - 7 * DAY_MS);

  return {
    enrolled,
    completed: completedCount,
    completionRate: enrolled ? completedCount / enrolled : 0,
    activeThisWeek: enrollments.filter((enrollment) => enrollment.lastActivityAt >= weekAgo).length,
    lessons: lessons.map((lesson) => ({ id: lesson.id, title: lesson.title, moduleTitle: lesson.moduleTitle, completedCount: doneByLesson.get(lesson.id) ?? 0 })),
    members: enrollments.map(({ user, startedAt, lastActivityAt, completedAt }) => {
      const { email, ...person } = user;
      return {
        ...person,
        ...(showEmails ? { email } : {}),
        startedAt,
        lastActivityAt,
        completedAt,
        completedLessons: doneByMember.get(user.id) ?? 0,
      };
    }),
  };
}

// ─── Access ──────────────────────────────────────────────────────────────────

export async function getCourseAccess(viewer: AccessViewer, id: string) {
  await getManagedCourse(viewer, id);
  return getRule('course', id);
}

export async function assertCanManage(viewer: AccessViewer, id: string) {
  await getManagedCourse(viewer, id);
}
