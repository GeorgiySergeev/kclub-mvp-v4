import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale } from '@/i18n/routing';

export function HeroSection({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <section className="relative isolate min-h-[calc(100vh-112px)] overflow-hidden bg-zinc-50 text-zinc-950 dark:bg-[#18181a] dark:text-white">
      <div className="kclub-hero-visual absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-zinc-50/50 dark:bg-[#18181a]/50"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-50 to-transparent dark:from-[#18181a]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-10">
        <div className="min-w-0 max-w-3xl pt-8 lg:pt-0">
          <p className="mb-6 border-l-4 border-[#ff0030] pl-4 text-sm font-semibold uppercase text-zinc-600 dark:text-white/78">
            {t('hero.eyebrow')}
          </p>
          <h1 className="max-w-full break-words text-[clamp(2.2rem,10.5vw,5.2rem)] font-black uppercase leading-[0.96] sm:text-[clamp(3rem,5.6vw,5.2rem)]">
            <span className="kclub-outline-text block">{t('hero.titleLine1')}</span>
            <span className="block">{t('hero.titleLine2')}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base font-semibold leading-8 text-zinc-600 dark:text-white/86 sm:text-lg">
            {t('hero.subline')}
          </p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={`/${locale}/sign-up`}
              className="inline-flex h-14 w-full items-center justify-between gap-8 border border-[#ff0030] bg-[#ff0030] px-5 text-sm font-bold text-white transition hover:bg-[#d90029] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#18181a] sm:w-auto sm:min-w-52"
            >
              {t('hero.primaryCta')}
              <ArrowUpRight aria-hidden="true" size={20} strokeWidth={2} />
            </Link>
            <Link
              href={`/${locale}/directory`}
              className="inline-flex h-14 w-full items-center justify-between gap-8 border border-zinc-300 bg-white/80 px-5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:border-white/34 dark:bg-[#18181a]/50 dark:text-white dark:hover:bg-white/10 dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#18181a] sm:w-auto sm:min-w-52"
            >
              {t('hero.secondaryCta')}
              <ArrowUpRight aria-hidden="true" size={20} strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative ml-auto h-[520px] max-w-[520px] border border-zinc-200 bg-white/60 p-5 shadow-2xl dark:border-white/12 dark:bg-black/24">
            <div className="kclub-noise h-full border border-zinc-200 bg-zinc-100/90 p-6 dark:border-white/10 dark:bg-[#222225]/82">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="h-12 w-12 bg-[#ff0030]" />
                  <span className="text-sm font-semibold uppercase text-zinc-500 dark:text-white/60">
                    Private Access
                  </span>
                </div>
                <div className="grid gap-4">
                  <div className="h-28 border border-zinc-200 bg-zinc-200/60 dark:border-white/12 dark:bg-white/[0.06]" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-zinc-200/80 dark:bg-white/[0.08]" />
                    <div className="h-24 bg-zinc-100 dark:bg-white/[0.04]" />
                    <div className="h-24 bg-[#ff0030]/85" />
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-end gap-8">
                  <p className="text-5xl font-black uppercase leading-none">KCLUB</p>
                  <div className="h-20 w-20 border border-zinc-300 dark:border-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a
        href="#stats"
        aria-label={t('common.scroll')}
        className="absolute bottom-6 left-1/2 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center border border-zinc-300 bg-white text-zinc-950 transition hover:bg-[#ff0030] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] dark:border-white/20 dark:bg-[#18181a] dark:text-white dark:hover:text-white dark:focus-visible:ring-white"
      >
        <ArrowDown aria-hidden="true" size={18} strokeWidth={1.5} />
      </a>
    </section>
  );
}
