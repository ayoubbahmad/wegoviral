'use client';

import {
  Plus,
  Search,
  MoreVertical,
  Sparkles,
  Calendar,
  Layers,
  Clock,
  ChevronRight,
  FileText,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { SearchInput } from '@/components/SearchInput';
import { SectionHeader } from '@/components/SectionHeader';
import { EmptyState } from '@/components/EmptyState';
import { cn, formatRelativeDate } from '@/lib/utils';
import { ViewToggle } from '@/components/ViewToggle';
import { ScriptCard } from '../components/ScriptCard';
import { useScriptsController } from './controller';
import { useT } from '@/i18n/provider';

export const ScriptsLibraryContainer = () => {
  const t = useT();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const { scripts, isLoading, handleDeleteScript } = useScriptsController();

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title={t('creator.scripts.title')}
          description={t('creator.scripts.description')}
        />
        <div className='flex items-center justify-center p-32'>
          <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={t('creator.scripts.title')}
        description={t('creator.scripts.description')}
        actions={
          <Link href='/creator/scripts/new'>
            <Button variant='primary' size='md'>
              <Plus className='w-4 h-4' />
              {t('creator.scripts.newScript')}
            </Button>
          </Link>
        }
      />

      <div className='space-y-6'>
        <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
          <SearchInput placeholder={t('creator.scripts.search')} />
          <div className='flex items-center gap-3'>
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            <Link
              href='/creator/scripts/ingredients'
              className='text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-secondary/50'
            >
              <Calendar className='w-3.5 h-3.5' />
              {t('creator.scripts.ingredients')}
            </Link>
            <button className='text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-secondary/50'>
              <Sparkles className='w-3.5 h-3.5' />
              {t('creator.scripts.aiGenerate')}
            </button>
          </div>
        </div>

        {scripts.length > 0 ? (
          viewMode === 'grid' ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {scripts.map((script) => (
                <ScriptCard
                  key={script.id}
                  script={script as any}
                  variant='full'
                  onDelete={() => handleDeleteScript(script.id)}
                  onClick={() => router.push(`/creator/scripts/${script.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className='bg-card rounded-2xl border border-border/50 overflow-hidden'>
              <table className='w-full text-start border-collapse'>
                <thead>
                  <tr className='border-b border-border/50 bg-secondary/30'>
                    <th className='p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                      {t('creator.scripts.columns.title')}
                    </th>
                    <th className='p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center'>
                      {t('creator.scripts.columns.status')}
                    </th>
                    <th className='p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                      {t('creator.scripts.columns.words')}
                    </th>
                    <th className='p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
                      {t('creator.scripts.columns.updated')}
                    </th>
                    <th className='p-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'></th>
                  </tr>
                </thead>
                <tbody>
                  {scripts.map((script) => (
                    <tr
                      key={script.id}
                      className='border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors group cursor-pointer'
                      onClick={() => router.push(`/creator/scripts/${script.id}`)}
                    >
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='p-2 rounded-lg bg-purple-500/10 text-purple-500'>
                            <FileText className='w-4 h-4' />
                          </div>
                          <span className='font-bold text-sm tracking-tight'>
                            {script.title}
                          </span>
                        </div>
                      </td>
                      <td className='p-4 text-center'>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            script.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-purple-500/10 text-purple-500'
                          }`}
                        >
                          {t(`creator.scripts.statuses.${script.status as 'Draft'}`)}
                        </span>
                      </td>
                      <td className='p-4'>
                        <div className='flex items-center gap-1.5 text-xs font-semibold text-muted-foreground tabular-nums'>
                          <Layers className='w-3.5 h-3.5' />
                          {script.wordCount}
                        </div>
                      </td>
                      <td className='p-4'>
                        <div className='flex items-center gap-1.5 text-xs font-semibold text-muted-foreground'>
                          <Clock className='w-3.5 h-3.5' />
                          {formatRelativeDate(script.lastUpdated)}
                        </div>
                      </td>
                      <td className='p-4 text-end'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/10'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScript(script.id);
                            }}
                            aria-label={t('creator.scripts.delete')}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0 rounded-lg'
                            aria-label={t('creator.scripts.open')}
                          >
                            <ChevronRight className='w-4 h-4 rtl:rotate-180' />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <EmptyState
            title={t('creator.scripts.emptyTitle')}
            description={t('creator.scripts.emptyBody')}
            icon={FileText}
            actionText={t('creator.scripts.create')}
            onAction={() => router.push('/creator/scripts/new')}
          />
        )}
      </div>
    </PageContainer>
  );
};
