'use client';

import {
  Folder,
  MoreHorizontal,
  FileText,
  Clock,
  Play,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export function CardShowcase() {
  return (
    <div className='space-y-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        <div className='space-y-6'>
          <p className='text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]'>
            Project Folder Card (Glass Variant)
          </p>
          <Card
            variant='glass'
            hover
            className='group flex flex-col justify-between h-[200px]'
          >
            <div className='flex items-start justify-between'>
              <div className='p-4 rounded-3xl bg-primary/10 text-primary group-hover:scale-110 transition-transform'>
                <Folder className='w-8 h-8 fill-primary/10' />
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-10 w-10 p-0 rounded-xl'
              >
                <MoreHorizontal className='w-5 h-5' />
              </Button>
            </div>
            <div className='space-y-1'>
              <h3 className='text-xl font-black tracking-tight text-foreground uppercase italic leading-none'>
                Creative Assets
              </h3>
              <div className='flex items-center gap-4 text-xs font-bold text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                  <FileText className='w-3.5 h-3.5' /> 24 items
                </span>
                <span className='flex items-center gap-1.5'>
                  <Clock className='w-3.5 h-3.5' /> 2h ago
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className='space-y-6'>
          <p className='text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]'>
            Glass Video Thumbnail (Custom Wrapper)
          </p>
          <div className='relative aspect-video rounded-2xl overflow-hidden border border-border/50 group cursor-pointer shadow-xl'>
            <img
              src='https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=400'
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
              alt='Visual Example'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent flex items-end p-6'>
              <div className='flex items-center justify-between w-full'>
                <div className='space-y-1'>
                  <h4 className='text-white font-bold text-sm line-clamp-1'>
                    How to scale 10x faster with AI
                  </h4>
                  <p className='text-white/60 text-[10px] font-black uppercase tracking-widest'>
                    @strategy.pro
                  </p>
                </div>
                <div className='p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all'>
                  <Play className='w-4 h-4 fill-white' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <p className='text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]'>
          Stat & Info Cards
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card variant='secondary' className='space-y-3'>
            <div className='flex items-center justify-between'>
              <TrendingUp className='w-5 h-5 text-green-500' />
              <span className='text-[10px] font-black px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase'>
                +12%
              </span>
            </div>
            <div>
              <p className='text-2xl font-black text-foreground tabular-nums'>
                1.2M
              </p>
              <p className='text-xs font-bold text-muted-foreground uppercase tracking-widest'>
                Total Reach
              </p>
            </div>
          </Card>

          <Card
            variant='dashed'
            className='flex flex-col items-center justify-center gap-3 text-muted-foreground h-[150px]'
            hover
          >
            <div className='p-3 rounded-xl bg-secondary/50'>
              <Plus className='w-5 h-5' />
            </div>
            <p className='text-xs font-black uppercase tracking-widest'>
              Add New Section
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
