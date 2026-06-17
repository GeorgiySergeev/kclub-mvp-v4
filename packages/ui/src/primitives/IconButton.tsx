import { cn } from '../classes';

export function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950',
        className,
      )}
      {...props}
    />
  );
}
