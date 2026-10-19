'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { CourseBuilder } from '@/containers/Community/Courses/Builder';

export default function CourseEditPage() {
  const params = useParams();
  const id = params?.id as string;
  if (!id) return null;
  return (
    <Suspense>
      <CourseBuilder courseId={id} />
    </Suspense>
  );
}
