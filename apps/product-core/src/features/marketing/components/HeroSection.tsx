import { ArrowUpRight, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale } from '@/i18n/routing';

export function HeroSection({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <section className="kclub-premium-hero relative isolate min-h-[calc(100vh-112px)] overflow-hidden border-b border-zinc-200 dark:border-border">
      <div className="kclub-hero-visual absolute inset-0" aria-hidden="true" />
      <div className="kclub-premium-hero-tint absolute inset-0" aria-hidden="true" />
      <div
        className="kclub-premium-hero-fade absolute bottom-0 left-0 right-0 h-24"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-[10%] hidden w-px bg-zinc-300/80 dark:bg-white/10 lg:block"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 top-[6.625rem] hidden h-px w-full bg-zinc-300/70 dark:bg-white/10 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-11 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20 lg:px-10 lg:py-[6.625rem] xl:gap-[5rem]">
        <div className="min-w-0 max-w-3xl lg:pr-6">
          <p className="kclub-section-label mb-11 border-l border-accent pl-4 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-600 dark:text-white/70">
            {t('hero.eyebrow')}
          </p>

          <h1 className="kclub-hero-display max-w-full text-balance uppercase">
            <span className="kclub-outline-text block">{t('hero.titleLine1')}</span>
            <span className="mt-2 block sm:whitespace-nowrap">{t('hero.titleLine2')}</span>
          </h1>

          <p className="kclub-hero-copy mt-11">{t('hero.subline')}</p>

          <div className="mt-11 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link href={`/${locale}/sign-up`} className="kclub-button-primary w-full sm:w-auto">
              <span>{t('hero.primaryCta')}</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
            </Link>
            <Link href={`/${locale}/directory`} className="kclub-button-secondary w-full sm:w-auto">
              <span>{t('hero.secondaryCta')}</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2} />
            </Link>
          </div>

          <div className="mt-20 grid gap-8 border-t border-zinc-200 pt-8 dark:border-border sm:grid-cols-3">
            <div className="kclub-hero-stat">
              <p className="kclub-hero-stat-label">{t('hero.stats.verified.title')}</p>
              <p className="kclub-hero-stat-copy">{t('hero.stats.verified.copy')}</p>
            </div>
            <div className="kclub-hero-stat">
              <p className="kclub-hero-stat-label">{t('hero.stats.access.title')}</p>
              <p className="kclub-hero-stat-copy">{t('hero.stats.access.copy')}</p>
            </div>
            <div className="kclub-hero-stat">
              <p className="kclub-hero-stat-label">{t('hero.stats.reach.title')}</p>
              <p className="kclub-hero-stat-copy">{t('hero.stats.reach.copy')}</p>
            </div>
          </div>
        </div>

        {/* <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-[640px] lg:max-w-[560px] xl:max-w-[600px]">
            <div className="kclub-hero-card aspect-[1.62/1] min-h-[240px] lg:min-h-0">
              <div
                className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,0,37,0.06),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(244,244,245,0.92))] dark:bg-[linear-gradient(135deg,rgba(255,0,37,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.18))]"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 top-[34%] h-px bg-zinc-200 dark:bg-white/10" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-[28%] h-px bg-zinc-200 dark:bg-white/10" aria-hidden="true" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center border border-accent bg-accent/10 text-sm font-semibold text-zinc-950 dark:text-white">
                        K
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-white/60">
                          {t('hero.cardEyebrow')}
                        </p>
                        <p className="mt-2 text-[1.5rem] font-semibold leading-[1.2] tracking-[0.12em] text-zinc-950 dark:text-white sm:text-[2rem]">
                          KCLUB
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 border border-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-950 dark:text-white">
                    VIP
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-white/60">
                    Member ID
                  </p>
                  <div className="row-span-2 flex h-20 w-20 items-center justify-center border border-zinc-300 bg-zinc-50 dark:border-border dark:bg-black/20 sm:h-24 sm:w-24">
                    <QrCode
                      aria-hidden="true"
                      size={44}
                      strokeWidth={1.3}
                      className="text-zinc-700 dark:text-white/90"
                    />
                  </div>
                  <p className="font-mono text-xl tracking-[0.16em] text-zinc-950 dark:text-white sm:text-2xl">
                    KC-024801
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 items-end gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-white/50">
                      {t('hero.cardCaption')}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-zinc-600 dark:text-white/70">
                      Since 2019
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-white/50">
                      Valid thru
                    </p>
                    <p className="mt-2 font-mono text-base tracking-[0.14em] text-zinc-900 dark:text-white sm:text-lg">
                      12/26
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
