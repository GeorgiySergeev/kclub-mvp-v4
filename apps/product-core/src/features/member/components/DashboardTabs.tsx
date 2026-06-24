import { getTranslations } from 'next-intl/server';

import type { CurrentMemberProfileDto, PublicBusinessListItemDto, UserContext } from '@kclub/contracts';

import type { Locale } from '@/i18n/routing';
import type { ImplementedMemberDashboardTab } from '@/features/member/dashboard-tabs';
import { MemberCabinetShell } from '@/features/member/components/cabinet/MemberCabinetShell';

import { AccountPanel } from './AccountPanel';
import { BusinessPanel } from './BusinessPanel';
import { IntroductionsPanel } from './IntroductionsPanel';
import { CardPanel } from './CardPanel';
import { PermissionsPanel } from './PermissionsPanel';
import { AuditPanel } from './AuditPanel';
import { SettingsPanel } from './SettingsPanel';
import { SubscriptionUpgradePanel } from './SubscriptionUpgradePanel';

type DashboardTabsProps = {
  locale: Locale;
  profile: CurrentMemberProfileDto;
  userContext: UserContext;
  activeTab: ImplementedMemberDashboardTab;
  visibleTabs: readonly ImplementedMemberDashboardTab[];
  serverPublicBusinesses: PublicBusinessListItemDto[];
};

export async function DashboardTabs({
  locale,
  profile,
  userContext,
  activeTab,
  visibleTabs,
  serverPublicBusinesses,
}: DashboardTabsProps) {
  const t = await getTranslations({ locale, namespace: 'member.dashboard' });

  const tabLabels: Record<ImplementedMemberDashboardTab, string> = {
    details: t('tabs.details'),
    card: t('tabs.card'),
    subscription: t('tabs.subscription'),
    business: t('tabs.business'),
    introductions: t('tabs.introductions'),
    audit: t('tabs.audit'),
    permissions: t('tabs.permissions'),
    settings: t('tabs.settings'),
  };

  const memberName = profile.displayName ?? profile.phone;

  return (
    <MemberCabinetShell
      locale={locale}
      profile={profile}
      activeTab={activeTab}
      visibleTabs={visibleTabs}
      tabLabels={tabLabels}
      pageTitle={t(`tabs.${activeTab}`)}
      contactLine={profile.phone}
      tabsAriaLabel={t('tabsLabel')}
    >
      {activeTab === 'details' ? <AccountPanel locale={locale} profile={profile} /> : null}

      {activeTab === 'card' ? (
        <CardPanel locale={locale} memberName={memberName} />
      ) : null}

      {activeTab === 'subscription' ? (
        <SubscriptionUpgradePanel locale={locale} profile={profile} />
      ) : null}

      {activeTab === 'business' ? <BusinessPanel locale={locale} profile={profile} /> : null}

      {activeTab === 'introductions' ? (
        <IntroductionsPanel locale={locale} profile={profile} serverPublicBusinesses={serverPublicBusinesses} />
      ) : null}

      {activeTab === 'audit' ? <AuditPanel locale={locale} /> : null}

      {activeTab === 'permissions' ? (
        <PermissionsPanel locale={locale} userContext={userContext} />
      ) : null}

      {activeTab === 'settings' ? <SettingsPanel locale={locale} profile={profile} /> : null}
    </MemberCabinetShell>
  );
}
