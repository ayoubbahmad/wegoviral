"use client";

import { PostingTimeAnalysis } from "@/types/performance";
import { cn } from "@/lib/utils";

interface PostingTimeHeatmapProps {
    data: PostingTimeAnalysis[];
}

export function PostingTimeHeatmap({ data }: PostingTimeHeatmapProps) {
    const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const getScore = (day: string, hour: number) => {
        return data.find(d => d.dayFormatted === day && d.hour === hour)?.score || 0;
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[500px]">
                <div className="grid grid-cols-[50px_repeat(12,1fr)] gap-1 mb-2">
                    <div className="text-xs text-muted-foreground font-medium"></div>
                    {hours.map(h => (
                        <div key={h} className="text-xs text-center text-muted-foreground">{h}h</div>
                    ))}
                </div>

                {days.map(day => (
                    <div key={day} className="grid grid-cols-[50px_repeat(12,1fr)] gap-1 mb-1 items-center">
                        <div className="text-xs font-medium text-muted-foreground">{day}</div>
                        {hours.map(hour => {
                            const score = getScore(day, hour);
                            return (
                                <div
                                    key={`${day}-${hour}`}
                                    className={cn(
                                        "h-8 rounded-md transition-all hover:scale-110 cursor-pointer relative group",
                                        score === 0 ? "bg-secondary/30" :
                                            score < 4 ? "bg-blue-500/20" :
                                                score < 7 ? "bg-blue-500/40" :
                                                    score < 9 ? "bg-blue-500/70" :
                                                        "bg-blue-500 shadow-md shadow-blue-500/20"
                                    )}
                                    title={`Score: ${score}/10`}
                                >
                                    {score >= 8 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                                            ★
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-secondary/30"></div> Low
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500/40"></div> Med
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500 shadow-sm"></div> Best
                </div>
            </div>
        </div>
    );
}
