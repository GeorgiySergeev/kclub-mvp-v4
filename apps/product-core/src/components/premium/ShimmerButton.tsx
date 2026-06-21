import Link from 'next/link';

import { cn } from '@kclub/ui';

type ShimmerButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'gold' | 'navy';
};

export function ShimmerButton({
  href,
  children,
  className,
  variant = 'gold',
}: ShimmerButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-6 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-kclub-gold-500 focus:ring-offset-2 focus:ring-offset-kclub-navy-950',
        variant === 'gold'
          ? 'bg-kclub-gold-500 text-kclub-navy-950 shadow-gold hover:bg-kclub-gold-300'
          : 'bg-kclub-navy-900 text-white hover:bg-kclub-navy-800 dark:bg-kclub-gold-500 dark:text-kclub-navy-950 dark:hover:bg-kclub-gold-300',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:group-hover:animate-shimmer motion-safe:group-focus-visible:animate-shimmer"
        style={{ backgroundSize: '200% 100%' }}
      />
      <span className="relative">{children}</span>
    </Link>
  );
}
