"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/Auth";
import { DashboardLayout } from "@/containers/layout/DashboardLayout";
import { Loader2 } from "lucide-react";
import { RestrictedNotice } from "@/containers/Auth/RestrictedNotice";
import { ApplicationForm } from "@/containers/Onboarding/ApplicationForm";
import { JoinStatusScreen } from "@/containers/Onboarding/JoinStatusScreen";
import { T } from '@/i18n/T';

export default function ProtectedDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

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
                    <p className="text-sm font-medium text-muted-foreground"><T k="common.loading" /></p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    if (user.status === "SUSPENDED" || user.status === "BANNED") {
        return <RestrictedNotice />;
    }

    // Joining journey: apply → wait for approval (the guide is readable meanwhile)
    const step = user.onboarding.step;
    if (step === "APPLICATION") return <ApplicationForm />;
    if (step === "PENDING" || step === "REJECTED") {
        if (step === "PENDING" && pathname === "/community/guide") {
            return <div className="min-h-screen bg-background p-8">{children}</div>;
        }
        return <JoinStatusScreen />;
    }

    return <DashboardLayout>{children}</DashboardLayout>;
}
