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
    <section className="border-b border-zinc-200 bg-[#f4f4f2] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <p className="border-l-4 border-[#ff0030] pl-4 text-xs font-bold uppercase text-zinc-500">
            {t('features.eyebrow')}
          </p>
          <h2 className="max-w-3xl text-4xl font-black uppercase leading-tight text-[#202022] sm:text-6xl">
            {t('features.title')}
          </h2>
        </div>
        <div className="mt-12 grid gap-px border border-zinc-300 bg-zinc-300 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[index];

            return (
              <article
                key={item.title}
                className="group bg-white p-6 transition hover:bg-[#202022] sm:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center border border-zinc-200 text-[#ff0030] transition group-hover:border-white/20 group-hover:text-white">
                  <Icon aria-hidden="true" size={22} strokeWidth={1.6} />
                </div>
                <div className="my-7 h-px w-12 bg-[#ff0030]" />
                <h3 className="text-xl font-black uppercase text-[#202022] transition group-hover:text-white">
                  {item.title}
                </h3>
                <p className="group-hover:text-white/72 mt-4 text-sm font-medium leading-7 text-zinc-600 transition">
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
