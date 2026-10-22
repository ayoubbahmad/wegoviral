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
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

const RANGES: StatsRange[] = ['30d', '90d', '12m'];

// Weekday names as the API sends them (Monday first)
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Tab = 'members' | 'engagement' | 'content' | 'revenue';

export const AdminStatsContainer = () => {
  const t = useT();
  const can = useCan();
  const [range, setRange] = useState<StatsRange>('30d');
  const [tab, setTab] = useState<Tab>('members');
  const tabs: Tab[] = ['members', 'engagement', 'content', ...(can('tiers.manage') ? (['revenue'] as const) : [])];

  return (
    <PageContainer>
      <PageHeader
        helpHref="/admin/help/stats" title={t('admin.statsPage.title')} description={t('admin.statsPage.description')} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label={t('admin.statsPage.tabsLabel')} className="flex gap-4 border-b border-border text-sm font-semibold">
          {tabs.map((option) => (
            <button
              key={option}
              role="tab"
              aria-selected={tab === option}
              onClick={() => setTab(option)}
              className={cn('-mb-px border-b-2 pb-2 transition-colors', tab === option ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
            >
              {t(`admin.statsPage.tabs.${option}`)}
            </button>
          ))}
        </div>
        {tab !== 'revenue' && (
          <div role="group" aria-label={t('admin.statsPage.periodLabel')} className="flex gap-1 rounded-xl border border-border bg-card p-1">
            {RANGES.map((option) => (
              <button
                key={option}
                aria-pressed={range === option}
                onClick={() => setRange(option)}
                className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors', range === option ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {t(`admin.statsPage.ranges.${option}`)}
              </button>
            ))}
          </div>
        )}
      </div>
      {tab === 'members' && <MembersTab range={range} />}
      {tab === 'engagement' && <EngagementTab range={range} />}
      {tab === 'content' && <ContentTab range={range} />}
      {tab === 'revenue' && (
        <EmptyState icon={CreditCard} title={t('admin.statsPage.revenueTitle')} description={t('admin.statsPage.revenueBody')} />
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
  const t = useT();
  const stepLabel = (step: string) => t(`admin.statsPage.funnelSteps.${step as 'Approved'}`);
  const { data, isPending, error } = useMemberStats(range);
  if (isPending) return <Loading />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  const signups = data.signups.reduce((sum, point) => sum + point.value, 0);
  const funnelTop = Math.max(1, data.funnel[0]?.count ?? 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label={t('admin.statsPage.activeToday')} value={data.current.day} />
        <Stat label={t('admin.statsPage.activeWeek')} value={data.current.week} />
        <Stat label={t('admin.statsPage.activeMonth')} value={data.current.month} />
        <Stat label={t('admin.statsPage.newMembers')} value={signups} hint={t('admin.statsPage.inLast', { range: t(`admin.statsPage.ranges.${range}`) })} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title={t('admin.statsPage.signups')}
          action={<ExportButton filename={`signups-${range}`} rows={() => [[t('admin.statsPage.periodLabel'), t('admin.statsPage.signups')], ...data.signups.map((p) => [p.bucket, p.value])]} />}
        >
          <BarChart data={data.signups} kind={data.bucket} />
        </Panel>
        <Panel
          title={t('admin.statsPage.activeMembers')}
          description={t('admin.statsPage.activeHint')}
          action={<ExportButton filename={`active-members-${range}`} rows={() => [[t('admin.statsPage.periodLabel'), t('admin.statsPage.activeMembers')], ...data.active.map((p) => [p.bucket, p.value])]} />}
        >
          <BarChart data={data.active} kind={data.bucket} color="bg-emerald-500" />
        </Panel>
      </div>

      <Panel
        title={t('admin.statsPage.funnel')}
        description={t('admin.statsPage.funnelHint')}
        action={<ExportButton filename={`joining-funnel-${range}`} rows={() => [[t('admin.statsPage.funnel'), t('admin.statsPage.members')], ...data.funnel.map((s) => [stepLabel(s.step), s.count])]} />}
      >
        <ol className="space-y-2">
          {data.funnel.map((step) => (
            <li key={step.step} className="grid grid-cols-[minmax(0,180px)_1fr_80px] items-center gap-3 text-sm">
              <span className="truncate">{stepLabel(step.step)}</span>
              <span className="h-6 overflow-hidden rounded-md bg-muted">
                <span className="block h-full rounded-md bg-primary/70" style={{ width: `${(step.count / funnelTop) * 100}%` }} />
              </span>
              <span className="text-end tabular-nums">
                {step.count} <span className="text-xs text-muted-foreground">{percent(step.count / funnelTop)}</span>
              </span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel
        title={t('admin.statsPage.retention')}
        description={t('admin.statsPage.retentionHint')}
        action={
          <ExportButton
            filename="retention"
            rows={() => [[t('admin.statsPage.signedUp'), t('admin.statsPage.members'), ...Array.from({ length: 6 }, (_, i) => t('admin.statsPage.month', { number: i }))], ...data.retention.map((row) => [row.cohort, row.size, ...row.months.map((m) => percent(m.share))])]}
          />
        }
      >
        {data.retention.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('admin.statsPage.noSignups')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-start text-xs text-muted-foreground">
                  <th className="py-2 pe-3 text-start font-semibold">{t('admin.statsPage.signedUp')}</th>
                  <th className="py-2 pe-3 text-start font-semibold">{t('admin.statsPage.members')}</th>
                  {Array.from({ length: 6 }, (_, i) => (
                    <th key={i} className="px-1 py-2 text-center font-semibold">{t('admin.statsPage.month', { number: i })}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.retention.map((row) => {
                  const [year, month] = row.cohort.split('-').map(Number);
                  const monthsSince = (new Date().getFullYear() - year) * 12 + new Date().getMonth() + 1 - month;
                  return (
                    <tr key={row.cohort}>
                      <td className="py-1 pe-3 font-medium">{bucketLabel(`${row.cohort}-01`, 'month')}</td>
                      <td className="py-1 pe-3 tabular-nums">{row.size}</td>
                      {row.months.map((cell) => (
                        <td key={cell.offset} className="px-1 py-1">
                          {cell.offset > monthsSince ? (
                            <span className="block h-8" />
                          ) : (
                            <span
                              title={t('admin.statsPage.ofTotal', { users: cell.users, size: row.size })}
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
  { id: 'posts', color: 'bg-primary' },
  { id: 'comments', color: 'bg-sky-500' },
  { id: 'likes', color: 'bg-rose-500' },
] as const;

const EngagementTab = ({ range }: { range: StatsRange }) => {
  const t = useT();
  const { data, isPending, error } = useEngagementStats(range);
  const [metric, setMetric] = useState<(typeof METRICS)[number]['id']>('posts');
  if (isPending) return <Loading />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  const selected = METRICS.find((m) => m.id === metric)!;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {METRICS.map((m) => (
          <Stat key={m.id} label={t(`admin.statsPage.${m.id}`)} value={data.totals[m.id]} />
        ))}
      </div>
      <Panel
        title={t('admin.statsPage.activityOverTime')}
        action={
          <div className="flex items-center gap-2">
            <div role="group" aria-label={t('admin.statsPage.metric')} className="flex gap-1">
              {METRICS.map((m) => (
                <button
                  key={m.id}
                  aria-pressed={metric === m.id}
                  onClick={() => setMetric(m.id)}
                  className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', metric === m.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
                >
                  {t(`admin.statsPage.${m.id}`)}
                </button>
              ))}
            </div>
            <ExportButton filename={`engagement-${range}`} rows={() => [[t('admin.statsPage.periodLabel'), t('admin.statsPage.posts'), t('admin.statsPage.comments'), t('admin.statsPage.likes')], ...data.series.map((p) => [p.bucket, p.posts, p.comments, p.likes])]} />
          </div>
        }
      >
        <BarChart data={data.series.map((point) => ({ bucket: point.bucket, value: point[metric] }))} kind={data.bucket} color={selected.color} />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title={t('admin.statsPage.bySpace')}
          action={<ExportButton filename={`spaces-${range}`} rows={() => [[t('admin.statsPage.space'), t('admin.statsPage.posts'), t('admin.statsPage.comments'), t('admin.statsPage.likes')], ...data.bySpace.map((s) => [s.name, s.posts, s.comments, s.likes])]} />}
        >
          {data.bySpace.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('admin.statsPage.noPosts')}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-start text-xs text-muted-foreground">
                  <th className="py-2 text-start font-semibold">{t('admin.statsPage.space')}</th>
                  <th className="py-2 text-end font-semibold">{t('admin.statsPage.posts')}</th>
                  <th className="py-2 text-end font-semibold">{t('admin.statsPage.comments')}</th>
                  <th className="py-2 text-end font-semibold">{t('admin.statsPage.likes')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {data.bySpace.map((space) => (
                  <tr key={space.spaceId}>
                    <td className="py-2">{space.emoji} {space.name}</td>
                    <td className="py-2 text-end tabular-nums">{space.posts}</td>
                    <td className="py-2 text-end tabular-nums">{space.comments}</td>
                    <td className="py-2 text-end tabular-nums">{space.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
        <Panel
          title={t('admin.statsPage.topContributors')}
          description={t('admin.statsPage.topHint')}
          action={
            <ExportButton
              filename={`top-contributors-${range}`}
              rows={() => [[t('admin.statsPage.members'), '@', t('admin.statsPage.posts'), t('admin.statsPage.comments'), t('admin.statsPage.likes')], ...data.topContributors.map((c) => [c.member.name ?? '', `@${c.member.username}`, c.posts, c.comments, c.likesReceived])]}
            />
          }
        >
          {data.topContributors.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('admin.statsPage.nobodyPosted')}</p>
          ) : (
            <ol className="space-y-2">
              {data.topContributors.map((row, index) => (
                <li key={row.member.id} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-center text-xs font-bold text-muted-foreground">{index + 1}</span>
                  <img src={avatarFor(row.member)} alt="" className="h-8 w-8 rounded-full border border-border" />
                  <span className="min-w-0 flex-1 truncate font-medium">{row.member.name || `@${row.member.username}`}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {t('admin.statsPage.contributorLine', { posts: row.posts, comments: row.comments, likes: row.likesReceived })}
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
  const t = useT();
  // Mon…Sun in the app's language (2024-01-01 was a Monday)
  const dayName = (index: number) => new Date(2024, 0, 1 + index).toLocaleDateString(activeIntl(), { weekday: 'short' });
  const cells = data.bestTimes.flatMap((day) => day.hours);
  const max = Math.max(0.0001, ...cells.map((cell) => cell.avgEngagement));
  const best = [...data.bestTimes.flatMap((day) => day.hours.map((cell) => ({ ...cell, day: day.day })))]
    .filter((cell) => cell.posts >= 2)
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 3);
  return (
    <Panel
      title={t('admin.statsPage.bestTimes')}
      description={
        best.length
          ? t('admin.statsPage.bestTimesFound', { times: best.map((cell) => `${dayName(DAYS.indexOf(cell.day))} ${cell.hour}:00`).join(', ') })
          : t('admin.statsPage.bestTimesHint')
      }
      action={
        <ExportButton
          filename={`posting-times-${range}`}
          rows={() => [[t('admin.statsPage.col.date'), 'h', t('admin.statsPage.posts'), `${t('admin.statsPage.likes')} + ${t('admin.statsPage.comments')}`], ...data.bestTimes.flatMap((day) => day.hours.map((cell) => [day.day, cell.hour, cell.posts, cell.avgEngagement.toFixed(2)]))]}
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
              <span className="self-center font-semibold">{dayName(DAYS.indexOf(day.day))}</span>
              {day.hours.map((cell) => (
                <span
                  key={cell.hour}
                  title={t('admin.statsPage.cellTitle', { day: dayName(DAYS.indexOf(day.day)), hour: cell.hour, posts: cell.posts, avg: cell.avgEngagement.toFixed(1) })}
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
  const t = useT();
  const { data, isPending, error } = useContentStats(range);
  if (isPending) return <Loading />;
  if (error) return <p className="text-sm text-muted-foreground">{error.message}</p>;
  const date = (iso: string) => new Date(iso).toLocaleDateString(activeIntl());

  return (
    <div className="space-y-6">
      <Panel
        title={t('admin.statsPage.courses')}
        description={t('admin.statsPage.coursesHint')}
        action={
          <ExportButton
            filename="courses"
            rows={() => [[t('admin.statsPage.col.course'), t('admin.members.colStatus'), t('admin.statsPage.col.lessons'), t('admin.statsPage.col.started'), t('admin.statsPage.col.inPeriod'), t('admin.statsPage.col.finished'), t('admin.statsPage.col.completion')], ...data.courses.map((c) => [c.title, c.status, c.lessons, c.enrolled, c.startedInRange, c.completed, percent(c.completionRate)])]}
          />
        }
      >
        <DataTable
          empty={t('admin.statsPage.noCourses')}
          headers={['course', 'lessons', 'started', 'inPeriod', 'finished', 'completion'].map((key) => t(`admin.statsPage.col.${key as 'course'}`))}
          rows={data.courses.map((c) => [c.title, c.lessons, c.enrolled, c.startedInRange, c.completed, percent(c.completionRate)])}
        />
      </Panel>
      <Panel
        title={t('admin.statsPage.events')}
        description={t('admin.statsPage.eventsHint')}
        action={
          <ExportButton
            filename={`events-${range}`}
            rows={() => [[t('admin.statsPage.col.event'), t('admin.statsPage.col.date'), t('admin.members.colStatus'), t('events.form.category'), t('admin.statsPage.col.going'), t('admin.statsPage.col.capacity'), t('admin.statsPage.col.fillRate')], ...data.events.map((e) => [e.title, e.startsAt, e.status, e.category ?? '', e.going, e.capacity ?? '', e.fillRate === null ? '' : percent(e.fillRate)])]}
          />
        }
      >
        <DataTable
          empty={t('admin.statsPage.noEvents')}
          headers={['event', 'date', 'going', 'capacity', 'fillRate'].map((key) => t(`admin.statsPage.col.${key as 'event'}`))}
          rows={data.events.map((e) => [`${e.title}${e.status === 'CANCELLED' ? t('admin.statsPage.cancelledSuffix') : ''}`, date(e.startsAt), e.going, e.capacity ?? '∞', e.fillRate === null ? '—' : percent(e.fillRate)])}
        />
      </Panel>
      <Panel
        title={t('admin.statsPage.challenges')}
        description={t('admin.statsPage.challengesHint')}
        action={
          <ExportButton
            filename={`challenges-${range}`}
            rows={() => [[t('admin.statsPage.col.challenge'), t('challenges.form.starts'), t('challenges.form.ends'), t('challenges.form.checkIns'), t('admin.statsPage.col.takingPart'), t('admin.statsPage.col.checkIns'), t('admin.statsPage.col.finished'), t('admin.statsPage.col.finishRate')], ...data.challenges.map((c) => [c.title, c.startsAt, c.endsAt, c.checkInType, c.participants, c.checkIns, c.finished, percent(c.finishRate)])]}
          />
        }
      >
        <DataTable
          empty={t('admin.statsPage.noChallenges')}
          headers={['challenge', 'dates', 'takingPart', 'checkIns', 'finished', 'finishRate'].map((key) => t(`admin.statsPage.col.${key as 'challenge'}`))}
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
          <tr className="text-start text-xs text-muted-foreground">
            {headers.map((header, index) => (
              <th key={header} className={cn('py-2 pe-3 text-start font-semibold', index > 0 && 'text-end')}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, index) => (
                <td key={index} className={cn('py-2 pe-3', index > 0 ? 'text-end tabular-nums' : 'font-medium')}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
