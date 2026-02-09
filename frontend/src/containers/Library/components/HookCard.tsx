'use client';

import { Hook } from '@/containers/Library/api/types';
import { Edit2, Trash2, Copy, Star, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Card } from '@/components/Card';

interface HookCardProps {
  hook: Hook;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Hook>) => void;
  isActive?: boolean;
  onClick?: () => void;
}

export function HookCard({
  hook,
  onDelete,
  onUpdate,
  isActive,
  onClick,
}: HookCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hook.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this hook?')) {
      setIsDeleting(true);
      await onDelete?.(hook.id);
      setIsDeleting(false);
    }
  };

  return (
    <Card
      hover
      onClick={onClick}
      className={cn(
        'flex flex-col h-full transition-all duration-300 cursor-pointer border-2',
        isActive
          ? 'border-primary shadow-xl shadow-primary/10 -translate-y-1'
          : 'border-transparent',
      )}
    >
      <Card.Header
        title={hook.topic}
        actions={
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1 text-yellow-500 mr-2'>
              {Array.from({ length: hook.performanceRating || 0 }).map(
                (_, i) => (
                  <Star key={i} className='w-3 h-3 fill-current' />
                ),
              )}
            </div>
            <span
              className={cn(
                'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase',
                hook.type === 'Verbal'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : hook.type === 'Visual'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
              )}
            >
              {hook.type}
            </span>
          </div>
        }
      />

      <Card.Content>
        <p className='text-lg font-medium leading-relaxed mb-6 line-clamp-3'>
          "{hook.content}"
        </p>
        <div className='flex items-center gap-2 mb-4'>
          <span className='px-2 py-1 rounded-md text-[10px] font-bold bg-secondary text-secondary-foreground flex items-center gap-1 uppercase tracking-wider'>
            <Tag className='w-3 h-3' />
            {hook.emotion}
          </span>
        </div>
      </Card.Content>

      <Card.Footer
        metadata={
          (hook.usageCount || 0) > 0 ? (
            <Card.MetaItem
              label={`Used ${hook.usageCount} time${hook.usageCount !== 1 ? 's' : ''}`}
            />
          ) : undefined
        }
        actions={
          <div className='flex items-center gap-1'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard();
              }}
              className='p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors'
              title='Copy content'
            >
              <Copy className={cn('w-4 h-4', copied && 'text-green-500')} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className='p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors'
              title='Delete hook'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        }
      />
    </Card>
  );
}
