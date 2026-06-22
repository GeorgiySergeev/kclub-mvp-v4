'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import type { PublicBusinessListItemDto } from '@kclub/contracts';

import { Locale } from '@/i18n/routing';

import { MarketingBusinessCard } from './MarketingBusinessCard';
import { MarketingCarousel, type MarketingCarouselLabels } from './MarketingCarousel';

export type MarketingBusinessCarouselProps = {
  header: ReactNode;
  locale: Locale;
  businesses: PublicBusinessListItemDto[];
  carouselLabels: MarketingCarouselLabels;
  actionLabel: string;
};

function getFeaturedLabel(
  business: PublicBusinessListItemDto,
  topLabel: string,
  recommendedLabel: string,
): string | null {
  if (business.featuredTop) {
    return topLabel;
  }

  if (business.featuredRecommended) {
    return recommendedLabel;
  }

  return null;
}

function getDiscountLabel(
  business: PublicBusinessListItemDto,
  formatDiscount: (percent: number) => string,
): string | null {
  if (business.memberDiscountPercent === null || business.memberDiscountPercent <= 0) {
    return null;
  }

  return formatDiscount(business.memberDiscountPercent);
}

export function MarketingBusinessCarousel({
  header,
  locale,
  businesses,
  carouselLabels,
  actionLabel,
}: MarketingBusinessCarouselProps) {
  const t = useTranslations('home');

  return (
    <MarketingCarousel header={header} itemCount={businesses.length} labels={carouselLabels}>
      {businesses.map((business) => (
        <MarketingBusinessCard
          key={business.id}
          actionLabel={actionLabel}
          business={business}
          discountLabel={getDiscountLabel(business, (percent) =>
            t('common.discountLabel', { percent }),
          )}
          featuredLabel={getFeaturedLabel(
            business,
            t('featured.topLabel'),
            t('featured.recommendedLabel'),
          )}
          href={`/${locale}/directory/${business.slug}`}
        />
      ))}
    </MarketingCarousel>
  );
}
