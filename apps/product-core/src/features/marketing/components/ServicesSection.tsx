import { Check } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ShimmerButton } from '@/components/premium';
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
    { ...member, href: `/${locale}/sign-up`, featured: false, tier: 'MEMBER' as const },
    { ...vip, href: `/${locale}/sign-up`, featured: true, tier: 'VIP' as const },
  ];

  return (
    <section className="border-b border-border py-16 dark:border-kclub-navy-700 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="kclub-overline text-muted-foreground">{t('services.eyebrow')}</p>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          {t('services.title')}
        </h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-xl p-6 sm:p-8 ${
                plan.featured
                  ? 'border-2 border-kclub-gold-500/40 bg-kclub-navy-950 text-kclub-canvas shadow-gold dark:bg-kclub-navy-900'
                  : 'border border-border bg-card dark:border-kclub-navy-700 dark:bg-kclub-navy-950'
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3
                    className={`kclub-overline ${plan.featured ? 'text-kclub-gold-300' : 'text-muted-foreground'}`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-5 font-display text-4xl font-medium tracking-tight ${plan.featured ? 'text-kclub-canvas' : 'text-foreground'}`}
                  >
                    {plan.price}
                  </p>
                </div>
              </div>
              <ul className="mt-8 grid gap-4">
                {plan.items.map((item) => (
                  <li
                    key={item}
                    className={`flex gap-3 text-sm leading-6 ${plan.featured ? 'text-kclub-canvas/75' : 'text-muted-foreground'}`}
                  >
                    <Check
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.5}
                      className={`mt-1 shrink-0 ${plan.featured ? 'text-kclub-gold-300' : 'text-kclub-gold-600 dark:text-kclub-gold-300'}`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {plan.featured ? (
                <div className="mt-8">
                  <ShimmerButton href={plan.href} variant="gold" className="w-full sm:w-auto">
                    {plan.cta}
                  </ShimmerButton>
                </div>
              ) : (
                <Link
                  href={plan.href}
                  className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-md border border-border px-5 text-sm font-medium text-foreground transition duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-kclub-gold-500 sm:w-auto dark:border-kclub-navy-700 dark:hover:bg-kclub-navy-800"
                >
                  {plan.cta}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
