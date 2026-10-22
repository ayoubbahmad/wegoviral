'use client';

import { useState } from 'react';
import { VideoCard } from './components/VideoCard';
import { VideoTable } from './components/VideoTable';
import { ArrowUpDown, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/Button';
import { SearchInput } from '@/components/SearchInput';
import { ViewToggle } from '@/components/ViewToggle';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activeVideosApi, Video } from './api';
import { useToast } from '@/providers/Toast';
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';

export const VideosContainer = () => {
  const t = useT();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: activeVideosApi.getVideos,
    // Optional: select specific fields if backend returns complex object
    select: (posts: any[]) => {
      // Backend now returns flattened posts with competitor context
      return posts.map((post: any) => ({
        id: post.id,
        title: post.captionExcerpt || t('creator.videos.noTitle'),
        thumbnailUrl: post.thumbnailUrl,
        channelName: post.competitor?.handle || t('creator.videos.unknown'),
        channelAvatarUrl: post.competitor?.avatarUrl,
        publishedAt: new Date(post.postedAt).toLocaleDateString(activeIntl()),
        views: post.metrics?.views || '0',
        likes: post.metrics?.likes || '0',
        platform: (post.metrics?.url?.includes('tiktok')
          ? 'tiktok'
          : post.metrics?.url?.includes('instagram')
            ? 'instagram'
            : 'youtube') as Video['platform'],
        metrics: {
          views: post.metrics?.views || '0',
          url: post.metrics?.url,
        },
      }));
    },
  });

  const syncMutation = useMutation({
    mutationFn: activeVideosApi.syncAll,
    onSuccess: (data) => {
      showToast(t('creator.videos.synced', { count: data.count }), 'success');
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: () => {
      showToast(t('creator.videos.syncFailed'), 'error');
    },
  });

  return (
    <>
      <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
        <SearchInput placeholder={t('creator.videos.search')} />

        {/* View Controls */}
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className='h-11 px-4 text-sm font-medium'
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
          >
            <RefreshCw
              className={`w-4 h-4 me-2 ${syncMutation.isPending ? 'animate-spin' : ''}`}
            />
            {syncMutation.isPending ? t('creator.videos.syncing') : t('creator.videos.sync')}
          </Button>

          <ViewToggle
            mode={viewMode === 'cards' ? 'grid' : 'table'}
            onChange={(m) => setViewMode(m === 'grid' ? 'cards' : 'table')}
          />

          <Button variant='outline' className='h-11 px-4 text-sm font-medium'>
            <ArrowUpDown className='w-4 h-4' />
            {t('creator.videos.sort')}
          </Button>

          <Button variant='outline' className='h-11 px-4 text-sm font-medium'>
            <Filter className='w-4 h-4' />
            {t('creator.videos.filters')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center p-12'>{t('creator.videos.loading')}</div>
      ) : viewMode === 'cards' ? (
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          {videos.length === 0 && (
            <div className='col-span-full text-center p-12 text-gray-500'>
              {t('creator.videos.empty')}
            </div>
          )}
        </div>
      ) : (
        <VideoTable videos={videos} />
      )}
    </>
  );
};
