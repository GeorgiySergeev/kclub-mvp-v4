import { cn } from '../classes';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'text-foreground ring-border placeholder:text-muted focus:ring-focus bg-surface dark:bg-surface-muted block w-full rounded-md border-0 px-3 py-2.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
        className,
      )}
      {...props}
    />
  );
}
