'use client';

import { ScriptTemplate } from '@/containers/Library/api/types';
import { FileText, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/Card';

import { TemplateCard } from './TemplateCard';

interface ScriptTemplateListProps {
  scripts: ScriptTemplate[];
  viewType?: 'grid' | 'table';
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<ScriptTemplate>) => void;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function ScriptTemplateList({
  scripts,
  viewType = 'table',
  onDelete,
  onUpdate,
  selectedId,
  onSelect,
}: ScriptTemplateListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleCopy = (id: string, structure: any[]) => {
    const text = structure.map((s) => `${s.step}: ${s.description}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    if (confirm('Are you sure you want to delete this script template?')) {
      setIsDeleting(id);
      await onDelete?.(id);
      setIsDeleting(null);
    }
  };

  if (viewType === 'grid') {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {scripts.map((script) => (
          <TemplateCard
            key={script.id}
            template={script}
            isActive={selectedId === script.id}
            onClick={() => onSelect?.(script.id)}
            onDelete={() =>
              handleDelete({ stopPropagation: () => {} } as any, script.id)
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-border bg-card overflow-hidden'>
      <table className='w-full text-left'>
        <thead className='border-b border-border bg-muted/30'>
          <tr>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              Template
            </th>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              Category
            </th>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              Structure
            </th>
            <th className='px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border/50'>
          {scripts.map((script) => (
            <tr
              key={script.id}
              className={cn(
                'group hover:bg-muted/5 transition-colors cursor-pointer',
                selectedId === script.id &&
                  'bg-primary/5 border-l-2 border-primary',
              )}
              onClick={() => onSelect?.(script.id)}
            >
              <td className='px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <FileText className='w-4 h-4 text-muted-foreground' />
                  <span className='text-sm font-bold'>{script.title}</span>
                </div>
              </td>
              <td className='px-6 py-4'>
                <span className='text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-bold uppercase tracking-widest'>
                  {script.category}
                </span>
              </td>
              <td className='px-6 py-4'>
                <p className='text-xs text-muted-foreground line-clamp-1'>
                  {script.content.map((s: any) => s.step).join(' → ')}
                </p>
              </td>
              <td className='px-6 py-4 text-right'>
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
                    {copiedId === script.id ? 'Copied' : 'Use'}
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, script.id)}
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
