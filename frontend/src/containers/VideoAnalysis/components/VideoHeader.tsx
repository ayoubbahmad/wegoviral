import { cn } from '@/lib/utils';

export interface VideoHeaderProps {
  title: string;
  channelName: string;
  channelAvatar: string;
  isYoutube: boolean;
  publishedAt: string;
}

export function VideoHeader({
  title,
  channelName,
  channelAvatar,
  isYoutube,
  publishedAt,
}: VideoHeaderProps) {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-black leading-tight tracking-tight text-foreground max-w-4xl'>
        {title}
      </h1>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 group cursor-pointer hover:border-primary/50 transition-colors'>
          <img
            src={channelAvatar}
            alt='Channel'
            className='w-5 h-5 rounded-full border border-border/50'
          />
          <span className='text-sm font-bold text-foreground truncate'>
            {channelName}
          </span>
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full animate-pulse',
              isYoutube ? 'bg-red-500' : 'bg-pink-500',
            )}
          />
        </div>
        <span className='text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]'>
          {publishedAt}
        </span>
      </div>
    </div>
  );
}
