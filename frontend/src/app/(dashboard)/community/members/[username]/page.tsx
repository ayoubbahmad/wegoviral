'use client';

import { useParams } from 'next/navigation';
import { MemberProfileContainer } from '@/containers/Community/MemberProfile';

export default function MemberProfilePage() {
  const { username } = useParams<{ username: string }>();
  return <MemberProfileContainer username={decodeURIComponent(username)} />;
}
