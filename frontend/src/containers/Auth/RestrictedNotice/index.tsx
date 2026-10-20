"use client";

import { Ban, Clock, LogOut } from "lucide-react";
import { useAuth } from "@/providers/Auth";
import { useT } from '@/i18n/provider';
import { activeIntl } from '@/i18n/active';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';

/** Shown instead of the app to suspended or banned members. */
export function RestrictedNotice() {
    const t = useT();
    const { user, logout } = useAuth();
    if (!user) return null;
    const isBanned = user.status === "BANNED";

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-background px-6">
            <LanguageSwitcher className="absolute end-6 top-6" />
            <div className="w-full max-w-md p-8 rounded-[2rem] border border-border bg-card shadow-2xl text-center space-y-5">
                <div className="inline-flex p-4 rounded-2xl bg-red-500/10 text-red-500">
                    {isBanned ? <Ban className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                        {isBanned ? t("auth.restricted.bannedTitle") : t("auth.restricted.suspendedTitle")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isBanned
                            ? t("auth.restricted.bannedBody")
                            : user.statusUntil
                              ? t("auth.restricted.backOn", { date: new Date(user.statusUntil).toLocaleString(activeIntl()) })
                              : t("auth.restricted.backLater")}
                    </p>
                </div>
                {user.statusReason && (
                    <p className="rounded-xl bg-secondary/40 p-3 text-sm">
                        <span className="font-semibold">{t("auth.restricted.reason")}</span> {user.statusReason}
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    {t("auth.restricted.mistake")}
                </p>
                <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                    <LogOut className="w-4 h-4" /> {t("auth.restricted.signOut")}
                </button>
            </div>
        </div>
    );
}
