import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import type { CurrentMemberProfileDto } from '@kclub/contracts';
import { Badge, EmptyState, Surface, cn, linkClasses } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import type { ImplementedMemberDashboardTab } from '@/features/member/dashboard-tabs';
import { CardPanel } from './CardPanel';

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            {t('eyebrow')}
          </p>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
            {t('title', { name: profile.displayName ?? profile.phone })}
          </h1>
        </div>
        <Badge variant={profile.membershipTier === 'VIP' ? 'success' : 'outline'}>
          {profile.membershipTier}
        </Badge>
      </div>

      <nav aria-label={t('tabsLabel')} className="overflow-x-auto">
        <div className="flex min-w-max gap-2 border-b border-zinc-200 dark:border-zinc-800">
          {visibleTabs.map((tab) => (
            <Link
              key={tab}
              href={`/${locale}/m/dashboard?tab=${tab}`}
              className={cn(
                'border-b-2 px-3 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-zinc-50 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-900',
                activeTab === tab
                  ? 'border-zinc-950 text-zinc-950 dark:border-zinc-50 dark:text-zinc-50'
                  : 'border-transparent text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50',
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
    <Surface className="max-w-none space-y-4">
      <div>
        <h2 className="text-xl font-medium text-zinc-950 dark:text-zinc-50">{t('title')}</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
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
    <Surface className="max-w-none">
      <h2 className="text-xl font-medium text-zinc-950 dark:text-zinc-50">{t('title')}</h2>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
            <dt className="text-xs uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
              {label}
            </dt>
            <dd className="mt-2 text-sm text-zinc-950 dark:text-zinc-50">{value}</dd>
          </div>
        ))}
      </dl>
    </Surface>
  );
}
