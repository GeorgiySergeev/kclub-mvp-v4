import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale } from '@/i18n/routing';

export function CtaSection({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <section className="border-y border-zinc-200 py-16 dark:border-zinc-800 sm:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extralight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          {t('cta.title')}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {t('cta.subline')}
        </p>
        <Link
          href={`/${locale}/sign-up`}
          className="mt-8 inline-flex h-12 items-center justify-center border border-zinc-900 bg-zinc-900 px-6 text-sm font-normal text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950"
        >
          {t('cta.button')}
        </Link>
      </div>
    </section>
  );
}
