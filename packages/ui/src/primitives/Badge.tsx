import { cn } from '../classes';

type BadgeVariant = 'default' | 'outline' | 'success';

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50': variant === 'default',
          'border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400':
            variant === 'outline',
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100':
            variant === 'success',
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
