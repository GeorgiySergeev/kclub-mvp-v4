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
    <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-normal uppercase tracking-widest text-zinc-500">
            {t('features.eyebrow')}
          </p>
          <h2 className="mt-4 text-4xl font-extralight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
            {t('features.title')}
          </h2>
        </div>
        <div className="mt-12 grid gap-px border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index];

            return (
              <article key={item.title} className="bg-white p-6 dark:bg-zinc-950">
                <Icon
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1}
                  className="text-zinc-900 dark:text-zinc-50"
                />
                <div className="my-5 h-px w-10 bg-zinc-200 dark:bg-zinc-800" />
                <h3 className="text-lg font-light tracking-tight text-zinc-950 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
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
