import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale } from '@/i18n/routing';

type FeaturedBusiness = {
  name: string;
  category: string;
  country: string;
};

export function FeaturedBusinesses({ locale }: { locale: Locale }) {
  const t = useTranslations('home');
  const items = (t.raw('featured.items') as FeaturedBusiness[]).slice(0, 3);

  if (items.length === 0) {
    return null;
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
          {items.map((item) => (
            <article
              key={item.name}
              className="min-w-[280px] snap-start border border-zinc-200 p-6 dark:border-zinc-800 sm:min-w-0"
            >
              <span className="inline-flex border border-zinc-200 px-2 py-1 text-xs font-normal uppercase tracking-widest text-zinc-500 dark:border-zinc-800">
                {item.category}
              </span>
              <h3 className="mt-8 text-xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
                {item.name}
              </h3>
              <p className="mt-3 text-sm text-zinc-500">{item.country}</p>
              <Link
                href={`/${locale}/directory`}
                className="mt-8 inline-flex text-sm text-zinc-900 underline underline-offset-4 transition hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:text-zinc-50 dark:hover:text-zinc-300 dark:focus:ring-zinc-50"
              >
                {t('common.viewProfile')}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
