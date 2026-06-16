import { CalendarDays, ExternalLink, MapPin, UserRound } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Badge, Container, primaryButtonClasses } from '@kclub/ui';

import { getBusinessLocation, getPrimaryBusinessUrl } from '@/features/public/public-page-helpers';
import { Locale } from '@/i18n/routing';
import { AppError } from '@/server/errors';
import { getPublicBusinessBySlug } from '@/server/services/business-service';

type Params = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateMetadata({ params }: Params) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'publicSeo.businessDetail' });
  const business = await getPublishedBusinessOrNull(slug);

  if (!business) {
    return {
      title: t('notFoundTitle'),
      description: t('notFoundDescription'),
    };
  }

  return {
    title: t('title', { name: business.name }),
    description: business.briefDescription ?? t('description', { name: business.name }),
  };
}

export default async function BusinessDetailPage({ params }: Params) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'directory.detail' });
  const business = await getPublishedBusinessOrNull(slug);

  if (!business) {
    notFound();
  }

  const externalUrl = getPrimaryBusinessUrl(business);

  return (
    <article className="border-b border-zinc-200 dark:border-zinc-800">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{business.categoryName}</Badge>
              {business.featuredTop ? <Badge variant="success">{t('featuredTop')}</Badge> : null}
              {business.featuredRecommended ? (
                <Badge variant="success">{t('recommended')}</Badge>
              ) : null}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-extralight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-7xl">
              {business.name}
            </h1>

            {business.briefDescription ? (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                {business.briefDescription}
              </p>
            ) : null}

            {business.description ? (
              <div className="mt-12 max-w-3xl border-t border-zinc-200 pt-8 text-base leading-8 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                {business.description}
              </div>
            ) : null}
          </div>

          <aside className="h-fit border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-light tracking-tight text-zinc-950 dark:text-zinc-50">
              {t('profileTitle')}
            </h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div className="flex gap-3">
                <MapPin aria-hidden="true" size={18} strokeWidth={1.5} className="mt-0.5" />
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">{t('location')}</dt>
                  <dd className="mt-1 text-zinc-950 dark:text-zinc-50">
                    {getBusinessLocation(business)}
                  </dd>
                </div>
              </div>
              {business.representativeName ? (
                <div className="flex gap-3">
                  <UserRound aria-hidden="true" size={18} strokeWidth={1.5} className="mt-0.5" />
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">{t('representative')}</dt>
                    <dd className="mt-1 text-zinc-950 dark:text-zinc-50">
                      {business.representativeName}
                    </dd>
                  </div>
                </div>
              ) : null}
              {business.publishedAt ? (
                <div className="flex gap-3">
                  <CalendarDays aria-hidden="true" size={18} strokeWidth={1.5} className="mt-0.5" />
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">{t('published')}</dt>
                    <dd className="mt-1 text-zinc-950 dark:text-zinc-50">
                      {new Intl.DateTimeFormat(locale).format(new Date(business.publishedAt))}
                    </dd>
                  </div>
                </div>
              ) : null}
            </dl>

            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className={`${primaryButtonClasses} mt-8 w-full gap-2`}
              >
                <ExternalLink aria-hidden="true" size={16} strokeWidth={1.5} />
                {t('website')}
              </a>
            ) : null}
          </aside>
        </div>
      </Container>
    </article>
  );
}

async function getPublishedBusinessOrNull(slug: string) {
  try {
    return await getPublicBusinessBySlug(slug);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
