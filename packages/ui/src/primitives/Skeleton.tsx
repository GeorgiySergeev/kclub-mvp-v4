import { cn } from '../classes';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('bg-border animate-pulse rounded-md', className)} {...props} />;
}
