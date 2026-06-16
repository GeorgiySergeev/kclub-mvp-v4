import { getTranslations } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { requireCurrentMember } from '@/server/member-page';
import { DashboardTabs } from '@/features/member/components/DashboardTabs';
import {
  getImplementedDashboardTabs,
  normalizeDashboardTab,
} from '@/features/member/dashboard-tabs';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'member.dashboard' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const profile = await requireCurrentMember(locale);
  const visibleTabs = getImplementedDashboardTabs(profile);
  const activeTab = normalizeDashboardTab(query.tab, visibleTabs);

  return (
    <DashboardTabs
      locale={locale}
      profile={profile}
      activeTab={activeTab}
      visibleTabs={visibleTabs}
    />
  );
}
