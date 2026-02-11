'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { activeVideosApi } from '@/containers/Videos/api';
import {
  BarChart2,
  FileText as FileIcon,
  Zap as ActionIcon,
  Anchor,
  Layout,
  Palette,
  AlignLeft,
} from 'lucide-react';

export const JUMP_LINKS = [
  { label: 'Actions', id: 'actions', icon: ActionIcon },
  { label: 'Metrics', id: 'metrics', icon: BarChart2 },
  { label: 'Description', id: 'description', icon: AlignLeft },
  { label: 'Transcript', id: 'transcript', icon: FileIcon },
  { label: 'Hook', id: 'hook', icon: Anchor },
  { label: 'Structure', id: 'structure', icon: Layout },
  { label: 'Style', id: 'style', icon: Palette },
];

export function useVideoAnalysisController(id: string) {
  const router = useRouter();
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

  const handleBack = () => {
    // If we have history, go back, otherwise fallback to videos
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/videos');
    }
  };

  return {
    video,
    isLoading,
    activeSection,
    scrollToSection,
    handleBack,
    jumpLinks: JUMP_LINKS,
  };
}
