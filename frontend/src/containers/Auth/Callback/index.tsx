"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/Auth";

/**
 * Landing page after Google sign-in or an email confirmation link.
 * The Supabase client exchanges the ?code= on load; we wait for the profile.
 */
export function AuthCallbackContainer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading } = useAuth();
    const providerError = searchParams?.get("error_description");

    useEffect(() => {
        if (!isLoading && user) router.replace("/community/feed");
    }, [user, isLoading, router]);

    if (providerError || (!isLoading && !user)) {
        return (
            <div className="max-w-sm text-center space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-destructive/10 text-destructive">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h1 className="text-xl font-bold">We couldn&apos;t sign you in</h1>
                <p className="text-sm text-muted-foreground">
                    {providerError || "This link is invalid or has expired. Please try again."}
                </p>
                <Link href="/login" className="inline-block text-sm font-bold text-primary hover:underline">
                    Back to log in
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Signing you in...</p>
        </div>
    );
}
