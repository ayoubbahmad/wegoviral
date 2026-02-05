"use client";

import { use } from "react";
import { CompetitorDetail } from "@/containers/competitors/CompetitorDetail";

export default function CompetitorDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);

    return <CompetitorDetail id={params.id} />;
}
