import { ExternalLink, MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import type { PublicBusinessListItemDto } from '@kclub/contracts';
import { Badge, cn, primaryButtonClasses } from '@kclub/ui';

import { SpotlightCard } from '@/components/premium';
import { getBusinessLocation, getPrimaryBusinessUrl } from '../public-page-helpers';

export function BusinessCard({
  business,
  href,
  actionLabel,
  externalLabel,
  featuredLabel,
  verifiedLabel = 'Verified partner',
  compact = false,
}: {
  business: PublicBusinessListItemDto;
  href: string;
  actionLabel: string;
  externalLabel: string;
  featuredLabel?: string;
  verifiedLabel?: string;
  compact?: boolean;
}) {
  const externalUrl = getPrimaryBusinessUrl(business);

  return (
    <SpotlightCard
      className={cn('flex h-full flex-col p-6 shadow-sm', compact ? 'gap-5' : 'gap-7')}
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="business">{business.categoryName}</Badge>
          {featuredLabel ? <Badge variant="vip">{featuredLabel}</Badge> : null}
          <Badge variant="outline" className="gap-1">
            <ShieldCheck aria-hidden="true" size={12} strokeWidth={1.5} />
            {verifiedLabel}
          </Badge>
        </div>

        <div>
          <h3 className="font-display text-2xl font-medium tracking-tight text-foreground">
            {business.name}
          </h3>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin aria-hidden="true" size={16} strokeWidth={1.5} />
            {getBusinessLocation(business)}
          </p>
        </div>

        {business.briefDescription ? (
          <p className="text-sm leading-6 text-muted-foreground">{business.briefDescription}</p>
        ) : null}

        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
          <Link href={href} className={cn(primaryButtonClasses, 'w-full sm:w-auto')}>
            {actionLabel}
          </Link>
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-muted-foreground transition duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-kclub-gold-500 dark:border-kclub-navy-700 dark:hover:bg-kclub-navy-800"
            >
              <ExternalLink aria-hidden="true" size={16} strokeWidth={1.5} />
              {externalLabel}
            </a>
          ) : null}
        </div>
      </div>
    </SpotlightCard>
  );
}
