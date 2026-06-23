import { getTranslations } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { requireCurrentMember } from '@/server/member-page';
import { getPrismaClient } from '@/server/db';
import { Breadcrumbs } from '@/features/member/components/Breadcrumbs';
import { BusinessOnboardingWizard } from '@/features/member/components/BusinessOnboardingWizard';
import type { TaxonomyOption } from '@/features/member/components/BusinessPanel';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'member.businessOnboarding' });

  return {
    title: t('metaTitle'),
  };
}

export default async function BusinessOnboardingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  await requireCurrentMember(locale);

  const prisma = getPrismaClient();
  const [countries, categories, cities] = await Promise.all([
    prisma.country.findMany({ where: { is_active: true }, orderBy: { name: 'asc' } }),
    prisma.category.findMany({
      where: { is_active: true, is_high_risk: false },
      orderBy: { name: 'asc' },
    }),
    prisma.city.findMany({ where: { is_active: true }, orderBy: { name: 'asc' } }),
  ]);

  const t = await getTranslations({ locale, namespace: 'member.businessOnboarding' });
  const tDash = await getTranslations({ locale, namespace: 'member.dashboard' });

  const breadcrumbItems = [
    { label: tDash('breadcrumbs.dashboard'), href: `/${locale}/m/dashboard` },
    { label: tDash('breadcrumbs.business'), href: `/${locale}/m/dashboard?tab=business` },
    { label: t('breadcrumb') },
  ];
  const homeHref = `/${locale}`;

  const countryOptions: TaxonomyOption[] = countries.map((c) => ({ id: c.id, name: c.name }));
  const cityOptions: TaxonomyOption[] = cities.map((c) => ({ id: c.id, name: c.name }));
  const categoryOptions: TaxonomyOption[] = categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-8">
      <Breadcrumbs homeHref={homeHref} items={breadcrumbItems} />

      <div>
        <p className="kclub-section-label">{tDash('eyebrow')}</p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white sm:text-4xl">
          {t('title')}
        </h1>
      </div>

      <div className="kclub-panel max-w-none rounded-none px-6 py-6 shadow-none ring-0 dark:bg-zinc-900/50">
        <BusinessOnboardingWizard
          locale={locale}
          countryOptions={countryOptions}
          cityOptions={cityOptions}
          categoryOptions={categoryOptions}
        />
      </div>
    </div>
  );
}
