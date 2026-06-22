import { getTranslations } from 'next-intl/server';

import type { PublicBusinessListItemDto } from '@kclub/contracts';
import { EmptyState } from '@kclub/ui';

import { getFeaturedBusinessGroups } from '@/features/public/public-page-helpers';
import { Locale } from '@/i18n/routing';

import { MarketingBusinessCarousel } from './MarketingBusinessCarousel';

type FeaturedBusinessesProps = {
  locale: Locale;
  businesses: PublicBusinessListItemDto[];
};

export async function FeaturedBusinesses({ locale, businesses }: FeaturedBusinessesProps) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const { top, recommended } = getFeaturedBusinessGroups(businesses);
  const items = top.length > 0 ? top : recommended;

  if (items.length === 0) {
    return (
      <section className="kclub-border border-b bg-white py-16 dark:bg-background sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="kclub-border-strong border bg-surface-muted p-8 dark:bg-surface">
            <EmptyState
              description={t('featured.emptyDescription')}
              title={t('featured.emptyTitle')}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="kclub-border border-b bg-surface-muted py-16 dark:bg-surface-muted sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <MarketingBusinessCarousel
          actionLabel={t('common.viewProfile')}
          businesses={items}
          carouselLabels={{
            navigation: t('carousel.navigationLabel'),
            previous: t('carousel.previousLabel'),
            next: t('carousel.nextLabel'),
          }}
          header={
            <div className="max-w-2xl">
              <p className="border-l-4 border-accent pl-4 text-xs font-bold uppercase text-zinc-500 dark:text-white/60">
                {t('featured.eyebrow')}
              </p>
              <h2 className="mt-5 text-4xl font-black uppercase leading-tight text-zinc-950 dark:text-white sm:text-6xl">
                {t('featured.title')}
              </h2>
            </div>
          }
          locale={locale}
        />
      </div>
    </section>
  );
}
