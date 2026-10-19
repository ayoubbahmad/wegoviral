'use client';

import { useParams } from 'next/navigation';
import { ChallengePage } from '@/containers/Community/Challenges/ChallengePage';

export default function ChallengeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  if (!id) return null;
  return <ChallengePage challengeId={id} />;
}
