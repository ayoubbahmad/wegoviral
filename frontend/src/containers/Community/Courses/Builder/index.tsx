'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { cn } from '@/lib/utils';
import { useEditableCourse } from '../api';
import { OutlineEditor } from './OutlineEditor';
import { DetailsTab } from './DetailsTab';
import { StatsTab } from './StatsTab';
import { useT } from '@/i18n/provider';

const TABS = ['content', 'details', 'stats'] as const;
type Tab = (typeof TABS)[number];

/** Course builder for its instructor and admins: outline, details, access and stats. */
export const CourseBuilder = ({ courseId }: { courseId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useT();
  const tab = (TABS.find((option) => option === params.get('tab')) ?? 'content') as Tab;
  const { data: course, isPending, error } = useEditableCourse(courseId);

  const setTab = (next: Tab) => router.replace(next === 'content' ? pathname : `${pathname}?tab=${next}`, { scroll: false });

  return (
    <PageContainer>
      <Link href={`/community/courses/${courseId}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('courses.builder.back')}
      </Link>
      {isPending ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error.message}</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold tracking-tight">{course.title}</h1>
              <p className="text-sm text-muted-foreground">
                {t('courses.builder.statusBy', { status: t(`common.status.${course.status}`), name: course.owner.name || `@${course.owner.username}` })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/community/help/creating-a-course" className="text-sm font-semibold text-primary hover:underline">
                {t('courses.builder.howItWorks')}
              </Link>
              <Link href={`/community/courses/${courseId}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" /> {t('courses.builder.preview')}
                </Button>
              </Link>
            </div>
          </div>
          <div role="tablist" aria-label={t('courses.builder.label')} className="flex gap-4 border-b border-border text-sm font-semibold">
            {TABS.map((option) => (
              <button
                key={option}
                role="tab"
                aria-selected={tab === option}
                onClick={() => setTab(option)}
                className={cn(
                  '-mb-px border-b-2 pb-2 transition-colors',
                  tab === option ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {t(`courses.builder.tabs.${option}`)}
              </button>
            ))}
          </div>
          {tab === 'content' && <OutlineEditor course={course} />}
          {tab === 'details' && <DetailsTab key={course.id} course={course} />}
          {tab === 'stats' && <StatsTab courseId={course.id} />}
        </>
      )}
    </PageContainer>
  );
};
