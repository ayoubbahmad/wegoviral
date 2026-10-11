'use client';

import { CompetitorDetail } from '@/containers/competitors/CompetitorDetail';

interface CompetitorDetailPageProps {
  id: string;
}

export default function CompetitorDetailPage({
  id,
}: CompetitorDetailPageProps) {
  return <CompetitorDetail id={id} />;
}
