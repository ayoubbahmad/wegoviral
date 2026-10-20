'use client';

import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { avatarFor, formatRelativeDate } from '@/lib/utils';
import { useCourseStats } from '../api';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

/** Enrolments, completion, drop-off per lesson and who's taking the course. */
export const StatsTab = ({ courseId }: { courseId: string }) => {
  const t = useT();
  const { data: stats, isPending, error } = useCourseStats(courseId, true);
  if (isPending) return <Skeleton className="h-96 rounded-2xl" />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;

  const lessonTotal = stats.lessons.length;
  const showEmails = stats.members.some((member) => member.email !== undefined);
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          [t('courses.builder.stats.started'), stats.enrolled],
          [t('courses.builder.stats.finished'), stats.completed],
          [t('courses.builder.stats.rate'), `${Math.round(stats.completionRate * 100)}%`],
          [t('courses.builder.stats.activeWeek'), stats.activeThisWeek],
        ].map(([label, value]) => (
          <Card key={label} padding="sm">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <div>
          <h2 className="font-bold">{t('courses.builder.stats.dropOff')}</h2>
          <p className="text-sm text-muted-foreground">{t('courses.builder.stats.dropOffBody', { count: stats.enrolled })}</p>
        </div>
        {lessonTotal === 0 ? (
          <p className="text-sm text-muted-foreground">{t('courses.builder.stats.noLessons')}</p>
        ) : (
          <ol className="space-y-2">
            {stats.lessons.map((lesson, index) => {
              const share = stats.enrolled ? lesson.completedCount / stats.enrolled : 0;
              return (
                <li key={lesson.id} className="grid grid-cols-[minmax(0,1fr)_minmax(80px,2fr)_48px] items-center gap-3 text-sm">
                  <span className="truncate" title={`${lesson.moduleTitle} · ${lesson.title}`}>
                    <span className="text-muted-foreground">{index + 1}.</span> {lesson.title}
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.round(share * 100)}%` }} />
                  </span>
                  <span className="text-end tabular-nums text-muted-foreground">{lesson.completedCount}</span>
                </li>
              );
            })}
          </ol>
        )}
      </Card>

      <Card padding="none">
        <div className="px-5 pt-5">
          <h2 className="font-bold">{t('courses.builder.stats.members')}</h2>
          {!showEmails && <p className="text-sm text-muted-foreground">{t('courses.builder.stats.namesOnly')}</p>}
        </div>
        {stats.members.length === 0 ? (
          <p className="px-5 py-4 text-sm text-muted-foreground">{t('courses.builder.stats.nobody')}</p>
        ) : (
          <div className="overflow-x-auto p-2">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-start text-xs text-muted-foreground">
                  <th className="px-3 py-2 text-start font-semibold">{t('courses.builder.stats.member')}</th>
                  <th className="px-3 py-2 text-start font-semibold">{t('courses.builder.stats.progress')}</th>
                  <th className="px-3 py-2 text-start font-semibold">{t('courses.builder.stats.startedCol')}</th>
                  <th className="px-3 py-2 text-start font-semibold">{t('courses.builder.stats.lastActive')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {stats.members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-2">
                        <img src={avatarFor(member)} alt="" className="h-7 w-7 rounded-full border border-border" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{member.name || `@${member.username}`}</span>
                          {member.email && <span className="block truncate text-xs text-muted-foreground">{member.email}</span>}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {member.completedAt ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t('courses.builder.stats.finishedCell')}</span>
                      ) : (
                        `${member.completedLessons} / ${lessonTotal}`
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{new Date(member.startedAt).toLocaleDateString(activeIntl())}</td>
                    <td className="px-3 py-2 text-muted-foreground">{formatRelativeDate(member.lastActivityAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
