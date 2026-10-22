'use client';

import {
  ArrowUpRight,
  Plus,
  Play,
  Video,
  FileText,
  FolderOpen,
  Trophy,
  Flame,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHomeController } from './controller';
import { HomeSkeleton } from '@/views/Home/skeleton';
import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/PageContainer';
import { StatCard } from '@/components/StatCard';
import { SectionHeader } from '@/components/SectionHeader';
import { ProgressBar } from '@/components/ProgressBar';
import { ScriptCard } from '@/containers/Scripts/components/ScriptCard';
import { useT } from '@/i18n/provider';

/** The server sends sample stats with English labels */
const STAT_KEYS: Record<string, 'views' | 'engagement' | 'viralPosts' | 'growth'> = {
  'Total Views': 'views',
  Engagement: 'engagement',
  'Viral Posts': 'viralPosts',
  Growth: 'growth',
};

export const HomeContainer = () => {
  const t = useT();
  const router = useRouter();
  const { stats, isLoading, videos, scripts, projects, challenges } =
    useHomeController();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <PageContainer>
      <PageHeader
        title={t('creator.home.title')}
        description={t('creator.home.description')}
      />

      {/* Stats Overview */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {stats?.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label in STAT_KEYS ? t(`creator.home.stats.${STAT_KEYS[stat.label]}`) : stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className='grid gap-8 md:grid-cols-2 xl:grid-cols-4'>
        {/* Videos Section */}
        <div className='space-y-4'>
          <SectionHeader
            title={t('nav.creator.videos')}
            icon={Video}
            href='/creator/videos'
            titleClassName='text-primary'
          />

          <Button variant='outline' className='w-full border-dashed group'>
            <Plus className='w-4 h-4 text-primary group-hover:scale-110 transition-transform' />
            {t('creator.home.analyzeVideo')}
          </Button>

          <div className='space-y-3 pt-1'>
            {videos.map((video: any) => (
              <div
                key={video.id}
                className='group relative aspect-video rounded-xl bg-muted/30 border border-border/50 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all'
              >
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10' />
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20'>
                  <div className='w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform'>
                    <Play className='w-5 h-5 text-white fill-white' />
                  </div>
                </div>
                <div className='absolute bottom-3 start-3 end-3 z-20'>
                  <p className='text-xs font-bold text-white line-clamp-1'>
                    {video.title}
                  </p>
                  <p className='text-[10px] text-zinc-400'>
                    {t('creator.home.videoMeta', { views: video.views, when: video.postedAt })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scripts Section */}
        <div className='space-y-4'>
          <SectionHeader
            title={t('nav.creator.scripts')}
            icon={FileText}
            href='/creator/scripts'
            titleClassName='text-purple-500'
          />

          <Link href='/creator/scripts/new' className='block w-full'>
            <Button
              variant='outline'
              className='w-full border-dashed border-purple-500/20 text-purple-500 hover:bg-purple-500/5 hover:border-purple-500/50 group'
            >
              <Plus className='w-4 h-4 group-hover:scale-110 transition-transform' />
              {t('creator.home.newScript')}
            </Button>
          </Link>

          <div className='space-y-3 pt-1'>
            {scripts.map((script: any) => (
              <ScriptCard
                key={script.id}
                variant='compact'
                script={{
                  id: script.id,
                  title: script.title,
                  excerpt:
                    script.excerpt ||
                    script.content?.topic?.substring(0, 100) ||
                    t('creator.home.noContent'),
                  status: script.status || 'Draft',
                  lastUpdated: script.updatedAt || t('creator.home.justNow'),
                  wordCount: script.wordCount || 0,
                }}
                onClick={() => router.push(`/creator/scripts/${script.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className='space-y-4'>
          <SectionHeader
            title={t('nav.creator.projects')}
            icon={FolderOpen}
            href='/creator/projects'
            titleClassName='text-amber-500'
          />

          <Button
            variant='outline'
            className='w-full border-dashed border-amber-500/20 text-amber-500 hover:bg-amber-500/5 hover:border-amber-500/50 group'
          >
            <Plus className='w-4 h-4 group-hover:scale-110 transition-transform' />
            {t('creator.home.newProject')}
          </Button>

          <div className='space-y-3 pt-1'>
            {projects.map((proj, i) => (
              <div
                key={i}
                className='p-4 rounded-xl bg-card border border-border/50 hover:border-amber-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md'
              >
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='font-bold text-sm'>{proj.name}</h3>
                </div>
                <ProgressBar
                  value={proj.progress}
                  color={proj.color}
                  showLabel
                />
              </div>
            ))}
          </div>
        </div>

        {/* Challenges Section */}
        <div className='space-y-4'>
          <SectionHeader
            title={t('nav.community.challenges')}
            icon={Trophy}
            href='/community/challenges'
            titleClassName='text-emerald-500'
          />

          <div className='grid grid-cols-2 gap-2'>
            <Button
              variant='outline'
              className='border-dashed border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5 hover:border-emerald-500/50 group'
            >
              <Globe className='w-4 h-4 group-hover:rotate-12 transition-transform' />
              {t('creator.home.join')}
            </Button>
            <Button
              variant='outline'
              className='border-dashed border-emerald-800/20 text-emerald-600 hover:bg-emerald-800/5 hover:border-emerald-800/50 group'
            >
              <Plus className='w-4 h-4 group-hover:scale-110 transition-transform' />
              {t('creator.home.create')}
            </Button>
          </div>

          <div className='space-y-3 pt-1'>
            {challenges.map((challenge, i) => (
              <div
                key={i}
                className='p-4 rounded-xl bg-card border border-border/50 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden group'
              >
                {challenge.hot && (
                  <div className='absolute top-0 end-0'>
                    <div className='bg-orange-500 text-[8px] font-black text-white px-2 py-0.5 rounded-es-lg flex items-center gap-1 uppercase tracking-tighter shadow-sm animate-pulse'>
                      <Flame className='w-2.5 h-2.5' />
                      {t('creator.home.hot')}
                    </div>
                  </div>
                )}
                <h3 className='font-bold text-sm mb-1'>{challenge.name}</h3>
                <div className='flex items-center gap-2'>
                  <div className='flex -space-x-2'>
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className='w-5 h-5 rounded-full border-2 border-card bg-muted overflow-hidden'
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=challenger${i}${j}`}
                          alt='avatar'
                        />
                      </div>
                    ))}
                  </div>
                  <span className='text-[10px] text-muted-foreground font-bold'>
                    {t('creator.home.joining', { count: challenge.recruits })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
