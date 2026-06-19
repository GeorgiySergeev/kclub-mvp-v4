import { cn } from '../classes';
import { textMuted } from '../tokens';

export function PageState({
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
      className={cn(
        'flex min-h-[50vh] flex-col items-center justify-center px-4 text-center',
        className,
      )}
    >
      {icon && <div className="mb-6 text-muted">{icon}</div>}
      <h1 className="text-3xl font-light tracking-tight text-foreground">
        {title}
      </h1>
      {description && <p className={cn('mt-3 max-w-md', textMuted)}>{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
