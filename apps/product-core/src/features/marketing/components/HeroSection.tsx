import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AnimatedGradientText, DotPattern, ShimmerButton } from '@/components/premium';
import { Locale } from '@/i18n/routing';

export function HeroSection({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <section className="relative flex min-h-screen border-b border-border">
      <div className="relative min-h-screen w-full overflow-hidden bg-kclub-navy-950">
        <DotPattern className="opacity-20" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-kclub-navy-950 via-kclub-navy-900/80 to-kclub-navy-950"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-24 text-center motion-safe:animate-fade-up sm:px-6 lg:px-8">
          <p className="kclub-overline text-kclub-gold-300/80">{t('hero.eyebrow')}</p>
          <h1 className="mt-6 max-w-5xl font-display text-5xl font-medium tracking-tight text-kclub-canvas sm:text-7xl lg:text-8xl">
            <span className="block">{t('hero.titleLine1')}</span>
            <span className="block">
              <AnimatedGradientText>{t('hero.titleLine2')}</AnimatedGradientText>
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-kclub-canvas/70 sm:text-lg">
            {t('hero.subline')}
          </p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ShimmerButton href={`/${locale}/sign-up`} variant="gold">
              {t('hero.primaryCta')}
            </ShimmerButton>
            <Link
              href={`/${locale}/directory`}
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 bg-white/5 px-6 text-sm font-medium text-kclub-canvas transition duration-200 hover:border-kclub-gold-500/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-kclub-gold-500 focus:ring-offset-2 focus:ring-offset-kclub-navy-950"
            >
              {t('hero.secondaryCta')}
            </Link>
          </div>
        </div>
      </div>
      <a
        href="#stats"
        aria-label={t('common.scroll')}
        className="absolute bottom-6 left-1/2 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-kclub-navy-900/80 text-kclub-canvas backdrop-blur transition duration-200 hover:border-kclub-gold-500/40 hover:bg-kclub-navy-800 focus:outline-none focus:ring-2 focus:ring-kclub-gold-500"
      >
        <ArrowDown aria-hidden="true" size={18} strokeWidth={1.5} />
      </a>
    </section>
  );
}
