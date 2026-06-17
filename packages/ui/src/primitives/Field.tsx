import { cn } from '../classes';

export function Field({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-sm font-medium text-zinc-900 dark:text-zinc-50', className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null;
  return (
    <p className={cn('text-sm text-red-600 dark:text-red-400', className)} {...props}>
      {children}
    </p>
  );
}
