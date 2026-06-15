'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqSection() {
  const t = useTranslations('home');
  const items = t.raw('faq.items') as FaqItem[];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-xs font-normal uppercase tracking-widest text-zinc-500">
            {t('faq.eyebrow')}
          </p>
          <h2 className="mt-4 text-4xl font-extralight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
            {t('faq.title')}
          </h2>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800">
          {items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div key={item.question} className="border-b border-zinc-200 dark:border-zinc-800">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="flex min-h-16 w-full items-center justify-between gap-4 py-5 text-left text-base font-normal text-zinc-950 outline-none transition hover:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:text-zinc-50 dark:hover:text-zinc-300 dark:focus:ring-zinc-50"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.5}
                    className={`shrink-0 transition ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="pb-6 text-sm leading-7 text-zinc-600 dark:text-zinc-400"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
