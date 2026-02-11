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

export const VideosContainer = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: activeVideosApi.getVideos,
    // Optional: select specific fields if backend returns complex object
    select: (data: any) => {
      // Backend returns competitors with nested posts. We need to flatten.
      // data structure: [{ posts: [CompetitorPost] }]
      // We need to map CompetitorPost to Video interface
      const allPosts: Video[] = [];

      if (Array.isArray(data)) {
        data.forEach((comp: any) => {
          if (comp.posts) {
            comp.posts.forEach((post: any) => {
              allPosts.push({
                id: post.id,
                title: post.captionExcerpt || 'No Title',
                thumbnailUrl: post.thumbnailUrl,
                channelName: comp.handle,
                channelAvatarUrl: comp.avatarUrl,
                publishedAt: new Date(post.postedAt).toLocaleDateString(),
                views: post.metrics?.views || '0',
                likes: post.metrics?.likes || '0',
                platform: post.metrics?.url?.includes('tiktok')
                  ? 'tiktok'
                  : post.metrics?.url?.includes('instagram')
                    ? 'instagram'
                    : 'youtube',
                metrics: {
                  views: post.metrics?.views || '0',
                  url: post.metrics?.url,
                },
              });
            });
          }
        });
      }
      return allPosts.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
    },
  });

  const syncMutation = useMutation({
    mutationFn: activeVideosApi.syncAll,
    onSuccess: (data) => {
      showToast(`Synced ${data.count} videos`, 'success');
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: () => {
      showToast('Failed to sync videos', 'error');
    },
  });

  return (
    <>
      <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
        <SearchInput placeholder='Search for videos by topic...' />

        {/* View Controls */}
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className='h-11 px-4 text-sm font-medium'
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`}
            />
            {syncMutation.isPending ? 'Syncing...' : 'Sync Videos'}
          </Button>

          <ViewToggle
            mode={viewMode === 'cards' ? 'grid' : 'table'}
            onChange={(m) => setViewMode(m === 'grid' ? 'cards' : 'table')}
          />

          <Button variant='outline' className='h-11 px-4 text-sm font-medium'>
            <ArrowUpDown className='w-4 h-4' />
            Sort
          </Button>

          <Button variant='outline' className='h-11 px-4 text-sm font-medium'>
            <Filter className='w-4 h-4' />
            Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center p-12'>Loading videos...</div>
      ) : viewMode === 'cards' ? (
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          {videos.length === 0 && (
            <div className='col-span-full text-center p-12 text-gray-500'>
              No videos found. Try syncing!
            </div>
          )}
        </div>
      ) : (
        <VideoTable videos={videos} />
      )}
    </>
  );
};
