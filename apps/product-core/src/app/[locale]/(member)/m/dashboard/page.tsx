import { getTranslations } from 'next-intl/server';

import type { Locale } from '@/i18n/routing';
import { requireCurrentMember } from '@/server/member-page';
import { getOwnBusinesses } from '@/server/services/business-service';
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

  // #region agent log
  fetch('http://127.0.0.1:7636/ingest/6dba481e-9e44-433b-807f-7cbc3639f634',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8c1fb6'},body:JSON.stringify({sessionId:'8c1fb6',runId:'pre-fix',hypothesisId:'H1-H2',location:'dashboard/page.tsx:entry',message:'DashboardPage handler entered',data:{locale,tab:query.tab},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  const profile = await requireCurrentMember(locale);
  const ownBusinesses = await getOwnBusinesses(profile.id);
  const hasPublishedBusiness = ownBusinesses.some((b) => b.status === 'PUBLISHED');
  const visibleTabs = getImplementedDashboardTabs({ ...profile, hasPublishedBusiness });
  const activeTab = normalizeDashboardTab(query.tab, visibleTabs);

  // #region agent log
  fetch('http://127.0.0.1:7636/ingest/6dba481e-9e44-433b-807f-7cbc3639f634',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8c1fb6'},body:JSON.stringify({sessionId:'8c1fb6',runId:'pre-fix',hypothesisId:'H2-H3',location:'dashboard/page.tsx:ready',message:'DashboardPage data resolved',data:{activeTab,visibleTabCount:visibleTabs.length,tier:profile.membershipTier},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  return (
    <DashboardTabs
      locale={locale}
      profile={profile}
      activeTab={activeTab}
      visibleTabs={visibleTabs}
    />
  );
}
