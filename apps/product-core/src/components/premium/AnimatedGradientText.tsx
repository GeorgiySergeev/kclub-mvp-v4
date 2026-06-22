import { cn } from '@kclub/ui';

type AnimatedGradientTextProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'inline-block bg-gradient-to-r from-kclub-gold-100 via-kclub-gold-500 to-kclub-gold-300 bg-[length:200%_auto] bg-clip-text text-transparent motion-safe:animate-gradient-shift',
        className,
      )}
    >
      {children}
    </span>
  );
}
