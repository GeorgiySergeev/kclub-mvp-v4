import { getTranslations } from 'next-intl/server';

import { Surface, textMuted } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import { requireCurrentMember } from '@/server/member-page';
import { OnboardingForm } from '@/features/member/components/OnboardingForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'member.onboarding' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function OnboardingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const profile = await requireCurrentMember(locale);
  const t = await getTranslations({ locale, namespace: 'member.onboarding' });

  return (
    <div className="mx-auto w-full max-w-xl">
      <Surface className="max-w-none">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            {t('eyebrow')}
          </p>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
            {t('title')}
          </h1>
          <p className={`mt-3 ${textMuted}`}>{t('description')}</p>
        </div>
        <OnboardingForm locale={locale} profile={profile} />
      </Surface>
    </div>
  );
}
