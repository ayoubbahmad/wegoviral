import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { activeIntl } from "@/i18n/active";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRelativeDate(date: string | Date | undefined): string {
    if (!date) return "";
    const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000);
    const format = new Intl.RelativeTimeFormat(activeIntl(), { numeric: "auto", style: "short" });
    const abs = Math.abs(seconds);
    if (abs < 45) return format.format(0, "second");
    if (abs < 3600) return format.format(Math.round(seconds / 60), "minute");
    if (abs < 86400) return format.format(Math.round(seconds / 3600), "hour");
    if (abs < 7 * 86400) return format.format(Math.round(seconds / 86400), "day");
    if (abs < 30 * 86400) return format.format(Math.round(seconds / (7 * 86400)), "week");
    return new Date(date).toLocaleDateString(activeIntl(), { day: "numeric", month: "short", year: abs > 300 * 86400 ? "numeric" : undefined });
}

/** Avatar URL with a generated fallback for users without a photo. */
export function avatarFor(user: { username: string; avatarUrl?: string | null }) {
    return user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.username)}`;
}
