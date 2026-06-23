import Link from 'next/link';
import { Home } from 'lucide-react';
import { cn } from '@kclub/ui';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
};

export function Breadcrumbs({ items, homeHref, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500 dark:text-white/40">
        {homeHref && (
          <li className="flex items-center gap-1.5">
            <Link
              href={homeHref}
              aria-label="Home"
              className="transition hover:text-zinc-900 dark:hover:text-white"
            >
              <Home size={13} />
            </Link>
          </li>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="select-none">
                /
              </span>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-zinc-900 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'font-medium text-zinc-900 dark:text-white' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
