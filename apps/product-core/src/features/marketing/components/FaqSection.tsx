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
    <section className="border-b kclub-border bg-[#f4f4f2] py-16 dark:bg-[#111113] sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <p className="border-l-4 border-[#ff0030] pl-4 text-xs font-bold uppercase text-zinc-500 dark:text-white/60">
            {t('faq.eyebrow')}
          </p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-tight text-zinc-950 dark:text-white sm:text-6xl">
            {t('faq.title')}
          </h2>
        </div>
        <div className="border-t kclub-border-strong bg-white dark:bg-[#18181a]">
          {items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div key={item.question} className="border-b kclub-border-strong">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-black uppercase text-zinc-950 outline-none transition hover:text-[#ff0030] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff0030] dark:text-white dark:focus-visible:ring-white"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.5}
                    className={`shrink-0 text-[#ff0030] transition ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="px-5 pb-6 text-sm font-medium leading-7 text-zinc-600 dark:text-white/70"
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
