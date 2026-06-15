import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale } from '@/i18n/routing';

export function HeroSection({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <section className="relative flex min-h-screen border-b border-zinc-200 dark:border-zinc-800">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(24,24,27,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.04)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,rgba(250,250,250,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,250,250,0.04)_1px,transparent_1px)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="mb-6 text-xs font-normal uppercase tracking-widest text-zinc-500">
          {t('hero.eyebrow')}
        </p>
        <h1 className="max-w-5xl text-5xl font-extralight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-7xl lg:text-8xl">
          <span className="block">{t('hero.titleLine1')}</span>
          <span className="block">{t('hero.titleLine2')}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-base font-normal leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
          {t('hero.subline')}
        </p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href={`/${locale}/sign-up`}
            className="inline-flex h-12 items-center justify-center border border-zinc-900 bg-zinc-900 px-6 text-sm font-normal text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950"
          >
            {t('hero.primaryCta')}
          </Link>
          <Link
            href={`/${locale}/directory`}
            className="inline-flex h-12 items-center justify-center border border-zinc-200 bg-transparent px-6 text-sm font-normal text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950"
          >
            {t('hero.secondaryCta')}
          </Link>
        </div>
      </div>
      <a
        href="#stats"
        aria-label={t('common.scroll')}
        className="absolute bottom-6 left-1/2 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-50"
      >
        <ArrowDown aria-hidden="true" size={18} strokeWidth={1.5} />
      </a>
    </section>
  );
}
