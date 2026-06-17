import { ExternalLink, MapPin } from 'lucide-react';
import Link from 'next/link';

import type { PublicBusinessListItemDto } from '@kclub/contracts';
import { Badge, cn, primaryButtonClasses } from '@kclub/ui';

import { getBusinessLocation, getPrimaryBusinessUrl } from '../public-page-helpers';

export function BusinessCard({
  business,
  href,
  actionLabel,
  externalLabel,
  featuredLabel,
  compact = false,
}: {
  business: PublicBusinessListItemDto;
  href: string;
  actionLabel: string;
  externalLabel: string;
  featuredLabel?: string;
  compact?: boolean;
}) {
  const externalUrl = getPrimaryBusinessUrl(business);

  return (
    <article
      className={cn(
        'flex h-full flex-col border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950',
        compact ? 'gap-5' : 'gap-7',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{business.categoryName}</Badge>
        {featuredLabel ? <Badge variant="success">{featuredLabel}</Badge> : null}
      </div>

      <div>
        <h3 className="text-2xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
          {business.name}
        </h3>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <MapPin aria-hidden="true" size={16} strokeWidth={1.5} />
          {getBusinessLocation(business)}
        </p>
      </div>

      {business.briefDescription ? (
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {business.briefDescription}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <Link href={href} className={cn(primaryButtonClasses, 'w-full sm:w-auto')}>
          {actionLabel}
        </Link>
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:focus:ring-zinc-50"
          >
            <ExternalLink aria-hidden="true" size={16} strokeWidth={1.5} />
            {externalLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}
