import { cn } from '@kclub/ui';

export type DigitalClubCardSkeletonProps = {
  className?: string;
};

export function DigitalClubCardSkeleton({ className }: DigitalClubCardSkeletonProps) {
  return (
    <div
      className={cn(
        'relative mx-auto flex aspect-[1.586/1] w-full max-w-md flex-col overflow-hidden rounded-[1.25rem] bg-zinc-200/80 p-6',
        className,
      )}
    >
      <div className="h-5 w-16 animate-pulse rounded bg-zinc-300" />
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-56 animate-pulse rounded bg-zinc-300" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-40 animate-pulse rounded bg-zinc-300" />
        <div className="flex gap-8">
          <div className="h-10 w-16 animate-pulse rounded bg-zinc-300" />
          <div className="h-10 w-16 animate-pulse rounded bg-zinc-300" />
        </div>
      </div>
    </div>
  );
}
