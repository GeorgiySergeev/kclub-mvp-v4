import { cn } from '../classes';

type BadgeVariant = 'default' | 'outline' | 'success' | 'member' | 'vip' | 'business';

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
          'bg-secondary text-secondary-foreground': variant === 'default',
          'border border-border text-muted-foreground': variant === 'outline',
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100':
            variant === 'success',
          'border border-kclub-navy-600/30 bg-kclub-navy-800/50 text-slate-300':
            variant === 'member',
          'border border-kclub-gold-500/40 bg-kclub-gold-500/15 text-kclub-gold-300':
            variant === 'vip',
          'border border-kclub-navy-600 bg-kclub-navy-800 text-kclub-canvas':
            variant === 'business',
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
