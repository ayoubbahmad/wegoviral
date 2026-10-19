'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { CoursePage } from '@/containers/Community/Courses/CoursePage';

export default function CourseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  if (!id) return null;
  // The open lesson is read from the URL, which needs a Suspense boundary
  return (
    <Suspense>
      <CoursePage courseId={id} />
    </Suspense>
  );
}
