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

const TABS = [
  { id: 'content', label: 'Content' },
  { id: 'details', label: 'Details & access' },
  { id: 'stats', label: 'Stats' },
] as const;
type Tab = (typeof TABS)[number]['id'];

const STATUS_LABEL = { DRAFT: 'Draft', PUBLISHED: 'Published', ARCHIVED: 'Archived' } as const;

/** Course builder for its instructor and admins: outline, details, access and stats. */
export const CourseBuilder = ({ courseId }: { courseId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = (TABS.find((option) => option.id === params.get('tab'))?.id ?? 'content') as Tab;
  const { data: course, isPending, error } = useEditableCourse(courseId);

  const setTab = (next: Tab) => router.replace(next === 'content' ? pathname : `${pathname}?tab=${next}`, { scroll: false });

  return (
    <PageContainer>
      <Link href={`/community/courses/${courseId}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to the course
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
                {STATUS_LABEL[course.status]} · by {course.owner.name || `@${course.owner.username}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/community/help/creating-a-course" className="text-sm font-semibold text-primary hover:underline">
                How does this work?
              </Link>
              <Link href={`/community/courses/${courseId}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" /> Preview
                </Button>
              </Link>
            </div>
          </div>
          <div role="tablist" aria-label="Course builder" className="flex gap-4 border-b border-border text-sm font-semibold">
            {TABS.map((option) => (
              <button
                key={option.id}
                role="tab"
                aria-selected={tab === option.id}
                onClick={() => setTab(option.id)}
                className={cn(
                  '-mb-px border-b-2 pb-2 transition-colors',
                  tab === option.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {option.label}
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
