"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AuthContainer } from "@/containers/Auth";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            }>
                <AuthContainer />
            </Suspense>
        </div>
    );
}
