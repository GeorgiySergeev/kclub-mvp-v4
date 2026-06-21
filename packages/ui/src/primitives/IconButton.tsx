import { cn } from '../classes';

export function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'bg-surface text-foreground focus-visible:ring-focus focus-visible:ring-offset-focus inline-flex h-11 w-11 items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  );
}
