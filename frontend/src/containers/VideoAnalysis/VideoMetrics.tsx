import { TrendingUp, Eye, Zap, MessageSquare, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  showInfo?: boolean;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  showInfo,
}: MetricCardProps) {
  return (
    <div className='flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 transition-all hover:border-primary/50 hover:bg-secondary/50'>
      <div className='flex items-center gap-2 text-foreground'>
        <Icon className='w-4 h-4 text-primary' />
        <span className='font-semibold text-sm'>{value}</span>
        <span className='text-sm text-muted-foreground font-medium'>
          {label}
        </span>
      </div>
      {showInfo && (
        <div className='w-3.5 h-3.5 rounded-full border border-border/50 text-muted-foreground flex items-center justify-center text-[8px] font-bold'>
          i
        </div>
      )}
    </div>
  );
}

export function VideoMetrics({ metrics }: { metrics: any }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
      <MetricCard
        label='outlier score'
        value={metrics?.outlierScore || '1.0x'}
        icon={TrendingUp}
        showInfo
      />
      <MetricCard label='views' value={metrics?.views || '0'} icon={Eye} />
      <MetricCard
        label='engagement rate'
        value={metrics?.engagementRate || '0%'}
        icon={Zap}
        showInfo
      />
      <MetricCard
        label='likes'
        value={metrics?.likes || '0'}
        icon={TrendingUp}
      />
      <MetricCard
        label='comments'
        value={metrics?.comments || '0'}
        icon={MessageSquare}
      />
      <MetricCard
        label='platform'
        value={metrics?.url?.includes('youtube') ? 'YouTube' : 'Instagram'}
        icon={Zap}
      />
    </div>
  );
}
