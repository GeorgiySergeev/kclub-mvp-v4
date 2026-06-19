import { cn } from '../classes';

export function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center bg-white text-zinc-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-800 dark:text-zinc-50',
        className,
      )}
      {...props}
    />
  );
}
