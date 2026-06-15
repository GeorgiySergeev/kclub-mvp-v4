import { useTranslations } from 'next-intl';

type Testimonial = {
  quote: string;
  author: string;
  initials: string;
  tier: string;
};

export function TestimonialsSection() {
  const t = useTranslations('home');
  const items = t.raw('testimonials.items') as Testimonial[];

  return (
    <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-normal uppercase tracking-widest text-zinc-500">
          {t('testimonials.eyebrow')}
        </p>
        <h2 className="mt-4 text-4xl font-extralight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          {t('testimonials.title')}
        </h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <figure key={item.author} className="border border-zinc-200 p-6 dark:border-zinc-800">
              <blockquote className="text-sm italic leading-7 text-zinc-600 dark:text-zinc-400">
                {item.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-xs font-normal tracking-widest text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                  {item.initials}
                </div>
                <div>
                  <p className="text-sm text-zinc-950 dark:text-zinc-50">{item.author}</p>
                  <p className="mt-1 inline-flex border border-zinc-200 px-2 py-1 text-xs uppercase tracking-widest text-zinc-500 dark:border-zinc-800">
                    {item.tier}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
