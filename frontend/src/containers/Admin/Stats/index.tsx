'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { useCan } from '@/providers/Auth';
import { avatarFor, cn } from '@/lib/utils';
import { useContentStats, useEngagementStats, useMemberStats } from '../api/stats';
import type { EngagementStats, StatsRange } from '../types';
import { BarChart, bucketLabel, ExportButton, Panel, percent, Stat } from './charts';

const RANGES: { id: StatsRange; label: string }[] = [
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: '12m', label: '12 months' },
];

type Tab = 'members' | 'engagement' | 'content' | 'revenue';

export const AdminStatsContainer = () => {
  const can = useCan();
  const [range, setRange] = useState<StatsRange>('30d');
  const [tab, setTab] = useState<Tab>('members');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'members', label: 'Members' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'content', label: 'Content' },
    ...(can('tiers.manage') ? [{ id: 'revenue' as const, label: 'Revenue' }] : []),
  ];

  return (
    <PageContainer>
      <PageHeader title="Stats" description="How the community is growing and what members do. Times follow your time zone; every table exports to CSV." />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Stats" className="flex gap-4 border-b border-border text-sm font-semibold">
          {tabs.map((option) => (
            <button
              key={option.id}
              role="tab"
              aria-selected={tab === option.id}
              onClick={() => setTab(option.id)}
              className={cn('-mb-px border-b-2 pb-2 transition-colors', tab === option.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
            >
              {option.label}
            </button>
          ))}
        </div>
        {tab !== 'revenue' && (
          <div role="group" aria-label="Period" className="flex gap-1 rounded-xl border border-border bg-card p-1">
            {RANGES.map((option) => (
              <button
                key={option.id}
                aria-pressed={range === option.id}
                onClick={() => setRange(option.id)}
                className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors', range === option.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {tab === 'members' && <MembersTab range={range} />}
      {tab === 'engagement' && <EngagementTab range={range} />}
      {tab === 'content' && <ContentTab range={range} />}
      {tab === 'revenue' && (
        <EmptyState icon={CreditCard} title="Revenue comes with payments" description="Monthly recurring revenue, subscribers, churn and coupon use will show here once Stripe is connected (Phase 9)." />
      )}
    </PageContainer>
  );
};

const Loading = () => (
  <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-3">
      {[0, 1, 2].map((index) => (
        <Skeleton key={index} className="h-20 rounded-2xl" />
      ))}
    </div>
    <Skeleton className="h-64 rounded-2xl" />
  </div>
);

// ─── Members ─────────────────────────────────────────────────────────────────

const MembersTab = ({ range }: { range: StatsRange }) => {
  const { data, isPending, error } = useMemberStats(range);
  if (isPending) return <Loading />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  const signups = data.signups.reduce((sum, point) => sum + point.value, 0);
  const funnelTop = Math.max(1, data.funnel[0]?.count ?? 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Active today" value={data.current.day} />
        <Stat label="Active this week" value={data.current.week} />
        <Stat label="Active this month" value={data.current.month} />
        <Stat label="New members" value={signups} hint={`in the last ${RANGES.find((r) => r.id === range)!.label}`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Sign-ups"
          action={<ExportButton filename={`signups-${range}`} rows={() => [['Period', 'Sign-ups'], ...data.signups.map((p) => [p.bucket, p.value])]} />}
        >
          <BarChart data={data.signups} kind={data.bucket} />
        </Panel>
        <Panel
          title="Active members"
          description="Posted, commented, liked, voted, RSVPed, completed a lesson or checked in."
          action={<ExportButton filename={`active-members-${range}`} rows={() => [['Period', 'Active members'], ...data.active.map((p) => [p.bucket, p.value])]} />}
        >
          <BarChart data={data.active} kind={data.bucket} color="bg-emerald-500" />
        </Panel>
      </div>

      <Panel
        title="Joining funnel"
        description="Members who signed up in this period, at each step."
        action={<ExportButton filename={`joining-funnel-${range}`} rows={() => [['Step', 'Members'], ...data.funnel.map((s) => [s.step, s.count])]} />}
      >
        <ol className="space-y-2">
          {data.funnel.map((step) => (
            <li key={step.step} className="grid grid-cols-[minmax(0,180px)_1fr_80px] items-center gap-3 text-sm">
              <span className="truncate">{step.step}</span>
              <span className="h-6 overflow-hidden rounded-md bg-muted">
                <span className="block h-full rounded-md bg-primary/70" style={{ width: `${(step.count / funnelTop) * 100}%` }} />
              </span>
              <span className="text-right tabular-nums">
                {step.count} <span className="text-xs text-muted-foreground">{percent(step.count / funnelTop)}</span>
              </span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel
        title="Retention by sign-up month"
        description="Share of each month's new members who were active 0, 1, 2… months later."
        action={
          <ExportButton
            filename="retention"
            rows={() => [['Sign-up month', 'Members', ...Array.from({ length: 6 }, (_, i) => `Month ${i}`)], ...data.retention.map((row) => [row.cohort, row.size, ...row.months.map((m) => percent(m.share))])]}
          />
        }
      >
        {data.retention.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sign-ups in the last 6 months.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">Signed up</th>
                  <th className="py-2 pr-3 font-semibold">Members</th>
                  {Array.from({ length: 6 }, (_, i) => (
                    <th key={i} className="px-1 py-2 text-center font-semibold">Month {i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.retention.map((row) => {
                  const [year, month] = row.cohort.split('-').map(Number);
                  const monthsSince = (new Date().getFullYear() - year) * 12 + new Date().getMonth() + 1 - month;
                  return (
                    <tr key={row.cohort}>
                      <td className="py-1 pr-3 font-medium">{bucketLabel(`${row.cohort}-01`, 'month')}</td>
                      <td className="py-1 pr-3 tabular-nums">{row.size}</td>
                      {row.months.map((cell) => (
                        <td key={cell.offset} className="px-1 py-1">
                          {cell.offset > monthsSince ? (
                            <span className="block h-8" />
                          ) : (
                            <span
                              title={`${cell.users} of ${row.size}`}
                              className="flex h-8 items-center justify-center rounded-md text-xs font-semibold"
                              style={{ backgroundColor: `color-mix(in srgb, var(--primary) ${Math.round(cell.share * 85) + 5}%, transparent)` }}
                            >
                              {percent(cell.share)}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
};

// ─── Engagement ──────────────────────────────────────────────────────────────

const METRICS = [
  { id: 'posts', label: 'Posts', color: 'bg-primary' },
  { id: 'comments', label: 'Comments', color: 'bg-sky-500' },
  { id: 'likes', label: 'Likes', color: 'bg-rose-500' },
] as const;

const EngagementTab = ({ range }: { range: StatsRange }) => {
  const { data, isPending, error } = useEngagementStats(range);
  const [metric, setMetric] = useState<(typeof METRICS)[number]['id']>('posts');
  if (isPending) return <Loading />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  const selected = METRICS.find((m) => m.id === metric)!;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {METRICS.map((m) => (
          <Stat key={m.id} label={m.label} value={data.totals[m.id]} />
        ))}
      </div>
      <Panel
        title="Activity over time"
        action={
          <div className="flex items-center gap-2">
            <div role="group" aria-label="Metric" className="flex gap-1">
              {METRICS.map((m) => (
                <button
                  key={m.id}
                  aria-pressed={metric === m.id}
                  onClick={() => setMetric(m.id)}
                  className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', metric === m.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <ExportButton filename={`engagement-${range}`} rows={() => [['Period', 'Posts', 'Comments', 'Likes'], ...data.series.map((p) => [p.bucket, p.posts, p.comments, p.likes])]} />
          </div>
        }
      >
        <BarChart data={data.series.map((point) => ({ bucket: point.bucket, value: point[metric] }))} kind={data.bucket} color={selected.color} />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="By space"
          action={<ExportButton filename={`spaces-${range}`} rows={() => [['Space', 'Posts', 'Comments', 'Likes'], ...data.bySpace.map((s) => [s.name, s.posts, s.comments, s.likes])]} />}
        >
          {data.bySpace.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts in this period.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="py-2 font-semibold">Space</th>
                  <th className="py-2 text-right font-semibold">Posts</th>
                  <th className="py-2 text-right font-semibold">Comments</th>
                  <th className="py-2 text-right font-semibold">Likes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.bySpace.map((space) => (
                  <tr key={space.spaceId}>
                    <td className="py-2">{space.emoji} {space.name}</td>
                    <td className="py-2 text-right tabular-nums">{space.posts}</td>
                    <td className="py-2 text-right tabular-nums">{space.comments}</td>
                    <td className="py-2 text-right tabular-nums">{space.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
        <Panel
          title="Top contributors"
          description="Most posts and comments in this period."
          action={
            <ExportButton
              filename={`top-contributors-${range}`}
              rows={() => [['Member', 'Username', 'Posts', 'Comments', 'Likes received'], ...data.topContributors.map((c) => [c.member.name ?? '', `@${c.member.username}`, c.posts, c.comments, c.likesReceived])]}
            />
          }
        >
          {data.topContributors.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nobody posted in this period.</p>
          ) : (
            <ol className="space-y-2">
              {data.topContributors.map((row, index) => (
                <li key={row.member.id} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-center text-xs font-bold text-muted-foreground">{index + 1}</span>
                  <img src={avatarFor(row.member)} alt="" className="h-8 w-8 rounded-full border border-border" />
                  <span className="min-w-0 flex-1 truncate font-medium">{row.member.name || `@${row.member.username}`}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {row.posts} posts · {row.comments} comments · {row.likesReceived} ❤️
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <BestTimes data={data} range={range} />
    </div>
  );
};

/** Weekday × hour grid: darker = more reactions per post; empty = no posts then. */
const BestTimes = ({ data, range }: { data: EngagementStats; range: StatsRange }) => {
  const cells = data.bestTimes.flatMap((day) => day.hours);
  const max = Math.max(0.0001, ...cells.map((cell) => cell.avgEngagement));
  const best = [...data.bestTimes.flatMap((day) => day.hours.map((cell) => ({ ...cell, day: day.day })))]
    .filter((cell) => cell.posts >= 2)
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 3);
  return (
    <Panel
      title="Best posting times"
      description={best.length ? `Posts got the most likes and comments on ${best.map((cell) => `${cell.day} ${cell.hour}:00`).join(', ')} (at least 2 posts).` : 'Average likes and comments per post, by when it was posted.'}
      action={
        <ExportButton
          filename={`posting-times-${range}`}
          rows={() => [['Day', 'Hour', 'Posts', 'Avg likes + comments'], ...data.bestTimes.flatMap((day) => day.hours.map((cell) => [day.day, cell.hour, cell.posts, cell.avgEngagement.toFixed(2)]))]}
        />
      }
    >
      <div className="overflow-x-auto">
        <div className="grid min-w-[640px] grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-[3px] text-[10px] text-muted-foreground">
          <span />
          {Array.from({ length: 24 }, (_, hour) => (
            <span key={hour} className="text-center">{hour % 3 === 0 ? hour : ''}</span>
          ))}
          {data.bestTimes.map((day) => (
            <div key={day.day} className="contents">
              <span className="self-center font-semibold">{day.day}</span>
              {day.hours.map((cell) => (
                <span
                  key={cell.hour}
                  title={`${day.day} ${cell.hour}:00 · ${cell.posts} post${cell.posts === 1 ? '' : 's'} · ${cell.avgEngagement.toFixed(1)} avg reactions`}
                  className={cn('h-6 rounded-sm', !cell.posts && 'bg-muted')}
                  style={cell.posts ? { backgroundColor: `color-mix(in srgb, var(--primary) ${Math.round((cell.avgEngagement / max) * 85) + 15}%, transparent)` } : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

// ─── Content ─────────────────────────────────────────────────────────────────

const ContentTab = ({ range }: { range: StatsRange }) => {
  const { data, isPending, error } = useContentStats(range);
  if (isPending) return <Loading />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  const date = (iso: string) => new Date(iso).toLocaleDateString();

  return (
    <div className="space-y-6">
      <Panel
        title="Courses"
        description="All published and archived courses."
        action={
          <ExportButton
            filename="courses"
            rows={() => [['Course', 'Status', 'Lessons', 'Started', 'Started in period', 'Finished', 'Completion rate'], ...data.courses.map((c) => [c.title, c.status, c.lessons, c.enrolled, c.startedInRange, c.completed, percent(c.completionRate)])]}
          />
        }
      >
        <DataTable
          empty="No courses yet."
          headers={['Course', 'Lessons', 'Started', 'In period', 'Finished', 'Completion']}
          rows={data.courses.map((c) => [c.title, c.lessons, c.enrolled, c.startedInRange, c.completed, percent(c.completionRate)])}
        />
      </Panel>
      <Panel
        title="Events"
        description="Events that started in this period or are coming up."
        action={
          <ExportButton
            filename={`events-${range}`}
            rows={() => [['Event', 'Date', 'Status', 'Category', 'Going', 'Capacity', 'Fill rate'], ...data.events.map((e) => [e.title, e.startsAt, e.status, e.category ?? '', e.going, e.capacity ?? '', e.fillRate === null ? '' : percent(e.fillRate)])]}
          />
        }
      >
        <DataTable
          empty="No events in this period."
          headers={['Event', 'Date', 'Going', 'Capacity', 'Fill rate']}
          rows={data.events.map((e) => [`${e.title}${e.status === 'CANCELLED' ? ' (cancelled)' : ''}`, date(e.startsAt), e.going, e.capacity ?? '∞', e.fillRate === null ? '—' : percent(e.fillRate)])}
        />
      </Panel>
      <Panel
        title="Challenges"
        description="Challenges running or ended in this period."
        action={
          <ExportButton
            filename={`challenges-${range}`}
            rows={() => [['Challenge', 'Starts', 'Ends', 'Type', 'Taking part', 'Check-ins', 'Finished', 'Finish rate'], ...data.challenges.map((c) => [c.title, c.startsAt, c.endsAt, c.checkInType, c.participants, c.checkIns, c.finished, percent(c.finishRate)])]}
          />
        }
      >
        <DataTable
          empty="No challenges in this period."
          headers={['Challenge', 'Dates', 'Taking part', 'Check-ins', 'Finished', 'Finish rate']}
          rows={data.challenges.map((c) => [c.title, `${date(c.startsAt)} – ${date(c.endsAt)}`, c.participants, c.checkIns, c.finished, percent(c.finishRate)])}
        />
      </Panel>
    </div>
  );
};

const DataTable = ({ headers, rows, empty }: { headers: string[]; rows: React.ReactNode[][]; empty: string }) =>
  rows.length === 0 ? (
    <p className="text-sm text-muted-foreground">{empty}</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground">
            {headers.map((header, index) => (
              <th key={header} className={cn('py-2 pr-3 font-semibold', index > 0 && 'text-right')}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, index) => (
                <td key={index} className={cn('py-2 pr-3', index > 0 ? 'text-right tabular-nums' : 'font-medium')}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
