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
    <section className="border-b border-border py-16 dark:border-kclub-navy-700 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="kclub-overline text-muted-foreground">{t('features.eyebrow')}</p>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {t('features.title')}
          </h2>
        </div>
        <div className="mt-12 grid gap-px border border-border bg-border dark:border-kclub-navy-700 dark:bg-kclub-navy-700 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index];

            return (
              <article
                key={item.title}
                className="bg-card p-6 transition duration-200 hover:bg-secondary/50 dark:bg-kclub-navy-950 dark:hover:bg-kclub-navy-900"
              >
                <Icon
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.25}
                  className="text-kclub-gold-500"
                />
                <div className="my-5 h-px w-10 bg-kclub-gold-500/40" />
                <h3 className="font-display text-lg font-medium tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
