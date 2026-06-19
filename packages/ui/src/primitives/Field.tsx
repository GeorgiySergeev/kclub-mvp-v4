import { cn } from '../classes';

export function Field({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-sm font-medium text-foreground', className)}
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
    <p className={cn('text-sm text-destructive', className)} {...props}>
      {children}
    </p>
  );
}
