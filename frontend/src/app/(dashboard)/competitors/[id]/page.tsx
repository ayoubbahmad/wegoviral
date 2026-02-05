"use client";

import { use } from "react";
import CompetitorDetailPage from "@/views/CompetitorDetail";

export default function CompetitorDetailRoute(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);

    return <CompetitorDetailPage id={params.id} />;
}
