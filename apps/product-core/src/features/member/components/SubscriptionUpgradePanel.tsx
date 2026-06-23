import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Check } from 'lucide-react';

import type { CurrentMemberProfileDto } from '@kclub/contracts';
import { Badge, Surface } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import { getOwnSubscriptions } from '@/server/services/subscription-service';
import { UpgradeToVipButton } from './UpgradeToVipButton';

type Props = {
  locale: Locale;
  profile: CurrentMemberProfileDto;
};

export async function SubscriptionUpgradePanel({ locale, profile }: Props) {
  const t = await getTranslations({ locale, namespace: 'member.dashboard.subscription' });

  const subscriptions =
    profile.membershipTier === 'VIP' ? await getOwnSubscriptions(profile.id) : [];

  const activeSubscription = subscriptions.find(
    (s) => s.status === 'ACTIVE' || s.status === 'PAST_DUE',
  );

  const vipFeatures = [t('vipFeature1'), t('vipFeature2'), t('vipFeature3'), t('vipFeature4')];
  const businessFeatures = [
    t('businessFeature1'),
    t('businessFeature2'),
    t('businessFeature3'),
    t('businessFeature4'),
  ];

  return (
    <Surface className="kclub-panel max-w-none space-y-8 rounded-none px-6 py-6 shadow-none ring-0">
      <h2 className="text-xl font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
        {t('title')}
      </h2>

      {/* Current plan */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-white/48">
          {t('currentPlan')}
        </p>
        <div className="kclub-panel-soft flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.04em] text-zinc-950 dark:text-white">
              {profile.membershipTier}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-white/56">
              {profile.membershipTier === 'VIP' ? t('vipDescription') : t('memberDescription')}
            </p>
          </div>
          <Badge variant={profile.membershipTier === 'VIP' ? 'success' : 'outline'}>
            {profile.membershipTier === 'VIP' ? t('statusActive') : 'FREE'}
          </Badge>
        </div>

        {activeSubscription && (
          <div className="mt-3 space-y-1 text-xs text-zinc-500 dark:text-white/48">
            {activeSubscription.currentPeriodEnd && (
              <p>
                {t('renewalDate', {
                  date: new Date(activeSubscription.currentPeriodEnd).toLocaleDateString(locale),
                })}
              </p>
            )}
            {activeSubscription.status === 'PAST_DUE' && (
              <p className="text-amber-600 dark:text-amber-400">{t('statusPastDue')}</p>
            )}
          </div>
        )}
      </div>

      {/* Upgrade cards — MEMBER tier only */}
      {profile.membershipTier === 'MEMBER' && (
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-white/48">
            {t('upgradeTitle')}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* VIP plan card */}
            <div className="kclub-panel-soft flex flex-col gap-5 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  VIP
                </p>
                <div className="mt-2 flex items-baseline gap-0.5">
                  <span className="text-2xl font-black text-zinc-950 dark:text-white">
                    {t('vipPrice')}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-white/48">{t('vipPeriod')}</span>
                </div>
              </div>
              <ul className="flex-1 space-y-2.5">
                {vipFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-zinc-600 dark:text-white/66"
                  >
                    <Check size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <UpgradeToVipButton locale={locale} />
            </div>

            {/* Business plan card */}
            <div className="kclub-panel-soft flex flex-col gap-5 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-white/40">
                  BUSINESS
                </p>
                <div className="mt-2">
                  <span className="text-2xl font-black text-zinc-950 dark:text-white">
                    {t('businessPrice')}
                  </span>
                </div>
              </div>
              <ul className="flex-1 space-y-2.5">
                {businessFeatures.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-zinc-600 dark:text-white/66"
                  >
                    <Check size={12} className="mt-0.5 shrink-0 text-zinc-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/m/business/onboarding`}
                className="inline-flex w-full items-center justify-center rounded-none border border-zinc-300 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-950 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white dark:border-white/20 dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {t('businessCta')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* VIP active confirmation */}
      {profile.membershipTier === 'VIP' && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{t('alreadyVip')}</p>
      )}
    </Surface>
  );
}
