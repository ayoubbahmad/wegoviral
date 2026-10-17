import { Suspense } from 'react';
import { AdminMembersContainer } from '@/containers/Admin/Members';

export const metadata = { title: 'Members' };

export default function AdminMembersPage() {
  // Filters are read from the URL, which needs a Suspense boundary
  return (
    <Suspense>
      <AdminMembersContainer />
    </Suspense>
  );
}
