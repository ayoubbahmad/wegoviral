'use client';

import { VideoAnalysisView } from '@/views/VideoAnalysis';
import { PageContainer } from '@/components/PageContainer';
import { useVideoAnalysisController } from './controller';

export function VideoAnalysisContainer({ id }: { id: string }) {
  const {
    video,
    isLoading,
    activeSection,
    scrollToSection,
    handleBack,
    jumpLinks,
  } = useVideoAnalysisController(id);

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
    <VideoAnalysisView
      video={video}
      activeSection={activeSection}
      jumpLinks={jumpLinks}
      onScrollTo={scrollToSection}
      onBack={handleBack}
    />
  );
}
