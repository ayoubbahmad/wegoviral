'use client';

import {
  X,
  Clock,
  ExternalLink,
  Tag as TagIcon,
  Trash2,
  Edit2,
  Anchor,
  Palette,
  Layout,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { cn, formatRelativeDate } from '@/lib/utils';
import { Hook, ScriptTemplate } from '../types';
import { useT } from '@/i18n/provider';

interface DetailsPanelProps {
  item: Hook | ScriptTemplate | null;
  type: 'hooks' | 'scripts' | 'videos';
  onClose: () => void;
  onEdit?: () => void;
}

export function AssetDetailsPanel({
  item,
  type,
  onClose,
  onEdit,
}: DetailsPanelProps) {
  const t = useT();
  if (!item) return null;

  const isHook = type === 'hooks';
  const hook = isHook ? (item as Hook) : null;
  const script = !isHook ? (item as ScriptTemplate) : null;

  return (
    <div className='w-full lg:w-[400px] h-full lg:h-[calc(100vh-12rem)] sticky top-24'>
      <Card className='h-full flex flex-col shadow-2xl border-primary/10 overflow-hidden'>
        {/* Header */}
        <div className='p-6 border-b border-border bg-muted/30 relative'>
          <Button
            variant='ghost'
            size='sm'
            className='absolute end-4 top-4 h-8 w-8 p-0 rounded-full'
            onClick={onClose}
            aria-label={t('creator.library.close')}
          >
            <X className='w-4 h-4' />
          </Button>

          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-xl bg-primary/10 text-primary'>
              {isHook ? (
                <Anchor className='w-5 h-5' />
              ) : (
                <Palette className='w-5 h-5' />
              )}
            </div>
            <div>
              <h2 className='font-black text-xs uppercase tracking-widest text-muted-foreground'>
                {isHook ? t('creator.library.hookDetails') : t('creator.library.scriptTemplate')}
              </h2>
              <p className='text-xs font-medium text-muted-foreground mt-0.5'>
                {isHook ? (hook ? t(`creator.library.hookTypes.${hook.type as 'Verbal'}`) : '') : script ? t(`creator.library.categories.${script.category as 'Sales'}`) : ''}
              </p>
            </div>
          </div>

          <h3 className='text-xl font-bold leading-tight'>
            {isHook ? hook?.topic : script?.title}
          </h3>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6 space-y-8'>
          {/* Main Content Area */}
          <section>
            <h4 className='text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2'>
              <Layout className='w-3 h-3' />
              {t('creator.library.content')}
            </h4>
            {isHook ? (
              <div className='p-4 rounded-xl bg-secondary/50 border border-border italic text-lg font-medium leading-relaxed'>
                “{hook?.content}”
              </div>
            ) : (
              <div className='space-y-4'>
                {script?.content.map((step: any, index: number) => (
                  <div
                    key={index}
                    className='relative ps-6 border-s-2 border-primary/20'
                  >
                    <div className='absolute -start-[5px] top-1 w-2 h-2 rounded-full bg-primary' />
                    <p className='text-xs font-black uppercase tracking-widest text-primary mb-1'>
                      {step.step}
                    </p>
                    <p className='text-sm text-muted-foreground font-medium'>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Metadata Grid */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='p-3 rounded-xl bg-muted/50 border border-border'>
              <div className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1'>
                <Clock className='w-3 h-3' />
                {t('creator.library.added')}
              </div>
              <p className='text-xs font-bold'>
                {formatRelativeDate(isHook ? hook?.addedAt : script?.createdAt)}
              </p>
            </div>
            {isHook && hook?.performanceRating && (
              <div className='p-3 rounded-xl bg-muted/50 border border-border'>
                <div className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1'>
                  <Star className='w-3 h-3' />
                  {t('creator.library.rating')}
                </div>
                <div className='flex items-center gap-1 text-yellow-500'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3',
                        i < (hook?.performanceRating || 0)
                          ? 'fill-current'
                          : 'opacity-20',
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <section>
              <h4 className='text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2'>
                <TagIcon className='w-3 h-3' />
                {t('creator.library.tags')}
              </h4>
              <div className='flex flex-wrap gap-2'>
                {item.tags.map((tag) => (
                  <Badge key={tag} variant='secondary' className='text-[10px]'>
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Source Link */}
          {item.sourceUrl && (
            <section>
              <h4 className='text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3'>
                {t('creator.library.origin')}
              </h4>
              <a
                href={item.sourceUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 transition-colors group'
              >
                <span className='text-sm font-bold truncate max-w-[200px]'>
                  {item.sourceUrl}
                </span>
                <ExternalLink className='w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:-scale-x-100 group-hover:-translate-y-0.5 transition-transform' />
              </a>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className='p-6 border-t border-border bg-muted/30'>
          <div className='flex gap-3'>
            <Button
              className='flex-1'
              leftSection={<Edit2 className='w-4 h-4' />}
              onClick={onEdit}
            >
              {t('creator.library.editAsset')}
            </Button>
            <Button
              variant='outline'
              aria-label={t('creator.library.deleteAsset')}
              className='aspect-square p-0 w-11 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
