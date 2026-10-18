import { Suspense } from 'react';
import { CommunityEventsContainer } from '@/containers/Community/Events';

export const metadata = {
  title: 'Events',
};

export default function CommunityEventsPage() {
  // The open event is read from the URL, which needs a Suspense boundary
  return (
    <Suspense>
      <CommunityEventsContainer />
    </Suspense>
  );
}
