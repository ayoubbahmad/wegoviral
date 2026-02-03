"use client";

import { useAuth } from "@/lib/auth-context";
import { Zap } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-lg text-center space-y-6">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4">
                    <Zap className="w-10 h-10 text-primary" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-muted-foreground mt-2">Sign in to access your Creator OS dashboard.</p>
                </div>

                <button
                    onClick={login}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-all shadow-sm hover:shadow active:scale-[0.98]"
                >
                    Sign In with Mock Account
                </button>

                <p className="text-xs text-muted-foreground">
                    This is a simulated authentication environment.
                </p>
            </div>
        </div>
    );
}
