"use client";

import { use } from "react";
import CompetitorDetailPage from "@/pages/CompetitorDetail";

export default function CompetitorDetailRoute(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);

    return <CompetitorDetailPage id={params.id} />;
}
