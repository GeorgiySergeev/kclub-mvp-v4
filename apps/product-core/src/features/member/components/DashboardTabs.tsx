import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import type { CurrentMemberProfileDto } from '@kclub/contracts';
import { Badge, cn } from '@kclub/ui';


import type { Locale } from '@/i18n/routing';
import type { ImplementedMemberDashboardTab } from '@/features/member/dashboard-tabs';
import { getPublicBusinesses } from '@/server/services/business-service';
import { CardPanel } from './CardPanel';
import { BusinessPanel } from './BusinessPanel';
import { IntroductionsPanel } from './IntroductionsPanel';
import { Breadcrumbs } from './Breadcrumbs';
import { SubscriptionUpgradePanel } from './SubscriptionUpgradePanel';
import { ProfileEditPanel } from './ProfileEditPanel';

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

  const breadcrumbItems = [
    { label: t('breadcrumbs.dashboard'), href: `/${locale}/m/dashboard` },
    { label: t(`breadcrumbs.${activeTab}`) },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs homeHref={`/${locale}`} items={breadcrumbItems} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kclub-section-label">{t('eyebrow')}</p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white sm:text-4xl">
            {t('title', { name: profile.displayName ?? profile.phone })}
          </h1>
        </div>
        <Badge variant={profile.membershipTier === 'VIP' ? 'success' : 'outline'}>
          {profile.membershipTier}
        </Badge>
      </div>

      <nav aria-label={t('tabsLabel')} className="overflow-x-auto">
        <div className="flex min-w-max gap-2 border-b border-zinc-200 dark:border-white/10">
          {visibleTabs.map((tab) => (
            <Link
              key={tab}
              href={`/${locale}/m/dashboard?tab=${tab}`}
              className={cn(
                'border-b-2 px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-focus dark:focus-visible:ring-offset-focus',
                activeTab === tab
                  ? 'border-accent text-zinc-950 dark:text-white'
                  : 'dark:text-white/48 border-transparent text-zinc-500 hover:text-zinc-950 dark:hover:text-white',
              )}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {t(`tabs.${tab}`)}
            </Link>
          ))}
        </div>
      </nav>

      {activeTab === 'card' && (
        <CardPanel locale={locale} memberName={profile.displayName ?? profile.phone} />
      )}
      {activeTab === 'subscription' && (
        <SubscriptionUpgradePanel locale={locale} profile={profile} />
      )}
      {activeTab === 'business' && <BusinessPanel locale={locale} profile={profile} />}
      {activeTab === 'introductions' && (
        <IntroductionsPanel
          locale={locale}
          profile={profile}
          serverPublicBusinesses={publicBusinesses}
        />
      )}
      {activeTab === 'profile' && <ProfileEditPanel locale={locale} profile={profile} />}
    </div>
  );
}


