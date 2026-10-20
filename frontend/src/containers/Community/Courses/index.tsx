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
import { useT } from '@/i18n/provider';

type Filter = 'all' | 'progress' | 'done' | 'mine';

const FILTERS: { id: Filter; match: (course: CourseSummary) => boolean }[] = [
  { id: 'all', match: () => true },
  { id: 'progress', match: (c) => Boolean(c.progress && !c.progress.completedAt) },
  { id: 'done', match: (c) => Boolean(c.progress?.completedAt) },
  { id: 'mine', match: (c) => c.canManage },
];

export const CommunityCoursesContainer = () => {
  const t = useT();
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
        helpHref="/community/help/courses"
        title={t('courses.title')}
        description={t('courses.description')}
        actions={
          canCreate && (
            <Button variant="primary" onClick={() => setCreating(true)}>
              <Plus className="w-4 h-4" /> {t('courses.newCourse')}
            </Button>
          )
        }
      />

      {current && <ContinueCard course={current} />}

      <div role="tablist" aria-label={t('courses.filters.label')} className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
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
            {t(`courses.filters.${option.id}`)}
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
          title={filter === 'all' ? t('courses.emptyAll') : t('courses.emptyFiltered')}
          description={filter === 'all' ? (canCreate ? t('courses.emptyCreate') : t('courses.emptyMember')) : undefined}
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
  const t = useT();
  const percent = progressPercent(course);
  const href = `/community/courses/${course.id}${course.progress?.lastLessonId ? `?lesson=${course.progress.lastLessonId}` : ''}`;
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Cover course={course} className="h-36 w-full sm:h-auto sm:w-56" />
        <div className="flex flex-1 flex-col justify-center gap-3 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t('courses.continueTitle')}</p>
          <h2 className="text-lg font-bold">{course.title}</h2>
          <div className="space-y-1.5">
            <ProgressBar value={percent} />
            <p className="text-xs text-muted-foreground">
              {t('courses.lessonsOf', { done: course.progress!.completedLessons, total: course.lessonCount, percent })}
            </p>
          </div>
          <div>
            <Link href={href}>
              <Button variant="primary" size="sm">
                <Play className="w-4 h-4 rtl:rotate-180" /> {t('courses.page.continue')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CourseCard = ({ course }: { course: CourseSummary }) => {
  const t = useT();
  const percent = progressPercent(course);
  const status = course.status === 'PUBLISHED' ? null : t(`common.status.${course.status}`);
  return (
    <Link href={`/community/courses/${course.id}`} className="group block">
      <Card padding="none" hover className={cn('flex h-full flex-col overflow-hidden', course.status === 'DRAFT' && 'border-dashed')}>
        <div className="relative">
          <Cover course={course} className="h-40 w-full" />
          {status && <span className="absolute start-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-bold">{status}</span>}
          {course.access.locked && (
            <span className="absolute end-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-bold">
              <Lock className="w-3 h-3" /> {t('common.locked')}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1">
            <h3 className="font-bold leading-snug group-hover:text-primary">{course.title}</h3>
            <p className="text-xs text-muted-foreground">{t('common.by', { name: course.owner.name || `@${course.owner.username}` })}</p>
          </div>
          {course.description && <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>}
          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> {t('courses.lessons', { count: course.lessonCount })}
            </span>
            {course.totalMinutes > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {formatMinutes(course.totalMinutes)}
              </span>
            )}
            {course.completionBadge && (
              <span title={t('courses.earnBadge', { badge: course.completionBadge.name })}>
                {course.completionBadge.emoji} {course.completionBadge.name}
              </span>
            )}
          </div>
          {course.access.locked ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">{course.access.reasons.map((reason) => describeLockReason(reason, t)).join(' · ')}</p>
          ) : course.progress?.completedAt ? (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> {t('courses.completed')}
            </p>
          ) : course.progress ? (
            <div className="space-y-1">
              <ProgressBar value={percent} />
              <p className="text-xs text-muted-foreground">{t('courses.percentDone', { percent })}</p>
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
};

const NewCourseDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const t = useT();
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
    <Modal isOpen={isOpen} onClose={onClose} title={t('courses.newDialog.title')} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-muted-foreground">{t('courses.newDialog.label')}</span>
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            placeholder={t('courses.newDialog.placeholder')}
            className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <p className="text-xs text-muted-foreground">{t('courses.newDialog.hint')}</p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="primary" disabled={title.trim().length < 3 || create.isPending}>
            {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t('courses.newDialog.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
