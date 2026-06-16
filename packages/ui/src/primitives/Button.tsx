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
        'inline-flex items-center justify-center rounded-md border font-normal transition focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'border-transparent bg-zinc-900 text-white shadow-sm hover:bg-zinc-700 focus:ring-zinc-900 focus:ring-offset-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950':
            variant === 'primary',
          'border-zinc-300 bg-white text-zinc-900 shadow-sm hover:bg-zinc-50 focus:ring-zinc-900 focus:ring-offset-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950':
            variant === 'secondary',
          'border-transparent text-zinc-600 hover:text-zinc-950 focus:ring-zinc-900 focus:ring-offset-white dark:text-zinc-400 dark:hover:text-zinc-50 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950':
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
