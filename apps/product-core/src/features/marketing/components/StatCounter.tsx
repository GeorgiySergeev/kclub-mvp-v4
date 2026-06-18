'use client';

import { useEffect, useRef, useState } from 'react';

export type StatCounterConfig = {
  target: number;
  suffix?: string;
  spaced?: boolean;
};

function formatStatValue(value: number, spaced: boolean): string {
  if (!spaced) return String(value);
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}

type StatCounterProps = StatCounterConfig & {
  durationMs?: number;
  className?: string;
};

export function StatCounter({
  target,
  suffix = '',
  spaced = false,
  durationMs = 1400,
  className,
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const showFinal = () => setValue(target);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showFinal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - (1 - progress) ** 3;
          setValue(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [durationMs, target]);

  return (
    <span ref={ref} className={className}>
      {formatStatValue(value, spaced)}
      {suffix}
    </span>
  );
}
