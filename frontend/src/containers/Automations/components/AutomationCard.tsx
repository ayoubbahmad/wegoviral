'use client';

import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  Zap,
  Edit2,
  Trash2,
  Globe,
  Clapperboard,
  MessageSquare,
  Settings2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutomationCardProps {
  automation: {
    id: string;
    name: string;
    triggerKeyword: string;
    responseMessage: string;
    commentReplyEnabled: boolean;
    commentReplyMessage?: string | null;
    isGlobal: boolean;
    active: boolean;
    platform?: string | null;
    runCount?: number;
    instagramPostId?: string | null;
  };
  onEdit: (automation: {
    id: string;
    name: string;
    triggerKeyword: string;
    responseMessage: string;
    commentReplyEnabled: boolean;
    commentReplyMessage?: string | null;
    isGlobal: boolean;
    active: boolean;
    platform?: string | null;
    runCount?: number;
    instagramPostId?: string | null;
  }) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
}

export function AutomationCard({
  automation,
  onEdit,
  onDelete,
  onToggle,
}: AutomationCardProps) {
  return (
    <Card hover className='flex flex-col overflow-hidden'>
      <Card.Header
        icon={Zap}
        title={automation.name}
        actions={
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onToggle(automation.id, automation.active)}
              className='transition-colors'
            >
              {automation.active ? (
                <ToggleRight className='w-7 h-7 text-primary' />
              ) : (
                <ToggleLeft className='w-7 h-7 text-muted-foreground/30' />
              )}
            </button>
            <div className='flex flex-col items-end'>
              <span
                className={cn(
                  'text-[8px] uppercase font-black tracking-widest px-1 py-0.5 rounded',
                  automation.active
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-zinc-500/10 text-zinc-500',
                )}
              >
                {automation.active ? 'Active' : 'Paused'}
              </span>
              <div className='flex items-center gap-1 mt-0.5 bg-muted/50 px-1 py-0.5 rounded text-muted-foreground uppercase text-[7px] font-black tracking-tighter'>
                {automation.isGlobal ? (
                  <Globe className='w-2 h-2' />
                ) : (
                  <Clapperboard className='w-2 h-2 text-primary' />
                )}
                <span>{automation.isGlobal ? 'Global' : 'Post'}</span>
              </div>
            </div>
          </div>
        }
      />

      <Card.Content className='space-y-2'>
        {/* Trigger Info */}
        <div className='flex items-center gap-2.5 p-2 rounded-xl bg-muted/30 border border-border/50'>
          <MessageSquare className='w-3.5 h-3.5 text-primary flex-shrink-0' />
          <div className='min-w-0'>
            <p className='text-[9px] font-bold uppercase text-muted-foreground/60 leading-none'>
              Trigger
            </p>
            <p className='text-xs font-mono font-bold text-foreground mt-0.5 truncate'>
              &quot;{automation.triggerKeyword}&quot;
            </p>
          </div>
        </div>

        {/* Action Info */}
        <div className='flex items-start gap-2.5 p-2 rounded-xl bg-muted/30 border border-border/50'>
          <Settings2 className='w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0' />
          <div className='space-y-1 content-center'>
            <p className='text-[9px] font-bold uppercase text-muted-foreground/60 leading-none'>
              Action Flow
            </p>
            <div className='flex flex-col gap-1.5 mt-1 min-w-0'>
              <div className='flex items-center gap-2 min-w-0'>
                <div className='px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-black uppercase flex-shrink-0'>
                  DM
                </div>
                <p className='text-[10px] text-foreground truncate italic opacity-80 min-w-0'>
                  {automation.responseMessage || 'No message set...'}
                </p>
              </div>
              {automation.commentReplyEnabled && (
                <div className='flex items-center gap-2 min-w-0'>
                  <div className='px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[8px] font-black uppercase flex-shrink-0'>
                    Reply
                  </div>
                  <p className='text-[10px] text-foreground truncate italic opacity-80 min-w-0'>
                    {automation.commentReplyMessage || 'No message set...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card.Content>

      <Card.Footer
        className='pt-2 border-t border-border/5'
        metadata={
          <div className='flex flex-col gap-0.5'>
            <Card.MetaItem
              label={`Platform: ${automation.platform || 'Instagram'}`}
              className='text-[9px]'
            />
            <Card.MetaItem
              label={`Runs: ${automation.runCount || 0}`}
              className='text-[9px]'
            />
          </div>
        }
        actions={
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg h-7 w-7 p-0'
              onClick={() => onEdit(automation)}
            >
              <Edit2 className='w-3.5 h-3.5' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg h-7 w-7 p-0'
              onClick={() => onDelete(automation.id)}
            >
              <Trash2 className='w-3.5 h-3.5' />
            </Button>
          </div>
        }
      />
    </Card>
  );
}
