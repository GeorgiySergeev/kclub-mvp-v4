import { cn } from '../classes';

export function SkipLink({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href="#content"
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-lg focus:ring-2 focus:ring-zinc-900 dark:focus:bg-zinc-950 dark:focus:text-zinc-50 dark:focus:ring-zinc-50',
        className,
      )}
      {...props}
    >
      {children ?? 'Skip to content'}
    </a>
  );
}
