import { Suspense } from 'react';
import { AdminHelpArticlesContainer } from '@/containers/Admin/HelpArticles';

export const metadata = { title: 'Help articles' };

export default function AdminHelpArticlesPage() {
  // The space and the article being edited live in the URL
  return (
    <Suspense>
      <AdminHelpArticlesContainer />
    </Suspense>
  );
}
