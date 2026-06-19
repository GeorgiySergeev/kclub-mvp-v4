import { ArrowUpRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale } from '@/i18n/routing';

type PlanCopy = {
  name: string;
  price: string;
  cta: string;
  items: string[];
};

export function ServicesSection({ locale }: { locale: Locale }) {
  const t = useTranslations('home');
  const member = t.raw('services.member') as PlanCopy;
  const vip = t.raw('services.vip') as PlanCopy;
  const business = t.raw('services.business') as PlanCopy;
  const plans = [
    { ...member, href: `/${locale}/sign-up`, featured: false },
    { ...vip, href: `/${locale}/sign-up`, featured: true },
    { ...business, href: `/${locale}/sign-up`, featured: false },
  ];

  return (
    <section className="kclub-border border-b bg-white py-16 dark:bg-[#09090b] sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <p className="border-l-4 border-[#ff0030] pl-4 text-xs font-bold uppercase text-zinc-500 dark:text-white/60">
          {t('services.eyebrow')}
        </p>
        <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-tight text-zinc-950 dark:text-white sm:text-6xl">
          {t('services.title')}
        </h2>
        <div className="kclub-border-strong mt-12 grid gap-px border bg-zinc-300 dark:bg-white/10 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`bg-white p-6 dark:bg-[#18181a] sm:p-9 ${plan.featured ? 'relative overflow-hidden' : ''}`}
            >
              {plan.featured ? (
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[#ff0030]" />
              ) : null}
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-sm font-black uppercase text-zinc-500 dark:text-white/60">
                    {plan.name}
                  </h3>
                  <p className="mt-5 text-5xl font-black text-zinc-950 dark:text-white">
                    {plan.price}
                  </p>
                </div>
                <span className="kclub-border flex h-12 w-12 items-center justify-center border text-[#ff0030]">
                  <ArrowUpRight aria-hidden="true" size={22} />
                </span>
              </div>
              <ul className="mt-8 grid gap-4">
                {plan.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm font-medium leading-6 text-zinc-600 dark:text-white/70"
                  >
                    <Check
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0 text-[#ff0030]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 inline-flex h-14 w-full items-center justify-between gap-8 border px-5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#18181a] sm:w-auto ${plan.featured ? 'border-[#ff0030] bg-[#ff0030] text-white hover:bg-[#d90029]' : 'border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-zinc-950'}`}
              >
                {plan.cta}
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
