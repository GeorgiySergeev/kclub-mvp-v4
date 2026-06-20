import { cn } from '../classes';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg';

export function Button({
  variant = 'primary',
  size = 'default',
  fullWidth,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}) {
  return (
    <button
      className={cn(
        'focus-visible:ring-focus focus-visible:ring-offset-focus inline-flex items-center justify-center rounded-md border font-normal transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        {
          'bg-primary text-primary-foreground border-transparent shadow-sm hover:opacity-90':
            variant === 'primary',
          'border-border bg-secondary text-secondary-foreground hover:bg-surface-muted shadow-sm':
            variant === 'secondary',
          'text-muted-foreground hover:text-foreground border-transparent': variant === 'ghost',
        },
        {
          'px-6 py-2.5 text-sm': size === 'default',
          'px-4 py-2 text-xs': size === 'sm',
          'px-8 py-3 text-base': size === 'lg',
        },
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  );
}
