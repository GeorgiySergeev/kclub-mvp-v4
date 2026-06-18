import { useTranslations } from 'next-intl';

type Fact = {
  label: string;
  value: string;
};

export function AboutSection() {
  const t = useTranslations('home');
  const facts = t.raw('about.facts') as Fact[];

  return (
    <section className="border-b border-zinc-800 bg-[#202022] py-16 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-10">
        <div>
          <p className="border-l-4 border-[#ff0030] pl-4 text-xs font-bold uppercase text-white/60">
            {t('about.eyebrow')}
          </p>
          <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-tight text-white sm:text-6xl">
            {t('about.title')}
          </h2>
          <div className="mt-8 grid max-w-2xl gap-5 text-base font-medium leading-8 text-white/70">
            <p>{t('about.paragraph1')}</p>
            <p>{t('about.paragraph2')}</p>
          </div>
        </div>
        <aside className="border-white/12 border bg-white/[0.04] p-6 sm:p-8">
          <h3 className="text-white/58 text-sm font-bold uppercase">{t('about.factsTitle')}</h3>
          <dl className="mt-8 grid gap-6">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="border-white/12 border-b pb-6 last:border-b-0 last:pb-0"
              >
                <dt className="text-white/54 text-xs font-bold uppercase">{fact.label}</dt>
                <dd className="mt-2 text-4xl font-black text-white">
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
