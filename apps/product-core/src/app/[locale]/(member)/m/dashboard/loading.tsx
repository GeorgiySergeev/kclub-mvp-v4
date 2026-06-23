import { Skeleton } from '@kclub/ui';

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[calc(100vh-5.5rem)] flex-col bg-background lg:-mx-10 lg:w-[calc(100%+5rem)] lg:flex-row">
      <div className="flex gap-2 overflow-x-auto border-b border-border bg-surface p-3 lg:hidden">
        {['w-[72px]', 'w-24', 'w-[88px]', 'w-[72px]', 'w-20'].map((widthClass, index) => (
          <Skeleton key={`mobile-tab-${index}`} className={`h-10 shrink-0 ${widthClass}`} />
        ))}
      </div>

      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <Skeleton className="mx-6 mt-5 h-10" />
        <Skeleton className="mx-6 mt-8 h-12" />
        <div className="mt-6 space-y-2 px-0">
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} className="mx-6 h-10" />
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-6 sm:px-12">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="hidden h-4 w-32 sm:block" />
        </div>
        <div className="space-y-6 px-6 py-10 sm:px-12">
          <Skeleton className="h-24 w-full max-w-3xl" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
