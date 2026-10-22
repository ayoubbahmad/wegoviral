'use client';

import { FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TemplateCard } from './components/TemplateCard';
import { useScriptTemplatesListController } from './controller';
import { useT } from '@/i18n/provider';
import { useLocale } from '@/i18n/provider';

export function ScriptTemplatesList() {
  const t = useT();
  const isRtl = useLocale().locale === 'ar';
  const {
    scripts,
    isLoading,
    viewType,
    selectedItemId,
    setSelectedItemId,
    handleDeleteTemplate,
  } = useScriptTemplatesListController();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, structure: any[]) => {
    const text = structure.map((s) => `${s.step}: ${s.description}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (viewType === 'grid') {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {scripts.map((script) => (
          <TemplateCard
            key={script.id}
            template={script}
            isActive={selectedItemId === script.id}
            onClick={() => setSelectedItemId(script.id)}
            onDelete={() => handleDeleteTemplate(script.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-border bg-card overflow-hidden'>
      <table className='w-full text-start'>
        <thead className='border-b border-border bg-muted/30'>
          <tr>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              {t('creator.library.columns.template')}
            </th>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              {t('creator.library.columns.category')}
            </th>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              {t('creator.library.columns.structure')}
            </th>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-end'>
              {t('creator.library.columns.actions')}
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border/50'>
          {scripts.map((script) => (
            <tr
              key={script.id}
              className={cn(
                'group hover:bg-muted/5 transition-colors cursor-pointer',
                selectedItemId === script.id &&
                  'bg-primary/5 border-s-2 border-primary',
              )}
              onClick={() => setSelectedItemId(script.id)}
            >
              <td className='px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <FileText className='w-4 h-4 text-muted-foreground' />
                  <span className='text-sm font-bold'>{script.title}</span>
                </div>
              </td>
              <td className='px-6 py-4'>
                <span className='text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-bold uppercase tracking-widest'>
                  {t(`creator.library.categories.${script.category as 'Sales'}`)}
                </span>
              </td>
              <td className='px-6 py-4'>
                <p className='text-xs text-muted-foreground line-clamp-1'>
                  {script.content.map((s: any) => s.step).join(isRtl ? ' ← ' : ' → ')}
                </p>
              </td>
              <td className='px-6 py-4 text-end'>
                <div className='flex items-center justify-end gap-2'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(script.id, script.content);
                    }}
                    className={cn(
                      'text-[10px] font-black uppercase tracking-tighter',
                      copiedId === script.id
                        ? 'text-green-500'
                        : 'text-primary transition-opacity',
                    )}
                  >
                    {copiedId === script.id ? t('creator.library.copied') : t('creator.library.use')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(script.id);
                    }}
                    aria-label={t('creator.library.delete')}
                    className='p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
