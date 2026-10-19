'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Lock,
  Paperclip,
  Pencil,
  PlayCircle,
} from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { Skeleton } from '@/components/Skeleton';
import { useAuth } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { describeLockReason } from '@/lib/access';
import { avatarFor, cn } from '@/lib/utils';
import { CourseDetail, LessonView, OutlineModule } from '@/types/courses';
import { useCompleteLesson, useCourse, useLesson } from './api';
import { formatBytes, formatMinutes, progressPercent, videoSource } from './utils';

/** First lesson the member can open: where they left off, else the first not done. */
function startingLesson(course: CourseDetail) {
  const open = course.modules.filter((module) => !module.locked).flatMap((module) => module.lessons);
  const last = course.progress?.lastLessonId;
  if (last && open.some((lesson) => lesson.id === last)) return last;
  return (open.find((lesson) => !lesson.completed) ?? open[0])?.id ?? null;
}

export const CoursePage = ({ courseId }: { courseId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const lessonId = params.get('lesson');
  const { data: course, isPending, error } = useCourse(courseId);

  const openLesson = (id: string | null) => router.push(id ? `${pathname}?lesson=${id}` : pathname, { scroll: false });

  if (isPending) {
    return (
      <PageContainer>
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-96 rounded-2xl" />
      </PageContainer>
    );
  }
  if (error) {
    return (
      <PageContainer>
        <BackLink />
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </PageContainer>
    );
  }

  const percent = progressPercent(course);
  return (
    <PageContainer>
      <BackLink />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <img src={avatarFor(course.owner)} alt="" className="w-5 h-5 rounded-full border border-border" />
            by {course.owner.name || `@${course.owner.username}`} · {course.lessonCount} lessons
            {course.totalMinutes > 0 && ` · ${formatMinutes(course.totalMinutes)}`}
          </p>
        </div>
        {course.canManage && (
          <div className="flex gap-2">
            <Link href={`/community/courses/${course.id}/edit?tab=stats`}>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4" /> Stats
              </Button>
            </Link>
            <Link href={`/community/courses/${course.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4" /> Edit course
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {lessonId && !course.access.locked ? (
            <LessonPlayer course={course} lessonId={lessonId} onOpen={openLesson} />
          ) : (
            <CourseOverview course={course} onStart={() => openLesson(startingLesson(course))} />
          )}
        </div>
        <aside className="space-y-4">
          {course.progress && !course.isOwner && (
            <Card className="space-y-2" padding="sm">
              <p className="text-sm font-semibold">{course.progress.completedAt ? 'Course completed 🎉' : 'Your progress'}</p>
              <ProgressBar value={percent} />
              <p className="text-xs text-muted-foreground">
                {course.progress.completedLessons} of {course.lessonCount} lessons · {percent}%
              </p>
            </Card>
          )}
          <Outline course={course} activeLessonId={lessonId} onOpen={openLesson} />
        </aside>
      </div>
    </PageContainer>
  );
};

const BackLink = () => (
  <Link href="/community/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
    <ArrowLeft className="w-4 h-4" /> All courses
  </Link>
);

const CourseOverview = ({ course, onStart }: { course: CourseDetail; onStart: () => void }) => (
  <Card padding="none" className="overflow-hidden">
    {course.coverUrl && <img src={course.coverUrl} alt="" className="h-56 w-full object-cover" />}
    <div className="space-y-4 p-6">
      {course.status !== 'PUBLISHED' && (
        <p className="rounded-lg bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
          {course.status === 'DRAFT' ? 'This course is a draft: only you and the admins can see it.' : 'This course is archived: only members who started it can still see it.'}
        </p>
      )}
      {course.access.locked ? (
        <div className="space-y-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <Lock className="w-4 h-4" /> This course is locked
          </p>
          {course.access.reasons.map((reason, index) => (
            <p key={index} className="text-muted-foreground">{describeLockReason(reason)}</p>
          ))}
        </div>
      ) : null}
      {course.description && <p className="whitespace-pre-wrap text-sm leading-relaxed">{course.description}</p>}
      {course.completionBadge && (
        <p className="text-sm text-muted-foreground">
          Finish it to earn the <span className="font-semibold text-foreground">{course.completionBadge.emoji} {course.completionBadge.name}</span> badge.
        </p>
      )}
      {!course.access.locked && course.lessonCount > 0 && (
        <Button variant="primary" onClick={onStart}>
          <PlayCircle className="w-4 h-4" />
          {course.isOwner || course.canManage ? 'Preview' : course.progress ? (course.progress.completedAt ? 'Watch again' : 'Continue') : 'Start the course'}
        </Button>
      )}
    </div>
  </Card>
);

const moduleLockText = (module: OutlineModule) =>
  module.unlocksAt
    ? `Opens on ${new Date(module.unlocksAt).toLocaleDateString()}`
    : module.dripDays
      ? `Opens ${module.dripDays} day${module.dripDays === 1 ? '' : 's'} after you start`
      : 'Locked';

const Outline = ({ course, activeLessonId, onOpen }: { course: CourseDetail; activeLessonId: string | null; onOpen: (id: string) => void }) => (
  <Card padding="none">
    <p className="px-5 pt-4 text-sm font-bold">Course outline</p>
    {course.modules.length === 0 ? (
      <p className="px-5 py-4 text-sm text-muted-foreground">No lessons yet.</p>
    ) : (
      <ol className="space-y-3 p-3">
        {course.modules.map((module, index) => (
          <li key={module.id}>
            <div className="flex items-center justify-between gap-2 px-2 py-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {index + 1}. {module.title}
              </p>
              {module.locked && !course.access.locked && (
                <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                  <Lock className="w-3 h-3" /> {moduleLockText(module)}
                </span>
              )}
            </div>
            <ul>
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <button
                    disabled={module.locked}
                    onClick={() => onOpen(lesson.id)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors',
                      activeLessonId === lesson.id ? 'bg-primary/10 font-semibold text-primary' : 'hover:bg-secondary/50',
                      module.locked && 'cursor-not-allowed opacity-50 hover:bg-transparent',
                    )}
                  >
                    {module.locked ? (
                      <Lock className="w-4 h-4 shrink-0" />
                    ) : lesson.completed ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                    {lesson.attachmentCount > 0 && <Paperclip className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />}
                    {lesson.durationMinutes && <span className="shrink-0 text-xs text-muted-foreground">{lesson.durationMinutes}m</span>}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    )}
  </Card>
);

const LessonPlayer = ({ course, lessonId, onOpen }: { course: CourseDetail; lessonId: string; onOpen: (id: string | null) => void }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: lesson, isPending, error } = useLesson(course.id, lessonId);
  const complete = useCompleteLesson();
  const canInteract = user?.onboarding.step === 'DONE' && user.status !== 'MUTED';

  if (isPending) return <Skeleton className="aspect-video w-full rounded-2xl" />;
  if (error) {
    return (
      <Card className="space-y-3">
        <p className="flex items-center gap-2 font-semibold">
          <Lock className="w-4 h-4" /> {error.message}
        </p>
        <Button variant="outline" size="sm" onClick={() => onOpen(null)}>Back to the course</Button>
      </Card>
    );
  }

  const toggleComplete = (thenNext: boolean) =>
    complete.mutate(
      { courseId: course.id, lessonId: lesson.id, completed: !lesson.completed },
      {
        onSuccess: (result) => {
          if (result.courseCompleted) showToast(`🎓 You finished “${course.title}”!`);
          if (thenNext && lesson.next) onOpen(lesson.next.id);
        },
        onError: (err) => showToast(err.message, 'error'),
      },
    );

  return (
    <div className="space-y-4">
      {lesson.type === 'VIDEO' && lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} title={lesson.title} />}
      <Card className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{lesson.module.title}</p>
          <h2 className="text-xl font-bold">{lesson.title}</h2>
        </div>
        {lesson.content && <div className="whitespace-pre-wrap text-sm leading-relaxed">{lesson.content}</div>}
        {lesson.attachments.length > 0 && <Attachments lesson={lesson} />}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <Button variant="ghost" size="sm" disabled={!lesson.previous} onClick={() => lesson.previous && onOpen(lesson.previous.id)}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <div className="flex flex-wrap gap-2">
            {lesson.canComplete && canInteract && (
              <Button variant={lesson.completed ? 'outline' : 'primary'} size="sm" disabled={complete.isPending} onClick={() => toggleComplete(!lesson.completed)}>
                {complete.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : lesson.completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </>
                ) : lesson.next ? (
                  'Mark complete & continue'
                ) : (
                  'Mark complete'
                )}
              </Button>
            )}
            {lesson.next && (lesson.completed || !lesson.canComplete) && (
              <Button variant="ghost" size="sm" onClick={() => onOpen(lesson.next!.id)}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const VideoPlayer = ({ url, title }: { url: string; title: string }) => {
  const source = videoSource(url);
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
      {source.kind === 'embed' ? (
        <iframe
          src={source.src}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <video src={source.src} controls className="h-full w-full" />
      )}
    </div>
  );
};

const Attachments = ({ lesson }: { lesson: LessonView }) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold">Resources</p>
    <ul className="grid gap-2 sm:grid-cols-2">
      {lesson.attachments.map((attachment) => (
        <li key={attachment.id}>
          <a
            href={attachment.url ?? '#'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm hover:bg-secondary/40"
          >
            <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate">{attachment.name}</span>
            {attachment.size ? <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(attachment.size)}</span> : null}
            {attachment.isFile ? <Download className="w-4 h-4 shrink-0" /> : <ExternalLink className="w-4 h-4 shrink-0" />}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
