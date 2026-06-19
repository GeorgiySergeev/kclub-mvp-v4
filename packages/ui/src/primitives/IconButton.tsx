import { cn } from '../classes';

export function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center bg-surface text-foreground transition focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-focus',
        className,
      )}
      {...props}
    />
  );
}
