import { cn } from '@kclub/ui';

type DotPatternProps = {
  className?: string;
  opacity?: number;
};

export function DotPattern({ className, opacity = 0.35 }: DotPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        opacity,
        backgroundImage: 'radial-gradient(circle, rgba(212, 175, 106, 0.35) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  );
}
