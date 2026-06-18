import { useTranslations } from 'next-intl';

import { ShimmerButton } from '@/components/premium';
import { Locale } from '@/i18n/routing';

export function CtaSection({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden border-y border-border py-16 dark:border-kclub-navy-700 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-kclub-navy-950 via-kclub-navy-900 to-kclub-navy-950 dark:opacity-100"
      />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-medium tracking-tight text-kclub-canvas sm:text-5xl">
          {t('cta.title')}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-kclub-canvas/70">{t('cta.subline')}</p>
        <div className="mt-8">
          <ShimmerButton href={`/${locale}/sign-up`} variant="gold">
            {t('cta.button')}
          </ShimmerButton>
        </div>
      </div>
    </section>
  );
}
