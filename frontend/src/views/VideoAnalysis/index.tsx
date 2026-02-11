import { VideoPlayer } from '@/containers/VideoAnalysis/VideoPlayer';
import { VideoMetrics } from '@/containers/VideoAnalysis/VideoMetrics';
import { AnalysisModals } from '@/containers/VideoAnalysis/AnalysisModals';
import {
  HookAnalysis,
  StructureAnalysis,
  StyleAnalysis,
} from '@/containers/VideoAnalysis/AnalysisDetails';
import { VideoHeader } from '@/containers/VideoAnalysis/components/VideoHeader';
import { JumpNav } from '@/containers/VideoAnalysis/components/JumpNav';
import {
  DescriptionSection,
  TranscriptSection,
} from '@/containers/VideoAnalysis/components/ContentSections';
import { PageContainer } from '@/components/PageContainer';
import { BarChart2, LucideIcon } from 'lucide-react';

interface VideoAnalysisViewProps {
  video: any;
  activeSection: string;
  jumpLinks: { label: string; id: string; icon: LucideIcon }[];
  onScrollTo: (id: string) => void;
}

export function VideoAnalysisView({
  video,
  activeSection,
  jumpLinks,
  onScrollTo,
}: VideoAnalysisViewProps) {
  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <PageContainer className='pt-4'>
        <VideoHeader
          title={video.captionExcerpt}
          channelName={video.competitor.name}
          channelAvatar={video.competitor.avatarUrl}
          isYoutube={video.competitor.handle.includes('youtube')}
          publishedAt={new Date(video.postedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
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

            <DescriptionSection description={video.captionExcerpt} />
            <TranscriptSection />

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
