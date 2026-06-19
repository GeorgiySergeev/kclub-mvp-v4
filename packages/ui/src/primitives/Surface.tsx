import { cn } from '../classes';

export function Surface({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-full max-w-md bg-surface px-8 py-10 shadow-sm ring-1 ring-border sm:rounded-2xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
