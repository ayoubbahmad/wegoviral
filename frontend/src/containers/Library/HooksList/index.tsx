'use client';

import { HookCard } from './components/HookCard';
import { useHooksListController } from './controller';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/Badge';
import { Trash2 } from 'lucide-react';
import { useT } from '@/i18n/provider';

const HOOK_TYPES = { Verbal: 1, Visual: 1, Text: 1, Audio: 1 };

export function HooksList() {
  const t = useT();
  const hookTypeLabel = (type: string) => (type in HOOK_TYPES ? t(`creator.library.hookTypes.${type as 'Verbal'}`) : type);
  const {
    hooks,
    isLoading,
    viewType,
    selectedItemId,
    setSelectedItemId,
    handleDeleteHook,
  } = useHooksListController();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (viewType === 'grid') {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {hooks.map((hook) => (
          <HookCard
            key={hook.id}
            hook={hook}
            isActive={selectedItemId === hook.id}
            onClick={() => setSelectedItemId(hook.id)}
            onDelete={handleDeleteHook}
          />
        ))}
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-border bg-card overflow-hidden'>
      <table className='w-full text-start'>
        <thead>
          <tr className='border-b border-border bg-muted/30'>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              {t('creator.library.columns.hook')}
            </th>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              {t('creator.library.columns.type')}
            </th>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-end'>
              {t('creator.library.columns.actions')}
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border/50'>
          {hooks.map((hook) => (
            <tr
              key={hook.id}
              className={cn(
                'hover:bg-muted/5 transition-colors cursor-pointer group',
                selectedItemId === hook.id &&
                  'bg-primary/5 border-s-2 border-primary',
              )}
              onClick={() => setSelectedItemId(hook.id)}
            >
              <td className='px-6 py-4'>
                <p className='text-sm font-medium line-clamp-1'>
                  “{hook.content}”
                </p>
              </td>
              <td className='px-6 py-4'>
                <Badge variant='secondary' className='text-[10px]'>
                  {hookTypeLabel(hook.type)}
                </Badge>
              </td>
              <td className='px-6 py-4 text-end'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteHook(hook.id);
                  }}
                  aria-label={t('creator.library.deleteHook')}
                  className='p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
