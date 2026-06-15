import { useTranslations } from 'next-intl';

type Fact = {
  label: string;
  value: string;
};

export function AboutSection() {
  const t = useTranslations('home');
  const facts = t.raw('about.facts') as Fact[];

  return (
    <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <div>
          <p className="text-xs font-normal uppercase tracking-widest text-zinc-500">
            {t('about.eyebrow')}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-extralight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
            {t('about.title')}
          </h2>
          <div className="mt-8 grid max-w-2xl gap-5 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            <p>{t('about.paragraph1')}</p>
            <p>{t('about.paragraph2')}</p>
          </div>
        </div>
        <aside className="border border-zinc-200 p-6 dark:border-zinc-800">
          <h3 className="text-sm font-normal uppercase tracking-widest text-zinc-500">
            {t('about.factsTitle')}
          </h3>
          <dl className="mt-8 grid gap-6">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="border-b border-zinc-200 pb-6 last:border-b-0 last:pb-0 dark:border-zinc-800"
              >
                <dt className="text-xs font-normal uppercase tracking-widest text-zinc-500">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-3xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
