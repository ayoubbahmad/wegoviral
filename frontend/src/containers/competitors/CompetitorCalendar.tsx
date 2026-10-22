"use client";

import { CompetitorPost } from "@/types/competitor";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useT } from "@/i18n/provider";
import { activeIntl } from "@/i18n/active";

interface CompetitorCalendarProps {
    posts: CompetitorPost[];
}

export function CompetitorCalendar({ posts }: CompetitorCalendarProps) {
    const t = useT();
    const [currentDate, setCurrentDate] = useState(new Date("2023-10-01")); // Fixed date for mock data context

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun

    // Adjust for Mon start
    const startingBlankDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startingBlankDays }, (_, i) => i);

    const getPostsForDay = (day: number) => {
        return posts.filter(p => {
            const date = new Date(p.postedAt);
            return date.getDate() === day &&
                date.getMonth() === currentDate.getMonth() &&
                date.getFullYear() === currentDate.getFullYear();
        });
    };

    // Monday first; 1 January 2024 was a Monday
    const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(activeIntl(), { weekday: "short" }));

    return (
        <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">{t("creator.competitors.postingFrequency")}</h3>
                <div className="flex items-center gap-2">
                    <button aria-label={t("creator.competitors.previousMonth")} className="p-1 hover:bg-secondary rounded-md" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                    </button>
                    <span className="text-sm font-medium w-32 text-center">
                        {currentDate.toLocaleDateString(activeIntl(), { month: "long", year: "numeric" })}
                    </span>
                    <button aria-label={t("creator.competitors.nextMonth")} className="p-1 hover:bg-secondary rounded-md" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {weekdays.map(d => (
                    <div key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {blanks.map((b) => (
                    <div key={`blank-${b}`} className="aspect-square"></div>
                ))}
                {days.map((day) => {
                    const dayPosts = getPostsForDay(day);
                    const hasViral = dayPosts.some(p => p.isViral);

                    return (
                        <div
                            key={day}
                            className={cn(
                                "aspect-square rounded-lg flex items-center justify-center text-xs relative group transition-colors",
                                dayPosts.length > 0
                                    ? hasViral ? "bg-red-500/20 text-red-600 font-bold border border-red-500/30" : "bg-primary/10 text-primary font-medium"
                                    : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                            )}
                        >
                            {day}
                            {dayPosts.length > 0 && (
                                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-current"></div>
                            )}

                            {/* Tooltip */}
                            {dayPosts.length > 0 && (
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-popover text-popover-foreground text-[10px] rounded-lg shadow-xl border border-border z-10">
                                    <p className="font-bold mb-1">{t("creator.competitors.postsOnDay", { count: dayPosts.length })}</p>
                                    {dayPosts.map(p => (
                                        <div key={p.id} className="truncate text-muted-foreground">• {p.captionExcerpt}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 mt-4 text-xs text-muted-foreground justify-end">
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/10"></span> {t("creator.competitors.legendPost")}
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500/20"></span> {t("creator.competitors.legendViral")}
                </div>
            </div>
        </div>
    );
}
