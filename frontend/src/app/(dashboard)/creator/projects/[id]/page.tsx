'use client';

import { useParams } from 'next/navigation';
import { ProjectDetailsContainer } from '@/containers/ProjectDetails';

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) return null;

  return <ProjectDetailsContainer id={id} />;
}
