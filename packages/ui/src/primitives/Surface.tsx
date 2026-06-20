import { cn } from '../classes';

export function Surface({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-surface ring-border w-full max-w-md px-8 py-10 shadow-sm ring-1 sm:rounded-2xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
