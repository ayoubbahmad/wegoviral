import { Play, TrendingUp, Eye, FolderPlus } from 'lucide-react';
import Link from 'next/link';
import { Video } from './VideoCard';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AddToProjectModal } from '@/containers/Projects/components/AddToProjectModal';

interface VideoTableProps {
  videos: Video[];
}

export function VideoTable({ videos }: VideoTableProps) {
  return (
    <div className='rounded-xl border border-border bg-card overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b border-border bg-muted/50'>
              <th className='p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                Video
              </th>
              <th className='p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center text-green-500'>
                Outlier
              </th>
              <th className='p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                Platform
              </th>
              <th className='p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                Views
              </th>
              <th className='p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                Engagement
              </th>
              <th className='p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider'>
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <VideoTableRow key={video.id} video={video} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VideoTableRow({ video }: { video: Video }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className='border-b border-border/50 hover:bg-secondary/30 transition-colors group cursor-pointer relative'>
        <td className='p-4'>
          <Link href={`/video/${video.id}`} className='flex items-center gap-3'>
            <div className='relative w-10 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0'>
              <img
                src={video.thumbnailUrl}
                alt=''
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <Play className='w-4 h-4 text-white fill-white' />
              </div>
            </div>
            <div className='min-w-0 max-w-[300px]'>
              <div className='text-sm font-bold truncate group-hover:text-primary transition-colors'>
                {video.channelName}
              </div>
              <div className='text-xs text-muted-foreground truncate'>
                {video.title}
              </div>
            </div>
          </Link>
        </td>
        <td className='p-4 text-center'>
          <div className='inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-black'>
            <TrendingUp className='w-3 h-3' />
            {video.metrics.outlierScore || '1x'}
          </div>
        </td>
        <td className='p-4 text-[10px] font-bold uppercase'>
          {video.platform === 'youtube' && (
            <span className='text-red-500'>YouTube</span>
          )}
          {video.platform === 'tiktok' && (
            <span className='text-foreground'>TikTok</span>
          )}
          {video.platform === 'instagram' && (
            <span className='text-pink-500'>Instagram</span>
          )}
        </td>
        <td className='p-4 text-sm font-semibold tabular-nums'>
          {video.metrics.views}
        </td>
        <td className='p-4 text-sm font-semibold text-blue-500 tabular-nums'>
          {video.metrics.engagementRate || 'N/A'}
        </td>
        <td className='p-4'>
          <div className='flex items-center justify-between gap-4'>
            <span className='text-xs text-muted-foreground whitespace-nowrap'>
              {video.publishedAt}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className='p-2 rounded-lg bg-secondary/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:text-primary hover:bg-primary/10'
              title='Save to Project'
            >
              <FolderPlus className='w-4 h-4' />
            </button>
          </div>
        </td>
      </tr>
      <AddToProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoTitle={video.title}
      />
    </>
  );
}
