import { cn } from '../classes';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold';
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
        'inline-flex items-center justify-center rounded-md border font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'border-transparent bg-kclub-navy-900 text-white shadow-sm hover:bg-kclub-navy-800 focus:ring-kclub-gold-500 focus:ring-offset-kclub-canvas dark:bg-kclub-gold-500 dark:text-kclub-navy-950 dark:hover:bg-kclub-gold-300 dark:focus:ring-kclub-gold-300 dark:focus:ring-offset-kclub-navy-950':
            variant === 'primary',
          'border-kclub-gold-500/40 bg-kclub-gold-500 text-kclub-navy-950 shadow-gold hover:bg-kclub-gold-300 focus:ring-kclub-gold-500 focus:ring-offset-kclub-navy-950':
            variant === 'gold',
          'border-border bg-card text-foreground shadow-sm hover:bg-secondary focus:ring-kclub-gold-500 focus:ring-offset-kclub-canvas dark:border-kclub-navy-700 dark:bg-kclub-navy-800 dark:hover:bg-kclub-navy-700 dark:focus:ring-kclub-gold-300 dark:focus:ring-offset-kclub-navy-950':
            variant === 'secondary',
          'border-transparent text-muted-foreground hover:text-foreground focus:ring-kclub-gold-500 focus:ring-offset-kclub-canvas dark:focus:ring-kclub-gold-300 dark:focus:ring-offset-kclub-navy-950':
            variant === 'ghost',
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
