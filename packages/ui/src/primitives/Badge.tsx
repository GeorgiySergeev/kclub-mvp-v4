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
          'bg-surface-muted text-foreground': variant === 'default',
          'border border-border text-muted-foreground':
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
