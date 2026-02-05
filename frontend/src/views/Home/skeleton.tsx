import { Skeleton } from "@/components/ui/Skeleton";

export function HomeSkeleton() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Overview Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {/* Videos Section Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="space-y-3 pt-1">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-xl" />
            ))}
          </div>
        </div>

        {/* Scripts Section Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="space-y-3 pt-1">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-10 rounded-md" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex gap-3">
                  <Skeleton className="h-2 w-16" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="space-y-3 pt-1">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Challenges Section Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-3 pt-1">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 space-y-3">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(j => (
                      <Skeleton key={j} className="w-5 h-5 rounded-full border-2 border-background" />
                    ))}
                  </div>
                  <Skeleton className="h-2 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
