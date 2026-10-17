"use client";

import { Ban, Clock, LogOut } from "lucide-react";
import { useAuth } from "@/providers/Auth";

/** Shown instead of the app to suspended or banned members. */
export function RestrictedNotice() {
    const { user, logout } = useAuth();
    if (!user) return null;
    const isBanned = user.status === "BANNED";

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <div className="w-full max-w-md p-8 rounded-[2rem] border border-border bg-card shadow-2xl text-center space-y-5">
                <div className="inline-flex p-4 rounded-2xl bg-red-500/10 text-red-500">
                    {isBanned ? <Ban className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                        {isBanned ? "Your account has been banned" : "Your account is suspended"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isBanned
                            ? "You can no longer access the WeGoViral community."
                            : user.statusUntil
                              ? `You can come back on ${new Date(user.statusUntil).toLocaleString()}.`
                              : "You can come back once the team lifts the suspension."}
                    </p>
                </div>
                {user.statusReason && (
                    <p className="rounded-xl bg-secondary/40 p-3 text-sm">
                        <span className="font-semibold">Reason:</span> {user.statusReason}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    Think this is a mistake? Reach out to the WeGoViral team.
                </p>
                <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Sign out
                </button>
            </div>
        </div>
    );
}
