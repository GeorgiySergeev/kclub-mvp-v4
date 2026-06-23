import { Skeleton } from '@kclub/ui';

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-2" />
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-64 sm:w-80" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="border-b border-zinc-200 dark:border-white/10">
        <div className="flex gap-1 pb-0">
          {[80, 64, 96, 72, 56].map((w, i) => (
            <Skeleton key={i} className="mb-0 h-10 rounded-none" style={{ width: w }} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-20 rounded-none" />
          <Skeleton className="h-20 rounded-none" />
          <Skeleton className="h-20 rounded-none" />
          <Skeleton className="h-20 rounded-none" />
        </div>
      </div>
    </div>
  );
}
