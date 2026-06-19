import { useTranslations } from 'next-intl';

type Fact = {
  label: string;
  value: string;
};

export function AboutSection() {
  const t = useTranslations('home');
  const facts = t.raw('about.facts') as Fact[];

  return (
    <section className="kclub-border border-b bg-zinc-100 py-16 text-zinc-950 dark:bg-[#202022] dark:text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-10">
        <div>
          <p className="border-l-4 border-[#ff0030] pl-4 text-xs font-bold uppercase text-zinc-500 dark:text-white/60">
            {t('about.eyebrow')}
          </p>
          <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-tight sm:text-6xl">
            {t('about.title')}
          </h2>
          <div className="mt-8 grid max-w-2xl gap-5 text-base font-medium leading-8 text-zinc-600 dark:text-white/70">
            <p>{t('about.paragraph1')}</p>
            <p>{t('about.paragraph2')}</p>
          </div>
        </div>
        <aside className="kclub-border dark:border-white/12 border bg-white/70 p-6 dark:bg-white/[0.04] sm:p-8">
          <h3 className="dark:text-white/58 text-sm font-bold uppercase text-zinc-500">
            {t('about.factsTitle')}
          </h3>
          <dl className="mt-8 grid gap-6">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="kclub-border dark:border-white/12 border-b pb-6 last:border-b-0 last:pb-0"
              >
                <dt className="dark:text-white/54 text-xs font-bold uppercase text-zinc-500">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-4xl font-black">
                  {fact.value}
                  <span className="text-[#ff0030]">.</span>
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
