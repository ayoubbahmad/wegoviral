'use client';

import { Hook } from '@/containers/Library/api/types';
import { Trash2, Copy, Star, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';

interface HookCardProps {
  hook: Hook;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Hook>) => void;
  isActive?: boolean;
  onClick?: () => void;
}

export function HookCard({ hook, onDelete, isActive, onClick }: HookCardProps) {
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
        'flex flex-col h-full transition-all duration-300 cursor-pointer',
        isActive
          ? 'border-primary shadow-xl shadow-primary/10 -translate-y-1'
          : '',
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
            <Badge
              variant={
                hook.type === 'Verbal'
                  ? 'info'
                  : hook.type === 'Visual'
                    ? 'warning'
                    : 'secondary'
              }
              className={cn(
                hook.type === 'Visual' &&
                  'bg-purple-500/10 text-purple-500 border-purple-500/20',
              )}
            >
              {hook.type}
            </Badge>
          </div>
        }
      />

      <Card.Content>
        <p className='text-lg font-medium leading-relaxed mb-6 line-clamp-3'>
          "{hook.content}"
        </p>
        <div className='flex items-center gap-2 mb-4'>
          <Badge variant='secondary' icon={Tag}>
            {hook.emotion}
          </Badge>
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
