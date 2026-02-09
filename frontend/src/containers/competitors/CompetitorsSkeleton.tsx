import { Skeleton } from "@/components/Skeleton";
import { Search } from "lucide-react";

export function CompetitorsSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <Skeleton className="h-10 w-40 rounded-lg" />
            </div>

            <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl shadow-sm max-w-md">
                <Search className="w-4 h-4 text-muted-foreground/50" />
                <Skeleton className="h-4 w-32" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
                            {[1, 2, 3].map(j => (
                                <div key={j} className="text-center space-y-1">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-2/3 mx-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
