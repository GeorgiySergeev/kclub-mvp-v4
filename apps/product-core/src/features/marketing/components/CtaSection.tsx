import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale } from '@/i18n/routing';

export function CtaSection({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <section className="border-y border-[#2e2e32] bg-[#202022] py-16 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
        <div>
          <p className="mb-5 border-l-4 border-[#ff0030] pl-4 text-xs font-bold uppercase text-white/60">
            KCLUB
          </p>
          <h2 className="max-w-4xl text-4xl font-black uppercase leading-tight text-white sm:text-6xl">
            {t('cta.title')}
          </h2>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/70">
            {t('cta.subline')}
          </p>
        </div>
        <Link
          href={`/${locale}/sign-up`}
          className="inline-flex h-14 min-w-56 items-center justify-between gap-8 border border-[#ff0030] bg-[#ff0030] px-5 text-sm font-bold text-white transition hover:bg-[#d90029] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#202022]"
        >
          {t('cta.button')}
          <ArrowUpRight aria-hidden="true" size={20} />
        </Link>
      </div>
    </section>
  );
}
