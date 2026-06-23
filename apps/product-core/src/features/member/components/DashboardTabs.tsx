import { getTranslations } from 'next-intl/server';

import type { CurrentMemberProfileDto } from '@kclub/contracts';
import { cn } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import type { ImplementedMemberDashboardTab } from '@/features/member/dashboard-tabs';
import { isDashboardTabLocked } from '@/features/member/dashboard-tabs';
import { getPublicBusinesses } from '@/server/services/business-service';
import { CabinetLockedPanel } from '@/features/member/components/cabinet/CabinetLockedPanel';
import { MemberCabinetShell } from '@/features/member/components/cabinet/MemberCabinetShell';
import { cabinetContentClasses } from '@/features/member/components/cabinet/styles';

import { AccountPanel } from './AccountPanel';
import { BusinessPanel } from './BusinessPanel';
import { IntroductionsPanel } from './IntroductionsPanel';
import { SettingsPanel } from './SettingsPanel';
import { SubscriptionUpgradePanel } from './SubscriptionUpgradePanel';

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

  const tabLabels = {
    account: t('tabs.account'),
    subscription: t('tabs.subscription'),
    introductions: t('tabs.introductions'),
    business: t('tabs.business'),
    settings: t('tabs.settings'),
  } as const;

  const lockLabels = {
    VIP: t('locks.vip'),
    BIZ: t('locks.biz'),
  } as const;

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
      lockLabels={lockLabels}
    >
      {activeTab === 'account' ? <AccountPanel locale={locale} profile={profile} /> : null}

      {activeTab === 'subscription' ? (
        <SubscriptionUpgradePanel locale={locale} profile={profile} />
      ) : null}

      {activeTab === 'introductions' ? (
        isDashboardTabLocked(profile, 'introductions') ? (
          <div className={cabinetContentClasses}>
            <CabinetLockedPanel
              locale={locale}
              eyebrow={t('introductionsLocked.eyebrow')}
              title={t('introductionsLocked.title')}
              description={t('introductionsLocked.description')}
              ctaLabel={t('introductionsLocked.cta')}
            />
          </div>
        ) : (
          <IntroductionsPanel
            locale={locale}
            profile={profile}
            serverPublicBusinesses={publicBusinesses}
          />
        )
      ) : null}

      {activeTab === 'business' ? (
        isDashboardTabLocked(profile, 'business') ? (
          <div className={cabinetContentClasses}>
            <CabinetLockedPanel
              locale={locale}
              eyebrow={t('businessLocked.eyebrow')}
              title={t('businessLocked.title')}
              description={t('businessLocked.description')}
              ctaLabel={t('businessLocked.cta')}
            />
          </div>
        ) : (
          <BusinessPanel locale={locale} profile={profile} />
        )
      ) : null}

      {activeTab === 'settings' ? <SettingsPanel locale={locale} profile={profile} /> : null}
    </MemberCabinetShell>
  );
}
