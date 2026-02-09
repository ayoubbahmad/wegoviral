import {
  X,
  Anchor,
  Palette,
  Video,
  Eye,
  Clock,
  Hash,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { cn, formatRelativeDate } from '@/lib/utils';
import { Hook, ScriptTemplate } from '../api/types';

interface DetailsPanelProps {
  item: Hook | ScriptTemplate | null;
  onClose: () => void;
  type: 'hooks' | 'scripts' | 'videos';
}

export const DetailsPanel = ({ item, onClose, type }: DetailsPanelProps) => {
  if (!item) return null;

  const isHook = type === 'hooks';
  const hook = item as Hook;
  const template = item as ScriptTemplate;

  return (
    <Card className='h-full flex flex-col bg-card border-l border-border/50 rounded-none md:rounded-l-3xl shadow-2xl'>
      <div className='p-6 flex items-center justify-between border-b border-border/50'>
        <h2 className='text-lg font-bold truncate pr-4'>
          {isHook ? 'Hook Details' : 'Template Details'}
        </h2>
        <Button
          variant='ghost'
          size='sm'
          onClick={onClose}
          className='rounded-full p-2 h-auto'
        >
          <X className='w-5 h-5' />
        </Button>
      </div>

      <div className='flex-1 overflow-y-auto p-6 space-y-8'>
        {/* Header Info */}
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary'>
              {isHook ? (
                <Anchor className='w-6 h-6' />
              ) : (
                <Palette className='w-6 h-6' />
              )}
            </div>
            <div>
              <h3 className='font-bold text-xl leading-tight'>
                {isHook ? hook.topic : template.title}
              </h3>
              <p className='text-sm text-muted-foreground'>
                {isHook ? hook.type : template.category}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            <Badge variant='secondary' icon={Eye}>
              {isHook ? hook.views || 0 : template.views || 0} views
            </Badge>
            <Badge variant='secondary' icon={Clock}>
              {formatRelativeDate(isHook ? hook.addedAt : template.createdAt)}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className='space-y-4'>
          <h4 className='text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60'>
            Content
          </h4>
          <div className='p-4 rounded-2xl bg-muted/30 border border-border/50 text-sm leading-relaxed whitespace-pre-wrap font-medium'>
            {isHook
              ? `"${hook.content}"`
              : template.excerpt || 'No preview available'}
          </div>
        </div>

        {/* Metadata section (Tags etc) */}
        <div className='space-y-4'>
          <h4 className='text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60'>
            Tags
          </h4>
          <div className='flex flex-wrap gap-2'>
            {(isHook ? hook.tags : template.tags)?.map((tag, i) => (
              <Badge key={i} variant='secondary' className='bg-background'>
                {tag}
              </Badge>
            )) || (
              <p className='text-xs text-muted-foreground italic'>
                No tags added
              </p>
            )}
          </div>
        </div>

        {/* Source Section */}
        {(isHook ? hook.sourceMetadata : template.sourceMetadata) && (
          <div className='space-y-4'>
            <h4 className='text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60'>
              Source
            </h4>
            <div className='p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4 items-center'>
              <div className='w-12 h-16 bg-muted rounded-lg overflow-hidden shrink-0 border border-border/50'>
                {/* Source Thumbnail could go here */}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-bold truncate'>
                  {(isHook
                    ? hook.sourceMetadata?.title
                    : template.sourceMetadata?.title) || 'Source video'}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {(isHook
                    ? hook.sourceMetadata?.handle
                    : template.sourceMetadata?.handle) || '@creator'}
                </p>
              </div>
              <ExternalLink className='w-4 h-4 text-muted-foreground' />
            </div>
          </div>
        )}
      </div>

      <div className='p-6 border-t border-border/50 flex gap-3'>
        <Button variant='primary' className='flex-1'>
          Use This
        </Button>
        <Button variant='outline' className='flex-1'>
          Edit
        </Button>
      </div>
    </Card>
  );
};
