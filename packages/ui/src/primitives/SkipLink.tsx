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
        'focus:bg-surface focus:text-foreground focus:ring-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2',
        className,
      )}
      {...props}
    >
      {children ?? 'Skip to content'}
    </a>
  );
}
