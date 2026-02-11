import { VideoPlayer } from '@/containers/VideoAnalysis/VideoPlayer';
import { VideoMetrics } from '@/containers/VideoAnalysis/VideoMetrics';
import { AnalysisModals } from '@/containers/VideoAnalysis/AnalysisModals';
import {
  HookAnalysis,
  StructureAnalysis,
  StyleAnalysis,
} from '@/containers/VideoAnalysis/AnalysisDetails';
import { JumpNav } from '@/containers/VideoAnalysis/components/JumpNav';
import {
  DescriptionSection,
  TranscriptSection,
} from '@/containers/VideoAnalysis/components/ContentSections';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeader } from '@/components/SectionHeader';
import {
  BarChart2,
  LucideIcon,
  AlignLeft,
  FileText,
  Anchor,
  Layout,
  Palette,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoAnalysisViewProps {
  video: any;
  activeSection: string;
  jumpLinks: { label: string; id: string; icon: LucideIcon }[];
  onScrollTo: (id: string) => void;
  onBack: () => void;
}

export function VideoAnalysisView({
  video,
  activeSection,
  jumpLinks,
  onScrollTo,
  onBack,
}: VideoAnalysisViewProps) {
  const isYoutube = video.competitor.handle.includes('youtube');
  const publishedDate = new Date(video.postedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <PageContainer className='pt-4'>
        <PageHeader
          title={video.captionExcerpt}
          onClickBack={onBack}
          backLabel='Back to Content'
          description={
            <div className='flex items-center gap-2 mt-2'>
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
                    isYoutube ? 'bg-red-500' : 'bg-pink-500',
                  )}
                />
              </div>
              <span className='text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]'>
                {publishedDate}
              </span>
            </div>
          }
        />

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
            <JumpNav
              links={jumpLinks}
              activeSection={activeSection}
              onScrollTo={onScrollTo}
            />

            {/* Actions Section */}
            <section id='actions' className='space-y-6'>
              <SectionHeader title='Quick Actions' icon={Sparkles} />
              <AnalysisModals videoTitle={video.captionExcerpt} />
            </section>

            {/* Metrics Section */}
            <section
              id='metrics'
              className='p-8 rounded-3xl border border-border bg-card/30 space-y-6'
            >
              <SectionHeader title='Performance Metrics' icon={BarChart2} />
              <VideoMetrics metrics={video.metrics} />
            </section>

            <section
              id='description'
              className='p-8 rounded-3xl border border-border bg-card/30 space-y-6'
            >
              <SectionHeader title='Description' icon={AlignLeft} />
              <DescriptionSection description={video.captionExcerpt} />
            </section>

            <section
              id='transcript'
              className='p-8 rounded-3xl border border-border bg-card/30 space-y-6'
            >
              <SectionHeader title='Transcript' icon={FileText} />
              <TranscriptSection />
            </section>

            {/* Deep Analysis Details */}
            <section id='hook' className='space-y-6'>
              <SectionHeader title='Hook Analysis' icon={Anchor} />
              <HookAnalysis analysis={video.analysis?.hook} />
            </section>

            <section id='structure' className='space-y-6'>
              <SectionHeader title='Structure Analysis' icon={Layout} />
              <StructureAnalysis analysis={video.analysis?.structure} />
            </section>

            <section id='style' className='space-y-6'>
              <SectionHeader title='Style Analysis' icon={Palette} />
              <StyleAnalysis analysis={video.analysis?.style} />
            </section>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
