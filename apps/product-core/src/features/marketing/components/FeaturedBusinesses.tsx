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
      <section className="kclub-border border-b bg-white py-16 dark:bg-[#09090b] sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="kclub-border-strong border bg-[#f4f4f2] p-8 dark:bg-[#18181a]">
            <EmptyState
              title={t('featured.emptyTitle')}
              description={t('featured.emptyDescription')}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="kclub-border border-b bg-[#f4f4f2] py-16 dark:bg-[#111113] sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <p className="border-l-4 border-[#ff0030] pl-4 text-xs font-bold uppercase text-zinc-500 dark:text-white/60">
          {t('featured.eyebrow')}
        </p>
        <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-tight text-zinc-950 dark:text-white sm:text-6xl">
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
