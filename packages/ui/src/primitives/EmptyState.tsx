import { cn } from '../classes';
import { textMuted } from '../tokens';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center px-4 py-16 text-center', className)}
    >
      {icon && <div className="text-muted mb-4">{icon}</div>}
      <h3 className="text-foreground text-lg font-medium">{title}</h3>
      {description && <p className={cn('mt-2 max-w-sm', textMuted)}>{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
