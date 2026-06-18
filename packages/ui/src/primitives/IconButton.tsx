import { cn } from '../classes';

export function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-kclub-gold-500 focus:ring-offset-2 focus:ring-offset-background dark:border-kclub-navy-700 dark:bg-kclub-navy-900 dark:hover:bg-kclub-navy-800',
        className,
      )}
      {...props}
    />
  );
}
