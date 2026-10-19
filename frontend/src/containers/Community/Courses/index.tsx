'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, Clock, GraduationCap, Loader2, Lock, Play, Plus } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import { ProgressBar } from '@/components/ProgressBar';
import { Skeleton } from '@/components/Skeleton';
import { useCan } from '@/providers/Auth';
import { useToast } from '@/providers/Toast';
import { describeLockReason } from '@/lib/access';
import { cn } from '@/lib/utils';
import { CourseSummary } from '@/types/courses';
import { useCourses, useCreateCourse } from './api';
import { formatMinutes, progressPercent } from './utils';

type Filter = 'all' | 'progress' | 'done' | 'mine';

const FILTERS: { id: Filter; label: string; match: (course: CourseSummary) => boolean }[] = [
  { id: 'all', label: 'All courses', match: () => true },
  { id: 'progress', label: 'In progress', match: (c) => Boolean(c.progress && !c.progress.completedAt) },
  { id: 'done', label: 'Completed', match: (c) => Boolean(c.progress?.completedAt) },
  { id: 'mine', label: 'I teach', match: (c) => c.canManage },
];

const STATUS_BADGE: Partial<Record<CourseSummary['status'], string>> = {
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
};

export const CommunityCoursesContainer = () => {
  const can = useCan();
  const { data: courses = [], isPending, error } = useCourses();
  const [filter, setFilter] = useState<Filter>('all');
  const [creating, setCreating] = useState(false);
  const canCreate = can('courses.create');

  // "Continue where you left off": the course touched most recently and not finished
  const current = courses
    .filter((course) => course.progress && !course.progress.completedAt && !course.access.locked)
    .sort((a, b) => new Date(b.progress!.lastActivityAt).getTime() - new Date(a.progress!.lastActivityAt).getTime())[0];
  const visibleFilters = FILTERS.filter((option) => option.id !== 'mine' || courses.some((course) => course.canManage));
  const shown = courses.filter(FILTERS.find((option) => option.id === filter)!.match);

  return (
    <PageContainer>
      <PageHeader
        title="Courses"
        description="Learn from the community's playbooks, trainings and replays."
        actions={
          canCreate && (
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus className="w-4 h-4" /> New course
            </Button>
          )
        }
      />

      {current && <ContinueCard course={current} />}

      <div role="tablist" aria-label="Filter courses" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {visibleFilters.map((option) => (
          <button
            key={option.id}
            role="tab"
            aria-selected={filter === option.id}
            onClick={() => setFilter(option.id)}
            className={cn(
              'shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
              filter === option.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card/50 text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : shown.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={filter === 'all' ? 'No courses yet' : 'Nothing here yet'}
          description={filter === 'all' ? (canCreate ? 'Create the first course for the community.' : 'New courses will show up here.') : undefined}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <NewCourseDialog isOpen={creating} onClose={() => setCreating(false)} />
    </PageContainer>
  );
};

const Cover = ({ course, className }: { course: CourseSummary; className?: string }) =>
  course.coverUrl ? (
    <img src={course.coverUrl} alt="" className={cn('object-cover', className)} />
  ) : (
    <div className={cn('flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5', className)}>
      <GraduationCap className="w-10 h-10 text-primary/60" />
    </div>
  );

const ContinueCard = ({ course }: { course: CourseSummary }) => {
  const percent = progressPercent(course);
  const href = `/community/courses/${course.id}${course.progress?.lastLessonId ? `?lesson=${course.progress.lastLessonId}` : ''}`;
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Cover course={course} className="h-36 w-full sm:h-auto sm:w-56" />
        <div className="flex flex-1 flex-col justify-center gap-3 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Continue where you left off</p>
          <h2 className="text-lg font-bold">{course.title}</h2>
          <div className="space-y-1.5">
            <ProgressBar value={percent} />
            <p className="text-xs text-muted-foreground">
              {course.progress!.completedLessons} of {course.lessonCount} lessons · {percent}%
            </p>
          </div>
          <div>
            <Link href={href}>
              <Button variant="primary" size="sm">
                <Play className="w-4 h-4" /> Continue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CourseCard = ({ course }: { course: CourseSummary }) => {
  const percent = progressPercent(course);
  const status = STATUS_BADGE[course.status];
  return (
    <Link href={`/community/courses/${course.id}`} className="group block">
      <Card padding="none" hover className={cn('flex h-full flex-col overflow-hidden', course.status === 'DRAFT' && 'border-dashed')}>
        <div className="relative">
          <Cover course={course} className="h-40 w-full" />
          {status && <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-bold">{status}</span>}
          {course.access.locked && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-bold">
              <Lock className="w-3 h-3" /> Locked
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1">
            <h3 className="font-bold leading-snug group-hover:text-primary">{course.title}</h3>
            <p className="text-xs text-muted-foreground">by {course.owner.name || `@${course.owner.username}`}</p>
          </div>
          {course.description && <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>}
          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> {course.lessonCount} lesson{course.lessonCount === 1 ? '' : 's'}
            </span>
            {course.totalMinutes > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {formatMinutes(course.totalMinutes)}
              </span>
            )}
            {course.completionBadge && (
              <span title={`Finish it to earn ${course.completionBadge.name}`}>
                {course.completionBadge.emoji} {course.completionBadge.name}
              </span>
            )}
          </div>
          {course.access.locked ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">{course.access.reasons.map(describeLockReason).join(' · ')}</p>
          ) : course.progress?.completedAt ? (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Completed
            </p>
          ) : course.progress ? (
            <div className="space-y-1">
              <ProgressBar value={percent} />
              <p className="text-xs text-muted-foreground">{percent}% done</p>
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
};

const NewCourseDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const create = useCreateCourse();
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    create.mutate(
      { title: title.trim() },
      {
        onSuccess: (course) => router.push(`/community/courses/${course.id}/edit`),
        onError: (error) => showToast(error.message, 'error'),
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New course" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Title</span>
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            placeholder="e.g. Hooks that stop the scroll"
            className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <p className="text-xs text-muted-foreground">It starts as a draft: add modules and lessons, then publish it.</p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={title.trim().length < 3 || create.isPending}>
            {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create and start building'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
