import Link from 'next/link';

import { getTranslations } from 'next-intl/server';

import type {
  CurrentMemberProfileDto,
  PublicBusinessListItemDto,
  SubscriptionStatus,
} from '@kclub/contracts';

import { Badge, cn } from '@kclub/ui';


import type { Locale } from '@/i18n/routing';

import type { ImplementedMemberDashboardTab } from '@/features/member/dashboard-tabs';

import { getPublicBusinesses } from '@/server/services/business-service';

import { MemberCabinetShell } from './cabinet/MemberCabinetShell';

import { MemberInfoTile, MemberPanel, MemberPanelHeader } from './cabinet/MemberPanel';

import { memberActionButtonClasses } from './cabinet/styles';

import { getPrismaClient } from '@/server/db';

import { CardPanel } from './CardPanel';

import { BusinessPanel } from './BusinessPanel';

import { IntroductionsPanel } from './IntroductionsPanel';



type DashboardTabsProps = {

  locale: Locale;

  profile: CurrentMemberProfileDto;

  activeTab: ImplementedMemberDashboardTab;

  visibleTabs: readonly ImplementedMemberDashboardTab[];

};



export async function DashboardTabs({

  locale,

  profile,

  activeTab,

  visibleTabs,

}: DashboardTabsProps) {

  const t = await getTranslations({ locale, namespace: 'member.dashboard' });

  const publicBusinesses = activeTab === 'introductions' ? await getPublicBusinesses() : [];

  const tabLabels = Object.fromEntries(

    visibleTabs.map((tab) => [tab, t(`tabs.${tab}`)]),

  ) as Record<ImplementedMemberDashboardTab, string>;



  return (

    <MemberCabinetShell

      locale={locale}

      profile={profile}

      activeTab={activeTab}

      visibleTabs={visibleTabs}

      tabLabels={tabLabels}

      sidebarEyebrow={t('eyebrow')}

      tabsAriaLabel={t('tabsLabel')}

    >

      {activeTab === 'card' && <CardPanel locale={locale} />}

      {activeTab === 'catalog' && <CatalogPanel locale={locale} />}

      {activeTab === 'subscription' && <SubscriptionPanel locale={locale} profile={profile} />}

      {activeTab === 'business' && <BusinessPanel locale={locale} profile={profile} />}

      {activeTab === 'introductions' && (

        <IntroductionsPanel

          locale={locale}

          profile={profile}

          serverPublicBusinesses={publicBusinesses}

        />

      )}

      {activeTab === 'profile' && <ProfilePanel locale={locale} profile={profile} />}

    </MemberCabinetShell>

  );

}



async function CatalogPanel({ locale }: { locale: Locale }) {

  const t = await getTranslations({ locale, namespace: 'member.dashboard.catalog' });



  return (

    <MemberPanel>

      <MemberPanelHeader title={t('title')} description={t('description')} />

      <Link href={`/${locale}/directory`} className={memberActionButtonClasses}>

        {t('action')}

      </Link>

    </MemberPanel>

  );

}



async function SubscriptionPanel({
  locale,
  profile,
}: {
  locale: Locale;
  profile: CurrentMemberProfileDto;
}) {
  const t = await getTranslations({ locale, namespace: 'member.dashboard.subscription' });
  const prisma = getPrismaClient();

  const latestSub = await prisma.vipSubscription.findFirst({
    where: { user_id: profile.id },
    orderBy: { created_at: 'desc' },
  });

  const status: SubscriptionStatus = latestSub?.status ?? 'NONE';
  const isVip = profile.membershipTier === 'VIP';
  const statusLabelKey: Record<SubscriptionStatus, string> = {
    NONE: 'statusNone',
    ACTIVE: 'statusActive',
    PAST_DUE: 'statusPastDue',
    CANCELED: 'statusCanceled',
    EXPIRED: 'statusExpired',
  };
  const isActive = status === 'ACTIVE' || status === 'CANCELED' || status === 'PAST_DUE';

  return (
    <MemberPanel>
      <MemberPanelHeader
        title={t('title')}
        description={t(isVip ? 'vipDescription' : 'memberDescription')}
      />

      <div
        className={cn(
          'flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between',
          isActive
            ? 'border-amber-200/60 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-950/20'
            : 'border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50',
        )}
      >
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
            {t('title')}
          </p>
          <p className="text-lg font-medium text-zinc-950 dark:text-zinc-50">
            {profile.membershipTier}
          </p>
          {status !== 'NONE' && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t(statusLabelKey[status])}
            </p>
          )}
          {latestSub?.cancel_at_period_end && status === 'ACTIVE' && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {t('cancelAtPeriodEnd')}
            </p>
          )}
          {latestSub?.current_period_end && (
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              {t('renewalDate', {
                date: latestSub.current_period_end.toLocaleDateString(locale),
              })}
            </p>
          )}
        </div>
        <Badge
          variant={isActive ? 'success' : 'outline'}
          className="self-start sm:self-auto"
        >
          {status !== 'NONE' ? t(statusLabelKey[status]) : profile.membershipTier}
        </Badge>
      </div>
    </MemberPanel>
  );
}


async function ProfilePanel({

  locale,

  profile,

}: {

  locale: Locale;

  profile: CurrentMemberProfileDto;

}) {

  const t = await getTranslations({ locale, namespace: 'member.dashboard.profile' });

  const rows = [

    [t('phone'), profile.phone],

    [t('displayName'), profile.displayName ?? t('notSet')],

    [t('locale'), profile.localePreference ?? t('notSet')],

    [t('joined'), new Date(profile.createdAt).toLocaleDateString(locale)],

  ] as const;



  return (

    <MemberPanel>

      <MemberPanelHeader title={t('title')} />

      <dl className="grid gap-3 sm:grid-cols-2">

        {rows.map(([label, value]) => (

          <MemberInfoTile key={label} label={label} value={value} />

        ))}

      </dl>

    </MemberPanel>

  );

}


