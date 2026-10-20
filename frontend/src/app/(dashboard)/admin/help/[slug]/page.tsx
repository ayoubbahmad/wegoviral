'use client';

import { useParams } from 'next/navigation';
import { HelpArticlePage } from '@/containers/Help';

export default function HelpArticleRoute() {
  const params = useParams();
  const slug = params?.slug as string;
  if (!slug) return null;
  return <HelpArticlePage space="admin" slug={slug} />;
}
