"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { DashboardLayout } from "@/containers/layout/DashboardLayout";
import { Loader2 } from "lucide-react";

export default function ProtectedDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Initializing Creator OS...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    return <DashboardLayout>{children}</DashboardLayout>;
}
