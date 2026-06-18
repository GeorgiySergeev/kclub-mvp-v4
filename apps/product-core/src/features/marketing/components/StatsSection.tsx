'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@kclub/ui';

import { StatCounter, type StatCounterConfig } from './StatCounter';

const stats: ReadonlyArray<StatCounterConfig & { key: 'members' | 'countries' | 'partners' | 'years' }> =
  [
    { target: 1200, suffix: '+', spaced: true, key: 'members' },
    { target: 12, key: 'countries' },
    { target: 340, suffix: '+', key: 'partners' },
    { target: 5, key: 'years' },
  ];

export function StatsSection() {
  const t = useTranslations('home');

  return (
    <section
      id="stats"
      className="border-y border-border bg-card dark:border-kclub-navy-700 dark:bg-kclub-navy-900/50"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.key}
            className={cn(
              'flex min-h-[9.5rem] flex-col items-center justify-center border-border px-4 py-8 text-center sm:min-h-[10.5rem] sm:py-10',
              index % 2 === 0 && 'border-r',
              index < 2 && 'border-b lg:border-b-0',
              'lg:border-r lg:last:border-r-0',
            )}
          >
            <p className="font-display text-4xl font-medium tabular-nums tracking-tight text-foreground sm:text-5xl">
              <StatCounter
                target={stat.target}
                suffix={stat.suffix}
                spaced={stat.spaced}
              />
            </p>
            <p className="kclub-overline mt-3 max-w-[12rem] text-muted-foreground">
              {t(`stats.${stat.key}`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
