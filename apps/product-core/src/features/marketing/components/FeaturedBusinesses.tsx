import { useTranslations } from 'next-intl';

import type { PublicBusinessListItemDto } from '@kclub/contracts';
import { EmptyState } from '@kclub/ui';

import { Locale } from '@/i18n/routing';

import { BusinessCard } from '../../public/components/BusinessCard';
import { getFeaturedBusinessGroups } from '../../public/public-page-helpers';

export function FeaturedBusinesses({
  locale,
  businesses,
}: {
  locale: Locale;
  businesses: PublicBusinessListItemDto[];
}) {
  const t = useTranslations('home');
  const { top, recommended } = getFeaturedBusinessGroups(businesses);
  const items = top.length > 0 ? top : recommended;

  if (items.length === 0) {
    return (
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <EmptyState
            title={t('featured.emptyTitle')}
            description={t('featured.emptyDescription')}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-normal uppercase tracking-widest text-zinc-500">
          {t('featured.eyebrow')}
        </p>
        <h2 className="mt-4 text-4xl font-extralight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          {t('featured.title')}
        </h2>
        <div className="-mx-4 mt-12 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
          {items.map((business) => (
            <div key={business.id} className="min-w-[280px] snap-start sm:min-w-0">
              <BusinessCard
                business={business}
                href={`/${locale}/directory/${business.slug}`}
                actionLabel={t('common.viewProfile')}
                externalLabel={t('common.website')}
                featuredLabel={
                  business.featuredTop ? t('featured.topLabel') : t('featured.recommendedLabel')
                }
                compact
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
