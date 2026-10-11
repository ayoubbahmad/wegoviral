'use client';

import { useParams } from 'next/navigation';
import { VideoAnalysisContainer } from '@/containers/VideoAnalysis';

export default function VideoAnalysisPage() {
  const params = useParams();
  const id = params.id as string;

  return <VideoAnalysisContainer id={id} />;
}
