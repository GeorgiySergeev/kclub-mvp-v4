import { cn } from '../classes';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'block w-full rounded-md border-0 px-3 py-2.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-focus sm:text-sm sm:leading-6 bg-surface dark:bg-surface-muted',
        className,
      )}
      {...props}
    />
  );
}
