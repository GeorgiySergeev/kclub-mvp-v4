'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

const stats = [
  { value: 1200, suffix: '+', key: 'members' },
  { value: 12, suffix: '', key: 'countries' },
  { value: 340, suffix: '+', key: 'partners' },
  { value: 5, suffix: '', key: 'years' },
] as const;

export function StatsSection() {
  const t = useTranslations('home');
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const numberFormat = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale],
  );

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.32 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    let frame = 0;
    const startedAt = performance.now();
    const duration = 900;

    const tick = (now: number) => {
      const nextProgress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - nextProgress, 3);

      setProgress(eased);

      if (nextProgress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="kclub-border border-y bg-white py-8 dark:bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="kclub-border-strong grid auto-rows-fr grid-cols-2 gap-px overflow-hidden border bg-zinc-300 dark:bg-white/10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="flex min-h-40 flex-col items-center justify-center bg-white px-3 py-8 text-center dark:bg-surface sm:px-6 sm:py-11"
            >
              <p className="whitespace-nowrap text-4xl font-black leading-none text-zinc-950 dark:text-white sm:text-5xl lg:text-6xl">
                {numberFormat
                  .format(Math.round(stat.value * progress))
                  .replace(/[, \u00a0\u202f]/g, ' ')}
                {stat.suffix}
                <span className="text-accent">.</span>
              </p>
              <p className="mx-auto mt-4 max-w-36 text-xs font-bold uppercase leading-5 text-zinc-500 dark:text-white/60">
                {t(`stats.${stat.key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
