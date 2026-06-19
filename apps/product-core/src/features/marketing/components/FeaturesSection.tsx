import { BadgeCheck, Building2, Globe2, Handshake, QrCode, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

type FeatureItem = {
  title: string;
  description: string;
};

const icons = [QrCode, BadgeCheck, Building2, Handshake, Globe2, ShieldCheck] as const;

export function FeaturesSection() {
  const t = useTranslations('home');
  const items = t.raw('features.items') as FeatureItem[];

  return (
    <section className="kclub-border border-b bg-[#f4f4f2] py-16 dark:bg-[#111113] sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <p className="border-l-4 border-[#ff0030] pl-4 text-xs font-bold uppercase text-zinc-500 dark:text-white/60">
            {t('features.eyebrow')}
          </p>
          <h2 className="max-w-3xl text-4xl font-black uppercase leading-tight text-zinc-950 dark:text-white sm:text-6xl">
            {t('features.title')}
          </h2>
        </div>
        <div className="kclub-border-strong mt-12 grid gap-px border bg-zinc-300 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index];

            return (
              <article
                key={item.title}
                className="group bg-white p-6 transition hover:bg-zinc-950 dark:bg-[#18181a] dark:hover:bg-[#202022] sm:p-8"
              >
                <div className="kclub-border flex h-12 w-12 items-center justify-center border text-[#ff0030] transition group-hover:border-white/20 group-hover:text-white">
                  <Icon aria-hidden="true" size={22} strokeWidth={1.6} />
                </div>
                <div className="my-7 h-px w-12 bg-[#ff0030]" />
                <h3 className="text-xl font-black uppercase text-zinc-950 transition group-hover:text-white dark:text-white">
                  {item.title}
                </h3>
                <p className="group-hover:text-white/72 mt-4 text-sm font-medium leading-7 text-zinc-600 transition dark:text-white/70">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
