"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuth, useRefreshUser } from "@/providers/Auth";

/** Shows warnings from the team one at a time until the member acknowledges them. */
export function WarningNotice() {
    const { user } = useAuth();
    const refreshUser = useRefreshUser();
    const [isSaving, setIsSaving] = useState(false);
    const warning = user?.warnings?.[0];
    if (!warning) return null;

    const acknowledge = async () => {
        setIsSaving(true);
        try {
            await apiClient.post(`/auth/warnings/${warning.id}/ack`);
            await refreshUser();
        } finally {
            setIsSaving(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div role="alertdialog" aria-modal="true" aria-labelledby="warning-title" className="w-full max-w-md space-y-5 rounded-[2rem] border border-border bg-card p-8 text-center shadow-2xl">
                <div className="inline-flex rounded-2xl bg-amber-500/10 p-4 text-amber-500">
                    <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h2 id="warning-title" className="text-xl font-bold">A message from the WeGoViral team</h2>
                    <p className="text-sm text-muted-foreground">
                        You received a warning on {new Date(warning.createdAt).toLocaleDateString()}.
                    </p>
                </div>
                <p className="rounded-xl bg-secondary/40 p-4 text-left text-sm">{warning.reason}</p>
                <p className="text-xs text-muted-foreground">
                    Please follow the community guide. Repeated issues can lead to a mute or suspension.
                </p>
                <button
                    onClick={acknowledge}
                    disabled={isSaving}
                    className="w-full rounded-2xl bg-primary py-3 font-bold text-primary-foreground hover:opacity-90 disabled:opacity-70"
                >
                    {isSaving ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "I understand"}
                </button>
            </div>
        </div>,
        document.body,
    );
}
