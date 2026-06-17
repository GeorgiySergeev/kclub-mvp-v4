import { cn } from '../classes';

export function Surface({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-full max-w-md bg-white px-8 py-10 shadow-sm ring-1 ring-zinc-200 sm:rounded-2xl dark:bg-zinc-950 dark:ring-zinc-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
