import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { cleanupTestData, createTestUser, prisma, supabaseAdmin, TestUser } from './support';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('courses', () => {
  let admin: TestUser;
  let moderator: TestUser;
  let instructor: TestUser;
  let otherInstructor: TestUser;
  let student: TestUser;
  let newcomer: TestUser;
  let courseId: string;
  let module1: string;
  let module2: string;
  let lessons: string[] = [];
  const uploadedPaths: string[] = [];

  const points = async (user: TestUser) =>
    (await prisma.userProfile.findUniqueOrThrow({ where: { id: user.profileId }, select: { points: true } })).points;
  const listed = async (user: TestUser) => (await user.call('GET', '/courses')).data.find((c: { id: string }) => c.id === courseId);

  before(async () => {
    [admin, moderator, instructor, otherInstructor, student, newcomer] = await Promise.all([
      createTestUser('crsadmin', { role: 'ADMIN' }),
      createTestUser('crsmod', { role: 'MODERATOR' }),
      createTestUser('crsinstr', { role: 'INSTRUCTOR' }),
      createTestUser('crsinstr2', { role: 'INSTRUCTOR' }),
      createTestUser('crsstudent'),
      createTestUser('crsnew'),
    ]);
  });

  after(async () => {
    if (uploadedPaths.length) await supabaseAdmin.storage.from('course-files').remove(uploadedPaths);
    await cleanupTestData(); // courses go with their owners
  });

  describe('building', () => {
    it('lets instructors and admins create courses, not moderators or members', async () => {
      assert.equal((await moderator.call('POST', '/courses', { title: 'Mod course' })).status, 403);
      assert.equal((await student.call('POST', '/courses', { title: 'My course' })).status, 403);
      const created = await instructor.call('POST', '/courses', { title: 'Hooks that stop the scroll', description: 'Write better hooks' });
      assert.equal(created.status, 201);
      assert.equal(created.data.status, 'DRAFT');
      courseId = created.data.id;
    });

    it('keeps drafts hidden from members', async () => {
      assert.equal(await listed(student), undefined);
      assert.equal((await student.call('GET', `/courses/${courseId}`)).status, 404);
      assert.ok(await listed(admin), 'admins see every draft');
    });

    it("doesn't publish an empty course", async () => {
      const response = await instructor.call('PATCH', `/courses/${courseId}`, { status: 'PUBLISHED' });
      assert.equal(response.status, 400);
      assert.match(response.data.error, /at least one lesson/);
    });

    it('adds modules and lessons, editable only by the owner and admins', async () => {
      module1 = (await instructor.call('POST', `/courses/${courseId}/modules`, { title: 'Basics' })).data.id;
      module2 = (await instructor.call('POST', `/courses/${courseId}/modules`, { title: 'Advanced', dripDays: 3 })).data.id;
      for (const [moduleId, title] of [
        [module1, 'What is a hook'],
        [module1, 'Three hook formulas'],
        [module2, 'Testing hooks'],
      ]) {
        const lesson = await instructor.call('POST', `/courses/modules/${moduleId}/lessons`, {
          title,
          type: 'VIDEO',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          content: `Notes for ${title}`,
          durationMinutes: 5,
        });
        assert.equal(lesson.status, 201);
        lessons.push(lesson.data.id);
      }
      // Drafts are invisible to other instructors
      assert.equal((await otherInstructor.call('PATCH', `/courses/${courseId}`, { title: 'Mine now' })).status, 404);
      assert.equal((await otherInstructor.call('POST', `/courses/${courseId}/modules`, { title: 'Sneaky' })).status, 404);
      assert.equal((await admin.call('PATCH', `/courses/${courseId}`, { description: 'Edited by an admin' })).status, 200);
    });

    it('reorders lessons, also across modules', async () => {
      const outline = await instructor.call('PUT', `/courses/${courseId}/outline`, {
        modules: [
          { id: module1, lessonIds: [lessons[1], lessons[0]] },
          { id: module2, lessonIds: [lessons[2]] },
        ],
      });
      assert.equal(outline.status, 200);
      assert.deepEqual(outline.data.modules[0].lessons.map((l: { id: string }) => l.id), [lessons[1], lessons[0]]);
      const stale = await instructor.call('PUT', `/courses/${courseId}/outline`, { modules: [{ id: module1, lessonIds: [lessons[0]] }] });
      assert.equal(stale.status, 409);
      lessons = [lessons[1], lessons[0], lessons[2]];
    });

    it('stores uploaded attachments privately and checks they belong to the course', async () => {
      const upload = await instructor.call('POST', `/courses/${courseId}/uploads`, { fileName: 'Hook worksheet.pdf', size: 12 });
      assert.equal(upload.status, 201);
      assert.ok(upload.data.path.startsWith(`courses/${courseId}/`));
      const { error } = await supabaseAdmin.storage
        .from('course-files')
        .uploadToSignedUrl(upload.data.path, upload.data.token, Buffer.from('%PDF-1.4 test'), { contentType: 'application/pdf' });
      assert.equal(error, null);
      uploadedPaths.push(upload.data.path);

      const foreign = await instructor.call('PATCH', `/courses/lessons/${lessons[1]}`, {
        attachments: [{ name: 'Not mine', storagePath: 'courses/another-course/x/file.pdf' }],
      });
      assert.equal(foreign.status, 400);
      const saved = await instructor.call('PATCH', `/courses/lessons/${lessons[1]}`, {
        attachments: [
          { name: 'Hook worksheet.pdf', storagePath: upload.data.path, size: 12 },
          { name: 'Hook swipe file', url: 'https://example.com/swipe' },
        ],
      });
      assert.equal(saved.status, 200);
      assert.equal(saved.data.attachments.length, 2);
      const { data: publicUrl } = supabaseAdmin.storage.from('course-files').getPublicUrl(upload.data.path);
      assert.notEqual((await fetch(publicUrl.publicUrl)).status, 200, 'files are not public');
    });

    it('publishes, and then other instructors can see but not edit it', async () => {
      const published = await instructor.call('PATCH', `/courses/${courseId}`, { status: 'PUBLISHED', completionBadgeId: 'first-post' });
      assert.equal(published.status, 200);
      assert.equal(published.data.status, 'PUBLISHED');
      assert.equal(published.data.lessonCount, 3);
      assert.equal((await otherInstructor.call('PATCH', `/courses/${courseId}`, { title: 'Mine now' })).status, 403);
      assert.equal((await otherInstructor.call('POST', `/courses/${courseId}/modules`, { title: 'Sneaky' })).status, 403);
    });
  });

  describe('taking a course', () => {
    it('shows the outline with the dripped module locked before starting', async () => {
      const course = (await student.call('GET', `/courses/${courseId}`)).data;
      assert.equal(course.progress, null);
      assert.equal(course.modules[0].locked, false);
      assert.equal(course.modules[1].locked, true);
      assert.equal(course.modules[1].dripDays, 3);
    });

    it('enrols the member on the first lesson and gives signed links to files', async () => {
      const lesson = await student.call('GET', `/courses/${courseId}/lessons/${lessons[1]}`);
      assert.equal(lesson.status, 200);
      assert.equal(lesson.data.content, 'Notes for What is a hook');
      assert.equal(lesson.data.previous.id, lessons[0]);
      const file = lesson.data.attachments.find((a: { isFile: boolean }) => a.isFile);
      assert.match(file.url, /token=/);
      assert.equal((await fetch(file.url)).status, 200);
      const course = await listed(student);
      assert.equal(course.progress.lastLessonId, lessons[1]);
      assert.equal(course.progress.completedLessons, 0);
    });

    it('opens the dripped module once enough days have passed', async () => {
      assert.equal((await student.call('GET', `/courses/${courseId}/lessons/${lessons[2]}`)).status, 403);
      await prisma.courseEnrollment.update({
        where: { courseId_userId: { courseId, userId: student.profileId } },
        data: { startedAt: new Date(Date.now() - 4 * DAY_MS) },
      });
      assert.equal((await student.call('GET', `/courses/${courseId}/lessons/${lessons[2]}`)).status, 200);
      assert.equal((await instructor.call('GET', `/courses/${courseId}/lessons/${lessons[2]}`)).status, 200, 'the owner previews everything');
    });

    it('gives points per lesson, takes them back when unticked, and completes the course once', async () => {
      const before = await points(student);
      await student.call('PUT', `/courses/${courseId}/lessons/${lessons[0]}/complete`);
      assert.equal(await points(student), before + 2);
      await student.call('DELETE', `/courses/${courseId}/lessons/${lessons[0]}/complete`);
      assert.equal(await points(student), before);

      for (const lessonId of lessons.slice(0, 2)) {
        const result = await student.call('PUT', `/courses/${courseId}/lessons/${lessonId}/complete`);
        assert.equal(result.data.courseCompleted, false);
      }
      const last = await student.call('PUT', `/courses/${courseId}/lessons/${lessons[2]}/complete`);
      assert.equal(last.data.courseCompleted, true);
      assert.equal(await points(student), before + 3 * 2 + 20);

      const badges = await prisma.memberBadge.findMany({ where: { userId: student.profileId }, select: { badgeId: true } });
      assert.ok(badges.some((b) => b.badgeId === 'course-graduate'), 'automatic graduate badge');
      assert.ok(badges.some((b) => b.badgeId === 'first-post'), "the course's own completion badge");

      const again = await student.call('PUT', `/courses/${courseId}/lessons/${lessons[2]}/complete`);
      assert.equal(again.data.courseCompleted, false, 'completion only counts once');
      assert.ok((await listed(student)).progress.completedAt);
    });

    it("doesn't let the owner take their own course", async () => {
      assert.equal((await instructor.call('PUT', `/courses/${courseId}/lessons/${lessons[0]}/complete`)).status, 400);
    });
  });

  describe('access rules', () => {
    before(async () => {
      await prisma.userProfile.update({ where: { id: newcomer.profileId }, data: { createdAt: new Date(Date.now() - 5 * DAY_MS) } });
      assert.equal((await instructor.call('PUT', `/courses/${courseId}/access`, { minDays: 30 })).status, 200);
    });

    it('shows a locked course with its outline but no lesson content', async () => {
      const course = (await newcomer.call('GET', `/courses/${courseId}`)).data;
      assert.equal(course.access.locked, true);
      assert.equal(course.access.reasons[0].type, 'time');
      assert.ok(course.modules.every((m: { locked: boolean }) => m.locked));
      const lesson = await newcomer.call('GET', `/courses/${courseId}/lessons/${lessons[0]}`);
      assert.equal(lesson.status, 403);
      assert.match(lesson.data.error, /Unlocks in/);
    });

    after(async () => {
      await instructor.call('PUT', `/courses/${courseId}/access`, { minDays: null });
    });
  });

  describe('stats', () => {
    it('shows enrolments, completion and drop-off, with emails only for staff', async () => {
      assert.equal((await student.call('GET', `/courses/${courseId}/stats`)).status, 403);
      const stats = (await instructor.call('GET', `/courses/${courseId}/stats`)).data;
      assert.equal(stats.enrolled, 1);
      assert.equal(stats.completed, 1);
      assert.equal(stats.completionRate, 1);
      assert.deepEqual(stats.lessons.map((l: { completedCount: number }) => l.completedCount), [1, 1, 1]);
      assert.equal(stats.members[0].completedLessons, 3);
      assert.equal(stats.members[0].email, undefined, 'instructors see names, not emails');
      const asAdmin = (await admin.call('GET', `/courses/${courseId}/stats`)).data;
      assert.equal(asAdmin.members[0].email, student.email);
    });
  });

  describe('archiving and deleting', () => {
    it('keeps an archived course for members who started it', async () => {
      assert.equal((await instructor.call('PATCH', `/courses/${courseId}`, { status: 'ARCHIVED' })).status, 200);
      assert.ok(await listed(student));
      assert.equal(await listed(newcomer), undefined);
    });

    it('removes uploaded files with their lesson', async () => {
      assert.equal((await instructor.call('DELETE', `/courses/lessons/${lessons[1]}`)).status, 204);
      const folder = uploadedPaths[0].split('/').slice(0, 3).join('/');
      const { data } = await supabaseAdmin.storage.from('course-files').list(folder);
      assert.equal(data?.length ?? 0, 0);
    });

    it('deletes courses', async () => {
      assert.equal((await otherInstructor.call('DELETE', `/courses/${courseId}`)).status, 404);
      assert.equal((await instructor.call('DELETE', `/courses/${courseId}`)).status, 204);
      assert.equal((await student.call('GET', `/courses/${courseId}`)).status, 404);
    });
  });
});
