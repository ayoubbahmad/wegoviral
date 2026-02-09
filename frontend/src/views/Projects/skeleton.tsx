import { Skeleton } from "@/components/Skeleton";

export function ProjectsSkeleton() {
  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-12 w-40 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder for NewProjectCard */}
        <div className="aspect-[4/3] rounded-3xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center p-6 space-y-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        {/* Project Card Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/3] rounded-3xl bg-card border border-border/50 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-2xl" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/30">
              <Skeleton className="h-3 w-16" />
              <div className="flex -space-x-2">
                {[1, 2].map(j => (
                  <Skeleton key={j} className="w-6 h-6 rounded-full border-2 border-background" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
