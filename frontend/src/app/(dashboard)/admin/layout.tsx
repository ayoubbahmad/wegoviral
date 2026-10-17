"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCan } from "@/providers/Auth";

/** Members without admin access are sent back to the community (the API refuses them anyway). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const can = useCan();
    const router = useRouter();
    const allowed = can("admin.access");

    useEffect(() => {
        if (!allowed) router.replace("/community/feed");
    }, [allowed, router]);

    return allowed ? <>{children}</> : null;
}
