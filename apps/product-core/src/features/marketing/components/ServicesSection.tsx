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
    <section className="border-b border-zinc-200 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <p className="border-l-4 border-[#ff0030] pl-4 text-xs font-bold uppercase text-zinc-500">
          {t('services.eyebrow')}
        </p>
        <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-tight text-[#202022] sm:text-6xl">
          {t('services.title')}
        </h2>
        <div className="mt-12 grid gap-px border border-zinc-300 bg-zinc-300 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`bg-white p-6 sm:p-9 ${plan.featured ? 'relative overflow-hidden' : ''}`}
            >
              {plan.featured ? (
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[#ff0030]" />
              ) : null}
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-sm font-black uppercase text-zinc-500">{plan.name}</h3>
                  <p className="mt-5 text-5xl font-black text-[#202022]">{plan.price}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center border border-zinc-200 text-[#ff0030]">
                  <ArrowUpRight aria-hidden="true" size={22} />
                </span>
              </div>
              <ul className="mt-8 grid gap-4">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-zinc-600">
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
                className={`mt-8 inline-flex h-14 w-full items-center justify-between gap-8 border px-5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#202022] focus:ring-offset-2 sm:w-auto ${plan.featured ? 'border-[#ff0030] bg-[#ff0030] text-white hover:bg-[#d90029]' : 'border-[#202022] text-[#202022] hover:bg-[#202022] hover:text-white'}`}
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
