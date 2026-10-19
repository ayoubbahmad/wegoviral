'use client';

import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { avatarFor, formatRelativeDate } from '@/lib/utils';
import { useCourseStats } from '../api';

/** Enrolments, completion, drop-off per lesson and who's taking the course. */
export const StatsTab = ({ courseId }: { courseId: string }) => {
  const { data: stats, isPending, error } = useCourseStats(courseId, true);
  if (isPending) return <Skeleton className="h-96 rounded-2xl" />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;

  const lessonTotal = stats.lessons.length;
  const showEmails = stats.members.some((member) => member.email !== undefined);
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ['Started', stats.enrolled],
          ['Finished', stats.completed],
          ['Completion rate', `${Math.round(stats.completionRate * 100)}%`],
          ['Active this week', stats.activeThisWeek],
        ].map(([label, value]) => (
          <Card key={label} padding="sm">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <div>
          <h2 className="font-bold">Drop-off per lesson</h2>
          <p className="text-sm text-muted-foreground">How many of the {stats.enrolled} members who started completed each lesson.</p>
        </div>
        {lessonTotal === 0 ? (
          <p className="text-sm text-muted-foreground">No lessons yet.</p>
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
                  <span className="text-right tabular-nums text-muted-foreground">{lesson.completedCount}</span>
                </li>
              );
            })}
          </ol>
        )}
      </Card>

      <Card padding="none">
        <div className="px-5 pt-5">
          <h2 className="font-bold">Members</h2>
          {!showEmails && <p className="text-sm text-muted-foreground">Names and progress only; contact details stay with the team.</p>}
        </div>
        {stats.members.length === 0 ? (
          <p className="px-5 py-4 text-sm text-muted-foreground">Nobody has started yet.</p>
        ) : (
          <div className="overflow-x-auto p-2">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-semibold">Member</th>
                  <th className="px-3 py-2 font-semibold">Progress</th>
                  <th className="px-3 py-2 font-semibold">Started</th>
                  <th className="px-3 py-2 font-semibold">Last active</th>
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
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Finished</span>
                      ) : (
                        `${member.completedLessons} / ${lessonTotal}`
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{new Date(member.startedAt).toLocaleDateString()}</td>
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
