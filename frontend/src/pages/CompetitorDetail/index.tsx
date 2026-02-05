"use client";

import { CompetitorDetail } from "@/containers/competitors/CompetitorDetail";

interface CompetitorDetailPageProps {
  id: string;
}

export default function CompetitorDetailPage({ id }: CompetitorDetailPageProps) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CompetitorDetail id={id} />
    </div>
  );
}
