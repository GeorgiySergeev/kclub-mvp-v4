import { cn } from '../classes';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'block w-full rounded-md border-0 px-3 py-2.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-50',
        className,
      )}
      {...props}
    />
  );
}
