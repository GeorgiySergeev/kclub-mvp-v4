import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import type { CurrentMemberProfileDto, PublicBusinessListItemDto } from '@kclub/contracts';
import { Badge, EmptyState, Surface, cn, linkClasses } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import type { ImplementedMemberDashboardTab } from '@/features/member/dashboard-tabs';
import { getPublicBusinesses } from '@/server/services/business-service';
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

  return (
    <div className="space-y-8">
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
                'border-b-2 px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#09090b]',
                activeTab === tab
                  ? 'border-[#ff0030] text-zinc-950 dark:text-white'
                  : 'dark:text-white/48 border-transparent text-zinc-500 hover:text-zinc-950 dark:hover:text-white',
              )}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {t(`tabs.${tab}`)}
            </Link>
          ))}
        </div>
      </nav>

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
    </div>
  );
}

async function CatalogPanel({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'member.dashboard.catalog' });

  return (
    <EmptyState
      title={t('title')}
      description={t('description')}
      action={
        <Link href={`/${locale}/directory`} className={linkClasses}>
          {t('action')}
        </Link>
      }
    />
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

  return (
    <Surface className="kclub-panel max-w-none space-y-4 rounded-none px-6 py-6 shadow-none ring-0">
      <div>
        <h2 className="text-xl font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
          {t('title')}
        </h2>
        <p className="dark:text-white/66 mt-2 text-sm leading-7 text-zinc-600">
          {profile.membershipTier === 'VIP' ? t('vipDescription') : t('memberDescription')}
        </p>
      </div>
      <Badge variant={profile.membershipTier === 'VIP' ? 'success' : 'outline'}>
        {profile.membershipTier}
      </Badge>
    </Surface>
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
  ];

  return (
    <Surface className="kclub-panel max-w-none rounded-none px-6 py-6 shadow-none ring-0">
      <h2 className="text-xl font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
        {t('title')}
      </h2>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="kclub-panel-soft p-4">
            <dt className="dark:text-white/48 text-xs uppercase tracking-[0.14em] text-zinc-500">
              {label}
            </dt>
            <dd className="mt-2 text-sm text-zinc-950 dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </Surface>
  );
}
