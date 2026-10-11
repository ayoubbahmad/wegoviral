'use client';

import { Competitor } from '@/types/competitor';
import { Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CompetitorTableViewProps {
  competitors: Competitor[];
  onDelete: (id: string) => void;
}

export function CompetitorTableView({
  competitors,
  onDelete,
}: CompetitorTableViewProps) {
  return (
    <div className='bg-card rounded-2xl border border-border/50 overflow-hidden'>
      <div className='overflow-x-auto overflow-y-hidden'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b border-border/50 bg-secondary/5'>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                Channel
              </th>
              <th className='px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                Followers
              </th>
              <th className='px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                Avg. Likes
              </th>
              <th className='px-4 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center'>
                Engagement
              </th>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border/30'>
            {competitors.map((competitor) => (
              <tr
                key={competitor.id}
                className='hover:bg-secondary/5 transition-colors group'
              >
                <td className='px-6 py-4'>
                  <Link
                    href={`/creator/competitors/${competitor.id}`}
                    className='flex items-center gap-3'
                  >
                    <img
                      src={competitor.avatarUrl}
                      alt={competitor.name}
                      className='w-10 h-10 rounded-full border border-border shadow-sm'
                    />
                    <div className='min-w-0'>
                      <div className='text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate'>
                        {competitor.name}
                      </div>
                      <div className='text-[11px] text-muted-foreground font-medium'>
                        {competitor.handle}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className='px-4 py-4'>
                  <span className='text-sm font-medium'>
                    {competitor.stats.followers}
                  </span>
                </td>
                <td className='px-4 py-4'>
                  <span className='text-sm font-medium'>
                    {competitor.stats.avgLikes}
                  </span>
                </td>
                <td className='px-4 py-4 text-center'>
                  <span className='inline-flex items-center px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 text-xs font-bold'>
                    {competitor.stats.engagementRate}
                  </span>
                </td>
                <td className='px-6 py-4 text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <Link
                      href={`/creator/competitors/${competitor.id}`}
                      className='p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors'
                      title='View details'
                    >
                      <ExternalLink className='w-4 h-4' />
                    </Link>
                    <button
                      onClick={() => onDelete(competitor.id)}
                      className='p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors'
                      title='Stop tracking'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {competitors.length === 0 && (
        <div className='py-20 text-center text-muted-foreground text-sm font-medium'>
          No competitors found matching your criteria.
        </div>
      )}
    </div>
  );
}
