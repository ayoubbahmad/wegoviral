'use client';

import { Download } from 'lucide-react';
import { Card } from '@/components/Card';
import { downloadCsv } from '@/lib/csv';
import { cn } from '@/lib/utils';
import type { StatsBucket } from '../types';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

/** "Oct 19", "Week of Oct 13", "Oct 2026". */
export function bucketLabel(bucket: string, kind: StatsBucket, weekOf = (date: string) => date) {
  const date = new Date(`${bucket}T12:00:00Z`);
  if (kind === 'month') return date.toLocaleDateString(activeIntl(), { month: 'short', year: 'numeric', timeZone: 'UTC' });
  const day = date.toLocaleDateString(activeIntl(), { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return kind === 'week' ? weekOf(day) : day;
}

export const percent = (share: number) => `${Math.round(share * 100)}%`;

export const ExportButton = ({ filename, rows }: { filename: string; rows: () => unknown[][] }) => (
  <button
    onClick={() => downloadCsv(filename, rows())}
    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
  >
    <Download className="w-3.5 h-3.5" /> CSV
  </button>
);

export const Panel = ({ title, description, action, children, className }: { title: string; description?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <Card className={cn('space-y-4', className)}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="font-bold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </Card>
);

/** Simple vertical bar chart; hover a bar for its value. */
export const BarChart = ({ data, kind, color = 'bg-primary', height = 140 }: { data: { bucket: string; value: number }[]; kind: StatsBucket; color?: string; height?: number }) => {
  const t = useT();
  const weekOf = (date: string) => t('admin.statsPage.week', { date });
  const max = Math.max(1, ...data.map((point) => point.value));
  const labelEvery = Math.ceil(data.length / 6);
  return (
    <div className="space-y-1">
      <div className="flex items-end gap-[2px]" style={{ height }} role="img" aria-label={`${data.length} · max ${max}`}>
        {data.map((point) => (
          <div key={point.bucket} className="group relative flex h-full flex-1 items-end">
            <div className={cn('w-full rounded-t-sm transition-opacity group-hover:opacity-80', point.value ? color : 'bg-muted')} style={{ height: `${Math.max(point.value ? 4 : 2, (point.value / max) * 100)}%` }} />
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-semibold text-background opacity-0 group-hover:opacity-100">
              {bucketLabel(point.bucket, kind, weekOf)}: {point.value}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-[2px] text-[10px] text-muted-foreground">
        {data.map((point, index) => (
          <span key={point.bucket} className="flex-1 truncate">
            {index % labelEvery === 0 ? bucketLabel(point.bucket, kind) : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Stat = ({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) => (
  <Card padding="sm">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold tabular-nums">{value}</p>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </Card>
);
