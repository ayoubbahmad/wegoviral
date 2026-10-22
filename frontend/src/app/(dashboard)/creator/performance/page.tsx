'use client';

import { usePerformance } from '@/hooks/usePerformance';
import { PostingTimeHeatmap } from '@/containers/Performance/PostingTimeHeatmap';
import { TopPostsGrid } from '@/containers/Performance/TopPostsGrid';
import { Clock, Lightbulb, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/Auth';
import Link from 'next/link';
import { MOCK_PERFORMANCE_POSTS, MOCK_POSTING_TIMES } from '@/lib/mock-data';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { PageContainer } from '@/components/PageContainer';
import { SectionHeader } from '@/components/SectionHeader';
import { ProgressBar } from '@/components/ProgressBar';
import { useT } from '@/i18n/provider';

const FORMATS = { Reels: true, Carousels: true };

export default function PerformancePage() {
  const t = useT();
  const { activeSocialAccount } = useAuth();
  const { posts, insights, isLoading } = usePerformance();

  const dataPosts = posts && posts.length > 0 ? posts : MOCK_PERFORMANCE_POSTS;
  const contentMix = insights?.contentMix || [
    { label: 'Reels', value: 60, color: 'bg-blue-500' },
    { label: 'Carousels', value: 30, color: 'bg-purple-500' },
  ];

  return (
    <PageContainer className='animate-in fade-in duration-500'>
      <PageHeader
        title={t('creator.performance.title')}
        description={t('creator.performance.description')}
      />

      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Heatmap Section */}
        <div className='lg:col-span-2 p-6 rounded-2xl bg-card border border-border shadow-sm relative overflow-hidden'>
          <SectionHeader
            title={t('creator.performance.bestTime')}
            icon={Clock}
            description={t('creator.performance.bestTimeBody')}
            className='mb-6'
            titleClassName='text-lg'
          />

          {activeSocialAccount ? (
            <PostingTimeHeatmap data={MOCK_POSTING_TIMES} />
          ) : (
            <div className='relative'>
              <div className='filter blur-md opacity-40 select-none pointer-events-none'>
                <PostingTimeHeatmap data={MOCK_POSTING_TIMES} />
              </div>
              <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-4'>
                <div className='p-3 bg-background/80 backdrop-blur-md rounded-xl border border-border shadow-lg max-w-sm'>
                  <h3 className='font-semibold mb-1'>{t('creator.performance.connectTitle')}</h3>
                  <p className='text-xs text-muted-foreground mb-3'>
                    {t('creator.performance.connectBody')}
                  </p>
                  <Button onClick={() => (window.location.href = '/settings')}>
                    {t('creator.performance.connect')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats or Insight */}
        <div className='space-y-6'>
          <div className='p-6 rounded-2xl bg-gradient-to-br rtl:bg-gradient-to-bl from-purple-500/10 to-indigo-500/10 border border-purple-500/20'>
            <h3 className='flex items-center gap-2 font-semibold text-purple-700 dark:text-purple-300 mb-2'>
              <Lightbulb className='w-4 h-4' aria-hidden /> {t('creator.performance.insight')}
            </h3>
            <p className='text-sm text-foreground/80 leading-relaxed'>
              {t('creator.performance.insightBody', { time: insights?.bestTime || t('creator.performance.sampleTime') })}
            </p>
          </div>
          <div className='p-6 rounded-2xl bg-card border border-border'>
            <SectionHeader
              title={t('creator.performance.contentMix')}
              className='mb-4'
              titleClassName='text-base'
            />
            <div className='space-y-4'>
              {contentMix.map((item: any, i: number) => (
                <div key={i} className='space-y-1.5'>
                  <div className='flex justify-between text-xs font-medium'>
                    <span>{item.label in FORMATS ? t(`creator.performance.formats.${item.label as 'Reels'}`) : item.label}</span>
                    <span className='text-muted-foreground'>{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} color={item.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='border-t border-border pt-8'>
        <SectionHeader
          title={t('creator.performance.top')}
          icon={TrendingUp}
          className='mb-6'
        />
        {isLoading ? (
          <div className='p-12 text-center text-muted-foreground'>
            {t('creator.performance.loading')}
          </div>
        ) : (
          <TopPostsGrid posts={dataPosts} />
        )}
      </div>
    </PageContainer>
  );
}
