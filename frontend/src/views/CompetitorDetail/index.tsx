'use client';

import { CompetitorDetail } from '@/containers/Competitors/CompetitorDetail';

interface CompetitorDetailPageProps {
  id: string;
}

export default function CompetitorDetailPage({
  id,
}: CompetitorDetailPageProps) {
  return <CompetitorDetail id={id} />;
}
