import { Check } from 'lucide-react';
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
  const plans = [
    { ...member, href: `/${locale}/sign-up`, featured: false },
    { ...vip, href: `/${locale}/sign-up`, featured: true },
  ];

  return (
    <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-normal uppercase tracking-widest text-zinc-500">
          {t('services.eyebrow')}
        </p>
        <h2 className="mt-4 text-4xl font-extralight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          {t('services.title')}
        </h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-none bg-white p-6 dark:bg-zinc-950 sm:p-8 ${plan.featured ? 'border-2 border-zinc-900 dark:border-zinc-50' : 'border border-zinc-200 dark:border-zinc-800'}`}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-sm font-normal uppercase tracking-widest text-zinc-500">
                    {plan.name}
                  </h3>
                  <p className="mt-5 text-4xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
                    {plan.price}
                  </p>
                </div>
              </div>
              <ul className="mt-8 grid gap-4">
                {plan.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400"
                  >
                    <Check
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0 text-zinc-900 dark:text-zinc-50"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 inline-flex h-12 w-full items-center justify-center border px-5 text-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950 sm:w-auto ${plan.featured ? 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200' : 'border-zinc-200 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900'}`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
