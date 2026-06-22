import { ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';

import type { PublicBusinessListItemDto } from '@kclub/contracts';
import { Badge } from '@kclub/ui';

import { getBusinessLocation } from '@/features/public/public-page-helpers';

export type MarketingBusinessCardProps = {
  business: PublicBusinessListItemDto;
  href: string;
  actionLabel: string;
  featuredLabel: string | null;
  discountLabel: string | null;
};

export function MarketingBusinessCard({
  business,
  href,
  actionLabel,
  featuredLabel,
  discountLabel,
}: MarketingBusinessCardProps) {
  return (
    <article
      className="kclub-border-strong flex h-[18rem] w-[20rem] shrink-0 snap-start flex-col overflow-hidden border bg-white dark:bg-surface sm:h-[18rem] sm:w-[18rem]"
      data-marketing-carousel-item
    >
      <div className="flex h-full min-h-0 flex-col gap-4 p-5 sm:p-6">
        <div className="flex max-h-14 flex-wrap items-center gap-2 overflow-hidden">
          <Badge className="max-w-full truncate" variant="outline">
            {business.categoryName}
          </Badge>
          {featuredLabel ? (
            <Badge className="shrink-0" variant="success">
              {featuredLabel}
            </Badge>
          ) : null}
          {discountLabel ? (
            <Badge className="border-accent/30 bg-accent/10 shrink-0 text-accent" variant="outline">
              {discountLabel}
            </Badge>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <p className="mb-2 flex min-w-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-muted-foreground">
            <MapPin aria-hidden className="shrink-0" size={11} />
            <span className="truncate">{getBusinessLocation(business)}</span>
          </p>
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-zinc-950 dark:text-white">
            {business.name}
          </h3>
          <p className="mt-2 line-clamp-5 min-h-0 flex-1 text-sm leading-6 text-zinc-600 dark:text-muted-foreground">
            {business.briefDescription}
          </p>
        </div>

        <div className="kclub-border shrink-0 border-t pt-4">
          <Link
            className="group inline-flex max-w-full items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent transition hover:text-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-focus"
            href={href}
          >
            <span className="truncate">{actionLabel}</span>
            <ArrowUpRight
              aria-hidden
              className="size-3.5 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
