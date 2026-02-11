'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { activeVideosApi } from '@/containers/Videos/api';
import { VideoPlayer } from '@/containers/VideoAnalysis/VideoPlayer';
import { VideoMetrics } from '@/containers/VideoAnalysis/VideoMetrics';
import { AnalysisModals } from '@/containers/VideoAnalysis/AnalysisModals';
import {
  HookAnalysis,
  StructureAnalysis,
  StyleAnalysis,
} from '@/containers/VideoAnalysis/AnalysisDetails';
import {
  FileText,
  AlignLeft,
  Zap,
  BarChart2,
  FileText as FileIcon,
  Zap as ActionIcon,
  Anchor,
  Layout,
  Palette,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';

// Jump links configuration
const JUMP_LINKS = [
  { label: 'Actions', id: 'actions', icon: ActionIcon },
  { label: 'Metrics', id: 'metrics', icon: BarChart2 },
  { label: 'Description', id: 'description', icon: AlignLeft },
  { label: 'Transcript', id: 'transcript', icon: FileIcon },
  { label: 'Hook', id: 'hook', icon: Anchor },
  { label: 'Structure', id: 'structure', icon: Layout },
  { label: 'Style', id: 'style', icon: Palette },
];

export default function VideoAnalysisPage() {
  const params = useParams();
  const id = params.id as string;
  const [activeSection, setActiveSection] = useState<string>('actions');

  const { data: video, isLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: () => activeVideosApi.getVideoDetails(id),
    enabled: !!id,
  });

  useEffect(() => {
    // Track which section is visible while scrolling
    const handleScroll = () => {
      const sections = JUMP_LINKS.map((link) =>
        document.getElementById(link.id),
      ).filter(Boolean);

      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 140;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  if (isLoading) {
    return (
      <PageContainer className='pt-8 flex items-center justify-center min-h-[50vh]'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin' />
          <p className='text-muted-foreground font-medium animate-pulse'>
            Analyzing video content...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!video) return null;

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <PageContainer className='pt-4'>
        {/* Header Content Area */}
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-black leading-tight tracking-tight text-foreground max-w-4xl'>
            {video.captionExcerpt}
          </h1>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 group cursor-pointer hover:border-primary/50 transition-colors'>
              <img
                src={video.competitor.avatarUrl}
                alt='Channel'
                className='w-5 h-5 rounded-full border border-border/50'
              />
              <span className='text-sm font-bold text-foreground truncate'>
                {video.competitor.name}
              </span>
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full animate-pulse',
                  video.competitor.handle.includes('youtube')
                    ? 'bg-red-500'
                    : 'bg-pink-500',
                )}
              />
            </div>
            <span className='text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]'>
              {new Date(video.postedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className='grid lg:grid-cols-[380px_1fr] gap-12 items-start'>
          {/* Left Column: Video Sticky Preview */}
          <div className='sticky top-8 space-y-6'>
            <VideoPlayer
              thumbnailUrl={video.thumbnailUrl}
              videoUrl={video.metrics.url}
            />
          </div>

          {/* Right Column: Deep Analysis Content */}
          <div className='space-y-12 min-w-0'>
            {/* Jump Navigation */}
            <div className='sticky top-8 z-20 flex justify-center'>
              <div className='flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/80 backdrop-blur-md border border-border/50'>
                <div
                  className='flex items-center gap-2 overflow-x-auto hide-scrollbar'
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {JUMP_LINKS.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 active:scale-95',
                        activeSection === link.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                      )}
                    >
                      <link.icon className='w-3.5 h-3.5' />
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <section id='actions'>
              <AnalysisModals videoTitle={video.captionExcerpt} />
            </section>

            {/* Metrics Section */}
            <section
              id='metrics'
              className='p-8 rounded-3xl border border-border bg-card/30 space-y-6'
            >
              <div className='flex items-center gap-2 text-blue-500'>
                <BarChart2 className='w-5 h-5' />
                <h3 className='font-bold text-xl tracking-tight uppercase'>
                  Performance Metrics
                </h3>
              </div>
              <VideoMetrics metrics={video.metrics} />
            </section>

            {/* Description Section */}
            <section
              id='description'
              className='p-8 rounded-3xl border border-border bg-card/30 relative overflow-hidden group'
            >
              <div className='flex items-center gap-2 mb-6 text-blue-500'>
                <AlignLeft className='w-5 h-5' />
                <h3 className='font-bold text-xl tracking-tight uppercase'>
                  Description
                </h3>
              </div>
              <p className='text-sm leading-[1.8] text-muted-foreground font-medium whitespace-pre-wrap'>
                {video.captionExcerpt}
              </p>
              <button className='mt-6 flex items-center gap-2 p-2 px-4 rounded-xl bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary transition-all'>
                Show full description
                <ArrowUpRight className='w-3 h-3' />
              </button>
            </section>

            {/* Transcript Section */}
            <section
              id='transcript'
              className='p-8 rounded-3xl border border-border bg-card/30 space-y-6'
            >
              <div className='flex items-center justify-between border-b border-border/50 pb-6'>
                <div className='flex items-center gap-2 text-purple-500'>
                  <FileIcon className='w-5 h-5' />
                  <h3 className='font-bold text-xl tracking-tight uppercase'>
                    Transcript
                  </h3>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-[10px] font-black text-muted-foreground uppercase bg-secondary/50 px-3 py-1 rounded-full'>
                    Extracting...
                  </span>
                </div>
              </div>
              <div className='p-12 rounded-2xl bg-secondary/10 border border-dashed border-border flex flex-col items-center gap-4 text-center'>
                <ActionIcon className='w-8 h-8 text-primary animate-pulse' />
                <div>
                  <h4 className='font-bold text-foreground mb-1'>
                    Transcript processing
                  </h4>
                  <p className='text-xs text-muted-foreground max-w-[280px]'>
                    We're currently extracting the transcript for this video.
                    This usually takes a few seconds.
                  </p>
                </div>
              </div>
            </section>

            {/* Deep Analysis Details */}
            <section id='hook'>
              <HookAnalysis analysis={video.analysis?.hook} />
            </section>

            <section id='structure'>
              <StructureAnalysis analysis={video.analysis?.structure} />
            </section>

            <section id='style'>
              <StyleAnalysis analysis={video.analysis?.style} />
            </section>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
