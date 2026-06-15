import { useTranslations } from 'next-intl';

const stats = [
  { value: '1 200+', key: 'members' },
  { value: '12', key: 'countries' },
  { value: '340+', key: 'partners' },
  { value: '5', key: 'years' },
] as const;

export function StatsSection() {
  const t = useTranslations('home');

  return (
    <section id="stats" className="border-y border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat, index) => (
          <div
            key={stat.key}
            className={`border-zinc-200 py-8 dark:border-zinc-800 sm:py-10 ${index % 2 === 0 ? 'border-r lg:border-r' : 'lg:border-r'} ${index === stats.length - 1 ? 'lg:border-r-0' : ''}`}
          >
            <p className="text-4xl font-light tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-3 text-xs font-normal uppercase tracking-widest text-zinc-500">
              {t(`stats.${stat.key}`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
