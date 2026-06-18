import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Container, EmptyState, primaryButtonClasses } from '@kclub/ui';

import { BusinessCard } from '@/features/public/components/BusinessCard';
import { getFeaturedBusinessGroups } from '@/features/public/public-page-helpers';
import { Locale } from '@/i18n/routing';
import { getPublicBusinesses } from '@/server/services/business-service';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'publicSeo.directory' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function DirectoryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'directory' });
  const businesses = await getPublicBusinesses();
  const { top, recommended } = getFeaturedBusinessGroups(businesses);

  return (
    <div className="border-b border-border dark:border-kclub-navy-700">
      <section className="border-b border-border py-16 dark:border-kclub-navy-700 sm:py-24">
        <Container>
          <p className="kclub-overline text-muted-foreground">{t('eyebrow')}</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <h1 className="max-w-4xl font-display text-5xl font-medium tracking-tight text-foreground sm:text-7xl">
                {t('title')}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
                {t('description')}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 dark:border-kclub-navy-700 dark:bg-kclub-navy-900">
              <p className="text-sm text-muted-foreground">{t('publishedOnly')}</p>
              <p className="mt-3 font-display text-4xl font-medium text-foreground">
                {businesses.length}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        {businesses.length === 0 ? (
          <EmptyState
            icon={<Building2 aria-hidden="true" size={44} strokeWidth={1.5} />}
            title={t('emptyTitle')}
            description={t('emptyDescription')}
            action={
              <Link href={`/${locale}/sign-up`} className={primaryButtonClasses}>
                {t('emptyAction')}
              </Link>
            }
          />
        ) : (
          <div className="space-y-14">
            {top.length > 0 ? (
              <DirectorySection
                title={t('featuredTopTitle')}
                businesses={top}
                locale={locale}
                actionLabel={t('viewDetails')}
                externalLabel={t('website')}
                featuredLabel={t('featuredTopLabel')}
                verifiedLabel={t('verifiedPartner')}
              />
            ) : null}

            {recommended.length > 0 ? (
              <DirectorySection
                title={t('recommendedTitle')}
                businesses={recommended}
                locale={locale}
                actionLabel={t('viewDetails')}
                externalLabel={t('website')}
                featuredLabel={t('recommendedLabel')}
                verifiedLabel={t('verifiedPartner')}
              />
            ) : null}

            <DirectorySection
              title={t('allTitle')}
              businesses={businesses}
              locale={locale}
              actionLabel={t('viewDetails')}
              externalLabel={t('website')}
              verifiedLabel={t('verifiedPartner')}
            />
          </div>
        )}
      </Container>
    </div>
  );
}

function DirectorySection({
  title,
  businesses,
  locale,
  actionLabel,
  externalLabel,
  featuredLabel,
  verifiedLabel,
}: {
  title: string;
  businesses: Awaited<ReturnType<typeof getPublicBusinesses>>;
  locale: Locale;
  actionLabel: string;
  externalLabel: string;
  featuredLabel?: string;
  verifiedLabel: string;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            href={`/${locale}/directory/${business.slug}`}
            actionLabel={actionLabel}
            externalLabel={externalLabel}
            featuredLabel={featuredLabel}
            verifiedLabel={verifiedLabel}
          />
        ))}
      </div>
    </section>
  );
}
