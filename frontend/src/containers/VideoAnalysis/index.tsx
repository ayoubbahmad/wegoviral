'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { activeVideosApi } from '@/containers/Videos/api';
import { VideoAnalysisView } from '@/views/VideoAnalysis';
import { PageContainer } from '@/components/PageContainer';
import {
  BarChart2,
  FileText as FileIcon,
  Zap as ActionIcon,
  Anchor,
  Layout,
  Palette,
  AlignLeft,
} from 'lucide-react';

const JUMP_LINKS = [
  { label: 'Actions', id: 'actions', icon: ActionIcon },
  { label: 'Metrics', id: 'metrics', icon: BarChart2 },
  { label: 'Description', id: 'description', icon: AlignLeft },
  { label: 'Transcript', id: 'transcript', icon: FileIcon },
  { label: 'Hook', id: 'hook', icon: Anchor },
  { label: 'Structure', id: 'structure', icon: Layout },
  { label: 'Style', id: 'style', icon: Palette },
];

export function VideoAnalysisContainer({ id }: { id: string }) {
  const [activeSection, setActiveSection] = useState<string>('actions');

  const { data: video, isLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: () => activeVideosApi.getVideoDetails(id),
    enabled: !!id,
  });

  useEffect(() => {
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 140;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
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
    <VideoAnalysisView
      video={video}
      activeSection={activeSection}
      jumpLinks={JUMP_LINKS}
      onScrollTo={scrollToSection}
    />
  );
}
